"use client"

import { useEffect, useState } from "react"
import InteractiveChart from "./InteractiveChart"
import { fetchCandlesOnce } from "./btcUsdFeed"

/**
 * The demo cards, drawing real Bitcoin daily candles.
 *
 * They drew a deterministic random walk first. That is the wrong thing to show
 * on this page: a random walk is a meaningless squiggle to anyone who reads
 * charts for a living, and the people this page is written for read charts for
 * a living. A demo that draws a real instrument is also a demo that proves the
 * data path works, not just the renderer.
 *
 * Every card shares one fetch. Four cards each pulling the same daily series
 * would be four requests to a public endpoint for one page view, which is
 * rude at best and rate-limited at worst.
 *
 * Generated bars remain the fallback, so the page still demonstrates the engine
 * when the market endpoint is unreachable. That path is signposted in the card
 * rather than silent: a chart captioned as Bitcoin that is not Bitcoin would be
 * the one dishonest thing on the page.
 */

/** Shared across cards and across mounts: one page view, one request. */
let candlesPromise = null

function loadCandles() {
  if (!candlesPromise) candlesPromise = fetchCandlesOnce("1d")
  return candlesPromise
}

/**
 * Real daily candles, or null while they load and when they cannot be had.
 *
 * `real` distinguishes the two nulls for the caller, so a card can say which
 * data it is drawing rather than quietly relabelling a fallback.
 */
