# Futures Trading - images

The single, common place for every image used by the **Futures Trading**
course (`/futures`): nano-banana block/flow diagrams, seaborn statistical charts,
and plotly/payoff charts built on real OpenAlgo data.

Put every image file directly in this folder:

```
public/futures/images/
```

A chapter references an image from its markdown (`content/futures/md/chNN.md`) with:

```
{{image: payoff-long-future.png | The long futures payoff is a straight line | chart}}
```

- The **filename** must match a file in this folder.
- The **caption** shows under the image.
- The **kind** is a small label badge. Allowed kinds: `diagram` (block diagram),
  `flow` (process flow chart), `data` (seaborn statistical chart), `chart`
  (plotly/payoff chart of real market data), `infographic`, `photo`.

The pre-generated payoff PNGs already live here - do not delete them.

Until a referenced file exists here, the page renders a labelled **placeholder** box
showing the caption and the exact expected path, so nothing breaks. Add the file
and re-run `npm run gen:futures` to swap the placeholder for the real image.
