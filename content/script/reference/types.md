---
title: Types
description: The value types of OpenScript, the series, input and constant qualifiers, arrays, drawing objects and declaration handles, and the annotations that name them.
---

Every value in an OpenScript script has a type, and the compiler knows it before the first bar runs. This page lists every type in version 1, the three qualifiers that say when a value is known (fixed when the script compiles, fixed by the settings dialog, or new on every bar), and the annotations you can write to state a type yourself.

Types matter because OpenScript never converts one into another behind your back. `"count: " + 5` does not quietly become `"count: 5"`, and a number is never a condition. Knowing the list below turns most compile errors into something you can predict.

```openscript title="Types at work"
version 1
study("Typed helpers", overlay = true)

lookback = input(20, "Lookback", min = 2, max = 200)   // number, fixed by the settings dialog
tint     = input(aqua, "Colour")                        // color, fixed by the settings dialog

fn band(src: series number, len: number, mult: number = 2) =>
    sma(src, len) + mult * stdev(src, len)

var highs: array<number> = []                          // an array of numbers
var marks: array<label> = []                           // an array of drawing objects

upper = band(close, lookback)                          // series number
push(highs, high)
if size(highs) > lookback
    shift(highs)

if close > upper
    push(marks, draw.label(time, high, "Above " + text(upper, 2)))
if size(marks) > 10
    draw.delete(element(marks, 0))
    shift(marks)

plot(upper, "Upper band", tint)
plot(max(highs), "Highest kept high", silver)
```

## The type list

| Type | Holds | Written as | Can be annotated |
|---|---|---|---|
| `number` | One finite number | `42`, `3.14`, `0xFF`, `1_000` | Yes |
| `string` | Text, as Unicode code points | `"BUY"`, `'BUY'` | Yes |
| `bool` | `true` or `false` | `true`, `false` | Yes |
| `color` | Red, green, blue and alpha (opacity) | `aqua`, `#ff8800`, `#ff880080` | Yes |
| `none` | The absent value | `none` | No, it belongs to every type |
| `series T` | One `T` per bar | No literal | Yes, as `series number` and so on |
| `array<T>` | An ordered, resizable list of one type | `[1, 2, 3]` | Yes |
| `line`, `label`, `box`, `polyline`, `table` | An object the script creates and keeps | Returned by the drawing calls and [[table()]] | Yes |
| `plot`, `fill`, `level` | A declaration handle, fixed before bar 0 | Returned by [[plot()]], [[plotCandles()]], [[fill()]] and [[level()]] | No |

There is no integer type and no date type, and you cannot declare a type of your own in version 1; the word `type` is reserved for that later. Some library tables show a parameter as `any`: that is a library function accepting several types, not a type you can write.

## Value types

### number

A `number` is a 64-bit floating point value that is always finite. It is the only numeric type, so a length, a bar count, a lot size and a price are all `number`, and no conversion between them exists to get wrong.

Where a whole number is required, such as a lookback length, an array index or a loop step, a fractional value is refused rather than rounded for you. The compiler reports `OS3004` when it can see the value; a value computed on a bar stops the script when that bar runs (`OS4003` for a length, `OS4004` for an array index). Round it yourself with [[floor()]] or [[round()]], where a reader can see which way it goes.

An operation with no finite result, such as `1 / 0` or `sqrt(-1)`, gives `none` instead of infinity or not-a-number.

```openscript
len = input(21, "Slow length", min = 2, max = 500)
halfLen = floor(len / 2)          // 10, not 10.5, and the choice is visible
plot(sma(close, len), "Slow", orange)
plot(sma(close, halfLen), "Fast", aqua)
```

Number literals:

| Literal | Value |
|---|---|
| `42`, `3.14`, `.5` | Decimal, a leading digit is optional |
| `1_000_000` | Underscores group digits and mean nothing |
| `2.5e-4` | An exponent |
| `0xFF` | Hexadecimal, 255 |
| `010` | Ten. There is no octal form |

Time is a `number` too: milliseconds since 1 January 1970, in UTC. That is why [[time]] can be subtracted, compared and stored like any number, and why the [date functions](/script/reference/date) exist to read it as a calendar.

### string

