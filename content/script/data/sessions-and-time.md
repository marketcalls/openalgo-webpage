---
title: Sessions and time
description: Time in OpenScript, from UTC timestamps and the chart's timezone to the NSE session from 09:15 to 15:30 IST, the first bar of the day, time windows, holidays, and what each part of /trading supports.
---

Trading happens in sessions, and a session is not the same thing as a calendar day. This page covers how OpenScript (also called OpenAlgo Script) represents time, how to find the first bar of a trading day, how to test whether a bar falls inside a window such as 09:15 to 09:30 IST, how to cope with holidays, and which of these tools work in each part of the /trading page.

## One instant, two calendars

Every bar carries [[time]]: the instant it opened, in **milliseconds since 1 January 1970, UTC**. That number is the same everywhere, it never shifts, and it is the one thing in the language that is safe to store and compare later.

A calendar turns that instant into a year, a month, a day and an hour. By default the language uses the chart's own:

:::key
Every function in the `date` and `session` namespaces reads a timestamp in the chart's timezone, [[chart.timezone]], unless a `zone` argument names another.
:::

The default is the chart's axis rather than UTC because a session study that disagreed with the labels on the chart would be wrong in the way that is hardest to see: every number consistent, every one of them hours away from what you are looking at. On the /trading chart the timezone is the **Timezone** setting in the chart's settings, which is Asia/Kolkata unless you change it.

A zone is written as an area and a location, such as `"Asia/Kolkata"` or `"America/New_York"`, or as `"UTC"`. It is never a fixed offset and never an abbreviation, because an abbreviation can mean different offsets in different places. `"IST"` is not a zone name: a study that passes it stops with OS6005 when it runs.

```openscript
hourOnChart = date.hour(time)                    // in the chart's timezone
hourInIndia = date.hour(time, "Asia/Kolkata")    // in a named zone
plot(hourInIndia, "Hour, IST")
plot(hourOnChart, "Hour, chart zone")
```

## The session namespace

A **session** is the instrument's trading session as the host defines it. It is not a window the script invents, and that matters: the host knows about a special session or an early close, and a script does not.

| Name | Returns | Means | Available |
|---|---|---|---|
| [[session.isFirstBar]] | `series bool` | This is the session's first bar | Yes, where the host supplies session hours |
| [[session.isLastBar]] | `series bool` | This is the session's last scheduled bar | Yes, where the host supplies session hours |
| [[session.isIn()]] | `series bool` | This bar falls inside a window you write | Yes |
| [[session.isOpen]] | `series bool` | This bar falls inside the instrument's session | Planned |
| [[session.startTime]] | `series number` | When this bar's session opened | Planned |
| [[session.endTime]] | `series number` | When this bar's session is scheduled to close | Planned |
| [[session.barIndex]] | `series number` | This bar's position within its session | Planned |
| [[session.isHoliday()]] | `bool` | Whether a date is a trading holiday | Planned |
| [[session.nextOpen]] | `series number` | When the next session opens | Planned |

