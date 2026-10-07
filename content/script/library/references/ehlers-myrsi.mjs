/**
 * Reference implementation of the library's Ehlers MyRSI, for the parity gate.
 * The study is openalgo's own, so this file states the same calculation in
 * plain JavaScript on the chart's indicator contract, and the gate runs both.
 *
 * The source is smoothed by a two-pole super smoother (damping of the square
 * root of two) run on the average of this bar's and the previous bar's value;
 * it starts as the source itself on its first two bars. Over the last
 * `rsiLength` changes of the smoothed price, the rises (CU) and the falls (CD)
 * are summed and the study is (CU - CD) / (CU + CD), from -1 to 1. A window
 * with no movement keeps the previous value (0 before the first one), as
 * Ehlers' definition does. Defaults follow his smoothed MyRSI: a smooth
 * length of 8 and an RSI length of 14.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-myrsi",
    name: "Ehlers MyRSI",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "smoothLength", type: "number", label: "Smooth Length", default: 8, min: 2, step: 1 },
      { key: "rsiLength", type: "number", label: "RSI Length", default: 14, min: 1, step: 1 },
    ],
    plots: [{ key: "myrsi", type: "line", title: "MyRSI" }],
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
      const L = settings.rsiLength
      const arg = (Math.SQRT2 * Math.PI) / settings.smoothLength
      const a1 = Math.exp(-arg)
      const c2 = 2 * a1 * Math.cos(arg)
      const c3 = -a1 * a1
      const c1 = 1 - c2 - c3

      const filt = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (i < 2) filt[i] = src[i]
        else filt[i] = (c1 * (src[i] + src[i - 1])) / 2 + c2 * filt[i - 1] + c3 * filt[i - 2]
      }

      const myrsi = new Array(n).fill(null)
      let last = 0
      for (let i = L; i < n; i++) {
        let cu = 0
        let cd = 0
        for (let k = 0; k < L; k++) {
          const d = filt[i - k] - filt[i - k - 1]
          if (d > 0) cu = cu + d
          if (d < 0) cd = cd - d
        }
        const total = cu + cd
        if (total !== 0) last = (cu - cd) / total
        myrsi[i] = last
      }
      return { myrsi }
    },
  })
}
