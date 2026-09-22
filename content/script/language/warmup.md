---
title: Warmup
description: The first bar each call produces a value on, how warmups add up through a chain of calls, what the empty left edge does downstream, and how to handle it in studies and strategies.
---

Put a 20 period average on a chart and the line does not start at the oldest bar; it starts at the twentieth. That gap at the left edge is **warmup**: the bars a calculation needs before it has an honest answer. This page shows the exact first bar of the common calls, how warmups add up when calls are chained, what the absent values at the left edge do to everything downstream, and how to handle warmup in a study, in a table and in a strategy that places orders. Getting it right is the difference between a study that is silent until it knows something and one that draws numbers it made up.

## A first example

```openscript title="Warmup"
version 1
study("Warmup", overlay = true, precision = 2)

e = ema(close, 20)      // absent on bars 0 to 18, a number from bar 19

plot(e, "EMA 20", aqua) // the line simply starts at bar 19
```

A twenty period average of the first bar would have to average twenty closes, and nineteen of them do not exist. The language has one answer for "there is no value here", the absent value `none`, and the left edge of a chart is where you meet it most. On a 5 minute NSE chart an average of 200 bars needs 200 bars, and a session from 09:15 to 15:30 holds 75 of them, so the line starts in the third session of the data.

## There is no warmup phase

A script runs on bar 0 exactly as it runs on bar 40,000. Every statement executes, every branch is evaluated, every assignment happens. There is no start-up mode, no flag to check and no bar at which the study "starts for real". What differs on the early bars is only that some calls have nothing to return yet:

:::key The whole of warmup
A function that needs `k` bars returns the absent value until `k` bars exist. Everything else follows from how absent values travel.
:::

Absent is the only honest picture of a measurement that was never taken. Returning zero would draw a line at zero and call it data. Repeating the first available value backwards would draw a flat shelf that looks like a quiet market. Absence draws nothing.

## Every function states its first bar

Every library call states the first bar it can produce a value on, counting the oldest bar as 0. "Bar `len - 1`" means the call is absent on bars 0 to `len - 2` and has a value from bar `len - 1` onward, on exactly those bars and no others. The number is exact, not "after a while", so you can count it by hand and rely on the count.

A working selection:

| Call | First bar with a value |
|---|---|
| `sma(src, len)`, `ema(src, len)`, `rma(src, len)`, `wma(src, len)` | `len - 1` |
| `stdev(src, len)`, `variance(src, len)` | `len - 1` |
| `highest(src, len)`, `lowest(src, len)`, `sum(src, len)`, `count(cond, len)` | `len - 1` |
| `median`, `percentile`, `percentRank`, `correlation`, `covariance` | `len - 1` |
| `bollinger(src, len, mult)`, `donchian(len)` | `len - 1`, every element |
| `atr(len)`, `natr(len)`, `cci(len)`, `cmf(len)` | `len - 1` |
| `keltner(len, mult, atrLen)` | `max(len, atrLen) - 1`, every element |
| `change(src)`, `crossUp(a, b)`, `crossDown(a, b)`, `cross(a, b)` | 1 |
| `change(src, len)`, `mom(src, len)`, `roc(src, len)` | `len` |
| `rsi(src, len)`, `mfi(len)`, `chop(len)`, `hv(src, len)`, `aroon(len)` | `len` |
| `rising(src, len)`, `falling(src, len)` | `len` |
| `history(src, n)` | `n` |
| `pivotHigh(src, left, right)`, `pivotLow(src, left, right)` | `left + right` |
| `hma(src, len)` | `len + round(sqrt(len)) - 2` |
| `dema(src, len)` | `2 * len - 2` |
| `tema(src, len)` | `3 * len - 3` |
| `trix(src, len)` | `3 * len - 2` |
| `dpo(src, len)` | `len + floor(len / 2)` |
| `macd(src, fast, slow, signal)` | element 0 at `max(fast, slow) - 1`, elements 1 and 2 at `max(fast, slow) + signal - 2` |
| `adx(diLen, adxLen)` | elements 1 and 2 at `diLen`, element 0 at `diLen + adxLen - 1` |
| `supertrend(factor, atrLen)` | `atrLen` |
| `psar()` | 1 |
| `obv()`, `cum(src)`, `trueRange()` | 0 |

