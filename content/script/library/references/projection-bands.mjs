/**
 * Reference implementation of the library's Projection Bands, for the parity
 * gate. Over the last `length` bars a least squares line is fitted to the
 * highs and another to the lows. Each high in the window is carried forward to
 * the current bar along the slope of the highs, and each low along the slope
 * of the lows; the upper band is the largest carried high and the lower band
 * the smallest carried low. Both are absent until the window is full.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-projection-bands",
    name: "Projection Bands",
    category: "Bands & Channels",
    placement: "onchart",
    inputs: [{ key: "length", type: "number", label: "Length", default: 14, min: 2, step: 1 }],
    plots: [
      { key: "upper", type: "line", title: "Upper Band" },
      { key: "lower", type: "line", title: "Lower Band" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const upper = new Array(n).fill(null)
      const lower = new Array(n).fill(null)
      // Least squares slope per bar of `values` over the window ending at `i`,
      // with x counting up from the oldest bar.
      const slope = (values, i) => {
        let sx = 0
        let sy = 0
        let sxy = 0
        let sxx = 0
        for (let x = 0; x < len; x++) {
          const y = values[i - len + 1 + x]
          sx += x
          sy += y
          sxy += x * y
          sxx += x * x
        }
        return (len * sxy - sx * sy) / (len * sxx - sx * sx)
      }
      const highs = bars.map((b) => b.high)
      const lows = bars.map((b) => b.low)
      for (let i = len - 1; i < n; i++) {
        const sh = slope(highs, i)
        const sl = slope(lows, i)
        let up = -Infinity
        let dn = Infinity
        for (let k = 0; k < len; k++) {
          up = Math.max(up, highs[i - k] + k * sh)
          dn = Math.min(dn, lows[i - k] + k * sl)
        }
        upper[i] = up
        lower[i] = dn
      }
      return { upper, lower }
    },
  })
}
