/**
 * Reference implementation of the library's Projection Oscillator, for the
 * parity gate. The Projection Bands are built as in that study: over the last
 * `length` bars every high is carried forward to the current bar along the
 * least squares slope of the highs and every low along the slope of the lows,
 * and the bands are the largest carried high and the smallest carried low.
 * The oscillator is where the close sits between them, from 0 to 100, and the
 * trigger is an exponential average of the oscillator seeded with the simple
 * average of its first `triggerLength` values.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-projection-oscillator",
    name: "Projection Oscillator",
    category: "Oscillators",
    placement: "pane",
    inputs: [
      { key: "length", type: "number", label: "Length", default: 14, min: 2, step: 1 },
      { key: "triggerLength", type: "number", label: "Trigger Length", default: 3, min: 1, step: 1 },
    ],
    plots: [
      { key: "po", type: "line", title: "Projection Oscillator" },
      { key: "trigger", type: "line", title: "Trigger" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const tl = settings.triggerLength
      const slope = (values, i) => {
        let sx = 0
        let sy = 0
        let sxy = 0
        let sxx = 0
        for (let x = 0; x < len; x++) {
          const y = values[i - len + 1 + x]
          sx += x
          sy += y
          sxy += x * y
          sxx += x * x
        }
        return (len * sxy - sx * sy) / (len * sxx - sx * sx)
      }
      const highs = bars.map((b) => b.high)
      const lows = bars.map((b) => b.low)
      const po = new Array(n).fill(null)
      for (let i = len - 1; i < n; i++) {
        const sh = slope(highs, i)
        const sl = slope(lows, i)
        let up = -Infinity
        let dn = Infinity
        for (let k = 0; k < len; k++) {
          up = Math.max(up, highs[i - k] + k * sh)
          dn = Math.min(dn, lows[i - k] + k * sl)
        }
        po[i] = up === dn ? null : (100 * (bars[i].close - dn)) / (up - dn)
      }
      // Exponential average with weight 2 / (tl + 1), seeded on the bar where
      // the first `tl` oscillator values are all present with their mean.
      const trigger = new Array(n).fill(null)
      const alpha = 2 / (tl + 1)
      const start = len - 1
      for (let i = start + tl - 1; i < n; i++) {
        if (i === start + tl - 1) {
          let s = 0
          for (let k = i - tl + 1; k <= i; k++) s += po[k]
          trigger[i] = s / tl
        } else {
          trigger[i] = alpha * po[i] + (1 - alpha) * trigger[i - 1]
        }
      }
      return { po, trigger }
    },
  })
}
