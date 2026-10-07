/**
 * Reference implementation of the library's Ehlers Ultimate Oscillator, for
 * the parity gate.
 *
 * John Ehlers' oscillator: the difference of two of his two-pole highpass
 * filters, one with its cutoff at `bandWidth * bandEdge` bars and one at
 * `bandEdge` bars, which leaves the cycles between the two periods. The
 * difference is divided by its root mean square over `rmsLength` bars (the
 * square root of a simple average of its squares), so the reading is in units
 * of its own typical size.
 *
 * Highpass: a1 = exp(-1.414 pi / period), c2 = 2 a1 cos(1.414 pi / period),
 * c3 = -a1^2, c1 = (1 + c2 - c3) / 4,
 *   HP = c1 (x - 2 x[1] + x[2]) + c2 HP[1] + c3 HP[2],
 * zero on the first three bars.
 *
 * Defaults are the published ones: band edge 20, bandwidth 2 (the definition
 * asks for a bandwidth of at least 1.4) and an RMS over 100 bars. Where the
 * RMS is zero the oscillator keeps its previous value, as the published
 * definition does (absent until a first value exists).
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-ultimate-oscillator",
    name: "Ehlers Ultimate Oscillator",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "bandEdge", type: "number", label: "Band Edge", default: 20, min: 2, step: 1 },
      { key: "bandWidth", type: "number", label: "Bandwidth", default: 2, min: 1.4, step: 0.1 },
      { key: "rmsLength", type: "number", label: "RMS Length", default: 100, min: 1, step: 1 },
    ],
    plots: [{ key: "uo", type: "line", title: "Ultimate Oscillator" }],
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
      const x = bars.map(pick)
      const n = x.length
      const highpass = (v, len) => {
        const a1 = Math.exp((-1.414 * Math.PI) / len)
        const c2 = 2 * a1 * Math.cos((1.414 * Math.PI) / len)
        const c3 = -a1 * a1
        const c1 = (1 + c2 - c3) / 4
        const out = new Array(v.length).fill(null)
        for (let i = 0; i < v.length; i++) {
          out[i] = i < 3 ? 0 : c1 * (v[i] - 2 * v[i - 1] + v[i - 2]) + c2 * out[i - 1] + c3 * out[i - 2]
        }
        return out
      }
      const hp1 = highpass(x, settings.bandWidth * settings.bandEdge)
      const hp2 = highpass(x, settings.bandEdge)
      const signal = hp1.map((h, i) => h - hp2[i])
      const m = settings.rmsLength
      const uo = new Array(n).fill(null)
      let prev = null
      for (let i = m - 1; i < n; i++) {
        let s = 0
        for (let k = i - m + 1; k <= i; k++) s += signal[k] * signal[k]
        const rms = Math.sqrt(s / m)
        uo[i] = rms === 0 ? prev : signal[i] / rms
        prev = uo[i]
      }
      return { uo }
    },
  })
}
