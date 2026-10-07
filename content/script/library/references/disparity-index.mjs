/**
 * Reference implementation of the library's Disparity Index, for the parity
 * gate. The study is openalgo's own, so this file states the same calculation
 * in plain JavaScript on the chart's indicator contract, and the gate runs both.
 *
 * Disparity = 100 * (source - MA) / MA. The exponential and smoothed averages
 * are seeded with the simple average of their first `length` values.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-disparity-index",
    name: "Disparity Index",
    category: "Momentum",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Length", default: 14, min: 1, step: 1 },
      { key: "maType", type: "select", label: "Average Type", default: "EMA", options: ["EMA", "SMA", "WMA", "RMA"].map((v) => ({ value: v, label: v })) },
    ],
    plots: [{ key: "disparity", type: "line", title: "Disparity" }],
    calc(bars, s) {
      const pick = (b) => {
        switch (s.src) {
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
      const n = src.length
      const len = s.length
      const sma = (i) => {
        let sum = 0
        for (let k = i - len + 1; k <= i; k++) sum += src[k]
        return sum / len
      }
      const ma = new Array(n).fill(null)
      if (s.maType === "SMA") {
        for (let i = len - 1; i < n; i++) ma[i] = sma(i)
      } else if (s.maType === "WMA") {
        const denom = (len * (len + 1)) / 2
        for (let i = len - 1; i < n; i++) {
          let sum = 0
          for (let k = 0; k < len; k++) sum += src[i - k] * (len - k)
          ma[i] = sum / denom
        }
      } else {
        const a = s.maType === "RMA" ? 1 / len : 2 / (len + 1)
        for (let i = len - 1; i < n; i++) ma[i] = i === len - 1 ? sma(i) : a * src[i] + (1 - a) * ma[i - 1]
      }
      const disparity = src.map((x, i) => (ma[i] === null || ma[i] === 0 ? null : (100 * (x - ma[i])) / ma[i]))
      return { disparity }
    },
  })
}
