---
title: book.*
description: Books. Every leg a strategy declares, managed as one position, with a combined stop and target, a profit lock, an entry window, a time exit, an expiry square-off and a daily loss limit. Planned in version 0.5.0.
---

A strategy's **book** is every leg it has declared, taken together (a leg is one contract the strategy trades; see [leg.*](/script/reference/legs)). The `book` namespace will manage that whole position as one: enter all the legs in one decision, stop out on their combined profit, lock in profit as it grows, take entries only inside a time window, **square off** (close every leg) at a set time or before expiry, and stop trading for the day after a set loss.

It matters most for option structures on NFO. A short straddle or strangle is two options sold together, a call and a put, each hedging the other. Stopping each leg on its own is the classic way to take two losses on a day the pair was doing its job. **Measure the stop on the sum, never on a leg.** The book is the language's place for rules measured on the sum.

**Every entry on this page is planned.** In version 0.5.0 a strategy trades one leg, the instrument on its chart, and calling any `book.*` name is refused where you write it with OS2020. This page documents what each call will do, and shows the same rules written by hand for the one leg you can trade today.

## What you can write today

Most of the book rules can be written for a single position in a few lines. This strategy enters at most one long position a day, on a crossover inside a 09:30 to 11:00 window, and applies three rules measured on the position's profit in money: a money stop, a profit lock that activates and then advances, and a time exit from 15:00.

```openscript title="Book rules by hand"
version 1
strategy("Book rules by hand", overlay = true, precision = 2,
         capital = 500000, qtyType = "units", product = "intraday",
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

lots       = input(1,    "Lots", min = 1, max = 50)
stopMoney  = input(6000, "Stop, in money", min = 100)
activateAt = input(4000, "Lock profit once up this much", min = 100)
lockAt     = input(2000, "Then keep at least this much", min = 0)
stepMoney  = input(2000, "Raise the floor for every further", min = 100)
advance    = input(1500, "Raise it by", min = 0)

// The zone is written out so the windows also work in the Backtest panel.
zone       = "Asia/Kolkata"
lotUnits   = max(orElse(chart.lotSize, 1), 1)
pointValue = orElse(chart.pointValue, 1)

inWindow = session.isIn("0930-1100", zone)
exitTime = not session.isIn("0915-1500", zone)
newDay   = bar.isFirst or not date.isSameDay(time, time[1], zone)
goLong   = crossUp(ema(close, 9), ema(close, 21))

// The position's profit in money, valued at the close.
profit = pos.isFlat ? none : (close - pos.avgPrice) * pos.size * pointValue

var peak         = none
var lockFloor    = none
var enteredToday = false

if newDay
    enteredToday = false

// The floor appears once the peak reaches activateAt, and rises one advance
// for every further step the peak reaches. The peak never falls, so neither
// does the floor.
if pos.isFlat
    peak      = none
    lockFloor = none
else if not isNone(profit)
    peak = isNone(peak) ? profit : max(peak, profit)
    if peak >= activateAt
        lockFloor = lockAt + floor((peak - activateAt) / stepMoney) * advance

stopHit = profit <= -stopMoney
lockHit = not isNone(lockFloor) and profit <= lockFloor

if pos.isLong and (exitTime or stopHit or lockHit)
    close()
else if goLong and inWindow and pos.isFlat and not enteredToday
    buy(qty = lots * lotUnits, tag = "entry")
    enteredToday = true

// The two money levels, drawn as prices.
perPoint = pos.isFlat ? none : pos.size * pointValue
plot(pos.isFlat ? none : pos.avgPrice - stopMoney / perPoint, "Money stop", red, style = "step")
plot(isNone(lockFloor) ? none : pos.avgPrice + lockFloor / perPoint, "Profit floor", lime, style = "step")
```

The money amounts suit one lot of a NIFTY future on a 15-minute chart; scale them to your instrument, because on a single share of a stock they are never reached and every trade ends at the time exit. Remember too that the window only admits a trade on a bar where the crossover happens, so on a quiet day it trades nothing.

