/**
 * Reference implementation of the library's Sentiment Zone Oscillator, for
 * the parity gate. Walid Khalil's oscillator scores each bar +1 for a close
 * above the previous close and -1 otherwise, smooths the score with a triple
 * exponential average and scales it by the length:
 *
 *   SZO = 100 * TEMA(R, len) / len
 *
 * The overbought and oversold lines follow the oscillator's own range over
 * `longLen` bars: `percent` of the way up from its lowest value, and the same
 * share of the way down from its highest.
 *
 * Each exponential average is seeded with the simple average of its first
 * `len` values. The first bar has no previous close and so no score.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-sentiment-zone-oscillator",
    name: "Sentiment Zone Oscillator (SZO)",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "len", type: "number", label: "Length", default: 14, min: 1, step: 1 },
      { key: "longLen", type: "number", label: "Zone Length", default: 30, min: 1, step: 1 },
      { key: "percent", type: "number", label: "Zone Percent", default: 95, min: 0, max: 100, step: 1 },
    ],
    plots: [
      { key: "szo", type: "line", title: "SZO" },
      { key: "ob", type: "line", title: "Overbought" },
      { key: "os", type: "line", title: "Oversold" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.len
      const ema = (values, length) => {
        const out = new Array(n).fill(null)
        const a = 2 / (length + 1)
        let count = 0
        let sum = 0
        let prev = null
        for (let i = 0; i < n; i++) {
          const v = values[i]
          if (v === null) continue
          if (prev === null) {
            sum += v
            count++
            if (count < length) continue
            prev = sum / length
          } else prev = a * v + (1 - a) * prev
          out[i] = prev
        }
        return out
      }
      const r = bars.map((b, i) => (i === 0 ? null : b.close > bars[i - 1].close ? 1 : -1))
      const e1 = ema(r, len)
      const e2 = ema(e1, len)
      const e3 = ema(e2, len)
      const szo = e3.map((v, i) => (v === null ? null : (100 * (3 * e1[i] - 3 * e2[i] + v)) / len))
      const L = settings.longLen
      // The highest and lowest oscillator value of the last `longLen` bars,
      // absent until the window holds only present values.
      const extremes = (i) => {
        if (i < L - 1) return null
        let hi = -Infinity
        let lo = Infinity
        for (let k = i - L + 1; k <= i; k++) {
          if (szo[k] === null) return null
          hi = Math.max(hi, szo[k])
          lo = Math.min(lo, szo[k])
        }
        return { hi, lo }
      }
      const p = settings.percent / 100
      const ob = new Array(n).fill(null)
      const os = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        const e = extremes(i)
        if (e === null) continue
        ob[i] = e.lo + (e.hi - e.lo) * p
        os[i] = e.hi - (e.hi - e.lo) * p
      }
      return { szo, ob, os }
    },
  })
}
