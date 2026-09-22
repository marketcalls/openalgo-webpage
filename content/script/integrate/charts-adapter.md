---
title: Chart adapter
description: Turn a compiled OpenScript study into an indicator for openalgo-charts with descriptorFor, register it, and let the chart drive the engine for plots, fills, levels, markers, tables, drawings, alerts and reads of other instruments.
---

The chart adapter draws a compiled study on openalgo-charts, the OpenAlgo charting engine. One call, `descriptorFor`, turns a compiled program into the chart's indicator descriptor: the legend row, the settings dialog, the plots and everything else the script declares. The chart then calls back into the adapter whenever it needs values, and the adapter runs the engine. This page covers wiring it up, the options you pass, how a live bar and a settings change reach the study, and what the chart does not draw in 0.5.0.

The adapter computes nothing itself. Every value on the chart is the engine's, so the chart and a backtest of the same script cannot disagree.

## Install

```bash
npm install openalgo-script openalgo-charts
```

The chart is an optional peer dependency of `openalgo-script`, and the adapter never imports it. A host that wants only the language installs no chart. The chart's repository is [github.com/marketcalls/openalgo-charts](https://github.com/marketcalls/openalgo-charts).

## A study on a chart

The script is the EMA cross from [JavaScript library](/script/integrate/javascript). This module runs in the browser page that holds the chart, and uses the `compile` helper from that page:

```js title="chart.mjs"
import { createChart, registerIndicator } from "openalgo-charts";
import { descriptorFor } from "openalgo-script/adapters/charts";
import { compile } from "./compile.mjs";

// `bars` and `source` are yours: the instrument's bars and the saved script text.
// 1. The chart and the instrument's own candles. Chart bar times are UTC seconds.
const chart = createChart(document.getElementById("chart"));
chart.addSeries("candlestick").setData(bars);

// 2. Compile the trader's script.
const compiled = compile("ema-cross.os", source);
if (!compiled.ok) throw new Error(compiled.diagnostics.map((d) => `${d.code} line ${d.span.line}: ${d.message}`).join("\n"));

// 3. Turn it into an indicator descriptor and register it with the chart.
const descriptor = descriptorFor(compiled.program, {
  source: compiled.file,
  category: "My scripts",
  instrument: {
    exchange: "NSE",
    lotSize: 1,
    hasVolume: true,
    session: { start: "09:15", end: "15:30", days: [1, 2, 3, 4, 5] },
  },
});
registerIndicator(descriptor);

// 4. Add it, with the settings stored for this instance.
const study = chart.addIndicator(descriptor.id, { fast: 9, slow: 21 });
```

`study` is the chart's own handle: `study.setSettings({ fast: 5 })` recomputes with a new setting and `study.remove()` takes it off. From here the chart owns the study. It calls the descriptor when bars load, when the newest bar moves and when a setting changes, and the adapter answers each call from the engine.

In TypeScript, one line checks the descriptor against the chart's own type at your build, and fails to compile if the two have drifted apart:

```js
// TypeScript
import type { IndicatorDescriptor } from "openalgo-charts";
const checked: IndicatorDescriptor = descriptorFor(compiled.program);
```

## What the descriptor holds

Everything a script declares is fixed before its first bar, so the descriptor can build the legend and the settings dialog before any value exists:

| Script | Descriptor |
|---|---|
| The title and `group` in `study()` | `name` and `category` |
| `overlay = true` or `false` | `placement`: `"onchart"` on the price pane, `"pane"` in a pane of its own |
| `range` in `study()` | `range`: the pane's fixed scale |
| Each [[input()]] | One row of `inputs`: the settings dialog, with each input's label, default, bounds, options and group |
| Each [[plot()]] and [[plotCandles()]] | One entry of `plots`, with its style, colour, width, scale and price format |
| Each [[fill()]] | One entry of `fills`, a band between two plots |
| Each [[level()]] | `levels`, drawn at the last bar's price |
| Each [[signal()]] | `markers`: every marker the last calculation produced |
| [[barColor()]] and [[background()]] | `barColors` and `background`: one colour per bar, `null` for none |
| [[table()]] and [[cell()]] | `table`: the grid as the last executed bar left it |
| [[draw.line()]], [[draw.box()]] and the other drawing objects | `draws`: every object the script currently holds |
| Each [[alert()]] | One entry of `alerts`, the conditions a user can subscribe to |
| A read of another instrument with [[req.symbol()]] | `attach`: the lifecycle that fetches its bars |

A member is present only when the script declares something for it, so a study with no table has no `table` hook and costs the chart nothing for one.

**The id is the source hash.** `descriptor.id` defaults to `openscript:` followed by the script's source hash. A saved chart layout stores the id and the settings, so the same script restores to the same study, and an edited script does not silently inherit the settings of the study it replaced. A host that manages its own script identities passes `id`.

## Options

`descriptorFor(program, options)` takes what the chart and the program cannot tell the adapter:

