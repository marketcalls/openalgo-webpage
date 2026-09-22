---
title: Keywords
description: The thirty-six reserved words of OpenScript version 1, what each one does and where it may appear, and the two positional words version and limits.
---

OpenScript, also called OpenAlgo Script, reserves thirty-six words. Each one has a fixed job in the grammar, so none of them can be the name of a variable, a function or a parameter. This page lists every reserved word with the form it appears in, what it does and a working example, followed by the two words that are part of the grammar without being reserved: `version` and `limits`.

Read it once to learn which names are off limits. Come back to an entry when the compiler reports `OS1019` (a reserved word used as a name), or when you want the exact rule for a loop, a branch or a declaration.

## All reserved words at a glance

| Group | Words |
|---|---|
| Declarations | `study`, `strategy` |
| Control flow | `if`, `else`, `for`, `to`, `step`, `in`, `while`, `break`, `continue`, `switch`, `case`, `default` |
| Functions | `fn`, `return` |
| Persistence | `var`, `live` |
| Logic | `and`, `or`, `not` |
| Literals | `true`, `false`, `none` |
| Type names | `number`, `string`, `bool`, `color`, `series`, `array` |
| Reserved for a later version | `as`, `import`, `is`, `map`, `matrix`, `type` |

The six words in the last row do nothing in version 1. They are reserved now so that giving them a meaning later cannot break a script that used one as a variable name: a script that compiles under version 1 keeps compiling, and keeps producing the same numbers, under every later release.

Here is a complete study that uses most of the everyday keywords. It counts how many of the last ten bars closed above their open, and remembers the best count seen so far.

```openscript title="Keywords at work"
version 1
study("Up bars in the last ten", precision = 0)

// A user function: how many of the last len bars closed above their open.
fn upBars(len: number) =>
    total = 0
    for i = 0 to len - 1
        if isNone(close[i])
            continue
        if close[i] > open[i]
            total += 1
    total

var best = 0
recent = upBars(10)
if not isNone(recent) and recent > best
    best = recent

plot(recent, "Up bars", aqua, style = "histogram")
plot(best, "Most so far", orange)
```

## Where a reserved word may appear

A reserved word is never a name. The table shows what that rules out, and the one place a reserved word is still legal.

| Written as | Allowed | What happens |
|---|---|---|
| A variable name, such as `type = "long"` | No | `OS1019`, and the fix suggests a name that is free |
| A parameter of your own function, such as `fn f(color = red)` | No | `OS1019`, because the body refers to a parameter by name |
| The name of your own function, such as `fn step() => 1` | No | `OS1019` |
| A named argument label, such as `plot(x, "X", color = aqua)` | Yes | A label is matched against the called function's parameter list and is never looked up as a name |
| Text inside a string, such as `"type"` | Yes | A string is text, not code |

```openscript expect=OS1019
type = "long"
```

The label rule is why library calls can use `color` and `step` as argument names and you can still write them:

```openscript
version 1
study("Labels are not names", overlay = true)

stepSize = input(0.5, "Step size", step = 0.1)
plot(close + stepSize, "Offset close", color = aqua)
```

Do not confuse a reserved word with a built-in name. `close`, `ema`, `plot` and `aqua` are not reserved: they are ordinary names in the global scope. Assigning to one tries to declare a second name with the same spelling, and the language has no shadowing (one name hiding another), so the error is `OS2002` rather than `OS1019`.

```openscript expect=OS2002
close = 5
```

:::note
`bool` and `number` are type names, so they cannot be called as functions. The conversions are spelled [[toBool()]] and [[toNumber()]]. Writing `bool(x)` or `number(s)` is `OS1019`, and the fix names the working spelling.
:::

## Declarations

### `study`

**Form:** `study("Title", options...)`, the file's declaration.

Declares a file that computes and draws but places no orders. Every file carries exactly one declaration; write it directly under the `version` line. Calling an order function such as `buy()` from a study is `OS7001`. Every option is described on the [Declarations](/script/reference/declarations) page.

```openscript
version 1
study("RSI", precision = 2, range = [0, 100])

level(70, "Overbought", red)
level(30, "Oversold", lime)
plot(rsi(close, 14), "RSI", purple)
```

### `strategy`

**Form:** `strategy("Title", options...)`, the file's declaration.

