/**
 * Reference implementation of the library's Volume Price Analysis (VPA), for
 * the parity gate.
 *
 * Written from the study's own definitions, bar by bar. A value that does not
 * exist yet is NaN; a comparison with NaN is false, and a true or false
 * condition stays true or false under and, or and not. That is how the study
 * reads its conditions while its averages warm up.
 *
 * The gate compares every plot, every mark (the signal marks, the trend and
 * strength band squares, one mark per bar of the support, resistance and high
 * volume lines) and every label's time, plus which bars carry a bar colour and
 * a background.
 */
const MAX_LABELS = 500

export default function ({ registerIndicator }) {
  const bool = (key, label, def) => ({ key, type: "boolean", label, default: def })
  const num = (key, label, def, extra = {}) => ({ key, type: "number", label, default: def, ...extra })
  registerIndicator({
    id: "ref-volume-price-analysis-vpa",
    name: "Volume Price Analysis (VPA)",
    category: "Volume",
    placement: "onchart",
    inputs: [
      bool("crt", "New Chart format with symbols and POP up descriptions", false),
      bool("bkbg", "Black Background", true),
      bool("showtrend", "Show Trend Bands", false),
      bool("strband", "Show Strength Bands", false),
      bool("plot50", "Plot 50 EMA", false),
      bool("plot200", "Plot 200 EMA", false),
      bool("showvwap", "Show VWAP", false),
      bool("showpma", "Show EMA", false),
      {
        key: "emasrc",
        type: "select",
        label: "EMA Source",
        default: "CLOSE",
        options: ["CLOSE", "PIVOT"].map((v) => ({ label: v, value: v })),
      },
      num("shp", "Short EMA period", 13, { min: 1, step: 1 }),
      num("mip", "Mid EMA period", 34, { min: 1, step: 1 }),
      num("lop", "Long EMA period", 55, { min: 1, step: 1 }),
      bool("showut", "Show Up Thrusts (UT)", true),
      bool("showtrb", "Show Top Reversal Bar (TRB)", true),
      bool("showtch", "Show Trend Change (TC)", true),
      bool("showput", "Show Pseudo Up Thrust (PST/PUC)", true),
      bool("shownd", "Show No Demand (ND)", true),
      bool("showns", "Show No Supply (NS)", true),
      bool("showlvtst", "Show Low Volume Supply Test (LVT/ST)", true),
      bool("showstsig", "Show Strength Signals (ST)", true),
      bool("showsv", "Show Stop Volume (SV)", true),
      bool("showeu", "Show Effort Up (EU)", true),
      bool("showeuf", "Show Effort Up Fail (EUF)", true),
      bool("showed", "Show Effort Down (ED)", true),
      bool("showedf", "Show Effort Down Fail (EDF)", true),
      bool("showrut", "Show Reverse Up Thrust (RUT)", true),
      bool("showbyc", "Show Buy Condition Exist (BCE)", true),
      bool("showsce", "Show Sell Condition Exist (SCE)", true),
      bool("showbc", "Show Buying Climax (BC)", true),
      bool("showsc", "Show Selling Climax (SC)", true),
      bool("showtb", "Show Two bar Reversal  (TB)", true),
      bool("showfom", "Show Ease of Movement  (FOM)", true),
      bool("log_show", "Show Alert window?", true),
      num("log_show_msg", "# of message to show", 2, { min: 1, max: 20, step: 1 }),
      num("log_offset", "# of messages to offset", 0, { min: 0, max: 200, step: 1 }),
      num("periods", "period", 22, { min: 5, max: 66, step: 1 }),
      bool("showrs", "Show support and resistance lines", false),
      num("sens", "Sensitivity", 10, { min: 2, max: 15, step: 1 }),
      bool("showhighvol", "Show high volume lines", false),
      num("volpd", "Vol Length", 14, { min: 1, step: 1 }),
      num("volm", "Vol Factor", 1.618, { step: 0.1 }),
      num("minvol", "Minimum volume", 1, { step: 1 }),
    ],
    plots: [
      { key: "ema50", type: "line", title: "EMA50" },
      { key: "ema200", type: "line", title: "EMA200" },
      { key: "vwap", type: "step", title: "VWAP" },
      { key: "ped", type: "line", title: "PEMA-Short" },
      { key: "pew", type: "line", title: "PEMA-Medium" },
      { key: "pem", type: "line", title: "PEMA-Long" },
      { key: "phl", type: "line", title: "Period High" },
      { key: "pll", type: "line", title: "Period Low" },
      { key: "hp", type: "line", title: "HV - High" },
      { key: "lp", type: "line", title: "HV - Low" },
    ],
    calc(bars, s) {
      const n = bars.length
      const NA = NaN
      const H = bars.map((b) => b.high)
      const L = bars.map((b) => b.low)
      const C = bars.map((b) => b.close)
      const O = bars.map((b) => b.open)
      const V = bars.map((b) => b.volume)
      const isNa = (x) => x === null || x === undefined || Number.isNaN(x)
      const nz = (x) => (isNa(x) ? 0 : x)
      const at = (a, i, k) => (i - k >= 0 ? a[i - k] : NA)
      // A true or false series read before its first bar is false.
      const was = (a, i, k) => (i - k >= 0 ? a[i - k] : false)
      const window = (a, i, len, f) => {
        if (i < len - 1) return NA
        let acc = null
        for (let k = 0; k < len; k++) {
          const x = a[i - k]
          if (isNa(x)) return NA
          acc = acc === null ? x : f(acc, x)
        }
        return acc
      }
      const sma = (a, len) => a.map((_, i) => window(a, i, len, (p, x) => p + x) / len)
      const sum = (a, len) => a.map((_, i) => window(a, i, len, (p, x) => p + x))
      const highest = (a, len) => a.map((_, i) => window(a, i, len, Math.max))
      const lowest = (a, len) => a.map((_, i) => window(a, i, len, Math.min))
      const wma = (a, len) =>
        a.map((_, i) => {
          if (i < len - 1) return NA
          let num = 0
          for (let k = 0; k < len; k++) {
            if (isNa(a[i - k])) return NA
            num += a[i - k] * (len - k)
          }
          return num / ((len * (len + 1)) / 2)
        })
      // Seeded with the simple average of the first `len` values, then
      // smoothed by `alpha`: 2 / (len + 1) for an EMA, 1 / len for Wilder's.
      const seeded = (a, len, alpha) => {
        const out = new Array(n).fill(NA)
        let prev = NA
        let run = 0
        let total = 0
        for (let i = 0; i < n; i++) {
          const x = a[i]
          if (isNa(prev)) {
            if (isNa(x)) {
              run = 0
              total = 0
              continue
            }
            run++
            total += x
            if (run > len) total -= a[i - len]
            if (run >= len) prev = total / len
          } else prev = alpha * x + (1 - alpha) * prev
          out[i] = prev
        }
        return out
      }
      const ema = (a, len) => seeded(a, len, 2 / (len + 1))
      const rma = (a, len) => seeded(a, len, 1 / len)
      const max = (x, y) => (isNa(x) || isNa(y) ? NA : Math.max(x, y))

      // ---------------------------------------------------- averages and VWAP
      const hlc3 = bars.map((b) => (b.high + b.low + b.close) / 3)
      const ema50 = ema(C, 50)
      const ema200 = ema(C, 200)
      const pe = s.emasrc === "CLOSE" ? C : hlc3
      const ped = ema(pe, s.shp)
      const pew = ema(pe, s.mip)
      const pem = ema(pe, s.lop)
      // Restarted at the first bar of each calendar day (UTC).
      const vwap = new Array(n).fill(NA)
      {
        let pv = 0
        let vol = 0
        let day = null
        for (let i = 0; i < n; i++) {
          const d = new Date(bars[i].time * 1000).toISOString().slice(0, 10)
          if (d !== day) {
            day = d
            pv = 0
            vol = 0
          }
          pv += hlc3[i] * V[i]
          vol += V[i]
          vwap[i] = vol === 0 ? NA : pv / vol
        }
      }

      // ---------------------------------------------------- bar definitions
      const volAvg = sma(V, 60)
      const spread = bars.map((b) => b.high - b.low)
      const avgSpread = sma(spread, 40)
      const highestVol60 = highest(V, 60)
      const highest10 = highest(H, 10)
      const highest5 = highest(H, 5)
      const lowest5 = lowest(L, 5)
      const pm = bars.map((b) => Math.abs(b.close - b.open))
      const pma = ema(pm, 40)

      const tr = bars.map((b, i) => (i === 0 ? b.high - b.low : Math.max(b.high - b.low, Math.abs(b.high - C[i - 1]), Math.abs(b.low - C[i - 1]))))
      const atr2 = rma(tr, 2)
      const atr8 = rma(tr, 8)
      const atr10 = rma(tr, 10)
      const atr40 = rma(tr, 40)

      const B = {}
      const series = (name) => (B[name] = new Array(n).fill(false))
      for (const name of [
        "upBar", "downBar", "wideRangeBar", "narrowRangeBar", "AvgSpreadBar", "upThrustBar", "upThrustBartrue",
        "upThrustCond1", "upThrustCond2", "upThrustCond3", "topRevBar", "PseudoUpThrust", "pseudoUtCond",
        "trendChange", "noDemandBarUt", "noDemandBarDt", "noSupplyBar", "lowVolTest", "lowVolTest1", "lowVolTest2",
        "sellCond1", "sellCond", "strengthDown0", "strengthDown", "strengthDown1", "strengthDown2", "buyCond1",
        "buyCond", "stopVolume", "revUpThrust", "effortUp", "effortUpfail", "effortDown", "effortDownFail",
        "bc", "sc", "fom1", "tbc2", "tbc2a", "tbc3", "tbc4", "tbc5", "downClose",
      ]) series(name)

      const marks = []
      const labels = []
      const mark = (i) => marks.push({ time: bars[i].time })
      const label = (i) => {
        labels.push({ kind: "label", at: { time: bars[i].time } })
        if (labels.length > MAX_LABELS) labels.shift()
      }

      for (let i = 0; i < n; i++) {
        const h = H[i]
        const l = L[i]
        const c = C[i]
        const v = V[i]
        const va = volAvg[i]
        const sp = spread[i]
        const avs = avgSpread[i]

        // Where the bar closed and how heavy its volume was.
        const AvgSpreadBar = sp > avs
        const wideRangeBar = sp > 1.5 * avs
        const narrowRangeBar = sp < 0.7 * avs
        const lowVolume = v < at(V, i, 1) && v < at(V, i, 2) && v < va
        const upBar = c > at(C, i, 1)
        const downBar = c < at(C, i, 1)
        const closeFactor = c - l
        const closePosition = closeFactor === 0 ? avs : sp / closeFactor
        const upClose = c >= sp * 0.7 + l
        const downClose = c <= sp * 0.3 + l
        const aboveClose = c > sp * 0.5 + l
        const belowClose = c < sp * 0.5 + l
        const midClose = c > sp * 0.3 + l && c < sp * 0.7 + l
        const veryHighClose = closePosition < 1.35
        const ClosePos = c <= sp * 0.2 + l ? 1 : c <= sp * 0.4 + l ? 2 : c <= sp * 0.6 + l ? 3 : c <= sp * 0.8 + l ? 4 : 5
        const volpos = v > va * 2 ? 1 : v > va * 1.3 ? 2 : v > va ? 3 : v < va && v < va * 0.7 ? 4 : 5
        B.upBar[i] = upBar
        B.downBar[i] = downBar
        B.wideRangeBar[i] = wideRangeBar
        B.narrowRangeBar[i] = narrowRangeBar
        B.AvgSpreadBar[i] = AvgSpreadBar
        B.downClose[i] = downClose

        // High volume that cannot move the price.
        const Lpm = pm[i] < 0.5 * pma[i]
        const fom1 = v > 1.5 * va && Lpm
        B.fom1[i] = fom1

        // Two bar reversals.
        const c1 = at(C, i, 1)
        const tbcd = c1 < at(C, i, 5) && c1 < at(C, i, 4) && c1 < at(C, i, 3) && c1 < at(C, i, 2)
        const tbc1 = l < at(L, i, 1) && h > at(H, i, 1)
        const tbc1a = l < at(L, i, 1) && c > c1
        B.tbc2[i] = tbcd && tbc1 && v > 1.2 * va && upClose
        B.tbc2a[i] = tbcd && tbc1a && v > 1.2 * va && upClose && !tbc1
        B.tbc3[i] = tbcd && tbc1 && upClose && v <= 1.2 * va
        const tbcu = c1 > at(C, i, 5) && c1 > at(C, i, 4) && c1 > at(C, i, 3) && c1 > at(C, i, 2)
        B.tbc4[i] = tbcu && tbc1 && v > 1.2 * va && downClose
        B.tbc5[i] = tbcu && tbc1 && downClose && v <= 1.2 * va

        // Trend: how far the high and the low have travelled over 2, 8, 10 and
        // 40 bars, in units of the average true range over that span. A price
        // from before the first bar reads as zero.
        const rwhs = max((h - nz(at(L, i, 2))) / (atr2[i] * Math.sqrt(2)), (h - nz(at(L, i, 10))) / (atr10[i] * Math.sqrt(10)))
        const rwls = max((nz(at(H, i, 2)) - l) / (atr2[i] * Math.sqrt(2)), (nz(at(H, i, 10)) - l) / (atr10[i] * Math.sqrt(10)))
        const rwhl = max((h - nz(at(L, i, 8))) / (atr8[i] * Math.sqrt(8)), (h - nz(at(L, i, 40))) / (atr40[i] * Math.sqrt(40)))
        const rwll = max((nz(at(H, i, 8)) - l) / (atr8[i] * Math.sqrt(8)), (nz(at(H, i, 40)) - l) / (atr40[i] * Math.sqrt(40)))
        const j = rwhl - rwll
        const upmid = rwhs > 1 ? 1 : 0
        const dnimd = rwls > 1 ? 1 : 0
        const upmajor = j > 1 ? 1 : j < -1 ? -1 : 0
        const upminor = rwhl > 1 ? 1 : -1
        const dnminor = rwll > 1 ? 1 : -1

        // The signals.
        const upThrustBar = wideRangeBar && downClose && h > at(H, i, 1) && upmid === 1
        const bc = wideRangeBar && aboveClose && v === highestVol60[i] && upmajor === 1
        const upThrustBartrue = wideRangeBar && ClosePos === 1 && upmajor > 0 && h > at(H, i, 1) && volpos < 4
        const upThrustCond1 = was(B.upThrustBar, i, 1) && downBar && !narrowRangeBar
        const upThrustCond2 = was(B.upThrustBar, i, 1) && downBar && v > va * 1.3
        const upThrustCond3 = upThrustBar && v > va * 2
        const topRevBar = at(V, i, 1) > va && was(B.upBar, i, 1) && was(B.wideRangeBar, i, 1) && downBar && downClose && wideRangeBar && upmajor > 0 && h === highest10[i]
        const PseudoUpThrust = was(B.upBar, i, 1) && h > at(H, i, 1) && at(V, i, 1) > 1.5 * va && downBar && downClose && !upThrustBar
        const pseudoUtCond = was(B.PseudoUpThrust, i, 1) && downBar && downClose && !upThrustBar
        const trendChange = was(B.upBar, i, 1) && h === highest5[i] && downBar && (downClose || midClose) && v > va && upmajor > 0 && upmid > 0 && !wideRangeBar && !PseudoUpThrust
        const noDemandBarUt = upBar && narrowRangeBar && lowVolume && (aboveClose || upClose) && ((upminor >= 0 && upmid >= 0) || (upminor <= 0 && upminor >= 0))
        const noDemandBarDt = upBar && narrowRangeBar && lowVolume && (aboveClose || upClose) && (upminor <= 0 || upmid <= 0)
        const noSupplyBar = downBar && narrowRangeBar && lowVolume && midClose
        const lowVolTest = l === lowest5[i] && upClose && lowVolume
        const lowVolTest1 = l === lowest5[i] && v < va && l < at(L, i, 1) && upClose && upminor > 0 && upmajor > 0
        const lowVolTest2 = was(B.lowVolTest, i, 1) && upBar && upClose
        const sellCond1 = upThrustCond1 || upThrustCond2 || upThrustCond3
        const sellCond2 = !was(B.sellCond1, i, 1)
        const sellCond = sellCond1 && sellCond2
        const strengthDown0 = upmajor < 0 && volpos < 4 && was(B.downBar, i, 1) && upBar && ClosePos > 3 && dnminor === 1 && dnimd === 1
        const strengthDown = volpos < 4 && was(B.downBar, i, 1) && upBar && ClosePos > 3 && dnimd === 1 && dnminor === 1
        const strengthDown1 = upmajor === -1 && v > va * 1.5 && was(B.downBar, i, 1) && upBar && ClosePos > 3 && upmid <= 0 && upminor < 0
        const strengthDown2 = upmid <= 0 && at(V, i, 1) < va && upBar && veryHighClose && volpos < 4
        const buyCond1 = strengthDown || strengthDown1
        const buyCond = upBar && was(B.buyCond1, i, 1)
        const stopVolume = l === lowest5[i] && (upClose || midClose) && v > 1.5 * va && upmajor < 0
        const revUpThrust = upBar && upClose && v > at(V, i, 1) && v > va && wideRangeBar && was(B.downBar, i, 1) && was(B.downClose, i, 1) && upminor < 0 && c < at(C, i, 1)
        const effortUp = h > at(H, i, 1) && l > at(L, i, 1) && c > at(C, i, 1) && c >= (h - l) * 0.7 + l && sp > avs && volpos < 4
        const effortUpfail = was(B.effortUp, i, 1) && (upThrustBar || upThrustCond1 || upThrustCond2 || upThrustCond3 || (downBar && AvgSpreadBar))
        const effortDown = h < at(H, i, 1) && l < at(L, i, 1) && c < at(C, i, 1) && c <= (h - l) * 0.25 + l && wideRangeBar && v > at(V, i, 1)
        const effortDownFail = was(B.effortDown, i, 1) && ((upBar && AvgSpreadBar) || revUpThrust || buyCond1)
        const sc = wideRangeBar && belowClose && v === highestVol60[i] && upmajor === -1
        for (const [k, x] of Object.entries({
          upThrustBar, upThrustBartrue, upThrustCond1, upThrustCond2, upThrustCond3, topRevBar, PseudoUpThrust,
          pseudoUtCond, trendChange, noDemandBarUt, noDemandBarDt, noSupplyBar, lowVolTest, lowVolTest1, lowVolTest2,
          sellCond1, sellCond, strengthDown0, strengthDown, strengthDown1, strengthDown2, buyCond1, buyCond,
          stopVolume, revUpThrust, effortUp, effortUpfail, effortDown, effortDownFail, bc, sc,
        })) B[k][i] = x

        const UT1 = upThrustBar || upThrustBartrue
        const UT2 = upThrustCond1 || upThrustCond2
        const UT = UT1 || UT2
        const lvt = lowVolTest || lowVolTest2
        const EFD = effortDownFail
        const strcond = strengthDown2 && !strengthDown0 && !strengthDown && !strengthDown1
        const ST = strengthDown0 || (strengthDown && !strengthDown2) || strengthDown1 || (strengthDown2 && strcond) || (strengthDown2 && !strcond)

        // Trend bands: one square each for the major, mid and minor trend.
        if (s.showtrend) for (let k = 0; k < 3; k++) mark(i)

        if (!s.crt) {
          // Text marks, one for each condition that holds.
          const text = [
            s.showut && UT1 && !effortUpfail && !sellCond && !bc,
            s.showut && UT2 && !effortUpfail && !sellCond && !bc,
            s.showtrb && topRevBar && !sellCond && !UT && !effortUpfail,
            s.showtch && trendChange && !effortUpfail,
            s.showput && PseudoUpThrust && !effortUpfail,
            s.showput && pseudoUtCond && !effortUpfail,
            s.shownd && noDemandBarUt,
            s.shownd && noDemandBarDt,
            s.showns && noSupplyBar,
            s.showlvtst && lowVolTest && !effortDownFail,
            s.showlvtst && lowVolTest2 && !effortUp,
            s.showstsig && strengthDown0,
            s.showstsig && strengthDown && !strengthDown2 && !EFD && !effortUp && !stopVolume && !revUpThrust,
            s.showstsig && strengthDown1 && !EFD && !effortUp && !stopVolume && !revUpThrust,
            s.showstsig && strengthDown2 && strcond && !EFD && !effortUp && !stopVolume && !revUpThrust,
            s.showsv && stopVolume && !ST,
            s.showeu && effortUp && !ST && !buyCond && !effortDownFail && !bc,
            s.showeuf && effortUpfail && !UT,
            s.showed && effortDown && !effortUpfail && !sc,
            s.showedf && effortDownFail && !ST,
            s.showrut && revUpThrust && !ST,
            s.showbyc && buyCond && !ST && !effortUp && !lvt,
            s.showsce && sellCond && !UT,
            s.showsce && sellCond && UT1,
            s.showbc && bc && !UT,
            s.showbc && bc && UT1,
            s.showsc && sc && !ST,
            s.showsc && sc && ST,
            s.showtb && B.tbc2[i],
            s.showtb && B.tbc3[i],
            s.showtb && B.tbc4[i] && !UT,
            s.showtb && B.tbc5[i] && !UT,
            // The DS mark follows its own switch.
            s.showfom && !UT && fom1,
          ]
          for (const on of text) if (on) mark(i)
        } else {
          // Symbol mode: a label with a description for each condition. The
          // Show switches hide these too.
          const symbols = [
            s.showut && UT,
            s.showtrb && topRevBar && !sellCond && !UT && !effortUpfail,
            s.showtch && trendChange && !effortUpfail,
            s.showput && PseudoUpThrust && !effortUpfail,
            s.shownd && noDemandBarUt,
            s.shownd && noDemandBarDt,
            s.showns && noSupplyBar,
            s.showlvtst && lowVolTest && !effortDownFail,
            s.showlvtst && lowVolTest2 && !effortUp,
            s.showstsig && strengthDown0,
            s.showstsig && strengthDown,
            s.showstsig && strengthDown1,
            s.showstsig && strengthDown2,
            s.showsv && stopVolume && !ST,
            s.showeu && effortUp && !ST && !buyCond && !effortDownFail && !bc,
            s.showeuf && effortUpfail && !UT,
            s.showed && effortDown && !effortUpfail && !sc,
            s.showedf && effortDownFail && !ST,
            s.showrut && revUpThrust && !ST,
            s.showbyc && buyCond && !ST && !effortUp && !lvt,
            s.showsce && sellCond && !UT,
            s.showbc && ((bc && !UT) || (bc && UT1)),
            s.showsc && sc,
            s.showtb && B.tbc2[i],
            s.showtb && B.tbc3[i],
            s.showtb && B.tbc4[i] && !UT,
            s.showtb && B.tbc5[i] && !UT,
            s.showfom && fom1,
          ]
          for (const on of symbols) if (on) label(i)
        }
      }

      // Strength band: one square a bar.
      if (s.strband) for (let i = 0; i < n; i++) mark(i)

      // ---------------------------------------- support and resistance lines
      const show = (on, a) => (on ? a : new Array(n).fill(NA))
      const phl = new Array(n).fill(NA)
      const pll = new Array(n).fill(NA)
      const hp = new Array(n).fill(NA)
      const lp = new Array(n).fill(NA)
      const avol = sma(V, s.volpd)
      const hhv = highest(H, 2)
      const llv = lowest(L, 2)
      for (let i = 0; i < n; i++) {
        // A new high (low) beyond each of the previous `sens` bars.
        let ph = NA
        let pl = NA
        if (i >= s.sens) {
          let hi = -Infinity
          let lo = Infinity
          for (let k = 1; k <= s.sens; k++) {
            hi = Math.max(hi, H[i - k])
            lo = Math.min(lo, L[i - k])
          }
          if (H[i] > hi) ph = H[i]
          if (L[i] < lo) pl = L[i]
        }
        phl[i] = nz(ph) !== 0 ? ph : at(phl, i, 1)
        pll[i] = nz(pl) !== 0 ? pl : at(pll, i, 1)
        const hvol = V[i] > s.minvol && V[i] > s.volm * avol[i]
        hp[i] = hvol ? hhv[i] : at(hp, i, 1)
        lp[i] = hvol ? llv[i] : at(lp, i, 1)
      }
      const lines = { phl: show(s.showrs, phl), pll: show(s.showrs, pll), hp: show(s.showhighvol, hp), lp: show(s.showhighvol, lp) }
      // Each line is drawn as a mark on every bar it has a value.
      for (const key of ["phl", "pll", "hp", "lp"]) lines[key].forEach((x, i) => !isNa(x) && mark(i))

      // Candles: green above the previous close, red otherwise, lighter on
      // volume below its 60 bar average. The background covers every bar.
      const colours = bars.map((_, i) => (C[i] > at(C, i, 1) ? (V[i] < volAvg[i] ? "#7aec7d" : "#49b134") : V[i] < volAvg[i] ? "#f39b9b" : "#cf3a3a"))
      const background = bars.map(() => (s.bkbg ? "#000000" : "#ffffff"))

      return {
        ema50: show(s.plot50, ema50),
        ema200: show(s.plot200, ema200),
        vwap: show(s.showvwap, vwap),
        ped: show(s.showpma, ped),
        pew: show(s.showpma, pew),
        pem: show(s.showpma, pem),
        ...lines,
        _marks: marks,
        _labels: labels,
        _colours: colours,
        _background: background,
      }
    },
    markers({ values }) {
      return values._marks
    },
    draws({ values }) {
      return values._labels
    },
    barColors({ values }) {
      return values._colours
    },
    background({ values }) {
      return values._background
    },
  })
}