function useBtcDaily() {
  const [state, setState] = useState({ bars: null, real: false, settled: false })

  useEffect(() => {
    let cancelled = false
    void loadCandles().then((bars) => {
      if (cancelled) return
      setState({ bars: bars ?? null, real: Boolean(bars), settled: true })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

/** The label under each card, so the reader always knows what they are looking at. */
function sourceNote(real, settled) {
  if (!settled) return "Loading Bitcoin daily candles"
  return real ? "Bitcoin / US Dollar, daily, from Gemini" : "Generated sample data, market feed unavailable"
}

/** Bars for a build: the real series when there is one, generated otherwise. */
function barsFor(lib, data, count) {
  if (data?.length) return data.slice(-count)
  return lib.generateBars(1700000000, count, 86400)
}

/** Which registered series type each tab selects. */
const TYPE_BY_TAB = {
  candles: "candlestick",
  line: "line",
  bars: "bar",
  area: "area",
  baseline: "baseline",
  step: "step",
}

function buildChartType(el, lib, tab, data) {
  const chart = lib.createChart(el, { theme: lib.darkTheme })
  const bars = barsFor(lib, data, 180)
  const type = TYPE_BY_TAB[tab] ?? "candlestick"
  const style =
    type === "area"
      ? {
          color: "#4f8cff",
          lineWidth: 2,
          areaTopColor: "rgba(79,140,255,0.4)",
          areaBottomColor: "rgba(79,140,255,0)",
        }
      : type === "line" || type === "step"
        ? { color: "#4f8cff", lineWidth: 2 }
        : {}
  chart.addSeries(type, { style }).setData(bars)
  chart.timeScale.fitContent(bars.length)
  return chart
}

export function ChartTypeCard() {
  const { bars, real, settled } = useBtcDaily()
  return (
    <InteractiveChart
      title="Chart type"
      note={sourceNote(real, settled)}
      build={buildChartType}
      data={bars}
      tabs={[
        { label: "Candles", key: "candles" },
        { label: "Line", key: "line" },
        { label: "Bars", key: "bars" },
        { label: "Area", key: "area" },
        { label: "Baseline", key: "baseline" },
        { label: "Step", key: "step" },
      ]}
    />
  )
}

/**
 * A theme drives the chrome and the series defaults together, which is why the
 * candles below are added with no style of their own and still change colour.
 */
function buildTheme(el, lib, tab, data) {
  const colorful = {
    ...lib.darkTheme,
    background: "#0b0710",
    grid: "#1a1030",
    axisText: "#a99bd6",
    axisLine: "#33224d",
    crosshair: "#8b7bb8",
    lineColor: "#8b5cf6",
    areaTopColor: "rgba(139,92,246,0.5)",
    areaBottomColor: "rgba(139,92,246,0)",
    upColor: "#a855f7",
    downColor: "#f472b6",
    wickUpColor: "#a855f7",
    wickDownColor: "#f472b6",
    lastPriceUp: "#8b5cf6",
    lastPriceDown: "#f472b6",
    lastPriceText: "#0b0710",
  }
  const theme = tab === "light" ? lib.lightTheme : tab === "colorful" ? colorful : lib.darkTheme
  const chart = lib.createChart(el, { theme })
  const bars = barsFor(lib, data, 200)
  chart.addSeries("candlestick").setData(bars)
  chart.timeScale.fitContent(bars.length)
  return chart
}

export function ThemeCard() {
  const { bars, real, settled } = useBtcDaily()
  return (
    <InteractiveChart
      title="Custom theme"
      note={sourceNote(real, settled)}
      build={buildTheme}
      data={bars}
      tabs={[
        { label: "Dark", key: "dark" },
        { label: "Light", key: "light" },
        { label: "Colorful", key: "colorful" },
      ]}
    />
  )
}

/**
 * Volume, trade markers and a moving average: the three things almost every
 * chart carries, on the instrument the rest of the page is about.
 *
 * The markers sit on the highest and lowest closes in the window rather than at
 * fixed indices, so they land somewhere meaningful whatever the market has done
 * since this was written.
 */
function buildIndicators(el, lib, tab, data) {
  const chart = lib.createChart(el, { theme: lib.darkTheme })
  const bars = barsFor(lib, data, 150)
  const price = chart.addSeries("candlestick")
  price.setData(bars)

  if (tab === "volume") {
    chart
      .addSeries("histogram", { paneIndex: 1, style: { color: "#3b5168" } })
      .setData(bars.map((bar) => ({ time: bar.time, value: bar.volume, close: bar.volume })))
  } else if (tab === "markers") {
    let low = bars[0]
    let high = bars[0]
    for (const bar of bars) {
      if (bar.close < low.close) low = bar
      if (bar.close > high.close) high = bar
    }
    const markers = [
      {
        time: low.time,
        position: "belowBar",
        shape: "arrowUp",
        size: "medium",
        color: "#26a69a",
        text: "BUY",
      },
      {
        time: high.time,
        position: "aboveBar",
        shape: "arrowDown",
        size: "medium",
        color: "#ef5350",
        text: "SELL",
      },
    ].sort((a, b) => a.time - b.time)
    price.createMarkers().setMarkers(markers)
  } else {
    chart
      .addSeries("line", { style: { color: "#f5a623", lineWidth: 2 } })
      .setData(lib.emaSeries(bars, 21))
  }

  chart.timeScale.fitContent(bars.length)
  return chart
}

export function IndicatorsCard() {
  const { bars, real, settled } = useBtcDaily()
  return (
    <InteractiveChart
      title="Indicators and markers"
      note={sourceNote(real, settled)}
      build={buildIndicators}
      data={bars}
      tabs={[
        { label: "Volume", key: "volume" },
        { label: "Trade markers", key: "markers" },
        { label: "Moving average", key: "ma" },
      ]}
    />
  )
}

/**
 * Labelled price lines at the low, the mean and the high of the window, which
 * is the first annotation most people reach for.
 */
function buildPriceScale(el, lib, _tab, data) {
  const chart = lib.createChart(el, { theme: lib.darkTheme })
  const bars = barsFor(lib, data, 180)
  chart
    .addSeries("area", {
      style: {
        color: "#4f8cff",
        lineWidth: 2,
        areaTopColor: "rgba(79,140,255,0.4)",
        areaBottomColor: "rgba(79,140,255,0)",
      },
    })
    .setData(bars)

  const closes = bars.map((bar) => bar.close)
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const avg = closes.reduce((sum, value) => sum + value, 0) / closes.length

  chart.addPriceLine({ price: max, color: "#26a69a", lineWidth: 1, dashed: true, id: "max", leftLabel: "period high" })
  chart.addPriceLine({ price: avg, color: "#8892a0", lineWidth: 1, dashed: true, id: "avg", leftLabel: "mean close" })
  chart.addPriceLine({ price: min, color: "#ef5350", lineWidth: 1, dashed: true, id: "min", leftLabel: "period low" })
  chart.timeScale.fitContent(bars.length)
  return chart
}

export function PriceScaleCard() {
  const { bars, real, settled } = useBtcDaily()
  return (
    <InteractiveChart
      title="Price lines"
      note={sourceNote(real, settled)}
      build={buildPriceScale}
      data={bars}
    />
  )
}
