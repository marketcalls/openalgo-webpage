/**
 * Reference implementation of the library's 3-10 Oscillator, for the parity
 * gate: a 3 bar simple average of the close minus a 10 bar one, with a 16 bar
 * simple average of that difference as the signal line. The close is the input
 * in the widely documented definition; the bar midpoint is a menu option.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-three-ten-oscillator",
    name: "3-10 Oscillator",
    category: "Momentum",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "fastLength", type: "number", label: "Fast Length", default: 3, min: 1, step: 1 },
      { key: "slowLength", type: "number", label: "Slow Length", default: 10, min: 1, step: 1 },
      { key: "signalLength", type: "number", label: "Signal Length", default: 16, min: 1, step: 1 },
    ],
    plots: [
      { key: "osc", type: "histogram", title: "Oscillator" },
      { key: "signal", type: "line", title: "Signal" },
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
      const src = bars.map(pick)
      // A simple average, absent until its window holds `len` present values.
      const sma = (values, len) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          let s = 0
          for (let k = i - len + 1; k <= i; k++) {
            if (values[k] === null) return null
            s += values[k]
          }
          return s / len
        })
      const fast = sma(src, settings.fastLength)
      const slow = sma(src, settings.slowLength)
      const osc = fast.map((f, i) => (f === null || slow[i] === null ? null : f - slow[i]))
      const signal = sma(osc, settings.signalLength)
      return { osc, signal }
    },
  })
}