Declares a file that plots and also places orders. It accepts every option `study` accepts and adds the trading options: starting capital, order size, product, fills, costs and pyramiding. A file with no declaration is `OS2007`, and a second declaration is `OS2008`.

```openscript
version 1
strategy("EMA cross", overlay = true, capital = 500000)

fast = ema(close, 9)
slow = ema(close, 21)

if crossUp(fast, slow)
    buy()
if crossDown(fast, slow)
    close()

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
```

## Control flow

### `if`

**Form:** `if condition`, a block header.

Runs the indented block below it when the condition is `true`. The condition must be a `bool` or `none`; a number or a string is `OS2011`, because the language has no truthiness (no rule that treats `0` or `""` as false). A condition that is `none`, such as a comparison during warmup, takes the false branch. That is the one place where an absent value is absorbed rather than passed on, because execution has to go somewhere.

```openscript
r = rsi(close, 14)
if r > 70
    signal("OVERBOUGHT")
plot(r, "RSI")
```

### `else`

**Form:** `else`, or `else if condition`, a block header.

The alternative branch of an `if`. `else if` is two words on one line and does not add indentation, so a chain of conditions stays flat instead of drifting to the right.

```openscript
if close > open
    barColor(lime)
else if close < open
    barColor(red)
else
    barColor(gray)
```

### `for`

**Form:** `for i = start to end`, optionally with `step n`, or `for item in array`.

The two loop forms. The counted form includes both ends, so `for i = 0 to 9` runs ten times. If the end is below the start and the step is positive (or the other way round), the body does not run at all, and the compiler warns with `OS8015` when it can see that; a range is never reversed for you. An absent start, end or step stops the script with `OS4013` rather than running the loop zero times. The loop variable belongs to the loop and may not be assigned in the body (`OS2006`).

```openscript
total = 0.0
for i = 0 to 9
    total += close[i]
plot(total / 10, "Ten bar mean")
```

