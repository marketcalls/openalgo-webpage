---
title: Persistence
description: How var keeps a value from one bar to the next, when its initial value is set, how it differs from history, how it behaves on a forming bar, and when live var is the right choice.
---

Every line of a script runs again on every bar, so a plain name starts each bar with no value at all. When you want a running count, a running total, a trailing level or a list that grows over the run, you declare the name with `var`, and it keeps whatever it holds from one bar to the next. This page covers how `var` works, where its initial value is set, how it differs from reading the past with `[]`, what happens to it while the newest bar is still forming, and the one narrow case for `live var`.

## A first example

This study counts how many bars have closed higher than they opened, as a percentage of all bars so far. On a daily NSE chart it reads as the share of up days.

```openscript title="Up bar share"
version 1
study("Up bar share", precision = 1)

// Set once, on the first bar, then kept from bar to bar.
var total  = 0
var upBars = 0

// These run on every bar and start from what the previous bar left.
total += 1
if close > open
    upBars += 1

plot(upBars / total * 100, "Percent of bars that closed up", aqua)
```

On bar 0 the two `var` lines create the counters and set them to zero. On every later bar the `var` lines do nothing: the value already exists, so control moves past them. The assignments below them run on every bar, and each one starts from the value the previous bar left behind.

## Why a plain name forgets

A name assigned without `var` is computed fresh on every bar. At the moment its line runs, this bar's value does not exist yet, so a line that builds on itself cannot compile:

```openscript expect=OS2001
tally = tally + 1
plot(tally, "Tally")
```

