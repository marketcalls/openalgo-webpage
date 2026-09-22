---
title: OS3xxx Arguments
description: Every OS3 code, raised when a call is written wrongly where it stands, such as the wrong arguments, a value the parameter does not accept, a per-bar value where a fixed one belongs, or a call that must sit at the top level.
---

OS3xxx codes come from the checker, the `check` stage that runs before the first bar, and every one of them is about a call site: the way a function, a declaration, an input or `limits()` is called on one line. The script has parsed and its names resolve. What is wrong is the number of arguments, an argument's name, a value the parameter does not accept, or a call written somewhere it cannot be. Nothing has run yet.

A large part of this range protects the study's fixed shape. Before the first bar the chart builds the legend, the pane and its scale, the settings dialog and the list of plots, so everything that feeds them must be known before any data arrives: declaration options, a plot's title and style, every `input()`, the size and corner of a table. Per-bar values are welcome everywhere else, including a plot's colour.

## A script whose calls are all well formed

This study draws a Bollinger-style band on any chart, NIFTY futures or an NSE stock alike, and raises an alert on the bar where the close crosses above the upper edge.

```openscript title="Band breakout"
version 1
study("Band breakout", overlay = true, precision = 2)

len = input(20, "Length", min = 2)
mult = input(2.0, "Deviations")
showBand = input(true, "Show the band")

basis = sma(close, len)
dev = mult * stdev(close, len)

// Positional arguments first, named arguments after them.
upper = plot(showBand ? basis + dev : none, "Upper", aqua)
lower = plot(showBand ? basis - dev : none, "Lower", aqua)
plot(basis, "Basis", orange, width = 2)

// fill takes the two plot handles.
fill(upper, lower, color = fade(aqua, 88))

// Per-bar decisions use calls that may sit anywhere.
if crossUp(close, basis + dev)
    alert("Close above the upper band", id = "upperBreak")
```

A **handle** is what `plot()`, `plotCandles()`, `fill()` and `level()` return: a name for that part of the study, such as `upper` above, which [[fill()]] takes to find its two plots. Where each kind of call may be written:

| Call | May be written | Otherwise |
|---|---|---|
| `plot`, `plotCandles`, `fill`, `level`, `table` | At the top level only | [OS3006](#os3006) |
| `input` | At the top level only | [OS3007](#os3007) |
| `limits` | Once, as the first statement after the declaration | [OS3014](#os3014) |
| `signal`, `alert`, `background`, `barColor`, `cell`, `print`, the `draw` functions, order calls | Anywhere, including inside `if`, loops and functions | |

## Argument lists

Arguments are positional or named. Positional arguments come first, in the order of the signature; named arguments follow, in any order, using the parameter names the reference shows. Each parameter is filled once, and a parameter with a default may be left out.

{{error: OS3001}}

The call passes more arguments than the function takes. The fix prints the signature, with a `?` after each parameter that may be left out, so you can see what the function expects. A common cause is an argument that belongs to a neighbouring call, such as a plot's colour typed inside the indicator it plots: `plot(ema(close, 9, aqua), "EMA")` gives [[ema()]] three arguments. Move it to the call it belongs to. A call with too few arguments is [OS3012](#os3012) instead.

{{error: OS3002}}

Named arguments are matched against the parameter list by exact spelling, and a name that is not on the list would otherwise be silently ignored. The fix lists the names that exist and the closest one to what you wrote. Two frequent causes are British spelling (the parameter is `color`, not `colour`) and capitals: names are case sensitive, so `colorup` is not `colorUp`.

{{error: OS3005}}

Once an argument is named, the arguments after it must be named too, because their position no longer says which parameter they fill. Name the argument, or move it in front of the first named one.

{{error: OS3013}}

One parameter is filled twice, either by position and then by name, as in `ema(close, 9, len = 21)`, or by the same name written twice. Either way a reader cannot tell which value wins, so the call is refused. Delete the one you did not mean.

{{error: OS3012}}

A parameter with no default was left out, and there is no value the engine could sensibly invent for it. The usual ones are a title and a source: `study()` and `plot(close)` need a title, as in `plot(close, "Close")`, and an indicator needs its source, as in `rsi(close)` rather than `rsi()`. Most indicators need a length as well, as in `ema(close, 9)`; the reference shows which parameters have a default. The fix shows the call with its required arguments.

{{error: OS3011}}

The argument's type is not the one the parameter takes: text where a number goes, as in `ema(close, "9")`, a number where a title goes, or a number where a colour goes. Nothing converts on its own. The one allowance is that a plain value may be passed where a series is expected, and it is then read as that same value on every bar, which is why `crossUp(close, 22500)` works: the level 22500 becomes a series that is 22500 on every bar. Pass a value of the right type, or convert it with [[text()]], [[toNumber()]] or [[toBool()]].

## Values a parameter accepts

{{error: OS3004}}

Some arguments count things, so they must be whole numbers inside a fixed range: a table's rows and columns (1 or more), a cell's row and column (0 or more), a plot's `precision` (0 to 10) and `offset`, an [[rgb()]] channel (0 to 255), and a loop's `step`, which must not be 0 because that loop could never finish. When you write the number in the script, the checker tests it and refuses a fraction rather than rounding it, because 2.5 rows is a mistake in the script. Round a value you compute with [[floor()]] or [[round()]].

Only the arguments listed above are tested before the first bar. A whole number the script computes, such as the length in `sma(close, len / 2)`, is tested when the bar runs instead, as runtime error [OS4003](/script/errors/runtime#os4003). In version 0.5.0 that includes an indicator's length written as a number: `sma(close, 14.5)` compiles, and the study stops on its first bar with OS4003.

{{error: OS3008}}

The parameter takes one value from a fixed list, because each value selects a different behaviour, and the one written is not on the list. Without this check it would be ignored or replaced by a default without a word. The message lists every accepted value and suggests the closest. Common cases are a plot's `style` (`"line"`, `"step"`, `"histogram"` and others), a table's `position` (`"topRight"`, not `"top_right"`), and a strategy's `qtyType`, which is `"units"`, `"lots"`, `"cash"` or `"equityPercent"`: count NFO futures and options in `"lots"` and NSE cash shares in `"units"`. A strategy's `product` is `"intraday"` or `"overnight"`.

{{error: OS3010}}

Two arguments that set the same thing were both given, and any rule for choosing between them would surprise somebody, so the call is refused. On [[exit()]], a target is either an absolute `limit` price or a `profit` distance from the entry, and a stop is either an absolute `stop` price or a `loss` distance: give one of each pair, not both. On [[fill()]], a band takes one `color` for both sides, or `colorUp` and `colorDown` for each side, never both kinds. Keep the one you meant.

{{error: OS3019}}

`plot()`, `plotCandles()`, `fill()` and `level()` return a handle: a name for that part of the study, which [[fill()]] uses to find two plots. It is fixed before the first bar and is not an object you can change later. [[cell()]] and the drawing setters such as [[draw.setColor()]] take an object the script created while bars ran: a table, or a line, label, box or polyline.

To change a plot's colour bar by bar, give the plot call a per-bar colour: `plot(close, "Close", color = close > open ? lime : red)`. To draw something you can move or restyle later, create it with [[draw.line()]], [[draw.box()]] or [[draw.label()]]. This is the case of [OS3011](#os3011) for plot handles.

{{error: OS3020}}

`fill()` shades the area between two plots already on the chart, so its first two arguments are plot handles: the names you gave two `plot()` or `plotCandles()` calls. A bare expression such as `basis + dev` is not a plot, and neither is a `level()`. Plot both edges at the top level, name each one, and pass the two names, as the example at the top of this page does. See [Fills](/script/visuals/fills). This is the case of [OS3011](#os3011) for `fill()`.

## Fixed before the first bar

The chart builds a study's legend, pane, axis and settings dialog once, before the first bar runs. Everything that feeds them must be known at that moment: a literal such as `2`, arithmetic on literals such as `1 + 1`, or an [[input()]], which is read from the settings before the first bar. The reference marks each such parameter as fixed before the first bar in its parameter table.

| Written as | Accepted |
|---|---|
| `precision = 2` or `precision = 1 + 1` | Yes |
| `precision = input(2, "Decimals")` | Yes |
| `dp = input(2, "Decimals")`, then `precision = dp` | Yes |
| `var dp = 2`, then `precision = dp` | No, [OS3003](#os3003): a `var` can change on later bars |
| `precision = round(close / 1000)` | No, [OS3003](#os3003): it depends on the bar |
| `precision = input(2, "Decimals") + 1` | No. In version 0.5.0 this reports only [OS6018](/script/errors/data#os6018); put the arithmetic in the default instead: `input(3, "Decimals")` |

{{error: OS3003}}

The argument feeds something that is built before the first bar, and the value you wrote can change from bar to bar. This covers every option of `study()` and `strategy()`, a plot's title, width and style, a signal's `color`, `at` and `shape`, a table's title, size and corner, and an alert's `id`, `title` and `frequency`. Use a literal, or an `input()` so the user can change it in the settings dialog. A name assigned from an input works too, as in `dp = input(2, "Decimals")` followed by `precision = dp`, but a `var` does not, because a `var` can change on later bars. The table above shows each form.

The fix's sample input always uses 2 as its default; write the default that suits the option, such as `input(true, "Overlay")` for `overlay`. A plot's `color` is not on this list, so a colour chosen per bar is fine. In version 0.5.0 the console also shows [OS6018](/script/errors/data#os6018) on the same line, with a long technical message; it goes away when this error is fixed.

{{error: OS3006}}

`plot`, `plotCandles`, `fill`, `level` and `table` declare the fixed shape of the study: its columns, bands, horizontal lines and grids. The legend and the settings dialog list them before the first bar, so they cannot sit inside an `if`, a loop, a `switch` arm or a function body, where they would exist on some bars and not others. To show a plot on some bars only, keep it at the top level and give it `none` on the others: `plot(trending ? ema20 : none, "EMA 20", aqua)`. A plot draws a gap wherever its value is `none`.

The same code covers a drawing or an alert inside the expression of a [[req.timeframe()]] or [[req.symbol()]] read. That expression is evaluated on the other timeframe's or instrument's bars, where there is no bar of this chart to draw on. Read the value first, then draw or alert with it on the next line.

{{error: OS3007}}

Each `input()` is one row of the settings dialog, and the dialog exists before any bar runs, so a row cannot appear or vanish with the data, and a saved setting needs a row that is always there. Put every `input()` at the top level of the file, including the ones used only inside a function or an `if`, and read its name inside the block. See [Inputs](/script/inputs/inputs).

{{error: OS3009}}

Some options only mean something together. An alert with `frequency = "everyUpdate"` fires on every update of the bar that is still forming, but by default signals, alerts and orders act only on confirmed bars, so on its own that frequency would never have an update to fire on. Add `onUnconfirmed = true` to the declaration, or use the default frequency, `"oncePerBar"`. See [Realtime and confirmation](/script/language/realtime-and-confirmation).

{{error: OS3016}}

The `range` option of a declaration fixes the scale of the study's own pane, and it is written as two numbers in square brackets, the lower first: `range = [0, 100]` for an oscillator such as RSI. A reversed pair such as `[100, 0]`, a list with one number or two equal numbers leave no scale to draw. A bare number with no brackets, `range = 50`, is [OS3011](#os3011) instead.

## limits()

`limits()` sets two of the engine's budgets for one script: `loops`, the number of loop turns it may run on one bar, and `history`, how many past bars the engine keeps. See [Limits](/script/writing/limits).

{{error: OS3014}}

`limits()` is the first statement after the `study()` or `strategy()` declaration (blank lines and comments may sit between them), and it appears only once, so that anyone reading the file sees its budgets at the top. Move it up, and merge two calls into one: `limits(loops = 5_000_000, history = 5000)`.

{{error: OS3015}}

The engine sets aside room for these budgets before the first bar runs, so each one must be a number written out in full, such as `5_000_000`. Even arithmetic on numbers, such as `1000 * 1000`, is refused, and an `input()` is refused too, because a budget a settings dialog could change is a budget nobody can see by reading the script.

## Names and settings keys

Plots, levels, inputs and alerts are identified by name. The legend and the settings dialog label rows with them, saved settings are stored under them, and an alert subscription is kept under the alert's `id`. That is why each must be unique, and why an input needs a name or a title to be stored under. The rule is per kind: a plot and a level may share a title, but two plots may not.

{{error: OS3017}}

Two plots, two levels, two inputs or two alerts in one file share a name. Their rows in the legend and the settings dialog would be indistinguishable, and one would overwrite the other's saved settings. Two alerts with one `id` would leave a subscription attached to whichever of the two was kept. Rename one of them so each name appears once, such as `"EMA fast"` and `"EMA slow"`.

{{error: OS3018}}

An input with `options` is a dropdown, and its default is the entry selected when the settings dialog opens, so the default must be one of the options. Check the spelling and the capitals: `"Fast"` and `"fast"` are different strings. The options themselves are strings.

{{error: OS3021}}

An input written directly inside another call, rather than assigned to a name, has no name to store the user's setting under, so its title is used as its key as well as its label. That title must be a string written in quotes inside the call; a name holding a string does not count. Give it one, `input(2, "Precision")`, or assign the input to a name first and use the name.

{{error: OS3024}}

This is [OS3021](#os3021) with a title that is present but empty. An empty string can neither label the row nor serve as its key, and a second input written the same way would share that empty key. Give the title something to say. An input assigned to a name may have an empty title, because the name labels the row, so `len = input(14, "")` compiles.

{{error: OS3022}}

An input assigned to a name is stored under that name, and an input written in place is stored under its title. Here the title of one input spells the name of another, so both rows would share one stored setting and nothing would decide which row gets it. Give the in-place input a title of its own, or rename the other input. This is the case of [OS3017](#os3017) for settings keys.

## Orders

{{error: OS3023}}

An order call was given a `leg` argument, but the file declares no legs. A strategy with no legs trades exactly one instrument, the one on the chart, and every order acts on it, so a leg name there names nothing. Remove the `leg` argument. Declaring legs with `leg.fixed()` or `leg.relative()` for multi-leg option positions is planned and not available in version 0.5.0; see [Legs and books](/script/strategies/multi-leg-and-books).

**Related.** [Reading an error](/script/errors/overview), [Declarations](/script/reference/declarations), [Inputs](/script/inputs/inputs), [Plots](/script/visuals/plots), [Fills](/script/visuals/fills), [Limits](/script/writing/limits), [OS2xxx Names and types](/script/errors/names-and-types), [OS4xxx Runtime errors](/script/errors/runtime)
