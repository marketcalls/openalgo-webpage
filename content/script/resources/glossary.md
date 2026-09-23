---
title: Glossary
description: Every term the OpenScript documentation uses, defined once in plain words, with a link to the page that explains the rule behind it.
---

This page defines the terms the OpenScript documentation uses, in alphabetical order. OpenScript, also called OpenAlgo Script, borrows words from both programming and trading, and a few of them carry a narrower meaning here than in everyday use. When a word on another page stops you, look it up here, then follow the link at the end of the entry to the page that explains the rule behind it.

Definitions are one or two sentences. Two terms carry two meanings (a fill and a range), and both meanings are listed.

## The vocabulary in one script

Most of the language vocabulary appears in this short study. It draws the highest high of the 20 bars before the current one, marks the bar where the close breaks above that level, and then holds a stop at the low of the same 20 bars until the close falls back below the stop. It works on any instrument and any interval, for example a 5-minute chart of an NSE stock.

```openscript title="Range breakout"
version 1
study("Range breakout", overlay = true, precision = 2)

length = input(20, "Lookback", min = 2)

hi = highest(high, length)[1]
lo = lowest(low, length)[1]

var inTrade = false
var stop = none

if not inTrade and close > hi
    inTrade = true
    stop = lo
    signal("BUY", lime, at = "below", shape = "arrowUp")
    alert("Close broke above the range", id = "rangeBreak")
else if inTrade and close < stop
    inTrade = false
    stop = none

plot(hi, "Upper", aqua)
plot(inTrade ? stop : none, "Stop", red, style = "step")
```

Reading it with the glossary's words:

| In the script | Term |
|---|---|
| `version 1` | Version declaration |
| `study(...)` | Declaration |
| `input(20, "Lookback", min = 2)` | Input, which builds one row of the settings dialog |
| `highest(high, length)[1]` | A stateful call, then the history operator |
| `var inTrade = false` | Persistence |
| `var stop = none` | The absent value |
| The indented lines under `if` | A block |
| `signal(...)` | A marker |
| `alert(..., id = "rangeBreak")` | An alert, named by its id |
| `plot(...)` | A plotted column, named by its title |
| `inTrade ? stop : none` | A ternary whose absent arm draws a gap |

## A

**Absent value.** The value that means "there is no value here", written `none`. It belongs to every type, it propagates through arithmetic and ordered comparison, and a plot draws a gap where it appears rather than a zero. See [Absent values](/script/language/absent-values).

**Alert.** A condition a script raises with [[alert()]], together with the message to send when it holds on a confirmed bar. See [Alerts from scripts](/script/alerts/overview).

**Analyzer mode.** See sandbox trading.

**Anchor.** The time and price a drawing object is attached to. Anchoring to a time rather than to a bar index keeps an object where you put it when more history loads and every index shifts. See [Lines and boxes](/script/visuals/lines-and-boxes).

**Argument.** A value passed at a call. Arguments may be positional, named, or positional followed by named, as in `plot(fast, "Fast", aqua, width = 2)`.

**Arm.** One `case` or `default` branch of a `switch`, or one of the two outcomes of a ternary. Arms of a `switch` do not fall through, and a name first assigned inside an arm does not exist outside it. See [Control flow](/script/language/control-flow).

**Array.** An ordered, resizable list whose elements all have one type, written `array<number>`, `array<string>` and so on. An array is a reference: assigning one name to another gives two names for one array, and [[copy()]] makes an independent one. See [Collections](/script/language/collections).

**At the money.** An option whose strike is the one nearest the current price of its underlying, such as the NIFTY strike closest to the index level. Strikes away from it are in the money or out of the money, depending on which side they lie and whether the option is a call or a put.

**Autofix.** A mark on some catalogue entries saying the fix is mechanical and needs no decision from you, such as a tab in the indentation, a semicolon, a missing comma or a missing version line. An editor built on the library can apply such a fix for you. The /trading editor shows the fix as text under the diagnostic and leaves the change to you. See [The editor](/script/getting-started/the-editor).

## B

**Backtest.** A run of a strategy over past bars that produces orders, trades, an equity curve and a report, under the costs the strategy declares. See [Backtesting](/script/strategies/backtesting).

**Bar.** One interval of price data: an open, a high, a low, a close, a volume and a time, plus open interest where the host supplies it. On a 5-minute NSE chart, the 09:15 to 15:30 IST session holds 75 bars. The script's body runs once per bar.

