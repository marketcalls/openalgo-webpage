/**
 * Reference implementation of the library's Tirone Levels, for the parity
 * gate. Over the last `length` bars, HH is the highest high and LL the lowest
 * low.
 *
 * Midpoint method: top = HH - (HH - LL) / 3, centre = LL + (HH - LL) / 2,
 * bottom = LL + (HH - LL) / 3.
 *
 * Mean method: the adjusted mean AM = (HH + LL + close) / 3, with the close of
 * the current bar; extreme high = AM + (HH - LL), regular high = 2 * AM - LL,
 * regular low = 2 * AM - HH, extreme low = AM - (HH - LL).
 *
 * The lines of the method not chosen are absent, and every line is absent
 * until the window is full.
 */
export default function ({ registerIndicator }) {
  registerIndicator({
    id: "ref-tirone-levels",
    name: "Tirone Levels",
    category: "Bands & Channels",
    placement: "onchart",
    inputs: [
      { key: "length", type: "number", label: "Length", default: 20, min: 1, step: 1 },
      { key: "method", type: "select", label: "Method", default: "Midpoint", options: ["Midpoint", "Mean"].map((v) => ({ value: v, label: v })) },
    ],
    plots: [
      { key: "top", type: "line", title: "Top" },
      { key: "centre", type: "line", title: "Centre" },
      { key: "bottom", type: "line", title: "Bottom" },
      { key: "extHigh", type: "line", title: "Extreme High" },
      { key: "regHigh", type: "line", title: "Regular High" },
      { key: "mean", type: "line", title: "Adjusted Mean" },
      { key: "regLow", type: "line", title: "Regular Low" },
      { key: "extLow", type: "line", title: "Extreme Low" },
    ],
    calc(bars, settings) {
      const n = bars.length
      const len = settings.length
      const mid = settings.method === "Midpoint"
      const out = {}
      for (const p of ["top", "centre", "bottom", "extHigh", "regHigh", "mean", "regLow", "extLow"]) out[p] = new Array(n).fill(null)
      for (let i = len - 1; i < n; i++) {
        let hh = -Infinity
        let ll = Infinity
        for (let k = i - len + 1; k <= i; k++) {
          hh = Math.max(hh, bars[k].high)
          ll = Math.min(ll, bars[k].low)
        }
        const range = hh - ll
        if (mid) {
          out.top[i] = hh - range / 3
          out.centre[i] = ll + range / 2
          out.bottom[i] = ll + range / 3
        } else {
          const am = (hh + ll + bars[i].close) / 3
          out.extHigh[i] = am + range
          out.regHigh[i] = 2 * am - ll
          out.mean[i] = am
          out.regLow[i] = 2 * am - hh
          out.extLow[i] = am - range
        }
      }
      return out
    },
  })
}
