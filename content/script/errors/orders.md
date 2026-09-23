---
title: OS7xxx Orders
description: The errors raised when a strategy's order cannot be placed as written: orders outside a strategy, absent or invalid quantities and prices, position rules, tags and the order destination.
---

This page covers the OS7xxx codes of OpenScript (also called OpenAlgo Script): the refusals a strategy meets when an order cannot be placed as written. An order is the one place in the language where quietly doing something else would cost real money, so every doubtful order is refused loudly instead of being adjusted: an absent price is not replaced by the close, a price between two ticks is not rounded, and an entry the declaration forbids is not added to the position. Each refusal points at a line you can fix, and most have a standard guard that keeps a strategy from ever reaching them.

## When they appear

| When | Codes | What happens |
|---|---|---|
| When the script compiles | [OS7001](#os7001), [OS7003](#os7003), [OS7016](#os7016) | Shown in the console under the editor. The strategy cannot run until it is fixed |
| When an order is placed on a bar | [OS7002](#os7002), [OS7004](#os7004), [OS7006](#os7006) to [OS7010](#os7010), [OS7013](#os7013), [OS7017](#os7017) | The run stops at that bar, and nothing further is sent |
| Not raised in version 0.5.0 | [OS7005](#os7005), [OS7011](#os7011), [OS7012](#os7012), [OS7014](#os7014), [OS7015](#os7015), [OS7018](#os7018), [OS7019](#os7019) | Reserved for checks that arrive later. Each entry says what happens today |

A refusal while the run is going stops it at that bar in every place a strategy runs:

- **On the chart**, where a strategy's plots and trades are simulated in the browser, the strategy draws nothing and /trading shows the code and the message in a notice, as for any [runtime error](/script/errors/runtime#when-they-appear).
- **In the Backtest panel**, the report lists only the trades made before the refusal and the equity curve runs flat from there to the end. Above the figures the panel says which bar the run stopped on and when, what went wrong with its fix, and the code with its line and column. See [Backtesting](/script/strategies/backtesting).
- **In a deployment** from the Strategies panel, sandbox trading (analyzer mode in OpenAlgo) or live, the run stops at that bar, sends nothing further, and writes the code and the bar to the run's log on the server. See [Sandbox and live](/script/strategies/sandbox-and-live).

## A strategy written to avoid them

This strategy enters on an EMA cross, sets a protective stop at the previous 20 bar low, and exits on the opposite cross or a close below the stop. Every guard in it is there because of one of the codes below.

```openscript title="EMA cross, guarded"
version 1
strategy("EMA cross, guarded", overlay = true)

qty = input(1, "Quantity", min = 1)
fast = ema(close, 9)
slow = ema(close, 21)
up = crossUp(fast, slow)
down = crossDown(fast, slow)

// The low of the previous 20 bars, rounded onto the tick (OS7006). It is
// absent on the first bars, and on a chart with no tick size (OS7002).
swingLow = roundToTick(lowest(low, 20)[1])

var stopAt = none

// Enter only when flat, so pyramiding never refuses an entry (OS7008).
// Entry and exit sit in one if chain, so they never run on the same bar.
if up and pos.isFlat and not isNone(swingLow)
    buy(qty = qty, tag = "cross")
    // A protective stop goes below a long entry (OS7010).
    exit(tag = "cross", stop = swingLow)
    stopAt = swingLow
else if pos.isLong and (down or close < stopAt)
    // No quantity: close takes whatever is left to close (OS7017).
    close(tag = "cross")

plot(fast, "Fast EMA", aqua)
plot(slow, "Slow EMA", orange)
plot(pos.isLong ? stopAt : none, "Stop", red, style = "step")
```

The crosses are computed at the top level, above the `if`, because a stateful call such as [[crossDown()]] inside a branch only advances on the bars where the branch runs (warning [OS8001](/script/errors/warnings#os8001)). The stop is also tested by the script itself, because the version 0.5.0 backtest does not fill a stop set with [[exit()]]; see [Exits and brackets](/script/strategies/exits-and-brackets).

## Where orders can be placed

{{error: OS7001}}

The order calls, [[buy()]], [[sell()]], [[exit()]], [[close()]], [[cancel()]] and the `order.*` functions, and the `pos.*` values need a position to act on and a report to write to. Only a file declared with `strategy()` has those, so a study that uses one is refused when it compiles, and a study can never place an order on any bar.

Change `study(...)` to `strategy(...)` when the script is meant to trade. When you only want to mark the bar on the chart, keep the study and use [[signal()]] instead. See [Strategies overview](/script/strategies/overview).

{{error: OS7003}}

The expression inside [[req.timeframe()]] or [[req.symbol()]] runs on other bars, in their own time: the daily bars of a `"1D"` read, or another instrument's bars. An order placed there would have no instrument, no moment and no price of its own, and it would fire once per bar of a series the chart never shows.

Read the value you need with the request, and place the order at the top level of the strategy from the result, as the fix below does.

## Order arguments

{{error: OS7002}}

An order argument that comes out absent is refused rather than defaulted, because an order is the one place where quietly doing nothing, or something else, is worse than stopping. The usual source is warmup: a stop, a limit or a quantity computed from an indicator that has no value on the first bars, such as [[lowest()]] over 20 bars before 20 bars exist. A missing instrument fact does it too: [[roundToTick()]] is absent where the host states no tick size, and [[chart.lotSize]] is absent on the /trading chart.

Leaving an argument out is different: `buy()` with no quantity uses the declaration's `qty`. Test a computed value with [[isNone()]] before the order call, as the example above does with `swingLow`, or give it a fallback with [[orElse()]] only where a fallback is genuinely correct. See [Absent values](/script/language/absent-values).

{{error: OS7004}}

The direction of an order comes from the function, [[buy()]] or [[sell()]], never from the sign of the quantity. A negative quantity is a calculation that went the wrong way, and a quantity of zero is never what a script means, so both stop the run. The usual cause is sizing towards a target, `target - pos.size`, on a bar where the target has already been reached or passed.

Test the size before the call, and use [[sell()]] to go the other way. See [Position and sizing](/script/strategies/position-and-sizing).

{{error: OS7005}}

NFO futures and options, and MCX contracts, trade in lots: an order must be a whole multiple of the contract's lot size, and the exchange rejects anything else. This code is planned to refuse such a quantity in the engine too, so a backtest never reports a trade that could not have happened.

**Not raised yet.** In version 0.5.0 nothing compares an order's quantity with the lot size, so `buy(qty = 100)` on a contract whose lot is 75 units is sent as written. Size in lots yourself: declare `qtyType = "lots"` and pass a number of lots, as the fix below does (with a lot of 75, `buy(qty = 2)` is 150 units). The fix line also names [[order.roundToLot()]], which is planned and does not compile in this release; until it arrives, round a computed quantity down to whole lots with `floor(qty / lot) * lot`.

{{error: OS7006}}

Every instrument trades in steps of its tick size, and a limit or stop price between two ticks cannot exist at the exchange. The engine does not round it for you, because moving the order off the level your script computed would change the result, and in a backtest the change would often be in your favour. A price computed as a percentage, such as `close * 1.013`, is the usual cause.

Round the price onto the tick with [[roundToTick()]] before the call, as the example above does. Where the host states no tick size, [[roundToTick()]] is absent, so test the rounded price once with [[isNone()]] and use it everywhere. See [Orders](/script/strategies/orders).

{{error: OS7007}}

A limit or stop order rests at a price level, so it needs that level. [[order.place()]] with `type = "limit"` needs `price`, `type = "stop"` needs `trigger`, and `type = "stopLimit"` needs both. The engine does not fill in the bar's close, because that would turn the order into a market order under another name, and the report would say "limit" about a fill the script never asked for.

Pass the price the type needs, or use `type = "market"` and let the order fill at the next price.

## The position and the bar

{{error: OS7008}}

`pyramiding` in the declaration says how many entries in one direction a position may hold at once, and it is 1 unless you set it. An entry beyond that stops the run, rather than quietly building a bigger position than the declaration allows and reporting a return the stated rules never earned. The usual cause is an entry condition that stays true for several bars with no position guard.

A close and a new entry in the same direction on one bar cause it too: an order fills after the bar that places it, so when the entry is placed the position has not closed yet and still counts. Guard entries with [[pos.isFlat]], as the example above does, or raise `pyramiding` when adding to a position is the plan. See [Declarations](/script/reference/declarations#pyramiding).

{{error: OS7010}}

A stop protects a position and a target takes profit, so their sides are fixed by the position's direction. For a long, the stop goes below the average entry price and the target above it; for a short, the other way round. A stop on the wrong side would fill at once and turn every trade into an instant loss that looks like a strategy result.

The check is made against an open position, so an entry and its stop placed on the same bar, before the entry has filled, are the ordinary shape and are not refused, and a level exactly at the entry is allowed. See [Exits and brackets](/script/strategies/exits-and-brackets).

{{error: OS7011}}

A backtest that could spend money it does not have would report returns nobody could have earned. This code is planned to refuse an order that needs more capital than the strategy has left, and to record the refusal so the equity curve stays honest.

**Not raised yet.** In version 0.5.0 nothing compares an order's cost with the strategy's capital, so `buy(qty = 100)` at a price near 100 fills in full under `capital = 1000`. Keep quantity times price within the `capital` you declared yourself. Neither route the fix names works in this release: the backtest refuses `qtyType = "equityPercent"` with [OS6021](/script/errors/data#os6021), and [[pos.equity]] is planned. In the Backtest panel count in units or lots.

{{error: OS7012}}

An exchange works orders only during its session, 09:15 to 15:30 IST for NSE equities and NFO contracts. This code is planned to refuse an order placed outside the session, rather than hold it until the open and fill it at a price the script never saw.

**Not raised yet.** In version 0.5.0 nothing checks the session before an order is sent. Guard entries yourself with [[session.isIn()]], as the example below does, and name the zone, as in `session.isIn("0915-1530", "Asia/Kolkata")`, so the window means IST wherever the script runs and whatever timezone a chart is set to. [[session.isOpen]], which the fix line names, is planned and does not compile in this release. The declaration's `closeOnSessionEnd = true` is accepted but not yet acted on either, so close an intraday position yourself before 15:30, as [Exiting on the clock](/script/strategies/exits-and-brackets#exiting-on-the-clock) shows. See [Sessions and time](/script/data/sessions-and-time).

{{error: OS7013}}

When one bar places both a buy and a sell, there is no fair way to choose between them: which one comes first in the file is an accident of layout, and "the last one wins" would change silently when someone reorders two blocks. So neither is placed, the run stops, and the message names both calls with their lines, and the bar. It happens with two separate `if` blocks whose conditions can be true on the same bar, such as a [[buy()]] on an EMA cross and a [[sell()]] on an RSI level, as in the example below.

Make the conditions exclusive with `else if`, as the fix does, or place the sell on this bar and the buy on the next. Two orders on the same side are not this error, and neither is a [[close()]] or an [[exit()]] beside a [[buy()]] or a [[sell()]]: the code is about [[buy()]] and [[sell()]] only.

{{error: OS7017}}

A close can never send more than is left to close, because an order that went past zero would flatten the position and open the opposite one under a call named `close`. What is left is what the position, or the part of it the tag names, holds, less any orders already on their way out. `close(qty = 5)` against a position of 1 stops the run, naming both numbers.

Leave the quantity out and [[close()]] closes whatever is left, which cannot be wrong, or size a partial exit from [[pos.size]]. A close with no quantity on a tag that holds nothing sends nothing and is not an error.

## Tags

A **tag** is the name you give an order with `tag = "..."`, such as `buy(qty = 1, tag = "breakout")`. Later calls use it to say which order or which part of the position they mean.

{{error: OS7009}}

[[cancel()]] acts on a working order: one placed and not yet filled, cancelled or expired. A tag that names no working order means the script has lost track of its orders, most often because the order has already filled. Ignoring the call would leave the strategy believing an order is still out, so the run stops.

Use the tag the order was placed with, keep your own record of whether the order is still working, or call [[cancelAll()]] when you mean every working order.

{{error: OS7016}}

[[close()]] with a tag closes the part of the position that orders placed with that tag opened. When no order anywhere in the file is placed with that tag, the close can never close anything: it would send nothing on every bar and say nothing, while the strategy believes it has flattened. That is almost always a typo, so the compiler refuses it.

Use the tag the entry was placed with, or leave the tag out to close the whole position. A tag the script computes is not checked, because the compiler cannot know its value.

## The destination

The destination is where orders go: the simulator in the Backtest panel, or sandbox trading (analyzer mode in OpenAlgo) or a live account when a strategy is deployed. The last four codes are about the conversation between the engine and the destination, and none is raised in version 0.5.0.

{{error: OS7014}}

The order left the strategy well formed and the destination refused it: a product the account cannot trade, not enough margin, or a symbol the account has no permission for. The reason comes from the destination, not from the script, and the same order will be refused again until the account or the order changes.

**Not raised yet.** In version 0.5.0 a refusal that comes back is recorded against the order as rejected, with the destination's own reason, but no diagnostic points at the line that placed it. See [Sandbox and live](/script/strategies/sandbox-and-live).

{{error: OS7015}}

A strategy needs somewhere for its orders to go. This code is planned for a host that runs a strategy with nowhere to send orders, which would compute a position nobody ever took.

**Not raised yet.** In version 0.5.0 nothing raises OS7015. An engine given no order route at all refuses a strategy when it loads, with [OS6006](/script/errors/data#os6006) naming `orders`. In /trading a strategy always has a destination: the simulator when you backtest it, and the one its deployment names when it runs.

{{error: OS7018}}

A destination reports on an order by the id the engine gave it when the order was sent. This code is for a report naming an order this strategy never placed, such as a destination answering for another strategy's order or for a run that has already ended. It is a problem in the host, not in your script.

**Not raised yet.** In version 0.5.0 such a report is refused and the refusal is recorded, but no diagnostic is raised. It concerns you only if you build your own host on the library: answer with the id the engine sent. See [Host interface](/script/integrate/host-interface).

{{error: OS7019}}

A report that says more quantity has filled must also carry the average fill price, because a position needs a price as well as a size before it has an average entry, a profit or an equity point. A report with a quantity and no price is refused whole.

**Not raised yet.** In version 0.5.0 such a report is refused and recorded, but no diagnostic is raised. Like [OS7018](#os7018), it concerns hosts built on the library: report the destination's average fill price over the whole filled quantity on every report that adds quantity.

**Related.** [Orders](/script/strategies/orders), [Exits and brackets](/script/strategies/exits-and-brackets), [Position and sizing](/script/strategies/position-and-sizing), [Backtesting](/script/strategies/backtesting), [Sandbox and live](/script/strategies/sandbox-and-live), [Reading an error](/script/errors/overview)
