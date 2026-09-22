---
title: Costs and fills
description: Where a backtest assumes each order filled, what slippage and commission it charges, and how to put a real market's cost stack into a strategy so the equity curve is one you could have earned.
---

This page covers the two assumptions every backtest makes about money: the price each order filled at, and what each fill cost. You need it before you trust any result, because a backtest without costs describes a market in which trading is free, and no such market exists.

Two terms run through the page. A **fill** is one order being executed: a buy that opens a position is one fill and the sell that closes it is another. A **round trip** is the pair, from flat back to flat. **Slippage** is the gap between the price your rule saw and the price you actually got.

The shorter the holding period, the more this matters. Take a strategy that makes two round trips a day, five lakh a side. The charges on one round trip come to roughly two hundred and thirty rupees, and one tick of slippage on each of the two fills adds more on top. Five hundred round trips a year is something like a lakh and a half of cost. An idea whose gross edge is three lakh a year is a good idea; the same idea with the costs left out looks like a great one. The cost model is the part of a strategy that decides whether the rest of it was worth writing.

## A costed strategy

Every cost setting lives in the `strategy()` declaration. This is the EMA cross from the [overview](/script/strategies/overview) with fills and costs stated rather than left at their defaults:

```openscript title="A costed EMA cross"
version 1

// 0.023 percent per fill: an illustrative intraday equity cost stack, divided
// between the two fills of a round trip. Take your own rates from your own
// contract note, and write down where the number came from.
strategy("Costed EMA cross", overlay = true, precision = 2,
         capital = 500000, qty = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "percent", commission = 0.023)

fastLen = input(9,  "Fast length", min = 1, max = 500)
slowLen = input(21, "Slow length", min = 2, max = 500)

fast = ema(close, fastLen)
slow = ema(close, slowLen)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy()
else if goFlat and pos.isLong
    close()

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
// The price the position was actually filled at, while one is open. Where it
// sits away from the close that triggered the entry, that gap is the fill model.
plot(pos.isFlat ? none : pos.avgPrice, "Filled at", silver, style = "step")
```

Run it from the Backtest panel and open the **Settings** section: under **Declared by the script** the panel lists the capital, order size, pyramiding, commission, slippage and fill rule it ran with. They are shown and not offered. To change one, edit the `strategy()` line and run again. [Backtesting](/script/strategies/backtesting) walks through the panel.

## The options that set fills and costs

| Option | Default | Accepts | What it decides |
|---|---|---|---|
| `fillOn` | `"nextOpen"` | `"nextOpen"`, `"close"` | The price a market order decided on a bar is filled at |
| `slippage` | `0` | a number of ticks, zero or more | How much worse than that price every market or stop fill is |
| `commission` | `0` | a number, zero or more | The amount charged, in the unit `commissionType` names |
| `commissionType` | `"perTrade"` | `"perTrade"`, `"perUnit"`, `"percent"` | What `commission` is measured against |
| `capital` | `100000` | a number | The starting equity the report's return is measured against |
| `qty`, `qtyType` | `1`, `"units"` | see [Position and sizing](/script/strategies/position-and-sizing) | How many units each order carries |

Leaving any of these at its default is a decision, even when it does not feel like one. Zero slippage and zero commission is the decision that trading is free.

A negative `slippage` or `commission` compiles, but the backtest refuses to start with it (OS6021), because a negative cost would pay the strategy for trading.

## Where a market order fills

`fillOn` names the price a market order is filled at when the script decides on it at a bar's close.

| `fillOn` | Decision made on | Filled at | What it assumes about you |
|---|---|---|---|
| `"nextOpen"` (default) | The close of bar `i` | The open of bar `i + 1` | You acted on a closed bar and took whatever the market opened at |
| `"close"` | The close of bar `i` | The close of bar `i` | You could trade at the same close your rule was computed from |

