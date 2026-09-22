---
title: Requests
description: The req functions, reading a value computed on a coarser timeframe or on another instrument, the mode that decides what a read may know, and the status calls that say whether the answer has arrived.
---

A study sees the bars of its own chart. The `req` functions let it see further: a daily value on a five minute chart, the NIFTY index beside a stock, two option legs added into one premium. [[req.timeframe()]] reads an expression computed on a coarser interval of the chart's own instrument, [[req.symbol()]] reads one computed on another instrument, and [[req.isReady()]] and [[req.error()]] tell the script whether the answer has arrived. Two more, [[req.candle()]] and [[req.events()]], are planned. This page is the reference for all six in OpenScript (also called OpenAlgo Script).

```openscript title="A stock against the index"
version 1
study("Relative strength", precision = 4)

indexName     = input("NIFTY", "Index")
indexExchange = input("NSE_INDEX", "Index exchange")

// The index's close at the chart's own interval. "developing" pairs each
// chart bar with the index bar at the same time (see The mode, below).
idx = req.symbol(indexName, chart.interval, close, exchange = indexExchange, mode = "developing")

// Absent until the index answers, so the line simply starts then.
ratio = close / idx

plot(ratio, "Close over index", aqua, width = 2)
plot(sma(ratio, 20), "Average of the ratio", fade(silver, 40))

// Red if the read failed, grey while it is still loading.
background(req.error(idx) != "" ? fade(red, 90) : (req.isReady(idx) ? none : fade(gray, 94)))
```

## How a read works

A read takes an expression and computes it as a program of its own over the requested bars. Inside the expression, [[open]], [[high]], [[low]], [[close]], [[volume]] and [[time]] are the requested instrument's, at the requested interval, and every indicator reads those bars: `req.timeframe("1D", ema(close, 20))` is a 20 day average of daily closes, not a longer average of five minute closes. The result is then lined up with the chart's bars by timestamp, one value per chart bar, and it has the type of the expression: a number, a `bool` for a comparison, a `string` for text.

History counts differently inside and outside the read:

| Expression | `[1]` counts | On a 5 minute chart at 11:20 it holds |
|---|---|---|
| `req.timeframe("1D", high)` | | Yesterday's high: the last day that closed |
| `req.timeframe("1D", high[1])` | Days | The high of the day before yesterday |
| `req.timeframe("1D", high, mode = "developing")` | | Today's high so far |
| `req.timeframe("1D", high)[1]` | Chart bars | Yesterday's high again: what the read held at 11:15 |

{{screen: higher-timeframe}}

Inside the expression you may write literals and [[input()]] calls, and read a name from the rest of the file only when that name holds an `input()`. Any other name is error `OS6003`, because a name computed on the chart's own bars has no meaning on the requested bars. That includes a name that holds a plain number, such as `n = 20`: write the `20` inside the expression instead. A `var` that starts from an input counts as computed too, because a later line may change it.

```openscript expect=OS6003
myAtr = atr(14)
wide  = req.timeframe("1D", high - low > myAtr)
plot(wide ? 1 : 0, "Wide day")
```

A read computes a value; it does not act or draw. An order call inside the expression is error `OS7003`, and a drawing, marker or alert call is error `OS3006`. The symbol and the timeframe are part of what the host, the application running the script such as the /trading page, fetches, so they too are fixed before the first bar: write each as a literal or an `input()`, because one that depends on bar data is error `OS3003`.

## The mode

**`mode` decides what a read is allowed to know on a bar where the coarser bar has not finished.** It is the argument that makes a repainting study impossible to write by accident, because the default never repaints and the other two have to be written out.

| `mode` | On a chart bar inside an unfinished coarse bar, it returns | Repaints | First value |
|---|---|---|---|
| `"confirmed"` | The last coarse bar that closed, held until the next one closes. The default | Never | Once the first coarse bar has closed |
| `"developing"` | The coarse bar so far | On the newest bars, while the coarse bar forms | Once the first coarse bar has begun |
| `"lookahead"` | The coarse bar's final value | On history, always | Wherever the coarse bar exists |

On a five minute chart reading `req.timeframe("1D", high)`, a bar at 11:00 today holds yesterday's high in `"confirmed"`, today's high so far in `"developing"`, and today's final high in `"lookahead"`, which no one could have known at 09:15. Only the first is a number a rule could have acted on at 11:00, so for a timeframe coarser than the chart's it is the only mode a signal, an alert or an order should be built on. A backtest of a rule that reads `"lookahead"` looks excellent and means nothing.

