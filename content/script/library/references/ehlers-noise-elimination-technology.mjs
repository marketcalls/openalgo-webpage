/**
 * Reference implementation of the library's Ehlers Noise Elimination
 * Technology (NET), for the parity gate. The study is openalgo's own, so this
 * file states the same calculation in plain JavaScript on the chart's
 * indicator contract, and the gate runs both.
 *
 * The oscillator is MyRSI on the unsmoothed source: over the last `rsiLength`
 * changes, (rises - falls) / (rises + falls); a window in which nothing moved
 * keeps the previous value (0 before the first one). NET is a
 * Kendall rank correlation of the last `netLength` oscillator values against
 * a straight line rising toward the current bar: every pair of values adds 1
 * when the newer one is higher, takes away 1 when it is lower and adds nothing
 * on a tie, and the total is divided by the number of pairs, n(n-1)/2.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ehlers-noise-elimination-technology",
    name: "Ehlers Noise Elimination Technology (NET)",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "rsiLength", type: "number", label: "MyRSI Length", default: 14, min: 1, step: 1 },
      { key: "netLength", type: "number", label: "NET Length", default: 14, min: 2, step: 1 },
      { key: "showMyRsi", type: "boolean", label: "Show MyRSI", default: true },
    ],
    plots: [
      { key: "net", type: "line", title: "NET" },
      { key: "myrsi", type: "line", title: "MyRSI" },
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
      const L = settings.rsiLength
      const N = settings.netLength

      const osc = new Array(n).fill(null)
      let last = 0
      for (let i = L; i < n; i++) {
        let cu = 0
        let cd = 0
        for (let k = 0; k < L; k++) {
          const d = src[i - k] - src[i - k - 1]
          if (d > 0) cu = cu + d
          if (d < 0) cd = cd - d
        }
        const total = cu + cd
        if (total !== 0) last = (cu - cd) / total
        osc[i] = last
      }

      const net = new Array(n).fill(null)
      const denom = (N * (N - 1)) / 2
      for (let i = 0; i < n; i++) {
        if (i - (N - 1) < 0 || osc[i - (N - 1)] === null) continue
        let num = 0
        // Position c is c bars back; every older value is compared with
        // every newer one.
        for (let c = 1; c < N; c++) {
          for (let k = 0; k < c; k++) num = num - Math.sign(osc[i - c] - osc[i - k])
        }
        net[i] = num / denom
      }
      return { net, myrsi: settings.showMyRsi ? osc : osc.map(() => null) }
    },
  })
}
