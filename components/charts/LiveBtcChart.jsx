"use client"

import { useEffect, useRef, useState } from "react"
import { BTC_USD_INTERVALS, BTC_USD_SOURCE, createBtcUsdFeed } from "./btcUsdFeed"

/**
 * The live BTC/USD chart, the page's opening argument.
 *
 * It is the real engine drawing real candles, not a picture of one: a visitor
 * can pan it, change the timeframe, draw on it and add an indicator before
 * deciding whether to read any further.
 *
 * The library is imported inside the effect rather than at module scope. That
 * keeps it out of the server bundle entirely, which matters here because the
 * site deploys to a Cloudflare Worker with a hard script-size ceiling, and a
 * charting engine is not a thing you want counted against it.
 *
 * Every failure has a visible state. The chart is the first thing on the page,
 * so a silent blank box is the worst outcome it can produce: the market feed is
 * a public endpoint on someone else's infrastructure, and it will be down at
 * some point.
 */

/**
 * Candles visible when the chart opens.
 *
 * Loading a long history and showing all of it are different things, and
 * conflating them is how this chart ended up opening on fifteen hundred hair
 * thin candles. The full series stays loaded so the reader can scroll back
 * through it; this is only the window they land on.
 *
 * The chart is the first thing on the page and it has to be readable at a
 * glance on a phone as well as a desktop, so the window is tighter than the
 * five hundred bars the trading terminal repairs a lost viewport to.
 */
const VISIBLE_BARS = 180

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

/**
 * Put the viewport over the most recent candles rather than the whole series.
 *
 * The clear air past the newest candle is what every chart leaves: without it
 * the last bar sits flush against the price axis and reads as cut off.
 */
function showRecent(widget, count) {
  if (count <= 0) return
  const last = count - 1
  const visible = Math.min(VISIBLE_BARS, count)
  widget.chart.setVisibleLogicalRange({
    from: Math.max(0, last - visible + 1),
    to: last + Math.max(1, Math.round(visible * 0.05)),
  })
}

export default function LiveBtcChart() {
  const host = useRef(null)
  const retry = useRef(null)
  const [market, setMarket] = useState({ state: "loading", interval: "1h" })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let widget
    let feed
    let lastInterval
    const unsubscribers = []

    ;(async () => {
      try {
        const [module] = await Promise.all([
          import("openalgo-charts/widget"),
          import("openalgo-charts/indicators"),
        ])
        if (cancelled || !host.current) return

        widget = module.createWidget(host.current, {
          symbol: "BTCUSD",
          interval: "1h",
          intervals: BTC_USD_INTERVALS,
          theme: "dark",
          timezone: "UTC",
          // Nothing is remembered between visits: a first-time reader should
          // always meet the chart the way it was designed, not the way the last
          // person on this browser left it.
          persist: false,
        })

        widget.chart.addIndicator("supertrend", { period: 10, multiplier: 3 })
        const momentum = widget.chart.addIndicator("macd", {
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9,
          macdColor: "#70a4ff",
          signalColor: "#f7b45d",
        })
        widget.chart.setPaneWeight(0, 3)
        widget.chart.setPaneWeight(momentum.paneIndex, 1)

        // The symbol box is left visible but not editable: it shows the engine
        // has one, while this feed can only answer for BTC/USD.
        const symbolInput = widget.root.querySelector('input[aria-label="Symbol"]')
        if (symbolInput) {
          symbolInput.readOnly = true
          symbolInput.setAttribute("aria-label", "Symbol: BTC/USD")
          symbolInput.title = "This chart follows Bitcoin / US Dollar."
        }

        feed = createBtcUsdFeed({
          onBars: (bars, interval) => {
            if (cancelled || !widget) return
            widget.series.setData(bars)
            // Only on the first load of a timeframe. Every later refresh leaves
            // the viewport alone, so a reader who has panned back or zoomed in
            // is not yanked to the right edge every fifteen seconds.
            if (lastInterval !== interval) showRecent(widget, bars.length)
            lastInterval = interval
          },
          onStatus: (status) => {
            if (!cancelled) setMarket(status)
          },
        })
        retry.current = () => feed.refresh()

        unsubscribers.push(
          widget.on("interval", ({ interval }) => {
            widget.series.setData([])
            lastInterval = undefined
            void feed.selectInterval(interval)
          })
        )
        unsubscribers.push(
          widget.on("symbol", ({ symbol }) => {
            if (symbol !== "BTCUSD") widget.setSymbol("BTCUSD")
          })
        )

        setReady(true)
        await feed.selectInterval("1h")
      } catch (error) {
        if (cancelled) return
        setMarket({
          state: "error",
          interval: "1h",
          message: error instanceof Error ? error.message : "The chart could not be loaded.",
        })
      }
    })()

    return () => {
      cancelled = true
      retry.current = null
      for (const unsubscribe of unsubscribers) unsubscribe()
      feed?.destroy()
      widget?.destroy()
    }
  }, [])

  const unavailable = market.state === "error" || market.state === "stale"
  const statusLabel =
    market.state === "loading"
      ? "Connecting to market data"
      : market.state === "stale"
        ? "Disconnected, showing last known data"
        : market.state === "error"
          ? "Market data unavailable"
          : "Real market data"
  const syncTime = market.updatedAt
    ? new Date(market.updatedAt).toLocaleTimeString("en-GB", { hour12: false })
    : null

  return (
    <div className="overflow-hidden rounded-2xl border bg-surface-bright">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="font-bold text-on-surface">
            B
          </span>
          <span className="font-bold text-on-surface">
            Bitcoin <span className="font-medium text-on-surface-variant">/ US Dollar</span>
          </span>
          {market.close !== undefined && (
            <span className="font-label text-label-md text-on-surface">
              {priceFormat.format(market.close)}
            </span>
          )}
        </div>
        <span
          role="status"
          className="flex items-center gap-2 font-label text-label-md text-on-surface-variant"
        >
          <span
            aria-hidden="true"
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              unavailable ? "bg-on-surface-variant" : "bg-on-surface"
            }`}
          />
          {statusLabel}
        </span>
      </div>

      <div className="relative">
        <div ref={host} className="h-[420px] w-full sm:h-[560px] md:h-[640px]" />

        {(!ready || market.state === "loading") && !unavailable && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-on-surface-variant">
            Loading BTC/USD market data
          </div>
        )}

        {market.state === "error" && (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-bright px-6 text-center"
          >
            <strong className="text-on-surface">BTC/USD data is unavailable.</strong>
            <span className="text-sm text-on-surface-variant">
              The public market feed did not answer. Everything else on this page still works.
            </span>
            {ready && (
              <button
                type="button"
                onClick={() => void retry.current?.()}
                className="rounded-full border px-4 py-2 font-label text-label-md text-on-surface transition-colors hover:bg-surface-container"
              >
                Retry connection
              </button>
            )}
          </div>
        )}
      </div>

      {market.state === "stale" && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5"
        >
          <span className="text-sm text-on-surface-variant">
            Connection interrupted. Showing the last received candles.
          </span>
          <button
            type="button"
            onClick={() => void retry.current?.()}
            className="rounded-full border px-3 py-1 font-label text-label-md text-on-surface transition-colors hover:bg-surface-container"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t px-4 py-3 font-label text-label-md text-on-surface-variant">
        <span>Draw an idea. Add an indicator. It is the real engine.</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={BTC_USD_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 transition-colors hover:text-on-surface hover:underline"
          >
            Source: Gemini
          </a>
          <span>Refreshes every 15s</span>
          {syncTime && <span>Synced {syncTime}</span>}
        </span>
      </div>
    </div>
  )
}
