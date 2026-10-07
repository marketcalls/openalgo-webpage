/**
 * Reference implementation of the library's Smoothed Heikin Ashi, for the
 * parity gate.
 *
 * 1. The bar's open, high, low and close are each smoothed by an exponential
 *    average of `len1` bars.
 * 2. Heikin Ashi candles are built from those smoothed prices: the close is
 *    their mean, the open is the midpoint of the previous candle's open and
 *    close (on the first candle, the midpoint of the smoothed open and close),
 *    and the wicks stretch to cover the open and close.
 * 3. Each of the four candle prices is smoothed again by an exponential
 *    average of `len2` bars, and those are the candles drawn.
 *
 * Every exponential average is seeded with the simple average of its first
 * `len` values and is absent before that.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-smoothed-heikin-ashi",
    name: "Smoothed Heikin Ashi",
    category: "Price",
    placement: "onchart",
    inputs: [
      { key: "len1", type: "number", label: "First Smoothing", default: 10, min: 1, step: 1 },
      { key: "len2", type: "number", label: "Second Smoothing", default: 10, min: 1, step: 1 },
    ],
    plots: [{ key: "sha", type: "candlestick", title: "Smoothed HA", ohlc: { open: "o2", high: "h2", low: "l2", close: "c2" } }],
    calc(bars, settings) {
      const n = bars.length
      // Seeded with the simple average of the first `len` present values.
      const ema = (values, len) => {
        const out = new Array(n).fill(null)
        const a = 2 / (len + 1)
        let count = 0
        let sum = 0
        let e = null
        for (let i = 0; i < n; i++) {
          const v = values[i]
          if (v === null) continue
          if (e === null) {
            count++
            sum += v
            if (count === len) e = sum / len
          } else e = a * v + (1 - a) * e
          out[i] = e
        }
        return out
      }
      const o = ema(bars.map((b) => b.open), settings.len1)
      const h = ema(bars.map((b) => b.high), settings.len1)
      const l = ema(bars.map((b) => b.low), settings.len1)
      const c = ema(bars.map((b) => b.close), settings.len1)
      const haO = new Array(n).fill(null)
      const haC = new Array(n).fill(null)
      const haH = new Array(n).fill(null)
      const haL = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (o[i] === null) continue
        haC[i] = (o[i] + h[i] + l[i] + c[i]) / 4
        haO[i] = i > 0 && haO[i - 1] !== null ? (haO[i - 1] + haC[i - 1]) / 2 : (o[i] + c[i]) / 2
        haH[i] = Math.max(h[i], haO[i], haC[i])
        haL[i] = Math.min(l[i], haO[i], haC[i])
      }
      return {
        o2: ema(haO, settings.len2),
        h2: ema(haH, settings.len2),
        l2: ema(haL, settings.len2),
        c2: ema(haC, settings.len2),
      }
    },
  })
}
