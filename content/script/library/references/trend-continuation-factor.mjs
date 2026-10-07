/**
 * Reference implementation of the library's Trend Continuation Factor, for the
 * parity gate, from M. H. Pee's definition.
 *
 * The bar's change is split into a plus change (a rise, else 0) and a minus
 * change (a fall as a positive number, else 0). The plus continuation factor
 * adds up consecutive plus changes and drops to 0 on any bar without a rise;
 * the minus factor does the same for falls. Over `length` bars, plus TCF sums
 * plus change minus the minus factor, and minus TCF sums minus change minus
 * the plus factor. The first bar has no change, so the sums start a bar late.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-trend-continuation-factor",
    name: "Trend Continuation Factor (TCF)",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Length", default: 35, min: 1, step: 1 },
    ],
    plots: [
      { key: "plusTcf", type: "line", title: "Plus TCF" },
      { key: "minusTcf", type: "line", title: "Minus TCF" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
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
      const plusTerm = new Array(n).fill(null)
      const minusTerm = new Array(n).fill(null)
      let plusCf = 0
      let minusCf = 0
      for (let i = 1; i < n; i++) {
        const ch = src[i] - src[i - 1]
        const up = ch > 0 ? ch : 0
        const dn = ch < 0 ? -ch : 0
        plusCf = up === 0 ? 0 : plusCf + up
        minusCf = dn === 0 ? 0 : minusCf + dn
        plusTerm[i] = up - minusCf
        minusTerm[i] = dn - plusCf
      }
      const windowSum = (values) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          let s = 0
          for (let k = i - len + 1; k <= i; k++) {
            if (values[k] === null) return null
            s += values[k]
          }
          return s
        })
      return { plusTcf: windowSum(plusTerm), minusTcf: windowSum(minusTerm) }
    },
  })
}
