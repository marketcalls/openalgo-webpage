---
title: Variables and scope
description: How a name is declared by its first assignment, updated by later ones, kept across bars with var, and seen only inside the scope it was declared in. The ban on shadowing, and the rules for names.
---

A variable in OpenScript is a name you assign a value to. There is no keyword to declare an ordinary name: the first assignment creates it, and every later assignment updates it. This page covers how a name is declared, when it is recomputed and when it survives into the next bar, which lines can see it (its scope), and why the language refuses to let two variables share a name. With these rules you can point at any name in a script and say where it was declared, what it holds and whether it carries forward.

## A complete example

```openscript
version 1
study("Spread", precision = 2)

lookback = input(20, "Average length", min = 2, max = 500)

spread = high - low  // declares spread
spread = spread / close * 100  // updates it, as a percentage of price

var widest = 0.0  // survives from bar to bar
if spread > widest
    widest = spread  // updates the file-scope widest

avgSpread = sma(spread, lookback)

plot(spread, "Spread, percent of price", aqua, width = 2)
plot(avgSpread, "Average spread", orange)
plot(widest, "Widest so far", gray, style = "step")
```

`spread` is declared and updated on every bar. `widest` is declared once with `var` and keeps its value between bars. The `if` block updates `widest` rather than creating a second one, because a name that already exists outside a block is updated from inside it.

## Declaring and updating

**The first assignment to a name in a scope declares it. Every later assignment updates it.**

Two rules follow immediately.

**A name's type is fixed by its first assignment.** Assigning a value of a different type later is error [OS2003](/script/errors/names-and-types#os2003), even when the two lines are pages apart. A name is one thing for the life of the script, so a reader can look at one line and know what it holds. A first assignment of `none` fixes no type, because `none` belongs to every type; the type then comes from the first assignment that gives a definite value.

```openscript expect=OS2003
len = 14
len = "fourteen"
```

