---
title: date.*
description: The date namespace, reading a timestamp as a calendar and a clock in the chart's timezone, building a timestamp from calendar fields, rounding to the start of a day, week or month, and writing a timestamp as text.
---

Every instant in OpenScript is a plain `number`: milliseconds since 1 January 1970, in UTC. That is what [[time]] holds for each bar. The `date` namespace turns such a number into calendar and clock fields (a year, a weekday, an hour), turns fields back into a number, rounds an instant back to the start of its day, week or month, and writes it as text.

You need these functions whenever a rule depends on the calendar: a weekly anchor, a label with the bar's date, a filter on the first half hour of trading. For rules that follow the exchange's hours, the [session functions](/script/reference/session) are usually the better tool.

```openscript title="Calendar at work"
version 1
study("Week and month anchors", overlay = true)

newWeek  = date.startOfWeek(time) != date.startOfWeek(time[1])
newMonth = date.month(time) != date.month(time[1])

weekVwap = vwapAnchor(hlc3, newWeek)
plot(weekVwap, "Weekly VWAP", aqua)
background(newMonth ? fade(orange, 85) : none)

if newMonth
    draw.label(time, high, date.format(time, "MMM yyyy"), textColor = orange)
```

On the first bar, `time[1]` is absent, so both comparisons are `true` there (`!=` never returns `none`): the first bar on the chart starts a week and a month of its own.

## The timezone every field is read in

A timestamp is the same number everywhere, but its calendar fields depend on a timezone: 03:45 UTC is 09:15 in India. Every function on this page reads a timestamp in the chart's timezone, [[chart.timezone]], unless you pass a `zone` argument. The /trading chart's zone is `"Asia/Kolkata"`, so `date.hour(time)` of the first NSE bar is 9, matching the labels on the chart's own axis.

| `zone` argument | Result |
|---|---|
| Left out | The chart's timezone, or `none` when the host (the application running the script) states no timezone |
| An IANA name (the standard `Area/City` form) such as `"Asia/Kolkata"` or `"Europe/London"`, or `"UTC"` | That zone |
| An abbreviation such as `"IST"`, or a name the host does not know | `OS6005` when the bar runs, which stops the script |

The /trading Backtest panel states the exchange's own zone, from the platform's market calendar, and a strategy running from the Strategies panel reads the calendar in the instrument's zone, so a call that leaves out `zone` reads Indian time in both, as it does on the chart. Pass the zone, as in `date.hour(time, "Asia/Kolkata")`, in a script that must also run on a host that states none.

A zone is always a name, never a fixed offset, because an offset is wrong for half the year anywhere that moves its clocks. Where clocks do move, a wall clock time that was skipped resolves to the instant it would have been, and a time that happened twice resolves to the first of the two. India does not move its clocks, so none of this affects an Indian chart.

None of these functions has a warmup: given a timestamp that is present and a timezone, each gives a value on bar 0. Given `none`, such as `time[1]` on the first bar, each gives `none`.

## Calendar fields

{{entry: date.year()}}

The calendar year of the timestamp, such as 2025. Use it to split a study by year or to mark where one begins.

```openscript
version 1
study("Year marker", overlay = true)

newYear = not isNone(time[1]) and date.year(time) != date.year(time[1])
if newYear
    draw.label(time, high, text(date.year(time)), textColor = silver)
```

**Remarks.** The `not isNone(time[1])` guard keeps the first bar on the chart from counting as the start of a year.

**See also.** [[date.month()]], [[date.dayOfYear()]]

{{entry: date.month()}}

The month of the timestamp, 1 for January through 12 for December.

```openscript
version 1
study("Quarter ends", overlay = true)

quarterEndMonth = date.month(time) % 3 == 0
background(quarterEndMonth ? fade(purple, 94) : none)
```

**See also.** [[date.startOfMonth()]], [[date.day()]]

{{entry: date.day()}}

The day of the month, 1 to 31.

```openscript
version 1
study("First trading day of the month", overlay = true)

firstDay = not isNone(time[1]) and date.month(time) != date.month(time[1])
if firstDay
    signal("DAY " + text(date.day(time)), at = "below")
```

**Remarks.** The marker shows which date the month's first trading day fell on, such as `DAY 2` when the 1st was a holiday. To ask whether two bars fall on the same day, use [[date.isSameDay()]] rather than comparing day numbers: bars a month apart can both fall on the 12th.

