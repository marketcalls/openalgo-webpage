---
title: Your own engine
description: Write an OpenScript engine in your own language from the compiled program format, check its arithmetic against the published library vectors, and hold it to the conformance suite so its numbers match every other engine to the last bit.
---

This page is for a platform that will not run somebody else's interpreter in its hot path, which is a reasonable position. Because a compiled program is data rather than code, there is a format to implement instead of a runtime to embed, and an engine for it can be written in whatever language your infrastructure already speaks. This page covers what you implement, what you do not, how the conformance suite proves your engine agrees with every other one, and what a passing result does and does not let you claim.

A conforming engine is one that passes the suite. There is no other definition: reading the specification carefully is not one.

## What you implement, and what you do not

| You implement | Where it is specified | How hard |
|---|---|---|
| The instruction set: the program's shape, the machine, forty-one instructions, the bar cycle, rollback, absence, determinism and versioning | The compiled program specification. [Compiled program](/script/integrate/compiled-program) is the tour | Mechanical once read |
| The standard library, each function in its specified accumulation order | The standard library specification, checked against the published vectors below | Careful work |
| The strategy runtime: the ledger, the fold of order frames, protective levels and the order they are evaluated in | The standard library specification's strategy sections, and [Host interface](/script/integrate/host-interface#orders) | The hard part |

**You do not implement the compiler.** You consume compiled programs and never parse OpenScript. The language can gain syntax without you changing anything, because the format is the contract and it has its own version, which moves far more slowly than the language. The [Python engine](/script/integrate/python-engine) is built exactly this way: it has no compiler and runs programs the JavaScript library emitted.

The specification lives in the project's repository, [github.com/marketcalls/openscript](https://github.com/marketcalls/openscript), beside the suite. It is written to be implementable from the documents alone. Where two competent implementers could reasonably choose differently, that is a defect in the documents, and the project wants to hear about it while there is still time to fix it.

**Roughly what it costs.** Weeks, not days, and most of it is the strategy runtime. Budget for the suite finding things: a first run that passes everything usually means the suite was not wired up correctly.

### The two mistakes that lose money

A wrong instruction draws a wrong line. A wrong strategy runtime loses money, silently and only in production. Two hazards catch almost everyone:

- **Frames are cumulative, not deltas.** A destination reports an order as a running total, and the same frame can arrive twice or out of order. Folding a repeat as a new fill double counts a position.
- **A fill can arrive after a terminal status.** A cancellation races a fill and the destination acknowledges the cancellation first. An engine that treats a terminal order as closed forever loses that fill, and the account holds a position the strategy does not know it has. Everything after that is confidently wrong: the ledger, the profit and loss, the protective levels, and the exit that will never be sent.

Each of these has more than one defensible answer, and only one of them is the answer every engine shares. Follow the specification exactly rather than reasoning from first principles.

### Arithmetic is part of the contract

Every operation is IEEE-754 binary64 with round-to-nearest-even, in the order the instructions give. Do not reassociate, fuse a multiply and an add, use extended precision, flush subnormals to zero or vectorise a sum into a different order. Where a formula can be written two ways, the standard library documents fix which one, because arithmetic that is mathematically equal is not numerically equal, and your users will find the difference before you do. A library function's result is defined by its specified accumulation order: an incremental rolling sum is not bit-identical to a fresh sum over the window, and is allowed only where the specification defines it.

## Check your library against the vectors first

Before a single case, you can check each library function on its own. The repository publishes a **vector file** for each arithmetic function, in its `spec/vectors/library` folder: a file of inputs and the exact outputs the reference engine produced for them, named by the function and its argument count, such as `sma-2.json`. An `index.json` beside them lists every file, and every function that has none and why: colours, strings, array operations, drawing calls, host and ledger reads and the calendar functions are checked other ways, and [[pow()]] is held out because its last bit comes from the platform's maths library.

