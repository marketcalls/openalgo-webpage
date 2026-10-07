/**
 * Reference implementation of the library's Wilder Volatility Stop, for the
 * parity gate. J. Welles Wilder's volatility stop and reverse:
 *
 * - ATR is Wilder's average true range over `atrLength` bars (seeded with the
 *   simple average of the first window; the first bar's true range is its
 *   high minus its low), and ARC = `arcConstant` times ATR.
 * - The significant close (SIC) is the highest close since a long trade began,
 *   or the lowest close since a short trade began. The stop sits ARC below SIC
 *   while long and ARC above it while short.
 * - A close beyond the previous bar's stop reverses the position; SIC restarts
 *   at that close. The first bar with an ATR starts long (the published method
 *   leaves the first position to the trader).
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-wilder-volatility-stop",
    name: "Wilder Volatility Stop",
    category: "Volatility",
    placement: "onchart",
    inputs: [
      { key: "atrLength", type: "number", label: "ATR Length", default: 7, min: 1, step: 1 },
      { key: "arcConstant", type: "number", label: "ARC Constant", default: 3.0, min: 0.1, step: 0.1 },
      { key: "showSignals", type: "boolean", label: "Show Reversals", default: true },
    ],
    plots: [
      { key: "longStop", type: "line", title: "Long Stop" },
      { key: "shortStop", type: "line", title: "Short Stop" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.atrLength
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

      const longStop = new Array(n).fill(null)
      const shortStop = new Array(n).fill(null)
      const markers = []
      let dir = 0
      let sic = null
      let stop = null
      for (let i = 0; i < n; i++) {
        if (atr[i] === null) continue
        const c = bars[i].close
        const arc = settings.arcConstant * atr[i]
        if (dir === 0) {
          dir = 1
          sic = c
        } else if (dir === 1 && c < stop) {
          dir = -1
          sic = c
          if (settings.showSignals) markers.push({ time: bars[i].time, kind: "short" })
        } else if (dir === -1 && c > stop) {
          dir = 1
          sic = c
          if (settings.showSignals) markers.push({ time: bars[i].time, kind: "long" })
        } else sic = dir === 1 ? Math.max(sic, c) : Math.min(sic, c)
        stop = dir === 1 ? sic - arc : sic + arc
        if (dir === 1) longStop[i] = stop
        else shortStop[i] = stop
      }
      return { longStop, shortStop, _markers: markers }
    },
    markers({ values }) {
      return values._markers
    },
  })
}
