---
title: Legs and books
description: Options and multi-leg positions with leg.* and book.*. How straddles and strangles on index options will be declared, entered as a unit and managed with combined stops, and what you can build in version 0.5.0.
---

This page covers the multi-leg model of OpenScript: **legs**, each one contract a strategy trades, and the **book**, all of a strategy's legs taken together, with the rules that manage them. It is the model for option structures such as a short straddle or strangle on NIFTY or BANKNIFTY weekly options, where two or more contracts only make sense together and the risk belongs to the combination rather than to any one leg.

:::warn Planned in version 0.5.0
Every `leg.*` and `book.*` name on this page is planned. In version 0.5.0 a strategy trades one instrument, the one on its chart, and a call to any `leg.*` or `book.*` name is refused where you wrote it with OS2020. This page describes the design so you can plan for it, and the last section shows what you can build today.
:::

## Why multi-leg positions need their own model

Take a short straddle: sell the at-the-money call and the at-the-money put of the same NIFTY expiry, where at the money means the strike nearest the index's current level. If the index rises 150 points, the call loses and the put gains. If it falls, the reverse. The position makes money when the index stays near the strike and time passes, and loses when it moves far in either direction. That profile belongs to the pair, not to either leg.

A stop placed on each leg on its own gets this wrong in both directions. It fires on moves the combination absorbed, stopping out the losing leg on a day the other leg was paying for it, and it misses the losses that build slowly across both legs at once. **For a position like this, measure the stop on the sum.** Two single-instrument strategies running side by side are not a substitute: they are two strategies that each see half the position.

## A short straddle, as it will be written

Here is the design for a NIFTY short straddle entered once a day after the open, with a combined stop, a combined target, a profit floor, a clock exit and a square-off before expiry. It is shown so you can see the shape of the language; the compiler refuses it today with OS2020.

```openscript expect=OS2020 title="NIFTY short straddle (planned)"
version 1
strategy("NIFTY short straddle", precision = 2,
         capital = 1000000, qtyType = "lots", qty = 1,
         product = "intraday")

underlying = input("NIFTY", "Underlying")
lots       = input(1, "Lots per leg", min = 1, max = 50)

// Both legs are described, not named: the nearest expiry, at the money.
// The host resolves each description to one contract before the first bar.
leg.relative("ce", underlying, "option", expiryRank = 0, strikeOffset = 0,
             right = "call", side = "sell", qty = lots)
leg.relative("pe", underlying, "option", expiryRank = 0, strikeOffset = 0,
             right = "put", side = "sell", qty = lots)

// Rules the engine holds for the whole book, in money.
book.stop(6000)
book.target(9000)
book.lockProfit(4000, 2000, step = 2000, advance = 1500)

// Rules about the clock.
book.exitAt("1515")
book.squareOffAtExpiry(15)
book.dailyLoss(15000)

entryTime = session.isIn("0920-1000")

var enteredToday = false

if session.isFirstBar
    enteredToday = false

// One decision sends both legs their declared side and quantity.
if entryTime and not enteredToday and not book.isOpen
    book.enter(tag = "straddle")
    enteredToday = true

plot(book.profit, "Book profit", aqua, width = 2)
```

Read it top to bottom: two legs declared once, the rules that manage the book set once, and a single entry decision. There is no exit in the script at all. The combined stop, the combined target, the profit floor, the 15:15 exit and the expiry square-off are levels the engine holds and tests on every bar, in a fixed order, and each one records a named event when it fires.

## Legs

A **leg** is one contract a strategy trades, named by a string you choose. A file declares its legs once, at the top level, before the first bar. A file that declares none has exactly one leg, the instrument on its chart, which is every strategy in version 0.5.0.

There are two ways to declare one:

| Call | Declares |
|---|---|
| `leg.fixed(name, symbol, exchange, product, qty, side)` | A leg on a contract named outright, such as one futures contract |
| `leg.relative(name, underlying, kind, expiryRank, expiryCycle, strikeOffset, right, reference, exchange, product, qty, side)` | A leg on a contract described relative to an underlying: nearest expiry, at the money, call |

A relative leg is described field by field:

| Field | Holds | Default |
|---|---|---|
| `underlying` | The instrument the contract derives from, such as NIFTY | required |
| `kind` | `"future"` or `"option"` | required |
| `expiryRank` | `0` for the nearest expiry, `1` for the one after it | `0` |
| `expiryCycle` | Which series, where an exchange lists more than one (weekly and monthly) | the exchange's default series |
| `strikeOffset` | Strikes away from the money: `0` at the money, positive above, negative below | `0` |
| `right` | `"call"` or `"put"`, and absent for a future | none |
| `reference` | The price the offset is measured from | the underlying's price when the leg is resolved |
| `exchange`, `product`, `qty`, `side` | The leg's own bookkeeping: where it trades, the product, its size and whether the book buys or sells it | the chart's exchange, the declaration's product and size, `"buy"` |

