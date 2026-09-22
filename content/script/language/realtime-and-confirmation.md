---
title: Realtime and confirmation
description: Confirmed bars versus the bar that is still forming. How the newest bar is run again on every update, how state is rolled back, why signals, alerts and orders wait for the close, and how to act on a forming bar when you mean to.
---

Every bar on a chart is finished except the newest one. While the market is open that bar is still forming: its close is the latest traded price, its high can still rise and its volume is still growing. This page explains how OpenScript runs a script on a bar that is still changing, why a condition can be true and then false within one bar, what the language does by default so that you never act on a crossing that did not survive the close, and how to opt in to acting earlier when you mean to. It also explains why a replay or a backtest of your script shows what you would have seen at the time, and the few things in a script that break that.

## A first example

Put this study on any intraday chart during market hours, 09:15 to 15:30 IST for NSE, and watch the table:

```openscript title="Bar state"
version 1
study("Bar state", overlay = true)

t = table("Bar state", 4, 2, position = "topRight")

cell(t, 0, 0, "bar.index")
cell(t, 0, 1, text(bar.index))
cell(t, 1, 0, "confirmed")
cell(t, 1, 1, text(bar.isConfirmed))
cell(t, 2, 0, "realtime")
cell(t, 2, 1, text(bar.isRealtime))
cell(t, 3, 0, "updates")
cell(t, 3, 1, text(bar.updates))
```

While the newest bar forms, "updates" climbs with each price update and "confirmed" reads false. When the interval ends a new bar appears, `bar.index` goes up by one and "updates" starts again from 1. That climbing number is the script being run again and again on one bar.

## The newest bar is run again

OpenScript handles a forming bar by re-running the script on it:

:::key Re-execution
The newest bar of a chart receiving real-time updates is executed again on every update: every tick, or every time the chart receives a new snapshot of the bar.
:::

A script that runs five thousand times over five thousand bars of history then runs a five thousand and first time, and a five thousand and second time, all on the newest bar, until its interval ends and the next bar appears. The [[bar.index]] family tells you where you are:

| Name | True or counts |
|---|---|
| [[bar.isConfirmed]] | This bar's interval has ended and it will not change again |
| [[bar.isRealtime]] | Real-time updates are driving this execution, rather than a one-off history load |
| [[bar.isNew]] | The last update added a new bar rather than replacing the forming one |
| [[bar.isLast]] | This is the newest bar in the data |
| [[bar.updates]] | How many times this bar has been executed, counting from 1 |

`bar.isConfirmed` is true for every historical bar, and for the newest bar once its interval has ended. It is the flag a script uses to refuse to act on a bar that is still moving.

## What moves and what is settled

On the forming bar:

| Value | On the forming bar |
|---|---|
| `open` | Fixed at the first trade of the interval |
| `high` | Can only rise |
| `low` | Can only fall |
| `close` | The latest traded price, so it moves both ways |
| `volume` | Grows |
| `time` | Fixed: it is the bar's opening time |
| `close[1]`, `high[1]` and anything older | Fixed, and never changes again |
| `bar.index`, `bar.count` | Fixed for this bar |
| `bar.updates` | Rises with each execution |

That table is the whole hazard in one grid. A condition built from `close` is a question about a number that is still moving. The same condition built from `close[1]` is a question about a number that is final.

```openscript
// Moves during the bar: the answer can be withdrawn before the close.
breakingOut = close > highest(high, 20)[1]

// Settled: a statement about the bar that already closed.
brokeOut = close[1] > highest(high, 20)[2]

plot(breakingOut ? 1 : 0, "Breaking out now")
plot(brokeOut ? 1 : 0, "Broke out last bar")
```

Neither is wrong. They answer different questions, and a script should know which one it is asking.

## The rollback rule

Running the script again on the same bar would double every running total, so the engine does not simply run it again:

:::key The rollback rule
Before each re-execution of the forming bar, the engine restores every persistent value to what it held at the end of the **previous** bar.
:::

Persistent values means `var` names, the contents of arrays they hold, the state of stateful calls such as [[ema()]] and [[cum()]], and the set of drawing objects the script has created. The effect is that executing the forming bar twice leaves the same state as executing it once:

```openscript
var bars = 0
bars += 1

plot(bars, "Bars")     // counts bars, not updates
```

Without the rule the counter would climb once per update, and the same script would give different numbers on a realtime chart than in a backtest of the same bars. `live var` opts out of rollback for the one case where counting updates is the measurement; [Persistence](/script/language/persistence) covers it, with a worked table.

