/**
 * Reference implementation of the library's Laguerre Filter, for the parity
 * gate: John Ehlers' four-stage Laguerre filter with gamma = 1 - alpha, each
 * stage starting from zero, averaged with weights 1, 2, 2, 1.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-laguerre-filter",
    name: "Laguerre Filter",
    category: "Filters",
    placement: "onchart",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "hl2" },
      { key: "lagAlpha", type: "number", label: "Alpha", default: 0.2, min: 0, max: 1, step: 0.1 },
      { key: "colorchange", type: "boolean", label: "Change Color ?", default: true },
    ],
    plots: [{ key: "lagf", type: "line", title: "LagF" }],
    calc(bars, settings) {
      const pick = (b) => {
        switch (settings.src) {
          case "open": return b.open
          case "high": return b.high
          case "low": return b.low
          case "close": return b.close
          case "hlc3": return (b.high + b.low + b.close) / 3
          case "ohlc4": return (b.open + b.high + b.low + b.close) / 4
          default: return (b.high + b.low) / 2
        }
      }
      const gamma = 1 - settings.lagAlpha
      let l0 = 0
      let l1 = 0
      let l2 = 0
      let l3 = 0
      const lagf = bars.map((b) => {
        const src = pick(b)
        const p0 = l0
        const p1 = l1
        const p2 = l2
        l0 = (1 - gamma) * src + gamma * p0
        l1 = -gamma * l0 + p0 + gamma * p1
        l2 = -gamma * l1 + p1 + gamma * p2
        l3 = -gamma * l2 + p2 + gamma * l3
        return (l0 + 2 * l1 + 2 * l2 + l3) / 6
      })
      return { lagf }
    },
  })
}
