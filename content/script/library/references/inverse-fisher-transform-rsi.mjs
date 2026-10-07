/**
 * Reference implementation of the library's Inverse Fisher Transform of RSI,
 * for the parity gate.
 *
 * Following John Ehlers' definition: v1 = 0.1 * (RSI - 50) rescales the RSI to
 * about -5 to 5, v2 is a weighted moving average of v1, and the inverse Fisher
 * transform (exp(2 v2) - 1) / (exp(2 v2) + 1) squeezes it into -1 to 1. The
 * RSI is Wilder's: average gain and loss smoothed with 1 / length, each seeded
 * with the simple average of the first `length` changes.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-inverse-fisher-transform-rsi",
    name: "Inverse Fisher Transform of RSI",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "rsiLength", type: "number", label: "RSI Length", default: 5, min: 1, step: 1 },
      { key: "wmaLength", type: "number", label: "Smoothing Length", default: 9, min: 1, step: 1 },
    ],
    plots: [{ key: "ift", type: "line", title: "IFT RSI" }],
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
      const { rsiLength: L, wmaLength: W } = settings

      const rsi = new Array(n).fill(null)
      let up = null
      let dn = null
      let sumUp = 0
      let sumDn = 0
      for (let i = 1; i < n; i++) {
        const d = src[i] - src[i - 1]
        const u = Math.max(d, 0)
        const w = Math.max(-d, 0)
        if (i <= L) {
          sumUp += u
          sumDn += w
          if (i === L) {
            up = sumUp / L
            dn = sumDn / L
          }
        } else {
          up = (up * (L - 1) + u) / L
          dn = (dn * (L - 1) + w) / L
        }
        if (up !== null) rsi[i] = dn === 0 ? 100 : up === 0 ? 0 : 100 - 100 / (1 + up / dn)
      }

      const v1 = rsi.map((r) => (r === null ? null : 0.1 * (r - 50)))
      const denom = (W * (W + 1)) / 2
      const ift = new Array(n).fill(null)
      for (let i = W - 1; i < n; i++) {
        let s = 0
        let ok = true
        for (let k = 0; k < W; k++) {
          if (v1[i - k] === null) {
            ok = false
            break
          }
          s += v1[i - k] * (W - k)
        }
        if (!ok) continue
        const e = Math.exp(2 * (s / denom))
        ift[i] = (e - 1) / (e + 1)
      }
      return { ift }
    },
  })
}
