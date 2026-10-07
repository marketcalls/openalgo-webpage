/**
 * Reference implementation of the library's Ehlers Fisherized Deviation-Scaled
 * Oscillator (FDSO), for the parity gate.
 *
 * Following John Ehlers' definition: the two-bar change of the source (a
 * difference with zeros at the lowest and the highest frequency) is smoothed
 * by a two-pole super smoother whose cutoff is half the period, then divided
 * by its root mean square over the period, which scales it in standard
 * deviations. Ehlers halves that value before the Fisher transform, so a
 * reading of two deviations reaches the edge of its domain. As in his
 * definition, only a scaled value strictly inside plus or minus 2 deviations
 * is transformed; on a bar beyond that, or one whose root mean square is
 * zero, the oscillator keeps its previous reading (absent if it has none).
 * The smoother reads an earlier output it does not have yet as zero.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-fisherized-deviation-scaled-oscillator",
    name: "Ehlers Fisherized Deviation-Scaled Oscillator (FDSO)",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "period", type: "number", label: "Period", default: 40, min: 2, step: 1 },
    ],
    plots: [{ key: "fdso", type: "line", title: "FDSO" }],
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
      const period = settings.period
      const a1 = Math.exp((-1.414 * Math.PI) / (0.5 * period))
      const c2 = 2 * a1 * Math.cos((1.414 * Math.PI) / (0.5 * period))
      const c3 = -a1 * a1
      const c1 = 1 - c2 - c3

      const zeros = src.map((x, i) => (i >= 2 ? x - src[i - 2] : null))
      const filt = new Array(n).fill(null)
      for (let i = 3; i < n; i++) {
        filt[i] = (c1 * (zeros[i] + zeros[i - 1])) / 2 + c2 * (filt[i - 1] ?? 0) + c3 * (filt[i - 2] ?? 0)
      }

      const fdso = new Array(n).fill(null)
      for (let i = 3 + period - 1; i < n; i++) {
        fdso[i] = fdso[i - 1]
        let ss = 0
        for (let k = 0; k < period; k++) ss += filt[i - k] * filt[i - k]
        const rms = Math.sqrt(ss / period)
        if (rms === 0) continue
        const scaled = filt[i] / rms
        if (Math.abs(scaled) >= 2) continue
        const half = scaled / 2
        fdso[i] = 0.5 * Math.log((1 + half) / (1 - half))
      }
      return { fdso }
    },
  })
}
