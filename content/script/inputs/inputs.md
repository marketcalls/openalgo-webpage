---
title: Inputs
description: Exposing settings with input(), covering every kind of value, the control each one becomes in /trading, bounds, defaults, saved values and the rules the compiler enforces.
---

An input turns a number, a colour or a choice written in your script into a setting a reader can change without opening the source. Every [[input()]] call in an OpenScript (also called OpenAlgo Script) file becomes one row of the study's settings dialog in /trading, and one field in the Backtest and Strategies panels when the script is a strategy. This page covers every kind of input, the control each one becomes, how bounds and defaults protect the calculation, how saved values are kept, and what the compiler refuses.

```openscript title="Simple average"
version 1

study("Simple average", overlay = true, precision = 2)

len = input(20,    "Length", min = 2, max = 500)
src = input(close, "Source")

plot(sma(src, len), "Average", aqua, width = 2)
```

Two lines of inputs, two rows in the settings dialog, and a study that works on any instrument at any interval without anyone editing it.

{{screen: study-settings}}

## One call, three things

Each `input()` call does three things at once:

1. It assigns a name the script reads, exactly like any other assignment.
2. It builds one row of the settings dialog.
3. It names a slot where the reader's value is kept, so a value they typed comes back when they open /trading tomorrow.

**The default comes first, before the title, and it fixes the input's type.** `input(20, ...)` is a number input because `20` is a number, and `input(true, ...)` is a tick box because `true` is a bool. There is no type argument to get wrong.

**The title is the second argument.** It is the row's label. If you leave it out, the row is labelled with the variable's name, so write one anyway: `len` is a fine name in source and a poor label in a dialog. Write the title as a string literal on the line. The compiler reads it from there and does not evaluate expressions to build it, so a title such as `"Length " + "(bars)"` is ignored and the row falls back to the variable's name.

## The kinds, and the control each becomes

There is one function. The kind of control follows the type of the default, and a `kind` argument separates the kinds that share a string default.

| Written as | Kind | The script gets | In the /trading settings dialog |
|---|---|---|---|
| `input(14, "Length")` | number | `number` | A number box with up and down arrows |
| `input(true, "Show the band")` | switch | `bool` | A tick box |
| `input("note", "Label text")` | text | `string` | A text box |
| `input("ema", "Average", options = ["sma", "ema"])` | choice | `string` | A menu of the listed values |
| `input(aqua, "Band colour")` | colour | `color` | A colour swatch |
| `input(close, "Source")` | source | `series number` | A menu of price series |
| `input("1h", "Bias interval", kind = "interval")` | interval | `string` | A menu of intervals |
| `input("2025-01-01 09:15", "Anchor", kind = "time")` | time | `number` | A text box for a date and time |

Three more kinds are planned and not in this version: `kind = "symbol"` (an instrument picker), `kind = "price"` (a price set by clicking the chart) and `kind = "session"` (two clock fields). Writing one is refused:

```openscript expect=OS2001
window = input("0915-1530", "Trading window", kind = "session")
plot(close, "Close")
```

Until they arrive, use a text input and check what you get: a symbol as text for [[req.symbol()]], a window as text for [[session.isIn()]].

### Number

The workhorse. `min`, `max` and `step` shape the control.

```openscript
atrLen = input(14,   "ATR length",     min = 1,   max = 200, step = 1)
mult   = input(3.0,  "Band, in ATR",   min = 0.5, max = 20,  step = 0.1)
risk   = input(5000, "Risk per trade, in rupees", min = 1)
plot(atr(atrLen) * mult, "Band width")
plot(risk, "Risk")
```

In the settings dialog, the arrows beside the box move the value by `step` (1 when you give none) and stop at `min` and `max`. You can also type a value. `step` does not restrict what is typed: a multiplier with `step = 0.1` still accepts `2.35`.

Give `min` and `max` to every number that feeds a length. A length must be a whole number of 1 or more, and a fractional or zero length is refused rather than rounded, because a length of 14.5 is a bug. A typed value outside the bounds is refused when the study runs, with OS6019 naming the setting and the bound, so the calculation never sees it.

### Switch

A bool default renders as a tick box. Use it for the optional half of a study.

```openscript
showBand = input(true,  "Show the band")
paint    = input(false, "Recolour the candles")

basis = sma(close, 20)
upper = basis + 2 * stdev(close, 20)

plot(showBand ? upper : none, "Upper band", aqua)
barColor(paint ? (close > basis ? lime : red) : none)
```