The reference lists the first bar of every call under **First value**, for example [[sma()]] and [[macd()]]. When the number matters to your script, read it there rather than estimating it.

Three entries deserve a note.

**A call with several outputs returns an array whose elements warm up separately.** The array itself is never absent and never changes length; each element is absent until it is reached. So `m = macd(close, 12, 26, 9)` gives `m[0]` from bar 25 and `m[1]` and `m[2]` from bar 33. If the array grew as warmup completed, `m[1]` would be an out-of-range error on the early bars, and a script would break only at the left edge of a chart, the worst place for it.

**A `max` in a first bar is not decoration.** A call that combines two lengths has nothing to report until both calculations exist, so its first bar follows the longer length, whichever argument that is. Nothing stops a script from setting `fast` above `slow`, and the row states the `max` so that case is covered.

**`trueRange()` on bar 0 is `high - low`.** The other two terms of its definition need the previous close, which is absent there. This is a deliberate exception to absence: a bar's own range is a true statement about that bar, and it is why `atr(14)` has a value from bar 13 rather than bar 14.

## Why some lengths cost one bar more

`sma(close, 14)` has a value from bar 13, and `rsi(close, 14)` from bar 14. The difference is not a quirk.

An average of 14 values needs 14 bars, and bars 0 to 13 are 14 bars, so bar 13 is the first. [[rsi()]] averages 14 **changes**, a change needs two bars, so 14 changes need 15 bars and bar 14 is the first. Every call that works on changes rather than levels carries the same extra bar. When you count a chain by hand, this is the step people get wrong: ask whether each call reads levels or the differences between them.

## Warmups add up

A call whose input is absent on a bar is absent on that bar too, so warmups add. Written as arithmetic, **the first bar of a chain is the sum of each stage's first bar**:

```openscript
// ema(close, 10) first has a value at bar 9.
// sma(..., 10) needs 10 present values, which arrive on bars 9 to 18.
// First value: bar 9 + 9 = bar 18.
smoothed = sma(ema(close, 10), 10)
plot(smoothed, "Smoothed average")
```

A three stage study, with the count written where the next reader will look for it:

```openscript title="Stretch"
version 1
study("Stretch", precision = 2, range = [0, 100])

rsiLen = input(14, "RSI length", min = 2, max = 200)
smooth = input(9, "Smoothing", min = 1, max = 100)
window = input(50, "Extreme window", min = 2, max = 500)

// First value, stage by stage, with the default settings:
//   rsi(close, 14)        bar 14
//   ema(..., 9)           plus 8  = bar 22
//   highest(..., 50)      plus 49 = bar 71
// The study draws nothing before bar 71.
r        = rsi(close, rsiLen)
smoothed = ema(r, smooth)
peak     = highest(smoothed, window)
trough   = lowest(smoothed, window)

span    = peak - trough
stretch = span > 0 ? (smoothed - trough) / span * 100 : none

level(80, "High", fade(red, 50))
level(20, "Low", fade(lime, 50))
plot(stretch, "Stretch", purple, width = 2)
```

Three details in that script are warmup decisions:

- The lengths are inputs, so the first bar changes with the settings. The comment states the arithmetic for the defaults, which is the useful thing to write down.
- `span > 0` guards the division. Dividing by zero gives the absent value rather than an error, so the guard is not strictly needed, but it tells the reader that a flat window is a known case.
- Nothing tries to fill in the first 71 bars. The pane is empty there, and that is the report.

A length can also be a series that changes from bar to bar. What a call does after its length changes is not the same for every call: some carry on at once with the new length, and others go absent again until they have enough bars for it. Use a fixed length, usually an [[input()]], whenever you need to know the first bar exactly.

