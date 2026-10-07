/**
 * Reference implementation of the library's Absolute Strength Histogram, for
 * the parity gate.
 *
 * Bull and bear strength per bar (by the RSI method, from the bar's change; by
 * the Stochastic method, from the distance to the window's extremes; or by the
 * ADX method, from the rise of the high and the fall of the low), each
 * averaged over `length` bars and then smoothed over `smooth` bars with the
 * chosen average. The histogram is smoothed bulls less smoothed bears.
 *
 * Every average starts on the first bar its input exists, as the study's
 * averages do: the simple, weighted and exponential ones need `len` values,
 * and the exponential and Wilder averages are seeded with a simple average.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-absolute-strength-histogram",
    name: "Absolute Strength Histogram (ASH)",
    category: "Momentum",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "mode", type: "select", label: "Method", default: "RSI", options: ["RSI", "Stochastic", "ADX"].map((v) => ({ label: v, value: v })) },
      { key: "length", type: "number", label: "Length", default: 9, min: 1, step: 1 },
      { key: "smooth", type: "number", label: "Smoothing", default: 3, min: 1, step: 1 },
      { key: "maType", type: "select", label: "Average Type", default: "SMA", options: ["SMA", "EMA", "WMA", "RMA"].map((v) => ({ label: v, value: v })) },
    ],
    plots: [
      { key: "bulls", type: "line", title: "Bulls" },
      { key: "bears", type: "line", title: "Bears" },
      { key: "hist", type: "histogram", title: "Histogram" },
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
      const n = bars.length
      const src = bars.map(pick)
      const len = settings.length

      // An average over the values from the first present one on.
      const average = (values, l, type) => {
        const out = new Array(n).fill(null)
        const start = values.findIndex((v) => v !== null)
        if (start < 0) return out
        let prev = null
        for (let i = start + l - 1; i < n; i++) {
          if (type === "WMA") {
            let num = 0
            for (let k = 0; k < l; k++) num += values[i - k] * (l - k)
            out[i] = num / ((l * (l + 1)) / 2)
          } else if (type === "SMA" || prev === null) {
            let sum = 0
            for (let k = 0; k < l; k++) sum += values[i - k]
            out[i] = sum / l
            prev = out[i]
          } else {
            const alpha = type === "EMA" ? 2 / (l + 1) : 1 / l
            prev = alpha * values[i] + (1 - alpha) * prev
            out[i] = prev
          }
        }
        return out
      }

      const bullsRaw = new Array(n).fill(null)
      const bearsRaw = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (settings.mode === "Stochastic") {
          if (i < len - 1) continue
          let hi = -Infinity
          let lo = Infinity
          for (let k = i - len + 1; k <= i; k++) {
            hi = Math.max(hi, src[k])
            lo = Math.min(lo, src[k])
          }
          bullsRaw[i] = src[i] - lo
          bearsRaw[i] = hi - src[i]
        } else if (settings.mode === "ADX") {
          if (i === 0) continue
          const dh = bars[i].high - bars[i - 1].high
          const dl = bars[i - 1].low - bars[i].low
          bullsRaw[i] = 0.5 * (Math.abs(dh) + dh)
          bearsRaw[i] = 0.5 * (Math.abs(dl) + dl)
        } else {
          if (i === 0) continue
          const d = src[i] - src[i - 1]
          bullsRaw[i] = 0.5 * (Math.abs(d) + d)
          bearsRaw[i] = 0.5 * (Math.abs(d) - d)
        }
      }
      const bulls = average(average(bullsRaw, len, settings.maType), settings.smooth, settings.maType)
      const bears = average(average(bearsRaw, len, settings.maType), settings.smooth, settings.maType)
      const hist = bulls.map((b, i) => (b === null || bears[i] === null ? null : b - bears[i]))
      return { bulls, bears, hist }
    },
  })
}
