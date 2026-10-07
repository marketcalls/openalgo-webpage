"use client"

import { useEffect, useRef, useState } from "react"

/**
 * One library study drawn on BTCUSD hourly candles.
 *
 * The candles are a fixed snapshot (public/script/library/btcusd-1h.json),
 * loaded once and never refreshed, so every visitor sees the same picture the
 * library's parity checks ran on. The study is compiled in the browser by the
 * real OpenScript compiler and handed to the chart through the library's chart
 * adapter: every value drawn is the engine's.
 *
 * The chart, the compiler and the adapter are imported inside the effect, so
 * none of them reaches the Worker bundle.
 */
const BARS_URL = "/script/library/btcusd-1h.json"
const VISIBLE_BARS = 220

let barsPromise = null
function loadBars() {
  barsPromise ??= fetch(BARS_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`The chart data did not load (${r.status}).`)
      return r.json()
    })
    .then((data) => data.bars.map(([time, open, high, low, close, volume]) => ({ time, open, high, low, close, volume })))
    .catch((error) => {
      barsPromise = null
      throw error
    })
  return barsPromise
}

function compile(core, name, text) {
  const file = core.sourceFile(name, text)
  const bag = new core.DiagnosticBag()
  const checked = core.check(file, core.parse(file, bag), bag)
  const { program } = core.emit(file, checked, bag)
  if (bag.hasErrors || program === undefined) return { ok: false, diagnostics: bag.ordered().filter((d) => d.severity !== "warning") }
  return { ok: true, file, program }
}

export default function LibraryChart({ name, source, height = 540 }) {
  const host = useRef(null)
  const widgetRef = useRef(null)
  const studyRef = useRef(null)
  const libsRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [state, setState] = useState({ phase: "loading" })

  // The chart itself: built once, with the candles, and torn down on unmount.
  useEffect(() => {
    let cancelled = false
    let widget
    ;(async () => {
      try {
        const [widgetModule, charts, core, adapter, bars] = await Promise.all([
          import("openalgo-charts/widget"),
          import("openalgo-charts"),
          import("openalgo-script"),
          import("openalgo-script/adapters/charts"),
          loadBars(),
        ])
        if (cancelled || !host.current) return
        widget = widgetModule.createWidget(host.current, {
          symbol: "BTCUSD",
          interval: "1h",
          intervals: ["1h"],
          theme: "dark",
          timezone: "UTC",
          persist: false,
          rail: false,
          topbar: false,
          bottombar: false,
          panels: false,
          typingNavigation: false,
          shortcutsEditor: false,
        })
        widget.series.setData(bars)
        const last = bars.length - 1
        widget.chart.setVisibleLogicalRange({ from: Math.max(0, last - VISIBLE_BARS + 1), to: last + 8 })
        widgetRef.current = widget
        libsRef.current = { charts, core, adapter }
        setReady(true)
      } catch (error) {
        if (!cancelled) setState({ phase: "error", message: error instanceof Error ? error.message : "The chart could not be loaded." })
      }
    })()
    return () => {
      cancelled = true
      studyRef.current = null
      widgetRef.current = null
      widget?.destroy()
    }
  }, [])

  // The study: compiled and added whenever the source changes.
  useEffect(() => {
    if (!ready || !widgetRef.current || !libsRef.current || source === null || source === undefined) return
    const { charts, core, adapter } = libsRef.current
    const widget = widgetRef.current
    try {
      studyRef.current?.remove?.()
    } catch {
      // the previous study was already gone
    }
    studyRef.current = null
    const compiled = compile(core, name, source)
    if (!compiled.ok) {
      const d = compiled.diagnostics[0]
      setState({ phase: "study-error", message: d ? `${d.code} on line ${d.span.line}: ${d.message}` : "The script does not compile." })
      return
    }
    try {
      const descriptor = adapter.descriptorFor(compiled.program, {
        source: compiled.file,
        chartVersion: charts.VERSION,
        category: "OpenScript library",
        instrument: { exchange: "CRYPTO", lotSize: 1, hasVolume: true, currency: "USD" },
      })
      charts.registerIndicator(descriptor)
      const study = widget.chart.addIndicator(descriptor.id)
      studyRef.current = study
      // A study in a pane of its own gets a third of the height, so its
      // lines read as clearly as the candles above it.
      if (study?.paneIndex > 0) {
        widget.chart.setPaneWeight(0, 2)
        widget.chart.setPaneWeight(study.paneIndex, 1)
      }
      setState({ phase: "drawn" })
    } catch (error) {
      setState({ phase: "study-error", message: error instanceof Error ? error.message : "The study could not be drawn." })
    }
  }, [name, source, ready])

  return (
    <div className="osl-chart" style={{ height }}>
      <div ref={host} className="osl-chart-host" />
      {state.phase === "loading" ? <div className="osl-chart-note">Loading the chart</div> : null}
      {state.phase === "error" || state.phase === "study-error" ? (
        <div className="osl-chart-note is-error" role="alert">
          {state.message}
        </div>
      ) : null}
    </div>
  )
}
