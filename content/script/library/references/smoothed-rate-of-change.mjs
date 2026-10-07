/**
 * Reference implementation of the library's Smoothed Rate of Change, for the
 * parity gate, from Fred G. Schutzman's definition: the percentage change over
 * `rocLength` bars of an exponential average of the source. The average is
 * seeded on bar `emaLength - 1` with the simple average of the first values.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-smoothed-rate-of-change",
    name: "Smoothed Rate of Change (SROC)",
    category: "Momentum",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "emaLength", type: "number", label: "Smoothing Length", default: 13, min: 1, step: 1 },
      { key: "rocLength", type: "number", label: "Rate of Change Length", default: 21, min: 1, step: 1 },
    ],
    plots: [{ key: "sroc", type: "line", title: "SROC" }],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.emaLength
      const back = settings.rocLength
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
      const ema = new Array(n).fill(null)
      const alpha = 2 / (len + 1)
      for (let i = len - 1; i < n; i++) {
        if (i === len - 1) {
          let s = 0
          for (let k = 0; k < len; k++) s += src[k]
          ema[i] = s / len
        } else {
          ema[i] = alpha * src[i] + (1 - alpha) * ema[i - 1]
        }
      }
      const sroc = ema.map((e, i) => {
        if (e === null || i < back || ema[i - back] === null) return null
        return (100 * (e - ema[i - back])) / ema[i - back]
      })
      return { sroc }
    },
  })
}
