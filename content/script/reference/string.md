---
title: Strings
description: The str.* functions that measure, search, cut, split, pad and change text, and the rules they share, for the table cells, labels and alert messages a script writes.
---

Text is how a script talks to a person: the words in a table cell, the message an alert sends, the note on a label. In OpenScript a piece of text is a **string**, written between double quotes: `"NIFTY"`. This page documents the eighteen `str.*` functions that measure, search, cut, split, pad and change strings (sixteen available now and two planned), and the few rules every one of them follows.

Two conversions you will use beside them on almost every line live on the [General](/script/reference/general) page: [[text()]] turns any value into a string, and [[toNumber()]] reads a number back out of one.

```openscript title="Readings panel"
version 1
study("Readings panel", overlay = true)

panel = table("Readings", 4, 2, position = "topRight")

r = rsi(close, 14)
a = atr(14)

// One helper decides what a missing reading looks like, in one place.
fn show(value, decimals) => isNone(value) ? "warming up" : text(value, decimals)

// A long option symbol is cut to 14 characters so the panel stays narrow.
name = str.length(chart.symbol) > 14 ? str.substring(chart.symbol, 0, 14) + ".." : chart.symbol

// A ten character meter: one # for every 10 points of RSI.
filled = isNone(r) ? 0 : round(r / 10)
meter  = str.repeat("#", filled) + str.repeat(".", 10 - filled)

if bar.isLast
    cell(panel, 0, 0, name)
    cell(panel, 0, 1, chart.interval, align = "right")
    cell(panel, 1, 0, "RSI 14")
    cell(panel, 1, 1, show(r, 1), align = "right")
    cell(panel, 2, 0, "ATR 14")
    cell(panel, 2, 1, show(a, 2), align = "right")
    cell(panel, 3, 0, "Strength")
    cell(panel, 3, 1, meter)
```

The panel is written only on the newest bar because it shows one state, the current one. [Tables](/script/visuals/tables) explains that pattern in full. The examples on this page show their results in a table cell like this one, because a cell is something you can see on the chart.

## Rules every string function follows