**A name must be assigned above the line that reads it.** The file runs top to bottom on every bar, so reading a name before its assignment is error [OS2001](/script/errors/names-and-types#os2001), not an absent value. Function declarations are the one exception, covered [below](#order-of-declaration).

```openscript expect=OS2001
plot(slow, "Slow", orange)
slow = ema(close, 21)
```

## A plain assignment is recomputed on every bar

A name assigned without `var` is computed afresh on every bar. Its previous value is still readable through the history operator, as `name[1]`, but it is not the starting point for this bar's computation.

```openscript expect=OS2001
seen = seen + 1
```

`seen` does not exist yet on this bar when `seen + 1` is read, so that line is OS2001. Reading the previous bar instead compiles, and never produces a value:

```openscript
seen = 0
seen = seen[1] + 1  // absent on bar 0, and on every bar after it
plot(seen, "Never draws")
```

On bar 0 there is no previous bar, `seen[1]` is absent, and the sum is absent. Every later bar reads an absent predecessor, so one absent bar at the start poisons the whole run. That is what `var` fixes.

## var keeps a value across bars

`var name = initial` declares a name whose initial value is set once and which then keeps whatever it holds from one bar to the next.

```openscript
version 1
study("Running high", overlay = true, precision = 2)

// Set to none once, on bar 0, then kept from bar to bar.
var highestSeen = none
if isNone(highestSeen) or high > highestSeen
    highestSeen = high

plot(highestSeen, "Highest high so far", aqua, style = "step")
```

| Rule | Consequence |
|---|---|
| The initial value is set once, on the first bar the declaration is reached | A `var` inside an `if` that is false for the first hundred bars is set on bar 100 |
| `var` may appear at the top level, inside a block or inside a function | Persistence is available wherever a value is |
| A `var` inside a block is still scoped to that block | How long a value lives and where its name can be seen are separate questions |
| `var` rolls back on the forming bar | Running the newest bar ten times gives the same answer as running it once |
| The declaration needs an initial value | `var seen` alone is [OS1011](/script/errors/syntax#os1011). Write `var seen = none` for an empty start |

### Rollback, and why a running total is safe

While the market is open the newest bar is still forming, and the engine runs the script on it again on every update. Before each rerun, every `var` is restored to what it held at the end of the previous bar (this is called rollback). So a counter counts bars, not updates, and a chart shows the same numbers as a backtest over the same data.

```openscript
version 1
study("Bars, not updates")

var seen = 0
seen += 1

plot(seen, "Bars seen", aqua, width = 2)
```

`live var` is the same except that it does not roll back, so it keeps counting across the updates of the forming bar. It exists for one purpose, counting or accumulating within a bar, and it is spelled with an extra word because a script that uses one produces different numbers on a real-time chart than in a backtest. The compiler reports warning [OS8011](/script/errors/warnings#os8011) to make sure that is what you meant. [Persistence](/script/language/persistence) covers `var`, `live var` and rollback in full.

### History and persistence are different questions

| Written | Means |
|---|---|
| `close[1]` | History: what `close` was one bar ago |
| `var x = 0` | Persistence: `x` carries into the next bar |
| `x[1]` | Both: what the persistent `x` was one bar ago |

A useful consequence: at any line of the file, a `var` still holds the previous bar's value until the line that reassigns it. So a script can compare this bar's value with the last one by reading the `var` before it changes:

```openscript
version 1
study("Up-close streaks", precision = 0)

var streak = 0

// At this line streak still holds the count the previous bar left in it.
prevStreak = streak

streak = close > close[1] ? streak + 1 : 0

// A run of three or more up closes ended on this bar.
if prevStreak >= 3 and streak == 0
    signal("STREAK ENDED")

plot(streak, "Up closes in a row", aqua, style = "step")
```

## The three scopes

A scope is a region of the script in which a name can be seen.

| Scope | Holds | Created by |
|---|---|---|
| Global | The library: built-in series, functions and colour names | The language |
| File | Every name assigned at the top level, and every `fn` | The file |
| Block | Names first assigned inside it | Each `if` block, `else` block, `for` or `while` body, `case` or `default` arm, and function body |

Blocks nest, and a block can see everything its enclosing blocks and the file can see. A function's parameters belong to its body's scope.

## Declaration versus update

This is the whole of scoping in two sentences:

**A name is declared by its first assignment in a scope. An assignment to a name that already exists in an enclosing scope updates that name and does not create a new one.**

```openscript
version 1
study("Threshold")

volatile = atr(14) > sma(atr(14), 50)

threshold = 70  // declared in the file scope
if volatile
    threshold = 80  // updates the file-scope name

plot(threshold, "Threshold", aqua)  // 80 on volatile bars, 70 on the rest
```

```openscript expect=OS2001
volatile = atr(14) > sma(atr(14), 50)
if volatile
    scratch = high - low  // declared in the block scope
plot(scratch, "Scratch", aqua)  // OS2001: scratch is not visible here
```

Together those rules mean you never have to ask which of two variables a line writes to. There is exactly one `threshold`, and exactly one place `scratch` can be read.

## What a block can see and keep

A name first assigned inside a block is visible **from its assignment to the end of that block, including blocks nested inside it.** Nothing else.

| Where it is first assigned | Visible to |
|---|---|
| The top level of the file | Every line below it, including inside every block and every function |
| Inside an `if` block | The rest of that block and blocks nested in it. Not the `else`, not a sibling `if`, not anything after the block |
| Inside an `else` block | The rest of that block only |
| Inside a `for` or `while` body | The rest of that body, on that iteration. The next iteration starts fresh |
| Inside a `case` or `default` arm | The rest of that arm. No other arm, and nothing after the `switch` |
| Inside a function body | The rest of that body |

Three consequences catch everyone once:

- **A name declared in an `if` cannot be read in its `else`.** They are two blocks.
- **A name declared in a loop body does not accumulate.** It is a fresh name each time round. To carry a value between iterations, declare it above the loop.
- **A name declared in a block has no history.** History is kept only for names at the top level of the file, so `inner[1]` inside a block is [OS2004](/script/errors/names-and-types#os2004). Name the value at the top level instead.

```openscript
version 1
study("Mean candle body", precision = 2)

lookback = input(20, "Lookback", min = 2, max = 500)

// Declared above the loop: a name declared inside the body would be a fresh
// name on every iteration and would carry nothing between them.
total = 0.0
seen = 0

for i = 0 to lookback - 1
    body = abs(close[i] - open[i])  // a fresh name on each iteration
    if isNone(body)
        continue
    total += body
    seen += 1

plot(seen > 0 ? total / seen : none, "Mean body", aqua, width = 2)
```

## There is no shadowing

Shadowing means declaring a second variable with the same name as one in an enclosing scope, so that one name refers to two things. OpenScript does not allow it: **declaring a name in an inner scope when the same name already exists in an enclosing scope is error [OS2002](/script/errors/names-and-types#os2002).** The message gives the line of the outer declaration.

Inside an `if` or a loop a plain assignment cannot shadow, because an assignment to an outer name updates it; only a `var` that reuses an outer name can, and it is OS2002. Inside a function body it is easier to do by accident: a function may read names from the file scope, but an assignment inside the body always declares a name of the function's own. So assigning a file-scope name inside a function is a second declaration of that name, and is OS2002.

```openscript expect=OS2002
len = 20

fn smooth(src) =>
    len = 9
    sma(src, len)
```

The fix is to rename:

```openscript
len = 20

fn smooth(src) =>
    innerLen = 9
    sma(src, innerLen)

plot(smooth(close), "Smoothed", aqua)
plot(sma(close, len), "SMA", orange)
```

A function parameter follows the same rule: a parameter named after a file-scope name, or after a library name such as `close`, is OS2002.

Shadowing is banned because the most expensive bug in a per-bar script is a value that is right in one place and stale in another, and two variables sharing one name is the shortest path to it.

### Library names are taken

The library's names (built-in series, functions and colours) live in the global scope, so assigning to one is a shadowing attempt and is OS2002 as well.

```openscript expect=OS2002
close = 5
```

The names that bite most often are the short, obvious ones a script wants for its own values: `count`, `sum`, `avg`, `min`, `max`, `size`, `change`, `variance`, `stdev`, `level`, `fill`, `signal`, `time`, `open`, `high`, `low`, `close` and `volume`. If a name feels natural enough that the library probably took it, it probably did: `upCount`, `totalVolume` and `dayHigh` are free.

## Order of declaration

Within the file scope a name must be assigned before it is read, reading top to bottom, because the file is the body of the per-bar loop and runs in source order.

Functions are the exception. A function declaration is not a per-bar statement, and the compiler collects every one before it checks any body, so a `fn` may be called above its declaration:

```openscript
version 1
study("Helper below", overlay = true, precision = 2)

plot(helper(close), "Smoothed", aqua, width = 2)

fn helper(src) => sma(src, 9)
```

## Loop variables

The loop variable of a `for` belongs to the loop: it does not exist after the loop, and it may not be assigned in the body. Assigning it is [OS2006](/script/errors/names-and-types#os2006); to leave early, use `break`.

```openscript expect=OS2006
for i = 0 to 9
    if close[i] > high
        i = 9
```

The `for x in arr` form scopes `x` the same way, and assigning `x` in the body is OS2006 too.

## switch arms declare nothing that outlives them

Because a name first assigned inside an arm belongs to that arm, a name the arms of a `switch` set must be declared before the `switch`. This makes the "declared in one arm only" bug impossible to write, and it puts the default where a reader sees it first.

```openscript
version 1
study("Selectable length", overlay = true, precision = 2)

method = input("medium", "Speed", options = ["fast", "medium", "slow"])

// Declared here, so it exists whatever the switch does.
len = 21

switch method
    case "fast"
        len = 9
    case "slow"
        len = 50

plot(sma(close, len), "SMA", aqua, width = 2)
```

## Names inside a function

A function body is a block scope. Its parameters live there, and anything it assigns is its own. It can read file-scope names, and the ban on shadowing means it can never accidentally declare a second one.

A function body may use `var`, and may call library functions that keep state. **State belongs to the call site (the place in the source where the function is called), not to the function**, so two calls in two places are two independent pieces of state. [User functions](/script/language/functions) covers this in full.

```openscript
version 1
study("Bars since", precision = 0)

fn sinceTrue(cond) =>
    var n = none
    if cond
        n = 0
    else if not isNone(n)
        n = n + 1
    n

sinceUp = sinceTrue(close > open)  // its own counter
sinceHigh = sinceTrue(high > high[1])  // a separate counter

plot(sinceUp, "Bars since an up close", aqua)
plot(sinceHigh, "Bars since a higher high", orange)
```

## Patterns worth copying

### Declare above, refine inside

Give a name its "we do not know yet" value above the branch that refines it, so warmup is an explicit state rather than an accident:

```openscript
r = rsi(close, 14)

zone = "unknown"
if not isNone(r)
    zone = r > 70 ? "high" : (r < 30 ? "low" : "mid")

// Warmup bars stay "unknown", so they are never shaded as overbought.
background(zone == "high" ? fade(red, 85) : none)
```

### Reset at the start of each day

State that belongs to a trading day resets on the day's first bar. Test for it with the calendar, not with a bar count, because the number of bars in a day changes with the interval and with holidays and short sessions.

```openscript
version 1
study("Day extremes", overlay = true, precision = 2)

// The first bar of a new calendar day in the chart's time zone, or bar 0.
newDay = bar.isFirst or not date.isSameDay(time, time[1])

var dayHigh = none
var dayLow = none

if newDay
    dayHigh = high
    dayLow = low
else
    dayHigh = max(dayHigh, high)
    dayLow = min(dayLow, low)

plot(dayHigh, "Day high", aqua, width = 2, style = "step")
plot(dayLow, "Day low", orange, width = 2, style = "step")
```

Where the application running the script states the instrument's session hours, [[session.isFirstBar]] marks the first bar of each session instead; see [Sessions and time](/script/data/sessions-and-time).

### Store a time, not a bar index

[[bar.index]] is a position in the data the engine was given. Loading older history renumbers every bar, so an index stored in a `var` and compared later is compared against something that moved. Store [[time]], which does not move:

```openscript
version 1
study("Minutes since the last cross up", precision = 0)

fast = ema(close, 9)
slow = ema(close, 21)

var crossTime = none  // survives more history being loaded
if crossUp(fast, slow)
    crossTime = time

// Absent until the first cross, because time - none is none.
plot((time - crossTime) / 60000, "Minutes since the last cross up", aqua)
```

Subtracting two indices from the same run is still fine, because both come from the same numbering.

## Naming rules

Names are ASCII, start with a letter or an underscore, and are case sensitive. The convention, not enforced, is `camelCase` for names and functions and `UPPER_SNAKE` for values a script treats as constants.

The reserved words cannot be used as names: `and`, `array`, `as`, `bool`, `break`, `case`, `color`, `continue`, `default`, `else`, `false`, `fn`, `for`, `if`, `import`, `in`, `is`, `live`, `map`, `matrix`, `none`, `not`, `number`, `or`, `return`, `series`, `step`, `string`, `strategy`, `study`, `switch`, `to`, `true`, `type`, `var` and `while`. Using one is [OS1019](/script/errors/syntax#os1019). Some are reserved for later versions and do nothing today; reserving them now means adding them later cannot break a script that used one. [Keywords](/script/reference/keywords) describes each one.

## Errors and warnings you may meet

| Code | Means | Fix |
|---|---|---|
| [OS1011](/script/errors/syntax#os1011) | `var` with no initial value | `var name = none` is the empty start |
| [OS1019](/script/errors/syntax#os1019) | A reserved word used as a name | Rename it |
| [OS2001](/script/errors/names-and-types#os2001) | The name is not defined at this point | Assign it above this line, or fix the spelling |
| [OS2002](/script/errors/names-and-types#os2002) | The name already exists in an enclosing scope | Rename the inner one, or update the outer one from a block instead |
| [OS2003](/script/errors/names-and-types#os2003) | The name changed type | Use a second name |
| [OS2004](/script/errors/names-and-types#os2004) | The value has no history | Name it at the top level and read that name |
| [OS2005](/script/errors/names-and-types#os2005) | A function calls itself | Write a loop |
| [OS2006](/script/errors/names-and-types#os2006) | The loop variable was assigned in the body | Use `break`, or a separate name |
| [OS8010](/script/errors/warnings#os8010) | A name is assigned and never read | Use it, or delete the line |
| [OS8011](/script/errors/warnings#os8011) | A `live var` makes real-time and backtest differ | Use `var`, unless counting updates within a bar is the intent |

**Related.** [Execution model](/script/language/execution-model), [Persistence](/script/language/persistence), [Types and values](/script/language/types-and-values), [Control flow](/script/language/control-flow), [User functions](/script/language/functions), [Style guide](/script/writing/style-guide)
