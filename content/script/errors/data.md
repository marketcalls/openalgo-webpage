---
title: OS6xxx Data
description: The errors about the data a script runs on: timeframes, request expressions, other instruments, the bars themselves, the compiled program and backtest settings.
---

This page covers the OS6xxx codes of OpenScript (also called OpenAlgo Script): the errors about the data a script is given and the data it asks for. They cover timeframes written in a request, other instruments, the bars the engine receives, the facts about an instrument, the compiled program a host loads, and the settings of a backtest run. Many of them are not mistakes in your script at all but answers from the host or faults in the data, and the explanations below say so wherever that is the case, so you know whether to change the script or look elsewhere.

## When they appear

| When | Codes | What happens |
|---|---|---|
| When the script compiles | [OS6001](#os6001), [OS6003](#os6003) | Shown in the console under the editor. Nothing runs |
| When the program loads, before bar 0 | [OS6001](#os6001) for a timeframe from an input, [OS6002](#os6002), [OS6004](#os6004), [OS6006](#os6006), [OS6012](#os6012), [OS6015](#os6015) to [OS6019](#os6019) | The study or run is refused whole and nothing is drawn. On a chart, /trading shows the code and the message in a notice |
| When the bars arrive, or while they run | [OS6010](#os6010), [OS6011](#os6011), [OS6005](#os6005) | The run stops at that bar, as for any [runtime error](/script/errors/runtime#when-they-appear) |
| When the host answers a request | [OS6007](#os6007), [OS6008](#os6008), [OS6009](#os6009), [OS6014](#os6014) | Nothing stops. The read is absent, and [[req.error()]] returns the message |
| Before a backtest's first bar | [OS6020](#os6020), [OS6021](#os6021), [OS6023](#os6023), and [OS6022](#os6022) on a replay | The run is refused and nothing is computed. Of these, only OS6021 can appear in the Backtest panel, which shows the code and the message |
| Not raised in version 0.5.0 | [OS6013](#os6013) | The shape it describes is refused earlier, when the script compiles |

The **host** named throughout this page is the application the engine runs inside. It supplies the bars and the facts about the instrument, and answers requests for other data. In OpenAlgo it is the /trading page for charts and backtests, and the strategy runner on the OpenAlgo server for a deployed strategy.

The request answers deserve a note of their own. A read that the host cannot answer does not stop the study: everything that does not depend on it keeps drawing, the read is absent, and [[req.error()]] on the read's name returns the message with the host's reason. A study that shows that reason, as the example below does, never leaves you guessing at an empty line. See [Other instruments](/script/data/other-instruments).

## A request written to avoid them

This study colours the bars by the daily trend on an intraday chart. The timeframe comes from an input, everything computed on the daily bars is inside the request expression, and a table in the corner says whether the daily data arrived.

```openscript title="Daily trend filter"
version 1
study("Daily trend filter", overlay = true)

tf = input("1D", "Higher timeframe", kind = "interval")
len = input(20, "Average length", min = 1, max = 200)

// Everything computed on the daily bars goes inside the request expression,
// and the timeframe comes from an input, so both are fixed before bar 0
// (OS6003, OS6013).
dailyAvg = req.timeframe(tf, ema(close, len))
dailyUp = req.timeframe(tf, close > ema(close, len))

plot(dailyAvg, "Daily average", orange, style = "step")
barColor(isNone(dailyUp) ? none : (dailyUp ? lime : red))

// A read the host could not answer is absent, and req.error says why
// (OS6007, OS6008, OS6009, OS6014).
why = req.error(dailyAvg)
status = table("Status", 1, 1, position = "topRight")
if bar.isLast
    cell(status, 0, 0, why != "" ? why : "Daily data ready")
```

## Timeframes

A timeframe is written as a string: a count and a unit, or a bare number of minutes. See [Timeframes](/script/data/timeframes) and [Higher timeframes](/script/data/higher-timeframes).

{{screen: interval-menu}}

{{error: OS6001}}

The units are case sensitive:

| Unit | Means | Examples |
|---|---|---|
| `m` | Minutes | `"1m"`, `"5m"` |
| `h` | Hours | `"1h"` |
| `D` | Days | `"1D"`, `"2D"` |
| `W` | Weeks | `"1W"` |
| `M` | Months | `"1M"`, `"3M"` |
| none | Minutes | `"15"`, `"60"` |

So `"1M"` is one month and `"1m"` is one minute, and `"60"` and `"1h"` are the same timeframe. Anything else is refused: a word such as `"hourly"`, a lower-case day or week such as `"1d"`, or `"D"` with no count. A timeframe written in the source is checked when the script compiles; one that comes from an [[input()]] is checked when the study loads, with the same code.

One case catches people out on /trading. The chart's daily interval is named `D`, which is not a timeframe the language reads, so `req.timeframe(chart.interval, close)` compiles and is then refused with this code when the study loads on a daily chart. Write `"1D"` in the request instead of passing [[chart.interval]]. The Backtest panel states the same chart as `"1D"`, so there the request runs.

{{error: OS6002}}

Folding bars upward works: twelve 5 minute bars make an hour. Folding downward cannot, because the chart was never given the prices inside its own bars, and a study that invented them would repaint. So a request for an interval finer than the chart's, such as `"5"` on a 60 minute chart, is refused when the study loads, naming both intervals. If you need 5 minute detail, put the chart on 5 minutes and read the coarser interval from there.

{{error: OS6015}}

An intraday request is built by counting chart bars into groups, so its interval must be a whole multiple of the chart's. On a 5 minute chart, `"15"` and `"60"` fold cleanly; on a 30 minute chart, `"45"` does not, because 45 minutes is one and a half chart bars. Day, week and month requests are built from the calendar and the session instead, so they are exempt. The study is refused when it loads, and the fix names an interval that works.

{{error: OS6014}}

A timeframe can be well formed and still be one the data source does not store for this instrument, such as 3 minute bars from a feed that keeps 1 and 5 minute bars. The host answers with the intervals it does serve, and the message lists them. Like the other request answers on this page, it stops nothing: the read is absent and [[req.error()]] carries the message. Request one of the listed intervals, or a coarser one that folds from them.

{{error: OS6013}}

The symbol and the timeframe of a request are settled once, before the first bar, so that the host can fetch each series once and keep it in step with the chart. A request whose identity changed from bar to bar would need a new fetch on a bar that had already been drawn.

**Not raised yet.** In version 0.5.0 nothing raises OS6013, because nothing can reach it: a timeframe or a symbol computed from bar data, like the one in the example below, is refused when the script compiles, with [OS3003](/script/errors/arguments#os3003). Take the timeframe from a literal or from an [[input()]] with `kind = "interval"`, as the fix does.

## Request expressions

{{error: OS6003}}

The expression passed to [[req.timeframe()]] or [[req.symbol()]] is computed on the requested bars, in their own time: daily bars for a `"1D"` read, the other instrument's bars for a symbol read. A value computed on the chart's own bars, such as a 20 bar average of 5 minute closes, has no meaning on a daily bar, so the compiler refuses it.

In version 0.5.0 the only names from the rest of the file the expression can read are inputs, the names an [[input()]] assigns. Every other name is refused, even one that holds a plain number:

```openscript expect=OS6003
k = 20
d = req.timeframe("1D", sma(close, k))
plot(d, "Daily average")
```

Write numbers and arithmetic inside the expression instead, such as `sma(close, 2 * 10)`, or make the number an input. Move any calculation inside the expression, so it is computed on the requested bars, as the example at the top of this page does with `ema(close, len)`, where `len` is an input.

## Instruments and their facts

{{error: OS6007}}

The host resolves every symbol a script names against the instruments it can serve. When it does not know the symbol on the exchange named, or on the chart's own exchange when the read names none, the read is refused with this code rather than returned empty, because an empty series looks exactly like an instrument that did not trade. The rest of the study keeps drawing, the read is absent, and [[req.error()]] returns the message.

Check the spelling and the exchange. In OpenAlgo an index has an exchange code of its own: NIFTY is read with `exchange = "NSE_INDEX"`, not `"NSE"`, and an option or future on it with `exchange = "NFO"`. See [Other instruments](/script/data/other-instruments).

{{error: OS6008}}

The host found the instrument and had no bars for it over the range the chart covers. A futures or options contract that has expired, one that had not been listed yet, and a range older than the stored history all end here. As with OS6007, the read is absent, [[req.error()]] carries the message, and the rest of the study keeps drawing.

For NFO and MCX contracts, which expire on a fixed schedule, read the contract that was trading over the chart's range, or move the chart into the period the contract traded.

{{error: OS6009}}

The host knows the instrument and could not get its bars: the data source refused, did not answer, or limited how often it may be asked. The message carries the host's own reason, and that reason is the thing to act on: it describes a connection, permission or quota problem, not a problem in your script. The read is absent and [[req.error()]] carries the message.

If the value can be worked out from the chart's own bars, such as the day's high on an intraday chart, derive it and drop the request, as the fix below does with [[session.isFirstBar]]. That fix needs the instrument's session hours, which /trading reads from the market calendar. On a host that states none, reset on a new IST date instead, which works everywhere:

```openscript
newDay = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")

var dayHigh = none
if newDay
    dayHigh = high
else
    dayHigh = max(dayHigh, high)

plot(dayHigh, "Day high so far", aqua, style = "step")
```

{{error: OS6012}}

Tick size, lot size, the trading session and the timezone come from the host's record of the instrument, not from the bars. In version 0.5.0 the engine raises this code when it loads a program and that record cannot be read: a session stated without the timezone it is measured in, a timezone the calendar does not know, or session hours not written as `HH:MM`. It is a problem in the host's record, not in your script.

A fact the host simply leaves out does not raise this code. [[chart.tickSize]] or [[chart.lotSize]] reads as absent, [[roundToTick()]] returns absent, and an order priced or sized from them stops with [OS7002](/script/errors/orders#os7002). On /trading `chart.lotSize` comes from the platform's record of the instrument, and it is absent for a symbol whose contract the platform does not hold, so a study that works in money can take the lot size from an [[input()]] instead, as the fix below does. You can also meet this code's message without an error: a daily, weekly or monthly read on a host that states no timezone is absent, and [[req.error()]] returns this message for it.

{{error: OS6005}}

A timezone is named by area and location, such as `"Asia/Kolkata"` or `"UTC"`, from the host's timezone database. An abbreviation such as `"IST"` is not a timezone name, because several abbreviations mean different offsets in different parts of the world, and a session test cannot carry that ambiguity. An unknown name stops the study on the first bar that calls the function.

Write `"Asia/Kolkata"` for Indian exchanges, or leave the argument out to use the chart's own timezone. See [Sessions and time](/script/data/sessions-and-time).

## The bars the engine is given

{{error: OS6010}}

A script is the body of a loop over the chart's bars, and with no bars there is nothing to run. The engine says so rather than drawing an empty pane, which would look like a script that computed nothing. The message names the symbol and the interval.

It means the instrument has no history at that interval in the range loaded: a contract before it was listed, an interval the chart has no data for, or a date range with no trading in it. Choose an instrument and interval that have history, or widen the range.

{{error: OS6011}}

Everything in the language assumes that bar times strictly increase: the history operator, warmup and every session test depend on it. When the host hands over a bar whose time is not after the one before it, a duplicate or a bar out of order, the engine refuses it rather than computing quietly wrong values, and names the bar.

This is a problem in the data feed or the host, not in your script. Reload the history. If the same bar repeats, the feed is sending duplicates, and the host has to sort and deduplicate the bars before the engine runs.

## Loading a compiled program

A **compiled program** is what the compiler turns your source into: a list of instructions the engine runs, stored as data. The chart and the Backtest panel compile your source afresh each time they run it. Saving a script in the Scripts panel also stores its compiled program beside the source, and that stored program is what a strategy deployed from the Strategies panel runs on the OpenAlgo server.

Three of the codes in this group, [OS6004](#os6004), [OS6016](#os6016) and [OS6018](#os6018), are about a stored program rather than your source, and the cure for them is the same: open the script and save it again, so it is recompiled by the compiler you have now. A deployment refused this way says so in its log and asks you to do exactly that. See [The editor](/script/getting-started/the-editor#saving).

{{error: OS6004}}

A compiled program carries its own table of the library functions it calls, with the number of arguments each takes, and the engine checks every entry against its own library when it loads the program. A mismatch means the program was compiled against a different version of the library, and running it could compute wrong numbers before anything noticed.

You meet this only when a compiled program moves between versions, for example a program stored before an upgrade. Recompile the script from its source with the engine you run it on.

{{error: OS6006}}

A compiled program lists the capabilities it needs, such as `orders` for a strategy that places orders or `req.symbol` for a read of another instrument, and an engine that lacks one refuses the program when it loads, naming the capability. Refusing before the first bar is better than meeting an instruction the engine cannot run halfway through the chart.

In the /trading Backtest panel this is the refusal a strategy meets when it reads another instrument with [[req.symbol()]]: a backtest is given only the chart's own bars and cannot fetch another instrument's. The same read works on the chart. Remove the feature the message names, or run the program where it is available.

{{error: OS6016}}

The compiled program is a versioned data format, 1.1 in this release. An engine loads a program whose major number (the part before the dot) matches its own, whatever the minor number after it, and refuses one whose major number differs, older or newer, rather than guessing at instructions it cannot read. The message gives both numbers.

Recompile the script from its source with the compiler that matches the engine: in /trading, open the script and save it.

{{error: OS6017}}

The first line of a script, `version 1`, names its language version, and the program compiled from it carries that number. An engine runs every language version it implements exactly as before, and refuses one it does not have rather than running it approximately, because a saved script has to keep producing the same numbers. Version 0.5.0 implements language version 1.

A program compiled from a newer language version needs a newer engine, or a recompile against a version this engine has.

{{error: OS6018}}

Before an engine runs a program, it checks that the program is well formed: every instruction points at something that exists, and every field has the shape the format requires. A program that fails is refused whole, before any bar, and the message says where it failed. A program straight from the compiler passes, so a failure means the stored program was damaged or edited after it was compiled. Recompile it from the source.

In version 0.5.0 the compiler itself can also report OS6018 on a line, beside another error such as [OS2005](/script/errors/names-and-types#os2005) for a function that calls itself, or [OS3003](/script/errors/arguments#os3003). Fix the other error and it goes with it. If OS6018 is the only diagnostic on an unchanged script, the fault is in the compiler, and its message asks you to report it with the script. See [Reading an error](/script/errors/overview).

{{error: OS6019}}

Every [[input()]] validates what the settings supply: the type, a number's `min` and `max`, and membership of an `options` list. When a setting falls outside those rules, for example a length of 0 saved before the script added `min = 1`, the study is refused when it loads, rather than quietly running with the default, because a settings dialog that ignores what you typed is worse than one that tells you the value is out of range. The message names the input, the value and the rule it broke.

Correct the value in the study's settings, or widen the input's own rules so the value is allowed. See [Inputs](/script/inputs/inputs).

## Backtest runs

A backtest states everything it is carried out under before its first bar, and refuses a setting it cannot carry out rather than producing a figure that means something else. In the Backtest panel a refused run shows the code and the message, and nothing is computed, so correcting the setting and running again costs one run. See [Backtesting](/script/strategies/backtesting).

The Backtest panel fetches exactly the bars of the date range you pick, reports on all of them, and supplies no charge schedule of its own, so of the four codes below only [OS6021](#os6021) can appear there. The other three come from backtests you run through the library. See [Backtesting API](/script/integrate/backtesting-api).

{{error: OS6020}}

A backtest run through the library can report on a date window narrower than the bars it was given. When that window holds none of those bars, such as a range entirely before the loaded history or one that falls inside a gap in the data, there is nothing to report, and the run is refused rather than shown as a flat equity curve that would say nothing happened.

Widen the window, or choose one that overlaps the loaded bars. Both ends are inclusive and are compared with the bars' own times, not with the calendar, so a window that falls inside a gap is empty however wide it looks. In the Backtest panel an empty date range stops earlier, with the panel's own message that no bars came back for that range.

{{error: OS6021}}

A setting can be well formed and still impossible to carry out on this run. In version 0.5.0 the common cause is sizing: a backtest fills in units and keeps no running equity, so `qtyType = "cash"` and `qtyType = "equityPercent"` are refused, and so is `qtyType = "lots"` on an instrument whose lot size is not known. Slippage stated in ticks when there is no tick size to measure a tick in is refused the same way, and so is a charge levied on another charge that is declared after it. The message names the setting and the reason.

Count in units, or in lots on an instrument that states its lot size. In the Backtest panel only the refusal of `"cash"` and `"equityPercent"` can happen: the panel reads the tick and lot size from OpenAlgo's record of the instrument, and when it has none it runs with a tick of 0.05 and a lot of 1 and says so under the report, so check that line before trusting a result counted in lots. See [Position and sizing](/script/strategies/position-and-sizing) and [Costs and fills](/script/strategies/costs-and-fills).

{{error: OS6022}}

A saved run record names the exact bars it was made from by a hash, so a replay can prove it is repeating the same run. Bars do get revised: a feed corrects a price, a session is extended, a split is applied to history. When the bars supplied now hash differently from the ones in the record, the replay is refused rather than reporting the old figures over new data.

You meet this only when you replay records through the library. Replay against the bars the record names, or, where the revision is the point, make a new record over the revised bars and compare the two runs. See [Backtesting API](/script/integrate/backtesting-api).

{{error: OS6023}}

A strategy's own `commission` and a charge schedule supplied by the host running the backtest describe the same money. Applied together they would charge it twice, and applied one at a time they would charge whichever an engine happened to prefer, which is a rule nobody wrote down. So a run that has both is refused before the first bar. The message gives the commission the declaration states.

Keep one of the two: leave `commission` at its default of 0 when a schedule is supplied, or supply no schedule. A schedule can say more, such as a floor, a cap, a charge on another charge, or a cost on one side of the trade only. The Backtest panel supplies no schedule, so there the declaration's `commission` always applies and this code never appears.

**Related.** [Timeframes](/script/data/timeframes), [Higher timeframes](/script/data/higher-timeframes), [Other instruments](/script/data/other-instruments), [Sessions and time](/script/data/sessions-and-time), [Backtesting](/script/strategies/backtesting), [Reading an error](/script/errors/overview)