### Reading at the chart's own interval

A read at the chart's own interval, usually of another instrument, follows the same rule, and the result surprises people. On a five minute chart, the other instrument's 11:00 bar has not closed when the chart's 11:00 bar opens, so a `"confirmed"` read gives the 11:00 chart bar the other instrument's 10:55 bar: every value is one bar behind. Where the other instrument has no bar at all, a `"confirmed"` read keeps holding an older value rather than going absent.

To pair each chart bar with the other instrument's bar at the same time, as a ratio, a spread or a combined premium needs, write `mode = "developing"`. On history each chart bar then gets the other instrument's bar at the same time, a chart bar with no counterpart is absent, and only the value on the newest bar can change, until that bar closes, just as the chart's own `close` does.

| On a five minute chart, at the 11:00 bar | `mode = "confirmed"` | `mode = "developing"` |
|---|---|---|
| The other instrument traded at 11:00 | Its 10:55 bar | Its 11:00 bar |
| The other instrument has no 11:00 bar | An older bar, held | Absent |

### Warnings

The compiler warns about a `"lookahead"` read with `OS8005`. A `"developing"` read carries no warning: the mode written on the line is its disclosure. A file that sets `onUnconfirmed = true` gets warning `OS8002` on every read in the file, whatever its mode or interval, because a forming chart bar that reads another bar still forming can be withdrawn twice over. [Repainting](/script/data/repainting) covers the subject in full.

## Timeframes

A timeframe is a count and a unit, written as a string. The unit letters are case sensitive.

| Written | Means |
|---|---|
| `"1m"`, `"5m"`, `"15m"` | Minutes |
| `"1h"`, `"4h"` | Hours |
| `"1D"` | One day |
| `"1W"` | One week |
| `"1M"` | One month. `"1m"` is one minute |
| `"60"` | A bare number is minutes, so this is `"1h"` |

Take a timeframe from the reader with `input("1D", "Timeframe", kind = "interval")`. A string the language does not recognise is error `OS6001`. Two more rules depend on the chart, so they are checked when the study loads, and a study that breaks either is refused before its first bar: a timeframe finer than the chart's is `OS6002`, because a daily chart does not contain the five minute bars that made it, and an intraday timeframe that is not a whole multiple of the chart's, such as `"45m"` on a `"30m"` chart, is `OS6015`. Day, week and month reads are grouped by the calendar in the instrument's timezone and are exempt from the multiple rule. [Timeframes](/script/data/timeframes) covers intervals in full.

## When a read fails

A read that cannot be answered is never an empty series, which would look exactly like an instrument that did not trade. It stays absent on every bar, [[req.isReady()]] stays false, and [[req.error()]] returns a sentence naming the problem. The rest of the study keeps drawing.

| Code | When |
|---|---|
| `OS6007` | The host does not know the symbol on that exchange |
| `OS6008` | The instrument resolved, but has no bars over the chart's range |
| `OS6009` | The data source refused or did not answer; the sentence carries the host's own reason |
| `OS6014` | The feed does not store that interval for the instrument; the sentence lists the intervals it has |
| `OS6012` | A day, week or month read, and the host stated no timezone for the chart's instrument |

A few problems stop the whole study instead, when it loads and before its first bar, so nothing is drawn:

| Code | When |
|---|---|
| `OS6002` | A timeframe finer than the chart's |
| `OS6015` | An intraday timeframe that is not a whole multiple of the chart's |
| `OS6006` | The host cannot serve reads of other instruments at all |
| `OS5006` | The file makes more reads than the host allows |

Each distinct symbol, exchange and timeframe is one series the host fetches and keeps in step with the chart, so make one read per series, give it a name and reuse the name. Arithmetic on reads you already have is free: the midpoint of yesterday's range is `(prevHigh + prevLow) / 2`, not a third read.

## Reads in /trading

| Where the script runs | [[req.timeframe()]] | [[req.symbol()]] |
|---|---|---|
| On the chart, as a study | Folded from the chart's bars. Day, week and month reads use the chart's timezone, Asia/Kolkata unless changed in the chart settings | Fetched through the chart's own data feed |
| In the Backtest panel | Intraday reads work. Day, week and month reads are absent on every bar, because the run is not told the chart's timezone | The run is refused before its first bar with `OS6006` |

