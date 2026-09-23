---
title: leg.*
description: Multi-leg strategies. Declaring the contracts a strategy trades, outright or by description, reading back what was resolved, and per-leg positions, entries, exits, stops, targets and trails. Planned in version 0.5.0.
---

A **leg** is one contract a strategy trades. The `leg` namespace is how a strategy will declare more than one: the call and the put of a straddle on NIFTY weekly options, the near and far months of a futures spread on NFO or MCX, a future hedged with an option. It will let a script name a contract outright or describe it ("nearest expiry, at the money, call"), read back the contract the host picked, hold one position per leg, and put a stop, a target and a trailing stop on each.

**Every entry on this page is planned.** In version 0.5.0 a strategy has exactly one leg, the instrument on its chart, and every order acts on it without naming it. Calling any `leg.*` name is refused where you write it with OS2020. This page documents what each call will do, so you can see where the language is going and design around it, and shows what to write today.

A few option terms recur below. The **underlying** is the instrument a future or option is based on, such as the NIFTY index. The **expiry** is the day the contract ends. The **strike** is the price an option is written at, and the option **at the money** is the one whose strike is nearest the underlying's current price. The [Glossary](/script/resources/glossary) has the rest.

## One leg today

Every strategy you write in version 0.5.0 is a one-leg strategy. To trade an option, find the option in symbol search, open its own chart and add the strategy there.

{{screen: symbol-search}}

This one sells the option on the chart once a day, on a bar that opens between 09:20 and 09:35 (on a 15-minute chart, the 09:30 bar). It stops out if the premium rises 30 percent above the entry, and closes from the first bar that opens at 15:00:

```openscript title="Sell the option on the chart"
version 1
strategy("Sell the option on the chart", overlay = true, precision = 2,
         capital = 500000, qtyType = "units", product = "intraday",
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

lots    = input(1,  "Lots", min = 1, max = 50)
stopPct = input(30, "Stop, percent above the entry premium", min = 5, max = 300)

// The zone is written out so the windows read Indian time on any host.
zone        = "Asia/Kolkata"
lotUnits    = max(orElse(chart.lotSize, 1), 1)
entryWindow = session.isIn("0920-0935", zone)
lateDay     = not session.isIn("0915-1500", zone)
newDay      = bar.isFirst or not date.isSameDay(time, time[1], zone)

var doneToday = false
if newDay
    doneToday = false

// Absent while flat, so the stop test below cannot fire then.
stopLevel = pos.isShort ? roundToTick(pos.avgPrice * (1 + stopPct / 100)) : none

if pos.isShort and (lateDay or high >= stopLevel)
    close()
else if entryWindow and pos.isFlat and not doneToday
    sell(qty = lots * lotUnits, tag = "premium")
    doneToday = true

plot(stopLevel, "Stop", red, style = "step")
```

The size is counted in units from the lot size, and the stop is a rule the script tests, for the reasons on [Strategy orders](/script/reference/strategy). The chart and the Backtest panel both state the lot size OpenAlgo holds for the instrument; where a host states none, [[chart.lotSize]] is absent and this file falls back to one unit per lot.

Every order call except [[cancel()]] and [[cancelAll()]] accepts a `leg` argument, and in version 0.5.0 writing it is refused with OS3023, whatever it names: a file that declares no leg has no name the argument could refer to. Take the argument out and the order acts on the chart's instrument.

```openscript expect=OS3023
version 1
strategy("Naming a leg too early", overlay = true, qty = 1)

goLong = crossUp(ema(close, 9), ema(close, 21))

if goLong and pos.isFlat
    buy(leg = "fut")
```

