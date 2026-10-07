/**
 * Reference implementation of the library's Ehlers Ultimate Smoother, for the
 * parity gate.
 *
 * John Ehlers' two-pole filter: the output is the input minus a two-pole
 * highpass of it, written as one recursion. With a1 = exp(-1.414 pi / period)
 * and b1 = 2 a1 cos(1.414 pi / period): c2 = b1, c3 = -a1^2,
 * c1 = (1 + c2 - c3) / 4 and
 *   US = (1 - c1) x + (2 c1 - c2) x[1] - (c1 + c3) x[2] + c2 US[1] + c3 US[2].
 * The first three bars, which lack the two earlier inputs and outputs the
 * recursion needs, return the input itself. The definition writes pi as
 * 3.14159 and the cosine in degrees; this uses pi in radians, the same angle.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-ultimate-smoother",
    name: "Ehlers Ultimate Smoother",
    category: "Filters",
    placement: "onchart",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Period", default: 20, min: 2, step: 1 },
    ],
    plots: [{ key: "us", type: "line", title: "Ultimate Smoother" }],
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
      const len = settings.length
      const a1 = Math.exp((-1.414 * Math.PI) / len)
      const c2 = 2 * a1 * Math.cos((1.414 * Math.PI) / len)
      const c3 = -a1 * a1
      const c1 = (1 + c2 - c3) / 4
      const us = new Array(x.length).fill(null)
      for (let i = 0; i < x.length; i++) {
        us[i] = i < 3 ? x[i] : (1 - c1) * x[i] + (2 * c1 - c2) * x[i - 1] - (c1 + c3) * x[i - 2] + c2 * us[i - 1] + c3 * us[i - 2]
      }
      return { us }
    },
  })
}
