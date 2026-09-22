---
title: Profiling and speed
description: Keep OpenScript studies and strategies fast. What each kind of line costs per bar, how to measure the work from inside a script, and the three changes that fix nearly every slow one.
---

This page shows how to find which part of a slow OpenScript script (OpenScript is also called OpenAlgo Script) is costing the time, how to measure it rather than guess, and how to fix it. You need it when a study takes noticeably long to draw on a chart with a long history, when a backtest over a year of 5 minute bars crawls, or when a bar stops with a budget error from the [Limits](/script/writing/limits) page.

## The cost model

A script is the body of a loop that runs once per bar. Every top-level line runs on every bar, so the total cost of a script is its cost per bar multiplied by the number of bars. A study that takes a tenth of a millisecond per bar takes five seconds over 50,000 bars, which is more than two and a half years of 5 minute NIFTY bars. There is no part of a script that runs once and is free, and there is nothing you can move "outside the loop", because there is no outside. See the [execution model](/script/language/execution-model).

Two consequences follow, and most speed work is one of them.

- **A line whose cost grows with [[bar.index]] turns a linear script into a quadratic one.** 50,000 bars each scanning up to 50,000 bars is over a billion operations.
- **A line that recomputes from scratch what it could carry forward pays the whole cost again on every bar**, when the honest cost of the update was one addition.

## What costs what

This is a model, not a benchmark. Engines differ in raw speed and must not differ in results, so trust the order and treat the ratios as rough.

| Work | Cost per bar | Notes |
|---|---|---|
| Reading a bar field ([[close]], [[high]], [[time]]) | Lowest | The engine fills these before the bar's code runs |
| Arithmetic, a comparison, a ternary | Very low | Plain operations on numbers |
| Reading history, `close[5]` | Very low | A direct read, not a search |
| A smoothing library call ([[ema()]], [[rma()]], [[atr()]]) | Low and constant | Each carries its previous value forward, so the length does not change the cost per bar |
| A windowed library call ([[sma()]], [[highest()]], [[stdev()]]) | Grows with the length | The window is read afresh on every bar, so `sma(close, 200)` adds 200 values per bar. That keeps the value exact, and the work is done inside the engine rather than as turns of your own loop |
| A user function call | Low | One frame, and one set of stored state per call site |
| A `for` loop of `n` turns | `n` times the body | The body's cost is what matters; the loop itself is cheap |
| Building a string | Moderate | Joining allocates, and doing it on every bar for text shown once is waste |
| Creating or changing a drawing | Moderate, and it lasts | The object lives until you delete it |
| A higher timeframe or other instrument read | Paid per read | A whole second series is built or fetched and kept in step with the chart |
| A loop whose length grows with [[bar.index]] | Ruinous | The quadratic case, which this page mostly exists for |

## Measure the work

**A script cannot time itself, and that is deliberate.** [[chart.now()]] is the chart's clock as the host supplies it, and it is the only clock a script can read during a bar. It is fixed for reproducibility, so the same script over the same bars gives the same result every time, and a value fixed for reproducibility is not a stopwatch. There is no random source either, for the same reason.

So you measure **work** from inside the script and **time** from outside it. They answer different questions.

| Measurement | How | Tells you |
|---|---|---|
| Loop turns per bar | Count them into a `var`, show the count in a table on the last bar | Whether a loop is the problem, and by how much |
| Worst bar | Keep a running maximum of the per-bar count | Whether the cost is spread out or concentrated |
| Calls to a helper | Count entries the same way | Whether a function runs more often than you thought |
| Drawings held | [[draw.count()]] in a debug panel | Whether drawings pile up instead of being deleted |
| Data requests | Count the `req.` lines by eye | Whether you are near a host's request ceiling ([OS5006](/script/errors/limits#os5006)) |
| Time for the whole run | How long the chart takes to draw, or the backtest to finish | Whether the total is acceptable at all |

### Count the loop turns

This measurement settles most arguments. It costs a few lines and turns "the loop is probably fine" into a number.

