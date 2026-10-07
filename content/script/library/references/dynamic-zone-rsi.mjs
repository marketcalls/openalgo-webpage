/**
 * Reference implementation of the library's Dynamic Zone RSI, for the parity
 * gate. Leo Zamansky and David Stendahl's dynamic zones on Wilder's RSI:
 * instead of fixed 70 and 30 lines, each zone is read from the RSI's own last
 * `lookback` values.
 *
 * Their definition is empirical: the overbought (sell) zone is the value V
 * such that the share of the window at or above V equals `upperProb`, found by
 * counting down from the highest reading until upperProb percent of the
 * window is covered; the oversold (buy) zone is the same counted up from the
 * lowest reading. With N readings and probability P that is the k-th highest
 * (or k-th lowest) reading, k = ceil(P * N / 100), and at least 1 so a
 * probability of 0 gives the window's extreme. There is no interpolation
 * between readings.
 *
 * Their published example uses a nine-bar RSI, a 70-bar lookback and 10
 * percent for both zones, which are the defaults here. A window that still
 * holds a bar with no RSI has no zone.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-dynamic-zone-rsi",
    name: "Dynamic Zone RSI",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "rsiLength", type: "number", label: "RSI Length", default: 9, min: 1, step: 1 },
      { key: "lookback", type: "number", label: "Zone Lookback", default: 70, min: 2, step: 1 },
      { key: "upperProb", type: "number", label: "Overbought Probability %", default: 10, min: 0, max: 50, step: 1 },
      { key: "lowerProb", type: "number", label: "Oversold Probability %", default: 10, min: 0, max: 50, step: 1 },
    ],
    plots: [
      { key: "upper", type: "line", title: "Overbought Zone" },
      { key: "lower", type: "line", title: "Oversold Zone" },
      { key: "rsi", type: "line", title: "RSI" },
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
      const len = settings.rsiLength
      // Wilder's RSI: each average of gains and losses is seeded with the
      // simple average of the first `len` changes.
      const rsi = new Array(n).fill(null)
      let up = null
      let dn = null
      let sumUp = 0
      let sumDn = 0
      for (let i = 1; i < n; i++) {
        const d = src[i] - src[i - 1]
        const u = Math.max(d, 0)
        const w = Math.max(-d, 0)
        if (i <= len) {
          sumUp += u
          sumDn += w
          if (i === len) {
            up = sumUp / len
            dn = sumDn / len
          }
        } else {
          up = (up * (len - 1) + u) / len
          dn = (dn * (len - 1) + w) / len
        }
        if (up !== null) rsi[i] = dn === 0 ? 100 : up === 0 ? 0 : 100 - 100 / (1 + up / dn)
      }
      const L = settings.lookback
      // The window's readings sorted, or null while any of them is absent.
      const sortedWindow = (i) => {
        if (i < L - 1) return null
        const win = []
        for (let k = i - L + 1; k <= i; k++) {
          if (rsi[k] === null) return null
          win.push(rsi[k])
        }
        return win.sort((a, b) => a - b)
      }
      // How many readings a probability of p percent covers from one end.
      const rankOf = (p) => Math.max(1, Math.ceil((p * L) / 100))
      const kUpper = rankOf(settings.upperProb)
      const kLower = rankOf(settings.lowerProb)
      const upper = new Array(n).fill(null)
      const lower = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        const win = sortedWindow(i)
        if (win === null) continue
        upper[i] = win[L - kUpper]
        lower[i] = win[kLower - 1]
      }
      return { upper, lower, rsi }
    },
  })
}
