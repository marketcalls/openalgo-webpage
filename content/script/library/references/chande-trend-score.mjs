/**
 * Reference implementation of the library's Chande Trend Score, for the parity
 * gate.
 *
 * Tushar Chande's score compares this bar's source with its value at each of
 * ten lags, 11 through 20 bars back by default. Each comparison adds 1 when the
 * source is above the older value and subtracts 1 otherwise (a tie counts as
 * not above), so the score runs from minus the lag count to plus it. The
 * published description scores above as plus 1 and below as minus 1 without
 * naming the tie; this study counts a tie as minus 1.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-chande-trend-score",
    name: "Chande Trend Score",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "firstLag", type: "number", label: "First Lookback", default: 11, min: 1, step: 1 },
      { key: "lags", type: "number", label: "Number of Lookbacks", default: 10, min: 1, step: 1 },
    ],
    plots: [{ key: "score", type: "histogram", title: "Trend Score" }],
    levels: [{ value: 0, title: "Zero" }],
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
      const first = settings.firstLag
      const last = settings.firstLag + settings.lags - 1
      const score = src.map((x, i) => {
        if (i < last) return null
        let s = 0
        for (let k = first; k <= last; k++) s += x > src[i - k] ? 1 : -1
        return s
      })
      return { score }
    },
  })
}
