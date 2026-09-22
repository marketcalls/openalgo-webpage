---
title: OS2xxx Names and types
description: Every OS2 code, raised when a script parses but its meaning does not work out, such as a name read before it exists, a name declared twice, or two values of types that do not fit together.
---

OS2xxx codes come from the checker, the `check` stage that runs after the file has been read and before the first bar. By then the text is a well-formed program, and what fails is its meaning: a name read before it is assigned or spelt differently from its assignment, the same name declared twice, a number where a condition belongs, `[]` on a value that keeps no history. Nothing has run yet, so these are still cheap to fix: the change is on the line reported, or on the line the message points to.

Two ideas explain most of this range. First, names follow the order of the file: a script runs top to bottom on every bar, so a name must be assigned above the line that reads it, and a name first assigned inside a block stays inside that block. Second, types never convert by themselves: a number is not a string and `0` is not `false`. When you mean a conversion you write it: [[text()]] turns a number into a string, [[toNumber()]] reads a number from a string, and a comparison such as `count > 0` turns a number into a `bool`.

## A script that gets names and types right

This study marks bars on any NSE or MCX instrument where volume jumps above a multiple of its recent average. Every name is assigned before it is read, every condition is a bool, and the number in the marker is turned into text with [[text()]].

```openscript title="Volume spike"
version 1
study("Volume spike", overlay = false)

len = input(20, "Average length")
mult = input(2.0, "Spike multiple")

// Assigned at the top level, above every line that reads it.
avgVolume = sma(volume, len)
spike = volume > mult * avgVolume

plot(volume, "Volume", gray, style = "histogram")
plot(avgVolume, "Average volume", orange)

// A condition is a bool, and text is built with text().
if spike and not spike[1]
    signal("Spike " + text(volume / avgVolume, 1) + "x")
```

The rules it follows, and the code you get for breaking each one:

| Rule | Code when broken |
|---|---|
| A name is assigned above the line that reads it, in the same block or an enclosing one | [OS2001](#os2001) |
| One variable per name: no second declaration inside a function, and no reuse of a built-in name | [OS2002](#os2002) |
| A name keeps the type of its first value, and types never mix on their own | [OS2003](#os2003) |
| A condition is a `bool` | [OS2011](#os2011) |
| `[]` reads the history of a series (a value with one entry per bar): a built-in series, a top-level name, or a call that returns a series | [OS2004](#os2004) |
| One `study()` or `strategy()` declaration per file | [OS2007](#os2007), [OS2008](#os2008) |

## Names and scope

A name is declared by its first assignment. At the top level it belongs to the whole file from that line on. Inside an `if`, a loop, a `switch` arm or a function body it belongs to that block. Assigning inside an `if` or a loop to a name that already exists above updates that name, so there is only ever one variable with a given name. See [Variables and scope](/script/language/variables-and-scope).

{{error: OS2001}}

The name is not known on the line that reads it. There are three usual causes. It is misspelt, and the fix suggests the closest name the compiler knows, as with `lenght` for `len`. It is assigned further down the file, and since the script runs top to bottom on every bar, a line cannot read a name that has not been assigned yet. Or it was first assigned inside an `if`, a loop or a function and is read outside it, where it does not exist: assign it at the top level first, even as `none`, and let the block update it.

A prefix in front of a library function also lands here, as in `ta.ema(close, 9)`, because the whole dotted name is unknown: everyday functions are written bare, `ema(close, 9)`. Your own functions are the one exception to the order rule: an `fn` may be called on a line above its declaration.

{{error: OS2002}}

OpenScript never has two variables with one name. A function body can read a name from the file but not declare one of its own with the same name, so `len = 9` inside a function, when the file already has a `len`, is refused, and so is a parameter called `len`. Built-in names such as `close`, `high`, `ema`, `aqua` and `plot` count as declared already: `close = 5`, `ema = 9` or a parameter called `high` all land here, and the message then gives the earlier line as `built-in`.

Rename the new name. Inside an `if` or a loop, assigning to a name from above is not this error: it updates that name, which is usually what you wanted.

{{error: OS2006}}

A `for` loop owns its variable: the counter in `for i = 0 to 9`, or the element in `for price in prices`. The body may read it but not assign to it, because a loop whose counter the body can move no longer runs the number of times its header says. To leave the loop early, use `break`. To work with a changed value, copy it into a name of your own first.

{{error: OS2009}}

A namespace such as `bar`, `chart`, `session`, `date`, `str`, `math`, `pos`, `order` or `draw` holds a fixed set of members, and the one written is not among them. It is a typo or a member of a different namespace. The fix names the closest member, which is right for a small slip (`session.isFirst` suggests `isFirstBar`) and only a guess for a bigger one (`chart.lot` suggests `chart.now`, when the member wanted is [[chart.lotSize]]). The reference lists every member of every namespace.

{{error: OS2010}}

Built-in values such as `volume`, `high` and `bar.index` are read bare, without brackets. An argument list after one usually means a function was remembered under the wrong name: `volume(20)` for the 20-bar average volume is `sma(volume, 20)`. Remove the brackets to read the value, or call the function you meant. The function the fix names is only the closest spelling to the value you wrote, so it is often unrelated: for `volume(20)` the console suggests `blue`. Look up the function you meant in the reference.

{{error: OS2020}}

The name is part of the language and is not implemented in this release. It is spelt correctly, and no line above it would help. The reference marks such names as Planned. Examples in version 0.5.0 include [[kama()]], [[session.isOpen]] and the multi-leg [[leg.fixed()]].

Compute the value from functions that exist today, or take the line out until a release implements it. Do not swap in a function with a similar name just because it compiles: it computes something else, and a plot that quietly changes meaning is worse than one that refuses to compile.

## Types

Every value has a type: `number`, `string`, `bool`, `color`, an array, or one of the object types. A name takes its type from its first definite value and keeps it. See [Types and values](/script/language/types-and-values).

{{error: OS2003}}

Two values whose types do not fit together meet in one expression. The language never converts on its own: `"count: " + 5` is refused because `+` joins two strings or adds two numbers, never one of each, and `1 + true` is refused because a `bool` is not a number. Convert explicitly: [[text()]] turns a number into text (`text(x, 2)` with two decimals), [[toNumber()]] reads a number from a string, and [[toBool()]] turns an absent value into `false`.

The same code covers a name whose type changes. `len = 14` followed later by `len = "fourteen"` is refused, because `len` became a number on its first line. A first value of `none` fixes no type, which is how `var stop = none` can later hold a price. It also covers a plot handle used as a number: `p = plot(close, "Close")` names the plot itself, not its value, so `p + 1` has nothing to add. Keep the value in a name of its own and plot that.

{{error: OS2011}}

`if`, `while`, `not`, both sides of `and` and `or`, and the `?` of a ternary need a `bool`, or an absent value, which takes the false branch. No rule turns a number or a string into true or false, so write the test you mean: `hitCount > 0` for a count, `mode != ""` for a string, [[isNone()]] for absence. `if volume` is the same mistake; write `if volume > 0`.

This is the case of [OS2003](#os2003) for conditions, with a fix that names the test to write.

{{error: OS2012}}

The two arms of `condition ? a : b` produce one value, so they must be the same type. `none` fits either arm, and it is how an arm says there is nothing here, as in `plot(ready ? value : none, "Value")`. Otherwise make both arms produce the same kind of value, for example two strings, or convert one arm with [[text()]] or [[toNumber()]].

{{error: OS2013}}

An array holds elements of one type, which is what lets [[size()]], [[sum()]], [[avg()]] and [[sort()]] mean one thing. A literal such as `["RSI", 14, "EMA", 9]` mixes strings and numbers, and it is usually two lists that belong side by side: keep one array of names and one of lengths, and index them together.

## History

{{error: OS2004}}

`[1]` reads the value a name had one bar ago, and the engine keeps that history only for values it records on every bar: built-in series such as `close` and `volume`, names assigned at the top level of the file, calls that return a series (so `ema(close, 9)[1]` works), and series parameters of your own functions. Everything else keeps no history: a name first assigned inside an `if` or a loop, a bracketed expression such as `(close - open)[1]`, a plot handle, a drawing object, and a fixed fact about the instrument such as [[chart.lotSize]].

Assign the value to a top-level name and read that name's history: `body = close - open`, then `body[1]`. See [Bars and history](/script/language/bars-and-history).

## Arrays and annotations

An annotation states a type after a colon, as in `var hits: array<number> = []` or `fn band(src: series number)`. Annotations are optional; the compiler checks them when you write them.

{{error: OS2015}}

An empty array literal, `[]`, has no elements to take its type from. The compiler looks for an annotation, or for the first [[push()]], [[unshift()]], [[insert()]] or [[set()]] in the file that puts an element into the array, and uses that. With neither, it does not guess. Annotate the declaration, `var hits: array<number> = []`, or add the call that fills it.

{{error: OS2016}}

The types you can write in an annotation are `number`, `string`, `bool`, `color`, `array<T>` and the object types `line`, `label`, `box`, `polyline` and `table`, with `series` in front for a value that changes per bar. There is no `int` or `float`: a length, a bar count and a price are all `number`. `plot`, `fill` and `level` cannot be written in an annotation either, because a plot handle can never be stored, passed or returned.

{{error: OS2019}}

An array element is a `number`, a `string`, a `bool`, a `color`, or a `line`, `label`, `box`, `polyline` or `table` object. An array of arrays, an array of series and an array of plots are all refused. To keep several plots, declare each one at the top level with its own name. To keep several values per entry, keep one array per value and index them together. This is the case of [OS2016](#os2016) for array elements.

## Functions

{{error: OS2005}}

A function cannot call itself, directly or through other functions, and the message names the cycle, such as `a calls b calls a`. Each place in the file that calls a function keeps its own state for `var` and for stateful calls such as [[ema()]], set up before the first bar, and a recursive call would need an unknown number of them. Rewrite the work as a `for` or `while` loop. In version 0.5.0 the console also shows [OS6018](/script/errors/data#os6018) on the function's line, with a long technical message; it clears when the recursion does.

{{error: OS2014}}

In version 1 a function is not a value: you cannot assign `ema` to a name, keep it in an array or pass it to another function, as in `sma(ema, 9)`. Call it with its arguments and use what it returns. To let the user choose between moving averages, pass a string input to [[ma()]], which takes the kind of average as its third argument.

{{error: OS2017}}

A file has one function per name. Two `fn` declarations with the same name would make each call's meaning depend on its arguments, so the second is refused. Rename one of them, or merge the two by giving the extra parameter a default value: `fn band(src, len = 20) => sma(src, len)` covers both `band(close)` and `band(close, 50)`.

{{error: OS2018}}

Every parameter of a function needs its own name, because the body refers to parameters by name and a named argument in a call picks one by name. Rename the repeated parameter.

## The declaration

Every script has exactly one declaration, `study()` or `strategy()`, and by convention it sits directly under `version 1`. It gives the chart the title, the pane and the settings it needs before the first bar. See [Declarations](/script/reference/declarations).

{{error: OS2007}}

The file has no `study()` or `strategy()` line. Without one there is no title for the legend and no entry for the indicator list. Add `study("Name")` under `version 1`, or `strategy("Name")` if the script will place orders.

{{error: OS2008}}

The file declares twice. A strategy accepts every option a study does, so a file that seems to need both is a strategy: keep the `strategy()` line, move any options from the `study()` line onto it, and delete the `study()` line. See [Strategies overview](/script/strategies/overview).

**Related.** [Reading an error](/script/errors/overview), [Variables and scope](/script/language/variables-and-scope), [Types and values](/script/language/types-and-values), [Absent values](/script/language/absent-values), [Bars and history](/script/language/bars-and-history), [User functions](/script/language/functions), [Collections](/script/language/collections), [OS3xxx Arguments](/script/errors/arguments)
