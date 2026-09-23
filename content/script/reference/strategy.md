---
title: Strategy orders
description: The six order calls of a strategy file. buy and sell enter, close flattens, exit sets a stop and a target, cancel and cancelAll withdraw orders that have not filled.
---

This page documents the six calls a strategy uses to trade: [[buy()]] and [[sell()]] to enter, [[close()]] to flatten, [[exit()]] to attach a stop and a target, and [[cancel()]] and [[cancelAll()]] to withdraw orders that have not filled. Most OpenScript strategies (OpenScript is also called OpenAlgo Script) need nothing else. All six compile and run in version 0.5.0; the one with a caveat is [[exit()]], whose levels are not filled yet, as its entry explains.

Two words recur below. A **fill** is the execution of an order at a price, reported back by the order's **destination**, whatever receives it: the simulated venue of a backtest or of the chart, or OpenAlgo for a deployed strategy. A **resting** order is a limit or stop order that waits for the market to reach its price, and it is **working** until it fills or is cancelled.

All six work only in a file declared with `strategy()`. In a `study()` file the compiler refuses them with OS7001 and names the declaration to change. The general forms in the `order` namespace, [[order.place()]], [[order.reverse()]] and [[order.bracket()]], are on the [order.* page](/script/reference/orders).

## A complete example

A breakout strategy for 15-minute bars on an NSE stock or an NFO future. While the trend is up it rests a buy stop order just above the high of the last 20 bars and sends a protective stop with it. It withdraws the order if the trend turns before it fills. From the first bar that opens at 15:00, it withdraws anything still working and closes any position.

```openscript title="Stop entry with a bracket"
version 1
strategy("Stop entry with a bracket", overlay = true, precision = 2,
         capital = 500000, qty = 1, product = "intraday",
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

length   = input(20,  "Breakout lookback", min = 2, max = 500)
stopMult = input(2.0, "Stop, in ATR", min = 0.2, max = 20)

atrValue  = atr(14)
rangeHigh = highest(high, length)[1]
trendUp   = close > ema(close, 50)

// Every price an order sees is on a tick and tested for absence first.
trigger   = isNone(rangeHigh) ? none : roundToTick(rangeHigh)
stopPrice = isNone(trigger) ? none : roundToTick(trigger - stopMult * atrValue)
ready     = not isNone(trigger) and not isNone(stopPrice)

// The zone is written out so the windows read Indian time on any host.
inHours = session.isIn("0930-1430", "Asia/Kolkata")
lateDay = not session.isIn("0915-1500", "Asia/Kolkata")

// The script remembers its own resting order and the stop it sent.
var working   = false
var entryStop = none

if not pos.isFlat
    working = false
if pos.isFlat and not working
    entryStop = none

// One chain, so no two orders from this script can go out on the same bar.
if lateDay and working
    cancelAll()
    working = false
else if pos.isLong and (lateDay or low <= entryStop)
    close()
else if working and not trendUp
    cancel("breakout")
    working = false
else if ready and inHours and trendUp and pos.isFlat and not working
    entryStop = stopPrice
    buy(stop = trigger, tag = "breakout")
    exit(tag = "breakout", stop = entryStop)
    working = true

plot(trigger, "Entry trigger", aqua, style = "step")
plot(entryStop, "Protective stop", red, style = "step")
plot(pos.isFlat ? none : pos.avgPrice, "Average price", fade(silver, 40), style = "step")
```

Three things in it are worth knowing before you adapt it:

- **The stop is also tested by the script** (`low <= entryStop`). The stop sent with [[exit()]] is handed on as an instruction, and neither the backtest nor the chart fills it, so without the script's own test no trade in a backtest would ever stop out.
- **The time windows name their zone**, `"Asia/Kolkata"`. The /trading chart, its Backtest panel and the Strategies panel all state the instrument's zone, so there the zone only makes the intent plain; on a host that states none, [[session.isIn()]] with no zone has no value on any bar, and a strategy guarded by it never trades. [Backtesting](/script/strategies/backtesting) lists what the Backtest panel does not act on yet.
- **It is for the chart and the Backtest panel.** The Strategies panel refuses to start a strategy that calls [[exit()]]. [Sandbox and live](/script/strategies/sandbox-and-live) lists what the runner needs from a script.

