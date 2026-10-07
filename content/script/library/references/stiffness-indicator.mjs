/**
 * Reference implementation of the library's Stiffness Indicator, for the
 * parity gate.
 *
 * Markos Katsanos's measure: a lower bound sits a fraction of a standard
 * deviation (population form) below a simple average of the close. Each close
 * above the bound counts 1; the count over the stiffness window, as a
 * percentage of the window, is smoothed by an exponential average seeded with
 * the simple average of its first `smoothLength` values.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-stiffness-indicator",
    name: "Stiffness Indicator",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "maLength", type: "number", label: "Average Length", default: 100, min: 2, step: 1 },
      { key: "stdMult", type: "number", label: "Deviation Multiplier", default: 0.2, min: 0, step: 0.1 },
      { key: "stiffLength", type: "number", label: "Stiffness Length", default: 60, min: 1, step: 1 },
      { key: "smoothLength", type: "number", label: "Smoothing", default: 3, min: 1, step: 1 },
    ],
    plots: [{ key: "stiffness", type: "line", title: "Stiffness" }],
    levels: [{ value: 90, title: "Threshold" }],
    calc(bars, settings) {
      const n = bars.length
      const close = bars.map((b) => b.close)
      const M = settings.maLength
      const bound = close.map((_, i) => {
        if (i < M - 1) return null
        let s = 0
        for (let k = i - M + 1; k <= i; k++) s += close[k]
        const mean = s / M
        let v = 0
        for (let k = i - M + 1; k <= i; k++) v += (close[k] - mean) ** 2
        return mean - settings.stdMult * Math.sqrt(v / M)
      })
      const pen = close.map((c, i) => (bound[i] === null ? null : c > bound[i] ? 1 : 0))
      const W = settings.stiffLength
      const raw = pen.map((_, i) => {
        if (i < W - 1) return null
        let s = 0
        for (let k = i - W + 1; k <= i; k++) {
          if (pen[k] === null) return null
          s += pen[k]
        }
        return (s * 100) / W
      })
      // Exponential smoothing, seeded with the simple mean of the first
      // `smoothLength` present values.
      const L = settings.smoothLength
      const alpha = 2 / (L + 1)
      const out = new Array(n).fill(null)
      let ema = null
      let count = 0
      let seed = 0
      for (let i = 0; i < n; i++) {
        if (raw[i] === null) continue
        count++
        if (count < L) {
          seed += raw[i]
        } else if (count === L) {
          ema = (seed + raw[i]) / L
        } else {
          ema = alpha * raw[i] + (1 - alpha) * ema
        }
        out[i] = ema
      }
      return { stiffness: out }
    },
  })
}
