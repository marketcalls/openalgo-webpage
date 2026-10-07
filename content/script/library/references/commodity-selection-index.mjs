/**
 * Reference implementation of the library's Commodity Selection Index, for
 * the parity gate. J. Welles Wilder's index multiplies trend strength (ADXR)
 * by volatility (the average true range) and by a constant built from the
 * contract's point value, its margin and the commission:
 *
 *   CSI = ADXR * ATR * pointValue / sqrt(margin) / (150 + commission) * 100
 *
 * With `atrPercent` on, the average true range is taken as a percentage of
 * the close, so the index compares across instruments and price levels.
 *
 * Every average is Wilder's smoothing, seeded with a simple average of its
 * first `len` values. ADXR is the mean of this bar's ADX and the ADX `len`
 * bars ago, as in Wilder's own definition.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-commodity-selection-index",
    name: "Commodity Selection Index (CSI)",
    category: "Trend Strength",
    placement: "pane",
    inputs: [
      { key: "len", type: "number", label: "Length", default: 14, min: 2, step: 1 },
      { key: "atrPercent", type: "boolean", label: "ATR as Percent of Close", default: true },
      { key: "pointValue", type: "number", label: "Point Value", default: 1, min: 0.0001, step: 0.1 },
      { key: "margin", type: "number", label: "Margin", default: 1, min: 0.0001, step: 0.1 },
      { key: "commission", type: "number", label: "Commission", default: 0, min: 0, step: 0.1 },
    ],
    plots: [{ key: "csi", type: "line", title: "CSI" }],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.len
      // Wilder's smoothing of a series that may start absent: the first value
      // is the simple average of the first `len` present values.
      const wilder = (values) => {
        const out = new Array(n).fill(null)
        let count = 0
        let sum = 0
        let prev = null
        for (let i = 0; i < n; i++) {
          const v = values[i]
          if (v === null) continue
          if (prev === null) {
            sum += v
            count++
            if (count < len) continue
            prev = sum / len
          } else prev = (prev * (len - 1) + v) / len
          out[i] = prev
        }
        return out
      }
      const tr = bars.map((b, i) =>
        i === 0 ? b.high - b.low : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close)),
      )
      const trFrom1 = tr.map((v, i) => (i === 0 ? null : v))
      const plusDM = bars.map((b, i) => {
        if (i === 0) return null
        const up = b.high - bars[i - 1].high
        const down = bars[i - 1].low - b.low
        return up > down && up > 0 ? up : 0
      })
      const minusDM = bars.map((b, i) => {
        if (i === 0) return null
        const up = b.high - bars[i - 1].high
        const down = bars[i - 1].low - b.low
        return down > up && down > 0 ? down : 0
      })
      const sTR = wilder(trFrom1)
      const sPlus = wilder(plusDM)
      const sMinus = wilder(minusDM)
      const dx = sTR.map((t, i) => {
        if (t === null || t === 0) return null
        const pdi = (100 * sPlus[i]) / t
        const mdi = (100 * sMinus[i]) / t
        const s = pdi + mdi
        return s === 0 ? null : (100 * Math.abs(pdi - mdi)) / s
      })
      const adx = wilder(dx)
      const adxr = adx.map((a, i) => (a === null || i < len || adx[i - len] === null ? null : (a + adx[i - len]) / 2))
      const atr = wilder(tr)
      const k = (settings.pointValue / Math.sqrt(settings.margin) / (150 + settings.commission)) * 100
      const csi = adxr.map((r, i) => {
        if (r === null || atr[i] === null) return null
        const vol = settings.atrPercent ? (atr[i] / bars[i].close) * 100 : atr[i]
        return r * vol * k
      })
      return { csi }
    },
  })
}
