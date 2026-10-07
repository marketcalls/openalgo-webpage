/**
 * Reference implementation of the library's Candlestick Patterns, for the
 * parity gate. Each of the fifteen patterns is tested on every bar with the
 * same rules as the study; a test that reads a bar before the first one is
 * false. Every pattern that holds is one marker on that bar.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-candlestick-patterns",
    name: "Candlestick Patterns",
    category: "Reversals",
    placement: "onchart",
    inputs: [
      { key: "trend", type: "number", label: "Trend in Bars", default: 5, min: 1, step: 1 },
      { key: "dojiSize", type: "number", label: "Doji size", default: 0.05, min: 0.01, step: 0.01 },
    ],
    plots: [],
    calc() {
      return {}
    },
    markers({ bars, settings }) {
      const n = bars.length
      const T = settings.trend
      const out = []
      const O = (i, k = 0) => (i - k >= 0 ? bars[i - k].open : null)
      const H = (i, k = 0) => (i - k >= 0 ? bars[i - k].high : null)
      const L = (i, k = 0) => (i - k >= 0 ? bars[i - k].low : null)
      const C = (i, k = 0) => (i - k >= 0 ? bars[i - k].close : null)
      // The lowest low of the ten bars before this one.
      const lowestBefore = (i) => {
        if (i < 10) return null
        let lo = Infinity
        for (let k = 1; k <= 10; k++) lo = Math.min(lo, bars[i - k].low)
        return lo
      }
      for (let i = 0; i < n; i++) {
        const o = O(i)
        const h = H(i)
        const l = L(i)
        const c = C(i)
        const o1 = O(i, 1)
        const c1 = C(i, 1)
        const h1 = H(i, 1)
        const l1 = L(i, 1)
        const oT = O(i, T)
        const has1 = o1 !== null
        const hasT = oT !== null
        const body = Math.abs(o - c)
        const range = h - l
        const tests = [
          body <= range * settings.dojiSize,
          has1 && hasT && c1 > o1 && o > c && o <= c1 && o1 <= c && o - c < c1 - o1 && oT < o,
          has1 && hasT && o1 > c1 && c > o && c <= o1 && c1 <= o && c - o < o1 - c1 && oT > o,
          has1 && hasT && c1 > o1 && o > c && o >= c1 && o1 >= c && o - c > c1 - o1 && oT < o,
          has1 && hasT && o1 > c1 && c > o && c >= o1 && c1 >= o && c - o > o1 - c1 && oT > o,
          has1 && hasT && c1 < o1 && o < l1 && c > c1 + (o1 - c1) / 2 && c < o1 && oT > o,
          (() => {
            const lower = lowestBefore(i)
            return has1 && hasT && lower !== null && l === o && o < lower && o < c && c > (h1 - l1) / 2 + l1 && oT > o
          })(),
          has1 && hasT && o1 > c1 && o >= o1 && c > o && oT > o,
          has1 && hasT && o1 < c1 && o <= o1 && c <= o && oT < o,
          i >= 2 && hasT && range > 4 * body && (c - l) / (0.001 + range) >= 0.75 && (o - l) / (0.001 + range) >= 0.75 && oT < o && h1 < o && H(i, 2) < o,
          i >= 2 && C(i, 2) > O(i, 2) && Math.min(o1, c1) > C(i, 2) && o < Math.min(o1, c1) && c < o,
          i >= 2 && C(i, 2) < O(i, 2) && Math.max(o1, c1) < C(i, 2) && o > Math.max(o1, c1) && c > o,
          has1 && o1 < c1 && o > c1 && h - Math.max(o, c) >= body * 3 && Math.min(c, o) - l <= body,
          range > 3 * body && (c - l) / (0.001 + range) > 0.6 && (o - l) / (0.001 + range) > 0.6,
          range > 3 * body && (h - c) / (0.001 + range) > 0.6 && (h - o) / (0.001 + range) > 0.6,
        ]
        for (const t of tests) if (t) out.push({ time: bars[i].time })
      }
      return out
    },
  })
}
