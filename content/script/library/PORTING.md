# Porting a chart indicator into the OpenScript library

This is the brief for writing one entry of the OpenScript library at
`/script/library`. Each entry is an OpenScript **study** that computes exactly
what one JavaScript chart indicator computes, plus the text of its page.

Read this whole file before writing anything. Then read the two worked entries:

- `content/script/library/indicators/aberration-abber.oscript` (plots, a fill, a
  menu that switches the average, a hand-written recursion)
- `content/script/library/indicators/williams-fractals.oscript` and
  `williams-fractals.json` (point markers on a past bar, and a complete page)

## What you produce, per slug

Your assignment is a list of slugs. Each slug is a row of
`content/script/library/catalog.json`, which names the original
(`file`, relative to `D:\OpenAlgo-Voice\openalgo-js-indicator-library`), the
title, the licence and the exact three header lines.

For each slug write exactly two files and nothing else:

1. `content/script/library/indicators/<slug>.oscript`, the study.
2. `content/script/library/indicators/<slug>.json`, the page text.

Never edit any other file: not the catalog, not the harness, not another
slug's files, not the original library (it is read-only). If you think the
harness is wrong, say so in your final report; do not change it.

## The gate

```
node scripts/script-library/compare.mjs <slug>
```

Run it from `D:\OpenAlgo-Voice\openalgo-webpage`. It prints `PASS` only when:

- **Parity.** The port compiles with the real OpenScript compiler, and on the
  fixed BTCUSD hourly bars (`content/script/library/btcusd-1h.json`, 1463
  bars) every plot, every marker and label time, the count of every kind of
  drawing (box, line, polyline), and the per-bar presence of bar colours and
  background agree with the original. This is checked at the default settings
  and again with each setting changed one at a time (every menu option, every
  switch flipped, every number moved), up to 24 variants. Plot values must
  agree within a relative 1e-6.
- **Source rules.** Lines 1 to 3 are exactly the catalog's `header`, and the
  file declares `study(...)`.
- **Metadata rules.** The `.json` is complete and its text obeys the voice
  rules below.

Iterate until `PASS`. The output names the variant, the plot, the first bar
that differs and the worst relative error, which is usually enough to find the
fault. To see the original's values, run it yourself in Node:

```js
import { loadOriginal, readBars, runOriginal } from "./scripts/script-library/harness.mjs"
```

### When parity is out of reach

Some differences cannot be closed in this OpenScript version (0.8.1), for
example a planned name with no workaround, or a table whose content the
harness does not compare. Only after a real attempt, and only for a specific
cause you can name, add to the metadata:

```json
"deviation": "One plain sentence a reader of the page can understand, saying what differs and why."
```

and report it. A deviation is shown on the page. "I ran out of time" is not a
deviation; neither is a difference you have not located.

## The source file

### Header

Lines 1 to 3 are the catalog's `header`, character for character, then a blank
line, then `version 1`. For example:

```
// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © openalgo
// Original work (c) mihakralj, MIT License

version 1
study("Aberration (ABBER)", overlay = true, precision = 2)
```

### Names and words

The library names no brand except openalgo. In code, comments, titles and page
text, never write: Pine Script or "Pine", any charting platform, any other
indicator vendor, any exchange, broker or data provider, "ICT", "Meridian", or
any person's name except in header line 3. Never say the script was ported,
translated or converted from anything. Comments explain the calculation, not
its history. Comments that mention "Pine" in the original must be rewritten.

No emoji, no icons, no en dashes or em dashes anywhere (a hyphen in a compound
word is fine). Never imply data is live: say "real" or "latest".

### Shape: keep the original's interface

- `study(title, ...)` uses the catalog `title` (not the original name when they
  differ). `overlay = true` when the original's `placement` is `"onchart"`,
  otherwise leave overlay out (a pane of its own). Set `precision` sensibly.
- **Every input variable is named exactly like the original's input `key`**, in
  the same order, with the same label, default, `min`, `max`, `step`,
  `tooltip`, and for a menu the same option **values** (case included). The
  harness drives both with one settings object, so a renamed key or a
  lower-cased option is a failure. A `source` input becomes
  `input(close, "Source")` with the original default series.
- A colour input in the original may be kept as a colour input or dropped; the
  harness does not compare colours.
- **Every visible plot keeps the original plot's `title`**, its colour
  (`style.color`), width (`style.lineWidth`) and kind (`line`, `histogram`,
  `area`, `step`, `column`). A plot the original hides (`style.visible: false`)
  only carries data; omit it unless you need it.
- `fills` become `fill(handleA, handleB, colour, opacity = ...)` on plot
  handles. `levels` become `level(price, title, colour, style = "dashed")`.
- Drawn only on bars where the original draws: a value the original leaves
  `null` is `none` in the port.

### Exactness: compute what the original computes

The original is the specification. Port its arithmetic, not your idea of the
indicator. Most originals implement their own recursions inside `calc`; carry
those across with `var` state, statement by statement.

