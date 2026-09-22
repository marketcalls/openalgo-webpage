---
title: Price and volume
description: The per-bar values every script reads by bare name, open, high, low, close, volume, open interest, the averaged prices and the bar's time, with what each holds on a forming bar and when it is absent.
---

These are the values a script reads without declaring anything: the bar's four prices, its volume and open interest, four averaged prices built from them, and the instant the bar opened. Each one is a `series number`: it has a value on every bar and accepts `[n]` to read an earlier bar, so `close[1]` is the previous bar's close.

Almost every study starts here, so it is worth knowing two things before you use them. On the newest bar of a moving chart, `high`, `low`, `close` and `volume` are still changing. And `volume` and `oi` are absent, not zero, on a bar for which the host (the application that runs the script and feeds it bars, such as the /trading page) supplies none.

```openscript title="Reading the bar"
version 1
study("Bar anatomy", precision = 2)

body      = close - open
upperWick = high - max(open, close)
lowerWick = min(open, close) - low

plot(body, "Body", close >= open ? lime : red, style = "histogram")
plot(upperWick, "Upper wick", silver)
plot(-lowerWick, "Lower wick", gray)
```

| Value | On a bar still forming |
|---|---|
| `open` | Fixed at the first trade of the interval |
| `high` | Can only rise |
| `low` | Can only fall |
| `close` | The last traded price, so it moves both ways |
| `volume` | Grows |
| `time` | Fixed: the bar's opening instant |
| Anything read with `[1]` or older | Fixed for good |

## Prices of the bar

{{entry: open}}

The price of the first trade in the bar's interval. On a 5 minute NIFTY futures chart, the 09:15 bar's `open` is the first traded price of the session, which is why gap studies compare it with the previous bar's close.

```openscript
version 1
study("Opening gap", precision = 2)

gap = open - close[1]
plot(gap, "Gap from the previous close", gap >= 0 ? lime : red, style = "histogram")
```

**Remarks.** `open` is fixed once the bar's first trade prints, so a condition built only from `open` and older bars does not change while the bar forms.

**See also.** [[close]], [[ohlc4]], [[session.isFirstBar]]

{{entry: high}}

The highest traded price in the bar's interval. On the forming bar it can only rise, and it is final once the bar is confirmed.

```openscript
version 1
study("Twenty bar high", overlay = true)

prevHigh = highest(high, 20)[1]
plot(prevHigh, "Highest high of the previous 20 bars", aqua, style = "step")
if close > prevHigh
    signal("BREAKOUT")
```

**Remarks.** Take the window's high from the previous bar, `highest(high, 20)[1]`, when you test a breakout. The current bar's own high is always inside its own window, so `close > highest(high, 20)` can never be true.

**See also.** [[low]], [[highest()]], [[hl2]]

{{entry: low}}

The lowest traded price in the bar's interval. On the forming bar it can only fall.

```openscript
version 1
study("Swing low stop", overlay = true)

stopLevel = lowest(low, 10)[1]
plot(stopLevel, "Lowest low of the previous 10 bars", red, style = "step")
```

**See also.** [[high]], [[lowest()]], [[hl2]]

{{entry: close}}

The bar's closing price. On a bar that is still forming it is the latest traded price, so it moves up and down until the bar closes. It is the usual source for most indicators.

```openscript
version 1
study("Close and its mean", overlay = true)

plot(close, "Close", silver)
plot(sma(close, 20), "SMA 20", orange)
```

**Remarks.** `close` is the one name with two meanings. Read bare, it is this price. Written as a call, `close()` is the order that flattens a strategy's position, documented at [[close()]]. The compiler tells them apart by the brackets. In a study, `close()` is `OS7001`.

A condition on `close` can be true and then false within one forming bar. Signals, alerts and orders wait for the bar to close by default, so they act only on the final value. Read `close[1]` when you want a value that is already settled.

**See also.** [[open]], [[hlc3]], [[bar.isConfirmed]]

## Volume and open interest

{{entry: volume}}

The quantity traded during the bar: shares for an NSE or BSE equity, contracts or units for a derivative. On the forming bar it grows with every trade.

```openscript
version 1
study("Volume and its mean", format = "volume")

showVolume = chart.hasVolume != false     // true when the host says yes or says nothing
avgVolume = sma(volume, 20)
plot(showVolume ? volume : none, "Volume", close >= open ? fade(lime, 40) : fade(red, 40), style = "column")
plot(showVolume ? avgVolume : none, "20 bar mean", orange)
```