```openscript title="Loop turn counter"
version 1

study("Loop turn counter", precision = 0)

length = input(20, "Window", min = 2, max = 500)

var totalTurns = 0
var worstBar = 0

perBar = 0
total = 0.0

for i = 0 to length - 1
    perBar += 1
    total += close[i]

totalTurns += perBar
if perBar > worstBar
    worstBar = perBar

panel = table("Loop turns", 3, 2, position = "topRight", textColor = silver)
if bar.isLast
    cell(panel, 0, 0, "turns in total")
    cell(panel, 0, 1, text(totalTurns, 0))
    cell(panel, 1, 0, "worst single bar")
    cell(panel, 1, 1, text(worstBar, 0))
    cell(panel, 2, 0, "bars")
    cell(panel, 2, 1, text(bar.count, 0))

plot(total / length, "Mean", aqua)
```

Compare the worst bar with the loop budget of 2,000,000 turns per bar. A worst bar in the thousands is fine. A worst bar in the hundreds of thousands is doing something structurally wrong even though it has hit no limit, and the next section is probably why.

Know what the budget does and does not protect you from. It stops a runaway loop from freezing the page. It does not stop a script from being slow: a loop that runs 50,000 turns on every bar is well inside the budget and is still 50,000 times more work than the one addition it should have been.

## The quadratic trap

This is the most common cause of a slow script, and it always looks reasonable on the day it is written.

```openscript
// Before: the mean of every close since the first bar. On bar 40,000 this
// loop runs 40,001 times, and it ran 40,000 times on the bar before.
total = 0.0
for i = 0 to bar.index
    total += close[i]

plot(total / bar.count, "Mean since the first bar", aqua)
```

