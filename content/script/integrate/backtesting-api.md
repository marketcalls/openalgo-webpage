---
title: Backtesting API
description: Run a compiled OpenScript strategy over bars from code with backtest(), choose the contract, costs, fill rules and report window, and read, store, replay, rerun and compare the run record it returns.
---

This page covers backtesting from code with `openalgo-script`: one call that runs a compiled strategy over your bars against a simulated order destination and returns a **run record**. It is the same backtest the Backtest panel in the /trading page runs in the browser, so a report your server produces agrees with the one a trader sees. Read it to build a backtest service, a batch job over many instruments, or a report page of your own.

The run record is the product, not a number printed at the end. It carries the program, the bars, the settings you chose, every order, every fill, the ledger and the report, so a result can be checked again months later and handed to another engine as a test case.

## A complete backtest

The strategy states its own costs, so the report is costed from the first run:

```openscript title="ema-cross-costed.os"
version 1
strategy("EMA cross, costed", overlay = true, capital = 500000,
         qty = input(10, "Quantity", min = 1),
         fillOn = "nextOpen", slippage = 1,
         commissionType = "perTrade", commission = 20)

fastLen = input(9, "Fast", min = 1)
slowLen = input(21, "Slow", min = 2)
fast = ema(close, fastLen)
slow = ema(close, slowLen)
goLong = crossUp(fast, slow)
goFlat = crossDown(fast, slow)

if goLong and pos.isFlat
    buy()
else if goFlat and pos.isLong
    close()

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)
```

This file runs it over ten NSE sessions of 5 minute bars. `compile` is the helper from [JavaScript library](/script/integrate/javascript), and `sampleBars` stands in for your stored history:

```js title="backtest.mjs"
import { readFileSync } from "node:fs";
import { backtest, settingsFor } from "openalgo-script";
import { compile } from "./compile.mjs";
import { sampleBars } from "./bars.mjs";

const source = readFileSync("ema-cross-costed.os", "utf8");
const compiled = compile("ema-cross-costed.os", source);
if (!compiled.ok) throw new Error(compiled.diagnostics.map((d) => d.message).join("\n"));

// The instrument the money is priced under.
const contract = {
  symbol: "SBIN", exchange: "NSE", currency: "INR",
  tickSize: 0.05, lotSize: 1, pointValue: 1, digits: 2,
};

const result = backtest(compiled.program, sampleBars(), settingsFor(contract), {
  sourceText: compiled.file.text, // the normalised text the program was compiled from
  instrument: {
    interval: "5", timezone: "Asia/Kolkata", instrumentType: "equity", hasVolume: true,
    session: { start: "09:15", end: "15:30", days: [1, 2, 3, 4, 5] },
  },
});
if (!result.ok) throw new Error(`${result.diagnostic.code}: ${result.diagnostic.message}`);

const { summary, trades } = result.record.report;
console.log(`${summary.tradeCount} closed trades, net ${summary.netProfit.toFixed(2)} ${summary.currency}`);
console.log(`charges ${summary.charges.toFixed(2)}, win rate ${summary.winRate === null ? "none" : (summary.winRate * 100).toFixed(1) + "%"}`);
console.log(`max drawdown ${summary.maxDrawdown.toFixed(2)} at ${new Date(summary.maxDrawdownAt).toISOString()}`);
for (const t of trades) {
  console.log(t.side, t.units, t.entryPrice, "->", t.exitPrice, "net", t.netProfit.toFixed(2));
}
```

```js title="bars.mjs"
/** Ten NSE sessions of 5 minute bars, 09:15 to 15:30 IST, on a 0.05 tick. A stand-in for your stored history. */
export function sampleBars() {
  const tick = (x) => Math.round(x * 20) / 20;
  const bars = [];
  let price = 800;
  let n = 0;
  for (let day = 0; day < 10; day++) {
    const open = Date.UTC(2025, 0, 6 + day + 2 * Math.floor(day / 5), 3, 45); // skip weekends
    for (let i = 0; i < 75; i++, n++) {
      const o = price;
      price = tick(price + 3 * Math.sin(n / 17) + 1.2 * Math.cos(n / 5));
      bars.push({ time: open + i * 300_000, open: o, high: tick(Math.max(o, price) + 0.5), low: tick(Math.min(o, price) - 0.5), close: price, volume: 10_000, oi: null });
    }
  }
  return bars;
}
```