**Remarks.** `volume` is absent, not zero, on a bar for which the host supplies no volume. Zero is a real reading that means nobody traded; a volume nobody reported is a different fact. Anything computed from an absent `volume` is absent too, so a volume study draws a gap there rather than a flat line. Whether an index such as the NIFTY 50 arrives with no volume or with zeros depends on the data source, so use the futures contract when you need volume for an index.

[[chart.hasVolume]] says whether the host supplies volume at all, but a host may leave it unstated, and the /trading chart does in this release. That is why the example writes `chart.hasVolume != false`: it hides the volume only when the host says there is none.

**See also.** [[chart.hasVolume]], [[vwap()]], [[obv()]], [[relativeVolume()]]

{{entry: oi}}

Open interest: the number of futures or options contracts outstanding at the end of the bar. It is what lets you read positioning on NFO and MCX contracts, which price and volume alone cannot show.

```openscript
version 1
study("Open interest change", format = "volume")

oiChange = oi - oi[1]
plot(oiChange, "Change in open interest", oiChange >= 0 ? aqua : orange, style = "histogram")
```

**Remarks.** `oi` is absent where the host supplies no open interest, which is the normal case for a cash equity or an index, and then the example draws nothing. Open interest is a level at a moment, while volume is a flow over the bar, so when bars are combined into a coarser timeframe, the coarser bar's open interest is the last reading inside it, never the sum.

The classic reading: price rising with open interest rising suggests new positions being built, and price rising with open interest falling suggests existing short positions being closed.

**See also.** [[chart.hasOpenInterest]], [[volume]], [[change()]]

## Averaged prices

Four combinations of the bar's prices, provided so you do not write the arithmetic by hand each time. Each has a value on bar 0 whenever the prices do.

{{entry: hl2}}

The bar's midpoint, `(high + low) / 2`. It ignores where the bar opened and closed, so it suits studies that care about the range, such as channel midlines.

```openscript
version 1
study("Midpoint trend", overlay = true)
plot(ema(hl2, 21), "EMA of the midpoint", aqua)
```

**See also.** [[hlc3]], [[ohlc4]], [[supertrend()]]

{{entry: hlc3}}

The typical price, `(high + low + close) / 3`. It is what [[vwap()]] averages by default and what [[cci()]] measures, and it is a steadier source than `close` alone.

```openscript
version 1
study("Typical price mean", overlay = true)
plot(ema(hlc3, 21), "EMA of the typical price", orange)
```

**See also.** [[hl2]], [[hlcc4]], [[vwap()]]

{{entry: ohlc4}}

The average of all four prices, `(open + high + low + close) / 4`. It smooths out a bar whose close landed at an extreme.

```openscript
version 1
study("Average price", overlay = true)
plot(sma(ohlc4, 10), "SMA of the average price", silver)
```

**See also.** [[hlc3]], [[hlcc4]]

{{entry: hlcc4}}

The close-weighted average, `(high + low + close + close) / 4`. It counts the close twice, so it follows the close more closely than [[hlc3]] while still using the range.

```openscript
version 1
study("Close weighted mean", overlay = true)
plot(ema(hlcc4, 20), "EMA of the close weighted price", aqua)
```

**See also.** [[hlc3]], [[ohlc4]], [[close]]

## Time of the bar

{{entry: time}}

The instant the bar opened, as a number of milliseconds since 1 January 1970 in UTC. Because it is an ordinary number, you can subtract two times to get an elapsed duration, compare a bar's time with a date you built, or store it to find a bar again later.

```openscript
version 1
study("Minutes since the day's first bar", precision = 0)

newDay = bar.isFirst or not date.isSameDay(time, time[1])
var dayStart = none
if newDay
    dayStart = time

plot((time - dayStart) / 60000, "Minutes since the day's first bar", aqua, style = "step")
```

**Remarks.** The number is the same everywhere; turning it into a date or a clock time depends on a timezone. The [date functions](/script/reference/date) read it in the chart's timezone by default, which is Asia/Kolkata on the /trading chart, so `date.hour(time)` of the first NSE bar is 9 and `date.minute(time)` is 15.

Store `time`, not [[bar.index]], when you want to recognise a bar later. A bar index shifts when more history loads; a time does not.

**See also.** [[date.format()]], [[date.hour()]], [[chart.now()]], [[session.isIn()]]

{{entry: timeClose}}

The instant the bar's interval ends, in UTC milliseconds. It is planned: until it arrives, add the interval to `time`, as `time + chart.intervalMinutes * 60000` on an intraday chart.

## Related

[Bar state](/script/reference/bar), [Chart facts](/script/reference/chart), [Bars and history](/script/language/bars-and-history), [Absent values](/script/language/absent-values), [Realtime and confirmation](/script/language/realtime-and-confirmation).
