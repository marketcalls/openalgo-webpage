---
title: Exits and brackets
description: Stops, targets and trailing stops. Levels your script tests today, exit() and order.bracket() and what /trading does with them in 0.5.0, one-cancels-other, the planned leg and book levels, and exiting on the clock before the NSE close.
---

This page covers every way a strategy gets out of a position: a stop and a target, a trailing stop, one-cancels-other, exits on the clock, and the protective levels the language defines with [[exit()]], [[order.bracket()]] and the planned `leg.*` and `book.*` calls. You need it for any strategy whose exit is a price level rather than the opposite signal.

A **stop** (stop-loss) closes a losing position at a price you chose in advance. A **target** closes a winning one at a price you chose in advance. A **bracket** is the two together, attached to one entry.

:::warn What /trading does with exit() and order.bracket() in 0.5.0
The compiler accepts both calls, and neither protects a position in /trading yet. On the chart and in the Backtest panel the levels they set are never filled, so a bracketed trade stays open until the script itself closes it. The Strategies panel refuses to start a script that calls either one. Until that changes, write every stop and target as a rule the script tests on each bar, as the runnable examples on this page do.
:::

## A complete example

An intraday breakout on 15-minute bars. The entry fixes a stop two ATRs below and a target three ATRs above the decision bar's close, the script tests both on every bar, and a clock rule takes the position off before the close. **ATR** (average true range) is the average size of a bar's move, so a level set in ATRs is wider on a volatile instrument and tighter on a quiet one.

```openscript title="Breakout with a stop and a target"
version 1
strategy("Breakout with a stop and a target", overlay = true, precision = 2,
         capital = 500000, qty = 1,
         product = "intraday", pyramiding = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

length     = input(20,  "Breakout lookback", min = 2, max = 500)
stopMult   = input(2.0, "Stop, in ATR",   min = 0.2, max = 20)
targetMult = input(3.0, "Target, in ATR", min = 0.2, max = 40)

atrValue      = atr(14)
breakoutLevel = highest(high, length)[1]

// roundToTick is absent while atr is still warming up, or when the host
// states no tick size.
stopPrice   = roundToTick(close - stopMult * atrValue)
targetPrice = roundToTick(close + targetMult * atrValue)

ready    = not isNone(breakoutLevel) and not isNone(stopPrice) and not isNone(targetPrice)
breakout = close > breakoutLevel
inHours  = session.isIn("0930-1500", "Asia/Kolkata")
lateDay  = not session.isIn("0915-1500", "Asia/Kolkata")

// Held in var, so the levels tested and plotted are the ones set at entry.
var entryStop   = none
var entryTarget = none

// Clear the last trade's levels before the entry below can set new ones.
if pos.isFlat
    entryStop   = none
    entryTarget = none

stopHit   = pos.isLong and low <= entryStop
targetHit = pos.isLong and high >= entryTarget

if ready and inHours and pos.isFlat and breakout
    entryStop   = stopPrice
    entryTarget = targetPrice
    buy(tag = "entry")
else if stopHit or targetHit or (pos.isLong and lateDay)
    close()

plot(breakoutLevel, "Breakout level", aqua, style = "step")
plot(entryStop,   "Stop",   red,  style = "step")
plot(entryTarget, "Target", lime, style = "step")
```

Notice where the levels come from: the close of the bar the decision was made on, while the entry fills at the next bar's open. The gap between the two is real, and the report shows it rather than hiding it by recomputing the stop from the fill. The exit fills at the open after the bar that touched a level, which on most days is worse than the level itself; that is the honest cost of a rule you write rather than a level someone holds.

The two tests need no `isNone` guard of their own. While the position is flat, `pos.isLong` is false and the levels are absent; a comparison with an absent value is absent, and an absent condition takes the false branch, so neither test can fire. The clock tests name the zone because the Backtest panel does not state the chart's timezone to the script.

## A level someone holds, or a rule you write

Every exit is one of two things, and confusing them is the most expensive mistake on this page:

| | A level | A rule in the script |
|---|---|---|
| Written as | [[exit()]], [[order.bracket()]], and the planned `leg.*` and `book.*` levels | `if ... close()` |
| Checked | By whoever holds the level, against the bar's range | Once per bar, where you wrote it |
| Acts | On the bar the level is reached, at the level | On the bar the condition is true, at the next fill point |
| Sends | A stop order or a limit order at the level | An ordinary market order |
| Keeps protecting if the strategy stops running | Yes, once it rests at the destination | No |
| In /trading, 0.5.0 | Not acted on | Runs |

A level is a promise someone else keeps. A rule is a promise you keep, checked when the script runs. A strategy whose exit is "when the trend reading turns" can only use a rule, because nobody but your script knows what the trend reading is. A stop that is the difference between a bad day and a ruinous one is what a level is for, once levels are acted on; until then, write it as a rule and watch the positions a paused strategy leaves behind.

## exit() and order.bracket()

This is how the language attaches a bracket to a position. Everything in this section is accepted by the compiler and checked as described, with the limits the callout at the top of the page sets out.

**A position carries at most one stop and one target at a time.** [[exit()]] sets them. Calling it again replaces them rather than adding a second pair, and the last call to run on a bar is the one in force.

[[exit()]] takes its levels as absolute prices (`stop`, `limit`) or as distances from the entry in the instrument's own price units (`loss`, `profit`). [[order.bracket()]] is the distance form on its own. A distance travels as a distance, because the entry it is measured from is a fill the destination knows before your script does. That makes the distance form the natural partner of a market entry:

```openscript title="Crossover with a bracket"
version 1
strategy("Crossover with a bracket", overlay = true,
         capital = 500000, qty = 1,
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

atrMult = input(2.0, "Stop, in ATR", min = 0.5, max = 10)

ef = ema(close, 9)
es = ema(close, 21)
a  = atr(14)

goLong = crossUp(ef, es)
goFlat = crossDown(ef, es)
sized  = not isNone(a)

// The entry and its bracket leave together, from one condition, so there is
// never a bar on which the position exists and its stop does not.
if goLong and pos.isFlat and sized
    buy(tag = "long")
    order.bracket(tag = "long", loss = a * atrMult, profit = a * atrMult * 2)
else if goFlat and pos.isLong
    close()

plot(ef, "Fast", aqua)
plot(es, "Slow", orange)
plot(pos.isFlat ? none : pos.avgPrice, "Entry", silver, style = "step")
```

On the /trading chart and in the Backtest panel this strategy exits only on the opposite cross, because the bracket is not filled there, and the Strategies panel will not start it.

Four rules apply to both calls:

- **One side, one form.** Giving an absolute price and a distance for the same side is refused at compile time with OS3010, because the two would have to be reconciled and any rule for that would surprise somebody. A stop as a price and a target as a distance is fine.
- **An absent level is refused.** [[exit()]] is an order call, so a level whose value comes out absent is OS7002 and stops the run. Test the level first.
- **The right side of the position.** A stop belongs below a long's entry and a target above it, and the other way round for a short. A price on the wrong side is refused with OS7010. It is only checked against an open position, so an entry and its bracket on the same bar, before the entry has filled, are the ordinary shape and are not refused. A level exactly at the entry is allowed.
- **The tag is a label.** It tells the destination which entry the levels protect. A bracket whose tag matches no order is not refused.

```openscript expect=OS3010
version 1
strategy("Two ways to say one stop", overlay = true, qty = 1)

goLong = crossUp(ema(close, 9), ema(close, 21))

if goLong and pos.isFlat
    buy(tag = "entry")
    exit(tag = "entry", stop = close - 10, loss = 10)
```

## One-cancels-other

**One-cancels-other** (OCO) means two orders are linked so that when one fills, the other is cancelled. A bracket needs no such pair kept in step: the position carries one stop and one target as levels rather than two independent resting orders, and reaching either one closes the position. The other level then has nothing to act on, so neither of the two failures that ruin a hand-built bracket can happen: both filling on a gap, or one surviving after the other has closed the trade.

