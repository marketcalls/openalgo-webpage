/**
 * Reference implementation of the library's Chande Kroll Stop, for the parity
 * gate. The average true range is Wilder's: a running average with weight
 * 1 / p, seeded on bar p - 1 with the simple average of the first p true
 * ranges (the first bar's true range is its high minus its low). The first
 * stops are the highest high less x ranges and the lowest low plus x ranges
 * over p bars; the short stop is the highest first high stop and the long stop
 * the lowest first low stop over q bars.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-chande-kroll-stop",
    name: "Chande Kroll Stop",
    category: "Volatility",
    placement: "onchart",
    inputs: [
      { key: "atrLength", type: "number", label: "ATR Length", default: 10, min: 1, step: 1 },
      { key: "multiplier", type: "number", label: "ATR Multiplier", default: 1, min: 0, step: 0.1 },
      { key: "stopLength", type: "number", label: "Stop Length", default: 9, min: 1, step: 1 },
    ],
    plots: [
      { key: "stopLong", type: "line", title: "Stop Long" },
      { key: "stopShort", type: "line", title: "Stop Short" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const p = settings.atrLength
      const x = settings.multiplier
      const q = settings.stopLength
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      const tr = bars.map((b, i) =>
        i === 0 ? b.high - b.low : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close)),
      )
      const atr = new Array(n).fill(null)
      for (let i = p - 1; i < n; i++) {
        if (i === p - 1) {
          let s = 0
          for (let k = 0; k < p; k++) s += tr[k]
          atr[i] = s / p
        } else {
          atr[i] = (atr[i - 1] * (p - 1) + tr[i]) / p
        }
      }
      const extreme = (values, len, pickMax) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          let best = pickMax ? -Infinity : Infinity
          for (let k = i - len + 1; k <= i; k++) {
            if (na(values[k])) return null
            best = pickMax ? Math.max(best, values[k]) : Math.min(best, values[k])
          }
          return best
        })
      const hh = extreme(bars.map((b) => b.high), p, true)
      const ll = extreme(bars.map((b) => b.low), p, false)
      const firstHigh = hh.map((h, i) => (na(h) || na(atr[i]) ? null : h - x * atr[i]))
      const firstLow = ll.map((l, i) => (na(l) || na(atr[i]) ? null : l + x * atr[i]))
      return { stopLong: extreme(firstLow, q, false), stopShort: extreme(firstHigh, q, true) }
    },
  })
}
