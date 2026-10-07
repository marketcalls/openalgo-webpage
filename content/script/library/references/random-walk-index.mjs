/**
 * Reference implementation of the library's Random Walk Index, for the parity
 * gate, following the inventor's definition. For every lookback n from the
 * shortest to the longest, the move from the low (or high) n bars back to
 * this bar's high (or low) is divided by the distance a random walk would
 * cover in n steps: the average true range times the square root of n. The
 * average true range is the simple mean of the true range over the n + 1 bars
 * the move spans (from the bar n back to this one). Each line is the largest
 * of those ratios.
 *
 * The first bar's true range is its high minus its low. Both lines are absent
 * until the longest lookback is complete, and a lookback whose average true
 * range is zero is skipped.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-random-walk-index",
    name: "Random Walk Index (RWI)",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "minLength", type: "number", label: "Shortest Lookback", default: 2, min: 1, step: 1 },
      { key: "length", type: "number", label: "Longest Lookback", default: 14, min: 1, step: 1 },
    ],
    plots: [
      { key: "rwiHigh", type: "line", title: "RWI High" },
      { key: "rwiLow", type: "line", title: "RWI Low" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const minLen = settings.minLength
      const tr = bars.map((b, i) =>
        i === 0 ? b.high - b.low : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close)),
      )
      const rwiHigh = new Array(n).fill(null)
      const rwiLow = new Array(n).fill(null)
      for (let i = len; i < n; i++) {
        let sumTr = tr[i]
        let hi = null
        let lo = null
        for (let j = 1; j <= len; j++) {
          sumTr += tr[i - j]
          if (j < minLen) continue
          const scale = (sumTr / (j + 1)) * Math.sqrt(j)
          if (!(scale > 0)) continue
          const up = (bars[i].high - bars[i - j].low) / scale
          const dn = (bars[i - j].high - bars[i].low) / scale
          hi = hi === null ? up : Math.max(hi, up)
          lo = lo === null ? dn : Math.max(lo, dn)
        }
        rwiHigh[i] = hi
        rwiLow[i] = lo
      }
      return { rwiHigh, rwiLow }
    },
  })
}