The general case, one arbitrary order cancelling another, is [[order.oco()]], which is planned. Until it lands, write the cancel yourself: when one of your orders fills (the position changes), [[cancel()]] the other tag, guarding on the fact that it is still working as [Orders](/script/strategies/orders#when-the-next-signal-arrives-and-an-order-is-still-working) shows. A stop and a target written as rules, like the complete example above, need no cancel at all: there is only ever one `close()`.

## Trailing stops

A **trailing stop** follows the best price the position has seen and stays a fixed distance behind it, so it locks in more of a winning move the further the move runs. The language's trailing stop is [[leg.trail()]], which is planned. There is no `trail` argument on [[exit()]]: a trail is a rule checked on every bar rather than one price an order can rest at, and one rule with one spelling is easier to hold in your head.

When it lands, `leg.trail(name, distance, activateAt)` will work like this:

- `distance` is in the instrument's price units and is positive.
- The trail activates when the position's profit per unit first reaches `activateAt`, measured from the average entry price. With `activateAt` left out, it activates on the first fill.
- Once active it keeps the best price seen since activation: the highest high for a long, the lowest low for a short, from confirmed bars, and the last price on a bar still forming.
- The level is the best price minus `distance` for a long, plus `distance` for a short, and **it only ever moves in the position's favour**. It never retreats.
- Where a position has both a stop and an active trail, the more protective of the two is in force, and [[leg.stopPrice()]] reads that level back.

Until then, a trail is a rule you write with [`var`](/script/language/persistence). This one follows the highest high since entry, three ATRs behind, and never lets the level fall:

```openscript title="Trailing stop in the script"
version 1
strategy("Trailing stop in the script", overlay = true, precision = 2,
         capital = 500000, qty = 1, pyramiding = 1, product = "overnight")

trailAtr = input(3.0, "Trail this far behind, in ATR", min = 0.2, max = 20)

atrValue = atr(14)
fast     = ema(close, 9)
slow     = ema(close, 21)
goLong   = crossUp(fast, slow)

var bestHigh  = none
var trailStop = none

if pos.isFlat
    bestHigh  = none
    trailStop = none
else if pos.isLong
    bestHigh  = isNone(bestHigh) ? high : max(bestHigh, high)
    candidate = bestHigh - trailAtr * atrValue
    // The ratchet: the level only ever rises.
    if not isNone(candidate)
        trailStop = isNone(trailStop) ? candidate : max(trailStop, candidate)

stopped = pos.isLong and low <= trailStop

if goLong and pos.isFlat
    buy(tag = "entry")
else if stopped
    close()

plot(trailStop, "Trailing stop", red, width = 2, style = "step")
plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
```

## Exiting on the clock

Intraday strategies on NSE and NFO have to be flat before 15:30. Three facts decide how you write that.

**`closeOnSessionEnd` is not acted on yet.** The option is accepted in the declaration and means "flatten at the session close", and in version 0.5.0 nothing flattens: a backtest carries the position into the next session, and so does a deployment. Write the exit in the script.

**An exit decided on the last bar fills in the next session.** With the default `fillOn = "nextOpen"`, a `close()` decided on the session's last bar fills at the next bar's open, which is the next session's first bar. To be flat by the close, decide on a bar that leaves another bar to fill in. [[session.isIn()]] tests the time each bar starts at: a bar is inside `"0915-1500"` when it starts at or after 09:15 and before 15:00. So `not session.isIn("0915-1500", "Asia/Kolkata")` is first true on the bar that starts at 15:00, and on 15-minute bars the close it sends fills at the 15:15 open.

**Each place in /trading reads the clock differently.** The chart reads it in the chart's timezone. The Backtest panel reads it only where the script names the zone, as every example here does. [[session.isFirstBar]] and [[session.isLastBar]] have no value in either, because /trading does not state the instrument's session hours to the script yet. And the Strategies panel refuses to start a script that calls [[session.isIn()]] or any `date.*` function on an Indian instrument, so a deployed strategy needs a window built from arithmetic on [[time]]: [Sessions and time](/script/data/sessions-and-time#sessions-and-the-clock-in-trading-today) shows one.

| Exit kind | Written with | Good for |
|---|---|---|
| A cutoff time | `not session.isIn("0915-1500", "Asia/Kolkata")` | Flat before the close, at an interval-independent time |
| Minutes in the trade | [[time]] minus a `var` set when the position opens | A rule stated in clock time |
| Bars held | [[bar.index]] minus a `var` set when the position opens | A horizon in bars; [[pos.barsHeld]] is planned |
| A weekday | [[date.dayOfWeek()]] with the zone named | A weekly rule, such as flat before a weekly expiry |
| The session's last bar | [[session.isLastBar]] with `fillOn = "close"` | A host that states session hours; not /trading today |

This strategy gives up on a trade that is not in profit after two hours, never holds more than sixty bars, and is flat before the close:

```openscript title="Give up on a trade that has not worked"
version 1
strategy("Give up on a trade that has not worked", overlay = true, precision = 2,
         capital = 500000, qty = 1, product = "intraday")

holdMinutes = input(120, "Give up after this many minutes", min = 5, max = 1440)
barsCap     = input(60,  "Never hold more than this many bars", min = 2, max = 500)

fast    = ema(close, 9)
slow    = ema(close, 21)
goLong  = crossUp(fast, slow)
lateDay = not session.isIn("0915-1500", "Asia/Kolkata")

// When the position was opened, and on which bar; none while flat. The
// first bar held is the bar the entry filled at the open of.
var enteredAt  = none
var enteredBar = none

if pos.isFlat
    enteredAt  = none
    enteredBar = none
else if isNone(enteredBar)
    enteredAt  = time
    enteredBar = bar.index

// time is in milliseconds, so 60000 of it is one minute.
heldMinutes = isNone(enteredAt) ? none : (time - enteredAt) / 60000
barsHeld    = isNone(enteredBar) ? none : bar.index - enteredBar
notWorking  = pos.isLong and close <= pos.avgPrice

// One chain, so no exit can be sent on the same bar as the entry.
if goLong and pos.isFlat and not lateDay
    buy(tag = "entry")
else if pos.isLong and lateDay
    close()
else if notWorking and heldMinutes >= holdMinutes
    close()
else if pos.isLong and barsHeld >= barsCap
    close()

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
background(pos.isFlat ? none : fade(aqua, 94))
```

The comparisons with `heldMinutes` and `barsHeld` need no `isNone` test: an ordered comparison with an absent value is absent, and an absent condition takes the false branch.

## Levels the engine will hold

The language defines protective levels at three scopes. In version 0.5.0 only the bracket set with [[exit()]] and [[order.bracket()]] exists, and /trading does not act on it yet; the rest are planned, and calling one is refused with OS2020.

| Scope | Level | Call | Status |
|---|---|---|---|
| One position (a leg) | Stop and target | [[exit()]], [[order.bracket()]] | Accepted, not acted on in /trading yet |
| One position (a leg) | Standing stop and target | [[leg.stop()]], [[leg.target()]] | Planned |
| One position (a leg) | Trailing stop | [[leg.trail()]] | Planned |
| The whole strategy (the book) | Combined stop and target, in money | [[book.stop()]], [[book.target()]] | Planned |
| The whole strategy (the book) | A profit floor that activates then advances | [[book.lockProfit()]] | Planned |
| The whole strategy (the book) | Every stop to its own entry | [[book.trailStopsToEntry()]] | Planned |
| The session | Entries only inside a window | [[book.entryWindow()]] | Planned |
| The session | Square off at a time | [[book.exitAt()]] | Planned |
| The session | Square off before expiry | [[book.squareOffAtExpiry()]] | Planned |
| The session | A daily loss limit | [[book.dailyLoss()]] | Planned |
| The session | Flatten at the close | `closeOnSessionEnd = true` | Accepted, not acted on yet |

Unlike [[exit()]], the planned levels are not order calls: passing `none` to one removes the level rather than being refused, because removing a stop is something a script means to do. The book levels, and why a combined stop belongs only to a strategy that enters its legs as a unit, are on [Legs and books](/script/strategies/multi-leg-and-books).

### When a held level is tested

These are the language's rules for levels the engine holds, and they arrive with the planned levels above.

1. Every level is tested once per bar, after the script's own statements, in a fixed order: the daily loss limit; the exit time, then the session close, then the expiry square-off; the combined stop, then the combined target; the profit floor; the move of every stop to entry; then each leg in declaration order, its stop, then its target, then its trail. A rule that squares the book off ends the sequence for that bar.
2. On a confirmed bar a level is reached when the bar's range reaches it: `low <= level` for a long's stop, `high >= level` for a long's target, and the reverse for a short. On a bar still forming, only the last price is tested, and the test is taken again when the bar closes.
3. **When one bar's range contains both the stop and the target, the stop is taken.** A bar is four prices and no path, and assuming the better of the two is how a backtest invents money.
4. A stop sends a stop order at its level and a target a limit order at its level, so a backtest fills at the level rather than at the next open. When the bar opens beyond the level, the fill is at the open. Slippage applies to the stop and not to the target.

### The named events

When the held levels land, every transition one causes will be recorded as a named event with the bar's time, the leg, the level and the value that crossed it, so that after a bad day the log says which rule fired rather than only that the position closed.

| Event | Recorded when |
|---|---|
| `legStopHit`, `legTargetHit` | A leg's stop or target was reached and the leg closed |
| `trailActivated`, `trailAdvanced` | A leg's trailing stop switched on, or moved in the leg's favour |
| `combinedStopHit`, `combinedTargetHit` | The book's profit reached the combined stop or target and the book was squared off |
| `lockProfitActivated`, `lockProfitFloorAdvanced`, `lockProfitTriggered` | The profit floor came into being, moved up a step, or was hit |
| `trailToEntryActivated` | Every leg's stop moved to its own entry |
| `sessionEndSquareOff`, `exitTimeSquareOff`, `expirySquareOff` | The book was flattened at the session close, at the exit time, or before a contract's expiry |
| `dailyLossHit` | The day's loss reached the limit, and no entry is taken for the rest of the day |
| `entryRefused` | An entry was refused by the direction filter, the entry window or a daily loss already hit |
| `fillAfterTerminal` | A fill arrived after its order had already ended |

Events reach the run's record and the log, not the chart, and no call reads one: a script that branched on its own stop having fired would be deciding twice what the rule already decided once.

## Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| A bracketed trade never exits in the backtest | `exit()` and `order.bracket()` levels are not filled in 0.5.0 | Test the levels in the script and `close()`, as the complete example does |
| The Strategies panel will not start the strategy | It calls `exit()` or `order.bracket()` | Replace them with rules the script tests |
| The run stops with OS7002 at the entry | A stop or target taken from `atr` before it warmed up | Test the level with `isNone` before the entry |
| The run stops with OS7010 | A stop moved above a long's entry | Stop below a long, target above it |
| The plotted stop drifts after entry | The plot reads a level recomputed every bar | Hold the level set at entry in a `var` and plot that |
| An intraday position is carried overnight | `closeOnSessionEnd` alone, or an exit decided on the last bar | Exit on a cutoff time that leaves a bar to fill in |
| No exits on the clock in the Backtest panel | A clock test written without a zone | Name the zone: `session.isIn("0915-1500", "Asia/Kolkata")` |

**Related.** [Orders](/script/strategies/orders), [Position and sizing](/script/strategies/position-and-sizing), [Legs and books](/script/strategies/multi-leg-and-books), [Costs and fills](/script/strategies/costs-and-fills), [Sessions and time](/script/data/sessions-and-time), [Sandbox and live](/script/strategies/sandbox-and-live), [Strategy orders reference](/script/reference/strategy), [leg.* reference](/script/reference/legs)