The default is `"nextOpen"` because a decision made from a bar's close cannot be filled at that same close in the real market. By the time the close is a number you can compare with a moving average, the bar is over. A backtest that fills there credits you with a price that was only knowable after the last moment you could have traded at it. On an instrument that gaps, the difference between one bar's close and the next bar's open is often larger than every charge on this page put together.

In both cases the trade list and the chart mark the entry on the bar after the decision, because that is the first bar that runs holding the position. Only the price differs.

`"close"` is not forbidden, because there are honest uses for it: an instrument with a closing auction you can genuinely take part in, or a rule whose inputs all come from bar `i - 1`, so that filling at bar `i`'s close looks ahead at nothing. If you set it, write a comment saying which case you are in. If you cannot name one, you are inflating your results.

## Resting orders: limits and stops

A market order has one fill price and the table above names it. An order with a price, such as `buy(limit = ...)`, `sell(stop = ...)` or [[order.place()]] with `type = "limit"`, `"stop"` or `"stopLimit"`, rests until the market reaches it, which may happen inside a bar the script never sees the inside of. A bar is only four prices, and nothing in it says whether the high came before the low, so the backtest decides those fills against the strategy rather than in its favour:

| Order | Fills when | Fills at | Slippage |
|---|---|---|---|
| Limit | The bar trades **through** the price. A bar whose high only touches a sell limit, or whose low only touches a buy limit, does not fill it | The limit price, or the bar's open when the bar opens already beyond the limit, which is the better price | None: a limit fills at its own price or better, never worse |
| Stop | The bar reaches the trigger | The trigger, made worse by the declared slippage | Yes |
| Stop, on a gap | The bar **opens** beyond the trigger | That open, made worse by the declared slippage | Yes |
| Stop limit | The bar reaches the trigger **and** trades through the limit | As a limit | None |

Being touched is not the same as being traded through. A limit resting at the exact extreme of a bar is the order that most often does not fill in practice, because other orders at that price were in the queue first. A stop does not fill at its trigger when the market gaps past it: it fills at the first price actually available, which on the day it matters most is a long way from the trigger. And a stop limit whose trigger is reached but whose limit is not traded through keeps resting as a plain limit, so it can fail to fill at all. That is what the order is, not a defect: the position it was meant to close stays open.

An order that fills inside a bar is only known to have filled once that bar is complete, so the trade list and the chart record it on the next bar, at the price it filled at.

## Stops and targets set as levels

[[exit()]] and [[order.bracket()]] attach a stop and a target to a position as price levels.

:::warn Levels in release 0.5.0
The compiler accepts `exit()` and `order.bracket()`, but the 0.5.0 backtest does not fill the levels they set: the position simply stays open past them. The OpenAlgo strategy runner refuses to start a script that calls either one. Until they land, write a stop or a target as a rule the script tests on each close, as the example further down does. [Exits and brackets](/script/strategies/exits-and-brackets) covers both forms.
:::

When level fills arrive, they are planned to follow the same conservative rules as the resting orders above: a level fills at its own price, or at the open when the bar opens beyond it; the stop pays slippage and the target does not; and when one bar's range contains both the stop and the target, the stop is taken, because nothing in a bar says which came first.

A rule-based stop is also the honest baseline for comparison. It exits at the next bar's open after the close that broke the level, which is the conservative reading. If a strategy's results depend heavily on whether its stop is a level or a rule, its returns are mostly a claim about fill quality, and fill quality is the thing you control least.

## Slippage

`slippage` is a number of ticks of adverse slippage applied to every market fill and every stop fill, and never to a limit. Adverse means it always works against you: a buy fills higher and a sell fills lower. With a tick of 0.05 and `slippage = 2`, a buy that would fill at a next open of 104.00 fills at 104.10, and the sell that closes it at an open of 109.00 fills at 108.90.

It is counted in ticks rather than in money or percent because a tick is the unit the instrument actually moves in. The tick size comes from the instrument: [[chart.tickSize]] in a script, and in the Backtest panel the tick size the platform holds for the symbol. When the platform has no tick size for an instrument, the panel runs with a tick of 0.05 and says so under the figures, because the slippage charged then rests on that assumption.

