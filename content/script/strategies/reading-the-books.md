---
title: Reading the books
description: The orders, fills and trades a strategy run produces, the ledger every position figure is folded from, the Activity books of a deployed strategy, and what a script can read about its own position in release 0.5.0.
---

Every strategy keeps its own books: a record of each order it placed, what each order filled at, and the position those fills add up to. This page covers where those books show up in /trading, what the ledger underneath them holds, why the same fill can be reported twice without being counted twice, and what a script can read about its own orders and position today.

The rule behind all of it is short. **A strategy's position and profit are folded from its own settled fills, and from nothing else.** No call reads your account's position, and no order is ever computed as a difference against it.

## A script that reads its own books

A strategy can put what it believes about its own position on the chart. This panel uses only calls that run in release 0.5.0:

```openscript title="Books panel"
version 1

strategy("Books panel", overlay = true, precision = 2,
         capital = 500000, qty = 1)

fast = ema(close, 9)
slow = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy(tag = "entry")
else if goFlat and pos.isLong
    close(tag = "entry")

// One place that decides what an absent reading looks like. A blank cell hides
// that there is nothing, and a zero invents a number.
fn show(value, decimals) => isNone(value) ? "none" : text(value, decimals)

side     = pos.isLong ? "long" : (pos.isShort ? "short" : "flat")
openMove = pos.isFlat ? none : (close - pos.avgPrice) * pos.size

// A fact the ledger will answer once order reads land, kept by the script
// meanwhile: how many bars the position changed on.
var fills = 0
if not bar.isFirst and pos.size != pos.size[1]
    fills += 1

panel = table("Books", 5, 2, position = "topRight", textColor = silver)

// Written only on the newest bar. A panel shows one state.
if bar.isLast
    cell(panel, 0, 0, "Side")
    cell(panel, 0, 1, side)
    cell(panel, 1, 0, "Position, units")
    cell(panel, 1, 1, text(pos.size))
    cell(panel, 2, 0, "Average price")
    cell(panel, 2, 1, show(pos.avgPrice, 2))
    cell(panel, 3, 0, "Open result")
    cell(panel, 3, 1, show(openMove, 0))
    cell(panel, 4, 0, "Bars the position changed on")
    cell(panel, 4, 1, text(fills))

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
plot(pos.isFlat ? none : pos.avgPrice, "Average price", silver, style = "step")
```

[[pos.size]] is the net position in units, positive long and negative short, and `0` when flat. [[pos.avgPrice]] is the average price of the open position and absent while flat, which is why the panel passes it through `show()` rather than straight to `text()`. Both move only when a fill settles, never when an order is merely sent.

## Where the books show up

| Where | What you see | Built from |
|---|---|---|
| Backtest panel | The trade list, and the marks on the chart | The run's own ledger of orders and fills |
| Strategies panel, **Activity** | **Orders**, **Trades** and **Positions** tabs | The platform's own order book, trade book and position book, narrowed to this deployment's orders |
| Inside the script | [[pos.size]], [[pos.avgPrice]], [[pos.isLong]], [[pos.isShort]], [[pos.isFlat]] | The strategy's own settled fills |

The same idea runs through all three. A strategy is judged on what it did, which is what filled, and not on what it asked for or on what the account happens to hold.

## Every strategy keeps its own books

An account holds one position per contract, and that position can have several owners: a strategy, a second strategy on the same contract, and a trade you placed by hand. A report built from the account's position would be a report about somebody else's trades as much as your own. So each strategy keeps its own ledger, and everything the language says about a position is a sum over that ledger.

Two consequences follow, and both are deliberate:

- **Two strategies on one contract each see their own position.** If one goes long two lots while another goes short two lots, the account is flat and both strategies correctly believe they have a trade on. Each order states its own side and quantity outright, so the two trade their own plans and the account nets them. Neither ever sends an order to "correct" itself towards the account, which is how two strategies would otherwise spend a session undoing each other.
- **Nothing in a script reads the account's quantity.** A script that could would be computing against whoever else is trading that contract. The planned [[pos.isShared]] will report, as a yes or no, whether the account's position in a contract is shared with something other than this strategy, and that is the only fact about the account the language intends to give.

