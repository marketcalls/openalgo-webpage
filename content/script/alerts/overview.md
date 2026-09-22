---
title: Alerts from scripts
description: Raise an alert from an OpenScript study with alert(), mark the bar with signal(), and see what the planned notify() adds. What each call takes, when it fires and how to build a message worth reading.
---

An alert is how a script tells you about a condition while you are looking somewhere else: a crossover on a five-minute SBIN chart, a break of the opening range on NIFTY futures, an RSI turning back from an extreme. This page covers the three calls OpenScript (also called OpenAlgo Script) gives you for it, [[alert()]], [[signal()]] and the planned [[notify()]]: what each one takes, exactly when it fires, how to build a message that carries the numbers you need, and how the three differ.

What happens after an alert fires depends on where the script runs. For the /trading page, including what works there in this release, read [Alerts in /trading](/script/alerts/alerts-in-trading).

## A first alert

A complete study that draws two moving averages and raises an alert on each crossover:

```openscript title="EMA cross alerts"
version 1

study("EMA cross alerts", overlay = true, precision = 2)

fastLen = input(9,  "Fast length", min = 1, max = 500)
slowLen = input(21, "Slow length", min = 1, max = 500)

fast = ema(close, fastLen)
slow = ema(close, slowLen)

plot(fast, "Fast EMA", aqua,   width = 2)
plot(slow, "Slow EMA", orange, width = 2)

if crossUp(fast, slow)
    alert(chart.symbol + ": fast EMA crossed above slow at " + text(close, 2),
          id = "cross-up", title = "EMA cross up")

if crossDown(fast, slow)
    alert(chart.symbol + ": fast EMA crossed below slow at " + text(close, 2),
          id = "cross-down", title = "EMA cross down")
```

Three things are worth seeing before any detail:

- **The condition is an ordinary `if`.** There is no separate function for declaring a condition. The `if` you would have written anyway is the condition the alert watches.
- **The message is computed on the bar that fired.** `text(close, 2)` is that bar's close, so the alert says "crossed above slow at 812.45" rather than only "crossed".
- **Each alert has an `id` and a `title`.** The `id` is the alert's permanent name; the title is the heading a person reads. Both are explained below.

By the rules of the language, this study raises one alert on the bar where a crossing is confirmed (the bar has closed), and nothing for the crossings already in the chart's history.

