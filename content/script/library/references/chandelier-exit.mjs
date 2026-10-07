/**
 * Reference implementation of the library's Chandelier Exit, for the parity
 * gate.
 *
 * Charles LeBeau's chandelier: the long stop hangs `mult` average true ranges
 * below the highest high of the last `length` bars, and the short stop the same
 * distance above the lowest low. The average true range is Wilder's average,
 * seeded with the simple average of the first `length` true ranges; the first
 * bar's true range is its high minus its low.
 *
 * The side starts long on the first bar both stops exist. While long, a close
 * below the previous bar's long stop turns it short; while short, a close above
 * the previous bar's short stop turns it long. Only the stop of the side in
 * force is drawn, and each turn is a buy or sell mark.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-chandelier-exit",
    name: "Chandelier Exit",
    category: "Volatility",
    placement: "onchart",
    inputs: [
      { key: "length", type: "number", label: "ATR Period", default: 22, min: 1, step: 1 },
      { key: "mult", type: "number", label: "ATR Multiplier", default: 3.0, min: 0, step: 0.1 },
      { key: "showSignals", type: "boolean", label: "Show Buy/Sell Marks", default: true },
    ],
    plots: [
      { key: "longStop", type: "line", title: "Long Stop" },
      { key: "shortStop", type: "line", title: "Short Stop" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const atr = new Array(n).fill(null)
      {
        let sum = 0
        let prev = null
        for (let i = 0; i < n; i++) {
          const b = bars[i]
          const tr = i === 0 ? b.high - b.low : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close))
          if (i < len) {
            sum += tr
            if (i === len - 1) prev = sum / len
          } else prev = (prev * (len - 1) + tr) / len
          atr[i] = i >= len - 1 ? prev : null
        }
      }
      const longRaw = new Array(n).fill(null)
      const shortRaw = new Array(n).fill(null)
      for (let i = len - 1; i < n; i++) {
        let hh = -Infinity
        let ll = Infinity
        for (let k = i - len + 1; k <= i; k++) {
          hh = Math.max(hh, bars[k].high)
          ll = Math.min(ll, bars[k].low)
        }
        longRaw[i] = hh - settings.mult * atr[i]
        shortRaw[i] = ll + settings.mult * atr[i]
      }

      const dir = new Array(n).fill(null)
      const longStop = new Array(n).fill(null)
      const shortStop = new Array(n).fill(null)
      const markers = []
      for (let i = 0; i < n; i++) {
        if (longRaw[i] === null) continue
        const prev = i > 0 ? dir[i - 1] : null
        const c = bars[i].close
        let d
        if (prev === null) d = 1
        else if (prev === 1 && c < longRaw[i - 1]) d = -1
        else if (prev === -1 && c > shortRaw[i - 1]) d = 1
        else d = prev
        dir[i] = d
        if (d === 1) longStop[i] = longRaw[i]
        else shortStop[i] = shortRaw[i]
        if (settings.showSignals && prev !== null && d !== prev) markers.push({ time: bars[i].time, kind: d === 1 ? "buy" : "sell" })
      }
      return { longStop, shortStop, _markers: markers }
    },
    markers({ values }) {
      return values._markers
    },
  })
}