**Bar index.** The zero-based position of a bar in the data the chart holds, oldest first, read as [[bar.index]]. It is a position in the loaded data, not a permanent address, so it shifts when more history loads.

**Bare name.** A library name with no namespace prefix, such as `ema`, `highest`, `plot` or `aqua`. Everyday functions are bare and the long tail lives in namespaces.

**Black-76.** The option pricing model for an option on a futures or forward price. Indian index and stock options are priced with Black-76 off the synthetic future, not with a model built on the spot price.

**Block.** The lines indented under a header line such as `if`, `for` or `case`. Indentation is spaces only, every line of one block has exactly the same indentation, and there are no braces. See [Script structure](/script/language/script-structure).

**Book.** A planned feature: a group of legs managed as one position, with a combined stop, target, daily loss limit and square-off rules, through the `book.*` functions such as [[book.stop()]]. It is not available in version 0.5.0. See [Legs and books](/script/strategies/multi-leg-and-books).

**Bracket.** A target, a stop or both attached to an open position, set with [[exit()]] or [[order.bracket()]]. In version 0.5.0 a backtest does not fill either level, so test an exit rule in a backtest with an explicit [[close()]]. See [Exits and brackets](/script/strategies/exits-and-brackets).

**Broadcast.** The automatic treatment of a plain value as that same value on every bar, which is how `ema(close, 9)` accepts the literal `9` where a series would also be allowed. It is the only automatic widening in the language and it never changes a value.

**Budget.** A per-bar ceiling on work, most often the loop budget of 2,000,000 iterations per bar, which you raise deliberately with a `limits(loops = ...)` line. See [Limits](/script/writing/limits).

## C

**Catalogue.** The single list of every diagnostic OpenScript can raise, each with its code, message, cause, fix and a before and after example. The editor and these pages read the same catalogue. See [Reading an error](/script/errors/overview).

**Chart contract.** What a compiled study hands the chart: its plotted columns, shaded bands, levels, markers, tables, drawings, background, bar colours, alerts and settings inputs. Also called the descriptor.

**Check.** The stage that resolves names, types, scope and every call before any bar runs. Most mistakes are caught here rather than on a bar. In the /trading editor this happens every time you save.

**Code.** The stable identifier on every diagnostic, of the form `OS` followed by four digits, such as OS2002. A code is never reused and never renumbered. See [Reading an error](/script/errors/overview).

**Colour literal.** A named colour such as [[aqua]] or [[orange]], or a hex colour such as `#ff8800`, or `#ff880080` with an alpha byte for transparency. See [Colors](/script/visuals/colors).

**Column.** One plotted series on the chart, created by one [[plot()]] call and named by its title.

**Commission.** The brokerage and charges a backtest deducts, declared on `strategy()` per trade, per unit or as a percentage of the traded value. See [Costs and fills](/script/strategies/costs-and-fills).

**Compiled program.** The plain data the compiler produces and an engine runs: a list of instructions and a few tables. Nothing turns text into executable code at any point. See [Compiled program](/script/integrate/compiled-program).

**Condition.** A `bool` or absent expression used by `if`, `while`, a ternary, a `switch` arm or an alert. An absent condition takes the false branch.

**Confirmed bar.** A bar whose interval has ended and which will not change again, read as [[bar.isConfirmed]]. Every historical bar is confirmed; the newest bar becomes confirmed when its interval ends. See [Realtime and confirmation](/script/language/realtime-and-confirmation).

**Conformance suite.** The public set of cases (a script, its input bars and the expected output) that every OpenScript engine must reproduce exactly. See [Your own engine](/script/integrate/conformance).

**Continuation line.** A line that carries on the statement above it, because a bracket is still open, because the previous line ended in an operator or a comma, or because it ended in a backslash. It must be indented more deeply than the line the statement began on.

**Crossover.** The bar on which one series moves from at or below another to above it, which [[crossUp()]] detects. [[crossDown()]] detects the opposite move and [[cross()]] either one. All three need the previous bar, so they first have a value on bar 1.

## D

**Declaration.** The `study(...)` or `strategy(...)` statement every file carries exactly one of, as its first statement after the version line. It sets the title, the pane, the precision and, for a strategy, the capital, the order size and the costs. See [Declarations](/script/reference/declarations).

