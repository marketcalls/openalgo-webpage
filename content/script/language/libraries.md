---
title: Libraries
description: Sharing code between scripts. What works in this release, one file with portable helpers and a canonical copy with a revision header, and the design for import, which is planned and not yet available.
---

Sooner or later you write a helper, a band calculation or a trailing stop, that you want in more than one script. This page covers how to share code between OpenScript files. In this release there is no `import`: every function a script calls is either in the standard library or declared in that same file. So the page has two halves. The first is what to do today, which is real work with a real payoff: organise a script so its helpers are portable, and share them as a canonical copy with a revision header. The second is the design for libraries and `import`, written down now so that the way you organise scripts today survives it.

## Where the language stands today

| Thing | Status in this release |
|---|---|
| One file, one `study()` or `strategy()` declaration | How every script works |
| `fn` at the top level of that file | The unit of reuse |
| `import` of another file | Planned. A reserved word, not implemented |
| `as`, for naming an import | Planned. A reserved word, not implemented |
| `type`, for a record a library could return | Planned. A reserved word, not implemented |

Writing `import` today is error [OS1019](/script/errors/syntax#os1019), which says the word is reserved rather than unknown. That difference is deliberate: it tells you the gap is known and named.

```openscript expect=OS1019
import = "bands"
```

## A first example: one file, organised to be split

A long script falls naturally into three regions: the declaration and inputs, the helpers, and the per-bar body that uses them. Keeping them in that order, with the helpers in one block, costs nothing and turns any later extraction into moving lines rather than rewriting them.

```openscript title="Squeeze"
version 1
study("Squeeze", overlay = true, precision = 2)

// Inputs

len     = input(20, "Basis length", min = 2, max = 500)
mult    = input(2.0, "Deviation multiple", min = 0.5, max = 5)
atrLen  = input(10, "ATR length", min = 1, max = 200)
atrMult = input(1.5, "ATR multiple", min = 0.5, max = 5)

// Helpers
// Each takes what it needs as arguments and reads nothing from the file,
// so any one of them could move to another script unchanged.

// [basis, upper, lower]. First value at bar n - 1, the warmup of sma and stdev.
fn deviationBands(src, n, k) =>
    mid   = sma(src, n)
    width = k * stdev(src, n)
    [mid, mid + width, mid - width]

// [basis, upper, lower]. First value at bar max(n, aLen) - 1.
fn rangeBands(src, n, aLen, k) =>
    mid   = ema(src, n)
    width = k * atr(aLen)
    [mid, mid + width, mid - width]

// True when the first band pair sits inside the second. Absent while either
// pair is still warming up, which is the honest answer then.
fn inside(a, b) => element(a, 1) < element(b, 1) and element(a, 2) > element(b, 2)

// Body

dev = deviationBands(close, len, mult)
rng = rangeBands(close, len, atrLen, atrMult)

squeezed = inside(dev, rng)

upper = plot(dev[1], "Upper", aqua)
lower = plot(dev[2], "Lower", aqua)
plot(dev[0], "Basis", orange, width = 2)
fill(upper, lower, fade(aqua, 90))

background(squeezed ? fade(yellow, 90) : none)

if squeezed and not squeezed[1]
    signal("SQUEEZE")
```

Everything in the helpers block could be pasted into another file with no edits, because none of it mentions `len`, `mult`, `atrLen` or `atrMult`. (The one catch is a clash of local names, covered in the next section.) Each helper returns several values as one array, the same convention the standard library uses for [[bollinger()]] and [[macd()]]; [Collections](/script/language/collections) covers reading them.

## The test: does the helper need the file?

Read the body of a helper and ask whether every name in it is a parameter, a local, or a standard library name. If one is not, the helper belongs to this file and cannot move.

```openscript
len = input(20, "Length", min = 2, max = 500)

// Legal, and stuck here. It reads len from the file, so it means something
// different in a file where len means something else, and nothing at all in
// a file with no len.
fn basisHere(src) => sma(src, len)

// Portable. Everything it needs arrives through the call.
fn basisOver(src, n) => sma(src, n)

plot(basisHere(close), "Basis, file length")
plot(basisOver(close, 50), "Basis, 50 bars")
```

The language allows the first form, because a function body is a scope nested inside the file, and it is sometimes fine for a throwaway helper in a short script. It costs three things: the function can no longer be understood from its own text, it cannot be tested on its own, and it cannot be moved. A parameter costs a few characters.

**Local names travel with the helper.** A name declared inside a function body may not also be declared at the top level of the same file, before or after the function, because there is never a second variable with the same name. So a helper whose body declares `mid` cannot be pasted into a file that already has a top-level `mid`: that is error [OS2002](/script/errors/names-and-types#os2002).

```openscript expect=OS2002
fn deviationBands(src, n, k) =>
    mid   = sma(src, n)
    width = k * stdev(src, n)
    [mid, mid + width, mid - width]

mid = hl2
plot(deviationBands(close, 20, 2)[1] - mid, "Upper band distance")
```

Two helpers may use the same local names as each other, so the fix is on the consuming side: rename the file's own name, or give the helper's locals names a consuming script is unlikely to use.

The same test rules out a few other shapes:

| A helper that | Cannot move freely, because |
|---|---|
| Calls [[input()]] | `input` is top level only, so it is already error [OS3007](/script/errors/arguments#os3007) inside a function |
| Calls [[plot()]], [[fill()]], [[level()]] or [[table()]] | These are top level only too ([OS3006](/script/errors/arguments#os3006)): the study's fixed shape is built before bar 0 |
| Calls [[signal()]], [[background()]] or [[barColor()]] | Legal anywhere, but now it paints the consuming script's chart, which is that script's decision |
| Places an order | Only a `strategy()` file may, so the helper cannot be used in a study ([OS7001](/script/errors/orders#os7001)) |
| Reads [[chart.symbol]] or another instrument fact and branches on it | Portable, but it behaves differently per chart, which has to be documented |

A helper that computes and returns is portable. A helper that draws or trades is part of a particular script.

## Sharing a block between scripts today

With no `import`, sharing means copying, and copies drift apart. The discipline that keeps that manageable is small.

Keep one canonical copy of the block in a script of its own in the Scripts panel, and give the block a header saying what it is and which revision this copy is:

```openscript
// bands, revision 4
// Canonical copy: the "bands" script in the Scripts panel.
// Changed in 4: rangeBands takes the ATR length separately from the basis
// length. A call written for revision 3 passes one length and now gets the
// wrong second band, so check your call sites.

fn deviationBands(src, n, k) =>
    mid   = sma(src, n)
    width = k * stdev(src, n)
    [mid, mid + width, mid - width]
```

{{screen: scripts-panel}}

Then every script that uses the block carries the same header, and one look tells you whether it is behind:

```openscript title="Deviation bands"
version 1
study("Deviation bands", overlay = true, precision = 2)

len  = input(20, "Basis length", min = 2, max = 500)
mult = input(2.0, "Deviation multiple", min = 0.5, max = 5)

// bands, revision 4
// Canonical copy: the "bands" script in the Scripts panel.

fn deviationBands(src, n, k) =>
    mid   = sma(src, n)
    width = k * stdev(src, n)
    [mid, mid + width, mid - width]

// Body

b = deviationBands(close, len, mult)

up = plot(b[1], "Upper", aqua)
dn = plot(b[2], "Lower", aqua)
plot(b[0], "Basis", orange, width = 2)
fill(up, dn, fade(aqua, 92))
```

Be honest about the cost. A copy is a fork: a bug fixed in the canonical script is not fixed in the six scripts that copied it, and nothing in the language will tell you. Two habits keep it manageable. Copy blocks that are small and stable rather than large and changing, and write the revision in the header every time, because a header that is sometimes missing is a header nobody trusts. The Scripts panel keeps no revision history in this release, so the header is the only record of which copy is which; [The editor](/script/getting-started/the-editor) covers saving and backups.

## State stays with the caller

A helper may hold a `var`, and may call stateful library functions such as [[ema()]] or [[cum()]]. Wherever the helper lives, **its state is allocated per call site, in the script that calls it**:

```openscript
// A trailing low that only ratchets upward.
fn trailingLow(src) =>
    var trail = none
    trail = isNone(trail) ? src : max(trail, src)
    trail

fast = trailingLow(low)        // one trailing level
slow = trailingLow(low[5])     // a second, independent one

plot(fast, "Trail on this low")
plot(slow, "Trail on the low 5 bars back")
```

The two calls have two independent trailing levels, and two different scripts on the same chart have their own again. So a helper author can write a stateful helper without asking who else calls it, and a caller can use one twice without the calls interfering. [User functions](/script/language/functions) explains the rule.

Two things follow for anyone writing a shared helper. Never describe a function as though there is one of it: if it counts something, it counts per call site. And never write a helper whose correctness depends on being called on every bar, because a caller will put it inside a branch, its state will advance only on the bars the branch runs, and the compiler will warn with [OS8001](/script/errors/warnings#os8001).

## What a library will be

:::note Planned
Nothing in this section compiles in this release. What is already fixed is the set of reserved words and the compatibility promise. The spelling below is the intended shape, not a final specification, written down so that the way you organise scripts today is the way you will organise them then.
:::

A library is a file with a declaration of its own that exports functions. A script imports it under a name and calls through that name:

```text
// Planned: a library file. Not valid in this release.

version 1

library("bands", version = "1.2.0")

// Exported: part of the published surface, and bound by the versioning rules.
export fn deviationBands(src: series number, n: number, k: number = 2) =>
    mid   = sma(src, n)
    width = k * stdev(src, n)
    [mid, mid + width, mid - width]

// Not exported: private to the library, free to change in any release.
fn midpoint(a, b) => (a + b) / 2
```

```text
// Planned: a script that uses it. Not valid in this release.

version 1

study("Bands", overlay = true, precision = 2)

import "bands@1.2.0" as bands

b = bands.deviationBands(close, 20, 2)
plot(b[0], "Basis", orange)
```

Three properties of that design follow from decisions the language has already made:

- **The import names the version.** A script that did not pin a version would have its numbers changed by somebody else's edit.
- **The import binds a name, and calls go through it.** `bands.deviationBands` is a namespace member, the same shape as `math.pi` and `session.isFirstBar`, so the dot keeps its one meaning. Two libraries can export the same function name without colliding, and a reader sees which library a line depends on without scrolling to the imports. Because a library's names sit behind its own name, the local-name clash described above goes away for imported code.
- **A library has its own declaration.** A file carries exactly one declaration, and a library is not a study: it declares no inputs, plots nothing and trades nothing.

### What may be exported

| Exportable | Why |
|---|---|
| A function | The unit of reuse, and the only thing a caller can call |
| A function returning several values as an `array<number>` | Already the convention throughout the standard library |
| A constant, written as a function with no arguments | Nothing else can carry a value across a file boundary |

| Not exportable | Why not |
|---|---|
| An [[input()]] | Inputs build the settings dialog of a study before bar 0. A library adding rows to a dialog it does not own would make the caller's settings unpredictable from the caller's own source |
| A `plot`, `fill`, `level` or `table` | The chart surface belongs to the calling study: its legend, its axis, its saved layout |
| An order | Only a strategy trades, and a library that placed orders would be trading from a file the strategy's author did not read |
| A file-level `var` | State shared between unrelated callers would make one script's numbers depend on whether another ran first |

The line through all four is the same: a library computes, and the caller decides what to do with the answer. That is what makes a library safe to use by reading its signature rather than its body.

### Versioning

A library version is a promise about what a caller's numbers will do, the same promise the language makes about itself: a script that compiled and produced a number keeps compiling and producing that number.

| Change | Version part to raise | Why |
|---|---|---|
| Add a new exported function | Minor | Nothing a caller already uses has moved |
| Add an optional parameter, with a default, at the end | Minor | Every existing call means what it meant |
| Improve the implementation with identical output | Patch | Nothing observable changed |
| Fix a comment or documentation | Patch | The same |
| Add a required parameter | Major | Every existing call breaks at compile time |
| Reorder parameters | Major | Positional calls keep compiling and silently change meaning |
| Rename a parameter | Major | Named calls break |
| Change a default value | Major | A call relying on the default changes its numbers with no edit |
| Change the arithmetic so a result differs | Major | A chart that redraws itself after an update is worse than one that is slightly off in a documented way |
| Change a warmup length | Major | The caller's plot starts on a different bar, and any guard on absence behaves differently |
| Remove a function | Never | Deprecate it instead |

Much of that table is about changes that keep compiling. A change that breaks the build costs an afternoon. A change that compiles and moves the numbers is a strategy that traded differently with nobody knowing why, which is why reordering a parameter or changing a default is treated as seriously as removing a function.

### A published version never changes

**Once a library version is published, its contents never change. To change anything, publish a new version.**

A backtest is only evidence if it can be run again and give the same answer. A library version that could be edited after publication would break that: a script pinned to the same version would give different numbers on Tuesday than on Monday, with nothing in the script itself to explain it. A caller who pinned `1.2.0` reviewed `1.2.0`, and can go on trusting that review for as long as the pin stands.

In practice:

- Publishing is one way. There is no edit; a correction is a new version.
- Withdrawing a version may mark it as unsafe, but does not alter it, because something running may be pinned to it.
- A version number is a name, not a ranking. `1.2.1` does not replace `1.2.0`; it sits beside it, and a caller moves when the caller decides to.

### Deprecating instead of removing

The language never removes a construct that turns out to be a mistake: it keeps working, the compiler warns and names the replacement, and it is still there several versions later. A library is meant to behave the same way:

```text
// Planned. Not valid in this release.

// Deprecated in 2.1.0. Use bandsWithSource, which takes the source explicitly
// instead of assuming close. This function keeps working and keeps returning
// the numbers it always returned.
export fn bands(n, k) => bandsWithSource(close, n, k)
```

The old function stays, written in terms of the new one so the two cannot drift apart. A caller sees a warning and moves when they have time, rather than on a day when a deployed strategy is holding a position.

## Writing helpers a stranger can rely on

These habits make a shared block safe today and a library easy later:

| Do | Because |
|---|---|
| One concern per block | A caller copies what they use, and a revision touches the scripts it actually affects |
| State each function's first value in a comment above it | The caller's plot starts where your warmup says; see [Warmup](/script/language/warmup) |
| State what the function does with an absent input | Absence carries through by default; if yours does something else, that is news |
| Return several values as one array with a documented order | Three functions would be three call sites computing the shared work three times |
| Keep the surface small | Everything you share is a promise you keep for years |
| Write example calls in a comment | They double as the checks you want when you change the implementation |

| Do not | Because |
|---|---|
| Read instrument facts silently | The function behaves differently per chart and the caller cannot see why |
| Draw, paint, signal or alert | That is the caller's chart, and the caller's decision |
| Keep state that assumes one caller | A call site can be anywhere, including inside a loop or a branch |
| Use short, common local names | Until `import` exists, a helper's locals must not clash with the caller's top-level names |

## What is decided and what is not

| Decided | Meaning for you |
|---|---|
| `import`, `as` and `type` are reserved in version 1 | Using one as a name is an error today, so adding the feature later cannot break your script |
| A script that compiles under `version 1` keeps compiling and producing the same numbers | Nothing you write today breaks when libraries arrive |
| A construct that turns out to be a mistake is deprecated, never removed | The same |
| State is allocated per call site | A stateful helper stays reusable wherever it lives |

| Not decided | Note |
|---|---|
| The spelling of the library declaration, `export` and `import` | The sketches above are intent, not specification |
| How a library is named and where the application running a script finds it | A path, a name and a version, or some mix |
| Whether a library may export a type once `type` exists | Open |

Write your helpers to take parameters and return values, keep them in one block with a header, and none of the open questions can cost you a rewrite.

**Related.** [User functions](/script/language/functions), [Collections](/script/language/collections), [Objects and methods](/script/language/objects-and-methods), [Warmup](/script/language/warmup), [Variables and scope](/script/language/variables-and-scope), [Sharing scripts](/script/writing/sharing-scripts), [Style guide](/script/writing/style-guide)
