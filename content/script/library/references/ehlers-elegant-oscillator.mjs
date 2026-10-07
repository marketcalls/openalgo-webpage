/**
 * Reference implementation of the library's Ehlers Elegant Oscillator, for the
 * parity gate.
 *
 * Following John Ehlers' definition: the two-bar change of the source is
 * divided by its root mean square over `rmsLength` bars, soft-clipped into -1
 * to 1 with the inverse Fisher transform, and smoothed by a two-pole super
 * smoother with its cutoff at `bandEdge` bars. A window whose root mean square
 * is zero gives no reading, and the smoother reads an earlier output it does
 * not have yet as zero.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-elegant-oscillator",
    name: "Ehlers Elegant Oscillator",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "bandEdge", type: "number", label: "Band Edge", default: 20, min: 2, step: 1 },
      { key: "rmsLength", type: "number", label: "RMS Length", default: 50, min: 2, step: 1 },
    ],
    plots: [{ key: "eo", type: "line", title: "Elegant Oscillator" }],
    calc(bars, settings) {
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
      const n = src.length
      const { bandEdge, rmsLength } = settings
      const a1 = Math.exp((-1.414 * Math.PI) / bandEdge)
      const c2 = 2 * a1 * Math.cos((1.414 * Math.PI) / bandEdge)
      const c3 = -a1 * a1
      const c1 = 1 - c2 - c3

      const deriv = src.map((x, i) => (i >= 2 ? x - src[i - 2] : null))
      const ifish = new Array(n).fill(null)
      for (let i = 2 + rmsLength - 1; i < n; i++) {
        let ss = 0
        for (let k = 0; k < rmsLength; k++) ss += deriv[i - k] * deriv[i - k]
        const rms = Math.sqrt(ss / rmsLength)
        if (rms === 0) continue
        const e = Math.exp(2 * (deriv[i] / rms))
        ifish[i] = (e - 1) / (e + 1)
      }

      const eo = new Array(n).fill(null)
      for (let i = 1; i < n; i++) {
        if (ifish[i] === null || ifish[i - 1] === null) continue
        eo[i] = (c1 * (ifish[i] + ifish[i - 1])) / 2 + c2 * (eo[i - 1] ?? 0) + c3 * (i >= 2 ? eo[i - 2] ?? 0 : 0)
      }
      return { eo }
    },
  })
}