:::warn On the /trading chart in this release
The /trading chart checks each bar for a script's alerts once, when the bar first reaches the chart. During trading hours a bar arrives with its first tick, before it has closed, so an `alert()` waiting for the close (every alert, unless the file opts out) has nothing to report yet, and the chart does not look at that bar again. Such an alert can still fire for a bar that arrives late, after its time has passed, but you cannot rely on it. To be told about a script's condition on /trading today, plot the condition and put a study alert on that plot, as [Alerts on a script condition](/script/alerts/alerts-in-trading#alerts-on-a-script-condition) shows. A strategy deployed from the Strategies panel is not affected: it runs on the OpenAlgo server and writes its alerts to the run's log.
:::

## The three calls at a glance

| | [[alert()]] | [[signal()]] | [[notify()]] |
|---|---|---|---|
| What it does | Sends a message about this bar | Draws a marker on this bar | Sends a message to a named channel |
| Where it shows | Off the chart, wherever the platform delivers it | On the chart, on the bar | A channel the platform has configured |
| On the bars already in history | Fires for none of them | Draws on every past bar that matched | Not applicable |
| On a bar that is still forming | Waits for the bar to close, unless the file sets `onUnconfirmed = true` | The same as `alert()` | Not applicable |
| Status in version 0.5.0 | Available | Available | Planned, refused by the compiler with OS2020 |

A marker is a record of what the script saw, drawn back over the whole history so you can judge the rule by eye. An alert is a message about the bar in front of you. Most useful studies want both, and each costs one line.

## alert()

`alert(message, id = "", title = "", frequency = "oncePerBar")` returns nothing.

| Argument | Type | Default | What it is |
|---|---|---|---|
| `message` | `string` | required | The text the fired alert carries, worked out on the bar that fired |
| `id` | `string` | `""` | The alert's stable name. Always give one |
| `title` | `string` | `""` | A short heading shown above, or in place of, the message |
| `frequency` | `string` | `"oncePerBar"` | How often the same alert may fire: `"oncePerBar"`, `"once"` or `"everyUpdate"` |

`id`, `title` and `frequency` are fixed before the first bar runs; only `message` is read on every bar. `title` and `frequency` may each be a literal or an [[input()]]. Write `id` as a plain string literal such as `"cross-up"`: an `id` from an `input()`, or one joined with `+`, does not count as a fixed name (see [The id is a promise](#the-id-is-a-promise)). A title built from bar data is refused:

```openscript expect=OS3003
alert("Crossed", id = "cross", title = "Crossed at " + text(close, 2))
```

An `alert()` call may stand anywhere a statement may: at the top level, inside an `if` or a `for`, or inside the body of a function you define with `fn`. At the top level with no guard it fires on every confirmed bar, which is occasionally what you want and usually is not.

### The condition is the if around it

The compiler turns each `alert()` call into one **watched condition**: a named entry the platform checks as new bars arrive. The condition's test, called its **predicate**, is the chain of `if` guards that leads to the call. Nesting works exactly as reading the file suggests: an alert two branches deep has both guards in its predicate, joined by `and`.

```openscript
hh = highest(high, 20)[1]

if session.isIn("0915-1530")
    if close > hh
        alert("Twenty bar breakout", id = "breakout")
```

The predicate of that alert is "the bar is inside 09:15 to 15:30, and the close is above the previous twenty-bar high". Because it is built from the source, it can never describe a condition the script does not actually test.

:::tip
Compute running values such as [[highest()]] at the top level and only test them inside the `if`. A stateful call written inside a branch advances only on the bars where that branch runs, and the compiler warns about it with OS8001.
:::

## Building the message

A message is an ordinary `string` expression, evaluated on the bar the predicate accepted, so every value in it is that bar's value. There is no placeholder syntax in the language: you build the text with `+` and [[text()]]. Three rules decide what you can put in it.

**There is no automatic conversion between numbers and strings.** Adding a number to a string is an error, not a sentence:

```openscript expect=OS2003
alert("Close " + close, id = "close-note")
```

Numbers reach a message through [[text()]], which has two forms:

- `text(x, 2)` writes `x` with exactly two decimals, rounding halves away from zero. This is the form for a price.
- `text(x)` writes the value with every digit it carries, so a price can come out as `101.24199999999999`. Keep it for whole numbers, and for values you do not want rounded.

**Absence spreads through `+`.** An absent value (`none`, see [Absent values](/script/language/absent-values)) makes the whole expression absent, because `"a" + none` is `none`. The two forms of [[text()]] treat an absent value differently, and so do the usual fixes:

| Written | When `r` is 63.28 | When `r` is absent |
|---|---|---|
| `text(r)` | `63.28` | `none`, the four letters |
| `text(r, 1)` | `63.3` | Absent, so the whole message is absent |
| `isNone(r) ? "not ready" : text(r, 1)` | `63.3` | `not ready` |
| `text(orElse(r, 0), 1)` | `63.3` | `0.0` |

Most of the time the `if` takes care of this: an alert whose condition tests `r` only fires on bars where `r` has a value. It matters for the parts of the message the condition does not test, which are often the values that are absent during [warmup](/script/language/warmup), after a gap, or on an index with no volume:

```openscript
r  = rsi(close, 14)
rv = relativeVolume(20)

// crossUp needs r, so r has a value whenever this fires.
// rv is not part of the condition, so say what to write when it is absent.
if crossUp(r, 50)
    alert("RSI crossed 50 at " + text(r, 1) + ", relative volume "
          + (isNone(rv) ? "not available" : text(rv, 2)),
          id = "rsi-50", title = "RSI crossed 50")
```

Where a script's message does come out absent, the /trading chart shows the alert's `title` in its place. That is one more reason to give every alert a title.

**Pick the ingredients from what the bar knows.** Everything here is a fact any script can read, where the host states it:

| Want in the message | Write |
|---|---|
| The instrument | `chart.symbol`, and `orElse(chart.exchange, "")`: the /trading chart does not state the exchange, and an absent part would make the whole message absent |
| The chart's interval | `chart.interval` |
| The bar's price | `text(close, 2)` |
| A computed value | `text(atr(14), 2)` |
| The bar's time, in the chart's time zone | `date.format(time, "yyyy-MM-dd HH:mm")` |
| Which side fired | a conditional: `up ? "Long" : "Short"` |
| The open position, in a strategy | `text(pos.size)`, `text(pos.avgPrice, 2)` |

A message that carries enough to act on without opening the chart:

```openscript title="RSI extremes"
version 1

study("RSI extremes", precision = 2, range = [0, 100])

len = input(14, "RSI length", min = 2, max = 200)
hi  = input(70, "Overbought", min = 50, max = 100)
lo  = input(30, "Oversold",   min = 0,  max = 50)

r = rsi(close, len)

level(hi, "Overbought", red)
level(lo, "Oversold",   lime)
plot(r, "RSI", purple, width = 2)

// Test the change, not the state: the bar RSI leaves a zone.
leftHigh = not isNone(r) and r < hi and orElse(r[1], 0) >= hi
leftLow  = not isNone(r) and r > lo and orElse(r[1], 100) <= lo

if leftHigh
    alert(chart.symbol + " " + chart.interval + ": RSI left overbought at "
          + text(r, 1) + ", price " + text(close, 2)
          + ", " + date.format(time, "yyyy-MM-dd HH:mm"),
          id = "rsi-left-high", title = "RSI left overbought")

if leftLow
    alert(chart.symbol + " " + chart.interval + ": RSI left oversold at "
          + text(r, 1) + ", price " + text(close, 2)
          + ", " + date.format(time, "yyyy-MM-dd HH:mm"),
          id = "rsi-left-low", title = "RSI left oversold")
```

[[date.format()]] reads the timestamp in the chart's time zone, so the time in the message agrees with the time under the bar on the chart's axis.

When both directions share one alert, a conditional picks the word:

```openscript
up   = crossUp(ema(close, 9), ema(close, 21))
down = crossDown(ema(close, 9), ema(close, 21))

if up or down
    alert((up ? "Long" : "Short") + " signal on " + chart.symbol + " at " + text(close, 2),
          id = "ema-flip", title = "EMA flip")
```

## When an alert fires

An alert obeys the rule every signal and order obeys: **it does not fire on a bar that is still forming.** A call made on a forming bar is held until the bar is confirmed (closed), and if the condition that produced it is no longer true at the close, it never fires at all.

Take a 5-minute chart of NIFTY futures. At 10:31 the price pokes above the twenty-bar high; by the 10:35 close it has slipped back below. The condition was true for a few seconds and false when the bar finished, so no alert is sent. A level that is touched and rejected has not been broken, and an alert that said it had would be noise. The full story is on [Realtime and confirmation](/script/language/realtime-and-confirmation).

Two more facts about firing catch people out once:

- **Adding a study to a chart fires nothing for the history already on it.** An alert is a statement about now. A study added at noon that sent four hundred alerts for the morning would bury the one that mattered.
- **An absent condition counts as false.** An alert inside an `if` whose test is absent during [warmup](/script/language/warmup) does not fire. That is correct, and it is also the most common reason a new alert seems dead.

### frequency

`frequency` decides how often one alert may fire.

| Value | Means | Use it for |
|---|---|---|
| `"oncePerBar"` | At most one alert per bar. The default | Almost everything |
| `"once"` | The first time only, for the life of this study on the chart | A one-off level, a note at the session open |
| `"everyUpdate"` | On every run of the bar, tick by tick. Requires `onUnconfirmed = true` | Watching a level while the bar forms, accepting the noise |

`"everyUpdate"` without `onUnconfirmed = true` in the declaration is refused at compile time rather than quietly downgraded:

```openscript expect=OS3009
version 1

study("Every update")

if close > open
    alert("Rising", id = "rising", frequency = "everyUpdate")

plot(close, "Close")
```

A file opts in to acting on a forming bar by declaring `onUnconfirmed = true`. From then on the script is responsible for its own guards: add `and bar.isConfirmed` to any alert that should still wait for the close.

```openscript title="Fast breakout alerts"
version 1

study("Fast breakout alerts", overlay = true, onUnconfirmed = true)

upper = highest(high, 20)[1]
plot(upper, "Twenty bar high", aqua)

// The file now acts on a forming bar, so it guards itself:
// this fires once, on the bar's close.
if crossUp(close, upper) and bar.isConfirmed
    alert("Closed above the twenty bar high at " + text(close, 2), id = "breakout")

// This one watches the level tick by tick while the bar is still forming.
if close > upper
    alert("Trading above the twenty bar high at " + text(close, 2),
          id = "above-high", frequency = "everyUpdate")
```

Setting `onUnconfirmed` also makes the compiler warn (OS8002) about any higher timeframe read in the file, because a forming bar reading a coarser bar is where [repainting](/script/data/repainting) comes from.

:::note
**The /trading chart keeps no `frequency`.** It judges a script's alerts at most once per bar, so `"once"` and `"everyUpdate"` behave as `"oncePerBar"` there. When you want one alert per session or per day, hold a [`var`](/script/language/persistence) flag in the script and test it in the condition, as the opening range example below does.
:::

## The id is a promise

`id` is the stable name of a watched condition. The platform files each firing under it, and the name has to survive the edits you make to the script later. On /trading the `id` is also how repeats of the same alert are recognised: a desktop notification for an alert that fires again replaces the previous one instead of stacking a new one beside it.

With no `id`, the compiler names the alert after its line in the file, such as `alert@10`, and warns with OS8008. That derived name changes the moment a line is inserted above the call. An `id` taken from an [[input()]], or joined together with `+`, gets the same treatment and the same warning, because only a plain string literal is fixed before the first bar.

```openscript expect=OS8008
if crossUp(close, sma(close, 50))
    alert("Crossed the 50 bar average")
```

Two alerts in one file may not share an `id`:

```openscript expect=OS3017
if crossUp(close, sma(close, 50))
    alert("Crossed up", id = "cross")
if crossDown(close, sma(close, 50))
    alert("Crossed down", id = "cross")
```

Keep ids short, lowercase and hyphenated, and name the event rather than the number:

| id | Verdict |
|---|---|
| `"cross-up"` | Good. Short, stable, says what happened |
| `"rsi-left-high"` | Good. Still true when the thresholds change |
| `"rsi-below-30"` | Poor. Wrong the day the input is set to 25 |
| no id at all | Poor. Derived from the line, so an edit above it renames the alert |

`title` is not a substitute for `id`. The title is text for a person and you may change it at will; the id is a key, and renaming it makes it a different alert.

## signal(): a marker on the bar

`signal(text, color = none, at = "above", shape = "label")` draws a named marker on the current bar. It is the whole of shape drawing in OpenScript, and it is covered in depth on [Labels and shapes](/script/visuals/labels-and-shapes).

| Argument | What it takes |
|---|---|
| `text` | The marker's text, read per bar, so it can carry values: `"UP " + text(close, 2)` |
| `color` | A colour, or `none` for the chart's default |
| `at` | `"above"`, `"below"` or `"price"` |
| `shape` | `"label"`, `"arrowUp"`, `"arrowDown"`, `"triangleUp"`, `"triangleDown"`, `"circle"`, `"square"`, `"diamond"`, `"cross"` or `"flag"` |

```openscript
if crossUp(ema(close, 9), ema(close, 21))
    signal("BUY", color = lime, shape = "arrowUp", at = "below")
```

Like `alert()`, a signal waits for the bar to close unless the file sets `onUnconfirmed = true`. Unlike `alert()`, it draws on every bar of the history where its condition held, which is what lets you check a rule by scrolling back through a month of NSE bars. `color`, `at` and `shape` are fixed before the first bar, so each must be a literal or an `input()`; only the text changes from bar to bar.

## notify(): planned

`notify(message, channel)` is specified as a way for a script to send a message to a channel the platform has already configured, by name. It is **planned and not in version 0.5.0**, and the compiler refuses it with OS2020:

```openscript expect=OS2020
if crossUp(close, sma(close, 50))
    notify("Crossed the 50 bar average", "desk")
```

Until it arrives, the only delivery a script declares is an `alert()`. Where the message goes after that (a sound, a desktop notification, a messaging channel) is the platform's decision, made outside the script, so the same file compiles and runs everywhere. On /trading, see [How a firing reaches you](/script/alerts/alerts-in-trading#how-a-firing-reaches-you).

## Complete examples

### A breakout alert

A channel of the previous twenty bars' high and low, with an alert on the bar the close first leaves it. [[crossUp()]] and [[crossDown()]] test the change, so a strong run fires once at the break rather than on every bar above the line.

```openscript title="Channel breakout alerts"
version 1

study("Channel breakout alerts", overlay = true, precision = 2)

len = input(20, "Lookback, in bars", min = 2, max = 200)

upper = highest(high, len)[1]
lower = lowest(low, len)[1]

plot(upper, "Channel high", aqua,   width = 2, style = "step")
plot(lower, "Channel low",  orange, width = 2, style = "step")

if crossUp(close, upper)
    alert(chart.symbol + " closed above its " + text(len) + " bar high at "
          + text(close, 2), id = "channel-break-up", title = "Channel break up")

if crossDown(close, lower)
    alert(chart.symbol + " closed below its " + text(len) + " bar low at "
          + text(close, 2), id = "channel-break-down", title = "Channel break down")
```

### An alert and a marker, once per session

The high and low of the first minutes of each session, with one alert and one marker for the first break of either side. On an NSE chart the session opens at 09:15, so the default range is 09:15 to 09:30. The session's first bar is [[session.isFirstBar]] where the host states session hours; the /trading chart does not in this release, so the study falls back to the first bar of each IST day, which on NSE is the same bar.

```openscript title="Opening range break"
version 1

study("Opening range break", overlay = true, precision = 2)

rangeMinutes = input(15, "Opening range, in minutes", min = 1, max = 240)

// The session's first bar, or the first bar of each IST day where the host
// states no session hours.
newSession = orElse(session.isFirstBar, isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata"))

var openTime  = none
var rangeHigh = none
var rangeLow  = none
var broken    = false

if newSession
    openTime  = time
    rangeHigh = high
    rangeLow  = low
    broken    = false

elapsed = isNone(openTime) ? none : time - openTime
forming = not isNone(elapsed) and elapsed < rangeMinutes * 60000

if forming and not newSession
    rangeHigh = max(rangeHigh, high)
    rangeLow  = min(rangeLow, low)

// broken is a var, so this block runs at most once per session.
if not forming and not broken and not isNone(rangeHigh)
    if close > rangeHigh
        broken = true
        signal("BREAK UP", shape = "triangleUp", at = "below")
        alert(chart.symbol + " broke the opening range high at "
              + text(close, 2), id = "or-break-up", title = "Range break up")
    else if close < rangeLow
        broken = true
        signal("BREAK DOWN", shape = "triangleDown", at = "above")
        alert(chart.symbol + " broke the opening range low at "
              + text(close, 2), id = "or-break-down", title = "Range break down")

plot(rangeHigh, "Range high", aqua,   width = 2, style = "step")
plot(rangeLow,  "Range low",  orange, width = 2, style = "step")
```

The `broken` flag does the work `frequency` cannot: `"oncePerBar"` limits an alert to one per bar, and this study wants one per session. A `var` is how a script remembers "already handled". Because a `var` is rolled back before each re-run of a forming bar, the flag behaves the same on the chart as it does in a backtest.

### A multi-condition alert

Several conditions, each given a name, joined with `and` in one `if`. This one looks for a pullback in an uptrend: price above a rising 50-bar EMA, RSI turning up through 40, volume at least one and a half times its average, and the bar inside 09:30 to 15:00 so the noisy first and last minutes of the session are left out.

```openscript title="Trend pullback alerts"
version 1

study("Trend pullback alerts", overlay = true, precision = 2)

trendLen  = input(50,  "Trend EMA length", min = 5, max = 400)
dipLevel  = input(40,  "RSI dip level", min = 10, max = 60)
volFactor = input(1.5, "Volume above its average by", min = 1, max = 5)

trend = ema(close, trendLen)
r     = rsi(close, 14)
rv    = relativeVolume(20)

// Four conditions, each named, so the alert reads as a sentence.
upTrend  = close > trend and trend > trend[5]
bounced  = crossUp(r, dipLevel)
volumeOk = orElse(rv, 0) >= volFactor
inHours  = session.isIn("0930-1500")

plot(trend, "Trend EMA", orange, width = 2)

if upTrend and bounced and volumeOk and inHours
    signal("DIP", shape = "triangleUp", at = "below")
    alert(chart.symbol + " " + chart.interval + ": RSI bounced to " + text(r, 1)
          + " in an uptrend, close " + text(close, 2)
          + ", volume " + text(orElse(rv, 0), 1) + " times its average",
          id = "trend-dip", title = "Pullback in an uptrend")
```

Naming each condition keeps the `if` readable and makes each one easy to check on its own. When the alert does not fire and you want to know which part is false, copy that condition into a small study without `overlay = true`, which draws in a pane of its own, and plot it as `upTrend ? 1 : 0`. Only one of the four, `bounced`, is a change; the other three are states that filter it. An alert built only from states would fire on every bar they all hold.

### Alerts in a strategy

`alert()` works in a strategy file too, and the message can read the position:

```openscript title="EMA cross with alerts"
version 1

strategy("EMA cross with alerts", overlay = true, precision = 2)

fast = ema(close, 9)
slow = ema(close, 21)

if crossUp(fast, slow)
    buy(qty = 1)
    alert("Long entry signal at " + text(close, 2) + ", buying 1", id = "entry", title = "Entry")

if crossDown(fast, slow) and pos.isLong
    close()
    alert("Exit signal: closing the long entered at " + text(pos.avgPrice, 2), id = "exit", title = "Exit")

plot(fast, "Fast EMA", aqua)
plot(slow, "Slow EMA", orange)
```

The alert describes the order being sent, not a fill. By default a market order fills at the next bar's open, so on the bar that raises the exit alert the long is still open, and [[pos.avgPrice]] still reads the price it was entered at.

A strategy added to the /trading chart is drawn like a study, and the chart judges its alerts the same way it judges a study's (see the warning near the top of this page). A strategy deployed from the Strategies panel runs on the OpenAlgo server rather than on the chart. It sends nothing while it replays history at the start; after that, each alert it raises is written as a line in that run's log, such as `Alert exit: Exit Exit signal: closing the long entered at 812.45`, rather than being sent anywhere. See [Sandbox and live](/script/strategies/sandbox-and-live).

## What goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| A study's alert does not fire on the /trading chart | In this release the chart checks each bar only as it arrives, before a waiting alert can fire | Plot the condition and put a study alert on it: [Alerts on a script condition](/script/alerts/alerts-in-trading#alerts-on-a-script-condition) |
| Nothing fires, ever, anywhere | The condition is absent during warmup and false afterwards, or it is never true | Plot the condition as `cond ? 1 : 0` from a study of its own and look at the line |
| Fires on every bar of a trend | The condition tests a state, not a change | Test the change: [[crossUp()]], a comparison with `[1]`, or a `var` flag |
| Fired, and then the bar closed the other way | `onUnconfirmed = true` without a `bar.isConfirmed` guard | Remove `onUnconfirmed`, or add the guard |
| Nothing fired for the morning's crossings | The study was added after them. History fires nothing | Expected. Look at the markers from [[signal()]] to judge the past |
| The message shows only the title | Part of the message was absent on that bar, often a `text(x, 2)` of an absent `x` | Give that part a fallback with [[isNone()]] or [[orElse()]], or use one-argument `text(x)` |
| `"a" + 5` refused with OS2003 | No automatic conversion between string and number | `"a" + text(5)` |
| OS8008 warning | The alert has no fixed `id` | Write the id out as a plain string literal |
| OS3017 | Two alerts share an `id` | Rename one |
| `"everyUpdate"` refused with OS3009 | It needs `onUnconfirmed = true` in the declaration | Set it, or use `"oncePerBar"` |
| A `"once"` alert fires on more than one bar on the chart | The chart keeps no `frequency` | Hold a `var` flag and test it in the condition |

More cases are on [Troubleshooting](/script/writing/troubleshooting). For the codes quoted here, see [Names and types](/script/errors/names-and-types#os2003), [Arguments](/script/errors/arguments#os3009) and [Warnings](/script/errors/warnings#os8008).

**Related.** [Alerts in /trading](/script/alerts/alerts-in-trading), [Realtime and confirmation](/script/language/realtime-and-confirmation), [Labels and shapes](/script/visuals/labels-and-shapes), [Persistence](/script/language/persistence), [Repainting](/script/data/repainting), [Alerts and logging reference](/script/reference/alerts-and-logging)