**Deferred call.** A [[signal()]], [[alert()]] or order call made on a bar that is still forming. It waits for the bar to close, and if the condition that produced it is no longer true by then, it never happens.

**Deployment.** One strategy running on the OpenAlgo server for one instrument and interval, with its own settings, position and log, created with Deploy a strategy in the Strategies panel of /trading. One script can have several deployments at once. A deployment is a server process, so closing the browser does not stop it. See [Sandbox and live](/script/strategies/sandbox-and-live).

**Descriptor.** See chart contract.

**Determinism.** The rule that the same compiled program over the same bars produces the same output on every engine, every time. There is no randomness, and a script reads the clock only through [[chart.now()]].

**Diagnostic.** One error or warning: a code, a line, a column, the span of text it is about, a message and a fix.

**Drawdown.** A fall in a strategy's equity from its highest point to a later low. The maximum drawdown in a backtest report is the deepest such fall over the run. See [Reading a report](/script/strategies/reading-a-report).

**Drawing object.** A line, label, box or polyline created through the `draw` namespace, such as [[draw.line()]]. It stays on the chart until the script deletes it, and the script can move and restyle it over time.

## E

**Element access.** Reading one element of an array with `arr[i]` or [[element()]]. The compiler tells it apart from the history operator by the type of the value on the left.

**Engine.** A program that runs a compiled program bar by bar. The JavaScript library and the Python engine are two engines, and they must agree to the last decimal. See [Two libraries](/script/integrate/overview).

**Equity.** Starting capital plus realised and unrealised profit. Reading it from inside a script, as [[pos.equity]], is planned and not available in version 0.5.0.

**Equity curve.** The account's equity plotted bar by bar over a backtest. Drawdown and run-up are both measured on it. See [Reading a report](/script/strategies/reading-a-report).

**Error.** A diagnostic in the ranges OS1xxx to OS7xxx. An error found before the first bar stops compilation. An error raised while a bar runs stops the run at that bar: earlier bars keep what they drew, and nothing is drawn from that bar on.

**Exchange.** The venue an instrument trades on, read as [[chart.exchange]] in the host's own naming where the host states it, as the /trading chart, the Backtest panel and a deployed strategy all do. OpenAlgo uses NSE and BSE for equities, NFO for index and stock futures and options, MCX for commodities and NSE_INDEX for the NSE indices.

**Expectancy.** The average net result of one closed trade in a backtest: net profit divided by the number of closed trades. A positive expectancy means the strategy made money per trade on average, after charges.

**Expiry.** The day a futures or options contract ends. Reading the chart instrument's expiry, as [[chart.expiry]], is planned and not available in version 0.5.0.

## F

**Fill (a band).** The shaded region between two plotted columns, created with [[fill()]] at the top level. See [Fills](/script/visuals/fills).

**Fill (an order).** The execution of an order at a price. Where a backtest fills a market order is set by the declaration's `fillOn` option: `"nextOpen"`, the default, or `"close"`. See [Costs and fills](/script/strategies/costs-and-fills).

**File scope.** The scope holding every name assigned at the top level of a file and every `fn` declared in it.

**Fixed shape.** The set of plots, fills, levels, tables and inputs, which the chart must know before the first bar so it can build the legend, the axis and the settings dialog. This is why those calls must be at the top level.

**Frequency.** The [[alert()]] argument that decides how often one alert may fire: `"oncePerBar"` (the default), `"once"` or `"everyUpdate"`.

**Front end.** The part of the compiler that reads one language version. Every past front end is kept, and the file's version line chooses which one reads it.

**Function.** A named calculation declared with `fn` at the top level. Functions cannot be nested, cannot call themselves, and are not values in version 1. See [User functions](/script/language/functions).

## G

**Gap.** What an absent value draws: a plot breaks its line, a fill stops, a level is not drawn, a bar keeps its own colour, a table cell is blank.

**Global scope.** The outermost scope, holding the standard library and the built-in series such as [[close]]. Assigning to one of those names is an error.

**Group.** A heading that gathers rows in the settings dialog, set with the `group` argument of [[input()]]. The declaration also takes a `group` option, a category a host may list the study under.

## H

**Handle.** The value a [[plot()]] call returns, so that [[fill()]] can name the two plots it shades. A handle exists only at compile time: it cannot be stored in a `var`, put in an array or passed to a function.

