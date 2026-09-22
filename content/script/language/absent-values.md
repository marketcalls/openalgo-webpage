---
title: Absent values
description: The absent value none. Where it comes from, how it moves through arithmetic, comparison and logic, how to test for it with isNone and replace it with orElse, and the mistakes it causes.
---

A per-bar script meets "there is no value here" all the time: the first fourteen bars of a 14-bar RSI, the previous close on the very first bar, a ratio whose denominator was zero on one bar. OpenScript has one value for all of these, written `none`, and exact rules for what it does. This page covers where `none` comes from, how it moves through every operator, how to test for it and replace it, and the specific mistakes it causes. Learn it early: the bars where it bites are the oldest bars, off the left edge of the screen, so a study can be wrong for weeks before anyone scrolls back to see it.

## A first example

```openscript
version 1
study("Warmup made visible", precision = 2, range = [0, 100])

r = rsi(close, 14)

level(70, "Overbought", fade(red, 50))
level(30, "Oversold", fade(lime, 50))
plot(r, "RSI", purple, width = 2)

// r is absent until bar 14. Shade those bars instead of leaving them blank.
background(isNone(r) ? fade(gray, 90) : none)
```

The RSI line starts at bar 14 because [[rsi()]] has no value before it. No zero is drawn and nothing is invented: the plot simply has a gap, and the grey shading shows where the study starts. The number of bars a function needs before it has a value is its warmup; every reference entry states it.

## What none is

`none` is the absent value. Its type is also called `none`, and it belongs to every other type: a `series number` may hold `none` on any bar, and so may a `string` or a `color`. A name that holds a number on most bars and `none` on a few is an ordinary `series number`.

The language could have answered "no value here" with a plausible number such as zero, or by stopping the script. It does neither. Zero produces charts that look right and are not, and stopping would kill a study that is correct over fifty thousand bars because one bar had no volume. Instead `none` has a precise meaning and travels visibly to the chart, where it draws a gap.

## Where it comes from

| Source | Example | Absent on |
|---|---|---|
| Warmup | `sma(close, 20)` | Bars 0 to 18 |
| Warmup built on changes | `rsi(close, 14)` | Bars 0 to 13: one more than you might expect, because a change needs two bars |
| History past the start | `close[1]` | Bar 0. `close[100]` on bars 0 to 99 |
| Division by zero | `up / down` | Any bar where `down` is 0, including `0 / 0` |
| No finite real answer | `sqrt(-1)`, `log(0)` | Whenever the argument has no answer |
| A window that touches a gap | `sma(src, 20)` where `src` was absent on a bar | Every bar whose window includes that bar |
| Data the instrument does not have | `volume` or `oi` on an instrument without it, such as an index | Every bar |
| An instrument fact not stated | [[chart.tickSize]], [[chart.lotSize]], [[chart.hasVolume]] | The whole run, when the application running the script does not state the fact |
| A higher timeframe before its first bar closes | `req.timeframe("1D", high)` | Until the first daily bar has closed |
| Another instrument before it arrives | `req.symbol(...)` | Until its bars arrive. Test [[req.isReady()]] |
| A condition that has never held | [[barsSince()]], [[valueWhen()]] | Every bar before the first true one |
| A position fact while flat | [[pos.avgPrice]] | Every bar with no open position |
| A string that does not parse | `toNumber("12.5%")` | That call |
| A stateful call in a branch that did not run | `ema` inside an `if` | Every bar the branch was skipped |
| Your own choice | `ready ? value : none` | Wherever you say |

The last row matters as much as the rest. Writing `none` on purpose is how a script says "draw nothing here", and it is the supported way to hide a plot on some bars.

## Rule 1: arithmetic propagates it

**If any operand of an arithmetic operator is absent, the result is absent.**

```openscript
none + 1  // none
none * 0  // none, not 0
none - none  // none
-none  // none
(none + 1) * 2  // none
"a" + none  // none
```

`none * 0` is absent, not zero. The operand was not zero; it was unknown, and an unknown quantity times zero is only zero if it was a number at all. One rule with no special cases is easier to carry, and it has a practical payoff: the absent value reaches the plot and draws a gap instead of being absorbed into a number that looks right.

