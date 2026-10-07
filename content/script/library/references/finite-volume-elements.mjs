/**
 * Reference implementation of the library's Finite Volume Elements (FVE), for
 * the parity gate.
 *
 * Markos Katsanos's money flow: the close's distance from the bar midpoint plus
 * the change in typical price. A bar's volume counts as buying when that flow
 * exceeds a cutoff of `cutoff` percent of the close, as selling when it is
 * below minus the cutoff, and not at all in between. FVE is the signed volume
 * over `samples` bars as a percentage of the total volume of those bars. The
 * first bar has no previous typical price and so no flow.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-finite-volume-elements",
    name: "Finite Volume Elements (FVE)",
    category: "Volume",
    placement: "pane",
    inputs: [
      { key: "samples", type: "number", label: "Period", default: 22, min: 1, step: 1 },
      { key: "cutoff", type: "number", label: "Cutoff %", default: 0.3, min: 0, step: 0.1 },
    ],
    plots: [{ key: "fve", type: "line", title: "FVE" }],
    levels: [{ value: 0, title: "Zero" }],
    calc(bars, settings) {
      const P = settings.samples
      const vol = bars.map((b) => b.volume ?? null)
      const tp = bars.map((b) => (b.high + b.low + b.close) / 3)
      const signed = bars.map((b, i) => {
        if (i === 0 || vol[i] === null) return null
        const mf = b.close - (b.high + b.low) / 2 + tp[i] - tp[i - 1]
        const cut = (settings.cutoff * b.close) / 100
        return mf > cut ? vol[i] : mf < -cut ? -vol[i] : 0
      })
      const windowSum = (values) =>
        values.map((_, i) => {
          if (i < P - 1) return null
          let s = 0
          for (let k = i - P + 1; k <= i; k++) {
            if (values[k] === null) return null
            s += values[k]
          }
          return s
        })
      const net = windowSum(signed)
      const total = windowSum(vol)
      const fve = net.map((s, i) => {
        if (s === null || total[i] === null) return null
        const avg = total[i] / P
        return avg === 0 ? null : (100 * s) / (avg * P)
      })
      return { fve }
    },
  })
}