It prints:

```text
6 closed trades, net 3847.00 INR
charges 240.00, win rate 100.0%
max drawdown -262.00 at 2025-01-15T05:30:00.000Z
long 10 817.25 -> 883.55 net 623.00
long 10 818 -> 887.05 net 650.50
long 10 816.0999999999999 -> 886.05 net 659.50
long 10 819.6 -> 885.35 net 617.50
long 10 816.4 -> 887.4 net 670.00
long 10 817 -> 883.65 net 626.50
```

Each trade paid 40 in charges: 20 on the entry and 20 on the exit. The prices are raw binary64 numbers, `816.0999999999999` among them, because nothing in a report is rounded; round when you print.

`backtest` answers `{ ok: true, record }`, or `{ ok: false, diagnostic }` when the run cannot be carried out at all. It throws in one case only: a `sourceText` that is not the text the program was compiled from, which is a mistake in the calling code rather than a run that failed.

## The call

```text
backtest(program, bars, settings, options?) -> { ok: true, record } | { ok: false, diagnostic }
```

| Argument | What it is |
|---|---|
| `program` | A compiled program whose declaration is `strategy()` |
| `bars` | Your bars, oldest first, in the shape of [JavaScript library](/script/integrate/javascript#bars): `time` in UTC milliseconds, prices, and `volume` and `oi` as numbers or `null` |
| `settings` | Everything you decided about this run. Build it with `settingsFor` |
| `options` | What the record carries beside the run, below |

Every bar you hand over executes. The report window decides which of them the report is about.

### The contract

The contract is the instrument the money is priced under, and the one part of the settings you must state:

| Field | Means |
|---|---|
| `symbol`, `exchange` | The identity, carried into every order row. Opaque to the engine |
| `currency` | The currency every money figure is in, such as `"INR"` |
| `tickSize` | The price increment. Slippage is counted in ticks |
| `lotSize` | Units per lot. Only a quantity stated in lots reads it |
| `pointValue` | Money per point of price per unit. `1` for an equity; set it for a contract whose point is worth more |
| `digits` | Decimal places a fill's charges are rounded to, half to even, once per fill |

On an NFO future or option a quantity is stated in units, so one lot of a contract whose lot size is 75 is `qty = 75` in the script. [Position and sizing](/script/strategies/position-and-sizing) covers sizing from [[chart.lotSize]].

### Settings

`settingsFor(contract, chosen?)` fills every other setting with the absence of a choice. Override any of them in `chosen`:

| Setting | Default | Means |
|---|---|---|
| `range` | The whole of the bars supplied | The report window: `{ from, to }`, both inclusive, UTC milliseconds, `null` for an open end |
| `costs` | `null` | A charge schedule you supply. `null` charges what the script's `strategy()` line declares |
| `fill` | `DEFAULT_FILL` | How a resting limit or stop order is decided against a bar |
| `inputs` | None overridden | Input values, keyed by input key |
| `now` | `null` | The fixed value [[chart.now()]] answers |
| `tolerance` | `EXACT` | How closely a later comparison must agree. A bound that is not zero needs a `reason` |

```js
const settings = settingsFor(contract, {
  range: { from: Date.UTC(2025, 0, 13, 3, 45), to: null }, // report from the second week
  inputs: { Quantity: 25, fastLen: 5 },
});
```

Input keys follow the rule on [JavaScript library](/script/integrate/javascript#settings-and-input-keys): `fastLen` is the name its input was assigned to, and `Quantity` is the title of the input written inside the `strategy()` line, which no name receives. A key the program does not declare is ignored.

**The report window is not the bars.** Every bar you supply runs, oldest first, so the strategy's averages warm up before the window opens. A bar before the window is warmup: its orders are real, a position opened on it is carried into the window, and it contributes no point to the equity curve. A window that holds no bar is refused with [OS6020](/script/errors/data#os6020) rather than reported as a flat line. Supply history before the window to cover the longest warmup in the script; [Backtesting](/script/strategies/backtesting#warmup-how-much-history-the-first-trade-needs) explains how much.

**The default fill policy is conservative on purpose.** A limit order fills only where the bar traded through its price, not where the bar merely touched it, so an order resting exactly at the day's low is not credited with a fill nobody can prove. A stop that the market gapped through fills at the open, the price a trader would actually have got, not at its trigger. The policy carries its own version so a record made today replays under today's rules even after they change.

### Costs you supply

Leave `costs` at `null` and the run charges what the script declares: its `commission`, `commissionType` and `slippage`. To charge your platform's real schedule instead, supply one. Each line is charged per fill, on the side it names:

| Line field | Means |
|---|---|
| `name` | The line's name in the breakdown |
| `base` | `"turnover"` (a fraction of price times units), `"units"` (money per unit), `"order"` (money per fill) or `"charges"` (a fraction of the lines named in `of`) |
| `side` | `"buy"`, `"sell"` or `"both"`. A tax on one side is charged exactly on that side |
| `rate` | The fraction, or the money amount, for the base |
| `min`, `max` | Optional floor and cap in money, or `null` |
| `of` | For `base: "charges"`, the lines this one is levied on |

The schedule itself carries `currency`, `digits`, `slippageTicks` and `source: "supplied"`. A cash equity trade in India stacks brokerage, a transaction tax on the sell side, exchange charges, GST on brokerage and exchange charges, and stamp duty on the buy side:

```js
// Illustrative rates. Take the current figures from your broker's and the exchange's published schedules.
const costs = {
  currency: "INR", digits: 2, slippageTicks: 1, source: "supplied",
  lines: [
    { name: "brokerage", base: "order", side: "both", rate: 20, min: null, max: null, of: [] },
    { name: "stt", base: "turnover", side: "sell", rate: 0.00025, min: null, max: null, of: [] },
    { name: "exchange", base: "turnover", side: "both", rate: 0.0000297, min: null, max: null, of: [] },
    { name: "gst", base: "charges", side: "both", rate: 0.18, min: null, max: null, of: ["brokerage", "exchange"] },
    { name: "stamp", base: "turnover", side: "buy", rate: 0.00003, min: null, max: null, of: [] },
  ],
};
const result = backtest(program, bars, settingsFor(contract, { costs }));
```

`chargeFor(schedule, fill, contract)` returns one fill's breakdown, line by line, for a costs panel. Each line is computed unrounded and only the fill's total is rounded, once, to `digits`, so adding the printed lines by hand can land a fraction of the last digit away from the total. [Costs and fills](/script/strategies/costs-and-fills) covers choosing the numbers.

### What is refused before the first bar

Nothing has been computed when these are found, so a refusal costs one run rather than a report nobody can explain:

| Refused | Code |
|---|---|
| A supplied schedule while the script also declares a commission: the same money charged twice | [OS6023](/script/errors/data#os6023) |
| A schedule that cannot be evaluated against the contract | [OS6021](/script/errors/data#os6021) |
| A quantity in cash or a percentage of equity: a backtest fills in units and works out no running equity to size against | OS6021 |
| A quantity in lots when the contract states no lot size | OS6021 |
| A comparison tolerance with a bound and no reason | OS6021 |
| A report window holding none of the bars | [OS6020](/script/errors/data#os6020) |
| A setting that fails its input's rules | [OS6019](/script/errors/data#os6019) |

A failure on a bar during the run does not refuse the run: it is recorded in the record's `diagnostics` with the bar it happened on.

### Options

| Option | Means |
|---|---|
| `sourceText` | The script's own text, as the compiler normalised it: pass `compiled.file.text`. It is checked against the program's source hash, and text that does not match throws. Needed for the record to become a conformance case |
| `instrument` | The instrument facts beside the contract: `interval`, `timezone`, `instrumentType`, `hasVolume`, `hasOpenInterest` and `session`. The session is what [[session.isLastBar]] and every session-anchored call read. A record becomes a conformance case only when this states `hasVolume` |
| `form` | `"inline"` (the default) carries the bars in the record. `"referenced"` carries only their hash, count and first and last times, for bars you keep in your own store |

## The run record

| Field | Holds |
|---|---|
| `recordVersion` | The record format's version, 4 in 0.5.0 |
| `engine` | The engine's name and version |
| `languageVersion` | The language version the program was compiled under |
| `program`, `programHash` | The compiled program itself, and its hash |
| `source`, `sourceText` | The source hash, line count and file name, and the text when you supplied it |
| `settings` | Every setting of the run, defaults included |
| `instrument` | The instrument record the engine was handed |
| `bars` | The bars inline, or their hash and range when referenced |
| `frames` | Every order update the simulated destination sent |
| `fills` | Every fill, in order: side, units, price, bar and the position it moved |
| `orders` | The ledger: one row per order with its status, filled quantity and average price |
| `diagnostics` | Anything raised during the run, with the bar it was raised on |
| `report` | The figures, below |

### The report

| Part | Holds |
|---|---|
| `summary` | One flat object of figures: net profit, gross profit and loss, charges, return, trade counts, wins, losses and scratches, win rate, average win and loss, expectancy and its standard error, profit factor, maximum drawdown and run-up with their percentages and times, longest drawdown, average bars held, bars in the market and bar count |
| `trades` | Every trade: side, units, entry and exit bar, time and price, bars held, gross and net profit, charges, the best and worst open profit on the way, and whether it is still open |
| `equity` | One point per bar inside the window: realised profit, charges, open profit, cash, equity, exposure, drawdown and run-up |
| `monthly` | Net profit, return and trade count per calendar month |
| `markers` | Every entry and exit, with its bar, time, side, units and price, for drawing on a chart |
| `analysis` | Long and short trades apart, the largest win and loss, and the longest runs of wins and losses |

A few conventions that decide how you print them:

- **A percentage is a fraction.** `returnPercent` of `0.0077` is 0.77 percent; multiplying by a hundred is your display's job.
- **Drawdown is negative.** `maxDrawdown` of `-262` is a fall of 262 from the peak, and `maxDrawdownPercent` is negative too.
- **A summary figure that points at a bar carries its time**, such as `maxDrawdownAt`, because loading more history moves every bar index. Trades, markers and equity points carry both the bar index and the time; store and compare the time.
- **Some figures are `null` rather than zero**, where zero would be a claim the run cannot make: `winRate` when no trade decided anything, `profitFactor` when there was no losing trade, `averageBarsHeld` when nothing closed, and the times of a drawdown or run-up that never happened.
- **A trade wins or loses after charges.** A trade whose gross profit its charges ate is a loser.
- **Nothing in the report is rounded** except each fill's charges. Round only when you display.

[Reading a report](/script/strategies/reading-a-report) explains what each figure tells a trader.

## Keeping a run reproducible

A result nobody can reproduce is an anecdote. The record makes reproduction a check rather than a hope:

```js title="reproduce.mjs"
import { readFileSync, writeFileSync } from "node:fs";
import { backtest, settingsFor, recordToJson, recordFromJson, replay, rerun, runBytes, compareRuns } from "openalgo-script";
import { compile } from "./compile.mjs";
import { sampleBars } from "./bars.mjs";

// The same program, bars and contract as backtest.mjs.
const compiled = compile("ema-cross-costed.os", readFileSync("ema-cross-costed.os", "utf8"));
const { program, file } = compiled;
const bars = sampleBars();
const contract = { symbol: "SBIN", exchange: "NSE", currency: "INR", tickSize: 0.05, lotSize: 1, pointValue: 1, digits: 2 };
const before = backtest(program, bars, settingsFor(contract), { sourceText: file.text }).record;

// Store the whole record. It is the product of the run.
writeFileSync("run-1.json", recordToJson(before));

// Months later: read it back and check it.
const stored = recordFromJson(readFileSync("run-1.json", "utf8"));
const money = replay(stored);    // the money folded again from the stored fills
const again = rerun(stored);     // the program executed again over the stored bars
console.log(money.ok && money.report.summary.netProfit === stored.report.summary.netProfit); // true
console.log(again.ok && runBytes(again.record) === runBytes(stored));                       // true

// Change one thing and compare.
const after = backtest(program, bars, settingsFor(contract, { inputs: { fastLen: 5 } }), { sourceText: file.text }).record;
const comparison = compareRuns(before, after);
console.log(comparison.comparable, comparison.differences); // true [ { what: "inputs", ... } ]
```

| Call | Does |
|---|---|
| `recordToJson(record)`, `recordFromJson(text)` | The record as text and back. `recordFromJson` answers `null` for JSON that is not a record, or is a record from a newer release than yours; text that is not JSON at all throws, so wrap it when the text comes from outside |
| `replay(record, bars?)` | Folds the money again from the stored fills, with no engine: the report, recomputed |
| `rerun(record, bars?)` | Executes the stored program again over the stored bars. On the same engine the result is bit-identical, and `runBytes` is what you compare |
| `compareRuns(before, after)` | Puts two records side by side |
| `caseFilesFrom(record, identity)` | Turns a record into the files of a conformance case. See [Your own engine](/script/integrate/conformance#harvesting-a-case-from-a-run) |

A record made with `form: "referenced"` holds no bars, so hand the same bars back to `replay` and `rerun`; bars that hash differently are refused with OS6022.

`compareRuns` answers five things. `comparable` is false when the two runs were over different bars or a different contract, because subtracting money from two different studies is arithmetic with no meaning. `differences` names every setting that differs even when the pair is comparable, because the reason a run improved is as often a setting somebody forgot they changed as the change they meant to test. `deltas` gives each summary figure before, after and the change. `separation` is the difference in expectancy measured in standard errors, and `sharedTrades` counts trades that opened on the same bar on the same side in both: a separation near zero is noise, however good the new net profit looks.

Three habits make a result reproducible:

- **Pin the script revision.** Store the program hash with the run, so editing the script can never change a result already produced.
- **Prefer stored history to a fresh fetch.** A data vendor may revise a bar, and a run over refetched bars can differ from Monday to Tuesday for reasons nobody can see afterwards.
- **Record the cost settings with the run.** Charges change. A run under last year's schedule is not wrong, but it is not comparable with one under this year's unless both are on the record.

## A backtest service

A backtest over years of minute bars is pure computation with no pause in it. Three rules shape the service around it:

- **A run is a job, not a request.** Start it, return an identifier, report progress on a channel you already keep open, and let the client fetch the record by identifier. Any proxy in front of you has a read timeout, and a trader who sees a gateway error while the run carries on behind it is the worst version of this.
- **The computation runs in its own process**, never on the thread that answers requests.
- **Nothing large travels in a request body.** Records are fetched by identifier.

Put the honest limit of any backtest in your own interface as well: a backtest assumes the fills it models. It cannot know that your order would have moved the price, that the spread was wider than the bar suggests, or that the exchange was slow that morning. Modelled costs are an estimate, and modelled slippage is a guess with a number attached.

## What the 0.5.0 backtest does not model

- **A bracket's stop and target do not fill.** A strategy that attaches them with [[exit()]] or [[order.bracket()]] runs, but those levels are never filled. Manage exits in the script with [[close()]].
- **Quantities in cash or a percentage of equity are refused**, as above. State quantities in units or lots.
- **A trade whose size changes is marked at one size.** The equity curve marks a trade at the size it ended up entering, from the bar it opened. A strategy that adds to a position is therefore charted deeper than the account went, and its drawdown figures are overstated; a partial close is marked at the full size afterwards, so its open profit is counted twice. Realised profit is right in both cases, because it is folded from the fills.
- **A script cannot read its own equity mid-run.** [[pos.equity]] and the other account figures are planned.

## Frames you supply

`backtestSupplied(program, bars, settings, frames, options?)` runs the same way against order updates somebody else supplied rather than a simulated destination: nothing is priced off a bar, no order rests, and an order the frames say nothing about stays where its placement left it. It is how a conformance case asserts the ledger against input no engine chose, and how you reproduce what a real destination answered. A supplied frame has the shape of a record's own `frames`: `afterBar`, the bar after which it arrived; `intent`, which order it is about, counting the run's orders from 1; `status`; the cumulative `filledQty` and `avgFillPrice`; and optionally `orderRef`, `text` and `time`. Handing a record's own frames back to `backtestSupplied` reproduces that record's report. What each status word means is on [Host interface](/script/integrate/host-interface#orders).

To drive a strategy bar by bar against your own order path instead, use the engine directly with an order route: [Host interface](/script/integrate/host-interface#orders) in JavaScript, and [Python engine](/script/integrate/python-engine#running-a-strategy) on a Python server.

**Related.** [Backtesting](/script/strategies/backtesting), [Reading a report](/script/strategies/reading-a-report), [Costs and fills](/script/strategies/costs-and-fills), [JavaScript library](/script/integrate/javascript), [Host interface](/script/integrate/host-interface), [Your own engine](/script/integrate/conformance)
