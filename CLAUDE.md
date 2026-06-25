# OpenAlgo Webpage — Project Notes

Next.js 15 (App Router, React 19, JSX) + Tailwind v4, deployed to Cloudflare
Workers via OpenNext (`npm run deploy`). Three Varsity-style courses live under
`/fundamentals`, `/python`, `/quant`, indexed by `/learn`.

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
