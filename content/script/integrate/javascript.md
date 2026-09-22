---
title: JavaScript library
description: Install openalgo-script, compile a script to a compiled program, load it, run it over your bars, and read its plots, markers and alerts, in the browser or on a Node.js server.
---

This page covers the core of `openalgo-script`, the npm package that holds the OpenScript compiler and engine: compiling a script, loading the program it produces, running it over bars, following a live bar as it forms, and reading every output back. It is the page to read before the chart adapter, the editor functions or the backtest, because all three are built on these calls.

Everything here runs the same way in a browser tab, in a web worker and in Node.js. The core imports no package and touches no browser global.

## Install

```bash
npm install openalgo-script
```

| Fact | Value |
|---|---|
| Module format | ECMAScript modules only. Use `import`, not `require` |
| Server runtime | Node.js 22 or newer |
| Types | TypeScript declarations ship in the package; no separate types package |
| Runtime dependencies | None |
| Entry points | `openalgo-script`, `openalgo-script/editor`, `openalgo-script/adapters/charts`, `openalgo-script/adapters/codemirror` |

## A complete run

The script is the EMA cross from [Two libraries](/script/integrate/overview), saved as `ema-cross.os`:

```openscript title="ema-cross.os"
version 1
study("EMA cross", overlay = true)

fast = input(9, "Fast", min = 1)
slow = input(21, "Slow", min = 2)

ef = ema(close, fast)
es = ema(close, slow)
plot(ef, "Fast EMA", aqua)
plot(es, "Slow EMA", orange)

if crossUp(ef, es)
    signal("BUY", color = green, at = "below", shape = "arrowUp")
    alert("Fast EMA crossed above slow EMA", id = "cross-up", title = "Cross up")
if crossDown(ef, es)
    signal("SELL", color = red, shape = "arrowDown")
```

Most hosts wrap the four compiler stages in one helper. This is the one the rest of the Integrate pages use:

```js title="compile.mjs"
import { sourceFile, parse, check, emit, DiagnosticBag } from "openalgo-script";

/** Source text in; a compiled program, or the reasons there is none, out. */
export function compile(name, text) {
  const file = sourceFile(name, text);
  const bag = new DiagnosticBag();
  const checked = check(file, parse(file, bag), bag);
  const { program } = emit(file, checked, bag);
  if (bag.hasErrors || program === undefined) {
    return { ok: false, file, diagnostics: bag.ordered() };
  }
  return { ok: true, file, program, diagnostics: bag.ordered() };
}
```

And this runs the script over two NSE sessions of 5 minute bars and reads back a plot and every marker:

```js title="run.mjs"
import { readFileSync } from "node:fs";
import { load } from "openalgo-script";
import { compile } from "./compile.mjs";

const compiled = compile("ema-cross.os", readFileSync("ema-cross.os", "utf8"));
if (!compiled.ok) throw new Error(compiled.diagnostics.map((d) => d.message).join("\n"));
const { program, file } = compiled;

const loaded = load(program, { source: file, settings: { fast: 9, slow: 21 } });
if (!loaded.ok) throw new Error(`${loaded.diagnostic.code}: ${loaded.diagnostic.message}`);
const engine = loaded.engine;

// Your own bars, oldest first. Here: two NSE sessions of 5 minute bars.
const bars = [];
for (let day = 0; day < 2; day++) {
  const open = Date.UTC(2025, 0, 6 + day, 3, 45); // 09:15 IST
  for (let i = 0; i < 75; i++) {
    const close = 820 + 6 * Math.sin((day * 75 + i) / 8);
    bars.push({ time: open + i * 300_000, open: close - 0.4, high: close + 0.9, low: close - 1.1, close, volume: 12_000 });
  }
}

const run = engine.run(bars);
if (run.diagnostic) throw new Error(run.diagnostic.message);

// Plots: one column per plot, read by channel.
const fast = program.outputs.plots.find((p) => p.title === "Fast EMA");
console.log("Fast EMA on the last bar:", engine.column(fast.channel).at(-1));

// Markers: a marker channel holds its text on the bars where signal() fired.
for (const marker of program.outputs.markers) {
  run.bars.forEach((bar, i) => {
    const text = bar.columns[marker.channel];
    if (text !== null) console.log(new Date(bars[i].time).toISOString(), text, marker.position, marker.shape);
  });
}
```

