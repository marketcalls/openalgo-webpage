/**
 * Reference implementation of the library's Trend Detection Index, for the
 * parity gate. Momentum is the change of the source over `length` bars. The
 * direction is the sum of momentum over `length` bars, and the index is the
 * absolute value of that sum less the absolute momentum of the `length` bars
 * before them (the absolute sum over `2 * length` bars minus the absolute sum
 * over `length` bars). Window sums are absent while any value in the window is.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-trend-detection-index",
    name: "Trend Detection Index (TDI)",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "length", type: "number", label: "Length", default: 20, min: 1, step: 1 },
    ],
    plots: [
      { key: "tdi", type: "line", title: "TDI" },
      { key: "direction", type: "line", title: "Direction" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
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
      const windowSum = (values, w) =>
        values.map((_, i) => {
          if (i < w - 1) return null
          let s = 0
          for (let k = i - w + 1; k <= i; k++) {
            if (na(values[k])) return null
            s += values[k]
          }
          return s
        })
      const mom = src.map((x, i) => (i >= len ? x - src[i - len] : null))
      const absMom = mom.map((m) => (na(m) ? null : Math.abs(m)))
      const direction = windowSum(mom, len)
      const absShort = windowSum(absMom, len)
      const absLong = windowSum(absMom, 2 * len)
      const tdi = direction.map((d, i) => (na(d) || na(absShort[i]) || na(absLong[i]) ? null : Math.abs(d) - (absLong[i] - absShort[i])))
      return { tdi, direction }
    },
  })
}
