import screensData from "@/content/script/screens.json"
import { SCRIPT_REPO, SCRIPT_VERSION, SITE, firstPageOf, scriptNav } from "@/lib/scriptDocs"
import manual from "@/lib/scriptReferenceV1.json"

import ScriptLandingClient from "./ScriptLandingClient"

// The reference manual: every implemented name on one page.
const MANUAL_HREF = "/script/reference/v1"
const MANUAL_NAMES = Object.values(manual.counts).reduce((n, c) => n + c, 0)

const TITLE = "OpenScript: write a study or a strategy once"
const DESCRIPTION =
  "OpenScript, also called OpenAlgo Script, is an open trading language. Write a study or a strategy once, then plot it, backtest it and trade it through OpenAlgo. Documentation, full reference and an editable playground."
const OG_IMAGE = "/assets/og/script.png"

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

const LIBRARIES = [
  {
    name: "openalgo-script",
    registry: "npm",
    runtimeKey: "script.lib1Runtime",
    bodyKey: "script.lib1Body",
    install: "npm install openalgo-script",
    registryHref: NPM,
    doc: ["integrate", "javascript"],
  },
  {
    name: "openscript",
    registry: "PyPI",
    runtimeKey: "script.lib2Runtime",
    bodyKey: "script.lib2Body",
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

export default function ScriptLandingPage() {
  const introHref = pageHref("getting-started", "introduction")
  // "The reference" is the manual: every name on one page, filterable.
  const referenceHref = MANUAL_HREF
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

  const libraries = LIBRARIES.map((lib) => ({
    name: lib.name,
    registry: lib.registry,
    runtimeKey: lib.runtimeKey,
    bodyKey: lib.bodyKey,
    install: lib.install,
    registryHref: lib.registryHref,
    docHref: pageHref(lib.doc[0], lib.doc[1]),
  }))

  const sections = scriptNav.map((s) => ({
    slug: s.slug,
    title: s.title,
    first: firstPageOf(s.slug),
    ready: s.pages.filter((p) => p.ready).length,
    pages: s.pages.map((p) => ({ slug: p.slug, title: p.title, ready: Boolean(p.ready) })),
  }))

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
      <ScriptLandingClient
        scriptVersion={SCRIPT_VERSION}
        scriptRepo={SCRIPT_REPO}
        manualHref={MANUAL_HREF}
        manualNames={MANUAL_NAMES}
        introHref={introHref}
        referenceHref={referenceHref}
        quickstartHref={quickstartHref}
        basicsHref={basicsHref}
        screens={screens}
        hero={hero}
        heroId={heroId}
        libraries={libraries}
        sections={sections}
        totalPages={totalPages}
        readyCount={readyCount}
      />
    </div>
  )
}
