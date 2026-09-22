---
title: User functions
description: Defining your own functions with fn, parameters with types and defaults, named arguments, returning one value or several, and how a function that keeps state behaves at each place you call it.
---

A user function gives a name to a computation, so you write it once and use it in several places, and a fix goes in one line instead of four. This page covers the two forms of `fn`, parameters with types and defaults, named arguments at the call, returning one value or several, the scope rules inside a function, and the rule that matters most: a function that remembers something between bars keeps a separate memory at each place you call it. A function in OpenScript is not a value and cannot be passed around; it is a named piece of the script.

## A complete example

```openscript
version 1
study("Z score", precision = 2)

len = input(50, "Length", min = 5, max = 500)
band = input(2, "Band", min = 1, max = 5)

// How many standard deviations the source sits from its own mean.
fn zscore(src, n) =>
    m = sma(src, n)
    s = stdev(src, n)
    (src - m) / s

level(0, "Mean", gray)
level(band, "Upper", fade(red, 50))
level(0 - band, "Lower", fade(lime, 50))

plot(zscore(close, len), "Close", aqua, width = 2)
plot(zscore(hlc3, len), "Typical price", orange)
```

Two things in this script come up again below. The two calls to `zscore` are two separate call sites (a call site is one place in the source where a function is called), each with its own copy of everything [[sma()]] and [[stdev()]] remember. And on a window where price never moved, `s` is zero, so the division gives the absent value rather than an error, and the plot shows a gap on exactly those bars.

## The two forms

A function is declared with `fn`. In the single-line form, everything after `=>` is the result. In the multi-line form, the body is indented under the header and its last line, a bare expression, is the result.

```openscript
fn typicalPrice() => (high + low + close) / 3

fn zscore(src, len) =>
    m = sma(src, len)
    s = stdev(src, len)
    (src - m) / s

plot(typicalPrice(), "Typical price", aqua)
plot(zscore(close, 20), "Z score", orange, scale = "left")
```

Most helpers are one line, and the short form keeps them one line.

## Where a function may appear

