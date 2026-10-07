/**
 * Reference implementation of the library's Ehlers Directional Movement with
 * Hann Windowing (DMH), for the parity gate. The study is openalgo's own, so
 * this file states the same calculation in plain JavaScript on the chart's
 * indicator contract, and the gate runs both.
 *
 * Plus and minus directional movement follow Wilder: the larger of the rise
 * in the high and the fall in the low counts, if it is positive, and the
 * other is zero. Their difference is smoothed by an exponential average with
 * alpha 1 / length that starts from zero, as the published definition does,
 * and then by a Hann-windowed average of its last `length` values, weights
 * 1 - cos(2 pi k / (length + 1)) for k = 1 to length, newest first.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-directional-movement-hann",
    name: "Ehlers Directional Movement with Hann Windowing (DMH)",
    category: "Trend Strength",
    placement: "pane",
    inputs: [{ key: "length", type: "number", label: "Length", default: 14, min: 1, step: 1 }],
    plots: [{ key: "dmh", type: "line", title: "DMH" }],
    calc(bars, settings) {
      const n = bars.length
      const L = settings.length
      const sf = 1 / L

      const ema = new Array(n).fill(null)
      let prev = 0
      for (let i = 1; i < n; i++) {
        const upper = bars[i].high - bars[i - 1].high
        const lower = bars[i - 1].low - bars[i].low
        let plusDM = 0
        let minusDM = 0
        if (upper > lower && upper > 0) plusDM = upper
        else if (lower > upper && lower > 0) minusDM = lower
        prev = sf * (plusDM - minusDM) + (1 - sf) * prev
        ema[i] = prev
      }

      const dmh = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (i - (L - 1) < 0 || ema[i - (L - 1)] === null) continue
        let sum = 0
        let coef = 0
        for (let k = 1; k <= L; k++) {
          const w = 1 - Math.cos((2 * Math.PI * k) / (L + 1))
          sum = sum + w * ema[i - (k - 1)]
          coef = coef + w
        }
        dmh[i] = coef !== 0 ? sum / coef : null
      }
      return { dmh }
    },
  })
}