Every iteration of every loop counts against a per-bar budget of 2,000,000 iterations. See [`limits`](#limits) to raise it.

### `to`

**Form:** `for i = start to end`.

Separates the two bounds of a counted loop. Both ends are inclusive.

```openscript
higher = 0
for i = 1 to 20
    if high[i] > high
        higher += 1
plot(higher, "Bars of the last 20 with a higher high than this bar")
```

### `step`

**Form:** `step n`, the optional third clause of a counted `for`.

Sets the increment. It defaults to `1`, and a descending loop has to say `step -1`. A step of `0` is `OS3004`, because it is the one loop that could never finish. Walking an array from the end with `step -1` is the standard way to remove elements while you loop, since removing one shifts every element after it.

```openscript
var zones: array<number> = []
push(zones, close)
for i = size(zones) - 1 to 0 step -1
    if element(zones, i) < close * 0.95
        remove(zones, i)
plot(size(zones), "Zones kept")
```

`step` is also a named argument of [[input()]] and [[psar()]]. That is correct code, because an argument label is not a name.

### `in`

**Form:** `for item in array`.

Introduces the array form of `for`. It visits the elements from index `0` up to the size measured when the loop starts, so elements appended during the loop are not visited. `in` is not a membership test: use `indexOf(arr, v) != -1` for that.

```openscript
levels = [22000.0, 22500.0, 23000.0]
above = 0
for lvl in levels
    if close > lvl
        above += 1
plot(above, "Levels below price")
```

### `while`

**Form:** `while condition`, a block header.

Repeats its block while the condition holds, checking it before each pass. The condition follows the same rule as `if`: a `bool`, or `none`, which ends the loop. It shares the per-bar loop budget with every other loop; running past the budget is `OS5001`, which stops the script rather than quietly breaking out of the loop.

```openscript
prices = [100.0, 250.0, 400.0]
i = 0
while i < size(prices) and prices[i] < close
    i += 1
plot(i, "Levels below the close")
```

The `and` in the condition matters: when `i` reaches the size of the array, the left side is `false`, so `prices[i]` is never read past the end.

### `break`

**Form:** `break`, a statement.

Leaves the innermost `for` or `while` at once. It is the only way out of a counted loop early, since the loop variable cannot be assigned. Outside a loop it is `OS1009`.

```openscript
firstUp = -1
for i = 0 to 20
    if close[i] > open[i]
        firstUp = i
        break
plot(firstUp, "Bars since the last up bar")
```

### `continue`

**Form:** `continue`, a statement.

Skips the rest of this pass and moves to the next iteration of the innermost loop. Outside a loop it is `OS1009`.

```openscript
total = 0.0
for i = 0 to 19
    if isNone(volume[i])
        continue
    total += volume[i]
plot(total, "Volume over 20 bars")
```

### `switch`

**Form:** `switch subject`, or a bare `switch`, a block header.

A statement that picks one arm. The value form compares a subject with each `case`; the condition form, with no subject, takes the first arm whose condition is true. Arms do not fall through. A name that the arms set must be declared before the `switch`, because a name first assigned inside an arm belongs to that arm and cannot be read after it.

```openscript
mode = input("fast", "Mode", options = ["fast", "slow", "verySlow"])

len = 14
switch mode
    case "fast"
        len = 9
    case "slow", "verySlow"
        len = 21

plot(sma(close, len), "SMA")
```

There is no expression form of `switch`. To choose a value, use the ternary `cond ? a : b`.

### `case`

**Form:** `case value`, `case valueA, valueB`, or `case condition` in a bare `switch`.

Opens one arm of a `switch`. A `case` may list several values separated by commas, all of the subject's type. Its block ends at the next `case` or `default`. A `case` outside a `switch` is `OS1017`.

```openscript
r = rsi(close, 14)
zone = 0
switch
    case r > 70
        zone = 1
    case r < 30
        zone = -1
plot(zone, "RSI zone")
```

### `default`

**Form:** `default`, the last arm of a `switch`.

Runs when no `case` matched. It is optional and must come last; a `default` followed by a `case` is `OS1017`. With no `default` and no match, nothing runs.

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
plot(zone == "high" ? 1 : zone == "low" ? -1 : 0, "RSI zone")
```

## Functions

### `fn`

**Form:** `fn name(parameters) => expression`, or `fn name(parameters) =>` followed by an indented block whose last expression is the result.

Declares a user function. Parameters may carry a type annotation and a default. The rules follow from the per-bar model, where the whole file runs once per bar:

- A function is declared at the top level of the file. Declaring one inside a block is `OS1023`.
- A function is not a value: it cannot be stored in a variable or passed as an argument.
- A function may not call itself, directly or through a cycle (`OS2005`). Write a loop instead.
- A function may be called above the line that declares it.
- State inside a function, a `var` or a call such as [[ema()]], belongs to each call site separately, so two calls in two places keep two separate states.

```openscript
version 1
study("Z-score", precision = 2)

fn zscore(src, len) =>
    m = sma(src, len)
    s = stdev(src, len)
    (src - m) / s

plot(zscore(close, 20), "Z-score of the close", aqua)
level(0, "Mean", gray)
```

### `return`

**Form:** `return expression`, or a bare `return`.

Leaves a function at once with that value, or with `none` when bare. A function whose last statement is an expression returns it without `return`, so the keyword is needed only to leave early.

```openscript
fn clampTo(x, lo, hi) =>
    if x < lo
        return lo
    if x > hi
        return hi
    x

plot(clampTo(rsi(close, 14), 30, 70), "RSI held between 30 and 70")
```

## Persistence

### `var`

**Form:** `var name = initial`, optionally `var name: type = initial`.

Declares a value that is set once, on the first bar the line is reached, and then keeps whatever it holds from bar to bar. Without `var`, a name is computed afresh on every bar. The initial value is required: `var total` alone is `OS1011`, and the fix is `var total = none`.

```openscript
var barCount = 0
barCount += 1
plot(barCount, "Bars so far")
```

On the newest bar of a moving chart, a `var` is restored before each re-run of that bar to what it held at the end of the previous bar, so running the bar ten times gives the same answer as running it once. See [Persistence](/script/language/persistence).

### `live`

**Form:** `live var name = initial`.

Declares a persistent value that does not roll back when the newest bar runs again. Use it only when counting the updates of a moving bar is the point. A script that uses it gives different numbers on a moving chart than in a backtest over the same bars, which is why the compiler reminds you with warning `OS8011`.

```openscript
live var updates = 0
updates += 1
plot(updates, "Executions so far")
```

## Logic

### `and`

**Form:** `a and b`, a binary operator.

True when both sides are true. It uses three-valued logic, where `none` means unknown, and it short-circuits: the right side runs only when the left side is not `false`. `&&` does not exist; writing it is `OS1001`, and the fix names `and`.

```openscript
avgVolume = sma(volume, 20)
strong = close > open and volume > avgVolume
barColor(strong ? lime : none)
```

A call that keeps state, such as [[ema()]], on the right of an `and` does not advance on a bar where the right side is skipped, and the compiler warns with `OS8001`. Compute such a call on its own line first, then combine the results, as `avgVolume` is above.

### `or`

**Form:** `a or b`, a binary operator.

True when either side is true, with the same three-valued logic. The right side runs only when the left side is not `true`. `||` does not exist.

```openscript
// On bar 0 bar.isFirst is true, so time[1], which is absent there, is never read.
newDay = bar.isFirst or not date.isSameDay(time, time[1])
background(newDay ? fade(aqua, 90) : none)
```

### `not`

**Form:** `not x`, a unary operator.

Boolean negation. `not none` is `none`. `!` is not an operator; `!cond` is `OS1001` and the fix names `not cond`.

```openscript
insideBar = high < high[1] and low > low[1]
barColor(not insideBar ? fade(gray, 60) : yellow)
```

## Literals

### `true`

**Form:** `true`, a literal of type `bool`.

One of the two boolean values. It is not the number `1` and does not mix with numbers.

```openscript
e = ema(close, 20)
upCross = crossUp(close, e)
downCross = crossDown(close, e)

var inTrend = false
if upCross
    inTrend = true
else if downCross
    inTrend = false
background(inTrend ? fade(lime, 90) : none)
```

### `false`

**Form:** `false`, a literal of type `bool`.

The other boolean value. It is not the number `0`.

```openscript
hideBand = input(false, "Hide the band")
upper = sma(close, 20) + 2 * stdev(close, 20)
plot(hideBand ? none : upper, "Upper band")
```

### `none`

**Form:** `none`, the absent value.

The value that means "there is nothing here": warmup, a division by zero, a bar with no data. It belongs to every type, so a `series number` may hold `none` on any bar. It passes through arithmetic and through `<`, `<=`, `>` and `>=`, but `==` and `!=` always answer `true` or `false`, so `x == none` works as a test. Plotting `none` leaves a gap. See [Absent values](/script/language/absent-values).

```openscript
ema20 = ema(close, 20)
trending = ema20 > ema(close, 50)
plot(trending ? ema20 : none, "EMA 20 while trending", aqua)
```

## Type names

### `number`

**Form:** `number`, in a type annotation.

The one numeric type: a finite 64-bit floating point value. There is no separate integer type, so a length, a bar count and a price are all `number`. A place that needs a whole number, such as a length or an index, refuses a fractional one with an error rather than rounding it for you.

```openscript
fn band(src: series number, len: number = 20, mult: number = 2) =>
    sma(src, len) + mult * stdev(src, len)

plot(band(close), "Upper band", aqua)
```

### `string`

**Form:** `string`, in a type annotation.

Text, as a sequence of Unicode code points. A string literal uses double or single quotes, which mean the same thing. There is no implicit conversion: `"count: " + 5` is `OS2003`, and the fix is `"count: " + text(5)`.

```openscript
fn tag(prefix: string, value: number) => prefix + " " + text(value, 2)

panel = table("Last bar", 1, 2, position = "bottomRight")
if bar.isLast
    cell(panel, 0, 0, tag("Close", close))
    cell(panel, 0, 1, tag("Range", high - low))
```

### `bool`

**Form:** `bool`, in a type annotation.

The boolean type, holding `true` or `false` and nothing else. The conversion to it is [[toBool()]], not `bool(x)`.

```openscript
fn mostlyUp(cond: bool, len: number) => count(cond, len) > len / 2

plot(mostlyUp(close > open, 10) ? 1 : 0, "Mostly up bars")
```

### `color`

**Form:** `color`, in a type annotation.

The colour type: red, green, blue and alpha (opacity). A colour is written as a named colour such as `aqua`, as hex such as `#ff8800`, or built with a function such as [[rgb()]] or [[fade()]]. The word is also the name of an argument on [[plot()]], [[fill()]], [[level()]] and the drawing calls, and that is legal because a label is not a name.

```openscript
fn tint(hot: bool) => hot ? red : silver

barColor(tint(volume > 2 * sma(volume, 20)))
```

### `series`

**Form:** `series T`, in a type annotation.

Marks a value that carries one entry per bar. On a function parameter it says that `[]` inside the function reads the history of whatever the caller passed, so a helper such as a change over one bar works for any source. The compiler also infers this from how the parameter is used, so the annotation documents intent rather than being required.

```openscript
fn barChange(src: series number) => src - src[1]

plot(barChange(hlc3), "Change in typical price")
```

### `array`

**Form:** `array<T>`, in a type annotation.

Names an array type. `T` is `number`, `string`, `bool`, `color`, or an object type such as `line`, `box` or `table`. An array of arrays is not a type in version 1 (`OS2019`). An array is built with a bracket literal, and an empty one needs its element type from an annotation.

```openscript
var closes: array<number> = []
push(closes, close)
if size(closes) > 50
    shift(closes)
plot(avg(closes), "Mean of the last 50 closes")
```

## Reserved for a later version

These six words are reserved and do nothing in version 1. Using any of them as a name is `OS1019`.

### `as`

Intended for naming an import, alongside `import`. Nothing in version 1 accepts it.

```openscript expect=OS1019
as = "alias"
```

### `import`

Intended for importing a user library file. Version 1 has no imports; a script is one file.

```openscript expect=OS1019
import = 1
```

### `is`

Reserved for a later version. No construct in version 1 uses it, so do not plan around any particular meaning.

```openscript expect=OS1019
is = true
```

### `map`

Intended for a keyed collection, `map<K, V>`, with `string` and `number` keys and iteration in insertion order so a script stays deterministic. Until then, keep two arrays side by side and index them together.

```openscript expect=OS1019
map = 0
```

### `matrix`

Intended for a two-dimensional numeric container with the row and column operations that correlation and regression studies need.

```openscript expect=OS1019
matrix = 0
```

### `type`

Intended for user-declared record types and the field access that goes with them. Its absence is why [[draw.polyline()]] takes two parallel arrays, of times and of prices, rather than one array of points.

```openscript expect=OS1019
type = "long"
```

## Positional words

Two words belong to the grammar without being reserved. Each has a fixed place near the top of a file.

### `version`

**Form:** `version 1`, the first line of the file that is not blank and not a comment.

Declares the language version the file was written for. Version 1 is the only version today. Anything other than a comment or a blank line above it is `OS1021`.

The line is optional, but write it. Without it, the compiler warns with `OS8003` and compiles the file with the newest version it implements, so the file's meaning is tied to whichever release reads it. With it, the file is read by the version 1 rules for good: a script that compiles under version 1 compiles under every later release and produces the same numbers.

```openscript
version 1
study("Pinned to version 1", overlay = true)
plot(ema(close, 21), "EMA 21", orange)
```

### `limits`

**Form:** `limits(loops = n, history = n)`, on the line immediately after the declaration.

Sets the run's budgets. Both options are optional.

| Option | What it sets | Default |
|---|---|---|
| `loops` | The number of loop iterations allowed per bar, summed over every loop that runs on that bar | 2,000,000 |
| `history` | How many bars of each series the engine keeps for `[]` to read | Every bar of the data |

`limits` appears at most once and must sit directly under `study(...)` or `strategy(...)`; anywhere else is `OS3014`. Its values must be literal numbers, not inputs or expressions (`OS3015`). A host that will not run a budget you ask for says so with `OS5003` rather than quietly lowering it. It does not change the ceiling of 1,000,000 elements per array.

Raise `loops` only for a script whose loops genuinely run past two million iterations on one bar. Set `history` to keep memory bounded over a long run when you know how far back the script reads; reading further back than you kept is `OS4002`.

```openscript
version 1
study("Deep lookback")
limits(history = 500)

hits = 0
for i = 1 to 200
    if close[i] > close
        hits += 1
plot(hits, "Of the last 200 bars, closes above this one")
```

Neither `version` nor `limits` is reserved, and the compiler accepts either as an ordinary variable name further down a file. Pick another name anyway: a reader expects both words to mean the lines described here.

Related: [Operators](/script/reference/operators), [Types](/script/reference/types), [Declarations](/script/reference/declarations), [Script structure](/script/language/script-structure), [Control flow](/script/language/control-flow), [Functions](/script/language/functions).