Two differences from the planned rules are worth knowing. A rule written in the script acts on the bar its condition is true and fills at the next fill point, so it exits at the next bar's open rather than at the level. And two rules cannot be written exactly by hand yet: the daily loss limit needs realised profit, which a script cannot read until [[pos.netProfit]] or [[order.avgFill()]] lands, and the expiry square-off needs the contract's expiry, which [[chart.expiry]] will supply and which is planned too.

To measure a two-leg structure on its sum today, open one leg's chart and read the other with [[req.symbol()]]. This study, put on the call's chart, draws the combined premium of a straddle (the call and the put at the same strike and expiry):

```openscript title="Straddle premium"
version 1
study("Straddle premium", precision = 2)

putLeg = input("", "The put's symbol")

// "developing" pairs each chart bar with the put's bar at the same time; the
// default would hand back the put's previous bar.
putPrice = req.symbol(putLeg, chart.interval, close, mode = "developing")
premium  = close + putPrice

plot(premium, "Combined premium", orange, width = 2)
```

The line stays empty until you type the put's symbol into the study's settings, and on any bar where the put has no price, because the sum of a price and an absent value is absent. `mode = "developing"` is what makes the sum a sum of one instant: a read in the default mode at the chart's own interval is one bar behind, as [Other instruments](/script/data/other-instruments#which-bar-a-read-gives-you) explains. The read uses the chart's own exchange unless you name another. A strategy can trade the leg on its chart and stop it on that sum: script 12 in [Example scripts](/script/getting-started/example-scripts) is written that way, and that page explains what it still needs from /trading before it trades. The Backtest panel holds only the chart's own bars, so it refuses any script that reads another instrument, before the first bar, with OS6006; run it on the chart instead.

## The shape a book will take

Declared, a short strangle on NIFTY weekly options (a call two strikes above the money and a put two strikes below it, both sold) becomes two legs and a handful of rules. The block below is the planned shape, and version 0.5.0 refuses it with OS2020.

```openscript expect=OS2020 title="Planned: a short strangle managed as one book"
version 1
strategy("Short strangle, one book", precision = 2,
         capital = 500000, qty = 1, qtyType = "lots", product = "intraday",
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

lots = input(1, "Lots per leg", min = 1, max = 50)

leg.relative("ce", "NIFTY", "option", expiryRank = 0, strikeOffset = 2,
             right = "call", exchange = "NFO", side = "sell", qty = lots)
leg.relative("pe", "NIFTY", "option", expiryRank = 0, strikeOffset = -2,
             right = "put", exchange = "NFO", side = "sell", qty = lots)

// Session rules.
book.entryWindow("0920-1030:12345")
book.exitAt("1500")
book.squareOffAtExpiry(15)
book.dailyLoss(15000)

// Combined rules, measured on the sum of both legs.
book.stop(6000)
book.target(9000)
book.lockProfit(4000, 2000, step = 2000, advance = 1500)
book.trailStopsToEntry(3000)

newDay = bar.isFirst or not date.isSameDay(time, time[1], "Asia/Kolkata")

var enteredToday = false
if newDay
    enteredToday = false

if not enteredToday and not book.isOpen
    book.enter(tag = "strangle")
    enteredToday = true

plot(book.profit, "Book profit", aqua, width = 2)
```

Each rule call sets a level that stays in force until it is replaced, so writing the rules at the top level, where they run on every bar, is the ordinary shape. Passing `none` removes a rule; unlike an order argument, an absent level is not refused.

## Two shapes

A strategy takes one of two shapes, and the shape decides what a combined rule means.

