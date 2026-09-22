---
title: order.*
description: The order namespace. place, reverse and bracket run today; reading an order back, changing one in place, one-cancels-other and the sizing helpers are planned.
---

The `order` namespace holds the order calls a strategy reaches for less often than the six on [Strategy orders](/script/reference/strategy): a general form for a script that computes its side, a reversal in one call, a stop and target given as distances, the calls that will read an order back, and the helpers that will turn an amount of money into a quantity. Three of them run in version 0.5.0 and the rest are planned.

Everything here works only in a `strategy()` file; in a study it is refused with OS7001. A planned name is refused where you write it with OS2020, so you find out at the line that uses it.

## A complete example

A model whose direction comes out of a calculation: the gap between a fast and a slow average decides the side, `"buy"` or `"sell"`. While flat, the strategy enters on the model's side with [[order.place()]] and attaches a stop and a target as distances with [[order.bracket()]]. When the side turns against the position it closes, and on the next bar it enters the other way. Each turn of the model is traded once, so after a stop-out it waits for the next turn.

```openscript title="Computed side, bracketed"
version 1
strategy("Computed side, bracketed", overlay = true, precision = 2,
         capital = 500000, qty = 1, pyramiding = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

atrMult = input(2.0, "Stop, in ATR", min = 0.5, max = 10)

fast     = ema(close, 9)
slow     = ema(close, 21)
atrValue = atr(14)

// "buy" above the slow average, "sell" below it, "" while the averages warm up.
score = fast - slow
side  = isNone(score) ? "" : (score > 0 ? "buy" : "sell")

// The side of the last entry, so each turn of the model is traded once.
var lastSide = ""

if pos.isFlat and side != "" and side != lastSide and not isNone(atrValue)
    order.place(side, 1, tag = "model")
    order.bracket(tag = "model", loss = atrMult * atrValue, profit = 2 * atrMult * atrValue)
    lastSide = side
else if (pos.isLong and side == "sell") or (pos.isShort and side == "buy")
    close()

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
plot(pos.isFlat ? none : pos.avgPrice, "Average price", fade(silver, 40), style = "step")
```

A reader of `order.place(side, ...)` has to work out what `side` holds, so use it where the direction really is computed, and [[buy()]] or [[sell()]] where it is written in the source. In version 0.5.0 the chart and the Backtest panel do not fill a bracket, so there this strategy exits only when the side turns; and the Strategies panel refuses to start a strategy that calls [[order.bracket()]].

## What runs and what is planned

| Call | For | Status |
|---|---|---|
| [[order.place()]] | Place an order whose side and type are values | Runs |
| [[order.reverse()]] | Close the position and open the other way, in one decision | Runs |
| [[order.bracket()]] | Set the stop and target as distances from the entry | Runs, with the caveat above |
| [[order.modify()]], [[order.oco()]] | Change a working order in place; cancel one order when another fills | Planned |
| [[order.working()]], [[order.pending]] | Whether a tagged order is working; how many are | Planned |
| [[order.status()]], [[order.filled()]], [[order.avgFill()]], [[order.id()]], [[order.rejection()]] | Read one order back | Planned |
| [[order.qtyForCash()]], [[order.qtyForEquityPercent()]], [[order.qtyForRisk()]], [[order.roundToLot()]] | Turn money or risk into a quantity | Planned |

## Placing and changing orders

{{entry: order.place()}}

The general order call, for a script whose side comes out of a calculation rather than out of two branches. `side` is `"buy"` or `"sell"` and `type` is `"market"`, `"limit"`, `"stop"` or `"stopLimit"`. It keeps a script from writing its entry block twice, once for each direction, and it is the only order call that states the type outright.

This example rests a stop-limit order above the high of the last 20 bars: it triggers when price trades through the high, and then buys at no more than 0.2 percent above it.

