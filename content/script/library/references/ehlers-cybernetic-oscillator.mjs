/**
 * Reference implementation of the library's Ehlers Cybernetic Oscillator, for
 * the parity gate.
 *
 * John Ehlers' oscillator: a two-pole highpass filter over `hpLength` bars
 * removes the trend, a two-pole super smoother over `lpLength` bars removes
 * the noise, and the result is divided by its root mean square over
 * `rmsLength` bars (the square root of a simple average of its squares).
 *
 * Both filters use a1 = exp(-1.414 pi / period), c2 = 2 a1 cos(1.414 pi /
 * period), c3 = -a1^2.
 *   Highpass: c1 = (1 + c2 - c3) / 4,
 *   HP = c1 (x - 2 x[1] + x[2]) + c2 HP[1] + c3 HP[2], zero on the first three bars.
 *   Super smoother: c1 = 1 - c2 - c3,
 *   SS = c1 (x + x[1]) / 2 + c2 SS[1] + c3 SS[2], equal to its input on the
 *   first three bars.
 * Where the RMS is zero the oscillator keeps its previous value, as the
 * published definition does (absent until a first value exists).
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-cybernetic-oscillator",
    name: "Ehlers Cybernetic Oscillator",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "hpLength", type: "number", label: "Highpass Length", default: 30, min: 2, step: 1 },
      { key: "lpLength", type: "number", label: "Lowpass Length", default: 20, min: 2, step: 1 },
      { key: "rmsLength", type: "number", label: "RMS Length", default: 100, min: 1, step: 1 },
    ],
    plots: [{ key: "co", type: "line", title: "Cybernetic Oscillator" }],
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
      const coeffs = (len) => {
        const a1 = Math.exp((-1.414 * Math.PI) / len)
        const c2 = 2 * a1 * Math.cos((1.414 * Math.PI) / len)
        const c3 = -a1 * a1
        return { c2, c3 }
      }
      const hp = new Array(n).fill(null)
      {
        const { c2, c3 } = coeffs(settings.hpLength)
        const c1 = (1 + c2 - c3) / 4
        for (let i = 0; i < n; i++) hp[i] = i < 3 ? 0 : c1 * (x[i] - 2 * x[i - 1] + x[i - 2]) + c2 * hp[i - 1] + c3 * hp[i - 2]
      }
      const lp = new Array(n).fill(null)
      {
        const { c2, c3 } = coeffs(settings.lpLength)
        const c1 = 1 - c2 - c3
        for (let i = 0; i < n; i++) lp[i] = i < 3 ? hp[i] : (c1 * (hp[i] + hp[i - 1])) / 2 + c2 * lp[i - 1] + c3 * lp[i - 2]
      }
      const m = settings.rmsLength
      const co = new Array(n).fill(null)
      let prev = null
      for (let i = m - 1; i < n; i++) {
        let s = 0
        for (let k = i - m + 1; k <= i; k++) s += lp[k] * lp[k]
        const rms = Math.sqrt(s / m)
        co[i] = rms === 0 ? prev : lp[i] / rms
        prev = co[i]
      }
      return { co }
    },
  })
}
