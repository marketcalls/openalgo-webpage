---
title: Alerts and logging
description: alert, signal, print and the planned notify, the four calls a script uses to report what it saw, with when each one fires, what it carries and the rules the compiler enforces.
---

A study computes on every bar, but most of what it finds is only worth something if it reaches a person: a crossover on a five minute SBIN chart, a break of the opening range on a NIFTY future, a value you are debugging. OpenScript (also called OpenAlgo Script) has four calls for that. [[alert()]] sends a message when a condition holds, [[signal()]] puts a marker on the bar, [[print()]] writes a line to the script's log, and [[notify()]], which is planned, will send a message to a named channel. This page is the reference for all four.

```openscript title="Marked, alerted and logged"
version 1
study("EMA cross, marked and alerted", overlay = true, precision = 2)

fast = ema(close, 9)
slow = ema(close, 21)

plot(fast, "Fast", aqua, width = 2)
plot(slow, "Slow", orange, width = 2)

if crossUp(fast, slow)
    signal("BUY", color = lime, at = "below", shape = "triangleUp")
    alert(chart.symbol + " fast EMA crossed above slow at " + text(close, 2), id = "cross-up", title = "EMA cross up")
    print("cross up, close " + text(close, 2))

if crossDown(fast, slow)
    signal("SELL", color = red, at = "above", shape = "triangleDown")
    alert(chart.symbol + " fast EMA crossed below slow at " + text(close, 2), id = "cross-down", title = "EMA cross down")
    print("cross down, close " + text(close, 2))
```

{{screen: alert-toast}}

## Four calls compared