## What an absent value does downstream

Warmup matters because of what the absent value does after it. Here is all of it in one table:

| Where an absent value lands | What happens |
|---|---|
| `+`, `-`, `*`, `/`, unary `-` | The result is absent. `none * 0` is absent, not zero |
| Joining strings with `+` | Absent. Use [[text()]] to turn it into words: `text(none)` is `"none"` |
| `<`, `<=`, `>`, `>=` | The result is absent, not false |
| `==`, `!=` | Never absent. `none == none` is true, `none == 5` is false |
| `and`, `or`, `not` | Three-valued: `true or none` is true, `false and none` is false, `true and none` is absent |
| An `if`, `while` or ternary condition | The false branch is taken |
| A windowed library call | If any bar in the window is absent, the result is absent |
| [[sumSkip()]], [[avgSkip()]], [[countPresent()]] | Absent bars are skipped. These three, and only these three |
| A plot | The line breaks, and a fill between two plots stops |
| [[barColor()]], [[background()]] | Nothing is painted; the bar keeps its own colour |
| An order's price or quantity | Error [OS7002](/script/errors/orders#os7002), naming the argument, and the script stops on that bar |

The comparison row repays the most thought. During warmup `a > b` and `a <= b` are **both** absent, so both are false as conditions, and a script that branches on one and assumes the other is its opposite takes neither path. That keeps `not (a > b)` equal to `a <= b` everywhere else. Equality is the deliberate exception, because without it there would be no way to ask whether a value is there: `x == none` and `isNone(x)` mean the same thing, and [[isNone()]] is the clearer way to write it. [Absent values](/script/language/absent-values) covers the rules in full.

## The shape where warmup changes an answer

There is one shape in which warmup silently changes a study's output instead of leaving a visible gap: a persistent value set inside a branch whose condition can be absent.

```openscript
var regime = "unknown"

// During warmup the comparison is absent, so the else branch runs,
// and regime says "down" for bars where RSI has no value at all.
if rsi(close, 14) > 50
    regime = "up"
else
    regime = "down"

plot(regime == "up" ? 1 : 0, "Up regime")
```

An absent condition takes the false branch, so for the first fourteen bars this study reports a "down" regime it never computed, and the `var` carries that into every later bar that does not overwrite it. Make the absent case explicit and the problem disappears:

```openscript
r = rsi(close, 14)              // one call site, computed every bar

var regime = "unknown"
if not isNone(r)
    regime = r > 50 ? "up" : "down"

plot(regime == "up" ? 1 : 0, "Up regime")
```

