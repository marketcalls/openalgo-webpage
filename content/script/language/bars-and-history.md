---
title: Bars and history
description: Reading past values with the history operator. What has history, what the first bars return, which offsets are allowed, and what a deep lookback costs.
---

A script runs once per bar, and on each bar it can look back at the bars before it. This page covers the history operator `[n]` that does the looking: which values you can look back through, what you get on the first bars of a chart where there is nothing behind you, which offsets are errors, and what a long lookback costs. Almost every study reads the past, so the rules here decide whether yours draws the right thing on the oldest bars and whether it keeps running on a long chart.

## A first example

On a daily NSE chart, `open - close[1]` is the overnight gap: this bar's open against the previous session's close. Three reads of the past, each a single expression:

```openscript title="Three reads"
version 1
study("Three reads", overlay = true, precision = 2)

// The overnight gap: this bar's open against the previous bar's close.
gap = open - close[1]

// The change over one bar, which the library also spells change(close).
diff = close - close[1]

// Whether the previous bar's range sits inside the one before it.
inside = high[1] < high[2] and low[1] > low[2]

plot(gap, "Gap", aqua)
plot(diff, "Change", orange)

if inside
    signal("INSIDE", at = "above")
```

The inside-bar test reads `high[1]` and `high[2]`, not `high` and `high[1]`. An inside bar is only known once the inner bar has finished, and the bar you are on may still be forming. Asking about bars that have closed is the honest way to write it; [Realtime and confirmation](/script/language/realtime-and-confirmation) explains why.

## The history operator

A **series** is a value with one entry per bar: a number, a bool, a string or a colour. Reading a series bare gives its value on the bar being executed. Writing `[n]` after it gives the value `n` bars earlier.

```openscript
last = close          // this bar's close
prev = close[1]       // the previous bar's close
same = close[0]       // identical to close
old  = close[20]      // the close twenty bars ago

plot(last - prev, "One bar change")
plot(same - old, "Twenty bar change")
```

The offset always counts backwards from the bar being executed, never forwards and never from the start of the data. On bar 500, `close[3]` is bar 497's close; on bar 501 the same expression reads bar 498. The window slides with the bars.

