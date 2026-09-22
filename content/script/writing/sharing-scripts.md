---
title: Sharing scripts
description: Package an OpenScript file so someone else can use it correctly, with a header comment, clear inputs, a README, a licence, version numbers and a changelog.
---

This page shows how to package an OpenScript script (OpenScript is also called OpenAlgo Script) so that someone who did not write it can use it correctly, and how to version it so that nobody's chart, backtest or running strategy changes underneath them. You need it the first time you give a study to a colleague, post a strategy for others, or come back to your own script after six months.

## What sharing means here

A script is a plain text `.oscript` file. Sharing it means giving someone that text with enough around it that they can use it without asking you questions. Someone using the /trading page pastes it into a new script in the Scripts panel. There is no store to submit to and no approval step, which puts the whole job of being usable on the file and what travels with it.

{{screen: scripts-panel}}

What you share is a package, not only code:

| Part | Needed | Holds |
|---|---|---|
| The script file, `.oscript` | Yes | The code, with a header comment |
| A README | Yes | What it does, what it needs, what it does not do, and the inputs |
| A licence | Yes | What others may do with it. Without one, legally, nothing |
| A changelog | From the second version | What changed, and whether the numbers moved |
| Test bars and settings | Strongly recommended | The data and inputs your published numbers came from |
| A version number | Yes | In the file name, in the header, and in the study's title |

## The header comment

