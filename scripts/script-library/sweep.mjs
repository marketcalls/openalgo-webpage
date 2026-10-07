#!/usr/bin/env node
/**
 * The library's visual sweep: run every published study the way its page
 * does (with its chartSettings) and flag what would look wrong on the chart,
 * which the parity gate cannot see because it compares a study with its own
 * original, faults included.
 *
 *   node scripts/script-library/sweep.mjs
 *
 * Flags: a study that does not load or stops; duplicate plot titles; lines
 * that share one colour without being a band pair; lines too dark for the
 * dark chart; a price-pane plot far from price (it would flatten the candles);
 * nothing visible in the opening view; and values that blow up (an unstable
 * recurrence in the original). Read each flag; some are by design.
 */
import { readFileSync } from "node:fs"
import { load } from "openalgo-script"

import { compileScript, plotOffset, readBars } from "./harness.mjs"

const DIR = "content/script/library/indicators/"
const pages = JSON.parse(readFileSync("lib/scriptLibraryPages.json", "utf8"))
const bars = readBars()
const n = bars.length
const VIEW = 220

const lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
const findings = []
for (const slug of Object.keys(pages)) {
  const text = readFileSync(`${DIR}${slug}.oscript`, "utf8")
  const c = compileScript(slug, text)
  const out = c.program.outputs
  const page = pages[slug]
  const flags = []
  const loaded = load(c.program, { source: c.file, settings: page.chartSettings ?? undefined, host: { instrument: { symbol: "BTCUSD", exchange: "CRYPTO", interval: "60", timezone: "UTC", tickSize: 0.01, lotSize: 1, currency: "USD", hasVolume: true }, now: bars.at(-1).time * 1000 } })
  if (!loaded.ok) {
    findings.push({ slug, flags: [`does not load: ${loaded.diagnostic.message}`] })
    continue
  }
  const engine = loaded.engine
  const run = engine.run(bars.map((b) => ({ ...b, time: b.time * 1000 })))
  if (run.diagnostic) {
    findings.push({ slug, flags: [`stops: ${run.diagnostic.message}`] })
    continue
  }
  const end = page.viewEndBack ? n - 1 - page.viewEndBack : n - 1
  const from = Math.max(0, end - VIEW + 1)

  // Visible plots (not fully transparent).
  const plots = out.plots.filter((p) => !(Array.isArray(p.color) && p.color[3] === 0))
  const titles = plots.map((p) => p.title)
  const dupTitles = titles.filter((t, i) => titles.indexOf(t) !== i)
  if (dupTitles.length) flags.push(`duplicate plot titles: ${[...new Set(dupTitles)].join(", ")}`)

  // Fixed colours shared by lines that are not a pair of bands.
  const fixed = plots.filter((p) => Array.isArray(p.color) && p.colorChannel == null && !p.ohlc)
  const groups = {}
  for (const p of fixed) (groups[JSON.stringify(p.color.slice(0, 3))] ??= []).push(p.title)
  for (const ts of Object.values(groups)) {
    if (ts.length < 2) continue
    // A pair of levels named high and low for one period (PDH and PDL) shares
    // a colour by design, as the two edges of a band do.
    const highLowPair = ts.length === 2 && ts[0].slice(0, -1) === ts[1].slice(0, -1) && /[HL]$/.test(ts[0]) && /[HL]$/.test(ts[1])
    const isBandPair = highLowPair || ts.every((t) => /upper|lower|top|bottom|high|low|\+|-|r\d|s\d|resistance|support|band|channel|zone|level|ob|os|overbought|oversold/i.test(t))
    if (!isBandPair) flags.push(`one colour for: ${ts.join(" / ")}`)
  }

  // Too dark to see on the dark chart.
  for (const p of fixed) if (p.color[3] > 0.2 && lum(p.color) < 0.12) flags.push(`dark line "${p.title}" rgb(${p.color.slice(0, 3).join(",")})`)

  // Values in view.
  const columns = out.plots.map((p) => {
    const col = Array.from(engine.column(p.channel))
    const off = plotOffset(p, c.program)
    return { p, vals: Array.from({ length: n }, (_, i) => (i - off >= 0 && i - off < n ? col[i - off] : null)) }
  })
  let visible = 0
  const lo = Math.min(...bars.slice(from, end + 1).map((b) => b.low))
  const hi = Math.max(...bars.slice(from, end + 1).map((b) => b.high))
  for (const { p, vals } of columns) {
    if (Array.isArray(p.color) && p.color[3] === 0) continue
    const inView = vals.slice(from, end + 1).filter((v) => typeof v === "number" && Number.isFinite(v))
    visible += inView.length
    // A plot on its own scale (scale = "left") does not share the price axis.
    if (page.pane === "price" && p.overlay !== false && p.scale !== "left" && inView.length) {
      const outside = inView.filter((v) => v < lo - (hi - lo) * 3 || v > hi + (hi - lo) * 3).length
      if (outside > inView.length * 0.5) flags.push(`price-pane plot "${p.title}" sits far from price (e.g. ${inView[0].toFixed(2)} vs ${lo.toFixed(0)}-${hi.toFixed(0)})`)
    }
  }
  const events = (out.markers ?? []).reduce((k, m) => k + run.bars.slice(from, end + 1).filter((b) => b.columns[m.channel] != null).length, 0)
  const drawings = engine.drawings().length
  const paint = [out.barColor, out.background].filter(Boolean).reduce((k, o) => k + run.bars.slice(from, end + 1).filter((b) => b.columns[o.channel] != null).length, 0)
  const tables = engine.tables().length
  if (visible === 0 && events === 0 && drawings === 0 && paint === 0 && tables === 0) flags.push("nothing visible in the opening view")
  else if (visible === 0 && plots.length > 0 && events === 0 && drawings === 0 && paint === 0) flags.push("its plots have no values in the opening view")

  // Values that run away by orders of magnitude.
  for (const { p, vals } of columns) {
    const v = vals.filter((x) => typeof x === "number" && Number.isFinite(x)).map(Math.abs)
    if (v.length < 20) continue
    const sorted = [...v].sort((a, b) => a - b)
    const median = sorted[sorted.length >> 1]
    const max = sorted.at(-1)
    if (max > 1e12 || (median > 0 && max / median > 1e6)) flags.push(`"${p.title}" blows up: median ${median.toExponential(2)}, max ${max.toExponential(2)}`)
  }

  if (flags.length) findings.push({ slug, flags })
}
console.log(`${findings.length} studies flagged of ${Object.keys(pages).length}`)
for (const f of findings) console.log(`${f.slug}\n  ${f.flags.join("\n  ")}`)
