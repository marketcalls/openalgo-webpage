---
title: Orders
description: buy, sell, close, exit, cancel and the order namespace. Market, limit, stop and stop-limit orders, tags, working orders, reversing, and every refusal an order can meet.
---

This page covers every call a strategy uses to place, name, cancel and close an order: [[buy()]], [[sell()]], [[close()]], [[exit()]], [[cancel()]], [[cancelAll()]] and the [order namespace](/script/reference/orders). You need it as soon as a strategy does more than enter at the market and flatten on the opposite signal: a limit entry that waits for a pullback, a stop entry above an opening range, a partial exit, a reversal.

## A complete example

This strategy bids for a pullback in an uptrend with a limit order, cancels the bid if it has not filled within a few bars, and exits at the market when the trend turns. It works on any instrument; on an NSE stock it trades one share.

```openscript title="Pullback limit"
version 1
strategy("Pullback limit", overlay = true, precision = 2,
         capital = 500000, qty = 1)

offsetAtr = input(0.5, "Bid this far below the close, in ATR", min = 0.1, max = 5)
waitBars  = input(3,   "Cancel the bid after this many bars", min = 1, max = 50)

atrValue = atr(14)
trend    = ema(close, 50)
upTrend  = close > trend

// Every price that reaches an order is rounded to the tick and tested for
// absence first.
wanted   = close - offsetAtr * atrValue
bidPrice = isNone(wanted) ? none : roundToTick(wanted)

// The price and bar of the resting bid, none while nothing rests.
var restingAt = none
var placedAt  = none

// Once the bid has filled there is nothing resting any more.
if not pos.isFlat
    restingAt = none
    placedAt  = none

stale = not isNone(placedAt) and bar.index - placedAt >= waitBars

if stale
    cancel("pullback")
    restingAt = none
    placedAt  = none
else if upTrend and pos.isFlat and isNone(placedAt) and not isNone(bidPrice)
    buy(limit = bidPrice, tag = "pullback")
    restingAt = bidPrice
    placedAt  = bar.index
else if pos.isLong and not upTrend
    close()

plot(trend, "Trend", orange, width = 2)
plot(restingAt, "Resting bid", aqua, style = "step")
```

Read the three branches in order. The cancel is tested first, so on the bar a bid goes stale the script cancels it and does not immediately place another at a stale price. The single `if` chain also means no two orders from this script can ever go out on the same bar. And the plot draws the price that was actually sent, held in a `var` (a variable that keeps its value from one bar to the next), not a price recomputed from today's volatility.

A backtest lists every trade the run made:

{{screen: backtest-trades}}

## The order calls

Everything below works only in a `strategy()` file; in a study the compiler refuses it with OS7001.

| Call | For | Status |
|---|---|---|
| `buy(qty, limit, stop, tag)` | Enter or add to a long position | Runs |
| `sell(qty, limit, stop, tag)` | Enter or add to a short position, or reduce a long | Runs |
| `close(tag, qty)` | Flatten the position, or the part one tag entered | Runs |
| `exit(tag, qty, limit, stop, profit, loss)` | Set the position's stop and target | Accepted, not acted on in /trading yet; see [Exits and brackets](/script/strategies/exits-and-brackets) |
| `cancel(tag)` | Cancel a working order that has not filled | Runs |
| `cancelAll()` | Cancel every working order this strategy placed | Runs |
| `order.place(side, qty, type, price, trigger, tag)` | The general form, for a script that computes its side | Runs |
| `order.reverse(qty, tag)` | Close the position and open the same size the other way | Runs |
| `order.bracket(tag, profit, loss)` | Set the stop and target as distances from the entry | Accepted, not acted on in /trading yet; see [Exits and brackets](/script/strategies/exits-and-brackets) |
| [[order.working()]], [[order.pending]] | Whether a tag is working, and how many orders are | Planned |
| [[order.status()]], [[order.filled()]], [[order.avgFill()]], [[order.id()]], [[order.rejection()]] | Reading one order back from the strategy's own ledger | Planned |
| [[order.modify()]], [[order.oco()]] | Changing a working order in place, and one-cancels-other | Planned |

Six bare names cover almost every script, and the `order` namespace holds the rest. A planned name is refused at the call with OS2020, so a script cannot compile around one by accident.

## Default or absent

Leave an argument out and you get its default: `buy()` uses the declaration's `qty`, and `buy()` with neither price is a market order. Pass an argument whose value comes out absent (no value on this bar) and you get something else entirely: the order is refused with OS7002, naming the argument, and the run stops.

