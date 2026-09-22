---
title: Control flow
description: if, else if and else, the ternary, for and while loops, break and continue, and switch. What each form does with an absent condition, the per-bar loop budget, and the loops you do not need to write.
---

Control flow decides which statements run on a bar and how many times. OpenScript has `if`, `else if` and `else` for choosing a block, the ternary for choosing a value, `for` and `while` for loops, `break` and `continue` to leave a loop or skip to its next round, and `switch` for choosing among several blocks. This page covers every form, what each one does when its condition is absent, the budget that stops a runaway loop, and the loops the library already writes for you.

## Everything runs inside one bar

The file is the body of the per-bar loop: for each bar, oldest first, the engine runs every top-level statement from the first line to the last. So every form on this page runs **inside one bar**. An `if` decides what happens on this bar. A `for` runs to completion within this bar. Nothing here carries a value to the next bar; that is what `var` is for (see [Persistence](/script/language/persistence)).

One consequence first, because it is the most common early mistake. [[plot()]], [[plotCandles()]], [[fill()]], [[level()]], [[table()]] and [[input()]] define the fixed shape of the study, which must be known before bar 0. They may appear only at the top level, never inside a block. Putting one of the first five inside an `if` is error [OS3006](/script/errors/arguments#os3006), and an `input()` there is [OS3007](/script/errors/arguments#os3007). To hide output on some bars, give it the absent value:

```openscript
version 1
study("EMA while trending", overlay = true)

ema20 = ema(close, 20)
trending = ema20 > ema(close, 50)

plot(trending ? ema20 : none, "EMA 20", aqua)  // correct: none leaves a gap
```

## Blocks

A block is the set of lines indented under a header line (`if`, `else`, `for`, `while`, `case`, `default` or a multi-line `fn`). It ends at the first line indented the same as the header or less. Indent with spaces only, and give every line of a block exactly the same indentation. [Script structure](/script/language/script-structure#blocks-and-indentation) has the full rules and their errors.

## if, else if, else

```openscript
version 1
study("Candle colours", overlay = true)

avgVolume = sma(volume, 20)

if close > open and volume > avgVolume
    barColor(lime)
else if close < open and volume > avgVolume
    barColor(red)
else
    barColor(gray)
```

`else if` is two words on one line and does not add a level of indentation. Any number of `else if` branches may follow an `if`, and at most one `else` comes last.

The condition must be a `bool` or the absent value. A number or a string is not a condition, and writing one is error [OS2011](/script/errors/names-and-types#os2011). Writing `=` where you meant `==` is [OS1006](/script/errors/syntax#os1006), because assignment is a statement and can never be a condition.

```openscript expect=OS1006
mode = 1
if mode = 1
    signal("MODE ONE")
```

### An absent condition takes the false branch

A condition that evaluates to `none` takes the false branch. This is the one place the language absorbs absence instead of passing it on, and it has to: execution must go somewhere.

```openscript
version 1
study("Strong bars", overlay = true)

len = input(20, "Volume average", min = 2, max = 500)
avgVolume = sma(volume, len)

// avgVolume is absent for the first len - 1 bars, so the first test is absent
// there and its block does not run. A bar cannot be strong against an
// average that does not exist yet.
if close > open and volume > avgVolume
    signal("STRONG")
else if close < open
    signal("WEAK")
```

Notice what the `else if` does **not** mean. It does not mean "every bar the first test did not catch". During warmup the first test is absent and the second may still be true, and after warmup a bar can fail the first test for two different reasons. When absence is possible, an `else` is not proof of the opposite.

The safe pattern is to give a name its "we do not know yet" value above the branch, and refine it only when the inputs are present:

```openscript
r = rsi(close, 14)

zone = "unknown"
if not isNone(r)
    zone = r > 70 ? "high" : (r < 30 ? "low" : "mid")

// Warmup bars stay "unknown", so they are not shaded as "mid".
background(zone == "mid" ? fade(gray, 90) : none)
```

A condition written as a literal `true` or `false` makes one branch dead, and is warning [OS8017](/script/errors/warnings#os8017). It is usually a test pinned during debugging and left behind.

## The ternary chooses a value

`cond ? a : b` gives `a` when the condition is true and `b` otherwise. Prefer it whenever a decision produces a value rather than an action: it keeps a plot at the top level, keeps a colour on one line, and leaves no branch that can forget to assign.

```openscript
r = rsi(close, 14)
tint = close > open ? lime : red
zone = isNone(r) ? none : r > 70 ? 1 : r < 30 ? -1 : 0

plot(r, "RSI", tint)
plot(zone, "Zone: 1 above 70, -1 below 30")
```

The ternary groups right to left, so a chain reads top to bottom as a list of cases with the last as the default. Both arms must have the same type, or one arm may be `none`. Only the taken arm is evaluated, and an absent condition takes the false arm, exactly as `if` does; that is why the chain above tests `isNone(r)` first. [Operators](/script/language/operators#the-ternary) covers the ternary in full.

## for

`for` has two forms. The range form counts, and is inclusive at both ends. The `in` form walks an array.

```openscript
version 1
study("Loop forms", precision = 2)

// Range form: ten iterations, i = 0, 1, 2, ... 9.
total = 0.0
for i = 0 to 9
    total += close[i]

// Counting down needs step -1. The last value written is close[0].
newest = 0.0
for i = 9 to 0 step -1
    newest = close[i]

// The in form visits each element of an array.
levels = [20.0, 50.0, 80.0]
sumLevels = 0.0
for lvl in levels
    sumLevels += lvl

plot(total / 10, "Mean of 10 closes", aqua)
plot(newest, "Close, read last", orange)
plot(sumLevels, "Sum of levels", gray)
```

| Rule | Detail |
|---|---|
| `step` defaults to `1` | Write it only when it is something else |
| The range is never reversed for you | `for i = 9 to 0` runs zero times, and the compiler warns with [OS8015](/script/errors/warnings#os8015). Write `step -1` to count down |
| A step of `0` | [OS3004](/script/errors/arguments#os3004), because that loop could never finish |
| An absent start, end or step | [OS4013](/script/errors/runtime#os4013) stops the script at that bar, rather than quietly running the loop zero times during warmup |
| The loop variable belongs to the loop | It does not exist after the loop ends |
| The loop variable cannot be assigned in the body | [OS2006](/script/errors/names-and-types#os2006). Use `break` to leave early |
| The `in` form visits indices `0` to `size - 1` as measured on entry | Elements appended during the loop are not visited |
| If the array shrinks past the loop's position | The loop stops |

```openscript expect=OS2006
for i = 0 to 9
    if close[i] > high
        i = 9
```

```openscript
lastAbove = -1
for i = 0 to 9
    if close[i] > high
        lastAbove = i
        break
plot(lastAbove, "Bars back to a close above this high")
```

## while

```openscript
prices = [22000.0, 22100.0, 22200.0, 22300.0]
i = 0
while i < size(prices) and prices[i] < close
    i += 1
plot(i, "Levels below the close")
```

The condition is checked before each iteration, with the same rule as `if`: a `bool` or absent, and an absent condition ends the loop.

A `while` has no counter of its own, so the body must move towards the exit, and it pays to write the bound into the condition rather than trust the data. The condition above has its two tests in the right order: the bound first, so `prices[i]` is never read out of range, and the data test second. Reversed, it would read `prices[i]` before checking `i`, and once `i` reached 4 on a bar where every level is below the close, that read is error [OS4004](/script/errors/runtime#os4004). Because `and` skips its right side when the left side is `false`, the bound protects the read.

## break and continue

`break` leaves the innermost `for` or `while`. `continue` skips the rest of this iteration and goes on to that loop's next one. Either one outside a loop is [OS1009](/script/errors/syntax#os1009); to leave a function early, use `return`.

```openscript
version 1
study("Mean body, skipping gaps", precision = 2)

lookback = input(20, "Lookback", min = 2, max = 500)

total = 0.0
seen = 0

for i = 0 to lookback - 1
    // continue says "this bar has nothing to contribute" and keeps the
    // accumulation at one level of indentation.
    if isNone(close[i]) or isNone(open[i])
        continue
    total += abs(close[i] - open[i])
    seen += 1

plot(seen > 0 ? total / seen : none, "Mean body", aqua, width = 2)
```

## switch

`switch` chooses one block among several. It is a statement, not an expression, and it has two forms.

**The value form** compares a subject with each `case`:

```openscript
method = input("medium", "Speed", options = ["fast", "medium", "slow", "verySlow"])

len = 21
switch method
    case "fast"
        len = 9
    case "slow", "verySlow"
        len = 50
    default
        len = 21

plot(sma(close, len), "Average", aqua)
```

**The condition form** has no subject and takes the first arm whose condition is true:

```openscript
r = rsi(close, 14)

zone = "mid"
switch
    case r > 70
        zone = "high"
    case r < 30
        zone = "low"
    default
        zone = "mid"

barColor(zone == "high" ? red : zone == "low" ? lime : none)
```

| Rule | Detail |
|---|---|
| Arms do not fall through | Each arm ends at the next `case` or `default`, and only one arm runs |
| A `case` may list several values, separated by commas | Every value must have the subject's type, or it is [OS2003](/script/errors/names-and-types#os2003) |
| `default` is optional and must be last | Anywhere else is [OS1017](/script/errors/syntax#os1017). With no `default` and no match, nothing happens |
| An absent `case` condition in the condition form | Is not taken, like any absent condition. In the example above, the warmup bars fall through to `default` |
| An arm declares nothing that outlives it | A name the arms set must be declared before the `switch` |

The last rule follows from block scope: a name first assigned inside an arm belongs to that arm. So declare the name above the `switch` with the value a reader should assume when no arm matches, and let the arms refine it. That makes the "declared in one arm only" bug impossible to write.

```openscript expect=OS2001
method = input("fast", "Speed", options = ["fast", "slow"])
switch method
    case "fast"
        len = 9
    case "slow"
        len = 21
plot(sma(close, len), "Average")
```

```openscript
version 1
study("Selectable average", overlay = true, precision = 2)

method = input("medium", "Speed", options = ["fast", "medium", "slow"])
src = input(close, "Source")

// Declared before the switch, with the value to assume when no arm matches.
len = 21

switch method
    case "fast"
        len = 9
    case "slow"
        len = 50

plot(sma(src, len), "Average", aqua, width = 2)
```

## The loop budget

A script runs inside a chart, often inside a browser tab, and a loop whose exit is never reached would freeze it. So every loop is counted.

**Every iteration of every loop, summed over all the loops run during one bar, counts against a per-bar budget of 2,000,000 iterations. Going over is error [OS5001](/script/errors/limits#os5001), which names the loop that was running when the budget ran out.**

- **It is per bar, not per loop.** One nested loop and ten loops in a row are treated alike, and splitting a loop in two does not get around it.
- **It resets on every bar.** A long history is never a reason to fail by itself. Fifty thousand bars doing two hundred iterations each is fine; one bar doing three million is not.
- **It stops the script rather than leaving the loop.** OS5001 stops the script at that bar and the chart shows the error. Quietly leaving the loop would produce a plausible wrong number, which is worse than no number.

The budget is a default, not a ceiling. A script that genuinely needs more raises it in one place, the line directly under the declaration:

```openscript
limits(loops = 5_000_000)
```

`limits()` is optional, appears at most once, and takes literal numbers; its two options are `loops` and `history`. The application running the script may refuse a value larger than it will run, with [OS5003](/script/errors/limits#os5003). [Script structure](/script/language/script-structure#the-limits-line) has a complete script that needs the line, and [Limits](/script/writing/limits) covers every budget.

A separate ceiling applies to nesting: an expression, block or call nested far deeper than anything written by hand is [OS5005](/script/errors/limits#os5005). Give the inner expression a name and use the name.

## Loops you do not need

Most loops in a first script are a window calculation written out by hand. The library already has them, each exact about its warmup and cheaper than a loop.

| What you want | Write this | Reference |
|---|---|---|
| The highest high of the last 20 bars | `highest(high, 20)` | [[highest()]] |
| How many bars back that high was | `highestBars(high, 20)` | [[highestBars()]] |
| The total of the last 20 closes | `sum(close, 20)` | [[sum()]] |
| The mean of the last 20 closes | `sma(close, 20)` | [[sma()]] |
| The mean, ignoring absent bars | `avgSkip(close, 20)` | [[avgSkip()]] |
| How many of the last 50 bars closed up | `count(close > open, 50)` | [[count()]] |
| Bars since a condition last held | `barsSince(cond)` | [[barsSince()]] |
| The close when a condition last held | `valueWhen(cond, close)` | [[valueWhen()]] |
| A running total from the first bar | `cum(volume)` | [[cum()]] |
| The change over ten bars | `change(close, 10)` | [[change()]] |
| Whether the last five changes were all up | `rising(close, 5)` | [[rising()]] |
| Where this bar ranks in its window | `percentRank(close, 100)` | [[percentRank()]] |
| The middle value of a window | `median(close, 20)` | [[median()]] |
| A crossing of two series | `crossUp(fast, slow)` | [[crossUp()]] |

The most common case of all needs no loop: a fixed lookback reads history directly with `[]`.

```openscript
// By hand.
hi = close
for i = 1 to 19
    hi = max(hi, close[i])

// The same, in one call, with an exact warmup.
hi20 = highest(close, 20)

plot(hi, "By hand", gray)
plot(hi20, "Library", aqua)
```

Both are absent for the first nineteen bars, because `close[i]` past the start of history is absent and [[max()]] of an absent value is absent. The library call's warmup is fixed and documented, though, which is how a study matches another implementation of the same indicator to the last decimal.

**Keep a running total instead of recomputing a window.** A loop over the last two hundred bars on every bar does two hundred times the work of updating one number. When the quantity is cumulative, a `var` and one addition per bar give the same answer, and rollback keeps it correct on the forming bar:

```openscript
version 1
study("Cumulative signed volume", precision = 0)

var running = 0.0

// One addition per bar, instead of a loop back to the first bar. The guard
// keeps one bar with no volume from making the total absent for ever.
if not isNone(volume)
    running += close > open ? volume : (close < open ? -volume : 0)

plot(running, "Signed volume", aqua, width = 2)
```

### Loops worth writing

A loop is the right tool when it walks a collection the script built itself, not a window of bars. The most important case is a list you remove from: walk it downwards, so removing element `i` cannot renumber an element the loop has yet to visit.

```openscript
version 1
study("Unbroken pivot highs", overlay = true, precision = 2)

leftBars = input(5, "Pivot left bars", min = 1, max = 50)
rightBars = input(5, "Pivot right bars", min = 1, max = 50)

var levels: array<number> = []

// Counted downwards, because remove() renumbers every element above the one
// it removes, and an ascending loop would step over the next one. While the
// list is empty the range runs from -1 to 0 downwards, and never runs.
for i = size(levels) - 1 to 0 step -1
    if close > element(levels, i)
        remove(levels, i)

pivot = pivotHigh(high, leftBars, rightBars)
if not isNone(pivot)
    push(levels, pivot)

plot(size(levels), "Pivot highs still unbroken", aqua, width = 2, style = "step")
```

[Profiling and speed](/script/writing/profiling) covers what loops and history reads cost.

## Errors and warnings you may meet

| Code | Means | Fix |
|---|---|---|
| [OS1002](/script/errors/syntax#os1002) | A tab in indentation | Indent with spaces |
| [OS1003](/script/errors/syntax#os1003) | Indentation does not match the block | Make every line of a block match exactly |
| [OS1006](/script/errors/syntax#os1006) | `=` used as a condition | Write `==` |
| [OS1009](/script/errors/syntax#os1009) | `break` or `continue` outside a loop | Move it into the loop, or use `return` |
| [OS1010](/script/errors/syntax#os1010) | A header with no body | Indent the body under it |
| [OS1017](/script/errors/syntax#os1017) | `case` or `default` out of place | Keep arms inside the `switch`, `default` last |
| [OS2006](/script/errors/names-and-types#os2006) | The loop variable is assigned in the body | Use `break`, or a separate name |
| [OS2011](/script/errors/names-and-types#os2011) | A condition is not a `bool` | Write the test out |
| [OS3004](/script/errors/arguments#os3004) | A `for` step of zero | Use a non-zero step |
| [OS3006](/script/errors/arguments#os3006) | `plot`, `plotCandles`, `fill`, `level` or `table` inside a block | Move it to the top level; pass `none` to hide it |
| [OS4013](/script/errors/runtime#os4013) | A loop bound is absent | Guard the loop, or give the bound a value with `orElse` |
| [OS5001](/script/errors/limits#os5001) | The per-bar loop budget ran out | Fix the exit condition, or raise `limits(loops = ...)` |
| [OS8015](/script/errors/warnings#os8015) | The loop never runs | Add `step -1`, or swap the bounds |
| [OS8017](/script/errors/warnings#os8017) | The condition is constant | Restore the test that was meant |

**Related.** [Execution model](/script/language/execution-model), [Absent values](/script/language/absent-values), [Variables and scope](/script/language/variables-and-scope), [Operators](/script/language/operators), [Collections](/script/language/collections), [Series functions](/script/reference/series)
