import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import PlaygroundLoader from "@/components/script/PlaygroundLoader"
import ScreenGallery from "@/components/script/ScreenGallery"
import ScreenImage from "@/components/script/ScreenImage"
import SearchButton from "@/components/script/SearchButton"
import { paint } from "@/components/script/StaticCode"
import screensData from "@/content/script/screens.json"
import { SCRIPT_REPO, SCRIPT_VERSION, SITE, firstPageOf, scriptNav } from "@/lib/scriptDocs"

const TITLE = "OpenScript: write a study or a strategy once"
const DESCRIPTION =
  "OpenScript, also called OpenAlgo Script, is an open trading language. Write a study or a strategy once, then plot it, backtest it and trade it through OpenAlgo. Documentation, full reference and an editable playground."
const OG_IMAGE = "/assets/images/og-image.png"

export const metadata = {
  title: { absolute: `${TITLE} | OpenAlgo` },
  description: DESCRIPTION,
  keywords: [
    "OpenScript",
    "OpenAlgo Script",
    "trading language",
    "indicator scripting",
    "strategy backtesting",
    "algo trading India",
    "NSE indicators",
    "openalgo-script",
  ],
  alternates: { canonical: "/script" },
  openGraph: {
    type: "website",
    url: `${SITE}/script`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OpenScript, the open trading language of OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@openalgoHQ",
    site: "@openalgoHQ",
  },
}

const NPM = "https://www.npmjs.com/package/openalgo-script"
const PYPI = "https://pypi.org/project/openscript/"

const FEATURES = [
  {
    mark: "study()  strategy()",
    title: "Studies and strategies in one language",
    body: "A study draws plots, fills, markers and tables on the chart. A strategy adds orders, exits and position sizing. The declaration line is the only difference, so an idea moves from the chart to a backtest without a rewrite.",
    wide: true,
    sample: ['study("EMA cross", overlay = true)', 'strategy("EMA cross, bracketed", capital = 500000)'],
  },
  {
    mark: "no eval",
    title: "Compiles in milliseconds",
    body: "A script compiles to a versioned data program that an engine runs. Nothing is built with eval or new Function, and a typical script compiles in a few milliseconds: the playground above times every keystroke.",
  },
  {
    mark: "diagnose()  hover()",
    title: "Checks as you type",
    body: "The language ships highlight, complete, hover, signature, diagnose and format as plain functions, so any editor can complete, explain and check a script while it is written. Every error has a code, a message and a fix.",
  },
  {
    mark: "Backtest panel",
    title: "Backtests in the browser",
    body: "Pick a strategy, a date range and its inputs in the Backtest panel of /trading, and run it in the browser. The report shows net profit, drawdown and win rate, with every trade and the equity curve they add up to.",
    wide: true,
    steps: ["Pick a strategy", "Set the range and inputs", "Run it in the browser", "Read the report and trades"],
  },
  {
    mark: "analyzer mode",
    title: "Sandbox first, then live",
    body: "Deploy a strategy to sandbox trading (analyzer mode in OpenAlgo) and watch its orders on real market data before you switch it to live trading.",
  },
  {
    mark: "alert()",
    title: "Alerts from scripts",
    body: "Call alert() on the bar a condition is met. The Alerts panel lists every active alert and logs each time one fires.",
  },
  {
    mark: "spec + 2 engines",
    title: "An open specification",
    body: "The language is written down as a specification with a conformance suite. The JavaScript and Python engines run the same compiled programs and are held to the same results.",
  },
]

const LIBRARIES = [
  {
    name: "openalgo-script",
    registry: "npm",
    runtime: "JavaScript and TypeScript",
    body: "The compiler, the engine, the six editor functions and a charts adapter, as ES modules for the browser and Node.",
    install: "npm install openalgo-script",
    registryHref: NPM,
    doc: ["integrate", "javascript"],
  },
  {
    name: "openscript",
    registry: "PyPI",
    runtime: "Python",
    body: "Runs compiled OpenScript programs in pure Python, on a server next to your data and your order routing.",
    install: "pip install openscript",
    registryHref: PYPI,
    doc: ["integrate", "python-engine"],
  },
]

// The screenshots that lead the gallery, in this order; the rest follow in the
// order of content/script/screens.json.
const FEATURED_SCREENS = ["halftrend", "supertrend", "bollinger"]
// The screenshot beside the playground: the first one that exists. HalfTrend
// is the playground's first tab, so the picture shows the code next to it.
const HERO_SCREENS = ["halftrend", "trading-workspace", "supertrend"]

function isReady(section, page) {
  return Boolean(scriptNav.find((s) => s.slug === section)?.pages.some((p) => p.slug === page && p.ready))
}

/**
 * A page's link when it is written, or else the first written page of its own
 * section, so a button never lands on a 404 or in an unrelated section.
 */
function pageHref(section, page) {
  if (isReady(section, page)) return `/script/${section}/${page}`
  return firstPageOf(section) ?? "/script#docs"
}

