/**
 * Reference implementation of the library's Heikin Ashi Zero-Lag Average,
 * for the parity gate. Sylvain Vervoort's construction:
 *
 * - Heikin Ashi open: the midpoint of the previous open and the previous bar's
 *   mean price (open + high + low + close) / 4; on the first bar, the midpoint
 *   of the bar's own open and close.
 * - Heikin Ashi close, in Vervoort's form: the mean of the bar's mean price,
 *   the Heikin Ashi open, the higher of the high and that open, and the lower
 *   of the low and that open.
 * - Zero-lag average of a series: TEMA1 = TEMA(series, n), TEMA2 =
 *   TEMA(TEMA1, n), line = TEMA1 + (TEMA1 - TEMA2). TEMA is 3 * e1 - 3 * e2 +
 *   e3 over three nested exponential averages, each seeded with the simple
 *   average of its first n values.
 *
 * The same zero-lag average of a price source gives the second line, and a
 * crossing of the two lines is a marker.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-zero-lag-heikin-ashi",
    name: "Heikin Ashi Zero-Lag Average",
    category: "Price",
    placement: "onchart",
    inputs: [
      { key: "length", type: "number", label: "Average Length", default: 55, min: 1, step: 1 },
      { key: "src", type: "source", label: "Price Line Source", default: "hlc3" },
      { key: "showSignals", type: "boolean", label: "Show Crossings", default: true },
    ],
    plots: [
      { key: "zlHa", type: "line", title: "Zero-Lag Heikin Ashi" },
      { key: "zlPrice", type: "line", title: "Zero-Lag Price" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const pick = (b) => {
        switch (settings.src) {
          case "open": return b.open
          case "high": return b.high
          case "low": return b.low
          case "close": return b.close
          case "hl2": return (b.high + b.low) / 2
          case "ohlc4": return (b.open + b.high + b.low + b.close) / 4
          default: return (b.high + b.low + b.close) / 3
        }
      }
      const ema = (values) => {
        const out = new Array(n).fill(null)
        const a = 2 / (len + 1)
        let count = 0
        let sum = 0
        let e = null
        for (let i = 0; i < n; i++) {
          const v = values[i]
          if (v === null) continue
          if (e === null) {
            count++
            sum += v
            if (count === len) e = sum / len
          } else e = a * v + (1 - a) * e
          out[i] = e
        }
        return out
      }
      const tema = (values) => {
        const e1 = ema(values)
        const e2 = ema(e1)
        const e3 = ema(e2)
        return e1.map((v, i) => (v === null || e2[i] === null || e3[i] === null ? null : 3 * v - 3 * e2[i] + e3[i]))
      }
      const zeroLag = (values) => {
        const t1 = tema(values)
        const t2 = tema(t1)
        return t1.map((v, i) => (v === null || t2[i] === null ? null : v + (v - t2[i])))
      }
      const mean = bars.map((b) => (b.open + b.high + b.low + b.close) / 4)
      const haOpen = new Array(n).fill(null)
      const haClose = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        const b = bars[i]
        haOpen[i] = i === 0 ? (b.open + b.close) / 2 : (haOpen[i - 1] + mean[i - 1]) / 2
        haClose[i] = (mean[i] + haOpen[i] + Math.max(b.high, haOpen[i]) + Math.min(b.low, haOpen[i])) / 4
      }
      const zlHa = zeroLag(haClose)
      const zlPrice = zeroLag(bars.map(pick))
      const markers = []
      if (settings.showSignals) {
        for (let i = 1; i < n; i++) {
          const a = zlPrice[i], b = zlHa[i], a1 = zlPrice[i - 1], b1 = zlHa[i - 1]
          if (a === null || b === null || a1 === null || b1 === null) continue
          if (a > b && a1 <= b1) markers.push({ time: bars[i].time, kind: "up" })
          if (a < b && a1 >= b1) markers.push({ time: bars[i].time, kind: "down" })
        }
      }
      return { zlHa, zlPrice, _markers: markers }
    },
    markers({ values }) {
      return values._markers
    },
  })
}
