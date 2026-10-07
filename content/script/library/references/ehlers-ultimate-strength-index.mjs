/**
 * Reference implementation of the library's Ehlers Ultimate Strength Index,
 * for the parity gate.
 *
 * John Ehlers' index of strength: the up part of each bar's change
 * (max(x - x[1], 0)) and the down part (max(x[1] - x, 0)) are each averaged
 * over four bars and then smoothed with his Ultimate Smoother over the
 * length. USI = (up - down) / (up + down), between -1 and 1. The first bar has
 * no change, so both parts are zero there, and a part before the first bar
 * reads as zero in the four-bar average. The Ultimate Smoother returns its
 * input on its first three bars. Where up and down are both zero the ratio is
 * undefined and the index keeps its previous value, as the published definition
 * does (absent until a first value exists).
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-ultimate-strength-index",
    name: "Ehlers Ultimate Strength Index (USI)",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Length", default: 28, min: 2, step: 1 },
    ],
    plots: [{ key: "usi", type: "line", title: "USI" }],
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
      const smoother = (v, len) => {
        const a1 = Math.exp((-1.414 * Math.PI) / len)
        const c2 = 2 * a1 * Math.cos((1.414 * Math.PI) / len)
        const c3 = -a1 * a1
        const c1 = (1 + c2 - c3) / 4
        const out = new Array(v.length).fill(null)
        for (let i = 0; i < v.length; i++) {
          out[i] = i < 3 ? v[i] : (1 - c1) * v[i] + (2 * c1 - c2) * v[i - 1] - (c1 + c3) * v[i - 2] + c2 * out[i - 1] + c3 * out[i - 2]
        }
        return out
      }
      const su = x.map((v, i) => (i === 0 ? 0 : Math.max(v - x[i - 1], 0)))
      const sd = x.map((v, i) => (i === 0 ? 0 : Math.max(x[i - 1] - v, 0)))
      const avg4 = (v) => v.map((_, i) => ((v[i] ?? 0) + (v[i - 1] ?? 0) + (v[i - 2] ?? 0) + (v[i - 3] ?? 0)) / 4)
      const up = smoother(avg4(su), settings.length)
      const dn = smoother(avg4(sd), settings.length)
      const usi = new Array(x.length).fill(null)
      let prev = null
      for (let i = 0; i < x.length; i++) {
        const total = up[i] + dn[i]
        usi[i] = total === 0 ? prev : (up[i] - dn[i]) / total
        prev = usi[i]
      }
      return { usi }
    },
  })
}
