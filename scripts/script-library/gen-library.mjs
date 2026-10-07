#!/usr/bin/env node
/**
 * Build the OpenScript library at /script/library from its sources.
 *
 *   node scripts/script-library/gen-library.mjs
 *
 * Reads content/script/library/catalog.json and, per slug, the study
 * (indicators/<slug>.oscript) and its page text (indicators/<slug>.json).
 * Writes:
 *
 * - public/script/library/src/<slug>.oscript   the source, fetched by the page
 * - public/script/library/btcusd-1h.json       the fixed bars every chart draws
 * - public/script/library/thumbs/<slug>.svg    the card picture, drawn from a
 *                                              real engine run on those bars
 * - lib/scriptLibraryIndex.json                the cards, for the index page
 * - lib/scriptLibraryPages.json                every page's text, rendered, read
 *                                              by app/script/library/[slug]
 *
 * Sources, thumbnails and bars are static assets: only the page text and the
 * index reach the Worker. A slug whose study does not compile is left out and
 * reported; check.mjs is the gate that fails the build for it.
 */
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import { Marked } from "marked"
import { load } from "openalgo-script"

import { LIBRARY_DIR, ROOT, compileScript, readBars } from "./harness.mjs"

const PORTS = join(LIBRARY_DIR, "indicators")
const PUBLIC = join(ROOT, "public", "script", "library")
const LIB_PAGES = join(ROOT, "lib", "script-library")
const APP = join(ROOT, "app", "script", "library")

const catalog = JSON.parse(readFileSync(join(LIBRARY_DIR, "catalog.json"), "utf8"))
const barsFile = JSON.parse(readFileSync(join(LIBRARY_DIR, "btcusd-1h.json"), "utf8"))
const bars = readBars()

const LICENCE = {
  MIT: { spdx: "MPL-2.0", name: "Mozilla Public License 2.0", url: "https://mozilla.org/MPL/2.0/", original: "MIT License" },
  "MPL-2.0": { spdx: "MPL-2.0", name: "Mozilla Public License 2.0", url: "https://mozilla.org/MPL/2.0/", original: "MPL-2.0" },
  "GPL-3.0": { spdx: "GPL-3.0", name: "GNU General Public License 3.0", url: "https://www.gnu.org/licenses/gpl-3.0.html", original: "GPL-3.0" },
}

function writeIfChanged(file, text) {
  if (existsSync(file) && readFileSync(file, "utf8") === text) return 0
  mkdirSync(join(file, ".."), { recursive: true })
  writeFileSync(file, text)
  return 1
}

const marked = new Marked({ gfm: true, breaks: false })
const md = (text) => (text ? marked.parse(String(text)) : "")
const mdInline = (text) => (text ? marked.parseInline(String(text)) : "")

// ---------------------------------------------------------------------------
// The card picture: the last stretch of bars with the study drawn over it
// ---------------------------------------------------------------------------

// Bump to redraw every picture after a change to the renderer below.
const RENDERER_VERSION = "2"
const W = 640
const H = 360
const SHOWN = 140
const BG = "#0f0f10"
const GRID = "#1d1d20"
const UP = "#26a69a"
const DOWN = "#ef5350"

