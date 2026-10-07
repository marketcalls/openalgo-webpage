/**
 * Reference implementation of the library's Range Filter, for the parity gate.
 *
 * The average range is an exponential average of the source's bar-to-bar
 * change, smoothed again over 2 * period - 1 bars and scaled by the
 * multiplier. Each exponential average starts from its first value. The
 * filter follows the source but only moves once the source has travelled more
 * than that range from it. Signals come on the first bar the filter's
 * direction confirms a side after the opposite side.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-range-filter",
    name: "Range Filter",
    category: "Trend Strength",
    placement: "onchart",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "per", type: "number", label: "Sampling Period", default: 100, min: 1, step: 1 },
      { key: "mult", type: "number", label: "Range Multiplier", default: 3.0, min: 0.1, step: 0.1 },
    ],
    plots: [
      { key: "filt", type: "line", title: "Range Filter" },
      { key: "hband", type: "line", title: "High Target" },
      { key: "lband", type: "line", title: "Low Target" },
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
      const na = (v) => v === null || Number.isNaN(v)
      const nz = (v) => (na(v) ? 0 : v)
      // An exponential average that starts from its first value.
      const ema = (values, len) => {
        const a = 2 / (len + 1)
        const out = new Array(n).fill(null)
        let e = null
        for (let i = 0; i < n; i++) {
          const x = values[i]
          if (e === null) e = na(x) ? null : x
          else if (!na(x)) e = a * x + (1 - a) * e
          out[i] = e
        }
        return out
      }
      const change = src.map((x, i) => (i === 0 ? null : Math.abs(x - src[i - 1])))
      const avrng = ema(change, settings.per)
      const smrng = ema(avrng, settings.per * 2 - 1).map((v) => (na(v) ? null : v * settings.mult))

      const filt = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        const x = src[i]
        const r = smrng[i]
        const prev = nz(i > 0 ? filt[i - 1] : null)
        if (na(r)) {
          filt[i] = null
          continue
        }
        filt[i] = x > prev ? (x - r < prev ? prev : x - r) : x + r > prev ? prev : x + r
      }

      // Bars in a row the filter rose (upward) or fell (downward).
      let upward = 0
      let downward = 0
      const up = new Array(n).fill(0)
      const dn = new Array(n).fill(0)
      for (let i = 0; i < n; i++) {
        const f = filt[i]
        const p = i > 0 ? filt[i - 1] : null
        const gt = !na(f) && !na(p) && f > p
        const lt = !na(f) && !na(p) && f < p
        upward = gt ? upward + 1 : lt ? 0 : upward
        downward = lt ? downward + 1 : gt ? 0 : downward
        up[i] = upward
        dn[i] = downward
      }

      const hband = filt.map((f, i) => (na(f) ? null : f + smrng[i]))
      const lband = filt.map((f, i) => (na(f) ? null : f - smrng[i]))

      // Bar colours, and the first bar of each new side as a marker.
      const colours = new Array(n).fill(null)
      const markers = []
      let cond = null
      for (let i = 0; i < n; i++) {
        const f = filt[i]
        const x = src[i]
        const x1 = i > 0 ? src[i - 1] : null
        const above = !na(f) && x > f
        const below = !na(f) && x < f
        const rising = !na(x1) && x > x1
        const falling = !na(x1) && x < x1
        const longCond = (above && rising && up[i] > 0) || (above && falling && up[i] > 0)
        const shortCond = (below && falling && dn[i] > 0) || (below && rising && dn[i] > 0)
        colours[i] = longCond ? "up" : shortCond ? "down" : "mid"
        const prevCond = cond
        cond = longCond ? 1 : shortCond ? -1 : cond
        if (longCond && prevCond === -1) markers.push({ time: bars[i].time, kind: "buy" })
        if (shortCond && prevCond === 1) markers.push({ time: bars[i].time, kind: "sell" })
      }
      return { filt, hband, lband, _colours: colours, _markers: markers }
    },
    barColors({ values }) {
      return values._colours
    },
    markers({ values }) {
      return values._markers
    },
  })
}