**Higher timeframe read.** A value computed on a coarser interval and sampled onto the chart's bars, written `req.timeframe(timeframe, expr)` with [[req.timeframe()]]. See [Higher timeframes](/script/data/higher-timeframes).

**History operator.** `x[n]`, the value of a series `n` bars back. Reading past the start of the data gives the absent value, never a clamped value or a zero. See [Bars and history](/script/language/bars-and-history).

```openscript
prev = close[1]       // the previous bar's close, absent on the first bar
move = close - prev   // absent on the first bar too
plot(move, "Change from the previous close")
```

**Host.** The application an engine runs inside. It supplies the bars, the instrument facts, the settings dialog, alert delivery and the destination for orders. In OpenAlgo the host is the /trading page for studies and backtests, and the strategy runner on the OpenAlgo server for a deployed strategy. See [Host interface](/script/integrate/host-interface).

## I

**id.** The stable name of an alert, given with `id = "..."` on [[alert()]]. The host keeps track of an alert by its id, so it has to survive edits to the script. An alert without one is named after the line it is on, which changes when you insert a line above it, and the compiler warns with OS8008.

**Idempotent in the bar.** The property that running the forming bar twice gives the same answer as running it once, which the rollback rule provides.

**Identifier.** A name in the source: an ASCII letter or underscore followed by ASCII letters, digits and underscores. Identifiers are case sensitive, so `fast` and `Fast` are two names.

**Input.** A setting declared with [[input()]] at the top level, which builds one row of the settings dialog. The default value comes first because its type decides the kind of field. See [Inputs](/script/inputs/inputs).

**Instrument fact.** Something the host knows about the instrument, read through the `chart` namespace: tick size, lot size, point value, exchange, instrument type. A fact the host has not supplied is absent rather than guessed.

**Interval.** The chart's bar length, read as [[chart.interval]] as a timeframe string such as `"1D"`, and as [[chart.intervalMinutes]] in minutes, which is absent on a daily, weekly or monthly chart. See [Timeframes](/script/data/timeframes).

**IST.** India Standard Time, five and a half hours ahead of UTC. NSE and BSE equity and derivative sessions run from 09:15 to 15:30 IST. A bar's [[time]] is stored in UTC, and the calendar and session calls read it in the chart's timezone.

## L

**Leg.** A planned feature: one instrument a multi-leg strategy trades, declared with [[leg.fixed()]] or [[leg.relative()]], for positions such as a straddle on NFO index options. In version 0.5.0 a strategy trades one instrument, the chart's. See [Legs and books](/script/strategies/multi-leg-and-books).

**Level.** A fixed horizontal reference line in the study's pane, created with [[level()]] at the top level, such as 70 and 30 on an RSI. See [Levels](/script/visuals/levels).

**Limits.** The optional `limits()` statement immediately after the declaration. It raises the per-bar loop budget (`loops`) or the retained history depth (`history`), and its arguments must be literal numbers. See [Limits](/script/writing/limits).

**Live mode.** See sandbox trading.

**Live var.** A `var` that does not roll back when the forming bar runs again, so it counts every update within the bar. It makes a chart and a backtest of the same data disagree by design, and raises warning OS8011. See [Realtime and confirmation](/script/language/realtime-and-confirmation).

**Lookahead.** The higher timeframe read mode that uses a coarser bar's final value from inside that bar. It repaints history by design, must be written out, and raises warning OS8005. See [Repainting](/script/data/repainting).

**Lookback.** How many bars a calculation reads, such as the 20 in `sma(close, 20)`. The reference calls it the length, `len`, and it must be a whole number.

**Lot.** The number of units that trade together, read as [[chart.lotSize]] where the host states it: on /trading the chart, the Backtest panel and a deployed strategy all state it from the platform's instrument record. NFO futures and options and MCX contracts trade in whole lots, and a strategy declared with `qtyType = "lots"` counts its orders in lots, though the Strategies panel runs only a strategy that counts in units. See [Position and sizing](/script/strategies/position-and-sizing).

## M

**Marker.** A symbol drawn on one bar by [[signal()]], with its text, a shape, a colour and a position above, below or at the price. See [Labels and shapes](/script/visuals/labels-and-shapes).

**Message.** The string an alert carries, worked out on the bar the alert fired. Absence propagates through joining strings with `+`, so a message joined from an absent value is itself absent. [[text()]] of an absent value is the word `none`.

