---
title: Position and sizing
description: What a strategy can read about its own position with pos.*, how an order's size is counted, lot sizes on NFO and MCX with chart.lotSize, and sizing by risk and by volatility.
---

This page covers two questions every strategy answers on every bar: what am I holding, and how big should the next order be. It explains the [pos.* facts](/script/reference/position), the units an order's size is counted in, how to trade whole lots of an index future or an MCX contract with [[chart.lotSize]], and how to size by the money you are prepared to lose or by how much the instrument moves.

## A complete example

This strategy trades a set number of lots of whatever future is on the chart. It works out the size in units from the lot size the host states, so the same file trades NIFTY futures, BANKNIFTY futures or an MCX contract without a change, and trades single shares on an NSE stock where the lot is one.

```openscript title="Lots on a futures chart"
version 1
strategy("Lots on a futures chart", overlay = true, precision = 2,
         capital = 1000000, qtyType = "units",
         product = "intraday", pyramiding = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

lots = input(1, "Lots per trade", min = 1, max = 50)

// chart.lotSize is absent, not 1, when the host has not stated a lot size.
lotUnits = max(orElse(chart.lotSize, 1), 1)
orderQty = lots * lotUnits

fast   = ema(close, 9)
slow   = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy(qty = orderQty, tag = "entry")
else if goFlat and pos.isLong
    close()

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
plot(pos.isFlat ? none : pos.avgPrice, "Entry", fade(silver, 40), style = "step")
```

If the exchange's lot size for the contract on the chart is 75 units, `lots = 2` sends a buy of 150 units, and `close()` sells exactly what is held. Why this file counts in units rather than declaring `qtyType = "lots"` is explained under [Where a size comes from](#where-a-size-comes-from).

The chart, the Backtest panel and a deployment from the Strategies panel all read [[chart.lotSize]] from the lot size OpenAlgo holds for the instrument. Where OpenAlgo holds no contract for the symbol, and on the chart for the moment before the instrument's details arrive, the lot size is absent and this file falls back to one unit per lot.

## What a strategy can read about itself

The `pos` namespace answers two questions: what is held right now, and how the run has gone so far. Every entry is a per-bar fact folded from **this strategy's own settled fills**, never from the account's position, for the reason [the overview](/script/strategies/overview) gives.

| Name | When flat | Means | Status |
|---|---|---|---|
| [[pos.size]] | `0` | Net position in units, positive long and negative short | Runs |
| [[pos.isLong]], [[pos.isShort]], [[pos.isFlat]] | `false`, `false`, `true` | The sign of `pos.size`, spelled out | Runs |
| [[pos.avgPrice]] | absent | Average price of the open position | Runs |
| [[pos.entryTime]] | absent | When the current position was opened | Planned |
| [[pos.barsHeld]] | absent | Bars since it was opened, `0` on the entry bar | Planned |
| [[pos.entries]] | `0` | How many entries make up the current position | Planned |
| [[pos.openProfit]], [[pos.openProfitPercent]] | absent | Unrealised profit, in money and as a percentage of cost, marked to this bar's close | Planned |
| [[pos.maxProfit]], [[pos.maxLoss]] | absent | The best and worst this position has been | Planned |
| [[pos.isShared]] | either | The account's position in this contract is shared with something else | Planned |
| [[pos.equity]], [[pos.netProfit]], [[pos.tradeCount]] | a number | Capital plus profit, realised profit, and closed trades so far | Planned |
| [[pos.winRate]], [[pos.profitFactor]], [[pos.maxDrawdown]] | a number | Run statistics | Planned |

Four rules about that table matter more than the table.

**`pos.avgPrice` is absent while flat, and `pos.size` is zero while flat.** They look inconsistent and are not. Zero is the true size of a flat position, so adding `pos.size` to something gives the right answer. Zero is not a price, and `close > pos.avgPrice` while flat would take a branch that looks correct and means nothing. [Absence](/script/language/absent-values) propagates through that comparison, the branch is not taken, and the mistake cannot happen.

**Every figure reflects settled fills, not intentions.** A market order decided on one bar fills at the next bar's open, and `pos.*` changes from that next bar. A resting limit or stop order changes nothing until it fills. So `pos.isFlat` is a complete entry guard for market orders, and not for resting ones: while a limit waits, the strategy is still flat, and a second order goes through. Remember the working order yourself, as [Orders](/script/strategies/orders) shows, until [[order.working()]] and [[order.pending]] land.

**Open profit is marked to the bar's close.** Not to a bid or an ask. Until [[pos.openProfit]] lands you can compute the same figure yourself, as the panel below does.

**`pos.isShared` stays a yes or no.** It will say that the account's position in this contract is shared: another strategy or a manual trade is in the same contract as this one. No call turns it into a number, because a script that could read the account's quantity would size against it.

