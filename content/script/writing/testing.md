---
title: Testing scripts
description: Check that a script computes what you think on the bars you think, with hand calculations, warmup probes, forming-bar probes, fixed bars and side-by-side comparisons, then work through a checklist before a strategy trades.
---

This page shows how to prove that an OpenScript script (OpenScript is also called OpenAlgo Script) computes what you think it computes, on the bars you think it computes it, and how to decide honestly whether a strategy is ready for real orders. Every check here is a short script or a few lines you add to one, and each catches a different kind of mistake.

## Why a chart script needs testing

A script is short, so it feels as though it cannot hide much. It can. Four properties of running once per bar make a wrong script look right.

- **It runs tens of thousands of times.** A bug that fires on one bar in a thousand fires fifty times over 50,000 bars, and every one of them is off the edge of the screen.
- **Warmup is out of sight.** The bars where a value is absent are at the left of the chart, where nobody scrolls, and a fallback of zero looks like data. See [Warmup](/script/language/warmup).
- **The newest bar behaves differently from every other bar.** During market hours it runs again on every update, and it is the only bar you ever watch.
- **The failure is money.** A study that is slightly wrong is a nuisance. A strategy that is slightly wrong is a position in NIFTY futures you did not mean to hold.

Testing here means five checks and a checklist. Do the first four checks before you trust a number, the fifth whenever you replace a calculation, and the checklist at the end before you trust an order.

## Check a value against a hand calculation

Pick one bar, put the inputs to a line on the chart, do the arithmetic yourself and compare. This is the only check that shows the value is right at all; everything else shows it is right in the same way everywhere.

```openscript title="Hand check"
version 1

// A probe, not a study. Run it once against bars you can read off the
// chart, then delete it.

study("Hand check, mean of three", overlay = true, precision = 2)

checkAt = input(-1, "Check this bar index, -1 for none", min = -1)

mean = sma(close, 3)

// Written out for exactly three terms on purpose. A probe with a loop in it is
// a second implementation of the thing under test, with its own bugs, and two
// wrong answers can agree. The terms are added oldest first, the order the
// library adds a window in, so the two results can match to the last digit.
if bar.index == checkAt
    byHand = (close[2] + close[1] + close) / 3
    draw.label(time, high,
            "closes " + text(close[2], 2) + ", " + text(close[1], 2) + ", " + text(close, 2) +
            " | library " + text(mean) + " | by hand " + text(byHand) +
            " | difference " + text(mean - byHand),
            color = fade(black, 20))

plot(mean, "Mean of three", aqua)
```

Set **Check this bar index** to a bar after the first two, and the label appears on that bar with every number you need. `text()` with no decimals writes each value in full, so nothing is hidden by rounding.

You can demand an exact match, because the language does. All arithmetic is 64-bit floating point with round-to-nearest-even, in the order the source writes it, and an engine may not reorder or fuse operations. [[round()]] takes halves away from zero. Arrays are always walked in index order. There is no randomness, and the only clock a script can read during a bar, [[chart.now()]], is a value the host fixes. Every engine must produce the same result to the last bit, so a disagreement between your arithmetic and the script's is a real disagreement.

Check three bars, not one: an early bar just after warmup ends, a bar in the middle, and a bar on a session boundary or a gap, such as the 09:15 bar after a weekend. Those are the three places the arithmetic differs for different reasons.

When your arithmetic and the script disagree, work out which is wrong before changing anything. The usual causes:

| Cause | Example |
|---|---|
| Adding in a different order | `(close + close[1] + close[2]) / 3` can differ from `sma(close, 3)` in the last digit, because floating point addition depends on order and the library adds a window oldest first |
| An off-by-one in a lookback | `close[len]` where you meant `close[len - 1]` |
| A window that includes the current bar when you assumed it did not | [[sma()]] over `len` bars includes this bar |
| Population against sample standard deviation | [[stdev()]] divides by `len` by default; `sample = true` divides by `len - 1` |
| Remainder against modulo | `-7 % 3` is `-1`, because `%` takes the sign of the left side; `mod(-7, 3)` is `2`, because [[mod()]] takes the sign of the right |

## Check the warmup

