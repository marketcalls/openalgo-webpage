---
title: Release notes
description: What each release of OpenScript and its two libraries changed, what works in version 0.8.1 today, what does not yet, and what is planned.
---

This page summarises every release of OpenScript, also called OpenAlgo Script, newest first, and then the roadmap. Read it when you want to know whether something works in the version you have, or whether an upgrade changes anything your scripts can see. The current version is **0.8.1**, and both libraries carry it: `openalgo-script` on npm (JavaScript and TypeScript) and `openscript` on PyPI (Python) are released together, at the same version, under Apache 2.0.

The version is 0.8.1 rather than 1.0 on purpose. The studies surface is finished and is the part to build on. Strategies run and backtest on one instrument, with limits stated below, and multi-leg strategies are designed but not built.

:::note The /trading page
The /trading page of OpenAlgo carries its own copy of the library, and current OpenAlgo releases still ship version 0.5.0 of `openalgo-script` there, with version 2.5.1 of the chart library. The changes from 0.6.0 on reach /trading when OpenAlgo moves to a newer library. Where this page says what /trading does, it means the copy it ships today.
:::

## What works in 0.8.1

| Area | Status | Notes |
|---|---|---|
| Studies: plots, levels, fills, colours, markers, bar colouring, backgrounds | Works | The finished part of the language. A band colour computed per bar needs a chart that can draw it: see the next row |
| Tables, drawing objects (lines, labels, boxes, polylines) and per-bar band colours | Works | The chart adapter draws every declared table, and a band coloured bar by bar, on version 2.5.4 or newer of the chart library when the host says which version it has; otherwise such a study is refused with [OS6024](/script/errors/data#os6024) before any bar runs. /trading draws the first table only, and a per-bar band in its first plot's colour |
| Inputs and the settings dialog | Works | An [[input()]] must be the whole of an option's value ([OS3025](/script/errors/arguments#os3025)), and a plot's `style` cannot be a setting ([OS3026](/script/errors/arguments#os3026)) |
| Higher timeframe and other instrument reads | Works | [[req.candle()]] and [[req.events()]] are planned |
| Alerts and markers from scripts | Works | [[alert()]] and [[signal()]] work; [[notify()]] is planned. The /trading chart judges a script's alert when its bar closes, while the page is open: see [Alerts in /trading](/script/alerts/alerts-in-trading) |
| Importing a script from another chart language | Works, in the library | New in 0.6.0: see [Importing a script](/script/writing/importing-a-script). The /trading page does not offer it |
| Editor functions: highlighting, completion, hover, signature help, diagnostics, formatting | Works, in the library | For anyone building an editor. The /trading editor uses the highlighting and the compiler's diagnostics on every save; it has no completion, hover or signature help in this release |
| Strategies on one instrument | Works | [[buy()]], [[sell()]], [[exit()]], [[close()]], [[cancel()]], [[cancelAll()]], [[order.place()]], [[order.bracket()]] and [[order.reverse()]]. A backtest does not fill the levels [[exit()]] and [[order.bracket()]] set |
| Position facts | Partly | [[pos.size]], [[pos.avgPrice]], [[pos.isFlat]], [[pos.isLong]] and [[pos.isShort]] work; the money figures such as [[pos.equity]] and [[pos.netProfit]] are planned |
| Backtest and report | Works, with stated limits | See [Known limits](#known-limits-in-0-8-1) |
| A strategy drawn on a chart | Works | New in 0.5.0 |
| Order sizing helpers and order status | Planned | [[order.qtyForRisk()]], [[order.roundToLot()]], [[order.status()]], [[order.pending]] and the rest of that group |
| Multi-leg positions | Planned | Every `leg.*` and `book.*` name |
| Maps, matrices, user types and imports | Reserved | The words are reserved for a later language version |
| Python engine | Published | Runs compiled programs on a server, with every library entry the JavaScript library has, arrays and [[print()]] included. It holds no compiler, and does not produce markers, fills, levels, bar colours or backgrounds |

A planned name is refused where you write it, with error OS2020, so you find out in the editor rather than on a chart. The reference marks each one with a Planned badge.

```openscript expect=OS2020
profitSoFar = pos.netProfit
```

Everything in the next study works in 0.8.1, and in the 0.5.0 copy /trading ships. It reads the previous session's high and low onto an intraday chart, draws them as steps and shows them in a table. By default a daily read takes only days that have closed, so on a 5-minute NSE chart during today's session these are yesterday's levels.

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

### Planned names in 0.8.1

These names are part of the language's design and are refused with OS2020 in this release. The list is the same as in 0.5.0: no planned name has been built since.

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

### Known limits in 0.8.1

Stated here so you do not find them inside a report you have already believed.

- **A bracket does not fill in a backtest.** [[exit()]] and [[order.bracket()]] compile and reach the order destination, but the backtest does not yet fill the target or the stop they set. To test an exit in a backtest, write the condition yourself and call [[close()]].
- **Cash and equity-percent sizing is refused in a backtest.** A strategy declared with `qtyType = "cash"` or `"equityPercent"` is refused, because the backtest works out no running equity to size against. Use `"units"` or `"lots"`.
- **A strategy that adds to a position shows a deeper drawdown than it had.** The equity curve marks a trade at its final size from the bar it first opened, so a strategy that scales in is reported as having risked more than it did. The realised profit is right.
- **Fills are modelled from four prices, not a path.** A limit fills only where the bar traded through it, and a stop that the price gapped past fills at the open.
- **A script cannot read its own profit or equity while it runs.** The report shows them after the run.
- **Five order refusals are not raised yet**: an order quantity that is not a multiple of the lot size (OS7005), an order that needs more capital than the strategy has (OS7011), an order outside the session (OS7012), a rejection by the destination reported against the script's line (OS7014), and a strategy with nowhere to send orders (OS7015; such a strategy is refused when it loads, with OS6006, instead). Until they are, size in whole lots, stay within the capital you declared and keep entries inside the session yourself.
- **A second table and a band coloured per bar need a chart that can draw them.** On a chart older than 2.5.4, or on a host that does not say which chart it has, the study is refused with [OS6024](/script/errors/data#os6024) rather than drawn in part. The /trading page, on library 0.5.0, draws the first table and says nothing about the rest, and draws a per-bar band in its first plot's colour at twelve percent: for /trading, declare one table and switch a band off by making its ends absent.
- **A plot style cannot be a setting.** `plot(..., style = input(...))` is refused with [OS3026](/script/errors/arguments#os3026), because the compiled program stores a style as a plain value. The 0.5.0 copy in /trading still compiles it and draws the default style whatever the setting says.
- **The Python engine does not produce every chart output.** It computes plots, tables, drawing objects, the log, orders and alerts, and does not produce markers, fills, levels, bar colours or backgrounds.

## 0.8.1

Two fixes and a correction to the documentation. No compiled format change: the format stays 1.1, and every shipped example compiles to the same bytes as with 0.8.0.

**An alert's message is read at the bar the chart judged.** From its version 2.6.0 the chart library can run a study on a transformed chart, such as Renko, range bars, line break, point and figure or Kagi, over the bars the host feeds rather than over the elements it draws, and it reads the study's columns onto those elements, each at the bar the element was completed on. The condition of an [[alert()]] was read at the right bar and its message was not, so on a transform that is not one element per bar a notification could carry another bar's text or fall back to the alert's title. The chart adapter now returns one more column, `openscript:bar`, holding each row's bar index in the run, and reads the message at the bar it names. The column is written only for a study that declares an alert. On every other chart, including every chart library before 2.6.0, nothing a study draws or announces changes; a host that lists the keys of the values table sees the new key beside the `openscript:alert:` ones. See [Chart adapter](/script/integrate/charts-adapter).

**A request mode written in its place is read.** The mode is the third argument of [[req.timeframe()]] and the fifth of [[req.symbol()]], and it was recognised only when written as `mode = ...`. A mode written positionally was accepted and ignored: `req.timeframe("1D", close, "lookahead")` ran as `"confirmed"`, carried no [OS8005](/script/errors/warnings#os8005) and was not marked as repainting, and a positional `"developing"` ran confirmed too. Such a script now runs in the mode it wrote, so its values change, and a positional `"lookahead"` carries OS8005. A positional mode that is not one of the three words written out, one taken from an input for instance, is refused with [OS3003](/script/errors/arguments#os3003), as a labelled one already was. The compiler settles the mode, so a program compiled by 0.8.0 and stored keeps the mode it was compiled with in either engine: recompile a stored program whose source writes its mode positionally. A new conformance case, `req/positional-mode`, pins it, and both engines agree on all 108 cases they run.

**A daily read folds by the date.** The documentation said a `"1D"` higher timeframe read folds by the session. It folds by the civil date in the instrument's timezone, as the compiled program's specification says and both engines have always done. For a session that stays inside one date, as every NSE, BSE and MCX session does, the two are the same. An evening session that runs past midnight is split at midnight, and its bars after midnight join the next date's bucket. The cause of [OS6015](/script/errors/data#os6015) and the pages on [timeframes](/script/data/timeframes) now say so. No behaviour changes.

The Python engine's code is unchanged. The chart adapter ships only in the npm package and the mode fix is in the compiler; the Python package moves to 0.8.1 because the two packages carry one version and ship as one release. Upgrade both together.

## 0.8.0

**A chart that can draw them gets every table and a band coloured per bar.** Until this release the chart adapter refused, with OS6024, a study that declared a second table or worked out a band's colour on each bar, because the chart it drew on had room for one table and one colour per side of a band. Version 2.5.4 of the chart library added both. A host now tells the adapter which chart it has, by passing the chart library's own `VERSION` as the new `chartVersion` option, and on 2.5.4 or newer the adapter draws them:

- Every table, each in the corner its own `position` names. A table keeps its identity from one recompute to the next, so the chart updates it rather than building it again on every tick. Two tables pinned to the same corner are drawn one over the other, so give each its own `position`.
- A band colour computed per bar is shaded bar by bar, in the colour the script computed on that bar for the side the band is on. An absent colour leaves the bar unshaded, and `opacity` dims a computed colour exactly as it dims a constant one.

A host that states nothing, an older chart, a prerelease of 2.5.4 or a version it cannot read gets exactly what 0.7.2 drew: such a study is refused before any bar runs with OS6024, whose message now ends by saying which version the host stated. On no chart is either thing drawn in part or dropped in silence. See [Chart adapter](/script/integrate/charts-adapter) and [Tables](/script/visuals/tables).

For integrators who type check the descriptor: `ChartFill` gains an optional `colorBy`, `ChartDescriptor` an optional `tables`, and `ChartFillContext` and `ChartTableSpec` are new exports.

The Python engine is unchanged and moves to 0.8.0 only because the two packages carry one version: it has always published each band's colours bar by bar and every declared table. No language change, no compiled format change, and no computed value moves.

One question stays open: a band that works out one side's colour and names none for the other draws that other side in the chart's own default colour, as a band with one constant side always has. Whether that side should be left unshaded instead is not decided yet.

## 0.7.2

**Running totals survive one overflowing bar.** [[pvt()]], [[vwap()]] and [[vwapAnchor()]] added each bar's term without checking it, so a price change, proportion or product that overflowed stored an infinite total, and every later reading was absent. Such a term is now absent: that bar reads `none` and the total carries on from the bar before it.

Two neighbouring readings change with it. [[vwap()]] and [[vwapAnchor()]] read `none`, not an exact zero, while their volume total has overflowed, until the next session or anchor starts it again. [[ad()]], [[adOsc()]] and [[cmf()]] treat a bar whose high to low span overflows as absent instead of adding a zero term for it. Separately, the JavaScript library read [[cmf()]] as `none` on any window whose volume sums below zero, where it should divide as the Python engine did; both now divide.

These readings change only near the largest number a computer can hold. Both engines were wrong in the same way, which is why their exact agreement never showed it, and independent expected results now cover every case. Upgrade both packages together. No script changes and no compiled format change; recompute stored results of these six studies only over data whose prices, volumes or their products come near that limit.

## 0.7.1

**The Python engine's [[adx()]] recovers from an overflowing movement.** A directional movement that overflowed before the average was seeded stopped a later valid seed, and one that overflowed afterwards spoiled the average from then on. Such a movement is now absent before it is smoothed, so both engines give the same values. Ordinary data is unaffected. Upgrade both packages together; no script changes.

## 0.7.0

**The two engines now agree to the last bit on every numerical function.** An audit compares the JavaScript library with the Python engine on all 116 scalar and stateful numerical signatures, over 1,504,908 accepted calls, and allows no differing bit, no value absent in one and present in the other, and no extra output. Both publishing workflows run it, so a release on which the engines disagree does not publish.

- **Portable mathematics.** [[exp()]], [[log()]], [[pow()]], the trigonometric functions and [[math.hypot()]] no longer use the runtime's own approximations. Each is computed by a portable algorithm with one final rounding to the nearest value, so it gives the same bits on every machine and in both engines, and [[pow()]], held out of the published test vectors in 0.5.0, now has them. The studies built on these, such as [[alma()]], [[hv()]] and [[chop()]], inherit it. The last digits of these values can differ from earlier versions.
- **Lengths that change.** A windowed function whose length changes from bar to bar keeps the history a later, larger length needs, and a seeded average never restarts because its length changed.
- **No value where there is no sensible answer.** [[alma()]] with a `sigma` of zero or below, and [[hv()]] over prices or a `periodsPerYear` that are not positive, read `none`.
- **Corrections the audit found.** In the Python engine, [[cci()]], [[mfi()]], [[tsi()]], [[rsi()]] and [[ultimateOsc()]] return absence where they used to stop on a division, carry an overflowed value or read a false zero, and resume on later bars with the JavaScript library's values. In the JavaScript library, [[correlation()]] no longer reads zero when a variance overflows.
- Negative zero is stored as zero everywhere, in both engines.

Upgrade both packages together when a chart and a server must agree. No script needs changing and the compiled format is the same, but stored results that used these functions can move in their last digits: regenerate any you compare against this release.

## 0.6.0

**Import a script from another chart language.** `importScript` reads a script written in the version-annotated chart dialect, versions 5 and 6, and writes OpenScript: each statement is translated with its meaning, translated with a warning that states the difference, or kept as a comment with an error that says why, and what comes back compiles. Its twelve codes, OS9001 to OS9012, are a ninth range of the error catalogue, with a new stage, `import`. See [Importing a script](/script/writing/importing-a-script) and [OS9xxx Import](/script/errors/import). The importer is a library function; the /trading page does not offer it.

**Changes a script can observe.** Read these before upgrading a study whose numbers you have already checked.

- A `"lookahead"` read in a backtest now reads a higher timeframe bar's final value from its first bar, as the mode always promised. The backtest fed bars one at a time, so such a read answered with the coarser bar so far, which is the developing reading. Confirmed and developing reads are unchanged.
- Dates before about 1 BCE were one day early. No modern date moves.
- Some scripts that compiled are now refused, each with a code and a fix. An [[input()]] that is only part of an option fixed before the first bar, such as `precision = input(2, "Decimals") + 1`, is [OS3025](/script/errors/arguments#os3025); it used to be refused only with OS6018, which reads as a fault in the compiler. A plot's `style` written from an input is [OS3026](/script/errors/arguments#os3026); it used to be drawn in its default style whatever the setting said. A bar handed over with no time is [OS6025](/script/errors/data#os6025).
- The chart adapter refuses a second declared table and a band coloured per bar with [OS6024](/script/errors/data#os6024) before any bar runs, where it used to draw the first table and a fixed band and say nothing. Version 0.8.0 draws both on a chart that can.
- A cell outside its table is [OS4008](/script/errors/runtime#os4008), naming the row, the column and the table's shape, where it was the array code OS4004. A name or an array element still holding an object deleted earlier now raises the warning [OS8019](/script/errors/warnings#os8019).
- An instrument fact the host did not state, such as [[chart.lotSize]] or [[chart.tickSize]], now reads as `none` instead of stopping the study with OS6012. Test it with [[isNone()]] or give it a fallback with [[orElse()]]. OS6012 is kept for a fact that cannot default, such as a session with no timezone.
- The editor functions' hover text for six drawing calls, among them [[draw.setFrom()]] and [[draw.delete()]], showed the wrong types, and is fixed.

**For integrators.**

- `engine.run` takes the history as columns, one array per field, typed arrays included, beside the record form. Over 900,000 one minute bars the columns held 43 MB against 104 MB for the records, and the run peaked at 346 MB of heap against 877 MB. See [JavaScript library](/script/integrate/javascript).
- The error catalogue has 173 entries. OS3025, OS3026, OS4008, OS6024, OS6025 and OS8019 are raised, and OS6012 is raised only where a fact cannot default.
- The Python engine holds every library entry the JavaScript library does, checked on every build: arrays, [[print()]] and the log, the calendar, the session calls, drawing objects, tables, and higher timeframe and other instrument reads in all three modes. `python -m openscript --describe` now works from an installed copy, which it did not in 0.5.0. The Python package is published by a workflow that first installs the built package into a fresh interpreter and runs a compiled program, and each file on the index carries a signed attestation of that run.
- **The conformance suite now tests what it exists for.** An engine that implemented nothing used to pass its narrowest profile, `core`, because every case belonged to the `strategy` profile and was skipped. The suite now holds 106 cases, 52 of them `core`, and four channels no engine answered before, one value per bar per plot, the log, drawing objects and tables, are defined and answered by both engines, which agree exactly on all 87 cases both can run. An engine with no compiler is no longer handed compiler cases. `npm run badge` makes a conformance badge from a passing result, and a result names the exact cases it was run against.
- Still true, and said here: both engines were written in this project, so their agreement is evidence about this project rather than about the specification, and no engine written outside it has run the suite yet.

## Roadmap

The project moves in phases, and a phase is finished when its test passes, not when its code is written. No dates are promised here. The long-term plan, with its themes, the outcomes each one is measured by and tasks sized for a single contributor, is published as the [OpenScript roadmap](/script/roadmap); this section says where each phase stands in version 0.8.1.

### Built

- **The language, the compiler and the bar engine.** Names, types, warmup, history and persistence, with no code generated from text anywhere, and budgets that stop a runaway script.
- **The whole visual surface.** Plots, markers, colours, tables, drawing objects, alerts, and reads of higher timeframes and other instruments.
- **Reproducible backtests.** A stored run reports again to the same figures and runs again to the same bytes, and two runs can be compared well enough to tell an improvement from noise. A check runs this on every build.
- **An importer for scripts in another chart language.** New in 0.6.0: see [Importing a script](/script/writing/importing-a-script).

### In progress

- **The editor.** The six editor functions are built and published. The /trading editor uses the highlighter and the diagnostics; completion, hover and signature help in it, and a language server that would give desktop code editors the same help, are not written.
- **A second engine and running strategies on a server.** The Python engine is published, holds every library entry the JavaScript library does, and agrees with it exactly on every conformance case both can run: 108 of the 127, the other 19 being cases about the compiler, which the Python engine does not have. The design runs strategies on a server, never in a browser tab, because closing a tab is not a decision anyone makes about their positions. It adds process isolation per strategy, scheduling against exchange calendars, a log per script, and sandbox trading by default with live orders only as a deliberate act.
- **An open standard.** Everything this phase can build inside the project is built: a conformance suite that asserts diagnostics, one value per bar per plot, the log, drawing objects, tables, orders, trades and the report, in 127 cases; the importer; a versioned compiled format with a compatibility promise; and a conformance badge, made from a passing result. The test that finishes the phase is the one thing that cannot be built inside it: an engine in a third programming language, written from the specification alone by someone who has not read this implementation, passing the suite. Until then the project shows no badge of its own.
- **Alerts.** An alert is evaluated by the chart that is open, so it fires while the chart is open and stops when the chart is closed. Evaluating alerts on a server, so they fire with nothing open, is a phase of its own and is not being built yet.

### Planned

- **Multi-leg strategies and their risk rules.** Declaring legs, fixed contracts or ones described relative to the market such as the at-the-money NIFTY call of the nearest expiry, and managing them as a book: a stop and target on the combined profit, a profit lock, moving every leg's stop to its entry, entry windows, an exit time, a daily loss limit and squaring off at expiry. A combined position has risk that belongs to the combination, not to any one leg, which is why two single-leg strategies are not a substitute. Four questions come first: where the instrument list comes from, what "at the money" means to the tick, whether a leg may be added after the first bar, and what a book-level stop does to a leg that cannot be traded.
- **The six recorded capabilities** from 0.5.0: an account-level drawdown halt, a position size cap, a cap on orders per session, a halt after losing sessions, reading past trades by index, and choosing whether a script runs on every update or only on closed bars.
- **Language features reserved for a later version.** `map` and `matrix` collections, `import` of a shared library file, `type` for user record types, functions as values, and an expression form of `switch`. The words are reserved now so that adding them cannot break a script written today.

### What the project promises from version 1

- **A saved script keeps compiling.** A file declares its language version, and the compiler keeps every past version of the language.
- **Every error is documented**, with a code, a message, a cause and a fix, and the build fails on a code that is not.
- **Engines agree.** A disagreement between the two engines on the conformance suite blocks a release.

Related: [FAQ](/script/resources/faq), [Two libraries](/script/integrate/overview), [Your own engine](/script/integrate/conformance), [Legs and books](/script/strategies/multi-leg-and-books), [OpenScript roadmap](/script/roadmap).