Here is a panel that puts the position on the chart, using only what runs today. A strategy whose state is visible is a strategy you can debug without a print log.

```openscript title="Position panel"
version 1
strategy("Position panel", overlay = true, precision = 2,
         capital = 500000, qty = 1)

panel = table("Position", 4, 2, position = "topRight", textColor = silver)

fast   = ema(close, 9)
slow   = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy(tag = "entry")
else if goFlat and pos.isLong
    close()

// Open profit by hand, marked to the close, until pos.openProfit lands.
pointValue = orElse(chart.pointValue, 1)
openProfit = pos.isFlat ? none : (close - pos.avgPrice) * pos.size * pointValue

// One place decides what an absent reading looks like.
fn show(value, decimals) => isNone(value) ? "flat" : text(value, decimals)

// Only on the newest bar: a panel shows one state.
if bar.isLast
    cell(panel, 0, 0, "Size")
    cell(panel, 0, 1, text(pos.size))
    cell(panel, 1, 0, "Average")
    cell(panel, 1, 1, show(pos.avgPrice, 2))
    cell(panel, 2, 0, "Open profit")
    cell(panel, 2, 1, show(openProfit, 0), textColor = orElse(openProfit, 0) >= 0 ? lime : red)
    cell(panel, 3, 0, "Lot size")
    cell(panel, 3, 1, show(chart.lotSize, 0))

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
```

[Tables](/script/visuals/tables) covers the table calls this panel uses.

## Where a size comes from

The declaration sets the default size and the unit it is counted in. An order that names no quantity uses the default; an order that names one overrides it, in the same unit.

| `qtyType` | `qty = 2` means | Backtest panel, 0.5.0 | Strategies panel, 0.5.0 |
|---|---|---|---|
| `"units"` | Two units: two shares, or two units of a contract | Filled as written | Runs |
| `"lots"` | Two lots, that is `2 * chart.lotSize` units | Converted through the instrument's lot size, with the closing defect below | Refused before it starts |
| `"cash"` | Two units of currency, turned into units at the fill price | Refused before the run, with OS6021 | Refused before it starts |
| `"equityPercent"` | Two percent of current equity, turned into units at the fill price | Refused before the run, with OS6021 | Refused before it starts |

A backtest fills in units and keeps no running equity to size against, so it cannot convert cash or a percentage of equity, and says so with OS6021 before any bar runs rather than filling the number as written. The runner behind the Strategies panel sends only a quantity the script states in units.

:::warn Lots and closing orders in the 0.5.0 backtest
Under `qtyType = "lots"` the orders you size are converted correctly, but a close whose size the engine works out for you is not. A bare `close()`, a tagged `close(tag = ...)` and [[order.reverse()]] all work their size out in units, and the 0.5.0 backtest converts that size from lots a second time. With a lot size of 50, closing a two-lot position (100 units) sells 100 lots, 5,000 units, and leaves the strategy short 4,900.

Count in units and compute the size from [[chart.lotSize]], as the complete example does: that is also the only unit a deployment accepts. If you keep `qtyType = "lots"` for a backtest, flatten with a close that states its size in lots, such as `close(qty = lots)`. Do not flatten with `sell(qty = lots)`: under lots that opens a separate short beside the long, and the trade list then shows both as open trades that never close.
:::

Pick the unit that matches how you describe the trade to yourself, and use it everywhere. A script whose declaration says lots and whose orders pass unit counts is a script that will one day trade seventy-five times too much.

## Instruments that trade in lots

Index futures and options on NFO, and most MCX contracts, cannot be traded in single units. The exchange trades them in lots, and an order for anything that is not a whole number of lots is rejected. Three chart facts tell a script what it needs:

| Fact | Name | Absent when |
|---|---|---|
| Units in one lot | [[chart.lotSize]] | The host has not stated one |
| Money per one point of price, per unit | [[chart.pointValue]] | The host has not stated one |
| Smallest price step | [[chart.tickSize]] | The host has not stated one |

**Absent is not 1.** When the host has not stated a lot size, `chart.lotSize` is absent, and absence propagates through arithmetic, so a size computed from it is absent too and the order is refused with OS7002. Decide once what a missing lot size means in your script: `max(orElse(chart.lotSize, 1), 1)` treats it as one unit. In /trading that fallback matters where OpenAlgo holds no contract for the symbol: the chart then states no lot size, and the Backtest panel runs on a lot of 1 and a tick of 0.05 and says so in the line under the report's figures.

**Round down to whole lots yourself.** A quantity that is not a whole number of lots is catalogued as OS7005, and in version 0.5.0 nothing raises it: the order is sent as written and the destination is left to reject it. [[order.roundToLot()]] is planned. Until it lands, round with arithmetic:

```openscript title="Whole lots"
version 1
strategy("Whole lots", overlay = true, qtyType = "units")

wantedUnits = input(170, "Units wanted", min = 1)

lotUnits = max(orElse(chart.lotSize, 1), 1)

// Down, to a whole number of lots: 170 units at a lot of 75 is 150.
wholeLots = floor(wantedUnits / lotUnits) * lotUnits

fast   = ema(close, 9)
slow   = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

// Fewer units wanted than one lot rounds down to nothing, and a size of
// zero would be refused (OS7004), so it is tested.
if goLong and pos.isFlat and wholeLots > 0
    buy(qty = wholeLots, tag = "entry")
else if goFlat and pos.isLong
    close()
```

Round down unless you mean up. A size rounded up is a position larger than the script asked for, and if every entry rounds up, every entry is too large in the same direction for the life of the run.

**Money needs the point value.** `chart.pointValue` is the money one unit makes or loses when the price moves by one. For a cash equity it is 1, and profit is simply price change times shares. For a contract quoted with a multiplier it is that multiplier, and leaving it out of a risk calculation is how a script ends up risking the multiplier times what it meant to. Multiply by `orElse(chart.pointValue, 1)` wherever money meets a price distance.

## Sizing by capital at risk

This is how most traders actually describe size: not "two lots" but "I am willing to lose five thousand on this trade". Turn that sentence into a quantity and the stop distance sets the size, so a wide stop buys fewer units and every trade risks about the same.

```openscript title="Risk the same amount every time"
version 1
strategy("Risk the same amount every time", overlay = true, precision = 2,
         capital = 1000000, qtyType = "units",
         product = "overnight", pyramiding = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

riskAmount = input(5000, "Money risked per trade", min = 100)
stopMult   = input(2.0,  "Stop, in ATR", min = 0.2, max = 20)
maxLots    = input(10,   "Never more than this many lots", min = 1, max = 500)

atrValue = atr(14)
fast     = ema(close, 9)
slow     = ema(close, 21)
goLong   = crossUp(fast, slow)
goFlat   = crossDown(fast, slow)

lotUnits   = max(orElse(chart.lotSize, 1), 1)
pointValue = orElse(chart.pointValue, 1)

stopDistance = stopMult * atrValue
stopPrice    = roundToTick(close - stopDistance)

// Money at risk over money lost per unit, rounded down to whole lots and
// capped, because as the stop distance shrinks the division grows without
// limit.
rawUnits = stopDistance > 0 ? riskAmount / (stopDistance * pointValue) : none
units    = isNone(rawUnits) ? none : min(floor(rawUnits / lotUnits), maxLots) * lotUnits

canTrade = not isNone(units) and units > 0 and not isNone(stopPrice)

// The stop the size was computed from, held for the life of the position.
var entryStop = none

if pos.isFlat
    entryStop = none

stopHit = pos.isLong and low <= entryStop

if goLong and pos.isFlat and canTrade
    entryStop = stopPrice
    buy(qty = units, tag = "entry")
else if stopHit or (goFlat and pos.isLong)
    close()

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
plot(entryStop, "Stop", red, style = "step")
```

The comparison `stopDistance > 0` does two jobs. It keeps the division away from zero, and because an ordered comparison with an absent value is absent and an absent condition takes the false branch, it also covers the warmup bars where [[atr()]] has no value yet.

The stop is a rule the script tests on each bar rather than a level set with [[exit()]], because /trading does not act on `exit()` levels in 0.5.0; [Exits and brackets](/script/strategies/exits-and-brackets) explains.

This risks a fixed amount of money rather than a percentage of equity, because [[pos.equity]] is planned. [[order.qtyForRisk()]], also planned, will do the division in one call and return `none` when the entry and the stop are equal.

Three things this sizing does not protect you from. It assumes the exit happens at the stop price, while a rule exits at the next bar's open after the bar that reached the stop, and a gap can open well beyond it, so the loss taken is often larger than the amount. It sizes one trade, not ten correlated trades taken the same morning. And it is a division, so it needs the cap.

## Sizing by volatility

Risk sizing asks how far away the stop is. Volatility sizing asks how much the instrument moves in a day, and aims for the same money move whatever you trade. It is what lets one strategy run across a bank stock, a NIFTY future and an MCX contract without the fastest one dominating the equity curve.

```openscript title="Constant volatility exposure"
version 1
strategy("Constant volatility exposure", overlay = true, precision = 2,
         capital = 1000000, qtyType = "units",
         product = "overnight", pyramiding = 1)

targetMove = input(5000, "Target daily move, in money", min = 100)
atrLen     = input(20,   "ATR length", min = 2, max = 200)

atrValue   = atr(atrLen)
lotUnits   = max(orElse(chart.lotSize, 1), 1)
pointValue = orElse(chart.pointValue, 1)

// What one unit moves in money on an average bar, and how many units make
// the target move.
movePerUnit = atrValue * pointValue
rawUnits    = movePerUnit > 0 ? targetMove / movePerUnit : none
units       = isNone(rawUnits) ? none : floor(rawUnits / lotUnits) * lotUnits

trend   = ema(close, 50)
upTrend = close > trend
canSize = not isNone(units) and units > 0

if upTrend and pos.isFlat and canSize
    buy(qty = units, tag = "entry")
else if not upTrend and pos.isLong
    close()

plot(trend, "Trend", orange, width = 2)
plot(units, "Units the model wants", aqua, overlay = false)
```

