---
title: Compiled program
description: The versioned data format the OpenScript compiler emits and every engine runs, a list of instructions plus the tables that describe a study, and why nothing in the system ever turns text into code.
---

The compiler does not produce JavaScript or Python. It produces a **compiled program**: one plain data object holding a list of instructions and the tables an engine needs, in a documented, versioned format. Every engine, the JavaScript library, the Python engine and any engine you write, runs a script by walking that list one bar at a time. This page describes the format for anyone who stores programs, moves them between machines, reads them for a debugger, or implements an engine.

You do not need this page to use the libraries. You need it to understand what you are storing, why a program is safe to run from an untrusted author, and what an engine of your own must do.

## A script and its program

```openscript title="two-bar-mean.os"
version 1
study("Two bar mean", overlay = true)

len = input(2, "Length", min = 1)
mean = sma(close, len)
var hits = 0

if close > mean
    hits = hits + 1
    signal("UP")

plot(mean, "Mean", aqua)
```

The compiler turns that into this program, shown laid out for reading:

```json
{
  "openscript": { "format": "1.1", "language": 1 },
  "requires": ["core.1"],
  "compiler": { "name": "openscript", "version": "0.5.0" },
  "source": {
    "hash": "sha256:b17e0f0cb4173846316ce2c59f7ee22ce1f7b031eaca75e27596dd4456b2a493",
    "lines": 13,
    "file": "two-bar-mean.os"
  },
  "meta": {
    "kind": "study", "title": "Two bar mean", "short": "Two bar mean",
    "overlay": true, "precision": 4, "format": "price", "range": null,
    "scale": "right", "group": "", "onUnconfirmed": false
  },
  "limits": { "loops": 2000000, "history": null },
  "lib": {
    "manifest": 1,
    "functions": [{ "name": "sma", "arity": 2, "state": true, "effect": "none" }]
  },
  "inputs": [
    {
      "key": "len", "kind": "number", "label": "Length", "default": ["n", 2],
      "min": 1, "max": null, "step": null, "options": null,
      "group": "", "tooltip": null, "slot": 0
    }
  ],
  "channels": [
    { "id": 0, "type": "number", "defer": false, "once": true },
    { "id": 1, "type": "string", "defer": true, "once": false }
  ],
  "outputs": {
    "plots": [
      {
        "key": "p0", "title": "Mean", "type": "line", "channel": 0,
        "color": [0, 255, 255, 1], "colorChannel": null, "width": 1.5,
        "lineStyle": "solid", "offset": 0, "overlay": null, "scale": "right",
        "precision": null, "priceFormat": null, "ohlc": null
      }
    ],
    "fills": [],
    "levels": [],
    "markers": [
      { "key": "m0", "channel": 1, "position": "above", "shape": "label", "color": null, "textColor": null }
    ],
    "tables": [],
    "alerts": [],
    "barColor": null,
    "background": null
  },
  "consts": [["z", null], ["b", false], ["b", true], ["n", 0], ["n", 1], ["s", "UP"]],
  "series": [{ "id": 0, "kind": "bar", "field": "close", "name": "close" }],
  "frame": { "slots": 2 },
  "cells": [{ "id": 0, "kind": "var", "name": "hits" }],
  "states": [{ "id": 0, "fn": 0 }],
  "functions": [],
  "callSites": [],
  "loops": [],
  "code": [
    ["SLOAD", 0], ["LOAD", 0], ["CALL_LIB", 0, 2, 0], ["STORE", 1],
    ["CELL_INIT", 0, 7], ["CONST", 3], ["STOREC", 0],
    ["SLOAD", 0], ["LOAD", 1], ["GT"], ["JUMP_FALSE", 17],
    ["LOADC", 0], ["CONST", 4], ["ADD"], ["STOREC", 0],
    ["CONST", 5], ["EMIT", 1],
    ["LOAD", 1], ["EMIT", 0],
    ["HALT"]
  ],
  "requests": [],
  "debug": {
    "pos": [[0, 5, 12], [1, 5, 19], [2, 5, 8], [3, 5, 1], [4, 6, 1], [5, 6, 12], [6, 6, 1], [7, 8, 4], [8, 8, 12], [9, 8, 10], [10, 8, 1], [11, 9, 12], [12, 9, 19], [13, 9, 17], [14, 9, 5], [15, 10, 12], [16, 10, 5], [17, 12, 6], [18, 12, 1]],
    "fnPos": [],
    "names": { "slots": ["len", "mean"], "cells": ["hits"], "series": ["close"], "channels": ["Mean", "UP"] },
    "retain": false
  }
}
```