That difference is deliberate. `buy(stop = lowest(low, 20))` on bar 5 is not a market order at a price nobody chose; it is refused, because the 20-bar window has not filled yet. The fix is a guard, computed once at the top level:

```openscript
version 1
strategy("Stop entry, guarded", overlay = true, precision = 2, qty = 1)

rangeHigh = highest(high, 20)[1]
trendUp   = close > ema(close, 50)
trigger   = isNone(rangeHigh) ? none : roundToTick(rangeHigh)

if not isNone(trigger) and trendUp and pos.isFlat
    buy(stop = trigger, tag = "breakout")
```

That script shows the guard and nothing else. It still has a flaw the section on working orders below fixes: every flat bar places another stop order, because a working order is not a position. `pyramiding` does not catch it either, because it counts filled entries: in a backtest the stops resting at that level trigger together when price reaches it, and the position comes out several times the size the script meant.

## Market, limit, stop and stop-limit

There is one entry function per direction, and the kind of order is decided by which prices you pass. A **limit** order buys at its price or lower (sells at its price or higher). A **stop** order waits until the market reaches its trigger price, then becomes a market order. A **stop-limit** waits for the trigger, then rests as a limit.

| `limit` | `stop` | Kind | In a backtest it fills |
|---|---|---|---|
| absent | absent | Market | At the next bar's open, or at this bar's close with `fillOn = "close"`, worsened by the slippage |
| given | absent | Limit | Once a bar trades beyond the limit, at the limit, or at the open when the bar opens beyond it. No slippage |
| absent | given | Stop | Once a bar reaches the trigger, at the trigger, or at the open when the bar gaps through it, worsened by the slippage |
| given | given | Stop-limit | Once the trigger is reached and a bar then trades beyond the limit. Until then it rests as a limit |

An order with a price is first tested against the bar after the one that placed it. A limit that the bar's low only touches is not filled, because touching a price is not proof your order was reached in the queue. [Costs and fills](/script/strategies/costs-and-fills#resting-orders-limits-and-stops) covers these rules.

The trader's decision is direction; the price is a qualifier on it. You decide to buy, and whether you buy at the market or wait for a pullback is the next thought.

Two rules apply to every price you pass:

- **A price must fall on a tick.** A limit between two ticks cannot exist at the exchange, so it is refused with OS7006, naming the instrument, its tick and the price. The engine does not round it for you, because that would move the order off the level your script computed. Round it yourself with [[roundToTick()]].
- **[[roundToTick()]] is absent when the host has stated no tick size.** An order given the absent result is refused with OS7002. Test the rounded price once and use the result everywhere, as the examples on this page do.

Here is a stop entry placed once a session, above the high of the first fifteen minutes (09:15 to 09:30), and cancelled at 11:00 if it has not triggered. Every clock test names the zone, so the window means IST on the chart, in the Backtest panel and in a deployment alike, whatever timezone a chart is set to:

```openscript title="Opening range stop entry"
version 1
strategy("Opening range stop entry", overlay = true, precision = 2,
         capital = 500000, qty = 1, product = "intraday")

// A new IST date is a new session.
newDay   = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")
forming  = session.isIn("0915-0930", "Asia/Kolkata")
canEnter = session.isIn("0930-1100", "Asia/Kolkata")
lateDay  = not session.isIn("0915-1500", "Asia/Kolkata")

var rangeHigh = none
var placed    = false
var working   = false

if newDay
    rangeHigh = none
    placed    = false

if forming
    rangeHigh = isNone(rangeHigh) ? high : max(rangeHigh, high)

trigger = isNone(rangeHigh) ? none : roundToTick(rangeHigh)

// A filled stop is a position, not a working order.
if not pos.isFlat
    working = false

if working and not canEnter
    cancel("orb")
    working = false
else if canEnter and not placed and pos.isFlat and not isNone(trigger)
    buy(stop = trigger, tag = "orb")
    placed  = true
    working = true
else if pos.isLong and lateDay
    close()

plot(rangeHigh, "Range high", aqua, style = "step")
```

A deployment from the Strategies panel reads the clock like this too, in the instrument's zone; [Sessions and time](/script/data/sessions-and-time#sessions-and-the-clock-in-trading-today) lists what each part of /trading reads.

## One position, and no order crosses zero

`buy(qty)` adds to the position, `sell(qty)` subtracts from it, and `close()` flattens it. All three count this strategy's own settled fills and nothing else.

`sell()` does not mean "close a long". It means "subtract", which closes a long if one is open and keeps going into a short if the quantity is larger. To flatten, say so with `close()`.

