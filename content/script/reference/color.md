---
title: Colors
description: The nineteen named colours and the functions that build a colour from its channels, set and read its transparency, and blend two colours into a scale, with the planned hsl() and gradient().
---

Every line, band, marker, shaded bar and table cell a script draws takes a colour. This page is the reference for the colour values the language gives you: the nineteen named colours, the functions that build a colour from its channels, the two that make a colour transparent, the one that reads transparency back, and the one that blends two colours into a scale. For the design side, such as how much transparency a fill needs and which colours read on light and dark charts, see the [Colors](/script/visuals/colors) guide.

```openscript title="Trend colours"
version 1
study("Trend colours", overlay = true)

fast     = ema(close, 9)
slow     = ema(close, 21)
atrValue = atr(14)

f = plot(fast, "Fast EMA", aqua)
s = plot(slow, "Slow EMA", orange)

// A light green band while the fast average is above the slow one, red below.
fill(f, s, colorUp = fade(lime, 85), colorDown = fade(red, 85))

// Candles grow stronger in colour the further price stretches from the slow average,
// measured in ATRs and capped at one ATR.
stretch = clamp(abs(close - slow) / atrValue, 0, 1)
tint    = close > slow ? lime : red
barColor(mix(silver, tint, stretch))
```

Three ideas are in that script: named colours (`aqua`, `orange`, `lime`, `red`, `silver`), transparency with [[fade()]], and a colour that follows a value with [[mix()]]. During warmup `stretch` is absent, so the blend is absent too, and an absent bar colour leaves the candle its own colour.

## Writing a colour

A colour is a value of type `color`: red, green and blue channels from 0 to 255, and an **alpha**, its opacity, from 0 (invisible) to 1 (fully opaque). There are three ways to write one.

| Form | Example | Notes |
|---|---|---|
| A named colour | `aqua` | Nineteen names, all fully opaque |
| A hex literal | `#ff8800` or `#ff880080` | Six hex digits, or eight with an alpha byte |
| A function | `rgb(255, 136, 0)` | Built from channels, or from another colour |

A hex literal has exactly six or eight digits, and upper and lower case mean the same. The optional last pair is the alpha as a byte, so `80` (128) is an alpha of about 0.5. The short three-digit form is not a colour:

```openscript expect=OS1027
plot(close, "Close", #f80)
```

