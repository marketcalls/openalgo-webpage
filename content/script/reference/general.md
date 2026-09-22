---
title: General
description: The general purpose functions, isNone and orElse for absent values, and text, toNumber and toBool, the only conversions between types.
---

Two small groups of functions that every kind of script uses. [[isNone()]] and [[orElse()]] deal with `none`, the absent value that a moving average holds during its warmup (the first bars, before it has enough data) and that `close[1]` holds on the first bar. [[text()]], [[toNumber()]] and [[toBool()]] are the only ways to turn a value of one type into another, because OpenScript never converts types on its own.

Reach for this page when a plot starts later than you expected, when a running total goes blank, or when the compiler reports `OS2003` because a number met a string.

```openscript title="Absent values and conversions"
version 1
study("RSI with a readable label", precision = 2)

r = rsi(close, 14)

// Warmup is visible: shade the bars where RSI has no value yet.
background(isNone(r) ? fade(gray, 90) : none)

plot(r, "RSI", purple)
plot(orElse(r, 50), "RSI, held at 50 during warmup", fade(silver, 50))

panel = table("RSI", 1, 1, position = "topRight")
if bar.isLast
    cell(panel, 0, 0, isNone(r) ? "RSI warming up" : "RSI " + text(r, 1))
```

## Absent values

A value is absent, `none`, when there is nothing to report: the first bars of an indicator, a read before the first bar, a division by zero, a volume the host (the application running the script) does not supply. Absence passes through arithmetic, so one absent input makes the result absent, and a plot of an absent value draws a gap. The two functions below let you test for it and replace it. See [Absent values](/script/language/absent-values) for the full rules.

{{entry: isNone()}}

True when the value is absent, and false for any present value of any type. It is the same test as `x == none`; use whichever reads better.

```openscript
version 1
study("Warmup shading", overlay = true)

slow = sma(close, 200)
background(isNone(slow) ? fade(gray, 90) : none)
plot(slow, "SMA 200", orange)
```

**Remarks.** `isNone` always answers `true` or `false`, from bar 0, whatever its argument. That is why it is safe as a guard on the left of `and`: in `not isNone(x) and x > 5`, the comparison runs only when `x` is present.

Order matters for which side runs, not for the answer. `not isNone(x) and x > 5` and `x > 5 and not isNone(x)` give the same result; `isNone(x) and x > 5` is never true however you write it.

**See also.** [[orElse()]], [[bar.isFirst]]

{{entry: orElse()}}

Returns `x` when it is present and `fallback` when it is absent. Both must be the same type: `orElse(close, "none")` is `OS3011`. Use it where a missing value should count as something definite, such as a zero in a running total, or a label to show when the host did not state a fact.

```openscript
version 1
study("Cumulative volume", format = "volume")

var total = 0.0
// Without orElse, one bar with no volume would make the total absent for good.
total += orElse(volume, 0)
plot(total, "Volume since the first bar", silver, style = "area")
```

**Remarks.** The result is present as soon as either argument is. A fallback hides warmup, which is the point in a running total and a trap in a signal: `orElse(rsi(close, 14), 50)` plots a flat 50 for the first bars, and a rule that trades on it treats those bars as real readings. Keep the absent value where a decision depends on it.

**See also.** [[isNone()]], [[sumSkip()]], [[avgSkip()]]

## Conversions

OpenScript has no implicit conversion between types. `"RSI " + 55` is `OS2003`, `1 + true` is `OS2003`, and a number is never a condition. These three functions are the conversions there are.

| Call | From | To | When the input cannot be converted |
|---|---|---|---|
| `text(x)` | Any value | `string` | Never fails. `text(none)` is the string `"none"` |
| `text(x, decimals)` | `number` | `string` | `none` when `x` is absent |
| `toNumber(s)` | `string` | `number` | `none` when the text is not a number |
| `toBool(x)` | `bool` or `none` | `bool` | Never fails. `none` becomes `false` |

{{entry: text()}}

Turns a value into text, for a label, a table cell or an alert message. With one argument it takes any value; with a second, `decimals`, it writes a number with exactly that many digits after the point.

