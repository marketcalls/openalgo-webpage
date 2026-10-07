/**
 * Reference implementation of the library's Standard Error Bands, for the
 * parity gate. Over the last `length` values of the source a least squares
 * line is fitted, with x counting up from the oldest bar. Its value on the
 * current bar is the regression end value; the standard error is the square
 * root of the sum of squared residuals from that line divided by length - 2.
 * Both are smoothed with a simple average over `smooth` bars, and the bands sit
 * `mult` smoothed standard errors above and below the smoothed end value.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-standard-error-bands",
    name: "Standard Error Bands",
    category: "Bands & Channels",
    placement: "onchart",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Regression Length", default: 21, min: 3, step: 1 },
      { key: "smooth", type: "number", label: "Smoothing", default: 3, min: 1, step: 1 },
      { key: "mult", type: "number", label: "Standard Errors", default: 2.0, min: 0.1, step: 0.1 },
    ],
    plots: [
      { key: "upper", type: "line", title: "Upper Band" },
      { key: "middle", type: "line", title: "Middle" },
      { key: "lower", type: "line", title: "Lower Band" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
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
      const endValue = new Array(n).fill(null)
      const stdErr = new Array(n).fill(null)
      for (let i = len - 1; i < n; i++) {
        let sx = 0
        let sy = 0
        let sxy = 0
        let sxx = 0
        for (let x = 0; x < len; x++) {
          const y = src[i - len + 1 + x]
          sx += x
          sy += y
          sxy += x * y
          sxx += x * x
        }
        const slope = (len * sxy - sx * sy) / (len * sxx - sx * sx)
        const intercept = (sy - slope * sx) / len
        let sse = 0
        for (let x = 0; x < len; x++) {
          const r = src[i - len + 1 + x] - (intercept + slope * x)
          sse += r * r
        }
        endValue[i] = intercept + slope * (len - 1)
        stdErr[i] = Math.sqrt(sse / (len - 2))
      }
      const sma = (values, k) =>
        values.map((_, i) => {
          if (i < k - 1) return null
          let s = 0
          for (let j = i - k + 1; j <= i; j++) {
            if (values[j] === null) return null
            s += values[j]
          }
          return s / k
        })
      const middle = sma(endValue, settings.smooth)
      const se = sma(stdErr, settings.smooth)
      const upper = middle.map((m, i) => (m === null || se[i] === null ? null : m + settings.mult * se[i]))
      const lower = middle.map((m, i) => (m === null || se[i] === null ? null : m - settings.mult * se[i]))
      return { upper, middle, lower }
    },
  })
}
