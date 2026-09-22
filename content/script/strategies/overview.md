---
title: Overview
description: What a strategy file is, how it differs from a study, what happens to an order from the line that asks for it to the fill, and where a strategy runs in /trading.
---

A strategy is an OpenScript file (OpenScript is also called OpenAlgo Script) that draws like a study and can also place orders. This page covers what changes when you declare `strategy()` instead of `study()`, the options only a strategy has, what happens to an order on every bar, where a strategy runs in /trading, and which parts of the strategy surface run in version 0.5.0. Read it before the other strategy pages: they all build on the loop described here.

## A first strategy

Here is a complete strategy. It trades a 9 and 21 bar EMA cross on whatever chart it is added to: an NSE stock, an index future on NFO or a contract on MCX.

```openscript title="EMA cross, traded"
version 1
strategy("EMA cross, traded", overlay = true, precision = 2,
         capital = 500000, qty = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

fastLen = input(9,  "Fast length", min = 1, max = 500)
slowLen = input(21, "Slow length", min = 1, max = 500)

fast = ema(close, fastLen)
slow = ema(close, slowLen)

// Both signals are computed at the top level, so each call sees every bar.
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy(tag = "entry")
else if goFlat and pos.isLong
    close()

plot(fast, "Fast", aqua, width = 2)
plot(slow, "Slow", orange, width = 2)
plot(pos.isFlat ? none : pos.avgPrice, "Entry", fade(silver, 40), style = "step")
```

Compared with a study that only marks the cross, three things were added:

- **A size.** `qty = 1` in the declaration is the size every order uses unless it names its own.
- **A position guard.** `pos.isFlat` and `pos.isLong` stop the script entering again on every bar the condition stays true.
- **A decision about which branch wins.** `else if` means the two orders can never be sent on the same bar.

The last plot is a habit worth forming early. It draws the average entry price while a position is open and a gap while flat, because [[pos.avgPrice]] is absent when there is no position. A strategy whose position is visible on the chart is a strategy whose bugs are visible on the chart.

On the /trading chart a strategy runs against the same simulated fill model the Backtest panel uses, and places nothing. A **fill** is an order being executed at a price, and each simulated fill is marked on the bar it happened on:

{{screen: strategy-on-chart}}

## One word separates a study from a strategy

A file carries exactly one declaration, right after the `version` line. `study(...)` declares a script that draws. `strategy(...)` declares a script that draws and can also place orders. It accepts every option `study()` accepts and adds the trading options below, so one file holds the drawing and the trading, computed once, from the same numbers. The indicator on your chart and the rules in your backtest cannot drift apart, because they are the same lines.

The order functions exist only in a strategy. Call one from a study and the compiler refuses it with OS7001, naming the declaration to change:

```openscript expect=OS7001
version 1
study("EMA cross, marked", overlay = true)

if crossUp(ema(close, 9), ema(close, 21))
    buy(qty = 1)
```

## The strategy options

These are the options `strategy()` adds to the ones every study has (`title`, `short`, `overlay`, `precision`, `format`, `range`, `scale`, `group` and `onUnconfirmed`):

| Option | Default | Accepts | Controls |
|---|---|---|---|
| `capital` | `100000` | a number | Starting equity for the backtest |
| `currency` | `""` | a string | The label money is shown with in the report |
| `qty` | `1` | a number | The order size used when an order names none |
| `qtyType` | `"units"` | `"units"`, `"lots"`, `"cash"`, `"equityPercent"` | The unit `qty` is counted in |
| `product` | `"intraday"` | `"intraday"`, `"overnight"` | The product every order is sent with |
| `fillOn` | `"nextOpen"` | `"nextOpen"`, `"close"` | Where a market order decided on a bar is filled |
| `slippage` | `0` | a number | Ticks of adverse slippage on every market and stop fill |
| `commission` | `0` | a number | The charge, in the unit `commissionType` names |
| `commissionType` | `"perTrade"` | `"perTrade"`, `"perUnit"`, `"percent"` | How `commission` is applied |
| `pyramiding` | `1` | a whole number, 1 or more | How many entries one direction may hold |
| `closeOnSessionEnd` | `false` | `true` or `false` | Flatten at the session close |

A **tick** is the smallest step the instrument's price can move, such as 0.05 rupees, and **slippage** is the difference between the price you expected and the one you got. **Pyramiding** means adding to a position you already hold.

Every option value must be fixed before the first bar: a literal, arithmetic over literals, or an [[input()]] call. The settings dialog and the legend are built before any data arrives, so an option that depended on a bar would have nothing to be built from, and the compiler refuses it with OS3003.