It prints the fast average on the last bar, then every marker with its time, position and shape, one marker declaration at a time:

```text
Fast EMA on the last bar: 816.7267522123716
2025-01-06T07:50:00.000Z BUY below arrowUp
2025-01-07T05:45:00.000Z BUY below arrowUp
2025-01-06T05:35:00.000Z SELL above arrowDown
2025-01-06T09:55:00.000Z SELL above arrowDown
2025-01-07T07:55:00.000Z SELL above arrowDown
```

The `SELL` marker sits `above` the bar because its [[signal()]] call names no position and `above` is the default. The rest of this page explains each call in that file.

## Compiling

Compilation is four stages, and each is a function you can call on its own:

| Call | Takes | Gives |
|---|---|---|
| `sourceFile(name, text)` | A file name for messages, and the raw text | A `SourceFile`: the text normalised (a byte order mark dropped, CRLF turned into LF), with line and column lookups |
| `parse(file, sink)` | The source file and a diagnostic sink | The syntax tree. It recovers around a malformed statement, so later stages still run |
| `check(file, script, sink)` | The file and the tree | A `CheckedScript`: names resolved, types checked, warmup tracked |
| `emit(file, checked, sink, options?)` | The file and the checked script | `{ program, gaps }`: the [compiled program](/script/integrate/compiled-program), and anything that stopped a faithful program being produced, in which case `program` is `undefined` |

A `DiagnosticBag` is the sink every stage reports into. Read it with `all`, `errors`, `warnings`, `hasErrors` and `ordered()`, which sorts everything into the order a reader walks the file.

:::warn
Decide whether a compile succeeded from `bag.hasErrors`, not from whether `program` is defined. The emitter can still hand back a program for a file the checker refused, and such a program must never be stored or run. A file with warnings and no errors is a good program.
:::

### Reading a diagnostic

Every diagnostic carries the same fields, wherever it was raised:

| Field | Holds |
|---|---|
| `code` | The stable catalogue code, such as `OS2001` |
| `severity` | `"error"` or `"warning"` |
| `stage` | Which stage raised it |
| `title` | The catalogue's short name for the code |
| `message` | The sentence, with the names from your file filled in |
| `fix` | What to change, from the same catalogue |
| `autofix` | Whether an editor may apply the fix without asking the trader a question |
| `span` | `offset`, `length`, `line` and `column` in the normalised text |
| `values` | The values that filled the message, for a host that writes its own wording |

`renderDiagnostics(file, diagnostics)` prints them the way a terminal shows them, with the line and a caret under the fault:

```js
import { renderDiagnostics } from "openalgo-script";
import { compile } from "./compile.mjs";

const result = compile("typo.os", `version 1
study("Typo")
plot(emaa(close, 9), "EMA")
`);
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.log(`${d.severity} ${d.code} at ${d.span.line}:${d.span.column}: ${d.message}`);
    console.log(`  fix: ${d.fix}`);
  }
  console.log(renderDiagnostics(result.file, result.diagnostics));
}
```

```text
error OS2001 at 3:6: emaa is not defined at this point in the file.
  fix: Assign emaa above this line, move this line below its assignment, or correct the spelling to ema.
typo.os

3 | plot(emaa(close, 9), "EMA")
  |      ^^^^
OS2001: emaa is not defined at this point in the file.
Fix: Assign emaa above this line, move this line below its assignment, or correct the spelling to ema.
```

The first two lines are the loop's own; the rest is `renderDiagnostics`. The `values` of that diagnostic are `{ name: "emaa", suggestion: "ema" }`, which is what a host needs to offer the correction as a one-click fix.

