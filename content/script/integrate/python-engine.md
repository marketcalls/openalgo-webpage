---
title: Python engine
description: pip install openscript to run compiled OpenScript programs on a Python server with no JavaScript runtime and no dependencies: load a program, execute bars one at a time, handle a moving bar, and send a strategy's orders through your own code.
---

`openscript` on PyPI is an OpenScript engine written in pure Python. It runs a compiled program on a server where no JavaScript runtime is available, which for a production trading server is the ordinary case. This page covers installing it, getting a program to it, running bars through it one at a time, handling the bar that is still forming, and running a strategy whose orders go through your own order path.

It holds **no compiler**. A program is compiled wherever the JavaScript library runs, in the trader's browser, a build step or a small service, and handed to this engine as data. The two engines are held to each other by the conformance suite, and a disagreement between them blocks a release.

## Install

```bash
pip install openscript
```

| Fact | Value |
|---|---|
| Python | 3.12 or newer |
| Dependencies | None. The standard library only, and not the parts of it that would stop two runs agreeing: no network, threads, randomness or locale inside the package |
| Licence | Apache 2.0 |
| Version | 0.5.0, released together with `openalgo-script` |
| Code generation | None. No string evaluator, no statement executor, no import by a computed name and no objects loaded out of bytes, so many people's scripts can run in one process |

## Getting a program to Python

The program travels as its **canonical text**. Compile where the compiler runs, write the canonical encoding, store it keyed by its hash, and hand that text to Python. This costs one compile per saved revision of a script, not one per run.

The study for this page, `two-bar-mean.os`:

```openscript title="two-bar-mean.os"
version 1
study("Two bar mean", overlay = true)

len = input(2, "Length", min = 1)
mean = sma(close, len)

if close > mean
    signal("UP")

plot(mean, "Mean", aqua)
```

Compiled with `openalgo-script` in Node.js, using the `compile` helper from [JavaScript library](/script/integrate/javascript):

```js title="build.mjs"
import { readFileSync, writeFileSync } from "node:fs";
import { canonicalise, programHash } from "openalgo-script";
import { compile } from "./compile.mjs";

const compiled = compile("two-bar-mean.os", readFileSync("two-bar-mean.os", "utf8"));
if (!compiled.ok) throw new Error(compiled.diagnostics.map((d) => d.message).join("\n"));

// The canonical text is what the Python engine loads, and what programHash covers.
writeFileSync("program.json", canonicalise(compiled.program), "utf8");
console.log(programHash(compiled.program));
```

**It must be the canonical text**, not text that merely parses to the same program. The hash you record a run against was taken over those exact bytes, so a pretty-printed copy is refused at load with OS6018. `canonicalise` in either library writes the one accepted spelling.

## A complete run

```python title="run_study.py"
"""Run a compiled OpenScript study over bars, in Python."""
import pathlib

from openscript.adapter.serving import Serving
from openscript.contracts import Bar, BarState
from openscript.run import load_text
from openscript.verify import capabilities

CLOSED = BarState(is_new=True, is_confirmed=True, is_realtime=False, updates=1.0)
MOVING = BarState(is_new=False, is_confirmed=False, is_realtime=True, updates=2.0)
INSTRUMENT = {"symbol": "NIFTY", "exchange": "NSE_INDEX", "timezone": "Asia/Kolkata", "tickSize": 0.05}

# The canonical text the compiler emitted, stored as data. Nothing here compiles.
text = pathlib.Path("program.json").read_text(encoding="utf-8")

library = Serving()
loaded = load_text(text, {"len": 2}, library, capabilities=capabilities())
if not loaded.ok:
    refused = loaded.diagnostic
    raise SystemExit(f"{refused.code} at {refused.line}:{refused.column}")
run = loaded.run

start = 1735703100000  # 1 January 2025, 09:15 IST, in UTC milliseconds
closes = [100.0, 102.0, 101.0, 105.0]
previous = None
for index, close in enumerate(closes):
    bar = Bar(time=float(start + index * 60000), open=close, high=close, low=close, close=close)
    library.at_bar({"high": bar.high, "low": bar.low, "close": bar.close,
                    "previousClose": previous, "volume": bar.volume,
                    "isSessionFirst": index == 0}, index == 0)
    result = run.execute_bar(index, bar, CLOSED, supplied=len(closes), instrument=INSTRUMENT)
    if not result.ok:
        raise SystemExit(f"bar {index}: {result.diagnostic.code}")
    print(index, result.columns, result.applied_channels)
    previous = close

# The newest bar is still moving: execute it twice at the same index.
for close in (106.0, 104.0):
    bar = Bar(time=float(start + 4 * 60000), open=close, high=close, low=close, close=close)
    library.at_bar({"high": close, "low": close, "close": close, "previousClose": previous,
                    "volume": bar.volume, "isSessionFirst": False}, False)
    result = run.execute_bar(4, bar, MOVING, supplied=5, instrument=INSTRUMENT)
    print("moving", close, result.columns, result.applied_channels)
```

