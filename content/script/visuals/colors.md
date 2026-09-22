---
title: Colors
description: The nineteen named colours, hex literals, rgb and rgba, transparency with fade and withAlpha, blends with mix, a colour per bar, and palettes that read on both light and dark charts.
---

Every line, band, marker and shaded bar a script draws takes a colour. This page covers how to name one, build one from channels, make it transparent by the right amount for the surface it lands on, vary it with a value or from bar to bar, and choose a palette that stays readable whether the reader's chart is light or dark. Colour carries meaning on a chart (up or down, calm or stretched), so a few careful choices here make a study far easier to read.

## A first example

A relative strength index (RSI) whose line changes colour with its zone, with a faint wash behind the pane while it is overbought:

```openscript title="RSI zones"
version 1
study("RSI zones", precision = 2, range = [0, 100])

len = input(14, "Length", min = 2, max = 200)

r = rsi(close, len)

// Three states, and none while the RSI has no value yet.
zoneColor = isNone(r) ? none : (r > 70 ? red : (r < 30 ? lime : purple))

level(70, "Overbought", fade(red, 40))
level(30, "Oversold", fade(lime, 40))

plot(r, "RSI", color = zoneColor, width = 2)
background(r > 70 ? fade(red, 92) : none)
```

Four colour ideas are in those lines: named colours (`red`, `lime`, `purple`), transparency with `fade`, a colour that changes per bar, and `none` meaning "paint nothing here" for the background. The rest of the page takes them one at a time.

## Named colours

Nineteen names are built in, written bare with no prefix. Each is fully opaque, and its channels are fixed by the language, so `aqua` is the same colour on every engine that runs your script. That is the reason to prefer a name over a hex value you half remember.

| Name | Red, green, blue | Hex |
|---|---|---|
| [[aqua]] | 0, 255, 255 | `#00ffff` |
| [[black]] | 0, 0, 0 | `#000000` |
| [[blue]] | 0, 0, 255 | `#0000ff` |
| [[brown]] | 165, 42, 42 | `#a52a2a` |
| [[fuchsia]] | 255, 0, 255 | `#ff00ff` |
| [[gray]] | 128, 128, 128 | `#808080` |
| [[green]] | 0, 128, 0 | `#008000` |
| [[lime]] | 0, 255, 0 | `#00ff00` |
| [[maroon]] | 128, 0, 0 | `#800000` |
| [[navy]] | 0, 0, 128 | `#000080` |
| [[olive]] | 128, 128, 0 | `#808000` |
| [[orange]] | 255, 165, 0 | `#ffa500` |
| [[pink]] | 255, 192, 203 | `#ffc0cb` |
| [[purple]] | 128, 0, 128 | `#800080` |
| [[red]] | 255, 0, 0 | `#ff0000` |
| [[silver]] | 192, 192, 192 | `#c0c0c0` |
| [[teal]] | 0, 128, 128 | `#008080` |
| [[white]] | 255, 255, 255 | `#ffffff` |
| [[yellow]] | 255, 255, 0 | `#ffff00` |