How to choose the number, in order of how much it matters:

| Ask | Then |
|---|---|
| How wide is the spread when you actually trade? | At least half the spread, in ticks, on each fill |
| How large is your order against the visible depth? | Add a tick for each extra price level you would have to take |
| When do your signals fire? | The first and last minutes of the 09:15 to 15:30 session are the widest, so a strategy that trades there pays more |
| How fast does the instrument move? | A fast instrument moves between your decision and your fill even with no spread |

Then run the only test that matters: turn it up. A declaration option can be wired to an [[input()]], and the Backtest panel then offers it as a field you can change between runs without editing the script:

```openscript title="Slippage you can turn up"
version 1

strategy("Slippage sensitivity", overlay = true, precision = 2,
         capital = 500000, qty = 1,
         fillOn = "nextOpen",
         slippage = input(1, "Slippage, ticks per fill", min = 0, max = 20),
         commissionType = "percent", commission = 0.023)

fast = ema(close, 9)
slow = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy()
else if goFlat and pos.isLong
    close()

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
```

Run it at one tick, then at two, then at four. The rule of thumb this produces is worth more than any single number: **if the edge dies between one tick and two, it was never an edge.** It was the backtest reading a price nobody would have given you.

:::note
A cost wired to an input is resolved when the run starts, so the run uses the field's value. The **Declared by the script** list reads only numbers written directly in the declaration, so it shows `0` for an option wired to an input. The input field is the one that counts.
:::

## Commission

| `commissionType` | `commission` means | Charged on every fill as | Suits |
|---|---|---|---|
| `"perTrade"` | A flat amount | `commission` | A flat fee per order |
| `"perUnit"` | An amount per unit | `commission` times the units filled | A per share or per contract charge |
| `"percent"` | A percentage of traded value | `commission / 100` times price times units | Everything that scales with turnover |

Every one of the three is charged **per fill**, and a round trip is two fills. That settles the one place a reasonable reader can take the words two ways: `commissionType = "perTrade"` with `commission = 20` charges 20 on the entry and 20 on the exit, 40 per round trip. A commission of `0` charges nothing at all.

Each fill's charge is rounded once, to the paisa, and added to the trade that fill belongs to. A trade's **Net** in the trade list is its gross result less those charges, and a trade still open at the last bar has paid its entry charge already.

## The full cost stack

What a real market charges on a round trip is rarely one of the three spellings. It is a mixture of a flat fee, percentages, a tax on the other charges and a tax that applies to one side only. In the order it usually appears on an Indian contract note:

| Charge | Base | Side | Notes |
|---|---|---|---|
| Brokerage | Turnover, or a flat fee per order | Both | Often the smaller of a percentage and a cap |
| Exchange transaction charge | Turnover | Both | Set by the exchange, varies by segment |
| Clearing charge | Turnover | Both | Small, and easy to forget entirely |
| Regulator turnover fee | Turnover | Both | Small, same |
| Tax on services | The charges above, not the turnover | Both | A tax on a tax base, so it compounds the others |
| Securities transaction tax | Turnover, premium or settlement value, by segment | Often one side only | The largest single line for many intraday strategies |
| Stamp duty | Turnover | The buy side, in most segments | Varies by state and segment |

**The rates below are illustrative.** They have the right shape and they are not your rates. Take yours from your own contract note, which is the only document that knows your plan, your segment and your state.

A worked round trip: buy five lakh of an NSE stock intraday and sell it the same day, so turnover is 5,00,000 a side and 10,00,000 in total.