```text
0 [None, None] [1]
1 [101.0, 'UP'] [1]
2 [101.5, None] [1]
3 [103.0, 'UP'] [1]
moving 106.0 [105.5, 'UP'] []
moving 104.0 [104.5, None] []
```

Column 0 is the plot and column 1 the marker. Bar 0 has no mean yet, so the plot is `None`: warmup is absence, not zero. The last line is the one to understand. The second execution of bar 4 gives the mean of 105 and 104, not of 106 and 104, because the engine rolled the bar back before running it again. And `applied_channels` is empty on both executions of that bar, because nobody has confirmed it: the marker is computed but not committed.

## Loading

```python
from openscript.run import load, load_text
```

`load_text(text, settings, library, limits, capabilities, read_time)` reads the canonical text and then does everything `load` does. `load(raw, ...)` takes a program object built in the same process, which never was text and has nothing to be canonical about. Both return a `LoadResult` with `.run`, `.diagnostic` and the property `.ok`; exactly one of the first two is `None`.

| Argument | What it is |
|---|---|
| `text` or `raw` | The canonical text, or the program object |
| `settings` | The stored input values, keyed by input key. `{}` or `None` runs the defaults |
| `library` | The library seam: a `Serving` instance, below. `None` is a library with nothing in it |
| `limits` | `openscript.budget.EngineLimits`. Leave the default, `DEFAULT_LIMITS`, unless you have a reason |
| `capabilities` | The capability tags this run serves, from `capabilities(...)` |
| `read_time` | How a written date becomes an instant, for a `time` input. Without it the date is read as UTC |

**The library is a seam, not an import.** The machine asks the library for its manifest at load and for each call during a bar. `Serving` from `openscript.adapter.serving` joins the engine's library tables to that seam. Build one per run: `Serving()` for a study, `Serving(ledger)` for a strategy.

**Capabilities are what this run serves.** A program needing a tag missing from the list is refused at load, naming it, rather than run with a hole in it. `capabilities()` gives the machine's own tags; `capabilities("orders")` adds the tag a strategy needs.

### When a load is refused

A Python `Diagnostic` carries `.code`, `.line`, `.column`, `.severity` and `.values`, and **no message text**. The wording lives in the error catalogue, the same JSON file the compiler and these pages are built from. It ships in the `openalgo-script` npm package as `node_modules/openalgo-script/spec/errors.json`; copy it beside your Python code. Look the code up there and fill in the values, or show the code and link it to the [Errors](/script/errors/overview) pages:

```python
import json
import pathlib
import re

# The error catalogue: the same file the compiler and these pages are built from.
CATALOGUE = {entry["code"]: entry
             for entry in json.loads(pathlib.Path("errors.json").read_text(encoding="utf-8"))["entries"]}

def sentence(diagnostic):
    """The catalogue's message and fix for a diagnostic, with its values filled in."""
    entry = CATALOGUE[diagnostic.code]
    fill = lambda match: str(diagnostic.values.get(match.group(1), match.group(0)))
    return re.sub(r"\{(\w+)\}", fill, entry["message"]), re.sub(r"\{(\w+)\}", fill, entry["fix"])
```

For `{"len": 0}` against an input declared `min = 1`, that gives "The host supplied 0 for len, and the minimum is 1." with its fix.

| What happened | Code |
|---|---|
| The program calls a function this engine's library does not hold | [OS6004](/script/errors/data#os6004) |
| The program needs a capability this run does not serve | [OS6006](/script/errors/data#os6006) |
| The text is not the canonical encoding, or the program fails verification | [OS6018](/script/errors/data#os6018) |
| A stored setting fails its input's rules | [OS6019](/script/errors/data#os6019) |
| The compiled format version, or the language version, is not one this engine has | [OS6016](/script/errors/data#os6016), [OS6017](/script/errors/data#os6017) |

Four of those mean "this engine does not have that" rather than "the program is wrong": OS6004, OS6006, OS6016 and OS6017, each naming the missing thing. A host that can fall back to another engine, such as the JavaScript engine in a Node.js worker, reads those four differently from the rest.

## What this engine runs, and what it refuses

The Python engine is built for strategies and for studies that produce numbers. It does not carry a chart's drawing surface, and in 0.5.0 some of the library is still missing from it. Each gap is refused at load, by name, never answered with an empty value:

| Script uses | In the Python engine |
|---|---|
| Plots, fills, levels, markers, bar colour, background, alerts | Run. The values arrive in the bar result |
| Orders, positions and the strategy ledger | Run, with `capabilities("orders")` and `Serving(ledger)` |
| User functions, loops, `var`, and array literals read by index | Run |
| Moving averages, oscillators and the other indicators, the maths, string and colour functions | Run |
| Array functions such as [[push()]], [[size()]], [[sort()]] and [[avg()]] | Refused: OS6004 naming the function |
| [[print()]] | Refused: OS6004 naming `print` |
| The `date` functions, such as [[date.hour()]] and [[date.dayOfWeek()]] | Refused: OS6004 naming the function |
| [[session.isIn()]], [[session.isLastBar]], [[chart.intervalMinutes]], [[chart.isIntraday]] | Refused: OS6004 naming the function |
| Drawing objects such as [[draw.line()]] | Refused: OS6006 naming `objects` |
| [[table()]] | Refused: OS6006 naming `tables` |
| [[req.timeframe()]] and [[req.symbol()]] | Refused: OS6006 naming the tag. The engine is handed no other bars |

Run a script that needs any of those on the JavaScript engine, which serves them all. `capabilities()` lists `arrays` even though the array functions are missing, so check a script against this table, or load it once, before you deploy it to a Python server.

## The bar cycle

```python
result = run.execute_bar(index, bar, state, supplied=None, instrument=None, now=ABSENT)
```

One call is one execution of one bar, all eleven steps of the bar cycle in order.

| Argument | What it means |
|---|---|
| `index` | Which bar, counting from 0. **The same index twice is a re-execution of that bar, not a new one** |
| `bar` | `Bar(time, open, high, low, close, volume, oi)`. `time` is the bar's open instant in UTC milliseconds. A price or volume you do not have is left absent, never zero and never carried forward |
| `state` | `BarState(is_new, is_confirmed, is_realtime, updates)`: the four facts only the side that built the bar knows |
| `supplied` | How many bars you have supplied. It decides [[bar.isLast]] and nothing else |
| `instrument` | The instrument record as a dictionary, the same fields as on [Host interface](/script/integrate/host-interface#instrument-facts). The `chart` namespace and tick rounding read it |
| `now` | The fixed value [[chart.now()]] answers. Absent unless you state one |

Three of those decide more than they look like they do:

- **`is_confirmed` decides whether markers, alerts and orders happen at all.** They apply only on a confirmed bar, unless the script declared `onUnconfirmed = true`. A condition that was true halfway through a bar and false at its close places no order.
- **`is_realtime` separates history from the bar in front of you**, and no engine can work it out. Alerts are raised only on a realtime bar, so a backtest that passes `False` throughout raises none, which is right for a backtest and wrong for a live runner that forgets to set it.
- **`supplied` left out makes every bar the last**, because the engine takes it as `index + 1`. That is what a realtime feed wants. A run over a dataset of known size passes the total.

### Before every execution: at_bar

`Serving.at_bar(facts, first)` states the facts a bar-reading library call needs and no call context carries. Call it before every execution:

| Fact | Value |
|---|---|
| `high`, `low`, `close` | This bar's prices |
| `previousClose` | The previous bar's close, `None` on the first bar |
| `volume` | This bar's volume, or absent |
| `isSessionFirst` | Whether this bar opens a trading session, by your own calendar. For NSE, the 09:15 IST bar |

The second argument is whether this is bar 0. **This is the one place a forgotten line produces a study that runs and is wrong.** A fact you do not state is absent, so a study built on it draws an empty line, [[trueRange()]] and everything built on it among them, and nothing says why.

### What comes back

| Field | Holds |
|---|---|
| `.index` | The bar this was |
| `.columns` | One value per channel, by channel index. `None` where nothing wrote the channel |
| `.applied_channels` | The deferred channels (markers and alert conditions) this execution committed. Empty on a bar that is not decided |
| `.applied` | The order calls a decided bar left behind, in the order the bar made them. Each has `.name`, `.arguments` and `.position` |
| `.alerts` | `Alert(key, title, message, bar, time)`, raised only on a decided realtime bar |
| `.diagnostic` | What stopped the bar, or `None`. Read `.ok` |

`.columns` always carries every channel, so a line redraws on every tick of a moving bar; `.applied_channels` says which of the marker and alert channels count. Draw the line, and commit the marker only when its channel is in `.applied_channels`.

**A bar that fails stops there.** Its later steps do not run, its result's `.columns` is empty, and `.diagnostic` has the code and position. The failure never escapes as an exception, so a process running many scripts gets a diagnostic about one of them and nothing else. The run is still loaded afterwards; whether a failed bar ends it is your decision.

## The bar that is still forming

A bar that has not closed is executed again every time its price changes, and the later execution must give what the first would have given had the bar arrived at that price once. The engine makes that true on one condition: **you pass the same index.**

On the first execution of bar `i` the engine records its state; on every later execution of the same index it restores that record first. Give each tick a new index instead and you have appended bars that never existed: every stateful call counts each tick as a bar, the history operator shifts, warmup ends early, and the study on the chart stops being the study a backtest computes. Nothing raises.

A `live var` in a script is the one exception, by design: it keeps its value across re-executions, and a script that uses one is not reproducible.

The same rollback is exposed for a re-execution the engine cannot see coming, such as a chart replay or a bar your feed corrected:

```python
mark = run.checkpoint()          # before executing bar k
...                              # bars k, k + 1, k + 2 executed
run.restore(mark)                # everything goes back
result = run.execute_bar(k, bar, state, supplied=total)
```

`restore` puts back every value cell, every library state region and every object under them in one copy, so two cells that held one array still hold one array. It leaves `live var` cells as they are now. A checkpoint is an in-process object for re-executing bars, not a saved run.

## Running a strategy

A strategy's orders are records, not calls. An order function in a script leaves a record and the engine does nothing with it; your host places the order, and learns what became of it from the frames your destination sends back. The strategy's position is folded from those frames by its own ledger. It is never read from the account, because an account position is shared with every other strategy and every manual trade on that contract.

The order of the moments between two bars is fixed:

1. Deliver every frame your destination sent since the last bar: `ledger.deliver(frame)`.
2. Fold them: `ledger.settle()`.
3. Execute the bar.
4. Place what the bar decided, from `result.applied`.

A driver that folded after the bar would let a script react inside the bar its own order was sent in, and one that folded during the bar would give two executions of a forming bar two different positions to read.

The strategy, compiled to `orb.json` the same way as above:

```openscript title="orb.os"
version 1
strategy("Opening range breakout", overlay = true, qty = 75, product = "intraday")

var rangeHigh = none
if session.isFirstBar
    rangeHigh = high

breakout = not isNone(rangeHigh) and close > rangeHigh
if breakout and pos.isFlat
    buy()

plot(rangeHigh, "Range high", orange)
```

```python title="run_strategy.py"
"""Run a compiled OpenScript strategy bar by bar, sending its orders through your own code."""
import pathlib

from openscript.adapter.ordering import options_for
from openscript.adapter.serving import Serving
from openscript.contracts import Bar, BarState
from openscript.run import load_text
from openscript.strategy import IntentBar, Ledger, OrderFrame
from openscript.verify import capabilities

INSTRUMENT = {"symbol": "NIFTY25JANFUT", "exchange": "NFO", "timezone": "Asia/Kolkata",
              "tickSize": 0.05, "lotSize": 75, "hasVolume": True,
              "session": {"start": "09:15", "end": "15:30", "days": [1, 2, 3, 4, 5]}}
CLOSED = BarState(is_new=True, is_confirmed=True, is_realtime=False, updates=1.0)

ledger = Ledger()                 # the strategy's own record of what it sent and what filled
library = Serving(ledger)         # the library, with the ledger behind every pos call
text = pathlib.Path("orb.json").read_text(encoding="utf-8")
loaded = load_text(text, {}, library, capabilities=capabilities("orders"))
if not loaded.ok:
    raise SystemExit(f"{loaded.diagnostic.code} at {loaded.diagnostic.line}:{loaded.diagnostic.column}")
run = loaded.run

# Size the ledger from the declaration, read through the run so input references are resolved.
declared = {name: run.declaration(("meta", "strategy", name))
            for name in ("qty", "qtyType", "product", "pyramiding", "capital")}
ledger.options = options_for(declared, INSTRUMENT)

start = 1735703100000  # 1 January 2025, 09:15 IST
bars = [Bar(time=float(start + i * 300000), open=23500.0 + i, high=23510.0 + i * 3,
            low=23490.0 + i, close=23505.0 + i * 3, volume=1000.0) for i in range(8)]

waiting = []     # frames your destination sent since the last bar
previous = None
for index, bar in enumerate(bars):
    # 1 and 2. Deliver what arrived since the last bar, then fold it.
    for frame in waiting:
        ledger.deliver(frame)
    ledger.settle()
    waiting = []

    # 3. Execute the bar.
    library.at_bar({"high": bar.high, "low": bar.low, "close": bar.close,
                    "previousClose": previous, "volume": bar.volume,
                    "isSessionFirst": index == 0}, index == 0)
    result = run.execute_bar(index, bar, CLOSED, supplied=len(bars), instrument=INSTRUMENT)
    if not result.ok:
        raise SystemExit(f"bar {index}: {result.diagnostic.code}")

    # 4. Place what the bar decided.
    appended = len(ledger.rows())
    for effect in result.applied:
        placed = ledger.place(effect.name, effect.arguments,
                              IntentBar(index=index, time=bar.time), effect.position)
        if placed.refusal is not None:
            ledger.discard(appended)   # a refusal takes back everything this bar appended
            break
        for intent in placed.intents:
            print("send", intent.intent_id, intent.side, intent.qty, intent.qty_type, intent.instrument.symbol)
            # Stand-in for your order path: fill at once. A real destination answers later.
            waiting.append(OrderFrame(intent_id=intent.intent_id, status="filled",
                                      filled_qty=intent.qty, avg_fill_price=bar.close,
                                      order_ref=f"R{intent.intent_id}", time=bar.time))
    print(index, "position", ledger.size())
    previous = bar.close
```

The breakout fires on bar 2, the order is sent after that bar closes, the fill is folded before bar 3, and the position reads 75 from bar 3 on: one lot of the NIFTY future, stated in units.

**The ledger must be in the library.** `Serving(ledger)` is what serves the `pos` namespace and the order calls. Built without one, a strategy is refused at load naming the first position or order call it makes (OS6004), rather than running as a study that quietly trades nothing.

**Size the ledger from the declaration through the run.** A declaration may state its quantity or capital with an `input()`, so read each field with `run.declaration(...)`, which resolves the input, rather than off the raw program. `options_for` turns that and the instrument record into the ledger's options before bar 0.

**An intent carries its unit.** `intent.qty` is counted in `intent.qty_type`, as the script declared it, and is never multiplied by a lot size here: the lot is your venue's fact and your symbology is yours, so an engine converting it would send a quantity nobody asked for. Each intent also carries `.intent_id`, `.kind`, `.side`, `.order_type`, `.tag`, `.instrument`, `.product` and `.bar`.

**Frames are cumulative.** Every `OrderFrame` restates the whole life of one order: `intent_id`, `status`, the total `filled_qty` so far, the `avg_fill_price` of all of it, and optionally `order_ref`, `sent_instrument`, `sent_product`, `time` and `text`. A repeated frame, two frames that crossed in flight and a reconnecting session that resends its last frames are therefore harmless. A partial fill is a `working` frame with a non-zero `filled_qty`. The fold, the status words and what a host must report are on [Host interface](/script/integrate/host-interface#orders).

What a run made in money is not the ledger's job. The report is folded from the fills after the fact, so a stored run can be reported again with no engine present; the JavaScript [backtest](/script/integrate/backtesting-api) is where that report comes from today.

## What the engine leaves to you

- **Scheduling.** Nothing here calls `execute_bar`. When a run starts and stops, and what an exchange calendar says about today, are yours. The engine has no clock of its own.
- **Process isolation.** A run is an object in your process. The engine never lets a script's failure escape and stops a runaway loop, but a run occupies its worker until it returns. Run one strategy per process, and decide what happens when one dies.
- **Persistence.** A run holds its state in memory and writes nothing. A process that restarts loads the program again and executes the bars again from the beginning.
- **Data.** Bars exist because you supply them, one at a time and in order.
- **The destination.** An intent leaves through your code and a frame arrives through `ledger.deliver`, which is the only way in. The engine knows no broker and hands a symbol back exactly as it received it.
- **The compiler and the chart.** Compile with the JavaScript library; draw with the [chart adapter](/script/integrate/charts-adapter).

## The conformance adapter

The package is also a command line, the adapter the [conformance suite](/script/integrate/conformance) runs it through:

```bash
python -m openscript --describe
python -m openscript <case-directory>
python -m openscript --actual <case-directory>
```

```json
{"engineOnly":true,"languageVersions":[1],"name":"openscript","profile":"strategy","schemaVersion":"1.1","version":"0.5.0"}
```

`--describe` states what the engine claims. The other two run one case directory and read one JSON object on standard input, `{"program": "<the canonical program text>"}`, because the engine has no compiler to turn the case's `script.os` into a program itself: the first compares against the case's expected files, the second prints what the engine computed so two engines can be compared directly.

**Related.** [Two libraries](/script/integrate/overview), [JavaScript library](/script/integrate/javascript), [Compiled program](/script/integrate/compiled-program), [Host interface](/script/integrate/host-interface), [Backtesting API](/script/integrate/backtesting-api), [Your own engine](/script/integrate/conformance), [Sandbox and live](/script/strategies/sandbox-and-live)
