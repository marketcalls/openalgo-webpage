# OpenAlgo Webpage — Project Notes

Next.js 15 (App Router, React 19, JSX) + Tailwind v4, deployed to Cloudflare
Workers via OpenNext (`npm run deploy`). Thirteen Varsity-style courses live
under `/fundamentals`, `/python`, `/quant`, etc., indexed by `/learn`.

## Theme (monochrome, light-first)

- The site is a strict black-and-white theme modeled on openship.ip: white
  page, near-black ink, gray muted text, hairline borders, pill buttons and
  pill nav. There is NO dark/light toggle. All colors flow through the HSL
  tokens in `app/globals.css` (`--background`, `--on-surface`, `--surface-*`,
  etc.). Never reintroduce hued colors; grays only.
- Dark sections: wrap any block in the `scheme-dark` class - it re-declares
  every token so the same components render inverted (see the homepage's inset
  rounded shell and final CTA). IMPORTANT Tailwind v4 gotcha: the theme's
  `--color-*` variables are registered with `@property` and resolve their
  `hsl(var(--x))` indirection AT `:root`, so a scoped override of raw `--x`
  never reaches compiled utilities like `bg-background`. `.scheme-dark` must
  (and does) override the `--color-*` tokens directly as well - keep both
  lists in sync when adding tokens.
- Course lesson pages keep DARK code panels on the light page (the
  inset-dark-surface signature). Syntax highlighting is monochrome-on-dark
  via shade + weight (see `*-portal.css` `.hljs` rules).
- Fonts: Manrope for everything (body + display + labels), IBM Plex Mono for
  code only. Sora was removed.

## i18n (UI-layer only)

- 16 languages via `components/i18n/` - `LanguageProvider` (client context,
  localStorage key `openalgo.lang`, sets `<html lang>`/`dir`, RTL for ur/ar)
  + `LanguageSwitcher` in the navbar + per-locale dictionaries in
  `components/i18n/dictionaries/*.js` (flat keys, `en.js` is the master and
  runtime fallback).
- Non-English dictionaries load via dynamic `import()` so they ship as client
  chunks and are NOT in the Worker bundle (verified: worker.js contains no
  dictionary text). Course long-form content stays English - bundling 16
  translations of course JSON would blow the 3 MiB Worker limit.
- When adding UI strings: add the key to `en.js` first, then every locale
  file (missing keys silently fall back to English).

## Git safety (do not repeat past mistakes)

- NEVER run `git checkout HEAD -- .`, `git checkout -- .`, `git restore .`,
  `git reset --hard`, `git clean -fd`, or any other bulk/destructive git command
  to "tidy" the tree. They silently discard UNCOMMITTED edits. This already cost
  a rebuild once: a stray `git checkout HEAD -- .` reverted in-progress source
  changes (a gutted OG route + a font revert) right before a deploy, so the
  intended build never shipped.
- To revert ONE file to a known commit, scope it explicitly:
  `git checkout <sha> -- path/to/file`. Never widen the pathspec to `.`.
- Removing build artifacts is fine, but target the artifact dirs only
  (`.open-next`, `.next`) with `Remove-Item`/`rm -rf` — never via git.
- Before any deploy, confirm the working tree holds the edits you expect
  (`git status`, grep the changed files) rather than assuming.

## Cloudflare Worker hard limits

- Free plan caps the deployed Worker SCRIPT at **3 MiB** (error code 10027:
  "exceeded the size limit of 3 MiB"). A failed deploy fails at UPLOAD validation
  and does NOT affect production (the previously deployed version keeps serving).
