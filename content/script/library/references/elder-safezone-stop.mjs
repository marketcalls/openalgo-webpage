/**
 * Reference implementation of the library's Elder SafeZone Stop, for the
 * parity gate.
 *
 * Alexander Elder's SafeZone. A downside penetration is how far a bar's low
 * fell below the previous bar's low (zero when it did not). Over the `length`
 * bars that end with the previous bar, the penetrations that happened are
 * averaged (their sum over their count; zero when there were none), and the
 * long stop in force on this bar sits `coeff` times that average below the
 * previous bar's low. Elder sets today's stop from yesterday's low and the
 * lookback that ends yesterday, so the stop on a bar uses nothing from that
 * bar. The stop is kept from falling by taking the highest of the last
 * `holdBars` raw stops. The short stop mirrors it: upside penetrations of
 * highs above the previous high, the stop above the previous high, and the
 * lowest of the last `holdBars` raw stops. The first bar has no previous bar
 * and no penetration.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-elder-safezone-stop",
    name: "Elder SafeZone Stop",
    category: "Volatility",
    placement: "onchart",
    inputs: [
      { key: "length", type: "number", label: "Lookback", default: 10, min: 1, step: 1 },
      { key: "coeff", type: "number", label: "Coefficient", default: 2.5, min: 0, step: 0.1 },
      { key: "holdBars", type: "number", label: "Bars to Hold", default: 3, min: 1, step: 1 },
    ],
    plots: [
      { key: "longStop", type: "line", title: "Long Stop" },
      { key: "shortStop", type: "line", title: "Short Stop" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const hold = settings.holdBars
      const k = settings.coeff
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      const windowed = (values, w, fold) =>
        values.map((_, i) => {
          if (i < w - 1) return null
          let acc = null
          for (let j = i - w + 1; j <= i; j++) {
            if (na(values[j])) return null
            acc = acc === null ? values[j] : fold(acc, values[j])
          }
          return acc
        })
      const add = (a, b) => a + b

      const penDown = bars.map((b, i) => (i === 0 ? null : b.low < bars[i - 1].low ? bars[i - 1].low - b.low : 0))
      const penUp = bars.map((b, i) => (i === 0 ? null : b.high > bars[i - 1].high ? b.high - bars[i - 1].high : 0))
      const average = (pen) => {
        const total = windowed(pen, len, add)
        const count = windowed(
          pen.map((p) => (na(p) ? null : p > 0 ? 1 : 0)),
          len,
          add,
        )
        return total.map((s, i) => (na(s) || na(count[i]) ? null : count[i] === 0 ? 0 : s / count[i]))
      }
      const avgDown = average(penDown)
      const avgUp = average(penUp)
      const longRaw = bars.map((_, i) => (i === 0 || na(avgDown[i - 1]) ? null : bars[i - 1].low - k * avgDown[i - 1]))
      const shortRaw = bars.map((_, i) => (i === 0 || na(avgUp[i - 1]) ? null : bars[i - 1].high + k * avgUp[i - 1]))
      const longStop = windowed(longRaw, hold, Math.max)
      const shortStop = windowed(shortRaw, hold, Math.min)
      return { longStop, shortStop }
    },
  })
}