const rgba = (c, alpha = 1) => {
  if (!c) return null
  const [r, g, b, a] = Array.isArray(c) ? c : [c.r, c.g, c.b, c.a ?? 1]
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${+(a * alpha).toFixed(3)})`
}

function thumbnail(program, run, engine) {
  const n = bars.length
  const from = Math.max(0, n - SHOWN)
  const view = bars.slice(from)
  const isOverlay = programOverlay(program)
  const priceTop = 14
  const priceBottom = isOverlay ? H - 14 : Math.round(H * 0.62)
  const paneTop = priceBottom + 12
  const paneBottom = H - 12
  const x0 = 8
  const x1 = W - 8
  const step = (x1 - x0) / view.length
  const xAt = (i) => x0 + (i - from + 0.5) * step

  const col = (ch) => Array.from(engine.column(ch), (v) => (typeof v === "number" && Number.isFinite(v) ? v : null))
  const plots = program.outputs.plots.map((p) => {
    const raw = col(p.channel)
    const off = Number(p.offset ?? 0) || 0
    const values = new Array(n).fill(null)
    for (let i = 0; i < n; i++) if (i - off >= 0 && i - off < n) values[i] = raw[i - off]
    return { p, values, colours: p.colorChannel !== null && p.colorChannel !== undefined ? run.bars.map((b) => b.columns[p.colorChannel]) : null }
  })

  // Price range: the candles, and any overlay plot that sits near them.
  let lo = Math.min(...view.map((b) => b.low))
  let hi = Math.max(...view.map((b) => b.high))
  const span0 = hi - lo
  if (isOverlay) {
    for (const { values } of plots)
      for (let i = from; i < n; i++) {
        const v = values[i]
        if (v !== null && v > lo - span0 * 0.6 && v < hi + span0 * 0.6) {
          lo = Math.min(lo, v)
          hi = Math.max(hi, v)
        }
      }
  }
  const pad = (hi - lo) * 0.06 || 1
  lo -= pad
  hi += pad
  const yPrice = (v) => priceBottom - ((v - lo) / (hi - lo)) * (priceBottom - priceTop)

  let pLo = Infinity
  let pHi = -Infinity
  if (!isOverlay) {
    for (const { values } of plots)
      for (let i = from; i < n; i++) {
        const v = values[i]
        if (v !== null) {
          pLo = Math.min(pLo, v)
          pHi = Math.max(pHi, v)
        }
      }
    for (const l of program.outputs.levels ?? []) {
      const v = engine.column(l.channel).at(-1)
      if (typeof v === "number" && Number.isFinite(v) && pHi > pLo && v >= pLo - (pHi - pLo) && v <= pHi + (pHi - pLo)) {
        pLo = Math.min(pLo, v)
        pHi = Math.max(pHi, v)
      }
    }
    if (!(pHi > pLo)) {
      pLo = (pLo === Infinity ? 0 : pLo) - 1
      pHi = (pHi === -Infinity ? 0 : pHi) + 1
    }
    const pp = (pHi - pLo) * 0.08
    pLo -= pp
    pHi += pp
  }
  const yPane = (v) => paneBottom - ((v - pLo) / (pHi - pLo)) * (paneBottom - paneTop)
  const yOf = isOverlay ? yPrice : yPane
  const clampY = (y, top, bottom) => Math.max(top - 40, Math.min(bottom + 40, y))

  const out = []
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="none">`)
  out.push(`<rect width="${W}" height="${H}" fill="${BG}"/>`)
  for (let g = 1; g < 6; g++) out.push(`<line x1="0" x2="${W}" y1="${((H * g) / 6).toFixed(1)}" y2="${((H * g) / 6).toFixed(1)}" stroke="${GRID}" stroke-width="1"/>`)
  if (!isOverlay) out.push(`<line x1="0" x2="${W}" y1="${priceBottom + 6}" y2="${priceBottom + 6}" stroke="#2a2a2e" stroke-width="1"/>`)

  // Background shading, behind everything.
  if (program.outputs.background) {
    for (let i = from; i < n; i++) {
      const c = rgba(run.bars[i].columns[program.outputs.background.channel])
      if (c) out.push(`<rect x="${(xAt(i) - step / 2).toFixed(1)}" y="0" width="${step.toFixed(2)}" height="${H}" fill="${c}"/>`)
    }
  }

  // Fills between two plots.
  for (const f of program.outputs.fills ?? []) {
    const a = plots.find((q) => q.p.key === f.between[0])
    const b = plots.find((q) => q.p.key === f.between[1])
    if (!a || !b) continue
    const y = isPaneOf(a.p, isOverlay) ? yOf : yPrice
    let seg = []
    const flush = () => {
      if (seg.length > 1) {
        const top = seg.map(([x, ya]) => `${x.toFixed(1)},${ya.toFixed(1)}`)
        const bottom = seg.map(([x, , yb]) => `${x.toFixed(1)},${yb.toFixed(1)}`).reverse()
        out.push(`<polygon points="${[...top, ...bottom].join(" ")}" fill="${rgba(f.colorUp, f.opacity ?? 1)}"/>`)
      }
      seg = []
    }
    for (let i = from; i < n; i++) {
      const va = a.values[i]
      const vb = b.values[i]
      if (va === null || vb === null) flush()
      else seg.push([xAt(i), y(va), y(vb)])
    }
    flush()
  }

  // Candles, recoloured where the study paints them.
  const w = Math.max(1, step * 0.62)
  for (let i = from; i < n; i++) {
    const b = bars[i]
    const painted = program.outputs.barColor ? rgba(run.bars[i].columns[program.outputs.barColor.channel]) : null
    const c = painted ?? (b.close >= b.open ? UP : DOWN)
    const x = xAt(i)
    const yo = yPrice(b.open)
    const yc = yPrice(b.close)
    out.push(`<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${yPrice(b.high).toFixed(1)}" y2="${yPrice(b.low).toFixed(1)}" stroke="${c}" stroke-width="1"/>`)
    out.push(`<rect x="${(x - w / 2).toFixed(1)}" y="${Math.min(yo, yc).toFixed(1)}" width="${w.toFixed(2)}" height="${Math.max(1, Math.abs(yc - yo)).toFixed(1)}" fill="${c}"/>`)
  }

  // Levels in a pane.
  if (!isOverlay) {
    for (const l of program.outputs.levels ?? []) {
      const v = engine.column(l.channel).at(-1)
      if (typeof v !== "number" || !Number.isFinite(v) || v < pLo || v > pHi) continue
      out.push(`<line x1="0" x2="${W}" y1="${yPane(v).toFixed(1)}" y2="${yPane(v).toFixed(1)}" stroke="${rgba(l.color) ?? "#666"}" stroke-width="1" stroke-dasharray="4 4"/>`)
    }
  }

  // Plots.
  for (const { p, values, colours } of plots) {
    const y = isPaneOf(p, isOverlay) ? yOf : yPrice
    const top = isPaneOf(p, isOverlay) && !isOverlay ? paneTop : priceTop
    const bottom = isPaneOf(p, isOverlay) && !isOverlay ? paneBottom : priceBottom
    const base = rgba(p.color) ?? "#9e9e9e"
    const width = Math.max(1, Math.min(3, Number(p.width) || 1.5))
    if (p.type === "histogram" || p.type === "column") {
      const zero = p.type === "histogram" ? clampY(y(0), top, bottom) : bottom
      for (let i = from; i < n; i++) {
        const v = values[i]
        if (v === null) continue
        const c = (colours && rgba(colours[i])) ?? base
        const yv = clampY(y(v), top, bottom)
        out.push(`<rect x="${(xAt(i) - w / 2).toFixed(1)}" y="${Math.min(yv, zero).toFixed(1)}" width="${w.toFixed(2)}" height="${Math.max(0.5, Math.abs(zero - yv)).toFixed(1)}" fill="${c}"/>`)
      }
      continue
    }
    let path = ""
    let prev = false
    for (let i = from; i < n; i++) {
      const v = values[i]
      if (v === null) {
        prev = false
        continue
      }
      const yv = clampY(y(v), top, bottom)
      if (p.type === "step" && prev) path += `H${xAt(i).toFixed(1)}V${yv.toFixed(1)}`
      else path += `${prev ? "L" : "M"}${xAt(i).toFixed(1)},${yv.toFixed(1)}`
      prev = true
      if (p.type === "lineWithMarkers") out.push(`<circle cx="${xAt(i).toFixed(1)}" cy="${yv.toFixed(1)}" r="2.6" fill="${base}"/>`)
    }
    if (path && p.type !== "lineWithMarkers") out.push(`<path d="${path}" fill="none" stroke="${base}" stroke-width="${width}" stroke-linejoin="round"/>`)
  }

  // Drawings: boxes, lines, polylines and labels in view.
  const t0 = bars[from].time * 1000
  const tAt = (t) => {
    // Bar times are an even hourly grid, so an anchor maps to its bar directly.
    const i = from + (t - t0) / 3600000
    return x0 + (i - from + 0.5) * step
  }
  for (const d of engine.drawings()) {
    const s = d.style ?? {}
    const pts = d.anchors.map((a) => [tAt(Number(a.time)), yPrice(Number(a.price))])
    if (pts.every(([x]) => x < 0 || x > W)) continue
    if (d.kind === "box" && pts.length === 2) {
      const [[ax, ay], [bx, by]] = pts
      // A box's fill carries its own opacity in the style, as the chart draws it.
      const alpha = typeof s.opacity === "number" ? s.opacity : 0.15
      const fill = rgba(s.fillColor ?? s.color, alpha) ?? "rgba(120,120,120,0.15)"
      out.push(`<rect x="${Math.min(ax, bx).toFixed(1)}" y="${Math.min(ay, by).toFixed(1)}" width="${Math.abs(bx - ax).toFixed(1)}" height="${Math.abs(by - ay).toFixed(1)}" fill="${fill}" stroke="${rgba(s.color) ?? "none"}" stroke-width="1"/>`)
    } else if ((d.kind === "line" || d.kind === "polyline") && pts.length >= 2) {
      const dash = s.style === "dashed" ? ' stroke-dasharray="5 4"' : s.style === "dotted" ? ' stroke-dasharray="1.5 3"' : ""
      out.push(`<polyline points="${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="none" stroke="${rgba(s.color) ?? "#9e9e9e"}" stroke-width="${Math.max(1, Number(s.width) || 1)}"${dash}/>`)
    } else if (d.kind === "label" && pts.length) {
      const [[x, y]] = pts
      out.push(`<rect x="${(x - 5).toFixed(1)}" y="${(y - 5).toFixed(1)}" width="10" height="10" rx="2" fill="${rgba(s.color) ?? "#787b86"}"/>`)
    }
  }

  // Markers from signal().
  for (const m of program.outputs.markers ?? []) {
    const c = rgba(m.color) ?? "#9e9e9e"
    for (let i = from; i < n; i++) {
      if (run.bars[i].columns[m.channel] === null || run.bars[i].columns[m.channel] === undefined) continue
      const x = xAt(i)
      const below = m.position === "below"
      const y = m.position === "price" ? yPrice(bars[i].close) : below ? yPrice(bars[i].low) + 9 : yPrice(bars[i].high) - 9
      const up = /Up$/.test(m.shape ?? "") || (below && !/Down$/.test(m.shape ?? ""))
      out.push(
        up
          ? `<polygon points="${x.toFixed(1)},${(y - 4).toFixed(1)} ${(x - 4).toFixed(1)},${(y + 3).toFixed(1)} ${(x + 4).toFixed(1)},${(y + 3).toFixed(1)}" fill="${c}"/>`
          : `<polygon points="${x.toFixed(1)},${(y + 4).toFixed(1)} ${(x - 4).toFixed(1)},${(y - 3).toFixed(1)} ${(x + 4).toFixed(1)},${(y - 3).toFixed(1)}" fill="${c}"/>`,
      )
    }
  }

  out.push("</svg>")
  return out.join("")
}

