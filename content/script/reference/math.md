---
title: Math
description: Arithmetic, rounding, powers, logarithms, remainders, trigonometry and the math.* constants, with the exact result each function gives at its edges.
---

The functions on this page work on one number at a time: rounding a price to the instrument's tick, sizing a quantity in whole lots, taking a logarithm for returns, holding a value inside a range. They read no history and keep no state, so each has a value from bar 0 whenever its arguments do. The everyday ones are bare names, such as [[abs()]], [[round()]] and [[max()]]. The ones a trading script needs less often, trigonometry among them, sit under the `math` namespace: [[math.sin()]], [[math.pi]] and the rest.

What sets these apart is their behaviour at the edges. This page states where each function gives `none`, the absent value, instead of a number, how halves round, and how [[mod()]] differs from the `%` operator. Those details decide whether a stop lands on a valid price and whether a study survives one bad bar.

```openscript title="Strike and stop levels"
version 1
study("Strike and stop levels", overlay = true, precision = 2)

strikeGap = input(50, "Strike interval", min = 0.05)
atrMult   = input(1.5, "Stop distance, in ATRs", min = 0.1, max = 10)

// The at-the-money strike: the close rounded to the nearest strike interval.
atm = roundToStep(close, strikeGap)

// A stop below the close, on a price the exchange accepts.
stopPrice = roundToTick(close - atrMult * atr(14))

// How far away the stop is, as a percentage of the close.
riskPct = (close - stopPrice) / close * 100

plot(atm, "ATM strike", orange, style = "step")
plot(stopPrice, "Stop", red, style = "step")

if bar.isLast
    print("ATM " + text(atm, 0) + ", stop " + text(stopPrice, 2) + ", risk " + text(riskPct, 1) + "%")
```

NIFTY options near the money are listed every 50 points, so the default gives the at-the-money strike; set the interval to 100 for BANKNIFTY. The stop is placed on a whole number of ticks. On a chart whose instrument has no known tick size, [[roundToTick()]] returns `none` and the stop line is simply not drawn.

## Rules every function here follows

