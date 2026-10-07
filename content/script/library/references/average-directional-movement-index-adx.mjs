/**
 * Reference implementation of the library's ADX, for the parity gate:
 * J. Welles Wilder's definition. True range and the two directional movements
 * are each smoothed with Wilder's average (seeded with a simple average of the
 * first `period` values, the first bar contributing no movement), giving +DI
 * and -DI; DX is their difference over their sum, and ADX is Wilder's average
 * of DX over the same period.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-adx",
    name: "Average Directional Movement Index (ADX)",
    category: "Trend Strength",
    placement: "pane",
    inputs: [{ key: "period", type: "number", label: "Period", default: 14, min: 1, max: 5000, step: 1 }],
    plots: [
      { key: "adx", type: "line", title: "ADX" },
      { key: "plusDi", type: "line", title: "+DI" },
      { key: "minusDi", type: "line", title: "-DI" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const p = settings.period
      // Wilder's average over values starting at `start`, seeded with the
      // simple average of the first p of them.
      const rma = (values, start) => {
        const out = new Array(n).fill(null)
        let sum = 0
        let prev = null
        for (let i = start; i < n; i++) {
          const v = values[i]
          if (v === null) continue
          if (prev === null) {
            sum += v
            if (i - start === p - 1) prev = sum / p
          } else prev = (prev * (p - 1) + v) / p
          out[i] = prev
        }
        return out
      }
      const tr = new Array(n).fill(null)
      const plusDm = new Array(n).fill(null)
      const minusDm = new Array(n).fill(null)
      for (let i = 1; i < n; i++) {
        const b = bars[i]
        const a = bars[i - 1]
        tr[i] = Math.max(b.high - b.low, Math.abs(b.high - a.close), Math.abs(b.low - a.close))
        const up = b.high - a.high
        const down = a.low - b.low
        plusDm[i] = up > down && up > 0 ? up : 0
        minusDm[i] = down > up && down > 0 ? down : 0
      }
      const atr = rma(tr, 1)
      const sp = rma(plusDm, 1)
      const sm = rma(minusDm, 1)
      const plusDi = atr.map((t, i) => (t === null || sp[i] === null ? null : t === 0 ? 0 : (100 * sp[i]) / t))
      const minusDi = atr.map((t, i) => (t === null || sm[i] === null ? null : t === 0 ? 0 : (100 * sm[i]) / t))
      const dx = plusDi.map((pd, i) => {
        const md = minusDi[i]
        if (pd === null || md === null) return null
        const s = pd + md
        return s === 0 ? 0 : (100 * Math.abs(pd - md)) / s
      })
      const firstDx = dx.findIndex((v) => v !== null)
      const adx = firstDx < 0 ? new Array(n).fill(null) : rma(dx, firstDx)
      return { adx, plusDi, minusDi }
    },
  })
}
