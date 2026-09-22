---
title: Repainting
description: What repainting is, the four ways a script causes it, how the compiler warns you, and a checklist to run before a study or strategy is trusted with money.
---

A study **repaints** when what it shows for a past bar is not what it showed while that bar was happening. It is the difference between a study that looks brilliant on history and one that makes money, and most traders who have been caught by it could not say afterwards which line did it. This page defines repainting precisely, names the four ways an OpenScript (also called OpenAlgo Script) file can cause it, shows how to catch it, and lists the few cases where it is acceptable.

## What repainting is

:::key
A study repaints when the value it shows for a bar, after that bar has closed, differs from the value it showed while that bar was the newest one.
:::

Two different things move on a chart as new prices arrive, and only one of them is repainting.

| Movement | Example | Repainting? |
|---|---|---|
| The newest bar's value changes while the bar is still forming | [[close]] ticks up, so `sma(close, 20)` ticks up with it | No. The bar is not finished and neither is the answer |
| A closed bar's value changes later | A marker appears on a bar that is already twenty bars old | Yes |
| A closed bar's value changes when the chart is reloaded | The study drew nothing there this morning and draws a signal there now | Yes, and this is the worst kind |

The first row is ordinary. A study computed from a moving price moves, and nobody is misled, because the bar is visibly the newest one.

The other two rows are the problem, and it is not cosmetic. A backtest, a run of a strategy over past bars, measures what a study would have told you at the time. If the study's history is not what it said at the time, the backtest measured something that never existed: real arithmetic over imaginary signals.

### Why history hides it

A repainting study's past looks right. Every marker sits at a sensible place, every level is respected, every trend is entered near its start. It looks like a study that works, because it has been told the answers. The first evidence is usually a signal that appears and then disappears as you watch, and the second is a trading record that does not resemble the backtest.

## The four ways a script causes it

### 1. Acting on a bar that has not finished

A forming bar's `close` is the last traded price, its `high` may still be exceeded and its `low` may still be broken. Anything computed from them is provisional. The language defends you from this by default, in two ways:

- **Effects wait for the close.** [[signal()]], [[alert()]] and every order function do not fire on a bar that is still moving. The call waits until the bar closes, and if the condition is no longer true by then, it never happens. That is what makes a signal worth acting on.
- **Persistent values roll back.** Before each re-run of the moving bar, every `var` is restored to what it held at the end of the previous bar. Running the moving bar ten times gives the same answer as running it once, so the chart and a backtest of the same data agree. [Persistence](/script/language/persistence) has the details.

