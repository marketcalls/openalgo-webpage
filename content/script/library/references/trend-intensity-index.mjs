/**
 * Reference implementation of the library's Trend Intensity Index, for the
 * parity gate. Each close is compared with its simple average over `length`
 * bars. Over the last half of that length (rounded down), the positive gaps
 * and the magnitudes of the negative gaps are summed, and the index is the
 * positive share of the total, from 0 to 100. The signal line is an
 * exponential average of the index, seeded with the simple average of its
 * first `signalLength` values.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-trend-intensity-index",
    name: "Trend Intensity Index (TII)",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Length", default: 60, min: 2, step: 1 },
      { key: "signalLength", type: "number", label: "Signal Length", default: 9, min: 1, step: 1 },
    ],
    plots: [
      { key: "tii", type: "line", title: "TII" },
      { key: "signal", type: "line", title: "Signal" },
    ],
    calc(bars, settings) {
      const n = bars.length
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
      const len = settings.length
      const half = Math.floor(len / 2)
      const dev = new Array(n).fill(null)
      for (let i = len - 1; i < n; i++) {
        let s = 0
        for (let k = i - len + 1; k <= i; k++) s += src[k]
        dev[i] = src[i] - s / len
      }
      const tii = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (i - half + 1 < 0) continue
        let pos = 0
        let neg = 0
        let ok = true
        for (let k = i - half + 1; k <= i; k++) {
          if (dev[k] === null) {
            ok = false
            break
          }
          if (dev[k] > 0) pos += dev[k]
          else neg -= dev[k]
        }
        if (ok && pos + neg > 0) tii[i] = (100 * pos) / (pos + neg)
      }
      const emaSeeded = (values, p) => {
        const out = new Array(n).fill(null)
        const a = 2 / (p + 1)
        let e = null
        let sum = 0
        let count = 0
        for (let i = 0; i < n; i++) {
          const v = values[i]
          if (v === null) continue
          if (e === null) {
            sum += v
            count += 1
            if (count === p) e = sum / p
          } else {
            e = v * a + e * (1 - a)
          }
          out[i] = e
        }
        return out
      }
      const signal = emaSeeded(tii, settings.signalLength)
      return { tii, signal }
    },
  })
}
