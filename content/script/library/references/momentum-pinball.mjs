/**
 * Reference implementation of the library's Momentum Pinball, for the parity
 * gate.
 *
 * Linda Raschke's oscillator is a short relative strength index taken over the
 * one-bar rate of change of the close: the change in points, `close -
 * close[1]`, not a percentage. The index uses Wilder's smoothing with the
 * first average seeded by a simple average of the first `rsiLength` changes.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-momentum-pinball",
    name: "Momentum Pinball",
    category: "Momentum",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "rocLength", type: "number", label: "Rate of Change Length", default: 1, min: 1, step: 1 },
      { key: "rsiLength", type: "number", label: "RSI Length", default: 3, min: 1, step: 1 },
    ],
    plots: [{ key: "pinball", type: "line", title: "Momentum Pinball" }],
    levels: [
      { value: 70, title: "Upper" },
      { value: 50, title: "Middle" },
      { value: 30, title: "Lower" },
    ],
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
      const src = bars.map(pick)
      const L = settings.rocLength
      const len = settings.rsiLength
      // The rate of change in points over `rocLength` bars.
      const roc = src.map((x, i) => (i < L ? null : x - src[i - L]))

      // Wilder's index over the rate of change. Each change needs two present
      // values; the averages are seeded with the simple mean of the first
      // `len` changes.
      const out = new Array(n).fill(null)
      let up = null
      let dn = null
      let sumUp = 0
      let sumDn = 0
      let count = 0
      for (let i = 1; i < n; i++) {
        if (roc[i] === null || roc[i - 1] === null) continue
        const d = roc[i] - roc[i - 1]
        const u = Math.max(d, 0)
        const w = Math.max(-d, 0)
        count++
        if (count <= len) {
          sumUp += u
          sumDn += w
          if (count === len) {
            up = sumUp / len
            dn = sumDn / len
          }
        } else {
          up = (up * (len - 1) + u) / len
          dn = (dn * (len - 1) + w) / len
        }
        if (up !== null) out[i] = dn === 0 ? 100 : up === 0 ? 0 : 100 - 100 / (1 + up / dn)
      }
      return { pinball: out }
    },
  })
}
