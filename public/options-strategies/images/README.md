# Options Strategies - images

The single, common place for every image used by the **Options Strategies**
course (`/options-strategies`): nano-banana block/flow diagrams, seaborn statistical
charts, and the payoff diagrams built from OpenAlgo's own strategy-builder maths on
real market data.

Put every image file directly in this folder:

```
public/options-strategies/images/
```

A chapter references an image from its markdown (`content/options-strategies/md/chNN.md`) with:

```
{{image: payoff-iron-condor.png | The iron condor: a wide, defined-risk profit zone | chart}}
```

- The **filename** must match a file in this folder.
- The **caption** shows under the image.
- The **kind** is a small label badge. Allowed kinds: `diagram` (block diagram),
  `flow` (process flow chart), `data` (seaborn statistical chart), `chart`
  (plotly/payoff chart of real market data), `infographic`, `photo`.

The pre-generated payoff PNGs already live here - do not delete them.

Until a referenced file exists here, the page renders a labelled **placeholder** box
showing the caption and the exact expected path, so nothing breaks. Add the file
and re-run `npm run gen:options-strategies` to swap the placeholder for the real image.