| Rule | If you break it |
|---|---|
| A function is declared at the top level of the file | [OS1023](/script/errors/syntax#os1023) inside a block |
| Functions cannot be nested inside other functions | [OS1023](/script/errors/syntax#os1023) |
| A function may be called above its declaration | Not an error |
| A name can be declared as a function only once | [OS2017](/script/errors/names-and-types#os2017) |
| A function is not a value | [OS2014](/script/errors/names-and-types#os2014): `src = ema` has no meaning |
| A function cannot call itself, directly or through others | [OS2005](/script/errors/names-and-types#os2005) |
| A body cannot declare the study's shape | `plot`, `plotCandles`, `fill`, `level` or `table` inside a body is [OS3006](/script/errors/arguments#os3006); `input` is [OS3007](/script/errors/arguments#os3007) |

The set of functions, like the set of plots, is fixed before bar 0. Because the compiler collects every function declaration before it checks any body, you can keep helpers at the bottom of the file:

```openscript
version 1
study("Helper below", overlay = true)

plot(smoothed(close), "Smoothed", aqua)

fn smoothed(src) => ema(src, 9)
```

## Parameters, defaults and named arguments

A parameter may carry a type annotation (its type, written after a colon), a default value, both or neither.

```openscript
fn band(src: series number, len: number = 20, mult: number = 2) =>
    basis = sma(src, len)
    dev = mult * stdev(src, len)
    basis + dev

plot(band(close), "Upper band", aqua)
plot(band(close, mult = 3), "Wider band", gray)
```

An annotation is optional and is checked when it is there. Without one, the type is inferred from how the parameter is used and from what the calls pass. Annotate anything another person will call, because the header is the only part of a function a reader sees before the body; leave the annotations off a three-line private helper if they add nothing. The type names are `number`, `string`, `bool`, `color` and `array<T>`, with `series` in front for a per-bar value. There is no integer type, so a length is a `number`; writing `int` is [OS2016](/script/errors/names-and-types#os2016).

At a call, arguments may be positional (matched by their order), named (`mult = 3`), or positional followed by named:

| Call | Legal | Means |
|---|---|---|
| `band(close)` | Yes | `len` is 20, `mult` is 2 |
| `band(close, 50)` | Yes | `len` is 50, `mult` is 2 |
| `band(close, mult = 3)` | Yes | `len` stays 20, `mult` is 3 |
| `band(src = close, len = 50, mult = 3)` | Yes | Every argument named |
| `band(close, len = 20, 3)` | No | [OS3005](/script/errors/arguments#os3005): a positional argument after a named one |
| `band(close, 50, 2, 1)` | No | [OS3001](/script/errors/arguments#os3001): too many arguments |
| `band(close, multiple = 3)` | No | [OS3002](/script/errors/arguments#os3002): no such parameter; the fix lists the names that exist and the closest one |
| `band(close, 50, len = 30)` | No | [OS3013](/script/errors/arguments#os3013): `len` given twice |

Named arguments keep a call readable once a function grows a third and fourth option, and defaults in the header show which options a caller may leave out without opening the body.

A parameter name follows the variable rules: it cannot be a reserved word such as `color` or `step` ([OS1019](/script/errors/syntax#os1019)), cannot repeat within the list ([OS2018](/script/errors/names-and-types#os2018)), and cannot reuse a file-scope name or a library name such as `close` ([OS2002](/script/errors/names-and-types#os2002)).

## Series parameters and history

A parameter that receives a series accepts the caller's expression, and `[]` inside the function reads the real history of that expression:

```openscript
fn barChange(src) => src - src[1]

plot(barChange(hlc3), "Change in typical price", aqua)
```

The engine keeps the per-bar values of `hlc3` for that call, so `src[1]` is the previous bar's typical price and nothing has to be prepared by hand. On bar 0 there is no previous bar, so the result is absent and the plot starts at bar 1. A parameter annotated as a plain `number` has no history, and `[]` on it is [OS2004](/script/errors/names-and-types#os2004); annotate it `series number` if the body reads `[]` on it.

**A plain value is broadcast into a series parameter.** Passing `9` where a series is expected means nine on every bar, so one function works with literals, with inputs and with per-bar values.

**A local name inside a function has no history.** `[]` works on a built-in series, a top-level name, a call that returns a series and a series parameter. A name first assigned inside a function body is none of those, so `[]` on it is [OS2004](/script/errors/names-and-types#os2004):

```openscript expect=OS2004
fn wrong(src) =>
    mid = (src + src[1]) / 2
    mid - mid[1]
```

Take the history from the parameter instead, or compute the value at the top level of the file, name it there and pass it in:

```openscript
fn midChange(src) =>
    mid = (src + src[1]) / 2
    mid - (src[1] + src[2]) / 2

plot(midChange(close), "Change of the two-bar midpoint", aqua)
```

## Returning a value

If the last line of the body is a bare expression, that is the result. A `return expression` statement leaves the function at once with that value, and a bare `return` leaves with the absent value.

```openscript
version 1
study("Stop distance", overlay = true, precision = 2)

fn positionStop(side, entry, distance) =>
    if isNone(entry) or isNone(distance)
        return none
    if side > 0
        return entry - distance
    entry + distance

longStop = positionStop(1, close, 2 * atr(14))
plot(longStop, "Long stop, 2 ATR under the close", red)
```

Use the final expression for the ordinary path and `return` for an early exit. A function whose body ends in something other than an expression, and which never reaches a `return`, gives the absent value; if a plot built on it never starts, check that first.

## Returning several values

A function with more than one result returns an `array<number>` holding this bar's results in a documented order. The library does the same: [[macd()]] returns `[macd, signal, histogram]` and [[bollinger()]] returns `[basis, upper, lower]`. Follow that convention and a reader who has met one has met them all.

```openscript
version 1
study("Deviation bands", overlay = true, precision = 2)

len = input(20, "Length", min = 2, max = 500)
mult = input(2, "Deviation multiple", min = 1, max = 5)

// Returns [basis, upper, lower], in that order, always.
fn bands(src, n, k) =>
    basis = sma(src, n)
    dev = k * stdev(src, n)
    [basis, basis + dev, basis - dev]

// Read the elements into top-level names at once. Names read better, and a
// top-level name has history.
b = bands(close, len, mult)
basis = b[0]
upper = b[1]
lower = b[2]

top = plot(upper, "Upper", aqua)
bottom = plot(lower, "Lower", aqua)
plot(basis, "Basis", orange, width = 2)
fill(top, bottom, fade(aqua, 90))
```

Three rules make this safe:

- **The array never changes length.** All three elements exist from bar 0, each absent until its own warmup ends. An array that grew as warmup finished would make `b[2]` an out-of-range error at the left edge of the chart only, the worst place for a bug to hide.
- **One function, not three.** Three separate functions would be three call sites, each with its own copy of the averaging state, doing the shared work three times per bar.
- **`b[1]` is an element, not a bar.** On an array `[]` means an element; on a series it means history. Where a reader could doubt which, write [[element()]] or [[history()]].

## Scope inside a function

A function body is a block scope inside the file scope, which is inside the global scope where the library lives. A name first assigned in the body belongs to the body and cannot be read outside it.

A body can read a file-scope name, but it cannot change one. An assignment inside a function always declares a name of the function's own, so assigning a name that already exists in the file scope is a second declaration of it, and is [OS2002](/script/errors/names-and-types#os2002):

```openscript expect=OS2002
len = 20

fn helper(src) =>
    len = 9
    sma(src, len)
```

Prefer functions that read only their parameters. Such a function can be moved, tested and later shared without carrying the rest of the file with it, and its answer does not depend on where in the file it is called. [Variables and scope](/script/language/variables-and-scope) covers the scope rules in full.

## A function that remembers: state per call site

A function body may declare a `var`, and may call library functions that keep state of their own, such as [[ema()]], [[rma()]], [[barsSince()]] or [[cum()]]. Either makes the function stateful.

**State belongs to the call site, not to the function. Two calls in two places are two independent pieces of state.**

```openscript
version 1
study("Bars since", precision = 0)

fn since(cond) =>
    var n = none
    if cond
        n = 0
    else if not isNone(n)
        n = n + 1
    n

sinceUp = since(close > open)  // its own counter
sinceHigh = since(high > high[1])  // a separate counter

plot(sinceUp, "Bars since an up close", aqua)
plot(sinceHigh, "Bars since a higher high", orange)
```

This is what makes a stateful helper reusable. If the two calls shared one `n`, the second would corrupt the first and the function could be used only once per script.

It works because the compiler gives every call site its own fixed slots for state, once, before bar 0. Nothing is allocated while a bar runs, which keeps the rule cheap, and it is also why recursion is not allowed: a function calling itself would need a number of slots nobody knows until the bar runs.

### The bug this causes

The rule bites when you assume the opposite: that a function holding a counter holds one counter for the whole script.

```openscript expect=OS8001
version 1
strategy("Tagged entries", overlay = true)

fast = ema(close, 9)
slow = ema(close, 21)

// This looks like one counter for the file. It is two: one per call site.
fn nextTag() =>
    var n = 0
    n += 1
    "T" + text(n, 0)

if crossUp(fast, slow)
    buy(qty = 1, tag = nextTag())  // counts T1, T2, T3, ...

if crossDown(fast, slow)
    sell(qty = 1, tag = nextTag())  // also counts T1, T2, T3, ...
```

The first long entry is tagged `T1`, and so is the first short entry. A tag is meant to name one order in the backtest report and to let the script refer to that part of its position later, as `close(tag = "T1")` does, and a tag two entries share names neither of them on its own. Nothing errors. The compiler does warn, with [OS8001](/script/errors/warnings#os8001) on each call, because each `nextTag()` sits inside a branch and advances only on the bars that branch runs. Take that warning as the thread to pull.

The fix is to decide where the state belongs:

```openscript
version 1
strategy("Tagged entries", overlay = true)

fast = ema(close, 9)
slow = ema(close, 21)

// One counter, in the file scope, where there is exactly one of it.
var tagSeq = 0

// No var and no stateful call: its call sites share nothing to drift apart.
fn tagFor(n) => "T" + text(n, 0)

if crossUp(fast, slow)
    tagSeq += 1
    buy(qty = 1, tag = tagFor(tagSeq))

if crossDown(fast, slow)
    tagSeq += 1
    sell(qty = 1, tag = tagFor(tagSeq))
```

| The state must be | Put it in | Because |
|---|---|---|
| Shared by the whole script | A `var` in the file scope | There is exactly one file scope |
| Separate for each use | A `var` inside the function | Each call site gets its own copy |
| Separate for each element of a list | An array the script owns, indexed | A call site is one site however many times a loop runs it |

### A call inside a loop is still one call site

A loop body is written once, so a call in it is one call site with one piece of state, and every iteration writes into it. That is right for a running total across the loop, and wrong when you wanted one counter per element:

```openscript expect=OS8001
fn countIf(cond) =>
    var n = 0
    if cond
        n += 1
    n

tests = [close > open, high > high[1], volume > volume[1]]

// Wrong: every iteration writes into the same n, so this is one counter
// shared by three questions.
shared = 0
for i = 0 to size(tests) - 1
    shared = countIf(element(tests, i))
plot(shared, "One counter, three questions", red)
```

When you want state per element, the element's index has to appear somewhere, and an array is where it appears:

```openscript
version 1
study("Three counters", precision = 0)

tests = [close > open, high > high[1], volume > volume[1]]

// One counter per question, indexed by the loop.
var counts: array<number> = [0.0, 0.0, 0.0]
for i = 0 to size(tests) - 1
    if element(tests, i)
        set(counts, i, element(counts, i) + 1)

plot(element(counts, 0), "Up bars", aqua)
plot(element(counts, 1), "Higher highs", orange)
plot(element(counts, 2), "Rising volume", purple)
```

### A call site that does not run

**A call site that does not run on a bar leaves its value absent for that bar, and its state does not advance.** The previous value is not carried forward either.

```openscript expect=OS8001
trending = close > ema(close, 50)
if trending
    e = ema(close, 20)  // advances only on trending bars
    barColor(close > e ? lime : red)
```

Running the call anyway would execute code the script said to skip, and carrying the last value forward would draw a flat line that looks like data. Absence is honest: the line breaks on exactly the bars the call was skipped. Because this is almost always a mistake, the compiler reports [OS8001](/script/errors/warnings#os8001). The fix is always the same: compute on every bar at the top level, and move the condition from around the calculation to around the value.

```openscript
e = ema(close, 20)
trending = close > ema(close, 50)
plot(trending ? e : none, "EMA while trending", aqua)
```

## Recursion is not allowed

Recursion means a function calling itself. It is not allowed, directly or through a cycle of functions, and the compiler reports [OS2005](/script/errors/names-and-types#os2005) and names the cycle.

```openscript expect=OS2005
fn lookbackSum(n) =>
    if n <= 0
        return 0
    close[n] + lookbackSum(n - 1)
```

Write the loop instead:

```openscript
fn lookbackSum(n) =>
    total = 0.0
    for i = 0 to n
        total += close[i]
    total

plot(lookbackSum(4), "Sum of the last five closes", aqua)
```

## A worked example for F&O

A helper that turns a capital amount into whole lots of a futures or options contract. [[chart.lotSize]] is the contract's lot size when the application running the script states it, and absent when it does not, so the script takes a lot size from its settings as the fallback. That fallback is a genuine answer the user gives, not an invented number.

```openscript
version 1
study("Lots for the capital", precision = 0)

capital = input(500000, "Capital, in rupees", min = 10000)
lotSetting = input(1, "Lot size, when the chart does not state one", min = 1)

// The instrument's own lot size when it is known, otherwise the setting.
lotSize = orElse(chart.lotSize, lotSetting)

// Whole lots the capital pays for in full at this bar's price.
fn lotsFor(amount: number, price: series number, lot: number) =>
    floor(amount / (price * lot))

plot(lotsFor(capital, close, lotSize), "Lots", aqua, style = "step")
```

On an option chart the price is the premium, so this is the number of lots the capital buys outright. On a futures chart it is the number of lots the capital covers at full contract value, which is more cautious than sizing by margin.

## Errors and warnings you may meet

| Code | Means | Fix |
|---|---|---|
| [OS1019](/script/errors/syntax#os1019) | A reserved word used as a parameter name | Rename the parameter |
| [OS1023](/script/errors/syntax#os1023) | A function declared inside a block or another function | Move it to the top level |
| [OS2002](/script/errors/names-and-types#os2002) | A local or parameter reuses an outer name | Rename it |
| [OS2004](/script/errors/names-and-types#os2004) | `[]` on something with no history | Take history from a series parameter, or name the value at the top level |
| [OS2005](/script/errors/names-and-types#os2005) | A function calls itself | Write a loop |
| [OS2014](/script/errors/names-and-types#os2014) | A function used as a value | Call it and use the result |
| [OS2016](/script/errors/names-and-types#os2016) | An unknown type in an annotation | Use `number`, `string`, `bool`, `color` or `array<T>` |
| [OS2017](/script/errors/names-and-types#os2017) | Two functions share a name | Rename one |
| [OS2018](/script/errors/names-and-types#os2018) | A parameter name appears twice | Rename the second |
| [OS3001](/script/errors/arguments#os3001) | Wrong number of arguments | Check the header; defaults let you pass fewer |
| [OS3002](/script/errors/arguments#os3002) | An unknown named argument | Use a name the fix lists |
| [OS3005](/script/errors/arguments#os3005) | A positional argument after a named one | Put positional arguments first |
| [OS3013](/script/errors/arguments#os3013) | An argument given twice | Keep one |
| [OS8001](/script/errors/warnings#os8001) | A stateful call inside a branch or a loop | Compute at the top level, branch on the value |

**Related.** [Variables and scope](/script/language/variables-and-scope), [Execution model](/script/language/execution-model), [Persistence](/script/language/persistence), [Collections](/script/language/collections), [Objects and methods](/script/language/objects-and-methods), [Libraries](/script/language/libraries), [Absent values](/script/language/absent-values)
