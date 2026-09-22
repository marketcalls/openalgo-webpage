---
title: bar.*
description: The bar namespace, facts about the bar being computed rather than about its price, its index in the data, whether it is the first or last bar, and whether it is confirmed, realtime, new or updated.
---

A script runs once per bar, oldest bar first. The `bar` namespace tells the script where it is in that run: the bar's position in the data, whether it is the first or the newest bar, and, on the newest bar of a moving chart, whether the bar has closed and how many times it has been executed.

These facts matter most at the two edges of the chart. At the left edge, `bar.isFirst` and `bar.index` help you seed state and skip warmup (the first bars, where an indicator does not have enough data yet). At the right edge, `bar.isLast` lets you write a table once, and `bar.isConfirmed` separates a bar that has finished from one that is still forming.

```openscript title="Where am I in the run?"
version 1
study("Run position", overlay = true)

panel = table("Run", 3, 2, position = "topRight")

if bar.isLast
    cell(panel, 0, 0, "Bars loaded")
    cell(panel, 0, 1, text(bar.count))
    cell(panel, 1, 0, "Newest bar confirmed")
    cell(panel, 1, 1, bar.isConfirmed ? "yes" : "still forming")
    cell(panel, 2, 0, "Executions of this bar")
    cell(panel, 2, 1, text(bar.updates))
```

Every entry on this page is a series with a value from bar 0. Four of them are worked out by the engine from the data it was given. The other four describe the execution itself, and come from the host, the application that drives the script (such as the /trading chart): whether it added a bar or updated the newest one, and whether that bar has closed.

| Worked out from the data | Stated by the host about each execution |
|---|---|
| [[bar.index]], [[bar.count]], [[bar.isFirst]], [[bar.isLast]] | [[bar.isConfirmed]], [[bar.isRealtime]], [[bar.isNew]], [[bar.updates]] |

What those four read in the two usual cases:

| | `bar.isNew` | `bar.isConfirmed` | `bar.isRealtime` | `bar.updates` |
|---|---|---|---|---|
| Every bar of a history load, and every bar of a backtest | true | true | false | 1 |
| The newest bar of a chart following the market, as it forms | true on its first run, then false | false until its interval has elapsed, then true | true | 1, 2, 3 and on |

## Position in the data

{{entry: bar.index}}

The zero-based position of the bar being computed within the data the chart loaded. The oldest bar is 0, the next is 1, and so on. Use it to skip a warmup period or to act on every nth bar.

```openscript
version 1
study("Warmup mask", overlay = true)

sma50 = sma(close, 50)
warm = bar.index >= 100
plot(warm ? sma50 : none, "SMA 50, hidden for the first 100 bars", orange)
```

**Remarks.** `bar.index` is a position in the loaded data, not a permanent address. Loading more history shifts every index by the number of bars added. To remember a particular bar, store its [[time]], which never moves.

**See also.** [[bar.count]], [[bar.isFirst]], [[time]]

{{entry: bar.count}}

How many bars have been seen so far, including this one: `bar.index + 1`. It is the natural divisor for a mean taken over the whole run.

```openscript
version 1
study("Mean close since the first bar", overlay = true)
plot(cum(close) / bar.count, "Mean of every close so far", silver)
```

**See also.** [[bar.index]], [[cum()]]

{{entry: bar.isFirst}}

True on the oldest bar in the data, the one where `bar.index` is 0, and false on every other bar. Use it to seed a value, or to protect a read of `[1]`, which is absent on that bar.

```openscript
version 1
study("New day marker", overlay = true)

// bar.isFirst is true on bar 0, so or never evaluates time[1] there.
newDay = bar.isFirst or not date.isSameDay(time, time[1])
background(newDay ? fade(aqua, 90) : none)
```

**Remarks.** `bar.isFirst` is about the data, not the market. The oldest bar loaded is often in the middle of a session; [[session.isFirstBar]] is the test for the first bar of each trading session, where the host states the session's hours.

**See also.** [[bar.index]], [[session.isFirstBar]], [[bar.isLast]]

{{entry: bar.isLast}}

True on the newest bar the chart has loaded. A table or a summary label shows only the current state, so write it when `bar.isLast` is true instead of on every bar of the history.

```openscript
version 1
study("Last close panel", overlay = true)

panel = table("Last close", 1, 2, position = "bottomRight")
if bar.isLast
    cell(panel, 0, 0, chart.symbol)
    cell(panel, 0, 1, text(close, 2))
```

**Remarks.** On a moving chart the newest bar is executed again on every update, so `bar.isLast` stays true across those updates until a new bar appears.

**See also.** [[bar.isConfirmed]], [[table()]], [[cell()]]

## State of the bar

{{entry: bar.isConfirmed}}

True when the bar's interval has elapsed and its values will not change again. It is true for every historical bar, and for the newest bar once its time is up. It is the flag a script uses to refuse to act on a bar that is still forming.

```openscript
version 1
study("Confirmed breakout", overlay = true, onUnconfirmed = true)

prevHigh = highest(high, 20)[1]
if bar.isConfirmed and close > prevHigh
    signal("BREAKOUT")
plot(prevHigh, "20 bar high", aqua, style = "step")
```

**Remarks.** By default a script does not need this guard for signals, alerts and orders: they wait for the bar to close anyway. The guard matters when the declaration sets `onUnconfirmed = true`, as the example does, or when you draw or write a table that should only change on a closed bar.

**See also.** [[bar.isRealtime]], [[bar.updates]], [[signal()]]

{{entry: bar.isRealtime}}

True when a feed of the latest market data is driving updates to the bar, and false while the bars come from a one-time load of history. Only the newest bar can be realtime; every bar of a backtest has it false.

```openscript
version 1
study("Feed status", overlay = true)

panel = table("Feed", 1, 1, position = "topRight")
if bar.isLast
    cell(panel, 0, 0, bar.isRealtime ? "Following the market" : "History only")
```

**See also.** [[bar.isConfirmed]], [[bar.isNew]]

{{entry: bar.isNew}}

True when the latest update added a new bar, and false when it replaced the values of a bar that was already there. Every historical bar has it true, because each one arrived once. On a moving chart, the first execution of each new bar has `bar.isNew` true and the later updates of that bar have it false.

```openscript
version 1
study("Update anatomy", precision = 0)

plot(bar.updates, "Executions of this bar", silver)
plot(bar.isNew ? 1 : 0, "Added by the last update", aqua, style = "column")
```

**See also.** [[bar.updates]], [[bar.isRealtime]]

{{entry: bar.updates}}

How many times this bar has been executed, counting from 1. A historical bar runs once. The newest bar of a moving chart runs again on every update, and this number rises with each one.

```openscript
version 1
study("Updates per bar", precision = 0)

live var updatesSeen = 0
updatesSeen += 1
plot(bar.updates, "Executions of this bar", silver)
plot(updatesSeen, "Executions since the chart opened", aqua)
```

**Remarks.** `bar.updates` counts executions, not trades in the market; it is mostly a diagnostic. A plain `var` is restored before each re-execution of the newest bar, so counting updates yourself needs `live var`, as above, and the compiler warns with `OS8011` to remind you that such a count differs between a moving chart and a backtest.

**See also.** [[bar.isNew]], [[bar.isConfirmed]]

## Related

[Execution model](/script/language/execution-model), [Realtime and confirmation](/script/language/realtime-and-confirmation), [Persistence](/script/language/persistence), [Price and volume](/script/reference/price-and-volume), [session.*](/script/reference/session).