Notice what the switch controls: the drawing, not the calculation. A `plot` cannot sit inside an `if` (OS3006), so a switch hides a plot by giving it the absent value `none`, which draws a gap. And a switch must not skip a stateful call such as [[sma()]], because a call that does not run on a bar does not advance its state, which is warning OS8001 and a broken line. Compute at the top level, then let the switch decide what is drawn.

### Text

A string default with no `options` and no `kind` is a text box: the right control for a label, a note on a drawing, or an instrument symbol until the picker arrives.

```openscript
benchmark = input("NIFTY", "Benchmark symbol")
bench = req.symbol(benchmark, chart.interval, close, exchange = "NSE_INDEX", mode = "developing")
plot(close / bench, "Relative strength")
```

### Choice

Add `options` and the same string default becomes a menu. The options are strings, and the default has to be one of them, or the dialog would open with nothing chosen (OS3018).

```openscript
maType = input("ema", "Average type",
               options = ["sma", "ema", "wma", "rma", "hma", "vwma"])

basis = ma(close, 20, type = maType)
plot(basis, "Basis")
```

[[ma()]] exists so that a choice can switch the shape of a study without a `switch` over six branches. A list of numbers is refused (OS3011), so offer numbers as strings and convert them with [[toNumber()]].

### Colour

A colour default renders as a colour swatch that opens the browser's colour picker.

```openscript
upColor   = input(lime, "Rising colour")
downColor = input(red,  "Falling colour")

hist = macd(close, 12, 26, 9)[2]
plot(hist, "Histogram", hist > 0 ? upColor : downColor, style = "histogram")
```

The swatch has no opacity control, so a colour chosen there keeps the transparency the script's default had. Declare a colour input when the colour carries meaning the reader may want to restate, such as a long side against a short side. For a line whose colour is only decoration, you do not need one: the Style tab already lets the reader recolour every plot. [Settings and style](/script/inputs/settings-and-style) explains how a colour input and a plot's Style colour become one setting.

### Source

A price series default renders as a menu of price series, and the script gets a series it uses exactly like [[close]].

```openscript
src = input(hlc3, "Source")
plot(ema(src, 20), "EMA 20")
```

The /trading menu lists Open, High, Low, Close, Hl2, Hlc3 and Ohlc4. The language also accepts [[volume]] as a source default, but the /trading menu does not list it, so read volume directly rather than through a source input.

### Interval

`kind = "interval"` renders a menu of intervals. The script gets a string, which it passes to a [higher timeframe read](/script/data/higher-timeframes).

```openscript
biasTf = input("1D", "Bias interval", kind = "interval")
bias   = req.timeframe(biasTf, ema(close, 20))
plot(bias, "Bias", style = "step")
```

