/**
 * Reference implementation of the library's SMC Structures and FVG, for the
 * parity gate. It keeps the drawing objects the study keeps, in the same order
 * and with the same lifecycle, and hands back the ones alive after the last
 * bar.
 *
 * Rules that decide the picture:
 * - A comparison that reads a bar before the first one is false.
 * - Bar positions are whole bar indexes; a midpoint of two indexes is rounded
 *   down, and an object anchored at an index sits at that bar's time.
 * - The swing bar of a window is its highest high (lowest low); a tie goes to
 *   the most recent bar. The window is the last 10 bars, or every bar so far
 *   while there are at most 11.
 * - The structure's swing bar is the furthest back local peak (trough) of the
 *   last 10 bars that is no older than the window's extreme. When no such
 *   peak exists the previous bar's answer is kept as it stood, as a number of
 *   bars back, and it is replaced by the window's extreme only while it is 0.
 * - The fair value gap list is walked from the oldest. A gap that is filled is
 *   removed and the walk moves on to the next position, so the gap that slid
 *   into the removed one's place is not looked at on that bar.
 * - The Fibonacci labels sit 20 bar intervals after the bar that draws them,
 *   and write the level as given and the price with two decimals.
 */
const STYLES = ["Solid", "Dotted", "Dashed"].map((v) => ({ value: v, label: v }))
const color = (r, g, b, a = 1) => ({ tag: "color", r, g, b, a })
const FIBOS = [
  [1, 0.786, color(100, 181, 246)],
  [2, 0.705, color(242, 54, 69)],
  [3, 0.618, color(8, 153, 129)],
  [4, 0.5, color(76, 175, 80)],
  [5, 0.382, color(129, 199, 132)],
]

