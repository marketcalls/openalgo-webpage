/**
 * Reference implementation of the library's Trend Thrust Indicator, for the
 * parity gate.
 *
 * A fast and a slow volume-weighted average of the source (sum of source
 * times volume over the window, divided by the sum of volume). The volume
 * multiple is the fast simple average of volume divided by the slow one.
 * The volume-enhanced fast average is the fast volume-weighted average times
 * the squared multiple; the volume-enhanced slow average is the slow one times
 * the squared reciprocal of the multiple. The indicator is the first minus the
 * second. The author describes a volume-adaptive signal line around a 9 bar
 * base; this study uses the fixed-length form, a simple average of the
 * indicator over the signal length. Every average is absent until its window
 * is full.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-trend-thrust-indicator",
    name: "Trend Thrust Indicator (TTI)",
    category: "Volume",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "fastLength", type: "number", label: "Fast Length", default: 12, min: 1, step: 1 },
      { key: "slowLength", type: "number", label: "Slow Length", default: 26, min: 1, step: 1 },
      { key: "signalLength", type: "number", label: "Signal Length", default: 9, min: 1, step: 1 },
    ],
    plots: [
      { key: "tti", type: "line", title: "TTI" },
      { key: "signal", type: "line", title: "Signal" },
    ],
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
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      const src = bars.map(pick)
      const vol = bars.map((b) => b.volume)
      // A windowed sum, absent while any value in the window is absent.
      const windowSum = (values, len) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          let s = 0
          for (let k = i - len + 1; k <= i; k++) {
            if (na(values[k])) return null
            s += values[k]
          }
          return s
        })
      const sma = (values, len) => windowSum(values, len).map((s) => (na(s) ? null : s / len))
      const pv = src.map((x, i) => x * vol[i])
      const vwma = (len) => {
        const num = windowSum(pv, len)
        const den = windowSum(vol, len)
        return num.map((s, i) => (na(s) || na(den[i]) || den[i] === 0 ? null : s / den[i]))
      }
      const fastVw = vwma(settings.fastLength)
      const slowVw = vwma(settings.slowLength)
      const fastVol = sma(vol, settings.fastLength)
      const slowVol = sma(vol, settings.slowLength)
      const tti = src.map((_, i) => {
        if (na(fastVw[i]) || na(slowVw[i]) || na(fastVol[i]) || na(slowVol[i])) return null
        if (fastVol[i] === 0 || slowVol[i] === 0) return null
        const multiple = fastVol[i] / slowVol[i]
        const enhancedFast = fastVw[i] * multiple * multiple
        const enhancedSlow = slowVw[i] * (1 / multiple) * (1 / multiple)
        return enhancedFast - enhancedSlow
      })
      const signal = sma(tti, settings.signalLength)
      return { tti, signal }
    },
  })
}