| Line | Rate used | Base | Amount |
|---|---|---|---|
| Brokerage | 0.03 percent, capped at 20 per order | 5,00,000 a side | 40.00 |
| Exchange transaction charge | 0.00325 percent | 10,00,000 | 32.50 |
| Regulator turnover fee | 0.0001 percent | 10,00,000 | 1.00 |
| Tax on services | 18 percent | 73.50 of charges | 13.23 |
| Securities transaction tax | 0.025 percent | 5,00,000, sell side only | 125.00 |
| Stamp duty | 0.003 percent | 5,00,000, buy side only | 15.00 |
| **Round trip total** | | | **226.73** |

Two readings of that total, and both are useful:

- **As a percentage of turnover:** 226.73 on 10,00,000 is about 0.0227 percent per fill. Rounded up, that is `commissionType = "percent", commission = 0.023`, the setting in the first example.
- **As money per round trip:** about 227, or about 113 per fill, which is `commissionType = "perTrade", commission = 113` when the order size is stable enough for a flat figure to be honest.

Write the source of the number beside it. A cost setting with no note of where it came from is a number nobody dares change, which means it will be wrong for years.

### What a single number cannot capture

**One-sided taxes.** A percentage applied to every fill charges the sell-side tax on the buy as well. Over a round trip the total comes out right; per trade it is smeared across both sides. That is fine for an equity curve and wrong for a question like "what does one extra entry cost me", so answer that question with the arithmetic above.

**Caps and tiers.** A brokerage plan that is the smaller of a percentage and a cap is not a percentage. Work out which side of the cap your typical order sits on, use that, and check again when your size changes. A strategy that grows into its cap gets quietly cheaper, and one that shrinks out of it gets quietly dearer.

## Refuse a trade that cannot pay for itself

The most valuable thing a cost model does is not correcting the equity curve after the fact. It is stopping the trade. A strategy that knows what a round trip costs can decline the trades whose expected move does not clear it, and that filter is often worth more than any change to the entry rule.

```openscript title="Only trades that can pay for themselves"
version 1

strategy("Only trades that can pay for themselves", overlay = true, precision = 2,
         capital = 500000, qty = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "percent", commission = 0.023)

costPercent = input(0.046, "Round trip cost, percent of one side", min = 0, max = 2)
slipTicks   = input(2,     "Ticks given up per round trip", min = 0, max = 40)
edgeMult    = input(3.0,   "Target must be this many times the cost", min = 1, max = 20)
targetMult  = input(2.0,   "Target, in ATR", min = 0.2, max = 20)

atrValue = atr(14)
tick     = orElse(chart.tickSize, 0)

// The cost of a round trip expressed in price, so it can be compared with a
// move in price. Charges scale with the price; slippage does not.
costInPrice = close * costPercent / 100 + slipTicks * tick
target      = targetMult * atrValue

// An ordered comparison against an absent value is absent, and an absent
// condition takes the false branch, so this one test also covers warmup.
worthIt = target > edgeMult * costInPrice

fast   = ema(close, 9)
slow   = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

var targetLevel = none
var stopLevel   = none

if goLong and worthIt and pos.isFlat
    buy()
    targetLevel = close + target
    stopLevel   = close - atrValue

// The target and the stop as rules tested on each close. They fill at the next
// bar's open, which is the conservative reading, and they run the same way in a
// backtest and in a deployed strategy.
hitTarget = close >= targetLevel
hitStop   = close <= stopLevel

if pos.isLong and (goFlat or hitTarget or hitStop)
    close()
    targetLevel = none
    stopLevel   = none

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)

// The two quantities the filter compares, on their own pane, so a run that takes
// no trades explains itself at a glance.
plot(target, "Target", lime, overlay = false)
plot(edgeMult * costInPrice, "Cost hurdle", red, overlay = false)
```

The last two plots are the part to keep. When a costed strategy stops trading, the first question is whether the entry rule stopped firing or the cost filter started refusing, and two lines on a pane answer it without a single print statement.

## A costs panel