Where the original calls a chart helper, the OpenScript built-in of the same
name is **not always the same calculation**. Known cases:

| Original helper | Behaviour | In OpenScript |
|---|---|---|
| `ema(values, n)` from the chart core | Seeded with the **first value**, answers from bar 0 | Write the recursion yourself (see `emaFromFirst` in the Aberration entry). The built-in `ema` is SMA-seeded |
| `smaSeededEma(values, n)` | Seeded with the SMA of the first `n` | Built-in `ema` |
| `rma`, `sma`, `wma`, `stdev`, `highest`, `lowest` | Windowed, absent until the window fills | Built-ins of the same name; confirm with the harness |
| `atr`, `rsi` from the chart core | RMA with an SMA seed; restart after a gap | Built-ins usually match; confirm with the harness |
| `trueRange` | Bar 0 is `high - low` | Built-in `trueRange` |
| `nz(x)` style code (`Number.isFinite(x) ? x : 0`) | Absent read as zero | `orElse(x, 0)` |

Never substitute a different formula because it is "the standard one". If the
harness disagrees, the port is wrong.

### OpenScript facts that bite

Read `D:\OpenAlgo-Voice\openalgo\.claude\skills\openscript\SKILL.md` and its
`reference/library.md` (every name, its warmup, and which 95 are planned and not
implemented: reaching for one is OS2020) and `reference/pitfalls.md`. The site
docs under `content/script/` cover the language in full: `language/` (persistence,
functions, control-flow, bars-and-history, absent-values, collections),
`reference/` and `visuals/`.

- **A stateful call inside a branch or a ternary arm only advances on the bars
  where that arm runs** (warning OS8001). Compute every average at the top
  level into its own name, then choose between the names.
- `var x = ...` keeps a value across bars. A plain name starts each bar with no
  value. Inside `fn`, each call site gets its own `var` state.
- Absent is not zero: arithmetic on `none` is `none`. Use `orElse(x, 0)` only
  where the original reads an absent value as zero.
- `x[1]` on bar 0 is `none`. Where the original tests `i > 0`, test
  `bar.index > 0` or `isNone(x[1])`.
- `for i = 0 to n - 1` runs inside one bar; loops have a per-bar budget
  (`content/script/writing/limits.md`).
- `input()` and `plot()` are top level only. A plot that is sometimes hidden
  passes `none` on those bars.
- `signal(text, color = ..., at = "above" | "below" | "price", shape = ...)`
  marks **this** bar, and its position, shape and colour are fixed literals.
  A marker that the original places at a price on an earlier bar (a pivot, a
  fractal) is drawn as a plot with `style = "lineWithMarkers"` and a negative
  literal `offset`, as Williams Fractals does; the harness counts each mark of
  such a plot as a marker event.
- A `draw.label` counts as a marker event at its anchor time. Boxes, lines and
  polylines are counted by kind at the end of the run, so keep the same number
  the original keeps: when the original keeps only the newest N, delete the
  oldest with `draw.delete` as you go.
- `barColor(colour)` and `background(colour)` must paint on exactly the bars the
  original paints.
- `table(...)` and `cell(...)` reproduce the original's table. The harness does
  not compare table contents, so check them by reading: same rows, same
  labels, same numbers.
- Bars are UTC, the interval is one hour, the symbol is BTCUSD, and volume is
  present. Where an original reads the timezone, the port must give the same
  answer in UTC.

## The page text (`<slug>.json`)

```json
{
  "title": "<the catalog title, exactly>",
  "summary": "One sentence, 40 to 200 characters, for the library card.",
  "description": "Two or three paragraphs (at least 60 words) in markdown: what the indicator measures and how it is computed, in plain English.",
  "howToRead": "One or two paragraphs (at least 40 words): how a trader reads it on a chart, what its values and marks mean, and its limits.",
  "settings": [{ "key": "<input key>", "label": "<input label>", "description": "What changing it does." }],
  "faq": [{ "q": "A question a reader would ask", "a": "A direct answer." }]
}
```

- One `settings` entry per input the port declares, in order.
- Two to four FAQ entries, specific to this indicator.
- Write for traders: plain, direct, specific. No hype, no promises of profit,
  no "powerful", no "unlock". Do not invent claims about who invented it or
  when unless the original's header comment states it. Describe the
  calculation the port actually performs.
- The same banned words as the source: no brand but openalgo, no "Pine", no
  "ported", no "live", no dashes other than hyphens, no emoji.
- Use `\n\n` between paragraphs. Markdown emphasis and inline code are fine.

## Your final report

For each slug: PASS, or the exact remaining failure, or the deviation you
declared and why. Then list anything you learned that a future porter needs:
a chart helper whose OpenScript twin differs, a compiler message that misled
you, a planned name you had to work around, a technique that worked. Be
concrete (names, codes, line shapes); these notes go into the OpenScript skill.
