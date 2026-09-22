---
title: Release notes
description: What each release of OpenScript and its two libraries changed, what works in version 0.5.0 today, what does not yet, and what is planned.
---

This page summarises every release of OpenScript, also called OpenAlgo Script, newest first, and then the roadmap. Read it when you want to know whether something works in the version you have, or whether an upgrade changes anything your scripts can see. The current version is **0.5.0**, and both libraries carry it: `openalgo-script` on npm (JavaScript and TypeScript) and `openscript` on PyPI (Python) are released together, at the same version, under Apache 2.0.

The version is 0.5.0 rather than 1.0 on purpose. The studies surface is finished and is the part to build on. Strategies run and backtest on one instrument, with limits stated below, and multi-leg strategies are designed but not built.

## What works in 0.5.0

| Area | Status | Notes |
|---|---|---|
| Studies: plots, levels, fills, colours, markers, bar colouring, backgrounds | Works | The finished part of the language |
| Tables and drawing objects (lines, labels, boxes, polylines) | Works | A study that declares two tables draws only the first |
| Inputs and the settings dialog | Works | A plot's `style` chosen through an `input()` is drawn in its default style |
| Higher timeframe and other instrument reads | Works | [[req.candle()]] and [[req.events()]] are planned |
| Alerts and markers from scripts | Works | [[alert()]] and [[signal()]] work; [[notify()]] is planned. The /trading chart judges a script's alert once, when a bar first arrives, so during market hours an alert that waits for the close may not fire there: see [Alerts in /trading](/script/alerts/alerts-in-trading) |
| Editor functions: highlighting, completion, hover, signature help, diagnostics, formatting | Works, in the library | For anyone building an editor. The /trading editor uses the highlighting and the compiler's diagnostics on every save; it has no completion, hover or signature help in this release |
| Strategies on one instrument | Works | [[buy()]], [[sell()]], [[exit()]], [[close()]], [[cancel()]], [[cancelAll()]], [[order.place()]], [[order.bracket()]] and [[order.reverse()]]. A backtest does not fill the levels [[exit()]] and [[order.bracket()]] set |
| Position facts | Partly | [[pos.size]], [[pos.avgPrice]], [[pos.isFlat]], [[pos.isLong]] and [[pos.isShort]] work; the money figures such as [[pos.equity]] and [[pos.netProfit]] are planned |
| Backtest and report | Works, with stated limits | See [Known limits](#known-limits-in-0-5-0) |
| A strategy drawn on a chart | Works | New in 0.5.0 |
| Order sizing helpers and order status | Planned | [[order.qtyForRisk()]], [[order.roundToLot()]], [[order.status()]], [[order.pending]] and the rest of that group |
| Multi-leg positions | Planned | Every `leg.*` and `book.*` name |
| Maps, matrices, user types and imports | Reserved | The words are reserved for a later language version |
| Python engine | Published | Runs compiled programs on a server; holds no compiler, and has no arrays and no log yet |

A planned name is refused where you write it, with error OS2020, so you find out in the editor rather than on a chart. The reference marks each one with a Planned badge.

```openscript expect=OS2020
profitSoFar = pos.netProfit
```

Everything in the next study works in 0.5.0. It reads the previous session's high and low onto an intraday chart, draws them as steps and shows them in a table. By default a daily read takes only days that have closed, so on a 5-minute NSE chart during today's session these are yesterday's levels.

```openscript title="Previous day levels"
version 1
study("Previous day levels", overlay = true, precision = 2)

pdh = req.timeframe("1D", high)
pdl = req.timeframe("1D", low)

plot(pdh, "Previous day high", green, style = "step")
plot(pdl, "Previous day low", red, style = "step")

panel = table("Levels", 2, 2, position = "topRight")

if bar.isLast
    cell(panel, 0, 0, "PDH")
    cell(panel, 0, 1, text(pdh, 2))
    cell(panel, 1, 0, "PDL")
    cell(panel, 1, 1, text(pdl, 2))
```

### Planned names in 0.5.0

These names are part of the language's design and are refused with OS2020 in this release.

| Group | Planned names |
|---|---|
| Position | [[pos.barsHeld]], [[pos.entries]], [[pos.entryTime]], [[pos.equity]], [[pos.isShared]], [[pos.maxDrawdown]], [[pos.maxLoss]], [[pos.maxProfit]], [[pos.netProfit]], [[pos.openProfit]], [[pos.openProfitPercent]], [[pos.profitFactor]], [[pos.tradeCount]], [[pos.winRate]] |
| Orders | [[order.avgFill()]], [[order.filled()]], [[order.id()]], [[order.modify()]], [[order.oco()]], [[order.pending]], [[order.qtyForCash()]], [[order.qtyForEquityPercent()]], [[order.qtyForRisk()]], [[order.rejection()]], [[order.roundToLot()]], [[order.status()]], [[order.working()]] |
| Legs and books | Every `leg.*` name, such as [[leg.fixed()]] and [[leg.relative()]], and every `book.*` name, such as [[book.stop()]] and [[book.dailyLoss()]] |
| Session | [[session.isOpen]], [[session.startTime]], [[session.endTime]], [[session.nextOpen]], [[session.barIndex]], [[session.isHoliday()]] |
| Instrument | [[chart.expiry]], [[chart.strike]], [[chart.optionType]], [[chart.isReplay]] |
| Indicators | [[coppock()]], [[cvd()]], [[fisher()]], [[kama()]], [[klinger()]], [[massIndex()]], [[nvi()]], [[pvi()]], [[rvi()]], [[vidya()]], [[volumeProfile()]], [[zigzag()]], [[zlema()]] |
| Requests | [[req.candle()]], [[req.events()]] |
| Other | [[notify()]], [[timeClose]], [[date.add()]], [[str.format()]], [[str.match()]], [[gradient()]], [[hsl()]], [[math.cosh()]], [[math.sinh()]], [[math.tanh()]] |

### Known limits in 0.5.0

Stated here so you do not find them inside a report you have already believed.

- **A bracket does not fill in a backtest.** [[exit()]] and [[order.bracket()]] compile and reach the order destination, but the backtest does not yet fill the target or the stop they set. To test an exit in a backtest, write the condition yourself and call [[close()]].
- **Cash and equity-percent sizing is refused in a backtest.** A strategy declared with `qtyType = "cash"` or `"equityPercent"` is refused, because the backtest works out no running equity to size against. Use `"units"` or `"lots"`.
- **A strategy that adds to a position shows a deeper drawdown than it had.** The equity curve marks a trade at its final size from the bar it first opened, so a strategy that scales in is reported as having risked more than it did. The realised profit is right.
- **Fills are modelled from four prices, not a path.** A limit fills only where the bar traded through it, and a stop that the price gapped past fills at the open.
- **A script cannot read its own profit or equity while it runs.** The report shows them after the run.
- **Five order refusals are not raised yet**: an order quantity that is not a multiple of the lot size (OS7005), an order that needs more capital than the strategy has (OS7011), an order outside the session (OS7012), a rejection by the destination reported against the script's line (OS7014), and a strategy with nowhere to send orders (OS7015; such a strategy is refused when it loads, with OS6006, instead). Until they are, size in whole lots, stay within the capital you declared and keep entries inside the session yourself.
- **A second table is dropped.** A chart pane draws one table, so a study that declares two draws the first and says nothing about the second.
- **A plot style cannot be a setting.** `plot(..., style = input(...))` compiles and draws the default style whatever the setting says.
- **The Python engine has no arrays and no log yet.** A program that uses arrays or [[print()]] is refused by the Python engine, and runs in the JavaScript library.

## Unreleased

Changes since 0.5.0 that are not in a published version yet. None of them changes how a script compiles or what it computes; they concern engine authors.

- The conformance suite (the shared set of test cases every engine must reproduce) gained twenty three cases for its core profile, the smallest set of features an engine can claim. They cover syntax, static checks, runtime errors and limits. Before them, an engine that implemented nothing could pass that profile, because every existing case belonged to the strategy profile and was skipped.
- An engine with no compiler is no longer handed cases about compiler diagnostics.
- What the suite still does not check, said plainly: no case asserts a value on a bar, so two engines can agree on every case and still disagree on what a moving average is.

## 0.5.0

**A strategy can be drawn on a chart.** Until this release a chart could draw a study but not a strategy. The chart adapter can now run a strategy against the same simulated order destination the backtest uses, so its plots draw, its legend and settings dialog work, and its position is right. The entries and exits you see on the price and the trades in the backtest report of the same script are one answer, not two. A host enables it explicitly; without it, a strategy with nowhere to send orders is still refused with OS6006.

**The Python engine is on PyPI.** `pip install openscript` installs the engine that runs a compiled program: Apache 2.0, no dependencies, Python 3.12 or newer. It holds no compiler, so a program is compiled where the JavaScript library runs and handed to it as data. The two packages are released together at the same version.

**The backtest report says more.**

- Run-up: the largest climb in equity, as money and as a percentage, and when it happened, beside the existing maximum drawdown. Every point of the equity curve carries its run-up too.
- A trade analysis: closed trades split into long and short, each side with its own net profit and win rate; the largest win and largest loss after charges; and the longest runs of winning and losing trades, counted in the order the trades closed.
- Every figure in the summary now has a written formula, so an engine written by someone else can reproduce it.

**Changes a script can observe.** Each is a correction, and each is small. A stored backtest that touched one of them reproduces to a slightly different number after the upgrade; nothing else changes.

- `text(x, decimals)` writes the shortest digits that read back to the same value at every size. Only whole numbers at or beyond about nine quadrillion after scaling are affected; no price moves by a digit.
- `round(x, decimals)` scales by the exact power of ten. A value rounded to 23 decimals can move by one unit in the last place; no other count of decimals changes.
- Comparing two strings with `<` and sorting an array of strings both order by Unicode code point. Only a comparison between a character outside the basic plane and one from U+E000 upward changes its answer.
- [[str.trim()]] and [[toNumber()]] use a fixed list of whitespace characters. The byte order mark (U+FEFF) is no longer removed, and the next-line character (U+0085) now is.

**Multi-leg strategies are scoped and planned.** A strategy trades one instrument today. The design for several legs, [[leg.fixed()]] and [[leg.relative()]] to declare what each leg trades, `leg.*` rules to manage each one and `book.*` rules across all of them, is written and marked planned, and the roadmap now says how it will be built. Two planned names were renamed while nothing could use them: the `arm` parameter of [[leg.trail()]] and [[book.lockProfit()]] is now `activateAt`, and the events `trailArmed` and `lockProfitArmed` are now `trailActivated` and `lockProfitActivated`.

**Six missing capabilities are now recorded as planned**, so they are on the plan rather than unnoticed: an account-level drawdown halt, a cap on position size, a cap on orders per session, a halt after a run of losing sessions, reading past trades by index, and a script stating whether it runs on every update or only on closed bars.

**The documentation uses sandbox trading throughout** for the mode that trades against a simulated account.

**For integrators.**

- A program compiled at an earlier minor version of the compiled format now loads in a newer engine; a table the older program lacks reads as empty.
- `loadText` loads a program that arrives as text, and refuses one that is not in the canonical encoding with OS6018.
- How a number becomes text is now one written rule, with published test cases, and the arithmetic of every library function is published as test vectors another engine can load. `pow` is held out, because it gives different last bits on different runtimes.
- A backtest run record now carries the script's source text and the instrument facts, so a stored run can be turned into a conformance case.
- The conformance suite has its first cases, a runner and an adapter for each engine. The Python engine agrees with the JavaScript library on every strategy case, to the last bit, including partial fills, refusals, cancellations and expiries.
- `exp`, `log`, `pow`, the trigonometric functions and the indicators built on them compute what they always did, but carry no cross-engine guarantee in the last bit until a portable algorithm is written.
- Still true, and said here: no engine written outside this project has run the suite yet.

## 0.4.0

**Backtesting arrives, and a run is a document.** `backtest(program, bars, settings)` runs a compiled strategy over a range of bars against a simulated order destination and returns a run record: the program, the hash of its source, the bars or a hash naming them, the settings, every order update, every fill, the ledger, the diagnostics and the report. Nothing in it is specific to one engine.

- **Replay and rerun.** `replay(record)` rebuilds the report from the record's own fills without running a bar, and must match. `rerun(record)` runs the record again and compares the bytes. A replay over bars that have since been revised is refused with OS6022 rather than reporting old figures over new data.
- **Comparing two runs.** `compareRuns` puts two records side by side. Runs over different bars or contracts are reported as not comparable. A changed program over the same bars is comparable, every other difference is named (a changed setting is as often the reason for an improvement as the change you meant to test), and a separation figure says whether the difference in average trade is larger than the noise.
- **The report**: a trade list, an equity curve, drawdown, a month-by-month table, win rate and expectancy with its standard error. A trade runs from the fill that takes the position off flat to the fill that returns it, so adding to a position adds entries to one trade and a reversal is two trades. A trade that nets exactly zero counts as neither a win nor a loss.
- **The report window.** Every bar supplied runs; only the bars inside the window are reported. Bars before it are warmup, and a position opened there is carried in with its charges paid. A window holding none of the bars is refused with OS6020.
- **Costs.** Slippage is counted in ticks and always works against you, on market and stop fills and never on limit fills. A host with its own charge schedule supplies it; a strategy that declares a commission gets a schedule of one line from it; stating both is refused with OS6023.
- **Quantities.** Lots are converted through the instrument's lot size, and lots on an instrument with no lot size are refused. Cash and equity-percent quantities are refused.

Four wrong numbers were fixed before release: a quantity in lots was filled as a raw count of units (a strategy sizing in lots of 65 traded one sixty-fifth of what it asked for); a negative commission was credited instead of refused; a month's return was divided by equity it had already earned; and a profit factor could go negative, which is now reported as empty instead.

The money figures of the `pos` namespace stayed planned in this release, so a script still cannot branch on its own equity.

## 0.3.0

**The editor half: six functions, text in and data out.** These are what every editor feature of OpenScript is built from, and none of them is written by hand: each one asks the compiler.

- `highlight` colours every character of a file exactly once, using the language's own tables, so a new function is coloured the day it is added.
- `diagnose` runs the whole compiler and returns its errors and warnings with the catalogue's message and fix. It answers usefully on a half-typed file, and it is fast enough to run on every keystroke: about a third of a millisecond on a heavy file and about a millisecond on a file with a bracket left open.
- `format` lays a file out in the one standard layout and never changes what it means; every example is formatted, both versions are compiled, and the two compiled programs are compared.
- `complete` offers library names, your own names in scope, the named arguments of the call you are writing and the members of a namespace after a dot. Planned names are offered last, marked with the OS2020 sentence, so you learn they are planned before you use them.
- `hover` shows what a name is: the library's one-line description, the type of your own names, the channels of a colour.
- `signature` shows the call you are writing, which argument you are on, and each parameter's type and the default the compiler actually applies.

The functions are published as the `openalgo-script/editor` entry point, with a drop-in adapter that wires them into a common browser text editor component and draws nothing itself. They are for anyone building an editor: the /trading editor uses the highlighter and the compiler's diagnostics, and does not offer completion, hover or signature help in this release.

## 0.2.0

**The studies surface, finished.** A script compiles in a browser tab in milliseconds and computes, bar by bar, the same numbers everywhere. One hundred and one independently written studies compile, load and run, and five of them match arithmetic taken from the specification alone, bit for bit, warmups included. The chart adapter turns a compiled study into what a chart draws. (At the time, the advice was to upgrade for studies and not to expect a backtest or an editor yet: those arrived in 0.4.0 and 0.3.0.)

**The library runs.**

- Sixty-three names that compiled but could not run now do, among them [[dema()]], [[tema()]], [[vwma()]], [[alma()]], [[linreg()]], [[ma()]], [[psar()]], [[adx()]], [[aroon()]], [[ichimoku()]], [[stoch()]], [[stochRsi()]], [[cci()]], [[williamsR()]], [[keltner()]], [[vwap()]], [[vwapAnchor()]], the `date.*` calendar calls and [[session.isIn()]].
- Every documented default now reaches the call. Before this, `atr()`, `rsi(close)` and twenty-seven other calls written with their defaults compiled and drew nothing.
- Fifty-nine names that cannot run yet are marked planned and refused where you write them, with OS2020, instead of failing when the study loads.
- `toBool(x)` and `toNumber(s)` replace two spellings that clashed with reserved words and could never be called.

**Higher timeframe and other instrument reads run**, in three modes. `"confirmed"`, the default, takes the last coarser bar that closed and never repaints; `"developing"` shows the coarser bar as it stands; `"lookahead"` uses its final value from its first bar, which is why it repaints. `req.timeframe("1D", high)` is therefore the previous completed day's high. A read's warmup is counted in the requested bars. A timeframe finer than the chart is OS6002, one that is not a whole multiple of it is OS6015, and one that is not a timeframe at all is OS6001. When the host refuses a read, the read is absent, [[req.error()]] carries the host's reason, and the rest of the study keeps drawing.

**Everything a study produces reaches the chart**: markers, bar colours, backgrounds, tables, alerts, drawing objects and reads of other instruments.

- Drawing objects are created, moved, restyled and deleted as bars arrive. Changes made on a bar that is still forming are undone when it runs again, so a chart does not gain a copy per update. Changing an object the script already deleted is OS4005, and the host's ceiling on objects is OS5010.
- Alerts fire for the present and never for history, so adding a study to a chart with two years of bars fires nothing. `"once"` fires once for the life of the study, `"oncePerBar"` once per bar, and `"everyUpdate"` on every update. An alert's message carries the text worked out on the bar that fired it.
- Markers no longer appear and disappear on a bar that is still forming.

**Inputs got simpler.** An [[input()]] may be written in a declaration option, such as `precision = input(2, "Places")`, inside a larger expression, and inside a read's expression. An input written in place is keyed by its title, so a stored setting stays on its row when you add or reorder inputs; an input with no title is OS3021, an empty title OS3024, and a title that repeats another input's name OS3022. `var len = input(...)` now works as a running value that starts from the setting.

**The compiler says more.** OS8001, the warning for a stateful call that does not run on every bar, now also covers ternary arms, the right side of `and` and `or`, `else if` conditions and later `case` arms, so a file that compiled clean before can show it now. Two alerts sharing an id are OS3017. A `draw` setter given an object that has no such property is OS3011. A colour built from constants, such as `fade(red, 50)`, is accepted wherever a fixed colour is required.

**The order rules are enforced.** Eight order refusals that were documented and raised by nothing are now raised at the call that breaks them, before anything is sent: an absent order argument (OS7002), a zero or negative quantity (OS7004), a price not on a tick (OS7006), a limit or stop order with no price (OS7007), an entry past the pyramiding limit (OS7008), a cancel naming no working order (OS7009), a bracket on the wrong side of the entry (OS7010) and two opposite orders on one bar (OS7013).

- A [[close()]] naming a tag no order in the file uses is OS7016, and a close stating more than is held is OS7017.
- No order crosses zero: a sell larger than the long position is sent as two orders, one closing and one opening.
- [[pos.avgPrice]] averages only the positions on the side the strategy holds.
- A strategy's position is worked out from its own fills, never from the account's position in the contract, which may belong to someone else as well.
- The `leg` argument of an order is refused with OS3023, since no file can declare a leg yet.

**Bad data is refused instead of computed on.** No bars is OS6010, a bar whose time does not follow the one before is OS6011, and an instrument record that contradicts itself (a session with no timezone, for example) is OS6012.

Versions 0.1.0-alpha.0 and 0.1.0-alpha.1 were earlier previews that parsed scripts and computed nothing.

## 0.1.0-alpha.1

The first release published by the automated pipeline rather than by hand. It fixed a test runner problem that found no tests on older JavaScript runtimes and reported success anyway, raised the supported JavaScript runtime to version 22, and made the build report both the package version and the compiled program format version.

## 0.1.0-alpha.0

The first publication. **It parsed scripts and computed nothing**: a lexer, a parser and diagnostics with a code, a line, a column and a fix. It told you whether a script was well formed, and could not calculate a moving average, draw or place an order. Behind it were the language specification, a 143-entry error catalogue, the compiled program format, the host interface, a conformance suite design and twelve example scripts, all of which parsed cleanly.

## Roadmap

The project moves in phases, and a phase is finished when its test passes, not when its code is written. No dates are promised here.

### Built

- **The language, the compiler and the bar engine.** Names, types, warmup, history and persistence, with no code generated from text anywhere, and budgets that stop a runaway script.
- **The whole visual surface.** Plots, markers, colours, tables, drawing objects, alerts, and reads of higher timeframes and other instruments.
- **Reproducible backtests.** A stored run reports again to the same figures and runs again to the same bytes, and two runs can be compared well enough to tell an improvement from noise. A check runs this on every build.

### In progress

- **The editor.** The six editor functions are built and published. The /trading editor uses the highlighter and the diagnostics; completion, hover and signature help in it, and a language server that would give desktop code editors the same help, are not written.
- **A second engine and running strategies on a server.** The Python engine is published and agrees with the JavaScript library on every strategy case in the suite. The design runs strategies on a server, never in a browser tab, because closing a tab is not a decision anyone makes about their positions. It adds process isolation per strategy, scheduling against exchange calendars, a log per script, and sandbox trading by default with live orders only as a deliberate act.
- **Alerts.** An alert is evaluated by the chart that is open, so it fires while the chart is open and stops when the chart is closed. Evaluating alerts on a server, so they fire with nothing open, is a phase of its own and is not being built yet.

### Planned

- **An open standard.** A conformance suite anyone can run against an engine written without reading this implementation, and the test that finishes this phase: an engine in a third programming language, written from the specification alone, passing the suite. With it: a converter for scripts written in other chart scripting languages, a versioned compiled format with a compatibility promise, and a conformance badge.
- **Multi-leg strategies and their risk rules.** Declaring legs, fixed contracts or ones described relative to the market such as the at-the-money NIFTY call of the nearest expiry, and managing them as a book: a stop and target on the combined profit, a profit lock, moving every leg's stop to its entry, entry windows, an exit time, a daily loss limit and squaring off at expiry. A combined position has risk that belongs to the combination, not to any one leg, which is why two single-leg strategies are not a substitute. Four questions come first: where the instrument list comes from, what "at the money" means to the tick, whether a leg may be added after the first bar, and what a book-level stop does to a leg that cannot be traded.
- **The six recorded capabilities** from 0.5.0: an account-level drawdown halt, a position size cap, a cap on orders per session, a halt after losing sessions, reading past trades by index, and choosing whether a script runs on every update or only on closed bars.
- **Language features reserved for a later version.** `map` and `matrix` collections, `import` of a shared library file, `type` for user record types, functions as values, and an expression form of `switch`. The words are reserved now so that adding them cannot break a script written today.

### What the project promises from version 1

- **A saved script keeps compiling.** A file declares its language version, and the compiler keeps every past version of the language.
- **Every error is documented**, with a code, a message, a cause and a fix, and the build fails on a code that is not.
- **Engines agree.** A disagreement between the two engines on the conformance suite blocks a release.

Related: [FAQ](/script/resources/faq), [Two libraries](/script/integrate/overview), [Your own engine](/script/integrate/conformance), [Legs and books](/script/strategies/multi-leg-and-books).
