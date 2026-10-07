/**
 * Reference implementation of the library's Fractal Dimension Index, for the
 * parity gate. Carlos Sevcik's estimate: the last `length` values are mapped
 * onto the unit square (time from 0 to 1, price from the window's lowest to
 * its highest), the lengths of the straight segments joining them are summed
 * into L, and FDI = 1 + (ln L + ln 2) / ln(2 * (length - 1)). Sevcik's own
 * estimate leaves out the ln 2; the widely documented index keeps it, so a
 * full-range zigzag reads 2 and a random walk about 1.5. A window with no
 * range is a flat path of length 1.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-fractal-dimension-index",
    name: "Fractal Dimension Index (FDI)",
    category: "Statistics",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Length", default: 30, min: 2, step: 1 },
    ],
    plots: [{ key: "fdi", type: "line", title: "FDI" }],
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
      const n = settings.length
      const dx = 1 / (n - 1)
      const fdi = src.map((_, i) => {
        if (i < n - 1) return null
        let hi = -Infinity
        let lo = Infinity
        for (let k = i - n + 1; k <= i; k++) {
          hi = Math.max(hi, src[k])
          lo = Math.min(lo, src[k])
        }
        const range = hi - lo
        let L = 0
        for (let k = i - n + 2; k <= i; k++) {
          const dy = range > 0 ? (src[k] - src[k - 1]) / range : 0
          L += Math.sqrt(dy * dy + dx * dx)
        }
        return 1 + (Math.log(L) + Math.log(2)) / Math.log(2 * (n - 1))
      })
      return { fdi }
    },
  })
}