**Mode.** The argument on a higher timeframe read that decides what the read may know: `"confirmed"` (the default), `"developing"` or `"lookahead"`. Only `"confirmed"` never repaints.

**Moving bar.** The newest bar of a chart receiving the latest market data, which runs again on every update until its interval ends. Also called the forming bar or the unconfirmed bar.

## N

**Namespace.** A prefix holding part of the library's long tail: `bar`, `chart`, `session`, `date`, `str`, `math`, `pos`, `order`, `draw` and `req`, with `leg` and `book` planned.

**Net position.** The one position a strategy holds in the chart's instrument, positive when long and negative when short, read as [[pos.size]].

**none.** See absent value.

## O

**OCO.** One cancels the other: two orders where the fill of one cancels the other, typically a target and a stop. The general form, [[order.oco()]], is planned.

**Offset.** The [[plot()]] argument that shifts where a column is drawn, never what it contains. A positive offset draws the last values past the newest bar.

**onUnconfirmed.** The declaration option that allows signals, alerts and orders on a bar that is still forming. It is off by default, and turning it on makes the script responsible for its own [[bar.isConfirmed]] checks.

**Open interest.** The number of futures or options contracts outstanding at the end of the bar, read as [[oi]]. It is absent where the host supplies none, which [[chart.hasOpenInterest]] tells you.

**Overlay.** The declaration option `overlay = true`, which draws the study over the price rather than in a pane of its own.

**Overload.** More than one form of one function, told apart by the number or type of arguments, as in `sum(values)` for an array and `sum(close, 20)` for a rolling total.

## P

**Pane.** A drawing area on the chart. A study is drawn over the price pane or given its own pane below it.

**Per-bar execution model.** The rule that the whole file is the body of a loop that runs once per bar, top to bottom, oldest bar first, with no main function and no event handler. See [Execution model](/script/language/execution-model).

**Persistence.** A value that carries from one bar to the next, declared with `var`. It is a different idea from history, which reads the past. See [Persistence](/script/language/persistence).

```openscript
var barsSeen = 0          // set to 0 once, on the first bar
barsSeen = barsSeen + 1   // 1, 2, 3, ... because the value carries forward
plot(barsSeen, "Bars seen", aqua)
```

**Placeholder.** A named slot in an error message, such as the name of your variable, which the compiler fills in from your script.

**Planned.** A name the language defines that is not available in this release. The reference marks it with a Planned badge, and using it is error OS2020. See [Release notes](/script/resources/release-notes) for what is planned.

**Plot.** One column of one value per bar, declared at the top level with [[plot()]] and drawn according to its style, width, colour and offset. Every plot needs a title. See [Plots](/script/visuals/plots).

**Point value.** The money one point of price movement is worth for one unit of the instrument, read as [[chart.pointValue]]. It is absent when the host has not supplied it.

**Precision.** The number of decimals on a study's axis and legend, set on the declaration.

**Price source.** One of the per-bar prices a study can read: [[open]], [[high]], [[low]], [[close]], or a blend the engine works out for you: [[hl2]] is `(high + low) / 2`, [[hlc3]] is `(high + low + close) / 3`, [[ohlc4]] averages all four prices and [[hlcc4]] counts the close twice.

**Predicate.** The chain of conditions that leads to an [[alert()]] call. The compiler turns it into the watched condition the host evaluates.

**Product.** The strategy option choosing `"intraday"` or `"overnight"` treatment of a position, the same distinction an Indian trading account makes between an intraday position and one carried forward.

**Profit factor.** Gross profit divided by gross loss over the closed trades of a backtest. Above 1 the winners earned more than the losers gave back. It is empty when no trade lost money.

**Propagation.** The rule that an absent operand makes the result absent. It holds for arithmetic, joining strings and ordered comparison, and not for equality.

```openscript
prev = close[1]           // absent on the first bar
plus = prev + 1           // absent wherever prev is absent
isUp = close > prev       // absent there too, not false
noPrev = prev == none     // always true or false, never absent
plot(plus, "Previous close plus one")
barColor(isUp ? lime : none)
background(noPrev ? fade(gray, 90) : none)
```

**Pyramiding.** The strategy option that caps how many entries may add up in one direction. It defaults to 1, and an entry past the cap is refused with OS7008.

## R