**Warmup is a promise, not a hint.** A warmup of "bar `len - 1`" means the call returns no value on bars 0 to `len - 2` and a value from bar `len - 1` onward, on every engine, with no bar of slack. That makes it testable, and a warmup one bar out is a genuine defect.

The probe below works for any value. Swap the line that computes `value` for the one you want to test.

```openscript title="Warmup probe"
version 1

study("Warmup probe", precision = 4)

length = input(14, "Length", min = 2, max = 200)

value = rsi(close, length)

// The first bar the value exists on. isNone(firstBar) keeps it at the first:
// without that guard this would record the most recent bar with a value.
var firstBar = none
if isNone(firstBar) and not isNone(value)
    firstBar = bar.index

panel = table("Warmup", 3, 2, position = "topLeft", textColor = silver)

if bar.isLast
    cell(panel, 0, 0, "first bar with a value")
    cell(panel, 0, 1, isNone(firstBar) ? "never" : text(firstBar, 0))
    cell(panel, 1, 0, "documented warmup")
    cell(panel, 1, 1, text(length, 0))  // rsi's first value is on bar len
    cell(panel, 2, 0, "bars on the chart")
    cell(panel, 2, 1, text(bar.count, 0))

plot(value, "RSI", purple)
```

Compare the first cell with the "first value" line in the function's [reference](/script/reference/technical-analysis) entry. The ones worth remembering:

| Call | First bar with a value | Why it is not what you might guess |
|---|---|---|
| [[sma()]], [[ema()]], [[highest()]], [[stdev()]] over `len` | `len - 1` | `len` values exist once bar `len - 1` has arrived |
| [[rsi()]] over `len` | `len` | It uses `len` changes, and a change needs two bars |
| [[change()]], [[crossUp()]] | 1 | Both read the previous bar |
| [[mom()]], [[roc()]] over `len` | `len` | The same extra bar, for the same reason |
| `macd(src, fast, slow, signal)` | Element 0 at `max(fast, slow) - 1`; elements 1 and 2 at `max(fast, slow) + signal - 2` | The signal line is an average of the MACD line, so it starts `signal - 1` bars later |
| [[atr()]] over `len` | `len - 1` | [[trueRange()]] on bar 0 is `high - low`, the one deliberate exception to absence spreading |
| [[barsSince()]], [[valueWhen()]] | The first bar the condition is true | Absent before that, not zero: zero would mean "it happened on this bar" |
| `sma(ema(close, 10), 10)` | 18 | Warmups add up, because an absent source makes an absent result |

