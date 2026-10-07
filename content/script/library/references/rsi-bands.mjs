/**
 * Reference implementation of the library's RSI Bands, for the parity gate.
 *
 * With Wilder's averages of up moves (AU) and down moves (AD) over `length`
 * bars, the next bar's RSI equals a level L when its close is P:
 *
 * - if P is above the source C, the move is a gain and
 *   P = C + (length - 1) * (AD * L / (100 - L) - AU);
 * - if P is below C, the move is a loss and
 *   P = C - (length - 1) * (AU * (100 - L) / L - AD).
 *
 * The first form applies while it gives a price at or above C (RSI is below
 * the level), the second otherwise. Wilder's averages are seeded with a simple
 * average of the first `length` changes, as RSI is.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-rsi-bands",
    name: "RSI Bands",
    category: "Bands & Channels",
    placement: "onchart",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "RSI Length", default: 14, min: 1, step: 1 },
      { key: "overbought", type: "number", label: "Overbought Level", default: 70, min: 51, max: 99, step: 1 },
      { key: "oversold", type: "number", label: "Oversold Level", default: 30, min: 1, max: 49, step: 1 },
    ],
    plots: [
      { key: "upper", type: "line", title: "Upper Band" },
      { key: "middle", type: "line", title: "Middle Band" },
      { key: "lower", type: "line", title: "Lower Band" },
    ],
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
      const n = bars.length
      const src = bars.map(pick)
      const len = settings.length

      const au = new Array(n).fill(null)
      const ad = new Array(n).fill(null)
      let up = 0
      let down = 0
      for (let i = 1; i < n; i++) {
        const d = src[i] - src[i - 1]
        const g = Math.max(d, 0)
        const l = Math.max(-d, 0)
        if (i < len) {
          up += g
          down += l
        } else if (i === len) {
          up = (up + g) / len
          down = (down + l) / len
        } else {
          up = (up * (len - 1) + g) / len
          down = (down * (len - 1) + l) / len
        }
        if (i >= len) {
          au[i] = up
          ad[i] = down
        }
      }

      const band = (level) =>
        src.map((c, i) => {
          if (au[i] === null) return null
          const rs = level / (100 - level)
          const x = (len - 1) * (ad[i] * rs - au[i])
          return x >= 0 ? c + x : c - (len - 1) * (au[i] / rs - ad[i])
        })
      return { upper: band(settings.overbought), middle: band(50), lower: band(settings.oversold) }
    },
  })
}