export default function ({ registerIndicator }) {
  const fvg = "Fair Value Gap"
  const st = "Structures"
  const fib = "Structure Fibonacci"
  registerIndicator({
    id: "ref-smc-structures-and-fvg",
    name: "SMC Structures and FVG",
    category: "Market Structure",
    placement: "onchart",
    inputs: [
      { key: "isFvgToShow", type: "boolean", label: "Display FVG", default: true, group: fvg },
      { key: "bullishFvgColor", type: "color", label: "Bullish FVG Color", default: color(76, 175, 80, 0.5), group: fvg },
      { key: "bearishFvgColor", type: "color", label: "Bearish FVG Color", default: color(242, 54, 69, 0.5), group: fvg },
      { key: "mitigatedFvgColor", type: "color", label: "Mitigated FVG Color", default: color(120, 123, 134, 0.5), group: fvg },
      { key: "fvgHistoryNbr", type: "number", label: "Number of FVG to show", default: 5, min: 1, max: 50, step: 1, group: fvg },
      { key: "isMitigatedFvgToReduce", type: "boolean", label: "Reduce mitigated FVG", default: false, group: fvg },
      { key: "isStructBodyCandleBreak", type: "boolean", label: "Break with candle's body", default: true, group: st },
      { key: "isCurrentStructToShow", type: "boolean", label: "Display current structure", default: true, group: st },
      { key: "bullishBosColor", type: "color", label: "Bullish BOS Color", default: color(178, 181, 190), group: st },
      { key: "bearishBosColor", type: "color", label: "Bearish BOS Color", default: color(178, 181, 190), group: st },
      { key: "bosLineStyleOption", type: "select", label: "BOS Style", default: "Solid", options: STYLES, group: st },
      { key: "bosLineWidth", type: "number", label: "BOS Width", default: 1, min: 1, max: 5, step: 1, group: st },
      { key: "bullishChochColor", type: "color", label: "Bullish CHoCH Color", default: color(255, 235, 59), group: st },
      { key: "bearishChochColor", type: "color", label: "Bearish CHoCH Color", default: color(255, 235, 59), group: st },
      { key: "chochLineStyleOption", type: "select", label: "CHoCH Style", default: "Solid", options: STYLES, group: st },
      { key: "chochLineWidth", type: "number", label: "CHoCH Width", default: 1, min: 1, max: 5, step: 1, group: st },
      { key: "currentStructColor", type: "color", label: "Current structure Color", default: color(41, 98, 255), group: st },
      { key: "currentStructLineStyleOption", type: "select", label: "Current structure Style", default: "Solid", options: STYLES, group: st },
      { key: "currentStructLineWidth", type: "number", label: "Current structure Width", default: 1, min: 1, max: 5, step: 1, group: st },
      { key: "structHistoryNbr", type: "number", label: "Number of break to show", default: 10, min: 1, max: 50, step: 1, group: st },
      ...FIBOS.flatMap(([k, level, c]) => [
        { key: `isFibo${k}ToShow`, type: "boolean", label: `Fibonacci ${k}`, default: true, group: fib },
        { key: `fibo${k}Value`, type: "number", label: `Fibonacci ${k} Level`, default: level, step: 0.001, group: fib },
        { key: `fibo${k}Color`, type: "color", label: `Fibonacci ${k} Color`, default: c, group: fib },
        { key: `fibo${k}StyleOption`, type: "select", label: `Fibonacci ${k} Style`, default: "Solid", options: STYLES, group: fib },
        { key: `fibo${k}LineWidth`, type: "number", label: `Fibonacci ${k} Width`, default: 1, min: 1, max: 5, step: 1, group: fib },
      ]),
    ],
    plots: [],
    calc(bars, s, _cache, ctx) {
      const n = bars.length
      const H = (i) => bars[i].high
      const L = (i) => bars[i].low
      const T = (i) => bars[i].time
      // One bar interval in seconds, from the chart's interval ("1h", "15m", "1d").
      const unit = { s: 1, m: 60, h: 3600, d: 86400 }
      const m = /^(\d+)([smhd])$/i.exec(String(ctx?.interval ?? "1h"))
      const barSeconds = m ? Number(m[1]) * unit[m[2].toLowerCase()] : 3600

      // A price with two decimals: x * 100 rounded to a whole number, a half
      // away from zero, then written with the point two digits from the right.
      const fixed2 = (x) => {
        const v = x * 100
        const below = Math.floor(v)
        const f = v - below
        const scaled = f > 0.5 ? below + 1 : f < 0.5 ? below : v > 0 ? below + 1 : below
        const digits = String(Math.abs(scaled)).padStart(3, "0")
        return `${scaled < 0 ? "-" : ""}${digits.slice(0, -2)}.${digits.slice(-2)}`
      }
      // Fair value gaps: each one is a box and its "FVG" label, kept together.
      const fvgs = []
      // Structure breaks: each one is a line and its BOS or CHoCH label.
      const breaks = []
      // The current structure's two lines, and the five Fibonacci lines and labels.
      let structureHighLine = null
      let structureLowLine = null
      const fiboLine = [null, null, null, null, null, null]
      const fiboLabel = [null, null, null, null, null, null]

      let structureHigh = 0
      let structureLow = 0
      let structureHighStartIndex = 0
      let structureLowStartIndex = 0
      let structureDirection = 0
      // The BOS and CHoCH alerts: set on a break, cleared on a bar with none.
      let isBOSAlert = false
      let isCHOCHAlert = false
      let hiIdx = 0
      let loIdx = 0

      // The bar a window's high (low) was set on, as bars back from bar i.
      const extremeBack = (i, wantHigh) => {
        const len = i > 10 ? 10 : i + 1
        let best = null
        let back = 0
        for (let k = len - 1; k >= 0; k--) {
          const v = wantHigh ? H(i - k) : L(i - k)
          if (best === null || (wantHigh ? v >= best : v <= best)) {
            best = v
            back = k
          }
        }
        return back
      }
      const breakPrice = (i, side) => (s.isStructBodyCandleBreak ? bars[i].close : side === "low" ? L(i) : H(i))
      // bar_index[k] > start: false before the k-th bar.
      const after = (i, k, start) => i >= k && i - k > start

      for (let i = 0; i < n; i++) {
        // ---- Fair value gaps --------------------------------------------------
        const bullGap = i >= 3 && H(i - 3) < L(i - 1)
        const bearGap = i >= 3 && L(i - 3) > H(i - 1)
        const addGap = (bull, top, bottom) => {
          const left = i - 2
          const right = i - 1
          fvgs.push({ bull, mitigated: false, left, right, top, bottom, labelX: Math.floor((left + right) / 2), labelY: top - (top - bottom) / 2 })
          if (fvgs.length > s.fvgHistoryNbr + 1) fvgs.shift()
        }
        if (bullGap && s.isFvgToShow) addGap(true, L(i - 1), H(i - 3))
        if (bearGap && s.isFvgToShow) addGap(false, L(i - 3), H(i - 1))

        for (let index = 0; index < fvgs.length; index++) {
          const g = fvgs[index]
          const filled = g.bull ? L(i) <= g.bottom : H(i) >= g.top
          if (filled) {
            fvgs.splice(index, 1)
            continue
          }
          if (g.bull ? L(i) < g.top : H(i) > g.bottom) {
            g.mitigated = true
            if (s.isMitigatedFvgToReduce) {
              if (g.bull) g.top = L(i)
              else g.bottom = H(i)
            }
          }
          g.right = i
          g.labelX = Math.floor((g.left + g.right) / 2)
          g.labelY = g.top - (g.top - g.bottom) / 2
        }

        // ---- Structure --------------------------------------------------------
        if (i === 0) {
          structureHighStartIndex = 0
          structureLowStartIndex = 0
          structureHigh = H(0)
          structureLow = L(0)
        }

        const maxBack = extremeBack(i, true)
        for (let k = 1; k <= 10; k++) if (k + 1 <= i && H(i - k) > H(i - k - 1) && H(i - k + 1) <= H(i - k) && k <= maxBack) hiIdx = k
        hiIdx = hiIdx === 0 ? maxBack : hiIdx
        const minBack = extremeBack(i, false)
        for (let k = 1; k <= 10; k++) if (k + 1 <= i && L(i - k) < L(i - k - 1) && L(i - k + 1) >= L(i - k) && k <= minBack) loIdx = k
        loIdx = loIdx === 0 ? minBack : loIdx
        const structureMaxBar = i - hiIdx
        const structureMinBar = i - loIdx

        const lowP = (k) => breakPrice(i - k, "low")
        const highP = (k) => breakPrice(i - k, "high")
        const lowBroken =
          (i >= 3 && lowP(0) < structureLow && lowP(1) >= structureLow && lowP(2) >= structureLow && lowP(3) >= structureLow &&
            after(i, 1, structureLowStartIndex) && after(i, 2, structureLowStartIndex) && after(i, 3, structureLowStartIndex)) ||
          (structureDirection === 2 && lowP(0) < structureLow)
        const highBroken =
          (i >= 3 && highP(0) > structureHigh && highP(1) <= structureHigh && highP(2) <= structureHigh && highP(3) <= structureHigh &&
            after(i, 1, structureHighStartIndex) && after(i, 2, structureHighStartIndex) && after(i, 3, structureHighStartIndex)) ||
          (structureDirection === 1 && highP(0) > structureHigh)

        const addBreak = (start, price, text) => {
          if (breaks.length >= s.structHistoryNbr) breaks.shift()
          breaks.push({ start, end: i, price, text, labelX: Math.floor((i + start) / 2) })
        }
        if (lowBroken) {
          if (structureDirection === 1) {
            addBreak(structureLowStartIndex, structureLow, "BOS")
            isBOSAlert = true
          } else {
            addBreak(structureLowStartIndex, structureLow, "CHoCH")
            isCHOCHAlert = true
          }
          structureDirection = 1
          structureHighStartIndex = structureMaxBar
          structureLowStartIndex = i
          structureHigh = H(structureHighStartIndex)
          structureLow = L(i)
        } else if (highBroken) {
          if (structureDirection === 2) {
            addBreak(structureHighStartIndex, structureHigh, "BOS")
            isBOSAlert = true
          } else {
            addBreak(structureHighStartIndex, structureHigh, "CHoCH")
            isCHOCHAlert = true
          }
          structureDirection = 2
          structureHighStartIndex = i
          structureLowStartIndex = structureMinBar
          structureHigh = H(i)
          structureLow = L(structureLowStartIndex)
        } else {
          isBOSAlert = false
          isCHOCHAlert = false
          const recent = (start) => !(s.isStructBodyCandleBreak && after(i, 1, start) && after(i, 2, start) && after(i, 3, start))
          if (H(i) > structureHigh && (structureDirection === 0 || structureDirection === 2)) {
            if (!s.isStructBodyCandleBreak || recent(structureHighStartIndex)) {
              structureHigh = H(i)
              structureHighStartIndex = i
            }
          } else if (L(i) < structureLow && (structureDirection === 0 || structureDirection === 1)) {
            if (!s.isStructBodyCandleBreak || recent(structureLowStartIndex)) {
              structureLow = L(i)
              structureLowStartIndex = i
            }
          }
        }

        const structureRange = Math.abs(structureHigh - structureLow)

        // ---- Current structure and its Fibonacci levels, redrawn on every bar --
        if (s.isCurrentStructToShow) {
          structureHighLine = { from: [structureHighStartIndex, structureHigh], to: [i, structureHigh] }
          structureLowLine = { from: [structureLowStartIndex, structureLow], to: [i, structureLow] }
          for (let k = 1; k <= 5; k++) {
            if (!s[`isFibo${k}ToShow`]) continue
            const v = s[`fibo${k}Value`]
            const price = structureDirection === 1 ? structureHigh - (structureRange - structureRange * v) : structureLow + (structureRange - structureRange * v)
            const start = structureDirection === 1 ? structureHighStartIndex : structureLowStartIndex
            fiboLine[k] = { from: [start, price], to: [i, price] }
            fiboLabel[k] = { time: T(i) + 20 * barSeconds, price, text: `${v}(${fixed2(price)})` }
          }
        }
      }

      // ---- The objects alive after the last bar ------------------------------
      const draws = []
      const point = ([index, price]) => ({ time: T(index), price })
      const line = (l) => ({ kind: "line", from: point(l.from), to: point(l.to) })
      for (const g of fvgs) {
        draws.push({ kind: "box", from: { time: T(g.left), price: g.top }, to: { time: T(g.right), price: g.bottom }, mitigated: g.mitigated })
        draws.push({ kind: "label", at: { time: T(g.labelX), price: g.labelY }, text: "FVG" })
      }
      for (const b of breaks) {
        draws.push(line({ from: [b.start, b.price], to: [b.end, b.price] }))
        draws.push({ kind: "label", at: { time: T(b.labelX), price: b.price }, text: b.text })
      }
      if (structureHighLine) draws.push(line(structureHighLine))
      if (structureLowLine) draws.push(line(structureLowLine))
      for (let k = 1; k <= 5; k++) {
        if (fiboLine[k]) draws.push(line(fiboLine[k]))
        if (fiboLabel[k]) draws.push({ kind: "label", at: { time: fiboLabel[k].time, price: fiboLabel[k].price }, text: fiboLabel[k].text })
      }
      return { _draws: draws }
    },
    draws({ values }) {
      return values._draws
    },
  })
}
