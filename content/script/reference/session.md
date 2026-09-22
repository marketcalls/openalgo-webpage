---
title: session.*
description: The session namespace, the first and last bar of each trading session, windows you name such as 09:15 to 15:30, and the session facts that are planned.
---

A trading session is what an exchange opens and closes: 09:15 to 15:30 IST for NSE and BSE equities and for NFO futures and options, longer hours for MCX. The `session` namespace tells a script where each bar sits in that session, so an opening range, a daily reset or a square-off before the close follows the exchange's hours rather than the calendar.

Three members work today, and they get their answers from two different places. The host in the table is the application that runs the script, such as the /trading page.

| Member | Answers from | Where it is `none` |
|---|---|---|
| [[session.isFirstBar]], [[session.isLastBar]] | The instrument's own session hours, which the host states | Wherever the host states no session hours, which includes the /trading chart and Backtest panel in this release |
| [[session.isIn()]] | A window of clock times you write in the script | Wherever no timezone is known; name one with the `zone` argument to be safe |

The rest of the namespace is planned and listed at the end of this page.

So on the /trading page today, build session logic on [[session.isIn()]], and use the first two where the host states the hours, with a fallback for where it does not. The example below needs nothing from the host except a timezone: it holds the high and low of the first fifteen minutes of each NSE day.

```openscript title="Opening range, reset every session"
version 1
study("Opening range", overlay = true, precision = 2)

inRange = session.isIn("0915-0930")
rangeStarts = inRange and not orElse(inRange[1], false)

var rangeHigh = none
var rangeLow = none
if rangeStarts
    rangeHigh = high
    rangeLow = low
else if inRange
    rangeHigh = max(rangeHigh, high)
    rangeLow = min(rangeLow, low)

plot(rangeHigh, "Range high", aqua, style = "step")
plot(rangeLow, "Range low", orange, style = "step")
```

`rangeStarts` is true on the first bar inside the window: the bar is in it and the bar before was not. [[orElse()]] turns the absent `inRange[1]` of the very first bar into `false`.

:::key
Reset per-day state on the start of the session, not on a change of date, wherever the host lets you. A session and a calendar day line up for a 09:15 to 15:30 session, but a session that runs past midnight is one session and two dates, and a holiday is one date and no session.
:::

## Session boundaries

{{entry: session.isFirstBar}}

True on the first bar of each trading session and false on every other bar. It is the bar to reset anything that is measured per session: the day's high and low, a running volume, a count of trades.

```openscript
version 1
study("Session high and low", overlay = true)

// The session's own first bar where the host states session hours,
// otherwise the first bar of each calendar day.
firstBar = orElse(session.isFirstBar, bar.isFirst or not date.isSameDay(time, time[1]))

var dayHigh = none
var dayLow = none
if firstBar
    dayHigh = high
    dayLow = low
else
    dayHigh = max(dayHigh, high)
    dayLow = min(dayLow, low)

plot(dayHigh, "Session high", lime, style = "step")
plot(dayLow, "Session low", red, style = "step")
```

**Remarks.** It is the first bar delivered inside the session's hours, so a session that opened late still has a first bar. The oldest bar of the chart counts as a first bar too when the data starts in the middle of a session, which makes the first session on the chart a partial one. A bar outside the session's hours has `false`.

It comes from the session hours in the instrument's record, read in the instrument's timezone. When the host states no session for the instrument, the value is `none`, and an `if` on it never runs. That is why the example wraps it in [[orElse()]]: on the /trading page, which states no session hours in this release, the example falls back to a change of calendar day, which is the same thing for an NSE session.

**See also.** [[session.isLastBar]], [[bar.isFirst]], [[vwap()]]

{{entry: session.isLastBar}}

True on the last bar of each session's schedule. It is worked out from the scheduled close, not from the arrival of the next bar, so it is known while that bar is still running. On a 5 minute NSE chart it is the 15:25 bar. On a day when trading stops early, the scheduled last bar never arrives, so no bar of that day has it true.

```openscript
version 1
strategy("Intraday only", overlay = true, product = "intraday", fillOn = "close")

// The session's last bar where the host states session hours,
// otherwise the last fifteen minutes of the NSE day.
squareOff = orElse(session.isLastBar, session.isIn("1515-1530", "Asia/Kolkata"))

fast = ema(close, 9)
slow = ema(close, 21)

if crossUp(fast, slow) and not squareOff
    buy()
if crossDown(fast, slow) or squareOff
    close()
```

