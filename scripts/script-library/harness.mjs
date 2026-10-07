/**
 * The OpenScript library's parity harness.
 *
 * Every library script is a port of a JavaScript chart indicator, and a port is
 * only worth publishing if it computes what the original computed. This module
 * runs both on the same fixed BTCUSD bars and compares them plot by plot:
 *
 * - the original, through its openalgo-charts descriptor (`calc`), with the
 *   same helper object OpenAlgo's /trading hands a custom indicator;
 * - the port, through the real OpenScript compiler and engine.
 *
 * Plots are paired by position: the port declares its plots in the original's
 * order. A bar where both answer must agree within a relative tolerance; a bar
 * where only one answers is a warmup difference and is counted, not hidden.
 */
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { DiagnosticBag, check, emit, load, parse, sourceFile } from "openalgo-script"

const HERE = dirname(fileURLToPath(import.meta.url))
export const ROOT = resolve(HERE, "..", "..")
export const LIBRARY_DIR = join(ROOT, "content", "script", "library")
export const BARS_FILE = join(LIBRARY_DIR, "btcusd-1h.json")

/** The fixed snapshot, as chart bars (time in UTC seconds). */
export function readBars(file = BARS_FILE) {
  const data = JSON.parse(readFileSync(file, "utf8"))
  return data.bars.map(([time, open, high, low, close, volume]) => ({ time, open, high, low, close, volume }))
}

/** Compile one OpenScript text; `ok` follows the bag, never the program. */
export function compileScript(name, text) {
  const file = sourceFile(name, text)
  const bag = new DiagnosticBag()
  const checked = check(file, parse(file, bag), bag)
  const { program } = emit(file, checked, bag)
  const diagnostics = bag.ordered()
  if (bag.hasErrors || program === undefined) return { ok: false, file, diagnostics }
  return { ok: true, file, program, diagnostics }
}

const INSTRUMENT = {
  symbol: "BTCUSD",
  exchange: "CRYPTO",
  interval: "60",
  timezone: "UTC",
  tickSize: 0.01,
  lotSize: 1,
  currency: "USD",
  instrumentType: "currency",
  hasVolume: true,
}

/** Run a compiled program over chart bars; one column per declared plot. */
export function runScript(program, file, bars, settings = undefined) {
  const loaded = load(program, { source: file, settings, host: { instrument: INSTRUMENT, now: bars.at(-1).time * 1000 } })
  if (!loaded.ok) return { ok: false, diagnostic: loaded.diagnostic }
  const engine = loaded.engine
  const run = engine.run(bars.map((b) => ({ time: b.time * 1000, open: b.open, high: b.high, low: b.low, close: b.close, volume: b.volume })))
  if (run.diagnostic) return { ok: false, diagnostic: run.diagnostic }
  const n = bars.length
  // A plot's offset moves where its column is drawn, so the column is read at
  // the bar it is drawn on: that is what a reader of either chart sees.
  const shifted = (channel, offset) => {
    const col = Array.from(engine.column(channel), (v) => (v === null || v === undefined ? null : Number(v)))
    const values = new Array(n).fill(null)
    for (let i = 0; i < n; i++) {
      const from = i - offset
      if (from >= 0 && from < col.length) values[i] = col[from]
    }
    return values
  }
  // A candle plot is four columns; each is compared on its own, under the
  // plot's title and the column's name, as the original's candles are.
  const plots = program.outputs.plots.flatMap((p) => {
    const offset = Number(p.offset ?? 0) || 0
    if (p.ohlc) return ["open", "high", "low", "close"].map((k) => ({ title: `${p.title} ${k}`, values: shifted(k === "close" ? p.channel : p.ohlc[k], offset) }))
    return [{ title: p.title, type: p.type, values: shifted(p.channel, offset) }]
  })
  // Point events: every signal() that fired, every label object, and every
  // mark of a lineWithMarkers plot, which is how a port draws a marker at a
  // price on a past bar (signal() marks only the bar it runs on).
  const points = []
  for (const m of program.outputs.markers ?? []) run.bars.forEach((bar, i) => bar.columns[m.channel] !== null && points.push(bars[i].time))
  for (const p of plots) if (p.type === "lineWithMarkers") p.values.forEach((v, i) => v !== null && points.push(bars[i].time))
  const shapes = {}
  for (const d of engine.drawings()) {
    if (d.kind === "label") points.push(Math.round(anchorTime(d.anchors[0]) / 1000))
    else shapes[d.kind] = (shapes[d.kind] ?? 0) + 1
  }
  const paint = (out) => (out ? run.bars.map((bar) => bar.columns[out.channel] !== null && bar.columns[out.channel] !== undefined) : null)
  return {
    ok: true,
    plots,
    points: points.sort((a, b) => a - b),
    shapes,
    barColors: paint(program.outputs.barColor),
    background: paint(program.outputs.background),
    tables: engine.tables().length,
    outputs: program.outputs,
    inputs: program.inputs,
  }
}

