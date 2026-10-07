/**
 * Reference implementation of the library's Gopalakrishnan Range Index, for
 * the parity gate. The study is openalgo's own, so this file states the same
 * calculation in plain JavaScript on the chart's indicator contract, and the
 * gate runs both.
 *
 * GAPO = ln(highest high - lowest low over `length` bars) / ln(length). A
 * window with no range has no logarithm and gives no value.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-gopalakrishnan-range-index",
    name: "Gopalakrishnan Range Index (GAPO)",
    category: "Volatility",
    placement: "pane",
    inputs: [{ key: "length", type: "number", label: "Length", default: 5, min: 2, step: 1 }],
    plots: [{ key: "gapo", type: "line", title: "GAPO" }],
    calc(bars, s) {
      const n = bars.length
      const len = s.length
      const gapo = new Array(n).fill(null)
      for (let i = len - 1; i < n; i++) {
        let hh = -Infinity
        let ll = Infinity
        for (let k = i - len + 1; k <= i; k++) {
          hh = Math.max(hh, bars[k].high)
          ll = Math.min(ll, bars[k].low)
        }
        const range = hh - ll
        gapo[i] = range > 0 ? Math.log(range) / Math.log(len) : null
      }
      return { gapo }
    },
  })
}
