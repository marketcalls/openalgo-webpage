/**
 * Reference implementation of the library's SMI Ergodic Indicator, for the
 * parity gate. The bar to bar change of the source and its magnitude are each
 * smoothed by a long and then a short exponential average; the indicator is
 * 100 times their ratio (the true strength index). The signal line is an
 * exponential average of the indicator, and the oscillator is the indicator
 * minus the signal.
 *
 * Every exponential average is seeded with the simple average of its first
 * `len` present values. The first bar has no change.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-smi-ergodic-indicator",
    name: "SMI Ergodic Indicator",
    category: "Momentum",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "longLength", type: "number", label: "Long Length", default: 20, min: 1, step: 1 },
      { key: "shortLength", type: "number", label: "Short Length", default: 5, min: 1, step: 1 },
      { key: "signalLength", type: "number", label: "Signal Length", default: 5, min: 1, step: 1 },
    ],
    plots: [
      { key: "osc", type: "histogram", title: "Oscillator" },
      { key: "smi", type: "line", title: "SMI" },
      { key: "signal", type: "line", title: "Signal" },
    ],
    calc(bars, settings) {
      const n = bars.length
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
      const emaSeeded = (values, p) => {
        const out = new Array(n).fill(null)
        const a = 2 / (p + 1)
        let e = null
        let sum = 0
        let count = 0
        for (let i = 0; i < n; i++) {
          const v = values[i]
          if (v === null) continue
          if (e === null) {
            sum += v
            count += 1
            if (count === p) e = sum / p
          } else {
            e = v * a + e * (1 - a)
          }
          out[i] = e
        }
        return out
      }
      const mom = src.map((x, i) => (i === 0 ? null : x - src[i - 1]))
      const size = mom.map((v) => (v === null ? null : Math.abs(v)))
      const num = emaSeeded(emaSeeded(mom, settings.longLength), settings.shortLength)
      const den = emaSeeded(emaSeeded(size, settings.longLength), settings.shortLength)
      const smi = num.map((x, i) => (x === null || den[i] === null || den[i] === 0 ? null : (100 * x) / den[i]))
      const signal = emaSeeded(smi, settings.signalLength)
      const osc = smi.map((x, i) => (x === null || signal[i] === null ? null : x - signal[i]))
      return { osc, smi, signal }
    },
  })
}