Every number in a vector file is a binary64 bit pattern: sixteen lower case hexadecimal digits, big-endian. A case is a run of `bars` bars with one column per argument and one per output; a cell is `null` for absent, and each output column's `warmup` is the index of its first bar with a value. The `holes`, `short` and `absent-args` cases check what a function does with a gap, too little history and an argument that has no value yet.

```python title="vectors.py"
"""Check a moving average written in another codebase against the published vectors, bit for bit."""
import json
import pathlib
import struct

def decode(cell):
    """A cell is null (absent) or sixteen hex digits: the binary64 bits, big-endian."""
    return None if cell is None else struct.unpack(">d", bytes.fromhex(cell))[0]

def bits(value):
    return None if value is None else struct.pack(">d", value).hex()

def my_sma(window, length):
    """Your implementation. The specified order: oldest to newest, then divide."""
    if len(window) < length or any(v is None for v in window[-length:]):
        return None
    total = 0.0
    for v in window[-length:]:
        total += v
    return total / length

vectors = json.loads(pathlib.Path("sma-2.json").read_text(encoding="utf-8"))
for case in vectors["cases"]:
    if case["gaps"]:
        continue  # reaches an open gap in the specification: not held to it
    src = [decode(c) for c in case["args"][0]["values"]]
    lengths = [decode(c) for c in case["args"][1]["values"]]
    expected = case["outputs"][0]["values"]
    for i in range(case["bars"]):
        got = my_sma(src[: i + 1], int(lengths[i])) if lengths[i] is not None else None
        if bits(got) != expected[i]:
            print(f"{case['id']}: bar {i} expected {expected[i]}, got {bits(got)}")
            break
    else:
        print(f"{case['id']}: all {case['bars']} bars match")
```

Run against the published `sma-2.json`, it prints a line such as `full-0: all 80 bars match` for each of the seven cases. Compare bit patterns, never floats. A case whose `gaps` list is not empty reaches a part of the specification that fixes no answer yet, and you are not held to it.

## The conformance suite

The suite is a directory of cases. A case is a script, its input bars and the expected output, with a stated comparison rule so that "matches" means something exact. It tests two things and keeps them apart: **a compiler** (source in, diagnostics or a program out) and **an engine** (a program and bars in, output out). An engine with no compiler runs the engine half and says so.

It does not test speed, memory, the look of a chart or the wording of a message.

### A case on disk

One case is one directory, and every byte of its input is in it. A case never names a symbol for a runner to fetch, never reads a date range from anywhere, never opens a network connection and never reads the clock, which is why it reproduces on a laptop with no connection, on a build machine in another country, and in five years.

```text
cases/
  order/
    buy/
      case.json
      script.os
      bars.csv
      instrument.json
      backtest.json
      frames.csv
      expected.json
      notes.md
```

| File | Required | Holds |
|---|---|---|
| `case.json` | Yes | What the case is, what it asserts, and any tolerance |
| `script.os` | Yes | The source text, always under this name |
| `bars.csv` | For an engine case | The input bars, in full |
| `expected.csv` | For per-bar values | One column per asserted channel, one row per bar |
| `expected.json` | For everything else | Diagnostics, drawings, tables, orders, trades, the performance summary, log lines |
| `instrument.json` | No | The instrument record. Defaults below |
| `settings.json` | No | Values for the script's inputs. Absent means every default |
| `backtest.json` | For a strategy case | The money digits, a supplied charge schedule and the report window |
| `bars.<name>.csv` | No | A second bar series, for a read of another timeframe or instrument |
| `ticks.csv` | No | Updates inside the newest bar, for a case about the forming bar |
| `frames.csv` | No | Order frames delivered between bars, for a case about the ledger |
| `notes.md` | No | Why the case exists and what it defends against |

A runner reads no other file.

```json title="case.json"
{
  "id": "order/buy",
  "category": "strategy",
  "profile": "strategy",
  "languageVersion": 1,
  "description": "A strategy that enters long with buy on a crossing of two averages, sized from the distance to its stop, and flattens with close on the crossing back produces the recorded ledger, trades and summary.",
  "asserts": ["diagnostics", "orders", "trades", "performance"],
  "tolerance": { "abs": 0, "rel": 0, "reason": null }
}
```