- The baseline OpenNext Next.js Worker already sits just under 3 MiB, so any
  server-bundle addition can tip it over. Known heavy contributors:
  - `next/font/google` (self-hosting) bundles `fontkit` (~815 KB) into the
    Worker. Great for the client (no render-blocking Google Fonts, fixes CLS) but
    too heavy for the 3 MiB free Worker. Use the Google Fonts `<link>` (with
    preconnect) instead, OR self-host fonts MANUALLY as static `public/` assets
    with `@font-face` (no `next/font` runtime) to avoid the fontkit bloat.
  - The dynamic OG route (`app/api/og/route.js`) using `next/og` pulls
    `@vercel/og` (~721 KB x2 ≈ 1.4 MB) into the Worker. It ignored its params and
    fell back to the static image, so it's a static redirect to
    `/assets/images/og-image.png` — keep it that way to preserve headroom.
  - `experimental.inlineCss` is the WORST offender: measured at ~1.6 MiB
    (gzipped) of Worker bloat, because it embeds the CSS into every page's
    server-render output. It alone pushed the Worker from ~1.7 MiB to ~3.3 MiB.
    Do NOT enable it on the free plan — it only saves ~100 ms of render-blocking
    CSS and is not worth losing deployability. (Measured 2026-06: Worker is
    ~1.71 MiB gzipped without it, ~3.31 MiB with it.)
- The course content lives in the Worker because OpenNext renders these App
  Router pages at runtime (they are NOT flat static HTML assets — there are no
  `.html` files under `.open-next/assets/<course>/`). So the content JSON must be
  importable at runtime. A build-time `fs.readFileSync` loader does NOT work:
  it returns empty in the Worker runtime and chapters render the "being written"
  fallback. Keep the static `import data from "./...ContentData.json"`.
- To measure the real Worker size without deploying:
  `wrangler deploy --dry-run --outdir=/tmp/wb` then `gzip -c /tmp/wb/worker.js |
  wc -c`. The 3 MiB limit is on this gzipped Worker SCRIPT, not the "Total
  Upload" figure (which includes static assets).
- Measured 2026-07-19: the Worker is ~3.60 MiB gzipped - ALREADY over the
  free-plan 3 MiB limit, purely from course-content growth (a clean build of
  HEAD measures ~3.61 MiB; the monochrome-theme + i18n changes shrank it
  slightly). Recent deploys apparently succeeded, which implies the account is
  no longer constrained to the free-plan cap - but verify plan status before
  relying on it, and treat any new server-bundle weight with the same caution
  as before.

- Measured 2026-09-23: the Worker is ~5.50 MiB gzipped after adding the /script
  docs (the docs data alone is ~0.96 MiB gzipped). Still under the 10 MiB
  paid-plan limit; measure again before adding more server-side content.
