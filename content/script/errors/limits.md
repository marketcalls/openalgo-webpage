---
title: OS5xxx Limits
description: The errors raised when a script runs out of a budget: loop turns, array and string size, drawing objects, nesting, state, program size, data requests and time per bar.
---

This page covers the OS5xxx codes of OpenScript (also called OpenAlgo Script): the errors raised when a script reaches one of the budgets it runs inside. Every limit is a number you can see, and reaching one is always reported, never absorbed: a loop that runs out of turns stops the bar rather than breaking out early and handing you a plausible wrong number. Most of these codes point at a script that grows without bound, such as a loop with no exit, an array nobody trims or a drawing created on every bar, so the fix is usually a small change to the script rather than a bigger budget.

## When they appear

The codes fall into three groups by the moment they are found.

| When | Codes | What happens |
|---|---|---|
| When the script compiles | [OS5005](#os5005) for nesting in the source | Shown in the console under the editor. Nothing runs |
| When the program loads, before bar 0 | [OS5003](#os5003), [OS5004](#os5004), [OS5006](#os5006), [OS5009](#os5009), and [OS5005](#os5005) for call depth | The study or run is refused whole and nothing is drawn. On a chart, /trading shows the code and the message in a notice |
| While a bar runs | [OS5001](#os5001), [OS5002](#os5002), [OS5007](#os5007), [OS5008](#os5008), [OS5010](#os5010) | The run stops at that bar, as for any [runtime error](/script/errors/runtime#when-they-appear) |

The first five rows of the table below have defaults every script meets. The last row holds ceilings that exist only when the **host** sets them. The host is the application the engine runs inside: in OpenAlgo, the /trading page for charts and backtests, and the strategy runner on the OpenAlgo server for a deployed strategy. Neither sets a ceiling on program size, state, data requests or time per bar, so [OS5003](#os5003), [OS5004](#os5004), [OS5006](#os5006), [OS5007](#os5007) and [OS5009](#os5009) come only from hosts that set their own, such as a server running many strategies for many people, or your own integration.

| Budget | Default | Changed by the script | Code |
|---|---|---|---|
| Loop turns per bar, all loops together | 2,000,000 | Yes, `limits(loops = n)` | [OS5001](#os5001) |
| Elements in one array | 1,000,000 | No | [OS5002](#os5002) |
| Characters in one string | 100,000 | No | [OS5008](#os5008) |
| Drawing objects held at once | 10,000 | No | [OS5010](#os5010) |
| Nesting in the source, and nested calls | 128 levels, and 64 calls | No | [OS5005](#os5005) |
| Time per bar, state regions, data requests, program size, `limits()` values | No ceiling unless the host sets one | No | [OS5007](#os5007), [OS5004](#os5004), [OS5006](#os5006), [OS5009](#os5009), [OS5003](#os5003) |

[Limits](/script/writing/limits) explains every budget in full, with the reasoning behind each number.

## A script that stays inside its budgets

This study draws a box on every 20 bar breakout, keeps a rolling window of closes and measures the current rising run. Each part is written so that it cannot grow without bound, however long the chart.

```openscript title="Recent breakouts"
version 1
study("Recent breakouts", overlay = true)

keep = input(20, "Boxes kept", min = 1, max = 500)

// Drawings: delete the oldest as the newest arrives, and remove its element
// with it, so the count stays bounded (OS5010).
var zones: array<box> = []
if crossUp(close, highest(high, 20)[1])
    // Times are in milliseconds, so 3600000 is one hour to the right.
    push(zones, draw.box(time, high, time + 3600000, low))
if size(zones) > keep
    draw.delete(element(zones, 0))
    shift(zones)

// Arrays: a window with a fixed length, never a log that only grows (OS5002).
var closes: array<number> = []
push(closes, close)
if size(closes) > 250
    shift(closes)

// Loops: every while has a cap and a counter that moves (OS5001).
run = 0
while run < 50 and close[run] > close[run + 1]
    run += 1

plot(avg(closes), "Mean of the last 250 closes", silver)
plot(close[run], "Start of the current rising run", aqua, style = "step")
```

## Loops and time

{{error: OS5001}}

Every turn of every loop in a bar counts against one budget, 2,000,000 turns by default, shared by all the loops that run in that bar and reset at the start of the next, so a long chart is never by itself a reason to fail. When the budget runs out, the bar stops. The engine does not break out of the loop and carry on, because a loop cut short produces a number that looks right and is not. The message names the budget and the line of the loop that was still running, and the fix suggests a larger budget.

Almost always the cause is a `while` whose condition never becomes false, because nothing in its body changes what the condition tests. Make sure every loop ends first: give a `while` a counter and a cap, as the example above does. Raise the budget with `limits(loops = n)` under the declaration only when the work really is that large, and say why in a comment. See [Control flow](/script/language/control-flow).

{{error: OS5007}}

A host that runs many strategies can give each bar a wall clock budget, so that one slow script cannot hold up the rest. The message names the bar, the time it took and the budget. There is no `limits()` option for this budget, and the engine reads no clock at all unless the host asks it to, so the same script cannot pass on a fast machine and fail on a slow one by default.

A slow bar is nearly always repeating work over the whole history: a loop from 0 to [[bar.index]] costs one turn on the first bar and 40,001 on bar 40,000, so the study slows down as the chart grows. Carry a running value in a `var` instead, or use [[cum()]]. See [Profiling and speed](/script/writing/profiling).

## Memory: arrays, strings and drawings

{{error: OS5002}}

An array holds at most 1,000,000 elements, and `limits()` cannot raise that. The ceiling exists so that one script cannot use up the memory of the browser tab and take the chart down with it. The message names the array and the size it reached.

An array that large is almost never a real need. It is a window that nothing trims: a `var` array with one [[push()]] per bar and no [[shift()]], which on a chart of 1 minute bars grows by 375 elements every NSE session. Decide how much of the past you need, and drop the oldest element as you append, as the example above does.

{{error: OS5008}}

A string holds at most 100,000 characters. The length is checked before the string is built, so a [[str.repeat()]] asked for a huge result stops cleanly instead of using up memory. The message gives the length the string would have reached.

One shape reaches this ceiling, and it is almost always the same one: text appended to a `var` string on every bar, a log that nothing ever trims. Keep the pieces in an array, trim it to the lines you show, and join only those with [[str.join()]] on the last bar.

{{error: OS5010}}

A script holds at most 10,000 drawing objects at once. A drawing lasts until the script deletes it with [[draw.delete()]], and dropping the last name that refers to it does not delete it, so a script that creates a line or a box on every bar and deletes none keeps growing for as long as the chart is open. When one more object would pass the ceiling, the bar stops and the message names the number it would have reached. The oldest object is never dropped to make room, because a study that is right on the right of the chart and quietly wrong on the left is worse than one that stops.

Delete what you no longer want and bound the set: keep the objects in an array, and when it is longer than you want, delete the oldest object and remove its element together. [[draw.count()]] tells you how many objects the script holds. See [Lines and boxes](/script/visuals/lines-and-boxes).

## Program shape: nesting, state and size

{{error: OS5005}}

Expressions and blocks may nest 128 levels deep in the source, and a function may call a function 64 levels deep. Deeper source is refused when the script compiles, and a program whose calls would nest deeper is refused when it loads. The ceilings keep the compiler and the engine inside a bounded stack, so no file can freeze the page. They are far above anything written by hand, and generated source is the usual way to reach them.

The fix is also the readable change: give the inner part of a deep expression a name at the top level, and use the name. Recursion, a function calling itself, is not allowed at all ([OS2005](/script/errors/names-and-types#os2005)), so the call depth of any program is known before the first bar.

{{error: OS5004}}

Every stateful call, such as [[ema()]] or a function that keeps a `var`, stores what it carries from bar to bar in its own **state region**, one per call path (each distinct route through the calls that reaches it). When a function calls another more than once, and is itself called more than once, the paths multiply: two calls of `outer`, each calling `inner` twice, keep four separate averages. A host may cap the number of regions, and a program over the cap is refused when it loads. The message names the two functions where the multiplication happens.

Call the inner function once at the top level, give its result a name, and pass the name down or read its history with `[]`, as the fix below does. See [User functions](/script/language/functions).

{{error: OS5009}}

The compiled program is held in memory for every chart and every running strategy that uses it, so a host may set how large a program it will hold. A file that compiles to more instructions than that is refused when it loads, naming the count and the ceiling. You will not reach this by writing a study by hand.

A file that size is nearly always the same block repeated with small changes, such as a dozen moving averages written out line by line, or generated source. Move the repeated block into a function with `fn` and call it, and delete branches the script no longer uses.

## Host ceilings

{{error: OS5003}}

A script sets two of its own budgets with `limits()`: `loops` and `history`. A host may refuse to spend more than a certain amount on either, and when a file asks for more, the host refuses it when it loads rather than quietly running it on a smaller budget, because a script that ran under a budget it did not ask for would produce numbers nobody could reproduce. The message names the option, the value the file asked for and the most the host allows.

For loops the comparison uses the default budget of 2,000,000 when the file writes no `limits()` line, so a host whose loop ceiling is lower refuses a file that never mentions `limits()`. The history depth has no default to compare, so a file without `limits(history = n)` is never refused for it. Lower the value, or run the file on a host that allows more. This is the host telling you which of its limits you met, not a fault in your script.

{{error: OS5006}}

Each [[req.timeframe()]] or [[req.symbol()]] read is a separate series the host fetches and keeps in step with the chart. A host may cap how many one file makes, and a file with more is refused when it loads, naming the count and the ceiling. It is refused rather than having the extra reads dropped, because a dropped read is a plot that quietly turns absent.

Every read written in the file counts, even two identical ones: `req.timeframe("1D", high)` written twice is two requests. Read each series once, assign it to a name and reuse the name, including for its history (`dayHigh[1]`), and delete reads whose results are unused. See [Higher timeframes](/script/data/higher-timeframes).

**Related.** [Limits](/script/writing/limits), [Profiling and speed](/script/writing/profiling), [OS4xxx Runtime errors](/script/errors/runtime), [Reading an error](/script/errors/overview), [Control flow](/script/language/control-flow), [Collections](/script/language/collections)