The rules for declaring a leg follow from it being part of the strategy's fixed shape, like a plot. The compiler will apply them when legs land; today any `leg.*` call is refused with OS2020 before they are reached.

- **Top level only.** A leg inside an `if` or a function is refused with OS3006. You cannot hide a leg on some bars; declare it and decide per bar whether to send it an order.
- **Fixed before the first bar.** Every argument must be a literal, arithmetic over literals, or an [[input()]] call. A bar-dependent one is OS3003.
- **One name, one leg.** Two legs with the same name are OS3017, because every later call keys on the name.
- **A future has no right or strike.** `right` or `strikeOffset` given with `kind = "future"` is OS3010.

**The engine never builds a symbol.** A symbol format built for one exchange means nothing on another, so the description goes to the host and a resolved contract comes back. A description the host cannot resolve is OS6007, before the first bar, and the strategy does not start.

**A relative leg resolves once.** This is how you avoid closing a position you do not hold. A leg described as "nearest expiry, at the money, call" resolves on a quiet morning to one strike, and the entry carries that contract. If the description were resolved again at the exit, after NIFTY had moved 200 points, "at the money" would name a different strike: the closing order would go to a contract the strategy never held, and the one it does hold would stay open with nothing managing it. So the contract is fixed for the run, and five calls read it back:

| Call | Returns |
|---|---|
| [[leg.symbol()]] | The resolved contract, which is what the orders carried |
| [[leg.exchange()]] | The exchange the orders were sent to |
| [[leg.product()]] | The product actually sent |
| [[leg.expiry()]] | The contract's expiry, absent for a contract with none |
| [[leg.strike()]] | The contract's strike, absent for a contract with none |

Print them on the first bar of a strategy and the log answers "what did it actually trade" without anyone having to work out what was at the money that morning.

## Two shapes: as a unit, or per leg

A strategy takes one of two shapes, and the calls you use decide which.

| Shape | Entered and exited with | Suits |
|---|---|---|
| As a unit | [[book.enter()]], [[book.exit()]] | A position whose legs only make sense together: straddles, strangles, spreads |
| Per leg | [[leg.enter()]], [[leg.exit()]], and their short spellings [[buy()]], [[sell()]], [[close()]], [[exit()]], [[order.place()]], [[order.reverse()]] | Legs that open and close on their own signals |

`book.enter(tag)` sends every declared leg its declared side and quantity in one decision, and `book.exit(tag)` closes every open leg. `leg.enter(name, side, qty, limit, stop, tag)` and `leg.exit(name, qty, limit, stop, tag)` act on one leg at a time, filtered by [[book.direction()]], which limits entries to `"long"`, `"short"` or `"both"`. Every single-instrument strategy in version 0.5.0 is already the per-leg shape, written the short way.

**Why a combined stop fits only one shape.** [[book.profit]] is measured from the last moment the book was flat. In a strategy that enters as a unit, that moment is the start of the current trade, because the book goes flat between trades, so a combined stop is a stop on that trade: "square off when this straddle is six thousand down". In a per-leg strategy the book may never be flat: one leg closes as another opens and a third has been running since Tuesday. The window would start at a moment no rule chose and no reader could name, and a stop on an arbitrary window is worse than none, because it looks like a stop.

So the language refuses the combination rather than defining it. When books land, these two rules will be checked at compile time:

- A file that calls [[book.enter()]] or [[book.exit()]] and also any per-leg entry or exit is refused.
- A file that calls [[book.stop()]], [[book.target()]], [[book.lockProfit()]] or [[book.trailStopsToEntry()]] without [[book.enter()]] is refused, with the fix naming [[leg.stop()]] and [[leg.target()]].

Both hold in a one-leg file too. One rule that is always true is easier to hold in your head than one with an exception, and a script that grows a second leg later would otherwise change meaning on the day it grew it.

## Reading the legs

In a file with one leg, [[pos.size]], [[pos.avgPrice]] and the other single-position facts describe the position. In a file that declares more than one leg, those facts are refused at compile time: adding a quantity of one contract to a quantity of another is not a position in anything, and averaging two average prices gives a price at which nothing traded. Each leg is read by name instead:

| Call | Reads | When the leg is flat |
|---|---|---|
| [[leg.size()]] | Signed units this strategy holds in the leg | `0` |
| [[leg.isOpen()]] | Whether the leg holds a position | `false` |
| [[leg.avgPrice()]] | Average price of the leg's open position | absent |
| [[leg.entryTime()]] | When the leg's current position was opened | absent |
| [[leg.profit()]] | The leg's open profit in money, marked to this bar's close | `0` |
| [[leg.stopPrice()]], [[leg.targetPrice()]] | The stop and target actually in force | absent when none is set |