The Backtest panel has no figure for the total charged: the charges are inside every trade's **Net** and inside **Net profit**, never shown on their own. To see them, put an estimate on the chart. A script can count its own round trips from [[pos.size]]: a round trip ends on the bar the position returns to flat, and on that bar `pos.size[1]` and `pos.avgPrice[1]` still describe the position that just closed.

```openscript title="Cost panel"
version 1

strategy("Cost panel", overlay = true, precision = 2,
         capital = 500000, qty = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "percent", commission = 0.023)

costPercent = input(0.046, "Round trip cost, percent of one side", min = 0, max = 2)

fast = ema(close, 9)
slow = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy()
else if goFlat and pos.isLong
    close()

var roundTrips = 0
var costPaid   = 0.0

// The bar a position returns to flat. The value one bar back is the position
// that has just closed, with its size and its average price.
if not bar.isFirst and pos.size[1] != 0 and pos.size == 0
    roundTrips += 1
    costPaid += abs(pos.size[1]) * pos.avgPrice[1] * costPercent / 100

panel = table("Costs", 3, 2, position = "bottomRight", textColor = silver)

// Written only on the newest bar: a panel shows one state.
if bar.isLast
    cell(panel, 0, 0, "Round trips")
    cell(panel, 0, 1, text(roundTrips))
    cell(panel, 1, 0, "Estimated cost paid")
    cell(panel, 1, 1, text(costPaid, 0))
    cell(panel, 2, 0, "Average per round trip")
    cell(panel, 2, 1, roundTrips > 0 ? text(costPaid / roundTrips, 0) : "no round trips")

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
```

The estimate counts charges only. Slippage is already inside the fill prices, so it is in **Net profit** and not in this panel.

Set the estimate beside the report's **Net profit**. Costs as a share of what the idea earned before costs, that is costs divided by net profit plus costs, is the figure to watch. Below about a fifth, the strategy owns its returns. Above a half, you are running a business whose main customer is the cost stack, and the fix is fewer and larger trades rather than a better entry.

## What still differs from the real account

Even a fully costed backtest is a model. These are the gaps that remain, so you recognise them when the account underperforms the report:

| Gap | Why it exists | What to do |
|---|---|---|
| Queue position | A backtest does not know how many orders were ahead of yours at a price | Treat resting limit fills as optimistic |
| Partial fills | A backtest fills the whole order or none of it | Size below the visible depth |
| Market impact | Your own order moves the price, and the historical bars did not contain it | Trade smaller than you think you can |
| Rejections | Margin, product and permission refusals happen in a real account and never in history | Watch the order book of a deployed strategy, and size for the worst point |
| Carry and funding | Holding overnight costs money that a bar series does not show | Account for it outside the strategy, per position per night |
| Missed bars | A strategy that was not running took no trades | Compare trade lists, not just curves |

None of these is an argument against backtesting. They are the reason a backtest result is a hypothesis and [sandbox trading](/script/strategies/sandbox-and-live) is the test of it, which is why the same script runs in both without being rewritten.

## Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Wonderful equity curve, poor real results | Costs left at zero | Fill in the stack, then run again |
| The edge halves when slippage goes from one tick to two | The edge was fill quality | Trade a slower version of the idea |
| Entries sit exactly at the close that triggered them | `fillOn = "close"` | Leave the default unless you can name the honest case |
| A stop level the script set never exits the backtest | Levels set with `exit()` are not filled in 0.5.0 | Write the stop as a rule tested on each close |
| Cost per round trip looks twice what you expected | `"perTrade"` is charged on every fill, and a round trip is two | Halve the figure, or use the per fill amount |
| Your rates changed and the backtest still charges the old ones | The cost is a bare number with no note of where it came from | Wire it to an `input()` with a comment on its source |

**Related.** [Backtesting](/script/strategies/backtesting), [Reading a report](/script/strategies/reading-a-report), [Orders](/script/strategies/orders), [Exits and brackets](/script/strategies/exits-and-brackets), [Position and sizing](/script/strategies/position-and-sizing), [Declarations reference](/script/reference/declarations)