**No order crosses zero.** In a strategy that counts in units, an instruction that would take the position from long to short is sent as two orders: one that closes the outgoing position and one that opens the new one. Each carries its own position reference, so a fill that arrives late can still say which position it belongs to.

```openscript
version 1
strategy("Two orders, not one", overlay = true, qty = 1)

if bar.index == 100
    buy(qty = 5, tag = "long")

// Long 5 here, so this sends two orders: sell 5 to close, then sell 3 to open
// a short of 3.
if bar.index == 110
    sell(qty = 8, tag = "flip")

if bar.index == 120
    close()
```

**Direction comes from the function, never from the sign of the quantity.** A negative quantity is a calculation that went the wrong way, and a quantity of zero is never what a script means; both are refused with OS7004. Sizing towards a target position from [[pos.size]] is fine, because `pos.size` describes nothing but this strategy:

```openscript
version 1
strategy("Target three units", overlay = true, qty = 1)

wantedSize = 3 - pos.size

if wantedSize > 0
    buy(qty = wantedSize)
else if wantedSize < 0
    sell(qty = -wantedSize)
```

## One leg in version 0.5.0

A strategy trades legs, and a leg is one contract. In version 0.5.0 a file declares no legs, so it has exactly one: the instrument on its chart. Every order acts on it and none of them names it. The `leg` argument that every order call accepts is there for the planned [multi-leg strategies](/script/strategies/multi-leg-and-books), and writing it today is refused with OS3023, whatever you pass:

```openscript expect=OS3023
version 1
strategy("A leg that does not exist", overlay = true, qty = 1)

goLong = crossUp(ema(close, 9), ema(close, 21))

if goLong and pos.isFlat
    buy(qty = 1, leg = "main")
```

The fix is to take the argument out.

## Tags: naming an order

An order is named by a **tag**, a string your script chooses. A tag is how a later bar cancels an order that is still working, how `close(tag = ...)` picks out one part of a position, and what the trade list and every refusal message quote back at you.

The script chooses the name rather than the engine because an order function places nothing at the moment it runs: the request is applied at the end of the bar, and only if the bar is confirmed. There is no order yet to have an identifier, and a tag is a name the script already knows.

**What a tag argument means is written in its default.**

| Kind | Default | Calls | Naming nothing |
|---|---|---|---|
| A **label** | `""` | [[buy()]], [[sell()]], [[exit()]], [[order.place()]], [[order.reverse()]], [[order.bracket()]] | Ordinary: the tag rides along to the destination and the report |
| A **reference** | required, or `none` | [[cancel()]], [[close()]] | A mistake: it names something the strategy must already have |

A `close` whose tag no order in the file is placed with can never close anything, so the compiler refuses it with OS7016 before any bar runs. It is almost always a typo:

```openscript expect=OS7016
version 1
strategy("A typo in a tag", overlay = true, qty = 1)

fast = ema(close, 9)
slow = ema(close, 21)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy(tag = "entry")
else if goFlat and pos.isLong
    close(tag = "entyr")
```

`cancel` is checked while the run is going instead, because only the run knows what is working: cancelling a tag with no working order is refused with OS7009, and the run stops. Closing a tag that has already flattened is not an error. It sends nothing and says nothing, which is what makes a `close(tag = "entry")` safe to write on every bar of an exit condition.

Two habits pay for themselves: give every order a tag, even when the script has only one, and make the tag describe the intention (`"entry"`, `"pullback"`, `"reversal"`) rather than the bar it was placed on.

## When the next signal arrives and an order is still working

A **working** order is one that has been placed and has neither filled nor been cancelled, such as a limit waiting for its price. This is the case that separates a strategy that survives real market conditions from one that does not. The language fixes three facts and leaves the fourth to you:

1. **A working order is not a position.** [[pos.size]] counts settled fills. A resting limit changes nothing in `pos.*` until it fills.
2. **Nothing is cancelled for you.** A new `buy()` does not replace a working `buy()`. If both fill, you hold both, even with `pyramiding = 1`, because the pyramiding limit counts filled entries and neither had filled when it was placed.
3. **Two opposite orders on one bar are refused**, both of them, with OS7013 naming both lines. Source order is an accident of layout, so neither is honoured. Two orders on the same side are not this: they are two orders.
4. **What happens to the old order is a trading decision**, and yours to write.

There are three sane policies. Write the script so a reader can tell which one it uses:

| Policy | Written as | Suits |
|---|---|---|
| Cancel and replace | `cancel(tag)` then place the new order, on the same bar or the next | A resting order that tracks a moving level |
| First come, first served | Remember that an order is working and place nothing new until it fills or is cancelled | An entry taken at its price or not at all |
| Age out | Count the bars an order has been working and cancel it | A signal that goes stale, like the complete example above |

