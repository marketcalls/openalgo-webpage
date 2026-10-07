/**
 * Reference implementation of the library's Darvas Box, for the parity gate.
 *
 * Nicolas Darvas's box, as a state machine run bar by bar:
 *
 * - Searching. A high above the candidate top becomes the new candidate top
 *   and clears the candidate bottom. Every other bar adds one to the top's
 *   count and tests its low: a low below the candidate bottom (or the first
 *   low after the top) becomes the candidate bottom, otherwise the bottom's
 *   count grows by one. When both the top and the bottom have held for
 *   `confirm` bars, the box is formed on that bar.
 * - Active. The box is drawn on every bar until a close above its top (a
 *   breakout) or below its bottom (a breakdown). That bar still shows the box,
 *   carries the mark, and starts a new search with its own high as the
 *   candidate top.
 *
 * Darvas himself traded the edges with resting orders, so an intraday move
 * through the top or the bottom ended his box. This study uses the close, the
 * reading most chart descriptions of the box give, so a wick alone does not
 * end it.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-darvas-box",
    name: "Darvas Box",
    category: "Bands & Channels",
    placement: "onchart",
    inputs: [
      { key: "confirm", type: "number", label: "Confirmation Bars", default: 3, min: 1, step: 1 },
      { key: "showSignals", type: "boolean", label: "Show Breakouts", default: true },
    ],
    plots: [
      { key: "top", type: "line", title: "Box Top" },
      { key: "bottom", type: "line", title: "Box Bottom" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const confirm = settings.confirm
      const top = new Array(n).fill(null)
      const bottom = new Array(n).fill(null)
      const marks = []
      let topCand = null
      let topCount = 0
      let botCand = null
      let botCount = 0
      let active = false
      let boxTop = null
      let boxBot = null
      const restart = (b) => {
        topCand = b.high
        topCount = 0
        botCand = null
        botCount = 0
      }
      for (let i = 0; i < n; i++) {
        const b = bars[i]
        if (active) {
          top[i] = boxTop
          bottom[i] = boxBot
          if (b.close > boxTop) {
            marks.push({ time: b.time, kind: "up" })
            active = false
            restart(b)
          } else if (b.close < boxBot) {
            marks.push({ time: b.time, kind: "down" })
            active = false
            restart(b)
          }
          continue
        }
        if (topCand === null || b.high > topCand) restart(b)
        else {
          topCount++
          if (botCand === null || b.low < botCand) {
            botCand = b.low
            botCount = 0
          } else botCount++
        }
        if (botCand !== null && topCount >= confirm && botCount >= confirm) {
          active = true
          boxTop = topCand
          boxBot = botCand
          top[i] = boxTop
          bottom[i] = boxBot
        }
      }
      return { top, bottom, _marks: settings.showSignals ? marks : [] }
    },
    markers({ values }) {
      return values._marks
    },
  })
}