```openscript
version 1
strategy("Stop-limit above the range", overlay = true, precision = 2, qty = 1)

rangeHigh = highest(high, 20)[1]
trigger   = isNone(rangeHigh) ? none : roundToTick(rangeHigh)
ceiling   = isNone(trigger) ? none : roundToTick(trigger * 1.002)
ready     = not isNone(trigger) and not isNone(ceiling)
goFlat    = crossDown(close, ema(close, 20))
lateDay   = not session.isIn("0915-1500", "Asia/Kolkata")

var working = false
if not pos.isFlat
    working = false

// A stop-limit that gapped past its ceiling may never fill, so it is withdrawn
// from 15:00 and placed afresh the next morning.
if working and lateDay
    cancel("range")
    working = false
else if pos.isLong and (goFlat or lateDay)
    close()
else if ready and pos.isFlat and not working and not lateDay
    order.place("buy", 1, type = "stopLimit", price = ceiling, trigger = trigger, tag = "range")
    working = true
```

**Remarks.** The type and the prices must agree:

| `type` | `price` | `trigger` |
|---|---|---|
| `"market"` | left out | left out |
| `"limit"` | the limit | left out |
| `"stop"` | left out | the trigger |
| `"stopLimit"` | the limit it rests at once triggered | the trigger |

A type missing the price it needs is refused with OS7007 when the call runs. A `side` or `type` written as a value outside its list is refused before the first bar with OS3008. `qty` is required here, and it follows the same rules as in [[buy()]]: zero or below is OS7004, and a value that comes out absent is OS7002.

An order on the side that reduces the position, such as a resting sell stop under a long, counts as already on its way out while it works. A bare [[close()]] then sends nothing for the part it covers, and if the order later triggers it takes the position off. To exit some other way, [[cancel()]] it first and close on the next bar, once the cancellation has been confirmed.

```openscript expect=OS3008
version 1
strategy("A side that does not exist", overlay = true, qty = 1)

if crossUp(close, ema(close, 20))
    order.place("long", 1, tag = "entry")
```

**See also.** [[buy()]], [[sell()]], [[cancel()]]

{{entry: order.reverse()}}

Closes the position and opens one the other way, in one decision. With `qty` left out the new position is the same size as the old one; with `qty` it is that size. It is the call a stop-and-reverse system, which is always in the market once it has started, is written with.

This example uses [[supertrend()]], a trend-following band that flips from one side of price to the other when the trend turns, and reverses the position on every flip:

```openscript
version 1
strategy("Stop and reverse", overlay = true, precision = 2,
         capital = 500000, qty = 1, pyramiding = 1)

factor = input(3.0, "Band width, in ATR", min = 0.5, max = 20)
atrLen = input(10,  "ATR length", min = 1, max = 200)

// supertrend returns [line, direction]: -1 while the trend is up, 1 while down.
bands = supertrend(factor, atrLen)
band  = bands[0]
dir   = bands[1]

// != treats an absent value as a value, so the first bar with a direction
// counts as a flip and opens the first position.
flipped = not isNone(dir) and dir != dir[1]

if flipped and pos.isFlat
    if dir == -1
        buy(tag = "long")
    else
        sell(tag = "short")
else if flipped
    order.reverse(tag = "reversal")

plot(dir == -1 ? band : none, "Stop, long",  lime, width = 2)
plot(dir == 1  ? band : none, "Stop, short", red,  width = 2)
```

**Remarks.** A reversal is always two orders, because no order crosses zero: one closes the outgoing position and one opens the replacement, each with its own position reference, so a late fill can say which position it settles. Long 2, `order.reverse(qty = 5)` sends a sell of 2 and a sell of 5 and leaves the strategy short 5. On a flat position it sends nothing.