The first thing in the file, before `version 1`, is prose. This is the one place in a script where a comment says **what** rather than why, because it is the only part most readers look at before running it. See the [Style guide](/script/writing/style-guide#comments) for comments everywhere else.

```openscript title="Deviation bands 1.2.0"
// Deviation bands, version 1.2.0
//
// A simple moving average with bands a chosen number of standard deviations
// above and below it, and a marker on the bar the source closes above the
// upper band.
//
// Needs: only the chart's own bars. No volume, no other instrument and no
// session information.
// Warmup: the bands are absent until bar length - 1, which at the default
// length of 20 is the first 19 bars of the chart.
// Repaints: no. There is no higher timeframe read, and the marker waits for
// the bar to close.
// Built for: any instrument and interval. Tested on daily and 5 minute bars
// of a liquid NSE index future.
// Does not: place orders, size a position or say anything about direction.
//
// Licence: Apache-2.0. See LICENSE beside this file.

version 1

study("Deviation bands 1.2", overlay = true, precision = 2, group = "Volatility")

length = input(20, "Length, in bars", min = 2, max = 500,
        tooltip = "Bars in both the average and the deviation")
widthDev = input(2.0, "Band width, in standard deviations", min = 0.1, max = 10,
        group = "Bands")
src = input(close, "Source")

basis = sma(src, length)
dev = widthDev * stdev(src, length)
upper = basis + dev
lower = basis - dev

plot(basis, "Basis", orange, width = 2)
upperPlot = plot(upper, "Upper", silver)
lowerPlot = plot(lower, "Lower", silver)
fill(upperPlot, lowerPlot, fade(silver, 92))

if crossUp(src, upper)
    signal("BREAK UP")
```

Each line of that header does a specific job.

- **The version is in the header and in the title.** The title is the name in the chart legend and in the Indicators dialog, so someone with two versions of a study on one chart can tell them apart without opening the settings. (`short` sets a shorter legend name for a host that shows one; the /trading chart shows the title.)
- **"Needs" is a compatibility statement.** A study that needs [[volume]] draws nothing on an instrument whose data carries none, and the reader should learn that from the header rather than from an empty pane.
- **"Warmup" is stated in bars and at the default setting.** Warmup is exact in this language, so it can be stated exactly. See [Warmup](/script/language/warmup).
- **"Repaints" is stated even when the answer is no.** The answer can be checked from the source, because a read that repaints has to name its mode on the line that does it. Saying so saves every reader that check. See [Repainting](/script/data/repainting).
- **"Built for"** tells a reader whether they are the intended user.
- **"Does not"** prevents most misunderstandings, and it is the line everybody leaves out.

The `group` and `tooltip` arguments of [[input()]] matter more than they look. The settings dialog is the only documentation many users will ever read, so write titles as full phrases with units, group related rows under a heading, and put what a title is too short to say in a tooltip. The /trading study settings dialog does not show group headings or tooltips in this release, so the title has to carry the meaning on its own there; the input forms of the Backtest and Strategies panels show the tooltip when you rest the pointer on an input's label. The `group` on `study()` is different: it is the category a picker files the study under. In the /trading Indicators dialog your own scripts are listed together under **My scripts**, and the group is the label shown beside a script's name when you point at it. See [Settings and style](/script/inputs/settings-and-style).

{{screen: study-settings}}

## Versioning

Use three numbers, and give them the meanings a reader of a trading script needs.

| Part | Increase it when | Examples |
|---|---|---|
| Major | **The numbers change** for the same inputs on the same bars | Switching a deviation from the population to the sample divisor; changing a window to exclude the current bar; fixing a wrong formula |
| Minor | Behaviour is added, but existing numbers do not move | A new optional plot; a new input whose default reproduces the old behaviour; a new alert |
| Patch | Nothing you can observe changes | A comment, a rename, a faster calculation that gives identical output on every bar |

The test for a major version is mechanical: run the old and the new version over the same fixed bars with the same settings and plot the difference, as in [Testing scripts](/script/writing/testing#compare-two-implementations). If the difference is not a flat zero on every bar, it is a major version, whatever the change looked like.

This is the same promise the language makes about itself: a fix that changes a number is a version change, because a chart that silently redraws itself after an update is worse than one that is slightly wrong in a documented way.

```openscript
length = input(20, "Length, in bars", min = 2, max = 500)
widthDev = input(2.0, "Band width, in standard deviations", min = 0.1, max = 10)

// 1.0.0: the population divisor.
dev = widthDev * stdev(close, length)
plot(dev, "Deviation")
```

```openscript
length = input(20, "Length, in bars", min = 2, max = 500)
widthDev = input(2.0, "Band width, in standard deviations", min = 0.1, max = 10)

// 2.0.0: the sample divisor. Every band value moves, so this is a new major
// version and not an edit to 1.x.
dev = widthDev * stdev(close, length, sample = true)
plot(dev, "Deviation")
```

If both readings have real users, the kinder answer is neither a fork nor a silent change: add an input, keep the old default, and ship it as a minor version.

```openscript
length = input(20, "Length, in bars", min = 2, max = 500)
widthDev = input(2.0, "Band width, in standard deviations", min = 0.1, max = 10)

// 1.1.0: both readings, and the old one is still the default.
sampleDev = input(false, "Use the sample divisor",
        tooltip = "Off reproduces version 1.0.0 exactly")

dev = widthDev * stdev(close, length, sample = sampleDev)
plot(dev, "Deviation")
```

## A shared version never changes

**Once a version is shared, its file never changes again.** Not for a typo in a comment, not for a one character fix, not because nobody has downloaded it yet. A change becomes a new version number.

This is not ceremony. It is the only thing that keeps these true:

- **Results stay reproducible.** A number someone quotes from a chart or a backtest is only checkable if the exact file that produced it still exists. A shared file that changes while keeping its name breaks that link, and every number anyone quoted from it becomes impossible to check. The Scripts panel on the /trading page keeps no revision history, only the previous save as a backup, so keeping old versions is your job. See [The editor](/script/getting-started/the-editor).
- **A bug report can be answered.** "Version 1.2.0 on these bars gives 41.7" is a report you can act on. "The latest version gives 41.7" is not, if the latest version has been three different files.
- **Nothing changes under someone's running strategy.** A person running version 1.2.0 with a position open needs 1.2.0 to stay exactly what it was until they choose to move.

In practice:

- Put the version in the file name, in the header, and in the declaration's title. Each is visible in a different place.
- Keep old versions available. Someone is running one, and their alternative is to stop trusting their own results.
- If a version is dangerous, mark it withdrawn in the changelog and say why, rather than deleting it. A file that vanishes leaves the people who have it no way to find out what was wrong.
- A file you have given to one person is shared. The rule is about whether anyone else has it, not how many.

## The changelog

One entry per version, newest first, and each entry answers one question before anything else: **did the numbers move?**

```text
## 2.0.0

Numbers changed. The deviation now uses the sample divisor, so every band
value differs from 1.1.0. Run any backtest that used this study again.

## 1.1.0

Numbers unchanged with default settings. Adds a "Use the sample divisor"
input, off by default, which reproduces 1.0.0 exactly.
Adds an alert on a close outside the upper band.

## 1.0.0

First release.
```

Three kinds of change cover everything, in this order of importance: numbers changed, behaviour changed, appearance changed. Someone deciding whether to upgrade a study that a strategy depends on needs the first line and nothing else.

## The README

The README carries what does not fit in the header. A workable template:

**What it does.** Two or three sentences in the language a trader uses rather than the language the code uses. Say what the lines on the chart mean, not which functions produced them.

**The inputs.** A table, because a settings dialog is a list and a list does not explain how rows relate.

| Input | Default | Range | Means |
|---|---|---|---|
| Length, in bars | 20 | 2 to 500 | Bars in both the average and the deviation |
| Band width, in standard deviations | 2.0 | 0.1 to 10 | Distance from the average to each band |
| Source | `close` | Any price | Which price the average is computed from |

**What it needs.** Volume, a session, another instrument, a minimum history, a particular timeframe. Each of these turns into an empty pane or a wrong number when it is missing, and each is invisible in the code to someone who does not read the whole file. An NFO options study that reads the underlying index is a good example of a need worth stating.

**Warmup.** How many bars before it draws, as a formula in the inputs, plus what that is at the defaults.

**Whether it repaints, and how.** There are three honest answers. A script whose higher timeframe reads use the default `"confirmed"` mode and that takes no action on an unconfirmed bar does not repaint. A script reading a forming higher timeframe bar (`mode = "developing"`) shows values on the newest bars that move until that higher timeframe bar closes. A script using `mode = "lookahead"` repaints history by design. The /trading legend does not mark a repainting study in this release, so the README is where a reader learns it.

**What it does not do.** The shortest section, and the one that prevents the most disappointment.

**How to reproduce the published numbers.** The bars, the settings and the instrument facts (such as the lot size for an F&O contract) you used, ideally as files beside the script. This is the same material as a test case, so build it once. See [Testing scripts](/script/writing/testing#hold-the-bars-still).

**Known limitations.** Where it is wrong, where it is untested, and what you would not use it for. A limitation you disclose is part of the documentation. A limitation someone else discovers is a bug report and a lost reader.

## A licence

A script shared with no licence grants nobody any rights, whatever you intended. Careful people will not use it, and anyone who uses it anyway does so without permission. Choose a licence, name it in the header and put its full text beside the script as a `LICENSE` file.

There are two broad families:

- **A permissive licence** lets anyone use, modify and redistribute the code, including inside something closed, usually asking only that the notice travels with it.
- **A copyleft licence** requires that derived work is shared under the same terms. That keeps derived work open and, in exchange, keeps it out of closed products.

The two OpenScript libraries, `openalgo-script` on npm (JavaScript and TypeScript) and `openscript` on PyPI (Python), are released under Apache 2.0, a permissive licence, so that any platform can embed the language. A script is not a language, so that reasoning does not automatically carry over to your work. Pick the family that matches what you want to happen to it.

Two related points that are not about licences. A strategy is not investment advice, and a line in the README saying what it is and is not is worth writing. And if your script was built from someone else's shared script, say so and honour their terms: plain text files exist so that where code came from can be seen.

## Before you share: the checklist

| Check | Why |
|---|---|
| The debug harness is gone | Debug plots, panels, labels and prints are noise on someone else's chart, and a debug plot that is always absent earns [OS8009](/script/errors/warnings#os8009) |
| The file compiles with no warnings | Every OS8xxx warning describes a shape that is nearly always a bug, and a clean file tells a reader that anything unusual was meant |
| The `version 1` line is present | Without it the file is compiled as the newest version, which is the one thing that can change under it ([OS8003](/script/errors/warnings#os8003)) |
| Every input has a title, and a range where one makes sense | The settings dialog is the documentation most users read |
| Nothing is typed in that should be an input | A symbol, an exchange, a session window, a date, a lot size |
| No credentials, API keys, account numbers or broker identifiers appear anywhere | A script is a text file that travels |
| The numbers can be reproduced from the bars and settings in the package | [Testing scripts](/script/writing/testing#hold-the-bars-still) |
| The header states needs, warmup, repainting and what it does not do | These four answer most of the questions you would otherwise be asked |
| The version is in the file name, the header and the legend | Three places, each seen in a different context |
| The licence file is present and the header names it | See above |

A file with no version line still compiles, with a warning:

```openscript expect=OS8003
study("No version line")
plot(close, "Close")
```

Here is the last of a debug harness on its way out. It goes to the test folder beside the script, not to the study every reader loads.

```openscript
basis = sma(close, 20)
dev = 2 * stdev(close, 20)

// Remove before sharing: a probe, and a debug plot nobody else wants.
watchBar = input(-1, "Label this bar index, -1 for none")
if bar.index == watchBar
    draw.label(time, high, "basis " + text(basis) + ", dev " + text(dev))
plot(dev, "debug: deviation", fuchsia, scale = "left")

plot(basis, "Basis", orange)
```

See [Debugging](/script/writing/debugging) for what a harness is for.

## After sharing

**When a bug is reported, ask for three things:** the version, the settings and the bars. With those you can reproduce it exactly, because nothing else in the language varies: there is no randomness, no clock reading during a bar other than [[chart.now()]], which the host fixes, and no arithmetic that differs between engines. A report that cannot be reproduced from those three is about the host or the data, and that is worth knowing too.

**When someone says it repaints**, the answer is in the source and takes one line to give. A higher timeframe read names its mode on the line that makes it, the default mode never repaints, and `onUnconfirmed = true` can only appear on the declaration line. Point at the line.

**When you want to change it**, go back to the top of this page. The change is a new version, the changelog says whether the numbers moved, and the old file stays where it is.

**Related.** [Style guide](/script/writing/style-guide), [Testing scripts](/script/writing/testing), [Debugging](/script/writing/debugging), [Limits](/script/writing/limits), [Inputs](/script/inputs/inputs), [Example scripts](/script/getting-started/example-scripts), [Libraries](/script/language/libraries)
