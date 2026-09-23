---
title: OS1xxx Syntax errors
description: Every OS1 code, raised when the text of a script cannot be read as a program, from characters the language does not use to indentation, brackets and statements written in the wrong shape.
---

Syntax errors are the first thing the compiler looks for. They come from the two stages that run before anything else: the lexer (`lex`), which reads the characters of your file into words, numbers and symbols, and the parser (`parse`), which reads those into statements and blocks. An OS1xxx code means the text itself is not a program yet, so no name has been looked up, no bar has run and nothing has been drawn. The fix is always local: the line reported, or the line where the bracket or block it names was opened.

Most syntax errors come from three places. Text copied from a web page, a chat message or a document brings invisible spaces and curly quotes with it. Operators typed out of habit, such as `&&` or `!`, are spelled as words in OpenScript. And indentation is how the language marks a block, so a line one space out of place changes the structure.

## What well-formed code looks like

This study follows every layout rule on this page. It marks the high of the NSE opening range, the first fifteen minutes from 09:15 to 09:30, and signals the bar whose close first moves above it. Paste it into a new script to have a known-good reference beside your own.

```openscript title="Opening range breakout"
version 1
study("Opening range breakout", overlay = true)

// A comment runs from // to the end of its line.
var rangeHigh = none
inRange = session.isIn("0915-0930")
rangeStarts = inRange and not orElse(inRange[1], false)

// A block is the lines indented under its header, four spaces per level.
if rangeStarts
    rangeHigh = high
else if inRange
    rangeHigh = max(rangeHigh, high)

// An operator at the end of a line continues the statement on the next.
breakout = not isNone(rangeHigh) and close > rangeHigh and
        close[1] <= rangeHigh[1]

plot(rangeHigh, "Range high", orange)
if breakout
    signal("Breakout")
```

The rules it follows, and the code you get for breaking each one:

| Rule | Code when broken |
|---|---|
| `version 1` is the first line that is not blank or a comment | [OS1021](#os1021) |
| One statement per line, and no `;` anywhere | [OS1007](#os1007), [OS1018](#os1018) |
| Indent blocks with spaces, the same amount on every line of a block | [OS1002](#os1002), [OS1003](#os1003) |
| A header such as `if` has an indented body under it | [OS1010](#os1010) |
| A continued line is indented past the line its statement began on | [OS1028](#os1028) |
| Comments start with `//` | [OS1026](#os1026), [OS1001](#os1001) |
| Logic is written `and`, `or` and `not` | [OS1001](#os1001) |
| One comparison per expression | [OS1008](#os1008) |
| Every `(` and `[` is closed by its own kind of bracket | [OS1012](#os1012), [OS1013](#os1013) |

## Characters and literals

Outside strings and comments, the lexer accepts only plain ASCII letters and digits, the space, the newline and the language's own punctuation. Inside a string or a comment any character is fine, so `"Target ₹"` and `// rupee target` both work. When [OS1001](#os1001) refuses a character, its message names the replacement from this table:

| You wrote | Write instead |
|---|---|
| `!` | `not` |
| `&&` | `and` |
| `\|\|` | `or` |
| `^` or `**` | `pow(a, b)` |
| `++` | `a += 1` |
| `{` or `}` | indentation, which is how a block is written |
| A no-break space, an em space or another wide space | a plain space |
| A tab between two words on a line | a plain space |
| A curly quotation mark, single or double | a straight quote |
| A letter with an accent in a name | the plain ASCII spelling |
| `#`, `$` or `@` outside a colour | nothing: delete it, or move the text into a string |

{{error: OS1001}}

You typed a character that the language does not use outside a string or a comment. Often you cannot see it: a no-break space or a curly quotation mark arrives with code copied from a web page, a chat message or a document, and it looks exactly like a normal space or quote. The rest are operators typed out of habit, such as `!`, `&&`, `||`, `^`, `**` and `++`, or braces around a block. The message quotes the character and names the replacement. For an invisible or unusual character it also gives the Unicode number, such as U+00A0, and for spaces, tabs and quotation marks a name such as "a no-break space". A tab at the start of a line is [OS1002](#os1002) instead.

When the character is invisible, delete the text around the reported column and type it again by hand. For a pasted string, retyping its two quotes is usually enough. A `#` typed to start a comment lands here too: comments start with `//`.

{{error: OS1027}}

A `#` followed by hexadecimal digits is a colour, and it needs exactly six digits, as in `#ff8800`, or eight, where the last two set the transparency, as in `#ff880080`. The short forms `#fff` and `#ff88` are not accepted, and neither is a character outside `0` to `9` and `a` to `f` (capitals `A` to `F` are fine). Because the colour is dropped from the line, the console usually shows [OS1022](#os1022) beside this error; correcting the colour clears both. If hex digits are not what you want, a named colour such as `orange` or [[rgb()]] says the same thing.

This is the case of [OS1001](#os1001) for colours. It has its own code because deleting the `#`, the advice OS1001 gives, would throw away a colour you nearly had right.

{{error: OS1029}}

A name cannot start with a digit, and a number cannot have letters attached to it. The usual causes are a variable called something like `2fast`, a unit typed after a quantity (`10k`, `5m`), a binary or octal literal (`0b1011`, `0o17`), and an underscore at the end of a number (`1_000_`). Numbers are written in decimal, such as `1_000_000` or `2.5e-4`, or in hexadecimal with `0x`, and an underscore may only sit between two digits.

Rename the variable so it starts with a letter (`fast2`), and write quantities in full: `10000`, not `10k`. When you meant a number followed by a name, put an operator between them.

{{error: OS1004}}

A string opens and closes on the same line, with the same kind of quote: `"BUY"` or `'BUY'`. This error is reported at the opening quote when the line ends before a matching one, which almost always means the closing quote is missing. The unclosed string also swallows the `)` of the call it sits in, so [OS1012](#os1012) usually appears beside it and goes away when the quote is added.

A string cannot span lines. To build a long message, close each piece and join them with `+`, ending the line with the `+` so the statement continues.

{{error: OS1005}}

Inside a string, a backslash starts an escape sequence: `\n` for a new line, `\t` for a tab, `\r`, `\0`, `\\` for a backslash, `\"` and `\'` for quotes, and `\u` followed by exactly four hexadecimal digits for any character, such as `\u20b9` for the rupee sign. A backslash followed by anything else is refused rather than guessed at. It most often comes from a file path or a pattern pasted with single backslashes: write each backslash as `\\`.

{{error: OS1026}}

OpenScript has line comments only: `//` starts one and it runs to the end of the line. `/*` and `*/` are not comment markers, so the compiler reports them where they sit instead of letting an unclosed comment hide the rest of the file. To comment out several lines, put `//` at the start of each one.

{{error: OS1007}}

A statement ends at the end of its line, so there is nothing for a semicolon to do, and a semicolon at the end of a line is refused as well as one between two statements. Delete it, and give each statement a line of its own.

## Indentation and blocks

A block is the lines indented under a header: `if`, `else`, `for`, `while`, `switch`, `case`, `default`, or a function whose body starts on the next line. The block ends at the first line indented as far as its header, or less. Indent with spaces, four per level by convention. Blank lines and lines that hold only a comment never affect a block, so they may sit at any indentation.

{{error: OS1002}}

The line is indented with a tab. A tab is drawn at a different width in every editor, so a block marked with tabs could mean one thing on your screen and another on someone else's, and the language accepts spaces only. In the /trading editor the Tab key indents with four spaces and never types a tab, so a tab almost always arrives in pasted code. Replace each leading tab with four spaces.

{{error: OS1003}}

Every line of one block must start at exactly the same column, and a single space more or less counts. The message says how many spaces this line has, how many its block has, and which line opened the block. Line it up with the lines above it to keep it in the block, or with the header to end the block there.

A continued statement, one that carries on from the line above because of an open bracket or a trailing operator, follows a different rule: see [OS1028](#os1028).

{{error: OS1028}}

A statement continues onto the next line when a bracket is still open, when the line ends with an operator, a comma, `?`, `:` or `=`, or when it ends with a backslash. The continued line must be indented further than the line the statement began on, so that nobody reading the file can mistake it for a new statement. Indent it; any amount deeper than the first line works, and lining it up under the opening bracket reads well.

This is the case of [OS1003](#os1003) for continued lines. It has its own code because a continuation opens no block, so the block rule's message would describe a block that is not there.

{{error: OS1010}}

A header line promises an indented body, and the next line is not indented more deeply. This is nearly always a body that lost its indentation when it was pasted. Indent the body under the header.

`if`, `else`, the loops, `case` and `default` have no one-line form, so even a body of one statement goes on its own indented line. A function can be written on one line by putting its body after `=>`: `fn barRange() => high - low`. Blank and comment lines do not count as a body.

{{error: OS1016}}

An `else` belongs to the `if` at exactly its own indentation. At any other indentation there is no `if` for it to pair with, and the compiler does not guess which one you meant. Line the `else` up with its `if`. An `else if` is written as two words on one line and is not indented further than the `if`.

An `else` with no `if` above it at all, such as one written after a `for` block, is reported the same way. When the `else` is indented by a stray space or two, [OS1003](#os1003) usually appears on the same line; lining it up clears both.

## Brackets and expressions

{{error: OS1012}}

An open `(` or `[` carries the statement onto the following lines, so when its closer is missing the compiler reads everything after it as part of one long statement. The error is reported at the opening bracket, which is where to look. It usually brings a crowd of other errors from the lines below, such as a continuation that is not indented or a missing comma; add the closer and they go with it. [Reading an error](/script/errors/overview#working-through-a-list-of-diagnostics) shows one missing bracket producing six diagnostics.

{{error: OS1013}}

A call closes with `)`, and a history index or an array closes with `]`. This error means a bracket was closed with the other kind, such as `sum(values]` or `close[1)`. The message names the bracket it found, the one it expected and the line the opener is on. Change the closer to match its opener.

{{error: OS1014}}

Two values sit side by side inside a call with no comma between them. It usually comes from editing a call: a comma deleted by accident, as in `plot(ema(close, 9) "EMA", aqua)`, or a named argument added without one, as in `plot(close, "C" color = aqua)`. Put the comma back. The compiler reports it rather than guessing where the comma should go.

{{error: OS1022}}

A line ends with something that needs more after it (an operator, a comma, `=` or an opening bracket) and nothing usable follows. It is usually a half-finished edit, or a stray `+` or `,` left at the end of a line. Supply the missing value, or delete the trailing symbol.

It also appears beside another error on the same line when that error removed part of the expression, as with a malformed colour ([OS1027](#os1027)). Fix the other error first.

{{error: OS1015}}

The conditional operator, `condition ? a : b`, always produces a value, so it needs both of its arms. A one-armed version is usually a plot meant to draw on some bars only. Use `none` for the arm that should draw nothing: `plot(ready ? value : none, "Value", aqua)`. A plot draws a gap wherever its value is `none`.

{{error: OS1008}}

`30 < r < 70` reads naturally, but it can be read two ways, and a language that places orders does not guess. An expression holds at most one comparison, and that applies to `==` and `!=` as much as to `<` and `>`. Split it with `and`, writing the middle value twice: `30 < r and r < 70`.

The console usually shows [OS2003](/script/errors/names-and-types#os2003) on the same line as well, because the first comparison produces a `bool` and the second then compares that `bool` with a number. Splitting the comparison clears both.

{{error: OS1018}}

The compiler finished reading a statement and found more on the same line. Either an operator is missing between two values (`x = close open`), there is one closing bracket too many (`ema(close, 9))`), or two statements share a line. Add the operator you meant, delete the extra bracket, or move the second statement to its own line.

{{error: OS1006}}

`=` stores a value and `==` compares two. A condition needs a comparison, so `if len = 14` is refused instead of quietly storing 14 and treating the test as true. The same applies to a `while` condition. Write `==`, or, if you did mean to store a value, do it on its own line above the `if`.

## Statements and names

{{error: OS1009}}

`break` leaves the innermost `for` or `while` loop, and `continue` skips to its next pass. Outside a loop body there is nothing for either to act on. To leave a function early, use `return`. To skip some work on some bars, put that work under an `if`; plots stay at the top level and take `none` on the bars they should skip.

{{error: OS1011}}

`var` declares a value that keeps its content from one bar to the next, and its starting value is part of the declaration, so no bar can ever read it empty by accident. Write `var total = 0` to start from zero, or `var runningHigh = none` to start with no value and fill it on a later bar. See [Persistence](/script/language/persistence).

{{error: OS1017}}

`case` and `default` are the arms of a `switch` and exist only inside one, indented under it. `default` catches everything the cases above it did not, so it must be the last arm: a `case` after it could never run. Move the arms under their `switch`, with `default` at the bottom.

{{error: OS1019}}

Reserved words belong to the language and cannot name a variable, a function or a function parameter. The ones people reach for most often are `color`, `step`, `type`, `in` and `number`. A few, such as `type`, `map` and `import`, are reserved for features planned for later versions, so that adding those features cannot break a script written today. The fix suggests a name that keeps your meaning, such as `colorValue`. The full list is on [Keywords](/script/reference/keywords).

A named argument label is not a variable, so `plot(x, "X", color = aqua)` is fine. Writing `bool(x)` or `number(s)` to convert a value lands here too, because the conversions are [[toBool()]] and [[toNumber()]].

{{error: OS1020}}

A `for` loop has two forms and no others. A counted loop names a start and an end, `for i = 0 to 9`, optionally followed by `step`, and runs with both ends included. A loop over an array names the array, `for price in prices`. A comma between the bounds, or a header with no `to`, is this error. See [Control flow](/script/language/control-flow).

{{error: OS1021}}

`version 1` must be the first line of the file, above the `study()` or `strategy()` declaration. Only blank lines and comments may come before it. The version is read before anything else so that the script is always compiled by the right version of the language. Move the line to the top.

{{error: OS1023}}

Functions are declared at the top level of the file, never inside an `if`, a loop, a `switch` arm or another function. Move the whole `fn` declaration out to the top level and call it from inside the block. A function may be called on a line above its declaration, so it can sit anywhere at the top level. See [User functions](/script/language/functions).

{{error: OS1024}}

There is no assignment into brackets. On an array, change an element with [[set()]]: `set(prices, 0, close)`. On a series such as `close`, `[1]` reads a bar the engine has already computed, and a past bar can never be rewritten. If you want a value of your own, assign it to a plain name.

{{error: OS1025}}

A dot reads a member of a namespace such as `chart`, `bar` or `session`, and every member is a fact supplied by the library, the instrument or the position. A script cannot write to any of them, and version 1 has no user-defined records whose fields you could set. Assign the value to a plain name of your own: `tick = 0.05`, not `chart.tickSize = 0.05`. When the member does not exist either, [OS2009](/script/errors/names-and-types#os2009) appears beside this error, as it does for the example below: `chart` has a `tickSize` member, not `tickStep`.

**Related.** [Reading an error](/script/errors/overview), [Script structure](/script/language/script-structure), [Keywords](/script/reference/keywords), [Operators](/script/language/operators), [Control flow](/script/language/control-flow), [OS2xxx Names and types](/script/errors/names-and-types)