To read a second instrument today, for a signal or a combined premium, use [[req.symbol()]]; [Other instruments](/script/data/other-instruments) shows how, and the [book.* page](/script/reference/books#what-you-can-write-today) measures a two-leg premium from one chart.

## The shape a declared leg will take

Declared, the same idea gets a name that every later call uses: here a leg on the near-month NIFTY future, entered on its own signal, with a standing stop and a trailing stop the engine holds. The block below is the planned shape, and version 0.5.0 refuses it with OS2020.

```openscript expect=OS2020 title="Planned: a declared leg with a standing stop and a trail"
version 1
strategy("Trail behind the move", overlay = true, precision = 2,
         capital = 500000, qty = 1, qtyType = "lots", product = "intraday")

stopMult    = input(2.0, "Initial stop, in ATR", min = 0.2, max = 20)
trailAtr    = input(3.0, "Trail this far behind, in ATR", min = 0.2, max = 20)
activateAtr = input(1.0, "Start trailing after this much profit, in ATR", min = 0.1, max = 20)

leg.relative("fut", "NIFTY", "future", expiryRank = 0, exchange = "NFO")

atrValue = atr(14)
goLong   = crossUp(ema(close, 9), ema(close, 21))
ready    = not isNone(atrValue)

if goLong and ready and not leg.isOpen("fut")
    leg.enter("fut", tag = "entry")
    leg.stop("fut", roundToTick(close - stopMult * atrValue))
    leg.trail("fut", trailAtr * atrValue, activateAt = activateAtr * atrValue)

plot(leg.stopPrice("fut"), "Stop in force", red, width = 2, style = "step")
```

Three rules will hold once legs land:

- **Every order names its leg.** In a file with one leg the `leg` argument defaults to it and is never written. In a file with more than one, leaving it out is OS3012, because there is no leg the engine could pick, and a name that is not declared is OS3008, with the declared names in the message.
- **One position per leg.** Each leg holds its own position, and [[pos.size]] and the other single-position facts are refused in a file with more than one leg: adding a quantity of one contract to a quantity of another is not a position in anything. Each leg is read by name with [[leg.size()]] and its siblings.
- **Two shapes, never mixed.** A strategy enters its legs one at a time on their own signals, with [[leg.enter()]] and [[leg.exit()]], or all together as a unit with [[book.enter()]]. [[buy()]], [[sell()]], [[close()]] and [[exit()]] are the per-leg calls written the short way. The [book.* page](/script/reference/books#two-shapes) explains why a file uses one shape or the other.

## Declaring legs

A leg is declared once, at the top level, before the first bar. The set of contracts a strategy trades is part of its fixed shape, like its plots, so a declaration inside an `if`, a loop or a function is refused with OS3006. You cannot hide a leg by passing `none`: declare it, and decide on each bar whether to send it an order.

- Every argument must be fixed before the first bar: a literal, arithmetic over literals, or an [[input()]]. A value that depends on the bar is OS3003.
- Two legs with the same name are OS3017, because the name is what every later call uses to find the leg.
- The engine never parses a symbol and never builds one. A symbol format belongs to one market; the description goes to the host, and the host sends back one real contract.

{{entry: leg.fixed()}}

Will declare a leg on a contract named outright, by the symbol your host knows it by, with its exchange, product, default quantity and default side. Use it when the contract is known in advance and does not roll over to a new expiry, such as one particular future or a stock.

{{entry: leg.relative()}}

Will declare a leg on a contract described relative to an underlying, such as "the nearest NIFTY weekly expiry, two strikes above the money, the call", which the host turns into one real contract before the first bar. A description the host cannot resolve is OS6007, and the strategy does not start.

**Remarks.** The fields of a description:

| Field | Holds |
|---|---|
| `underlying` | The instrument the contract derives from, such as an index or a stock, passed to the host as written |
| `kind` | `"future"` or `"option"`. Required, because it decides which of the other fields apply |
| `expiryRank` | `0` for the nearest expiry, `1` for the one after it, and so on |
| `expiryCycle` | Which series, where the exchange lists more than one, such as weekly and monthly; left out means the exchange's default series |
| `strikeOffset` | Strikes away from the money: `0` at the money, `2` two strikes above, `-2` two below |
| `right` | `"call"` or `"put"`, and left out for a future |
| `reference` | The price the offset is measured from; left out means the underlying's price at the moment the host resolves the contract |

`name`, `exchange`, `product`, `qty` and `side` are the leg's own bookkeeping, not part of the description. Giving `right` or `strikeOffset` with `kind = "future"` is OS3010.

**A relative contract resolves once.** Say a leg describes "nearest expiry, at the money, call" and enters on a quiet morning at one strike. If the description were evaluated again at the exit, after the index has moved a hundred points, "at the money" would name a different strike, and the strategy would send a closing order for a contract it never held while the one it does hold stays open. So the description is resolved once, before the first bar, and every order for the rest of the run carries that one contract. [[leg.symbol()]] reads it back.

## The resolved contract

These will report the contract the host picked and what the orders actually carried. They are fixed for the run rather than per bar, so print them once on the first bar of a strategy and the log answers "what did it actually trade" without anyone reasoning about what was at the money that morning.

{{entry: leg.symbol()}}

Will return the contract the leg resolved to, as the symbol its orders carried. It is the name to reconcile against a broker statement.

{{entry: leg.exchange()}}

Will return the exchange the leg's orders were sent to.

{{entry: leg.product()}}

Will return the product the leg's orders were actually sent with, after any translation the destination applies, which is what a statement can be matched against.

{{entry: leg.expiry()}}

Will return the resolved contract's expiry, and absent for a contract with no expiry, such as a stock.

{{entry: leg.strike()}}

Will return the resolved option's strike, and absent for a contract with none.

## A leg's position

These will read one leg's own position, built from that leg's fills. In a one-leg file they say what the matching `pos` facts say. A leg will have no equivalent of [[pos.isLong]], [[pos.barsHeld]], [[pos.maxProfit]] or [[pos.maxLoss]]: the sign of [[leg.size()]] answers the first, [[leg.entryTime()]] the second, and the other two are a [`var`](/script/language/persistence) the script keeps.

{{entry: leg.size()}}

Will return the signed number of units this strategy holds in the leg: positive long, negative short, `0` when flat.

{{entry: leg.avgPrice()}}

Will return the average price of the leg's open position, and absent while the leg is flat, for the same reason [[pos.avgPrice]] is.

{{entry: leg.entryTime()}}

Will return the time the leg's current position was opened, and absent while the leg is flat.

{{entry: leg.profit()}}

Will return the leg's open profit in money, valued at this bar's close, and `0` while the leg is flat.

{{entry: leg.isOpen()}}

Will be true while the leg holds a position. It is the per-leg entry guard, in place of [[pos.isFlat]].

## Entering and exiting one leg

{{entry: leg.enter()}}

Will send one order that enters one leg on its own signal, on the leg's declared side and quantity unless you give others, as a market, limit or stop order by the same rules as [[buy()]]. An entry that the book's direction filter or entry window refuses is recorded rather than sent.

{{entry: leg.exit()}}

Will send one order that exits one leg, all of it or `qty` of it, at the market or resting at `limit` or `stop`.

## Levels on a leg

A **level** is a price the engine watches for you: it is tested once per bar, after your script's own statements, and when it is reached the engine closes the leg. Passing `none` as a level removes it; unlike an order argument, an absent level is not refused. A leg carries at most one stop and one target at a time, and [[exit()]] and [[leg.stop()]] are two ways of setting the same stop: the last call to run on a bar is the one in force.

{{entry: leg.stop()}}

Will set a standing stop that closes the leg when its price reaches `price` against the position, replacing any stop in force.

{{entry: leg.target()}}

Will set a standing target that closes the leg when its price reaches `price` in favour of the position, replacing any target in force.

{{entry: leg.trail()}}

Will set a trailing stop that follows the best price the leg has seen, `distance` behind it, and only ever moves in the leg's favour. It is the language's one trailing stop: there is no trail argument on [[exit()]] or [[order.bracket()]].

**Remarks.** How the trail will behave, exactly:

- `distance` is in the leg's own price units and is positive.
- The trail activates when the leg's profit per unit first reaches `activateAt`: the last price minus the average entry price for a long leg, the reverse for a short. With `activateAt` left out it activates on the leg's first fill.
- Once active it keeps the best price since activation: the highest for a long leg and the lowest for a short, from the bar's high or low on a confirmed bar, and from the last price on a bar still forming.
- Its level is the best price minus `distance` for a long leg, plus `distance` for a short. It never moves back.
- Where a leg has both a stop and an active trail, the more protective of the two is in force: the higher for a long, the lower for a short.

Until it lands, a trail is a few lines of [`var`](/script/language/persistence); [Trailing stops](/script/strategies/exits-and-brackets#trailing-stops) has one.

{{entry: leg.stopPrice()}}

Will return the stop level actually in force on the leg, whichever call set it, and absent when there is none. While a trail is active and tighter than the stop, it returns the trail's level, so plot this rather than your own variable to see what is really protecting the position.

{{entry: leg.targetPrice()}}

Will return the target level actually in force on the leg, and absent when there is none.

## How levels on a leg will be tested

These are the language's rules for the levels the engine holds, and they arrive with the calls above.

| Rule | Detail |
|---|---|
| When | Once per bar, after the script's own statements. The [book rules](/script/reference/books#when-the-rules-are-tested) are tested first, then each leg in declaration order: its stop, then its target, then its trail (activated, then advanced, then tested) |
| Reached | On a confirmed bar, when the bar's range reaches the level: `low <= level` for a long's stop and a short's target, `high >= level` for a long's target and a short's stop. On a bar still forming, against the last price only, and tested again when the bar closes |
| Both in one bar | When one bar's range contains both the stop and the target, the stop is taken. A bar is four prices and no path, and assuming the better outcome is how a backtest invents money |
| Fill | A stop sends a stop order at its level and a target a limit order at its level, so a backtest fills at the level. When the bar opens beyond the level, the fill is at the open |
| Costs | The declaration's slippage applies to a stop and not to a target |
| Order rules | The exit is an ordinary order: it is recorded like any other and obeys the tick rule, so a level off the tick is OS7006 |

Every change a level causes is recorded as a named event with the bar's time, the leg, the level and the price that crossed it: `legStopHit`, `legTargetHit`, `trailActivated` and `trailAdvanced`. Events reach the run's record and the log. No call reads one, because a script that branched on its own stop having fired would be deciding twice what the rule already decided once.

## Related

[Legs and books](/script/strategies/multi-leg-and-books), [Exits and brackets](/script/strategies/exits-and-brackets), [Orders](/script/strategies/orders), [Other instruments](/script/data/other-instruments), [book.*](/script/reference/books), [Strategy orders](/script/reference/strategy), [pos.*](/script/reference/position), [Glossary](/script/resources/glossary).
