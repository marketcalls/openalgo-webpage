/**
 * Reference implementation of the library's Elder AutoEnvelope, for the
 * parity gate, from Alexander Elder's description: a 22-bar exponential
 * average with a channel sized from a standard deviation over the last 100
 * bars, wide enough to hold most recent prices.
 *
 * Elder's prose leaves the deviation's input open. This follows the most
 * widely documented formula for his AutoEnvelope: on each bar take the larger
 * of the high's and the low's distance from the average, as a fraction of the
 * average; take the population standard deviation of that fraction over
 * `lookback` bars; each envelope sits `mult` (2.7 by default) times that
 * deviation, scaled back to price by the average, above and below it. The
 * documented formula also holds the width fixed within each week; here it
 * updates on every bar. The average is seeded on bar `length - 1` with the
 * simple average of the first values.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-elder-autoenvelope",
    name: "Elder AutoEnvelope",
    category: "Bands & Channels",
    placement: "onchart",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Average Length", default: 22, min: 1, step: 1 },
      { key: "lookback", type: "number", label: "Lookback", default: 100, min: 2, step: 1 },
      { key: "mult", type: "number", label: "Deviations", default: 2.7, min: 0.1, step: 0.1 },
    ],
    plots: [
      { key: "upper", type: "line", title: "Upper Envelope" },
      { key: "mid", type: "line", title: "EMA" },
      { key: "lower", type: "line", title: "Lower Envelope" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const lb = settings.lookback
      const pick = (b) => {
        switch (settings.src) {
          case "open": return b.open
          case "high": return b.high
          case "low": return b.low
          case "hl2": return (b.high + b.low) / 2
          case "hlc3": return (b.high + b.low + b.close) / 3
          case "ohlc4": return (b.open + b.high + b.low + b.close) / 4
          default: return b.close
        }
      }
      const src = bars.map(pick)
      const mid = new Array(n).fill(null)
      const alpha = 2 / (len + 1)
      for (let i = len - 1; i < n; i++) {
        if (i === len - 1) {
          let s = 0
          for (let k = 0; k < len; k++) s += src[k]
          mid[i] = s / len
        } else {
          mid[i] = alpha * src[i] + (1 - alpha) * mid[i - 1]
        }
      }
      // The larger extreme distance from the average, as a fraction of it.
      const frac = bars.map((b, i) => {
        if (mid[i] === null) return null
        return Math.max(Math.abs(b.high - mid[i]), Math.abs(b.low - mid[i])) / mid[i]
      })
      const upper = new Array(n).fill(null)
      const lower = new Array(n).fill(null)
      for (let i = lb - 1; i < n; i++) {
        let s = 0
        let ok = true
        for (let k = i - lb + 1; k <= i; k++) {
          if (frac[k] === null) {
            ok = false
            break
          }
          s += frac[k]
        }
        if (!ok) continue
        const mean = s / lb
        let v = 0
        for (let k = i - lb + 1; k <= i; k++) v += (frac[k] - mean) * (frac[k] - mean)
        const w = settings.mult * Math.sqrt(v / lb) * mid[i]
        upper[i] = mid[i] + w
        lower[i] = mid[i] - w
      }
      return { upper, mid, lower }
    },
  })
}