Two defaults are deliberately set against you. `fillOn = "nextOpen"` because a decision made from a bar's close cannot be filled at that same close in the real market. `pyramiding = 1` because a script that adds to a position by accident reports a return its stated rules never earned.

:::warn What /trading does with these options in 0.5.0
- `qtyType = "cash"` and `qtyType = "equityPercent"` are accepted by the compiler and refused by the Backtest panel before the run starts: a backtest fills in units and keeps no running equity to size against.
- `qtyType = "lots"` has a known backtest defect with closing orders, and the Strategies panel refuses to start a strategy that counts in anything but `"units"`. Count in units, as [Position and sizing](/script/strategies/position-and-sizing) shows.
- `closeOnSessionEnd = true` is accepted and not acted on by the backtest or by a deployment: a position is carried past the session close. Write the exit in the script, as [Exits and brackets](/script/strategies/exits-and-brackets) shows.
:::

## A strategy keeps its own books

One rule sits under every strategy page, so it is worth stating before any call:

:::key
A strategy never places an order worked out as a difference against the account's position. Every order states its own side and its own quantity, and everything a strategy knows about its position comes from its own fills.
:::

An account position is held per contract, not per strategy. A trade you placed by hand, a second strategy on the same contract, or this same script started twice all land in the same row. An order that read that row and sent the difference would be computing against somebody else's trade: two strategies on one NIFTY future would keep undoing each other all session, and a strategy that found your manual position already in place would never enter, report no trade, and leave its stop resting against a position that is not its own.

So [[pos.size]], [[pos.avgPrice]] and the rest are folded from this strategy's own settled fills. No call returns the account's quantity. [[pos.isShared]], which is planned, will report that the account's position in this contract is shared with something else, such as a manual trade or another strategy, as a yes or no that a human should look into.

## A marker is not an order

These three calls look alike in a file and do entirely different things:

| Call | What it does | Can it be refused | Moves money | When it happens |
|---|---|---|---|---|
| [[signal()]] | Draws one named marker on the bar | No | No | When the bar is confirmed |
| [[alert()]] | Raises one watched condition for the host to deliver | No | No | When the bar is confirmed |
| [[buy()]] | Sends one order to the order destination | Yes | Yes | Placed when the bar is confirmed, filled later |

A bar is **confirmed** once it has closed and its prices can no longer change. A marker is a statement about the chart, and nothing can stop it being drawn. An order is a request, and it can be refused: for an absent price or size (OS7002), a size of zero or less (OS7004), a price off the tick (OS7006), a resting order with no price (OS7007), an entry beyond the pyramiding limit (OS7008), cancelling a tag that is not working (OS7009), a stop or target on the wrong side of an open position (OS7010), two opposite orders on one bar (OS7013), or a close larger than what it closes (OS7017). [Orders](/script/strategies/orders) lists every refusal with its usual cause.

:::warn A refused order stops the script
In version 0.5.0 a refused order stops the run at the bar it happened on. Nothing that bar decided is sent, and no later bar executes. In the Backtest panel the report then holds only the trades made before it, and the panel does not show the error, so a run with far fewer trades than the chart suggests is worth checking for one. The guards below are what keep a strategy from ever reaching one.
:::

## What happens on every bar

A strategy has no main function. The file is the body of a loop, and for each bar, oldest first, the engine runs every top-level statement from the first line to the last. For a strategy, one execution of one bar goes like this:

| Step | What happens |
|---|---|
| 1 | The bar's `open`, `high`, `low`, `close`, `volume` and `time`, and the [bar facts](/script/reference/bar), are filled in |
| 2 | Every fill the destination has reported is folded into the strategy's own ledger, so `pos.size`, `pos.avgPrice` and the rest describe what is actually held now |
| 3 | Inputs are read from the settings dialog |
| 4 | The script runs, top to bottom, once |
| 5 | Every plot, fill, level, table cell and drawing is published, whether the bar is confirmed or not |
| 6 | If the bar is confirmed, every marker, alert and order the script asked for is applied. If it is still forming, they are discarded |

Step 6 surprises people, so be exact about it. When `buy(qty = 1)` runs, nothing is sent. The call records what it was asked to do, and the record is applied at the end of the bar, and only if the bar is confirmed. On a bar that is still forming, the record is thrown away and rebuilt on the next update. A condition that was true halfway through a bar and false when it closed never places an order.

That is why an order function returns nothing: there is no order yet to hand back. A script that needs to act on its own order reads [[pos.size]] on a later bar, where the fill is a fact. With the default `fillOn = "nextOpen"`, an order decided at the close of one bar fills at the next bar's open, and the position is already in place when that next bar runs:

```openscript title="Reading back a fill"
version 1
strategy("Reading back a fill", overlay = true, capital = 500000)

goLong = crossUp(ema(close, 9), ema(close, 21))

if goLong and pos.isFlat
    buy(qty = 1, tag = "entry")

// The previous bar's reading, taken on its own line so it is recorded on
// every bar. Written inside the "and" below, it would only be recorded on
// the bars where that side runs.
wasLong = pos.isLong[1]

// True on the first bar the position is held: the order was decided on the
// bar before and filled at this bar's open.
justFilled = pos.isLong and not wasLong

if justFilled
    signal("FILLED AT " + text(pos.avgPrice, 2), at = "below")
```

Two more consequences of the loop catch people once:

**The newest bar runs many times.** While a bar is forming it is executed again on every update. Before each run the engine restores every [persistent](/script/language/persistence) value to what it held at the end of the previous bar, so running the forming bar ten times gives the same answer as running it once. That is what makes the chart and a backtest of the same data agree. [Realtime and confirmation](/script/language/realtime-and-confirmation) covers it in full.

**Acting inside a bar is opt-in.** `onUnconfirmed = true` in the declaration lifts the deferral, and from then on the script writes its own confirmation guard, or it places an order on every update of the bar:

```openscript
version 1
strategy("Intrabar, guarded", overlay = true, onUnconfirmed = true)

goLong = crossUp(ema(close, 9), ema(close, 21))

if goLong and bar.isConfirmed and pos.isFlat
    buy(qty = 1)
```

## The guards every strategy needs

A strategy is mostly the same code as the study plus a handful of guards. Learn them as a set: leaving one out produces a backtest that looks fine and is not.

| Guard | Written as | Why |
|---|---|---|
| Warmup | `not isNone(x)` | A window that has not filled yet has no value (it is [absent](/script/language/absent-values)), and an order given an absent price or size is refused (OS7002) |
| Position | `pos.isFlat`, `pos.isLong` | Without it a one-lot idea enters again on every bar the condition holds |
| One branch | `else if` | Two opposite orders on one bar are refused (OS7013) |
| Trading hours | [[session.isIn()]] with a named zone | Keeps entries inside the hours you mean, such as 09:30 to 15:00 on NSE |
| Top level | signals computed before the `if` | A stateful call such as [[crossUp()]] inside a branch only advances on the bars the branch runs (warning OS8001) |

**Warmup** is the run of early bars before an indicator has enough history to give a value. The last guard applies to `and` as well: its right side is not evaluated when its left side is false, so write `goLong = crossUp(fast, slow)` at the top level and test `goLong and pos.isFlat`, rather than putting the call inside the condition.

[[session.isOpen]] is planned. Until it lands, [[session.isIn()]] with a window you write is the trading-hours guard. Name the zone, `"Asia/Kolkata"` for Indian markets: the chart states its timezone to the script, but the Backtest panel does not, and there a window with no zone has no value on any bar, so the strategy never trades.

```openscript title="Breakout, guarded"
version 1
strategy("Breakout, guarded", overlay = true, precision = 2,
         capital = 500000, qty = 1, product = "intraday")

length = input(20, "Breakout lookback", min = 2, max = 500)

// The window as it stood before this bar, so this bar's own high cannot be
// the level it is breaking.
breakoutLevel = highest(high, length)[1]

ready    = not isNone(breakoutLevel)
inHours  = session.isIn("0930-1500", "Asia/Kolkata")
breakout = close > breakoutLevel

if ready and inHours and pos.isFlat and breakout
    buy(tag = "entry")
else if pos.isLong and not inHours
    close()

plot(breakoutLevel, "Breakout level", aqua, style = "step")
```

