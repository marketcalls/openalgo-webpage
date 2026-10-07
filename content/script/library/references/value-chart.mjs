/**
 * Reference implementation of the library's Value Chart, for the parity gate.
 * Mark Helweg and David Stendahl's value chart restates every price of a bar
 * relative to a floating axis, in units of recent volatility:
 *
 *   axis  = SMA(hl2, len)
 *   block = max(1, round(len / 5)) bars
 *   unit  = 0.2 * the mean range of the last five blocks, where a block's
 *           range is its highest high less its lowest low
 *   value = (price - axis) / unit, for each of open, high, low and close
 *
 * This is the inventors' own construction: the unit always averages five
 * ranges, so it is a fifth of a typical block range. At the usual length of 5
 * a block is one bar and the unit is a fifth of the 5-bar average range. A
 * one-bar block with no range (high equal to low) counts the absolute change
 * from the previous close instead, as in their definition.
 *
 * The four values are drawn as candles. A bar whose unit is zero has none.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-value-chart",
    name: "Value Chart",
    category: "Oscillators",
    placement: "pane",
    inputs: [{ key: "len", type: "number", label: "Length", default: 5, min: 1, step: 1 }],
    plots: [{ key: "vc", type: "candlestick", title: "Value Chart", ohlc: { open: "vo", high: "vh", low: "vl", close: "vc" } }],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.len
      const axis = bars.map((_, i) => {
        if (i < len - 1) return null
        let s = 0
        for (let k = i - len + 1; k <= i; k++) s += (bars[k].high + bars[k].low) / 2
        return s / len
      })
      const blockLen = Math.max(1, Math.round(len / 5))
      // The range of the block of `blockLen` bars ending on bar i.
      const blockSize = bars.map((b, i) => {
        if (i < blockLen - 1) return null
        let hi = -Infinity
        let lo = Infinity
        for (let k = i - blockLen + 1; k <= i; k++) {
          hi = Math.max(hi, bars[k].high)
          lo = Math.min(lo, bars[k].low)
        }
        const range = hi - lo
        if (blockLen === 1 && range === 0) return i === 0 ? null : Math.abs(b.close - bars[i - 1].close)
        return range
      })
      const unit = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        let s = 0
        let ok = true
        for (let k = 0; k < 5; k++) {
          const j = i - k * blockLen
          if (j < 0 || blockSize[j] === null) {
            ok = false
            break
          }
          s += blockSize[j]
        }
        if (ok) unit[i] = (0.2 * s) / 5
      }
      const at = (key) => bars.map((b, i) => (axis[i] === null || !unit[i] ? null : (b[key] - axis[i]) / unit[i]))
      return { vo: at("open"), vh: at("high"), vl: at("low"), vc: at("close") }
    },
  })
}
