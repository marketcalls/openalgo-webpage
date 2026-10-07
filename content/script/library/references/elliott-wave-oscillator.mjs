/**
 * Reference implementation of the library's Elliott Wave Oscillator, for the
 * parity gate: a fast simple average of the source minus a slow one, as a
 * percentage of the source or in price.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-elliott-wave-oscillator",
    name: "Elliott Wave Oscillator",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "sma1length", type: "number", label: "Fast Length", default: 5, min: 1, step: 1 },
      { key: "sma2length", type: "number", label: "Slow Length", default: 35, min: 1, step: 1 },
      { key: "UsePercent", type: "boolean", label: "Show Dif as percent of current Candle", default: true },
    ],
    plots: [{ key: "ewo", type: "histogram", title: "EWO" }],
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
      const sma = (len) => src.map((_, i) => (i < len - 1 ? null : src.slice(i - len + 1, i + 1).reduce((a, b) => a + b, 0) / len))
      const fast = sma(settings.sma1length)
      const slow = sma(settings.sma2length)
      const ewo = src.map((x, i) => {
        if (fast[i] === null || slow[i] === null) return null
        const dif = fast[i] - slow[i]
        return settings.UsePercent ? (dif / x) * 100 : dif
      })
      return { ewo }
    },
  })
}
