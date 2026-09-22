---
title: OS4xxx Runtime errors
description: The errors a script raises while a bar runs, when a value it computed cannot be used: a history index, a length, an array index, a deleted drawing or an absent loop bound.
---

This page covers the OS4xxx codes of OpenScript (also called OpenAlgo Script): the errors raised while a bar runs, after the script has compiled cleanly. They are the first codes that depend on the data. A script can run perfectly for 30,000 bars and then stop on the one bar where a computed length comes out as 7.5, or an array is read before it holds enough elements. Knowing what each code means lets you find the line and the value quickly, and write the guard that keeps the next script from reaching it.

## When they appear

A runtime error is raised on the bar that produced the value, which may be deep in history or the newest bar. The message fills in the real value it met, such as `sma's len was 7.5 on this bar`, so you can see which value went wrong. The script never skips the bar silently, because a gap with no explanation looks exactly like a gap the script meant.

- **On a chart**, the study draws nothing. When you add it, /trading shows a notice with the code, the message and the fix. If a study already on the chart starts failing later, for example when a new bar arrives, the **Objects** panel lists it with the status Error.
- **In the Backtest panel**, the strategy stops trading at that bar: the report lists only the trades made before it, and the equity curve runs flat from there to the end of the range. The panel does not show the error itself, so a curve that goes flat and stays flat is worth checking for one. See [Backtesting](/script/strategies/backtesting).
- **In a deployed strategy**, the run stops at that bar, sends nothing further and writes the code, the bar, the line and the column to the run's log. See [Sandbox and live](/script/strategies/sandbox-and-live).

