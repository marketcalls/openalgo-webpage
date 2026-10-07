/**
 * Reference implementation of the library's Relative Momentum Index, for the
 * parity gate.
 *
 * The change is taken over `momentum` bars, source minus source that many
 * bars back, instead of over one bar. Its rises and falls are smoothed with
 * Wilder's average over `length` (weight 1 / length, seeded with the simple
 * average of the first `length` present values), and the index is
 * 100 - 100 / (1 + up / down), 100 when the falls average zero.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-relative-momentum-index",
    name: "Relative Momentum Index (RMI)",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Length", default: 20, min: 1, step: 1 },
      { key: "momentum", type: "number", label: "Momentum", default: 5, min: 1, step: 1 },
    ],
    plots: [{ key: "rmi", type: "line", title: "RMI" }],
    calc(bars, settings) {
      const n = bars.length
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
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      const src = bars.map(pick)
      const m = settings.momentum
      const len = settings.length
      const mom = src.map((x, i) => (i < m ? null : x - src[i - m]))
      // Wilder's average, seeded with the simple average of the first `len`
      // present values.
      const rma = (values) => {
        const out = new Array(n).fill(null)
        let e = null
        let count = 0
        let sum = 0
        for (let i = 0; i < n; i++) {
          const x = values[i]
          if (na(x)) continue
          if (e === null) {
            sum += x
            count++
            if (count === len) e = sum / len
          } else e = (e * (len - 1) + x) / len
          out[i] = e
        }
        return out
      }
      const up = rma(mom.map((x) => (na(x) ? null : Math.max(x, 0))))
      const dn = rma(mom.map((x) => (na(x) ? null : Math.max(-x, 0))))
      const rmi = up.map((u, i) => (na(u) || na(dn[i]) ? null : dn[i] === 0 ? 100 : 100 - 100 / (1 + u / dn[i])))
      return { rmi }
    },
  })
}