| Field | Means |
|---|---|
| `id` | The directory path, repeated so a moved directory is caught |
| `category` | One of the categories below |
| `profile` | `core`, `chart` or `strategy` |
| `languageVersion` | The version the script compiles under, always pinned |
| `description` | One sentence, printed when the case fails |
| `asserts` | The channels it checks: any of `diagnostics`, `values`, `markers`, `fills`, `levels`, `barColors`, `background`, `table`, `drawings`, `alerts`, `orders`, `trades`, `performance`, `log` |
| `now` | The fixed value of [[chart.now()]], required when the script calls it |
| `tolerance` | The comparison rule below. Absent means exact |

A case asserts only the channels it names, so a change to drawings cannot break a case about absence, and the case that does fail points at what changed.

### The input files

`bars.csv` has a header and one row per bar, oldest first: `time` is the open time in UTC milliseconds, strictly increasing; prices are written in the shortest decimal that reads back to the intended binary64 value; an absent price or volume is written `none`; and an extra column is an error, so a typo in a header cannot silently drop an input.

```text title="bars.csv"
time,open,high,low,close,volume
1748736000000,99.7,101.1,98.8,100,1000
1748739600000,101.08,102.48,100.18,101.38,1025
```

Without an `instrument.json`, a case runs under these deliberately boring defaults, so a case about something else is not accidentally about sessions:

```json
{
  "symbol": "TEST", "exchange": "TEST", "interval": "60", "timezone": "UTC",
  "tickSize": 0.01, "lotSize": 1, "hasVolume": true,
  "session": { "start": "00:00", "end": "24:00", "days": [1, 2, 3, 4, 5, 6, 7] }
}
```

`frames.csv` supplies order frames the way `bars.csv` supplies bars, so a case asserts the fold against input no engine chose. `afterBar` is the bar after whose execution the frame arrives, folded before the next one. `intent` is an ordinal, 1 for the first order the run placed, which the runner maps to your engine's own ids. `filledQty` is cumulative. This file illustrates the format; it is not one of the shipped cases:

```text title="frames.csv"
afterBar,intent,status,filledQty,avgFillPrice,orderRef,text,time
0,1,working,0,none,R1,,1735689600500
1,1,filled,25,101.5,R1,,1735693200750
1,1,filled,25,101.5,R1,,1735693200750
2,1,filled,40,101.75,R1,,none
```

Those four rows are a working frame, a fill, the same fill repeated, and a quantity that rose after the order had ended, which are exactly the two hazards above.

`backtest.json` holds what a strategy's report was folded under and the script never states: the money `digits`, the charge schedule the host supplied (or `null` for the script's own), and the report `range`. It is required of every strategy case, because a digit count nobody stated is a figure two engines round differently.

```json title="backtest.json"
{ "digits": 2, "costs": null, "range": { "from": null, "to": null } }
```

### The expected files

`expected.csv` holds per-bar values, one row per input bar. No shipped case asserts per-bar values yet, so this excerpt illustrates the format, with rows 2 to 18 left out:

```text title="expected.csv"
bar,ema20,signal
0,none,
1,none,
19,100.4375,
20,100.6390625,BUY
```

`bar` repeats the row index so a dropped row is caught where it was dropped. An absent value is `none`, never an empty field; an empty field means an event channel produced nothing on that bar. Numbers are the shortest decimal that reads back exactly, never rounded for readability, and a colour is `#rrggbbaa` in lower case.

`expected.json` holds ordered lists of flat objects. A diagnostic is compared on its `code`, `line`, `column` and `severity` only, never its wording, so the catalogue can keep improving its messages. An order is a ledger row compared on the fields the case names. `performance` is one flat object of summary figures, each defined by an exact formula over the trades, the bar closes and the run's capital, point value, currency, digits and window, including where the honest answer is not a number: `winRate`, `profitFactor`, `averageBarsHeld`, `maxDrawdownAt` and `maxRunUpAt` are `null` rather than zero when there is nothing to divide by or nothing happened.