```openscript
version 1
study("Close and ATR", overlay = true)

a = atr(14)
if bar.isLast
    msg = chart.symbol + " closed at " + text(close, 2) + ", ATR " + text(a, 2)
    draw.label(time, high, msg, textColor = white)
```

| Value | `text(x)` writes |
|---|---|
| A number | The shortest digits that read back as the same number: `100`, `1234.5678`, `0.05`, `0.3333333333333333`. Exponent form only below 0.000001 or from 10 to the 21st up, such as `1e-7` or `1e21` |
| A `bool` | `"true"` or `"false"` |
| A string | The string itself |
| A colour | Hex with alpha, such as `"#ff0000ff"` for `red` |
| `none` | `"none"` |

`text(x, decimals)` rounds halves away from zero and always writes plain digits, never an exponent: `text(1234.5, 0)` is `"1235"`, `text(-2.5, 0)` is `"-3"` and `text(2.5, 2)` is `"2.50"`. `decimals` must be a whole number.

**Remarks.** The two forms treat `none` differently. `text(none)` is the four letters `"none"`, which is useful while debugging. `text(x, 2)` with an absent `x` is `none`, and so is any string it is joined to with `+`, so guard a message during warmup, as the page's first example does with [[isNone()]].

A decimal that looks like a half is not always stored as one. `1.005` is held as a number a hair below it, so `text(1.005, 2)` is `"1.00"`, not `"1.01"`.

**See also.** [[str.padLeft()]], [[date.format()]], [[cell()]]

{{entry: toNumber()}}

Reads a number out of a string, and gives `none` when the string is not a number. Its most common use is a setting typed as text, such as a list of price levels in one input.

```openscript
version 1
study("Distance to the nearest level", precision = 2)

raw = input("22000, 22500, 23000", "Levels, separated by commas")

var levels: array<number> = []
if bar.isFirst
    for part in str.split(raw, ",")
        value = toNumber(part)
        if not isNone(value)
            push(levels, value)

nearest = none
for lvl in levels
    if isNone(nearest) or abs(close - lvl) < abs(close - nearest)
        nearest = lvl

plot(close - nearest, "Distance to the nearest level")
```

| Text | `toNumber` gives |
|---|---|
| `"12.5"`, `" 12.5 "` | `12.5`. Spaces at either end are ignored |
| `"-3"`, `"+3"`, `".5"`, `"12."` | `-3`, `3`, `0.5`, `12` |
| `"2.5e3"` | `2500` |
| `"12.5%"`, `"1,234"`, `"0x10"`, `"1_000"` | `none` |
| `""`, `"NaN"`, `"Infinity"` | `none` |

**Remarks.** It takes a `string`: `toNumber(close)` is `OS3011`. Always test the result with [[isNone()]] before you rely on it, as the example does, because a typing slip in a setting gives `none` rather than an error.

**See also.** [[text()]], [[str.split()]], [[str.trim()]]

{{entry: toBool()}}

Turns a `bool` that may be absent into a definite one: `none` becomes `false`, and `true` and `false` stay as they are. Use it where a condition computed during warmup must read as a plain `false` rather than unknown.

```openscript
version 1
study("Trend flag", overlay = true)

ema50 = ema(close, 50)
above = toBool(close > ema50)    // false, not none, while the EMA warms up

panel = table("Trend", 1, 2, position = "topRight")
if bar.isLast
    cell(panel, 0, 0, "Above the 50 EMA")
    cell(panel, 0, 1, text(above))
```

**Remarks.** The difference shows wherever `none` would otherwise travel: `not (close > ema50)` is `none` during warmup, while `not toBool(close > ema50)` is `true`. Choose deliberately, because a warmup bar that reads as `false` is a claim about the market that nobody measured.

It is not a way to read a number as a condition; there is no truthiness (no rule that treats `0` as false) in the language. In release 0.5.0 the compiler accepts a number or a string here, and the result is `false` whatever the value, so `toBool(1)` is `false`. Write the comparison you mean, such as `n != 0`. The call is spelled `toBool` because `bool` is a type name and cannot be called: `bool(x)` is `OS1019`.

**See also.** [[isNone()]], [[text()]]

## Related

[Absent values](/script/language/absent-values), [Types and values](/script/language/types-and-values), [Types](/script/reference/types), [Operators](/script/reference/operators), [Strings](/script/reference/string).
