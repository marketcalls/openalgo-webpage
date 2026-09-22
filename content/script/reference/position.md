---
title: pos.*
description: What a strategy can read about its own position and its run. Size, direction and average price run today; bars held, open profit, equity and the run statistics are planned.
---

The `pos` namespace is how a strategy reads its own state: how much it holds, which way, and at what average price. Once the planned entries land it will also say how long the position has been held, what it is making and how the run has gone. Every strategy needs at least [[pos.isFlat]] or [[pos.size]], because a guard on the position is what stops an entry being sent again on every bar its condition stays true.

Every `pos` fact is built from **this strategy's own fills**, the executions reported back for the orders it sent. None of them is read from the account's position, which can hold another strategy's trades or a trade you placed by hand. [A strategy keeps its own books](/script/strategies/overview#a-strategy-keeps-its-own-books) explains why that rule is worth having. All of them are strategy only: in a `study()` file they are refused with OS7001.

## A complete example

A strategy that is always in the market after the first crossover of two averages: long while the fast average is above the slow one, short while it is below. The first cross opens a position and every later cross reverses it. It shades the background by direction, draws the average price while a position is open, and writes the position into a small table in the top right corner on the newest bar. It uses only the five `pos` facts that run in version 0.5.0.

```openscript title="Long, short or flat"
version 1
strategy("Long, short or flat", overlay = true, precision = 2,
         capital = 500000, qty = 1)

fast = ema(close, 9)
slow = ema(close, 21)
up   = crossUp(fast, slow)
down = crossDown(fast, slow)

if up and pos.isFlat
    buy(tag = "long")
else if down and pos.isFlat
    sell(tag = "short")
else if up and pos.isShort
    order.reverse(tag = "long")
else if down and pos.isLong
    order.reverse(tag = "short")

shade = pos.isLong ? fade(lime, 92) : (pos.isShort ? fade(red, 92) : none)
background(shade)
plot(pos.isFlat ? none : pos.avgPrice, "Average price", silver, style = "step")

panel = table("Position", 2, 2, position = "topRight", textColor = silver)
if bar.isLast
    cell(panel, 0, 0, "Size")
    cell(panel, 0, 1, text(pos.size))
    cell(panel, 1, 0, "Average")
    cell(panel, 1, 1, pos.isFlat ? "flat" : text(pos.avgPrice, 2))
```

## What runs and what is planned

| Name | When flat | Means | Status |
|---|---|---|---|
| [[pos.size]] | `0` | Net position in units, positive long, negative short | Runs |
| [[pos.isLong]], [[pos.isShort]], [[pos.isFlat]] | `false`, `false`, `true` | The sign of `pos.size`, spelled out | Runs |
| [[pos.avgPrice]] | absent | Average price of the open position | Runs |
| [[pos.entryTime]], [[pos.barsHeld]], [[pos.entries]] | absent, absent, `0` | When the position opened, for how many bars, from how many entries | Planned |
| [[pos.openProfit]], [[pos.openProfitPercent]] | absent | Unrealised profit, in money and in percent of cost | Planned |
| [[pos.maxProfit]], [[pos.maxLoss]] | absent | The best and worst this position has been | Planned |
| [[pos.isShared]] | either | Whether the account holds more of this contract than the strategy | Planned |
| [[pos.equity]], [[pos.netProfit]], [[pos.tradeCount]] | a number | Capital plus profit, realised profit, closed trades | Planned |
| [[pos.winRate]], [[pos.profitFactor]], [[pos.maxDrawdown]] | a number | Run statistics | Planned |