| Shape | Entered with | Legs open and close | Combined rules |
|---|---|---|---|
| **As a unit** | [[book.enter()]] and [[book.exit()]] | Together, in one decision | Allowed, and measured from the trade's start |
| **Per leg** | [[leg.enter()]] and [[leg.exit()]], or [[buy()]], [[sell()]], [[close()]], [[exit()]], [[order.place()]] and [[order.reverse()]], which are the same calls written the short way | Each on its own signal | Refused |

[[book.profit]] is measured from the last moment the book was flat. In a strategy entered as a unit that moment is the start of the current trade, because the book is flat between trades, so a combined stop is a stop on that trade. In a per-leg strategy the book may never be flat, and a combined stop would measure from a moment no rule chose and no reader could name, which is worse than no stop at all, because it looks like one. So two refusals will be made before the first bar:

- A file that calls [[book.enter()]] or [[book.exit()]] and also any per-leg entry or exit is refused.
- A file that calls [[book.stop()]], [[book.target()]], [[book.lockProfit()]] or [[book.trailStopsToEntry()]] without [[book.enter()]] is refused, and the fix names [[leg.stop()]] and [[leg.target()]].

Both hold in a one-leg file too, so a script does not change meaning on the day it grows a second leg. A per-leg strategy uses a stop, a target and a trail on each leg, and the session rules below, which are measured from things a reader can name.

## Entering and exiting as a unit

{{entry: book.enter()}}

Will enter the whole book in one decision: one order per declared leg, each on the leg's declared side and quantity. It is the entry for a structure whose legs only make sense together, such as a straddle.

{{entry: book.exit()}}

Will exit the whole book in one decision: one order for every leg that holds a position.

## Combined rules

These are measured on [[book.profit]], in money, and each squares off every leg when it fires. They belong to a book entered as a unit.

{{entry: book.stop()}}

Will square off every leg when the book's profit falls to `-amount`. `book.stop(6000)` means "take the whole structure off if this trade is six thousand down".

{{entry: book.target()}}

Will square off every leg when the book's profit reaches `amount`.

{{entry: book.lockProfit()}}

Will protect profit once it arrives: nothing happens until the book's profit first reaches `activateAt`, then a floor exists at `lock`, and with `step` and `advance` the floor rises by `advance` for every further `step` of profit reached. When the profit falls to the floor, every leg is squared off. `step` and `advance` are given together or not at all; one without the other is OS3009.

**Remarks.** Read `book.lockProfit(4000, 2000, step = 2000, advance = 1500)` as "once I am four thousand up, I keep at least two thousand of it, and for every further two thousand I reach, I raise that line by fifteen hundred":

| Best profit reached so far | Floor |
|---|---|
| Below 4,000 | None yet |
| 4,000 | 2,000 |
| 6,000 | 3,500 |
| 8,000 | 5,000 |
| 10,000 | 6,500 |

In general the floor stands at `lock + n * advance`, where `n` is the largest whole number for which the profit has reached `activateAt + n * step`. The floor never moves down. Waiting for `activateAt` keeps the lock from acting on a trade that never got going, and a floor that never falls keeps it from turning into a looser second stop halfway through a good day.

{{entry: book.trailStopsToEntry()}}

Will move every leg's stop to that leg's own entry price once the book is `at` in profit, turning a winning structure's stops into break-even stops.

## Session rules

These gate entries and square off on the clock. Unlike the combined rules, they suit both shapes.

{{entry: book.direction()}}

Will restrict which sides an entry may take: `"long"`, `"short"` or `"both"`. An entry on a side the filter excludes is refused and recorded, not sent.

{{entry: book.entryWindow()}}

Will allow new entries only inside a window written `"HHMM-HHMM"` with an optional list of weekdays, 1 for Monday to 7 for Sunday: `"0920-1030:12345"` is 09:20 to 10:30, Monday to Friday, the same form [[session.isIn()]] takes. A window that does not parse is OS3008.

{{entry: book.exitAt()}}

Will square off every leg at a time written `"HHMM"` in the chart's time zone, such as `"1500"` to be flat half an hour before the NSE close. A time that is not four digits is OS3008.

