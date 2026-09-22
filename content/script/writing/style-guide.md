---
title: Style guide
description: Naming, layout and comment conventions that keep an OpenScript file readable to someone who has never seen it, including you in six months.
---

This page covers how to lay out, name and comment an OpenScript file (OpenScript is also called OpenAlgo Script) so that a reader can go from the top to the bottom once and know what the script does and why. It matters because a trading script is read far more often than it is written: by you when a number looks wrong on a Monday morning, by the person you share it with, and by anyone deciding whether to trust a strategy with money.

The rules here are conventions, not grammar. The compiler accepts a badly named, badly ordered file. What it cannot do is explain it.

## What the language already decides

OpenScript settles most of the arguments a style guide usually exists to settle, so you do not have to.

| Rule | What happens otherwise |
|---|---|
| Indent with spaces only | A tab in the indentation is [OS1002](/script/errors/syntax#os1002) |
| One statement per line | A `;` is [OS1007](/script/errors/syntax#os1007) |
| Every line of a block has the same indentation | One line out by a single space is [OS1003](/script/errors/syntax#os1003) |
| A block is the lines indented more deeply than its header | There are no braces and no `end` keyword to place |
| Comments start with `//` and run to the end of the line | `/*` is [OS1026](/script/errors/syntax#os1026): there are no block comments |

The language also defines one canonical layout, and the formatter in the `openalgo-script` package's editor tools writes it. A formatter moves whitespace and nothing else, so laying a file out again never changes what it means. The canonical layout is:

- four spaces per block level;
- a continuation line (a statement carried onto the next line) eight spaces past the line that began the statement;
- one space between two tokens, with no space inside brackets, before a comma or around a dot;
- a comment after code two spaces clear of it;
- at most one blank line in a row, and exactly one line ending at the end of the file.

Because the canonical layout puts one space around `=`, a formatter does not keep columns you align by hand. The Scripts panel on the /trading page does not reformat a file for you in this release, so write in this layout as you go. Every example on this page is written in it. Let the layout decide the spacing and put your effort where it cannot help: the names you choose, the order you put things in, what you pull out into a function, and what you say in a comment.

A good rule to write to is the one the language itself follows: a rule exists because of a reason, and the reason is worth one sentence. A reader who knows why a line is written a certain way keeps it that way. A reader who only knows that it is written that way deletes it the first time it is inconvenient.

## The shape of a file

Every script has the same sections in the same order. The order is not arbitrary. A script runs top to bottom once per bar, and a name has to be assigned before it is read, so a file that reads naturally is also a file that compiles. See the [execution model](/script/language/execution-model) for the details.

| Order | Section | Holds | Why it sits here |
|---|---|---|---|
| 1 | Header comment | What the script does, what it needs, what it does not do | The first thing a reader sees should be prose, not code |
| 2 | `version 1` | The language version | It must be the first line that is not blank and not a comment |
| 3 | Declaration | `study(...)` or `strategy(...)` | Exactly one, and it fixes the pane, the precision and, for a strategy, the cost model |
| 4 | `limits(...)` | A raised loop budget or history depth, when the defaults are not enough | It must be the statement straight after the declaration. See [Limits](/script/writing/limits) |
| 5 | Inputs | Every [[input()]] call | Top level only, and a reader wants the knobs before the machinery |
| 6 | Functions | `fn` declarations | A function may be declared after it is called, so put them here or at the end: pick one |
| 7 | Data reads | [[req.timeframe()]] and [[req.symbol()]] | They are the script's outside dependencies and belong together |
| 8 | Calculations | Library calls and arithmetic | Unconditional, at the top level, so every stateful call advances on every bar |
| 9 | State | `var` declarations and the blocks that update them | After the values they are computed from |
| 10 | Decisions | The `if` blocks that turn numbers into conclusions | After the numbers, before the output |
| 11 | Outputs | [[plot()]], [[fill()]], [[level()]], [[table()]] | Top level only, and where a reader looks first when a line is wrong |
| 12 | Events and paint | [[signal()]], [[alert()]], [[barColor()]], [[background()]], drawings, orders | Last, because they are consequences |

Sections 11 and 12 can be interleaved where a marker belongs next to the decision that raises it. What does not read well is a plot in the middle of the calculations and another after the orders.

Here is the whole shape in one short file. It works on any instrument: an NSE stock, a NIFTY future on NFO, or crude oil on MCX.

```openscript title="Deviation bands"
// Deviation bands around a simple average, with a marker on the bar the source
// closes above the upper band.
//
// Needs: only the chart's own bars. No volume and no other instrument.
// Does not: place orders or say anything about direction.

version 1

study("Deviation bands", overlay = true, precision = 2)

length = input(20, "Length, in bars", min = 2, max = 500)
widthDev = input(2.0, "Band width, in standard deviations", min = 0.1, max = 10)
src = input(close, "Source")

basis = sma(src, length)
dev = widthDev * stdev(src, length)
upper = basis + dev
lower = basis - dev

plot(basis, "Basis", orange, width = 2)
upperPlot = plot(upper, "Upper", silver)
lowerPlot = plot(lower, "Lower", silver)
fill(upperPlot, lowerPlot, fade(silver, 92))

// A break is an event on one bar, so it is a marker rather than a plotted
// column that would have to be absent on every other bar.
if crossUp(src, upper)
    signal("BREAK UP")
```

Two small things in that file are deliberate. The basis plot's handle is not kept, because nothing uses it, while the two band handles are kept because [[fill()]] names them. And the input titles are full phrases with units in them, because the settings dialog is the only documentation most users of a script ever read.

{{screen: study-settings}}

## Naming

The convention, which the compiler does not enforce, is `camelCase` for names and functions and `UPPER_SNAKE` for values the script treats as constants. Beyond that, these rules earn their keep.

| Rule | Instead of | Write | Because |
|---|---|---|---|
| Say what the number is, not its type | `n`, `val`, `x2` | `length`, `stopDistance`, `rangeWidth` | Every one of them is a `number`, so the name is the only information |
| Put the unit in the name | `hold` | `holdMinutes` | A number that is sometimes minutes and sometimes milliseconds is a bug waiting for a busy expiry day |
| A bool reads as a claim about this bar | `flag`, `check` | `forming`, `isReady`, `broken` | `if forming` reads as English; `if flag` reads as nothing |
| A length input ends in `Len` or `Length` | `fast`, `slow` | `fastLen`, `slowLen` | Then `fast` and `slow` are free for the averages themselves |
| A plot handle is named for its plot | `p1`, `p2` | `upperPlot`, `lowerPlot` | The only thing a handle is for is being named by `fill` |
| Loop indices may be short | `elementIndex` | `i`, `j` | A three line loop body gives the index all the context it needs |
| Fixed constants get `UPPER_SNAKE` | `msPerMinute` | `MS_PER_MINUTE` | It marks the value as fixed by arithmetic rather than by the user |

```openscript
MS_PER_MINUTE = 60000

holdMinutes = input(30, "Hold, in minutes", min = 1, max = 375)
holdMs = holdMinutes * MS_PER_MINUTE

plot(holdMs, "Hold, in milliseconds")
```

### Names you cannot use

Two kinds of name are refused, and both are [OS2002](/script/errors/names-and-types#os2002).

**A library name.** [[close]], [[ema()]], [[aqua]], [[plot()]] and every other name in the [reference](/script/reference/technical-analysis) live in the outermost scope, so assigning to one is an error. This catches people more often than it sounds, because many library names are ordinary words: [[variance()]], [[count()]], [[change()]], [[mix()]], [[sign()]], [[median()]] and [[chop()]] are all taken.

```openscript expect=OS2002
variance = stdev(close, 20) * stdev(close, 20)
```

When the compiler stops you, add a word that says what the value is: `varianceValue`, `barCount`, `priceChange`.

**A second declaration of a name that already exists outside.** Assigning to a top-level name from inside an `if` or a loop is allowed: it updates that name, which is usually what you want. What the compiler refuses is a new name that would hide the outer one: a `var` of the same name inside a block, a loop counter or a function parameter named like a top-level value, or a function body that assigns to a top-level name. That is an error, not a warning, because the most expensive bug in a per-bar script is a value that is right in one place and stale in another, and two variables with one name is the shortest path there.

```openscript expect=OS2002
len = 20

fn helper(src) =>
    len = 9  // a second len inside the function
    sma(src, len)

plot(helper(close), "Helper")
```

Rename the inner one, here to `innerLen`. See [Variables and scope](/script/language/variables-and-scope).

## Ordering inside a section

Within the calculations, order by dependency and then by importance. A reader should be able to stop at any line and have already seen everything the lines below it use.

```openscript
stopMult = input(2.0, "Stop, in ATR", min = 0.2, max = 20)
targetMult = input(3.0, "Target, in ATR", min = 0.2, max = 40)

// Each line uses only what is above it, and the values that matter come last.
atrValue = atr(14)
stopDistance = stopMult * atrValue
targetDistance = targetMult * atrValue

plot(stopDistance, "Stop distance")
plot(targetDistance, "Target distance")
```

Group by subject, not by kind of call. Three lines that compute a stop belong together even if one is a library call and two are arithmetic. Blank lines between groups are free, and they are the cheapest readability there is.

Functions may be declared after they are called, because the compiler collects every `fn` before it checks any body. Use that freedom once: put every function in one place, either straight under the inputs or at the end of the file, and do it the same way in every script you write.

## When to extract a function

Extract a function when one of these three is true, and not otherwise. See [User functions](/script/language/functions) for the rules of `fn`.

**1. The same expression appears twice.** Two copies are two places to fix when it is wrong, and the second one is always the one that gets missed.

**2. A line needs a sentence to explain it, and the sentence is a name.** This is the most common reason and the most underused.

```openscript
// Before: correct, and the reader has to decode it every time.
z = (close - sma(close, 20)) / stdev(close, 20)
plot(z, "Z score")
```

```openscript
// After: the name is the explanation, and the formula is read once.
fn zscore(src, len) =>
    m = sma(src, len)
    s = stdev(src, len)
    (src - m) / s

z = zscore(close, 20)
plot(z, "Z score")
```

**3. You want a second, independent copy of some per-bar state.** State belongs to each call site, not to the function, so a stateful helper called in two places keeps two separate counters. That is what makes a helper reusable at all.

```openscript
fn barsSinceTrue(cond) =>
    var n = none
    if cond
        n = 0
    else if not isNone(n)
        n = n + 1
    n

sinceUp = barsSinceTrue(close > open)  // its own counter
sinceHigh = barsSinceTrue(high > high[1])  // a separate counter

plot(sinceUp, "Bars since an up bar")
plot(sinceHigh, "Bars since a higher high")
```

Do not extract when the function would take six arguments to avoid repeating two lines, when the body is one library call with the arguments renamed, or when all it does is hide a number that should have been an input.

You cannot extract a function that calls itself. Recursion is [OS2005](/script/errors/names-and-types#os2005), because the state of every call site is laid out before the first bar runs. Write a loop instead.

```openscript expect=OS2005
// Refused where it is declared, whether or not anything calls it.
fn countdown(n) => n <= 0 ? 0 : countdown(n - 1)
```

One more constraint shapes extraction: a parameter may not be named after a name at the file's top level or after a library name (OS2002 again). Helper parameters therefore tend to be short and generic, such as `src`, `len` and `cond`, which is fine, because a helper's parameters take their meaning from the call site.

## Comments

**Comment why, not what.** The reader can see what a line does; the language is small enough that every line says what it does. What the reader cannot see is the alternative you rejected and the reason.

```openscript
// Bad: says what the line already says.
// Compute the 20 bar exponential moving average of the close.
e = ema(close, 20)
plot(e, "EMA 20")
```

```openscript
// Good: says what the reader could not have known.
// Computed at the top level on purpose. Inside the branch that uses it, the
// average would advance only on the bars that branch ran on, which is warning
// OS8001 and a line with holes in it.
e = ema(close, 20)
plot(e, "EMA 20")
```

The places where a why comment nearly always pays for itself:

| Where | What to say |
|---|---|
| An [[orElse()]] | What is absent, on which bars, and what would happen without the fallback |
| A `var` | Why the value has to survive from one bar to the next |
| A `live var` | Why counting updates is the intent, since it makes the chart and a backtest differ |
| A pivot or any lagged read | How many bars late the value is, and that the lag is real rather than a bug |
| A `mode` on a higher timeframe read | Which of the three readings the script takes, and why |
| A guard on [[bar.isConfirmed]] or [[bar.isLast]] | What would happen on the still-forming bar without it |
| A fixed number | Where it came from, or why it is not an input |
| An order that looks accidental | That reading a `var` before it is reassigned is how the previous bar's value is obtained |

The header comment is the one exception to "why, not what": it is the place that says what. Write three short paragraphs in this order: what the script draws or trades, what it needs from the chart (volume, a session, another instrument, a particular timeframe), and what it deliberately does not do. Write it before the code, and you find out whether you know what you are building. [Sharing scripts](/script/writing/sharing-scripts) shows a full header.

There are no block comments. An unterminated one would swallow the rest of the file and report its error at the last line, so the form does not exist. Comment out a region by putting `//` in front of each line.

## Formatting

- **Four spaces per level**, the canonical amount.
- **Keep lines under about eighty characters.** A continuation line must be indented more deeply than the first line of its statement ([OS1028](/script/errors/syntax#os1028) otherwise), so a wrapped line is never ambiguous.
- **Break a long call at its named arguments**, one group per line. A call that needs four lines is telling you it has four ideas in it.
- **Blank lines separate sections, not statements.** A blank line inside a three line group is noise.
- **Never write a line whose only purpose is to be clever.** A nested ternary three levels deep is legal, and nobody reads it correctly the first time. Give the inner choice a name.

```openscript
up = close > open
down = close < open
strong = volume > sma(volume, 20)

// Before: legal, and nobody reads it correctly the first time.
tone = up ? (strong ? lime : green) : (down ? (strong ? red : maroon) : gray)
barColor(tone)
```

```openscript
up = close > open
down = close < open
strong = volume > sma(volume, 20)

// After: two names, three short lines, one obvious reading.
upTone = strong ? lime : green
downTone = strong ? red : maroon
tone = up ? upTone : down ? downTone : gray
barColor(tone)
```

A long declaration broken at its named arguments, in the canonical layout:

```openscript
version 1

strategy("EMA cross, NIFTY futures", overlay = true, precision = 2,
        capital = 500000, qtyType = "lots", qty = 1,
        fillOn = "nextOpen", slippage = 1,
        commissionType = "perTrade", commission = 20)

fast = ema(close, 9)
slow = ema(close, 21)

if crossUp(fast, slow)
    buy()

if crossDown(fast, slow)
    close()
```

## Shapes to avoid

| Shape | What goes wrong | Write instead |
|---|---|---|
| A stateful call inside an `if` | It advances only on the bars the branch runs, and is absent on the rest ([OS8001](/script/errors/warnings#os8001)) | Compute it at the top level, use it inside the branch |
| A `plot` inside an `if` | [OS3006](/script/errors/arguments#os3006): the set of plotted columns is fixed before bar 0 | `plot(cond ? value : none, "Title")` |
| A `var` holding [[bar.index]] | Every index shifts when more history loads | Store [[time]] and compare timestamps |
| `x = 0` then `x = x[1] + 1` as a counter | `x[1]` is absent on bar 0, absence spreads, and the series stays absent for ever | `var x = 0` then `x = x + 1` |
| `live var` because it sounded faster | The chart and a backtest now disagree by design ([OS8011](/script/errors/warnings#os8011)) | Plain `var`, unless counting updates is the intent |
| A number typed into the calculations | Nobody can tune it without editing the script | An [[input()]] with a title, a minimum and a maximum |
| A name assigned and never read | It still runs on every bar and suggests something depends on it ([OS8010](/script/errors/warnings#os8010)) | Delete the line |
| The same data read written twice | Two requests against the host's ceiling ([OS5006](/script/errors/limits#os5006)) | Read once, name it, reuse the name |

:::note
The error reference lists a warning for a persistent value holding a bar index, [OS8014](/script/errors/warnings#os8014), but the compiler in version 0.5.0 does not raise it yet: it does not follow a bar index into a `var`. Until it does, the rule above is yours to keep.
:::

## Treat warnings as part of the style

An OS8xxx warning never stops a script, which makes it tempting to leave in place. Do not. Every warning describes a shape that is almost always a mistake, and in the rare case where it is not, one comment saying so costs nothing. A file that compiles with no warnings tells its reader that everything unusual in it was meant. The full list is on the [warnings](/script/errors/warnings) page.

**Related.** [Debugging](/script/writing/debugging), [Profiling and speed](/script/writing/profiling), [Limits](/script/writing/limits), [Testing scripts](/script/writing/testing), [Sharing scripts](/script/writing/sharing-scripts), [Example scripts](/script/getting-started/example-scripts)