[[order.working()]] and [[order.pending]] will answer "is this order still working" from the ledger. Both are planned, so in version 0.5.0 a script keeps that fact itself in a [`var`](/script/language/persistence), set when the order is placed and cleared when the position opens or the order is cancelled. The pullback and opening range examples above both do exactly that.

[[cancelAll()]] is for the moments a script has lost confidence in everything it has working: the session ending, a risk switch turned off in the inputs. It cancels working orders only, and does not close a position; an order that has filled is not working any more. With nothing working it sends nothing and refuses nothing, so it is safe to call on any bar.

## Exiting

| To | Call | Notes |
|---|---|---|
| Flatten the position | `close()` | Whatever is held, long or short |
| Flatten part of it | `close(qty = n)` | `n` is positive whichever way the position points |
| Flatten the part one tag entered | `close(tag = "runner")` | The tag must be one an order in the file is placed with |
| Leave at a stop or a target | A rule that tests the level and calls `close()` | See [Exits and brackets](/script/strategies/exits-and-brackets) |

**A close is measured against what is left to close**: what has settled, less everything already on its way out. Two bare closes on one bar send one order between them, and a close on the bar after one the destination has not answered yet sends nothing. That is what stops `close()` under `if pos.size > 0` from sending the whole position again on every bar while a slow destination is still working the first one.

**A quantity written on a close is held to a ceiling.** `close(qty = 5)` against a position of 3 would flatten it and open a short under a call named `close`, so it is refused with OS7017, naming what you asked for and what is left. A close with no quantity asks for whatever is there and cannot be wrong, which is why `close(tag = "runner")` on a flattened tag is silent while `close(tag = "runner", qty = 1)` on it is refused. If a scale-out can fire twice on one position, guard it rather than sizing it and hoping. This one takes half off at a first target fixed when the position opens, and closes the rest on the opposite cross:

```openscript title="Scale out"
version 1
strategy("Scale out", overlay = true, precision = 2,
         capital = 500000, qty = 2)

atrValue = atr(14)
fast     = ema(close, 9)
slow     = ema(close, 21)
goLong   = crossUp(fast, slow)
goFlat   = crossDown(fast, slow)

// The first target, fixed once the position is open rather than recomputed
// from each bar's ATR.
var target = none
// One scale out per position, not one per bar above the target.
var scaled = false

if pos.isFlat
    target = none
    scaled = false
else if isNone(target) and not isNone(atrValue)
    target = pos.avgPrice + 2 * atrValue

if goLong and pos.isFlat
    buy(qty = 2, tag = "entry")
else if pos.isLong and goFlat
    close()
else if pos.isLong and not scaled and high > target
    // abs because pos.size is signed and an order quantity never is.
    half = floor(abs(pos.size) / 2)
    if half > 0
        close(qty = half)
        scaled = true

plot(target, "First target", lime, style = "step")
```

## Reversing

There are three ways, and they are not the same trade:

| Way | What happens | Use it when |
|---|---|---|
| `order.reverse()` | One decision, two orders: close the position, open the same size the other way | A stop-and-reverse system that is never flat |
| `sell(qty = abs(pos.size) + newQty)` | One instruction the engine splits into two orders, because no order crosses zero | The new size differs from the old, in a strategy counting in units |
| `close()`, then `sell()` on a later bar | Two decisions, with at least one bar flat between them | The reversal deserves a second look |

[[order.reverse()]] says in one call what the other two spell out, and a reader does not have to check any arithmetic to see that the size is unchanged:

```openscript title="Stop and reverse"
version 1
strategy("Stop and reverse", overlay = true, precision = 2,
         capital = 500000, qty = 1, pyramiding = 1)

factor = input(3.0, "Band width, in ATR", min = 0.5, max = 20)
atrLen = input(10,  "ATR length", min = 1, max = 200)

// supertrend returns [line, direction]: -1 while the trend is up, 1 while
// it is down.
bands   = supertrend(factor, atrLen)
band    = bands[0]
dir     = bands[1]
prevDir = dir[1]

// Both readings must exist. On the first bar with a direction the previous
// one is absent, and != against an absent value reads as a change.
flipped = not isNone(dir) and not isNone(prevDir) and dir != prevDir

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

## When the script computes its side

[[order.place()]] is the general form, for a script whose direction comes out of a calculation rather than out of two branches. `side` is `"buy"` or `"sell"`, and `type` is `"market"`, `"limit"`, `"stop"` or `"stopLimit"`. The type and the prices must agree: `"limit"` takes `price`, `"stop"` takes `trigger`, `"stopLimit"` takes both, and `"market"` takes neither. A type that names a limit or a stop without the price it needs is refused with OS7007 rather than filled in from the bar's close, since the report would say "limit" and the fill would say "market". A value written outside either list is a compile error (OS3008).

```openscript title="Signed model"
version 1
strategy("Signed model", overlay = true, capital = 500000, qty = 1)