function anchorTime(anchor) {
  if (!anchor) return NaN
  return Number(anchor.time ?? anchor.t ?? anchor[0])
}

let apiPromise
async function chartApi() {
  apiPromise ??= (async () => ({ ...(await import("openalgo-charts")), ...(await import("openalgo-charts/indicators")) }))()
  return apiPromise
}

/** Load an original JavaScript indicator and capture its descriptor. */
export async function loadOriginal(path) {
  const api = await chartApi()
  let descriptor
  const mod = await import(pathToFileURL(resolve(path)).href)
  mod.default({ ...api, registerIndicator: (d) => (descriptor = d) })
  if (!descriptor) throw new Error(`${path} registered no indicator`)
  return descriptor
}

export function defaultsOf(descriptor) {
  const settings = {}
  for (const input of descriptor.inputs ?? []) settings[input.key] = input.default
  return settings
}

/**
 * Run an original's calc with the given settings; one array per plot. The
 * array also carries the original's point events, drawn shapes, bar colours
 * and background, read through the same hooks the chart calls.
 */
export function runOriginal(descriptor, bars, settings = defaultsOf(descriptor)) {
  const ctx = { symbol: "BTCUSD", interval: "1h", timezone: "UTC", tickSize: 0.01, barState: { isConfirmed: true, isRealtime: false } }
  const values = descriptor.calc(bars, settings, new Map(), ctx) ?? {}
  const plots = plotsOf(descriptor, values)
  const args = { bars, values, settings, ctx }
  const call = (hook) => (typeof hook === "function" ? hook(args, ctx) : hook)
  const points = []
  const shapes = {}
  for (const m of call(descriptor.markers) ?? []) points.push(Number(m.time))
  for (const d of call(descriptor.draws) ?? []) {
    if (d.kind === "label") points.push(Number(d.at?.time ?? d.time ?? d.from?.time ?? d.point?.time))
    else shapes[d.kind] = (shapes[d.kind] ?? 0) + 1
  }
  const paint = (hook) => {
    const out = call(hook)
    return Array.isArray(out) ? bars.map((_, i) => out[i] !== null && out[i] !== undefined && out[i] !== "") : null
  }
  plots.points = points.sort((a, b) => a - b)
  plots.shapes = shapes
  plots.barColors = paint(descriptor.barColors)
  plots.background = paint(descriptor.background)
  return plots
}

function plotsOf(descriptor, values) {
  const column = (key) => {
    const raw = values[key]
    const arr = Array.isArray(raw) || ArrayBuffer.isView(raw) ? Array.from(raw) : []
    return arr.map((v) => (v === null || v === undefined || (typeof v === "number" && !Number.isFinite(v)) ? null : typeof v === "object" ? v.value ?? null : Number(v)))
  }
  return (descriptor.plots ?? []).flatMap((p) => {
    const title = p.title ?? p.key
    const hidden = p.style?.visible === false
    // A candlestick plot names its four columns in `ohlc`.
    if (p.ohlc) return ["open", "high", "low", "close"].map((k) => ({ key: `${p.key}.${k}`, title: `${title} ${k}`, hidden, values: column(p.ohlc[k]) }))
    return [{ key: p.key, title, hidden, values: column(p.key) }]
  })
}