`order.reverse` sizes both halves itself in units. Under `qtyType = "lots"` the 0.5.0 backtest converts those sizes from lots a second time, the same defect as [[close()]]; count in units, as [Where a size comes from](/script/strategies/position-and-sizing#where-a-size-comes-from) explains.

**See also.** [[close()]], [[sell()]], [[pos.size]]

{{entry: order.bracket()}}

Sets the position's stop and target as distances from the entry price, in the instrument's own price units. It is the distance form of [[exit()]] on its own, and the natural partner of a market entry, whose fill price your script does not know yet.

```openscript
version 1
strategy("Pullback with a bracket", overlay = true, precision = 2, qty = 1)

atrValue = atr(14)
trendUp  = close > ema(close, 50)
pullback = crossUp(close, ema(close, 20))
sized    = not isNone(atrValue)

if trendUp and pullback and pos.isFlat and sized
    buy(tag = "pullback")
    order.bracket(tag = "pullback", loss = 1.5 * atrValue, profit = 3 * atrValue)
else if pos.isLong and not trendUp
    close()
```

**Remarks.** A position carries one stop and one target, so calling `order.bracket` or [[exit()]] again replaces the pair rather than adding a second one. A distance whose value is absent is refused with OS7002, and that takes the whole bar's orders with it, including the entry above it. The tag is a label that tells the destination which entry the levels protect; a tag that matches no order is not refused.

In version 0.5.0 the chart and the Backtest panel do not fill a bracket, so in this example every trade closes when the trend turns. The Strategies panel refuses to start a strategy that calls `order.bracket`. Until both change, write the stop and target as rules the script tests, as [Exits and brackets](/script/strategies/exits-and-brackets) shows.

**See also.** [[exit()]], [[leg.stop()]], [[leg.trail()]]

{{entry: order.modify()}}

Will change a working order's price or quantity in place, named by its tag, instead of cancelling it and placing a new one. Until it lands, [[cancel()]] the order and place the replacement: call `cancel` first on the bar, or give the replacement a new tag, because a cancellation withdraws every working order carrying its tag.

{{entry: order.oco()}}

Will link two working orders so that when one fills, the other is cancelled: one-cancels-other. A bracket's stop and target already relate this way, since reaching one closes the position the other protects; this is the general case for any two orders. Until it lands, [[cancel()]] the other tag yourself when the position changes.

## Reading an order back

These seven will read the strategy's own **ledger**: the record of every order it placed and every fill reported for it. They never ask the destination directly: they read what the strategy has already recorded from the destination's answers, so a fill reported twice is still counted once. All seven are planned. Until they land, a strategy remembers its own working orders in a [`var`](/script/language/persistence), as the examples on [Strategy orders](/script/reference/strategy) do.

Three rules will apply to all of them:

- **A tag that names nothing reads empty.** Reading is how a script finds out, so a tag with no order reads as that entry's empty value instead of being refused: `0` from [[order.filled()]], `""` from [[order.id()]] and [[order.rejection()]], absent from [[order.avgFill()]]. Acting on such a tag, as [[cancel()]] does, is still refused with OS7009.
- **Finished orders stay readable.** An order that has filled, been cancelled, rejected or expired keeps its record, which is when [[order.avgFill()]] and [[order.rejection()]] have something to say.
- **The newest order wins.** Where several orders carry one tag, the reads read the most recently placed.

An order's status is one of these words:

| Status | Means | Final |
|---|---|---|
| `placed` | Sent, and the destination has not answered yet | No |
| `working` | Live at the destination and not completely filled | No |
| `triggerPending` | Accepted and waiting for its trigger price | No |
| `filled` | The whole quantity has filled | Yes |
| `cancelled` | Ended by a cancellation | Yes |
| `rejected` | Refused, with the destination's own reason | Yes |
| `expired` | Ended without filling, by the destination's own rule | Yes |

A status only moves forward, and a final status never changes. A fill that arrives after a cancellation, which happens when a cancellation races a fill at the exchange, is still counted in the filled quantity while the status stays `cancelled`.

{{entry: order.working()}}

Will be true while an order with that tag is live and not completely filled. It is the guard for "place this order only if the last one is not still resting", and the check to make before [[cancel()]].

{{entry: order.pending}}

Will count the orders this strategy has live and not completely filled. `order.pending == 0` is the guard that stops a second entry while a resting order waits, which [[pos.isFlat]] alone cannot do.

{{entry: order.id()}}

Will read the destination's own order id for that tag, as a string, and `""` until the destination has answered. It is the reference to quote when you ask your broker about one order.

{{entry: order.status()}}

Will read the status of the order with that tag, as one of the words in the table above.

{{entry: order.filled()}}

Will read how much of the order has filled so far, `0` before the first fill. It is a running total and only rises. To find what filled on this bar, take the difference from the previous bar yourself.

{{entry: order.avgFill()}}

Will read the order's average fill price over everything filled so far, as the destination computed it, and absent before the first fill.

{{entry: order.rejection()}}

Will read the destination's own reason for rejecting the order, word for word, and `""` when there is none. It is what a table on the chart shows when a trader asks why an entry did not happen.

## Sizing helpers

These will turn a sentence about money into a quantity. All four are planned. They will round down unless told otherwise, because a size rounded up is a position larger than the script asked for, and the error repeats with every entry.

{{entry: order.qtyForCash()}}

Will return the number of whole units that `cash` buys at `price`, which defaults to this bar's close: "put two lakh into this".

{{entry: order.qtyForEquityPercent()}}

Will return the number of whole units that `percent` of the strategy's current equity buys at `price`: "put ten percent of the capital into this".

{{entry: order.qtyForRisk()}}

Will return the number of whole units for which being stopped out, from `entry` to `stop`, costs `risk` in money. It will return `none` when `entry` and `stop` are equal, which can happen during warmup, and the order that receives the absent quantity is then refused with OS7002.

{{entry: order.roundToLot()}}

Will round a quantity to a whole number of the instrument's lots, down unless `direction = "up"`. It is how a size computed in units becomes one the exchange accepts for an NFO or MCX contract.

## Sizing today

Until the helpers land, the same arithmetic is a few lines. This strategy sizes each trade so that being stopped out loses about a fixed amount of money, caps the money it commits, rounds down to whole lots, and exits at the stop it sized for or on the opposite cross:

```openscript title="Risk sizing by hand"
version 1
strategy("Risk sizing by hand", overlay = true, precision = 2,
         capital = 1000000, qtyType = "units", pyramiding = 1)

riskAmount = input(5000,   "Money lost if the stop is hit", min = 100)
maxCash    = input(500000, "Never commit more than this much", min = 1000)
stopAtr    = input(2.0,    "Stop, in ATR", min = 0.5, max = 10)

atrValue   = atr(14)
lotUnits   = max(orElse(chart.lotSize, 1), 1)
pointValue = orElse(chart.pointValue, 1)
goLong     = crossUp(ema(close, 9), ema(close, 21))
goFlat     = crossDown(ema(close, 9), ema(close, 21))

// The stop sits stopAtr ATRs below the close the entry is decided on.
stopDistance = stopAtr * atrValue
stopNow      = isNone(stopDistance) ? none : roundToTick(close - stopDistance)

// The size the risk allows, capped by the money committed, then rounded down
// to whole lots: order.qtyForRisk, order.qtyForCash and order.roundToLot.
riskUnits = stopDistance > 0 ? floor(riskAmount / (stopDistance * pointValue)) : none
cashUnits = floor(maxCash / (close * pointValue))
units     = isNone(riskUnits) ? none : floor(min(riskUnits, cashUnits) / lotUnits) * lotUnits

// The stop this trade was sized for, kept while the position is open.
var stopLevel = none
if pos.isFlat
    stopLevel = none

if pos.isLong and (low <= stopLevel or goFlat)
    close()
else if goLong and pos.isFlat and not isNone(stopNow) and not isNone(units) and units > 0
    buy(qty = units, tag = "entry")
    stopLevel = stopNow

plot(stopLevel, "Stop the size was computed for", red, style = "step")
```

The loss at the stop is about `riskAmount` rather than exactly it: the entry fills at the next bar's open rather than at the close the size was computed from, and the exit is decided on the bar that reaches the stop and fills at the following bar's open, which can be beyond the stop. When the risk allows less than one lot, the size rounds down to zero and the script, correctly, takes no trade; raise the amount for a contract with a large lot. [Position and sizing](/script/strategies/position-and-sizing) works through sizing by risk, by volatility and by lots in full.

## Related

[Orders](/script/strategies/orders), [Exits and brackets](/script/strategies/exits-and-brackets), [Reading the books](/script/strategies/reading-the-books), [Position and sizing](/script/strategies/position-and-sizing), [Strategy orders](/script/reference/strategy), [pos.*](/script/reference/position), [leg.*](/script/reference/legs).
