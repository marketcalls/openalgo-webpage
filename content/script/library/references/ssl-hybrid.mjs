/**
 * Reference implementation of the library's SSL Hybrid, for the parity gate.
 *
 * A baseline average with a channel of `multy` exponential average ranges
 * around it, three SSL lines (the baseline type, SSL2 and the exit line), each
 * built from one average of the highs and one of the lows that flips sides
 * when the close leaves them, an average true range with bands, a percentile
 * of that range that sets the colours' transparency, exit arrows where the
 * close crosses the exit line, and diamonds on large candles near the
 * baseline.
 *
 * Absent values follow one set of rules throughout: arithmetic on an absent
 * value is absent, a comparison with one is false, and nz() reads one as 0.
 *
 * Averages:
 * - ema starts from its first value: e = na(e[1]) ? x : a * x + (1 - a) * e[1],
 *   a = 2 / (len + 1). An absent input makes it absent for that bar, and it
 *   starts again from the next value.
 * - rma is seeded with the simple average of the first len values, then
 *   (1 / len) * x + (1 - 1 / len) * previous.
 * - sma, wma, linreg, stdev (population), highest and lowest are windowed:
 *   absent until the window holds len values, and while any of them is absent.
 * - The true range of the average true range has its first bar at high - low;
 *   the true range of the baseline channel is absent on the first bar.
 * - Lengths made by dividing a whole-number length (len / 2, len / kidiv) are
 *   whole numbers: the quotient is rounded down, and is at least 1. So the
 *   triangular average's ceil(len / 2) is that same rounded-down half, and its
 *   second length is floor(len / 2) + 1. The JMA phase is not a length:
 *   jurik_phase / 100 is a plain division.
 * - The volatility percentile counts the previous risk_lookback values that
 *   are at or below this one, times 100 / risk_lookback; it is absent until
 *   all of those earlier values exist.
 * - A colour built with an absent transparency is absent.
 */
