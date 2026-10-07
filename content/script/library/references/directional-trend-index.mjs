/**
 * Reference implementation of the library's Directional Trend Index, for the
 * parity gate. The up move is the rise in the high from the previous bar (zero
 * when it fell), the down move the fall in the low (zero when it rose). Their
 * difference and its magnitude are each smoothed by three exponential
 * averages in a row, and the index is 100 times the ratio of the two.
 *
 * Every exponential average is seeded with the simple average of its first
 * `len` present values, so each stage starts once the one before has given
 * that many values. The first bar has no previous bar and no move.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-directional-trend-index",
    name: "Directional Trend Index (DTI)",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "firstLength", type: "number", label: "First Smoothing", default: 14, min: 1, step: 1 },
      { key: "secondLength", type: "number", label: "Second Smoothing", default: 10, min: 1, step: 1 },
      { key: "thirdLength", type: "number", label: "Third Smoothing", default: 5, min: 1, step: 1 },
    ],
    plots: [{ key: "dti", type: "line", title: "DTI" }],
    calc(bars, settings) {
      const n = bars.length
      const emaSeeded = (values, p) => {
        const out = new Array(n).fill(null)
        const a = 2 / (p + 1)
        let e = null
        let sum = 0
        let count = 0
        for (let i = 0; i < n; i++) {
          const v = values[i]
          if (v === null) continue
          if (e === null) {
            sum += v
            count += 1
            if (count === p) e = sum / p
          } else {
            e = v * a + e * (1 - a)
          }
          out[i] = e
        }
        return out
      }
      const move = bars.map((b, i) => {
        if (i === 0) return null
        const up = b.high - bars[i - 1].high
        const down = bars[i - 1].low - b.low
        return (up > 0 ? up : 0) - (down > 0 ? down : 0)
      })
      const size = move.map((v) => (v === null ? null : Math.abs(v)))
      const triple = (values) =>
        emaSeeded(emaSeeded(emaSeeded(values, settings.firstLength), settings.secondLength), settings.thirdLength)
      const num = triple(move)
      const den = triple(size)
      const dti = num.map((x, i) => (x === null || den[i] === null || den[i] === 0 ? null : (100 * x) / den[i]))
      return { dti }
    },
  })
}
