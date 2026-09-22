---
title: Two libraries
description: OpenScript ships as two Apache 2.0 libraries with no runtime dependencies, openalgo-script on npm for JavaScript and TypeScript and openscript on PyPI for Python, so any financial portal can compile, draw, backtest and run the same scripts.
---

This section is for developers who want OpenScript, also called OpenAlgo Script, inside their own financial portal, trading terminal or research tool. It covers the two libraries the language ships as, what each one holds, which pieces your platform keeps, and the order in which to adopt them. Read this page first: it decides which of the other Integrate pages you need.

OpenScript is not a feature locked inside OpenAlgo. OpenAlgo itself is built on the same two libraries described here: the /trading page compiles, draws and backtests scripts with `openalgo-script`, and OpenAlgo's server runs a deployed strategy with `openscript`. Nothing it does with them is closed to you.

## The two libraries

| | `openalgo-script` | `openscript` |
|---|---|---|
| Registry | npm | PyPI |
| Language | JavaScript and TypeScript (types included) | Python |
| Runtime | Any modern browser; Node.js 22 or newer on a server | Python 3.12 or newer |
| Holds | The compiler, the engine, the backtest, six headless editor functions (functions that return data and draw nothing), a chart adapter and a drop-in editor adapter | An engine that runs compiled programs. No compiler |
| Runtime dependencies | None | None (the Python standard library only) |
| Licence | Apache 2.0 | Apache 2.0 |
| Version | 0.5.0 | 0.5.0 |

```bash
npm install openalgo-script
pip install openscript
```

