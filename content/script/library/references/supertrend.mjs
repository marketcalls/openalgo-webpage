/**
 * Reference implementation of the library's Supertrend, for the parity gate.
 *
 * The bands start from hl2 plus and minus `factor` times the average true
 * range (Wilder's smoothing, seeded with a simple average, the first bar's
 * true range being its high minus its low). Each band only tightens while the
 * close stays on its side; the direction flips when the close crosses the band
 * the line is on. The line is blank on the first bar.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-supertrend",
    name: "Supertrend",
    category: "Trend Strength",
    placement: "onchart",
    inputs: [
      { key: "atrPeriod", type: "number", label: "ATR Length", default: 10, min: 1, step: 1 },
      { key: "factor", type: "number", label: "Factor", default: 3.0, min: 0.01, step: 0.01 },
    ],
    plots: [
      { key: "up", type: "line", title: "Up Trend" },
      { key: "down", type: "line", title: "Down Trend" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.atrPeriod
      const factor = settings.factor
      const nz = (v) => (v === null || Number.isNaN(v) ? 0 : v)
      const isNa = (v) => v === null || Number.isNaN(v)

      // Average true range: Wilder's moving average, seeded with the simple
      // average of the first `len` true ranges.
      const atr = new Array(n).fill(null)
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

      const up = new Array(n).fill(null)
      const down = new Array(n).fill(null)
      let lowerPrev = null
      let upperPrev = null
      let stPrev = null
      for (let i = 0; i < n; i++) {
        const b = bars[i]
        const src = (b.high + b.low) / 2
        const a = atr[i]
        let lower = isNa(a) ? null : src - factor * a
        let upper = isNa(a) ? null : src + factor * a
        const pl = nz(lowerPrev)
        const pu = nz(upperPrev)
        const prevClose = i > 0 ? bars[i - 1].close : null
        // A comparison with an absent value is false.
        lower = (lower !== null && lower > pl) || (prevClose !== null && prevClose < pl) ? lower : pl
        upper = (upper !== null && upper < pu) || (prevClose !== null && prevClose > pu) ? upper : pu
        let dir
        if (i === 0 || isNa(atr[i - 1])) dir = 1
        else if (stPrev !== null && stPrev === pu) dir = upper !== null && b.close > upper ? -1 : 1
        else dir = lower !== null && b.close < lower ? 1 : -1
        let st = dir === -1 ? lower : upper
        lowerPrev = lower
        upperPrev = upper
        stPrev = st
        if (i === 0) st = null
        up[i] = dir < 0 ? st : null
        down[i] = dir < 0 ? null : st
      }
      return { up, down }
    },
  })
}