/**
 * Compare two runs plot by plot. A value pair agrees when
 * |a - b| <= abs + rel * max(|a|, |b|).
 */
export function comparePlots(original, port, { rel = 1e-6, abs = 1e-9 } = {}) {
  const rows = []
  // Plots pair by title. A hidden original plot only carries data for markers
  // or a table, so a port that draws the same picture without it is complete.
  const used = new Set()
  for (let i = 0; i < original.length; i++) {
    const o = original[i]
    const j = port.findIndex((q, k) => !used.has(k) && q.title === o.title)
    if (j < 0) {
      rows.push({ index: i, title: o.title, missing: "port", ok: o.hidden, hiddenOnly: o.hidden })
      continue
    }
    used.add(j)
    const p = port[j]
    let both = 0
    let onlyOriginal = 0
    let onlyPort = 0
    let bad = 0
    let worst = 0
    let firstBad = -1
    const len = Math.max(o.values.length, p.values.length)
    for (let b = 0; b < len; b++) {
      const a = o.values[b] ?? null
      const c = p.values[b] ?? null
      if (a === null && c === null) continue
      if (a === null) {
        onlyPort++
        continue
      }
      if (c === null) {
        onlyOriginal++
        continue
      }
      both++
      const diff = Math.abs(a - c)
      const scale = Math.max(Math.abs(a), Math.abs(c))
      const r = scale > 0 ? diff / scale : diff
      if (diff > abs + rel * scale) {
        bad++
        if (firstBad < 0) firstBad = b
      }
      if (r > worst) worst = r
    }
    // Agreement on every shared bar, and the shared bars cover the series once
    // both have warmed up: allow at most 5% of the run to differ in presence.
    // A hidden original plot carries data for markers or a table and draws
    // nothing; a port may blank it where nothing is shown, so only the bars the
    // port does draw are held to it.
    const presenceGap = (o.hidden ? 0 : onlyOriginal) + onlyPort
    const ok = bad === 0 && (both > 0 || o.hidden) && presenceGap <= Math.max(5, Math.ceil(len * 0.05))
    const allEmpty = both === 0 && presenceGap === 0
    rows.push({ index: i, title: o.title, portTitle: p.title, both, onlyOriginal, onlyPort, bad, firstBad, worst, ok: ok || allEmpty, allEmpty })
  }
  return rows
}

/** Two sorted lists of event times: how many the other lacks, each way. */
export function compareEvents(original, port) {
  const count = (list) => list.reduce((m, t) => m.set(t, (m.get(t) ?? 0) + 1), new Map())
  const a = count(original)
  const b = count(port)
  let onlyOriginal = 0
  let onlyPort = 0
  const examples = []
  for (const [t, k] of a) {
    const d = k - (b.get(t) ?? 0)
    if (d > 0) {
      onlyOriginal += d
      if (examples.length < 3) examples.push(`original only at ${new Date(t * 1000).toISOString()}`)
    }
  }
  for (const [t, k] of b) {
    const d = k - (a.get(t) ?? 0)
    if (d > 0) {
      onlyPort += d
      if (examples.length < 6) examples.push(`port only at ${new Date(t * 1000).toISOString()}`)
    }
  }
  return { original: original.length, port: port.length, onlyOriginal, onlyPort, ok: onlyOriginal === 0 && onlyPort === 0, examples }
}

/** Per-bar presence of a colour (bar colours or background). */
export function comparePaint(original, port) {
  if (!original && !port) return null
  const a = original ?? []
  const b = port ?? []
  let differ = 0
  let first = -1
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    if (Boolean(a[i]) !== Boolean(b[i])) {
      differ++
      if (first < 0) first = i
    }
  }
  return { original: a.filter(Boolean).length, port: b.filter(Boolean).length, differ, first, ok: differ === 0 }
}