A leg has no equivalent of `pos.isLong`, `pos.barsHeld`, `pos.maxProfit` or `pos.maxLoss`: the sign of `leg.size()` answers the first, `leg.entryTime()` the second, and a `var` the script keeps the other two. [[pos.equity]], [[pos.netProfit]], [[pos.tradeCount]] and [[pos.isShared]] are money, counts and a yes or no, which do add across legs, so they read the whole strategy in every file.

## The book

The **book** is every leg a strategy has declared, taken together. It reads back three facts:

| Name | Reads |
|---|---|
| [[book.profit]] | The book's profit in money: every leg's open profit plus everything realised since the book was last flat |
| [[book.dayProfit]] | The same, measured from this session's open |
| [[book.isOpen]] | Whether any leg holds a position |

And it holds these rules. Each call sets a rule that stays in force until it is replaced, and passing `none` removes it.

| Call | Rule |
|---|---|
| [[book.stop()]] | Square off every leg when the book's profit falls to minus `amount` |
| [[book.target()]] | Square off every leg when the book's profit reaches `amount` |
| [[book.lockProfit()]] | Once profit reaches `activateAt`, keep a floor at `lock`, raised by `advance` for every further `step`; square off if profit falls to the floor |
| [[book.trailStopsToEntry()]] | Move every leg's stop to its own entry once the book is `at` in profit |
| [[book.entryWindow()]] | Allow new entries only inside a window such as `"0920-1100:12345"` |
| [[book.exitAt()]] | Square off every leg at a time such as `"1515"`, in the chart's timezone |
| [[book.squareOffAtExpiry()]] | Square off a leg this many minutes before its contract expires |
| [[book.dailyLoss()]] | Square off, and take no more entries today, once today's loss reaches `amount` |

A window that does not parse, a time that is not four digits, and a direction other than `"long"`, `"short"` or `"both"` are each refused with OS3008. `step` and `advance` go together or not at all; one without the other is OS3009.

**The profit floor, worked through.** `book.lockProfit(4000, 2000, step = 2000, advance = 1500)` does nothing until the book is 4,000 up. At that moment a floor exists at 2,000. For every further 2,000 of profit the floor rises by 1,500: at 6,000 it stands at 3,500, at 8,000 at 5,000. The floor never moves down. If the book's profit falls to the floor, every leg is squared off. Read as a sentence: once I am four thousand up I will not give back more than two thousand of it, and for every two thousand further I raise that line by fifteen hundred.

Two notes that each save a day. [[book.dailyLoss()]] tests [[book.dayProfit]], measured from this session's open, so the limit means today and not the whole backtest. And [[book.squareOffAtExpiry()]] is what keeps a strategy from holding a weekly option into settlement, a calendar event no price rule can see coming.

