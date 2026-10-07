/**
 * Reference implementation of the library's Ehlers Rocket RSI, for the parity
 * gate. The study is openalgo's own, so this file states the same calculation
 * in plain JavaScript on the chart's indicator contract, and the gate runs both.
 *
 * Momentum is the source minus the source `rsiLength - 1` bars back. A
 * two-pole super smoother (damping of the square root of two) is run on the
 * average of this bar's and the previous bar's momentum; it starts as the
 * momentum itself on its first two bars. Over the last `rsiLength` changes of
 * the smoothed momentum, the rises and the falls are summed, and their
 * balance (up - down) / (up + down) is held inside plus and minus 0.999 and
 * passed through the Fisher transform. A window with no movement at all keeps
 * the previous balance (0 before the first one), as Ehlers' definition does.
 *
 * Defaults: Ehlers first published the study with a smooth length of 10 and
 * later restated it with 8 and an RSI length of 10; this study uses 8 and 10.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-rocket-rsi",
    name: "Ehlers Rocket RSI",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "smoothLength", type: "number", label: "Smooth Length", default: 8, min: 2, step: 1 },
      { key: "rsiLength", type: "number", label: "RSI Length", default: 10, min: 2, step: 1 },
      { key: "obosLevel", type: "number", label: "Overbought and Oversold Level", default: 2, min: 0, step: 0.1 },
    ],
    plots: [{ key: "rocket", type: "line", title: "Rocket RSI" }],
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

      const mom = src.map((x, i) => (i >= L - 1 ? x - src[i - (L - 1)] : null))
      const filt = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        if (mom[i] === null) continue
        const f1 = i >= 1 ? filt[i - 1] : null
        const f2 = i >= 2 ? filt[i - 2] : null
        const m1 = i >= 1 ? mom[i - 1] : null
        if (m1 === null || f1 === null || f2 === null) filt[i] = mom[i]
        else filt[i] = (c1 * (mom[i] + m1)) / 2 + c2 * f1 + c3 * f2
      }

      const rocket = new Array(n).fill(null)
      let balance = 0
      for (let i = 0; i < n; i++) {
        if (i - L < 0 || filt[i - L] === null) continue
        let cu = 0
        let cd = 0
        for (let k = 0; k < L; k++) {
          const d = filt[i - k] - filt[i - k - 1]
          if (d > 0) cu = cu + d
          if (d < 0) cd = cd - d
        }
        const total = cu + cd
        // A window with no movement at all keeps the previous balance.
        if (total !== 0) balance = (cu - cd) / total
        const r = Math.min(Math.max(balance, -0.999), 0.999)
        rocket[i] = 0.5 * Math.log((1 + r) / (1 - r))
      }
      return { rocket }
    },
  })
}
