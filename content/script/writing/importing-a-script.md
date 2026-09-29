---
title: Importing a script
description: Turn a script written in another chart language into OpenScript with importScript, and read which of its lines came across exactly, which with a stated difference and which you translate by hand.
---

This page is for you if you have scripts written in another chart scripting language and want them in OpenScript. The `openalgo-script` library has an importer that translates them, statement by statement, and tells you exactly where the two languages part. By the end of the page you will know how to run it, what it reads, what it translates, what it keeps as a comment for you to translate by hand, and how to read what it hands back.

The language it reads is the widely used chart scripting language whose scripts open with a version annotation comment, `//@version=5` or `//@version=6`, declare themselves with an `indicator` or `strategy` call, and reach their built-ins through namespaces such as `ta`, `math`, `input` and `strategy`. This page calls it the source dialect. Its examples are fenced as plain text, because they are not OpenScript.

The importer's rule is the one every diagnostic in OpenScript follows: a translation that changes what a script means is worse than none. So it never approximates. Each statement is translated with the source dialect's meaning, or translated with a warning that says exactly how the meaning differs, or kept as a comment with an error that says why.

:::note Where it runs
The importer is a function in the `openalgo-script` package from version 0.6.0 on, for a host or an editor to call on a file a trader has pasted or uploaded. It has no command line. The /trading page does not offer it: current OpenAlgo releases ship version 0.5.0 of the library, which has no importer.
:::

## Running it

`importScript` comes from the package's main entry point. It is pure: text in, text and findings out, and nothing is read, written or run on the way.

```js
import { importScript, renderDiagnostics, sourceFile } from "openalgo-script";

const { source, findings } = importScript(text, { name: "breakout.txt" });
console.log(renderDiagnostics(sourceFile("breakout.txt", text), findings));
```

`source` is the OpenScript text, or the empty string when nothing could be translated at all. `findings` are ordinary diagnostics: each has a code from the OS9xxx range, a severity, a message and a fix, and a span whose line and column are in the text you imported, not in the text that came out, so the caret lands under what the author of the original wrote. [OS9xxx Import](/script/errors/import) documents every code.

