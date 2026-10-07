/**
 * Reference implementation of the library's Volume-Weighted MACD, for the
 * parity gate.
 *
 * The author's definition replaces the two exponential averages of the
 * classic construction with volume-weighted averages: each is the sum of
 * source times volume over its window divided by the sum of volume, absent
 * until the window is full. The line is the fast one minus the slow one, the
 * signal an exponential average of the line (seeded with the simple average
 * of its first `len` present values), and the histogram their gap.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-volume-weighted-macd",
    name: "Volume-Weighted MACD (VW-MACD)",
    category: "Momentum",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "fastLength", type: "number", label: "Fast Length", default: 12, min: 1, step: 1 },
      { key: "slowLength", type: "number", label: "Slow Length", default: 26, min: 1, step: 1 },
      { key: "signalLength", type: "number", label: "Signal Length", default: 9, min: 1, step: 1 },
    ],
    plots: [
      { key: "hist", type: "histogram", title: "Histogram" },
      { key: "macd", type: "line", title: "VW-MACD" },
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
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      const src = bars.map(pick)
      const vol = bars.map((b) => b.volume)
      // Seeded with the simple average of the first `len` present values.
      const ema = (values, len) => {
        const a = 2 / (len + 1)
        const out = new Array(n).fill(null)
        let e = null
        let count = 0
        let sum = 0
        for (let i = 0; i < n; i++) {
          const x = values[i]
          if (na(x)) continue
          if (e === null) {
            sum += x
            count++
            if (count === len) e = sum / len
          } else e = a * x + (1 - a) * e
          out[i] = e
        }
        return out
      }
      // A windowed sum, absent while any value in the window is absent.
      const windowSum = (values, len) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          let s = 0
          for (let k = i - len + 1; k <= i; k++) {
            if (na(values[k])) return null
            s += values[k]
          }
          return s
        })
      const pv = src.map((x, i) => x * vol[i])
      const vwma = (len) => {
        const num = windowSum(pv, len)
        const den = windowSum(vol, len)
        return num.map((s, i) => (na(s) || na(den[i]) || den[i] === 0 ? null : s / den[i]))
      }
      const fast = vwma(settings.fastLength)
      const slow = vwma(settings.slowLength)
      const macd = fast.map((f, i) => (na(f) || na(slow[i]) ? null : f - slow[i]))
      const signal = ema(macd, settings.signalLength)
      const hist = macd.map((m, i) => (na(m) || na(signal[i]) ? null : m - signal[i]))
      return { hist, macd, signal }
    },
  })
}