`session.isFirstBar` and `session.isLastBar` are worked out from the instrument's session hours, which the host states. **Where the host states none, both are absent on every bar.** That is the honest answer, since a guessed session would be wrong somewhere. /trading states the session from the platform's market calendar, with the exceptions in [the last section](#sessions-and-the-clock-in-trading-today). [[timeClose]], the instant a bar ends, and `date.add`, calendar arithmetic, are planned as well.

Using a planned name is refused by the compiler with OS2020:

```openscript expect=OS2020
opened = session.startTime
plot(time - opened, "Milliseconds since the open")
```

## A calendar day is not a session

A session is what an exchange opens and closes. A date is what a calendar says. They line up on many instruments and not on others.

| Case | Sessions | Dates |
|---|---|---|
| An NSE or BSE day, 09:15 to 15:30 IST | One | One |
| An MCX day, which runs into the late evening IST | One | One |
| A market whose evening session runs past midnight | One | Two |
| A half day before a holiday | One, shorter | One |
| A holiday or a weekend day | None | One |

Everything in the language that resets "per day" is meant to reset per **session**. [[vwap()]] restarts when the session opens, so it needs the session hours too. A `"1D"` [higher timeframe read](/script/data/higher-timeframes) groups the bars of one calendar day in the chart's timezone, which on an Indian exchange is one session. Write your own state the same way.

**For Indian exchanges the two line up.** No NSE, BSE or MCX session runs past midnight IST, so a new calendar day in IST is a new session. That gives a test that works on any host, including one that states no session hours.

## The first bar of the day

The language's answer is `session.isFirstBar`, which /trading works out from the market calendar's session hours. On Indian instruments you can also test for a new IST date, which is what this study does, so it works the same on a host that states no session hours:

```openscript title="Day open, high and low"
version 1

study("Day open, high and low", overlay = true, precision = 2)

// A new trading day: the first bar on the chart, or a bar on a different IST
// date from the bar before it. Named zone, so a chart set to another timezone
// still splits days at midnight IST.
newDay = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")

var dayOpen = none
var dayHigh = none
var dayLow  = none

if newDay
    dayOpen = open
    dayHigh = high
    dayLow  = low
else
    dayHigh = max(dayHigh, high)
    dayLow  = min(dayLow, low)

plot(dayOpen, "Day open", silver, style = "step")
dayHighPlot = plot(dayHigh, "Day high", aqua,   style = "step")
dayLowPlot  = plot(dayLow,  "Day low",  orange, style = "step")
fill(dayHighPlot, dayLowPlot, fade(aqua, 94))
```

The oldest day on the chart may have started before the first loaded bar, so its open, high and low describe only the part of the day the chart holds. Every later day is complete.

On a host that supplies session hours, as /trading does, replace the `newDay` line with `newDay = session.isFirstBar` and the study works on any market, including one whose session crosses midnight.

### Tests that look right and are not

| Written as | Fails when |
|---|---|
| `date.hour(time) == 9 and date.minute(time) == 15` | The market opens late, a special session runs at other hours, or the chart's interval puts no bar at 09:15 |
| `bar.index % 75 == 0` | A half day, a missing bar, or any day whose bar count is not what the script assumed |
| `not date.isSameDay(time, time[1])` with no zone | The chart's timezone is changed away from IST, or the market has a session that crosses midnight |
| `date.dayOfWeek(time) != date.dayOfWeek(time[1])` with no zone | The same cases |

The `isSameDay` test has one more trap, on the oldest bar. There `time[1]` is absent, so `date.isSameDay(time, time[1])` is absent, the `not` of it is absent too, and an absent condition takes the false branch: the first day on the chart never starts. Start the test with `isNone(time[1]) or`, as the study above does.

## The last bar of the day

`session.isLastBar` is worked out from the session's **schedule**: the scheduled close and the chart's interval. It is true on the bar that reaches the scheduled close, while that bar runs, rather than being noticed when the next session's first bar arrives. That is what a strategy that must be flat by the close needs: waiting to see the next session's first bar means the position has already been held overnight.

The schedule is also its limit. If trading stops before the last scheduled bar, no bar that day has `session.isLastBar` true, so a strategy that must be flat also needs a clock based exit.

In /trading, `session.isLastBar` answers on the chart and in the Backtest panel. A deployed strategy cannot read it yet: the runner refuses it when the run loads. So a strategy you mean to deploy squares off by the clock instead, with a window in [[session.isIn()]], or with the IST arithmetic in [the last section](#sessions-and-the-clock-in-trading-today), which needs nothing from the host at all.

## Windows inside the day

[[session.isIn()]] tests whether a bar falls inside a window you write as a string `"HHMM-HHMM"`, with an optional list of days.

```openscript title="Opening minutes and late entries"
version 1

study("Opening minutes and late entries", overlay = true)

// The first fifteen minutes of trading, Monday to Friday, in IST.
opening = session.isIn("0915-0930:12345", "Asia/Kolkata")

// The last half hour, when an intraday system usually stops opening trades.
lateDay = session.isIn("1500-1530", "Asia/Kolkata")

background(opening ? fade(aqua, 88) : lateDay ? fade(orange, 90) : none)
```

| Part | Means |
|---|---|
| `HHMM-HHMM` | Start and end, on the chart's clock unless a zone is given |
| `:12345` | Days, 1 for Monday through 7 for Sunday |
| End before start | The window crosses midnight, as `"2100-0200"` does |

Days are numbered with Monday as 1, the same as [[date.dayOfWeek()]], so the trading week is one range and a weekday test is `date.dayOfWeek(time) <= 5`. A window the engine cannot read, such as `"9:15-15:30"`, is absent on every bar, so the test is never true: check the spelling if a window never matches.

## Calendar fields

The `date` namespace turns a timestamp into fields and back. These are the ones a trading script reaches for:

| Call | Gives |
|---|---|
| [[date.year()]], [[date.month()]], [[date.day()]] | Calendar date parts |
| [[date.hour()]], [[date.minute()]], [[date.second()]] | Clock parts |
| [[date.dayOfWeek()]] | 1 for Monday through 7 for Sunday |
| [[date.dayOfYear()]], [[date.weekOfYear()]] | Position in the year |
| [[date.isSameDay()]] | Whether two instants fall on one calendar day |
| [[date.startOfDay()]], [[date.startOfWeek()]], [[date.startOfMonth()]] | Midnight at the start of the day, the Monday, the first of the month |
| [[date.from()]] | A timestamp built from year, month, day, hour, minute and second |
| [[date.format()]] | A timestamp rendered as text |

Every one of them takes an optional trailing `zone`. [[date.format()]] takes a small, fixed set of placeholders and copies every other character through:

| Placeholder | Gives | Placeholder | Gives |
|---|---|---|---|
| `yyyy` | Four digit year | `HH` | Two digit hour, 24 hour clock |
| `MM` | Two digit month | `mm` | Two digit minute |
| `dd` | Two digit day | `ss` | Two digit second |
| `MMM` | Three letter month | `EEE` | Three letter weekday |

Month and weekday names are English whatever the machine's language, so one script always draws the same chart.

```openscript title="Day clock"
version 1

study("Day clock", overlay = true)

newDay = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")

var dayStart = none
var barsToday = 0
if newDay
    dayStart = time
    barsToday = 0
barsToday += 1

panel = table("Day clock", 3, 2, position = "topRight", textColor = silver)

// Written on the newest bar only: the panel shows the current state.
if bar.isLast
    cell(panel, 0, 0, "Newest bar")
    cell(panel, 0, 1, date.format(time, "EEE dd MMM HH:mm", "Asia/Kolkata"), textColor = white)
    cell(panel, 1, 0, "Day's first bar")
    cell(panel, 1, 1, date.format(dayStart, "HH:mm", "Asia/Kolkata"), textColor = white)
    cell(panel, 2, 0, "Bars today")
    cell(panel, 2, 1, text(barsToday, 0))
```

An anchor the reader picks, such as the start of an anchored average, is an input of kind `"time"`. The dialog stores the date and time as text, and the script receives a timestamp in UTC milliseconds, ready to compare with `time`:

```openscript
// On the /trading chart the text is read in the chart's timezone:
// 09:15 on a chart in Asia/Kolkata is 09:15 IST.
anchor = input("2025-01-02 09:15", "Anchor", kind = "time")
started = time >= anchor
background(started ? fade(aqua, 95) : none)
```

:::warn
The /trading chart reads the text of a time input in the chart's timezone, and a deployed strategy reads it in the instrument's zone, IST for an Indian exchange. The **Backtest panel** still reads it as a **UTC** clock: there `2025-01-02 09:15` means 09:15 UTC, which is 14:45 IST. To anchor a backtest at an IST time, subtract 5 hours 30 minutes when you type the time in the panel's inputs.
:::

## Holidays

**There is no holiday calendar in this version.** [[session.isHoliday()]] is planned. Until then a holiday is not a flag a script can read. It is a shape in the data:

> On a holiday, there are no bars.

That sentence has consequences:

- **Never count calendar days to find an earlier session.** "Five days ago" is four sessions in a week with one holiday. Use a confirmed `"1D"` read with history inside the expression, which counts trading days.
- **Never assume `time - time[1]` is one interval.** It is one interval inside a session, the overnight gap at the day's first bar, the weekend on Monday, and several days after a holiday.
- **Never assume a day has a fixed number of bars.** A special session or an early close is a real session with fewer of them.
- **Two exchanges can have different holidays.** That is one way a [read of another instrument](/script/data/other-instruments) produces absent bars.

A script can still notice that a trading day is missing, which is often enough to widen a stop or skip a trade:

```openscript title="Missing days"
version 1

study("Missing days", overlay = true)

newDay = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")

// Calendar days between this bar's date and the previous bar's date, in IST.
// Rounded, because the division is of two midnights.
today     = date.startOfDay(time, "Asia/Kolkata")
yesterday = isNone(time[1]) ? none : date.startOfDay(time[1], "Asia/Kolkata")
daysSkipped = isNone(yesterday) ? none : round((today - yesterday) / 86400000)

// A Monday normally follows a Friday, three days back. Any other weekday
// follows the day before. More than that means a trading day did not happen.
expected = date.dayOfWeek(time, "Asia/Kolkata") == 1 ? 3 : 1
missing = newDay and not isNone(daysSkipped) and daysSkipped > expected

if missing
    signal("DAY MISSING", orange, at = "above")

background(missing ? fade(orange, 88) : none)
```

This is a heuristic, and it says so: it assumes a Monday to Friday week, and it cannot tell a public holiday from a day the data feed did not deliver. It reports what it can observe, which is that a trading day the pattern expected did not arrive.

## The wall clock

[[chart.now()]] is the chart's wall clock in UTC milliseconds, and it is the only clock reading a script has. Everything else is a function of the bars. Use it to ask how old the newest bar is, not to compute anything historical, because a value computed from it changes every time the study runs:

```openscript
ageMinutes = (chart.now() - time) / 60000
plot(bar.isLast ? ageMinutes : none, "Minutes since the newest bar opened")
```

## Sessions and the clock in /trading today

The same script meets three different hosts in /trading. All three read the instrument's timezone and trading session from the platform's market calendar, the same record an admin edits when the exchange changes its hours, so no session time is written into a script or into the page.

| Where the script runs | `date.*` and `session.isIn` | `session.isFirstBar`, `session.isLastBar` and [[vwap()]] |
|---|---|---|
| On the chart, as a study or a strategy | Read in the chart's timezone | From the instrument's regular session hours. Absent while the chart's timezone is set to a zone other than the exchange's, and for the moment after the study is first drawn, before the instrument's details arrive; the study draws again when they do |
| In the Backtest panel | Read in the exchange's timezone, Asia/Kolkata for an Indian exchange | From the regular session hours, for every day of the run |
| In the Strategies panel, as a deployed strategy | Read in the instrument's zone, Asia/Kolkata for an Indian exchange | `session.isFirstBar` and `vwap()` from the market calendar; a run started on a special session day reads that day with its own hours. `session.isLastBar` is refused when the run loads, OS6004: the server's engine does not have it yet |

The chart and the Backtest panel use the **regular** session for every day, because the engine holds one session for a whole run. On a special session day, such as an evening session on a holiday, the bars are read against the regular hours.

A deployed strategy is refused before it starts when the server cannot read a clock in the instrument's zone, or when a script reads `session.isFirstBar` and the market calendar holds no session for the exchange. Both refusals name the script and the reason in the run's log.

The studies on this page use `date.*` and `session.isIn`, which answer in every part of /trading. Arithmetic on [[time]] itself is still worth knowing: it needs nothing from the host, so a script written with it behaves the same on a host that states no timezone or session at all.

India does not observe daylight saving, so India Standard Time is always exactly 5 hours 30 minutes ahead of UTC. Adding that offset to `time` and dividing gives the IST day and the minute of the IST day with no calendar function at all. (A fixed offset is wrong for any zone that changes its clocks, which is why the language never uses one. For IST it is exact all year.)

```openscript title="Intraday window by the IST clock"
version 1

strategy("Intraday window by the IST clock", overlay = true, product = "intraday")

fastLen   = input(9,    "Fast length", min = 1, max = 500)
slowLen   = input(21,   "Slow length", min = 1, max = 500)
firstHHMM = input(930,  "First entry, HHMM IST", min = 915, max = 1530)
lastHHMM  = input(1445, "Last entry, HHMM IST", min = 915, max = 1530)
exitHHMM  = input(1515, "Square off from, HHMM IST", min = 915, max = 1530)

// IST is UTC plus 5 hours 30 minutes, all year.
IST_OFFSET = 19800000
DAY_MS     = 86400000

// Minutes since midnight IST at the bar's open: 555 is 09:15.
istMinute = floor(mod(time + IST_OFFSET, DAY_MS) / 60000)

firstMinute = floor(firstHHMM / 100) * 60 + mod(firstHHMM, 100)
lastMinute  = floor(lastHHMM / 100) * 60 + mod(lastHHMM, 100)
exitMinute  = floor(exitHHMM / 100) * 60 + mod(exitHHMM, 100)

// Crosses computed at the top level, on every bar, so their state is right.
fast   = ema(close, fastLen)
slow   = ema(close, slowLen)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

inEntryWindow = istMinute >= firstMinute and istMinute <= lastMinute
squareOffTime = istMinute >= exitMinute

if inEntryWindow and goLong and pos.size == 0
    buy(qty = 1)

if pos.size > 0 and (goFlat or squareOffTime)
    close()
```

The same arithmetic gives a new IST day without a date function: `istDay = floor((time + IST_OFFSET) / DAY_MS)` changes at midnight IST, so `istDay != orElse(istDay[1], -1)` is true on each day's first bar.

## Mistakes worth naming

- **Resetting on a date change in the wrong zone.** Split days in IST by naming `"Asia/Kolkata"`, so a chart set to another timezone still splits them at midnight IST.
- **Waiting for the next day's first bar to go flat.** By then the position is overnight. Square off on the last bar or by the clock.
- **Using an abbreviation or an offset as a zone.** `"IST"` stops the study with OS6005. Write `"Asia/Kolkata"`.
- **Comparing `date.hour(time)` with a hard coded open.** The interval decides where bars start and the exchange decides when it opens. Both change.
- **Remembering the day's first bar by `bar.index`.** Every index shifts when older history loads. Store `time` instead.

**Related:** [Timeframes](/script/data/timeframes), [Higher timeframes](/script/data/higher-timeframes), [Other instruments](/script/data/other-instruments), [Repainting](/script/data/repainting), [session.* reference](/script/reference/session), [date.* reference](/script/reference/date)