**Remarks.** Waiting for the next session's first bar to flatten is too late: by then the position has been carried overnight. Watch the fill rule too. With the default `fillOn = "nextOpen"`, an order decided on the last bar fills at the next bar's open, which is the next session's first bar. The example declares `fillOn = "close"` so the exit fills at the close of the bar that decided it. The other way is to decide earlier, with a window such as `session.isIn("1515-1530")`, and keep the default fill.

It needs the chart's interval as well as the session hours, to know which bar slot is last. When the host does not state both, the value is `none`, which is why the example falls back to a window. The window names its zone because the /trading Backtest panel states no timezone.

**See also.** [[session.isFirstBar]], [[close()]], [[bar.isLast]]

## Windows you name

{{entry: session.isIn()}}

True when the bar falls inside a window of clock times you write, such as `"0915-1000"` for the first forty-five minutes of the NSE session or `"1430-1530"` for the last hour. Use it to trade only part of the day, to shade a period, or to hold a range while it forms. It needs nothing from the host except a timezone, so it works on every chart.

```openscript
version 1
study("Entry window", overlay = true)

window = input("0930-1445", "Entry window")
inWindow = session.isIn(window)

fast = ema(close, 9)
slow = ema(close, 21)
crossed = crossUp(fast, slow)

if inWindow and crossed
    signal("BUY")
background(inWindow ? none : fade(gray, 92))
```

The `spec` string is `"HHMM-HHMM"`, with an optional list of days after a colon.

| Spec | Means |
|---|---|
| `"0915-1530"` | Every day, from 09:15 up to 15:30 |
| `"0915-1530:12345"` | The same window, Monday to Friday only |
| `"0900-2330"` | A long day window, such as an MCX session |
| `"2300-0500"` | An overnight window: an end before the start crosses midnight |
| `"0915-0915"` | An empty window that matches nothing, not a full day |

**Remarks.** The window starts at the first time and stops before the second: a bar that opens at 15:30 is outside `"0915-1530"`, and the 15:25 bar is inside. The test uses the bar's opening time, [[time]]. Two windows written back to back, such as `"0915-1200"` and `"1200-1530"`, cover every minute exactly once. An end of `2400` means midnight at the end of the day.

Days are numbered 1 for Monday through 7 for Sunday, the same as [[date.dayOfWeek()]]. For a window that crosses midnight, the day list names the day the window opened on: `"2300-0100:1"` covers Monday 23:00 to Tuesday 01:00.

The times are read in the chart's timezone unless `zone` names another IANA zone (the standard `Area/City` form), such as `"Asia/Kolkata"`. Where no timezone is known, as in the /trading Backtest panel in this release, the result is `none` unless you pass `zone`. A zone the host does not know stops the script with `OS6005`; abbreviations such as `"IST"` are not zone names.

A spec that does not follow the form above, such as `"9:15-15:30"`, is not caught by the compiler and matches no bar: the result is `none`, so a condition built on it never holds. Check the spelling when a window never lights up.

**See also.** [[session.isFirstBar]], [[date.hour()]], [[chart.timezone]]

## Planned

These session facts are named in the language and not available in this release; using one is `OS2020`. Each will be worked out from the instrument's session hours.

{{entry: session.isOpen}}

True when the bar falls inside the instrument's own trading session, so a strategy can refuse to place an order outside market hours.

{{entry: session.startTime}}

The instant the bar's session opened, in UTC milliseconds, for measuring time since the open. Until then, store [[time]] in a `var` on the session's first bar.

{{entry: session.endTime}}

The instant the bar's session is scheduled to close, in UTC milliseconds, for measuring the time left before the close.

{{entry: session.barIndex}}

The bar's position within its session, 0 on the session's first bar. Until then, count bars in a `var` that resets on the session's first bar.

{{entry: session.nextOpen}}

The instant the next session opens, in UTC milliseconds.

{{entry: session.isHoliday()}}

Whether a date is a trading holiday, once the host supplies an exchange holiday calendar. Until then, a holiday shows up in the data as a day with no bars.

## Related

[Sessions and time](/script/data/sessions-and-time), [date.*](/script/reference/date), [bar.*](/script/reference/bar), [chart.*](/script/reference/chart), [Price and volume](/script/reference/price-and-volume), [Exits and brackets](/script/strategies/exits-and-brackets).