Text, as a sequence of Unicode code points. Double and single quotes mean the same thing, so a string holding one kind needs no escape: `'He said "go"'`. The escapes are `\\`, `\"`, `\'`, `\n`, `\t`, `\r`, `\0` and `\uXXXX` with four hex digits; any other is `OS1005`. A string cannot run past the end of its line (`OS1004`); join pieces with `+` across lines instead.

`+` joins two strings, and `<`, `<=`, `>`, `>=` compare them by code point, the same on every machine. Everything else is in the [string functions](/script/reference/string).

```openscript
panel = table("Symbol", 1, 1, position = "bottomRight")
symbolLine = "NIFTY" + " " + text(close, 2)
if bar.isLast
    cell(panel, 0, 0, symbolLine)
```

### bool

`true` or `false`, and nothing else. A `bool` is not a number: `0` is not false, `1` is not true, and `""` is not false. A condition must be a `bool` or `none`; anything else is `OS2011`. To turn a condition into a number, write `cond ? 1 : 0`, or count it over a window with [[count()]].

```openscript
upBar = close > open
plot(count(upBar, 20), "Up bars in the last 20")
```

### color

Red, green, blue and alpha, where alpha is the opacity. Write one of the nineteen named colours such as `aqua` or `orange`, a hex literal `#rrggbb` or `#rrggbbaa`, or build one with [[rgb()]], [[rgba()]], [[fade()]], [[withAlpha()]] or [[mix()]]. Two colours are equal when all four channels match.

```openscript
tint = close > open ? lime : fade(red, 40)
barColor(tint)
```

See [Colors](/script/reference/color) for every named colour and function.

### none

The absent value, written `none`. It is the only value of its own type, and it also belongs to every other type, so a `series number` can hold `none` on any bar and a `string` name can hold it too. It is what a moving average holds before it has enough bars, what `close[1]` is on the first bar, and what a division by zero gives.

It passes through arithmetic and ordered comparison, `==` and `!=` always answer `true` or `false`, and a condition that is `none` takes the false branch. See [Absent values](/script/language/absent-values) and the functions [[isNone()]] and [[orElse()]].

## Qualifiers: when a value is known

A type says what a value is. A qualifier says when it is settled, and some arguments accept only a value settled before the first bar.

| Qualifier | Settled | Examples |
|---|---|---|
| Constant | When the script compiles | Literals, arithmetic over literals, named colours, `math.pi`, `math.e`, and [[rgb()]], [[rgba()]], [[fade()]], [[withAlpha()]], [[alpha()]], [[mix()]] over constants |
| Input | Before bar 0, by the settings dialog | A call to [[input()]], and a name bound directly to one |
| Series | Afresh on every bar | [[close]], [[bar.index]], `ema(close, 9)`, any name computed from bar data |

Each level can stand wherever a later one is accepted: a constant works anywhere an input or a series does, and an input works anywhere a series does. The reverse is refused.

| Place | Accepts | Refused with |
|---|---|---|
| Options of `study()` and `strategy()` | A constant, or an input used as it is | `OS3003` |
| Arguments marked "Fixed before the first bar" in a reference table, such as a table's corner or a marker's shape | A constant, or an input used as it is | `OS3003` |
| `limits(loops = ..., history = ...)` | A literal number only | `OS3015` |
| Everything else | Any of the three | |

:::warn
A name bound to a literal is not a constant to the compiler. `corner = "topLeft"` followed by `table("T", 1, 1, position = corner)` is `OS3003`. Write the literal in place, or make it a setting with `corner = input("topLeft", "Corner")`, which is accepted.

An input must also be used as it is. A fixed field holds a value or a reference to one setting, so an expression computed from an input, such as `input(2, "Decimals") + 1` or `fade(tint, 50)` where `tint` is an input, is refused there. In release 0.5.0 that refusal is reported as `OS6018`, a message about a program that failed verification; the cause is the expression, and the fix is to make the setting itself hold the value the field needs.
:::

```openscript
corner = input("topLeft", "Corner", options = ["topLeft", "topRight", "bottomLeft", "bottomRight"])
panel  = table("Last close", 1, 2, position = corner)   // an input is fixed before bar 0
if bar.isLast
    cell(panel, 0, 0, "Close")
    cell(panel, 0, 1, text(close, 2))
```

### Series and broadcast

