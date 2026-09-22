---
title: Types and values
description: The value types of OpenScript (number, string, bool, color, arrays and the absent value), series and single values, what an input gives you, how the compiler infers a type, and the conversions it allows and refuses.
---

Every value in an OpenScript script has a type, and the compiler works each one out for you: there are no type declarations to write for ordinary names. This page covers the small, closed set of types, the difference between a series (one value per bar) and a single value (one value for the whole run), what an [[input()]] gives you, the few explicit conversions, and the conversions the language refuses. Knowing these rules lets you read a type error (codes starting OS20) and see the fix straight away.

## A first look

```openscript
version 1
study("Types at a glance", precision = 2)

len = input(14, "RSI length", min = 2, max = 100)  // number, fixed for the run
r = rsi(close, len)  // series number
hot = r > 70  // series bool
mood = hot ? "overbought" : "normal"  // series string
tint = hot ? red : purple  // series color
bands = [30.0, 50.0, 70.0]  // array<number>
t = table("RSI", 1, 1)  // table, a runtime object

plot(r, "RSI", tint, width = 2)
level(element(bands, 2), "Upper", gray)
level(element(bands, 0), "Lower", gray)

if bar.isLast
    cell(t, 0, 0, "RSI " + text(r, 1) + " is " + mood)
```

No line names a type, and every name still has exactly one. The compiler infers it from the first assignment and holds the name to it for the rest of the file.

## The types

| Type | Holds | Written as |
|---|---|---|
| `number` | One finite real number | `42`, `3.14`, `0xFF`, `1_000_000` |
| `string` | Text, as Unicode code points | `"BUY"`, `'BUY'` |
| `bool` | `true` or `false` | `true`, `false` |
| `color` | Red, green, blue and alpha (opacity) | `aqua`, `#ff8800`, `rgb(255, 136, 0)` |
| `none` | The absent value | `none` |
| `series T` | One `T` per bar | No literal: `close`, `ema(close, 9)` |
| `array<T>` | An ordered, resizable list of `T` | `[1, 2, 3]` |

Two facts about this table are worth reading twice.

**`none` belongs to every type.** A `series number` may hold `none` on any bar, and so may a `string` or a `color`. A name that is a number on most bars and absent on a few is an ordinary `series number`, not a mixed type. [Absent values](/script/language/absent-values) covers `none` in full.