**What comes back compiles.** The importer compiles its own output before it returns it. A statement the compiler refuses is kept as a comment with [OS9012](/script/errors/import#os9012), naming the compiler's own code, and the output is compiled again, so the text you are handed is a program whenever it is not empty.

## What it reads

**Versions 5 and 6.** The annotation has to come before the first line of code. A script written for an earlier version names its built-ins differently and differs in rules the importer does not model, so it is refused whole with [OS9001](/script/errors/import#os9001), and so is a script with no annotation.

**One declaration.** The `indicator` or `strategy` call becomes [study()](/script/reference/declarations#study) or [strategy()](/script/reference/declarations#strategy), placed after the `version 1` line whatever the source put before it. A script with none, and a library, which has no declaration an OpenScript file can carry, are refused whole with [OS9004](/script/errors/import#os9004); a second declaration is kept as a comment with the same code.

An option with an OpenScript equivalent is carried: the title and short title, the overlay, format, precision and scale, and for a strategy its starting capital, the size and unit of an order, pyramiding, commission, slippage, currency and whether orders fill on the close. **A default the two languages disagree about is written out.** The source dialect starts a strategy with a capital of 1,000,000 where OpenScript starts with 100,000, so a strategy that names none is given the source's, as `capital = 1000000`; a percentage sized order would otherwise be a tenth of the size. An option with no equivalent is left out of the declaration, because the file needs one, and reported: [OS9006](/script/errors/import#os9006) where it changes what is computed or traded, such as a declaration timeframe or a margin, and [OS9009](/script/errors/import#os9009) where it changes only what is shown or allocated, such as a count of labels to keep.

## What is translated

**Statements.** A declaration with `=`, a reassignment with `:=` and the compound assignments, `var`, and `varip`, which keeps its value across the updates of a moving bar exactly as OpenScript's `live var` does. A type written in a declaration is dropped, since OpenScript takes a name's type from its value. `if`, `else if` and `else`; `for` with and without `by`; `while`; `switch` with a subject and without one; `break` and `continue`; functions of one line and of several, with default arguments and named arguments.

**Four built-ins that return a tuple**, `ta.macd`, `ta.bb`, `ta.supertrend` and `ta.dmi`, assigned to a tuple of names. Each becomes one call held under a name and one element read per name, in the order the source's tuple gives them, which for `ta.dmi` is not the order the OpenScript [[adx()]] returns.

**Expressions.** The operators have the same precedence in both languages, and the output groups exactly as the source did. `na` is `none`. Strings keep their text whichever quote the source used. A colour written in hexadecimal is kept; a named colour the two languages share becomes the OpenScript colour of that name, drawn with OpenScript's channels, which are not the source dialect's exact shades.

**Built-ins**, one row each. The third column says how far a translation can be trusted:

- **exact** computes the same value on every bar on which the source's value is a finite number, and is absent where the source's is, since an OpenScript number is never infinite.
- **warmup** computes the same quantity with OpenScript's own first bars, seeding, arithmetic order and handling of an absent value, and its first call raises the warning [OS9007](/script/errors/import#os9007).
- **orders** is placed under OpenScript's order model, and its first call raises the warning [OS9010](/script/errors/import#os9010).

A row written with brackets is a call, and one without is read as a value.

| Source | OpenScript | Difference |
|---|---|---|
| `open` | [[open]] | exact |
| `high` | [[high]] | exact |
| `low` | [[low]] | exact |
| `close` | [[close]] | exact |
| `volume` | [[volume]] | exact |
| `hl2` | [[hl2]] | exact |
| `hlc3` | [[hlc3]] | exact |
| `ohlc4` | [[ohlc4]] | exact |
| `hlcc4` | [[hlcc4]] | exact |
| `time` | [[time]] | exact |
| `bar_index` | [[bar.index]] | exact |
| `barstate.isfirst` | [[bar.isFirst]] | exact |
| `barstate.islast` | [[bar.isLast]] | exact |
| `barstate.isconfirmed` | [[bar.isConfirmed]] | exact |
| `barstate.isrealtime` | [[bar.isRealtime]] | exact |
| `barstate.isnew` | [[bar.isNew]] | exact |
| `na` | `none` | exact |
| `math.pi` | [[math.pi]] | exact |
| `math.e` | [[math.e]] | exact |
| `strategy.position_size` | [[pos.size]] | exact |
| `strategy.position_avg_price` | [[pos.avgPrice]] | exact |
| `ta.sma()` | [[sma()]] | warmup |
| `ta.ema()` | [[ema()]] | warmup |
| `ta.wma()` | [[wma()]] | warmup |
| `ta.rma()` | [[rma()]] | warmup |
| `ta.hma()` | [[hma()]] | warmup |
| `ta.vwma()` | [[vwma()]] | warmup |
| `ta.swma()` | [[swma()]] | warmup |
| `ta.linreg()` | [[linreg()]] | warmup |
| `ta.macd()` | [[macd()]] | warmup |
| `ta.supertrend()` | [[supertrend()]] | warmup |
| `ta.dmi()` | [[adx()]] | warmup |
| `ta.rsi()` | [[rsi()]] | warmup |
| `ta.mom()` | [[mom()]] | exact |
| `ta.roc()` | [[roc()]] | warmup |
| `ta.change()` | [[change()]] | exact |
| `ta.atr()` | [[atr()]] | warmup |
| `ta.tr()` | [[trueRange()]] | exact |
| `ta.stdev()` | [[stdev()]] | warmup |
| `ta.variance()` | [[variance()]] | warmup |
| `ta.bb()` | [[bollinger()]] | warmup |
| `ta.highest()` | [[highest()]] | warmup |
| `ta.lowest()` | [[lowest()]] | warmup |
| `ta.crossover()` | [[crossUp()]] | exact |
| `ta.crossunder()` | [[crossDown()]] | exact |
| `ta.cross()` | [[cross()]] | exact |
| `ta.cum()` | [[cum()]] | warmup |
| `ta.barssince()` | [[barsSince()]] | warmup |
| `ta.valuewhen()` | [[valueWhen()]] | warmup |
| `math.sum()` | [[sum()]] | warmup |
| `math.abs()` | [[abs()]] | exact |
| `math.sign()` | [[sign()]] | exact |
| `math.floor()` | [[floor()]] | exact |
| `math.ceil()` | [[ceil()]] | exact |
| `math.sqrt()` | [[sqrt()]] | exact |
| `math.pow()` | [[pow()]] | exact |
| `math.exp()` | [[exp()]] | exact |
| `math.log()` | [[log()]] | exact |
| `math.log10()` | [[log10()]] | exact |
| `math.sin()` | [[math.sin()]] | exact |
| `math.cos()` | [[math.cos()]] | exact |
| `math.tan()` | [[math.tan()]] | exact |
| `math.asin()` | [[math.asin()]] | exact |
| `math.acos()` | [[math.acos()]] | exact |
| `math.atan()` | [[math.atan()]] | exact |
| `math.todegrees()` | [[math.toDegrees()]] | exact |
| `math.toradians()` | [[math.toRadians()]] | exact |
| `math.max()` | [[max()]] | exact |
| `math.min()` | [[min()]] | exact |
| `na()` | [[isNone()]] | exact |
| `nz()` | [[orElse()]] | exact |
| `int()` | [[trunc()]] | exact |
| `float()` | the value itself, in brackets | exact |
| `color.new()` | [[fade()]] | exact |
| `color.rgb()` | [[rgb()]] | exact |
| `indicator()` | `study()` | exact |
| `strategy()` | `strategy()` | exact |
| `input()` | [[input()]] | exact |
| `input.int()` | [[input()]] | exact |
| `input.float()` | [[input()]] | exact |
| `input.bool()` | [[input()]] | exact |
| `input.color()` | [[input()]] | exact |
| `input.string()` | [[input()]] | exact |
| `input.source()` | [[input()]] | exact |
| `plot()` | [[plot()]] | exact |
| `hline()` | [[level()]] | exact |
| `fill()` | [[fill()]] | exact |
| `bgcolor()` | [[background()]] | exact |
| `barcolor()` | [[barColor()]] | exact |
| `plotshape()` | [[signal()]] | exact |
| `strategy.entry()` | [[buy()]] or [[sell()]] | orders |
| `strategy.close()` | [[close()]] | orders |
| `strategy.close_all()` | [[close()]] | orders |
| `strategy.exit()` | [[exit()]] | orders |

A few rows are written as more than a renamed call, because their arguments do not line up one to one:

- `ta.tr` read as a value is absent on the first bar in the source dialect, so it becomes `isNone(close[1]) ? none : trueRange()`; `ta.tr(true)` is `trueRange()`, whose first bar is the bar's own range.
- `ta.stdev` and `ta.variance` take a `biased` flag that is the negation of the `sample` argument of [[stdev()]] and [[variance()]].
- `ta.highest` and `ta.lowest` with one argument read `high` and `low`.
- `math.max` and `math.min` take any number of arguments and become nested calls of two.
- `nz(x)` is `orElse(x, 0)`, `int(x)` truncates toward zero as [[trunc()]] does, and `float(x)` is `(x)`.
- `color.new(c, t)` is `fade(c, t)`, since both take transparency as a percentage; `color.rgb` with a transparency is [[fade()]] over [[rgb()]].
- The input family becomes the one [[input()]], with `minval` and `maxval` as `min` and `max`.
- `hline` becomes [[level()]], and `fill` is translated between two plots, which is all the OpenScript [[fill()]] takes.
- `plotshape(cond, ...)` draws on the bars its series holds, so it becomes a [[signal()]] behind an `if`, with the shape and the side of the bar carried where OpenScript has them.

**Names.** A name the source declares keeps its spelling, with two exceptions that both follow from a difference of meaning. A name OpenScript reserves or defines, such as `rsi`, `step` or `count`, which are ordinary names in the source dialect because its built-ins live in namespaces, gains `Value` at the end. And a declaration inside a block or a function that shares a spelling with an outer name is a new variable in the source dialect and an update of the outer one in OpenScript, so it gains a number. Every new spelling is checked against every name the script uses.

## What is kept as a comment

The unit is the statement at the top level: a block with one line missing would be a block that means something the original did not. Each of its source lines is written out behind a marker naming the code, so the original is there to translate from and the output still compiles:

```text
// not translated (OS9003): rank = ta.percentrank(close, 20)
```

| Code | Why the statement was kept as a comment |
|---|---|
| [OS9002](/script/errors/import#os9002) | A construct with no OpenScript form that keeps its meaning: an `if` or a `switch` used as a value, a tuple anywhere but the four built-ins above, a type, a method, an import, an array literal, a loop over a collection, and an equality test against `na`, which the source dialect answers false on every bar. A few more are written in forms the importer's reader does not accept |
| [OS9003](/script/errors/import#os9003) | A built-in with no row in the table above, or a name the source never declares. It is not guessed at: a function with a similar name can differ in its arguments, its warmup or its arithmetic |
| [OS9005](/script/errors/import#os9005) | A statement that reads a name a refused statement declared. It would not compile, so it follows its cause, and each one in the chain says which line started it |
| [OS9006](/script/errors/import#os9006) | An argument that changes what a call computes or trades and has no equivalent: a limit price on an entry, a trailing exit, a quantity on a close, and a quantity on an entry in a strategy that sizes its orders in anything but units. On a declaration or an input the argument is left out instead, because the rest of the script needs the call |
| [OS9012](/script/errors/import#os9012) | A translation the compiler refused. The importer does not type the source script, so a number standing where a condition belongs in version 5, or a history read of a name inside a block, is learned from the compiler |

## What is translated with a stated difference

Each of these is a warning, raised once per built-in or per order call rather than on every line that uses it.

| Code | The difference |
|---|---|
| [OS9007](/script/errors/import#os9007) | A windowed built-in. Over a source with no absent values, and after the first bars, the translation computes the same quantity; on the first bars, and around an absent value inside its window, it follows OpenScript's rules, which the source dialect does not fix to the same precision |
| [OS9008](/script/errors/import#os9008) | In version 5, a division of two whole-number constants, which that version answers without a fraction and OpenScript answers with one |
| [OS9009](/script/errors/import#os9009) | A presentation argument left out: a tracking line, a label size, a legend title OpenScript has no place for, a plot style it does not offer |
| [OS9010](/script/errors/import#os9010) | An order call. An entry is written as a close of any opposite position followed by the entry, guarded so that it never adds to a position already held on its side. An exit that names its entry is guarded by that entry's side, and a profit or loss given in ticks is multiplied by [[chart.tickSize]]. What still differs is the model: an OpenScript exit sets its level when it is called rather than when its entry fills, and a repeated entry past the pyramiding limit is refused rather than ignored |
| [OS9011](/script/errors/import#os9011) | An equality whose two sides can both be absent on one bar, where OpenScript counts two absent values as equal |

Some rewrites need no warning, because the output is the source dialect's meaning exactly:

- The source dialect answers a comparison with an absent side false, and OpenScript answers it absent. The two agree wherever a condition decides a branch, so nothing changes there. Where they do not agree, the translation writes `orElse(x, false)`: under `not`, beside a boolean literal in an equality, and as the condition handed to `ta.barssince` or `ta.valuewhen`.
- Version 5 always evaluates the right operand of `and` and `or`. Where that operand holds state, such as an average, leaving it in place would advance the average only on some bars in OpenScript, so it is moved to a line of its own named `everyBar` before the statement. Where the statement's condition runs only on some passes, in an `else if`, a `while` or a `switch` arm, there is nowhere to move it, and the statement is refused with OS9002.
- Version 6 evaluates the right operand only when the left one is true, which OpenScript does as well, except that OpenScript also evaluates it when the left operand is absent. There the left operand is written over [[orElse()]].
- A `for` loop whose start is above its end counts down in the source dialect, so it is given `step -1`, or a step worked out from its bounds where they are not literals.

## Reading the result

A study in the source dialect:

```text title="Source dialect"
//@version=5
indicator("Filtered cross", overlay = true)
fastLen = input.int(9, "Fast", minval = 1)
fast = ta.ema(close, fastLen)
slow = ta.sma(close, 30)
rsi = ta.rsi(close, 14)
go = ta.crossover(fast, slow) and not (rsi > 70)
rank = ta.percentrank(close, 50)
plot(fast, "Fast", color = color.aqua)
plotshape(go, title = "Go", style = shape.triangleup, location = location.belowbar)
```

What comes back from version 0.8.0:

```openscript title="OpenScript"
version 1

study("Filtered cross", overlay = true)
fastLen = input(9, "Fast", min = 1)
fast = ema(close, fastLen)
slow = sma(close, 30)
rsiValue = rsi(close, 14)
go = crossUp(fast, slow) and not orElse(rsiValue > 70, false)
// not translated (OS9003): rank = ta.percentrank(close, 50)
plot(fast, "Fast", aqua)
if go
    signal("Go", shape = "triangleUp", at = "below")
```

And four findings: [OS9007](/script/errors/import#os9007) at `ta.ema`, at `ta.sma` and at `ta.rsi`, one for each built-in, and [OS9003](/script/errors/import#os9003) at `ta.percentrank`. Notice the three rewrites: `rsi` became `rsiValue`, because [[rsi()]] is a library name; the `not` over a comparison became `not orElse(..., false)`, so a bar where `rsiValue` is still absent reads as the source dialect reads it; and the `plotshape` became a [[signal()]] behind an `if`.

Read the errors first, because each one is a statement you have to write by hand. Here the rank has an OpenScript call that does the same job, [[percentRank()]]; check how it treats its first bars and absent values, then write the line yourself. Then read the warnings, and compare the first bars of the translated study with the original before you rely on them.

A strategy comes across the same way. Its entries and exits are written under OpenScript's order model, with an [OS9010](/script/errors/import#os9010) warning on the first use of each order call:

```text title="Source dialect"
//@version=5
strategy("Cross")
fast = ta.sma(close, 10)
slow = ta.sma(close, 30)
if ta.crossover(fast, slow)
    strategy.entry("Long", strategy.long)
if ta.crossunder(fast, slow)
    strategy.close("Long")
```

```openscript title="OpenScript"
version 1

strategy("Cross", capital = 1000000)
fast = sma(close, 10)
slow = sma(close, 30)
if crossUp(fast, slow)
    if pos.size < 0
        close()
    if pos.size <= 0
        buy(tag = "Long")
if crossDown(fast, slow)
    close(tag = "Long")
```

The capital is written out because the source dialect's default differs, and the entry closes any short position before it buys, and never adds to a long one, which is what the source does at its default pyramiding. Backtest the translation beside the original and compare the two trade lists before you trade it: see [Backtesting](/script/strategies/backtesting).

## See also

- [OS9xxx Import](/script/errors/import) for every code the importer raises, with its fix.
- [Absent values](/script/language/absent-values) for the rules most of the rewrites above are about.
- [Warmup](/script/language/warmup) for the first bar each OpenScript function produces a value on.
- [Orders](/script/strategies/orders) for the order model the translated entries and exits run under.