**Text and numbers do not mix by themselves.** `"RSI " + 55` is error [OS2003](/script/errors/names-and-types#os2003), not the string `"RSI 55"`. Convert the number first: `"RSI " + text(55)`. Use `text(x, decimals)` when the number is for display, because it fixes the number of decimals without changing the value your calculation keeps.

```openscript expect=OS2003
line = "RSI " + rsi(close, 14)
```

**Absent in, absent out.** A value is **absent** (the value `none`) when it does not exist yet, such as an RSI in its first bars. Every function on this page returns `none` when a string it was given is `none`, and `+` does the same. `text(x, 2)` of an absent `x` is absent too, so `"RSI " + text(r, 1)` is absent during warmup and a cell written with it stays blank. The one-argument form differs: `text(none)` is the string `"none"`. Decide what a missing value should read as, as the `show` helper above does. [Absent values](/script/language/absent-values) covers the idea in full.

**Positions count characters from 0.** The first character is at position 0. A character here is a Unicode code point, so the rupee sign counts as one: `"₹100"` has a length of 4 and the `1` is at position 1. Wherever a function takes a range, the start is included and the end is not.

**Counts and positions are whole numbers.** A position, width or count that is negative or has a fractional part stops the study at that bar with [OS4003](/script/errors/runtime#os4003). Wrap a computed count in [[round()]] or [[floor()]] before you pass it.

**Case is converted the same way everywhere.** [[str.upper()]] and [[str.lower()]] do not depend on the language settings of the machine, so a script produces the same text on every computer.

**Strings compare by code point.** `<` and `>` order two strings character by character by their Unicode number, so every capital letter sorts before every small letter: `"Z" < "a"` is true. [[sort()]] uses the same order for an array of strings.

**No warmup, and a ceiling.** None of these functions has a warmup: given present strings, each gives a value on bar 0. A string holds at most 100,000 characters; building a longer one stops the study at that bar with [OS5008](/script/errors/limits#os5008). The usual cause is a `var` string that grows by one line every bar. Keep the lines in an array and trim it instead, as [[str.join()]] shows.

## At a glance

| Function | Returns | Does |
|---|---|---|
| [[str.length()]] | `number` | Counts the characters |
| [[str.contains()]] | `bool` | Tests whether one string appears in another |
| [[str.startsWith()]] | `bool` | Tests the start of a string |
| [[str.endsWith()]] | `bool` | Tests the end of a string |
| [[str.indexOf()]] | `number` | Finds the first position of a part, or `-1` |
| [[str.upper()]] | `string` | Capital letters |
| [[str.lower()]] | `string` | Small letters |
| [[str.trim()]] | `string` | Removes whitespace from both ends |
| [[str.substring()]] | `string` | Cuts out a range of characters |
| [[str.replace()]] | `string` | Replaces the first occurrence |
| [[str.replaceAll()]] | `string` | Replaces every occurrence |
| [[str.split()]] | `array<string>` | Splits at a separator |
| [[str.join()]] | `string` | Joins an array with a separator |
| [[str.padLeft()]] | `string` | Pads on the left to a width |
| [[str.padRight()]] | `string` | Pads on the right to a width |
| [[str.repeat()]] | `string` | Repeats a string |
| [[str.format()]] | `string` | Planned: fills a template |
| [[str.match()]] | `bool` | Planned: tests a pattern |

## Inspecting a string

{{entry: str.length()}}

The number of characters in `s`. Use it to check that a text input is not empty, or to keep a label short enough for the space it has, as the Readings panel above does with a long option symbol.

```openscript
note  = str.trim(input("", "Note to show"))
panel = table("Note", 1, 1, position = "bottomLeft")

// Write the cell only when the reader typed something.
if bar.isLast and str.length(note) > 0
    cell(panel, 0, 0, note)
```

**Remarks.** The rupee sign `₹` counts as one character, like any letter. The empty string `""` has a length of 0.

**See also.** [[str.substring()]], [[str.trim()]], [[str.padLeft()]]

{{entry: str.contains()}}

True when `part` appears anywhere inside `s`, and false when it does not. The test is exact and case sensitive: `"NIFTY"` does not contain `"nifty"`.

```openscript
// A symbol with BANK in its name, such as BANKNIFTY or HDFCBANK, gets a wider stop.
isBank   = str.contains(chart.symbol, "BANK")
atrValue = atr(14)
plot(isBank ? atrValue * 1.5 : atrValue, "Stop distance")
```

**Remarks.** Containment can match more than you meant: `"BANKNIFTY"` contains `"NIFTY"`. When the part must be at a known end, use [[str.startsWith()]] or [[str.endsWith()]]. An empty `part` is contained in every string. To ignore case, convert both sides with [[str.upper()]] first.

**See also.** [[str.startsWith()]], [[str.endsWith()]], [[str.indexOf()]]

{{entry: str.startsWith()}}

True when `s` begins with `part`. It tells `"NIFTY"` apart from `"BANKNIFTY"`, which [[str.contains()]] cannot.

```openscript
isNiftyContract = str.startsWith(chart.symbol, "NIFTY")
background(isNiftyContract ? fade(aqua, 94) : none)
```

**Remarks.** Case sensitive. An empty `part` is a prefix of every string.

**See also.** [[str.endsWith()]], [[str.contains()]], [[chart.symbol]]

{{entry: str.endsWith()}}

True when `s` ends with `part`. OpenAlgo writes a futures contract as the underlying, the expiry and `FUT` (`BANKNIFTY24APR24FUT`), and an option as the underlying, the expiry, the strike and `CE` or `PE` (`NIFTY28MAR2420800CE`), so a suffix test is a quick way to tell what is on the chart.

```openscript
sym = chart.symbol
n   = str.length(sym)

// An option symbol ends in its strike and then CE or PE, as in NIFTY28MAR2420800CE.
// Asking for a digit before those two letters keeps out a stock such as RELIANCE.
strikeBefore = n >= 3 ? not isNone(toNumber(str.substring(sym, n - 3, n - 2))) : false

kind = strikeBefore and str.endsWith(sym, "CE") ? "Call option" :
       strikeBefore and str.endsWith(sym, "PE") ? "Put option" :
       str.endsWith(sym, "FUT") ? "Future" : "Stock or index"

panel = table("Contract", 1, 1)
if bar.isLast
    cell(panel, 0, 0, kind)
```

**Remarks.** A suffix alone can mislead: `RELIANCE` and `BAJFINANCE` end in `CE` as well. That is why the example checks for a digit before the suffix. Case sensitive. An empty `part` is a suffix of every string. [[chart.instrumentType]] reports the kind of instrument directly on a host that supplies it.

**See also.** [[str.startsWith()]], [[str.substring()]], [[chart.instrumentType]]

{{entry: str.indexOf()}}

The position of the first occurrence of `part` in `s`, counting from 0, or `-1` when it does not occur. Pair it with [[str.substring()]] to cut a string at a separator.

```openscript
spec  = input("NSE:SBIN", "Instrument, as EXCHANGE:SYMBOL")
colon = str.indexOf(spec, ":")

// Everything after the colon, or the whole text when there is no colon.
symbolPart = colon >= 0 ? str.substring(spec, colon + 1) : spec

panel = table("Instrument", 1, 1)
if bar.isLast
    cell(panel, 0, 0, symbolPart)
```

**Remarks.** Not found is `-1`, a definite answer rather than `none`, so compare the result with `-1` or `>= 0`. The position counts code points. An empty `part` is found at 0. To split at every separator in one call, use [[str.split()]].

**See also.** [[str.contains()]], [[str.substring()]], [[str.split()]], [[indexOf()]]

## Changing case and whitespace

{{entry: str.upper()}}

`s` with every letter in capitals. Use it to show a name in one consistent style, or to compare two strings without caring about case.

```openscript
watch = input("sbin", "Symbol to highlight")

// Symbols are written in capitals, so a name typed in small letters still matches.
background(str.upper(str.trim(watch)) == chart.symbol ? fade(yellow, 90) : none)
```

**Remarks.** The conversion is fixed by the language rather than by the language settings of the machine, so it gives the same result everywhere. Letters outside the English alphabet convert too: `str.upper("école")` is `"ÉCOLE"`.

**See also.** [[str.lower()]], [[str.trim()]]

{{entry: str.lower()}}

`s` with every letter in small letters, on the same fixed terms as [[str.upper()]]. Lower-case the text a reader typed before you compare it, so `Buy`, `BUY` and `buy` all match.

```openscript
side  = input("Buy", "Side")
isBuy = str.lower(str.trim(side)) == "buy"
plot(isBuy ? low : high, "Reference price")
```

**Remarks.** For a choice from a fixed list, a menu input with `options` is better than free text, because the reader cannot mistype it. See [[input()]].

**See also.** [[str.upper()]], [[str.trim()]], [[input()]]

{{entry: str.trim()}}

`s` with the whitespace at both ends removed: spaces, tabs, line breaks and the other Unicode whitespace characters, such as the no-break space. Whitespace inside the string stays. Trim anything a person typed before you compare it or show it.

```openscript
note  = str.trim(input("  watch 22,500  ", "Note"))
panel = table("Note", 1, 1, position = "bottomLeft")

// The brackets sit right against the text: the outer spaces are gone, the inner one stays.
if bar.isLast
    cell(panel, 0, 0, "[" + note + "]")
```

**Remarks.** The set removed is the Unicode whitespace set and nothing else, and it is the same on every machine. A zero-width space and a byte order mark are not whitespace and stay. [[toNumber()]] ignores the same whitespace at either end of a number.

**See also.** [[str.lower()]], [[toNumber()]], [[str.replaceAll()]]

## Cutting and replacing

{{entry: str.substring()}}

The part of `s` from position `from` up to, but not including, position `to`. Leave out `to` to take everything from `from` to the end. Use it to read fixed fields out of a string, such as the hours and minutes of a session window.

```openscript
window     = input("0915-1530", "Trading window")
openHour   = toNumber(str.substring(window, 0, 2))
openMinute = toNumber(str.substring(window, 2, 4))

minutesIn = (date.hour(time) - openHour) * 60 + date.minute(time) - openMinute
plot(minutesIn, "Minutes since the window opened")
```

**Remarks.** A `to` past the end is cut back to the end, so `str.substring("SBIN", 0, 20)` is `"SBIN"`. A `from` at or after `to` gives the empty string. A negative or fractional position stops the study at that bar with [OS4003](/script/errors/runtime#os4003). To test whether a bar is inside a window, [[session.isIn()]] reads the `"0915-1530"` text for you; cut the string yourself only when you need the numbers.

**See also.** [[str.indexOf()]], [[str.split()]], [[str.length()]]

{{entry: str.replace()}}

`s` with the first occurrence of `find` replaced by `with`. Later occurrences are left alone. It is handy for filling one placeholder in a message template.

```openscript
template = "{symbol}: fast average crossed above slow"
if crossUp(ema(close, 9), ema(close, 21))
    alert(str.replace(template, "{symbol}", chart.symbol), id = "cross-up")
```

**Remarks.** When `find` does not occur, `s` comes back unchanged. An empty `find` matches at position 0, so `with` is added to the front. To replace every occurrence, use [[str.replaceAll()]].

**See also.** [[str.replaceAll()]], [[str.format()]], [[alert()]]

{{entry: str.replaceAll()}}

`s` with every occurrence of `find` replaced by `with`, working from left to right. Use it to clean text before you read it, such as removing the commas from a number written the Indian way.

```openscript
typed = input("1,00,000", "Capital, in rupees")

// toNumber cannot read the commas, so remove every one of them first.
capital = toNumber(str.replaceAll(typed, ",", ""))

panel = table("Capital", 1, 1)
if bar.isLast
    cell(panel, 0, 0, isNone(capital) ? "Not a number" : text(capital, 0))
```

**Remarks.** The text you insert is not searched again, so `str.replaceAll("aaa", "a", "aa")` is `"aaaaaa"` and cannot run for ever. When `find` does not occur, `s` comes back unchanged.

**See also.** [[str.replace()]], [[toNumber()]], [[str.trim()]]

## Splitting and joining

{{entry: str.split()}}

Splits `s` at every occurrence of `separator` and returns the pieces as an array of strings. It is the way to accept a list in a single text input, such as a set of price levels.

```openscript title="Nearest level"
version 1
study("Nearest level", overlay = true)

levelText = input("22000,22250,22500,22750", "Levels, comma separated")

parts = str.split(levelText, ",")
nearest = none
for part in parts
    value = toNumber(part)
    if not isNone(value) and (isNone(nearest) or abs(close - value) < abs(close - nearest))
        nearest = value

plot(nearest, "Nearest level", orange, style = "step")
```

**Remarks.** The separator itself is not kept. When it does not occur, the result is one element holding the whole string. Two separators side by side give an empty piece between them, so `"a,,b"` splits into three parts. An empty separator splits the string into single characters. [[toNumber()]] ignores spaces around each number, so `"22000, 22250"` reads as well as `"22000,22250"`, and an empty or unreadable piece becomes `none`, which the loop above skips.

**See also.** [[str.join()]], [[toNumber()]], [[size()]], [[element()]]

{{entry: str.join()}}

Joins the strings in `parts` into one string, with `separator` between each pair. It is the reverse of [[str.split()]], and the tidy way to build a line from several fields.

```openscript
fields = [chart.symbol, text(open, 2), text(high, 2), text(low, 2), text(close, 2)]

panel = table("Last bar", 1, 1)
if bar.isLast
    cell(panel, 0, 0, str.join(fields, " | "))
```

**Remarks.** An empty array joins to the empty string. An absent element is written as the word `none`, so a field that is still warming up shows as that word rather than making the whole line disappear. To show a running list without growing one huge string, keep the pieces in a `var` array, trim it, and join only what you show:

```openscript
// The last five closes, oldest first.
var lines: array<string> = []
push(lines, text(close, 2))
if size(lines) > 5
    shift(lines)

panel = table("Recent closes", 1, 1)
if bar.isLast
    cell(panel, 0, 0, str.join(lines, ", "))
```

**See also.** [[str.split()]], [[push()]], [[shift()]]

## Padding and repeating

Padding makes a string a fixed number of characters long. Its most dependable use is a zero in front of a number, as in a clock time written `2:05`. Spaces only line text up in a font where every character has the same width, and table cells on the chart are drawn in a font where they do not. To line up a column of numbers in a table, give its cells `align = "right"` with [[cell()]] instead.

{{entry: str.padLeft()}}

`s` with `fill` added on the left until it is `width` characters long. Use it to give a number a fixed count of digits, such as the minutes of a clock time.

```openscript
// Time left in the 09:15 to 15:30 session, written as h:mm.
minutesIn = (date.hour(time) - 9) * 60 + date.minute(time) - 15
left      = max(375 - minutesIn, 0)
clock     = text(floor(left / 60)) + ":" + str.padLeft(text(left % 60), 2, "0")

panel = table("Session clock", 1, 1)
if bar.isLast
    cell(panel, 0, 0, "Left in the session " + clock)
```

**Remarks.** A string already `width` characters or longer comes back unchanged; nothing is cut off. `fill` defaults to a space and may be longer than one character, in which case it repeats and is cut to fit: `str.padLeft("7", 5, "ab")` is `"abab7"`. An empty `fill` adds nothing. A negative or fractional `width` stops the study at that bar with [OS4003](/script/errors/runtime#os4003).

**See also.** [[str.padRight()]], [[text()]], [[cell()]]

{{entry: str.padRight()}}

`s` with `fill` added on the right until it is `width` characters long. Use it to give a text meter a fixed length, however much of it is filled.

```openscript
r = rsi(close, 14)
filled = isNone(r) ? 0 : round(r / 10)

// Ten characters every time: one # per 10 points of RSI, then dots to fill the rest.
meter = str.padRight(str.repeat("#", filled), 10, ".")

panel = table("RSI meter", 1, 1)
if bar.isLast
    cell(panel, 0, 0, meter)
```

**Remarks.** Follows the same rules as [[str.padLeft()]]: a longer string is not cut, and `fill` repeats to fit, so `str.padRight("ab", 5, "xy")` is `"abxyx"`.

**See also.** [[str.padLeft()]], [[str.repeat()]]

{{entry: str.repeat()}}

`n` copies of `s` joined together. Its main use is a bar drawn out of characters inside a table cell, which shows a size at a glance without a pane of its own.

```openscript
r = rsi(close, 14)
filled = isNone(r) ? 0 : round(r / 5)

panel = table("RSI bar", 1, 1)
if bar.isLast
    cell(panel, 0, 0, "RSI " + str.repeat("|", filled) + str.repeat(".", 20 - filled))
```

**Remarks.** `n` must be a whole number of 0 or more; `str.repeat("ab", 0)` is `""`. A negative or fractional `n` stops the study at that bar with [OS4003](/script/errors/runtime#os4003), so round a computed count first, as above. A very large `n` can pass the 100,000 character ceiling ([OS5008](/script/errors/limits#os5008)).

**See also.** [[str.padRight()]], [[round()]], [[cell()]]

## Planned

{{entry: str.format()}}

Will substitute values into a template, so `"{0} at {1}"` with two values becomes one string. Until it ships, join the pieces with `+` and [[text()]], or fill named placeholders with [[str.replace()]] and [[str.replaceAll()]].

{{entry: str.match()}}

Will test a string against a pattern, once the language defines a pattern syntax that every engine reads the same way. Until then, [[str.contains()]], [[str.startsWith()]] and [[str.endsWith()]] cover the common tests.

## Putting it together

An alert message is text a person reads on a phone, away from the chart, so it should carry the numbers that caused it. Build it from [[text()]] with fixed decimals, and make sure every part has a value, so a message is never lost to an absent field:

```openscript title="Cross alert with its numbers"
version 1
study("Cross alert", overlay = true)

fast = ema(close, 9)
slow = ema(close, 21)

plot(fast, "Fast", aqua)
plot(slow, "Slow", orange)

if crossUp(fast, slow)
    alert(chart.symbol + " " + chart.interval
          + ": fast crossed above slow at " + text(close, 2)
          + ", gap " + text(fast - slow, 2),
          id = "cross-up", title = "EMA cross")
```

On the bar of a cross both averages have values, so every `text(x, 2)` in the message is present.

## Related

[Types and values](/script/language/types-and-values), [Absent values](/script/language/absent-values), [General](/script/reference/general), [Tables](/script/visuals/tables), [Alerts from scripts](/script/alerts/overview), [Collections](/script/reference/collections), [Inputs](/script/reference/input).