The fills of a strategy are marked on the chart where they happened, as in this run of another strategy on a 15-minute NSE chart:

{{screen: strategy-on-chart}}

## What every order call shares

| Rule | What it means for you |
|---|---|
| Nothing is sent at the call | The call records a request. The request is applied at the end of the bar, and only once the bar is confirmed, meaning its interval has ended (unless the declaration sets `onUnconfirmed = true`), so a condition that was true halfway through a bar and false at its close places nothing. That is also why every order call returns nothing: there is no order yet to hand back. |
| Position facts follow fills | [[pos.size]] and the rest change when a fill arrives, not when you call [[buy()]]. With the default `fillOn = "nextOpen"`, a market order decided on one bar fills at the next bar's open, and the position shows from that bar. |
| Left out is not absent | An argument you leave out takes its default: `buy()` uses the declaration's `qty` and, with no price, is a market order. An argument you write whose value comes out [absent](/script/language/absent-values) (`none`, no value on this bar) is refused with OS7002, naming the argument. |
| A refusal stops the run | A refused order stops the script on the bar it happened, on the chart and in a backtest alike. Nothing that bar decided is sent, including orders from lines that ran before the refused one, and no later bar runs. |
| No opposite orders on one bar | A buy and a sell decided on the same bar are refused with OS7013. A [[close()]] of a long position is a sell, so `close()` and `buy()` on one bar are refused as well (with OS7008 first, when the buy would also exceed `pyramiding`). Write your conditions as one `if` and `else if` chain. Two orders on the same side are ordinary. |
| One leg | A file in version 0.5.0 trades exactly one instrument, the one on its chart. The `leg` argument that [[buy()]], [[sell()]], [[close()]] and [[exit()]] accept is for the planned [multi-leg strategies](/script/reference/legs), and writing it today is refused with OS3023. |