**`series T` is the same `T`, once per bar.** It is not a separate family of types you convert to and from. The language moves between the two automatically in the one direction that loses nothing, described under [Broadcast](#broadcast-the-one-automatic-conversion) below.

The library also returns two kinds of handle that are not ordinary values: declaration handles from [[plot()]], [[fill()]] and [[level()]], and runtime objects from the `draw.*` functions and [[table()]]. They are covered at the end of this page.

## Numbers

A `number` is a 64-bit floating point value that is always finite. There is one numeric type: no separate integer, decimal, price or quantity type. A length, a bar count, a lot size and a price are all `number`, so there are no conversions between them to get wrong.

```openscript
a = 42
b = 3.14
c = .5  // a leading digit is optional
d = 1_000_000  // underscores group digits and mean nothing
e = 2.5e-4
f = 0xFF  // hexadecimal, 255
g = 010  // ten: there is no octal form
plot(a + b + c + d + e + f + g, "Sum")
```

A negative number is the minus operator applied to a literal, so `-2` works anywhere an expression does, including an argument list.

**Where a whole number is required, a fraction is refused, never truncated.** A lookback length, a history offset and an array index must be whole numbers. A length of 14.5 stops the script on the bar where it happens, with an error, rather than being rounded, because a length of 14.5 is a bug and rounding it would hide the bug. Say which way you want it rounded, where a reader can see it:

```openscript
version 1
study("Half length", overlay = true, precision = 2)

len = input(21, "Slow length", min = 2, max = 500)

// len / 2 is 10.5 when len is 21, and sma refuses a length of 10.5.
halfLen = floor(len / 2)

plot(sma(close, len), "Slow", orange, width = 2)
plot(sma(close, halfLen), "Fast", aqua, width = 2)
```

| Where a fraction arrives | Error, raised on the bar it happens |
|---|---|
| A library length, such as `sma(close, 10.5)` | [OS4003](/script/errors/runtime#os4003) |
| A history offset, such as `close[1.5]` | [OS4001](/script/errors/runtime#os4001) |
| An array index, such as `levels[1.5]` | [OS4004](/script/errors/runtime#os4004) |

These are errors in a running script, not in the text, so the compiler accepts `sma(close, 10.5)` and the error appears when the script runs.

**Infinity and not-a-number do not exist.** An operation whose real answer does not exist or is not finite gives `none` instead: `1 / 0`, `0 / 0`, `sqrt(-1)` and `log(0)` are all absent. The line on the chart breaks rather than spiking to a value it cannot scale.

**Time is a number.** [[time]] is the bar's opening instant in milliseconds since 1 January 1970, UTC. There is no separate time type, so an elapsed time is plain subtraction, and fifteen minutes is `15 * 60000`. The `date.*` functions read calendar fields from it; see [Sessions and time](/script/data/sessions-and-time).

```openscript
version 1
study("Minutes between bars", precision = 0)

// time is in milliseconds, so a difference divided by 60000 is minutes.
gap = (time - time[1]) / 60000

plot(gap, "Minutes since the previous bar", aqua, style = "histogram")
```

On a 5-minute NSE chart the bars inside a session read 5, and the first bar of each session stands tall with the overnight gap, taller still after a weekend or a holiday.

## Strings

A string literal uses double quotes or single quotes, and the two mean exactly the same thing. Two delimiters exist so that a string containing one kind of quote needs no escapes.

```openscript
t = table("Strings", 3, 1)

a = "BUY"
b = 'He said "exit"'
c = "Premium in ₹"

if bar.isLast
    cell(t, 0, 0, a)
    cell(t, 1, 0, b)
    cell(t, 2, 0, c)
```

Inside a string, a backslash starts an escape sequence: `\\` (a backslash), `\"`, `\'`, `\n` (new line), `\t` (tab), `\r`, `\0` and `\uXXXX` (a character by its code, with exactly four hexadecimal digits). Any other backslash sequence is [OS1005](/script/errors/syntax#os1005), and a string that runs to the end of the line without its closing quote is [OS1004](/script/errors/syntax#os1004). A string literal cannot span two lines; join two with `+`.

`+` joins two strings and does nothing else. `"count: " + 5` is an error, not `"count: 5"`: convert the number first with [[text()]].

Strings compare with `<`, `<=`, `>` and `>=` by Unicode code point, so every uppercase ASCII letter sorts before every lowercase one. That order is the same on every machine and in every locale. It is not a dictionary order.

The `str.*` functions search, split, pad and format strings; see [Strings](/script/reference/string).

## Booleans

`true` and `false` are of type `bool`, and they are not numbers. `0` is not false, `1` is not true and `""` is not false. A condition in an `if`, a `while` or a ternary must be a `bool` (or `none`), and anything else is error [OS2011](/script/errors/names-and-types#os2011):

```openscript expect=OS2011
hits = count(close > open, 10)
if hits
    signal("SOME UP BARS")
```

Write the test you mean:

```openscript
hits = count(close > open, 10)
if hits > 0
    signal("SOME UP BARS")
```

To turn a condition into a number, say so with a ternary: `cond ? 1 : 0`. To count how many of the last 50 bars a condition held on, the library already has [[count()]].

## Colors

A colour is written as one of the nineteen named colours or as a hex literal, and built or changed by a small set of functions. Alpha is a colour's opacity: fully opaque hides what is behind it, and zero is invisible.

| Form | Example | Means |
|---|---|---|
| A named colour | `aqua` | One of nineteen bare names, fully opaque |
| Hex, 24 bit | `#ff8800` | Red, green and blue |
| Hex with alpha | `#ff880080` | The same, with an alpha byte |
| [[rgb()]] | `rgb(255, 136, 0)` | Channels 0 to 255, opaque |
| [[rgba()]] | `rgba(255, 136, 0, 0.5)` | The same, with alpha 0 to 1 |
| [[fade()]] | `fade(aqua, 88)` | The colour at 88 percent **transparency** |
| [[withAlpha()]] | `withAlpha(aqua, 0.12)` | The colour at an **opacity** of 0.12 |
| [[mix()]] | `mix(red, lime, 0.5)` | A blend: weight 0 gives the first, 1 the second |

The named colours are `aqua`, `black`, `blue`, `brown`, `fuchsia`, `gray`, `green`, `lime`, `maroon`, `navy`, `olive`, `orange`, `pink`, `purple`, `red`, `silver`, `teal`, `white` and `yellow`. They are bare names with no prefix.

:::warn
`fade` and `withAlpha` run in opposite directions. `fade(aqua, 88)` is nearly invisible, and `withAlpha(aqua, 0.88)` is nearly solid.
:::

Two colours are equal when all four channels match, so `#ff8800 == rgb(255, 136, 0)` is `true`. [Colors](/script/visuals/colors) covers gradients and colour per bar.

## Arrays

An `array<T>` is ordered, mutable, resizable and holds elements of one type, which is what lets [[size()]], [[avg()]] and [[sort()]] each mean one thing.

```openscript
version 1
study("Rolling window", precision = 2)

length = input(20, "Window", min = 2, max = 500)

var window: array<number> = []

push(window, close)
if size(window) > length
    shift(window)

// For the first length - 1 bars the window is still filling, so this averages
// fewer closes than length. sma(close, length) would be absent there instead.
plot(avg(window), "Rolling mean", aqua, width = 2)
```

Four rules carry most of the surprises:

| Rule | Detail |
|---|---|
| An empty literal needs its element type | `[]` takes its type from an annotation (`var hits: array<number> = []`) or from the first `push`, `unshift`, `insert` or `set` into it. With neither it is [OS2015](/script/errors/names-and-types#os2015) |
| A literal cannot mix types | `["RSI", 14]` is [OS2013](/script/errors/names-and-types#os2013). Keep two arrays side by side instead |
| An array is a reference | `b = a` gives two names for one array. [[copy()]] makes an independent one. `==` asks whether two names are the same array; [[arrayEqual()]] compares contents |
| An index outside `0` to `size - 1` is an error | [OS4004](/script/errors/runtime#os4004), because the script chose the array's extent |

That last rule is the opposite of history. Reading past the start of the data with `close[500]` gives `none`, because that value never existed. Reading past the end of an array is an error, because the script asked for something it never created. [Collections](/script/language/collections) covers every array operation.

## Series and single values

This is the distinction that matters most.

A **series** is the per-bar history of a value. `series number` is one number per bar and `series bool` one boolean per bar. Reading a series bare gives the value on the bar being run, and the history operator `[n]` gives the value `n` bars back.

```openscript
a = close  // this bar's close
b = close[1]  // the previous bar's close
c = close[0]  // the same as close
plot(a - b + c, "Example")
```

A **single value** is one value for the whole run. `14` is a single value. So are [[chart.tickSize]], [[chart.lotSize]] and the result of `input(14, "Length")`.

| Ask | If yes | Examples |
|---|---|---|
| Does it change from bar to bar? | It is a series | `close`, `ema(close, 9)`, `bar.index`, `session.isFirstBar` |
| Was it fixed before bar 0? | It is a single value | `input(14, "Length")`, `chart.tickSize`, `3.14` |
| Is it a name at the top level of the file? | It accepts `[]` either way | `len = 14` allows `len[1]`: absent on bar 0, which has no previous bar, and 14 after it |

### What an input gives you

An [[input()]] is a single value: the user sets it in the settings dialog before the first bar, and it stays the same on every bar of the run. The one exception is a source input, `input(close, "Source")`, which returns a `series number`, because what the user picks (the close, the high, `hlc3` and so on) is itself a series.

```openscript
version 1
study("Inputs and their types", overlay = true, precision = 2)

len = input(20, "Length", min = 2, max = 500)  // number
src = input(close, "Source")  // series number

plot(sma(src, len), "Average of the chosen source", aqua)
```

{{screen: study-settings}}

### Which values have history

A value accepts `[]` in exactly four cases:

1. It is a built-in series: [[open]], [[high]], [[low]], [[close]], [[volume]], [[time]], [[hl2]], [[hlc3]], [[ohlc4]], [[hlcc4]], and the per-bar facts in the `bar` and `session` namespaces.
2. It is a name assigned at the **top level of the file**.
3. It is a call to a function that returns a series, such as `ema(close, 9)[1]`.
4. It is a parameter of a user function that receives a series. Then `[]` reads the history of whatever the caller passed.

`[]` on anything else is error [OS2004](/script/errors/names-and-types#os2004). The instrument facts in `chart.*` are the clearest case: they cannot differ from bar to bar, so they carry no history, and `chart.tickSize[1]` is OS2004. A name first assigned inside a block has no history either:

```openscript expect=OS2004
if close > open
    body = close - open
    prevBody = body[1]
```

Give the value a name at the top level and read that name's history. Hide the bars you do not want by plotting `none`, rather than by moving the plot into an `if`:

```openscript
version 1
study("Body history", precision = 2)

trending = ema(close, 20) > ema(close, 50)
body = close - open  // top level, so it has history

plot(body, "Body", fade(aqua, 60), style = "histogram")
plot(trending ? body[1] : none, "Previous body while trending", aqua)
```

History is kept only for names the script asked for by name because keeping it costs memory on every bar. A script that kept every temporary inside every loop could not run fifty thousand bars in a browser tab. [Bars and history](/script/language/bars-and-history) covers the history operator in full.

### Broadcast, the one automatic conversion

A single value used where a series is expected is **broadcast**: it is treated as that same value on every bar. The reverse also holds: a series used where a single value is expected means this bar's value.

```openscript
len = input(21, "Length")
plot(ema(close, 9), "EMA 9", aqua)  // 9 is broadcast to every bar
plot(ema(close, len), "EMA len", orange)  // an input works the same way
```

Broadcast is the only automatic conversion in the language, and it changes no value. Everything else is an explicit call.

When you pass an expression to a series parameter of your own function, the engine keeps that expression's per-bar values for that call, so `[]` inside the function reads real history:

```openscript
version 1
study("Change of source", precision = 2)

fn change2(src) => src - src[1]

// src[1] inside the function is the previous bar's hlc3.
plot(change2(hlc3), "Change in typical price", aqua)
```

### Several results in one array

A library function with more than one output returns an `array<number>` holding this bar's outputs in a documented order: [[macd()]] gives `[macd, signal, histogram]` and [[bollinger()]] gives `[basis, upper, lower]`. The array is never absent and never changes length; each element is absent until its own warmup ends.

```openscript
version 1
study("MACD", precision = 4)

m = macd(close, 12, 26, 9)

plot(m[0], "MACD", aqua, width = 2)
plot(m[1], "Signal", orange, width = 2)
plot(m[2], "Histogram", gray, style = "histogram")
```

Here `m[0]` is element access, not history, because `m` is an array. The compiler always knows which from the type. Where a reader could doubt it, write the explicit form: [[element()]] always reads an element of an array, and [[history()]] always reads a series some bars back.

## Conversions

There are four conversions, and each is a call.

| Call | Takes | Gives | Notes |
|---|---|---|---|
| `text(x)` | Any value | `string` | `text(none)` is the string `"none"` |
| `text(x, decimals)` | `number` | `string` | Fixed decimals, halves rounded away from zero: `text(2.5, 0)` is `"3"`. Absent when `x` is absent |
| `toNumber(s)` | `string` | `number` | `none` when the string does not parse |
| `toBool(x)` | `bool` or `none` | `bool` | `none` becomes `false`; a bool stays as it is |

The reference entries are [[text()]], [[toNumber()]] and [[toBool()]].

```openscript
version 1
study("Formatted readings", precision = 2)

r = rsi(close, 14)
a = atr(14)
t = table("Readings", 1, 1)

// text(x, decimals) passes an absent value on, and + then makes the whole
// message absent, so the guard sits in front of the message.
message = isNone(r) ? "warming up" : "RSI " + text(r, 1) + ", ATR " + text(a, 2)

plot(r, "RSI", purple, width = 2)

if bar.isLast
    cell(t, 0, 0, message)
```

`toNumber` is the one conversion that can fail, and it fails the way the rest of the language does, by returning `none`: `toNumber("12.5")` is `12.5` and `toNumber("12.5%")` is absent. Test the result with [[isNone()]] before relying on it.

`toBool` exists to turn a possibly absent condition into a definite one. It is not a way to read a number as true or false: do not pass it a number (`toBool(1)` gives `false`). Write `n != 0` for that.

The two are spelled `toNumber` and `toBool` because `number` and `bool` are reserved words, and a call must start with a name. Writing `number("12.5")` is [OS1019](/script/errors/syntax#os1019).

## Conversions the language refuses

There is no implicit conversion between any two types, in any direction.

| You write | What happens | Write instead |
|---|---|---|
| `1 + true` | [OS2003](/script/errors/names-and-types#os2003): `number` and `bool` | `1 + (flag ? 1 : 0)` |
| `"count: " + 5` | [OS2003](/script/errors/names-and-types#os2003): `string` and `number` | `"count: " + text(5)` |
| `if hits` | [OS2011](/script/errors/names-and-types#os2011): a condition must be a `bool` | `if hits > 0` |
| `up ? 1 : "down"` | [OS2012](/script/errors/names-and-types#os2012): the arms disagree | Make both arms one type, or use `none` |
| `["RSI", 14]` | [OS2013](/script/errors/names-and-types#os2013): a mixed array | Two arrays side by side |
| `flag == 1` | [OS2003](/script/errors/names-and-types#os2003): `bool` and `number` | `flag == true`, or just `flag` |
| `len = 14`, later `len = "fourteen"` | [OS2003](/script/errors/names-and-types#os2003): the type was fixed | A second name |

The last row is a rule of its own: **a name's type is fixed by its first assignment that gives it a definite type.** Assigning a different type later is OS2003, even when the two lines are pages apart. A first assignment of `none` fixes nothing, because `none` belongs to every type, so `var stop = none` followed by `stop = low` makes `stop` a number.

```openscript expect=OS2003
len = 14
len = "fourteen"
```

## Type annotations

A type annotation is a type written after a name, with a colon: `var hits: array<number> = []`. You rarely need one. The places you do are an empty array, where there is nothing to infer from, and the parameters of a function other people will call, where the annotation documents what it takes.

```openscript
version 1
study("Annotations", overlay = true, precision = 2)

// An empty array: the annotation is the only place its type can come from.
var upLows: array<number> = []

// Parameters other people will call: the header says what each one takes.
fn band(src: series number, len: number = 20, mult: number = 2) =>
    sma(src, len) + mult * stdev(src, len)

if close > open
    push(upLows, low)
    if size(upLows) > 5
        shift(upLows)

plot(band(close), "Upper band", aqua)
plot(size(upLows) > 0 ? min(upLows) : none, "Lowest of the last five up-bar lows", orange)
```

The type names are `number`, `string`, `bool`, `color` and `array<T>`, with `series` in front where a per-bar value is meant, plus the runtime object types `line`, `label`, `box`, `polyline` and `table`. There is no `int`: any other name is [OS2016](/script/errors/names-and-types#os2016).

## Handles and runtime objects

Some calls return something that is neither a number, a string, a bool, a colour nor an array. There are two kinds, and their rules are opposites.

| Kind | Returned by | What it is |
|---|---|---|
| Declaration handle | [[plot()]], [[plotCandles()]], [[fill()]], [[level()]] | A name for part of the study's fixed shape, known before bar 0 |
| Runtime object | [[draw.line()]], [[draw.label()]], [[draw.box()]], [[draw.polyline()]], [[table()]] | An ordinary value the script creates, keeps and changes as bars arrive |

A declaration handle has one use: naming the two plots a [[fill()]] shades between. It cannot be held in a `var`, put in an array, passed to a function or compared, and trying is an error.

```openscript
version 1
study("Channel", overlay = true)

upper = plot(highest(high, 20), "Upper", aqua)
lower = plot(lowest(low, 20), "Lower", aqua)
fill(upper, lower, fade(aqua, 88))
```

A runtime object is a reference, like an array: it can live in a `var`, sit in an array, and be passed to and returned from a function. A drawing stays on the chart until the script deletes it. [Lines and boxes](/script/visuals/lines-and-boxes) and [Tables](/script/visuals/tables) cover them.

## Errors you may meet

| Code | Means | Usual fix |
|---|---|---|
| [OS2003](/script/errors/names-and-types#os2003) | Two types do not mix, or a name changed type | Convert with `text`, `toNumber` or `toBool`, or use a second name |
| [OS2004](/script/errors/names-and-types#os2004) | The value has no history | Name the value at the top level of the file and read that name |
| [OS2011](/script/errors/names-and-types#os2011) | A condition is not a `bool` | Write the test out: `x > 0`, `isNone(x)`, `s != ""` |
| [OS2012](/script/errors/names-and-types#os2012) | The ternary arms have different types | Make them agree, or use `none` for one arm |
| [OS2013](/script/errors/names-and-types#os2013) | An array literal mixes types | Split it into two arrays |
| [OS2015](/script/errors/names-and-types#os2015) | An empty array literal has no element type | Annotate it: `var hits: array<number> = []` |
| [OS2016](/script/errors/names-and-types#os2016) | An annotation names a type that does not exist | Use `number`, `string`, `bool`, `color` or `array<T>` |
| [OS4001](/script/errors/runtime#os4001) | A history offset is negative or fractional | Round it with `floor()` or `round()`, and keep it at zero or above |
| [OS4003](/script/errors/runtime#os4003) | A length that must be whole is not | Round it where it is computed |
| [OS4004](/script/errors/runtime#os4004) | An array index is outside the array | Guard the read with `size(arr)` |

**Related.** [Absent values](/script/language/absent-values), [Operators](/script/language/operators), [Variables and scope](/script/language/variables-and-scope), [Bars and history](/script/language/bars-and-history), [Collections](/script/language/collections), [Types reference](/script/reference/types)