The /trading chart does not tell a study its instrument's exchange, so [[chart.exchange]] is `none` there. A [[req.symbol()]] call that names no `exchange` is fetched on the chart's own exchange, which suits a peer stock on the same exchange; name `exchange` whenever the other instrument trades elsewhere, such as `NIFTY` on `NSE_INDEX` from an NSE stock chart.

/trading calls its daily interval `D`, which is not a timeframe the language reads, so on a daily chart a read that passes [[chart.interval]] stops the study with `OS6001`. Write `"1D"` there instead.

## Reading another timeframe

{{entry: req.timeframe()}}

Reads an expression computed on a coarser interval of the chart's own instrument, and returns its value on each chart bar. Use it for a daily trend filter on an intraday chart, yesterday's high and low as levels, or the hourly RSI beside the five minute one.

```openscript
version 1
study("Previous day levels", overlay = true, precision = 2)

// "confirmed" is the default: these are yesterday's numbers, and they never repaint.
prevHigh  = req.timeframe("1D", high)
prevLow   = req.timeframe("1D", low)
prevClose = req.timeframe("1D", close)

// Derived, not a fourth read.
prevMid = (prevHigh + prevLow) / 2

pHigh = plot(prevHigh, "Previous high", aqua, width = 2, style = "step")
pLow  = plot(prevLow, "Previous low", orange, width = 2, style = "step")
plot(prevClose, "Previous close", silver, style = "step")
plot(prevMid, "Previous mid", fade(silver, 50), style = "step")
fill(pHigh, pLow, color = aqua, opacity = 0.05)
```

A picture of the finished daily candle, drawn across history, is the one honest use of `"lookahead"`. The compiler warns on each read, and the study must never be used for a decision:

```openscript expect=OS8005
version 1
study("Daily candle", overlay = true)

o = req.timeframe("1D", open,  mode = "lookahead")
h = req.timeframe("1D", high,  mode = "lookahead")
l = req.timeframe("1D", low,   mode = "lookahead")
c = req.timeframe("1D", close, mode = "lookahead")

plotCandles(o, h, l, c, "Daily", colorUp = fade(lime, 60), colorDown = fade(red, 60))
```

**Remarks.** A `"confirmed"` read has no value until the first coarse bar has closed, plus the warmup of its expression: `req.timeframe("1D", ema(close, 20))` needs twenty closed days, so on an intraday chart its line starts about a month in. Draw a value that changes once per coarse bar with `style = "step"`. The mode must be written as a literal: an `input()` there is error `OS3003`, so no one can change how honest the study is from its settings dialog. A comparison with a read is `none` during warmup, and `none` takes the false branch of an `if`; write `not isNone(bias) and close > bias` when the difference between "no" and "not known yet" matters to you.

**See also.** [[req.symbol()]], [[plotCandles()]], [[input()]], [Higher timeframes](/script/data/higher-timeframes), [Repainting](/script/data/repainting)

## Reading another instrument

{{entry: req.symbol()}}