{{entry: book.squareOffAtExpiry()}}

Will square off a leg `minutesBefore` minutes before its contract expires, so a strategy never holds an option or future into settlement, an event no price rule can see coming.

{{entry: book.dailyLoss()}}

Will square off every leg and take no new entry for the rest of the day once the day's loss reaches `amount`. It tests [[book.dayProfit]], which is measured from this session's open, so the limit means today and not the whole run.

**Remarks.** The end-of-day square-off is not a book call. It is the declaration's `closeOnSessionEnd` option, one spelling of one rule. In version 0.5.0 the option is accepted and not yet acted on, so write the exit in the script as well; [Exiting on the clock](/script/strategies/exits-and-brackets#exiting-on-the-clock) shows how.

## Reading the book

{{entry: book.profit}}

Will read the book's profit in money: the open profit of every leg plus everything the strategy realised since the book was last flat. It is what the combined rules measure.

{{entry: book.dayProfit}}

Will read the same profit measured from this session's open, which is what [[book.dailyLoss()]] tests.

{{entry: book.isOpen}}

Will be true while any leg holds a position. `not book.isOpen` is the entry guard for a book entered as a unit.

## When the rules are tested

Every rule is evaluated once per bar, after the script's own statements for that bar have run, in this fixed order. The order is part of the language, so two engines running the same script close the same positions on the same bar.

1. The daily loss limit.
2. The exit time, then the end-of-day square-off, then the expiry square-off.
3. The combined stop, then the combined target.
4. The profit lock: activate the floor, then advance it, then test it.
5. The move of every stop to its entry.
6. Each leg in declaration order: its stop, then its target, then its trail, as the [leg.* page](/script/reference/legs#how-levels-on-a-leg-will-be-tested) describes.

A rule that squares the book off ends the sequence for that bar: the rules below it have nothing left to act on. The book rules come before the leg rules so that when a combined limit takes the whole book off, the record names the rule that did it.

## The named events

Every change a rule causes will be recorded as a named event, with the bar's time, the leg where there is one, the rule's level and the value that crossed it. After a bad day the log then says which rule fired, not only that the position closed.

| Event | Recorded when |
|---|---|
| `combinedStopHit` | The book's profit fell to the combined stop and the book was squared off |
| `combinedTargetHit` | The book's profit reached the combined target and the book was squared off |
| `lockProfitActivated` | The book's profit first reached `activateAt` and a floor now exists |
| `lockProfitFloorAdvanced` | The floor moved up a step |
| `lockProfitTriggered` | The book's profit fell to the floor and the book was squared off |
| `trailToEntryActivated` | Every leg's stop was moved to its own entry |
| `sessionEndSquareOff` | `closeOnSessionEnd` flattened the book at the session's close |
| `exitTimeSquareOff` | [[book.exitAt()]] flattened the book at its time |
| `expirySquareOff` | A leg was closed because its contract was about to expire |
| `dailyLossHit` | The day's loss reached the limit; the book is off and no entry is taken for the rest of the day |
| `entryRefused` | An entry was refused by the direction filter, the entry window or a daily loss already hit, naming which |

To read a log after a bad day, find the last square-off event of the day first: it names the rule and carries the level, so you see at once whether the level was the one you meant. Then read back to the last `entryRefused` to see why entries stopped. A `combinedStopHit` with no leg stop on the same bar is exactly right, because the book rule took the position off and the leg rules had nothing left to act on. Events reach the run's record and the log; no call reads one, because a script that branched on its own stop having fired would be deciding twice what the rule already decided once.

## Related

[Legs and books](/script/strategies/multi-leg-and-books), [Exits and brackets](/script/strategies/exits-and-brackets), [Other instruments](/script/data/other-instruments), [leg.*](/script/reference/legs), [pos.*](/script/reference/position), [Strategy orders](/script/reference/strategy), [Sessions and time](/script/data/sessions-and-time).
