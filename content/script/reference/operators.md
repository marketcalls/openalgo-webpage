---
title: Operators
description: Every operator in OpenScript with its precedence, associativity, operand types, result type and what it does when an operand is absent.
---

This page is the complete list of operator marks in OpenScript: arithmetic, comparison, logic, the ternary, history and member access, and the assignment forms. For each one it gives the types it accepts, the type it produces and what it does when an operand is `none`, the absent value.

Operators are where a script's arithmetic meets its warmup bars (the first bars, where an indicator does not have enough data yet), so the absence rules below decide what your first plotted bars look like. If you are learning the language, read the precedence table and the section on absent operands; the rest is reference.

```openscript title="Operators at work"
version 1
study("Body strength", precision = 2)

body     = close - open                          // binary minus
barRange = high - low
share    = barRange > 0 ? body / barRange : none // the ternary skips a zero range
avgVol   = sma(volume, 20)
heavy    = volume > 1.5 * avgVol and not isNone(share)

plot(share * 100, "Body as a percent of range", aqua, style = "histogram")
plot(heavy ? share * 100 : none, "On heavy volume", orange, style = "histogram")
level(0, "Zero", gray)
```

## Precedence and associativity

Operators on a higher row bind more tightly. Each row lists its associativity, which decides how a chain of operators from the same row groups.

| Level | Operators | Associativity | Notes |
|---|---|---|---|
| 1 | `(expr)`, `f(args)`, `a[i]`, `a.b` | Left | Grouping, call, history or element, member |
| 2 | unary `-`, unary `+`, `not` | Right | |
| 3 | `*`, `/`, `%` | Left | |
| 4 | binary `+`, binary `-` | Left | `+` also joins strings |
| 5 | `<`, `<=`, `>`, `>=` | None | Cannot be chained |
| 6 | `==`, `!=` | None | Cannot be chained |
| 7 | `and` | Left | Short-circuits |
| 8 | `or` | Left | Short-circuits |
| 9 | `cond ? a : b` | Right | Only the chosen arm runs |

```openscript
a = 2
b = 3
c = 4
x = a + b * c                 // a + (b * c), which is 14
y = -a % b                    // (-a) % b, which is -2
z = close > open ? "up" : close < open ? "down" : "flat"   // groups to the right
plot(x + y, "Sum, which is 12")
plot(str.length(z), "Length of the direction word")
```