score = ema(close, 9) - ema(close, 21)
side  = isNone(score) ? "" : (score > 0 ? "buy" : "sell")

if side != "" and pos.isFlat
    order.place(side, 1, tag = "model")
else if pos.isLong and side == "sell"
    close()
else if pos.isShort and side == "buy"
    close()
```

Use the bare functions where the direction is written in the source, and `order.place` where it is not. A reader can see a `buy()` without running anything; a reader of `order.place(side, ...)` has to work out what `side` holds.

## Refusals

Every refused order reports a code and a reason, naming the line that placed it. In version 0.5.0 a refusal while the run is going also stops the run at that bar: nothing the bar decided is sent, and no later bar executes. The Backtest panel then reports only the trades made before the refusal, and says above the figures which bar the run stopped on and why. Codes marked "At compile time" are caught before any bar runs.

| Code | Means | Usual cause | In 0.5.0 |
|---|---|---|---|
| OS7001 | An order call in a study | The declaration says `study` | At compile time |
| OS7002 | An order argument is absent | A price or size from a window that has not warmed up | Raised |
| OS7003 | An order call inside a request expression | A function that places an order, passed to [[req.timeframe()]] | At compile time |
| OS7004 | Quantity is zero or negative | A size computed from a difference that went the wrong way | Raised |
| OS7005 | Quantity is not a whole number of lots | Units passed to an instrument that trades in lots | Not raised yet |
| OS7006 | Price is not on a tick | A limit computed as a percentage and never rounded | Raised |
| OS7007 | A resting order has no price | `order.place` with `type = "limit"` and no `price` | Raised |
| OS7008 | The entry was refused by pyramiding | No position guard on the entry | Raised |
| OS7009 | No working order has that tag | Cancelling an order that has already filled or ended | Raised |
| OS7010 | A stop or target on the wrong side of the position | A stop above a long's entry | Raised |
| OS7011 | The order needs more capital than the strategy has | Fixed sizing against a small `capital` | Not raised yet |
| OS7012 | The instrument is outside its session | An order at a time the exchange is closed | Not raised yet |
| OS7013 | Two opposite orders on one bar | Two independent `if` blocks that can both be true | Raised |
| OS7014 | The destination rejected the order | A product or margin the account cannot trade | Not raised yet |
| OS7015 | The strategy has no order destination | Nothing configured to receive orders | Not raised yet |
| OS7016 | A close names a tag nothing places | A typo in a tag | At compile time |
| OS7017 | A close states more than it is closing | A scale-out fired twice | Raised |
| OS3023 | An order names a leg | `leg = ...` written in version 0.5.0 | At compile time |

OS7008 is the pyramiding limit doing its job. Silently building a position the declaration forbade would report a return the stated rules never earned, so the order is refused instead. The [order error pages](/script/errors/orders) give a before and after for each code.

## Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| A `sell` went short instead of flattening | `sell` subtracts, it does not close | `close()` |
| Two entries where the script meant one | Guarded on `pos.isFlat` alone while a resting order was still working | Remember the working order in a `var`, as the examples do |
| The run stops with OS7009 | `cancel` on an order that has already filled | Clear the "working" flag when the position opens |
| The run stops with OS7013 | Two `if` blocks placing opposite orders on one bar | One `if` chain with `else if` |
| Orders at the wrong time of day | A clock test written without a zone, such as `session.isIn("0930-1100")`, on a chart set to another timezone | Name the zone: `session.isIn("0930-1100", "Asia/Kolkata")` |
| OS3023 on every order | A `leg` argument | Take it out; the order acts on the chart's instrument |
| Orders appear on history and not on the forming bar | The condition is true inside the bar and false at its close | Nothing to fix: orders wait for the bar to confirm |

**Related.** [Overview](/script/strategies/overview), [Exits and brackets](/script/strategies/exits-and-brackets), [Position and sizing](/script/strategies/position-and-sizing), [Costs and fills](/script/strategies/costs-and-fills), [Reading the books](/script/strategies/reading-the-books), [Strategy orders reference](/script/reference/strategy), [order.* reference](/script/reference/orders)