**See also.** [[date.isSameDay()]], [[date.month()]]

{{entry: date.dayOfWeek()}}

The day of the week, 1 for Monday through 7 for Sunday. Monday is 1 so that the trading week is one unbroken range: `date.dayOfWeek(time) <= 5` is a weekday test.

```openscript
version 1
study("One weekday", overlay = true)

chosen = input(4, "Day to shade, 1 is Monday", min = 1, max = 7)
background(date.dayOfWeek(time) == chosen ? fade(aqua, 92) : none)
```

**Remarks.** The same numbering is used by the day list of [[session.isIn()]].

**See also.** [[session.isIn()]], [[date.startOfWeek()]]

{{entry: date.dayOfYear()}}

The day of the year, 1 on 1 January through 365, or 366 in a leap year.

```openscript
version 1
study("Day of the year", precision = 0)
plot(date.dayOfYear(time), "Day of the year", silver, style = "step")
```

**See also.** [[date.weekOfYear()]], [[date.year()]]

{{entry: date.weekOfYear()}}

The ISO week number: weeks start on Monday, and week 1 is the week that holds the year's first Thursday. So a week that straddles the new year belongs to the year holding most of it, and no year has a week 0. Monday 29 December 2025, for example, is in week 1 of 2026.

```openscript
version 1
study("Week numbers", overlay = true)

newWeek = date.weekOfYear(time) != date.weekOfYear(time[1])
if newWeek
    draw.label(time, low, "W" + text(date.weekOfYear(time)), textColor = gray)
```

**See also.** [[date.startOfWeek()]], [[date.dayOfWeek()]]

## Clock fields

{{entry: date.hour()}}

The hour of the timestamp on a 24 hour clock, 0 to 23, in the chart's timezone unless `zone` names another.

```openscript
version 1
study("Morning and afternoon", overlay = true)

morning = date.hour(time) < 12
background(morning ? fade(yellow, 94) : fade(blue, 96))
```

**Remarks.** Where a rule follows the exchange's hours, prefer [[session.isIn()]], or [[session.isFirstBar]] and [[session.isLastBar]] where the host states the session's hours. A window reads more plainly than a pair of hour and minute tests, and it does not change meaning when the chart's interval changes.

**See also.** [[date.minute()]], [[session.isIn()]]

{{entry: date.minute()}}

The minute of the hour, 0 to 59. Combined with [[date.hour()]], it places a bar on the clock.

```openscript
version 1
study("First half hour", overlay = true)

openingHalfHour = date.hour(time) == 9 and date.minute(time) < 45
background(openingHalfHour ? fade(aqua, 90) : none)
```

**See also.** [[date.hour()]], [[date.second()]]

{{entry: date.second()}}

The second of the minute, 0 to 59. On a chart of whole minutes it is 0 on every bar; it matters on a chart with bars shorter than a minute, or for a timestamp that did not come from a bar.

```openscript
version 1
study("Seconds past the minute", precision = 0)

wallSecond = date.second(chart.now())
plot(bar.isLast ? wallSecond : none, "Seconds past the minute on the wall clock", silver)
```

**See also.** [[date.minute()]], [[chart.now()]]

## Building and rounding a timestamp

{{entry: date.from()}}

Builds a timestamp from calendar fields, read as a wall clock time in the chart's timezone unless `zone` names another. Use it for a fixed date, such as the start of a period you want to study.

```openscript
version 1
study("Since 1 January 2025", overlay = true)

start = date.from(2025, 1, 1, 9, 15)
plot(time >= start ? close : none, "Close since the start date", aqua)
```

**Remarks.** Every field must be a whole number, or the result is `none`. A field outside its normal range is not refused; it rolls over into the next unit. Month 13 is January of the next year, day 0 is the last day of the month before, and hour 25 is 01:00 the next day. Keep each field in its normal range unless that roll-over is what you want.

**See also.** [[date.format()]], [[input()]]

{{entry: date.startOfDay()}}

Midnight at the start of the timestamp's day, in the chart's timezone. Subtract it from [[time]] to get how far into the day a bar is.

```openscript
version 1
study("Minutes since midnight", precision = 0)

minutesIntoDay = (time - date.startOfDay(time)) / 60000
plot(minutesIntoDay, "Minutes since midnight", silver)
```

