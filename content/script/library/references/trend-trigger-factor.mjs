/**
 * Reference implementation of the library's Trend Trigger Factor, for the
 * parity gate.
 *
 * Buy power is the highest high of the last `length` bars less the lowest low
 * of the `length` bars before them; sell power is the highest high of the
 * earlier window less the lowest low of the latest one. The factor is their
 * difference as a percentage of their mean.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-trend-trigger-factor",
    name: "Trend Trigger Factor (TTF)",
    category: "Momentum",
    placement: "pane",
    inputs: [{ key: "length", type: "number", label: "Length", default: 15, min: 1, step: 1 }],
    plots: [{ key: "ttf", type: "line", title: "TTF" }],
    levels: [
      { value: 100, title: "Buy Level" },
      { value: 0, title: "Zero" },
      { value: -100, title: "Sell Level" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const window = (pick, better) =>
        bars.map((_, i) => {
          if (i < len - 1) return null
          let v = pick(bars[i])
          for (let k = i - len + 1; k < i; k++) v = better(v, pick(bars[k]))
          return v
        })
      const hh = window((b) => b.high, Math.max)
      const ll = window((b) => b.low, Math.min)
      const ttf = new Array(n).fill(null)
      for (let i = len; i < n; i++) {
        const j = i - len
        if (hh[i] === null || ll[j] === null || hh[j] === null || ll[i] === null) continue
        const buy = hh[i] - ll[j]
        const sell = hh[j] - ll[i]
        const mean = 0.5 * (buy + sell)
        ttf[i] = mean === 0 ? null : (100 * (buy - sell)) / mean
      }
      return { ttf }
    },
  })
}
