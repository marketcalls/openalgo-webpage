---
title: Collections
description: Arrays in OpenScript. Making them, reading and changing them, the difference between an array rebuilt every bar and one kept for the run, iterating safely, and what is true today about maps and matrices.
---

A collection holds several values under one name. In this release OpenScript has one collection type, the **array**: an ordered list whose elements all have the same type. This page covers making arrays, reading and changing them, the two lifetimes an array can have, looping over one safely, the arrays that multi-output calls return, and how to get the effect of a map or a matrix today. `map` and `matrix` are reserved words for a later language version and are not available yet; the last sections say exactly what that means for a script you write now.

## A first example

This study keeps the last 20 closes in an array, sorts a copy, drops the two highest and two lowest, and plots the mean of the rest. A series can give you `close[20]`, but it cannot be sorted; that is the job an array does.

```openscript title="Trimmed mean"
version 1
study("Trimmed mean", overlay = true, precision = 2)

len  = input(20, "Window", min = 5, max = 200)
trim = input(2, "Values dropped from each end", min = 0, max = 10)

// Kept for the whole run: one close appended per bar, the oldest dropped.
// Without the trim this array would grow on every bar of the chart.
var window: array<number> = []
push(window, close)
if size(window) > len
    shift(window)

ready = size(window) == len and trim * 2 < len

middle = none
if ready
    // Rebuilt every bar and thrown away. copy() matters: sorting the window
    // itself would scramble the arrival order that shift() depends on.
    sorted = copy(window)
    sort(sorted, "asc")
    middle = avg(slice(sorted, trim, len - trim))

plot(middle, "Trimmed mean", aqua, width = 2)
plot(ready ? avg(window) : none, "Plain mean", orange)
```

Three details are worth copying. `middle` is declared before the `if` and assigned inside it, because a name first assigned inside a block belongs to that block. [[copy()]] is there because [[sort()]] works in place. And the trim runs before anything reads the window, so the window is never longer than `len`.

## What arrays are for

A series already gives you the past, so an array is not for remembering price history. It is for the jobs a series cannot do:

| Job | Example |
|---|---|
| A window you need to reshape | Sort the last 20 closes and drop the extremes |
| A set the script grows and shrinks | The zones currently drawn, the levels still in play |
| Several facts per item, kept side by side | Four arrays describing the boxes a study drew |
| Several outputs from one call | [[bollinger()]] returns its basis, upper and lower band |

If what you want is "the value n bars ago", use `[]` on a series and write no array at all. [Bars and history](/script/language/bars-and-history) covers that.

## Making an array

An `array<T>` is ordered, can change size, and holds one type of element. Write a literal in square brackets:

```openscript
levels = [20.0, 50.0, 80.0]         // array<number>
names  = ["NIFTY", "BANKNIFTY"]     // array<string>
flags  = [true, false, true]        // array<bool>
shades = [red, orange, lime]        // array<color>
var hits: array<number> = []        // empty, so the type is written down

plot(size(levels) + size(names) + size(flags) + size(shades) + size(hits), "Elements")
```

The element type can be `number`, `string`, `bool`, `color`, or one of the object types `line`, `label`, `box`, `polyline` and `table`. An `array<box>` or `array<line>` is how a study keeps the drawings it will come back to. Three rules:

**Every element has the same type.** A literal that mixes types is error [OS2013](/script/errors/names-and-types#os2013):

```openscript expect=OS2013
mixed = [1.0, "one"]
plot(size(mixed), "Size")
```

**An empty literal needs a type.** It takes one from an annotation, or from the first `push`, `unshift`, `insert` or `set` that puts an element into it. With neither it is error [OS2015](/script/errors/names-and-types#os2015). Write the annotation anyway: it is the only documentation the next reader gets.

```openscript expect=OS2015
empty = []
plot(size(empty), "Size")
```

**An array cannot hold arrays.** `array<array<number>>` is error [OS2019](/script/errors/names-and-types#os2019) in this release. For a grid, use one flat array and index arithmetic, as [Living without a matrix](#living-without-a-matrix) shows.

```openscript expect=OS2019
var grid: array<array<number>> = []
```

## An array is a reference

**Assigning an array to another name gives two names for one array.** It does not copy.

```openscript
a = [1.0, 2.0, 3.0]
b = a
set(b, 0, 99.0)     // a[0] is now 99 too: a and b are the same array
c = copy(a)         // c is independent

sameArray   = a == b              // true: the same array
sameContent = arrayEqual(a, c)    // true: equal elements in the same order

plot(a[0], "First element of a")
plot(sameArray and sameContent ? 1 : 0, "Both true")
```

Copying on every assignment would make passing a large array to a function quietly expensive on every bar, and the cost would be invisible in the source. So copying is explicit, and it is one word. For the same reason `==` on two arrays asks whether they are the same array; [[arrayEqual()]] compares what they hold.

## Reading and writing elements

`a[i]` reads element `i` when `a` is an array, counting from 0. `element(a, i)` is the same read written as a call ([[element()]]), and `set(a, i, v)` writes one element ([[set()]]).

The same brackets mean history when the value is a series, and the compiler decides which from the type. The one place a human reader can be misled is an array held in a `var`, where `prices[1]` might be read as "last bar's prices". It is the second element. Where a line could be read either way, prefer `element(prices, 1)`.

An index outside `0` to `size - 1` is error [OS4004](/script/errors/runtime#os4004), which names the index and the size and stops the script on that bar. That is deliberately the opposite of history: `close[500]` on bar 7 is absent because that value never existed, while `element(arr, 500)` on an array of seven elements is a mistake in the script, because the array's size is something the script chose.

## Every operation

All of these are bare names, available in every script.

**Size and reading**

| Call | Written | Does |
|---|---|---|
| [[size()]] | `size(arr)` | The number of elements |
| [[element()]] | `element(arr, i)` or `arr[i]` | Element `i` |
| [[indexOf()]] | `indexOf(arr, v)` | The first index holding `v`, or `-1` |
| [[arrayEqual()]] | `arrayEqual(a, b)` | Whether two arrays hold equal elements in the same order |

**Changing in place**

| Call | Written | Does |
|---|---|---|
| [[set()]] | `set(arr, i, v)` | Writes element `i` |
| [[sort()]] | `sort(arr, order)` | Sorts, `"asc"` or `"desc"`. The order is required |
| [[reverse()]] | `reverse(arr)` | Reverses the order |

**Growing and shrinking**

| Call | Written | Does |
|---|---|---|
| [[push()]] | `push(arr, v)` | Appends to the end |
| [[pop()]] | `pop(arr)` | Removes and returns the last element |
| [[unshift()]] | `unshift(arr, v)` | Inserts at the front |
| [[shift()]] | `shift(arr)` | Removes and returns the first element |
| [[insert()]] | `insert(arr, i, v)` | Inserts before index `i` |
| [[remove()]] | `remove(arr, i)` | Removes and returns element `i` |
| [[clear()]] | `clear(arr)` | Removes everything |

**New arrays from old**

| Call | Written | Does |
|---|---|---|
| [[slice()]] | `slice(arr, from, to)` | A new array, `from` included, `to` excluded |
| [[copy()]] | `copy(arr)` | An independent copy |

**Statistics over the whole array**

| Call | Written | Does | On an empty array |
|---|---|---|---|
| [[sum()]] | `sum(arr)` | The total | 0 |
| [[avg()]] | `avg(arr)` | The mean | Absent |
| [[min()]], [[max()]] | `min(arr)`, `max(arr)` | The smallest and largest | Absent |
| [[stdev()]] | `stdev(arr)` | The population standard deviation | Absent |

Several of these names also have a windowed form over a series, and the compiler picks the right one from the arguments: `sum(prices)` totals an array, `sum(close, 20)` totals the last twenty closes. One name for one idea, in two shapes, settled before the first bar.

[[sort()]] has no default order, so leaving it out is error [OS3012](/script/errors/arguments#os3012):

```openscript expect=OS3012
levels = [3.0, 1.0, 2.0]
sort(levels)
plot(levels[0], "Lowest")
```

## Errors, and what this release raises

| Code | When | Note |
|---|---|---|
| [OS4004](/script/errors/runtime#os4004) | An index outside `0` to `size - 1` | Also raised by `pop` and `shift` on an empty array in this release |
| [OS5002](/script/errors/limits#os5002) | An array passes 1,000,000 elements | `limits()` does not raise this ceiling |
| [OS2013](/script/errors/names-and-types#os2013) | A literal mixing types | Arrays hold one type |
| [OS2015](/script/errors/names-and-types#os2015) | An empty literal with no type | Annotate it |
| [OS2019](/script/errors/names-and-types#os2019) | An array of arrays, or of plots | Flatten it |
| [OS3012](/script/errors/arguments#os3012) | `sort` without an order | Say `"asc"` or `"desc"` |

The error list also includes [OS4006](/script/errors/runtime#os4006), for taking an element from an empty array, and [OS4007](/script/errors/runtime#os4007), for a slice whose bounds are not `0 <= from <= to <= size`. The compiler and engine raise neither in this release. Instead, `pop` and `shift` on an empty array raise OS4004, summarising an empty array gives the values in the table above, and [[slice()]] takes whatever part of the range falls inside the array, returning a shorter or empty array. Test `size(arr) > 0` before taking an element, and keep slice bounds inside the array, so the script behaves the same when those codes arrive.

OS5002 exists so one runaway script cannot exhaust a browser tab and take the chart with it. It is almost always the same bug: a window that is appended to on every bar and never trimmed. The trim is two lines, as in the first example.

## Two lifetimes: the bar and the run

This is the distinction that decides how most array code should be written.

**An array made by a plain assignment is built fresh on every bar.** The literal runs again, a new array exists, and last bar's array is gone. That is what you want for scratch work: a sorted copy, a slice, a set of candidates you rank and throw away.

**An array held in a `var` is made once and lives for the whole run**, with everything the script has pushed into it.

| | Plain assignment | `var` |
|---|---|---|
| Created | Every bar | Once |
| Holds | This bar's working values | Everything the run has added |
| Grows without limit | No | Yes, unless you trim it |
| Rolled back while the newest bar forms | Not applicable, it is rebuilt | Yes, contents included |
| Typical use | Sort, slice, rank, then discard | A rolling window, a set of drawings |

The rollback row matters on a chart receiving real-time updates. The newest bar is executed again on every update, and before each re-execution the engine restores every persistent value, array contents included, to what it held at the end of the previous bar. So a script that pushes one element per bar pushes one per bar, not one per update, and a realtime chart agrees with a backtest of the same bars. [Persistence](/script/language/persistence) covers the rule.

## Iterating safely

There are two loop forms:

```openscript
var window: array<number> = []
push(window, close)
if size(window) > 10
    shift(window)

total = 0.0
for price in window                 // over the elements
    total += price

total2 = 0.0
for i = 0 to size(window) - 1       // over the indices
    total2 += element(window, i)

plot(total, "Sum by element")
plot(total2, "Sum by index")
```

The `in` form visits indices `0` to `size - 1` as measured when the loop starts, so elements appended during the loop are not visited. The index form written as `0 to size(window) - 1` runs zero times on an empty array, because a loop with a positive step and an end below its start does not run.

**When a loop removes elements, count downwards.** Removing element `i` renumbers every element after it. Counting down means the elements the loop has yet to visit keep their numbers, so nothing is skipped:

```openscript
var levels: array<number> = []
var ages:   array<number> = []
maxAge = 50

// Add this bar's high as a level, then age every level by one bar.
push(levels, high)
push(ages, 0)
for i = 0 to size(ages) - 1
    set(ages, i, element(ages, i) + 1)

// Remove old levels, from the end backwards.
for i = size(levels) - 1 to 0 step -1
    if element(ages, i) > maxAge
        remove(levels, i)
        remove(ages, i)

plot(size(levels), "Levels kept")
```

Going forwards with a removal inside is the classic way to skip every other match, and it only shows up when two neighbours are removed on the same bar. A descending loop must say `step -1`: with a positive step and an end below the start, the body simply does not run.

Every iteration of every loop on a bar counts against the per-bar loop budget of 2,000,000 iterations. [Control flow](/script/language/control-flow) covers `for`, `while`, `break`, `continue` and the budget.

## Arrays that come back from a call

A library call with more than one output returns an `array<number>` holding this bar's outputs in a documented order:

```openscript title="MACD"
version 1
study("MACD", precision = 4)

src    = input(close, "Source")
fast   = input(12, "Fast", min = 1, max = 500)
slow   = input(26, "Slow", min = 2, max = 500)
smooth = input(9, "Signal", min = 1, max = 500)

// One array per bar, rebuilt every bar.
m = macd(src, fast, slow, smooth)

// Name the elements. Each name is a series, so it has history.
line = m[0]
sig  = m[1]
hist = m[2]

level(0, "Zero", gray)
plot(line, "MACD", aqua, width = 2)
plot(sig, "Signal", orange)
plot(hist, "Histogram", hist > 0 ? lime : red, style = "histogram")

if crossUp(line, sig)
    signal("UP")
```

The returned array is never absent and never changes length. Each element has its own first bar and is absent until then, so `m[2]` is a valid read on bar 0 that simply holds nothing yet. The crossing is read from the named series, which have history because they are top-level names: `m[1]` is element 1, not one bar ago.

:::warn History of a whole array
`history(m, 1)` compiles, but in release 0.5.0 it gives the absent value on every bar rather than last bar's array. To look back at an output, name it at the top level, as `line` and `sig` are above, and read `line[1]`.
:::

## Parallel arrays

This release has no record type, so a list of things that each have several fields is written as several arrays kept the same length and indexed together:

```openscript
var zoneTop:    array<number> = []
var zoneBottom: array<number> = []
var zoneStart:  array<number> = []

pivot = pivotLow(low, 5, 5)
if not isNone(pivot)
    push(zoneTop, max(open[5], close[5]))
    push(zoneBottom, low[5])
    push(zoneStart, time[5])

plot(size(zoneTop), "Zones")
```

Every operation that adds an item pushes to all the arrays, and every operation that removes one removes from all of them, at the same index, in the same block. That discipline is the whole technique: the moment one array is updated without the others, the script holds nonsense that no error will catch. It is also why the descending removal loop matters so much here, since one missed `remove` misaligns every record after it. [Objects and methods](/script/language/objects-and-methods) uses the same shape for drawings. A record type, declared with `type`, is planned for a later language version and would replace this shape; it is not available yet.

## Maps and matrices: what is true today

| Type | Status in this release |
|---|---|
| `array<T>` | Available, as described above |
| `map<K, V>` | Planned. A reserved word with no implementation: no annotation, no functions |
| `matrix<T>` | Planned. A reserved word with no implementation |

Because they are reserved, you cannot use `map` or `matrix` as names either. Trying is error [OS1019](/script/errors/syntax#os1019), which says the word is reserved rather than unknown:

```openscript expect=OS1019
map = 1
plot(map, "Map")
```

Writing one in a type annotation is error [OS2016](/script/errors/names-and-types#os2016), because in this release neither word names a type:

```openscript expect=OS2016
var prices: map = none
```

What is intended for a later version, stated so nobody plans around a different answer:

- **`map<K, V>` with `string` and `number` keys, iterating in the order the keys were added.** The order is a requirement, not a convenience: a script must give the same output every time it runs, and a collection with no defined order would not.
- **`matrix<T>` as a two-dimensional numeric container**, with element access, row and column operations, and the small amount of linear algebra that correlation and regression studies need.

Both will arrive with a new language version. A script that declares `version 1` keeps compiling and keeps producing the same numbers, so nothing you write today breaks when they land. The words are reserved now precisely so that adding them later cannot break a script that used one as a name.

## Living without a map

A map associates a key with a value. Two arrays kept in step give you one, and for the handful of keys a chart script uses, the search is not the slow part of anything. This study counts, for each weekday, the share of bars that closed up:

```openscript title="Up share by weekday"
version 1
study("Up share by weekday", precision = 0)

// Keys and values, kept in step. Seven slots, although NSE trades Monday to
// Friday: a special weekend session would otherwise push the index outside
// the array, which is OS4004.
var dayNames: array<string> = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
var dayUp:    array<number> = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
var dayTotal: array<number> = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

// dayOfWeek is 1 for Monday, so the index is one less.
i = date.dayOfWeek(time) - 1

if bar.isConfirmed
    set(dayTotal, i, element(dayTotal, i) + 1)
    if close > open
        set(dayUp, i, element(dayUp, i) + 1)

panel = table("Up share by weekday", 8, 2)

if bar.isLast
    cell(panel, 0, 0, "Day", textColor = white)
    cell(panel, 0, 1, "Up share", textColor = white)
    for row = 0 to 6
        total = element(dayTotal, row)
        share = total > 0 ? element(dayUp, row) / total * 100 : none
        cell(panel, row + 1, 0, element(dayNames, row))
        cell(panel, row + 1, 1, isNone(share) ? "no data" : text(share, 0) + " percent")
```

When the script does not know the keys in advance, [[indexOf()]] finds the slot, and `-1` means the key is new. Here the keys are round levels, the nearest multiple of 100 to each close, and the value is how many bars have closed nearest that level so far:

```openscript title="Closes near round levels"
version 1
study("Closes near round levels", precision = 0)

// Keys and values, kept in step. The pair of arrays is the map.
var roundLevels: array<number> = []
var closesNear:  array<number> = []

// The key for this bar: the nearest multiple of 100 to the close.
key = round(close / 100) * 100

// Find the key, or add it.
slot = indexOf(roundLevels, key)
if slot == -1
    push(roundLevels, key)
    push(closesNear, 1.0)
else
    set(closesNear, slot, element(closesNear, slot) + 1)

// How many bars so far have closed nearest the same level as this one.
plot(element(closesNear, indexOf(roundLevels, key)), "Closes near this level", aqua)
plot(size(roundLevels), "Levels seen", gray)
```

The keys come from the data, so the set grows only as price reaches new levels. Keep the number of keys small and bounded. An unbounded key set built from data is the shape that reaches OS5002, and it is also the shape that will genuinely want a map when one exists.

## Living without a matrix

A two-dimensional grid is a flat array plus one line of index arithmetic, which is the same layout a matrix would use underneath. This study counts up bars and down bars for each hour of the day; on an NSE chart the hours that fill are 9 to 15.

```openscript title="Up share by hour"
version 1
study("Up share by hour", precision = 0)

hours = 24
cols  = 2       // column 0 counts up bars, column 1 counts down bars

// One flat array, read as a grid of 24 rows and 2 columns.
var grid: array<number> = []
if bar.isFirst
    for k = 0 to hours * cols - 1
        push(grid, 0.0)

// row * width + col is the whole technique; writing it once keeps it in one place.
fn at(row, col, width) => row * width + col

h = date.hour(time)

if bar.isConfirmed and close != open
    col = close > open ? 0 : 1
    i = at(h, col, cols)
    set(grid, i, element(grid, i) + 1)

// The share of up bars in the hour this bar falls in.
ups   = element(grid, at(h, 0, cols))
downs = element(grid, at(h, 1, cols))
plot(ups + downs > 0 ? ups / (ups + downs) * 100 : none, "Up share this hour", aqua)
level(50, "Even", gray)
```

The helper `at` holds no `var` and calls nothing stateful, so its several call sites share nothing and it is safe anywhere. A helper that held state would not be; [User functions](/script/language/functions) explains the difference. [[date.hour()]] reads the hour in the chart's time zone, so the rows line up with the exchange's clock.

**Related.** [Bars and history](/script/language/bars-and-history), [Persistence](/script/language/persistence), [Control flow](/script/language/control-flow), [User functions](/script/language/functions), [Objects and methods](/script/language/objects-and-methods), [Types and values](/script/language/types-and-values), [Collections reference](/script/reference/collections)