A script gives up those defences by writing `onUnconfirmed = true` in its declaration, by making a `"developing"` [higher timeframe read](/script/data/higher-timeframes#the-mode), or by writing `live var` instead of `var`.

```openscript title="Breakout, unguarded"
version 1

// Repaints. The entry is taken from a close that is still moving, so a bar that
// pokes above the level at 10:31 and falls back by 10:35 leaves a trade in the
// backtest that the market never offered anyone.
strategy("Breakout, unguarded", overlay = true, onUnconfirmed = true)

level20 = highest(high, 20)[1]

if close > level20
    buy(qty = 1)
```

```openscript title="Breakout, confirmed"
version 1

// Does not repaint. Without onUnconfirmed, the engine waits for the bar to
// close before it sends the order, and sends nothing if the close is back
// below the level.
strategy("Breakout, confirmed", overlay = true)

level20 = highest(high, 20)[1]

if close > level20
    buy(qty = 1)
```

The second script needs no extra state, no flag and no "wait one bar" logic. The default already is the guard, which is why `onUnconfirmed = true` has a long name and sits in the declaration, where a reviewer reads it first.

`live var` belongs here too. It keeps its value across the updates of the moving bar, so a value accumulated in one differs between the chart and a backtest of the same data, by design. The compiler says so with OS8011.

### 2. Reading a bar that had not happened yet

The second cause is a read that answers with information from the future. In OpenScript there is exactly one way to write it, and it is spelled out:

```openscript expect=OS8005
// The finished value of the day, shown on every chart bar of that day,
// including the ones before the value existed.
dayClose = req.timeframe("1D", close, mode = "lookahead")
plot(dayClose, "Day's close", style = "step")
```

`"lookahead"` gives a coarse bar's final value from its first chart bar. On a five minute NSE chart with a daily read, it hands 09:15 the number the day will close at. Every study built on it anticipates the day perfectly on history, and knows nothing extra when traded, because at the time there is no future to read.

The mode exists for one honest purpose, drawing a finished coarse candle across history as a picture, and its name makes sure nobody reaches it by accident. The compiler warns about it with OS8005. The compiled study also records the mode, so a host can mark the study as repainting; the /trading legend does not show such a mark today, so the warning and the word in the source are the disclosure.

The library refuses this shape everywhere else. [[pivotHigh()]] and [[pivotLow()]] report a pivot on the bar `right` bars **after** it formed, the first bar on which it is knowable. And a strategy's orders fill at the next bar's open by default, not at the close of the bar that decided them, because a decision made from a close cannot be filled at that same close in the real market. [Costs and fills](/script/strategies/costs-and-fills) covers the fill model.

### 3. Drawing a decision back in time

The third cause is different in kind. The values are honest, and the **drawing** is placed in the past:

```openscript
// pivotHigh reports a swing high on the bar five bars after it, the first bar
// on which it is known. Both drawings below put it back at the high itself.
pivot = pivotHigh(high, 5, 5)
plot(pivot, "Pivot", red, offset = -5)          // drawn five bars back
if not isNone(pivot)
    draw.label(time[5], pivot, "Swing high")    // anchored at the pivot bar's time
```

Nothing here is invented. The pivot really was at that bar, and the script found out five bars later. But the chart's past gains a marker it did not have five bars ago, so a reader who scrolls back sees a study that seems to have called the high at the high.

That makes it a disclosure problem rather than a data problem. Say in the study's title or comments that the marker arrives `right` bars late, and never let a strategy act at the anchor bar's price. A positive `offset` draws into the space past the newest bar and is not a repaint at all: nothing in the past moved.

### 4. Keeping state that the next load will not reproduce

The quietest cause. The study does not read the future and does not act on an unfinished bar; it just gives a different answer the next time the chart is loaded.

| Shape | Why a reload differs | The compiler |
|---|---|---|
| A `live var` accumulating over price updates | History has no updates within a bar, so the reloaded value is the bar by bar one | OS8011 |
| A stateful call inside a branch | Its state advances only on the bars where the branch ran | OS8001 |
| A persistent value holding [[bar.index]] | Every index shifts when older history is loaded | OS8014, a listed code the compiler does not raise yet |
| A running total from bar 0: [[cum()]], [[obv()]] | Bar 0 moves when more history loads, so the total starts somewhere else | No warning: this is what a running total is |
| A seeded average near the left edge | `ema(src, n)` is seeded from the first `n` bars, and those are different bars when more history loads | No warning: the seeding is part of the definition, and its effect fades as the average moves on |

The first three are script bugs. The last two are properties of the measurements, and the defence is to keep them off the part of the chart you decide from: do not trade from the first bars of a freshly loaded chart, and do not compare a running total across two different history loads. Where you need to remember a bar, store its [[time]], which never moves.

## How to see it

Four tests, cheapest first.

**Read the source for four words and two shapes.** The words are `"developing"`, `"lookahead"`, `onUnconfirmed` and `live var`. A file with none of them cannot repaint in the first two ways above. That is not a rule of thumb, it is a property of the language: the default mode is `"confirmed"`, effects wait for the close, and `var` rolls back. The shapes are the third way: a negative `offset` on a plot, and a drawing anchored at a past bar's time, such as `time[5]`.

**Watch one bar close.** Note the study's value while the newest bar is forming, wait for the bar to close, and compare. The value should settle once and never move again. If a marker appears and disappears while you watch, the study acts on unconfirmed data.

**Reload the chart.** Note where the markers are, reload /trading, and look again. Markers that moved fail the fourth test above.

**Measure it.** History cannot show you a repaint, because history is the repainted version. So measure the drift as bars form, with a script. The compiler warns about the `live var` lines, and for this study that is the point:

```openscript expect=OS8011 title="Repaint meter"
version 1

// A meter, not a signal. It records what a read said on the first update of
// each bar and plots how far the read has moved since.
study("Repaint meter", precision = 4)

tf = input("1h", "Interval to test", kind = "interval")

watched = req.timeframe(tf, close, mode = "developing")

// live var on purpose: an ordinary var is restored before every re-run of the
// moving bar, which would erase the very thing being measured.
live var seenAt = none
live var firstValue = none

if seenAt != time
    seenAt = time
    firstValue = watched

drift = isNone(firstValue) ? none : watched - firstValue

plot(drift, "Drift since this bar opened", orange, width = 2)
level(0, "No drift", gray)
```

On history every bar runs once, so the line is flat at zero and the study looks pointless. Leave it on a chart through a trading session and it will not be flat: its height is how far a signal taken from the same read could move before the bar closes. Change `"developing"` to `"confirmed"` and the line stays at zero, which is what the default mode buys you.

## What the compiler tells you

Warnings never stop a script. They are reported on the line, with a code and a fix, because the shapes they name are almost always mistakes.

| Code | Says | Why it matters here |
|---|---|---|
| OS8001 | A stateful call inside a branch advances only on the bars where the branch runs | The call's history depends on which bars ran, so a reload can differ |
| OS8002 | The file sets `onUnconfirmed = true` and reads another interval or instrument | Two sources of provisional data stacked |
| OS8005 | A read uses `"lookahead"` | The study shows values its bars could not have known |
| OS8011 | A `live var` keeps its value across the updates of the moving bar | The chart and a backtest differ by design |

OS8004 (a branch on an absent condition that changes a value used later) and OS8014 (a persistent value that holds a bar index) are listed among the warning codes, but the compiler does not raise them yet, so check for those two shapes yourself. A `"developing"` read carries no warning: the mode word on the line is its disclosure. [OS8xxx Warnings](/script/errors/warnings) has every code.

What the compiler cannot tell you is whether a repaint is acceptable. It does not know whether the study is a dashboard a person reads or a filter a strategy trades. That judgement is yours, which is why the mechanism is a disclosure rather than a ban.

## What is not repainting

A study accused of repainting is often doing something else.

- **The newest bar moving.** A study computed from a moving price moves. Wait for the close.
- **An empty left edge.** A call that needs `len` bars is absent until `len` bars exist, and absence draws a gap rather than a zero so that you can see it. [Warmup](/script/language/warmup) explains the rules.
- **An alert that did not fire.** A condition true at 10:31 and false at the close produces no alert, on purpose. That is effects waiting for the close, not a missed signal.
- **A late pivot.** A marker that arrives five bars after the high is the honest cost of knowing a pivot. Drawing it back at the high is the part that needs disclosing.
- **A read that arrives late.** A [read of another instrument](/script/data/other-instruments) is absent until the host answers, and the study is then calculated again with it present. The gap was the truth at the time.

## When repainting is acceptable

When the reader can see it and nothing acts on it. That one rule covers every acceptable case:

| Case | Shape | Why it is acceptable |
|---|---|---|
| A finished daily candle drawn over history | `"lookahead"` | The picture is the point, and nothing trades from it |
| A dashboard showing the day's range so far | `"developing"` | "So far" is the question, and a person is reading it |
| A swing marker drawn back at its pivot | Negative `offset` | The lag is real, disclosed, and nothing trades at that bar |
| A counter of price updates within a bar | `live var` | Counting updates is the stated intent |

And the rule that follows: **no order, and no alert a person will act on, may depend on a repainting value.** If a `"developing"` read is on the chart for the eye, drive the decisions from a confirmed read of the same expression. Two reads of one expression in two modes is cheap and makes the split explicit:

```openscript title="Day range, read twice"
version 1

study("Day range, read twice", overlay = true, precision = 2)

// For the eye: what the day has done so far. It moves, and that is the point.
soFar = req.timeframe("1D", high, mode = "developing")

// For the decisions: only days that have closed. It never moves.
settled = req.timeframe("1D", high, mode = "confirmed")

plot(soFar,   "Today's high so far", fade(aqua, 40), style = "step")
plot(settled, "Yesterday's high",    aqua, width = 2, style = "step")

// The marker reads the settled value only. Nothing here acts on soFar.
if crossUp(close, settled)
    signal("ABOVE YESTERDAY")
```

## A review checklist

Run down this list before a study is trusted with money.

| Question | Where to look | A good answer |
|---|---|---|
| Does any read say `"developing"` or `"lookahead"`? | Every `req.` call | None, or one whose result nothing trades from |
| Does the declaration say `onUnconfirmed = true`? | The `study` or `strategy` line | No, or every decision is guarded by [[bar.isConfirmed]] |
| Is any `var` a `live var`? | Every declaration | No, unless counting updates is the study's subject |
| Does a persistent value hold `bar.index`? | Every `var` assignment | No: it holds `time` |
| Is any stateful call inside an `if` or a ternary arm? | Every branch | No: computed at the top level, hidden with `none` |
| Does any plot use a negative `offset`, or any drawing anchor at a past bar? | Every `plot` and `draw.` call | Only where the lag is stated in the title or comments |
| Did the study survive a reload? | The chart | The markers are where they were |

**Related:** [Higher timeframes](/script/data/higher-timeframes), [Realtime and confirmation](/script/language/realtime-and-confirmation), [Persistence](/script/language/persistence), [Other instruments](/script/data/other-instruments), [Backtesting](/script/strategies/backtesting)