**Remarks.** A day is not a session. For a session that runs past midnight, reset state on the session's first bar instead; see [[session.isFirstBar]].

**See also.** [[date.startOfWeek()]], [[date.isSameDay()]]

{{entry: date.startOfWeek()}}

Midnight at the start of the Monday of the timestamp's week. Comparing it with the previous bar's value is a clean test for the first bar of a new week.

```openscript
version 1
study("Weekly VWAP", overlay = true)

newWeek = date.startOfWeek(time) != date.startOfWeek(time[1])
plot(vwapAnchor(hlc3, newWeek), "VWAP from the week's first bar", aqua)
```

**See also.** [[date.startOfMonth()]], [[vwapAnchor()]]

{{entry: date.startOfMonth()}}

Midnight on the first day of the timestamp's month.

```openscript
version 1
study("Monthly VWAP", overlay = true)

newMonth = date.startOfMonth(time) != date.startOfMonth(time[1])
plot(vwapAnchor(hlc3, newMonth), "VWAP from the month's first bar", orange)
```

**See also.** [[date.startOfWeek()]], [[date.month()]]

{{entry: date.isSameDay()}}

True when two timestamps fall on the same calendar day in the chart's timezone. It compares the whole date, so two bars a month apart are never the same day. When either timestamp is absent, the answer is `none`.

```openscript
version 1
study("New calendar day", overlay = true)

// bar.isFirst guards bar 0, where time[1] is absent.
newDay = bar.isFirst or not date.isSameDay(time, time[1])
background(newDay ? fade(aqua, 88) : none)
```

**Remarks.** For an NSE session, the first bar of a new calendar day is the session's first bar, which makes this the usual stand-in for [[session.isFirstBar]] on a host that states no session hours. On a session that runs past midnight the date changes in the middle of trading, so there it is not a stand-in.

**See also.** [[session.isFirstBar]], [[date.startOfDay()]]

## Writing a timestamp as text

{{entry: date.format()}}

Writes a timestamp as text following a pattern, for labels, tables and messages. The pattern uses a small, closed set of placeholders; every other character is copied as written.

```openscript
version 1
study("Date stamp", overlay = true)

panel = table("Last bar", 1, 2, position = "bottomRight")
if bar.isLast
    cell(panel, 0, 0, "Opened")
    cell(panel, 0, 1, date.format(time, "EEE dd MMM yyyy, HH:mm"))
```

| Placeholder | Writes |
|---|---|
| `yyyy` | Four digit year |
| `MM` | Two digit month |
| `dd` | Two digit day |
| `HH` | Two digit hour, 24 hour clock |
| `mm` | Two digit minute |
| `ss` | Two digit second |
| `MMM` | Three letter month, such as `Mar` |
| `EEE` | Three letter weekday, such as `Fri` |

| Pattern | Writes, for 09:15 on Friday 14 March 2025 |
|---|---|
| `"yyyy-MM-dd"` | `2025-03-14` |
| `"dd MMM yyyy"` | `14 Mar 2025` |
| `"EEE HH:mm"` | `Fri 09:15` |
| `"HH:mm:ss"` | `09:15:00` |
| `"EEE dd MMM yyyy, HH:mm"` | `Fri 14 Mar 2025, 09:15` |

**Remarks.** Month and weekday names are English and the same on every machine, so a label never changes with the viewer's language settings. The pattern is read from left to right taking the longest placeholder at each point, so `MMM` is a month name and is not read as `MM` followed by `M`. Anything that is not a placeholder is copied as it is: `"MMMM"` writes `MarM`, and a lone `M`, `d` or `yy` is copied as those letters.

**See also.** [[text()]], [[cell()]], [[draw.label()]]

## Planned

{{entry: date.add()}}

Calendar arithmetic that respects month lengths and clock changes, such as adding one month to a timestamp. It is planned, and using it is `OS2020`. Until it arrives, add a fixed number of milliseconds for days, hours and minutes, and build month boundaries with [[date.from()]].

## Related

[Sessions and time](/script/data/sessions-and-time), [session.*](/script/reference/session), [chart.*](/script/reference/chart), [Price and volume](/script/reference/price-and-volume), [Strings](/script/reference/string).
