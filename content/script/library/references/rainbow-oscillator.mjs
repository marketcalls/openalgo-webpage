/**
 * Reference implementation of the library's Rainbow Oscillator, for the
 * parity gate. Mel Widner's construction: ten simple averages, each one taken
 * over the one before it (the first over the source), so every layer is a
 * little smoother and a little later than the last.
 *
 * - Oscillator: 100 * (source - mean of the ten averages) / (highest source
 *   over the lookback - lowest source over the lookback).
 * - Upper band: 100 * (highest of the ten averages - lowest of them) over the
 *   same range; the lower band is its negative.
 *
 * A bar whose source range over the lookback is zero has no reading.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-rainbow-oscillator",
    name: "Rainbow Oscillator",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "smoothing", type: "number", label: "Average Length", default: 2, min: 1, step: 1 },
      { key: "lookback", type: "number", label: "High Low Lookback", default: 10, min: 2, step: 1 },
    ],
    plots: [
      { key: "osc", type: "histogram", title: "Rainbow Oscillator" },
      { key: "upper", type: "line", title: "Upper Band" },
      { key: "lower", type: "line", title: "Lower Band" },
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
      // A windowed simple average, absent while any value in the window is.
      const sma = (values, len) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          let s = 0
          for (let k = i - len + 1; k <= i; k++) {
            if (values[k] === null) return null
            s += values[k]
          }
          return s / len
        })
      const layers = []
      let prev = src
      for (let j = 0; j < 10; j++) {
        prev = sma(prev, settings.smoothing)
        layers.push(prev)
      }
      const L = settings.lookback
      const osc = new Array(n).fill(null)
      const upper = new Array(n).fill(null)
      const lower = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (i < L - 1) continue
        let hi = -Infinity
        let lo = Infinity
        for (let k = i - L + 1; k <= i; k++) {
          hi = Math.max(hi, src[k])
          lo = Math.min(lo, src[k])
        }
        const rng = hi - lo
        if (!(rng > 0)) continue
        const vals = layers.map((a) => a[i])
        if (vals.some((v) => v === null)) continue
        const mean = vals.reduce((a, b) => a + b, 0) / 10
        const top = Math.max(...vals)
        const bottom = Math.min(...vals)
        osc[i] = (100 * (src[i] - mean)) / rng
        upper[i] = (100 * (top - bottom)) / rng
        lower[i] = -upper[i]
      }
      return { osc, upper, lower }
    },
  })
}