### Categories and profiles

| Category | Needs a compiler | Asserts |
|---|---|---|
| `lexical`, `syntax`, `static` | Yes | Diagnostics from tokenising, parsing and checking |
| `warning` | Yes | A warning, and that compilation still succeeded |
| `rejection` | Yes | That something is refused, with a given code |
| `semantics` | No | Per-bar values: persistence, scope, control flow, absence |
| `numerics` | No | Per-bar values against an independently written reference |
| `surface` | No | Markers, fills, levels, bar colours, backgrounds, tables, drawing objects |
| `time` | No | Values derived from time, sessions and instrument facts |
| `external` | No | Reads of another timeframe or instrument, served from case files |
| `intrabar` | No | Output after the forming bar is replayed from `ticks.csv` |
| `strategy` | No | Orders, fills, position, trades and performance |
| `runtime` | No | A raised error and the bar it was raised on |
| `limits` | No | Behaviour at and past a declared limit |
| `program` | No | The compiled program itself, round tripped |
| `log` | No | The log stream |

| Profile | Covers | Lets you claim |
|---|---|---|
| `core` | The compiler categories, `semantics`, `numerics`, `runtime`, `limits`, `log`, `program` | Compiles and runs the language with correct numbers |
| `chart` | `core`, plus `surface`, `time` and `external` | Also produces everything a chart draws |
| `strategy` | `chart`, plus `strategy` | Also places orders and produces a backtest report |

Profiles are cumulative. An engine with no compiler reports itself `engineOnly` beside its profile and is not handed the compiler categories. A case outside your claimed profile is skipped, and a skipped case is never a pass.

**Some calls carry no cross-engine guarantee yet.** The transcendental functions, `exp`, `log`, `log10`, `log2`, `pow`, `hypot` and the trigonometric family, and the indicators built on them, [[alma()]], [[hv()]] and [[chop()]], have no portable reference algorithm written down. No case may assert a value that reaches one, and an engine is told plainly which calls those are.

## Running the suite

The suite and its runner are in the project's repository:

```bash
git clone https://github.com/marketcalls/openscript
cd openscript
npm install
npm run build

# Your engine against the expected files, writing the result document to a file
node scripts/run-suite.mjs --adapter path/to/your-adapter.mjs --out result.json

# Your engine against the reference engine, case by case, exactly
node scripts/run-suite.mjs --against path/to/your-adapter.mjs
```

`--cases <dir>` walks another suite root and `--timeout <ms>` bounds one invocation. The one-line summary goes to standard error, so standard output is the result document and nothing else. The exit code is the verdict.

### Your adapter

Your engine takes part through an **adapter**: a program the runner starts once per case, never once for the whole suite, so a crash or a hang costs one case rather than every result. It answers three invocations, each with one JSON object on standard output:

| Invocation | Writes |
|---|---|
| `adapter --describe` | Your engine's identity: `name`, `version`, `profile`, `languageVersions` and `schemaVersion` |
| `adapter <case-directory>` | One case result: its outcome and, on a failure, the first difference |
| `adapter --actual <case-directory>` | What your engine computed for the channels the case asserts, with no comparison, so the runner can compare two engines itself |

The runner starts every adapter with Node.js, so an engine in another language ships a small JavaScript file that starts the real engine and relays its output. The Python engine does exactly that, and compiles `script.os` with the reference compiler on the way, handing the engine the canonical program text on standard input:

```json
{"engineOnly":true,"languageVersions":[1],"name":"openscript","profile":"strategy","schemaVersion":"1.1","version":"0.5.0"}
```

### Comparing numbers

**A comparison is bit-exact unless the case declares otherwise.** Two correct engines computing the same expression over the same inputs, under the arithmetic rules above, have no licence to differ by one bit.

