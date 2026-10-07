/**
 * Reference implementation of the library's Volume Price Confirmation
 * Indicator, for the parity gate.
 *
 * VPC is the long volume-weighted average of the source minus its long simple
 * average, VPR the short volume-weighted average divided by the short simple
 * average, and VM the short simple average of volume divided by the long one.
 * VPCI = VPC * VPR * VM. The signal line smooths VPCI with a volume-weighted
 * average, the smoothing its author recommends. Every average is absent until
 * its window is full of present values.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-volume-price-confirmation-indicator",
    name: "Volume Price Confirmation Indicator (VPCI)",
    category: "Volume",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "shortLength", type: "number", label: "Short Length", default: 5, min: 1, step: 1 },
      { key: "longLength", type: "number", label: "Long Length", default: 20, min: 1, step: 1 },
      { key: "signalLength", type: "number", label: "Signal Length", default: 5, min: 1, step: 1 },
    ],
    plots: [
      { key: "vpci", type: "line", title: "VPCI" },
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
      const div = (a, b) => a.map((x, i) => (na(x) || na(b[i]) || b[i] === 0 ? null : x / b[i]))
      const sma = (values, len) => windowSum(values, len).map((s) => (na(s) ? null : s / len))
      const vwma = (values, len) => div(windowSum(values.map((x, i) => (na(x) ? null : x * vol[i])), len), windowSum(vol, len))
      const S = settings.shortLength
      const L = settings.longLength
      const vwLong = vwma(src, L)
      const smaLong = sma(src, L)
      const vpr = div(vwma(src, S), sma(src, S))
      const vm = div(sma(vol, S), sma(vol, L))
      const vpci = src.map((_, i) => {
        if (na(vwLong[i]) || na(smaLong[i]) || na(vpr[i]) || na(vm[i])) return null
        return (vwLong[i] - smaLong[i]) * vpr[i] * vm[i]
      })
      // The volume-weighted window needs VPCI present on every bar in it.
      const signal = vwma(vpci, settings.signalLength)
      return { vpci, signal }
    },
  })
}
