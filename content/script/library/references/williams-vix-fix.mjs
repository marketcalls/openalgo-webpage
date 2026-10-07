/**
 * Reference implementation of the library's Williams VIX Fix, for the parity
 * gate. The study is openalgo's own, so this file states the same calculation
 * in plain JavaScript on the chart's indicator contract, and the gate runs both.
 *
 * WVF = 100 * (highest close of the last `pd` bars - low) / that highest close.
 * The upper band is a simple average of WVF plus `mult` population standard
 * deviations over `bbl` bars; the range high is the highest WVF of the last
 * `lb` bars scaled by `ph`.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-williams-vix-fix",
    name: "Williams VIX Fix",
    category: "Volatility",
    placement: "pane",
    inputs: [
      { key: "pd", type: "number", label: "Lookback Length", default: 22, min: 1, step: 1 },
      { key: "bbl", type: "number", label: "Band Length", default: 20, min: 1, step: 1 },
      { key: "mult", type: "number", label: "Band Deviations", default: 2.0, min: 0.1, max: 10, step: 0.1 },
      { key: "lb", type: "number", label: "Range Lookback", default: 50, min: 1, step: 1 },
      { key: "ph", type: "number", label: "Range High Factor", default: 0.85, min: 0.1, max: 2, step: 0.01 },
      { key: "showLines", type: "boolean", label: "Show Band and Range Lines", default: true },
    ],
    plots: [
      { key: "wvf", type: "histogram", title: "WVF" },
      { key: "upper", type: "line", title: "Upper Band" },
      { key: "rangeHigh", type: "line", title: "Range High" },
    ],
    calc(bars, s) {
      const n = bars.length
      const window = (arr, len, i) => {
        if (i < len - 1) return null
        const w = arr.slice(i - len + 1, i + 1)
        return w.some((v) => v === null) ? null : w
      }
      const wvf = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (i < s.pd - 1) continue
        let hc = -Infinity
        for (let k = i - s.pd + 1; k <= i; k++) hc = Math.max(hc, bars[k].close)
        wvf[i] = (100 * (hc - bars[i].low)) / hc
      }
      const upper = new Array(n).fill(null)
      const rangeHigh = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        const w = window(wvf, s.bbl, i)
        if (w) {
          const mean = w.reduce((a, b) => a + b, 0) / w.length
          const sd = Math.sqrt(w.reduce((a, b) => a + (b - mean) ** 2, 0) / w.length)
          upper[i] = mean + s.mult * sd
        }
        const r = window(wvf, s.lb, i)
        if (r) rangeHigh[i] = Math.max(...r) * s.ph
      }
      return {
        wvf,
        upper: s.showLines ? upper : upper.map(() => null),
        rangeHigh: s.showLines ? rangeHigh : rangeHigh.map(() => null),
      }
    },
  })
}
