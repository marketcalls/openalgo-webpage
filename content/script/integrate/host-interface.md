---
title: Host interface
description: Everything a platform supplies so an OpenScript engine can run a script, bars, instrument facts, bars for other instruments, bar state, an order route and settings, what the engine hands back, and what happens when the host cannot answer.
---

A **host** is whatever already owns the data and the account: a charting product, a trading terminal, a backtest service, a research notebook. The engine assumes none of them. It asks the host a small, fixed set of questions, and this page is that contract: the exact shape of each answer, when it is read, and what happens when you cannot give it. It applies whichever engine you run, the JavaScript library, the Python engine or one of your own.

On OpenAlgo there are two hosts. The /trading page hosts charts and backtests: it supplies the bars of the chart, the settings dialog, alert delivery and the instrument record, read from OpenAlgo's instrument data (the exchange, tick size, lot size, instrument type and whether the instrument has volume and open interest) and from its market calendar (the timezone and the regular trading session). The chart states its own symbol, interval, tick size and timezone beside them; [chart.*](/script/reference/chart#where-the-facts-come-from) lists which fact each part of the page states. A deployed strategy is hosted by OpenAlgo's server, which runs it with the Python engine and sends its orders either to sandbox trading (analyzer mode in OpenAlgo) or to your broker account, whichever the platform is set to.

## The six duties

| Duty | You supply | Read | Optional |
|---|---|---|---|
| 1. Bars | Open, high, low, close, volume and time, oldest first | On every execution of a bar | No |
| 2. Instrument facts | The instrument record | Once, at load | No |
| 3. Bars on request | Another instrument's bars, or another timeframe's | At load, answered before or between bars | Yes |
| 4. Bar state | Whether a bar is confirmed and whether a realtime feed is driving it | On every execution of a bar | No |
| 5. Orders | A destination for order intents, and frames reporting what became of them | At the end of a decided bar, and between bars | Yes |
| 6. Settings | A stored value per input key | Once, at load | Yes |

A drawing surface and the chart clock for [[chart.now()]] complete the list; the [chart adapter](/script/integrate/charts-adapter) covers drawing.

**Nothing reaches a running bar.** An execution reads the saved state, the bar and the settings, and nothing else. A frame that arrives, a request answered, a setting changed: each takes effect between bars or on a fresh load, never during one. That is what makes a replay exact and a backtest reproducible.

