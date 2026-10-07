/**
 * Reference implementation of the library's AlphaTrend, for the parity gate.
 *
 * The range is a simple average of the true range (the first bar has none, as
 * there is no previous close). The line trails `range * multiplier` below the
 * low while money flow (or, without volume, momentum) is at or above 50, and
 * that far above the high otherwise, moving only toward price. Signals mark
 * where the line crosses its own value two bars back for the first time since
 * the opposite crossing.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-alphatrend",
    name: "AlphaTrend",
    category: "Trend Strength",
    placement: "onchart",
    inputs: [
      { key: "coeff", type: "number", label: "Multiplier", default: 1.0, step: 0.1 },
      { key: "AP", type: "number", label: "Common Period", default: 14, min: 1, step: 1 },
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "showsignalsk", type: "boolean", label: "Show Signals?", default: true },
      { key: "novolumedata", type: "boolean", label: "Change calculation (no volume data)?", default: false },
    ],
    plots: [
      { key: "at", type: "line", title: "AlphaTrend" },
      { key: "at2", type: "line", title: "AlphaTrend 2 Bars Back" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const AP = settings.AP
      const na = (v) => v === null || Number.isNaN(v)
      const nz = (v) => (na(v) ? 0 : v)
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
      // A windowed sum, absent while any value in the window is absent.
      const windowSum = (values, len) =>
        values.map((_, i) => {
          if (i < len - 1) return null
          let s = 0
          for (let k = i - len + 1; k <= i; k++) {
            if (na(values[k])) return null
            s += values[k]
          }
          return s
        })

      const tr = bars.map((b, i) => (i === 0 ? null : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close))))
      const atr = windowSum(tr, AP).map((s) => (na(s) ? null : s / AP))

      // Momentum: Wilder's RSI, each average seeded with a simple average.
      const rsi = new Array(n).fill(null)
      {
        let up = null
        let dn = null
        let sumUp = 0
        let sumDn = 0
        for (let i = 1; i < n; i++) {
          const d = src[i] - src[i - 1]
          const u = Math.max(d, 0)
          const w = Math.max(-d, 0)
          if (i <= AP) {
            sumUp += u
            sumDn += w
            if (i === AP) {
              up = sumUp / AP
              dn = sumDn / AP
            }
          } else {
            up = (up * (AP - 1) + u) / AP
            dn = (dn * (AP - 1) + w) / AP
          }
          if (up !== null) rsi[i] = dn === 0 ? 100 : up === 0 ? 0 : 100 - 100 / (1 + up / dn)
        }
      }

      // Money flow on the typical price. The first bar has no change, and an
      // absent comparison is false, so its flow counts on both sides.
      const tp = bars.map((b) => (b.high + b.low + b.close) / 3)
      const upFlow = tp.map((x, i) => {
        const ch = i === 0 ? null : x - tp[i - 1]
        return (bars[i].volume ?? 0) * (ch !== null && ch <= 0 ? 0 : x)
      })
      const dnFlow = tp.map((x, i) => {
        const ch = i === 0 ? null : x - tp[i - 1]
        return (bars[i].volume ?? 0) * (ch !== null && ch >= 0 ? 0 : x)
      })
      const upper = windowSum(upFlow, AP)
      const lower = windowSum(dnFlow, AP)
      const mfi = upper.map((u, i) => (na(u) || na(lower[i]) || lower[i] === 0 ? null : 100 - 100 / (1 + u / lower[i])))

      const at = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        const upT = na(atr[i]) ? null : bars[i].low - atr[i] * settings.coeff
        const downT = na(atr[i]) ? null : bars[i].high + atr[i] * settings.coeff
        const prev = nz(i > 0 ? at[i - 1] : null)
        const m = settings.novolumedata ? rsi[i] : mfi[i]
        const bull = !na(m) && m >= 50
        at[i] = bull ? (upT !== null && upT < prev ? prev : upT) : downT !== null && downT > prev ? prev : downT
      }
      const back = (k) => (i) => (i >= k ? at[i - k] : null)
      const at2 = at.map((_, i) => back(2)(i))

      // Crossings of the line over its value two bars back.
      const gt = (a, b) => !na(a) && !na(b) && a > b
      const lt = (a, b) => !na(a) && !na(b) && a < b
      const le = (a, b) => !na(a) && !na(b) && a <= b
      const ge = (a, b) => !na(a) && !na(b) && a >= b
      const buy = at.map((a, i) => i > 0 && gt(a, at2[i]) && le(at[i - 1], at2[i - 1]))
      const sell = at.map((a, i) => i > 0 && lt(a, at2[i]) && ge(at[i - 1], at2[i - 1]))
      const since = (cond) => {
        let last = null
        return cond.map((c, i) => {
          if (c) last = i
          return last === null ? null : i - last
        })
      }
      const K1 = since(buy)
      const K2 = since(sell)
      const O1 = since(buy.map((_, i) => i > 0 && buy[i - 1]))
      const O2 = since(sell.map((_, i) => i > 0 && sell[i - 1]))

      const markers = []
      if (settings.showsignalsk) {
        for (let i = 0; i < n; i++) {
          if (buy[i] && gt(O1[i], K2[i])) markers.push({ time: bars[i].time, kind: "buy" })
          if (sell[i] && gt(O2[i], K1[i])) markers.push({ time: bars[i].time, kind: "sell" })
        }
      }
      return { at, at2, _markers: markers }
    },
    markers({ values }) {
      return values._markers
    },
  })
}