```text
compare(actual, expected, abs, rel):
    1. expected absent and actual absent          -> pass
    2. exactly one of them absent                 -> fail
    3. actual is not a finite number              -> fail (reported as nonFinite)
    4. normalise negative zero to zero on both sides
    5. identical binary64 bits                    -> pass
    6. abs == 0 and rel == 0                      -> fail
    7. |actual - expected| <= max(abs, rel * |expected|) -> pass
    8. otherwise                                  -> fail
```

Absence is compared first and never numerically: a value one bar early is a defect however small it is. A tolerance uses `max`, not a sum, so exactly one bound is in force at any magnitude and a failure can name which it broke. A case that needs slack declares it with a `reason`, which is required whenever a bound is not zero, and the suite caps any tolerance at a relative `1e-9` and an absolute `1e-12`. When two engines are compared against each other the tolerance is always zero, whatever the case says: a tolerance exists only to absorb an outside reference's different accumulation order.

Strings compare as exact sequences of code points, colours channel by channel as bytes, times as exact integers, and ordered lists by length first and then element by element.

### Outcomes and the result document

| Outcome | Means |
|---|---|
| `pass` | Every asserted channel matched |
| `fail` | A channel did not match. The first difference is reported: channel, column, bar, expected, actual and the bound it broke |
| `nonFinite` | The engine produced infinity or not-a-number, which is always a defect |
| `error` | The case could not be run: a crash, a hang, a timeout, or a malformed case |
| `unsupported` | The engine does not implement the feature, which it names |
| `skipped` | The case is outside the claimed profile. Never a pass |

A run with any `fail`, `nonFinite`, `error`, or `unsupported` inside the claimed profile does not pass. The result document records the suite revision, your engine's identity, the platform the runner ran on, one row per case and a summary. The rows below show the three shapes a row takes; the second and third are illustrations, since no shipped case asserts an indicator value or a drawing yet:

```json
{
  "suiteRevision": "0.5.0",
  "engine": { "name": "my-engine", "version": "1.0.0", "profile": "strategy" },
  "languageVersions": [1],
  "schemaVersion": "1.1",
  "platform": "(operating system, processor and runtime version)",
  "startedAt": 1735689600000,
  "cases": [
    { "id": "order/buy", "outcome": "pass", "durationMs": 41 },
    {
      "id": "ta/momentum/rsi", "outcome": "fail", "channel": "values", "column": "rsi14", "bar": 41,
      "expected": "68.21847374634196", "actual": "68.21847374634194", "bound": "exact", "difference": "1.4210854715202004e-14"
    },
    { "id": "draw/polyline", "outcome": "unsupported", "feature": "draw.polyline" }
  ],
  "summary": { "total": 3, "pass": 1, "fail": 1, "nonFinite": 0, "error": 0, "unsupported": 1, "skipped": 0 }
}
```

The failing row is the shape to expect: two values one unit apart in the last bit, which a tolerance would have hidden, and which is exactly the disagreement the suite exists to find. `bound` names what the failure broke: `exact` for a case with no tolerance, `abs` or `rel` for one that declares a bound, and `absence` when one side was absent.

## Two engines disagreeing is a release blocker

A backtest that disagrees with the chart is worthless, and so is the chart. So a disagreement between two engines stops a release: it becomes a defect report naming both engines and the first differing bar, somebody decides which engine is right **by reading the specification**, not by preferring the engine written first, and if the specification does not decide it, the specification is fixed first and the engine second. A case reproducing the disagreement is then added.

**A case is never edited to make an engine pass.** The legitimate responses to a failure are to fix the engine, to fix the specification and then the engine, or to show with a reviewed explanation that the case itself was wrong. Loosening a tolerance is not on the list. Cases are added over time and practically never removed, so a result names the suite revision it was run against.

## Harvesting a case from a run

A strategy case is harvested from a real run, not written by hand, so it asserts what an engine did over bars that existed rather than what somebody believed a run does. `caseFilesFrom` turns a [backtest](/script/integrate/backtesting-api) record into the files of a case, returning their text and writing nothing:

```js title="harvest.mjs"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { backtest, settingsFor, caseFilesFrom } from "openalgo-script";
import { compile } from "./compile.mjs";
import { sampleBars } from "./bars.mjs";

// The costed EMA cross, its bars and its contract, from Backtesting API.
const { program, file } = compile("ema-cross-costed.os", readFileSync("ema-cross-costed.os", "utf8"));
const contract = { symbol: "SBIN", exchange: "NSE", currency: "INR", tickSize: 0.05, lotSize: 1, pointValue: 1, digits: 2 };

const result = backtest(program, sampleBars(), settingsFor(contract), {
  sourceText: file.text, // required: a case holds script.os
  instrument: { interval: "5", timezone: "Asia/Kolkata", hasVolume: true, // hasVolume is required too
                session: { start: "09:15", end: "15:30", days: [1, 2, 3, 4, 5] } },
});
const made = caseFilesFrom(result.record, {
  id: "strategy/ema-cross-costed",
  description: "An EMA cross on NSE 5 minute bars produces the recorded ledger, trades and summary.",
});
if (!made.ok) throw new Error(made.reason);

const dir = "cases/strategy/ema-cross-costed";
mkdirSync(dir, { recursive: true });
for (const [name, text] of Object.entries(made.files)) {
  writeFileSync(`${dir}/${name}`, text); // case.json, script.os, bars.csv, expected.json, ...
}
```

A record can become a case only when it carries the script's own text, checked against the program's source hash, and the instrument record including `hasVolume`. A record that cannot make a whole case makes none: a directory missing one file would fail on an engine that did nothing wrong.

## What a passing result means

**It means** that at suite revision R, your engine at version V ran every case in profile P and produced the recorded output for all of them, at the tolerances the cases declare, with no network and no clock, and that anyone can rerun the same revision against the same build and get the same report. That is a strong claim: your engine agrees with every other passing engine on everything the suite covers, to the bit.

**It does not mean** correctness on anything the suite does not cover; correctness in any financial sense, since engines that follow a specification together are wrong together; robustness against hostile input; performance; security, which depends on your isolation rather than your arithmetic; fitness for trading real money; an endorsement, since the project certifies nobody; or anything about another revision or another profile.

A conformance badge carries four things and is not valid without all four: the engine and its version, the suite revision, the profile, and a link to the published result document.

## Where the suite stands

Stated plainly, because a green run reads as wide as the reader imagines it:

- **What it reaches today:** the compiler's diagnostics from tokenising, parsing and checking; the runtime errors; behaviour at a declared limit; and strategies, through their ledger, trades and performance summary, including partial fills, rejections, cancellations, expiries and a fill after a terminal status.
- **What it does not reach yet:** no case asserts a per-bar indicator value, so the `semantics` and `numerics` categories are specified but not yet exercised. Two engines can agree on every case and still disagree on what a moving average is, which is why the library vectors above matter. No case yet supplies a host's own charge schedule, a repeated frame or two frames in the wrong order, more than one entry in a direction, or more than one instrument.
- **Who has run it:** the JavaScript and Python engines agree to the last bit on every case they both run, and the build stops on any disagreement. The Python engine has no compiler, so the compiler cases are skipped for it, and the cases the two share are the strategy cases plus those about loops, limits and stored settings. It also lacks the array functions and the log, and cases that would reach those are held back until it has them, so its agreement does not cover them. Both engines were written in the same repository, so their agreement is evidence about that repository rather than about the specification. **No engine written by anyone else has passed the suite yet.** If you are building one, the project would rather work with you than have you find the gaps alone.

**Related.** [Compiled program](/script/integrate/compiled-program), [Host interface](/script/integrate/host-interface), [Python engine](/script/integrate/python-engine), [Backtesting API](/script/integrate/backtesting-api), [Two libraries](/script/integrate/overview), [Testing](/script/writing/testing)