What a script **may** do on a forming bar: everything computational. Read values, compute, plot, draw, colour bars, write a table, read `bar.isConfirmed` and branch on it. All of it is recomputed from the previous bar's state on each update, so nothing piles up.

## A condition can be true, then false, on the same bar

Take a 9 period [[ema()]] crossing a 21 period one on a 5 minute chart of an NSE stock. Both averages are computed from `close`, and on the forming bar `close` is the latest price. Here is one bar, from 10:05 to 10:10, executed four times, with illustrative prices. The previous bar ended with the fast average at 101.00 and the slow one at 101.04, so the fast average starts the bar below the slow one:

| Time | `bar.updates` | `close` | fast | slow | `crossUp(fast, slow)` |
|---|---|---|---|---|---|
| 10:05:12 | 1 | 101.10 | 101.02 | 101.05 | false |
| 10:06:40 | 2 | 101.45 | 101.09 | 101.08 | **true** |
| 10:08:03 | 3 | 101.20 | 101.04 | 101.05 | false |
| 10:09:58 | 4 | 101.55 | 101.11 | 101.09 | **true** |
| 10:10:00 | bar closes | 101.55 | 101.11 | 101.09 | **true**, and final |

The condition was true, then false, then true again within one bar. Nothing is broken: each row is a correct answer about the data at that instant, and because of the rollback rule, row 3 is not computed on top of row 2; both start from the previous bar's state.

A condition on the forming bar is **provisional**. Acting on it means acting on something that may not be true when the bar finishes. Had that crossing placed an order, you would have bought at 10:06:40 and at 10:08:03 held a position justified by a crossing that no longer existed.

## What the default protects you from

By default you cannot make that mistake by accident:

:::key Held until the close
A script does not emit a `signal`, fire an `alert`, or place, change or cancel an order on a bar that is still forming. Those calls are held until the bar is confirmed, and if the condition that produced them is no longer true at the close, they never happen.
:::

Applied to the table above: at 10:06:40 the marker and the order are held. At 10:08:03 the condition is false and the held call is dropped. At 10:09:58 it is true and held again. At 10:10:00 the bar closes with the condition true, and one signal fires, once.

```openscript title="Confirmed only"
version 1
strategy("Confirmed only", overlay = true, precision = 2)

fast = ema(close, 9)
slow = ema(close, 21)

// No guard needed: the order is placed when the bar closes,
// and only if the crossing is still there.
if crossUp(fast, slow)
    buy(qty = 1)

if crossDown(fast, slow)
    close()

plot(fast, "Fast", aqua, width = 2)
plot(slow, "Slow", orange, width = 2)
```

The fill then follows the declaration's `fillOn` option, which defaults to `"nextOpen"`: a decision made from a bar's close cannot really be filled at that same close, so the default does not pretend it can. [Costs and fills](/script/strategies/costs-and-fills) covers the choice.

## Three ways to act only on a confirmed bar

**Do nothing, and let the default work.** This is right for most scripts. The hold is not a delay you pay for: the bar had to close before the answer was final.

**Guard with `bar.isConfirmed`.** Needed when the file has opted in with `onUnconfirmed`, and useful for anything the engine does not hold for you, such as a table write or a drawing change you only want at the close:

```openscript
fast = ema(close, 9)
slow = ema(close, 21)
crossed = crossUp(fast, slow)

if crossed and bar.isConfirmed
    signal("BUY")
```

**Ask about the previous bar instead.** This moves the whole question one bar back, so every value it reads is already final. The cost is one bar of lag, paid visibly:

```openscript title="Acting a bar late"
version 1
study("Acting a bar late", overlay = true, precision = 2)

fast = ema(close, 9)
slow = ema(close, 21)

// crossUp on the previous bar: every value it reads is settled, so this is
// true on exactly one bar and stays true for that bar's whole life.
crossed = orElse(crossUp(fast, slow)[1], false)

if crossed
    signal("BUY, confirmed")

plot(fast, "Fast", aqua, width = 2)
plot(slow, "Slow", orange, width = 2)
```

On bar 0 there is no previous bar, so `crossUp(...)[1]` is absent. An absent condition takes the false branch anyway, but [[orElse()]] makes that explicit and lets `crossed` be combined with `and` and `or` without spreading absence.

Without `onUnconfirmed`, the signal above is still held until its own bar closes, so it appears one full bar after the crossing. The approach earns that lag in a file that sets `onUnconfirmed = true`: there the signal can fire on the first update of the new bar, and the question it answers is already settled, so it cannot flicker.