The error is [OS2001](/script/errors/names-and-types#os2001): the name is not defined at that point in the file. Reading the previous bar's value through history does not rescue it either, because history and persistence are different things (see [Persistence is not history](#persistence-is-not-history)). A per-bar language needs a way to say "keep this one", and that is `var`.

## var

`var name = initial` declares a name whose initial value is set once and which then keeps whatever it holds from bar to bar. Compare the three kinds of name:

| | Plain name | `var` | `live var` |
|---|---|---|---|
| Assigned on every bar | Yes, by its own line | Only where the script assigns it | Only where the script assigns it |
| Value at the start of a bar | None until its line runs | What the previous bar left | What the previous execution left |
| Survives to the next bar | No | Yes | Yes |
| Restored before the forming bar runs again | Not applicable | Yes | No |
| Readable with `[]` at the top level | Yes | Yes | Yes |
| Same numbers on a realtime chart as in a backtest | Yes | Yes | No, by design |

The declaration and its initial value are one statement. `var` with no value is [OS1011](/script/errors/syntax#os1011), and the fix is to start it at `none`:

```openscript expect=OS1011
var tally
```

```openscript
var tally = none
tally = orElse(tally, 0) + 1
plot(tally, "Bars so far")
```

**A `var` may start from a setting.** `var tally = input(0, "Start")` begins a running total at a number the reader chooses in the settings dialog. The name is then a `var`, not the setting itself, so it can no longer be used inside a higher timeframe read: `req.timeframe("1D", sma(close, len))` works when `len = input(20, "Length")`, and is error [OS6003](/script/errors/data#os6003) when `len` is a `var`. Only put `var` on a setting you intend to change during the run.

## When the initial value is set

**The initial value is set once, on the first bar on which control reaches the declaration.** Most `var` lines sit at the top level, so for most scripts that is bar 0. A `var` inside a conditional block is different: it is absent until the first bar the block runs.

```openscript
// Reached for the first time on the first bar that closes above its prior
// 50 bar high, which may be bar 60 or bar 600.
breakout = close > highest(high, 50)[1]
if breakout
    var firstBreakout = close
    signal(close > firstBreakout ? "ABOVE FIRST BREAKOUT" : "BREAKOUT")
```

That is not a special case. It is what "reached for the first time" means, and it is sometimes exactly what you want: a value seeded from the first bar that meets a condition rather than from the first bar of the data. If you meant "from the first bar of the data", declare the `var` at the top level instead. Either way, a one-line comment saying which you meant saves the next reader a minute.

## var inside a function

A `var` may appear at the top level, inside a block or inside a function. Inside a function it gives each call its own memory, which is what makes a stateful helper reusable:

```openscript title="Run length"
version 1
study("Run length", precision = 0)

// How many bars in a row the condition has held.
fn runLength(cond) =>
    var n = 0
    n = cond ? n + 1 : 0
    n

upRun   = runLength(close > open)   // its own counter
downRun = runLength(close < open)   // a separate counter

plot(upRun, "Up run", lime)
plot(downRun, "Down run", red)
```

State is allocated per call site, not per function, so these two calls never see each other's `n`. [User functions](/script/language/functions) explains the rule and the one mistake it causes.

## Lifetime and scope

`var` decides how long a value lives. The block it sits in decides where the name can be seen. The two are independent:

```openscript expect=OS2001
breakout = close > highest(high, 20)[1]

if breakout
    var highWater = high        // kept across bars, but visible only in this block
    highWater = max(highWater, high)

plot(highWater, "High water", aqua)
```

The value above really does survive from bar to bar; the name just cannot be read outside the block that declared it. To plot it, declare it at the top level and assign it inside the block:

```openscript
breakout = close > highest(high, 20)[1]

var highWater = none

if breakout
    highWater = isNone(highWater) ? high : max(highWater, high)

plot(highWater, "High water", aqua)
```

An assignment inside a block to a name that already exists outside it updates that name. There is never a second variable with the same name, so a `var` line inside the block that reuses an outer name is error [OS2002](/script/errors/names-and-types#os2002), and the message gives the line of the first declaration. Drop the word `var` and the line becomes an ordinary assignment to the outer name.

```openscript expect=OS2002
stopLevel = close
if close > open
    var stopLevel = high
plot(stopLevel, "Stop level")
```

[Variables and scope](/script/language/variables-and-scope) covers scope in full.

## Reading a var before you change it

The file runs top to bottom, so a `var` read **above** the line that changes it still holds the previous bar's value. This is how a trailing level compares against itself without a single `[1]`:

```openscript title="Trailing low"
version 1
study("Trailing low", overlay = true, precision = 2)

var trail = none

// At this line, trail still holds what the previous bar left in it.
prevTrail = trail

// Seed on the first bar, then only ever ratchet upward.
trail = isNone(prevTrail) ? low : max(prevTrail, low)

// Compare with the level as it stood before this bar moved it. Comparing
// with the new level would let every bar trigger itself.
if not isNone(prevTrail) and close < prevTrail
    signal("BROKEN")

plot(trail, "Trail", lime, width = 2)
```

Move the `prevTrail` line below the assignment and the script means something else. Both orders are legal and both are useful somewhere, so the compiler cannot warn you. When the order matters, say so in a comment.

## Persistence is not history

These two are often confused, and they answer different questions:

```openscript
var runs = 0
runs += 1

prevClose = close[1]    // history: what close was one bar ago
prevRuns  = runs[1]     // both: what the persistent runs was one bar ago

plot(prevClose, "Previous close")
plot(prevRuns, "Previous count")
```

| Question | History | Persistence |
|---|---|---|
| Written as | `x[n]` or `history(x, n)` | `var x = ...` |
| Gives you | The value on an earlier bar | The value this bar starts with |
| Absent at the start | Yes, for reads past the first bar | Only if the initial value is `none` |
| Costs | One stored value per bar | One value for the whole run |

A plain name has history and no persistence, which is why building a counter from its own history never gets off the ground:

```openscript
tally = 0
tally = tally[1] + 1    // compiles, and is absent on every bar
plot(tally, "Tally")
```

On bar 0, `tally[1]` is absent because there is no bar before it, so the sum is absent. On bar 1, `tally[1]` reads bar 0's final value, which was absent, and so on forever. The plot is empty. A top-level `var` has both history and persistence, and `var tally = 0` with `tally += 1` counts correctly.

## A var holding an array

An array is held by reference. A `var` holding one keeps the same array for the whole run, with everything the script has pushed into it:

```openscript title="Rolling window"
version 1
study("Rolling window", precision = 2)

len = input(100, "Window", min = 2, max = 5000)

// Created once. One close is appended per bar and the oldest dropped.
var closes: array<number> = []

push(closes, close)
if size(closes) > len
    shift(closes)

plot(avg(closes), "Rolling mean", aqua)
plot(stdev(closes), "Rolling deviation", orange)
```

Two cautions come with references. Assigning one array name to another gives two names for one array, so use [[copy()]] when you want an independent one. And `[]` on an array is element access, not history, so `closes[0]` is the oldest element in the window, not last bar's array. [Collections](/script/language/collections) covers arrays in full.

## The forming bar and the rollback rule

On a chart receiving real-time updates, the newest bar is executed again on every update: its `close` is the latest traded price, its `high` can still rise and its `volume` is still growing. If a `var` simply carried on from one execution to the next, a counter would count ticks instead of bars. The engine prevents that:

:::key The rollback rule
Before each re-execution of the forming bar, the engine restores every persistent value to what it held at the end of the **previous** bar.
:::

Persistent values means `var` names, the contents of arrays they hold, the state of stateful calls such as [[ema()]], and the drawing objects the script created. Executing the forming bar ten times leaves the same state as executing it once.

```openscript title="Counts bars, not ticks"
version 1
study("Bar counter", precision = 0)

var barTotal = 0
barTotal += 1

plot(barTotal, "Bars")
```

Say bars 0 to 40 have finished, so bar 40 ended with `barTotal` at 41. Here is the new bar 41 receiving three updates, the last of which closes it:

| Execution of bar 41 | `bar.updates` | `barTotal` restored to | `barTotal` after the line | Chart shows |
|---|---|---|---|---|
| First update | 1 | 41 | 42 | 42 |
| Second update | 2 | 41 | 42 | 42 |
| Third update, the bar closes | 3 | 41 | 42 | 42, and final |

Without the rule, the counter would climb once per tick and the same script would give different numbers on a realtime chart than in a backtest of the same bars. With it, a backtest is a faithful record of what the script would have done.

So on the forming bar there are two kinds of value:

- **A value that moves during the bar and settles at the close.** Anything computed from this bar's `close`, `high`, `low` or `volume`. It is recomputed from scratch on each update, so nothing accumulates, and its last value is the one the bar keeps.
- **A value that changes only once per bar.** Anything computed from `close[1]` and older, and any `var` assigned only under a condition that cannot flicker. These are already final while the bar is still forming.

Prefer the second kind wherever a decision is involved; [Realtime and confirmation](/script/language/realtime-and-confirmation) explains how.

## live var

`live var` is identical to `var` except that it is **not** rolled back, so it keeps its value across the updates of the forming bar.

```openscript title="Update counter"
version 1
study("Updates", precision = 0)

live var runs = 0
runs += 1

plot(runs, "Executions since the study loaded")
```

On history each bar runs once, so `runs` climbs by one per bar exactly as a `var` would. On the forming bar it also climbs by one on every update, because nothing restores it. That difference is the whole of `live var`.

It exists for one purpose: counting or accumulating over the updates within a bar, such as an activity figure in a dashboard. It is spelled with an extra word because a script that uses it gives different numbers on a realtime chart than in a backtest, and the compiler reports warning [OS8011](/script/errors/warnings#os8011) on every `live var` so the difference is never a surprise.

Never use it to hold a trading decision. A stop that was set on a tick that has since been rolled back is a stop nobody can reproduce. If you only want to know how many times this bar has run, you do not need a counter at all: [[bar.updates]] is built in and starts again at 1 on each new bar.

## Four bugs to recognise

### The absent seed that never recovers

This is the most common persistence bug:

```openscript
var highWater = none

// Wrong: on the first bar highWater is absent, so the comparison is absent,
// so the branch is not taken, so highWater stays absent forever.
if high > highWater
    highWater = high

plot(highWater, "High water")
```

A comparison with an absent side is absent, and an absent condition takes the false branch. The value is never seeded, and the plot is empty. Either fix is one line:

```openscript
var highWater = none

// Ask the question an absent value can answer.
if isNone(highWater) or high > highWater
    highWater = high

plot(highWater, "High water")
```

```openscript
var highWater = none

// Or give the comparison something to work with.
highWater = max(orElse(highWater, high), high)

plot(highWater, "High water")
```

### The counter that counts the wrong thing

```openscript
live var barsInTrade = 0
if pos.size != 0
    barsInTrade += 1
plot(barsInTrade, "Bars in trade")
```

On history this counts bars. On a realtime chart it counts updates, because `live var` is not rolled back, so a position held through two hundred ticks reports two hundred bars, and the backtest and the realtime run disagree about the same trade. Drop the word `live`:

```openscript
var barsInTrade = 0
barsInTrade = pos.size != 0 ? barsInTrade + 1 : 0
plot(barsInTrade, "Bars in trade")
```

The rule of thumb: **`var`, unless counting updates is the measurement.**

### The warmup branch that silently changes an answer

```openscript expect=OS8001
var regime = "unknown"

// During warmup rsi is absent, the comparison is absent, and neither branch
// runs. regime keeps its starting value and the study reports "unknown" as
// though it were a reading. The second rsi call only runs on some bars.
if rsi(close, 14) > 50
    regime = "up"
else if rsi(close, 14) < 50
    regime = "down"

plot(regime == "up" ? 1 : 0, "Up regime")
```

Two things are wrong here. The stateful call appears twice, which is two call sites and two independent pieces of state, and the second one only runs on the bars where the first test fails; the compiler reports that with warning [OS8001](/script/errors/warnings#os8001). And the absent case during warmup is not handled at all. Compute once at the top level, and make the absent case explicit:

```openscript
r = rsi(close, 14)              // one call site, computed every bar

var regime = "unknown"
if not isNone(r)
    regime = r > 50 ? "up" : "down"

plot(regime == "up" ? 1 : 0, "Up regime")
```

Now a reader can see that "unknown" means warmup. The error list also includes warning [OS8004](/script/errors/warnings#os8004) for a branch on a possibly absent condition that sets a value used later, but the compiler does not raise it in this release, so the explicit test is yours to write.

### The late initial value

```openscript
if bar.index > 100
    var anchor = close       // set on bar 101, not bar 0
    signal(close > anchor ? "ABOVE ANCHOR" : "BELOW ANCHOR")
```

This is correct behaviour that surprises people: a `var` inside a conditional block is absent until the first bar on which control reaches it. Declare it at the top level if you meant the first bar of the data.

## A worked example: a session accumulator

Everything on this page in one script: values that reset each session, accumulate across bars, survive the forming bar without double counting, and handle their own absence. It computes a session volume weighted average price from the 09:15 open of each NSE session.

```openscript title="Session VWAP by hand"
version 1
study("Session volume weighted price", overlay = true, precision = 2)

src = input(hlc3, "Source")

// The session's first bar where the host states session hours, and the first
// bar of each IST day where it does not.
newSession = orElse(session.isFirstBar, isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata"))

// Three running totals rather than an array of every bar in the session.
// The rollback rule restores all three before the forming bar runs again,
// so they count bars, not ticks, and a realtime chart agrees with a backtest.
var priceVolume = 0.0
var totalVolume = 0.0
var sessionBars = 0

// The reset is an assignment, not a second var line: a var line sets its
// value once for the whole run, and this has to happen every session.
if newSession
    priceVolume = 0.0
    totalVolume = 0.0
    sessionBars = 0

priceVolume += src * volume
totalVolume += volume
sessionBars += 1

// Absent means "not ready", rather than a zero that would look like a price.
ready = totalVolume > 0
value = ready ? priceVolume / totalVolume : none

plot(value, "Session VWAP", orange, width = 2)
plot(sessionBars, "Bars this session", fade(silver, 40), scale = "left")
```

Three details here are persistence decisions rather than style:

- The reset happens inside `if newSession`, on the first bar of each session, rather than by a second `var` line. `newSession` is [[session.isFirstBar]] where the host states the instrument's session hours, as /trading does; on a host that states none, a new IST date marks the same bar for an NSE session.
- The readiness test is `totalVolume > 0`, not `sessionBars > 0`. An index has no traded volume, so its bars carry a volume of zero or no volume at all, depending on the data. With zero the total stays at zero and the test is false; with no volume the total is absent, the test is absent and takes the false branch. Either way the study draws nothing rather than dividing by zero.
- Nothing needs `live var`. Every number settles when its bar closes, which is the only way the line on the chart today can be the line that was on it at the time.

The library already has this calculation as [[vwap()]], which restarts every session. It needs the session hours too, which /trading states, and on a host that states none [[vwapAnchor()]] with the same `newSession` as its anchor gives the same line. Writing it by hand is how you learn the pattern for the accumulators the library does not have.

**Related.** [Execution model](/script/language/execution-model), [Bars and history](/script/language/bars-and-history), [Warmup](/script/language/warmup), [Realtime and confirmation](/script/language/realtime-and-confirmation), [Variables and scope](/script/language/variables-and-scope), [User functions](/script/language/functions), [Collections](/script/language/collections)
