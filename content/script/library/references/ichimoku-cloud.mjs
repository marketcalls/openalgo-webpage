/**
 * Reference implementation of the library's Ichimoku Cloud, for the parity
 * gate. The library's study is openalgo's own, so there is no third-party
 * original to compare it with; this file states the same calculation in plain
 * JavaScript on the chart's indicator contract, and the gate runs both.
 *
 * Every value is placed on the bar where the study draws it: the leading spans
 * `cloudOffset` bars after the bar that computed them, the lagging span
 * `-laggingOffset` bars before.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ichimoku-cloud",
    name: "Ichimoku Cloud",
    category: "Trend Strength",
    placement: "onchart",
    inputs: [
      { key: "conversionPeriods", type: "number", label: "Conversion Line Length", default: 9, min: 1, step: 1 },
      { key: "basePeriods", type: "number", label: "Base Line Length", default: 26, min: 1, step: 1 },
      { key: "laggingSpan2Periods", type: "number", label: "Leading Span B Length", default: 52, min: 1, step: 1 },
      { key: "cloudOffset", type: "number", label: "Cloud Offset", default: 25, min: 0, max: 500, step: 1 },
      { key: "laggingOffset", type: "number", label: "Lagging Span Offset", default: -25, min: -500, max: 0, step: 1 },
    ],
    plots: [
      { key: "conversion", type: "line", title: "Conversion Line" },
      { key: "base", type: "line", title: "Base Line" },
      { key: "lagging", type: "line", title: "Lagging Span" },
      { key: "leadA", type: "line", title: "Leading Span A" },
      { key: "leadB", type: "line", title: "Leading Span B" },
    ],
    calc(bars, settings) {
      const n = bars.length
      // The average of the lowest low and the highest high over `len` bars,
      // absent until the window is full.
      const donchian = (len) => {
        const out = new Array(n).fill(null)
        for (let i = len - 1; i < n; i++) {
          let hi = -Infinity
          let lo = Infinity
          for (let k = i - len + 1; k <= i; k++) {
            hi = Math.max(hi, bars[k].high)
            lo = Math.min(lo, bars[k].low)
          }
          out[i] = (lo + hi) / 2
        }
        return out
      }
      const conversion = donchian(settings.conversionPeriods)
      const base = donchian(settings.basePeriods)
      const spanB = donchian(settings.laggingSpan2Periods)
      const spanA = conversion.map((c, i) => (c === null || base[i] === null ? null : (c + base[i]) / 2))

      const shift = (values, offset) => {
        const out = new Array(n).fill(null)
        for (let i = 0; i < n; i++) {
          const from = i - offset
          if (from >= 0 && from < n) out[i] = values[from]
        }
        return out
      }
      return {
        conversion,
        base,
        lagging: shift(
          bars.map((b) => b.close),
          settings.laggingOffset,
        ),
        leadA: shift(spanA, settings.cloudOffset),
        leadB: shift(spanB, settings.cloudOffset),
      }
    },
  })
}