| | [[signal()]] | [[alert()]] | [[print()]] | [[notify()]] |
|---|---|---|---|---|
| Produces | A marker on the bar | A message about the bar | A line in the script's log | A message to a named channel |
| On the /trading page | Drawn on the chart | A notification on the page, and a row in the Log tab of the Alerts panel, when it fires; while the market is open it may not fire, as [Alerts](#alerts) explains | Not shown in this release | Planned |
| On the history already loaded | Drawn on every past bar that matched | Fires for none of them | Written for every bar that ran it | Planned |
| On a bar still forming | Waits for the close | Waits for the close | Waits for the close | Planned |

All four return nothing. The three available today may appear anywhere: at the top level, inside an `if` or a loop, or inside a function. The condition is the `if` you write around the call; there is no separate call for declaring one.

## Waiting for the bar to close

On a moving chart the newest bar runs again on every update. By default a [[signal()]], an [[alert()]] and a [[print()]] on that bar are held back until the bar closes, and if the condition that produced them is no longer true by then, they never happen at all. A price that pokes through a level for ten seconds and falls back has not broken it, and an alert that said it had would be noise.

A study opts out by setting `onUnconfirmed = true` in its [declaration](/script/reference/declarations). The calls then run on every update of the forming bar, the script guards whatever should still wait with [[bar.isConfirmed]], and the compiler warns with `OS8002` about every [[req.timeframe()]] and [[req.symbol()]] read in the file, because that pair is where repainting comes from. [Realtime and confirmation](/script/language/realtime-and-confirmation) covers the whole rule.

```openscript
version 1
study("Fast alerts", overlay = true, onUnconfirmed = true)

prevHigh = highest(high, 20)[1]

// Fires on every update of a forming bar that trades above the level.
if high > prevHigh
    alert("Traded above the 20 bar high", id = "above-high", frequency = "everyUpdate")

// The marker still waits for the close, because the script says so.
if bar.isConfirmed and close > prevHigh
    signal("CLOSE ABOVE", at = "below", shape = "arrowUp")
```

## Alerts

{{entry: alert()}}

Declares a watched condition and the message it sends. The condition is the chain of `if` guards that reaches the call, and the message is evaluated on the bar where they held, so every value in it is that bar's value. The host, the application running the study such as the /trading page, watches it as bars arrive and raises the alert on each new bar where the guards hold; the script polls nothing.

On the /trading page an alert is watched as soon as its study is on the chart, and each firing shows as a notification and is recorded in the Log tab of the Alerts panel. In this release, though, the chart judges a script's alerts once, when a bar first arrives. During market hours a bar arrives with its first tick, before it has closed, so an alert that waits for the close (every alert, unless the study sets `onUnconfirmed = true`) has nothing to report yet, and the chart does not look at that bar again. Such an alert fires only for a bar that reaches the chart already closed. To be told reliably, plot the condition as 1 or 0 and create a study alert on that plot from the chart's **Create alert** dialog, with **Study plot** as the source, as [Alerts on a script condition](/script/alerts/alerts-in-trading#alerts-on-a-script-condition) shows.

```openscript
version 1
study("RSI extremes", precision = 2, range = [0, 100])

len = input(14, "RSI length", min = 2, max = 200)
hi  = input(70, "Overbought", min = 50, max = 100)

r = rsi(close, len)

level(hi, "Overbought", fade(red, 40))
plot(r, "RSI", purple, width = 2)

// The change, not the state: fires on the bar RSI drops back below the line.
if crossDown(r, hi)
    alert(chart.symbol + " " + chart.interval + ": RSI left overbought at " + text(r, 1) + ", close " + text(close, 2) + ", " + date.format(time, "yyyy-MM-dd HH:mm"), id = "rsi-left-high", title = "RSI left overbought")
```

**The message.** `message` is a string built on the bar. `+` joins two strings and nothing else, so a number goes in through [[text()]]; `"RSI " + r` is error `OS2003`. A value that is `none` makes the whole joined string `none`, while `text(none)` is the string `"none"`, so build a message that cannot come out absent, with [[text()]] or [[orElse()]] around the parts that may be missing. On the /trading chart an alert whose message comes out absent shows its `title` instead. [[date.format()]] writes the bar's time in the chart's timezone, so it matches the time on the axis.

**The id.** `id` is the alert's permanent name. A host keys everything about the alert by it, such as a user's subscription or the record of when it fired. Write it as a short literal, such as `"cross-up"`, and keep it when you edit the script: renaming it makes a different alert. With no `id`, or an `id` taken from an [[input()]], the compiler derives a name from the call's position and warns with `OS8008`, because inserting a line above the call would change that name. Two alerts in a file with the same `id` are error `OS3017`. `title` is a heading for people, and you may change it freely. Like `id` and `frequency`, it is fixed before the first bar: write it at the call as a literal, because a title built from bar data, or held in a name, is error `OS3003`.

**Frequency.**

| `frequency` | Fires | Use it for |
|---|---|---|
| `"oncePerBar"` | At most once per bar. The default | Almost everything |
| `"once"` | The first time only, for the life of this study on the chart | A one-off note |
| `"everyUpdate"` | On every run of the forming bar. Requires `onUnconfirmed = true`, or error `OS3009` | Watching a level tick by tick, accepting the noise |

```openscript expect=OS3009
if close > open
    alert("Rising", id = "rising", frequency = "everyUpdate")
```

On the /trading chart in this release every alert fires at most once per bar, whatever its `frequency` says: the chart checks each condition once for each new bar and has nowhere to keep the setting. For one alert per session, hold a `var` flag and test it in the condition. The example finds each session's first bar with [[session.isFirstBar]] where the host states session hours, and with a new IST date where it does not, which includes the /trading chart:

```openscript
version 1
study("First bar break", overlay = true, precision = 2)

// On NSE a new IST date is a new session, so it stands in for
// session.isFirstBar where the host states no session hours.
newSession = orElse(session.isFirstBar, isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata"))

var rangeHigh = none
var alerted   = false

if newSession
    rangeHigh = high
    alerted   = false

// alerted is a var, so this fires at most once per session.
if not newSession and not alerted and close > rangeHigh
    alerted = true
    alert(chart.symbol + " closed above its first bar high at " + text(close, 2), id = "first-bar-break", title = "First bar break")
```

**Remarks.** Adding a study to a chart fires nothing for the bars already loaded: an alert is a statement about now. Nested guards join with `and`, so an `alert()` two `if`s deep has both conditions. A condition that is `none` takes the false branch, so an alert guarded by a comparison stays quiet during warmup; if an alert never fires, plot its condition as `cond ? 1 : 0` and look at the line. If the line shows the condition held and the /trading chart still sent nothing, that is the limit described under the entry above, and the same plotted line is what a study alert can watch. Test a change, with [[crossUp()]], [[crossDown()]] or a comparison with `[1]`, rather than a state, or the alert fires on every bar the state lasts. Routing, retries and where a message is delivered belong to the host; see [Alerts in /trading](/script/alerts/alerts-in-trading).

**See also.** [[signal()]], [[text()]], [[date.format()]], [Alerts from scripts](/script/alerts/overview)

{{entry: notify()}}

Will send a message to a channel the platform has already configured, named by `channel`, rather than as an alert. It is planned and not part of version 0.5.0; until it arrives, [[alert()]] is how a script sends a message.

## Markers

{{entry: signal()}}

Puts a named marker on this bar: a label, an arrow, a triangle or another shape, above the bar, below it or on the bar itself. It is how a study shows where a rule fired, and because markers are drawn on every past bar that matched, it is also how you judge the rule over the whole history.

```openscript
version 1
study("Pivot markers", overlay = true, precision = 2)

ph = pivotHigh(high, 5, 5)
pl = pivotLow(low, 5, 5)

// A text of none means no marker, so no if is needed. A pivot is known
// only 5 bars after it forms, so each marker sits on the bar that confirmed
// it, 5 bars right of the pivot itself.
signal(isNone(ph) ? none : "PH " + text(ph, 2), color = red, at = "above", shape = "arrowDown")
signal(isNone(pl) ? none : "PL " + text(pl, 2), color = lime, at = "below", shape = "arrowUp")
```

| `at` | The marker sits |
|---|---|
| `"above"` | Above the bar. The default |
| `"below"` | Below the bar |
| `"price"` | On the bar itself |

`shape` is one of `"label"` (the default), `"arrowUp"`, `"arrowDown"`, `"triangleUp"`, `"triangleDown"`, `"circle"`, `"square"`, `"diamond"`, `"cross"` and `"flag"`.

**Fixed and per-bar arguments.** Only `text` is read on each bar. `color`, `at` and `shape` are part of the marker's declaration and are fixed before the first bar, so each must be written at the call as a literal or an [[input()]]; a value that depends on bar data, such as `at = up ? "below" : "above"`, is error `OS3003`. Write two calls instead, one per side, and state `at` on every call: the side is never inferred from the marker's text.

**Remarks.** Each call site gives at most one marker per bar, so a loop that signals once per element marks the bar once, with the last text; one mark per element calls for [[draw.label()]]. Markers are rebuilt from the script on every run, so there is nothing to delete. Like [[alert()]], a signal on a forming bar waits for the close unless the study sets `onUnconfirmed = true`. On the /trading chart, `"above"` and `"below"` are measured from the candle, and the marker's text is drawn in its own `color`. Keep the text to a word or two; detail belongs in an alert message or a label's tooltip. To put a mark on the pivot bar itself rather than on the bar that confirmed it, draw it with [[draw.label()]] at `time[5]`. `text()` of a value still warming up is the string `"none"`, so guard it as the example does.

**See also.** [[alert()]], [[draw.label()]], [[crossUp()]], [Labels and shapes](/script/visuals/labels-and-shapes)

## The log

{{entry: print()}}

Writes one line to the script's log with the bar's time attached, and draws nothing. It takes a value of any type. Use it for a trace over a range of bars, or to record the first bar where a value goes wrong, when a plot or a table is not the right way to look.

```openscript
version 1
study("Trace a window", precision = 2)

fromBar = input(240, "Trace from bar", min = 0)
toBar   = input(260, "Trace to bar", min = 0)

basis = sma(close, 20)
dev   = stdev(close, 20)

plot(basis, "Basis", orange)

// A window of bars, not every bar: an unguarded print writes a line per bar.
if bar.index >= fromBar and bar.index <= toBar
    print("bar " + text(bar.index, 0) + " " + date.format(time, "yyyy-MM-dd HH:mm") + " close " + text(close, 2) + " basis " + text(basis) + " dev " + text(dev))
```

**Building the line.** To combine words and numbers, build one string. `+` joins strings only, so `"rsi " + r` is error `OS2003`:

```openscript expect=OS2003
r = rsi(close, 14)
print("rsi " + r)
```

`text(x)` with one argument accepts any value and writes an absent one as `none`, so a trace line is never lost to absence. `text(x, decimals)` fixes the decimals, but is itself `none` when `x` is, so use it for a number you know is present.

**Remarks.** Like [[signal()]] and [[alert()]], a `print` on a forming bar waits for the bar to close, so you get one line per bar rather than one per update; with `onUnconfirmed = true` every run of the forming bar writes a line, and `and bar.isConfirmed` on the guard brings it back to one. The host limits how fast the log may fill, and a host that drops lines says how many it dropped. The /trading page in this release does not display the script log: the Log tab of its Alerts panel lists alerts that fired, and the console under the script editor shows compiler diagnostics. There, show a value with a [[plot()]], a [[table()]] or a [[draw.label()]]; an application built on the [JavaScript library](/script/integrate/javascript) receives each printed line with the bar that wrote it.

**See also.** [[text()]], [[date.format()]], [[bar.index]], [Debugging](/script/writing/debugging)

## Related

[Alerts from scripts](/script/alerts/overview), [Alerts in /trading](/script/alerts/alerts-in-trading), [Realtime and confirmation](/script/language/realtime-and-confirmation), [Labels and shapes](/script/visuals/labels-and-shapes), [Debugging](/script/writing/debugging), [Strings](/script/reference/string), [Repainting](/script/data/repainting).