[[history()]] is the same read written as a call: `history(close, 3)` means `close[3]`. Use it where a bare `[]` would be hard to read, and see [Series or array](#series-or-array) for the one place it matters.

## What has history

A value accepts `[]` as history in exactly four cases:

| Case | Example | Why it has history |
|---|---|---|
| A built-in series | `close[1]`, `volume[3]`, `time[5]` | The engine stores one value per bar from the chart's data |
| A name assigned at the top level of the file | `diff = close - open`, then `diff[1]` | The compiler keeps that name's value for every bar |
| A call that returns a series | `ema(close, 20)[1]` | Its per-bar results are kept |
| A parameter of your own function | `fn f(src) => src - src[1]` | The caller's expression is kept for that call |

Anything else has no stored past, and `[]` on it is error [OS2004](/script/errors/names-and-types#os2004). The usual case is a temporary expression:

```openscript expect=OS2004
// The bracketed expression is a temporary, so it has no history.
if (close - open)[1] > 0
    signal("PREVIOUS BAR WAS UP")
```

The fix is one line: give the value a name at the top level and read the name's history.

```openscript
body = close - open
if body[1] > 0
    signal("PREVIOUS BAR WAS UP")
```

The rule is there for memory. Keeping a value for every bar costs space on every bar of the chart, and keeping it for every temporary inside every loop would not run fifty thousand bars in a browser tab. Naming a value at the top level is how a script says "keep this one".

## The first bars

On the oldest bar of the chart there is nothing behind you, so a read past the start of the data gives the absent value, `none`. It is not an error, it is not zero, and it is not the oldest bar repeated.

**`x[n]` is absent whenever `n` is greater than `bar.index`.**

Here is one series at the left edge of a chart whose first four closes are 100, 102, 101 and 104:

| Bar | `close` | `close[1]` | `close[2]` | `close[3]` | `close[4]` |
|---|---|---|---|---|---|
| 0 | 100 | absent | absent | absent | absent |
| 1 | 102 | 100 | absent | absent | absent |
| 2 | 101 | 102 | 100 | absent | absent |
| 3 | 104 | 101 | 102 | 100 | absent |

Absent is the truthful answer. If `close[1]` on bar 0 quietly gave `close`, then `close - close[1]` would be exactly zero on bar 0: a reading of "no change" drawn on the chart where no change was ever measured. Instead the absence carries through the subtraction and the plot leaves a gap.

Everything downstream follows the ordinary rules of [Absent values](/script/language/absent-values):

```openscript
change1  = close - close[1]           // absent on bar 0
higher   = close[1] > close[2]        // absent on bars 0 and 1, not false
isStart  = isNone(close[1])           // true on bar 0: the way to ask
prevOrNow = orElse(close[1], close)   // the previous close, or this one at the start

plot(change1, "Change")               // a gap on bar 0
plot(higher ? 1 : 0, "Higher")        // 0 on bars 0 and 1: see below
plot(isStart ? 1 : 0, "First bar")
plot(prevOrNow, "Previous close")
```

A comparison with an absent side is itself absent, and an absent condition takes the false branch of an `if` or a ternary. That is why the `Higher` plot above shows 0 on bars 0 and 1 rather than a gap: `higher` is absent there, and `higher ? 1 : 0` takes its false branch. So on the first bars `a > b` and `a <= b` are both absent, and a script that branches on one and assumes the other is its opposite takes neither path. That keeps the rule `not (a > b)` means `a <= b` true everywhere else, at the cost of one thing to remember at the left edge. Ask with [[isNone()]] when it matters.

## Offsets

The number inside the brackets must be a whole number of bars, at or above zero.

| Offset | Result |
|---|---|
| `0` up to `bar.index` | The value on that bar |
| Greater than `bar.index` | Absent |
| Absent | Absent |
| Not a whole number, such as `2.5` | Error [OS4001](/script/errors/runtime#os4001), and the script stops on that bar |
| Negative, such as `-1` | Error [OS4001](/script/errors/runtime#os4001), and the script stops on that bar |
| Deeper than the history the engine keeps | Error [OS4002](/script/errors/runtime#os4002). The message names the depth kept, and the fix gives the `limits()` line that raises it |

**A fractional offset is refused rather than rounded.** A lookback of 2.5 bars is a bug in the script, and rounding it would hide the bug behind a number that looks right. Say which whole number you mean:

```openscript
len  = input(20, "Length", min = 2, max = 200)
back = round(len / 2)
mid  = close[back]
plot(mid, "Close half a window ago")
```

**A negative offset is never available.** Reading the future is the one thing a per-bar language must never make easy, so there is no option or mode that turns it on for `[]`. A study that wants to draw a value to the right of the current bar shifts where the line is drawn, not what it reads: `plot(value, "Title", offset = 26)` moves the drawing and changes no number.

**An absent offset gives an absent result.** Offsets are often computed, so this happens more than you might expect:

```openscript
back      = lowestBars(low, 20)   // absent for the first 19 bars
priceThen = close[back]           // so this is absent for those bars too
plot(priceThen, "Close at the 20 bar low")
```

**OS4002 is an error, not an absent value, on purpose.** By default the engine keeps the full history of every series for the data it was given, so OS4002 only appears when a depth has been set. It means the value existed and was thrown away, which is a different fact from a value that never existed, and reporting both as a gap would hide a configuration mistake behind an innocent-looking blank.

## Looking back through an expression

There are two ways to read the past of something you computed.

**Name it at the top level.** This is the everyday answer, it costs one line, and it usually makes the script easier to read:

```openscript title="Range expansion"
version 1
study("Range expansion", precision = 2)

// Naming the range is what gives it history.
barRange = high - low
mean     = sma(barRange, 20)

// The range grew on each of the last two bars.
expanding = barRange > barRange[1] and barRange[1] > barRange[2]

plot(barRange, "Range", aqua)
plot(mean, "Mean range", orange)

if expanding and barRange > mean
    signal("EXPANDING")
```

**Use `history(expr, n)`.** It reads exactly what `[n]` would, and it accepts an expression directly. Its first value is on bar `n`.

```openscript
prevBody = history(close - open, 1)   // the previous bar's body
plot(prevBody, "Previous body")
```

A name only has history when it is assigned at the **top level**. A name first assigned inside an `if`, a loop or a function body belongs to that block, lives for one bar, and `[]` on it is OS2004:

```openscript expect=OS2004
trending = close > ema(close, 50)
if trending
    inner = close - open
    signal(inner[1] > 0 ? "UP BEFORE" : "DOWN BEFORE")
```

When you want history for something that only has a meaning on some bars, compute it on every bar at the top level and let it be absent on the others:

```openscript
trending = close > ema(close, 50)

// A top-level name, absent on the bars you did not want.
trendBody   = trending ? close - open : none
wasPositive = orElse(trendBody[1] > 0, false)

plot(wasPositive ? 1 : 0, "Previous trend bar was up")
```

## History through a function parameter

A parameter of a function you write can carry history, and it reads the history of whatever the caller passed:

```openscript title="Slope"
version 1
study("Slope", precision = 4)

fn slope(src, n) => (src - src[n]) / n

plot(slope(hlc3, 5), "Typical price slope", aqua)
plot(slope(ema(close, 20), 5), "Average slope", orange)
```

Passing an expression to such a parameter makes the engine keep that expression's values **for that call**. The two calls above keep two separate series, because they are two call sites. This is the same rule that gives two calls of a stateful function such as [[ema()]] their own state, and [User functions](/script/language/functions) covers it in full. Two things follow:

- A call that does not run on a bar keeps nothing for that bar, so its parameter's history has a hole exactly where the call was skipped. Call at the top level and branch on the result.
- Each call site keeps its own copy, so calling one helper in ten places keeps ten series. That is the price of the convenience, and [What a deep lookback costs](#what-a-deep-lookback-costs) puts it in context.

## Series or array

The same brackets have a second meaning. `a[i]` is history when `a` is a series and **element access** when `a` is an array. The compiler knows which from the type of `a`, so nothing is decided while the script runs.

| Written | `a` is a series | `a` is an array |
|---|---|---|
| `a[1]` | The value one bar ago | The second element |
| Past the end | Absent: a value that never existed | Error [OS4004](/script/errors/runtime#os4004): a mistake in the script |
| Explicit form | `history(a, 1)` | `element(a, 1)` |

The different treatment of "past the end" is deliberate. A lookback past the start of the chart asks for a measurement that was never taken, so it is absent. An array has a size the script itself chose, so an index outside it is a bug, and it stops the script with a message naming the index and the size.

A call with several outputs, such as [[macd()]] or [[bollinger()]], returns an array holding this bar's outputs. Read the elements with `[]`, and to look back at one of them, give it a top-level name first:

```openscript title="MACD with history"
version 1
study("MACD slope", precision = 4)

m = macd(close, 12, 26, 9)

// Name the elements. Each name is a series, so it has history.
line = m[0]
sig  = m[1]

climbing = line > line[1]
crossed  = crossUp(line, sig)

plot(line, "MACD", aqua)
plot(sig, "Signal", orange)
plot(m[2], "Histogram", gray, style = "histogram")

if climbing and crossed
    signal("UP")
```

:::warn History of a whole array
The compiler accepts `history(arr, 1)` on an array, but in release 0.5.0 it gives the absent value on every bar rather than last bar's array, and indexing that result, as in `history(m, 1)[0]`, stops the script with OS4004 on the first bar. Name the element you need at the top level, as above, and read that name's history.
:::

[Collections](/script/language/collections) covers arrays in full.

## Library functions that read history for you

Most lookbacks you would write by hand already exist as library calls, each with an exact first bar and a name that says what it means. Prefer them.

| You might write | Write instead | First value |
|---|---|---|
| `close - close[1]` | `change(close)` | bar 1 |
| `close - close[len]` | `change(close, len)` | bar `len` |
| A loop taking the largest `high[i]` | `highest(high, len)` | bar `len - 1` |
| A loop taking the smallest `low[i]` | `lowest(low, len)` | bar `len - 1` |
| A loop adding `close[i]` | `sum(close, len)` | bar `len - 1` |
| `a > b and a[1] <= b[1]` | `crossUp(a, b)` | bar 1 |
| Counting bars since a condition | `barsSince(cond)` | The first bar the condition is true |
| Remembering a value from a past condition | `valueWhen(cond, src)` | The first bar the condition is true |
| How many bars ago the window's high was set | `highestBars(high, len)` | bar `len - 1` |

Each has a full entry in the reference: [[change()]], [[highest()]], [[lowest()]], [[sum()]], [[crossUp()]], [[barsSince()]], [[valueWhen()]] and [[highestBars()]].

Two of these are worth a note. `crossUp(a, b)` means "was at or below, then above", so two lines that touch and then separate count as one crossing; with a coarse tick size on a low-priced NSE stock, the strict "below, then above" version would miss real crossings. And `barsSince` and `valueWhen` are absent, not zero, until the condition has been true at least once, because zero would read as "it happened on this bar".

## What a deep lookback costs

There are three separate costs, and it helps to know which one you are paying.

**Memory, per kept series.** The compiler keeps a name's past only when some line of the program reads it with `[]`. `diff = close - open` costs nothing extra unless something writes `diff[n]`. When a series is kept, the engine keeps its full history for the data it was given, so on fifty thousand bars each kept series is fifty thousand values. The application running the script (the host, such as the /trading page) can set a bound, and a script that needs a deeper one asks for it on the line straight after its declaration:

```openscript title="Long memory"
version 1
study("Long memory")
limits(history = 20000)

plot(close[5000], "Close 5000 bars back")
```

`limits()` takes `loops` and `history`, its values must be literal numbers, and it must be the statement immediately after the declaration ([OS3014](/script/errors/arguments#os3014) and [OS3015](/script/errors/arguments#os3015) otherwise). A host may refuse a value larger than it is willing to run, and it says so with [OS5003](/script/errors/limits#os5003) rather than quietly giving the script less than it asked for.

**Loop iterations, per bar.** A loop that walks back over history spends the per-bar loop budget: 2,000,000 iterations by default, summed over every loop on the bar. A loop of 200 is cheap on one bar and adds up across fifty thousand of them. The library call gives the same number without the loop:

```openscript
// 200 iterations on every bar.
hi = high
for i = 1 to 199
    hi = max(hi, high[i])

// The same value from a running window, with a stated first bar.
hi2 = highest(high, 200)

plot(hi, "Loop high")
plot(hi2, "Window high")
```

Both lines give the same numbers from the same first bar, bar 199, because [[max()]] with an absent argument is absent. The library call is still the better choice: it is one line instead of four, its first bar is stated in the reference rather than worked out by you, and it does not spend the loop budget.

**Warmup, per chain.** A lookback of `n` bars cannot have a value before bar `n`, and that absence travels through everything built on it. A study built from a 200 bar lookback of a 20 bar average has nothing to show until bar 219. [Warmup](/script/language/warmup) shows how to count it.

A rule of thumb that keeps all three in view: look back as far as the idea needs and no further, and use a library window function wherever one exists. Reading `close[1]` and `close[2]` is free. Looping over a thousand bars on every bar is a script you will want to [profile](/script/writing/profiling).

## Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Expecting `close[1]` to be a number on the first bar | A plot starts one bar late, or a condition never fires at the left edge | Accept the gap, or say what the first bar should use: `orElse(close[1], close)` |
| Writing `[]` on a temporary or a block name | OS2004 | Assign the value to a name at the top level and read that name |
| Reading `arr[1]` on an array and expecting last bar's value | The wrong number, silently | `arr[1]` is the second element. Name the element at the top level and read its history |
| A computed offset that is fractional or negative | OS4001 stops the script | Wrap it in [[round()]] or [[floor()]], and clamp it with `max(0, n)` |

**Related.** [Execution model](/script/language/execution-model), [Persistence](/script/language/persistence), [Warmup](/script/language/warmup), [Absent values](/script/language/absent-values), [Realtime and confirmation](/script/language/realtime-and-confirmation), [Collections](/script/language/collections), [Series functions](/script/reference/series)
