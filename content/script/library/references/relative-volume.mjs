/**
 * Reference implementation of the library's Relative Volume (RVOL), for the
 * parity gate. Each bar's volume is divided by the simple average of the
 * volume of the `length` bars before it, so the bar being measured is not part
 * of its own baseline. The value is absent until that many earlier bars exist,
 * and absent where the baseline is zero.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-relative-volume",
    name: "Relative Volume (RVOL)",
    category: "Volume",
    placement: "pane",
    inputs: [
      { key: "length", type: "number", label: "Average Length", default: 20, min: 1, step: 1 },
      { key: "threshold", type: "number", label: "Highlight Above", default: 2, min: 0.1, step: 0.1 },
    ],
    plots: [{ key: "rvol", type: "histogram", title: "RVOL" }],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const vol = bars.map((b) => b.volume ?? null)
      const rvol = new Array(n).fill(null)
      for (let i = len; i < n; i++) {
        let s = 0
        let ok = true
        for (let k = i - len; k < i; k++) {
          if (vol[k] === null) {
            ok = false
            break
          }
          s += vol[k]
        }
        if (!ok || vol[i] === null) continue
        const avg = s / len
        rvol[i] = avg === 0 ? null : vol[i] / avg
      }
      return { rvol }
    },
  })
}
