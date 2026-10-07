/**
 * Reference implementation of the library's RSI Divergence, for the parity
 * gate.
 *
 * RSI is Wilder's: the averages of up and down moves are seeded with a simple
 * average of the first `len` changes. A pivot low of RSI is a bar whose RSI is
 * strictly below that of the `lbL` bars before it and the `lbR` bars after it;
 * it is known `lbR` bars later. A pivot high is the mirror.
 *
 * Each new pivot is compared with the previous pivot of the same kind when the
 * two pivot bars are `rangeMin` to `rangeMax` bars apart: a regular bullish
 * divergence is a lower low in price (the bars' lows) under a higher low in
 * RSI, a regular bearish divergence a higher high in price (the bars' highs)
 * under a lower high in RSI. Each one draws a line between the two RSI pivots
 * and a label on the later pivot. The new pivot then becomes the previous one,
 * whether or not it was in range.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-rsi-divergence",
    name: "RSI Divergence",
    category: "Reversals",
    placement: "pane",
    inputs: [
      { key: "src", type: "source", label: "Source", default: "close" },
      { key: "len", type: "number", label: "RSI Length", default: 14, min: 1, step: 1 },
      { key: "lbL", type: "number", label: "Pivot Lookback Left", default: 5, min: 1, step: 1 },
      { key: "lbR", type: "number", label: "Pivot Lookback Right", default: 5, min: 1, step: 1 },
      { key: "rangeMin", type: "number", label: "Min Bars Between Pivots", default: 5, min: 1, step: 1 },
      { key: "rangeMax", type: "number", label: "Max Bars Between Pivots", default: 60, min: 1, step: 1 },
      { key: "showBull", type: "boolean", label: "Show Bullish Divergence", default: true },
      { key: "showBear", type: "boolean", label: "Show Bearish Divergence", default: true },
    ],
    plots: [{ key: "rsi", type: "line", title: "RSI" }],
    calc(bars, settings) {
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
      const n = bars.length
      const src = bars.map(pick)
      const len = settings.len

      const rsi = new Array(n).fill(null)
      let up = 0
      let down = 0
      for (let i = 1; i < n; i++) {
        const d = src[i] - src[i - 1]
        const g = Math.max(d, 0)
        const l = Math.max(-d, 0)
        if (i < len) {
          up += g
          down += l
          continue
        }
        if (i === len) {
          up = (up + g) / len
          down = (down + l) / len
        } else {
          up = (up * (len - 1) + g) / len
          down = (down * (len - 1) + l) / len
        }
        rsi[i] = down === 0 ? 100 : up === 0 ? 0 : 100 - 100 / (1 + up / down)
      }

      const { lbL, lbR, rangeMin, rangeMax } = settings
      const isPivot = (c, beats) => {
        if (c - lbL < 0 || rsi[c] === null) return false
        for (let k = c - lbL; k <= c + lbR; k++) {
          if (k === c) continue
          if (rsi[k] === null || !beats(rsi[c], rsi[k])) return false
        }
        return true
      }

      const draws = []
      const T = (i) => bars[i].time
      let lastLow = null
      let lastHigh = null
      for (let i = lbL + lbR; i < n; i++) {
        const c = i - lbR
        if (isPivot(c, (a, b) => a < b)) {
          const cur = { bar: c, osc: rsi[c], price: bars[c].low }
          if (lastLow) {
            const span = c - lastLow.bar
            if (settings.showBull && span >= rangeMin && span <= rangeMax && cur.price < lastLow.price && cur.osc > lastLow.osc) {
              draws.push({ kind: "line", from: { time: T(lastLow.bar), price: lastLow.osc }, to: { time: T(c), price: cur.osc } })
              draws.push({ kind: "label", at: { time: T(c), price: cur.osc }, text: "Bull" })
            }
          }
          lastLow = cur
        }
        if (isPivot(c, (a, b) => a > b)) {
          const cur = { bar: c, osc: rsi[c], price: bars[c].high }
          if (lastHigh) {
            const span = c - lastHigh.bar
            if (settings.showBear && span >= rangeMin && span <= rangeMax && cur.price > lastHigh.price && cur.osc < lastHigh.osc) {
              draws.push({ kind: "line", from: { time: T(lastHigh.bar), price: lastHigh.osc }, to: { time: T(c), price: cur.osc } })
              draws.push({ kind: "label", at: { time: T(c), price: cur.osc }, text: "Bear" })
            }
          }
          lastHigh = cur
        }
      }
      return { rsi, _draws: draws }
    },
    draws({ values }) {
      return values._draws
    },
  })
}
