// The scripts the /script playground opens with. HalfTrend comes first because
// it is the study the landing page shows running in /trading; the others are
// the examples folder of the OpenScript repository, line for line, with the
// comments shortened for a first read.

const HALFTREND = `// HalfTrend: a trend level that holds flat through noise and turns only when
// the other side of the range gives way. Blue while the trend is up, red while
// it is down, with a shaded channel and a label on every flip.
version 1

study("HalfTrend", overlay = true, precision = 2)

amplitude = input(2, "Amplitude", min = 1, max = 100)
channelDev = input(2, "Channel deviation", min = 0, max = 20)
atrLen = input(100, "ATR length", min = 1, max = 500)

half = atr(atrLen) / 2
dev = channelDev * half
rollHigh = highest(high, amplitude)
rollLow = lowest(low, amplitude)
meanHigh = sma(high, amplitude)
meanLow = sma(low, amplitude)
prevHigh = bar.isFirst ? high : high[1]
prevLow = bar.isFirst ? low : low[1]

// trend is 0 while up and 1 while down; armed is the flip being watched for.
var trend = 0
var armed = 0
var maxLow = low
var minHigh = high
var upLevel = low
var downLevel = high

wasTrend = bar.isFirst ? -1 : trend

if armed == 1
    maxLow = max(orElse(rollLow, maxLow), maxLow)
    if not isNone(meanHigh) and meanHigh < maxLow and close < prevLow
        trend = 1
        armed = 0
        minHigh = orElse(rollHigh, high)
else
    minHigh = min(orElse(rollHigh, minHigh), minHigh)
    if not isNone(meanLow) and meanLow > minHigh and close > prevHigh
        trend = 0
        armed = 1
        maxLow = orElse(rollLow, low)

flipUp = trend == 0 and wasTrend == 1
flipDown = trend == 1 and wasTrend == 0

// On a flip the new level starts where the other side ended, so it steps.
if trend == 0
    upLevel = flipUp ? downLevel : wasTrend == -1 ? maxLow : max(maxLow, upLevel)
else
    downLevel = flipDown ? upLevel : wasTrend == -1 ? minHigh : min(minHigh, downLevel)

ht = trend == 0 ? upLevel : downLevel

upLine = plot(trend == 0 ? ht : none, "Up trend", #2962ff, width = 2)
downLine = plot(trend == 1 ? ht : none, "Down trend", #ef5350, width = 2)
upEdge = plot(trend == 0 ? ht - dev : none, "Channel low", fade(#2962ff, 55), width = 1)
downEdge = plot(trend == 1 ? ht + dev : none, "Channel high", fade(#ef5350, 55), width = 1)
fill(upLine, upEdge, fade(#2962ff, 82))
fill(downLine, downEdge, fade(#ef5350, 82))

if flipUp
    signal("Buy", #2962ff, at = "below", shape = "label")

if flipDown
    signal("Sell", #ef5350, at = "above", shape = "label")
`

const SUPERTREND = `// A trailing volatility stop: a band set a multiple of the average true range
// away from each bar, that only moves in the trend's favour and flips sides
// when the close crosses it.

version 1

study("Trailing volatility stop", overlay = true, precision = 2)

atrLen = input(10,  "ATR length", min = 1, max = 200)
mult   = input(3.0, "Band width, in ATR", min = 0.5, max = 20)
paint  = input(true, "Recolour the candles")

atrValue = atr(atrLen)

// The raw bands, recomputed from scratch on every bar.
rawLower = hl2 - mult * atrValue
rawUpper = hl2 + mult * atrValue

// var keeps a value from one bar to the next.
var lowerBand = none
var upperBand = none
var dir = 1

// Until it is assigned again below, a var still holds the previous bar's value.
prevLower = lowerBand
prevUpper = upperBand

// On the first bars there is no previous band yet: start from the raw one.
heldLower = orElse(prevLower, rawLower)
heldUpper = orElse(prevUpper, rawUpper)

lowerBand = close[1] > heldLower ? max(rawLower, heldLower) : rawLower
upperBand = close[1] < heldUpper ? min(rawUpper, heldUpper) : rawUpper

if not isNone(prevUpper) and close > prevUpper
    dir = 1
else if not isNone(prevLower) and close < prevLower
    dir = -1

stopLine = dir == 1 ? lowerBand : upperBand

// Two plots, one per side, so each has its own colour and a gap where it is off.
plot(dir ==  1 ? stopLine : none, "Stop, long",  lime, width = 2)
plot(dir == -1 ? stopLine : none, "Stop, short", red,  width = 2)

upperPlot = plot(rawUpper, "Upper band", fade(silver, 60))
lowerPlot = plot(rawLower, "Lower band", fade(silver, 60))
fill(upperPlot, lowerPlot, fade(silver, 94))

barColor(paint ? (dir == 1 ? lime : red) : none)

// Mark the bar where the trend changes side.
if not bar.isFirst and dir != dir[1]
    signal(dir == 1 ? "TREND UP" : "TREND DOWN")
`