A series is the per-bar history of a value: `series number` is one number per bar. Read bare, it gives this bar's value; `[n]` gives the value `n` bars back.

A plain value used where a series is expected is broadcast: treated as that same value on every bar. A series used where a plain value is expected means this bar's value. That is why `ema(close, 9)` works whether the length is a literal, an input or a series. Broadcast is the only automatic conversion in the language, and it changes no value.

A value has history, and accepts `[n]`, in four cases:

1. It is a built-in series, such as [[open]], [[close]], [[volume]], [[time]] or [[bar.index]].
2. It is a name declared at the top level of the file.
3. It is a call to a function that returns a series, such as `ema(close, 9)`.
4. It is a series parameter of your own function, where `[n]` reads the history of whatever the caller passed.

Anything else is `OS2004`. The facts in the [`chart` namespace](/script/reference/chart) are the clearest case: they are fixed for the whole run, so `chart.tickSize[1]` asks a question with no different answer and is refused.

```openscript
body = close - open                              // top level, so it has history
plot(body - body[1], "Change in body size")
```

An [[input()]] is a single value, with one exception: a source input such as `input(close, "Source")` returns a `series number`, because what the user picks is a series.

## Arrays

`array<T>` is an ordered, resizable list whose elements share one type. The element type is `number`, `string`, `bool`, `color`, or an object type: `line`, `label`, `box`, `polyline` or `table`.

| Rule | Detail |
|---|---|
| Not an element type | A series, a declaration handle or another array: `array<array<number>>` is `OS2019` |
| Empty literal | Takes its type from an annotation or from the first `push`, `unshift`, `insert` or `set` into it; with neither it is `OS2015` |
| Mixed literal | `["RSI", 14]` is `OS2013`; keep two arrays side by side |
| Assignment | Copies the reference, not the contents: two names, one array. [[copy()]] makes an independent array |
| `==` | True only for the same array. [[arrayEqual()]] compares contents |
| Index out of range | `OS4004` |
| Size | At most 1,000,000 elements (`OS5002`) |

```openscript
var window: array<number> = []
push(window, close)
if size(window) > 20
    shift(window)
plot(avg(window), "Mean of the last 20 closes", aqua)
```

A function with more than one output returns an `array<number>` of this bar's outputs, in the order its reference entry documents. The array is never absent and never changes length; each element has its own warmup and is `none` until it is ready.

```openscript
m = macd(close, 12, 26, 9)
plot(m[0], "MACD", aqua)
plot(m[1], "Signal", orange)
plot(m[2], "Histogram", gray, style = "histogram")
```

See [Collections](/script/reference/collections) for every array function.

## Drawing objects

`line`, `label`, `box`, `polyline` and `table` are runtime objects. The script creates them as bars arrive, keeps them, changes them and deletes them. An object is a reference, like an array: assigning it to a second name gives two names for one object, and `==` asks whether two names hold the same object.

An object lives from the bar that created it until the bar that deletes it with [[draw.delete()]] or [[draw.deleteAll()]]. Dropping every name that refers to it does not delete it; the chart keeps drawing it. A [[table()]] is never deleted; [[clear()]] empties its cells.

```openscript
var marks: array<label> = []
if crossUp(close, sma(close, 50))
    push(marks, draw.label(time, low, "Up", textColor = lime))
if size(marks) > 20
    draw.delete(element(marks, 0))
    shift(marks)
```

## Declaration handles

`plot`, `fill` and `level` are declaration handles. A call to [[plot()]], [[plotCandles()]], [[fill()]] or [[level()]] declares a fixed part of the study, a column, a band or a line, once, before bar 0. The handle it returns is that declaration, and it exists only for the compiler.

A handle can be named at the top level and passed to [[fill()]], and nothing else. It cannot be held in a `var`, stored in an array, passed to or returned from your own function, compared, or used in arithmetic (`OS2003`). Its type name cannot be written in an annotation (`OS2016`).

```openscript
b = bollinger(close, 20, 2)
upper = plot(b[1], "Upper", aqua)
lower = plot(b[2], "Lower", aqua)
fill(upper, lower, color = fade(aqua, 88))
```

