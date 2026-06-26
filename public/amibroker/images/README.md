# AmiBroker course images

This is the single, common place to drop every screenshot used by the
**AmiBroker AFL for Traders** course (`/amibroker`).

## Where images go

Put every image file directly in this folder:

```
public/amibroker/images/
```

A chapter references an image from its markdown (in `content/amibroker/md/chNN.md`)
with the directive:

```
{{image: ch07-rsi-on-chart.png | RSI plotted in its own pane below price | chart}}
```

- The **filename** (`ch07-rsi-on-chart.png`) must match a file in THIS folder.
- The **caption** is shown under the image.
- The **kind** is a small label badge. Allowed kinds:
  - `afl`      - a Formula Editor / code screenshot
  - `chart`    - an applied indicator/chart screenshot
  - `backtest` - a backtest report or equity curve
  - `explore`  - an Analysis-window (Exploration/Scan) result
  - `opt`      - an optimisation result table or heatmap

## Placeholders

Until you drop the real file here, the page renders a labelled **placeholder**
box that shows the caption and the exact path it expects - so nothing breaks and
you always know which image is still missing. As soon as a file with the matching
name exists in this folder and the site is rebuilt, the real screenshot replaces
the placeholder automatically.

## How to add an image

1. Take the screenshot in AmiBroker (the chart, the Formula Editor, or a backtest report).
2. Save it as a `.png` (or `.jpg`) using the exact filename the chapter expects.
   To find the names a chapter needs, search its markdown for `{{image:` in
   `content/amibroker/md/`.
3. Copy it into `public/amibroker/images/`.
4. Rebuild / redeploy (`npm run gen:amibroker` then the normal build). The image
   appears in place of the placeholder.

Tip: keep filenames lowercase, kebab-case, and prefixed with the chapter number
(`ch28-supertrend-chart.png`) so they stay easy to find and never collide.
