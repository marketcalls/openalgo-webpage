---
title: Collections
description: Every function that reads, changes, copies, orders or averages an array, and the rules all arrays share, from element types and indexes to references and arrays that last the whole run.
---

An **array** is an ordered list of values held under one name, such as `[22000, 22250, 22500]`. A series already remembers the past (`close[20]` is the close twenty bars ago, with no container at all), so an array is for the jobs a series cannot do: a list you sort or trim, a set of levels that grows and shrinks as price creates and breaks them, the drawings a study will come back to, or one number per session rather than one per bar. This page documents every function that reads, changes, copies, orders and summarises an array, and the rules they all share.

```openscript title="Opening bar range"
version 1
study("Opening bar range", precision = 2)

sessions = input(10, "Sessions to average", min = 2, max = 60)

// The session's first bar, or the first bar of each IST day where the host
// states no session hours.
newSession = orElse(session.isFirstBar, isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata"))

// One number per session, the range of its first bar (09:15 on NSE),
// kept for the whole run and trimmed to the last few sessions.
var ranges: array<number> = []

if newSession
    push(ranges, high - low)
    if size(ranges) > sessions
        shift(ranges)

plot(avg(ranges), "Average opening bar range", aqua)
plot(newSession ? high - low : none, "This session's opening bar", orange, style = "column")
```

`newSession` is [[session.isFirstBar]] where the host states the instrument's session hours, as the /trading chart does. Where a host states none, a new IST date marks the first bar instead, which for an NSE session is the same bar. The `var` keeps the array from bar to bar, [[push()]] adds this session's number, [[shift()]] drops the oldest, and [[avg()]] summarises what is left. Until the first session's opening bar, the array is empty and its average is absent, so nothing is drawn.

## Rules every array follows