**Range (of codes).** One block of a thousand error codes, OS1xxx to OS8xxx, saying what kind of thing went wrong, never how serious it is.

**Range (of a pane).** The declaration option `range = [min, max]`, which fixes a study pane's scale, as in `[0, 100]` for an oscillator.

**Repaint.** To redraw history differently after the fact, so that what the chart shows today is not what it showed at the time. It comes from a `"developing"` or `"lookahead"` read, or from letting a bar that is still forming leave a mark: `onUnconfirmed = true` acts on it, and a `live var` counts its updates. See [Repainting](/script/data/repainting).

**Report.** The summary a backtest produces: net profit, drawdown, win rate, the trade list, the equity curve and the rest. See [Reading a report](/script/strategies/reading-a-report).

**Reserved word.** A word the language keeps for itself and will not accept as a name, including several reserved now for features planned in later versions. See [Keywords](/script/reference/keywords).

**Rollback.** The rule that before the forming bar runs again, every persistent value is restored to what it held at the end of the previous bar. It is what makes a chart and a backtest over the same data agree.

**Run-up.** A climb in a strategy's equity from a low point to a later high. The maximum run-up in a backtest report is the largest such climb, shown beside the maximum drawdown.

**Runtime.** The stage that runs a bar. A runtime error, such as a fractional length reaching [[sma()]] (OS4003), stops the run at the bar that raised it.

## S

**Sandbox trading.** Running a strategy on the latest market data against a simulated account rather than a real one, so nothing touches real money. In OpenAlgo this is analyzer mode. Where a deployed strategy's orders go follows the mode OpenAlgo is in, which is set elsewhere on the site and shown on the Strategies panel: in analyzer mode they go to the sandbox, in live mode to your trading account. Nothing in a script can choose. See [Sandbox and live](/script/strategies/sandbox-and-live).

**Scope.** Where a name can be seen: global, file, or one block. A name is declared by its first assignment in a scope, and assigning to a name that already exists in an enclosing scope updates it. See [Variables and scope](/script/language/variables-and-scope).

**Series.** The per-bar history of a value, written `series number`, `series bool` and so on. Reading it bare gives this bar's value and `[n]` gives the value `n` bars back. See [Types and values](/script/language/types-and-values).

**Session.** The instrument's trading hours as the host defines them, such as 09:15 to 15:30 IST for NSE equities and derivatives. The `session` namespace reports the first bar, the last bar and whether a bar falls in a window you state. The first and last bar need the host to supply the hours, and are absent where it has not. On /trading the hours come from the market calendar. See [Sessions and time](/script/data/sessions-and-time).

**Settings dialog.** The panel of one row per [[input()]], plus the style rows the host adds for every plot. It is built once, before the first bar, which is why inputs must be at the top level. See [Settings and style](/script/inputs/settings-and-style).

**Severity.** Whether a diagnostic is an error or a warning.

**Shadowing.** Declaring a name in an inner scope when the same name already exists in an enclosing one. OpenScript refuses it with error OS2002, because two variables with one name is the shortest path to a value that is right in one place and stale in another.

**Short-circuit.** The rule that `and` and `or` evaluate their right side only when it can still change the answer. A stateful call skipped this way does not advance on that bar.

**Signal.** A named marker on one bar, written with [[signal()]]. It is drawn on the chart rather than delivered like an alert.

**Slippage.** Ticks of adverse price movement a backtest applies to market and stop fills, declared on `strategy()`. It always works against you: a buy fills higher and a sell lower.

**Source.** An input whose default is a price series, such as `input(close, "Source")`, which lets you choose in the settings dialog which price source a study reads.

**Square off.** Close a position completely, bringing it back to flat. Intraday positions are squared off before the session ends.

**Stage.** Where a diagnostic is raised: reading the characters, building the structure, checking, running a bar, or the host answering. The stage tells you when you find out.

**State slot.** The storage a stateful call keeps between bars. It belongs to the place in the source where the call is written, which is what makes one helper function reusable in several places, and why a function cannot call itself.

**Stateful call.** A call that keeps values between bars, such as [[ema()]] or [[rma()]], or a user function containing `var`. Inside a branch it advances only on the bars where the branch runs, which raises warning OS8001.

**Step.** A plot style, `style = "step"`, that holds a value flat until it changes. It is the honest way to draw a value that updates once per coarser bar.