Joining strings follows the same rule. `"a" + none` is absent, so a message built from one absent part is an absent message, not a partial one. [[text()]] with one argument turns `none` into the string `"none"`, so `"a" + text(x)` always gives a message. The two-argument form, `text(x, 2)`, passes the absence on.

Arithmetic with no answer produces absence for the same reason: division by zero (including `0 / 0` and a remainder by zero), [[sqrt()]] below zero, [[log()]] at or below zero, and anything that would overflow to infinity. Infinity is not a value in the language.

```openscript
version 1
study("Up volume over down volume", precision = 4)

up = sum(close > open ? volume : 0, 20)
down = sum(close < open ? volume : 0, 20)

// On a window with no down bars, down is 0 and the ratio is absent, so the
// line breaks instead of spiking to a value the chart cannot scale.
plot(up / down, "Up over down", aqua, width = 2)
```

## Rule 2: ordered comparison propagates it

**If either side of `<`, `<=`, `>` or `>=` is absent, the result is absent, not `false`.**

```openscript expect=OS8012
none < 5  // none
5 > none  // none
none <= none  // none
```

This rule repays understanding. If a comparison with an absent side returned `false`, then during warmup `a > b` and `a <= b` would both be false, and a script that branches on one and assumes the other is its opposite would take the wrong path without anyone noticing. Because both are absent together, `not (a > b)` always equals `a <= b`, for every input.

The practical consequence: **a skipped branch is not proof of the opposite.** When an `if` does not run its block, the condition was false or it was absent, and those are different facts. If your script needs to tell them apart, ask with [[isNone()]].