| Rule | What it means for your script |
|---|---|
| There is no integer type | A length, a bar count, a quantity and a price are all `number`, so nothing needs converting |
| A number is always finite | An operation with no finite real answer gives `none`, never infinity: `1 / 0`, `sqrt(-1)`, `log(0)`, an overflow |
| Absence passes through | An absent argument gives an absent result: `max(close, none)` is `none` |
| A malformed argument stops the script | `round(x, 2.5)` and `round(x, -2)` stop the script on that bar with [OS4003](/script/errors/runtime#os4003) |
| No state and no warmup | Each call reads only this bar's arguments, so there is no run of early bars without a value: the first value is on bar 0 |

Each parameter is typed `number`, and a series number is accepted too: `abs(close - open)` is computed on every bar. A `bool` is refused, because a condition is not a number: `abs(close > open)` is error `OS3011`.

The line between the rows that give `none` and the row that stops is the line between "the answer does not exist" and "the question was malformed". A division by zero on one flat bar must not end a study that is right on fifty thousand others, so it gives `none` and the plot shows a gap. A count of 2.5 decimal places can never be right, so the script stops on that bar, and on a chart the study is marked as errored with a message naming the call, the argument and the value it received. [Runtime errors](/script/errors/runtime) shows where that message appears.

### Results at the edges

| Expression | Result | Why |
|---|---|---|
| `round(2.5)` | `3` | Halves round away from zero |
| `round(-2.5)` | `-3` | The same rule below zero |
| `floor(-2.5)` | `-3` | Toward negative infinity |
| `ceil(-2.5)` | `-2` | Toward positive infinity |
| `trunc(-2.5)` | `-2` | Toward zero |
| `mod(-7, 3)` | `2` | Takes the sign of the divisor |
| `-7 % 3` | `-1` | Takes the sign of the left operand |
| `mod(5, 0)` | `none` | No finite answer |
| `1 / 0` | `none` | No finite answer |
| `sqrt(-1)` | `none` | No real answer |
| `log(0)` | `none` | No finite answer |
| `pow(10, 400)` | `none` | Too large to be a finite number |
| `pow(-8, 1 / 3)` | `none` | No real answer |
| `exp(1000)` | `none` | Too large to be a finite number |
| `math.asin(2)` | `none` | Outside -1 to 1 |
| `max(close, none)` | `none` | Absence passes through |

:::note
[[exp()]], [[log()]], [[log10()]], [[math.log2()]], [[pow()]], [[math.hypot()]] and the trigonometric functions can differ in the last binary digit from one computer to another. OpenScript does not yet fix one exact method for them, so these results carry no bit-for-bit guarantee across platforms. The difference is far below anything a chart shows. [[sqrt()]], the rounding functions and every other function on this page give identical results everywhere.
:::

## Sign and size

{{entry: abs()}}

The size of `x` without its sign: `abs(-3)` is `3`. Use it for a candle's body regardless of colour, a distance between two prices, or the size of a move in either direction.

```openscript
version 1
study("Doji bars", overlay = true)

body     = abs(close - open)
barRange = high - low

if barRange > 0 and body <= 0.1 * barRange
    signal("DOJI", at = "above", shape = "diamond")
```

**Remarks.** An absent `x` gives `none`.

**See also.** [[sign()]], [[max()]]

{{entry: sign()}}

`-1` when `x` is negative, `0` when it is zero and `1` when it is positive. Use it to turn a move into a direction and count directions.

```openscript
version 1
study("Direction of the close", precision = 0)

dir = sign(change(close))
plot(dir, "Direction", silver, style = "column")
plot(sum(dir, 10), "Net direction over 10 bars", aqua)
```

**Remarks.** An unchanged close gives `0`, so it adds nothing to the net count above. An absent `x` gives `none`.

**See also.** [[abs()]], [[change()]], [[count()]]

{{entry: min()}}

The smaller of `a` and `b`. A second form, `min(arr)`, gives the smallest element of an array. The compiler picks the form from the arguments you pass.

```openscript
version 1
study("Wicks", precision = 2)

upperWick = high - max(open, close)
lowerWick = min(open, close) - low

plot(upperWick, "Upper wick", red, style = "column")
plot(lowerWick, "Lower wick", lime, style = "column")
```

**Remarks.** Either argument absent gives `none`. The two value form takes exactly two arguments; for three, nest the calls: `min(min(a, b), c)`, or put the values in an array. `min([3, 9, 4])` is `3`. An empty array has no smallest element, so it gives `none`, and so does an array holding an absent element. For the smallest value of a series over several bars, use [[lowest()]].

**See also.** [[max()]], [[clamp()]], [[lowest()]]

{{entry: max()}}

The larger of `a` and `b`. A second form, `max(arr)`, gives the largest element of an array. Use the two value form for the top of a candle body, a floor under a computed value, or a stop that only moves one way.

```openscript
version 1
study("Stop that only rises", overlay = true)

candidate = close - 2 * atr(14)

var stop = none
if isNone(stop)
    stop = candidate
else
    stop = max(stop, candidate)

plot(stop, "Rising stop", red, style = "step")
```

**Remarks.** Either argument absent gives `none`, which is why the example seeds `stop` separately: `max(none, candidate)` would stay `none` for ever. The array form follows the same rules as [[min()]]: an empty array or an absent element gives `none`. For the largest value of a series over several bars, use [[highest()]].

**See also.** [[min()]], [[highest()]], [Persistence](/script/language/persistence)

{{entry: clamp()}}

`x` held inside the range `lo` to `hi`: `lo` when `x` is below it, `hi` when `x` is above it, and `x` itself otherwise. Use it to keep a computed quantity, a weight or a ratio within sensible bounds.

```openscript
version 1
study("Quantity for a fixed risk", precision = 0)

capital = input(500000, "Capital")
riskPct = input(1, "Risk per trade, %", min = 0.1, max = 5)
maxQty  = input(1000, "Largest quantity", min = 1)

riskPerShare = 2 * atr(14)
rawQty       = floor(capital * riskPct / 100 / riskPerShare)

plot(clamp(rawQty, 1, maxQty), "Quantity", aqua, style = "column")
```

**Remarks.** Keep `lo` at or below `hi`. Nothing checks the order, and with the two reversed the result is never `x`: it is `lo` when `x` is below `lo` and `hi` otherwise, so `clamp(5, 10, 1)` is `10` and `clamp(20, 10, 1)` is `1`. Any absent argument gives `none`.

**See also.** [[min()]], [[max()]], [[order.qtyForRisk()]]

## Rounding

Six ways to make a number whole, or a multiple of something:

| Function | Rounds | `2.5` | `-2.5` |
|---|---|---|---|
| [[floor()]] | Down, toward negative infinity | `2` | `-3` |
| [[ceil()]] | Up, toward positive infinity | `3` | `-2` |
| [[trunc()]] | Toward zero | `2` | `-2` |
| [[round()]] | To the nearest, halves away from zero | `3` | `-3` |
| [[roundToStep()]] | To the nearest multiple of a step | | |
| [[roundToTick()]] | To the nearest multiple of the instrument's tick size | | |

Round when the rounded number is the thing you mean: a quantity in whole lots, a strike, an order price. When only the display should change, format the number with `text(x, decimals)` and keep full precision in the calculation.

{{entry: floor()}}

The largest whole number at or below `x`. Use it when you must not round up past a limit, such as the number of whole lots a sum of money can buy.

```openscript
version 1
study("Lots the capital buys", precision = 0)

capital  = input(500000, "Capital")
lotUnits = orElse(chart.lotSize, 1)

// Whole lots only: floor never rounds up past what the capital covers.
lots = floor(capital / (close * lotUnits))

plot(lots, "Lots at full value", aqua, style = "column")
```

**Remarks.** Below zero, `floor` moves away from zero: `floor(-2.5)` is `-3`. [[trunc()]] gives `-2`. [[chart.lotSize]] is `none` when the host has not supplied it, which is why the example falls back to 1 unit with [[orElse()]].

**See also.** [[ceil()]], [[trunc()]], [[order.roundToLot()]]

{{entry: ceil()}}

The smallest whole number at or above `x`. Use it when a count must cover everything, such as the lots needed to hedge a holding.

```openscript
version 1
study("Lots to hedge a holding", precision = 0)

shares   = input(1200, "Shares held", min = 1)
lotUnits = input(250, "Lot size of the future", min = 1)

// Round up: the hedge must cover every share, even if the last lot is part used.
plot(ceil(shares / lotUnits), "Lots needed", orange, style = "column")
```

**Remarks.** Below zero, `ceil` moves toward zero: `ceil(-2.5)` is `-2`.

**See also.** [[floor()]], [[round()]]

{{entry: round()}}

`x` rounded to the nearest whole number, or with a second argument to `decimals` places after the point. A value exactly halfway rounds away from zero: `round(2.5)` is `3` and `round(-2.5)` is `-3`.

```openscript
version 1
study("RSI, rounded", precision = 1)

r = rsi(close, 14)
plot(round(r, 1), "RSI to one decimal", purple)

if bar.isLast
    print("RSI " + text(r, 1) + ", nearest whole number " + text(round(r)))
```

**Remarks.** `decimals` must be a whole number, 0 or more; a fraction or a negative number stops the script with [OS4003](/script/errors/runtime#os4003). Numbers are stored in binary, and most decimal fractions are not exact there: `1.005` is held as a value a hair below 1.005, so `round(1.005, 2)` is `1`. Rounding changes the number that later lines compute with; when you only want fewer digits on screen, use `text(x, decimals)` instead.

**See also.** [[roundToStep()]], [[trunc()]], [[text()]]

{{entry: trunc()}}

`x` with its fraction removed, rounding toward zero: `trunc(1.7)` is `1` and `trunc(-1.7)` is `-1`. Use it when a value should shrink toward zero on both sides alike.

```openscript
version 1
study("Whole ATRs from the average", precision = 0)

avg20    = ema(close, 20)
distance = (close - avg20) / atr(14)

// trunc treats both sides alike: 1.7 ATRs above and 1.7 below both count
// as one whole ATR.
plot(trunc(distance), "Whole ATRs", aqua, style = "column")
```

**Remarks.** For values at or above zero, `trunc` and [[floor()]] agree; they differ only below zero.

**See also.** [[floor()]], [[ceil()]]

{{entry: roundToStep()}}

`x` rounded to the nearest multiple of the step, with halves going away from zero. Use it for strikes, round-number levels, or a price grid of your own.

```openscript
version 1
study("Nearest round number", overlay = true)

gap = input(100, "Round to the nearest", min = 0.05)
plot(roundToStep(close, gap), "Nearest round number", orange, style = "step")
```

**Remarks.** With a step of 50, `22437` rounds to `22450` and the halfway value `22425` rounds up to `22450` as well. The step must be above zero; a step of zero or below gives `none`. To always round down to the step, write `floor(x / gap) * gap`.

**See also.** [[roundToTick()]], [[round()]]

{{entry: roundToTick()}}

`price` rounded to the nearest multiple of the instrument's tick size, [[chart.tickSize]]. Use it for any price you place an order at or draw as a level, so that it is a price the exchange accepts.

```openscript
version 1
study("Limit price below the close", overlay = true)

offsetPct  = input(0.5, "Distance below the close, %", min = 0.1, max = 5)
limitPrice = roundToTick(close * (1 - offsetPct / 100))

plot(limitPrice, "Limit price", aqua, style = "step")
```

**Remarks.** With a tick size of 0.05, `roundToTick(101.23)` is `101.25`. When the host has not supplied a tick size, the result is `none` rather than the unrounded price, because a price that looks rounded and is not would be rejected later with a less helpful message. An order given an absent price is refused with [OS7002](/script/errors/orders#os7002), which names the argument.

**See also.** [[roundToStep()]], [[chart.tickSize]], [Orders](/script/strategies/orders)

## Powers, roots and logarithms

{{entry: sqrt()}}

The square root of `x`, and `none` when `x` is below zero. Use it to scale a volatility over time, or in any formula built on a variance.

```openscript
version 1
study("Expected move from implied volatility", overlay = true)

iv   = input(14, "Implied volatility, %", min = 1, max = 200)
days = input(7, "Calendar days to expiry", min = 1, max = 365)

// One standard deviation of movement over the period, from an annual figure.
move = close * iv / 100 * sqrt(days / 365)

plot(close + move, "Upper expected", red)
plot(close - move, "Lower expected", lime)
```

**Remarks.** A variance computed by hand, such as the mean of squares less the square of the mean, can come out a hair below zero on a run of nearly equal prices. That is binary rounding, not data. Guard it with `sqrt(max(v, 0))` so one bar does not leave a gap. `sqrt` gives the same result on every platform.

**See also.** [[pow()]], [[stdev()]], [[hv()]]

{{entry: pow()}}

`x` raised to the power `y`, and `none` where the result is not a finite real number. Use it for compounding, annualising a return, or any exponent that is not a whole square.

```openscript
version 1
study("Annualised return", precision = 1)

n = input(20, "Period, in daily bars", min = 1, max = 500)

// The return over n sessions, compounded up to a year of about 250 sessions.
growth = close / close[n]
annual = (pow(growth, 250 / n) - 1) * 100

plot(annual, "Annualised return, %", aqua)
level(0, "Zero", gray)
```

**Remarks.** `pow(10, 400)` is too large and gives `none`, and so does `pow(-8, 1 / 3)`, which has no real answer. `pow(0, 0)` is `1`. There is no `^` operator, because it reads as a power to some readers and as something else to others; the compiler stops on it and suggests `pow`:

```openscript expect=OS1001
cube = 2 ^ 3
```

**See also.** [[exp()]], [[sqrt()]], [[log()]]

{{entry: exp()}}

`e` raised to the power `x`, the inverse of [[log()]]. Use it to turn a result computed on logarithms back into a price.

```openscript
version 1
study("Geometric mean of the close", overlay = true)

// The average of the logarithms, turned back into a price with exp.
geo = exp(sma(log(close), 20))

plot(geo, "Geometric mean 20", orange)
plot(sma(close, 20), "Arithmetic mean 20", aqua)
```

**Remarks.** A result too large to be finite, such as `exp(1000)`, gives `none`.

**See also.** [[log()]], [[pow()]], [[math.e]]

{{entry: log()}}

The natural logarithm of `x`, and `none` when `x` is zero or below. Use it for log returns, which add up across bars, or for a log scale of price.

```openscript
version 1
study("Log return", precision = 4)

ret = log(close) - log(close[1])
plot(ret * 100, "Log return, %", aqua, style = "histogram")
plot(sum(ret, 20) * 100, "20 bar log return, %", orange)
```

**Remarks.** Log returns add: the sum of the last 20 one bar log returns equals `log(close / close[20])`, which plain percentage returns do not. `log(0)` and `log(-1)` give `none`.

**See also.** [[exp()]], [[log10()]], [[math.log2()]]

{{entry: log10()}}

The base ten logarithm of `x`, with the same rule as [[log()]]: `none` at zero or below. Use it to read a quantity in orders of magnitude.

```openscript
version 1
study("Turnover in powers of ten", precision = 2)

// Rupee turnover of the bar: 5 is one lakh, 7 is one crore.
turnover = close * volume
plot(log10(turnover), "Turnover, log10", teal)
level(5, "One lakh", gray)
level(7, "One crore", gray)
```

**Remarks.** `log10(1000)` is `3`. On an instrument without volume, such as an index, `volume` is absent and so is the line.

**See also.** [[log()]], [[math.log2()]]

{{entry: math.log2()}}

The base two logarithm of `x`: how many times you double 1 to reach `x`. Use it to count doublings or halvings.

```openscript
version 1
study("Doublings since the first bar", precision = 2)

var firstClose = close
plot(math.log2(close / firstClose), "Doublings", aqua)
level(1, "Doubled", gray)
```

**Remarks.** `math.log2(8)` is `3`. Like [[log()]], it gives `none` at zero or below.

**See also.** [[log()]], [[log10()]]

{{entry: math.e}}

The number e, about 2.718281828, the base of the natural logarithm. It is a value, not a call: `math.e()` is error `OS2010`.

```openscript
version 1
study("Continuous growth path", overlay = true)

ratePct = input(12, "Growth per year, %", min = 0, max = 100)

var start = close
years = bar.index / 250

// Continuous compounding on a daily chart of about 250 sessions a year.
plot(start * pow(math.e, ratePct / 100 * years), "Growth path", orange)
```

**Remarks.** `pow(math.e, x)` is the same as `exp(x)`, and [[exp()]] is the shorter way to write it.

**See also.** [[exp()]], [[log()]], [[math.pi]]

## Remainders

{{entry: mod()}}

The remainder of `a` divided by `b`, taking the sign of `b`: `a - b * floor(a / b)`. Use it to wrap a value into a cycle, such as the minutes of a session into half hours or an angle into 0 to 360.

```openscript
version 1
study("Half hours from the open", overlay = true)

// Minutes since 09:15, read in the chart's timezone.
sinceOpen = date.hour(time) * 60 + date.minute(time) - (9 * 60 + 15)

// True on the bars that open at 09:15, 09:45, 10:15 and every half hour
// after, on a 1, 5 or 15 minute chart.
halfHour = mod(sinceOpen, 30) == 0
background(halfHour ? fade(silver, 90) : none)
```

`mod` and the `%` operator agree whenever `b` is positive and `a` is at or above zero. They differ when a sign is negative, and both exist on purpose:

| Expression | Value | Sign follows |
|---|---|---|
| `mod(7, 3)` | `1` | |
| `7 % 3` | `1` | |
| `mod(-7, 3)` | `2` | The divisor, `3` |
| `-7 % 3` | `-1` | The left operand, `-7` |
| `mod(7, -3)` | `-2` | The divisor, `-3` |
| `7 % -3` | `1` | The left operand, `7` |

**Remarks.** Use `mod` to wrap a value that can go below zero: `mod(angle, 360)` always lands from 0 up to 360, so `mod(-90, 360)` is `270`, where `-90 % 360` stays at `-90`. `mod(a, 0)` gives `none`, as does `a % 0`. Fractions work: `mod(7.5, 2)` is `1.5`.

**See also.** [[floor()]], [Operators](/script/language/operators)

## Trigonometry

Angles are in radians: a full turn is `2 * math.pi`. Convert with [[math.toRadians()]] and [[math.toDegrees()]]. Trigonometry is rare in trading scripts; its main uses are cycles, slope angles and squashing an unbounded value into a fixed range.

{{entry: math.pi}}

The number pi, about 3.141592654: half a turn in radians. It is a value, not a call.

```openscript
version 1
study("Reference cycle", precision = 2, range = [-1, 1])

period = input(20, "Cycle length, in bars", min = 2, max = 500)

// One full turn is 2 * pi radians, so this wave repeats every period bars.
plot(math.sin(2 * math.pi * bar.index / period), "Sine", aqua)
```

**Remarks.** `math.toDegrees(math.pi)` is `180`.

**See also.** [[math.sin()]], [[math.toRadians()]], [[math.e]]

{{entry: math.sin()}}

The sine of an angle `x` in radians, between -1 and 1. Use it for a smooth wave, or a weight that rises and falls over a fixed span.

```openscript
version 1
study("Mid-session weight", precision = 2, range = [0, 1])

// Minutes since 09:15, as a share of the 375 minute NSE session:
// 0 at the open and 1 at 15:30.
minutesIn = date.hour(time) * 60 + date.minute(time) - (9 * 60 + 15)
position  = clamp(minutesIn / 375, 0, 1)

// Half a sine wave across the session: 0 at both ends, 1 at midday.
plot(math.sin(math.pi * position), "Weight", aqua)
```

**Remarks.** `math.sin(math.pi / 2)` is `1`. The hour and minute are read in the chart's timezone, so on an NSE chart the clock is IST.

**See also.** [[math.cos()]], [[math.asin()]], [[math.pi]]

{{entry: math.cos()}}

The cosine of an angle `x` in radians, between -1 and 1. Use it to build weights shaped like an arch, or a cycle a quarter turn from a sine.

```openscript
version 1
study("Hann weighted average", overlay = true)

len = input(20, "Length", min = 3, max = 200)

// Weights shaped like one arch of a cosine: small at both ends of the window
// and largest in the middle.
total  = 0.0
weight = 0.0
for i = 0 to len - 1
    w = 0.5 - 0.5 * math.cos(2 * math.pi * (i + 1) / (len + 1))
    total  += w * close[i]
    weight += w

plot(total / weight, "Hann average", orange)
```

**Remarks.** `math.cos(0)` is `1`. The loop above reads `close[i]`, which is absent until there are `len` bars behind it, so the average has its first value on bar `len - 1`.

**See also.** [[math.sin()]], [[math.acos()]], [[wma()]]

{{entry: math.tan()}}

The tangent of an angle `x` in radians: the rise per unit across of a line at that angle. Use it to turn an angle into a slope.

```openscript
version 1
study("Angle to points per bar", precision = 2)

angle = input(45, "Angle, in degrees", min = -89, max = 89)

// On a chart scaled so that one ATR up matches one bar across, a line at
// this angle rises this many points per bar.
plot(math.tan(math.toRadians(angle)) * atr(14), "Points per bar", aqua)
```

**Remarks.** An angle drawn on a chart depends on how the chart is stretched, so a slope in degrees only means something once you fix the scale, as the ATR does here. `math.tan(math.pi / 4)` gives `0.9999999999999999` rather than exactly `1`, because [[math.pi]] is a binary number a hair away from the true pi. Round with [[round()]] before you compare a trigonometric result with an exact value.

**See also.** [[math.atan()]], [[math.toRadians()]]

{{entry: math.asin()}}

The angle, in radians, whose sine is `x`, from `-math.pi / 2` to `math.pi / 2`. Gives `none` when `x` is outside -1 to 1. Use it to turn a ratio between -1 and 1 back into an angle.

```openscript
version 1
study("Close position as an angle", precision = 0, range = [-90, 90])

// Where the close sits in the bar's range: -1 at the low, 1 at the high.
barRange = high - low
position = barRange > 0 ? (2 * close - high - low) / barRange : none

plot(math.toDegrees(math.asin(clamp(position, -1, 1))), "Angle", aqua)
```

**Remarks.** Keep the [[clamp()]] even when the ratio should be in range by construction. A binary rounding error can put it a hair outside -1 to 1, and then the result is `none` for that bar.

**See also.** [[math.sin()]], [[math.acos()]], [[clamp()]]

{{entry: math.acos()}}

The angle, in radians, whose cosine is `x`, from `0` to `math.pi`. Gives `none` when `x` is outside -1 to 1.

```openscript
version 1
study("Angle between range and volume", precision = 0, range = [0, 180])

// A correlation is the cosine of the angle between the two windows once each
// has had its mean removed. acos turns it back into that angle:
// 0 degrees moves together, 90 unrelated, 180 opposite.
rho = correlation(high - low, volume, 50)

// clamp guards against a rounding error that lands a hair outside -1 to 1.
plot(math.toDegrees(math.acos(clamp(rho, -1, 1))), "Angle, degrees", aqua)
level(90, "Unrelated", gray)
```

**Remarks.** `math.acos(-1)` is `math.pi` and `math.acos(1)` is `0`. As with [[math.asin()]], keep the [[clamp()]] on a ratio that should be in range by construction. The example needs an instrument with volume.

**See also.** [[math.cos()]], [[math.asin()]], [[correlation()]]

{{entry: math.atan()}}

The angle, in radians, whose tangent is `x`, from `-math.pi / 2` to `math.pi / 2`. Every number has one, so it never gives `none` for a present `x`. Use it to squash a value that can grow without limit into a fixed range.

```openscript
version 1
study("Bounded z-score", precision = 2, range = [-1, 1])

z = (close - sma(close, 50)) / stdev(close, 50)

// atan maps any number into -pi / 2 to pi / 2, so this line stays inside
// -1 to 1 however far the close runs from its average.
plot(2 / math.pi * math.atan(z), "Bounded z", aqua)
level(0, "Zero", gray)
```

**Remarks.** `math.atan(1)` is `math.pi / 4`, 45 degrees. For an angle from a rise and a run, where the run can be zero or negative, use [[math.atan2()]].

**See also.** [[math.atan2()]], [[math.tan()]], [[math.toDegrees()]]

{{entry: math.atan2()}}

The angle, in radians, of the point `(x, y)` seen from the origin, from `-math.pi` to `math.pi`. Note the order: `y` comes first. Unlike `math.atan(y / x)`, it tells the four quarters of the circle apart and works when `x` is zero.

```openscript
version 1
study("Phase of a 20 bar cycle", precision = 0, range = [-180, 180])

period = 20
turn   = 2 * math.pi * bar.index / period

// Read the last 20 closes as one wave, cos(turn - phase). The correlation of
// such a wave with the cosine is cos(phase), and with the sine is sin(phase),
// so atan2 of the pair gives the phase back, in the right quarter of the circle.
s = correlation(close, math.sin(turn), period)
c = correlation(close, math.cos(turn), period)

plot(math.toDegrees(math.atan2(s, c)), "Phase, degrees", aqua)
```

On a close that swings in a clean 20 bar cycle, the line holds steady at that cycle's phase: a wave that peaks 60 degrees after the reference reads 60 on every bar. A line that drifts means the cycle is a little longer or shorter than 20 bars, and one that jumps about means there is no clear 20 bar cycle to read.

| Call | Degrees |
|---|---|
| `math.atan2(1, 1)` | `45` |
| `math.atan2(1, -1)` | `135` |
| `math.atan(1 / -1)` | `-45`, the wrong quarter for the point `(-1, 1)` |

**Remarks.** Two absent arguments, or one, give `none`.

**See also.** [[math.atan()]], [[math.hypot()]]

{{entry: math.hypot()}}

`sqrt(x * x + y * y)`, the length of the line from the origin to `(x, y)`, computed without overflowing on large values. Use it to combine two readings measured on the same scale into one distance.

```openscript
version 1
study("Unusual bar, in move and volume", precision = 2)

len = input(50, "Window, in bars", min = 5, max = 500)

// Two z-scores: how many standard deviations this bar's move and this bar's
// volume sit from their own averages over the window.
move  = change(close)
zMove = (move - sma(move, len)) / stdev(move, len)
zVol  = (volume - sma(volume, len)) / stdev(volume, len)

// The straight line distance from an ordinary bar, where both are zero.
// A bar can reach 3 through either reading alone or through both together.
plot(math.hypot(zMove, zVol), "Distance from an ordinary bar", aqua)
level(3, "Unusual", red)
```

**Remarks.** `math.hypot(3, 4)` is `5`. A z-score (a distance from the average counted in standard deviations) puts a price move and a volume on one scale, which is what makes the distance meaningful; adding a raw move in rupees to a raw volume in shares would not be. Either argument absent gives `none`, so on an instrument without volume the line is not drawn.

**See also.** [[math.atan2()]], [[sqrt()]], [[stdev()]]

{{entry: math.toDegrees()}}

Converts an angle from radians to degrees: `math.toDegrees(math.pi)` is `180`. Use it to show an angle in the unit people read.

```openscript
version 1
study("Slope angle", precision = 1, range = [-90, 90])

len = input(20, "Length", min = 2, max = 200)

// The regression line's rise per bar, measured in ATRs so the angle does not
// depend on the instrument's price.
line  = linreg(close, len)
slope = (line - line[1]) / atr(14)

plot(math.toDegrees(math.atan(slope)), "Slope angle", aqua)
level(0, "Flat", gray)
```

**Remarks.** The conversion is `x * 180 / math.pi`, multiplied first and divided second.

**See also.** [[math.toRadians()]], [[math.atan()]]

{{entry: math.toRadians()}}

Converts an angle from degrees to radians: `math.toRadians(180)` is `math.pi`. Every trigonometric function takes radians, so convert an angle a reader types in degrees before you use it.

```openscript
version 1
study("Shifted cycle", precision = 2, range = [-1, 1])

period   = input(20, "Cycle length, in bars", min = 2, max = 500)
phaseDeg = input(90, "Phase shift, in degrees", min = 0, max = 360)

turn = 2 * math.pi * bar.index / period
plot(math.sin(turn), "Cycle", aqua)
plot(math.sin(turn + math.toRadians(phaseDeg)), "Shifted cycle", orange)
```

**Remarks.** The conversion is `x * math.pi / 180`, multiplied first and divided second.

**See also.** [[math.toDegrees()]], [[math.sin()]]

## Hyperbolic functions

The three hyperbolic functions are named in the language and planned for a later release. Calling one today is error `OS2020`. Until they arrive, [[exp()]] builds them: `(exp(x) - exp(-x)) / 2` is the hyperbolic sine.

{{entry: math.sinh()}}

Will return the hyperbolic sine of `x`, `(exp(x) - exp(-x)) / 2`.

{{entry: math.cosh()}}

Will return the hyperbolic cosine of `x`, `(exp(x) + exp(-x)) / 2`.

{{entry: math.tanh()}}

Will return the hyperbolic tangent of `x`, which squashes any number into the range -1 to 1. For a bounded oscillator today, [[math.atan()]] does a similar job, as its example shows.

## No random numbers

OpenScript has no random number function, in the `math` namespace or anywhere else. A script run twice over the same bars must give the same numbers, or two backtests could not be compared and a result could not be reproduced. For the same reason the only reading of a clock during a bar is [[chart.now()]], whose value the host supplies.

## Related

[Operators](/script/language/operators), [Absent values](/script/language/absent-values), [Types and values](/script/language/types-and-values), [Series functions](/script/reference/series), [General](/script/reference/general), [Position and sizing](/script/strategies/position-and-sizing)