export default function ({ registerIndicator }) {
  const groupDisplay = "Display Controls"
  registerIndicator({
    id: "ref-ssl-hybrid",
    name: "SSL Hybrid",
    category: "Trend Strength",
    placement: "onchart",
    inputs: [
      { key: "display_mode", type: "select", label: "Display Mode", default: "Full Display", group: groupDisplay, options: ["Baseline Only", "Baseline + SSL", "SSL Only", "Entry/Exit Only", "Full Display"].map((v) => ({ value: v, label: v })) },
      { key: "color_bars", type: "boolean", label: "Color Bars", default: true, group: groupDisplay },
      { key: "show_signals", type: "boolean", label: "Show Signal Diamonds", default: true, group: groupDisplay, tooltip: "Candle > 1 ATR within baseline range - Potential false breakout warning" },
      { key: "show_risk_table", type: "boolean", label: "Show Risk Table", default: true, group: groupDisplay },
      // The colour defaults are written in the colour form the OpenScript engine
      // takes, because the parity harness hands the reference's defaults to the
      // engine as settings. A "#rrggbb" string is accepted too.
      { key: "master_bullish_color", type: "color", label: "Bullish Color", default: { tag: "color", r: 0, g: 195, b: 255, a: 1 }, group: "Colors" },
      { key: "master_bearish_color", type: "color", label: "Bearish Color", default: { tag: "color", r: 255, g: 0, b: 98, a: 1 }, group: "Colors" },
      { key: "maType", type: "select", label: "Baseline Type", default: "HMA", group: "Baseline Settings", options: ["SMA", "EMA", "DEMA", "TEMA", "LSMA", "WMA", "MF", "VAMA", "TMA", "HMA", "JMA", "Kijun v2", "EDSMA", "McGinley"].map((v) => ({ value: v, label: v })) },
      { key: "len", type: "number", label: "Baseline Length", default: 60, step: 1, group: "Baseline Settings" },
      { key: "src", type: "source", label: "Source", default: "close", group: "Baseline Settings" },
      { key: "show_baseline_channel", type: "boolean", label: "Show Baseline Channel", default: true, group: "Baseline Settings" },
      { key: "multy", type: "number", label: "Channel Multiplier", default: 0.2, step: 0.05, group: "Baseline Settings" },
      { key: "useTrueRange", type: "boolean", label: "Use True Range for Channel", default: true, group: "Baseline Settings" },
      { key: "SSL2Type", type: "select", label: "SSL2 Type", default: "JMA", group: "SSL Settings", options: ["SMA", "EMA", "DEMA", "TEMA", "WMA", "MF", "VAMA", "TMA", "HMA", "JMA", "McGinley"].map((v) => ({ value: v, label: v })) },
      { key: "len2", type: "number", label: "SSL2 Length", default: 5, step: 1, group: "SSL Settings" },
      { key: "atr_crit", type: "number", label: "Continuation ATR Criteria", default: 0.9, step: 0.1, group: "SSL Settings" },
      { key: "SSL3Type", type: "select", label: "Exit Type", default: "HMA", group: "Exit Settings", options: ["DEMA", "TEMA", "LSMA", "VAMA", "TMA", "HMA", "JMA", "Kijun v2", "McGinley", "MF"].map((v) => ({ value: v, label: v })) },
      { key: "len3", type: "number", label: "Exit Length", default: 15, step: 1, group: "Exit Settings" },
      { key: "atrlen", type: "number", label: "ATR Period", default: 14, step: 1, group: "ATR Settings" },
      { key: "mult", type: "number", label: "ATR Multiplier", default: 1.0, step: 0.1, group: "ATR Settings" },
      { key: "smoothing", type: "select", label: "ATR Smoothing", default: "WMA", group: "ATR Settings", options: ["RMA", "SMA", "EMA", "WMA"].map((v) => ({ value: v, label: v })) },
      { key: "show_atr_bands", type: "boolean", label: "Show ATR Bands", default: false, group: "ATR Settings" },
      { key: "risk_lookback", type: "number", label: "Risk Lookback Period", default: 100, min: 50, max: 500, step: 1, group: "Risk Assessment" },
      { key: "risk_sensitivity", type: "number", label: "Risk Sensitivity", default: 2, min: 0.2, max: 3.0, step: 0.1, group: "Risk Assessment" },
      { key: "enable_risk_gradient", type: "boolean", label: "Enable Risk Gradient", default: true, group: "Risk Assessment" },
      { key: "jurik_phase", type: "number", label: "Phase", default: 3, step: 1, group: "Jurik (JMA) Settings" },
      { key: "jurik_power", type: "number", label: "Power", default: 1, step: 1, group: "Jurik (JMA) Settings" },
      { key: "kidiv", type: "number", label: "Kijun MOD Divider", default: 1, max: 4, step: 1, group: "Kijun Settings" },
      { key: "volatility_lookback", type: "number", label: "Volatility Lookback Length", default: 10, step: 1, group: "VAMA Settings" },
      { key: "beta", type: "number", label: "Beta", default: 0.8, min: 0, max: 1, step: 0.1, group: "Modular Filter Settings" },
      { key: "feedback", type: "boolean", label: "Feedback", default: false, group: "Modular Filter Settings" },
      { key: "z", type: "number", label: "Feedback Weighting", default: 0.5, min: 0, max: 1, step: 0.1, group: "Modular Filter Settings" },
      { key: "ssfLength", type: "number", label: "Super Smoother Filter Length", default: 20, min: 1, step: 1, group: "EDSMA Settings" },
      // A menu holds text, so the two pole counts are "2" and "3".
      { key: "ssfPoles", type: "select", label: "Super Smoother Filter Poles", default: "2", group: "EDSMA Settings", options: [{ value: "2", label: "2" }, { value: "3", label: "3" }] },
    ],
    plots: [
      { key: "baseline", type: "line", title: "Baseline", style: { lineWidth: 3 } },
      { key: "upperChannel", type: "line", title: "Upper Channel", style: { lineWidth: 1 } },
      { key: "lowerChannel", type: "line", title: "Lower Channel", style: { lineWidth: 1 } },
      { key: "ssl1", type: "line", title: "SSL1", style: { lineWidth: 2 } },
      { key: "ssl2", type: "line", title: "SSL2", style: { lineWidth: 2 } },
      { key: "atrUpper", type: "line", title: "+ATR", style: { color: "#666666", lineWidth: 1 } },
      { key: "atrLower", type: "line", title: "-ATR", style: { color: "#666666", lineWidth: 1 } },
    ],
    fills: [{ from: "upperChannel", to: "lowerChannel", title: "Baseline Channel" }],
    calc(bars, s) {
      const n = bars.length
      const na = (v) => v === null || v === undefined || Number.isNaN(v)
      const nz = (v, d = 0) => (na(v) ? d : v)
      const at = (arr, i) => (i >= 0 && i < arr.length ? arr[i] : null)
      // A comparison with an absent value is false.
      const gt = (a, b) => !na(a) && !na(b) && a > b
      const lt = (a, b) => !na(a) && !na(b) && a < b
      const ge = (a, b) => !na(a) && !na(b) && a >= b
      const le = (a, b) => !na(a) && !na(b) && a <= b

      const pick = (b) => {
        switch (s.src) {
          case "open": return b.open
          case "high": return b.high
          case "low": return b.low
          case "hl2": return (b.high + b.low) / 2
          case "hlc3": return (b.high + b.low + b.close) / 3
          case "ohlc4": return (b.open + b.high + b.low + b.close) / 4
          default: return b.close
        }
      }
      const closes = bars.map((b) => b.close)
      const opens = bars.map((b) => b.open)
      const highs = bars.map((b) => b.high)
      const lows = bars.map((b) => b.low)
      const srcs = bars.map(pick)

      // ---- averages ------------------------------------------------------
      const ema = (xs, len) => {
        const a = 2 / (len + 1)
        const out = new Array(n).fill(null)
        let prev = null
        for (let i = 0; i < n; i++) {
          const x = xs[i]
          const v = na(prev) ? (na(x) ? null : x) : na(x) ? null : a * x + (1 - a) * prev
          out[i] = v
          prev = v
        }
        return out
      }
      // The window ending at bar i, or null while it is short or holds an absent value.
      const windowOf = (xs, len, i) => {
        if (i < len - 1) return null
        const w = []
        for (let k = i - len + 1; k <= i; k++) {
          if (na(xs[k])) return null
          w.push(xs[k])
        }
        return w
      }
      const windowed = (fn) => (xs, len) => xs.map((_, i) => {
        const w = windowOf(xs, len, i)
        return w === null ? null : fn(w, len)
      })
      const sma = windowed((w, len) => w.reduce((t, v) => t + v, 0) / len)
      const wma = windowed((w, len) => {
        let num = 0
        for (let k = 0; k < len; k++) num += w[k] * (k + 1)
        return num / ((len * (len + 1)) / 2)
      })
      const stdev = windowed((w, len) => {
        const m = w.reduce((t, v) => t + v, 0) / len
        let ss = 0
        for (const v of w) ss += (v - m) * (v - m)
        return Math.sqrt(ss / len)
      })
      // Least squares line through the window, read at its newest point.
      const linreg = windowed((w, len) => {
        let sx = 0, sy = 0, sxx = 0, sxy = 0
        for (let k = 0; k < len; k++) {
          sx += k
          sy += w[k]
          sxx += k * k
          sxy += k * w[k]
        }
        const den = len * sxx - sx * sx
        const slope = den === 0 ? 0 : (len * sxy - sx * sy) / den
        const intercept = (sy - slope * sx) / len
        return intercept + slope * (len - 1)
      })
      const highest = windowed((w) => Math.max(...w))
      const lowest = windowed((w) => Math.min(...w))
      const rma = (xs, len) => {
        const seed = sma(xs, len)
        const a = 1 / len
        const out = new Array(n).fill(null)
        let prev = null
        for (let i = 0; i < n; i++) {
          const v = na(prev) ? seed[i] : na(xs[i]) ? null : a * xs[i] + (1 - a) * prev
          out[i] = v
          prev = v
        }
        return out
      }

      // Super smoothers of two and three poles; earlier values read as zero.
      const ssf2 = (xs, len) => {
        const PI = 2 * Math.asin(1)
        const arg = (Math.sqrt(2) * PI) / len
        const a1 = Math.exp(-arg)
        const b1 = 2 * a1 * Math.cos(arg)
        const c2 = b1
        const c3 = -Math.pow(a1, 2)
        const c1 = 1 - c2 - c3
        const out = new Array(n).fill(null)
        for (let i = 0; i < n; i++) {
          const x = xs[i]
          out[i] = na(x) ? null : c1 * x + c2 * nz(at(out, i - 1)) + c3 * nz(at(out, i - 2))
        }
        return out
      }
      const ssf3 = (xs, len) => {
        const PI = 2 * Math.asin(1)
        const arg = PI / len
        const a1 = Math.exp(-arg)
        const b1 = 2 * a1 * Math.cos(1.738 * arg)
        const c1 = Math.pow(a1, 2)
        const coef2 = b1 + c1
        const coef3 = -(c1 + b1 * c1)
        const coef4 = Math.pow(c1, 2)
        const coef1 = 1 - coef2 - coef3 - coef4
        const out = new Array(n).fill(null)
        for (let i = 0; i < n; i++) {
          const x = xs[i]
          out[i] = na(x) ? null : coef1 * x + coef2 * nz(at(out, i - 1)) + coef3 * nz(at(out, i - 2)) + coef4 * nz(at(out, i - 3))
        }
        return out
      }

      const ma = (type, xs, len) => {
        const half = Math.max(1, Math.floor(len / 2))
        switch (type) {
          case "TMA":
            return sma(sma(xs, Math.ceil(half)), Math.floor(len / 2) + 1)
          case "MF": {
            const alpha = 2 / (len + 1)
            const out = new Array(n).fill(null)
            let tsPrev = null, bPrev = null, cPrev = null, osPrev = null
            for (let i = 0; i < n; i++) {
              const x = xs[i]
              const a = s.feedback ? s.z * x + (1 - s.z) * nz(tsPrev, x) : x
              const bx = alpha * a + (1 - alpha) * nz(bPrev, a)
              const b = a > bx ? a : bx
              const cx = alpha * a + (1 - alpha) * nz(cPrev, a)
              const c = a < cx ? a : cx
              const os = a === b ? 1 : a === c ? 0 : osPrev
              const upper = s.beta * b + (1 - s.beta) * c
              const lower = s.beta * c + (1 - s.beta) * b
              const ts = na(os) ? null : os * upper + (1 - os) * lower
              out[i] = ts
              tsPrev = ts
              bPrev = b
              cPrev = c
              osPrev = os
            }
            return out
          }
          case "LSMA":
            return linreg(xs, len)
          case "SMA":
            return sma(xs, len)
          case "EMA":
            return ema(xs, len)
          case "DEMA": {
            const e = ema(xs, len)
            const ee = ema(e, len)
            return e.map((v, i) => (na(v) || na(ee[i]) ? null : 2 * v - ee[i]))
          }
          case "TEMA": {
            const e = ema(xs, len)
            const ee = ema(e, len)
            const eee = ema(ee, len)
            return e.map((v, i) => (na(v) || na(ee[i]) || na(eee[i]) ? null : 3 * (v - ee[i]) + eee[i]))
          }
          case "WMA":
            return wma(xs, len)
          case "VAMA": {
            const mid = ema(xs, len)
            const dev = xs.map((x, i) => (na(x) || na(mid[i]) ? null : x - mid[i]))
            const up = highest(dev, s.volatility_lookback)
            const dn = lowest(dev, s.volatility_lookback)
            return mid.map((m, i) => (na(m) || na(up[i]) || na(dn[i]) ? null : m + (up[i] + dn[i]) / 2))
          }
          case "HMA": {
            const w1 = wma(xs, half)
            const w2 = wma(xs, len)
            const diff = w1.map((v, i) => (na(v) || na(w2[i]) ? null : 2 * v - w2[i]))
            return wma(diff, Math.round(Math.sqrt(len)))
          }
          case "JMA": {
            const ph = s.jurik_phase
            const phaseRatio = ph < -100 ? 0.5 : ph > 100 ? 2.5 : ph / 100 + 1.5
            const beta = (0.45 * (len - 1)) / (0.45 * (len - 1) + 2)
            const alpha = Math.pow(beta, s.jurik_power)
            const out = new Array(n).fill(null)
            let e0 = null, e1 = null, e2 = null, jma = null
            for (let i = 0; i < n; i++) {
              const x = xs[i]
              e0 = (1 - alpha) * x + alpha * nz(e0)
              e1 = (x - e0) * (1 - beta) + beta * nz(e1)
              e2 = (e0 + phaseRatio * e1 - nz(jma)) * Math.pow(1 - alpha, 2) + Math.pow(alpha, 2) * nz(e2)
              jma = e2 + nz(jma)
              out[i] = jma
            }
            return out
          }
          case "Kijun v2": {
            const kn = Math.max(1, Math.floor(len / s.kidiv))
            const lo1 = lowest(lows, len)
            const hi1 = highest(highs, len)
            const lo2 = lowest(lows, kn)
            const hi2 = highest(highs, kn)
            return lo1.map((_, i) => {
              if (na(lo1[i]) || na(hi1[i]) || na(lo2[i]) || na(hi2[i])) return null
              const kijun = (lo1[i] + hi1[i]) / 2
              const conversionLine = (lo2[i] + hi2[i]) / 2
              return (kijun + conversionLine) / 2
            })
          }
          case "McGinley": {
            const e = ema(xs, len)
            const out = new Array(n).fill(null)
            let mg = null
            for (let i = 0; i < n; i++) {
              const x = xs[i]
              mg = na(mg) ? e[i] : mg + (x - mg) / (len * Math.pow(x / mg, 4))
              out[i] = mg
            }
            return out
          }
          case "EDSMA": {
            const zeros = xs.map((x, i) => x - nz(at(xs, i - 2)))
            const avgZeros = zeros.map((v, i) => (i === 0 ? null : (v + zeros[i - 1]) / 2))
            const ssf = s.ssfPoles === "2" ? ssf2(avgZeros, s.ssfLength) : ssf3(avgZeros, s.ssfLength)
            const sd = stdev(ssf, len)
            const out = new Array(n).fill(null)
            let ed = null
            for (let i = 0; i < n; i++) {
              const scaledFilter = !na(sd[i]) && sd[i] !== 0 ? ssf[i] / sd[i] : 0
              const alpha = (5 * Math.abs(scaledFilter)) / len
              ed = alpha * xs[i] + (1 - alpha) * nz(ed)
              out[i] = ed
            }
            return out
          }
          default:
            return new Array(n).fill(null)
        }
      }

      // ---- average true range ---------------------------------------------
      const trFirstHL = bars.map((b, i) =>
        i === 0 ? b.high - b.low : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close)),
      )
      const trPlain = trFirstHL.map((v, i) => (i === 0 ? null : v))
      const atr =
        s.smoothing === "RMA" ? rma(trFirstHL, s.atrlen) : s.smoothing === "SMA" ? sma(trFirstHL, s.atrlen) : s.smoothing === "EMA" ? ema(trFirstHL, s.atrlen) : wma(trFirstHL, s.atrlen)
      const upperBand = atr.map((a, i) => (na(a) ? null : a * s.mult + closes[i]))
      const lowerBand = atr.map((a, i) => (na(a) ? null : closes[i] - a * s.mult))

      // ---- risk ----------------------------------------------------------
      const L = s.risk_lookback
      const pct = atr.map((a, i) => {
        if (na(a) || i < L) return null
        let count = 0
        for (let k = 1; k <= L; k++) {
          const e = atr[i - k]
          if (na(e)) return null
          if (e <= a) count++
        }
        return (count / L) * 100
      })
      const saturation = pct.map((p) => {
        if (!s.enable_risk_gradient) return 0
        if (na(p)) return null
        const adj = Math.pow(p / 100, s.risk_sensitivity) * 100
        if (adj <= 25) return 0
        if (adj <= 50) return 10
        return Math.round(25 + ((adj - 50) / 50) * 25)
      })
      // A colour at a transparency in percent; absent when the transparency is.
      const hexOf = (c, fallback) => {
        if (typeof c === "string") return c.slice(0, 7)
        if (c && typeof c === "object") return "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
        return fallback
      }
      const withTransparency = (hex, t) => {
        if (na(t)) return null
        const alpha = Math.round(((100 - Math.max(0, Math.min(100, t))) / 100) * 255)
        return hex + alpha.toString(16).padStart(2, "0")
      }
      const bullHex = hexOf(s.master_bullish_color, "#00c3ff")
      const bearHex = hexOf(s.master_bearish_color, "#ff0062")
      const bullish = saturation.map((t) => withTransparency(bullHex, t))
      const bearish = saturation.map((t) => withTransparency(bearHex, t))
      const neutral = "#666666ff"

      // ---- baseline and SSL lines ------------------------------------------
      const BBMC = ma(s.maType, closes, s.len)
      const Keltma = ma(s.maType, srcs, s.len)
      const rangeValue = s.useTrueRange ? trPlain : bars.map((b) => b.high - b.low)
      const rangema = ema(rangeValue, s.len)
      const upperk = Keltma.map((k, i) => (na(k) || na(rangema[i]) ? null : k + rangema[i] * s.multy))
      const lowerk = Keltma.map((k, i) => (na(k) || na(rangema[i]) ? null : k - rangema[i] * s.multy))

      // The side flips when the close leaves the channel of the two averages;
      // the line is the opposite edge (the low average while the side is absent).
      const sslLine = (hi, lo) => {
        const out = new Array(n).fill(null)
        let hlv = null
        for (let i = 0; i < n; i++) {
          hlv = gt(closes[i], hi[i]) ? 1 : lt(closes[i], lo[i]) ? -1 : hlv
          out[i] = lt(hlv, 0) ? hi[i] : lo[i]
        }
        return out
      }
      const sslDown = sslLine(ma(s.maType, highs, s.len), ma(s.maType, lows, s.len))
      const sslDown2 = sslLine(ma(s.SSL2Type, highs, s.len2), ma(s.SSL2Type, lows, s.len2))
      const sslExit = sslLine(ma(s.SSL3Type, highs, s.len3), ma(s.SSL3Type, lows, s.len3))

      // ---- signals -------------------------------------------------------
      const crossover = (a, b, i) => i > 0 && gt(a[i], b[i]) && le(a[i - 1], b[i - 1])
      const crossunder = (a, b, i) => i > 0 && lt(a[i], b[i]) && ge(a[i - 1], b[i - 1])
      const longCross = bars.map((_, i) => crossover(closes, sslExit, i))
      const shortCross = bars.map((_, i) => crossover(sslExit, closes, i))

      const candleViolation = bars.map((_, i) => {
        const atrViolation = gt(Math.abs(closes[i] - opens[i]), atr[i])
        const inRange = gt(upperBand[i], BBMC[i]) && lt(lowerBand[i], BBMC[i])
        return atrViolation && inRange
      })
      const buyAtr = bars.map((_, i) => {
        const lowerHalf = na(atr[i]) ? null : closes[i] - atr[i] * s.atr_crit
        return lt(lowerHalf, sslDown2[i]) && gt(closes[i], BBMC[i]) && gt(closes[i], sslDown2[i])
      })
      const sellAtr = bars.map((_, i) => {
        const upperHalf = na(atr[i]) ? null : atr[i] * s.atr_crit + closes[i]
        return gt(upperHalf, sslDown2[i]) && lt(closes[i], BBMC[i]) && lt(closes[i], sslDown2[i])
      })

      // ---- what is drawn -------------------------------------------------
      const mode = s.display_mode
      const showBaseline = mode === "Baseline Only" || mode === "Baseline + SSL" || mode === "Full Display"
      const showSsl1 = mode === "SSL Only" || mode === "Baseline + SSL" || mode === "Full Display"
      const showSsl2 = mode === "SSL Only" || mode === "Full Display"
      const showExit = mode === "Entry/Exit Only" || mode === "Full Display"
      const showChannel = showBaseline && s.show_baseline_channel
      const when = (on, xs) => xs.map((v) => (on && !na(v) ? v : null))

      // Line colours: bullish above the channel (or the line, or on an SSL2
      // continuation), bearish below, grey otherwise.
      const baselineColor = bars.map((_, i) => (gt(closes[i], upperk[i]) ? bullish[i] : lt(closes[i], lowerk[i]) ? bearish[i] : neutral))
      const ssl1Color = bars.map((_, i) => (gt(closes[i], sslDown[i]) ? bullish[i] : lt(closes[i], sslDown[i]) ? bearish[i] : neutral))
      const ssl2Color = bars.map((_, i) => (buyAtr[i] ? bullish[i] : sellAtr[i] ? bearish[i] : neutral))

      // The risk table, on the newest bar: the risk level from the percentile,
      // the close's distance from the baseline in average true ranges (an
      // absent distance compares false and reads "Far"), the percentile to one
      // decimal and the average true range to four.
      const last = n - 1
      const p = pct[last]
      const dist = na(BBMC[last]) || na(atr[last]) ? null : Math.abs(closes[last] - BBMC[last]) / atr[last]
      const riskTable = s.show_risk_table
        ? [
            ["Risk Level", gt(p, 75) ? "High" : lt(p, 25) ? "Low" : "Normal"],
            ["Entry Distance", lt(dist, 1) ? "Near" : lt(dist, 2) ? "Extended" : "Far"],
            ["Vol %ile", String(na(p) ? "none" : Math.round(p * 10) / 10) + "%"],
            ["ATR", String(na(atr[last]) ? "none" : Math.round(atr[last] * 10000) / 10000)],
          ]
        : null

      const markers = []
      for (let i = 0; i < n; i++) {
        if (showExit && longCross[i]) markers.push({ time: bars[i].time, kind: "exitUp", position: "belowBar", shape: "arrowUp" })
        else if (showExit && shortCross[i]) markers.push({ time: bars[i].time, kind: "exitDown", position: "aboveBar", shape: "arrowDown" })
        if (s.show_signals && candleViolation[i]) markers.push({ time: bars[i].time, kind: "diamond", position: "aboveBar", shape: "diamond" })
      }
      // SSL2 is drawn as dots, one on every bar it has a value, which the
      // gate counts as point events like any other mark.
      const ssl2Values = when(showSsl2, sslDown2)
      for (let i = 0; i < n; i++) if (ssl2Values[i] !== null && ssl2Values[i] !== undefined && !Number.isNaN(ssl2Values[i])) markers.push({ time: bars[i].time, kind: "ssl2" })

      return {
        baseline: when(showBaseline, BBMC),
        upperChannel: when(showChannel, upperk),
        lowerChannel: when(showChannel, lowerk),
        ssl1: when(showSsl1, sslDown),
        ssl2: when(showSsl2, sslDown2),
        atrUpper: when(s.show_atr_bands, upperBand),
        atrLower: when(s.show_atr_bands, lowerBand),
        _barColors: s.color_bars ? baselineColor : new Array(n).fill(null),
        _markers: markers,
        _colors: { baseline: baselineColor, ssl1: ssl1Color, ssl2: ssl2Color },
        _riskTable: riskTable,
      }
    },
    barColors({ values }) {
      return values._barColors
    },
    markers({ values }) {
      return values._markers
    },
  })
}