Read back against the source, the instruction list is the script line by line:

```text
 0  SLOAD 0            line 5   push close
 1  LOAD 0                      push len, which the engine wrote into slot 0 before the bar
 2  CALL_LIB 0, 2, 0            sma(close, len), 2 arguments, using state region 0
 3  STORE 1                     mean
 4  CELL_INIT 0, 7     line 6   var hits: first bar only, otherwise jump to 7
 5  CONST 3                     0
 6  STOREC 0                    hits = 0
 7  SLOAD 0            line 8   close
 8  LOAD 1                      mean
 9  GT                          close > mean
10  JUMP_FALSE 17               absent or false: skip the branch
11  LOADC 0            line 9   hits
12  CONST 4                     1
13  ADD
14  STOREC 0                    hits = hits + 1
15  CONST 5            line 10  "UP"
16  EMIT 1                      the marker channel
17  LOAD 1             line 12  mean
18  EMIT 0                      the plot channel
19  HALT
```

There is no instruction for [[input()]]: the engine writes the input's value into its slot before each bar. There is no instruction for `study()` or for the plot's declaration either: both are tables read once, before the first bar. And there is no warmup anywhere. On bar 0, `sma` has seen one value of the two it needs and returns absent, the comparison with an absent value is absent, and the branch is not taken. The line starts on the bar its value stops being absent.

## Why data and not code

A compiled program is a list of instructions an engine walks, and nothing in the system evaluates text: no `eval`, no function built from a string, no generated source loaded anywhere. That one decision is where the platform properties come from:

- **It runs under a strict content security policy.** A browser needs no `unsafe-eval`, and a security team has nothing to approve.
- **A script cannot reach anything.** It can only do what the instruction set exposes. There is no instruction for the network, the file system or the process around it, so a script shared by a stranger can draw a wrong line and nothing more.
- **The budgets are real.** The engine owns the loop, so the loop budget and the memory and time limits are counters inside it rather than hopes about a script's behaviour.
- **An engine needs no compiler.** Its core is a loop over forty-one instructions, not a second implementation of the language, so it can be written in any language a platform already uses. The standard library and the strategy runtime are the larger part of the work; [Your own engine](/script/integrate/conformance) sizes it.
- **Programs are cacheable and portable.** Compile once, store the result, run it in a browser today and on a server tomorrow.

## The top level

A program is one object with these fields. An empty table is written as an empty array, never left out.

| Field | Holds |
|---|---|
| `openscript` | The compiled format version and the language version |
| `requires` | The capability tags an engine must have |
| `compiler` | Who emitted it, for a bug report. An engine never reads it |
| `source` | The source hash, the line count and the file name |
| `meta` | The declaration: study or strategy, and every option |
| `limits` | The loop budget per bar and the retained history depth |
| `lib` | The library functions the program calls, in first-use order |
| `inputs` | One entry per `input()`, in source order |
| `channels` | The per-bar output channels |
| `outputs` | Plots, fills, levels, markers, tables, alerts, bar colour and background |
| `consts` | The constant pool |
| `series` | The series registers: every value whose history the program reads |
| `frame`, `cells`, `states` | Slot count, persistent `var` cells, and library state regions |
| `functions`, `callSites` | User function bodies, and one entry per distinct call path |
| `loops` | One entry per loop, so a spent budget can name the loop's line |
| `code` | The per-bar instruction list, ending in `HALT` |
| `requests` | Reads of another timeframe or instrument |
| `debug` | Source positions for every instruction, and the names of slots, cells, registers and channels |

### Two versions, two jobs

`openscript.format` versions the **format**: field names, the instruction set, the encoding. It is `"1.1"` in 0.5.0. `openscript.language` versions **meaning**: which front end parsed the source, and which behaviour of each library function an engine must apply. An engine selects library behaviour by the program's `language`, never by the newest it has, so a saved script never changes its numbers. The two move independently, because a new field and a corrected calculation have nothing to do with each other.

### Capability tags

`requires` lists what a program actually needs, and an engine checks it at load:

| Tag | Required when the program |
|---|---|
| `core.1` | Always: the instruction set |
| `arrays` | Uses an array literal, reads an array element by index, or calls an array function |
| `functions` | Declares a user function |
| `loops` | Contains a loop |
| `orders` | Is a strategy that places, modifies or cancels an order |
| `objects` | Creates a line, label, box or polyline |
| `tables` | Declares a table |
| `alerts` | Declares an alert |
| `req.timeframe` | Reads another timeframe of the chart's own instrument |
| `req.symbol` | Reads another instrument |

A compiler emits every tag a program needs and no other. So an engine that implements everything except orders runs every study and refuses exactly the strategies, with a message naming the missing tag, not a vague "too new".

### The declaration

`meta` is the `study()` or `strategy()` line, evaluated at compile time: `kind`, `title`, `short`, `overlay`, `precision`, `format`, `range`, `scale`, `group` and `onUnconfirmed`. A strategy adds a `strategy` object. For the costed EMA cross on [Backtesting API](/script/integrate/backtesting-api), whose declaration states its capital, fill rule, slippage and commission and takes its quantity from an input:

```json
{
  "capital": 500000, "currency": "", "qty": { "input": "Quantity" }, "qtyType": "units",
  "product": "intraday", "fillOn": "nextOpen", "slippage": 1,
  "commission": 20, "commissionType": "perTrade", "pyramiding": 1, "closeOnSessionEnd": false
}
```

**Every field is written with its effective value, defaults included.** An engine needs no table of defaults, and a default that changes in a later language version cannot change an old program, because the old program carries the old value in writing.

**An option written with an `input()` is carried as a reference**, `{ "input": "<key>" }`, as `qty` is above. An engine resolves every reference once at load, from the host's settings, before bar 0. That is how a tunable quantity, precision or plot colour reaches a declaration that is otherwise fixed before the first bar.

### Inputs

Each entry of `inputs` has a `key` (the settings key: the name the input was assigned to, or its title where no name received it), a `kind` (`number`, `bool`, `string`, `color`, `source`, `interval`, `time` or `select`), a `label`, a `default`, `min`, `max`, `step`, `options`, `group`, `tooltip`, and the `slot` the value is written into before every bar.