Reads an expression computed on another instrument, at the timeframe you name, and returns its value on each chart bar. Use it to measure a stock against the NIFTY index, a future against its spot, or to add two option legs into one premium. When you pair bars at the chart's own interval, pass `mode = "developing"`, as the examples here do; [Reading at the chart's own interval](#reading-at-the-chart-s-own-interval) explains why. Symbols are written as OpenAlgo writes them: `SBIN` on `NSE`, `NIFTY` on `NSE_INDEX`, a NIFTY future or option contract on `NFO`.

```openscript
version 1
study("Combined premium", precision = 2)

// Type the two contract symbols into the study's settings.
callLeg = input("", "Call leg")
putLeg  = input("", "Put leg")
legs    = input("NFO", "Legs exchange")
lots    = input(1, "Lots", min = 1, max = 100)
// chart.lotSize describes the chart's instrument, not the legs: enter the
// contract's current lot size here.
lotSize = input(1, "Units in one lot", min = 1)

callPrice = req.symbol(callLeg, chart.interval, close, exchange = legs, mode = "developing")
putPrice  = req.symbol(putLeg, chart.interval, close, exchange = legs, mode = "developing")

// If either leg has no bar at this instant, the sum is none, not half a position.
premium = callPrice + putPrice

plot(premium, "Combined premium", orange, width = 2)
plot(premium * lots * lotSize, "Position value", aqua, scale = "left")
```

**Remarks.** The read is absent until the host has fetched the other instrument's bars; when they arrive the study is calculated again over its whole history, so a line that appears a moment late did not repaint. With `mode = "developing"`, a chart bar with no counterpart, because the other instrument did not trade then, keeps different hours or had a holiday, is absent, and arithmetic with it is absent too. Hold a last value deliberately with [[valueWhen()]] if that is what you want, never with `orElse(read, 0)`, which would draw a zero price. [[chart.lotSize]], [[chart.tickSize]] and the rest of `chart.*` describe the chart's instrument, never the one you read, so take the other instrument's lot size as an input and check the current one for your contract. `exchange` defaults to [[chart.exchange]]; on /trading, see [Reads in /trading](#reads-in-trading). The `mode` argument works exactly as in [[req.timeframe()]]. A dedicated instrument picker for inputs is planned; until then the symbol is a text input.

**See also.** [[req.isReady()]], [[req.error()]], [[req.timeframe()]], [Other instruments](/script/data/other-instruments)

## Request status

{{entry: req.isReady()}}

True once the host has answered the read you pass in, and false while it is still being fetched. Pass the name you assigned the read to. Use it to show the reader that a study is loading, rather than leaving an empty pane that looks broken.

```openscript
version 1
study("Loading shade", precision = 2)

peer = req.symbol("RELIANCE", chart.interval, close, exchange = "NSE", mode = "developing")

plot(close / peer, "Close over RELIANCE", aqua)

// Grey until the other instrument's bars have arrived.
background(req.isReady(peer) ? none : fade(gray, 94))
```

**Remarks.** Ready means answered, not present. A [[req.timeframe()]] read of the chart's own bars is ready from the first bar, even while its value is still `none` during warmup, so test [[isNone()]] for the value and `req.isReady` for the answer. When a read fails, [[req.error()]] says why: test it first, as the example under that entry does.

**See also.** [[req.error()]], [[req.symbol()]], [[isNone()]]

{{entry: req.error()}}

The reason a read failed, as a sentence, or `""` when nothing went wrong, including while the read is still loading. Use it to tell the reader what to fix: a misspelt symbol, a missing interval, an unreachable data source.

```openscript
version 1
study("Peer status", precision = 2)

peerName     = input("RELIANCE", "Compare with")
peerExchange = input("NSE", "Its exchange")

peer = req.symbol(peerName, chart.interval, close, exchange = peerExchange, mode = "developing")
why  = req.error(peer)

plot(close / peer, "Close over peer", aqua)

panel = table("Status", 1, 2, position = "topRight", textColor = silver)
if bar.isLast
    cell(panel, 0, 0, peerName)
    cell(panel, 0, 1, why != "" ? why : (req.isReady(peer) ? "ready" : "loading"), textColor = why != "" ? red : (req.isReady(peer) ? lime : silver))
```

**Remarks.** The sentence names the problem, for example "The host does not know NOPE on NSE." for an unknown symbol (`OS6007`), or "The host did not supply a timezone for SBIN." for a daily read with no timezone (`OS6012`). Where the host gave its own reason, the sentence carries it. The code itself is not part of the string; the table under [When a read fails](#when-a-read-fails) lists the codes. A failed read leaves only itself absent: everything in the study that does not depend on it keeps drawing, which is why a comparison study should keep its own instrument's plots out of the read.

**See also.** [[req.isReady()]], [[table()]], [Other instruments](/script/data/other-instruments)

## Planned

{{entry: req.candle()}}

Will return a whole coarser bar at once, its open, high, low and close as one array, so a higher timeframe candle can be drawn with one read instead of four. It is planned and not part of version 0.5.0; until then, make one [[req.timeframe()]] read per price and pass them to [[plotCandles()]].

{{entry: req.events()}}

Will read scheduled corporate events for the chart's instrument, such as dividends and splits, as a series. It is planned and not part of version 0.5.0.

## Related

[Higher timeframes](/script/data/higher-timeframes), [Other instruments](/script/data/other-instruments), [Repainting](/script/data/repainting), [Timeframes](/script/data/timeframes), [chart.*](/script/reference/chart), [Absent values](/script/language/absent-values), [Backtesting](/script/strategies/backtesting).
