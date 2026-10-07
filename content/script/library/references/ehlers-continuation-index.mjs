/**
 * Reference implementation of the library's Ehlers Continuation Index, for
 * the parity gate.
 *
 * Two filters of the source: an UltimateSmoother over half the length, and a
 * Laguerre filter whose first stage is an UltimateSmoother over the full
 * length. Each further Laguerre stage is built from the previous bar's values
 * of the stage below it and of itself; the filter is the plain average of the
 * first `order` stages. Every stage starts at the first source value (rather
 * than at zero) so the filter has no start-up transient.
 *
 * The gap between the two filters is divided by its mean absolute value over
 * `length` bars and doubled, as in the inventor's definition (the mean
 * absolute gap is the scale he uses, though he calls it a variance). An
 * inverse Fisher transform then squeezes the result into -1 to 1. When the
 * scale is zero the previous reading is kept.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-continuation-index",
    name: "Ehlers Continuation Index",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "gama", type: "number", label: "Gamma", default: 0.8, min: 0, max: 0.99, step: 0.01 },
      { key: "order", type: "number", label: "Order", default: 8, min: 1, max: 10, step: 1 },
      { key: "length", type: "number", label: "Length", default: 40, min: 2, step: 1 },
    ],
    plots: [{ key: "ci", type: "line", title: "Continuation Index" }],
    calc(bars, settings) {
      const n = bars.length
      const { gama, order, length } = settings
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

      // The UltimateSmoother: the source passes straight through on the first
      // three bars, then a two-pole recursion with these coefficients.
      const ultimateSmoother = (period) => {
        const a1 = Math.exp((-1.414 * Math.PI) / period)
        const c2 = 2 * a1 * Math.cos((1.414 * Math.PI) / period)
        const c3 = -a1 * a1
        const c1 = (1 + c2 - c3) / 4
        const out = new Array(n).fill(null)
        for (let i = 0; i < n; i++) {
          out[i] =
            i < 3
              ? src[i]
              : (1 - c1) * src[i] + (2 * c1 - c2) * src[i - 1] - (c1 + c3) * src[i - 2] + c2 * out[i - 1] + c3 * out[i - 2]
        }
        return out
      }
      const usHalf = ultimateSmoother(length / 2)
      const usFull = ultimateSmoother(length)

      // Ten Laguerre stages; only the first `order` enter the average.
      const lg = new Array(n).fill(null)
      let prev = null
      for (let i = 0; i < n; i++) {
        const cur = new Array(10)
        cur[0] = usFull[i]
        for (let k = 1; k < 10; k++) cur[k] = prev === null ? usFull[i] : -gama * prev[k - 1] + prev[k - 1] + gama * prev[k]
        let s = 0
        for (let k = 0; k < order; k++) s += cur[k]
        lg[i] = s / order
        prev = cur
      }

      const gap = usHalf.map((u, i) => u - lg[i])
      const ci = new Array(n).fill(null)
      let ref = 0
      for (let i = 0; i < n; i++) {
        if (i < length - 1) continue
        let s = 0
        for (let k = i - length + 1; k <= i; k++) s += Math.abs(gap[k])
        const scale = s / length
        if (scale !== 0) ref = (2 * gap[i]) / scale
        // Inverse Fisher transform, (e^2r - 1) / (e^2r + 1), written so a
        // large reading cannot overflow.
        const t = Math.exp(-2 * Math.abs(ref))
        ci[i] = (Math.sign(ref) * (1 - t)) / (1 + t)
      }
      return { ci }
    },
  })
}