The order in which the book's rules and each leg's levels are tested on a bar, and the named events each one records, are on [Exits and brackets](/script/strategies/exits-and-brackets#when-a-held-level-is-tested).

## A short strangle with a stop on each leg

The straddle above measures its stop on the sum. A common alternative on a short strangle puts a stop on each leg, measured on that leg's own premium, and moves both stops to cost once the book is in profit. The language supports both; know which one you are writing, because a stop per leg will take the losing leg off on a day the other leg was paying for it. Per-leg levels are not entries or exits, so they sit alongside [[book.enter()]]. This is the design; it is refused today with OS2020.

```openscript expect=OS2020 title="BANKNIFTY short strangle (planned)"
version 1
strategy("BANKNIFTY short strangle", precision = 2,
         capital = 1000000, qtyType = "lots", qty = 1,
         product = "intraday")

underlying = input("BANKNIFTY", "Underlying")
lots       = input(1,  "Lots per leg", min = 1, max = 50)
stopPct    = input(30, "Stop per leg, percent of its premium", min = 5, max = 200)

// Two strikes out of the money on each side.
leg.relative("ce", underlying, "option", strikeOffset = 2,
             right = "call", side = "sell", qty = lots)
leg.relative("pe", underlying, "option", strikeOffset = -2,
             right = "put", side = "sell", qty = lots)

book.trailStopsToEntry(3000)
book.exitAt("1515")
book.squareOffAtExpiry(15)

entryTime = session.isIn("0920-1000")

var enteredToday = false

if session.isFirstBar
    enteredToday = false

if entryTime and not enteredToday and not book.isOpen
    book.enter(tag = "strangle")
    enteredToday = true

// A short leg's stop sits above the premium it was sold at, set once the leg
// has filled and its average price is known.
if leg.isOpen("ce") and isNone(leg.stopPrice("ce"))
    leg.stop("ce", roundToTick(leg.avgPrice("ce") * (1 + stopPct / 100)))

if leg.isOpen("pe") and isNone(leg.stopPrice("pe"))
    leg.stop("pe", roundToTick(leg.avgPrice("pe") * (1 + stopPct / 100)))

plot(book.profit, "Book profit", aqua, width = 2)
plot(leg.profit("ce"), "Call leg", orange)
plot(leg.profit("pe"), "Put leg", teal)
```

## What you can build in version 0.5.0

Until legs and books land, three patterns cover most of what options traders want from a script.

**Watch the combination with a study.** A study can read two option contracts with [[req.symbol()]] and plot their combined premium, so you see the straddle's value on one line, with a gap rather than a false number on any bar where one leg has no price. [Other instruments](/script/data/other-instruments) explains the read, and [Example scripts](/script/getting-started/example-scripts#6-combined-premium) walks through a complete combined-premium study.

**Trade one leg from its own chart.** Add a strategy to an option's chart and it trades that contract, in whole lots from [[chart.lotSize]], with every fill in its own books and a backtest that runs. This one sells the option once a day after 09:20, with a stop and a target measured from the premium it actually sold at, and exits before the close. **Premium** is the option's price, and a short option makes money as the premium falls:

```openscript title="Short option, premium stop"
version 1
strategy("Short option, premium stop", precision = 2,
         capital = 1000000, qtyType = "units",
         product = "intraday", pyramiding = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

lots      = input(1,  "Lots", min = 1, max = 50)
stopPct   = input(30, "Stop, percent of the entry premium", min = 1, max = 500)
targetPct = input(50, "Target, percent of the entry premium", min = 1, max = 99)

lotUnits = max(orElse(chart.lotSize, 1), 1)

// Every clock test names the zone, so it holds in the Backtest panel as well
// as on the chart. A new IST date is a new session.
newDay    = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")
entryTime = session.isIn("0920-1000", "Asia/Kolkata")
lateDay   = not session.isIn("0915-1500", "Asia/Kolkata")

var doneToday = false

if newDay
    doneToday = false

// Measured from the fill: pos.avgPrice is the premium actually sold at.
stopLevel   = pos.isShort ? roundToTick(pos.avgPrice * (1 + stopPct / 100)) : none
targetLevel = pos.isShort ? roundToTick(pos.avgPrice * (1 - targetPct / 100)) : none

hit    = pos.isShort and high >= stopLevel
banked = pos.isShort and low <= targetLevel

if entryTime and pos.isFlat and not doneToday
    sell(qty = lots * lotUnits, tag = "premium")
    doneToday = true
else if pos.isShort and (hit or banked or lateDay)
    close()

plot(stopLevel,   "Stop",   red,  style = "step")
plot(targetLevel, "Target", lime, style = "step")
plot(pos.isShort ? pos.avgPrice : none, "Premium sold", fade(silver, 40), style = "step")
```

The entry window is tested against the time each bar starts, and its end is exclusive, so make it wider than the chart's interval: on a 15-minute chart no bar starts inside `"0920-0930"`, while `"0920-1000"` holds the 09:30 and 09:45 bars. The size counts in units computed from the lot size, for the reason [Position and sizing](/script/strategies/position-and-sizing#where-a-size-comes-from) gives. The stop and target are rules the script tests, because /trading does not act on [[exit()]] levels in 0.5.0. To deploy it from the Strategies panel, replace the clock tests with a window built from arithmetic on [[time]], as [Sessions and time](/script/data/sessions-and-time#sessions-and-the-clock-in-trading-today) shows, because the runner refuses to start a script that reads the calendar.

**Manage two legs from one chart, with limits.** A strategy on one leg's chart can read the other leg with [[req.symbol()]], manage the combined premium, trade its own leg, and raise an [[alert()]] for the other leg that you route yourself. The combined stop then measures the right thing, but only the chart's leg is in the strategy's books, the other leg's fills are not, and the version 0.5.0 backtest refuses such a strategy before the first bar with OS6006, because a backtest is given the chart's own bars and cannot supply another instrument's. Treat it as a bridge until [[book.enter()]] lands, not as a two-leg strategy.

**Related.** [Overview](/script/strategies/overview), [Orders](/script/strategies/orders), [Exits and brackets](/script/strategies/exits-and-brackets), [Position and sizing](/script/strategies/position-and-sizing), [Reading the books](/script/strategies/reading-the-books), [leg.* reference](/script/reference/legs), [book.* reference](/script/reference/books)