**Straddle.** A call and a put on the same underlying, strike and expiry, bought or sold together, usually at the money. A study can plot the combined premium of the two; trading both legs from one strategy is planned. See [Legs and books](/script/strategies/multi-leg-and-books).

**Strategy.** A file declared with `strategy()`: a study that can also place orders, so the numbers you plot and the numbers you trade are the same numbers. See [Strategies overview](/script/strategies/overview).

**Strike.** The price at which an option can be exercised. Reading the chart instrument's strike, as [[chart.strike]], is planned and not available in version 0.5.0.

**Study.** A file declared with `study()`: a calculation and what it draws on the chart, with no ability to place an order. Also called an indicator.

**Subject.** The value a `switch` compares each `case` against. A `switch` with no subject takes the first `case` whose condition is true.

**Synthetic future.** The futures price implied by a call and a put on the same strike and expiry: the strike plus the call premium minus the put premium. It is the forward price the option market itself is using, which is why Indian options are priced off it with Black-76.

## T

**Table.** A grid pinned to a corner of the pane, declared at the top level with [[table()]] and filled bar by bar with [[cell()]]. See [Tables](/script/visuals/tables).

**Tag.** A label on an order, such as `buy(tag = "entry")`, which a later [[close()]] or [[cancel()]] can refer to.

**Ternary.** `cond ? a : b`. Both arms must have the same type, or one may be `none`, and only the arm taken is evaluated.

**Tick.** The instrument's smallest price step, read as [[chart.tickSize]]. It is absent when the host has not supplied it, and [[roundToTick()]] rounds a price to it.

**Timeframe string.** A count and a unit, such as `"5m"`, `"60"`, `"1h"`, `"1D"`, `"1W"` or `"1M"`. A bare number is minutes. The unit letters are case sensitive: `"1M"` is one month and `"1m"` is one minute. See [Timeframes](/script/data/timeframes).

**Title.** The name of a study, a plot, a level or an input, used in the legend, the settings dialog and the saved layout. Titles must be unique within a file.

**Top level.** The outermost indentation of a file, where the declaration, [[input()]], [[plot()]], [[fill()]], [[level()]], [[table()]] and `fn` must appear.

**Trade.** One position from the fill that opens it to the fill that brings it back to flat. Adding to a position adds entries to the same trade, and a reversal is two trades.

**Trailing stop.** A stop that follows the price as a trade moves in your favour and never moves back. The trailing rules of the `leg` namespace are planned; in version 0.5.0 you keep the trailing level yourself in a `var` and close the position when the price crosses it.

**Truthiness.** Treating a number or a string as true or false. It does not exist in OpenScript: `if 1` is error OS2011, and a condition must be a `bool` or absent.

## U

**Unconfirmed bar.** A bar whose interval has not ended, so its values can still change. Signals, alerts and orders wait for it to close by default.

## V

**var.** The keyword that declares a value initialised once, on the first bar that reaches it, and kept from bar to bar after that. See [Persistence](/script/language/persistence).

**Version declaration.** The line `version 1` at the top of a file, which fixes the language version that reads it for good. Without it the file is read by the newest version and the compiler warns with OS8003. See [Script structure](/script/language/script-structure).

## W

**Warmup.** The bars at the start of the data on which a calculation cannot produce a value yet, shown as the absent value. `sma(close, 20)` first has a value on bar 19. Every function states its warmup exactly. See [Warmup](/script/language/warmup).

**Warning.** A diagnostic in the OS8xxx range. It stops nothing, and describes a shape that is valid but almost never what the author meant. See [OS8xxx Warnings](/script/errors/warnings).

**Watched condition.** What one [[alert()]] call becomes in the chart contract: its id, title, message and the conditions that lead to it. In /trading, the chart that shows the study checks it while the page is open, with nothing more for you to set up, judging each bar when it closes, and raises a notification when it holds. See [Alerts in /trading](/script/alerts/alerts-in-trading).

**Whole number.** A number with no fractional part, which lengths and array indices require. A fractional length is refused rather than rounded, because a length of 14.5 is a mistake in the script and rounding it would hide the mistake.

**Win rate.** The share of a backtest's closed trades that made money after charges. A trade that nets exactly zero counts as neither a win nor a loss.

Related: [FAQ](/script/resources/faq), [Execution model](/script/language/execution-model), [Absent values](/script/language/absent-values), [Reading an error](/script/errors/overview).