The [Errors](/script/errors/overview) section documents every code. An editor that shows errors while the trader types calls `diagnose` from the editor entry point instead, which runs the same stages: see [Editor integration](/script/integrate/editor-integration).

### Store the program, not the compile

A compiled program is kilobytes and it is cacheable. Compile once per saved revision of a script, store the result keyed by its hash, and load it wherever it has to run:

```js title="store.mjs"
import { readFileSync } from "node:fs";
import { canonicalise, programHash, sourceHash, loadText } from "openalgo-script";
import { compile } from "./compile.mjs";

const compiled = compile("ema-cross.os", readFileSync("ema-cross.os", "utf8"));
if (!compiled.ok) throw new Error(compiled.diagnostics.map((d) => d.message).join("\n"));
const { program, file } = compiled;

// What you store beside the script: the canonical text and both hashes.
const stored = {
  sourceHash: sourceHash(file.text),  // identifies the text the trader wrote; equals program.source.hash
  programHash: programHash(program),  // identifies the program an engine runs
  program: canonicalise(program),     // the bytes that travel, and that the hash covers
};

// Later, in another process or on another machine:
const loaded = loadText(stored.program, { settings: { fast: 5 } });
console.log(loaded.ok); // true
```

`canonicalise` writes the one canonical text of a program: sorted keys, no whitespace, fixed number and string spellings. `programHash` and `sourceHash` are SHA-256 hashes written as `sha256:` and 64 hexadecimal digits. Record both beside a chart, a backtest or a running strategy and you can prove months later that an engine upgrade did not change a result. The [Python engine](/script/integrate/python-engine) is handed exactly this canonical text.

:::warn
`sourceHash` hashes exactly the text you give it. The program's own `source.hash` is taken over the normalised text, with a byte order mark dropped and CRLF line endings turned into LF, so hash `file.text` from the compile rather than the raw file. On a file saved with CRLF line endings the two differ.
:::

## Loading

`load(program, options)` verifies a program in full before a single bar runs, then resolves its inputs. It never throws. It answers either `{ ok: true, engine, inputs }` or `{ ok: false, diagnostic }`, so a program that cannot run says so before your chart has drawn anything.

| Option | What it is |
|---|---|
| `settings` | The stored input values, keyed by input key. Leave it out to run every input at its default |
| `host` | What your platform supplies: the instrument record, the chart clock, an order route and a provider for other instruments' bars. See below |
| `source` | The `SourceFile`, so a runtime diagnostic can carry an offset as well as a line |
| `limits` | Any of the engine's budgets you want to change, as a partial object |
| `clock` | A function returning the current time in milliseconds. With `limits.ms` set, it turns on the per-bar time budget |
| `time` | How a `"time"` input's stored wall clock text becomes an instant. Without it the text is read as UTC |

### Settings and input keys

An input's key is the name it was assigned to: `fast = input(9, "Fast")` is keyed `fast`. An input that no variable receives is keyed by its title. That covers an input written straight into a call, such as `ema(close, input(9, "Length"))`, keyed `Length`, and one written as a declaration option, such as `strategy("S", qty = input(1, "Quantity"))`, keyed `Quantity` (there `qty =` names the option, not a variable). The keys a program declares are in `program.inputs`, each with its kind, label, default, bounds and options, which is everything a settings dialog needs.

A stored value that fails its input's type, `min`, `max` or `options` is refused at load with [OS6019](/script/errors/data#os6019), naming the key. It is not quietly replaced with the default, because a settings dialog that ignores what the user typed is worse than one that says the value is out of range. A stored key the program no longer declares is ignored, so removing an input and putting it back keeps the user's value.

Changing a setting is a new load. Settings are read once, before bar 0, because declaration options may be written from inputs and those are fixed before the first bar.

### The host

The `host` option is the whole of what the engine reads from your platform. Every field is optional:

```js
const loaded = load(program, {
  source: file,
  settings: { fast: 9, slow: 21 },
  host: {
    instrument: {
      symbol: "SBIN", exchange: "NSE", interval: "5", timezone: "Asia/Kolkata",
      tickSize: 0.05, lotSize: 1, currency: "INR", instrumentType: "equity",
      hasVolume: true, session: { start: "09:15", end: "15:30", days: [1, 2, 3, 4, 5] },
    },
    now: Date.now(),                 // what chart.now() answers
    route: (effect, bar) => { /* send effect.intents to your order path */ },
    requestBars: (query) => undefined, // bars for another instrument: see Host interface
  },
});
```

What each field turns on is decided at load, not discovered on bar four thousand:

| Field left out | What happens |
|---|---|
| `instrument` | Every [[chart.tickSize]], [[chart.lotSize]] and other instrument fact reads as absent. With no `session`, the per-bar session facts are absent too, and [[vwap()]] never starts. A `session` stated without a `timezone` is refused at load with [OS6012](/script/errors/data#os6012), because a wall clock window with no zone is not a window |
| `route` | The engine has no `orders` capability. A strategy is refused at load with [OS6006](/script/errors/data#os6006) naming it; every study still runs |
| `requestBars` | The engine has no `req.symbol` capability, so a script that calls [[req.symbol()]] is refused at load. [[req.timeframe()]] needs no provider: the engine folds the chart's own bars |

[Host interface](/script/integrate/host-interface) is the full contract: every field of the instrument record, how to answer a request, and how orders and their fills travel.

### Other loaders

| Call | Use it when |
|---|---|
| `loadText(text, options)` | The program arrives as text from storage or the network. The text must be the canonical encoding; any other spelling is refused with OS6018, because the hash you recorded was taken over canonical bytes |
| `verify(program, { capabilities, limits })` | You want to refuse a bad program when it arrives rather than when it is first drawn. `capabilitiesFor(hasOrderRoute, hasRequestProvider)` gives the capability list an engine with that host would have, and `DEFAULT_LIMITS` the default budgets |

## Bars

The engine takes one plain object per bar, oldest first:

```json
{
  "time": 1736135100000,
  "open": 820.4,
  "high": 821.5,
  "low": 819.3,
  "close": 821.1,
  "volume": 12000,
  "oi": null
}
```

| Field | Rule |
|---|---|
| `time` | The bar's **open** instant, whole milliseconds since the Unix epoch, UTC. 09:15 IST is 03:45 UTC |
| `open`, `high`, `low`, `close` | Numbers. A price your feed does not have is `null`, never zero and never carried forward |
| `volume` | Optional. Leave it out or write `null` when you do not know it. `0` means you know nobody traded |
| `oi` | Optional open interest, for NFO and MCX contracts. A level, not a flow |

The engine derives `hl2`, `hlc3`, `ohlc4` and `hlcc4` itself, with a fixed order of operations, so do not supply them.

Two things are refused rather than run on. A run over no bars is [OS6010](/script/errors/data#os6010). A bar whose `time` is not strictly after the one before it is [OS6011](/script/errors/data#os6011), naming that bar. The engine never sorts, deduplicates or repairs what it is given, so either one is a fix on your side.

## Running over history

`engine.run(bars, states?)` runs the whole dataset in one call and returns `{ bars, diagnostic }`, one result per bar. It stops at the first bar that fails. The optional `states` array gives each bar's state (below); without it every bar is history.

An engine keeps every bar it has been given. A second `run` on the same engine continues after the last bar rather than starting again, so handing it the same history twice is refused with [OS6011](/script/errors/data#os6011) at its first bar. To start over, for a new instrument, a new interval or a corrected history, call `load` again and use the new engine. `engine.barCount` says how many bars an engine holds.

Each bar's result:

| Field | Holds |
|---|---|
| `index` | Which bar, counting from 0 |
| `columns` | One value per channel, in channel order. `null` where nothing wrote the channel on this bar |
| `applied` | Whether the bar was decided, so its markers, alerts and orders took effect |
| `effects` | The order calls the bar applied, each with the order intents it became |
| `frames` | What the order updates delivered since the previous bar did to the strategy's ledger |
| `alerts` | The alerts this bar raised |
| `diagnostic` | The failure that stopped the bar, when one did |

The engine never throws. A failing bar returns its diagnostic with a catalogue code and a source line, the bar's columns stay as they were, and `engine.failed` becomes true: a stopped script stays stopped until you load it again. One broken script cannot take anything else in your process down.

## Reading the outputs

Everything a script declares is in `program.outputs`, fixed before bar 0, and each declaration names the channel its per-bar value travels in:

| Output | Declared in | Per-bar value |
|---|---|---|
| Plots | `outputs.plots`: `key`, `title`, `type`, `channel`, `color`, `width`, `lineStyle`, `scale` and more | A number, or `null` for a gap |
| Fills | `outputs.fills`: `between` (the two plot keys), `colorUp`, `colorDown`, `opacity` | None of their own: a band is drawn from its two plots' columns. A band coloured per bar also has `colorUpChannel` and `colorDownChannel` |
| Levels | `outputs.levels`: `title`, `channel`, `color`, `lineStyle`, `lineWidth` | The price on each bar. A chart draws the line at the last bar's |
| Markers | `outputs.markers`: `channel`, `position`, `shape`, `color` | The marker's text on the bars where [[signal()]] fired |
| Alerts | `outputs.alerts`: `key`, `title`, `condChannel`, `messageChannel`, `frequency` | Raised alerts arrive on the bar result |
| Bar colour and background | `outputs.barColor`, `outputs.background` | A colour, or `null` to leave the bar alone |
| Tables | `outputs.tables`: `position`, `rows`, `cols`, `options` | `engine.tables()` gives each grid as the last bar left it |
| Drawing objects | Not declared: the set grows and shrinks as bars arrive | `engine.drawings()` gives every live object, oldest first |

`engine.column(channel)` returns a whole channel over every bar run so far, which is what a chart wants. A colour in a column is an object, `{ tag: "color", r, g, b, a }`: red, green and blue from 0 to 255 and alpha from 0 to 1. In the declarations of `program.outputs` the same colour is written as four numbers, `[r, g, b, a]`.

**Absence is `null` at the boundary.** A plot that has not warmed up yet is `null`, not zero, and a chart draws a gap. There is no warmup length to trim: the line starts on the bar its value stops being absent. [Warmup](/script/language/warmup) explains the rule from the script's side.

The [chart adapter](/script/integrate/charts-adapter) does all of this mapping for openalgo-charts. Read the outputs yourself when you draw on another chart or send the values somewhere else.

## A live bar

A chart's newest bar keeps changing until its interval ends. The engine handles that with two calls and one piece of state:

| Call | Means |
|---|---|
| `engine.append(bar, state)` | A new bar has opened. Runs it once |
| `engine.update(bar, state)` | The newest bar changed. Rolls the engine back to the start of that bar, then runs it again |
| `state.isConfirmed` | The bar's interval has elapsed. True for every bar of history |
| `state.isRealtime` | A realtime feed is driving this bar. False for every bar of history |

```js title="live.mjs"
import { readFileSync } from "node:fs";
import { load } from "openalgo-script";
import { compile } from "./compile.mjs";

// A fresh engine: it has run no bars yet.
const { program, file } = compile("ema-cross.os", readFileSync("ema-cross.os", "utf8"));
const { engine } = load(program, { source: file });

const open = Date.UTC(2025, 0, 6, 3, 45); // 09:15 IST
const bar = (i, close) => ({ time: open + i * 300_000, open: close, high: close + 1, low: close - 1, close, volume: 5_000 });

// History first: 40 closed bars.
engine.run(Array.from({ length: 40 }, (_, i) => bar(i, 820 - i * 0.5)));

// A new 5 minute bar opens: append it once.
let r = engine.append(bar(40, 801), { isConfirmed: false, isRealtime: true });

// Every tick inside it: update the same bar. The engine rolls back to the start
// of the bar first, so ten updates give the answer one update would.
r = engine.update(bar(40, 809), { isConfirmed: false, isRealtime: true });
r = engine.update(bar(40, 830), { isConfirmed: false, isRealtime: true });
// r.columns has the new averages; r.applied is false and r.alerts is empty.

// The interval elapses: confirm it. Only now do markers, alerts and orders apply.
r = engine.update(bar(40, 830), { isConfirmed: true, isRealtime: true });
// r.applied is true, and r.alerts holds the cross-up alert:
// { key: "cross-up", title: "Cross up", message: "Fast EMA crossed above slow EMA", bar: 40, time: ... }
```

Three rules make a live chart agree with a backtest of the same bars:

- **Update the bar that moved; never append a tick as a new bar.** A tick appended as a bar is a bar that never existed: every average counts it, the history operator shifts, warmup ends early, and nothing raises an error. The study on the trader's chart quietly stops being the study a backtest computes.
- **Plots redraw on every update; markers, alerts and orders wait.** A condition that was true halfway through a bar and false at its close places no order and fires no alert, because the execution that saw it was rolled back. A script can opt out with `onUnconfirmed = true` in its declaration; see [Realtime and confirmation](/script/language/realtime-and-confirmation).
- **An alert fires only on a realtime bar.** Adding a study to a chart that already holds history fires nothing for those bars, so a history load with `isRealtime` false raises no alerts.

A `live var` in a script is the one value that keeps its update-to-update state instead of rolling back, and a script that uses one is not reproducible by design.

## Budgets

The engine counts its own loop, so a runaway script stops rather than freezing the tab or the server. `DEFAULT_LIMITS` holds the defaults, and `load(program, { limits })` changes any of them:

| Limit | Default | Guards |
|---|---|---|
| `arrayElements` | 1,000,000 | Elements in one array ([OS5002](/script/errors/limits#os5002)) |
| `stringLength` | 100,000 | Characters (Unicode code points) in one string |
| `drawingObjects` | 10,000 | Lines, labels, boxes and polylines a script holds at once |
| `frames` | 64 | Nested function calls |
| `steps` | `null`: worked out from the program | Instructions one bar may execute. Left at `null`, the engine computes the most a bar of this program can possibly execute and uses that, so a host rarely sets it |
| `ms` | `null`: no time limit | Wall clock milliseconds per bar. Takes effect only with the `clock` option |
| `loops`, `history`, `instructions`, `states`, `requests` | `null`: no ceiling | Ceilings on what a program may ask for: the loop budget and retained history its `limits` line states (OS5003), its instruction count (OS5009), its state regions (OS5004) and its reads of other data (OS5006). A program over a ceiling is refused at load, never silently capped |

A script's own `limits` line sets its loop budget and retained history; [Limits](/script/writing/limits) covers them from the script's side.

## Running it safely on a server

Run the engine in its own worker process, not on the thread that handles requests: an engine pass over a long history is pure computation with no pause in it. Treat a long run as a job, return an identifier at once and report progress on a channel you already keep open, because a proxy's read timeout will end a request long before a multi-year backtest does. Start that process with `--disallow-code-generation-from-strings`, as [Two libraries](/script/integrate/overview#what-the-design-guarantees) explains.

The engine takes one object per bar rather than columnar arrays. That costs roughly three times the memory of typed arrays over a decade of one minute bars, which matters for a very long backtest inside a browser tab and not on a server. Build the bar objects straight from your data response rather than parsing into one shape and copying into another, so you hold one copy.

**Related.** [Two libraries](/script/integrate/overview), [Chart adapter](/script/integrate/charts-adapter), [Editor integration](/script/integrate/editor-integration), [Backtesting API](/script/integrate/backtesting-api), [Host interface](/script/integrate/host-interface), [Compiled program](/script/integrate/compiled-program), [Execution model](/script/language/execution-model)
