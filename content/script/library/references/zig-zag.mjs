/**
 * Reference implementation of the library's Zig Zag, for the parity gate.
 *
 * A swing is confirmed once price reverses from its extreme by at least
 * `deviation` percent. Each bar reads its high and low (or its close for both,
 * with the Close setting).
 *
 * Before the first swing the highest and lowest prices so far are tracked;
 * the first time the highest is at least `deviation` percent above the lowest,
 * the older of the two becomes the first pivot (a tie on one bar waits for the
 * next bar). After that, in an up leg each new high moves the leg's end; a low
 * at least `deviation` percent below that end confirms it as a pivot high and
 * starts a down leg from it to this bar's low, and the reverse in a down leg.
 *
 * Every confirmed pivot starts a line to the current extreme; the newest line
 * is the leg that is still moving. With labels on, each confirmed pivot has
 * one label at its own bar.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-zig-zag",
    name: "Zig Zag",
    category: "Reversals",
    placement: "onchart",
    inputs: [
      { key: "deviation", type: "number", label: "Deviation %", default: 5, min: 0.1, step: 0.1 },
      { key: "priceSource", type: "select", label: "Price", default: "High/Low", options: ["High/Low", "Close"].map((v) => ({ value: v, label: v })) },
      { key: "showLabels", type: "boolean", label: "Show Pivot Labels", default: true },
    ],
    plots: [],
    calc() {
      return {}
    },
    draws({ bars, settings }) {
      const d = settings.deviation / 100
      const useHL = settings.priceSource === "High/Low"
      const draws = []
      let trend = 0
      let hiC = null
      let hiT = null
      let loC = null
      let loT = null
      let extP = null
      let extT = null
      let leg = null
      const confirm = (time, price) => {
        if (settings.showLabels) draws.push({ kind: "label", at: { time, price } })
        leg = { kind: "line", from: { time, price }, to: { time: extT, price: extP } }
        draws.push(leg)
      }
      for (let i = 0; i < bars.length; i++) {
        const t = bars[i].time
        const hp = useHL ? bars[i].high : bars[i].close
        const lp = useHL ? bars[i].low : bars[i].close
        if (trend === 0) {
          if (hiC === null || hp > hiC) {
            hiC = hp
            hiT = t
          }
          if (loC === null || lp < loC) {
            loC = lp
            loT = t
          }
          if (hiC >= loC * (1 + d) && hiT !== loT) {
            if (loT < hiT) {
              trend = 1
              extP = hiC
              extT = hiT
              confirm(loT, loC)
            } else {
              trend = -1
              extP = loC
              extT = loT
              confirm(hiT, hiC)
            }
          }
        } else if (trend === 1) {
          if (hp > extP) {
            extP = hp
            extT = t
            leg.to = { time: t, price: hp }
          } else if (lp <= extP * (1 - d)) {
            const pt = extT
            const pp = extP
            trend = -1
            extP = lp
            extT = t
            confirm(pt, pp)
          }
        } else {
          if (lp < extP) {
            extP = lp
            extT = t
            leg.to = { time: t, price: lp }
          } else if (hp >= extP * (1 + d)) {
            const pt = extT
            const pp = extP
            trend = 1
            extP = hp
            extT = t
            confirm(pt, pp)
          }
        }
      }
      return draws
    },
  })
}