A strategy deployed from the Strategies panel cannot read the clock this way in version 0.5.0: the runner refuses to start a script that calls [[session.isIn()]] or any `date.*` function on an Indian instrument. [Sessions and time](/script/data/sessions-and-time#sessions-and-the-clock-in-trading-today) shows a trading window built from arithmetic on [[time]] that works in all three places.

## Where a strategy runs in /trading

The same compiled strategy runs in three places, and the numbers it computes do not change between them. What changes is where its orders go.

| Where | Orders go to | Money |
|---|---|---|
| On the chart | A simulated fill model in your browser. Nothing is placed | None |
| The Backtest panel | The same fill model, over history | None |
| A deployment from the Strategies panel, while OpenAlgo is in analyzer mode | Sandbox trading (analyzer mode in OpenAlgo) | None |
| A deployment, while OpenAlgo is in live mode | Your broker, through OpenAlgo's own order path | Yours |

**Nothing in a script decides where its orders go.** A deployment sends through the platform's order path, and that path follows OpenAlgo's analyzer setting, which is one setting for the whole platform, made outside the Strategies panel. There is no call, option or input that chooses the destination, and no call that reports it, so a script cannot behave differently once it is live and the run you tested in the sandbox is the run that goes to market.

The Strategies panel shows the platform's current mode in its header, and its start button names the destination it is about to use:

{{screen: strategies-panel}}

The runner that executes a deployment supports a subset of the language in version 0.5.0: quantities in units only, no [[exit()]] or [[order.bracket()]], and no calendar or session reads. It refuses anything else before the first order, and [Sandbox and live](/script/strategies/sandbox-and-live) lists each refusal with its fix.

A strategy that wants its stop or target drawn plots it like any other value. The chart shows what happened; the destination decides what happens.

## What runs in version 0.5.0

The strategy surface is designed in full and partly built. The names that are not built yet are still in the language, and calling one is refused at the call with OS2020, so you find out where you wrote it.

| Runs today | Planned |
|---|---|
| [[buy()]], [[sell()]], [[close()]], [[exit()]], [[cancel()]], [[cancelAll()]] | Reading an order back: [[order.working()]], [[order.pending]], [[order.status()]], [[order.filled()]] and the rest |
| [[order.place()]], [[order.reverse()]], [[order.bracket()]] | Sizing helpers: [[order.qtyForRisk()]], [[order.qtyForCash()]], [[order.roundToLot()]] |
| [[pos.size]], [[pos.isLong]], [[pos.isShort]], [[pos.isFlat]], [[pos.avgPrice]] | [[pos.barsHeld]], [[pos.openProfit]], [[pos.equity]] and the other position and run figures |
| The declaration options above | Legs and books: every `leg.*` and `book.*` call, and [[order.oco()]] and [[order.modify()]] |

Some behaviour is not modelled yet, and each page says where it matters:

- A stop or target set with [[exit()]] or [[order.bracket()]] is not filled on the chart or in a backtest, and a deployment refuses to start a script that calls either.
- `closeOnSessionEnd` does not flatten a position at the session close.
- Sizing in `"cash"` or `"equityPercent"` is refused by the backtest.
- Five refusals are catalogued and not raised yet: a size that is not a whole number of lots (OS7005), an order needing more capital than the strategy has (OS7011), an order outside the session (OS7012), a rejection by the destination (OS7014) and a strategy with no destination (OS7015).

## Two shapes a strategy can take

Every script on this page trades one instrument, the one on its chart, and opens and closes it on its own signals. That is the **per-leg** shape, and [[buy()]], [[sell()]] and [[close()]] are its short spelling. The language also defines a shape that enters several contracts **as a unit**, such as the two legs of a short straddle on NIFTY weekly options, and manages them with one combined stop. That shape is planned; [Legs and books](/script/strategies/multi-leg-and-books) describes it.

## Mistakes that look like results

| Symptom | Cause | Fix |
|---|---|---|
| The position grows every bar the condition is true | No position guard | Add `and pos.isFlat`, or raise `pyramiding` on purpose |
| The backtest stops partway, with far fewer trades than the chart shows | A refused order, most often OS7008: a second entry with `pyramiding = 1` | Guard entries with `pos.isFlat` |
| No trades at all in the Backtest panel | A trading window written without a zone, such as `session.isIn("0930-1500")` | Name the zone: `session.isIn("0930-1500", "Asia/Kolkata")` |
| The backtest is much better than the account | `fillOn = "close"`, no slippage, no commission | Keep the defaults, then add real costs |
| Orders appear on history and not on the forming bar | The condition is true inside the bar and false at its close | Nothing to fix: that is the deferral working |
| A stop plotted on the chart never exits the backtest | Levels from `exit()` are not filled in 0.5.0 | Test the level in the script, as [Exits and brackets](/script/strategies/exits-and-brackets) shows |

**Related.** [Orders](/script/strategies/orders), [Exits and brackets](/script/strategies/exits-and-brackets), [Position and sizing](/script/strategies/position-and-sizing), [Costs and fills](/script/strategies/costs-and-fills), [Backtesting](/script/strategies/backtesting), [Sandbox and live](/script/strategies/sandbox-and-live), [Your first strategy](/script/getting-started/first-strategy), [Strategy orders reference](/script/reference/strategy)