Now a reader can see that "unknown" means warmup. The same fix applies whenever a value that is absent during warmup feeds a branch that sets something durable: a stop level, a position flag, a session high. The error list includes warning [OS8004](/script/errors/warnings#os8004) for this shape, but the compiler does not raise it in this release, so the explicit test is yours to write. The compiler does warn with [OS8001](/script/errors/warnings#os8001) when a stateful call such as [[rsi()]] sits inside a branch, which is the other half of the same mistake.

## Seeing how many bars a study needs

Three ways, in increasing order of certainty.

**Count it.** Add each stage's first bar from the reference, remembering the extra bar for calls that read changes. This is exact and it works before you have any data.

**Look at the chart.** Scroll to the oldest bar. The first bar of each line is its warmup, and a line that never starts belongs to a study whose warmup is longer than the history loaded.

**Probe it.** Put the answer on the chart. This removes all doubt, particularly when the lengths are inputs:

```openscript title="Warmup probe"
version 1
study("Warmup probe", precision = 2)

// The value whose warmup you want to know.
value = ema(rsi(close, 14), 9)

// The first bar on which it existed. isNone guards the assignment so this
// records the first bar only; absent means "not yet".
var firstBar = none
if isNone(firstBar) and not isNone(value)
    firstBar = bar.index

t = table("Warmup", 4, 2, position = "topRight")
cell(t, 0, 0, "bars loaded")
cell(t, 0, 1, text(bar.count))
cell(t, 1, 0, "first value at bar")
cell(t, 1, 1, isNone(firstBar) ? "not yet" : text(firstBar))
cell(t, 2, 0, "present in last 100")
cell(t, 2, 1, text(countPresent(value, 100)))
cell(t, 3, 0, "has a value now")
cell(t, 3, 1, text(not isNone(value)))

plot(value, "Value", aqua, width = 2)
```

For this chain the table reads "first value at bar 22": 14 for [[rsi()]] plus 8 for the 9 bar [[ema()]]. `countPresent(value, 100)` has a first bar of its own, bar 99, so its cell reads "none" until a hundred bars have loaded; `text(none)` is the word `"none"`, which is why the cell is not blank. A bar index is fine to display within one run like this, but do not store one across a reload: loading older history renumbers every bar.

When you want the number as a series rather than in a table, mark the bar where the value appears and carry that bar's index forward with [[valueWhen()]]:

```openscript
value    = ema(rsi(close, 14), 9)

// True on one bar only: the first bar with a value after a bar without one.
started  = not isNone(value) and isNone(value[1])
startBar = valueWhen(started, bar.index)

plot(startBar, "First bar with a value")    // 22 for this chain
```

Do not reach for `barsSince(not isNone(value))` here. [[barsSince()]] counts from the **last** bar its condition held, and once the value exists the condition holds on every bar, so it reads 0 everywhere and tells you nothing about the start.

## How much history to load

Two numbers matter, and they add:

```text
bars to load = the study's warmup + the bars you actually want to read
```

A study whose first value is on bar 71 has 71 bars of warmup (bars 0 to 70). On a chart where you want to read the last 500 bars, it needs at least 571 bars. Load exactly 71 and it draws nothing at all; load 72 and it draws a single point.

Then load a margin beyond that, for this reason. A recursive average, one that builds each value from its own previous value, is seeded at a stated bar of the data it was given: `ema(src, n)` is seeded on bar `n - 1` with the simple average of the first `n` values, and [[rma()]] states its own seed the same way. The seeding is exact, so the same data always gives the same numbers. It also means the seed sits at a different moment in market history when you load a longer range, and the values after it, while they converge quickly, are not identical to the ones from a shorter load.

Two practical consequences:

- Load a comfortable margin beyond the warmup, so the recursive averages have long since converged over the region you are actually reading.
- Fix the date range of anything you intend to compare. A backtest of the same script over a fixed range reproduces months later. The same backtest over "whatever history the chart had open" does not, and the difference can be small enough to look like noise and large enough to change a marginal trade.

## Filling in a warmup value

`orElse(x, fallback)` gives `fallback` wherever `x` is absent ([[orElse()]]). It is the right tool about half the time.

**Right: a display default**, where the substitute is clearly a label rather than a measurement.

```openscript title="Reading, or waiting"
version 1
study("Reading, or waiting", precision = 2, range = [0, 100])

r = rsi(close, 14)

t = table("RSI", 1, 2, position = "topRight")
cell(t, 0, 0, "RSI")
cell(t, 0, 1, isNone(r) ? "warming up" : text(r, 1))

// Shade the pane while the study has nothing to say.
background(isNone(r) ? fade(gray, 90) : none)

plot(r, "RSI", purple, width = 2)
```

**Right: seeding a persistent value on its first bar**, where without the fallback the value would stay absent forever:

```openscript
rawBand = low - 2 * atr(10)

var band = none
prevBand = band
band = max(rawBand, orElse(prevBand, rawBand))

plot(band, "Rising band")
```

**Wrong: feeding a substitute into a decision**, where it manufactures a signal the data never produced.

```openscript
r = rsi(close, 14)

// Wrong. During warmup orElse hands crossUp an exact 50 on every bar, so the
// first real reading above 50 reports a crossing from a number this line invented.
if crossUp(orElse(r, 50), 50)
    signal("UP, invented")

// Right. During warmup the comparison inside crossUp is absent, the branch is
// not taken, and the first marker is the first real crossing.
if crossUp(r, 50)
    signal("UP")
```

The rule that covers both: **substitute for something a person will read, never for something the script will act on.** A made-up number that reaches a decision cannot be told apart from a real one afterwards.

## Warmup in a strategy

A strategy meets warmup at the worst moment, because an order built from absent inputs cannot simply be skipped like a drawing. The language is loud about it on purpose: **an order given an absent price or quantity is error [OS7002](/script/errors/orders#os7002), naming the argument, and the script stops on that bar.** It never sends an order at a size or price nobody chose, and it never substitutes a value for you.

So a strategy should reach its order line only when every input exists:

```openscript title="Sized by volatility"
version 1
strategy("Sized by volatility", overlay = true, precision = 2,
         capital = 500000, qty = 1, qtyType = "units",
         fillOn = "nextOpen", slippage = 1)

atrLen     = input(14, "ATR length", min = 1, max = 200)
stopMult   = input(2.0, "Stop, in ATR", min = 0.2, max = 20)
riskAmount = input(5000, "Amount risked per trade", min = 1)

fast     = ema(close, 9)
slow     = ema(close, 21)
atrValue = atr(atrLen)

// Absent for the first 13 bars, so the distance and the size are absent too.
stopDistance = stopMult * atrValue
rawUnits     = stopDistance > 0 ? riskAmount / stopDistance : none
orderQty     = isNone(rawUnits) ? none : floor(rawUnits)

// The guard is the point. Without it the strategy could reach buy() during
// warmup with an absent quantity and stop with OS7002.
canSize = not isNone(orderQty) and orderQty > 0

if crossUp(fast, slow) and pos.size == 0 and canSize
    buy(qty = orderQty)

if crossDown(fast, slow) and pos.size > 0
    close()

plot(fast, "Fast", aqua, width = 2)
plot(slow, "Slow", orange, width = 2)
```

Here `crossUp(fast, slow)` is itself absent during warmup, so the guard is belt and braces. Write it anyway: the day someone replaces the entry condition with one that can be true on bar 0, the guard is what stands between the change and a strategy that stops with OS7002 on one of its first bars. On NFO futures, round the quantity to the contract's lot size as well; [Position and sizing](/script/strategies/position-and-sizing) covers lots.

## Warmups that are not bar counts

A few first bars are a condition rather than a number, and no arithmetic gives you a bar index for them:

| Call | First value |
|---|---|
| [[vwap()]] | The first bar of each session. It starts again every session |
| [[vwapAnchor()]] | The first bar the reset condition is true |
| [[barsSince()]], [[valueWhen()]] | The first bar the condition is true, which may be never |
| [[req.timeframe()]] with the default mode | The first bar after a higher timeframe bar has closed |
| [[req.symbol()]] | The same, and not before the other instrument's bars have arrived |

Three consequences:

**`barsSince` and `valueWhen` are absent, not zero, before the condition has ever held.** Zero would read as "it happened on this bar", the opposite of the truth.

**A higher timeframe read on a fresh chart is absent for a while, measured in coarse bars.** A daily read on a 5 minute chart is absent until the first daily bar in the data has closed, which can be 75 fine bars or more. [[req.isReady()]] tells you whether the requested bars have arrived at all, and [[req.error()]] carries the reason a read failed. [Higher timeframes](/script/data/higher-timeframes) covers this.

**A session anchored value restarts.** It does not warm up once; it warms up every session. A study built on `vwap` at 09:15 is reporting a single bar's worth of information, so say so on the chart if a reader might mistake it for a settled average.

**Related.** [Bars and history](/script/language/bars-and-history), [Absent values](/script/language/absent-values), [Persistence](/script/language/persistence), [Realtime and confirmation](/script/language/realtime-and-confirmation), [Execution model](/script/language/execution-model), [Technical analysis reference](/script/reference/technical-analysis), [Troubleshooting](/script/writing/troubleshooting)