| Approach | Acts on | Lag | Use when |
|---|---|---|---|
| The default hold | The bar that just closed | None beyond the close | Almost always |
| A `bar.isConfirmed` guard | The bar that just closed | None beyond the close | The file sets `onUnconfirmed`, or the action is not held for you |
| `cond[1]` | The bar before the current one | One bar, unless the file sets `onUnconfirmed` | The file sets `onUnconfirmed` and the decision must read only settled values |

## Opting in with onUnconfirmed

A study or strategy can act on a forming bar by saying so in its declaration:

```openscript title="Intrabar"
version 1
strategy("Intrabar", overlay = true, onUnconfirmed = true)

fast = ema(close, 9)
slow = ema(close, 21)
crossed = crossUp(fast, slow)

// The engine no longer holds the order, so the script guards it itself.
if crossed and bar.isConfirmed
    buy(qty = 1)

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
```

Three things change the moment you set it, and you should want all three:

- Signals, alerts and orders act on the forming bar as soon as their condition holds, on each execution where it holds. A signal can appear on one update and vanish on the next, an order is sent from a crossing that may not survive the close, and an alert can fire even though the condition is gone by the close (still at most once per bar under the default frequency). Guard each of them unless acting early is the point.
- The compiler reports warning [OS8002](/script/errors/warnings#os8002) on every higher timeframe read in the file, because a forming fine bar reading a coarser bar is where repainting comes from.
- The alert frequency `"everyUpdate"` becomes available. Asking for it without `onUnconfirmed` is error [OS3009](/script/errors/arguments#os3009):

```openscript expect=OS3009
if close > open
    alert("Up bar", id = "up-bar", frequency = "everyUpdate")
```

The option lives in the declaration rather than in a global setting because the choice belongs in the file, where a reviewer reads it. A script that says nothing cannot act on a forming bar, and one that can says so on its declaration line.

## Alerts and how often they fire

An [[alert()]] follows the same rule as a signal. The held call fires when the bar closes, and if the condition is no longer true by then it never fires. That is what makes an alert worth acting on.

```openscript
fast = ema(close, 9)
slow = ema(close, 21)
crossed = crossUp(fast, slow)

if crossed
    alert("Fast crossed above slow at " + text(close, 2), id = "cross-up")
```

| `frequency` | Means |
|---|---|
| `"oncePerBar"` | At most one alert per bar. The default |
| `"once"` | The first time only, for the life of this study on the chart |
| `"everyUpdate"` | On every execution of the bar. Requires `onUnconfirmed = true` |

Two behaviours to know before you rely on alerts:

**Give every alert an `id`.** The `id` is the alert's stable name, so a subscription survives an edit to the script. With no `id`, one is derived from the call's position in the file, which changes when a line is inserted above it, and the compiler warns with [OS8008](/script/errors/warnings#os8008).

**Adding a study to a chart fires nothing for the history already on it.** An alert is a statement about now. A study added at noon that raised four hundred alerts for the morning's bars would be useless.

:::note On the /trading chart in this release
The chart judges a script's alerts once for each new bar, when the bar first arrives. During market hours that is the bar's first tick, before the close the alert is waiting for, and the chart does not look at the bar again, so the alert may not fire. A bar that reaches the chart already closed does fire it. Every `frequency` also behaves as `"oncePerBar"` there. To be told reliably, plot the condition as 1 or 0 and put a study alert on that plot, as [Alerts on a script condition](/script/alerts/alerts-in-trading#alerts-on-a-script-condition) shows.
:::

{{screen: alert-toast}}

[Alerts from scripts](/script/alerts/overview) covers messages, frequency and what happens after an alert fires.

## Drawing on a forming bar

Drawing objects are created and changed by the script, so they would be the obvious place for a realtime chart to collect rubbish: one line per update, thousands per session. The rollback rule covers them. The set of objects is restored to what it was at the end of the previous bar before the forming bar runs again, so a label created on the forming bar is created once, not once per update.

```openscript title="Last swing"
version 1
study("Last swing", overlay = true, precision = 2)

left  = input(5, "Pivot left bars", min = 1, max = 50)
right = input(5, "Pivot right bars", min = 1, max = 50)

ph = pivotHigh(high, left, right)

if not isNone(ph)
    // Anchored to a time, not to a bar index: loading older history
    // renumbers every index and would drag the label sideways.
    draw.label(time[right], ph, "H", color = red, textColor = white)
```

Two details here are about confirmation rather than drawing. A pivot is reported `right` bars **after** the bar it formed on, because that is the first bar on which it is knowable. Reporting it at the pivot bar would be a lookahead: the value would appear on history at a bar where no script could have had it. So the marker appears late, and that lateness is the honest cost of a pivot. And the anchor is `time[right]`, the time of the pivot bar, which stays put when more history loads. [Objects and methods](/script/language/objects-and-methods) covers drawing objects in full.

## Why a replay shows what you saw at the time

The replay in /trading steps through a chart's bars oldest first and lets you watch a study build itself. What you see in a replay is what you would have seen at the time, for the same reasons that make a backtest trustworthy:

- **The script cannot read forward.** `x[n]` looks back only, and a negative offset is an error. The single exception has to be written out in the source and is warned about: a higher timeframe read with `mode = "lookahead"`.
- **Every historical bar is executed once, confirmed.** A history load hands the engine finished bars, so each runs with `bar.isConfirmed` true and the same values a realtime run would have settled on.
- **The forming bar is idempotent.** Idempotent means that doing it again changes nothing: because of rollback, executing bar 4999 once, or forty times as updates arrive, leaves the same state behind for bar 5000.
- **Arithmetic is fixed.** Numbers are 64-bit floating point, rounded the same way every time, in the order the source writes them. There is no randomness in the language and no reading of the clock during a bar except [[chart.now()]].
- **Warmup is exact.** A call's first bar is stated, so a replay starts drawing each line on exactly the bar the realtime chart did. See [Warmup](/script/language/warmup).

Put together: **running a script over the first N bars gives exactly what a full run shows at bar N.** That is what a replay depends on, and it is also what lets a backtest be compared with a realtime run.

For higher timeframe reads with [[req.timeframe()]], the `mode` argument is what keeps this true:

| Mode | What it reads | Repaints |
|---|---|---|
| `"confirmed"` | Only higher timeframe bars that have closed | Never. The default |
| `"developing"` | Also the higher timeframe bar currently forming | On the newest bars, within the current higher timeframe period |
| `"lookahead"` | A higher timeframe bar's final value from its first lower timeframe bar | On history, permanently and by design |

`"confirmed"` is the default and the only mode that never repaints. The other two must be written out, so a script that repaints says so on the line that causes it:

```openscript expect=OS8005
dailyHigh = req.timeframe("1D", high, mode = "lookahead")
plot(dailyHigh, "Day high, final")
```

[Repainting](/script/data/repainting) covers the modes in depth.

## What breaks a replay

If a replay does not reproduce what a realtime run showed, look for one of these in the file:

| Cause | Why it breaks the replay | What the language does |
|---|---|---|
| A `"lookahead"` read | It uses a higher timeframe bar's final value on the lower timeframe bars inside it, information nobody had at the time | Warning [OS8005](/script/errors/warnings#os8005) on the line that reads it |
| `onUnconfirmed = true` | A signal, alert or order can act on a forming bar whose condition is gone by the close. History only runs finished bars, so that action never appears again | The option is written in the declaration, and [OS8002](/script/errors/warnings#os8002) warns on each higher timeframe read in the same file |
| A `live var` | It is not rolled back, so its value depends on how many updates arrived, which a replay cannot know | Warning [OS8011](/script/errors/warnings#os8011) |
| [[chart.now()]] | It is the chart's clock, not the bar's time, so a comparison with it says something different tomorrow | Nothing: use [[time]] for anything about the bar |

## A checklist before you trade a script

Six questions, each with a one-line answer in the source:

1. Does the file set `onUnconfirmed`? If so, is every signal, alert and order guarded with `bar.isConfirmed`, and did you mean to take that on?
2. Does any higher timeframe read name a mode other than `"confirmed"`? If so, the study repaints.
3. Does any `live var` feed a decision rather than a display?
4. Does any condition mix a moving value with a settled one in a way that reads as more certain than it is? Write `close[1]` where you mean "the bar that closed".
5. Is `fillOn` still `"nextOpen"`? Changing it to `"close"` fills at the very price the decision was made from.
6. Does the study look the same after a reload as it did before? If not, one of the causes in the table above is in the file.

Then run it in sandbox trading (analyzer mode in OpenAlgo) before live trading; [Sandbox and live](/script/strategies/sandbox-and-live) walks through it.

**Related.** [Execution model](/script/language/execution-model), [Persistence](/script/language/persistence), [Bars and history](/script/language/bars-and-history), [Warmup](/script/language/warmup), [Repainting](/script/data/repainting), [Alerts from scripts](/script/alerts/overview), [bar.* reference](/script/reference/bar)