**An optional duty is declared at load, not discovered on bar four thousand.** A host with no order route gives its engine no `orders` capability, and a strategy is refused at load with [OS6006](/script/errors/data#os6006) naming it. A host with no provider for other instruments gives no `req.symbol` capability, and a script that reads one is refused the same way.

**When you cannot answer, there are three outcomes and never a fourth**: the absent value, which a script can test with [[isNone()]]; a catalogued error carrying your own words for the reason; or a refusal at load. A guess is never one of them. A tick size invented as `0.01`, a zero written for an unknown volume, a price carried forward from the previous bar: each produces a number that looks computed, and nothing downstream can tell that it is not.

## A complete host

This study compares a stock with the NIFTY index, so it exercises four duties at once: bars, instrument facts, a read of another instrument, and bar state with an alert.

```openscript title="relative-strength.os"
version 1
study("Strength against the index", overlay = false)

indexSymbol = input("NIFTY", "Index")
indexClose = req.symbol(indexSymbol, "5", close, exchange = "NSE_INDEX", mode = "developing")
ratio = close / indexClose
average = sma(ratio, 20)

plot(ratio, "Ratio", teal)
plot(average, "Ratio average", orange)

if crossUp(ratio, average)
    alert("Outperforming the index", id = "outperform", title = "Relative strength")
```

The host, in JavaScript, with `compile` from [JavaScript library](/script/integrate/javascript):

```js title="host.mjs"
import { readFileSync } from "node:fs";
import { load } from "openalgo-script";
import { compile } from "./compile.mjs";

// Stand-ins for your own data layer: 5 minute bars from 09:15 IST, times in UTC milliseconds.
const sessionOpen = Date.UTC(2025, 0, 6, 3, 45);
const makeBars = (base, drift) => Array.from({ length: 75 }, (_, i) => {
  const close = base * (1 + drift * i + 0.002 * Math.sin(i / 6));
  return { time: sessionOpen + i * 300_000, open: close, high: close * 1.0005, low: close * 0.9995, close, volume: 25_000 };
});
const stockBars = makeBars(820, -0.0002);
const indexBars = makeBars(23500, 0);

const host = {
  // Duty 2: the instrument record, read once at load.
  instrument: {
    symbol: "SBIN", exchange: "NSE", interval: "5", timezone: "Asia/Kolkata",
    tickSize: 0.05, lotSize: 1, currency: "INR", instrumentType: "equity",
    hasVolume: true, hasOpenInterest: false,
    session: { start: "09:15", end: "15:30", days: [1, 2, 3, 4, 5] },
  },
  // The chart clock, which chart.now() answers.
  now: Date.UTC(2025, 0, 6, 10, 0),
  // Duty 3: bars for another instrument, asked once per read, at load.
  requestBars(query) {
    if (query.read === "symbol" && query.instrument === "NIFTY" && query.exchange === "NSE_INDEX") {
      return { bars: indexBars };
    }
    if (query.read === "symbol") return { refused: { code: "OS6007" } };
    return undefined; // the chart's own instrument at another interval: let the engine fold it
  },
};

const { program, file } = compile("relative-strength.os", readFileSync("relative-strength.os", "utf8"));
// Duty 6: the settings stored for this instance, keyed by input key.
const loaded = load(program, { source: file, host, settings: { indexSymbol: "NIFTY" } });
if (!loaded.ok) throw new Error(`${loaded.diagnostic.code}: ${loaded.diagnostic.message}`);
const engine = loaded.engine;

// Duties 1 and 4: history first, every bar confirmed and not realtime.
engine.run(stockBars.slice(0, 74));

// Then the newest bar, live: forming, then closed.
const last = stockBars[74];
engine.append(last, { isConfirmed: false, isRealtime: true });
const closed = engine.update({ ...last, close: last.close * 1.01, high: last.close * 1.01 }, { isConfirmed: true, isRealtime: true });
console.log(closed.columns.slice(0, 2), closed.alerts);
// closed.alerts: [{ key: "outperform", title: "Relative strength", message: "Outperforming the index", bar: 74, time: ... }]
```

The alert fires once, on the live bar, when it closes. The 74 bars of history raised none, because an alert is raised only on a bar the host says a realtime feed is driving, and the forming execution raised none, because nothing is decided until the bar is confirmed.

## Bars

### The shape

| Field | Type | Means |
|---|---|---|
| `time` | number | The bar's **open** instant, whole milliseconds since the Unix epoch, UTC. 09:15 IST is 03:45 UTC |
| `open`, `high`, `low`, `close` | number | The bar's prices. A price you do not have is absent, never zero and never carried forward |
| `volume` | number | Only where you have it. Absent and zero are different facts |
| `oi` | number | Open interest, only where you have it. A level, not a flow: a coarser bar takes the last value, never the sum |

`time` is the open instant because the open is how a bar can be identified while it is still forming. A feed that stamps bars by their close converts once, in the host.

### The order they arrive in

- **Oldest first.** Position 0 is the oldest bar you supplied, and that position is [[bar.index]].
- **`time` strictly increases.** Two bars with one timestamp are not two bars.
- **Spacing need not be uniform.** Sessions have gaps, and a host that pads a gap with invented bars is inventing trades.
- **The engine will not repair anything.** It does not adjust, round, resample, deduplicate or reorder what you hand it. Identical bars give identical numbers; different bars were never going to agree.

The engine works out `hl2`, `hlc3`, `ohlc4` and `hlcc4` itself, with a fixed order of operations, so never supply them. A midpoint computed by the host can differ from the engine's in the last bit.

### A missing volume is not a zero volume

**Zero is a reading:** you were watching and nobody traded. **Absent means nobody stated it:** anything computed from it is absent, a volume study draws a gap, and a script can test for it. Never write `0` for a volume you do not know, which draws a confident flat line across the part of the chart where you knew nothing; and never write an absent volume for a real zero, which breaks every running total across a quiet bar. Whether an instrument reports volume at all is a separate fact, `hasVolume`, below.

### The newest bar moves

You may hand the newest bar back with new values. That is an **update**, not a new bar, and the engine re-executes it from the state it saved at the end of the previous bar, so ten updates give the answer one would.

- An update never changes a bar's `time`. A new `time` is a new bar.
- An update may change `high`, `low`, `close` and `volume`. `open` may change only before the bar's first execution.
- A confirmed bar is never revised.
- A correction to a bar **older** than the newest is not an update. Start the run again from bar 0 with the corrected data.

### When you cannot answer

| Situation | What happens |
|---|---|
| No bars at all | [OS6010](/script/errors/data#os6010). An empty pane with no message would look like a study that drew nothing |
| A bar whose time does not follow the one before it | [OS6011](/script/errors/data#os6011), naming that bar. The run stops there; bars before it stand |
| A price or volume you do not have | The absent value |
| Fewer bars than the script's warmup needs | Not an error. The study is absent until it has enough bars, and draws from the first bar it can |
| A feed that is behind | Not an error. The engine runs over what it has, and later bars arrive as updates |

## Instrument facts

### The record

Twelve facts, read once at load and constant for the whole run:

| Fact | Type | Required | What a script sees when you leave it out | Read by |
|---|---|---|---|---|
| `symbol` | string | No | Absent in the JavaScript engine; the Python engine answers `""` | [[chart.symbol]] |
| `exchange` | string | No | Absent | [[chart.exchange]] |
| `interval` | string | No | Absent, and the two derived facts with it | [[chart.interval]] |
| `timezone` | string | **With a session** | Absent | [[chart.timezone]] and every calendar and session call |
| `tickSize` | number | No | Absent | [[chart.tickSize]], [[roundToTick()]] |
| `lotSize` | number | No | Absent | [[chart.lotSize]], [[order.roundToLot()]] |
| `pointValue` | number | No | Absent | [[chart.pointValue]] |
| `currency` | string | No | Absent | [[chart.currency]] |
| `instrumentType` | string | No | Absent | [[chart.instrumentType]] |
| `hasVolume` | bool | **Yes** | Absent, but a conforming host never leaves it out: it is the one fact every host must state | [[chart.hasVolume]] |
| `hasOpenInterest` | bool | No | Absent | [[chart.hasOpenInterest]] |
| `session` | object | No | Absent, and every per-bar session fact with it | The `session` namespace |

For a NIFTY future on NFO:

```json
{
  "symbol": "NIFTY25JANFUT",
  "exchange": "NFO",
  "interval": "5",
  "timezone": "Asia/Kolkata",
  "tickSize": 0.05,
  "lotSize": 75,
  "pointValue": 1,
  "currency": "INR",
  "instrumentType": "future",
  "hasVolume": true,
  "hasOpenInterest": true,
  "session": { "start": "09:15", "end": "15:30", "days": [1, 2, 3, 4, 5] }
}
```

The spellings:

- `interval` is a timeframe string; a bare number is minutes, so `"60"` and `"1h"` are both one hour and both give [[chart.intervalMinutes]] of 60. [[chart.interval]] hands the text back exactly as you wrote it.
- `timezone` is a zone name from the standard timezone database, such as `Asia/Kolkata`, never a fixed offset, which is silently wrong for half the year anywhere with a seasonal clock change.
- `instrumentType` is one of `"equity"`, `"future"`, `"option"`, `"index"`, `"currency"`, `"commodity"` or `"other"`.
- `tickSize` and `lotSize` are positive. Zero is not a tick size.

**Two facts are derived, and you must not supply them.** [[chart.intervalMinutes]] and [[chart.isIntraday]] are worked out from `interval`, so they can never disagree with it.

**Why exactly one fact is required.** Every other fact has an honest answer for "nobody said": absent, which a script can test. `hasVolume` does not, because an instrument that never reports volume and one whose figures are late produce the same empty column. A tick size is absent rather than a guessed `0.05` for the same reason: a script sizing a stop in ticks has to tell "the smallest increment is five paise" from "nobody said".

### The session

```json
"session": { "start": "09:15", "end": "15:30", "days": [1, 2, 3, 4, 5] }
```

`start` and `end` are wall clock times, `"HH:MM"`, read in the instrument's `timezone`. `days` numbers Monday as 1 through Sunday as 7. `"24:00"` is midnight at the end of the day, and an `end` earlier than its `start` crosses midnight, which an overnight session needs. MCX, for instance, trades from 09:00 into the late evening.

The session earns its place through the scheduled close: [[session.isLastBar]] is true on the last bar of the schedule even when trading stopped early, so a strategy that must be flat by 15:30 acts on it rather than on the appearance of a new bar, which arrives too late.

**A stated session is checked against itself at load**, and refused with [OS6012](/script/errors/data#os6012) naming what is missing when it has no `timezone`, a time not spelled `"HH:MM"` (`"9:15"` is the one a host writes first), or a `days` entry outside 1 to 7. A host that states no session at all is not refused: that is the honest record of a schedule it does not hold, and the per-bar session facts are then absent.

**A session study is only as good as the session.** [[vwap()]] restarts at the session's first bar, and [[session.isFirstBar]] and [[session.isLastBar]] are derived from the window. A host that holds a schedule and does not state it gets every one of them absent on every bar, with nothing on the chart to say why.

Two limits of version 1: **one window per instrument**, so an instrument with a break states the enclosing window and a script that must know about the break tests its own window with [[session.isIn()]]; and **no holiday calendar**, so a holiday is simply a day with no bars.

**State every fact you have.** Withholding the tick size gives a script an absent value it can test. Withholding the session or its timezone removes a whole family of per-bar facts, and the result on screen is an empty pane.

## Bars for another instrument or timeframe

A script may read an expression computed on another instrument with [[req.symbol()]], or on another timeframe of the chart's own instrument with [[req.timeframe()]]. The engine folds the chart's own bars for a timeframe read, so a host need not serve one. A read of another instrument it never can, so that is this duty.

### The request

Every read in the program is known at load, so the engine asks about each one then, once, and never discovers a new one during a bar. That is what lets you fetch in parallel and cache by instrument and timeframe.

| Field | Means |
|---|---|
| `id` | The engine's handle for this read. Every answer and refusal is about it |
| `read` | `"symbol"` for another instrument, `"timeframe"` for the chart's own instrument at another interval |
| `instrument` | The identity to resolve: the one the script named, or the chart's own on a timeframe read. Opaque |
| `exchange` | Where it trades: the one the script named, or the chart's own when it named none |
| `timeframe` | A timeframe string such as `"5"`, `"60"` or `"1D"` |
| `mode` | `"confirmed"`, `"developing"` or `"lookahead"`: whether the newest requested bar may be one still forming |
| `warmup` | How many requested bars of history the expression needs before its first value, or `null` when no number is known |

Every identity is already resolved when it reaches you, so you resolve an identity and never apply a language default. One absence is deliberate: a `"symbol"` read whose identity was meant to come from a setting that holds nothing. The chart's own instrument is never substituted there; refuse it.

**The range is yours to work out.** A request carries no dates, because the engine has been handed no bars when it asks. Cover the chart's own range, extended backwards by `warmup` requested bars and forward to the end of the requested bar the newest chart bar falls in. `warmup` is a floor, not a promise: history that starts later than it asks for gives a read that is absent for longer, never a wrong number.

**One request per read**, not per instrument. Two reads of the same instrument at the same timeframe are two requests; answer both, from one fetch if you cache.

### The answer

| Answer | Means |
|---|---|
| `{ bars }` | Your own bars for that instrument at that timeframe, oldest first, in the shape of duty 1. Never padded, extended or synthesised |
| `{ pending: true }` | Still fetching. The read is absent and [[req.isReady()]] is false; when the bars arrive, load again and recalculate over the whole history |
| `{ refused }` | You cannot answer. Below |
| Nothing | You do not serve this read. On a timeframe read the engine folds the chart's own bars; on another instrument it is OS6007 |

An answer arriving after the run started is a fresh load and a full recalculation, never a splice into a run already past the bars it would have changed.

### Refusing

**A refusal is reported, never an empty answer**, because an empty series looks exactly like an instrument that did not trade.

| Code | You are saying |
|---|---|
| [OS6007](/script/errors/data#os6007) | You do not know that instrument on that exchange |
| [OS6008](/script/errors/data#os6008) | You resolved it and have nothing over the range the chart covers |
| [OS6009](/script/errors/data#os6009) | Your source refused or did not answer. Carry its own words in `reason` |
| [OS6014](/script/errors/data#os6014) | You do not serve that timeframe for that instrument. List the ones you do in `available` |
| [OS6015](/script/errors/data#os6015) | The intraday timeframe is not a whole multiple of the chart's, so it cannot be folded |
| [OS5006](/script/errors/limits#os5006) | The script makes more reads than you allow. Raised at load, from the ceiling you state |

The reason reaches the script through [[req.error()]], and the study keeps drawing everything that does not depend on the failed read. Carry your source's words unchanged: "the data subscription does not cover this instrument" is actionable, "the request failed" is not. History that starts after the warmup is not OS6008: serve what you have.

### When the study goes away

A request belongs to the run that made it. A run ends when the study is removed, recompiled, reloaded after a settings change, or moved to another instrument or interval, and its outstanding requests are cancelled. Stop what work you can, and **never deliver an answer to a run that has ended**: a stale answer applied to the successor puts a line on the chart that no current script asked for. Cancellation is reported to nobody.

## Bar state

The eight bar facts split cleanly. **The host states the four that are about the delivery**, which no array of bars can reveal: [[bar.isNew]], [[bar.isConfirmed]], [[bar.isRealtime]] and [[bar.updates]]. **The engine derives the four that are about the dataset**: [[bar.index]], [[bar.count]], [[bar.isFirst]] and [[bar.isLast]]. A fact the engine can compute is never also stated by the host, because two sources for one number can disagree and no rule would say which wins.

In the JavaScript engine, `append` and `update` are `isNew` and the update count, so you pass only `isConfirmed` and `isRealtime`. The Python engine takes all four in its `BarState`.

| | `isNew` | `isConfirmed` | `isRealtime` | `updates` |
|---|---|---|---|---|
| A history load, every bar | true | true | false | 1 |
| A live bar as it forms | true, then false | false until its interval has elapsed, then true | true | 1, 2, 3 and on |

**Confirmation is one way.** A bar you confirmed is never revised and never handed back unconfirmed: markers, alerts and orders are applied on confirmation, and an order cannot be unplaced.

**A realtime feed carries ticks, not bars.** Turning ticks into bars is the host's job, and the engine is handed the result. Bar boundaries are a venue and session question you already answer when you draw a chart, and reading a feed from inside a bar would break replay. Two hosts that aggregate ticks differently hand the engine different bars and get different numbers; what the engine guarantees is that identical bars give identical numbers.

When you cannot tell whether the newest bar has closed, state it unconfirmed and confirm it when the next bar arrives: one bar late is the safe direction. With no realtime feed at all, state `isRealtime` false and confirm every bar. Replaying stored bars as if live, state what is true of the replay.

## Orders

This duty is for a host that lets scripts trade. The engine states what the strategy decided; your platform makes the order and reports back what happened. The engine never reads the account's position, because a position on a contract is shared with every other strategy and every manual trade on it. A strategy's position is folded from the orders it sent and the frames you report.

### What the engine hands over

An **order intent**, at the end of a confirmed bar, through your route. It is not an order: a condition that was true halfway through a bar and false at its close produces none.

| Field | Means |
|---|---|
| `intentId` | Unique within the run. Every frame about this order carries it back |
| `kind` | `"place"`, `"cancel"` or `"bracket"` |
| `instrument` | The resolved identity, `{ symbol, exchange }`. Never a symbol the engine assembled |
| `side` | `"buy"` or `"sell"`. Absent on a cancellation, and on a bracket, whose side is the position's own |
| `qty` | The quantity, in the unit `qtyType` names |
| `qtyType` | The script's own unit, passed through untranslated. A quantity the engine worked out from fills, as a flattening order's is, is in units |
| `type` | `"market"`, `"limit"`, `"stop"` or `"stopLimit"`, following the prices given |
| `limit`, `trigger` | The limit price and the stop trigger, where there are any |
| `target`, `stop` | A bracket's target and stop, as prices |
| `profit`, `loss` | A bracket's target and stop as distances from the entry, where the script stated them that way |
| `tag` | The script's own label, `""` when it named none. A cancellation names the tag it cancels |
| `product` | The script's `product` option, such as `"intraday"`, passed through untranslated |
| `positionRef` | The position this order belongs to. `0` on a cancellation, and on a bracket set while there is nothing to protect |
| `bar` | The index and open time of the bar whose close decided it |

Four things hosts get wrong:

- **Translate `product` yourself.** A product name is a venue's own word, and only you know the venue. Report what you actually sent in the frame, so both are on the record when they differ.
- **Never multiply a quantity by a lot size the engine did not state.** On NFO, one lot of a contract whose lot size is 75 is a quantity of 75 units; the engine passes the unit it was given, and converting is yours.
- **A bracket is an instruction, not an implementation.** Rest orders at the destination or watch the market yourself; the engine learns what happened only from frames. A trailing stop is never part of a bracket: when one is hit, you receive an ordinary exit order.
- **A distance stays a distance.** On the bar that places an entry and its bracket together nothing has filled yet, so a `profit` or `loss` is measured from the entry's fill, which you see first.

### What you report back

An **order frame**: a cumulative snapshot of one order as your destination describes it.

| Field | Means |
|---|---|
| `intentId` | Which intent this is about. A frame the engine does not recognise is ignored |
| `status` | One word from the vocabulary below |
| `filledQty` | **Cumulative** filled quantity since the order was sent |
| `avgFillPrice` | The average price of that whole quantity. Absent while nothing has filled |
| `orderRef` | Your destination's own reference. Recorded and shown, never parsed |
| `sentInstrument`, `sentProduct` | What you actually sent, after your own translation |
| `time` | Your destination's timestamp for this frame, UTC milliseconds |
| `text` | Your destination's own words for a rejection or cancellation, unparaphrased |
| `seq` | Your destination's sequence number for this order, where it has one |

**Frames are cumulative, not deltas.** Every frame restates the whole life of one order. A reconnecting session that resends its last frames, a repeated frame and two frames that cross in flight are then all harmless; under a delta scheme each of them is a phantom fill.

| Status | Means | Ends the order | You may send it |
|---|---|---|---|
| `placed` | Sent, and nothing has come back yet | No | No: it is the engine's own |
| `working` | Live at the destination, not completely filled | No | Yes |
| `triggerPending` | Accepted, waiting for its trigger price | No | Yes |
| `filled` | The whole quantity is filled | Yes | Yes |
| `cancelled` | Ended by a cancellation | Yes | Yes |
| `rejected` | Refused, with the destination's own text | Yes | Yes |
| `expired` | Ended without filling, by the destination's own rule | Yes | Yes |

**A partial fill is a quantity, not a status**: a `working` frame with a non-zero `filledQty`. Map your destination's own words onto this vocabulary, and **report a status you cannot map as the nearest word that does not end the order**, with the destination's words in `text`. Reporting an unknown state as terminal tells a strategy an order is dead and frees it to place another while the first may still be live. A fill that arrives after a cancellation was acknowledged is still folded.

Report at least every frame that changes an order's status or filled quantity. A host that reports only terminal frames conforms, but a script waiting for a working order to clear then waits blind.

### When a frame takes effect

Deliver frames whenever your destination speaks, one at a time, through the engine's intake: `engine.deliver(frame)` in JavaScript, `ledger.deliver(frame)` in Python. The engine folds them at the next bar boundary, before that bar runs, so every position fact is constant for the length of an execution and a forming bar sees the same position on every update. The intake takes one frame, returns nothing, and is the only way in.

```js title="orders.mjs"
import { readFileSync } from "node:fs";
import { load } from "openalgo-script";
import { compile } from "./compile.mjs";

const outbox = [];   // intents to send, filled by the route during a bar
const inbox = [];    // frames your destination sent back, delivered between bars

const host = {
  instrument: {
    symbol: "NIFTY25JANFUT", exchange: "NFO", interval: "5", timezone: "Asia/Kolkata",
    tickSize: 0.05, lotSize: 75, currency: "INR", instrumentType: "future", hasVolume: true,
    session: { start: "09:15", end: "15:30", days: [1, 2, 3, 4, 5] },
  },
  // Called at the end of a decided bar, once per order call, with the intents it became.
  route(effect, bar) {
    for (const intent of effect.intents) outbox.push(intent);
  },
};

const { program } = compile("orb.os", readFileSync("orb.os", "utf8"));
const loaded = load(program, { host });
if (!loaded.ok) throw new Error(`${loaded.diagnostic.code}: ${loaded.diagnostic.message}`);
const engine = loaded.engine;

// Stand-in for your order API: acknowledges, then fills at once.
function send(intent, price, time) {
  inbox.push({ intentId: intent.intentId, status: "working", filledQty: 0, avgFillPrice: null, orderRef: `R${intent.intentId}`, time });
  inbox.push({ intentId: intent.intentId, status: "filled", filledQty: intent.qty, avgFillPrice: price, orderRef: `R${intent.intentId}`, time });
}

for (const bar of bars) {
  // Between bars: deliver every frame that arrived. They are folded before the bar runs.
  for (const frame of inbox.splice(0)) engine.deliver(frame);

  const result = engine.append(bar);
  if (result.diagnostic) throw new Error(result.diagnostic.message);

  // After the bar: send what it decided.
  for (const intent of outbox.splice(0)) send(intent, bar.close, bar.time);
}
console.log(engine.orders()); // the strategy's own ledger: one row per order, with status and fills
```

`orb.os` is the opening range breakout from [Python engine](/script/integrate/python-engine#running-a-strategy), and `bars` are your own. Each bar's result also reports `frames`: what the frames delivered before it did to the ledger.

### When you cannot answer

| Situation | What happens |
|---|---|
| Your engine has no `orders` capability | [OS6006](/script/errors/data#os6006) at load, naming it |
| The connection dropped and no status is available | The order keeps its last recorded status. **Silence is not a fill and not a cancellation.** The engine does not guess, retry or place a replacement |
| A frame about an intent the engine does not know | Ignored |
| A fill the strategy never asked for | Ignored by the strategy's ledger. Report it as an account event |
| Your destination refused the order | A `rejected` frame with its own text. The ledger row records both |

## Settings

A map from each input's key to a value, **per instance**: the same script added twice to one chart is two instances with two maps, which is what lets one be a 14 period reading and the other a 50.

**The key is the input's name, never its position.** `len = input(14, "Length")` is keyed `len`. An input no name receives, such as one written inside a declaration, is keyed by its title. A positional key survives no edit at all: inserting an input above another would move a stored value onto the wrong row, and both being numbers, nothing would say so. Two inputs cannot share a key; the compiler refuses the file instead.

| Input kind | Stored as |
|---|---|
| `number` | A number |
| `bool` | `true` or `false` |
| `string`, `select` | A string. A `select` value must be one of the declared options |
| `color` | `#rrggbbaa`, eight lower case hexadecimal digits |
| `source` | One of `open`, `high`, `low`, `close`, `hl2`, `hlc3`, `ohlc4`, `volume` |
| `interval` | A timeframe string |
| `time` | A wall clock string in the chart's zone, so a saved layout restores to the same wall clock in another zone |

Settings are read once, at load. **Changing one is a new load**, and the run starts again from bar 0, because a declaration may take a value from an input and a declaration is fixed before the first bar. A stored value that fails its input's type, bounds or options is [OS6019](/script/errors/data#os6019) and the program does not run; it never falls back to the default, because a dialog that silently ignores what the user typed is worse than one that says the value is out of range. A stored key the program no longer declares is kept and ignored, so removing an input and putting it back keeps the user's value.

The style rows no script declares, a plot's colour, thickness, line style and visibility, are your own storage; nothing in the compiled program describes them. A host that cannot store settings conforms, and says so rather than showing a dialog that appears to save.

## Identity: a symbol is opaque

**The engine never parses an instrument identity.** It compares identities for equality and hands them back unchanged: it never splits one on a separator, changes its case, builds one from parts, or infers an underlying, an expiry, a strike or a right from one. A naming scheme built around one market's derivatives means nothing on another, and a parsing rule in the language would make every renamed contract a compiler release. Your symbology is yours, which makes you the only participant that can own it correctly.

A script names a contract by what it is, and you resolve the description to whatever your symbology calls it. **A relative contract is resolved once, at the start of a run**, and every later bar request, order, report line and restart uses that resolved identity. "The at-the-money call of the nearest NFO expiry" is a different contract at the exit than at the entry if the price moved or the expiry rolled, and an exit that re-resolved would open a second position in a contract nobody chose while leaving the first one open. So persist the resolved identity with the run, treat a new expiry or a new trading day as a new run, and refuse a run whose description you cannot resolve at its start. The script-side surface for describing relative contracts, [[leg.relative()]] among it, is planned in 0.5.0; the host's side of the rule is fixed now.

## A conforming host

A host that implements this interface can say each of these, and someone else can check it:

1. **Bars**: open, high, low, close, volume and time, oldest first, strictly increasing, unadjusted and unreordered.
2. **No substitutions**: never a zero for an unknown volume, never absence for a real zero, never a default tick size, never a price carried forward.
3. **Instrument facts**: `hasVolume` always; every other fact when you have it; a session with its timezone and correct spellings.
4. **Bar state**: the delivery facts on every execution, none of the derived ones, bars built from the feed by you, and confirmation never withdrawn.
5. **Optional duties declared at load**, with your ceilings, so a program needing more is refused at load: OS6006 for a capability, OS5003 for a `limits` value, OS5006 for requests.
6. **Requests** answered or refused with a catalogue code and your source's words, never with an empty answer; covering the range; cancelled when a run ends.
7. **Orders**: `intentId` on every frame, cumulative frames through the intake, the status vocabulary or a mapping onto it, never an unknown state reported as terminal, and a rejection's own text.
8. **Settings** stored per input key, or a plain statement that they are not.
9. **Identity** treated as opaque, and relative contracts resolved once.
10. **What you do not do, declared** rather than discovered.

And what a host may not assume: that the engine will repair the bars; that absence and zero are interchangeable; that a script produces a symbol; that settings can change mid-run; that an order happened when the script called the function; that the engine tracks the account; that the engine calls back into your code during a bar; or that the engine runs in any particular language, process or machine. The [conformance suite](/script/integrate/conformance) tests an engine through a host's interface: a host that can serve a case directory through its own interface, and reproduce the expected output, has shown its side of duties 1 to 4 and 6 matches this page.

**Related.** [Two libraries](/script/integrate/overview), [JavaScript library](/script/integrate/javascript), [Python engine](/script/integrate/python-engine), [Chart adapter](/script/integrate/charts-adapter), [Compiled program](/script/integrate/compiled-program), [Other instruments](/script/data/other-instruments), [Sessions and time](/script/data/sessions-and-time), [Realtime and confirmation](/script/language/realtime-and-confirmation)