The two are released together at the same version. The source, the specification and the conformance suite are in the project repository at [github.com/marketcalls/openscript](https://github.com/marketcalls/openscript).

Apache 2.0 was chosen on purpose. A platform can embed the language in a commercial product without publishing its own source, which is what a shared language needs.

## A first run

This is the whole loop, compile, load, run and read, in one file. Save the script as `ema-cross.os`:

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

Then run it with Node.js 22 or newer, after `npm install openalgo-script`:

```js title="first-run.mjs"
import { readFileSync } from "node:fs";
import { sourceFile, parse, check, emit, DiagnosticBag, load, renderDiagnostics } from "openalgo-script";

// 1. Compile: source text in, a compiled program (plain data) out.
const text = readFileSync("ema-cross.os", "utf8");
const file = sourceFile("ema-cross.os", text);
const bag = new DiagnosticBag();
const { program } = emit(file, check(file, parse(file, bag), bag), bag);
if (bag.hasErrors || program === undefined) {
  throw new Error(renderDiagnostics(file, bag.ordered()));
}

// 2. Load: verify the program and resolve its inputs.
const loaded = load(program, { settings: { fast: 9, slow: 21 } });
if (!loaded.ok) throw new Error(`${loaded.diagnostic.code}: ${loaded.diagnostic.message}`);

// 3. Run: one record per bar, oldest first. These stand in for your own data:
//    one NSE session of 5 minute bars from 09:15 IST, times in UTC milliseconds.
const sessionOpen = Date.UTC(2025, 0, 6, 3, 45);
const bars = Array.from({ length: 75 }, (_, i) => {
  const close = 820 + 6 * Math.sin(i / 8);
  return { time: sessionOpen + i * 300_000, open: close - 0.4, high: close + 0.9, low: close - 1.1, close, volume: 12_000 };
});
const { bars: results, diagnostic } = loaded.engine.run(bars);
if (diagnostic) throw new Error(`${diagnostic.code} on line ${diagnostic.span.line}: ${diagnostic.message}`);

// 4. Read: every plot is a channel, one value per bar, null where it has none yet.
const last = results.at(-1);
for (const plot of program.outputs.plots) {
  console.log(plot.title, last.columns[plot.channel]);
}
```

It prints the two averages on the last bar of the session:

```text
Fast EMA 823.0657170289549
Slow EMA 823.1290870928198
```

Nothing was drawn, fetched or sent anywhere: the library computed numbers from the bars it was handed, and everything else is yours. [JavaScript library](/script/integrate/javascript) takes each of the four steps apart.

## The one line that divides the work

**OpenScript owns anything that produces a number. Your platform owns anything that produces a pixel, a database row or a process.**

Indicator values, order fills, the position, profit and loss, stops, targets and trailing, the equity curve, drawdown and win rate are language semantics. They are identical everywhere the language runs. Bars, your symbology, your market's charges, your storage, your job scheduling and your report page are yours, because a platform in another market has different answers to every one of them.

That line is what makes this promise possible: **a script backtested in a trader's browser produces the same trades as the same script backtested on your servers.** A server backtest whose numbers disagree with the trader's own chart is worse than none, because there are then two answers and no way to tell which is wrong.

## How a script becomes numbers

```text
script text  ->  compiled program (plain data)  ->  engine  ->  values, markers, alerts and orders
```

The compiler does not emit JavaScript or Python. It emits a [compiled program](/script/integrate/compiled-program): a versioned data structure holding a list of instructions and the tables that describe the study, its inputs and its outputs. An engine runs a script by walking that list, one bar at a time.

Compiling and running are separate steps and can happen on different machines, which decides where your costs land:

| Work | Where it usually runs | What it costs you |
|---|---|---|
| Compiling a script | The trader's browser, in milliseconds | Nothing on your servers |
| Drawing a study on a chart | The trader's browser | Nothing beyond the page you already serve |
| Backtesting over bars already on the chart | The trader's browser | Nothing on your servers |
| A strategy running while nobody is watching | Your server | A process per running strategy |
| A backtest over a range too long to send to a browser | Your server | A job |

Most of what your users do never reaches your servers. Store a compiled program keyed by its hash and compile again only when the script changes.

## What each piece is, and which way it depends

The JavaScript library is one package with an entry point per tier, so a consumer who wants only the compiler never loads an adapter.

| Import | Is | Depends on |
|---|---|---|
| `openalgo-script` | The compiler, the engine and the backtest | Nothing |
| `openalgo-script/editor` | Six headless language functions: highlight, complete, diagnose, hover, signature and format | The compiler |
| `openalgo-script/adapters/charts` | Turns a compiled study into an indicator for openalgo-charts, the OpenAlgo charting engine | The compiler, and the chart as an optional peer dependency |
| `openalgo-script/adapters/codemirror` | The drop-in editor adapter: wires the six functions into a popular open-source editor component | The editor functions, and that component as an optional peer dependency |

Dependencies point one way. The compiler knows no chart and no editor; only an adapter knows two worlds at once. That makes an adapter the piece a platform replaces rather than patches: a platform with its own chart writes its own chart adapter and keeps everything else, and a platform with its own editor does the same on that side. Nothing in the package names a browser global, so every file loads in a web worker and on a server.

The Python engine is a separate package in another language. It runs a program compiled elsewhere, which is what lets a Python-only production server run strategies without a JavaScript runtime in its image.

## Adopting it one step at a time

Each row is useful on its own, and nobody has to take the next one.

| You want | You add | Roughly |
|---|---|---|
| Scripts that produce numbers | `openalgo-script`, and the six things of the host interface | An afternoon |
| Those studies on your chart | The [chart adapter](/script/integrate/charts-adapter), and a chart | Days. Little more if you already use openalgo-charts |
| Traders writing scripts in your app | The [editor functions](/script/integrate/editor-integration), with your own text component or the drop-in adapter | Days |
| Backtests your traders can trust | The [backtesting API](/script/integrate/backtesting-api), your bars and your charge schedule | Nothing extra to install: it is in the first row's package |
| Traders trading from it | The order half of the [host interface](/script/integrate/host-interface), wired to your order API | About a week |
| Strategies on a Python server | The [Python engine](/script/integrate/python-engine) | Days |
| The language on your own stack | Your own engine for the compiled program, held to the [conformance suite](/script/integrate/conformance) | Weeks |

The last row is the one that makes OpenScript a standard rather than a library. A platform that will not run anyone else's interpreter reads the compiled program format, writes its own engine and passes the suite, and its traders' scripts are then the same scripts as everyone else's.

## What your platform supplies

Whatever you take, you supply six things, and a trading platform already has all of them:

1. **Bars**: open, high, low, close, volume and time, oldest first.
2. **Instrument facts**: tick size, lot size, session, timezone and the rest of the instrument record.
3. **More bars on request**, for another instrument or another timeframe, when scripts read them.
4. **Somewhere to draw**.
5. **Somewhere to send orders**, if scripts may trade.
6. **Somewhere to save settings**.

No instrument naming scheme, exchange rule or broker concept appears in the language. **A symbol is opaque to the engine**: it never parses one, never builds one and hands it back exactly as it received it. A relative contract, such as the at-the-money call of the nearest NFO expiry, resolves once at the start of a run, and every later action uses that resolved identity, so an exit never names a different contract from the one entered. [Host interface](/script/integrate/host-interface) gives the exact shape of each duty and what happens when you cannot answer.

## What the design guarantees

| Guarantee | Why it holds |
|---|---|
| Nothing turns text into code | A compiled program is data. The engine walks an instruction list and never calls a string evaluator or a function builder, so it runs under a content security policy with no `unsafe-eval` |
| A script cannot reach anything | It can only do what the instruction set exposes. There is no network, no file system and no access to the page or process it runs in |
| A runaway script stops | The engine owns the loop, so loop, instruction, memory and time budgets are counters inside it |
| One failing script takes nothing else down | Loading and running never throw. A failure is a diagnostic with a code and a source line, returned for that script alone |
| Same program, same bars, same numbers | Arithmetic order, rounding and every library function's accumulation order are specified, so every conforming engine agrees to the last bit. The one exception in 0.5.0 is the transcendental functions, such as [[exp()]], [[pow()]] and the trigonometric family, which still use the platform's own maths library and can differ in the last bit between machines |
| No runtime dependencies | Both packages declare none, and the project's build checks every import against that |

Those properties are why a platform can run many customers' scripts in one process, which a design that generates code cannot offer. A content security policy is the set of rules a web page sends the browser about what it may run; `unsafe-eval` is the permission that lets a page turn text into code, and the engine never needs it.

On a server you can make the first guarantee hold in your own process as well. Start the process that runs the engine with the runtime switch that refuses the string evaluator and the function builder:

```bash
node --disallow-code-generation-from-strings server.mjs
```

The switch refuses those two names in that one process and nothing wider. A child process gets its own options, so set it on every process you start, and keep anything that evaluates user text away from the engine's process. In a browser, a content security policy without `unsafe-eval` does the same job. If you run the engine in a web worker, serve the worker as a file from your own origin rather than building it from a blob, because a policy that allows scripts from your origin refuses a worker built from a blob URL.

## Where 0.5.0 stands

Stated plainly, so nothing on this list surprises you later:

- **Studies are the finished surface.** Plots, fills, levels, markers, bar colours, backgrounds, drawing objects, tables, alerts and reads of other timeframes and instruments all run, on a chart and headless.
- **The backtest does not model everything, and says which.** A stop or target attached with [[exit()]] or [[order.bracket()]] does not fill yet. A quantity stated in cash or as a percentage of equity is refused before the first bar rather than filled. A strategy that scales in is charted at the size it ended up entering, which can overstate its drawdown. A script cannot read its own equity during a run.
- **The Python engine runs less than the JavaScript one.** It has no drawing objects, tables or reads of other data, and no array functions, [[print()]], date functions or a few chart and session facts. A script that needs one is refused at load, naming what is missing; [Python engine](/script/integrate/python-engine#what-this-engine-runs-and-what-it-refuses) has the list.
- **The portability claim is still being tested.** The JavaScript and Python engines agree to the last bit on every case they both run, but both were written in the same repository. No engine written by anyone else has run the conformance suite yet, and no case yet asserts a per-bar indicator value.
- **Some library names are planned.** The compiler refuses a planned name with [OS2020](/script/errors/names-and-types#os2020) where it is written.

[Release notes](/script/resources/release-notes) carries the full list, release by release.

## Where to go next

| You are building | Read |
|---|---|
| Anything in JavaScript or TypeScript | [JavaScript library](/script/integrate/javascript) |
| Studies on openalgo-charts | [Chart adapter](/script/integrate/charts-adapter) |
| A script editor | [Editor integration](/script/integrate/editor-integration) |
| Backtests from code | [Backtesting API](/script/integrate/backtesting-api) |
| A Python server | [Python engine](/script/integrate/python-engine) |
| Your own host | [Host interface](/script/integrate/host-interface) |
| Your own engine | [Compiled program](/script/integrate/compiled-program), then [Your own engine](/script/integrate/conformance) |

**Related.** [Introduction](/script/getting-started/introduction), [Execution model](/script/language/execution-model), [JavaScript library](/script/integrate/javascript), [Python engine](/script/integrate/python-engine), [Compiled program](/script/integrate/compiled-program), [Host interface](/script/integrate/host-interface), [Glossary](/script/resources/glossary)
