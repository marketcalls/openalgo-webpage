/**
 * Reference implementation of the library's Twiggs Money Flow, for the parity
 * gate. The study is openalgo's own, so this file states the same calculation
 * in plain JavaScript on the chart's indicator contract, and the gate runs both.
 *
 * The true high is the higher of the high and the previous close, the true low
 * the lower of the low and the previous close (the first bar uses its own high
 * and low). Each bar's flow is volume * ((close - TL) - (TH - close)) / (TH - TL),
 * zero when TH equals TL. TMF is the Wilder average (weight 1 / length, seeded
 * with the simple average of the first `length` values) of the flow divided by
 * the same average of volume.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-twiggs-money-flow",
    name: "Twiggs Money Flow",
    category: "Volume",
    placement: "pane",
    inputs: [{ key: "length", type: "number", label: "Length", default: 21, min: 1, step: 1 }],
    plots: [{ key: "tmf", type: "line", title: "TMF" }],
    calc(bars, s) {
      const n = bars.length
      const len = s.length
      const adv = bars.map((b, i) => {
        const th = i > 0 ? Math.max(b.high, bars[i - 1].close) : b.high
        const tl = i > 0 ? Math.min(b.low, bars[i - 1].close) : b.low
        const range = th - tl
        return range === 0 ? 0 : (b.volume * (b.close - tl - (th - b.close))) / range
      })
      const vol = bars.map((b) => b.volume)
      const rma = (arr) => {
        const out = new Array(n).fill(null)
        for (let i = len - 1; i < n; i++) {
          if (i === len - 1) {
            let sum = 0
            for (let k = 0; k < len; k++) sum += arr[k]
            out[i] = sum / len
          } else out[i] = arr[i] / len + out[i - 1] * (1 - 1 / len)
        }
        return out
      }
      const a = rma(adv)
      const v = rma(vol)
      const tmf = a.map((x, i) => (x === null || !v[i] ? null : x / v[i]))
      return { tmf }
    },
  })
}