Assignment is not in the table. `=` and the compound forms such as `+=` are statements, not operators, and they are listed [below](#assignment).

### How each associativity reads

| Associativity | Operators | `a op b op c` means |
|---|---|---|
| Left | `*`, `/`, `%`, binary `+`, binary `-`, `and`, `or` | `(a op b) op c` |
| Right | unary `-`, unary `+`, `not`, the ternary | `not not x` is `not (not x)`; `p ? a : q ? b : c` is `p ? a : (q ? b : c)` |
| None | `<`, `<=`, `>`, `>=`, `==`, `!=` | Not allowed: `a < b < c` is `OS1008`. Write `a < b and b < c` |

A comparison and an equality are on different levels, so `a < b == true` is legal: the comparison runs first. Two operators from the same non-chaining level are the only form refused.

## Grouping, calls, history and members

### `(` and `)`: grouping and calls

Parentheses group an expression to override precedence, at no cost at run time. After a name, they hold a call's arguments.

```openscript
mid = (high + low) / 2
plot(mid, "Midpoint")
```

A call takes positional arguments, named arguments, or positional followed by named. The compiler checks every call before the first bar runs:

| Mistake | Error |
|---|---|
| Too many arguments | `OS3001` |
| A required argument left out | `OS3012` |
| A named argument that does not exist | `OS3002`, and the message lists the names that do |
| The same argument given twice | `OS3013` |
| A positional argument after a named one | `OS3005` |
| An argument of the wrong type | `OS3011` |

### `[` and `]`: history, elements and array literals

One pair of brackets does three jobs, and the compiler always knows which from what is on the left.

| Written | When | Means | Result |
|---|---|---|---|
| `src[n]` | `src` is a series | The value `n` bars ago; `src[0]` is `src` | The series' value type |
| `arr[i]` | `arr` is an array | Element `i`, counting from 0 | The element type |
| `[a, b, c]` | At the start of an expression | An array literal | `array<T>` |

```openscript
prev  = close[1]              // history: the previous bar's close
var recent: array<number> = []
push(recent, close)
if size(recent) > 20
    shift(recent)
first = recent[0]             // element: the oldest value kept
plot(close - prev, "Change")
plot(first, "Oldest of the last 20")
```

A value has history, and so accepts `[n]`, when it is a built-in series such as [[close]], a name declared at the top level of the file, a call that returns a series, or a series parameter of your own function. Anything else is `OS2004`: give the value a name at the top level and read that name.

| History case | Result |
|---|---|
| `n` is more than the bars so far | `none`, not an error and not the oldest bar |
| `n` is `none` | `none` |
| `n` is negative or not a whole number | `OS4001` when the bar runs |
| `n` is deeper than the retained history | `OS4002`, naming the depth that was kept |

An array index outside `0` to `size - 1`, or one that is not a whole number, is `OS4004`. It is an error rather than an absent value because an array has a size you chose, so an index past it is a mistake. When one line does both jobs, the explicit forms [[history()]] and [[element()]] say which is meant.

### `.`: member access

Reads a member of a namespace, such as `bar.isConfirmed`, `chart.lotSize` or `date.hour(time)`. The namespaces are `bar`, `chart`, `session`, `date`, `str`, `math`, `pos`, `order`, `leg`, `book`, `draw` and `req`. A member that does not exist is `OS2009`, and the fix suggests the nearest name.

```openscript
if bar.isConfirmed and close > high[1]
    signal("BREAKOUT")
```

### `,`: separator

Separates the arguments of a call, the elements of an array literal and the values of a `case`. A comma at the end of a line continues the statement onto the next line, which is how a long call is spread over several lines.

```openscript
levels = [22000.0, 22500.0, 23000.0]
plot(close, "Close",
     color = aqua,
     width = 2)
plot(size(levels), "Levels")
```

## Unary operators

### Unary `-` and `+`

Unary `-` negates a number. Unary `+` returns it unchanged. Both take a `number` and give a `number`; given `none`, both give `none`. A negative literal such as `-2` is this operator applied to `2`, and it parses as you expect inside an argument list.

```openscript
drop = -change(close)
plot(drop, "Fall since the last bar")
```

### `not`

Boolean negation: `bool` to `bool`, and `not none` is `none`. It is right associative, so `not not x` is legal. `!` is not an operator; `!cond` is `OS1001`, and the fix names `not`.

```openscript
if not bar.isConfirmed
    background(fade(yellow, 90))
```

## Arithmetic

| Operator | Operands | Result | With a zero or an absent operand |
|---|---|---|---|
| `*` | `number * number` | `number` | `none` if either side is absent, even `none * 0` |
| `/` | `number / number` | `number` | `none` when the divisor is zero, including `0 / 0` |
| `%` | `number % number` | `number`, the remainder of truncated division | `none` when the divisor is zero |
| `+` | `number + number`, or `string + string` | `number`, or the joined `string` | `none` if either side is absent |
| `-` | `number - number` | `number` | `none` if either side is absent |

A `number` in OpenScript is always finite. An operation with no finite result produces `none` instead of infinity, so a bad bar draws a gap rather than a spike and never poisons an average.

### `*` multiplication

```openscript
atrPercent = atr(14) / close * 100
plot(atrPercent, "ATR as a percent of price")
```

### `/` division

Division by zero is `none`, not an error, because one bad bar must not stop a study that is correct over fifty thousand others. You do not need a guard to avoid a crash; the plot simply has a gap on that bar. Reach for [[orElse()]] or a ternary only when you want a definite value there instead of a gap.

```openscript
gain  = rma(max(change(close), 0), 14)
loss  = rma(max(-change(close), 0), 14)
ratio = gain / loss            // none on a bar where the average loss is 0
plot(ratio, "Average gain over average loss")
```

### `%` remainder

The remainder of truncated division, so its sign follows the left operand: `-7 % 3` is `-1`. The library's [[mod()]] is the floored remainder, whose sign follows the right operand, so `mod(-7, 3)` is `2`. The two agree whenever the right operand is positive, which covers wrapping an index or a bar count.

```openscript
everyFifth = bar.index % 5 == 0
background(everyFifth ? fade(silver, 92) : none)
```

### `+` addition and concatenation

Adds two numbers or joins two strings, and nothing else. `"a" + 5` is `OS2003`: there is no implicit conversion anywhere in the language. Convert explicitly with [[text()]]. Joining follows the absence rule too, so `"a" + none` is `none`; to write an absent value into text on purpose, use `text(none)`, which is the string `"none"`.

```openscript
panel = table("Last close", 1, 1, position = "bottomRight")
message = "Close at " + text(close, 2)
if bar.isLast
    cell(panel, 0, 0, message)
```

### `-` subtraction

```openscript
body = close - open
plot(body, "Body", style = "histogram")
```

There is no exponent operator. Write [[pow()]]: `pow(x, 2)`.

## Comparison

### `<`, `<=`, `>`, `>=`: ordering

| Operands | Result |
|---|---|
| `number` against `number`, or `string` against `string` | `bool`, or `none` when either side is absent |

Strings compare by Unicode code point, which is the same on every machine and in every locale. It is not an alphabetical sort for people.

If either side is `none`, the result is `none`, not `false`. This keeps `a > b` and `a <= b` exact opposites on every bar. During warmup both are `none`, so neither branch runs, instead of one of them running on a guess.

```openscript
r = rsi(close, 14)
if r > 70
    background(fade(red, 92))
if r <= 30
    background(fade(lime, 92))
plot(r, "RSI", purple)
```

Comparisons cannot be chained: `a < b < c` is `OS1008`, and the fix is `a < b and b < c`.

### `==` and `!=`: equality

| Operands | Result |
|---|---|
| Two values of the same type, or any value against `none` | `bool`, never `none` |

Equality is the one place absence does not spread. `none == none` is `true`, `none == 5` is `false` and `5 != none` is `true`, so `x == none` is a working test, the same as [[isNone()]].

That rule has a consequence worth seeing once. On bar 0, `dir[1]` is `none`, so `dir != dir[1]` is `true` there. The example guards the first bar so a flip is reported only between two real readings:

```openscript
dir  = close > open ? 1 : -1
flip = not isNone(dir[1]) and dir != dir[1]
if flip
    signal("FLIP")
plot(dir, "Direction")
```

| Comparing | Rule |
|---|---|
| Two values of different types | `OS2003` |
| Two colours | Equal when all four channels match |
| Two arrays, or two drawing objects | Equal only when they are the same one. [[arrayEqual()]] compares array contents |
| Two plot, fill or level handles | Not allowed |

## Logic

### `and`, `or`, `not`

`and` and `or` combine `bool` values with three-valued logic, where `none` means unknown. Both short-circuit: the right side runs only when it can still change the answer.

| `a` | `b` | `a and b` | `a or b` |
|---|---|---|---|
| `true` | `true` | `true` | `true` |
| `true` | `false` | `false` | `true` |
| `true` | `none` | `none` | `true` |
| `false` | any | `false` | `b` |
| `none` | `true` | `none` | `true` |
| `none` | `false` | `false` | `none` |
| `none` | `none` | `none` | `none` |

An unknown side is absorbed only when the other side settles the answer alone: a `false` under `and`, a `true` under `or`. Both operators give the same value with their sides swapped, so order never changes a result. Order does decide what runs:

| Expression | Left side is | Right side runs |
|---|---|---|
| `a and b` | `false` | No |
| `a and b` | `true` or `none` | Yes |
| `a or b` | `true` | No |
| `a or b` | `false` or `none` | Yes |

```openscript
// time[1] is absent on bar 0, but bar.isFirst is true there, so it is never read.
newDay = bar.isFirst or not date.isSameDay(time, time[1])
background(newDay ? fade(aqua, 90) : none)
```

A call that keeps state, such as [[ema()]] or a function holding a `var`, does not advance on a bar where it is skipped, and it is absent for that bar. The compiler warns with `OS8001`. Compute such a call on its own line first, then combine the results. `&&` and `||` do not exist; the operators are the words.

## The ternary

### `?` and `:`

**Form:** `cond ? a : b`. The condition is a `bool` or `none`. Both arms have the same type, or one arm is `none`; arms of different types are `OS2012`. Only the chosen arm runs. A `none` condition takes the second arm, the same rule as `if`.

```openscript
ema20 = ema(close, 20)
trending = ema20 > ema(close, 50)
plot(trending ? ema20 : none, "EMA 20 while trending", aqua)
```

The ternary is how you hide a plot on some bars: [[plot()]] is top level only, and wrapping it in an `if` is `OS3006`. It is also the place for a guard, such as a value you only want on some bars. Keep stateful calls out of the arms for the same reason as with `and` and `or`: an arm that is not chosen does not advance, and the compiler warns with `OS8001`.

## Assignment

Assignment is a statement, never an expression, so `if x = 5` is `OS1006` with the fix "write `==` to compare".

| Form | Means |
|---|---|
| `name = expression` | Declare the name in this scope, or update it if it already exists in an enclosing scope |
| `name += expression` | `name = name + expression` |
| `name -= expression` | `name = name - expression` |
| `name *= expression` | `name = name * expression` |
| `name /= expression` | `name = name / expression` |
| `name %= expression` | `name = name % expression` |

The compound forms obey every rule of the long form, including absence: `x += none` leaves `x` absent. A name's type is fixed by the first assignment that gives it a definite value, and assigning another type later is `OS2003`.

```openscript
version 1
study("Running volume")

var total = 0.0
total += orElse(volume, 0)      // one absent bar would otherwise make the total absent for good
plot(total, "Cumulative volume", silver, style = "area")
```

## What each operator does with `none`

| Operator | With an absent operand |
|---|---|
| Unary `-`, unary `+` | `none` |
| `*`, `/`, `%`, `+`, `-` | `none` if either side is absent |
| `+` on strings | `none` if either side is absent |
| `<`, `<=`, `>`, `>=` | `none` if either side is absent |
| `==`, `!=` | Never absent. `none == none` is `true` |
| `not` | `none` |
| `and`, `or` | See the three-valued table |
| `? :` condition | Takes the second arm |
| `? :` arm | Whatever the chosen arm gives, absent included |
| `src[n]` with `n` absent | `none` |

`none * 0` is `none`, not zero: the operand was unknown, not zero. One uniform rule means an absent value travels to the plot, where it draws a gap you can see, instead of turning into a number that looks right.

## Operators that do not exist

Each of these is refused when the script compiles. The table gives the error you see and what to write instead.

| Written | Error | Write instead |
|---|---|---|
| `!x` | `OS1001` | `not x` |
| `a && b`, `a \|\| b` | `OS1001` | `a and b`, `a or b` |
| `x ^ y`, `x ** y` | `OS1001` | `pow(x, y)` |
| `x++` | `OS1001` | `x += 1` |
| `x--` | `OS1022` | `x -= 1` |
| Bitwise `&`, `\|`, `~` | `OS1001` | Nothing; there are no bitwise operators in version 1 |
| `<<`, `>>` | `OS1008`, read as two comparisons | Nothing; there are no shift operators |
| `a < b < c` | `OS1008` | `a < b and b < c` |
| `a; b` on one line | `OS1007` | One statement per line |
| `{ ... }` | `OS1001` | Indentation. There are no braces |
| `/* ... */` | `OS1026` | `//` on each line |

## Functions that spell out an operator

Where an operator could be misread by a person, the library has a named function that says exactly what is meant.

| Function | Always means |
|---|---|
| [[history()]] | History, `n` bars back |
| [[element()]] | Element `i` of an array |
| [[pow()]] | Raise to a power |
| [[mod()]] | Remainder whose sign follows the divisor, unlike `%` |
| [[arrayEqual()]] | Arrays with equal contents, unlike `==` |
| [[isNone()]] | The same test as `x == none` |
| [[orElse()]] | The value when present, a fallback when absent |

## Index of marks

| Mark | Level | Means |
|---|---|---|
| `(` `)` | 1 | Grouping, or a call's arguments |
| `[` `]` | 1 | History, element access, or an array literal |
| `.` | 1 | Member of a namespace |
| `-` unary, `+` unary, `not` | 2 | Negation, identity, boolean not |
| `*` `/` `%` | 3 | Multiply, divide, remainder |
| `+` `-` | 4 | Add or join strings, subtract |
| `<` `<=` `>` `>=` | 5 | Ordering, absent if either side is. `<` and `>` also enclose the element type in `array<number>` |
| `==` `!=` | 6 | Equality, never absent |
| `and` | 7 | Conjunction |
| `or` | 8 | Disjunction |
| `?` `:` | 9 | The ternary. `:` also introduces a type annotation, as in `var x: number = 0` |
| `=` | Statement | Assignment. Also a named argument (`color = aqua`) and a parameter default (`len = 20`) |
| `+=` `-=` `*=` `/=` `%=` | Statement | Compound assignment |
| `,` | None | Separates arguments, elements and `case` values |
| `//` | None | A comment to the end of the line |
| `\` | None | Continues a statement on the next line |
| `=>` | None | Separates a function's parameters from its body |

Related: [Keywords](/script/reference/keywords), [Types](/script/reference/types), [Operators in the language guide](/script/language/operators), [Absent values](/script/language/absent-values), [Bars and history](/script/language/bars-and-history), [General functions](/script/reference/general).