With no stored value, an input takes its `default`. A stored value is used when it passes validation, which is exact: the right type, inside `min` and `max`, and one of the `options` where there are any. A stored value that fails refuses the load with [OS6019](/script/errors/data#os6019) rather than falling back quietly to the default. An input value is never absent, because `input()` cannot declare `none` as its default.

### Channels and outputs

Everything a script shows for a bar leaves the machine through a **channel**: one value per bar, written by the one `EMIT` instruction. A plot's value, a per-bar plot colour, a level's price, a marker's text, an alert's condition and message, a bar colour and a pane background are all channels. A channel nothing wrote is absent, which the host sees as a gap in a plot, no marker, no alert, or a bar left its own colour.

Each channel says whether it is `defer`red, held back on a bar that is still forming (markers and alert conditions), and whether it is `once`: written exactly once on every path, which is how a plot column is guaranteed a value or an explicit absence on every bar.

`outputs` holds the declared shape the channels feed, fixed before bar 0 because a legend, a settings dialog and a pane must exist before the first bar runs. Tables and drawing objects are the exception: a table's cells are written by library calls against a handle, and a line or box is an object in the heap that a script creates once and changes over many bars, because both would otherwise need an unbounded number of channels.

### Values and constants

A value on the machine is one of six things:

| Tag | Holds |
|---|---|
| absent | Nothing: `none` in a script, `null` when it reaches a host |
| number | A finite binary64 number: the standard 64-bit floating point number most languages call a double |
| bool | `true` or `false` |
| string | A sequence of Unicode code points |
| color | Red, green and blue as whole numbers from 0 to 255, alpha from 0 to 1 |
| reference | An array, a table or a drawing object |

**A number is always finite.** An arithmetic result that is not finite becomes absent, checked after every single operation. Negative zero is turned into positive zero. Absence is a separate tag, never a sentinel number, so it cannot leak into arithmetic by accident.

The constant pool, `consts`, holds every literal as a `[tag, value]` pair: `["z", null]` for absent, `["b", true]`, `["n", 14]`, `["s", "BUY"]` and `["c", [255, 136, 0, 1]]` for a colour. Entries 0, 1 and 2 are always absent, `false` and `true`.

### Series, slots, cells and state

| Region | Holds | Lifetime |
|---|---|---|
| Series registers | The per-bar history of a value the program reads with `[n]`, and every built-in bar field it reads | Across bars |
| Frame slots | Every other name, input values and loop counters | One execution of a bar |
| Cells | One per `var` or `live var` | Across bars |
| State regions | The private state of each stateful library call site, such as an average's window | Across bars |

The compiler gives a name a register only when the program reads its history, which changes memory and never numbers. State is allocated per call site, so `sma(close, 20)` written twice keeps two independent windows, and a helper function called from two places keeps separate state for each.

### Reads of other data

A [[req.timeframe()]] or [[req.symbol()]] read compiles to two halves: an entry in `requests`, settled before bar 0, and a series register the engine fills with the read's value on each bar. Each entry holds `read` (`"timeframe"` or `"symbol"`), `symbol` and `exchange` (`null` for the chart's own), `timeframe`, `mode` (`confirmed`, `developing` or `lookahead`), `series` (the register), `warmup` (how many requested bars the expression needs) and `body`: the expression compiled to run over the requested bars. `req.timeframe("1D", sma(close, 5))` compiles to an entry with `read: "timeframe"`, `symbol: null`, `timeframe: "1D"`, `mode: "confirmed"` and `warmup: 4`. Because every read is known at load, a host can fetch them all in parallel before the first bar. [Host interface](/script/integrate/host-interface#bars-for-another-instrument-or-timeframe) covers the host's side.

## The instruction set

Forty-one instructions, deliberately small and dull: one way to do each thing, no shorthand for two others. Each is an array whose first element is the opcode's name, followed by its operands.

| Group | Instructions | Does |
|---|---|---|
| Constants and stack | `CONST`, `DUP`, `POP` | Push a constant; duplicate or discard the top value |
| Slots | `LOAD`, `STORE` | Read and write the current frame's slots |
| Cells | `CELL_INIT`, `LOADC`, `STOREC` | Initialise a `var` once; read and write it |
| Series | `SLOAD`, `SSTORE`, `HIST`, `HISTP` | Read and write a register; read its value `n` bars back |
| Arithmetic | `ADD`, `SUB`, `MUL`, `DIV`, `MOD`, `NEG` | Binary64 arithmetic; `ADD` also joins two strings |
| Comparison | `LT`, `LE`, `GT`, `GE`, `EQ`, `NE` | Ordering and equality |
| Logic | `NOT`, `AND`, `OR`, `AND_SHORT`, `OR_SHORT` | Three-valued logic, with the short circuit as its own instruction |
| Control | `JUMP`, `JUMP_FALSE`, `TICK`, `FOR_INIT`, `FOR_NEXT` | Branches and loops; `TICK` charges the loop budget |
| Arrays | `ARRAY`, `ELEM` | Build an array; read an element |
| Calls | `CALL_LIB`, `CALL_FN`, `RET` | Call a library function or a user function; return |
| Output | `EMIT` | Write a channel for this bar |
| Termination | `HALT` | End the bar |

The rules that give the language its behaviour live in a handful of these:

- **Absence propagates through arithmetic and ordering**, so `close > none` is absent, not `false`.
- **Equality is total.** `EQ` and `NE` always answer `true` or `false`, which is how a script can ask whether something is absent at all.
- **`and` and `or` are three-valued**: `false and absent` is `false`, `true or absent` is `true`, and the rest of the combinations with absence are absent.
- **A branch treats absence as false.** `JUMP_FALSE` is the one place absence is absorbed, because execution has to go somewhere.
- **A history read before the first bar is absent**, while an array index outside the array is an error, [OS4004](/script/errors/runtime#os4004): a history has no value there, an array has an extent the script chose.
- **Every loop body starts with `TICK`**, and every backward jump must land on one. That single rule means no loop can run without charging the budget, and when the budget is spent the engine raises [OS5001](/script/errors/limits#os5001) naming the loop's line.
- **An order call carries one extra argument**, the names of the arguments the script wrote. `buy()` means "the quantity I declared", while `buy(qty = x)` with `x` absent is a sizing calculation that has not warmed up, refused with [OS7002](/script/errors/orders#os7002). Without the names, the two would be the same call.

## Before the first bar: verification

An engine must verify a program in full before it runs a single bar, and refuse one that fails with OS6018, naming the instruction or field. Verification checks the structure and every index into every table; that every opcode exists with the right operand count; that every jump lands inside its own list; that every list ends in `HALT` or `RET`; that the stack depth agrees on every path, never goes below zero and is zero at `HALT`; that every backward jump lands on a `TICK`; that every `once` channel is written exactly once on every path; that the capabilities and library entries match the engine's; and that every input reference names a declared input.

A verified program cannot underflow its stack, jump out of bounds, address a slot that does not exist or loop without charging the budget. Every failure left is a script error with a source line, which is the only kind of failure a trader should ever see. `verify` in the JavaScript library runs the same checks on their own.

## One bar, eleven steps

| Step | What the engine does |
|---|---|
| 1. Restore | If this bar has run before, restore the state saved at the end of the previous bar |
| 2. Truncate | Cut every register's history back to this bar, discarding what a previous run of it wrote |
| 3. Clear | Empty the stack, the slots, the channels, the table cells, the pending effects and the loop counter |
| 4. Fill bar registers | Write the host's bar, the derived prices and the bar facts; write each read's value |
| 5. Fill inputs | Write each input's resolved value into its slot |
| 6. Execute | Run `code` from instruction 0 to `HALT` |
| 7. Close the registers | Append this bar's value to every register's history |
| 8. Publish the columns | Hand every channel's value to the host, `null` where absent |
| 9. Decide about effects | On a confirmed bar, or when the script set `onUnconfirmed`, apply the deferred channels and the pending order calls; otherwise discard them |
| 10. Trim history | Drop register entries older than the retained depth, when one is set |
| 11. Checkpoint | Save the state, if the engine is moving on to the next bar |

Steps 1 and 2 are what make a forming bar idempotent: executed ten times, it gives the answer it would have given once. Steps 8 and 9 are the line between drawing and acting. A line is redrawn on every update; a marker, an alert or an order waits for the bar to close, and an order function returns absent when it is called, because inventing an order id for something that may never exist would be a lie.

An error in step 6 stops the bar: steps 7 to 11 do not run, and the engine reports the code and source position rather than carrying a half-executed state into the next bar.

### Rollback and replay

The state saved at step 11 holds every cell, every library state region, the objects reachable from them with sharing preserved, the strategy's position and orders, and each register's history length. Restoring it before re-running a bar is the rollback rule, and `live var` cells are the single exception: they keep their current value, which is what `live var` means.

The same mechanism serves three purposes. It makes a forming bar idempotent, it lets a debugger step backwards, and it makes a replay exact: restoring the state from the end of bar `j` and running bars `j + 1` to `k` gives bar `k` exactly, bit for bit, what the original run gave it.

## Determinism

Two engines running the same program over the same bars must produce the same output to the last bit, on every machine. So an engine may not:

- reorder, reassociate or fuse floating point operations, use extended precision, flush subnormal numbers to zero, or change the rounding mode;
- compute a library function in any order other than the one the specification fixes for it, because a moving average is a sum and a sum has an order;
- use the platform's own maths library for `exp`, `log`, `pow` and the trigonometric functions once the portable reference algorithm exists. **None is written yet**, so those calls and the indicators built on them, [[alma()]], [[hv()]] and [[chop()]] among them, carry no cross-engine guarantee in the last bit in 0.5.0;
- read randomness, the wall clock (except the host-supplied [[chart.now()]]), the locale or the environment's timezone;
- let a script observe hash table order or concurrency.

Number-to-text conversion is specified too: `text(x)` writes the shortest decimal that reads back to the same number, and `text(x, d)` rounds halves away from zero to exactly `d` decimals.

## The canonical text and the hashes

A program travels as its **canonical encoding**: UTF-8 with no byte order mark, no whitespace between tokens, object keys sorted by Unicode code point, every number in the shortest decimal form that reads back to the same binary64 value, and strings escaping only what they must.

```text
{"callSites":[],"cells":[{"id":0,"kind":"var","name":"hits"}],"channels":[{"defer":false,"id":0,"once":true,"type":"number"},...
```

Two hashes identify a result:

| Hash | Taken over | Identifies |
|---|---|---|
| Source hash | The script's UTF-8 text after normalisation: a byte order mark dropped and CRLF turned into LF | The text the trader wrote. It is in the program as `source.hash` |
| Program hash | The canonical encoding of the program | The exact program an engine ran |

```js title="hashes.mjs"
import { readFileSync } from "node:fs";
import { canonicalise, programHash, sourceHash, normaliseSource, loadText } from "openalgo-script";
import { compile } from "./compile.mjs";

const source = readFileSync("two-bar-mean.os", "utf8");
const { program } = compile("two-bar-mean.os", source);

const text = canonicalise(program);                                   // the bytes to store and send
const id = programHash(program);                                      // "sha256:" and 64 hex digits
console.log(sourceHash(normaliseSource(source)) === program.source.hash); // true
console.log(loadText(text).ok);                                       // true
console.log(loadText(JSON.stringify(program, null, 2)).ok);           // false: OS6018, not the canonical spelling
```

`sourceHash` hashes exactly the text it is given, so normalise the source first, or hash the `file.text` your compile produced; on a file saved with CRLF line endings the raw text hashes differently.

Record both hashes beside a chart, a backtest and a running strategy. An engine upgrade never changes a stored result, and the two hashes are how you prove it. Text read from outside the process must be exactly the canonical encoding; an engine refuses any other spelling, because the hash you recorded names those bytes and no others.

## Versions and compatibility

**A minor format version may only add.** It may add a field whose absence changes no number, a table reachable only from a new field, a capability tag, or metadata. It may not add or change an instruction, change the encoding, add a required field or change a default. Any new field whose absence would change a number must come with a capability tag, which is what lets an older engine safely ignore fields it does not know. Format 1.1 added `requests`, and a program with a read names `req.timeframe` or `req.symbol` in `requires`, so a 1.0 engine refuses it by tag rather than drawing an empty line.

**A major version may change anything**, and is a different format that shares a name. It still cannot change what an existing program computes: a program carries its language version, and that is bound for life.

An engine loading a program refuses at the first failure, in this order, and every refusal names what is missing:

| Step | Refused with |
|---|---|
| The text is not the canonical encoding | OS6018 |
| The format's major version is one the engine does not implement | OS6016 |
| A required capability tag is missing | OS6006 |
| The language version is one the engine has no library behaviour for | OS6017 |
| A library entry disagrees with the engine's manifest in name, arguments, state or effect | OS6004 |
| The program exceeds the engine's instruction, state region or call depth ceilings | OS5009, OS5004, OS5005 |
| The program fails verification | OS6018 |

A newer minor version loads in an older engine, and an older one loads in a newer engine with any table it lacks read as empty. **A program that ran yesterday runs today and produces the same numbers**, whatever engine, version or machine runs it.

## Errors an engine raises

| Code | Raised when |
|---|---|
| [OS3004](/script/errors/arguments#os3004) | A loop step is zero, or an argument value is out of range |
| [OS4001](/script/errors/runtime#os4001) | A history offset is negative or not a whole number |
| [OS4002](/script/errors/runtime#os4002) | A history offset reaches past the retained depth |
| [OS4004](/script/errors/runtime#os4004) | An array index is outside the array |
| [OS4013](/script/errors/runtime#os4013) | A `for` loop's start, limit or step is absent |
| [OS5001](/script/errors/limits#os5001) | The per-bar loop budget is spent |
| OS5003, OS5004, OS5005, OS5009 | The program asks for more than the host or engine allows |
| OS6004, OS6006, OS6016, OS6017, OS6018 | The load refusals above |
| [OS6019](/script/errors/data#os6019) | A host setting fails an input's validation |
| [OS7002](/script/errors/orders#os7002) | An order argument the script wrote is absent |

A load refusal names the instruction index or the field, because the failure is in the program. An error during a bar carries the source line and column from `debug.pos`, and a spent loop budget names the loop's own line rather than whatever instruction happened to be running.

## Becoming a chart

An engine computes columns; drawing them is a separate job. The program's tables map one to one onto a chart: `meta` onto the study's name, pane and scale, `inputs` onto the settings dialog, `outputs` onto series, bands, levels, markers, grids and alerts, the heap's drawing objects onto free drawings handed over whole after every bar, and `requests` onto the host's fetches. The [chart adapter](/script/integrate/charts-adapter) is that mapping for openalgo-charts. One rule is part of the format rather than any chart: only one study may colour the instrument's candles, the latest in the host's own study order that paints them.

**Related.** [Two libraries](/script/integrate/overview), [JavaScript library](/script/integrate/javascript), [Python engine](/script/integrate/python-engine), [Host interface](/script/integrate/host-interface), [Your own engine](/script/integrate/conformance), [Execution model](/script/language/execution-model), [Absent values](/script/language/absent-values)
