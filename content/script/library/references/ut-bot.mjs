/**
 * Reference implementation of the library's UT Bot, for the parity gate.
 *
 * An ATR trailing stop follows the chosen price (optionally from Heikin Ashi
 * candles): it ratchets toward the price while the price stays on one side and
 * jumps to the other side when the price crosses it. A short moving average of
 * the same price signals Buy when it crosses above the stop with the price
 * above it, and Sell on the reverse.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-ut-bot",
    name: "UT Bot",
    category: "Trend Strength",
    placement: "onchart",
    inputs: [
      { key: "h", type: "boolean", label: "Signals from Heikin Ashi Candles", default: false },
      {
        key: "Price",
        type: "select",
        label: "Price Source",
        default: "open",
        options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"].map((v) => ({ label: v, value: v })),
      },
      {
        key: "smoothing",
        type: "select",
        label: "Moving Average Type",
        default: "HMA",
        options: ["SMA", "EMA", "WMA", "HMA"].map((v) => ({ label: v, value: v })),
      },
      { key: "MA_Period", type: "number", label: "MA Period", default: 2, min: 1, step: 1 },
      { key: "a", type: "number", label: "Sensitivity", default: 1, min: 0.1, step: 0.1 },
      { key: "c", type: "number", label: "ATR Period", default: 11, min: 1, step: 1 },
    ],
    plots: [
      { key: "ma", type: "line", title: "Moving Average" },
      { key: "stop", type: "line", title: "Trailing Stop" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const na = (v) => v === null || Number.isNaN(v)
      const nz = (v) => (na(v) ? 0 : v)

      // Heikin Ashi candles: the close is the bar's average price, the open the
      // midpoint of the previous Heikin Ashi open and close.
      const ha = []
      for (let i = 0; i < n; i++) {
        const b = bars[i]
        const close = (b.open + b.high + b.low + b.close) / 4
        const open = i === 0 ? (b.open + b.close) / 2 : (ha[i - 1].open + ha[i - 1].close) / 2
        ha.push({ open, close, high: Math.max(b.high, open, close), low: Math.min(b.low, open, close) })
      }
      const field = (c) => {
        switch (settings.Price) {
          case "high": return c.high
          case "low": return c.low
          case "close": return c.close
          case "hl2": return (c.high + c.low) / 2
          case "hlc3": return (c.high + c.low + c.close) / 3
          case "ohlc4": return (c.open + c.high + c.low + c.close) / 4
          default: return c.open
        }
      }
      const src = (settings.h ? ha : bars).map(field)

      // Average true range: Wilder's average, seeded with a simple average;
      // the first bar's true range is its high minus its low.
      const len = settings.c
      const atr = new Array(n).fill(null)
      {
        let sum = 0
        let prev = null
        for (let i = 0; i < n; i++) {
          const b = bars[i]
          const tr = i === 0 ? b.high - b.low : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close))
          if (i < len) {
            sum += tr
            if (i === len - 1) prev = sum / len
          } else prev = (prev * (len - 1) + tr) / len
          atr[i] = i >= len - 1 ? prev : null
        }
      }

      const stop = new Array(n).fill(null)
      for (let i = 0; i < n; i++) {
        const loss = na(atr[i]) ? null : settings.a * atr[i]
        const prev = nz(i > 0 ? stop[i - 1] : null)
        const s = src[i]
        const s1 = i > 0 ? src[i - 1] : null
        const down = loss === null ? null : s + loss
        const up = loss === null ? null : s - loss
        const iff1 = s > prev ? up : down
        const iff2 = s < prev && s1 !== null && s1 < prev ? (down === null ? null : Math.min(prev, down)) : iff1
        stop[i] = s > prev && s1 !== null && s1 > prev ? (up === null ? null : Math.max(prev, up)) : iff2
      }

      const p = settings.MA_Period
      const sma = (v, l) => v.map((_, i) => (i < l - 1 ? null : v.slice(i - l + 1, i + 1).reduce((x, y) => x + y, 0) / l))
      const wma = (v, l) =>
        v.map((_, i) => {
          if (i < l - 1) return null
          let num = 0
          for (let k = 0; k < l; k++) {
            const x = v[i - k]
            if (na(x)) return null
            num += x * (l - k)
          }
          return num / ((l * (l + 1)) / 2)
        })
      const ema = (v, l) => {
        const alpha = 2 / (l + 1)
        let e = null
        return v.map((x) => (e = e === null ? x : alpha * x + (1 - alpha) * e))
      }
      let ma
      if (settings.smoothing === "SMA") ma = sma(src, p)
      else if (settings.smoothing === "EMA") ma = ema(src, p)
      else if (settings.smoothing === "WMA") ma = wma(src, p)
      else {
        // Hull: a weighted average of 2 * WMA(half) - WMA(full) over
        // round(sqrt(length)) bars, the half length rounded down.
        const half = wma(src, Math.max(1, Math.floor(p / 2)))
        const full = wma(src, p)
        const diff = half.map((x, i) => (na(x) || na(full[i]) ? null : 2 * x - full[i]))
        ma = wma(diff, Math.max(1, Math.round(Math.sqrt(p))))
      }

      const markers = []
      const colours = new Array(n).fill(null)
      const gt = (x, y) => !na(x) && !na(y) && x > y
      const le = (x, y) => !na(x) && !na(y) && x <= y
      for (let i = 0; i < n; i++) {
        const above = i > 0 && gt(ma[i], stop[i]) && le(ma[i - 1], stop[i - 1])
        const below = i > 0 && gt(stop[i], ma[i]) && le(stop[i - 1], ma[i - 1])
        if (gt(src[i], stop[i]) && above) markers.push({ time: bars[i].time, kind: "buy" })
        if (gt(stop[i], src[i]) && below) markers.push({ time: bars[i].time, kind: "sell" })
        colours[i] = gt(src[i], stop[i]) ? "green" : gt(stop[i], src[i]) ? "red" : null
      }
      return { ma, stop, _markers: markers, _colours: colours }
    },
    markers({ values }) {
      return values._markers
    },
    barColors({ values }) {
      return values._colours
    },
  })
}