This probe catches two mistakes nothing else does: a value that is absent for ever because a stateful call sits in a branch that never runs ([OS8001](/script/errors/warnings#os8001)), and a value that starts one bar too early, which is the mark of a hand-written calculation that looks ahead.

## Check the forming bar

During market hours the newest bar runs again on every update. Before each run, the engine restores every `var`, including the contents of arrays, to what it held at the end of the previous bar. **So running the forming bar ten times gives the same answer as running it once.** A script behaves this way unless it deliberately says otherwise. See [Realtime and confirmation](/script/language/realtime-and-confirmation).

Test that yours does. This probe counts both things at once. Its `live var` line raises warning [OS8011](/script/errors/warnings#os8011) on purpose: here the difference the warning describes is the measurement.

```openscript title="Forming bar probe" expect=OS8011
version 1

study("Forming bar probe", precision = 0)

// A var is restored before each run of the forming bar, so it counts bars.
var barsSeen = 0
barsSeen += 1

// A live var is not restored, so it counts runs.
live var runs = 0
runs += 1

panel = table("Forming bar", 4, 2, position = "bottomRight", textColor = silver)

if bar.isLast
    cell(panel, 0, 0, "bars counted, var")
    cell(panel, 0, 1, text(barsSeen, 0))
    cell(panel, 1, 0, "runs counted, live var")
    cell(panel, 1, 1, text(runs, 0))
    cell(panel, 2, 0, "bar.updates")
    cell(panel, 2, 1, text(bar.updates, 0))
    cell(panel, 3, 0, "this bar is confirmed")
    cell(panel, 3, 1, bar.isConfirmed ? "yes" : "no")

plot(barsSeen, "Bars", aqua)
```

On history the two counters agree. During the session, `barsSeen` keeps counting bars while `runs` climbs with every update. If a counter in your own script behaves like `runs` when you meant it to behave like `barsSeen`, it is a `live var`, and the chart and a backtest of the same bars will disagree.

The other half of the forming bar is what a script is allowed to do on it. [[signal()]], [[alert()]], [[print()]] and orders wait until the bar is confirmed, unless the declaration sets `onUnconfirmed = true`. If the condition is no longer true when the bar closes, they never happen at all. Test this before you rely on it: a strategy that acts on the close of a bar in a backtest and on a touch in the middle of a bar in real trading is not the same strategy.

## Hold the bars still

Everything above assumes the data holds still. Make it: a test on bars that keep arriving is an anecdote. In the Backtest panel on the /trading page, pick a date range that has already ended and keep it for every run you compare. Change one thing at a time, the script or the inputs, never both.

A result is reproducible when you can name three things: the script revision, the inputs, and the bars. The Scripts panel keeps no revision history in this release: each save replaces the file, and the server keeps only the previous save as a backup. So keep a copy of the exact text you tested. See [The editor](/script/getting-started/the-editor).

A light habit gets most of the value: keep a folder per script holding the bars you tested against, the settings you used and the output you checked by hand. Run it again after every edit. The first time it catches a change you did not intend, it has paid for itself.

If you work with the `openalgo-script` or `openscript` libraries directly, the language's own conformance suite (the shared set of test cases every engine must pass) is the model to copy. One case is one folder, and every byte of input lives in it: the case never names a symbol for a runner to fetch, never opens a network connection and never reads the wall clock.

```text
cases/
  my-bands/
    warmup/
      case.json
      script.os
      bars.csv
      expected.csv
      settings.json
      notes.md
```

```json
{
  "id": "my-bands/warmup",
  "category": "semantics",
  "profile": "core",
  "languageVersion": 1,
  "description": "The upper band is absent on bars 0 to 18 and present from bar 19.",
  "asserts": ["values"],
  "tolerance": { "abs": 0, "rel": 0 }
}
```

Three fields do real work. `languageVersion` is pinned, so the case is compiled the same way for ever. `asserts` names only the outputs the case checks, so a change to drawings cannot break a case about warmup. `tolerance` defaults to exact, because engines that disagree on a decimal have a defect, not a rounding difference. A case whose script calls [[chart.now()]] also fixes that clock with a `now` field. [Your own engine](/script/integrate/conformance) describes the full format.

## Compare two implementations

When you replace a calculation, for speed or for clarity, the test is not that the new one looks right. It is that both produce the same numbers on every bar, and that when they do not, you know the first bar where they part. That is the [first-offender pattern](/script/writing/debugging#the-first-offender-pattern), and it is the standard way to check any optimisation.

Keep the old calculation in the file, plot the difference, run it, and only then delete the old one.

```openscript
fn myFasterMean(src, len) =>
    var running = 0.0
    running += src
    if bar.index >= len
        running -= src[len]
    bar.index >= len - 1 ? running / len : none

mine = myFasterMean(close, 20)
reference = sma(close, 20)

comparable = not isNone(mine) and not isNone(reference)
plot(comparable ? mine - reference : none, "Difference", fuchsia, scale = "left")
```

A difference line flat at zero across the whole chart is a stronger statement than any number of spot checks, and it takes one look. A running total like this one can drift from a fresh sum in the last few decimals over a long chart; [Profiling and speed](/script/writing/profiling#rolling-windows-add-one-drop-one) explains why, and the difference plot is how you see whether it matters.

## Before you trust a strategy with money

Studies mislead. Strategies cost. Work down these lists, and treat any row you cannot answer as a no.

### The numbers

| Check | How |
|---|---|
| The calculation matches a hand calculation on three bars | [Check a value against a hand calculation](#check-a-value-against-a-hand-calculation) |
| Every warmup matches the documented one | [Check the warmup](#check-the-warmup) |
| The script gives the same answer however often the forming bar runs | [Check the forming bar](#check-the-forming-bar) |
| The result is reproducible from fixed bars and fixed settings | [Hold the bars still](#hold-the-bars-still) |
| No warning is outstanding | Save, and read the console under the editor. [OS8001](/script/errors/warnings#os8001), [OS8009](/script/errors/warnings#os8009), [OS8011](/script/errors/warnings#os8011), [OS8012](/script/errors/warnings#os8012) and [OS8015](/script/errors/warnings#os8015) each describe a shape that is nearly always a bug |

### The honesty

| Check | Why it matters |
|---|---|
| No higher timeframe read uses `mode = "lookahead"` | That mode reads a higher timeframe bar's final value from its first lower timeframe bar. It repaints history, permanently and by design |
| A `"developing"` read is guarded, or accepted knowingly | It includes the higher timeframe bar still forming, so its value on the newest bars moves until that bar closes |
| `onUnconfirmed` is not set, or every use is guarded by [[bar.isConfirmed]] | Acting on an unconfirmed bar is where repainting comes from |
| `fillOn` is `"nextOpen"` | A decision made from a bar's close cannot be filled at that same close in a real market, which is why it is the default |
| Every pivot's lag is accounted for | [[pivotHigh()]] and [[pivotLow()]] report a pivot `right` bars after it formed, the first bar on which it is knowable |
| No `var` holds a bar index | Loading more history renumbers every bar. Store [[time]] instead |

See [Repainting](/script/data/repainting) for the whole subject.

### The cost model

| Check | Why |
|---|---|
| `slippage` is set to something you would actually pay | It defaults to zero, which is nobody's market |
| `commission` and `commissionType` match what you actually pay | A strategy with many small trades lives or dies here. See [Costs and fills](/script/strategies/costs-and-fills) |
| `qtyType` and `qty` mean what you think | `"units"`, `"lots"`, `"cash"` and `"equityPercent"` are four different position sizes, and one NFO lot is many units |
| The result survives doubling the costs | If it does not, the edge was the cost model |

### The robustness

| Check | Why |
|---|---|
| It still works on neighbouring input values | A result that exists only at length 14 and vanishes at 13 and 15 is a coincidence you have fitted |
| It works on bars you did not look at while building it | Hold some back from the start, and do not peek at them twice |
| It works on more than one instrument, or you know why it does not | A rule that only works on one symbol is a claim about that symbol |
| The trade count is large enough to mean anything | Three good trades is a story, not a result |
| The worst losing run is one you could sit through | The number that ends most strategies is the drawdown, not the average trade |

### The operations

| Check | Why |
|---|---|
| It is flat when you expect it to be | Test the script's own square-off on a real session end, 15:30 on NSE and NFO. `closeOnSessionEnd` is accepted and not acted on in version 0.5.0, so the exit has to be a rule in the script: see [Exiting on the clock](/script/strategies/exits-and-brackets#exiting-on-the-clock) |
| It behaves on a day with a gap, a halt or a missing bar | Absence reaches a plot as a gap; make sure it reaches your decisions as "do nothing" |
| It has run in sandbox trading (analyzer mode in OpenAlgo), on real market data, long enough to see every branch | The Strategies panel starts a run in sandbox while OpenAlgo is in analyzer mode. Run there first, then live. See [Sandbox and live](/script/strategies/sandbox-and-live) |
| You know what it does when a data read fails | [[req.isReady()]] and [[req.error()]] let a script say "not yet" instead of guessing |

{{screen: strategies-panel}}

## What testing does not cover

The language's conformance suite tests the compiler's diagnostics and the engines' output. It deliberately does not test speed, memory, the look of a chart or the wording of a message. Nor does anything on this page. Those matter, but a test is not what fixes them: see [Profiling and speed](/script/writing/profiling) and [Limits](/script/writing/limits).

And no test says whether a strategy is a good idea. It says whether the script does what you told it to. Keeping those two apart is most of the discipline.

**Related.** [Debugging](/script/writing/debugging), [Profiling and speed](/script/writing/profiling), [Backtesting](/script/strategies/backtesting), [Reading a report](/script/strategies/reading-a-report), [Sharing scripts](/script/writing/sharing-scripts), [Warmup](/script/language/warmup)
