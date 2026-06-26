# Technical Analysis - images

The single, common place for every image used by the **Technical Analysis**
course (`/technicals`): nano-banana block/flow diagrams, seaborn statistical charts,
and plotly candlesticks built on real OpenAlgo data.

Put every image file directly in this folder:

```
public/technicals/images/
```

A chapter references an image from its markdown (`content/technicals/md/chNN.md`) with:

```
{{image: ch01-candlestick-anatomy.png | A single candle's body and wicks explained | diagram}}
```

- The **filename** must match a file in this folder.
- The **caption** shows under the image.
- The **kind** is a small label badge. Allowed kinds: `diagram` (block diagram),
  `flow` (process flow chart), `data` (seaborn statistical chart), `chart`
  (plotly candlestick of real market data), `infographic`, `photo`.

Until the real file exists here, the page renders a labelled **placeholder** box
showing the caption and the exact expected path, so nothing breaks. Add the file
and re-run `npm run gen:technicals` to swap the placeholder for the real image.