function programOverlay(program) {
  return program.meta?.overlay === true
}

/**
 * Whether a plot draws in the study's own scale (its pane, or the price pane
 * for an overlay study) rather than forced onto the price pane.
 */
function isPaneOf(p, studyOverlay) {
  if (p.overlay === true) return studyOverlay
  return true
}

// ---------------------------------------------------------------------------
// The pages
// ---------------------------------------------------------------------------

const dateOf = (sec) => new Date(sec * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
const sha = (text) => createHash("sha256").update(text).digest("hex").slice(0, 16)

mkdirSync(join(PUBLIC, "src"), { recursive: true })
mkdirSync(join(PUBLIC, "thumbs"), { recursive: true })

// The chart's bars, as the chart takes them (UTC seconds).
writeIfChanged(join(PUBLIC, "btcusd-1h.json"), JSON.stringify(barsFile))

const index = []
const pages = new Map()
const skipped = []
let changed = 0
let thumbs = 0

// GPL-3.0 ports are not published: strong copyleft raises a combined-work
// question for the site that serves and runs them, and they cannot carry the
// library's MPL-2.0 header. Most have an MIT-derived twin in the library.
const PUBLISHED = (row) => row.licence !== "GPL-3.0"

for (const row of catalog.filter(PUBLISHED)) {
  const srcPath = join(PORTS, `${row.slug}.oscript`)
  const metaPath = join(PORTS, `${row.slug}.json`)
  if (!existsSync(srcPath) || !existsSync(metaPath)) {
    skipped.push(`${row.slug}: not written yet`)
    continue
  }
  const source = readFileSync(srcPath, "utf8").replace(/\r\n/g, "\n")
  let meta
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"))
  } catch (e) {
    skipped.push(`${row.slug}: metadata is not JSON (${e.message})`)
    continue
  }
  const compiled = compileScript(`${row.slug}.oscript`, source)
  if (!compiled.ok) {
    skipped.push(`${row.slug}: does not compile`)
    continue
  }
  const { program } = compiled

  changed += writeIfChanged(join(PUBLIC, "src", `${row.slug}.oscript`), source)

  // The picture is redrawn only when the source or the renderer changes.
  const thumbPath = join(PUBLIC, "thumbs", `${row.slug}.svg`)
  const stamp = `<!-- ${sha(source + RENDERER_VERSION)} -->`
  const existing = existsSync(thumbPath) ? readFileSync(thumbPath, "utf8") : ""
  if (!existing.startsWith(stamp)) {
    const loaded = load(program, {
      source: compiled.file,
      host: {
        instrument: { symbol: "BTCUSD", exchange: "CRYPTO", interval: "60", timezone: "UTC", tickSize: 0.01, lotSize: 1, currency: "USD", hasVolume: true },
        now: bars.at(-1).time * 1000,
      },
    })
    if (loaded.ok) {
      const run = loaded.engine.run(bars.map((b) => ({ ...b, time: b.time * 1000 })))
      if (!run.diagnostic) {
        writeFileSync(thumbPath, stamp + thumbnail(program, run, loaded.engine))
        thumbs++
      }
    }
  }

  const lines = source.replace(/\n+$/, "").split("\n").length
  const labels = Object.fromEntries(program.inputs.map((i) => [i.key, i.label]))
  const licence = LICENCE[row.licence]
  const entry = {
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: meta.summary,
    licence: licence.spdx,
    lines,
    pane: programOverlay(program) ? "price" : "pane",
  }
  index.push(entry)

  const page = {
    ...entry,
    descriptionHtml: md(meta.description),
    howToReadHtml: md(meta.howToRead),
    settings: (meta.settings ?? []).map((s) => ({ key: s.key, label: labels[s.key] ?? s.label ?? s.key, html: mdInline(s.description) })),
    faq: (meta.faq ?? []).map((f) => ({ q: f.q, html: md(f.a) })),
    deviation: meta.deviation ?? null,
    licenceName: licence.name,
    licenceUrl: licence.url,
    credit: `Original work (c) ${row.author}, ${licence.original}`,
    inputs: program.inputs.length,
    plots: program.outputs.plots.length,
    file: `${row.slug}.oscript`,
    interval: "1h",
    dataFrom: dateOf(bars[0].time),
    dataTo: dateOf(bars.at(-1).time),
  }
  pages.set(row.slug, page)
}