## The ledger

The ledger holds one row per order placed. A row is added when the order is sent, and after that it changes only when the destination (the sandbox, your broker, or the backtest's fill model) sends a report about that order. Nothing is ever filled in by guesswork, so the sequence that produced a position can be replayed and audited rather than inferred. You do not see the ledger directly: the trade list, the chart marks and the `pos.*` values are all built from it.

| Field | Holds |
|---|---|
| `intentId` | The engine's own key for the order, unique within the run |
| `orderRef` | The destination's own order id, exactly as given, `""` until the destination answers |
| `tag` | The tag the script placed the order with, `""` when it named none |
| `leg` | The leg the order belongs to, `""` for a strategy that trades one instrument. [Legs and books](/script/strategies/multi-leg-and-books) covers legs |
| `positionRef` | The position this order settles against, below |
| `instrument` | The contract actually sent: its symbol and exchange |
| `product` | The product actually sent, which may be a different word from the one the script declared |
| `side`, `qty`, `type`, `price`, `trigger` | The order as it left the engine |
| `status` | The folded status, below |
| `filledQty` | The cumulative filled quantity, never a change |
| `avgFillPrice` | The destination's average price over `filledQty`, absent while nothing has filled |
| `rejection` | The destination's own rejection text, `""` when there is none |
| `placedAt`, `updatedAt` | When the order was sent, and when a report last changed the row |

The product and the contract are recorded as sent rather than as declared, because a position reconciled against a word nobody sent is reconciled against something nobody traded.

### Statuses

| Status | Means | Ends the order |
|---|---|---|
| `placed` | Sent, and the destination has not answered yet | No |
| `working` | Accepted by the destination and not completely filled | No |
| `triggerPending` | Accepted and waiting for its trigger price | No |
| `filled` | The whole quantity is filled | Yes |
| `cancelled` | Ended by a cancellation | Yes |
| `rejected` | Refused, carrying the destination's own text | Yes |
| `expired` | Ended without filling, by the destination's own rule | Yes |

A status only moves forward, from `placed` through `working` or `triggerPending` to one of the four that end an order, and an ended order never changes status again. `placed` is the engine's own word; every other status comes from the destination.

### Position references, and why a reversal is two orders

Every order carries a position reference. One is created when the strategy goes from flat to holding, and it ends when that position returns to zero through settled fills. A fill always settles the position its own order names, never whichever position is current, so a fill that arrives late cannot be applied to the position that replaced the one it belonged to.

That is why no order crosses zero. [[order.reverse()]] on a long position is two orders: one that closes the long and one that opens the short, each with its own reference. In a backtest the chart shows both on the same bar, an **Exit long** mark and a **Short** mark. The OpenAlgo strategy runner still sends a reversal to the platform as the single net order it adds up to, and splits the fill back across the two positions afterwards.

An instruction that orders nothing adds no row: a stop or target set with [[exit()]] or [[order.bracket()]] and a cancellation with [[cancel()]] name a position or an order without becoming one.

## A fill can be reported twice without being counted twice

A destination's report about an order is cumulative: it restates the order's whole life so far, not what changed since the last report. Reports repeat, cross in flight and arrive late. A connection that reconnects resends its last reports, and a destination unsure whether you heard it says it again. None of that is a fault.

An engine that added up each report's quantity would double a fill and report a position the strategy never held. The ledger folds a report instead:

1. **The filled quantity is the larger** of what the row holds and what the report says, so a repeated or stale report changes nothing.
2. **The average price is the destination's**, taken only when the filled quantity grew. The engine never averages two averages of its own.
3. **The status moves forward or not at all.** A report about an order that has already ended cannot change its status, but a fill it carries still counts: when a cancellation and a fill cross in flight, the shares really traded, and a ledger that dropped them would hide a position the strategy holds.

Three practical consequences, in the order they reach a strategy:

- **The position moves by what newly settled, once.** [[pos.size]] changes by exactly the quantity a report adds, however many times that report arrives, so reading the position is always safe.
- **A partial fill is a state, not an event.** The backtest fills every order whole, but a real destination can leave an order at `working` with part of its quantity filled for as long as it takes. Guard on the position rather than on the idea that an order is either untouched or done.
- **Never count anything by counting reports.** When the planned order reads arrive, [[order.filled()]] will return the running total, not a change: to know what filled on one bar, take the difference from the previous bar.

## From the ledger to the trade list

The Backtest panel does not show ledger rows. It shows the trades built from them. A **trade** is one position from flat back to flat:

- Its **Entry** is the average price over every fill that built the position, and its **Exit** the average over every fill that closed it.
- A strategy that adds to a position before closing it, with `pyramiding` above `1`, has one trade for the whole position, with the combined size at the average entry.
- Its charges are the charges of every fill that belongs to it, and its **Net** is its gross result less those charges.
- A position still open at the last bar is a trade marked **open**, with no exit.

Each fill is also one mark on the chart, on the bar the run records it on, so a round trip is an entry mark and an exit mark. [Reading a report](/script/strategies/reading-a-report) covers both.

:::note Changing size inside a trade, and the equity curve
A trade holds one entry price and one size for the whole position, so the equity curve values it at its final size and average entry from the bar it first opened. A strategy that adds to a position is therefore shown, on the bars before the later entries, holding units it did not hold yet, and its drawdown reads worse than it was. A strategy that closes part of a position is shown still holding the whole of it until the trade ends. Net profit and the trade list are not affected, because they are folded from the fills.
:::

## Reading the books from a script

### What runs in release 0.5.0

| Call | When flat | Means |
|---|---|---|
| [[pos.size]] | `0` | Net position in units, positive long and negative short |
| [[pos.isLong]], [[pos.isShort]], [[pos.isFlat]] | flat is `true` | The sign of `pos.size`, spelled out |
| [[pos.avgPrice]] | absent | The average price of the open position |

These are enough for the guards every strategy needs, and for any fact you can derive yourself. The panel above works out the open result from the average price, and counts position changes by comparing `pos.size` with its value on the previous bar.

### What is planned

The rest of the ledger's reads are planned. A planned call is refused where you write it, with OS2020, so a script cannot compile around one by accident:

```openscript expect=OS2020
version 1
strategy("Planned read", overlay = true)

if crossUp(ema(close, 9), ema(close, 21))
    buy(tag = "entry")

plot(order.filled("entry"), "Filled so far")
```

| Planned call | Will read |
|---|---|
| [[order.status()]] | An order's folded status, from the table above |
| [[order.filled()]] | Its cumulative filled quantity, `0` before the first fill |
| [[order.avgFill()]] | Its average fill price, absent before the first fill |
| [[order.working()]], [[order.pending]] | Whether an order is still working and unfilled, and how many are |
| [[order.id()]] | The destination's own order id |
| [[order.rejection()]] | The destination's own rejection text |
| [[pos.entryTime]], [[pos.barsHeld]], [[pos.entries]] | When the position opened, bars since, and how many entries built it |
| [[pos.openProfit]], [[pos.maxProfit]], [[pos.maxLoss]] | The open result in money, and the best and worst the position has seen |
| [[pos.equity]], [[pos.netProfit]], [[pos.tradeCount]] | The strategy's own equity, realised profit and closed trade count |

Until they land, keep what you need in a [`var`](/script/language/persistence), set when you place an order and cleared when the position changes.

### Tags that name something

A tag on [[close()]] or [[cancel()]] names an order the script placed. Three rules keep that honest:

- **A close whose tag no order in the file is placed with is refused when the script compiles**, with OS7016. It is almost always a typo. A [[cancel()]] with such a tag is not checked in this release, so spell those with care:

```openscript expect=OS7016
version 1
strategy("A mistyped tag", overlay = true)

goLong = crossUp(ema(close, 9), ema(close, 21))
goFlat = crossDown(ema(close, 9), ema(close, 21))

if goLong and pos.isFlat
    buy(tag = "entry")
if goFlat and pos.isLong
    close(tag = "entyr")
```

- **A close on a tag that holds nothing right now sends nothing and says nothing**, which is what makes closing the same tag twice safe to write.
- **A close with a `qty` larger than what is left is refused** at the bar, with OS7017, because no order crosses zero. Guard a scale-out on `pos.size`, or leave the quantity out and let the close send what is there.

## The books of a deployed strategy

A strategy deployed from the **Strategies** panel keeps books at the platform, and the panel shows them. Press **Activity** on a deployment's row to open them, and **Hide** to fold them away.

| Tab | Columns |
|---|---|
| **Orders** | Symbol, Side, Qty, Price, Status |
| **Trades** | Symbol, Side, Qty, Price, At |
| **Positions** | Symbol, Net, Avg, P&L |

**Refresh** reads the tab again, and the tabs also read themselves again whenever an order is placed, changed or cancelled anywhere on the platform. A tab with nothing to show says so, for example **No orders from this strategy yet**. A tab that cannot be read says why in place, without hiding the other two.

These are the platform's own books, narrowed to this deployment. Every order a running deployment places carries the deployment's own id as its strategy tag, and the **Orders** and **Trades** tabs are the platform's order book and trade book filtered on that tag. Two deployments of the same script, on two instruments or two intervals, therefore keep separate books. The statuses are the platform's own words, such as `complete`, `open`, `trigger pending`, `rejected` and `cancelled`.

The books are read from the side the platform is set to now: the sandbox's books while OpenAlgo is in analyzer mode, your broker's while it is in live mode, and the tabs read themselves again when that setting changes. Orders a deployment placed on the other side are in the other side's books, so after switching modes its earlier activity is not in these tabs until you switch back.

**Positions is weaker than the other two, and it says so.** A position is held per contract and carries no strategy, so the tab lists the contracts this deployment traded, and a row may include size another strategy or a manual order opened. It tells you what you are in because of this strategy, not what the strategy is worth.

The line on the deployment's row, **Flat** or the side, size, symbol and average price, is read from the same narrowed position book. The profit beside it is the deployment's own, from the platform's record of this deployment's orders, and it includes profit already taken on positions the strategy has since closed, which is why a figure can appear beside **Flat**, with a note saying where it came from.

## Reconciling the books with the account

Once a day, compare what a deployment's row says it holds with your account's own positions. They should agree, except for whatever another strategy or a manual trade holds in the same contract. The day they differ for any other reason is the day to find out from the panel rather than from a statement.

Two situations make them differ by design:

- **A run that restarts begins flat.** A deployment started again, by you or after the platform restarts, replays recent history without sending anything and holds nothing, whatever the account holds from before. Its books start empty. [Sandbox and live](/script/strategies/sandbox-and-live) covers what to do about a position it does not know about.
- **Stop closes the run's own position, not the account's.** It sends one order for exactly what this run's books hold, so a second strategy's position in the same contract is left alone.

## Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| A fill counted twice | Adding up reports instead of reading the total | Read the position, which has folded every repeat |
| OS7016 on a `close` | The tag is one no order in the file is placed with, usually a typo | Use the entry's tag, or leave the tag out to close the whole position |
| OS7017 on a `close` | The quantity is larger than what is left, usually a scale-out firing twice | Guard on `pos.size`, or leave the quantity out |
| A late fill applied to the wrong trade | Expecting fills to settle the current position | They settle their own position; a reversal is two orders |
| The strategy's position disagrees with the account's | Something else trades that contract, or the run restarted flat | Check the **Positions** tab and the account, then decide who owns the difference |
| A planned read refused with OS2020 | `order.*` reads and most `pos.*` facts are planned in 0.5.0 | Keep the fact in a `var` |
| Drawdown looks worse than the trades suggest | A position that was added to is valued at its final size from its first bar | Read the trade list for the result |

**Related.** [Orders](/script/strategies/orders), [Reading a report](/script/strategies/reading-a-report), [Legs and books](/script/strategies/multi-leg-and-books), [Position and sizing](/script/strategies/position-and-sizing), [Sandbox and live](/script/strategies/sandbox-and-live), [pos.* reference](/script/reference/position), [order.* reference](/script/reference/orders)