A comparison written directly against `none` is absent on every bar, so a branch on it can never run. The compiler reports warning [OS8012](/script/errors/warnings#os8012) on each of the three lines above, and on a test like this one:

```openscript expect=OS8012
r = rsi(close, 14)
if r > none
    signal("NEVER")
```

## Rule 3: equality does not propagate it

**`==` and `!=` always return `true` or `false`, never absent.**

```openscript
none == none  // true
none == 5  // false
5 != none  // true
```

Equality is the deliberate exception, because a question that could itself be absent would leave no way to ask it. `x == none` and `isNone(x)` mean exactly the same thing, and both work directly in an `if`.

The flip side catches everyone once. On bar 0, `dir[1]` is absent, so `dir != dir[1]` is `true`, and a script that marks a change of state marks one on the very first bar of every chart. Require the previous value to be present, as mistake 7 below shows.

## Rule 4: and, or and not use three-valued logic

`and`, `or` and `not` treat `none` as "unknown": three-valued logic means each operand is true, false or unknown.

| `a` | `b` | `a and b` | `a or b` |
|---|---|---|---|
| `true` | `true` | `true` | `true` |
| `true` | `false` | `false` | `true` |
| `true` | `none` | `none` | `true` |
| `false` | any | `false` | `b` |
| `none` | `true` | `none` | `true` |
| `none` | `false` | `false` | `none` |
| `none` | `none` | `none` | `none` |

`not none` is `none`.

One sentence produces every row: **an unknown operand is absorbed exactly when the other operand decides the answer by itself.** Under `and` that is a `false`; under `or` it is a `true`. Everywhere else the answer really does depend on the value nobody has, so it stays unknown.

**Both operators are commutative**: swapping the operands never changes the answer. `a or b` equals `b or a`, and `a and b` equals `b and a`, for every combination including absent ones. So each pair of guards below gives one answer on every bar:

```openscript
x = rsi(close, 14)

if isNone(x) or x > 70  // "absent or above 70"
    background(fade(gray, 90))
if x > 70 or isNone(x)  // the same answer, on every bar
    background(fade(gray, 90))

if not isNone(x) and x > 70  // "present and above 70"
    signal("HOT")
if x > 70 and not isNone(x)  // the same answer, on every bar
    signal("HOT")
```

What operand order still decides is which operand runs. The right side of `or` is skipped only when the left side is `true`, and the right side of `and` only when the left side is `false`. An absent left side skips nothing, because the right side could still settle the answer. [Operators](/script/language/operators#short-circuit-evaluation) covers this in detail.

## Rule 5: an absent condition takes the false branch

**A condition that is absent takes the false branch.** This applies to `if`, `else if`, `while`, the ternary and the condition form of `switch`.

```openscript
if rsi(close, 14) > 70  // absent during warmup, so the block is skipped
    signal("OVERBOUGHT")
```

This is the one place absence is absorbed rather than passed on, and it is unavoidable: execution has to go somewhere. It is safe here in a way that a comparison returning `false` would not be, because the absorbing happens at the branch, where you can see it, rather than inside an expression three lines earlier.

## Testing for it

| Test | Returns | Use it for |
|---|---|---|
| `isNone(x)` | `bool`, never absent | The direct question, see [[isNone()]] |
| `x == none` | `bool`, never absent | The same question |
| `not isNone(x)` | `bool`, never absent | The first half of a presence guard |
| `req.isReady(read)` | `series bool` | Whether another instrument's bars have arrived, see [[req.isReady()]] |

`isNone(x)` and `x == none` are interchangeable. Both always give a definite answer, and neither can surprise you.

## Replacing it

`orElse(x, fallback)` ([[orElse()]]) gives `x` when it is present and `fallback` when it is not. It is the right tool when the fallback is a genuine answer rather than an invented one:

```openscript
r = rsi(close, 14)
safe = orElse(r, 50)  // 50 is the neutral RSI reading, a real answer
plot(safe, "RSI, neutral during warmup")
```

It is the wrong tool when the fallback would be a price, a quantity or anything a later comparison treats as data. `orElse(stop, 0)` turns "we have no stop" into "our stop is at zero", and every `close > stop` after it is true.

Three library functions ignore absent bars on purpose, and their names say so: [[sumSkip()]], [[avgSkip()]] and [[countPresent()]]. Every other function that reads a window propagates: if any bar in the window is absent, the result on that bar is absent.

```openscript
version 1
study("Sparse average", precision = 2)

// Only bars that closed up contribute a value; the rest are absent.
upMove = close > open ? close - open : none

plot(sma(upMove, 20), "Plain average: absent when the window has a gap", gray)
plot(avgSkip(upMove, 20), "Average of the bars that had a value", aqua)
plot(countPresent(upMove, 20), "How many of the 20 had a value", orange)
```

On a real chart the plain average hardly ever draws, because it needs twenty up bars in a row. The count draws from bar 19 (the twentieth bar) onwards, and the skipping average draws on every bar from there whose window holds at least one up bar.

The order of preference, from best to last resort:

1. **Let it propagate.** A gap in a line is the truth, and costs nothing.
2. **Guard it** with `isNone` and take a different path.
3. **Replace it** with `orElse`, where the fallback is a real answer.
4. **Skip it** with a `Skip` function, where the window is genuinely sparse.

## Where it leaves the script

**On the chart, absence is a gap, never a zero.** A plot breaks its line, a fill stops, a bar colour leaves the bar its own colour, a background leaves the bar unshaded and a table cell is blank. That is why a plot is hidden on some bars by plotting `none`, never by wrapping the plot in an `if` (which is [OS3006](/script/errors/arguments#os3006)).

```openscript
version 1
study("EMA while trending", overlay = true)

ema20 = ema(close, 20)
trending = ema20 > ema(close, 50)

plot(trending ? ema20 : none, "EMA while trending", aqua)
```

**On an order, absence is refused loudly.** An order given an absent price or quantity does not place a malformed order and does not substitute a value. It is refused with error [OS7002](/script/errors/orders#os7002), naming the argument that was absent, and like every error in a running script it stops the strategy at that bar. An order is the one place where doing nothing quietly would be worse than stopping visibly. Leaving an argument out is different from passing an absent one: `buy()` uses the declaration's default size, while `buy(qty = q)` with `q` absent is refused.

## Mistakes, and the fix for each

### 1. Treating a skipped branch as proof of the opposite

```openscript
r = rsi(close, 14)
zone = "mid"
if r > 70
    zone = "high"
else if r < 30
    zone = "low"
// During warmup both tests are absent, neither branch runs, and zone says
// "mid" about bars that have no RSI at all: the warmup bars are shaded too.
background(zone == "mid" ? fade(gray, 90) : none)
```

Give "we do not know yet" a value of its own:

```openscript
r = rsi(close, 14)
zone = "unknown"
if not isNone(r)
    zone = r > 70 ? "high" : (r < 30 ? "low" : "mid")
background(zone == "mid" ? fade(gray, 90) : none)
```

### 2. A self-referencing series that is absent for ever

```openscript
seen = 0
seen = seen[1] + 1  // absent on bar 0, and on every bar after it
plot(seen, "Never draws")
```

On bar 0, `seen[1]` is absent, so the sum is absent, and every later bar reads an absent predecessor. One absent bar at the start poisons the whole run. The fix is `var`, which keeps a value from one bar to the next:

```openscript
var seen = 0
seen += 1  // 1, 2, 3, ...
plot(seen, "Bars seen")
```

Where a calculation genuinely needs its own previous value, seed it with `orElse`:

```openscript
version 1
study("Trailing stop", overlay = true, precision = 2)

mult = input(3.0, "Band width, in ATR", min = 0.5, max = 20)
raw = low - mult * atr(14)

var trail = none

// A var still holds the previous bar's value here, so prev is the stop as it
// stood one bar ago.
prev = trail

// On the first bar with an ATR, prev is absent. orElse seeds the stop from
// the raw value there, so it does not stay absent for ever.
trail = close[1] > orElse(prev, raw) ? max(raw, orElse(prev, raw)) : raw

plot(trail, "Trailing stop", lime, width = 2)
```

### 3. Guarding with the wrong operator

```openscript
x = rsi(close, 14)
if isNone(x) and x > 70  // never true, whether x is present or absent
    signal("NEVER")
if not isNone(x) or x > 70  // true whenever x is present, whatever its value
    signal("ALWAYS")
```

The two that work are `not isNone(x) and x > 70` ("present and above 70") and `isNone(x) or x > 70` ("absent or above 70"). Swapping the sides of the broken guards changes nothing, because both operators are commutative. It is the operator that has to match the sentence you mean.

### 4. Replacing a price with zero

```openscript
rawStop = lowest(low, 20)[1]
stop = orElse(rawStop, 0)
if close > stop  // true on every bar where the stop was absent
    signal("ABOVE STOP")
```

Zero is a price. Keep the absence and guard the test:

```openscript
rawStop = lowest(low, 20)[1]
if not isNone(rawStop) and close > rawStop
    signal("ABOVE STOP")
```

### 5. Expecting none times zero to be zero

A weight of zero does not cancel an absent factor. When some terms of a weighted sum should drop out, drop them explicitly:

```openscript
value = rsi(close, 14)
weight = 0.5
contribution = isNone(value) ? 0 : value * weight
plot(contribution, "Contribution")
```

### 6. A stateful call inside a branch

```openscript expect=OS8001
trending = close > ema(close, 50)
if trending
    e = ema(close, 20)  // advances only on trending bars
    barColor(close > e ? lime : red)
```

A call site that does not run on a bar leaves its value absent for that bar and its state untouched, so the average is built from a subset of bars nobody meant. This is warning [OS8001](/script/errors/warnings#os8001). Compute the value on every bar and use it inside the branch:

```openscript
e = ema(close, 20)
trending = close > ema(close, 50)
plot(trending ? e : none, "EMA while trending", aqua)
```

### 7. Marking a change of state that never happened

```openscript
dir = close > ema(close, 20) ? 1 : -1
if dir != dir[1]
    signal("FLIP")
```

This marks two flips that never happened. On bar 0, `dir[1]` is absent, and equality is total, so an absent side does not make the test absent: it makes it `true`. And during the EMA's warmup the condition is absent, so the ternary takes its false arm and `dir` reads `-1` on bars that have no EMA at all; the first bar with a real reading of `1` then looks like a flip. Keep `dir` absent until it means something, and require a previous value:

```openscript
e = ema(close, 20)
dir = isNone(e) ? none : (close > e ? 1 : -1)
if not isNone(dir[1]) and dir != dir[1]
    signal("FLIP")
```

### 8. Reading a counter as zero before it has counted

[[barsSince()]] and [[valueWhen()]] are absent, not zero, before their condition has ever been true. Zero would read as "it happened on this bar", which is the opposite of the truth.

```openscript
fast = ema(close, 9)
slow = ema(close, 21)
since = barsSince(crossUp(fast, slow))
fresh = not isNone(since) and since <= 3
background(fresh ? fade(lime, 90) : none)
```

### 9. Building a message out of an absent part

```openscript
version 1
study("Last cross", overlay = true)

t = table("Last cross", 1, 1)
entryPrice = valueWhen(crossUp(close, ema(close, 20)), close)

// Absent before the first cross: text(x, 2) passes the absence on, and +
// then makes the whole message absent, so the cell would be blank.
message = "Last cross at " + text(entryPrice, 2)

if bar.isLast
    cell(t, 0, 0, isNone(message) ? "No cross yet" : message)
```

A message joined with `+` is absent if any part of it is. Guard the message as a whole, as here, or convert a fragile part with the one-argument `text(x)`, which writes an absent value as `"none"` instead of passing it on.

### 10. Confusing no volume with zero volume

[[volume]] is absent, not zero, on an instrument that has no volume, such as an index. Zero is a real reading that means nobody traded. Do not paper over the difference with `orElse(volume, 0)`: an index would then look like a stock nobody trades.

```openscript
version 1
study("Relative volume", precision = 2)

len = input(20, "Average length", min = 2, max = 500)

avgVolume = sma(volume, len)

// On an instrument with no volume, volume is absent and so is the ratio, so
// the pane stays empty instead of showing a flat line at zero.
ratio = volume / avgVolume

level(1, "Average", gray)
plot(ratio, "Volume against its average", aqua, width = 2, style = "histogram")
```

[[chart.hasVolume]] says whether the instrument reports volume at all, but it is itself absent when the application running the script does not state it, so test the value with `isNone(volume)` when you need a definite answer.

### 11. Sending an absent quantity to an order

A size computed from a risk budget divides by the distance to the stop, and that distance can be zero. The division is then absent, the order is refused with [OS7002](/script/errors/orders#os7002), and the strategy stops at that bar. That is the designed behaviour, but it ends the run over one awkward bar. Guard the entry, so such a bar simply places no order:

```openscript
version 1
strategy("Risk-sized entry", overlay = true)

riskPerTrade = input(2000, "Risk per trade, in rupees", min = 100)

fast = ema(close, 9)
slow = ema(close, 21)
stopPrice = lowest(low, 10)

// Absent when close equals stopPrice, because that divides by zero.
qty = floor(riskPerTrade / (close - stopPrice))

if crossUp(fast, slow) and not isNone(qty) and qty > 0
    buy(qty = qty)
if crossDown(fast, slow)
    close()
```

### 12. Hiding a gap instead of reading it

```openscript
value = rsi(close, 14)
plot(orElse(value, 0), "RSI, with a fake zero")
```

The line now runs along zero during warmup and dives to zero on every absent bar, which looks like data and is not. Plot the value itself and let the gap show.

## A short discipline

- Assume every library value is absent until its warmup is over, and look the warmup up in the reference rather than guessing it.
- Write a guard as `not isNone(x) and ...` or `isNone(x) or ...`, and check the operator, not the order of the operands.
- Give a name a starting value above any `if` that assigns to it.
- Never fall back to zero for a price, a quantity or a level. Fall back only to a value that is genuinely the answer.
- Treat every warning (codes starting OS8) as a real finding. Several exist for exactly the bugs on this page.
- When a plot has a hole, read the hole: it tells you which bars had no value.

## Errors and warnings you may meet

| Code | Means | Fix |
|---|---|---|
| [OS3006](/script/errors/arguments#os3006) | A plot inside a block, often written to hide it | Plot `none` on the bars to hide |
| [OS7002](/script/errors/orders#os7002) | An order received an absent price or quantity | Guard the order with `isNone` |
| [OS8001](/script/errors/warnings#os8001) | A stateful call inside a branch | Compute it at the top level |
| [OS8009](/script/errors/warnings#os8009) | A plot is absent on every bar | Check the warmup and the guard that feeds it |
| [OS8012](/script/errors/warnings#os8012) | A comparison against `none` | Use `isNone(x)` or `x == none` |

**Related.** [Types and values](/script/language/types-and-values), [Operators](/script/language/operators), [Control flow](/script/language/control-flow), [Warmup](/script/language/warmup), [Persistence](/script/language/persistence), [General functions](/script/reference/general)