| Option | What it is |
|---|---|
| `id` | The registry id. Defaults to the source hash, as above |
| `category` | The picker category, used when the script's own `group` is empty |
| `settings` | The stored settings, for declaration options written with `input()`. See below |
| `instrument` | Instrument facts the chart does not hold: the exchange, the lot size, `hasVolume`, the session, and anything else in the [instrument record](/script/integrate/host-interface#instrument-facts) |
| `markerColor` | The colour of a marker whose script named none. Defaults to a neutral grey |
| `source` | The `SourceFile`, so a diagnostic carries an offset as well as a line |
| `orders` | Where a strategy's orders go, as a route function. See [Strategies on a chart](#strategies-on-a-chart) |
| `simulateOrders` | Run a strategy against the backtest's simulated destination. Off by default |
| `limits`, `clock` | The engine's budgets, as in [JavaScript library](/script/integrate/javascript#budgets) |
| `resolveTime` | Turns a `"time"` input's stored wall clock text into UTC seconds, given the text and the chart's timezone. Without it the text is read as UTC |

### Instrument facts come from two places

On every calculation the chart hands the adapter what it knows: the symbol, the interval, its timezone, the chart clock for [[chart.now()]], and the tick size from the price pane. Everything else comes from the `instrument` option, and the adapter merges the two.

**State the session.** A chart holds an interval and a timezone, and no exchange calendar. [[session.isFirstBar]], [[session.isLastBar]] and every study anchored to them, [[vwap()]] among them, read the session in the instrument record. A host that states no session gets those facts absent on every bar, which is honest and leaves a VWAP study with an empty pane. For NSE and BSE equities and NFO contracts the session is `09:15` to `15:30`, Monday to Friday, in `Asia/Kolkata`.

## Settings, and when to build again

Some parts of the descriptor are values fixed when it is built; others are functions the chart calls with its current settings each time.

| Resolved when `descriptorFor` runs | Resolved again on every call |
|---|---|
| `id`, `name`, `category`, `placement`, `inputs`, `plots`, `fills`, `alerts` | `calc`, `calcTail`, `range`, `levels`, `barColors`, `background`, `markers`, `table`, `draws`, `attach` |

Most settings changes need nothing from you: `study.setSettings` reaches the second column at once. The first column matters only for a declaration option a script writes from an input, such as `study("Bands", precision = input(2, "Decimals"))` or a plot width written `width = input(2, "Width")`. Those are part of the declared shape, so they read the `settings` you passed to `descriptorFor`. A host that keeps one descriptor per study instance passes that instance's stored settings and builds the descriptor again when the user changes one of them.

A plot colour taken from a colour input is the one exception in the first column: the plot also carries the input's key as its `colorKey`, and openalgo-charts restyles the line from each instance's own settings with no rebuild.

A stored value the engine would refuse, such as a precision of 99 against an input declared `max = 8`, reads as the input's default in the declared shape, so the settings dialog still opens and the user can correct it. The calculation itself still stops with [OS6019](/script/errors/data#os6019) naming the key and the bound.

## How the chart drives the engine

| The chart calls | The adapter does |
|---|---|
| `calc(bars, settings, store, ctx)` | Loads the program into a fresh engine and runs every bar. Used on the first draw, on a settings change and whenever the history changes |
| `calcTail(bars, settings, fromIndex, previous, store, ctx)` | Re-runs the bar that moved with `update` and appends any bar after it. Used as a live bar forms |

The tail path is refused rather than trusted. It runs only when the engine it holds was loaded with the same settings and has executed exactly the bars before the tail, checked by the first and last bar times. Anything else returns nothing and the chart falls back to a full `calc`, because splicing a tail onto a history that changed underneath it draws a plausible wrong study.

Every bar of history is handed over as confirmed and not realtime. The newest bar takes its state from the chart, so markers, alerts and orders wait for it to close, exactly as in [JavaScript library](/script/integrate/javascript#a-live-bar). The adapter keeps each instance's engine in the store the chart gives that instance. `release(store)` drops it and closes any fetch still in flight; for a study that reads another instrument, the lifecycle the chart attaches calls it when the study is detached.

## When a study cannot run

The engine never throws, and a chart's calculation has nowhere to put a failure except an exception. So the adapter throws a `ChartAdapterError` carrying the engine's diagnostic whole:

| `error.name` | Raised when | What the user can do |
|---|---|---|
| `IndicatorInputError` | The program was refused before any bar ran: a setting ([OS6019](/script/errors/data#os6019)), a limit, or a capability the host did not give ([OS6006](/script/errors/data#os6006)) | For a setting, correct it in the study's dialog; the chart treats this name as an input error the user can fix. A limit or a capability is the host's to fix |
| `OpenScriptError` | The program ran and stopped on a bar | Fix the script. `error.diagnostic.span.line` says where |

`error.diagnostic` has the catalogue code, the message, the fix and the source position, the same record [JavaScript library](/script/integrate/javascript#reading-a-diagnostic) describes. Show those rather than a generic failure.

## Reading another instrument

A study that calls [[req.symbol()]], such as a stock's ratio to the NIFTY index, needs bars the chart does not hold. The descriptor of such a study carries an `attach` lifecycle, and the chart fetches through the bars provider you register:

```js
chart.setBarsProvider(({ symbol, exchange, interval, from, to, signal }) =>
  fetchBars(symbol, exchange, interval, from, to, signal),
);
```

`fetchBars` is your own call to your data source, returning chart bars (times in UTC seconds) for that instrument and range. The sequence is:

1. The first calculation runs before anything is fetched. The read is absent, [[req.isReady()]] is false, and the rest of the study draws.
2. The lifecycle asks your provider for the range the chart covers, extended back by the warmup the read needs and rounded to whole bars of the requested interval, so a new fetch happens only when a bar of that interval closes.
3. When the bars arrive the chart recomputes, and the read has values.

While a wider fetch is in flight, the bars already fetched keep serving, so the line does not break each time a bar of the requested interval closes. A provider that rejects is reported as [OS6009](/script/errors/data#os6009) carrying your provider's own message, which the script can read with [[req.error()]] and the chart shows as the study's data status; everything that does not depend on the read keeps drawing. A read of the chart's own instrument at another timeframe, [[req.timeframe()]], needs no provider: the engine folds the chart's own bars.

## Strategies on a chart

A strategy places orders, and a chart has nowhere to send them. So a strategy handed to the adapter with no destination is refused at load with [OS6006](/script/errors/data#os6006) naming the `orders` capability. That refusal is deliberate: a chart that quietly swallowed a strategy's orders while drawing its plots would show a strategy the user believes is running.

Two ways to draw one:

| Option | What happens |
|---|---|
| `simulateOrders: true` | The strategy runs against the same simulated destination the [backtest](/script/integrate/backtesting-api) uses. Its plots, legend and settings work, its position is right, and the entries and exits on the price are the same fills as the backtest report of the same script. Nothing is sent anywhere |
| `orders: route` | Your own route function receives each order and its intents. Wins over `simulateOrders`. See [Host interface](/script/integrate/host-interface#orders) |

```js
const descriptor = descriptorFor(strategyProgram, {
  simulateOrders: true,
  instrument: { exchange: "NSE", lotSize: 1, hasVolume: true },
});
```

A chart draws a strategy; it does not report one. The simulated destination prices fills against the chart's tick size and uses neutral money settings, and nothing a chart draws reads a profit figure. Run the [backtest](/script/integrate/backtesting-api) for the report.

## Who owns the candles

Several studies can share a pane, and the instrument's candles are one object. So only one study's [[barColor()]] is drawn: **the study latest in the chart's own study order that paints**. The rule follows the order the user sees in the legend and changes only when the user adds, removes or reorders a study, so the candles never flicker between two colourings while both studies recompute. openalgo-charts applies it for you: of the studies that paint, the one added last owns the candles, and removing or hiding it gives the bars their own colours back. A host drawing on another chart applies the rule with `candleOwner`:

```js
import { candleOwner } from "openalgo-script/adapters/charts";

// Your studies in legend order, oldest first. A study that paints carries its barColors hook.
const owner = candleOwner([
  { id: "ema-cross", barColors: undefined },
  { id: "trend-paint", barColors: trendDescriptor.barColors },
  { id: "rsi" },
]);
// owner is "trend-paint": draw its bar colours and ignore any other study's.
```

Backgrounds need no such rule. Every colour carries its own alpha, and two translucent backgrounds compose.

## What the chart does not draw in 0.5.0

The compiled program carries all of a script's outputs; a few have no field on the chart's descriptor to land in, and are left out rather than approximated:

| Script feature | On the chart |
|---|---|
| A [[fill()]] whose colour changes per bar | Drawn in its first plot's colour, faded. The chart's band takes one colour |
| A table's title | Not shown. The chart's grid has no heading |
| A second [[table()]] in one study | Only the first grid is drawn |
| An alert's `frequency` | Every alert is checked once per new bar, which is `"oncePerBar"` |

Each of these is a fact about this chart's descriptor, not about the language. Another host reading the same compiled program may draw all of it.

## Writing an adapter for another chart

If your platform has its own chart, write your own adapter and keep everything else. The chart adapter is the only module that knows both worlds, which makes it the piece to replace rather than patch. Everything it does is on [JavaScript library](/script/integrate/javascript): load the program, run the bars, read `program.outputs` and the channels, and map each output onto your chart's own series, bands, markers and grids. The rules worth copying from this one:

- Convert bar times at the boundary. openalgo-charts counts in seconds and the engine in milliseconds; a study comparing `time` against an anchor is otherwise out by a factor of a thousand and still draws.
- Keep absence as absence. A `null` in a column is a gap, never a zero.
- Re-run a moving bar with `update`, never by appending it again.
- Hand over the whole set of drawing objects after every run and replace what you drew before. There is no add or remove event to track.

**Related.** [JavaScript library](/script/integrate/javascript), [Host interface](/script/integrate/host-interface), [Backtesting API](/script/integrate/backtesting-api), [Editor integration](/script/integrate/editor-integration), [Visuals overview](/script/visuals/overview), [Other instruments](/script/data/other-instruments), [Realtime and confirmation](/script/language/realtime-and-confirmation)