Some of these problems have a compile-time twin: a literal the compiler can see is refused before any bar runs ([OS3004](/script/errors/arguments#os3004) for some whole-number arguments, such as the rows of a [[table()]], and [OS3008](/script/errors/arguments#os3008) for a name outside an accepted set). In version 0.5.0 that check does not cover history indexes or lengths: `close[1.5]`, `close[-1]`, `sma(close, 7.5)` and `str.repeat("ab", 2.5)` all compile and then stop on bar 0.

## A script that guards against them

Every guard in this study is there because of one of the codes below. It runs on any instrument and interval.

```openscript title="Window momentum"
version 1
study("Window momentum")

len = input(21, "Window, in bars", min = 2, max = 500)

// A length computed from an input is rounded before a call receives it,
// because sma counts whole bars (OS4003).
half = floor(len / 2)
smooth = sma(close, half)

// A history index is a whole number, zero or more (OS4001).
back = max(0, round(len / 4))
momentum = smooth - smooth[back]

// An array is read only inside its extent (OS4004).
var window: array<number> = []
if not isNone(momentum)
    push(window, momentum)
if size(window) > len
    shift(window)
oldest = size(window) > 0 ? element(window, 0) : none

// A bound computed from data is absent until the data exists, so the loop
// is guarded rather than left to stop the bar (OS4013).
sinceCross = barsSince(crossUp(close, smooth))
stretch = none
if not isNone(sinceCross)
    span = min(sinceCross, 50)
    total = 0.0
    for i = 0 to span
        total += close[i] - smooth[i]
    stretch = total / (span + 1)

plot(momentum, "Momentum", aqua)
plot(oldest, "Momentum a window ago", silver)
plot(stretch, "Average distance above the mean since the cross", orange)
```

## Every code at a glance

Seven of the thirteen codes are reserved for checks the engine does not make yet. The table says what happens today in each case, so you know which guard to write now.

| Code | What it catches | In version 0.5.0 |
|---|---|---|
| [OS4001](#os4001) | A history index that is fractional or negative | Raised |
| [OS4002](#os4002) | A history read deeper than `limits(history = n)` keeps | Raised |
| [OS4003](#os4003) | A length, count or position that is fractional, or below what the function accepts | Raised |
| [OS4004](#os4004) | An array index outside the array | Raised, and also covers OS4006 and OS4008 |
| [OS4005](#os4005) | A setter on a deleted drawing object | Raised |
| [OS4006](#os4006) | Taking an element from an empty array | Not raised yet: OS4004, or absent |
| [OS4007](#os4007) | A reversed or out of range slice | Not raised yet: the slice is shortened, or OS4003 for a negative bound |
| [OS4008](#os4008) | A table cell outside the table | Not raised yet: OS4004 |
| [OS4009](#os4009) | A colour channel out of range | Not raised yet: the channel is clamped |
| [OS4010](#os4010) | A calendar field out of range | Not raised yet: the date rolls over |
| [OS4011](#os4011) | A string position outside the string | Not raised yet: a shorter or empty string |
| [OS4012](#os4012) | A computed name outside the accepted set | Not raised yet: absent, or a fallback, depending on the call |
| [OS4013](#os4013) | A loop bound that is absent | Raised |

## History reads

`x[n]` reads the value of `x` as it stood `n` bars ago. See [Bars and history](/script/language/bars-and-history).

{{error: OS4001}}

`x[n]` counts bars back from the current one, so `n` has to be a whole number of bars, zero or more. There is no half a bar ago, and a negative index would read the future, which no script can do. The usual cause is a computed index: `close[len / 2]` with an odd `len`, or an offset that drops below zero after a subtraction on some bar.

The check runs while the bar executes, even for a literal, so `close[1.5]` and `close[-1]` compile and then stop on bar 0. Reading further back than the chart goes is not this error: `close[500]` on bar 20 is simply absent, because that value never existed.

{{error: OS4002}}

By default the engine keeps the whole history of every series your script reads, so any depth works and this error never appears. It appears only after a `limits(history = n)` line caps the depth, and a read then reaches further back than `n` bars. With `limits(history = 50)`, `close[50]` works, and `close[120]` is absent for the first 120 bars (like any read before the chart begins) and then stops the run on bar 120, the first bar where the value would have existed.

The difference from absence is deliberate. A read before the first bar is absent because the value never existed; a read past the kept depth is an error because the value existed and was thrown away, and a quiet gap there would hide a real bug. The message suggests a depth that covers the deepest read. See [Limits](/script/writing/limits#the-retained-history-depth).

## Whole numbers and names

{{error: OS4003}}

Lengths, counts and positions passed to a function are whole numbers: [[sma()]] averages a whole number of bars, and [[str.repeat()]] repeats a string a whole number of times. The value is not rounded for you, because a length of 7.5 is a mistake in the script and rounding it silently would hide the mistake. The usual cause is arithmetic on an input, such as `len / 2` when `len` is odd, or a length derived from volatility.

The same code stops a value that is whole but below what the parameter accepts: `sma(close, 0)`, `sma(close, -3)` and a negative position in [[slice()]] all raise it, although the message still says "a whole number was required". Read it as "a usable whole number". The message names the function, the parameter and the value it received on that bar, for example `sma's len was 0 on this bar`.

In version 0.5.0 a literal such as `sma(close, 7.5)` also compiles and stops on bar 0. Round every length you compute with [[floor()]], [[round()]] or [[ceil()]], and keep it at 1 or more with [[max()]] when it can shrink.

{{error: OS4012}}

Some parameters accept only a fixed set of names, such as the `order` of [[sort()]] (`"asc"` or `"desc"`) or the `type` of [[ma()]]. A name written as a literal is checked when the script compiles, with [OS3008](/script/errors/arguments#os3008). This code is for a name the script computes, such as a ternary that picks between two strings, when one of them is not in the set.

**Not raised yet.** In version 0.5.0 nothing raises OS4012, and what happens instead is quieter than an error, and depends on the call. `ma(close, 20, kind)` with `kind` computed as `"exponential"` is absent on every bar and plots nothing. [[sort()]] given a computed name it does not accept, such as `"ascending"` or `"descending"`, sorts in ascending order, so a computed `"descending"` quietly sorts the wrong way. Take the choice from an [[input()]] with an `options` list, so only accepted names can reach the call.

## Arrays

An array holds the elements your script put into it, numbered from 0 to `size - 1`. See [Collections](/script/language/collections).

{{error: OS4004}}

Reading or writing an array outside its elements is an error, not absence, because the extent is something your script chose: an index past the end means the script has lost count, while a read before the start of a price history is only data that does not exist yet. Common causes are reading `values[10]` before eleven elements have been pushed, using `size(values)` as the index of the last element (it is `size(values) - 1`), and a loop that runs one step too far. [[element()]] and [[set()]] are held to the same rule.

In version 0.5.0 this code also covers two cases that have their own codes planned. [[shift()]] or [[pop()]] on an empty array raise it, with the index described as "the first element" or "the last element" ([OS4006](#os4006)), and so does a [[cell()]] written outside a table's grid, with the index given as a row and column pair ([OS4008](#os4008)).

{{error: OS4006}}

Taking an element out of an empty array has no answer, and neither has the average, the lowest or the highest of no values. This code is planned to stop the bar in all of those cases, rather than let a script drain an array without noticing.

**Not raised yet.** In version 0.5.0 nothing raises OS4006. [[shift()]] and [[pop()]] on an empty array raise [OS4004](#os4004) instead, and [[avg()]], [[min()]] and [[max()]] of an empty array return absent. Test `size(arr) > 0` before any of these calls: it is correct today and stays correct when this code arrives.

{{error: OS4007}}

[[slice()]] takes the elements from `from`, included, up to `to`, not included, so a usable range satisfies `0 <= from <= to <= size`. A reversed range, or one that runs outside the array, is always a calculation that went wrong: a slice is never read backwards.

**Not raised yet.** In version 0.5.0 nothing raises OS4007. [[slice()]] takes whatever range it is given: a reversed range gives an empty array, and a range that runs past the end stops at the last element. A negative bound is the one case that does stop the bar, with [OS4003](#os4003). Clamp both bounds yourself, as the fix below shows, so the script does not depend on any of that.

## Drawing objects and tables

{{error: OS4005}}

A drawing object (a line, label, box or polyline) lives from the bar that creates it until the bar that deletes it with [[draw.delete()]]. Deleting it does not clear the name that refers to it, so a `var` that held the object still holds it afterwards, now pointing at nothing. The next setter that reaches it, such as [[draw.setTo()]] on the same bar or a later one, stops the run, and the message says which bar the object was deleted on.

Forget the object in the same place you delete it: assign `none` to the name straight after [[draw.delete()]], and test it with [[isNone()]] before changing it. If the object sits in an array, remove its element too. A table is never deleted, so a table never raises this. See [Lines and boxes](/script/visuals/lines-and-boxes).

{{error: OS4008}}

A table's rows and columns are fixed when the script declares it with [[table()]], because the grid is part of the study's layout on the chart. A [[cell()]] written outside that grid has nowhere to go. Rows and columns are numbered from 0, so a table declared with 2 rows has rows 0 and 1, and writing to row 2 is the classic off-by-one.

**Not raised yet.** In version 0.5.0 nothing raises OS4008: a cell outside the grid stops the run with the broader [OS4004](#os4004), whose message gives the row and column pair and the number of cells. Declare the table with the shape you write. See [Tables](/script/visuals/tables).

## Colours, dates and strings

{{error: OS4009}}

The red, green and blue channels of [[rgb()]] and [[rgba()]] run from 0 to 255, and the alpha (opacity) of [[rgba()]] and [[withAlpha()]] runs from 0 to 1. A red, green or blue value written as a literal outside 0 to 255 is refused when the script compiles ([OS3004](/script/errors/arguments#os3004)). This code is for a channel computed from data, such as a heat colour scaled by a strength that can run past 1, which is a bug in the calculation.

**Not raised yet.** In version 0.5.0 nothing raises OS4009: the colour is built with the channel clamped to its range, so a red channel computed as 300 is drawn as 255 and an alpha computed as 2 is drawn fully opaque, and the bar carries on. Clamp the value yourself where you compute it, with [[clamp()]], so the decision is visible in the script. See [Colors](/script/visuals/colors).

{{error: OS4010}}

[[date.from()]] builds a timestamp from a year, a month, a day and optional time fields, and each field has a range: a month runs from 1 to 12, a day from 1 to the length of the month, an hour from 0 to 23. A month of 13 is a script bug, usually `month + 1` in December. In a session test, a date that silently moves is a whole day of wrong signals.

**Not raised yet.** In version 0.5.0 nothing raises OS4010: a field past its range rolls over into the next one, so `date.from(2026, 13, 1)` is 1 January 2027 and `date.from(2026, 2, 30)` is 2 March 2026. Carry the overflow yourself with [[mod()]] and [[floor()]], as the fix below does, so the script says what it means. See [Sessions and time](/script/data/sessions-and-time).

{{error: OS4011}}

[[str.substring()]] counts characters from 0, and the positions it is given have to address characters that exist. A position past the end usually comes from a parser that assumed a symbol was longer than it is, for example taking the eleventh character of a short NSE symbol such as `SBIN`.

**Not raised yet.** In version 0.5.0 nothing raises OS4011: a range that runs past the end gives the part that exists, which can be an empty string. Check [[str.length()]] before you take part of a string, as the fix below does.

## Loops

{{error: OS4013}}

A `for` loop needs its start, its limit and its step before it can begin. Absent values flow through arithmetic and comparisons, but a loop cannot run a partial number of times: it either runs or it does not. So when a bound comes out absent, typically during warmup because it was computed from an indicator that has no value yet, the bar stops, rather than skipping the loop and drawing a plot that looks computed.

Decide what warmup means for the loop. Guard it with [[isNone()]] so the early bars skip it on purpose, as the `sinceCross` loop in the example at the top of this page does, or give the bound a fallback with [[orElse()]] where a fallback is genuinely right. See [Control flow](/script/language/control-flow) and [Absent values](/script/language/absent-values).

**Related.** [Reading an error](/script/errors/overview), [OS5xxx Limits](/script/errors/limits), [Debugging](/script/writing/debugging), [Bars and history](/script/language/bars-and-history), [Absent values](/script/language/absent-values), [Warmup](/script/language/warmup)