| Operation | `plot`, `fill`, `level` | `line`, `label`, `box`, `polyline`, `table` |
|---|---|---|
| Name at the top level | Yes | Yes |
| Name inside a block or a function | No | Yes |
| Hold in a `var` | No | Yes |
| Hold in an array | No | Yes |
| Pass to your own function, or return from one | No | Yes |
| Compare with `==` and `!=` | No | Yes, as identity |
| Read history with `[n]` | No | No |
| Arithmetic or a condition | No | No |

## Calls that return nothing

A call that acts rather than computes, such as [[signal()]], [[print()]], [[background()]] or [[draw.delete()]], returns no value at all. That is not `none`: there is nothing to keep, so write the call as a statement on its own line.

## User types

Version 1 has no user-declared record types. Where a record would hold several fields, keep one array per field and index them together, as [[draw.polyline()]] does with its arrays of times and prices.

## Type annotations

The compiler infers every type, so annotations are optional. Write one to document intent, or where there is nothing to infer from, as with an empty array or a `var` that starts as `none`.

| Where | Form |
|---|---|
| A `var` declaration | `var name: T = initial` |
| A function parameter | `name: T`, or `name: T = default` |

An annotation is `series` in front of a value type, `array<T>`, or an object type.

```openscript
newDay = bar.isFirst or not date.isSameDay(time, time[1])
var dayHigh: series number = none
if newDay or high > dayHigh
    dayHigh = high
plot(dayHigh, "High of the day so far", style = "step")
```

```openscript
fn band(src: series number = close, len: number = 20) => sma(src, len)

basis = band()
var hits: array<number> = []
var lastSide: color = gray
if close > basis
    push(hits, close)
    lastSide = lime
else if close < basis
    lastSide = red
barColor(lastSide)
plot(size(hits), "Closes above the band so far")
```

Annotations do not go on a plain assignment (`x: number = 5` is a syntax error) or on a function's result: a function's type is inferred from its body. An annotation naming a type that does not exist, such as `integer` or `plot`, is `OS2016`, and a value that does not match its annotation is `OS2003`.

## How a name gets its type

A name's type is fixed by the first assignment that gives it a definite value, and assigning another type later is `OS2003`, however far apart the two lines are. `none` carries no type, so `var stop = none` waits for the first real value to fix it.

```openscript
var stop = none               // no type yet
if close > open
    stop = low                // number, from here on
plot(stop, "Stop")
```

A name that never receives a definite value is absent on every bar. Plotting it draws nothing, and the compiler warns with `OS8009`.

## Conversions

There is no implicit conversion between any two types. The conversions are four calls:

| Call | Takes | Gives |
|---|---|---|
| `text(x)` | Any value | `string`; `text(none)` is `"none"` |
| `text(x, decimals)` | `number` | `string` with fixed decimals |
| `toNumber(s)` | `string` | `number`, or `none` when the text is not a number |
| `toBool(x)` | `bool` or `none` | `bool`; `none` becomes `false` |

See [[text()]], [[toNumber()]] and [[toBool()]] on the [General](/script/reference/general) page.

## Type errors you are likely to meet

| Code | Means | Usual fix |
|---|---|---|
| `OS2003` | Two types do not mix, or a name changed type | Convert with `text`, `toNumber` or `toBool`, or use a second name |
| `OS2004` | The value has no history | Name it at the top level of the file and read that name |
| `OS2011` | A condition is not a `bool` | Write the test out: `x > 0`, `isNone(x)`, `s != ""` |
| `OS2012` | The ternary's arms have different types | Make them agree, or use `none` for the empty arm |
| `OS2013` | An array literal mixes types | Split it into two arrays |
| `OS2015` | An empty array has no element type | Annotate it: `var hits: array<number> = []` |
| `OS2016` | An annotation names no type | Use `number`, `string`, `bool`, `color`, `array<T>` or an object type |
| `OS2019` | That type cannot be an array element | Use a value or object type |
| `OS3003` | A value that must be fixed before bar 0 depends on bar data | Use a literal or an `input()` |
| `OS3004` | A whole number was required | Wrap it in [[floor()]] or [[round()]] |

Related: [Types and values](/script/language/types-and-values), [Absent values](/script/language/absent-values), [Collections](/script/language/collections), [Objects and methods](/script/language/objects-and-methods), [Keywords](/script/reference/keywords), [Operators](/script/reference/operators).