**One element type.** An array can grow and shrink, and every element has the same type, written in its type as `array<number>`, `array<string>` and so on. The element may be a `number`, `string`, `bool` or `color`, a drawing (`line`, `label`, `box`, `polyline`) or a `table`. A series, the handle that [[plot()]] or [[fill()]] returns, and another array cannot be elements, so `array<array<number>>` is [OS2019](/script/errors/names-and-types#os2019). Keep a grid in one flat array instead, and find a cell at `row * columns + column`. A literal that mixes types, such as `["RSI", 14]`, is [OS2013](/script/errors/names-and-types#os2013).

**An empty literal needs its type.** `[]` takes its element type from an annotation, `var hits: array<number> = []`, or from the first [[push()]], [[unshift()]], [[insert()]] or [[set()]] into it. With neither it is [OS2015](/script/errors/names-and-types#os2015). Write the annotation; it is the clearest documentation the next reader gets.

```openscript expect=OS2015
var hits = []
```

**An array is a reference.** `b = a` gives two names for one array, so a change through `b` shows through `a`. [[copy()]] makes an independent array. For the same reason `a == b` asks whether two names hold the same array; [[arrayEqual()]] compares what they hold.

**Indexes run from 0 to `size - 1`.** `arr[i]` and `element(arr, i)` read element `i`. An index outside that range, or with a fractional part, stops the study at that bar with [OS4004](/script/errors/runtime#os4004), naming the index and the size. That is the opposite of `close[500]` on bar 7, which is simply absent: a past bar that never existed is a missing value, while an index outside an array the script built is a mistake in the script. On an array, `[]` always means element access, never history.

**Two lifetimes.** An array made by a plain assignment is built again on every bar, which suits scratch work such as a sorted copy. An array declared with `var` (a variable that keeps its value from one bar to the next) is made once and lasts the whole run. On the newest, still-forming bar, a `var` array's contents are restored before each update is executed, so pushing once per bar pushes once per bar, not once per tick. [Persistence](/script/language/persistence) explains the rollback.

**Limits.** An array holds at most 1,000,000 elements; one more stops the study at that bar with [OS5002](/script/errors/limits#os5002). The usual cause is a `var` array that is pushed to on every bar and never trimmed. None of the functions on this page has a warmup: each works on the array as it stands on the bar being executed.

## At a glance

| Function | Returns | Does |
|---|---|---|
| [[size()]] | `number` | Counts the elements |
| [[element()]] | the element | Reads element `i`, the same as `arr[i]` |
| [[indexOf()]] | `number` | Finds the first index of a value, or `-1` |
| [[arrayEqual()]] | `bool` | Compares two arrays element by element |
| [[set()]] | nothing | Writes element `i` |
| [[push()]] | nothing | Adds to the end |
| [[pop()]] | the element | Removes and returns the last element |
| [[unshift()]] | nothing | Adds to the front |
| [[shift()]] | the element | Removes and returns the first element |
| [[insert()]] | nothing | Adds before index `i` |
| [[remove()]] | the element | Removes and returns element `i` |
| [[clear()]] | nothing | Empties an array, or every cell of a table |
| [[copy()]] | `array` | An independent copy |
| [[slice()]] | `array` | A new array holding part of this one |
| [[sort()]] | nothing | Sorts in place |
| [[reverse()]] | nothing | Reverses in place |
| [[avg()]] | `number` | The mean of every element |

The functions that change an array (set, push, pop, shift, unshift, insert, remove, clear, sort, reverse) change it in place and return no new array.

## Reading

{{entry: size()}}

The number of elements in the array. Test it before you read or remove an element from an array that may be empty, and use it to trim a window to a fixed length.

```openscript
var closes: array<number> = []
push(closes, close)
if size(closes) > 50
    shift(closes)

plot(size(closes), "Closes held")
```

**Remarks.** A new empty array has a size of 0. The last element is at `size(arr) - 1`.

**See also.** [[element()]], [[push()]], [[shift()]]

{{entry: element()}}

Element `i` of the array, counting from 0. `arr[i]` is the same call written shorter. Functions with several outputs, such as [[macd()]], return an array, and `element` reads one output from it.

```openscript
m = macd(close, 12, 26, 9)

plot(element(m, 0), "MACD", aqua)
plot(element(m, 1), "Signal", orange)
plot(m[2], "Histogram", gray, style = "histogram")
```

**Remarks.** An index outside `0` to `size - 1`, or with a fractional part, stops the study at that bar with [OS4004](/script/errors/runtime#os4004). On a name that holds an array, `[]` reads an element and never an earlier bar. Where a line mixes the two meanings, `element(arr, i)` says which one you mean. The array returned by a multi-output function always has the same length, and each element is absent until its own warmup is over.

**See also.** [[size()]], [[set()]], [[indexOf()]]

{{entry: indexOf()}}

The index of the first element equal to `v`, or `-1` when no element is. With two arrays kept side by side, it turns one into a lookup table for the other.

```openscript
names  = ["sma", "ema", "wma"]
lens   = [50, 21, 30]
choice = input("ema", "Average", options = ["sma", "ema", "wma"])

// Each average type has its own length, found by position.
slot = indexOf(names, choice)
len  = slot >= 0 ? element(lens, slot) : 20

plot(ma(close, len, choice), "Average")
```

**Remarks.** Not found is `-1`, a definite answer, so compare the result with `-1` or `>= 0`. The search uses `==`, so an absent element is found by searching for `none`, and two drawings match only when they are the same drawing. The search walks the array from the front, one element at a time.

**See also.** [[element()]], [[str.indexOf()]], [[arrayEqual()]]

{{entry: arrayEqual()}}

True when two arrays have the same length and equal elements in the same order. It compares contents, where `==` on two arrays only asks whether they are the same array.

```openscript
// Three closes in a row, each higher than the one before.
lastThree = [close[2], close[1], close]
ordered   = copy(lastThree)
sort(ordered, "asc")

barColor(arrayEqual(lastThree, ordered) ? lime : none)
```

**Remarks.** Each pair of elements is compared with `==`, so an absent element equals an absent element. Two arrays of drawings are equal when they hold the same drawings in the same order.

**See also.** [[copy()]], [[sort()]], [[indexOf()]]

## Writing and growing

{{entry: set()}}

Writes `v` into element `i`, replacing what was there. It changes the array in place; the size stays the same.

```openscript
// Up bars counted by weekday, Monday first.
var ups: array<number> = [0, 0, 0, 0, 0, 0, 0]

day = date.dayOfWeek(time) - 1
if close > open
    set(ups, day, element(ups, day) + 1)

plot(element(ups, day), "Up bars on this weekday so far")
```

**Remarks.** `i` must already exist: writing past the end is [OS4004](/script/errors/runtime#os4004), not a way to grow the array. Use [[push()]] or [[insert()]] to add elements.

**See also.** [[element()]], [[push()]], [[insert()]]

{{entry: push()}}

Adds `v` to the end of the array. It is the usual way to collect values as they happen, one per event.

```openscript
var swingHighs: array<number> = []

ph = pivotHigh(high, 5, 5)
if not isNone(ph)
    push(swingHighs, ph)

last = size(swingHighs) > 0 ? element(swingHighs, size(swingHighs) - 1) : none
plot(last, "Latest swing high", red, style = "step")
```

**Remarks.** A `var` array that is pushed to on every bar grows for the whole run. Trim it with [[shift()]] once it holds as many elements as you need, or it reaches the 1,000,000 element limit on a long chart.

**See also.** [[pop()]], [[unshift()]], [[shift()]]

{{entry: pop()}}

Removes the last element and returns it. With [[push()]] it makes a stack: the most recently added value comes off first.

```openscript
var supports: array<number> = []

pl = pivotLow(low, 5, 5)
if not isNone(pl)
    push(supports, pl)

// A close below the newest support removes it, and the one before takes over.
if size(supports) > 0 and close < element(supports, size(supports) - 1)
    pop(supports)

current = size(supports) > 0 ? element(supports, size(supports) - 1) : none
plot(current, "Current support", lime, style = "step")
```

**Remarks.** On an empty array it stops the study at that bar with [OS4004](/script/errors/runtime#os4004), so guard it with `size(arr) > 0`. You may use the returned value or ignore it.

**See also.** [[push()]], [[shift()]], [[remove()]]

{{entry: unshift()}}

Adds `v` to the front of the array, so element 0 is always the newest value.

```openscript
var recent: array<number> = []
unshift(recent, close)
if size(recent) > 5
    pop(recent)

// recent[0] is this bar's close, recent[4] the close four bars ago.
plot(size(recent) == 5 ? recent[0] - recent[4] : none, "Change over four bars")
```

**Remarks.** Every existing element moves up one index. For a window with the oldest value first, use [[push()]] and [[shift()]] instead.

**See also.** [[shift()]], [[push()]], [[insert()]]

{{entry: shift()}}

Removes the first element and returns it. Paired with [[push()]], it keeps a rolling window: push the new value, then shift the oldest once the window is full.

```openscript
len = input(20, "Window", min = 2, max = 500)

var window: array<number> = []
push(window, close)
if size(window) > len
    shift(window)

plot(avg(window), "Mean of the window", aqua)
```

**Remarks.** On an empty array it stops the study at that bar with [OS4004](/script/errors/runtime#os4004). For a plain moving average, [[sma()]] is shorter and exact about its warmup; keep a window by hand when you need something the library does not compute, such as a trimmed mean.

**See also.** [[push()]], [[pop()]], [[slice()]]

{{entry: insert()}}

Adds `v` before index `i`, moving that element and everything after it up by one. Use it to keep an array in order as values arrive.

```openscript
// The ten widest bars seen so far, widest first.
var widest: array<number> = []
barRange = high - low

i = 0
while i < size(widest) and element(widest, i) >= barRange
    i += 1

if i < 10
    insert(widest, i, barRange)
    if size(widest) > 10
        pop(widest)

// Drawn once ten bars have been seen, so the line is always the tenth widest.
plot(size(widest) == 10 ? element(widest, 9) : none, "Tenth widest bar so far")
```

**Remarks.** `i` may be from 0 to `size(arr)`; inserting at `size(arr)` adds to the end, like [[push()]]. Anything larger is [OS4004](/script/errors/runtime#os4004).

**See also.** [[remove()]], [[push()]], [[unshift()]]

{{entry: remove()}}

Removes element `i` and returns it, moving everything after it down by one. It is how a script drops a level that has been broken or has grown too old.

```openscript
var levels: array<number> = []
var born: array<number> = []

ph = pivotHigh(high, 5, 5)
if not isNone(ph)
    push(levels, ph)
    push(born, bar.index)

// Count down, so removing element i never skips the element after it.
for i = size(levels) - 1 to 0 step -1
    if close > element(levels, i) or bar.index - element(born, i) > 100
        remove(levels, i)
        remove(born, i)

plot(size(levels), "Unbroken swing highs")
```

**Remarks.** An index outside `0` to `size - 1` is [OS4004](/script/errors/runtime#os4004). When a loop removes elements, count down with `step -1`: removing element `i` renumbers every element after it, and a loop counting up would skip one. Keep side-by-side arrays in step by removing the same index from each, as above.

**See also.** [[insert()]], [[pop()]], [[shift()]]

{{entry: clear()}}

Empties an array, leaving it with a size of 0. Called with a [[table()]] instead, it empties every cell of the table, so the panel can be rebuilt from scratch.

```openscript
// The closes of the current session only, from its first bar. newSession is
// explained under the first example on this page.
newSession = orElse(session.isFirstBar, isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata"))
var sessionCloses: array<number> = []
if newSession
    clear(sessionCloses)
push(sessionCloses, close)

plot(avg(sessionCloses), "Mean close of the session so far", orange)
```

**Remarks.** The array itself survives, so every name that refers to it sees it empty. The table form is covered with an example in [Tables](/script/visuals/tables).

**See also.** [[size()]], [[table()]], [[cell()]]

## Copying, slicing and ordering

{{entry: copy()}}

A new array with the same elements, independent of the original: changing one does not change the other. Copy before you sort, so the original keeps its order.

```openscript
len = input(21, "Window", min = 3, max = 500)

var window: array<number> = []
push(window, close)
if size(window) > len
    shift(window)

// sort works in place, so sort a copy and leave the window in bar order.
ranked = copy(window)
sort(ranked, "asc")
middle = ranked[floor(size(ranked) / 2)]

plot(size(window) == len ? middle : none, "Median of the window", orange)
```

**Remarks.** The copy is a new array, but the elements themselves are not duplicated. For numbers, strings, colours and bools that makes no difference. A copy of an array of drawings holds the same drawings, not new ones, so moving a line through the copy moves the line on the chart. For a median over bars, [[median()]] does this in one call with an exact warmup.

**See also.** [[slice()]], [[sort()]], [[arrayEqual()]]

{{entry: slice()}}

A new array holding the elements from index `from` up to, but not including, index `to`. The original is not changed.

```openscript title="Trimmed mean"
version 1
study("Trimmed mean", overlay = true)

len  = input(20, "Window", min = 5, max = 200)
trim = input(2, "Values dropped from each end", min = 0, max = 10)

var window: array<number> = []
push(window, close)
if size(window) > len
    shift(window)

// The mean without the most extreme closes at either end.
ranked = copy(window)
sort(ranked, "asc")
ready = size(window) == len and trim * 2 < len
plot(ready ? avg(slice(ranked, trim, len - trim)) : none, "Trimmed mean", aqua, width = 2)
```

**Remarks.** A `to` past the end is cut back to the end, and a `from` at or after `to` gives an empty array. Negative or fractional bounds stop the study at that bar with [OS4003](/script/errors/runtime#os4003).

**See also.** [[copy()]], [[sort()]], [[str.substring()]]

{{entry: sort()}}

Sorts the array in place, `"asc"` for smallest first or `"desc"` for largest first. Numbers sort by value, strings by Unicode code point (every capital letter before every small letter), and `false` before `true`.

```openscript
names = ["TCS", "INFY", "HDFCBANK", "RELIANCE"]
sort(names, "asc")

// Shows HDFCBANK, INFY, RELIANCE, TCS
panel = table("Watchlist", 1, 1)
if bar.isLast
    cell(panel, 0, 0, str.join(names, ", "))
```

**Remarks.** It returns nothing and changes the array you pass, so sort a [[copy()]] when the original order still matters. Absent elements go after every present value when sorting `"asc"`, and so come first with `"desc"`. `order` is written as a literal, or taken from a menu [[input()]]; any other literal is [OS3008](/script/errors/arguments#os3008).

**See also.** [[reverse()]], [[copy()]], [[median()]], [[percentile()]]

{{entry: reverse()}}

Reverses the order of the elements in place, so the first becomes the last.

```openscript
var swings: array<string> = []

ph = pivotHigh(high, 3, 3)
if not isNone(ph)
    push(swings, text(ph, 2))
    if size(swings) > 3
        shift(swings)

panel = table("Swing highs", 1, 1)
if bar.isLast
    newestFirst = copy(swings)
    reverse(newestFirst)
    cell(panel, 0, 0, "Newest first: " + str.join(newestFirst, ", "))
```

**Remarks.** Like [[sort()]], it returns nothing and changes the array it is given.

**See also.** [[sort()]], [[copy()]], [[unshift()]]

## Statistics

{{entry: avg()}}

The mean of every element in an array of numbers. Use it when the values you are averaging are not one per bar, such as one reading per session, or when you keep a window by hand.

```openscript
// The session's first bar, or of the IST day where no session hours are stated.
newSession = orElse(session.isFirstBar, isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata"))
var gaps: array<number> = []
if newSession and not bar.isFirst
    push(gaps, abs(open - close[1]))
    if size(gaps) > 20
        shift(gaps)

plot(avg(gaps), "Average opening gap, last 20 sessions", aqua)
```

**Remarks.** An empty array has no mean, so `avg` of it is absent, and one absent element makes the whole mean absent. Four more summaries have an array form beside their usual one, and the compiler picks the form from the argument: [[sum()]], [[min()]], [[max()]] and [[stdev()]] (population standard deviation). `sum` of an empty array is 0, while `min`, `max` and `stdev` of one are absent. For a mean over the last `len` bars of a series, [[sma()]] is the direct call.

**See also.** [[sum()]], [[min()]], [[max()]], [[stdev()]], [[sma()]]

## Looping over an array

`for value in arr` visits the elements in index order, from 0 to the size measured when the loop starts. Elements added during the loop are not visited, and if the array shrinks past the loop's position, the loop stops. To walk by index, write `for i = 0 to size(arr) - 1`; to remove as you go, count down with `step -1`, as [[remove()]] shows.

```openscript
levels = [22000.0, 22250.0, 22500.0]

passed = 0
for mark in levels
    if close > mark
        passed += 1

plot(passed, "Levels below the close")
```

Every loop iteration on a bar counts against a budget of 2,000,000 per bar. A script that passes it stops the study at that bar with [OS5001](/script/errors/limits#os5001); one that genuinely needs more raises the budget with a `limits(loops = ...)` line straight after its declaration. See [Control flow](/script/language/control-flow) for every loop form.

## Maps and matrices

The array is the only collection in this release. `map` and `matrix` are reserved words, kept for key-value maps and two-dimensional numeric grids in a later language version, so neither can be used as a name today ([OS1019](/script/errors/syntax#os1019)). Until they arrive, two arrays kept side by side with [[indexOf()]] do the work of a small map, and one flat array indexed as `row * columns + column` does the work of a grid.

## Related

[Collections guide](/script/language/collections), [Persistence](/script/language/persistence), [Types](/script/reference/types), [Control flow](/script/language/control-flow), [Strings](/script/reference/string), [Series functions](/script/reference/series), [Lines and boxes](/script/visuals/lines-and-boxes).
