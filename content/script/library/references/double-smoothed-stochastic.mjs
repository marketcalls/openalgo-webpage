/**
 * Reference implementation of the library's Double Smoothed Stochastic, for
 * the parity gate.
 *
 * Walter Bressert's double smoothed stochastic: the position of the close
 * inside the high to low range of the last `length` bars, smoothed by an
 * exponential average, then the position of that smoothed line inside its own
 * range over the same window, smoothed again. Each exponential average is
 * seeded with the simple average of its first `smoothLength` values. A window
 * with no range reads as the midpoint, 50.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-double-smoothed-stochastic",
    name: "Double Smoothed Stochastic (DSS)",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "length", type: "number", label: "Stochastic Length", default: 13, min: 1, step: 1 },
      { key: "smoothLength", type: "number", label: "EMA Length", default: 8, min: 1, step: 1 },
    ],
    plots: [{ key: "dss", type: "line", title: "DSS" }],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const sm = settings.smoothLength
      const na = (v) => v === null || v === undefined || Number.isNaN(v)

      // Highest and lowest over the window, absent while any value is absent.
      const windowed = (values, pick) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          let best = null
          for (let k = i - len + 1; k <= i; k++) {
            if (na(values[k])) return null
            best = best === null ? values[k] : pick(best, values[k])
          }
          return best
        })

      // Exponential average seeded with the simple average of the first
      // `sm` present values; absent until then.
      const ema = (values) => {
        const out = new Array(n).fill(null)
        const alpha = 2 / (sm + 1)
        let e = null
        let sum = 0
        let count = 0
        for (let i = 0; i < n; i++) {
          const x = values[i]
          if (na(x)) continue
          if (e === null) {
            sum += x
            count++
            if (count === sm) e = sum / sm
          } else e = alpha * x + (1 - alpha) * e
          out[i] = e
        }
        return out
      }

      const position = (x, lo, hi) => (na(x) || na(lo) || na(hi) ? null : hi === lo ? 50 : (100 * (x - lo)) / (hi - lo))

      const highs = bars.map((b) => b.high)
      const lows = bars.map((b) => b.low)
      const hh = windowed(highs, Math.max)
      const ll = windowed(lows, Math.min)
      const first = bars.map((b, i) => position(b.close, ll[i], hh[i]))
      const smooth1 = ema(first)
      const hh2 = windowed(smooth1, Math.max)
      const ll2 = windowed(smooth1, Math.min)
      const second = smooth1.map((x, i) => position(x, ll2[i], hh2[i]))
      const dss = ema(second)
      return { dss }
    },
  })
}