// Related studies: the same category, nearest in the catalog's order.
const byCategory = {}
for (const e of index) (byCategory[e.category] ??= []).push(e.slug)
for (const e of index) {
  const peers = byCategory[e.category]
  const at = peers.indexOf(e.slug)
  const related = []
  for (let d = 1; related.length < 3 && d < peers.length; d++) {
    if (peers[at + d]) related.push(peers[at + d])
    if (related.length < 3 && peers[at - d]) related.push(peers[at - d])
  }
  const page = pages.get(e.slug)
  page.related = related.map((slug) => {
    const r = index.find((x) => x.slug === slug)
    return { slug, title: r.title, summary: r.summary, category: r.category }
  })
}

// Every page's text in one file, read by the one route that serves them all,
// app/script/library/[slug]. One route rather than 440 static ones: each
// static route carried its own server bundle and client manifest, about 38 KB,
// which put the Worker over Cloudflare's 64 MiB uncompressed limit.
changed += writeIfChanged(join(ROOT, "lib", "scriptLibraryPages.json"), JSON.stringify(Object.fromEntries(pages)))

// The per-study routes and page files of the earlier layout, removed. Only the
// dynamic [slug] route and the shared files stay in app/script/library.
if (existsSync(APP)) {
  for (const d of readdirSync(APP, { withFileTypes: true })) {
    if (d.isDirectory() && d.name !== "[slug]") {
      rmSync(join(APP, d.name), { recursive: true, force: true })
      changed++
    }
  }
}
if (existsSync(LIB_PAGES)) rmSync(LIB_PAGES, { recursive: true, force: true })