The names are ordinary built-in values of type `color`, not keywords. Assigning to one is [OS2002](/script/errors/names-and-types#os2002), the same error as redeclaring any other name that already exists:

```openscript expect=OS2002
aqua = #00e5ff
```

## Hex literals

A colour can also be written in hex, with six digits or with eight, where the last two are alpha (how opaque the colour is):

```openscript
plot(ema(close, 9), "Fast", #ff8800)       // six digits, fully opaque
plot(ema(close, 21), "Slow", #ff880080)    // eight digits: the last two are alpha
```

A hex literal becomes four numbers when the script compiles: red, green and blue from 0 to 255, and alpha from 0 to 1. The alpha byte is divided by 255, so `80` (128) is an alpha of about 0.5. The three-digit shorthand, such as `#f80`, is not a colour literal and does not compile.

Two colours are equal when all four channels match. `aqua == aqua` is true, and a faded colour is not equal to the colour it came from.

## Building a colour

| Call | Returns | For |
|---|---|---|
| [[rgb()]] `(r, g, b)` | `color` | Channels 0 to 255, fully opaque |
| [[rgba()]] `(r, g, b, a)` | `color` | The same, with alpha from 0 to 1, where 1 is opaque |
| [[fade()]] `(color, percent)` | `color` | The same colour at `percent` **transparency**, where 100 is invisible |
| [[withAlpha()]] `(color, a)` | `color` | The same colour at a stated alpha, 0 to 1, where 1 is opaque |
| [[mix()]] `(a, b, weight)` | `color` | A blend of two colours: weight 0 gives `a` and 1 gives `b` |
| [[alpha()]] `(color)` | `number` | Read a colour's alpha back, 0 to 1 |

```openscript
plot(sma(close, 20), "Basis", rgb(255, 136, 0), width = 2)
plot(sma(close, 50), "Slow", rgba(0, 150, 255, 0.6))
```

Two more are named in the language and not available yet: [[hsl()]], for hue, saturation and lightness, and [[gradient()]], for positioning a value between two colours. Calling either is [OS2020](/script/errors/names-and-types#os2020) in version 0.5.0:

```openscript expect=OS2020
plot(close, "Close", hsl(200, 80, 50))
```

Until they arrive, [[mix()]] with a weight you compute yourself does the work of `gradient`, as shown in [Colour that follows a value](#colour-that-follows-a-value).

### Channels out of range

A channel written as a number that is out of range, or not a whole number, is refused when the script compiles, with [OS3004](/script/errors/arguments#os3004):

```openscript expect=OS3004
plot(close, "Close", rgb(300, 0, 0))
```

A channel computed from data is a different case. It is meant to raise runtime error [OS4009](/script/errors/runtime#os4009), because a colour computed from data that lands at 300 is a bug in the computation. In version 0.5.0 nothing raises OS4009 yet: the engine rounds the channel to a whole number, clamps it to 0 to 255, and the bar carries on. Do not rely on that. Where a computed channel can run past its end, clamp it where you compute it with [[clamp()]], so a reader can see the decision:

```openscript
// How far the close sits above its 20 bar low, in average true ranges,
// turned into a red channel from 0 to 255.
stretch = (close - lowest(low, 20)) / atr(14)
redness = clamp(stretch * 64, 0, 255)

plot(close, "Close", rgb(redness, 80, 80))
```

## Transparency, and its two conventions

This is the one part of colour that catches everybody once.

**`fade` takes transparency. `withAlpha` takes opacity. They run in opposite directions.**

| Call | 0 means | 100 or 1 means |
|---|---|---|
| `fade(color, percent)` | Fully opaque | Invisible |
| `withAlpha(color, a)` | Invisible | Fully opaque |

For an opaque colour the two describe the same thing: `fade(aqua, 60)` and `withAlpha(aqua, 0.4)` are both aqua at 40 percent strength. Most scripts use `fade`. `withAlpha` suits a script that computes an opacity from data, because it takes that number as it is.

```openscript
plot(sma(close, 20), "Faded 60 percent", fade(aqua, 60))
plot(sma(close, 50), "Alpha 0.4", withAlpha(aqua, 0.4))
```

The Opacity control in the settings dialog's Style tab runs the way `withAlpha` does, from 0 (invisible) to 100 (solid), so a user who sets it to 40 sees roughly what `fade(c, 60)` gives. Keep the two directions straight when you tell a user what to change.

Apply `fade` once, to an opaque colour such as a named one. Fading a colour that is already transparent gives different answers in version 0.5.0 depending on where the colour is worked out: in a colour fixed before the first bar the outer fade replaces the inner one, and in a colour computed on a bar the two multiply. To give an exact alpha to a colour that already carries some transparency, use `withAlpha`, which always sets the alpha outright.

The right amount of transparency depends entirely on what the colour lands on:

| Surface | Typical | Why |
|---|---|---|
| A plotted line | Opaque, or `fade(c, 20)` for a secondary line | A line is thin: transparency mostly costs legibility |
| A fill between two plots | `fade(c, 85)` to `fade(c, 95)` | It covers a large area around the candles |
| A box fill | `opacity = 0.08` to `0.15` on `draw.box` (its default is 0.12) | The same, and boxes often overlap each other |
| A pane background | `fade(c, 90)` or more | It covers the full height of the bar |
| A table background | `fade(black, 25)` | It sits over the chart and should still let it through |
| A label plate | Opaque | The text has to be readable against it |

The rule behind the table: **the bigger the area, the more transparent it must be.** A fill at 50 percent transparency looks reasonable in a screenshot of twenty bars and turns the chart into a wash at two hundred.

## Colour that follows a value

[[mix()]] places a colour between two others. The weight is yours to compute, which means it is yours to scale and yours to bound:

```openscript title="Volume heat"
version 1
study("Volume heat", overlay = true)

lookback = input(20, "Average over", min = 2, max = 500)
hottest  = input(3.0, "Ratio that counts as hot", min = 1.5, max = 10)

ratio = volume / sma(volume, lookback)

// A weight is a position between two colours, so it is clamped to 0 to 1.
weight = isNone(ratio) ? none : clamp((ratio - 1) / (hottest - 1), 0, 1)

heat = isNone(weight) ? none : mix(fade(aqua, 40), red, weight)

barColor(heat)
```

Three steps in that script apply to every colour scale you will write:

1. **Scale first.** A weight is a fraction of the way between two readings, so divide the raw value by the range you consider meaningful. Here that range is an input, because "hot" is a judgement.
2. **Clamp second.** A ratio has no upper bound and a weight does. `mix` does not refuse a weight outside 0 to 1: it carries on past the far colour until the channels hit their limits, which is rarely the colour you meant.
3. **Handle absence third.** `barColor(none)` leaves the candle its own colour, which is the right picture during warmup: the study says nothing about bars it knows nothing about.

`mix` blends alpha as well as the three channels, so the blend above runs from aqua at 60 percent strength to solid red. It rounds each channel to a whole number, so every colour a script computes has whole channels, just like a literal.

For a two-sided scale, blend from the middle outwards rather than end to end:

```openscript
strength = rsi(close, 14)
weight   = isNone(strength) ? none : clamp(abs(strength - 50) / 50, 0, 1)
tint     = isNone(weight) ? silver : mix(silver, strength > 50 ? lime : red, weight)

plot(close, "Close", tint, width = 2)
```

That reads correctly at 50, where both sides are grey. A blend straight from lime to red would put olive, `mix(lime, red, 0.5)`, at exactly the value the reader cares about most.

## A colour per bar

**A constant colour and a per-bar colour are the same argument.** Pass a fixed colour and it becomes the plot's style colour. Pass an expression that gives a colour each bar and the compiler stores one beside each value:

```openscript
m = macd(close, 12, 26, 9)
plot(m[2], "Histogram", color = m[2] > 0 ? lime : red, style = "histogram")
```

One argument covers both because a script that starts with one colour and later wants two should not have to move to a different function. The cost is worth knowing: a constant colour costs nothing per bar, and a computed one costs one more value per bar.

**What counts as fixed.** A colour is fixed only when it is written in the call itself: a named colour, a hex literal, a colour built from literals such as `fade(red, 40)`, or a colour input passed by its own name. Everything else is treated as a colour per bar, including a name you assigned a constant colour to, and `fade()` applied to an input.

Not every surface takes a per-bar colour:

| Surface | A fixed colour | A colour per bar |
|---|---|---|
| `plot(value, title, color)` | The plot's style colour, which the user can change in the Style tab | Yes. It is drawn as computed, and the Style tab no longer changes it |
| `plotCandles(..., colorUp, colorDown, wickColor, borderColor)` | The candles' colours | Yes |
| `barColor(color)` | Every bar the same | Yes, the usual case |
| `background(color)` | Every bar the same | Yes, the usual case |
| `cell(..., textColor, bgColor)` | The cell's colours | Yes: they are read each time the cell is written |
| `fill(a, b, color, colorUp, colorDown)` | The band's colours | Accepted, but the /trading chart does not draw it in this release: the band takes its first plot's colour at twelve percent instead |
| `level(price, title, color)` | The line's colour | No: [OS3003](/script/errors/arguments#os3003) |
| `signal(text, color)` | The marker's colour | No: [OS3003](/script/errors/arguments#os3003) |
| `table(..., textColor, bgColor)` | The grid's colours | No: [OS3003](/script/errors/arguments#os3003) |

A colour taken from a name you computed, even from constants, counts as per bar, so it is [OS3003](/script/errors/arguments#os3003) where a fixed one is required:

```openscript expect=OS3003
OVERBOUGHT = fade(red, 40)
level(70, "Overbought", OVERBOUGHT)
```

Write `fade(red, 40)` in the `level` call instead, or declare a colour input with that default.

## An absent colour

`none` is a valid colour, and passing it is never an error. What it does depends on the surface:

| Surface | An absent colour on a bar |
|---|---|
| `barColor` | The candle keeps its own colour |
| `background` | The bar's column is not shaded |
| `plot` | The bar is drawn in the plot's own colour from the Style tab. To hide a plot on a bar, make its value `none`, not its colour |
| `fill` | `none` means the band has no colour of its own, so it takes its first plot's colour at twelve percent |

For the two paint calls this is how a conditional paint switches itself off, so a script never needs a separate call to clear one:

```openscript
paint = input(true, "Recolour the candles")
up    = close > open
risky = atr(14) > 2 * atr(100)

barColor(paint ? (up ? lime : red) : none)     // the input switches it off
background(risky ? fade(red, 92) : none)       // only risky bars are shaded
```

Watch the interaction with absent conditions, because it is where a script tells a lie without meaning to. An absent condition takes the false branch, so `trendUp ? lime : red` paints every warmup bar red, as if the trend were down. What you want is three states:

```openscript
basis   = ema(close, 50)
trendUp = close > basis

tint = isNone(basis) ? none : (trendUp ? lime : red)
barColor(tint)
```

Absent for "I do not know yet", lime for up, red for down. The chart then shows its own candle colours across the warmup, which is the truth. [Absent values](/script/language/absent-values) explains the rules behind this.

## Colours for light and dark charts

**A script cannot read the chart's theme.** Nothing in the `chart` namespace reports whether the background is light or dark, so the colours you pick have to work on both. A study that only looks right on its author's theme is a study half its readers will restyle or discard.

| Purpose | A choice that works on both | Why |
|---|---|---|
| A primary line | `aqua`, `orange`, `purple`, `fuchsia` | Mid-tone, saturated hues stand out against both a near-white and a near-black background |
| A secondary line | `fade(silver, 50)` or `gray` | Grey reads as secondary on both |
| A line meant to recede | Transparency, not a near-background colour | No single colour disappears into both themes |
| Up and down | `lime` and `red`, plus a difference that is not colour | Colour alone fails a reader who cannot separate red and green |
| Text on a coloured plate | A text colour chosen for the plate: `white` on `red` or `navy`, `black` on `lime` or `yellow` | The plate is the background for that text, and it does not change with the theme |
| A fill or a background | The colour at 85 to 95 percent transparency | The theme's own background shows through and does the work |

Be careful with `white` and `black`. Each is invisible on one of the two themes, so neither belongs on a line, a marker or a drawing where it is the only carrier of meaning. They are fine as the text colour on a plate whose colour you chose, because there the background is the plate rather than the chart.

"A difference that is not colour" means giving two things a second way to tell them apart: a solid line against a dashed one, a triangle up against a triangle down, a marker above the bar against one below it. Then the picture still works for a reader who sees your lime and your red as the same grey.

## Letting the user choose

The Style tab of the settings dialog gives every plot its own colour, opacity, thickness, line style and plot style, whether or not the script asks, so a reader can always restyle a fixed-colour plot. Where one colour is central to the study, declare it as an input and pass it through **by its own name**:

```openscript title="Bands"
version 1
study("Bands", overlay = true)

len       = input(20,   "Length", min = 2, max = 500)
mult      = input(2.0,  "Width, in deviations", min = 0.5, max = 5)
bandColor = input(aqua, "Band colour")

b = bollinger(close, len, mult)

// Every colour here is the input itself, so one setting restyles the three
// lines and the band together.
plot(b[0], "Basis", bandColor, width = 2)
upper = plot(b[1], "Upper", bandColor)
lower = plot(b[2], "Lower", bandColor)

fill(upper, lower, color = bandColor, opacity = 0.1)
```

When a plot's colour is a colour input passed by its own name, the plot's colour in the Style tab and the input are one setting, so the user has one value to change rather than two that disagree. A band given the input follows it too, and `opacity` keeps it faint whatever colour the user picks.

Two things break that link, because each turns the colour into a per-bar colour: copying the input into another name (`LINE = bandColor`) and fading it in the call (`fade(bandColor, 45)`). A plot still draws such a colour, but the Style tab no longer changes it; a band in the /trading chart falls back to its first plot's colour; and a `level` or `signal` refuses it. When you want a faded version the user can change, declare it as its own input with a faded default, such as `input(fade(aqua, 45), "Edge colour")`.

See [Inputs](/script/inputs/inputs) for colour inputs and [Settings and style](/script/inputs/settings-and-style) for the rows the settings dialog generates.

## Common mistakes

| Symptom | Cause | Fix |
|---|---|---|
| A fill drowns the candles' colours | Transparency too low | `fade(c, 88)` or higher for a band |
| Nothing is drawn at all | `fade(c, 100)` | 100 is invisible; `fade` takes transparency, not opacity |
| A line hidden with a `none` colour still shows | On a plot, an absent colour falls back to the plot's own colour | Make the value `none` instead |
| Every warmup bar is painted the "down" colour | An absent condition taking the false branch | `isNone(x) ? none : (cond ? upColor : downColor)` |
| [OS3004](/script/errors/arguments#os3004) on an `rgb` call | A channel literal outside 0 to 255, or not whole | Fix the number |
| A computed channel gives an unexpected colour | The channel ran past its range | `clamp` it where you compute it |
| [OS3003](/script/errors/arguments#os3003) on a `level` or `signal` colour | The colour was computed, or taken from a name | Write it in the call, or pass an input by its own name |
| A band ignores the colour you computed for it | The /trading chart does not draw a per-bar band colour | Give the band fixed colours |
| The Style tab does not change a plot's colour | The colour is computed per bar, or held in another name | Pass the colour input straight to the plot |
| [OS2020](/script/errors/names-and-types#os2020) on `hsl` or `gradient` | Both are planned, not yet available | Use `rgb`, or `mix` with a computed weight |
| The study is invisible on a dark chart | `black` used as a line colour | `gray` or `silver`, or a mid-tone hue |
| Label text cannot be read | Text colour picked for the theme rather than the plate | Choose the text colour from the plate colour |
| Two series look identical to some readers | Colour is the only difference | Add a line style, a shape or a position difference |
| A colour scale is muddy in the middle | Blending end to end across a neutral midpoint | Blend from the middle outwards on each side |

Related: [Visuals overview](/script/visuals/overview), [Plots](/script/visuals/plots), [Fills](/script/visuals/fills), [Bar colouring and backgrounds](/script/visuals/bar-coloring-and-backgrounds), [Labels and shapes](/script/visuals/labels-and-shapes), [Tables](/script/visuals/tables), [Colors reference](/script/reference/color).
