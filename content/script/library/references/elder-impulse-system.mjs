/**
 * Reference implementation of the library's Elder Impulse System, for the
 * parity gate.
 *
 * Alexander Elder's impulse: a bar is green when both the exponential average
 * of the close and the MACD histogram rose from the previous bar, red when both
 * fell, and blue otherwise. Every exponential average is seeded with the simple
 * average of its first values. The MACD line is the fast average minus the slow
 * one, its signal an exponential average of the line, and the histogram the
 * line minus the signal. A bar is painted only once both readings have a
 * previous value to compare with.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-elder-impulse-system",
    name: "Elder Impulse System",
    category: "Trend Strength",
    placement: "onchart",
    inputs: [
      { key: "emaLength", type: "number", label: "EMA Length", default: 13, min: 1, step: 1 },
      { key: "fastLength", type: "number", label: "MACD Fast Length", default: 12, min: 1, step: 1 },
      { key: "slowLength", type: "number", label: "MACD Slow Length", default: 26, min: 1, step: 1 },
      { key: "signalLength", type: "number", label: "MACD Signal Length", default: 9, min: 1, step: 1 },
    ],
    plots: [{ key: "ema", type: "line", title: "EMA" }],
    calc(bars, settings) {
      const n = bars.length
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      const ema = (values, len) => {
        const out = new Array(n).fill(null)
        const alpha = 2 / (len + 1)
        let e = null
        let sum = 0
        let count = 0
        for (let i = 0; i < n; i++) {
          const x = values[i]
          if (na(x)) continue
          if (e === null) {
            sum += x
            count++
            if (count === len) e = sum / len
          } else e = alpha * x + (1 - alpha) * e
          out[i] = e
        }
        return out
      }
      const close = bars.map((b) => b.close)
      const trend = ema(close, settings.emaLength)
      const fast = ema(close, settings.fastLength)
      const slow = ema(close, settings.slowLength)
      const line = fast.map((f, i) => (na(f) || na(slow[i]) ? null : f - slow[i]))
      const sig = ema(line, settings.signalLength)
      const hist = line.map((m, i) => (na(m) || na(sig[i]) ? null : m - sig[i]))

      const colours = new Array(n).fill(null)
      for (let i = 1; i < n; i++) {
        if (na(trend[i]) || na(trend[i - 1]) || na(hist[i]) || na(hist[i - 1])) continue
        const up = trend[i] > trend[i - 1] && hist[i] > hist[i - 1]
        const down = trend[i] < trend[i - 1] && hist[i] < hist[i - 1]
        colours[i] = up ? "green" : down ? "red" : "blue"
      }
      return { ema: trend, _colours: colours }
    },
    barColors({ values }) {
      return values._colours
    },
  })
}