- Measured 2026-09-30: ~5.72 MiB gzipped (wrangler: 5,854 KiB) after the
  openalgo-script 0.8.0 docs, the two product roadmaps (/charts/roadmap and
  /script/roadmap, rendered from lib/roadmaps/*.json) and the section layouts.

- There is a SECOND limit: 64 MiB UNCOMPRESSED (also error 10027, "exceeded
  the uncompressed size limit of 64 MiB"). Gzipped size hides it, because
  repeated per-route code compresses well. Every static App Router route adds
  its own server page.js plus a client-reference manifest (~38 KB together for
  a typical page): 440 static library routes added ~16 MB uncompressed and the
  deploy was refused at 66.3 MiB. Measure both: `ls -la /tmp/wb/worker.js`.
- Measured 2026-10-07: 50.26 MiB uncompressed, 6.25 MiB gzipped (wrangler:
  6,361 KiB) after the OpenScript library, served by ONE dynamic route.

## /script/library (OpenScript indicator library)

- 502 OpenScript studies (2026-10-07): 428 ports of indicators from
  `openalgo-js-indicator-library` (MIT and MPL-2.0 originals only), the
  6 community scripts, 3 originals rewritten as openalgo's own (Ichimoku,
  Supertrend, ADX) and 65 openalgo studies written from formulas. The 57
  GPL-3.0 originals are deliberately NOT published (copyleft combined-work
  risk); their ports are kept outside the repo in
  `D:\OpenAlgo-Voice\openscript-library-gpl`.
- Pipeline: `content/script/library/catalog.json` (from
  `scripts/script-library/catalog.mjs`) + `indicators/<slug>.oscript` and
  `<slug>.json` (page text) -> `scripts/script-library/gen-library.mjs`
  (part of `npm run gen`) -> `lib/scriptLibraryIndex.json`,
  `lib/scriptLibraryPages.json` (read by the one route
  `app/script/library/[slug]/page.jsx`), and `public/script/library/`
  (sources, SVG thumbnails, the fixed
  `btcusd-1h.json` bars). The chart never refreshes: it draws the fixed bars.
- Gate: `npm run check:library -- --strict` runs every port against its
  original JavaScript on the fixed bars under up to 24 settings variants
  (plots, markers, drawings, bar colours, background) and enforces the header,
  the banned words and complete page text. Rules for writing a port:
  `content/script/library/PORTING.md`; one slug: `node
  scripts/script-library/compare.mjs <slug>`.
- Every file starts with the MPL-2.0 header, `// © openalgo`, then
  `// Original work (c) <author>, <licence>` (required by MIT/MPL). Never name
  any brand but openalgo, and never say a script was ported from anything or
  mention Pine Script. Titles carrying a product, trademark or person prefix
  were renamed in `catalog.mjs` (`plainTitle`: "ICT ...", "Meridian - ...",
  setups named after people); inventor-named formulas (Hull, Ehlers,
  McGinley) keep their names. `verify.mjs` and `PORTING.md` deliberately spell
  out the banned names: that is how the gate finds them. They are tooling and
  never ship to a page.
- Data: `content/script/library/btcusd-1h.json`, 1463 hourly BTCUSD bars, Aug 6
  to Oct 6 2026 (UTC), captured once. Parity, thumbnails and the page dates are
  all tied to this file. Replacing it means re-running the gate over all 440
  (some ports may need work), and the thumbnails redraw on the next gen. Never
  make the chart fetch or poll a feed.
- Deviations: a port that cannot match in OpenScript 0.8.1 states why in its
  `<slug>.json` `deviation` field, shown as a note on the page (16 do,
  e.g. table text size or a plot offset that cannot follow a setting). The
  gate still fails unless one of two narrow exemptions holds:
  `deviationVariants: ["<variant label>"]` exempts exactly those settings
  variants (never `defaults`), or every value agrees and the port only draws
  extra bars (an original that paints history backwards once a later bar
  decides it). Do not widen either rule to get a port through.
- openalgo's own studies: a catalog row listed in `OWN_WORK` in `catalog.mjs`
  is written by openalgo rather than ported (Ichimoku Cloud and Supertrend,
  rewritten 2026-10-07 to the user's spec). It carries only the two header
  lines and no credit line, and the gate compares it with a reference
  implementation in `content/script/library/references/<slug>.mjs` instead of
  an original.
- Studies with no JavaScript original (`EXTRA` in `catalog.mjs`): Range
  Filter, AlphaTrend, UT Bot, SSL Hybrid and Candlestick Patterns, converted from open-source
  community scripts the user supplied. These were published open source with
  no other licence named, which the platform publishes as MPL-2.0 by default,
  so each keeps the MPL-2.0 header plus the original author's credit on
  line 3, and is gated against its reference in `references/`. HalfTrend was
  NOT added: its source states GPL-3.0. Check a script's licence before adding
  it; a stated GPL or non-commercial licence is out. UT Bot's source was a
  strategy; the library keeps it as a study (no orders, TP or SL inputs).
- `content/script/library/own-studies.json`: openalgo's own studies written
  from published indicator formulas (Ehlers' articles and the classics that
  circulate as magazine and AFL formulas), one row each. Each was written
  from the formula and then checked by a second agent against the published
  definition. Formulas are not copyrightable but code listings
  are: write each from the definition, never translate a published listing,
  and never name the magazine, platform or site it came from (the gate
  refuses TASC, Stocks & Commodities, AmiBroker, AFL, MetaStock, TradeStation
  and similar). Two-line header, no credit line; the inventor is named in the
  page text. The verified study and its page text are the definition; the
  file holds only slug, title, category and placement. A
  plot offset taken from a setting compiles to `{ input: key }`; the harness
  and the thumbnails resolve it (`plotOffset`), and the chart widens its right
  margin for a plot drawn ahead of the newest bar.
- Parity cannot catch a fault the original itself has: the mihakralj ADX used
  an unstable running sum that reached 1e76, and its port matched it exactly.
  After any batch of changes run `node scripts/script-library/sweep.mjs`, the
  visual sweep (duplicate titles, one colour for unrelated lines, lines too
  dark for the dark chart, a price-pane plot far from price, nothing visible
  in the opening view, values that blow up). It must report 0 flagged. Then
  review the thumbnails by eye; a contact sheet of all of them is quick to make
  with sharp. ADX is now openalgo's own (Wilder's definition, built-in adx()).
- Removed as meaningless on prices, not ported: the exponential, logistic and
  hyperbolic-tangent transforms (e^price overflows, the other two read 1) and
  the mode (prices rarely repeat), plus five duplicate copies of one formula
  (`DUPLICATES` in catalog.mjs). Their files are in
  `D:\OpenAlgo-Voice\openscript-library-dropped`.
- Page metadata may carry `chartSettings` ({ inputKey: value }) when the
  defaults draw nothing on the hourly BTCUSD sample: the page chart, the
  thumbnail and the view use them, the panel says "Shown with ...", and the
  gate checks the keys exist. The defaults stay the original's and parity
  still runs on them. `chartNote` is a line of text under the chart for a
  study that cannot show much on hourly bars (the futures setups).
- A plot `opacity` is a 0 to 1 dimmer: `opacity = 10` meant 10% but draws
  opaque (Projection Bands had it).
- Thumbnails (`public/script/library/thumbs/*.svg`) are drawn by
  `gen-library.mjs` from a real engine run and stamped with a hash of the
  source plus `RENDERER_VERSION`; bump that constant after changing the
  renderer, or old pictures stay.
- The generator owns a marked block in `public/sitemap.xml`
  (`script-library:start` / `script-library:end`); edit the rest of the
  sitemap by hand as before.
- Pages render in the Worker at request time (median ~12 ms in workerd). The
  index cards use `prefetch={false}`, per the CPU-limit note below.
- The porting knowledge also lives in the openalgo repo's skill:
  `.claude/skills/openscript/reference/porting-from-javascript.md` (chart
  helpers whose OpenScript twin differs, e.g. the chart core `ema` is seeded
  with the first value while OpenScript `ema` is SMA-seeded).

## /script documentation (OpenScript)

- Pipeline: `content/script/nav.json` (table of contents) + one markdown page per
  entry -> `scripts/gen-script-docs.mjs` -> `lib/scriptDocsData.json`, the
  public search index, `language.json`, `llms.txt` and the one-file reference.
  Every signature, default, warmup and error in the reference is read from the
  `openalgo-script` package, never typed. Authoring rules: `content/script/AUTHORING.md`.
- Gate: `npm run check:script` (add `--strict` before a deploy). It compiles
  every example with the real compiler and enforces 100% coverage of the
  library manifest and the error catalogue, links, anchors, screenshots and
  the no-brand-names rule.
- Every docs page is a STATIC route, `app/script/<section>/<page>/page.jsx`,
  generated by the gen script. A dynamic `[section]/[page]` route once built,
  passed `next start`, and answered 404 for every page in workerd. The cause
  (found 2026-10-07 on /script/library/[slug]): this site configures no
  incremental cache, so nothing is served from a prerender cache, and with
  `dynamicParams = false` Next answers 404 for every slug it cannot find there.
  A dynamic route WORKS when `dynamicParams` stays at its default (true) and
  the page calls `notFound()` for an unknown slug; /script/library/[slug] does
  this. Always test new routes with `opennextjs-cloudflare preview`.
- Reference manual at `/script/reference/v1`: every IMPLEMENTED name (library
  values and functions, plus keywords, types, operators and the two
  declarations) on one page, grouped by kind. Built by
  `scripts/script-docs/reference-v1.mjs` from the same package facts and the
  same entry markdown as the docs (nothing written twice), plus the argument
  descriptions in `content/script/arguments/<page>.json` (hand-written, one per
  parameter; the check fails on a missing, empty or stale one, and they also
  fill the Description column of the docs parameter tables). The page renders
  only the index on the server (`lib/scriptReferenceV1.json`); the entries are
  a static asset, `public/script/reference-v1.json`, fetched by the client, so
  they add nothing to the Worker. `SectionFrame` drops the docs sidebar for the
  `v1` segment, and the manual claims `/` for its own filter (`data-own-slash`,
  honoured by `DocSearch`; Ctrl+K still opens site search). A new operators-page
  section needs a row in the `OPERATORS` table there, or the check fails.
- Screenshots live in `public/script/screens/` and are listed in
  `content/script/screens.json`. They were captured from the local OpenAlgo
  /trading page: never save over the user's own scripts there, and crop below
  the app nav (it shows the broker badge).

## Worker CPU time limit ("Worker exceeded CPU time limit")

Because course pages render in the Worker at runtime, each request runs the full
Next.js server, and rendering a large chapter can exceed Cloudflare's per-request
CPU limit. This is amplified by RSC prefetch: Next fires a `?_rsc=` request for
every in-viewport `<Link>`, so a course index or the all-chapters SyllabusRail
prefetches ~30 chapters at once - a burst of concurrent heavy renders that trips
the CPU limit. Two mitigations are in place; keep both:
- `enableCacheInterception: true` in `open-next.config.ts` - serves prerendered
  responses from the cache BEFORE running the routing/render layer, so cached
  pages cost little CPU. Safe here because there is no ISR (cache == build-time
  prerender, never stale).
- `prefetch={false}` on the chapter-list `<Link>`s (the three `SyllabusRail.jsx`
  and the three course `page.jsx` landing grids). This stops the viewport-prefetch
  burst. Prev/next nav links keep prefetch (only 2 links, useful UX, no burst).

## Deploy on Windows

- Orphaned `workerd.exe` from a prior `preview` locks `.open-next\assets`,
  causing EPERM on cleanup. Pre-deploy: `Stop-Process` any `workerd`, then
  `Remove-Item -Recurse -Force .open-next .next`.
- Stop `next dev` before deleting `.next` for a build. Stopping the `npx`
  wrapper can leave its `node ...\next\dist\server\lib\start-server.js` child
  holding the port (EADDRINUSE on the next `next dev`); find it with
  `Get-NetTCPConnection -LocalPort 3000` and stop that process.
- DO NOT upgrade to Next 16 and deploy from Windows: `next/og`'s resvg/yoga wasm
  fails to bundle under OpenNext, and the resulting Worker 500s at runtime
  (took production down once; recovered via `wrangler rollback`). If Next 16 is
  ever needed, build/deploy from Linux/WSL/CI, not Windows.
- A failed deploy is safe, but a SUCCESSFUL deploy that then 500s is not — after
  any deploy, verify all routes return 200 and `wrangler rollback <VERSION_ID>`
  immediately if not.

## Content & voice conventions

- No emojis or icons in code or logger output.
- Never name specific brokers in course/marketing copy.
- Never imply data is "live" — say "real" / "latest" market data.
- Never say "paper trading" / "virtual trading" — say "sandbox trading
  (analyzer mode in OpenAlgo)".
- Indian options pricing uses Black-76 off the synthetic future (not
  Black-Scholes).
- Course pipeline: `lib/<c>Curriculum.js` -> `scripts/gen-<c>-content.mjs` ->
  `lib/<c>ContentData.json` -> static `app/<c>/<slug>/page.jsx`. Edit the
  markdown source under `content/`, then run `npm run gen` (or `gen:<course>`).