const EMA_CROSS = `// Two exponential moving averages, the band between them, and a marker on the
// bar where they cross.

version 1

study("EMA cross", overlay = true, precision = 2)

fastLen = input(9,  "Fast length", min = 1, max = 500)
slowLen = input(21, "Slow length", min = 1, max = 500)
src     = input(close, "Source")

fast = ema(src, fastLen)
slow = ema(src, slowLen)

// Compute the crossings on every bar, then use them in the branches below.
up   = crossUp(fast, slow)
down = crossDown(fast, slow)

// fill shades between two plots, so both plots are named.
fastPlot = plot(fast, "Fast", aqua, width = 2)
slowPlot = plot(slow, "Slow", orange, width = 2)
fill(fastPlot, slowPlot, fade(aqua, 90))

if up
    signal("BUY")

if down
    signal("SELL")
`

const STRATEGY = `// The EMA cross, traded: a stop and a target fixed at entry, and a size chosen
// so that the stop costs the same amount on every trade.

version 1

strategy("EMA cross, bracketed", overlay = true, precision = 2,
         capital = 500000, qtyType = "units", qty = 1,
         product = "intraday", pyramiding = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

fastLen    = input(9,    "Fast length", min = 1, max = 500)
slowLen    = input(21,   "Slow length", min = 1, max = 500)
atrLen     = input(14,   "ATR length",  min = 1, max = 200)
stopMult   = input(2.0,  "Stop, in ATR",   min = 0.2, max = 20)
targetMult = input(3.0,  "Target, in ATR", min = 0.2, max = 40)
riskAmount = input(5000, "Amount risked per trade", min = 1)

fast = ema(close, fastLen)
slow = ema(close, slowLen)
atrValue = atr(atrLen)

stopDistance   = stopMult * atrValue
targetDistance = targetMult * atrValue

// Size from the distance to the stop, rounded down to whole lots.
lotUnits  = max(orElse(chart.lotSize, 1), 1)
rawUnits  = stopDistance > 0 ? riskAmount / stopDistance : none
orderQty  = isNone(rawUnits) ? none : floor(rawUnits / lotUnits) * lotUnits

var entryStop   = none
var entryTarget = none

flat    = pos.size == 0
canSize = not isNone(orderQty) and orderQty > 0

if crossUp(fast, slow) and flat and canSize
    // Stop and target in one exit call, so a gap cannot fill them separately.
    entryStop   = close - stopDistance
    entryTarget = close + targetDistance
    buy(qty = orderQty, tag = "entry")
    exit(tag = "entry", stop = entryStop, limit = entryTarget)

if crossDown(fast, slow) and pos.size > 0
    entryStop   = none
    entryTarget = none
    close()

plot(fast, "Fast", aqua, width = 2)
plot(slow, "Slow", orange, width = 2)

// The stop and target as they were sent, not recomputed on every bar.
plot(pos.size > 0 ? entryStop : none,   "Stop",   red,  style = "step")
plot(pos.size > 0 ? entryTarget : none, "Target", lime, style = "step")
plot(pos.size > 0 ? pos.avgPrice : none, "Entry", fade(silver, 40), style = "step")
`

const trim = (s) => s.replace(/\n+$/, "")

export const EXAMPLES = [
  { id: "halftrend", file: "halftrend.oscript", kind: "Study", code: trim(HALFTREND) },
  { id: "supertrend", file: "supertrend.oscript", kind: "Study", code: trim(SUPERTREND) },
  { id: "ema-cross", file: "ema-cross.oscript", kind: "Study", code: trim(EMA_CROSS) },
  { id: "ema-cross-strategy", file: "ema-cross-strategy.oscript", kind: "Strategy", code: trim(STRATEGY) },
]
