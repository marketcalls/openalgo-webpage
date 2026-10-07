/**
 * Reference implementation of the library's Ehlers Truncated Bandpass Filter,
 * for the parity gate.
 *
 * The bandpass coefficients follow John Ehlers' definition: L1 = cos(2 pi /
 * period), G1 = cos(bandwidth * 2 pi / period), S1 = 1 / G1 - sqrt(1 / G1^2 - 1).
 * The ordinary filter runs over the whole history and is zero on the first
 * three bars. The truncated filter restarts every bar from zero, `length` bars
 * back, and runs the same recursion forward to this bar, so it has no memory
 * older than `length` bars. It is absent until `length + 1` earlier bars exist.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-truncated-bandpass-filter",
    name: "Ehlers Truncated Bandpass Filter",
    category: "Cycles",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "period", type: "number", label: "Period", default: 20, min: 4, step: 1 },
      { key: "bandwidth", type: "number", label: "Bandwidth", default: 0.1, min: 0.01, max: 0.5, step: 0.01 },
      { key: "length", type: "number", label: "Length", default: 10, min: 1, max: 100, step: 1 },
    ],
    plots: [
      { key: "bpt", type: "line", title: "Truncated BP" },
      { key: "bp", type: "line", title: "Bandpass" },
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
      const src = bars.map(pick)
      const n = src.length
      const { period, bandwidth, length } = settings
      const L1 = Math.cos((2 * Math.PI) / period)
      const G1 = Math.cos((bandwidth * 2 * Math.PI) / period)
      const S1 = 1 / G1 - Math.sqrt(1 / (G1 * G1) - 1)
      const gain = 0.5 * (1 - S1)
      const fb = L1 * (1 + S1)

      const bp = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (i < 3) bp[i] = 0
        else bp[i] = gain * (src[i] - src[i - 2]) + fb * bp[i - 1] - S1 * bp[i - 2]
      }

      const bpt = new Array(n).fill(null)
      for (let i = length + 1; i < n; i++) {
        let t1 = 0
        let t2 = 0
        for (let count = length; count >= 1; count--) {
          const v = gain * (src[i - count + 1] - src[i - count - 1]) + fb * t1 - S1 * t2
          t2 = t1
          t1 = v
        }
        bpt[i] = t1
      }
      return { bpt, bp }
    },
  })
}
