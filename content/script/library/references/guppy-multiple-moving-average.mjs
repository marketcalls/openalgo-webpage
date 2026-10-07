/**
 * Reference implementation of the library's Guppy Multiple Moving Average,
 * for the parity gate: twelve exponential averages of the source, a short
 * group (3, 5, 8, 10, 12, 15) and a long group (30, 35, 40, 45, 50, 60). Each
 * average uses the weight 2 / (length + 1) and is seeded on its first full
 * window with the simple average of that window.
 */
const SHORT = [3, 5, 8, 10, 12, 15]
const LONG = [30, 35, 40, 45, 50, 60]

export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-guppy-multiple-moving-average",
    name: "Guppy Multiple Moving Average (GMMA)",
    category: "Moving Averages",
    placement: "onchart",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      ...SHORT.map((d, k) => ({ key: `short${k + 1}`, type: "number", label: `Short Length ${k + 1}`, default: d, min: 1, step: 1 })),
      ...LONG.map((d, k) => ({ key: `long${k + 1}`, type: "number", label: `Long Length ${k + 1}`, default: d, min: 1, step: 1 })),
    ],
    plots: [
      ...SHORT.map((_, k) => ({ key: `s${k + 1}`, type: "line", title: `Short EMA ${k + 1}` })),
      ...LONG.map((_, k) => ({ key: `l${k + 1}`, type: "line", title: `Long EMA ${k + 1}` })),
    ],
    calc(bars, settings) {
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
      const ema = (len) => {
        const alpha = 2 / (len + 1)
        let e = null
        let sum = 0
        return src.map((x, i) => {
          if (i < len - 1) {
            sum += x
            return null
          }
          if (i === len - 1) e = (sum + x) / len
          else e = alpha * x + (1 - alpha) * e
          return e
        })
      }
      const out = {}
      SHORT.forEach((_, k) => (out[`s${k + 1}`] = ema(settings[`short${k + 1}`])))
      LONG.forEach((_, k) => (out[`l${k + 1}`] = ema(settings[`long${k + 1}`])))
      return out
    },
  })
}