**Whether a tag must name something is written in its default.** A tag is a name you give an order. A tag that defaults to `""` is a **label**: it rides along to the destination and to the trade list, and it names nothing that has to exist. [[buy()]], [[sell()]] and [[exit()]] take labels. A tag that is required, or that defaults to `none`, is a **reference**: it names orders the strategy has already placed. [[cancel()]] requires one and [[close()]] defaults to `none`, and a tag there that names no order is a mistake the language reports. [Tags: naming an order](/script/strategies/orders#tags-naming-an-order) explains the habit of giving every order a tag.

```openscript expect=OS3023
version 1
strategy("A leg that does not exist", overlay = true, qty = 1)

goLong = crossUp(ema(close, 9), ema(close, 21))

if goLong and pos.isFlat
    buy(leg = "main")
```

## Entering

[[buy()]] and [[sell()]] share one shape. The kind of order is decided by which prices you pass:

| `limit` | `stop` | Order | Fills when |
|---|---|---|---|
| left out | left out | Market | At the next fill point `fillOn` names |
| given | left out | Limit | Price trades at the limit or better |
| left out | given | Stop | Price trades through the trigger |
| given | given | Stop-limit | Price trades through the trigger, then the order rests as a limit |

Every price must fall on a tick of the instrument, or the order is refused with OS7006. Round with [[roundToTick()]], which is absent when the host has stated no tick size, and test the result before you use it.

A backtest decides resting orders against the bar's open, high, low and close, and it decides against the strategy where the bar cannot say: a limit fills only when price trades beyond it (touching it is not enough), and a stop that the bar opens beyond fills at the open, not at the trigger. [Costs and fills](/script/strategies/costs-and-fills) has the details.

{{entry: buy()}}

Enters or adds to a long position. Without a price it is a market order; with `limit`, `stop` or both it rests until the market reaches it. Leave `qty` out to use the declaration's `qty`, counted in the declaration's `qtyType`.

```openscript
version 1
strategy("Buy two lots on a cross", overlay = true, qty = 1)

lots = input(2, "Lots", min = 1, max = 50)

// chart.lotSize is absent, not 1, when the host states no lot size.
lotUnits = max(orElse(chart.lotSize, 1), 1)

fast   = ema(close, 9)
slow   = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy(qty = lots * lotUnits, tag = "entry")
else if goFlat and pos.isLong
    close(tag = "entry")
```

**Remarks.** `buy` adds to the position; it does not replace a working `buy`. A new call while an earlier resting order is still working leaves two orders working, and if both fill you hold both. Guard market entries on [[pos.isFlat]], and remember a resting order yourself in a [`var`](/script/language/persistence) (a variable that keeps its value from one bar to the next) until [[order.working()]] lands.

The declaration's `pyramiding` (default `1`) caps how many entries one direction may hold. An entry placed while the strategy already holds that many filled entries on that side is refused with OS7008; orders still waiting to fill are not counted. A quantity of zero or below is refused with OS7004, because the direction comes from the function you call and never from the sign of the quantity.

**See also.** [[sell()]], [[close()]], [[exit()]], [[order.place()]], [[pos.isFlat]]

{{entry: sell()}}

Enters or adds to a short position, or reduces a long one. `sell` means "subtract from the position": against a long it closes the long first, and a quantity larger than the long carries on into a short. To flatten, use [[close()]], which never goes past zero.

```openscript
version 1
strategy("Short below the trend", overlay = true, precision = 2, qty = 1)

fast     = ema(close, 9)
slow     = ema(close, 21)
goShort  = crossDown(fast, slow)
coverNow = crossUp(fast, slow)

if goShort and pos.isFlat
    sell(tag = "short")
else if coverNow and pos.isShort
    close(tag = "short")

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
```

**Remarks.** No single order crosses zero. When a `sell` would take a long position through zero, it is sent as two orders: one that closes the long and one that opens the short, each carrying its own position reference, so a late fill can say which position it belongs to. Under `qtyType = "units"` the split is exact: long 5, `sell(qty = 8)` sends a sell of 5 and a sell of 3. The declaration's `product` (`"intraday"` or `"overnight"`) travels with every order; whether an account may carry a short position overnight is for the destination to decide, not the language.

**See also.** [[buy()]], [[close()]], [[order.reverse()]], [[pos.isShort]]

## Exiting

{{entry: close()}}

Flattens the position, or the part of it one tag entered. With no arguments it closes whatever is held, long or short. With `qty` it closes that many and leaves the rest. With `tag` it closes only the part that orders placed with that tag opened.

```openscript
version 1
strategy("Core and runner", overlay = true, precision = 2,
         qty = 1, pyramiding = 2)

fast     = ema(close, 9)
slow     = ema(close, 21)
goLong   = crossUp(fast, slow)
goFlat   = crossDown(fast, slow)
atrValue = atr(14)

// Absent while flat, because pos.avgPrice is.
target = pos.isFlat ? none : pos.avgPrice + 3 * atrValue

if goLong and pos.isFlat
    buy(qty = 2, tag = "core")
    buy(qty = 1, tag = "runner")
else if goFlat and pos.isLong
    close()
else if pos.isLong and high >= target
    // Safe on every bar: once the core is off, this sends nothing.
    close(tag = "core")

plot(target, "Target for the core", lime, style = "step")
```

**Remarks.** A close is measured against what is left to close: what has filled, less everything already working against it. Two bare closes on one bar send one order between them, and a close on the bar after one the destination has not answered sends nothing, so `close()` under `if pos.isLong` never sends the position twice. A close on a flat position, or on a tag whose part has already been closed, sends nothing and says nothing.

The same rule covers a resting order that reduces the position. While a sell stop for the whole position waits under a long, the position is already spoken for and `close()` sends nothing. To get out early, [[cancel()]] the resting order and close on the next bar, once the cancellation has been confirmed.

When the declaration counts in units (the default), a quantity you write may not exceed what is left: `close(qty = 5)` against a position of 3 is refused with OS7017, naming what you asked for and what is left, because it would flatten the position and open the opposite one under a call named close. A tag that no order in the file is placed with is refused before the first bar with OS7016, which almost always means a typo.

Under `qtyType = "lots"` the 0.5.0 backtest converts the size of a bare or tagged `close()` from lots a second time, so it sells far more than the position holds. Count in units and size from [[chart.lotSize]], as [Where a size comes from](/script/strategies/position-and-sizing#where-a-size-comes-from) explains.

```openscript expect=OS7016
version 1
strategy("A typo in a tag", overlay = true, qty = 1)

goLong = crossUp(ema(close, 9), ema(close, 21))
goFlat = crossDown(ema(close, 9), ema(close, 21))

if goLong and pos.isFlat
    buy(tag = "entry")
else if goFlat and pos.isLong
    close(tag = "entyr")
```

`close` read bare, without brackets, is the bar's closing price, [[close]]. The compiler tells the two apart by the brackets.

**See also.** [[sell()]], [[exit()]], [[order.reverse()]], [[pos.size]]

{{entry: exit()}}

Sets the position's protective stop and profit target. Give the levels as prices (`stop`, `limit`) or as distances from the entry price in the instrument's own price units (`loss`, `profit`). A position carries at most one stop and one target, and calling `exit` again replaces them. A stop and a target sent together like this are called a **bracket**.

In version 0.5.0 the levels are not filled: the chart and the Backtest panel hand them on and never act on them, and the Strategies panel refuses to start a strategy that calls `exit`. So this example sends the levels with the entry and also tests them itself, which is what closes its trades today:

```openscript
version 1
strategy("Stop and target at entry", overlay = true, precision = 2, qty = 1)

atrValue = atr(14)
goLong   = crossUp(ema(close, 9), ema(close, 21))

stopPrice   = roundToTick(close - 2 * atrValue)
targetPrice = roundToTick(close + 4 * atrValue)
ready       = not isNone(stopPrice) and not isNone(targetPrice)

// The levels sent with the entry, kept so the script can test them as well.
var stopLevel   = none
var targetLevel = none

if goLong and pos.isFlat and ready
    buy(tag = "entry")
    exit(tag = "entry", stop = stopPrice, limit = targetPrice)
    stopLevel   = stopPrice
    targetLevel = targetPrice
else if pos.isLong and (low <= stopLevel or high >= targetLevel)
    close()

plot(pos.isFlat ? none : stopLevel, "Stop", red, style = "step")
plot(pos.isFlat ? none : targetLevel, "Target", lime, style = "step")
```

The distance form suits a market entry, whose fill price your script does not know yet. The levels travel as distances and are measured from the fill:

```openscript
atrValue = atr(14)

if crossUp(ema(close, 9), ema(close, 21)) and pos.isFlat and not isNone(atrValue)
    buy(tag = "entry")
    exit(tag = "entry", loss = 2 * atrValue, profit = 4 * atrValue)
```

**Remarks.** Four rules apply:

- **One side, one form.** A price and a distance for the same side, such as `stop` with `loss`, is refused before the first bar with OS3010. A stop as a price and a target as a distance is fine.
- **An absent level is refused.** `exit` is an order call, so a level whose value is absent is OS7002. The whole bar's orders go with it, including an entry placed on the line above, so test levels before you use them, as both examples do.
- **The right side of the position.** A stop belongs below a long and above a short, a target the other way round. A level on the wrong side of an open position's average price is refused with OS7010. It is checked only against a position that is open, so an entry and its bracket on the same bar are the ordinary shape.
- **The tag is a label.** It tells the destination which entry the levels protect. A tag that matches no order is not refused.

There is no trailing stop argument: the language's trailing stop is [[leg.trail()]], which is planned. [Exits and brackets](/script/strategies/exits-and-brackets) covers exits in full, including a trailing stop written in the script.

**See also.** [[order.bracket()]], [[close()]], [[leg.stop()]], [[leg.target()]]

## Cancelling

{{entry: cancel()}}

Cancels the working order placed with a tag, before it fills. If more than one working order carries the tag, all of them are cancelled. Use it for a resting limit or stop order that has gone stale, or to replace an order at a new price.

```openscript
version 1
strategy("Stale bid", overlay = true, precision = 2, qty = 1)

waitBars = input(3, "Cancel the bid after this many bars", min = 1, max = 50)

wanted  = close - atr(14)
bid     = isNone(wanted) ? none : roundToTick(wanted)
upTrend = close > ema(close, 50)

// The bar the bid was placed on, none while nothing rests.
var placedAt = none
if not pos.isFlat
    placedAt = none

stale = not isNone(placedAt) and bar.index - placedAt >= waitBars

if stale
    cancel("bid")
    placedAt = none
else if upTrend and pos.isFlat and isNone(placedAt) and not isNone(bid)
    buy(limit = bid, tag = "bid")
    placedAt = bar.index
else if pos.isLong and not upTrend
    close()
```

**Remarks.** The tag is a reference: cancelling a tag with no working order, because its order has already filled or was never placed, is refused with OS7009 and stops the run. Clear your own record of a working order when the position opens, as the example does, so the script never cancels an order that has already become a position.

An order and its cancellation may be decided on the same bar. To replace an order, call `cancel` before you place the replacement, or give the replacement a new tag: in a backtest a cancellation withdraws every working order carrying its tag, including one placed earlier on the same bar.

A fill can race a cancellation at a real exchange. When it does, the fill is still counted in the position, and the strategy holds what traded. `cancel` never closes a position.

**See also.** [[cancelAll()]], [[order.working()]], [[order.modify()]]

{{entry: cancelAll()}}

Cancels every working order this strategy placed. Reach for it when the script no longer wants anything resting: the session ending, or a risk switch turned off in the settings.

```openscript
version 1
strategy("Nothing working after 15:00", overlay = true, precision = 2, qty = 1)

enabled   = input(true, "Trading enabled")
lateDay   = not session.isIn("0915-1500", "Asia/Kolkata")
standDown = lateDay or not enabled

rangeHigh = highest(high, 20)[1]
trigger   = isNone(rangeHigh) ? none : roundToTick(rangeHigh)

var working = false
if not pos.isFlat
    working = false

if standDown and working
    cancelAll()
    working = false
else if standDown and pos.isLong
    close()
else if not standDown and pos.isFlat and not working and not isNone(trigger)
    buy(stop = trigger, tag = "breakout")
    working = true
```

**Remarks.** `cancelAll` refuses nothing, so it is safe to call when nothing is working. It cancels orders only and never closes a position: an order that has filled is not working any more.

To cancel everything and be flat, pair it with [[close()]]. The two may run on the same bar, with one exception: a working order that reduces the position, such as a sell stop under a long, counts as already on its way out until its cancellation is confirmed, so a `close()` on the same bar sends nothing for that part. Close on the next bar in that case.

**See also.** [[cancel()]], [[close()]], [[order.pending]]

## Related

[Orders](/script/strategies/orders), [Exits and brackets](/script/strategies/exits-and-brackets), [Position and sizing](/script/strategies/position-and-sizing), [Overview](/script/strategies/overview), [order.*](/script/reference/orders), [pos.*](/script/reference/position), [Declarations](/script/reference/declarations), [Glossary](/script/resources/glossary).