Colours support `==` and `!=`: two colours are equal when all four channels match, so `orange == rgb(255, 165, 0)` is true. They support no arithmetic; `red + blue` is [OS2003](/script/errors/names-and-types#os2003). To see a colour's exact value while debugging, [[text()]] writes it as `#rrggbbaa`: `text(fade(aqua, 88))` is `"#00ffff1f"`.

None of the names or functions on this page has a warmup. A colour built from present values exists on bar 0, and a function given an absent argument returns an absent colour. What an absent colour does depends on where it goes: [Where colours go](#where-colours-go) below has the details.

## The nineteen named colours

Each name is a built-in value of type `color` at full opacity, written bare with no prefix. The channel values are fixed by the language, so `aqua` is the same colour on every engine that runs your script. Because they are values rather than keywords, a name cannot be assigned to:

```openscript expect=OS2002
aqua = #00e5ff
```

| Name | Hex | Name | Hex |
|---|---|---|---|
| [[aqua]] | `#00ffff` | [[navy]] | `#000080` |
| [[black]] | `#000000` | [[olive]] | `#808000` |
| [[blue]] | `#0000ff` | [[orange]] | `#ffa500` |
| [[brown]] | `#a52a2a` | [[pink]] | `#ffc0cb` |
| [[fuchsia]] | `#ff00ff` | [[purple]] | `#800080` |
| [[gray]] | `#808080` | [[red]] | `#ff0000` |
| [[green]] | `#008000` | [[silver]] | `#c0c0c0` |
| [[lime]] | `#00ff00` | [[teal]] | `#008080` |
| [[maroon]] | `#800000` | [[white]] | `#ffffff` |
| | | [[yellow]] | `#ffff00` |

:::tip
`green` is a dark, half-strength green. The bright green most charts use for a rising bar is `lime`.
:::

## Neutrals

{{entry: black}}

Pure black. Faded, it makes a table background that lets the price pane show through; opaque, it is the text colour for a light cell.

```openscript
panel = table("Last close", 1, 2, bgColor = fade(black, 25), textColor = white)

if bar.isLast
    cell(panel, 0, 0, "Close")
    cell(panel, 0, 1, text(close, 2))
```

**Remarks.** Opaque black disappears on a dark chart. Use it for backgrounds with [[fade()]], or for text on a light fill.

**See also.** [[white]], [[gray]], [[table()]]

{{entry: gray}}

A mid grey, halfway between black and white, and the default colour of a [[level()]]. It reads on both light and dark charts, so it suits reference lines that should be seen but not noticed. The name is spelled `gray`.

```openscript
plot(mom(close, 10), "Momentum", aqua)
level(0, "Zero", gray)
```

**See also.** [[silver]], [[level()]]

{{entry: silver}}

A light grey. Use it for a secondary line, a neutral state between two coloured ones, or the start of a colour scale that blends towards a stronger colour.

```openscript
plot(sma(close, 50), "SMA 50", silver)
plot(sma(close, 200), "SMA 200", fade(silver, 50))
```

**See also.** [[gray]], [[mix()]]

{{entry: white}}

Pure white. The usual text colour on a dark table cell or label plate.

```openscript
panel = table("Symbol", 1, 1, bgColor = fade(navy, 20))

if bar.isLast
    cell(panel, 0, 0, chart.symbol, textColor = white)
```

**Remarks.** White text vanishes on a light chart background, so give it a dark cell or plate to sit on.

**See also.** [[black]], [[cell()]], [[draw.label()]]

## Reds, oranges and yellows

{{entry: red}}

Pure red. The conventional colour for a falling bar, a bearish signal and a stop level.

```openscript
stopLine = close - 2 * atr(14)
plot(stopLine, "Two ATR stop", red, style = "step")
```

**See also.** [[maroon]], [[lime]], [[fade()]]

{{entry: maroon}}

A dark red, half the strength of `red`. Use it for a second bearish shade, such as a support line that sits under a brighter stop.

```openscript
plot(lowest(low, 20)[1], "Low of the previous 20 bars", maroon, style = "step")
```

**See also.** [[red]], [[brown]]

{{entry: brown}}

A muted red-brown. It gives a long, slow line a colour of its own without competing with the brighter lines around it.

```openscript
plot(sma(close, 200), "SMA 200", brown, width = 2)
```

**See also.** [[maroon]], [[orange]], [[olive]]

{{entry: orange}}

A warm orange. It stands out on light and dark charts alike and is a common choice for the slower of two averages.

```openscript
plot(ema(close, 9), "Fast EMA", aqua)
plot(ema(close, 21), "Slow EMA", orange)
```

**See also.** [[yellow]], [[brown]], [[aqua]]

{{entry: yellow}}

Pure yellow. Faded, it makes a highlight behind a bar, such as the first bar of each session at 09:15 on NSE.

```openscript
// The first bar of each IST day, which on NSE is the session's first bar.
newDay = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")
background(newDay ? fade(yellow, 80) : none)
```

**Remarks.** Opaque yellow is hard to read on a light chart. Use it faded, or for markers on a dark chart. The example tests the date, which needs only a timezone; [[session.isFirstBar]] marks the same bar where the host states session hours, as the /trading chart does.

**See also.** [[orange]], [[background()]], [[session.isFirstBar]]

{{entry: pink}}

A light, soft pink. It works well for a band that should be visible without dominating the candles.

```openscript
b = bollinger(close, 20, 2)
upper = plot(b[1], "Upper band", pink)
lower = plot(b[2], "Lower band", pink)
fill(upper, lower, fade(pink, 85))
```

**See also.** [[fuchsia]], [[fill()]]

## Greens

{{entry: lime}}

Pure, bright green. The conventional colour for a rising bar, a bullish signal and a breakout.

```openscript
barColor(close > high[1] ? lime : none)
```

**See also.** [[green]], [[red]], [[barColor()]]

{{entry: green}}

A dark green, half the strength of `lime`. Use it for a second bullish shade, or for a volume column that should not glare.

```openscript
plot(volume, "Volume", close >= open ? green : maroon, style = "column")
```

**See also.** [[lime]], [[teal]], [[olive]]

{{entry: olive}}

A dark yellow-green. It suits a neutral secondary line that should stay in the background.

```openscript
plot(wma(close, 30), "WMA 30", olive)
```

**See also.** [[green]], [[brown]]

{{entry: teal}}

A dark blue-green. A calm colour for a line you read often but do not want to shout.

```openscript
plot(ema(hl2, 34), "EMA 34 of the midpoint", teal)
```

**See also.** [[aqua]], [[green]], [[navy]]

## Blues and purples

{{entry: aqua}}

Bright cyan. It reads clearly on both light and dark charts and is the most common colour for a study's main line or band.

```openscript
plot(ema(close, 20), "EMA 20", aqua, width = 2)
```

**See also.** [[teal]], [[blue]], [[fade()]]

{{entry: blue}}

Pure, deep blue. A strong colour for one important line, such as the session VWAP.

```openscript
// The day's VWAP, restarted on the first bar of each IST day.
newDay = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")
plot(vwapAnchor(hlc3, newDay), "VWAP", blue, width = 2)
```

**Remarks.** Pure blue is dark and can be hard to see on a dark chart; [[aqua]] is the brighter choice there. The example anchors the average itself on a new IST date, which needs only a timezone. [[vwap()]] restarts on the session's own first bar, which needs the host to state session hours, as the /trading chart does.

**See also.** [[aqua]], [[navy]], [[vwapAnchor()]], [[vwap()]]

{{entry: navy}}

A very dark blue. It reads well on a light chart and as a dark cell or label background with white text.

```openscript
plot(hlc3, "Typical price", navy)
```

**Remarks.** On a dark chart navy is close to invisible as a line. Use it for fills and backgrounds there instead.

**See also.** [[blue]], [[white]]

{{entry: purple}}

A dark purple. A traditional colour for an oscillator such as the RSI, which sits in its own pane.

```openscript
plot(rsi(close, 14), "RSI", purple)
level(70, "Overbought", red)
level(30, "Oversold", lime)
```

**See also.** [[fuchsia]], [[level()]]

{{entry: fuchsia}}

Bright magenta. It is rarely used for lines, which is what makes it good for a rare event you want to catch the eye, such as a large opening gap.

```openscript
// The day's first bar, found by its IST date, and its gap from the last close.
newDay = isNone(time[1]) or not date.isSameDay(time, time[1], "Asia/Kolkata")
gapPercent = (open - close[1]) / close[1] * 100
if newDay and abs(gapPercent) > 1
    signal("GAP", color = fuchsia)
```

**See also.** [[purple]], [[pink]], [[signal()]]

## Building a colour from channels

{{entry: rgb()}}

A fully opaque colour from its red, green and blue channels, each a whole number from 0 to 255. Use it for a colour the nineteen names do not cover.

```openscript
plot(ema(close, 50), "EMA 50", rgb(255, 136, 0), width = 2)
```

**Remarks.** A channel written as a number that is outside 0 to 255, or not whole, is refused when the script compiles:

```openscript expect=OS3004
plot(close, "Close", rgb(300, 0, 0))
```

A channel computed from data is not refused in this release: it is rounded to a whole number and held inside 0 to 255, so a red channel that works out at 300 quietly becomes 255. A later release may stop the study instead, with [OS4009](/script/errors/runtime#os4009). Do not rely on the silent limit: bound a computed channel yourself with [[clamp()]], so the decision is visible in the script.

**See also.** [[rgba()]], [[mix()]], [[clamp()]]

{{entry: rgba()}}

The same as [[rgb()]] with a fourth argument, the alpha, from 0 (invisible) to 1 (opaque). `rgba(r, g, b, a)` is the same colour as `withAlpha(rgb(r, g, b), a)`.

```openscript
plot(sma(close, 20), "SMA 20", rgba(0, 150, 255, 0.6))
```

**Remarks.** The three channels follow the rules of [[rgb()]]. A computed alpha below 0 or above 1 is clamped to the nearest end.

**See also.** [[rgb()]], [[withAlpha()]], [[fade()]]

{{entry: hsl()}}

Will build a colour from hue, saturation and lightness, which makes it easy to step through related colours by changing one number. Until it ships, use [[rgb()]] or blend two colours with [[mix()]].

## Transparency

The two transparency functions count in opposite directions, and guessing wrong draws something invisible. Keep this table in mind:

| Call | Argument | 0 means | The top of the range means |
|---|---|---|---|
| [[fade()]] `(color, percent)` | Transparency, 0 to 100 | Unchanged | `100`: invisible |
| [[withAlpha()]] `(color, a)` | Alpha, 0 to 1 | Invisible | `1`: opaque |
| [[rgba()]] `(r, g, b, a)` | Alpha, 0 to 1 | Invisible | `1`: opaque |
| [[alpha()]] `(color)` | Reads the alpha, 0 to 1 | Invisible | `1`: opaque |

For an opaque colour the two are the same idea from opposite ends: `fade(aqua, 88)` and `withAlpha(aqua, 0.12)` are the same colour.

:::note
The settings dialog also has an **Opacity** row for every plot, on its Style tab. That row counts opacity, the same direction as [[withAlpha()]] in percent: 100 there is fully visible. It is the reverse of [[fade()]], where 100 is invisible.
:::

{{entry: fade()}}

The same colour made `percent` transparent, where 0 leaves it unchanged and 100 makes it invisible. It is the call most scripts reach for when shading a fill or a background.

```openscript
b = bollinger(close, 20, 2)
upper = plot(b[1], "Upper", aqua)
lower = plot(b[2], "Lower", aqua)
fill(upper, lower, fade(aqua, 88))
```

**Remarks.** `fade` scales the alpha the colour already has: the result's alpha is `alpha(color) * (100 - percent) / 100`. On an opaque colour that is simply `(100 - percent) / 100`, but fading twice compounds, so `fade(fade(aqua, 50), 50)` has an alpha of 0.25, not 0.5. Apply `fade` once, to an opaque colour, or use [[withAlpha()]] to set an exact alpha.

A computed percent outside 0 to 100 is not refused. The resulting alpha is kept within 0 to 1, so a percent above 100 gives an invisible colour and a negative one makes the colour more opaque. Hold a computed percent in range with [[clamp()]].

As a guide, a fill between two plots wants roughly `fade(c, 85)` to `fade(c, 95)`, and a whole-bar [[background()]] more than that.

**See also.** [[withAlpha()]], [[alpha()]], [[fill()]], [[background()]]

{{entry: withAlpha()}}

The same colour with its alpha set to `a`, from 0 (invisible) to 1 (opaque), whatever alpha it had before. Reach for it when you compute an opacity from data, or when a colour may already be partly transparent.

```openscript
r = rsi(close, 14)
// Readings far from 50 are drawn solidly; readings near 50 fade to 20 percent opacity.
strength = clamp(abs(r - 50) / 50, 0.2, 1)
plot(r, "RSI", withAlpha(purple, strength), width = 2)
```

**Remarks.** It sets the alpha rather than scaling it, so `withAlpha(fade(aqua, 88), 1)` is plain `aqua` again. A computed `a` outside 0 to 1 is clamped.

**See also.** [[fade()]], [[alpha()]], [[rgba()]]

{{entry: alpha()}}

The alpha of a colour, from 0 (invisible) to 1 (opaque). Use it when a colour comes out of a calculation and you need to know how visible it is, for example to keep a blended line from fading away altogether.

```openscript
r = rsi(close, 14)

// Blend from a faint grey near 50 to a solid purple at the extremes.
weight = clamp(abs(r - 50) / 30, 0, 1)
shade  = mix(fade(silver, 90), purple, weight)

// A line nobody can see is no use: keep it at least 40 percent opaque.
lineColour = isNone(shade) ? none : alpha(shade) < 0.4 ? withAlpha(shade, 0.4) : shade
plot(r, "RSI", lineColour, width = 2)
```

**Remarks.** Every named colour has an alpha of 1. A hex alpha byte is divided by 255, so `alpha(#ff880080)` is about 0.502, and `alpha(fade(aqua, 88))` is 0.12. The alpha of an absent colour is absent.

**See also.** [[withAlpha()]], [[fade()]], [[mix()]]

## Blending

{{entry: mix()}}

A blend of two colours: `weight` 0 gives `a`, 1 gives `b`, and 0.5 gives the colour halfway between. Compute the weight from a value and you have a colour scale, such as candles that grow redder as volume rises.

```openscript title="Volume heat"
version 1
study("Volume heat", overlay = true)

hottest = input(3.0, "Volume multiple that counts as hot", min = 1.5, max = 10)

rv = relativeVolume(20)

// Volume at its average gives 0, volume at the hot multiple gives 1.
// The clamp keeps one enormous bar from pushing the weight past red.
weight = clamp((rv - 1) / (hottest - 1), 0, 1)

// Absent during warmup, which leaves the candles their own colour.
barColor(mix(silver, red, weight))
```

**Remarks.** All four channels are blended, alpha included. Red, green and blue are then rounded to whole numbers, halves away from zero, so `mix(red, blue, 0.3)` is `#b3004dff`. A weight outside 0 to 1 is not refused: the blend carries on past the far colour and each channel is then clamped to its range, which is rarely the colour you meant. Clamp the weight first, as above. An absent weight gives an absent colour.

**See also.** [[gradient()]], [[clamp()]], [[barColor()]]

{{entry: gradient()}}

Will place a value between two bounds and return the matching colour between two colours, the colour scale above in one call. Until it ships, compute the weight with [[clamp()]] and blend with [[mix()]], as the Volume heat example shows.

## Where colours go

A constant colour and a colour computed per bar go in the same argument. Some surfaces fix their colour before the first bar and accept only a constant: a named colour, a hex literal, a colour built from literals such as `fade(red, 40)`, or a colour [[input()]] passed in as it is. A colour that changes from bar to bar there is [OS3003](/script/errors/arguments#os3003).

| Surface | Takes a colour per bar |
|---|---|
| [[plot()]] `color` | Yes |
| [[fill()]] `color`, `colorUp`, `colorDown` | Yes |
| [[barColor()]] and [[background()]] | Yes, the usual case |
| [[cell()]] `textColor` and `bgColor` | Yes, read each time the cell is written |
| [[table()]] `textColor` and `bgColor` | No, fixed before the first bar |
| [[level()]] `color` | No, fixed before the first bar |
| [[signal()]] `color` | No, fixed before the first bar |

**An absent colour switches the paint off.** `barColor(none)` leaves the candle its own colour and `background(none)` leaves the bar unshaded. That is how a conditional colour turns itself off, and it is not an error:

```openscript
risky = atr(14) > 2 * atr(100)
background(risky ? fade(red, 92) : none)
```

A plot is different: a bar whose colour is absent is drawn in the plot's own colour, the one on the Style tab of the settings dialog. To leave a gap in a plot, make its value absent instead.

Letting the reader choose a colour is one line: `input(aqua, "Line colour")` puts a colour swatch in the settings dialog. The swatch picks red, green and blue only; a colour chosen there keeps the alpha of the input's default, so `input(fade(aqua, 50), "Band colour")` stays half transparent whatever the reader picks. See [[input()]].

## Related

[Colors guide](/script/visuals/colors), [Plots](/script/visuals/plots), [Fills](/script/visuals/fills), [Bar colouring and backgrounds](/script/visuals/bar-coloring-and-backgrounds), [Types and values](/script/language/types-and-values), [Plotting](/script/reference/plotting), [Inputs](/script/reference/input).