Run it on a daily chart for "a day" to mean a day: [[atr()]] measures the average range of the chart's own bars.

## Sizing helpers

Four helpers will turn a sentence about money into a quantity. All four are planned in version 0.5.0.

| Helper | Returns | For |
|---|---|---|
| [[order.qtyForCash()]] | Units | "Put two lakh into this" |
| [[order.qtyForEquityPercent()]] | Units | "Put ten percent of the account into this" |
| [[order.qtyForRisk()]] | Units, or `none` when entry and stop are equal | "Lose no more than this if I am wrong" |
| [[order.roundToLot()]] | Units | Round to a whole number of lots, down unless told otherwise |

The first two size the position and say nothing about what it can lose; the third sizes the loss and lets the position be whatever that implies. They answer different questions, and a strategy described in terms of risk should not be sized in terms of exposure because the exposure version is one line shorter.

## Adding to a position

`pyramiding` in the declaration is how many entries one direction may hold. The default is 1, and an entry beyond the limit is refused with OS7008, which stops the run. When adding is the intent, say so in both places: raise the limit, and count the entries in the guard, so the script never relies on the refusal to stop it. [[pos.entries]] is planned, so the count below is kept in a `var`:

```openscript title="Add on strength"
version 1
strategy("Add on strength", overlay = true, precision = 2,
         capital = 1000000, qtyType = "units", pyramiding = 3)

lots = input(1, "Lots per add", min = 1, max = 50)

lotUnits = max(orElse(chart.lotSize, 1), 1)
trend    = ema(close, 50)
upTrend  = close > trend
newHigh  = high > highest(high, 20)[1]

var entries   = 0
var lastAddAt = none

if pos.isFlat
    entries   = 0
    lastAddAt = none

// A fresh high and five bars of separation, not simply "still above the
// average", which would add on every bar of the move.
spaced = isNone(lastAddAt) or bar.index - lastAddAt >= 5

if upTrend and newHigh and spaced and entries < 3
    buy(qty = lots * lotUnits, tag = "add")
    entries   = entries + 1
    lastAddAt = bar.index
else if not upTrend and pos.isLong
    close()

plot(trend, "Trend", orange)
plot(pos.isFlat ? none : pos.avgPrice, "Average", fade(silver, 40), style = "step")
```

[[pos.avgPrice]] moves as you add, which is the point of plotting it: a stop measured from the average of three entries is a different stop from one measured from the first.

:::note How the 0.5.0 report marks a scale-in
The report's equity curve marks a trade at the size it ended up at, and at its final average price, from the bar it first opened. A position built in three adds is therefore marked, before the second add, on units it did not yet hold. For a strategy that adds as the price rises, like this one, that shows a drawdown the account never had, and the report's maximum drawdown is taken from the same curve. A partial close is misread the same way: after it settles the trade is still marked at its full size, so the part already closed is counted twice in the open profit. The realised profit is unaffected.
:::

## Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Two entries where the script meant one | A resting order was still working while `pos.isFlat` was true | Remember the working order in a `var` |
| A lots strategy ends up hugely short in the backtest | `close()` under `qtyType = "lots"` | Count in units from `chart.lotSize`, or flatten with `close(qty = lots)` |
| The backtest refuses to start with OS6021 | `qtyType = "cash"` or `"equityPercent"` | Count in units |
| The Strategies panel will not start the strategy | Any `qtyType` other than `"units"` | Count in units from `chart.lotSize` |
| Every order is refused with OS7002 | A size computed from `chart.lotSize` while it is absent | `max(orElse(chart.lotSize, 1), 1)` |
| The size explodes on quiet days | Risk sizing with no cap as the stop distance shrinks | Cap the size |
| The run stops with OS7008 | An entry beyond `pyramiding` | Guard entries, or raise `pyramiding` on purpose |
| A future sized as if one point were one rupee | `chart.pointValue` left out of the arithmetic | Multiply by `orElse(chart.pointValue, 1)` |

**Related.** [Overview](/script/strategies/overview), [Orders](/script/strategies/orders), [Exits and brackets](/script/strategies/exits-and-brackets), [Legs and books](/script/strategies/multi-leg-and-books), [Costs and fills](/script/strategies/costs-and-fills), [pos.* reference](/script/reference/position), [chart.* reference](/script/reference/chart)