const categories = Object.entries(byCategory)
  .map(([name, slugs]) => ({ name, count: slugs.length }))
  .sort((a, b) => b.count - a.count)
changed += writeIfChanged(
  join(ROOT, "lib", "scriptLibraryIndex.json"),
  JSON.stringify({ dataFrom: dateOf(bars[0].time), dataTo: dateOf(bars.at(-1).time), symbol: barsFile.symbol, interval: barsFile.interval, bars: bars.length, categories, entries: index }),
)

// The sitemap is written by hand; the library owns one marked block in it,
// placed after the /script landing entry the first time.
const SITEMAP = join(ROOT, "public", "sitemap.xml")
if (existsSync(SITEMAP)) {
  const START = "  <!-- script-library:start (written by scripts/script-library/gen-library.mjs) -->"
  const END = "  <!-- script-library:end -->"
  const url = (path, priority) =>
    `  <url>\n    <loc>https://openalgo.in${path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  const block = [START, url("/script/library", "0.8"), ...index.map((e) => url(`/script/library/${e.slug}`, "0.6")), END].join("\n")
  let xml = readFileSync(SITEMAP, "utf8")
  const at = xml.indexOf(START)
  if (at >= 0) xml = xml.slice(0, at) + block + xml.slice(xml.indexOf(END) + END.length)
  else {
    const anchor = "<loc>https://openalgo.in/script</loc>"
    const after = xml.indexOf("</url>", xml.indexOf(anchor)) + "</url>".length
    xml = xml.slice(0, after) + "\n" + block + xml.slice(after)
  }
  changed += writeIfChanged(SITEMAP, xml)
}

console.log(`script library: ${index.length} studies, ${changed} files changed, ${thumbs} thumbnails drawn`)
if (skipped.length) console.log(`  ${skipped.length} left out:\n  ${skipped.slice(0, 20).join("\n  ")}${skipped.length > 20 ? "\n  ..." : ""}`)