**Unrealised** profit is what an open position would make if it were closed at the current price; **realised** profit is what closed trades actually made. A planned name is refused where you write it with OS2020, so a script cannot compile around one by accident. [Computing the planned figures today](#computing-the-planned-figures-today) shows how to work out the per-position ones yourself.

Three rules hold for every entry on this page:

- **Fills, not intentions.** An order placed on this bar changes nothing here until it fills. With the default `fillOn = "nextOpen"`, a market order decided on one bar shows in `pos` from the next bar. A resting limit or stop order changes nothing until it fills, so `pos.isFlat` alone does not stop a second resting order from being placed.
- **Absent is not zero.** A price is absent while flat, because zero is a price and `close > pos.avgPrice` against zero would take a branch that looks correct. A size is zero while flat, because zero is the true size and adding it to something gives the right answer.
- **Marked to the close.** The planned profit figures will value an open position at this bar's close, not at a bid or an ask.

## The position

{{entry: pos.size}}

The strategy's net position in units: positive when long, negative when short and `0` when flat. It counts what the fills reported, which is units. When a declaration counts orders in lots, the destination converts each order to units where it knows the lot size, so in the Backtest panel a two-lot position in a contract of 75 units reads `150`.

```openscript
version 1
strategy("Position in a pane", overlay = false, precision = 0, qty = 2)

fast   = ema(close, 9)
slow   = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy(tag = "entry")
else if goFlat and pos.isLong
    close()

plot(pos.size, "Position, in units", aqua, style = "step")
```

**Remarks.** Sizing towards a target from `pos.size` is sound, because it counts nothing but this strategy's own fills. Take the direction from the function you call, never from the sign of the quantity, since a quantity of zero or below is refused with OS7004:

```openscript
wantedSize = 3 - pos.size

if wantedSize > 0
    buy(qty = wantedSize)
else if wantedSize < 0
    sell(qty = -wantedSize)
```

Because `pos.size` counts fills only, an order still waiting to fill is not in it. In a backtest a market order has always filled by the next bar; against a slower destination, remember what you sent in a [`var`](/script/language/persistence) until its fill arrives.

**See also.** [[pos.isLong]], [[pos.isShort]], [[pos.isFlat]], [[chart.lotSize]]

{{entry: pos.isLong}}

True while the strategy holds a long position, the same as `pos.size > 0`. Use it to guard an exit so that it only runs when there is something to exit.

```openscript
version 1
strategy("Shade the long", overlay = true, qty = 1)

fast   = ema(close, 20)
slow   = ema(close, 50)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy(tag = "entry")
else if goFlat and pos.isLong
    close()

background(pos.isLong ? fade(lime, 92) : none)
```

**See also.** [[pos.isShort]], [[pos.isFlat]], [[pos.size]]

{{entry: pos.isShort}}

True while the strategy holds a short position, the same as `pos.size < 0`. This example sells short on a downward cross and covers when price rises two ATRs (average true ranges, a measure of how far price typically moves in a bar) above the average entry price.

```openscript
version 1
strategy("Cover the short", overlay = true, precision = 2, qty = 1)

atrValue = atr(14)
goShort  = crossDown(ema(close, 9), ema(close, 21))

// A stop two ATRs above the short's average price, absent while flat.
coverAt = pos.isShort ? pos.avgPrice + 2 * atrValue : none

if goShort and pos.isFlat
    sell(tag = "short")
else if pos.isShort and high >= coverAt
    close()

plot(coverAt, "Cover above", red, style = "step")
```

**See also.** [[pos.isLong]], [[pos.avgPrice]], [[sell()]]

{{entry: pos.isFlat}}

True while the strategy holds nothing, the same as `pos.size == 0`. It is the entry guard almost every strategy starts with: without it, an entry is sent again on every bar its condition stays true.

```openscript
version 1
strategy("One position at a time", overlay = true, qty = 1)

trend    = ema(close, 50)
crossUpT = crossUp(close, trend)
crossDnT = crossDown(close, trend)

// Without pos.isFlat, a buy would go out on every bar the condition holds.
if crossUpT and pos.isFlat
    buy(tag = "trend")
else if crossDnT and pos.isLong
    close()
```

**Remarks.** In a backtest and on the chart, `pos.isFlat` is a complete guard for market entries, because a market order decided on one bar has filled before the next bar runs. It does not guard a resting limit or stop order: while one waits, the strategy is still flat. Remember a resting order in a [`var`](/script/language/persistence), as [Orders](/script/strategies/orders#when-the-next-signal-arrives-and-an-order-is-still-working) shows, until [[order.working()]] lands.

**See also.** [[pos.isLong]], [[pos.isShort]], [[order.pending]]

{{entry: pos.avgPrice}}

The average price of the open position, and absent while flat. When a strategy adds to a position the average moves, which is why a stop measured from it is a different stop from one measured from the first entry.

This example adds to a long position on new 20-bar highs, at most twice, and stops the whole position out two ATRs below its average price. `pyramiding = 2` in the declaration allows the second entry in the same direction.

```openscript
version 1
strategy("Stop from the average", overlay = true, precision = 2,
         qty = 1, pyramiding = 2)

atrValue = atr(14)
trendUp  = close > ema(close, 50)
newHigh  = high > highest(high, 20)[1]

// Absent while flat, so the comparison below cannot be true then.
stopLevel = pos.isFlat ? none : pos.avgPrice - 2 * atrValue

// Counted by the script, so it never relies on the pyramiding refusal.
var adds = 0
if pos.isFlat
    adds = 0

if pos.isLong and low <= stopLevel
    close()
else if trendUp and newHigh and adds < 2
    buy(tag = "add")
    adds = adds + 1

plot(stopLevel, "Stop from the average", red, style = "step")
plot(pos.isFlat ? none : pos.avgPrice, "Average price", fade(silver, 40), style = "step")
```

**Remarks.** Plotting `pos.isFlat ? none : pos.avgPrice` draws the entry price while a position is open and a gap while flat, which makes a strategy's state visible on the chart. The average is taken over the fills that make up the position, at the prices the destination reported, so any slippage is already in it.

**See also.** [[pos.size]], [[pos.openProfit]], [[pos.entries]]

## The current position

These will describe the position the strategy holds now. They are planned, and each will be absent while flat except [[pos.entries]], which will be `0`.

{{entry: pos.entryTime}}

The time the current position was opened, as a timestamp like [[time]]. It will let a strategy measure how long it has held a position in clock time rather than in bars.

{{entry: pos.barsHeld}}

How many bars the current position has been held, `0` on the entry bar. It is the natural input for an exit after a set number of bars.

{{entry: pos.entries}}

How many entries make up the current position, for a rule such as "add at most three times". It will be `0` while flat.

{{entry: pos.openProfit}}

The open position's unrealised profit in money, valued at this bar's close.

{{entry: pos.openProfitPercent}}

The same unrealised profit as a percentage of the position's cost, so one threshold can be used across instruments at very different prices.

{{entry: pos.maxProfit}}

The best unrealised profit the current position has reached since it opened, in money. With [[pos.openProfit]] it answers "how much of the move did I give back".

{{entry: pos.maxLoss}}

The worst unrealised loss the current position has reached since it opened, in money. It is the figure to watch when judging whether a stop is too wide.

## The account

{{entry: pos.isShared}}

True when the account's position in a contract this strategy holds is larger than the strategy's own: another strategy or a manual trade is in the same contract. It stays a yes or no. No call will return the account's quantity as a number, because a script that could read it would size against somebody else's trade.

## The run so far

These will read the whole run of the strategy. They are planned. A finished backtest already shows net profit, closed trades, win rate, profit factor, maximum drawdown and the equity curve in the Backtest panel's report; what is planned is reading them from inside the script, bar by bar.

{{screen: backtest-report}}

{{entry: pos.equity}}

The declaration's `capital` plus everything realised and the open position's unrealised profit. It is this strategy's equity, not your account balance.

{{entry: pos.netProfit}}

Profit realised since the run began, in money, from closed trades only.

{{entry: pos.tradeCount}}

How many trades have closed since the run began.

{{entry: pos.winRate}}

The share of closed trades that made money.

{{entry: pos.profitFactor}}

Gross profit divided by gross loss over the closed trades: above 1 means the winners made more than the losers lost.

{{entry: pos.maxDrawdown}}

The largest fall in equity from a peak to a later low so far in the run.

## Computing the planned figures today

The per-position figures are a few lines of [`var`](/script/language/persistence) each. This strategy adds up to three times on fresh highs and keeps the planned figures itself, valued at the close the way the planned entries will be, then shows them in a table:

```openscript title="Position figures by hand"
version 1
strategy("Position figures by hand", overlay = true, precision = 2,
         capital = 500000, qty = 1, pyramiding = 3)

slow    = ema(close, 21)
trendUp = close > slow
newHigh = high > highest(high, 20)[1]
goFlat  = crossDown(ema(close, 9), slow)

pointValue = orElse(chart.pointValue, 1)

var entryBar  = none
var entryTime = none
var entries   = 0
var bestOpen  = none
var worstOpen = none

// Reset while flat; start the clock on the first bar the position holds.
if pos.isFlat
    entryBar  = none
    entryTime = none
    entries   = 0
    bestOpen  = none
    worstOpen = none
else if isNone(entryBar)
    entryBar  = bar.index
    entryTime = time

barsHeld   = isNone(entryBar) ? none : bar.index - entryBar
minutesIn  = isNone(entryTime) ? none : (time - entryTime) / 60000
openProfit = pos.isFlat ? none : (close - pos.avgPrice) * pos.size * pointValue
openPct    = pos.isFlat ? none : openProfit / (abs(pos.size) * pos.avgPrice * pointValue) * 100

if not isNone(openProfit)
    bestOpen  = isNone(bestOpen) ? openProfit : max(bestOpen, openProfit)
    worstOpen = isNone(worstOpen) ? openProfit : min(worstOpen, openProfit)

// entries counts the orders sent into this position.
if trendUp and newHigh and entries < 3
    buy(tag = "add")
    entries = entries + 1
else if goFlat and pos.isLong
    close()

fn show(value, decimals) => isNone(value) ? "flat" : text(value, decimals)

panel = table("Position", 6, 2, position = "topRight", textColor = silver)
if bar.isLast
    cell(panel, 0, 0, "Bars held")
    cell(panel, 0, 1, show(barsHeld, 0))
    cell(panel, 1, 0, "Minutes held")
    cell(panel, 1, 1, show(minutesIn, 0))
    cell(panel, 2, 0, "Entries")
    cell(panel, 2, 1, text(entries))
    cell(panel, 3, 0, "Open profit")
    cell(panel, 3, 1, show(openProfit, 0))
    cell(panel, 4, 0, "Open profit, percent")
    cell(panel, 4, 1, show(openPct, 2))
    cell(panel, 5, 0, "Best and worst")
    cell(panel, 5, 1, isNone(bestOpen) ? "flat" : text(bestOpen, 0) + " / " + text(worstOpen, 0))
```

`openProfit` here is valued at the close from the average fill price, so it includes slippage and leaves out commission. The run figures (equity, realised profit, trade count and the statistics) need the price of every fill, which a script cannot read until [[order.avgFill()]] lands; read them from the backtest report instead.

:::note More than one leg
When [multi-leg strategies](/script/reference/legs) land, the twelve entries that describe one position (from [[pos.size]] to [[pos.maxLoss]] in the table above) will be refused before the first bar in a file that declares more than one leg, because adding a quantity of one contract to a quantity of another is not a position in anything. Each leg will be read by name with [[leg.size()]], [[leg.avgPrice()]] and their siblings. The money and count entries add up across legs and will read the whole strategy in every file.
:::

## Related

[Position and sizing](/script/strategies/position-and-sizing), [Reading the books](/script/strategies/reading-the-books), [Orders](/script/strategies/orders), [Strategy orders](/script/reference/strategy), [order.*](/script/reference/orders), [leg.*](/script/reference/legs), [Reading a report](/script/strategies/reading-a-report).
