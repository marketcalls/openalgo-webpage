/**
 * Reference implementation of the library's Volume Zone Oscillator, for the
 * parity gate. Each bar's volume is signed by the direction of the close
 * against the previous close; the oscillator is 100 times an exponential
 * average of that signed volume over an exponential average of the volume.
 * Each exponential average is seeded with the simple average of its first
 * `length` values. The first bar has no previous close, so neither average
 * takes it: both run over exactly the same bars with the same weights, which
 * keeps the reading inside -100 to 100 from its first value.
 *
 * The zone levels are the authors' published ones: 60, 40, 15, 0, -5, -40
 * and -60 (the neutral band is +15 to -5, not symmetric).
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-volume-zone-oscillator",
    name: "Volume Zone Oscillator (VZO)",
    category: "Volume",
    placement: "pane",
    inputs: [{ key: "length", type: "number", label: "Length", default: 14, min: 1, step: 1 }],
    plots: [{ key: "vzo", type: "line", title: "VZO" }],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      // Exponential average with weight 2 / (len + 1), seeded on the len-th
      // present value with the simple average of the first len values.
      const ema = (values) => {
        const a = 2 / (len + 1)
        const out = new Array(n).fill(null)
        let e = null
        let seen = 0
        let sum = 0
        for (let i = 0; i < n; i++) {
          const x = values[i]
          if (na(x)) continue
          if (e === null) {
            seen++
            sum += x
            if (seen === len) e = sum / len
          } else e = a * x + (1 - a) * e
          out[i] = e
        }
        return out
      }
      const vol = bars.map((b) => b.volume ?? null)
      const signed = bars.map((b, i) => (i === 0 || na(vol[i]) ? null : Math.sign(b.close - bars[i - 1].close) * vol[i]))
      const vp = ema(signed)
      const tv = ema(vol.map((v, i) => (i === 0 ? null : v)))
      const vzo = vp.map((p, i) => (na(p) || na(tv[i]) || tv[i] === 0 ? null : (100 * p) / tv[i]))
      return { vzo }
    },
  })
}
