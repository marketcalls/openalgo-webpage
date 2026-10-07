/**
 * Reference implementation of the library's Volume Flow Indicator, for the
 * parity gate.
 *
 * The cutoff is a multiple of the population standard deviation of the log
 * change of the typical price, scaled to price by the close. Volume is capped
 * at a multiple of its average over the previous `length` bars (the average
 * ends on the bar before, so a spike cannot raise its own cap). A bar whose
 * typical price rose by more than the cutoff adds its capped volume, one that
 * fell by more subtracts it, and any other bar adds nothing. The indicator is
 * the sum of that flow over `length` bars divided by the same average volume,
 * smoothed by an exponential average; the signal is an exponential average of
 * the indicator. Exponential averages are seeded with the simple average of
 * their first values.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-volume-flow-indicator",
    name: "Volume Flow Indicator (VFI)",
    category: "Volume",
    placement: "pane",
    inputs: [
      { key: "length", type: "number", label: "Length", default: 130, min: 2, step: 1 },
      { key: "coef", type: "number", label: "Cutoff Coefficient", default: 0.2, min: 0, step: 0.05 },
      { key: "vcoef", type: "number", label: "Volume Cap", default: 2.5, min: 0.1, step: 0.1 },
      { key: "volLength", type: "number", label: "Volatility Length", default: 30, min: 2, step: 1 },
      { key: "smoothing", type: "number", label: "Smoothing", default: 3, min: 1, step: 1 },
      { key: "signalLength", type: "number", label: "Signal Length", default: 5, min: 1, step: 1 },
    ],
    plots: [
      { key: "vfi", type: "line", title: "VFI" },
      { key: "signal", type: "line", title: "Signal" },
      { key: "hist", type: "histogram", title: "Histogram" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const { length, coef, vcoef, volLength, smoothing, signalLength } = settings
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      // A windowed reduction, absent while any value in the window is absent.
      const windowed = (values, len, fn) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          const w = values.slice(i - len + 1, i + 1)
          if (w.some(na)) return null
          return fn(w)
        })
      const mean = (w) => w.reduce((a, b) => a + b, 0) / w.length
      const total = (w) => w.reduce((a, b) => a + b, 0)
      const popStdev = (w) => {
        const m = mean(w)
        return Math.sqrt(w.reduce((a, b) => a + (b - m) * (b - m), 0) / w.length)
      }
      const ema = (values, len) => {
        const a = 2 / (len + 1)
        const out = new Array(n).fill(null)
        let e = null
        let seen = 0
        let sum = 0
        for (let i = 0; i < n; i++) {
          const x = values[i]
          if (na(x)) continue
          if (e === null) {
            seen++
            sum += x
            if (seen === len) e = sum / len
          } else e = a * x + (1 - a) * e
          out[i] = e
        }
        return out
      }

      const tp = bars.map((b) => (b.high + b.low + b.close) / 3)
      const vol = bars.map((b) => b.volume ?? null)
      const inter = tp.map((x, i) => (i === 0 ? null : Math.log(x) - Math.log(tp[i - 1])))
      const vinter = windowed(inter, volLength, popStdev)
      const avgVol = windowed(vol, length, mean)
      const vave = avgVol.map((_, i) => (i === 0 ? null : avgVol[i - 1]))

      const flow = tp.map((x, i) => {
        if (i === 0 || na(vinter[i]) || na(vave[i]) || na(vol[i])) return null
        const cutoff = coef * vinter[i] * bars[i].close
        const vc = Math.min(vol[i], vave[i] * vcoef)
        const mf = x - tp[i - 1]
        return mf > cutoff ? vc : mf < -cutoff ? -vc : 0
      })
      const flowSum = windowed(flow, length, total)
      const raw = flowSum.map((s, i) => (na(s) || na(vave[i]) || vave[i] === 0 ? null : s / vave[i]))
      const vfi = ema(raw, smoothing)
      const signal = ema(vfi, signalLength)
      const hist = vfi.map((v, i) => (na(v) || na(signal[i]) ? null : v - signal[i]))
      return { vfi, signal, hist }
    },
  })
}