function Kicker({ children, id }) {
  return (
    <p id={id} className="font-label text-label-md uppercase text-on-surface-variant">
      {children}
    </p>
  )
}

export default function ScriptLandingPage() {
  const introHref = pageHref("getting-started", "introduction")
  // The reference opens on its first page, where /script/reference redirects.
  const referenceHref = firstPageOf("reference") ?? "/script#docs"
  const quickstartHref = pageHref("getting-started", "quickstart")
  // Shown only once the page is written, so the link never points at a 404.
  const basicsHref = isReady("getting-started", "language-basics") ? "/script/getting-started/language-basics" : null
  const allScreens = screensData.screens || {}
  const rank = (id) => {
    const i = FEATURED_SCREENS.indexOf(id)
    return i === -1 ? FEATURED_SCREENS.length : i
  }
  // Array.prototype.sort is stable, so screens outside the featured list keep
  // their order from the JSON.
  const screens = Object.entries(allScreens)
    .map(([id, s]) => ({ id, ...s }))
    .sort((a, b) => rank(a.id) - rank(b.id))
  const heroId = HERO_SCREENS.find((id) => allScreens[id])
  const hero = heroId ? allScreens[heroId] : null
  const totalPages = scriptNav.reduce((n, s) => n + s.pages.length, 0)
  const readyCount = scriptNav.reduce((n, s) => n + s.pages.filter((p) => p.ready).length, 0)

  const languageLd = {
    "@context": "https://schema.org",
    "@type": "ComputerLanguage",
    name: "OpenScript",
    alternateName: "OpenAlgo Script",
    url: `${SITE}/script`,
    description: DESCRIPTION,
    version: SCRIPT_VERSION,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    sameAs: [SCRIPT_REPO, NPM, PYPI],
  }

  return (
    <div className="osd-landing">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(languageLd) }} />

      {/* Hero: the language's name, its promise, and the editor itself */}
      <section className="px-4 pt-14 pb-16 md:pt-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
              <span className="osd-pill">v{SCRIPT_VERSION}</span>
              <span className="osd-pill">Apache 2.0</span>
            </div>

            <h1 className="osd-hero-title">OpenScript</h1>
            <p className="mt-3 font-mono text-sm text-on-surface-variant">Also called OpenAlgo Script.</p>

            <p className="osd-hero-tagline">
              Write a study or a strategy once.
              <span className="block text-on-surface-variant/70">Plot it, backtest it, trade it.</span>
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              The open trading language of OpenAlgo. One short script draws on the chart in /trading, backtests in
              the browser, and trades through OpenAlgo, starting in sandbox trading (analyzer mode in OpenAlgo).
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href={introHref} className={buttonVariants({ size: "lg", className: "h-11 px-6" })}>
                Read the introduction
              </Link>
              <Link href={referenceHref} className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6" })}>
                Browse the reference
              </Link>
              <a
                href={SCRIPT_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "ghost", size: "lg", className: "h-11 px-5" })}
              >
                GitHub
              </a>
            </div>

            {basicsHref ? (
              <p className="osd-start">
                <span>New to OpenScript?</span>{" "}
                <Link href={basicsHref} className="osd-start-link">
                  Start with Language basics
                </Link>
              </p>
            ) : null}

            <div className="mt-6 flex justify-center">
              <SearchButton />
            </div>
          </div>

          <div className="osd-hero-stage">
            <div className="min-w-0">
              <PlaygroundLoader />
            </div>
            <div className="osd-hero-side">
              {hero ? (
                <div>
                  <p className="osd-side-label">In /trading</p>
                  <ScreenImage
                    src={`/script/screens/${hero.file}`}
                    alt={hero.alt}
                    caption={
                      heroId === "halftrend"
                        ? "The first tab, halftrend.oscript, running on a BHEL 15 minute NSE chart in the /trading page of OpenAlgo."
                        : hero.caption
                    }
                    eager
                  />
                </div>
              ) : null}
              <div>
                <p className="osd-side-label">In this playground</p>
                <ul className="osd-try">
                  <li>
                    <strong>Hover a name</strong> such as <code>atr</code> or <code>orElse</code> to read its signature
                    and what it does.
                  </li>
                  <li>
                    <strong>Start typing a name</strong> on a new line and pick from the library, with each signature
                    beside it.
                  </li>
                  <li>
                    <strong>Misspell</strong> <code>close</code>. The compiler marks it with an error code and a fix.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the language does */}
      <section className="border-t px-4 py-24" aria-labelledby="osd-features">
        <div className="container mx-auto">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Kicker>What it does</Kicker>
            <h2 id="osd-features" className="mt-4 text-display-md text-on-surface">
              From an idea on a chart
              <span className="block text-on-surface-variant/70">to an order, in one language</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className={`obsidian-card osd-feature rounded-3xl p-6${f.wide ? " lg:col-span-2" : ""}`}>
                <p className="osd-feature-mark">{f.mark}</p>
                <h3 className="mt-4 text-lg font-bold text-on-surface">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{f.body}</p>
                {f.sample ? (
                  <div className="osd-feature-code" aria-hidden="true">
                    {f.sample.map((line) => (
                      <code key={line}>
                        {paint(line).map(([cls, text], i) => (cls ? <span key={i} className={cls}>{text}</span> : text))}
                      </code>
                    ))}
                  </div>
                ) : null}
                {f.steps ? (
                  <ol className="osd-feature-steps">
                    {f.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where it runs: the /trading page */}
      <section className="px-3 py-6 sm:px-6" aria-labelledby="osd-gallery">
        <div className="scheme-dark rounded-[2.5rem] px-4 py-20 sm:px-8 md:py-24">
          <div className="container mx-auto">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Kicker>In /trading</Kicker>
              <h2 id="osd-gallery" className="mt-4 text-display-md text-on-surface">
                Where your scripts run
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
                OpenScript is built into the /trading page of OpenAlgo: write in the Scripts panel, draw on the chart,
                backtest, and deploy, on Indian market instruments.
              </p>
            </div>
            <div className="mx-auto max-w-6xl">
              <ScreenGallery screens={screens} />
            </div>
          </div>
        </div>
      </section>

      {/* Two libraries */}
      <section className="px-4 py-24" aria-labelledby="osd-libraries">
        <div className="container mx-auto">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Kicker>Libraries</Kicker>
            <h2 id="osd-libraries" className="mt-4 text-display-md text-on-surface">
              Two libraries, one language
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              Put OpenScript inside any financial portal. Both are Apache 2.0 with zero dependencies.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            {LIBRARIES.map((lib) => (
              <div key={lib.name} className="osd-lib">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-mono text-xl font-semibold text-on-surface">{lib.name}</h3>
                  <span className="osd-lib-reg">
                    {lib.registry} &middot; {lib.runtime}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{lib.body}</p>
                <div className="osd-lib-install">
                  <span aria-hidden="true">$</span>
                  <code>{lib.install}</code>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={pageHref(lib.doc[0], lib.doc[1])} prefetch={false} className={buttonVariants({ size: "sm", className: "h-9 px-4" })}>
                    Read the guide
                  </Link>
                  <a href={lib.registryHref} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", size: "sm", className: "h-9 px-4" })}>
                    {lib.registry}
                  </a>
                  <a href={SCRIPT_REPO} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "ghost", size: "sm", className: "h-9 px-4" })}>
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The documentation, section by section */}
      <section id="docs" className="border-t px-4 py-24" aria-labelledby="osd-docs">
        <div className="container mx-auto">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Kicker>Documentation</Kicker>
            <h2 id="osd-docs" className="mt-4 text-display-md text-on-surface">
              Everything, from a first study to the full reference
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              {totalPages} pages in {scriptNav.length} sections
              {readyCount < totalPages ? `, ${readyCount} published so far` : ""}.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scriptNav.map((s) => {
              const first = firstPageOf(s.slug)
              const ready = s.pages.filter((p) => p.ready).length
              return (
                <div key={s.slug} className="obsidian-card osd-map-card rounded-3xl p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-bold text-on-surface">
                      {first ? (
                        <Link href={first} prefetch={false} className="osd-map-title">
                          {s.title}
                        </Link>
                      ) : (
                        s.title
                      )}
                    </h3>
                    <span className="osd-map-count">
                      {s.pages.length} {s.pages.length === 1 ? "page" : "pages"}
                    </span>
                  </div>
                  <ul className="osd-map-pages">
                    {s.pages.slice(0, 5).map((p) => (
                      <li key={p.slug}>
                        {p.ready ? (
                          <Link href={`/script/${s.slug}/${p.slug}`} prefetch={false}>
                            {p.title}
                          </Link>
                        ) : (
                          <span className="is-pending">{p.title}</span>
                        )}
                      </li>
                    ))}
                    {s.pages.length > 5 ? <li className="osd-map-more">and {s.pages.length - 5} more</li> : null}
                  </ul>
                  {ready === 0 ? <p className="osd-map-note">Being written</p> : null}
                </div>
              )
            })}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-on-surface-variant">
            For AI assistants: <a className="osd-inline-link" href="/script/llms.txt">llms.txt</a> maps the
            documentation, and <a className="osd-inline-link" href="/script/openscript-reference.md">openscript-reference.md</a>{" "}
            holds all of it as one markdown file.
          </p>
        </div>
      </section>

      {/* Close */}
      <section className="scheme-dark px-4 py-24 md:py-28">
        <div className="container mx-auto text-center">
          <h2 className="mx-auto max-w-3xl text-display-md text-on-surface">Write your first study</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-on-surface-variant">
            The quickstart takes five minutes: open the Scripts panel in /trading, write a study, and put it on an NSE
            chart.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={quickstartHref} className={buttonVariants({ size: "lg", className: "h-11 px-6" })}>
              Start the quickstart
            </Link>
            <Link href={referenceHref} className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6" })}>
              Browse the reference
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