Over 50,000 bars that is more than a billion turns, and a host that sets a time budget per bar stops it with [OS5007](/script/errors/limits#os5007). The fix is to carry the answer forward instead of rebuilding it:

```openscript
// After: one addition per bar. The mean is the same apart from rounding in
// the last digits, because the closes are added in a different order.
var total = 0.0
total += close

plot(total / bar.count, "Mean since the first bar", aqua)
```

The library has this shape ready made as [[cum()]], a running total from the first bar, and using it is better still: a library function has a stated warmup and an exactly specified result, and your own accumulator has neither until you test it.

The general rule: **if a loop's length depends on [[bar.index]], the value it computes can almost certainly be written as an update.** Ask what changed since the previous bar. Usually exactly one value arrived and at most one left.

## Rolling windows: add one, drop one

The same idea applies to a fixed window. The saving is smaller, but the shape is worth knowing because it extends to statistics the library does not have.

```openscript
len = input(20, "Length", min = 1, max = 500)

// Before: len additions on every bar.
total = 0.0
for i = 0 to len - 1
    total += close[i]

plot(total / len, "Mean, by loop")
```

```openscript
len = input(20, "Length", min = 1, max = 500)

// After: two operations per bar whatever len is. The value leaving the window
// is close[len], the bar just before the window's oldest bar.
var running = 0.0
running += close
if bar.index >= len
    running -= close[len]

// Absent until the window is full, so the warmup matches sma rather than
// reporting a mean of however many bars have arrived.
mean = bar.index >= len - 1 ? running / len : none
plot(mean, "Mean, by update")
```

Before you write that, check whether the library already has it. [[sma()]], [[sum()]], [[highest()]], [[lowest()]], [[stdev()]], [[median()]], [[percentile()]], [[correlation()]] and the rest are specified with exact warmups and exact arithmetic, and a hand-written copy is one more thing to test. Write a window by hand when the statistic is genuinely not in the [reference](/script/reference/series), not to save a call.

A running total has one accuracy caution that a fresh sum does not: subtracting a value added thousands of bars ago lets small floating point errors build up, so the result drifts from a fresh sum in the last few decimals as the chart grows. For most uses this is not a practical problem, but it is why the library's own windowed functions take the sum fresh over the window on every bar instead: [[sma()]] pays `len` additions per bar so that its value never drifts.

## Loops inside loops

Nesting multiplies, and the multiplication is easy to underestimate.

| Shape | Turns per bar | Over 50,000 bars |
|---|---|---|
| `for i = 0 to 19` | 20 | 1,000,000 |
| `for i = 0 to 19` inside `for j = 0 to 19` | 400 | 20,000,000 |
| `for i = 0 to 99` inside `for j = 0 to 99` | 10,000 | 500,000,000 |
| `for i = 0 to bar.index` | up to 50,000 | more than 1,000,000,000 |

Three changes fix nearly every nested loop.

**Hoist what does not change**, and **halve the work when the relationship is symmetric.** Anything computed from an input, a `chart.` fact or this bar's values is the same on every turn, so read it once before the loop. A `for` loop reads its bounds once, when it starts, so a bound on the outer loop costs nothing extra, but the inner loop starts again on every outer turn. And comparing every pair once rather than twice turns 400 turns into 190.

```openscript
var levels: array<number> = []
push(levels, close)
if size(levels) > 100
    shift(levels)

// Before: the inner loop reads size(levels) again for every outer turn, the
// tick size is read and defaulted on every inner turn, and every pair is
// compared twice.
nearest = none
for i = 0 to size(levels) - 1
    for j = 0 to size(levels) - 1
        gap = abs(element(levels, i) - element(levels, j)) / orElse(chart.tickSize, 0.05)
        if i != j and (isNone(nearest) or gap < nearest)
            nearest = gap

plot(nearest, "Nearest pair, in ticks")
```

```openscript
var levels: array<number> = []
push(levels, close)
if size(levels) > 100
    shift(levels)

// After: both read once per bar, and each pair visited once.
levelCount = size(levels)
tick = orElse(chart.tickSize, 0.05)
nearest = none
for i = 0 to levelCount - 1
    for j = i + 1 to levelCount - 1
        gap = abs(element(levels, i) - element(levels, j)) / tick
        if isNone(nearest) or gap < nearest
            nearest = gap

plot(nearest, "Nearest pair, in ticks")
```

**Leave early.** `break` leaves the innermost loop and `continue` skips to its next turn. A scan looking for the first match should stop at it.

```openscript
var highs: array<number> = []
push(highs, high)
if size(highs) > 100
    shift(highs)

// Stop at the first match instead of scanning the rest.
found = none
for i = 0 to size(highs) - 1
    if element(highs, i) > close
        found = i
        break

plot(found, "Oldest stored high above the close")
```

## Do not compute the same thing twice

**Every call site keeps its own state.** Two identical calls in two places are two independent sets of state, each updated on every bar. That rule is what makes a stateful helper reusable, and it is also what makes a copied line cost double. See [User functions](/script/language/functions).

```openscript
// Before: three call sites, three MACD calculations on every bar.
plot(macd(close, 12, 26, 9)[0], "MACD", aqua)
plot(macd(close, 12, 26, 9)[1], "Signal", orange)
plot(macd(close, 12, 26, 9)[2], "Histogram", gray, style = "histogram")
```

```openscript
// After: one call site, one calculation, three reads of the array it returns.
m = macd(close, 12, 26, 9)
plot(m[0], "MACD", aqua)
plot(m[1], "Signal", orange)
plot(m[2], "Histogram", gray, style = "histogram")
```

That is why [[macd()]] returns an array rather than being three separate functions: three names would be three call sites, and the shared smoothing would be computed three times per bar.

The same applies with more force to data reads, where the cost is a whole second series kept in step with the chart. Two identical `req.timeframe("1D", high)` calls are two reads: make one, name it, and use the name everywhere. [Limits](/script/writing/limits#data-requests) has the full example.

## Do newest-bar work on the newest bar

A panel shows one state, the current one. Writing it on all 50,000 bars to display the last one is 50,000 wasted writes.

```openscript
atrValue = atr(14)

panel = table("Now", 2, 2, position = "topRight", textColor = silver)

if bar.isLast
    cell(panel, 0, 0, "Close")
    cell(panel, 0, 1, text(close, 2))
    cell(panel, 1, 0, "ATR 14")
    cell(panel, 1, 1, isNone(atrValue) ? "warming up" : text(atrValue, 2))
```

During market hours the newest bar runs again on every update and rewrites the same cells, and persistent values are restored before each run, so nothing piles up. See [Realtime and confirmation](/script/language/realtime-and-confirmation).

Be careful about what you put behind that guard. Cells, labels and boxes that describe the present are fine. A **calculation** is not: a stateful call inside a branch advances only on the bars the branch runs, which behind [[bar.isLast]] means one bar, so its result is absent everywhere else ([OS8001](/script/errors/warnings#os8001)). That is why `atrValue` above is computed at the top level. Calculate unconditionally, display conditionally.

## Short-circuiting, and its trap

`and` and `or` evaluate their right side only when it can change the answer, so putting the cheapest test first is free speed:

```openscript
threshold = input(25000.0, "Level")
inSession = session.isIn("0915-1530")

// The cheap tests come first, so the comparison runs only where it can matter.
if inSession and close > threshold
    signal("ABOVE")
```

The trap: when the right side holds a stateful call and is skipped on some bar, that call's state does not advance and its series is absent on that bar. The compiler warns about it with [OS8001](/script/errors/warnings#os8001):

```openscript expect=OS8001
threshold = input(25000.0, "Level")
inSession = session.isIn("0915-1530")

if inSession and highest(high, 200) > threshold
    signal("HIGH")
```

So short-circuiting is a speed technique for pure tests only. Anything whose value you also plot, or whose state has to track every bar, is computed at the top level first:

```openscript
threshold = input(25000.0, "Level")
inSession = session.isIn("0915-1530")

extreme = highest(high, 200)  // advances on every bar
if inSession and extreme > threshold
    signal("HIGH")

plot(extreme, "200 bar high", aqua)
```

## Memory

Speed is usually the complaint, but memory is what ends a session badly. Four things drive it.

**Retained history.** The engine keeps a history for a top-level name only when the program actually reads that name's history with `[]`, so most names cost one value rather than one per bar. By default that history reaches back to the first bar. `limits(history = n)` bounds it. See [Limits](/script/writing/limits#the-retained-history-depth).

**Arrays.** An array appended to on every bar and never trimmed grows with the chart until it reaches the 1,000,000 element ceiling ([OS5002](/script/errors/limits#os5002)). Trim as you push:

```openscript
var window: array<number> = []
push(window, close)
if size(window) > 500
    shift(window)

plot(avg(window), "Mean of the last 500 closes")
```

**Drawings.** Each lasts until the script deletes it, up to 10,000 at once ([OS5010](/script/errors/limits#os5010)). Delete a zone when price closes through it or it goes stale, and keep [[draw.count()]] in a debug panel while you develop.

**Strings.** Text appended to a persistent string on every bar is the one shape that grows without bound by accident, and it ends at [OS5008](/script/errors/limits#os5008). Keep the pieces in an array, trim it to the rows you show, and join only those.

## The order to work in

1. **Get it right first.** A faster script that computes a different number is not an optimisation. Have a value you trust before you change anything.
2. **Measure.** Count loop turns, calls and drawings. Two minutes of counting beats an hour of rewriting the wrong line.
3. **Fix the structure, not the details.** Nearly every real improvement is one of three changes: remove a loop whose length grows with the bar index, carry a value forward instead of rebuilding it, or stop computing the same thing twice. Tweaking one expression is rarely worth the change.
4. **Measure again, and check the numbers did not move.** Run whatever comparison told you the script was right, on the same bars. The [difference plot](/script/writing/testing#compare-two-implementations) is the standard way.
5. **Stop when it is fast enough.** A study that draws in under a second on the chart you actually use is finished, whatever the counters say.

**Related.** [Limits](/script/writing/limits), [Debugging](/script/writing/debugging), [Testing scripts](/script/writing/testing), [Style guide](/script/writing/style-guide), [Series functions](/script/reference/series), [Persistence](/script/language/persistence)
