---
title: OS9xxx Import
description: Every OS9 code, reported by the importer when it turns a script written in another chart language into OpenScript. An error marks a statement kept as a comment for you to translate by hand; a warning marks a statement translated with a stated difference in meaning.
---

This page covers the OS9xxx codes of OpenScript (also called OpenAlgo Script): the findings of the importer. The importer is `importScript`, a function in the `openalgo-script` package that reads a script written in the version-annotated chart dialect, versions 5 and 6, and writes it as OpenScript. Its rule is that a translation that changes what a script means is worse than none, so it never approximates. An **error** is a statement it kept as a comment, because it could not translate it with its meaning, and you translate that statement by hand. A **warning** is a statement it did translate, whose meaning differs from the original in the way the message states. The importer is a library function for a host or an editor to call, and the /trading page does not offer it: current OpenAlgo releases ship library 0.5.0, and the importer arrived in 0.6.0.

## How to read these

The importer takes the text of a script and returns two things: the OpenScript it wrote, and its findings.

```js
import { importScript } from "openalgo-script";

const { source, findings } = importScript(text, { name: "breakout.txt" });
for (const f of findings) console.log(f.code, f.severity, f.span.line, f.message);
```

- **The findings point into the script you imported.** Each one is an ordinary diagnostic, with a code, a severity, a message and a fix, and its line and column are in the text you gave the importer, not in the OpenScript it wrote, so the caret lands under what the original author wrote.
- **What comes back compiles.** The importer compiles its own output before it returns it, so `source` is a program whenever it is not empty. It is the empty string when nothing could be translated at all, as for [OS9001](#os9001), and for a script with no declaration or a library ([OS9004](#os9004)).
- **A statement it did not translate is kept as a comment.** The unit is the whole statement at the top level, because a block with one line missing would mean something the original did not. Each of its source lines is written out behind a marker naming the code:

```text
// not translated (OS9003): rank = ta.percentrank(close, 20)
```

Read the errors first, because each one is a statement you have to write yourself, and one refusal can hold back the statements after it ([OS9005](#os9005)). Then read the warnings, and compare the first bars of the translated study with the original before you rely on it. Each entry below shows a short script in the source dialect, as plain text, beside the OpenScript it ends up as. [Importing a script](/script/writing/importing-a-script) walks through a whole import.

## Errors: statements kept as a comment or not translated

{{error: OS9001}}

A script in the source dialect opens with an annotation comment naming the dialect version it was written for, `//@version=5` or `//@version=6`, above its first line of code. The importer's table of built-ins and every rule it applies are written for those two versions. An earlier version names its built-ins differently and follows rules the importer does not model, so reading it as version 5 would give a translation that compiles and means something else. The whole script is refused: the source that comes back is empty, and this is the only finding. A script with no annotation is refused the same way, and the message says it declares no version.

Bring the script up to version 5 or 6 and import it again, or translate it by hand.

{{error: OS9002}}

Some forms of the source dialect have no OpenScript spelling that keeps their meaning: an `if` or a `switch` used as a value, a tuple other than the four the importer unpacks (from the source dialect's MACD, Bollinger band, supertrend and directional movement built-ins), a type, a method, an import, an array literal, a loop over a collection, and an equality test against `na`. A few more are written in forms the importer's reader does not accept. The message names the form in a few words, such as "an if used as a value" or "a comparison with na", and the whole statement holding it is kept as a comment.

Translate the statement from its comment. An `if` used as a value is usually a ternary, as in the example: `side = close > open ? 1 : -1`. For a comparison with `na`, decide what the original meant before you write it: the source dialect answers it false on every bar, so the original never took that branch, while [[isNone()]] is true wherever the value is absent.

{{error: OS9003}}

The importer translates a built-in only where its table says which OpenScript call computes the same thing and how the arguments line up. A built-in with no row in that table, or a name the source script never declares, is not guessed at: a function with a similar name can differ in its arguments, its warmup or its arithmetic, and a translation built on the wrong one would draw a line that looks right and is not. The message names the built-in as the source writes it, namespace included, and the whole statement holding it is kept as a comment.

Find the OpenScript call that does the same job in the [reference](/script/reference/technical-analysis), check how it treats its first bars and absent values, and write the statement by hand. The example's built-in becomes [[percentRank()]], which the importer's table does not hold.

{{error: OS9004}}

An OpenScript file has exactly one declaration, `study()` or `strategy()`, and it decides whether the file may place orders. The importer writes it from the source's `indicator` or `strategy` call and from nothing else, because a declaration it invented would make that decision for you. A script with no declaration, and a library, which has no declaration an OpenScript file can carry, are refused whole: the source that comes back is empty and this is the only finding. A second declaration is kept as a comment, and the first one is used.

Give the source script exactly one `indicator` or `strategy` declaration at the top level, and import it again.

{{error: OS9005}}

A statement kept as a comment declares nothing in the output, so a later statement that reads one of its names would not compile. Rather than hand back a file that fails, the importer keeps each such statement as a comment too, in source order, and the message names the line that started the chain. One refusal can therefore produce several findings: in the example, the built-in with no mapping on line 3 is [OS9003](#os9003), and the average on line 4 that reads its result is OS9005, as is the plot of that average.

Translate the statement at the line the message names first, then the statements that read it, which were kept only because of it.

{{error: OS9006}}

Some arguments change the numbers a script produces or the orders it sends, and OpenScript has nothing the importer can write for them: a declaration's timeframe, a strategy's margin or a pyramiding above one, a limit price on an entry, a trailing exit, a quantity on a close, and a quantity on an entry in a strategy that sizes its orders in anything but units, because the source dialect counts that quantity in contracts and OpenScript in the declaration's own unit. Left out in silence, any of them would give a translation that computes or trades something else.

On the declaration or an input, the argument is left out and the call is kept, because the rest of the script needs them, so the translation runs without that argument's meaning until you put it back. Any other call carrying one is kept as a comment. Decide what OpenScript should do in its place: the example reads the daily timeframe the original declared with [[req.timeframe()]].

{{error: OS9012}}

The importer compiles its own output before it returns it, so what it hands back always compiles. A statement can translate piece by piece and still be refused as a whole, because the importer does not work out the types of the source script: version 5 of the source dialect lets a number stand where a condition is expected, and the source dialect lets a name inside a block keep a history and lets values of two types meet where OpenScript refuses. The importer learns of these from the compiler, keeps the statement as a comment, and compiles again. The message names the code the compiler raised.

Look that code up on its range page and translate the statement in the form its fix describes. In the example the compiler raised [OS2011](/script/errors/names-and-types#os2011), a condition that is not a `bool`, and the fix writes the test out: `volume > 0`.

## Warnings: translated with a stated difference

{{error: OS9007}}

A windowed built-in, such as an average, an RSI or a highest high, is translated to the OpenScript call that computes the same quantity. What the two languages may not share is the detail: the first bar a value appears on, how a seeded average is seeded, the order the arithmetic is done in, and what an absent value inside the window does, which OpenScript carries through where the source dialect skips it. Over data with no absent values, and after the first bars, the two compute the same quantity, though the last digits can differ. On the first bars, and around a gap, the translation follows OpenScript's rules, which [Warmup](/script/language/warmup) and [Absent values](/script/language/absent-values) describe. The warning is given once per built-in, at its first call.

Nothing needs to change unless the script depends on its first bars. Compare them with the original, and where they matter, write the value as an explicit recurrence held in a `var`, seeded the way the original seeds it.

{{error: OS9008}}

Version 5 of the source dialect divides two whole-number constants without a fractional part, so `7 / 2` is 3 there. Version 6 and OpenScript both keep the fraction, 3.5. A constant here is a whole-number literal, or a name the script sets once to one and never changes. The importer writes the division as OpenScript does and tells you, rather than guessing which result the author relied on. A version 6 script never raises this warning.

If the original relied on the whole-number result, wrap the division in [[trunc()]], as the example does; otherwise leave it as it is.

{{error: OS9009}}

Many arguments in the source dialect are about the picture rather than the numbers: a line that tracks the price, a label size, a legend entry, a count of drawings to keep, a plot style OpenScript does not offer. Leaving one out changes how the chart looks and nothing the script computes or trades, so the call is translated without it, and the argument is reported rather than dropped in silence. The message names the argument and the call.

Nothing needs to change unless the look mattered. Where it did, restyle the translated call with the options OpenScript has, such as its colour, width and style. See [Plots](/script/visuals/plots).

{{error: OS9010}}

An order call is translated into OpenScript's order calls as closely as the two order models allow. An entry becomes a close of any opposite position followed by the entry, guarded so that it never adds to a position already held on its side, which is what the source dialect does at its default pyramiding. An exit that names its entry is guarded by that entry's side, and a profit or loss given in ticks is multiplied by [[chart.tickSize]]. What still differs is the model: an OpenScript exit sets its level when it is called rather than when its entry fills, and a repeated entry past the pyramiding limit is refused rather than ignored. The warning is given once per order call, at its first use.

Backtest the translation beside the original and compare the two trade lists before you rely on it, and adjust the order calls by hand where they part. A strategy that names no capital is given the source dialect's starting capital of 1,000,000, as the example shows, because OpenScript's own default is 100,000 and an order sized as a percentage would otherwise be a tenth of the size. See [Orders](/script/strategies/orders) and [Backtesting](/script/strategies/backtesting).

{{error: OS9011}}

OpenScript's equality is total: `none == none` is true and `none != none` is false, so a test for absence can be written as a comparison. The source dialect does not count two absent values as equal. Where both sides of `==` or `!=` can be absent on the same bar, which is every warmup bar of two averages, the translation and the original can take different branches on exactly those bars.

If the original relied on two absent values never comparing equal, guard the comparison with [[isNone()]], as the example does: `not isNone(fast) and fast == slow`. See [Absent values](/script/language/absent-values).

**Related.** [Importing a script](/script/writing/importing-a-script), [Reading an error](/script/errors/overview), [OS2xxx Names and types](/script/errors/names-and-types), [Absent values](/script/language/absent-values), [Warmup](/script/language/warmup), [JavaScript library](/script/integrate/javascript)