In the /trading settings dialog the menu starts with **Chart interval**, labelled with the chart's own interval, such as **Chart interval (5m)**, followed by the intervals your data feed serves that a read can build from the chart's bars: the chart's interval or a coarser one, and on an intraday chart only a whole multiple of it. On a 5 minute chart that is `10m`, `15m`, `30m`, `1h` and the day, with `1m` and `3m` left out. The script receives each choice in the language's spelling, the forms on [Timeframes](/script/data/timeframes#how-a-timeframe-is-written):

- **Chart interval** stores the chart's interval as it is when you choose it, `5m` on that chart. Moving the chart to another interval later does not change the setting.
- The feed's **D**, **W** and **M** are stored as `1D`, `1W` and `1M`.
- A saved value that is no longer offered, such as `1m` on a chart that has since moved to `5m`, stays in the menu as an entry of its own, so the dialog never shows one interval while the study uses another.

The repaint mode of a read is never an input. `mode = "confirmed"`, `"developing"` or `"lookahead"` is written as a literal, because a setting would let a reader change the honesty of a study without reading it.

### Time

`kind = "time"` takes a date and a time. In the /trading dialog it is a text box with the hint `YYYY-MM-DD HH:MM`. The value is stored as the text you typed, and the script receives a timestamp in UTC milliseconds, converted once before the first bar, ready to compare with [[time]].

```openscript
// Read in the chart's timezone on the /trading chart: 09:15 IST on an IST chart.
anchor = input("2025-01-02 09:15", "Anchor", kind = "time")
started = time >= anchor
background(started ? fade(aqua, 95) : none)
```

:::warn
Where the text is read depends on where the script runs. The /trading chart reads it in the chart's timezone, so `2025-01-02 09:15` is 09:15 IST on a chart in Indian time. A strategy deployed from the Strategies panel reads it in the instrument's timezone, which is IST for Indian exchanges. The Backtest panel still reads it as a **UTC** clock: there `09:15` is 14:45 IST, so subtract 5 hours 30 minutes from an IST time when you type one for a backtest. [Sessions and time](/script/data/sessions-and-time) has more on time in /trading.
:::

## Where input() may appear

**At the top level of the file, and nowhere else.** Not inside an `if`, a loop or a function. The dialog is built once, before the first bar, from the `input()` calls the compiler can see, so a row that existed on some bars and not others would have nothing for a saved value to attach to:

```openscript expect=OS3007
version 1

study("Band", overlay = true)

useBand = input(true, "Use the band")
if useBand
    bandLen = input(20, "Band length")
```

Declare the input at the top level and read its name inside the block instead.

**The default must be fixed before the first bar**: a literal, arithmetic over literals, or another input. A default computed from bar data is OS3003:

```openscript expect=OS3003
lookback = input(round(close / 100), "Lookback")
plot(sma(close, lookback), "Average")
```

An `input()` may also be the value of a declaration option, which is how a reader changes something the declaration decides, and it may be written inside the expression of a [higher timeframe read](/script/data/higher-timeframes#what-the-expression-means-inside-a-read):

```openscript title="Inputs in a declaration and in a read"
version 1

// A study in its own pane, where precision sets the decimals on the scale.
study("Daily RSI", precision = input(1, "Decimals", min = 0, max = 8), range = [0, 100])

dailyRsi = req.timeframe("1D", rsi(close, input(14, "RSI length", min = 2)))
plot(dailyRsi, "Daily RSI", purple, style = "step")
```

The input inside the read follows the dialog like any other. The one in the declaration is a different case in /trading: the chart reads declaration options when it loads the study, at their defaults, so changing the Decimals row does not change the drawing there. [Settings and style](/script/inputs/settings-and-style#what-the-declaration-decides) lists what follows the dialog.

## Names, titles and saved values

/trading keeps one value per input for each study on a chart, and files it under a **key**: the name the input is assigned to, or its title when it is assigned to no name.

```openscript
len = input(20, "Length")               // filed under len
var start = input(0, "Starting count")  // filed under start
plot(sma(close, len), "Average")
plot(start, "Start")
```

The key survives every edit that does not rename it. Inserting an input above another, deleting one, or reordering them leaves every saved value where the reader put it. Renaming the variable is the one edit that loses a saved value, because the row it was saved for is gone, and the study comes back on the default.

Because a key must be unique, the compiler checks it:

| Code | When |
|---|---|
| OS3017 | Two inputs share a title |
| OS3022 | An input with no name has a title that spells another input's name |
| OS3021 | An input with no name has no title at all |
| OS3024 | An input with no name has an empty title |

```openscript expect=OS3021
version 1

// Assigned to no name and given no title: nothing to file the value under.
study("Range", precision = input(2))
plot(high - low, "Range")
```

A named input is different: it has a key already, so an empty title is read as no title and the row is labelled with the name. `len = input(14, "")` is the same row as `len = input(14)`.

## var in front of an input

`var total = input(0, "Starting count")` is an ordinary [persistent variable](/script/language/persistence) whose first value is the setting. It is set once, on the first bar, and keeps whatever the script puts in it afterwards, which is how a running count starts from a setting:

```openscript
var tally = input(0, "Starting count")
tally += 1
plot(tally, "Bars so far")
```

The price is that the name is no longer the setting itself. A later line may change it, so it is not fixed before the first bar, and it cannot be a declaration option (OS3003) or be read inside a higher timeframe read (OS6003). Write the plain form when you want the setting, and `var` when you want a value that starts there.

## Groups and tooltips

Every kind also accepts these arguments:

| Argument | Type | Default | Does |
|---|---|---|---|
| `group` | `string` | `""` | A heading the input belongs under |
| `tooltip` | `string` | `""` | Help text for the input: the unit, and what moving it does |
| `inline` | `string` | `""` | Planned: rows sharing a value sit on one line |
| `confirm` | `bool` | `false` | Planned: ask for this value when the study is added |

`group` and `tooltip` are carried in the compiled script. In /trading, the study settings dialog and the input forms in the Backtest and Strategies panels list the inputs in the order they appear in the source, show each `group` as a heading above its rows, and write each `tooltip` as a line of help under its row. The compiler accepts `inline` and `confirm`, and they have no effect yet.

Still make the labels carry the meaning, because the label is what a reader scans. **Name the unit in the label when it is not obvious**: "Band width, in ATR" and "Flat this many minutes after the open" need no tooltip. "Multiplier" and "Threshold" need one and will still be misread without it. Group in the order a reader works: calculation first, then what is drawn, then anything about trading.

```openscript title="Range breakout"
version 1

study("Range breakout", overlay = true, precision = 2)

len = input(20, "Lookback, in bars", min = 2, max = 500,
            tooltip = "Bars the breakout level is measured over. " +
                      "Longer is slower and gives fewer, cleaner signals.")

stopMult = input(2.0, "Stop distance, in ATR", min = 0.2, max = 20, group = "Risk",
                 tooltip = "Distance from the breakout level to the stop, " +
                           "in average true range.")

showStop = input(true, "Draw the stop", group = "Display")
stopTint = input(red,  "Stop colour",   group = "Display")

level20  = highest(high, len)[1]
atrValue = atr(14)

plot(level20, "Breakout level", aqua, width = 2)
plot(showStop ? level20 - stopMult * atrValue : none, "Stop", stopTint)
```

## When a value is checked

A value passes three checks, and which one catches a mistake matters, because only the first two catch it before the study draws anything.

| When | What is checked | On failure |
|---|---|---|
| Compile | The declaration itself: placement, a fixed default, a default inside `options`, a title, a unique key | OS3007, OS3003, OS3018, OS3017, OS3021, OS3022, OS3024. The script does not compile |
| Load | The reader's saved value against the input's type, `min`, `max` and `options` | OS6019, naming the setting and the rule. The study does not run |
| Each bar | A legal setting that becomes an illegal argument, such as a length computed down to zero | OS4003. The study stops on that bar |

**A saved value that fails the check stops the study rather than falling back to the default.** The alternative looks friendlier and is a trap: a study that quietly used its default would come back on the chart under its own name, drawing numbers the reader never configured, with nothing on screen to say so. The usual cause is an edit that tightened a bound. Open the settings, correct the value or press **Defaults**, and press **Ok**.

Meanwhile the dialog still opens, and the study's declared shape uses the declared default for any value that fails, so the row you need to correct is always reachable.

An input that is declared and never read is warning OS8018: the row appears, the reader changes it, and nothing happens, which is worse than the setting not existing.

## Inputs in the Backtest and Strategies panels

A strategy's inputs are set in two more places, with one shared form, so the two accept exactly the same values:

- The **Backtest** panel, under **Settings**, which opens by itself for a strategy that declares inputs.
- The **Strategies** panel, in the form where you deploy a strategy.

In that form a switch is a `true` or `false` menu, a choice is a menu of its options, and every other input is a box that shows the script's default as a hint. **A box left empty uses the script's own default**, rather than zero or an empty string, and only the values you change are sent. In the Backtest panel the values apply to the next run and never reach a deployed strategy; in the Strategies panel a running strategy reads them when it starts, so stop it and start it again to apply a change.

One difference from the chart's settings dialog: a number box holding a value outside the input's `min` and `max`, or text that is not a number, is dropped rather than sent, so that run uses the script's default without saying so. Check the box holds what you meant before you trust a result.

{{screen: deploy-form}}

The values in the strategy's own declaration, such as its capital, order size, commission and slippage, are shown in the Backtest panel under **Declared by the script** and are not offered as inputs. Edit the script to change them. [Backtesting](/script/strategies/backtesting) and [Sandbox and live](/script/strategies/sandbox-and-live) cover the two panels.

## Choosing defaults

A default is not a placeholder. Most readers never change it, so the default is the study for almost everyone who loads it.

- **Use the value you actually use.** If you trade the study with a length of 34, ship 34.
- **Make it valid on the first chart it lands on.** A default that assumes an intraday interval breaks on a daily chart, and one that assumes volume breaks on an index, which has none.
- **Watch the warmup.** A call that needs 200 bars is absent on the first 199, so a default of 200 on a chart holding 300 bars draws almost nothing and looks broken. [Warmup](/script/language/warmup) explains how warmups add up.
- **Set bounds to the range where the study still means something**, not to the range a number can hold. `min = 2, max = 500` on a lookback says more than `min = 1` alone, and stops a reader typing 50000 and waiting.
- **Default a switch to `true` for a feature the study is about**, and to `false` for anything that paints over the reader's chart, such as recoloured candles or a shaded background.

## What belongs in the dialog

**An input the dialog cannot show is a setting the reader can never change.** The dialog is built entirely from the `input()` calls the compiler can see before the first bar. Nothing else in a script becomes a row, so a number written in the middle of a calculation is a number no reader will change without editing the source.

The working rule: **every number, colour or choice in a script is either an input or a deliberate constant.** When you fix a value, say in a comment why. A reader who finds `14` with no comment assumes you forgot; a reader who finds a sentence saying the value is part of the definition moves on.

The opposite matters as much. Some things must not be inputs even though the dialog could show them: the mode of a higher timeframe read, the declaration's `onUnconfirmed`, anything that changes what the study is allowed to know. Those belong in the source, where a review can see them. [Repainting](/script/data/repainting) explains why.

## Common mistakes

| Symptom | Code | Fix |
|---|---|---|
| `input()` inside an `if` or a function | OS3007 | Move it to the top level and read the name inside the block |
| A default computed from bar data | OS3003 | Use a literal, or an input for the thing the default depended on |
| Two rows with one title | OS3017 | Rename one; the title is part of the key |
| A row with no name and no title | OS3021 | Give it a title written as a string literal |
| A row with no name and an empty title | OS3024 | Give the title something to say |
| A title that spells another input's name | OS3022 | Retitle it, or rename the other input |
| A choice whose default is not in its list | OS3018 | Add the default to `options`, or pick a listed value |
| A list of numbers as `options` | OS3011 | Write the options as strings |
| A `var` holding an input used as a declaration option | OS3003 | Drop the `var` |
| A planned kind such as `"symbol"` | OS2001 | Use a text input for now |
| A saved value outside the bounds | OS6019 | Correct it in the settings dialog, or press Defaults |
| A row nobody reads | OS8018, a warning | Use the name, or delete the input |
| A length reaching zero on some bar | OS4003 | Set `min = 1` on the input so the value never gets there |

## Worked example: one study, a complete dialog

```openscript title="Bands"
version 1

study("Bands", overlay = true, precision = 2)

// Calculation. Ungrouped, because these are the rows a reader adjusts most.
len = input(20, "Length, in bars", min = 2, max = 500,
            tooltip = "Bars in the basis average and in the deviation.")
src = input(hlc3, "Source")

mult = input(2.0, "Band width, in standard deviations",
             min = 0.1, max = 5, step = 0.1, group = "Bands")
maType = input("sma", "Basis type", group = "Bands",
               options = ["sma", "ema", "wma", "rma", "hma", "vwma"])

showBands = input(true,           "Show the bands", group = "Display")
bandTint  = input(aqua,           "Band colour",    group = "Display")
shadeTint = input(fade(aqua, 92), "Shade colour",   group = "Display")
basisTint = input(orange,         "Basis colour",   group = "Display")

// Computed on every bar, whatever the switch says.
basis = ma(src, len, type = maType)
dev   = mult * stdev(src, len)

// The switch hides the bands by handing their plots none, never by wrapping
// plot() in an if: plot is fixed before the first bar.
upper = showBands ? basis + dev : none
lower = showBands ? basis - dev : none

plot(basis, "Basis", basisTint, width = 2)
upperPlot = plot(upper, "Upper", bandTint)
lowerPlot = plot(lower, "Lower", bandTint)

// A fill stops wherever one of its plots is absent, so the switch hides the
// shade too. The shade has a colour input of its own, and a colour picked for
// it keeps the transparency of its default.
fill(upperPlot, lowerPlot, shadeTint)
```

Eight rows, and nothing in the calculation that a reader might reasonably want different is locked away in the source.

**Related:** [Settings and style](/script/inputs/settings-and-style), [input() reference](/script/reference/input), [Plots](/script/visuals/plots), [Higher timeframes](/script/data/higher-timeframes), [OS3xxx Arguments](/script/errors/arguments)
