"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChartCandlestick,
  Code2,
  Github,
  Package,
  PenTool,
  Rewind,
  ShieldCheck,
  Smartphone,
  Terminal,
} from "lucide-react"

/**
 * The charts on this page are the engine running, never pictures of it. That is
 * the page's whole claim, and a reader who switches a tab or drags the live
 * chart has checked it themselves before reading a word of the copy.
 *
 * Every one of them loads client-side only. The site deploys to a Cloudflare
 * Worker with a hard script-size ceiling, and a charting engine in the server
 * bundle would take a serious bite out of it for no benefit: none of this can
 * render without a canvas anyway.
 */

/**
 * Every figure on this page is measured from the published 2.3.0 build, not
 * recalled: `npm run size` for the brotli sizes and the tier registries at
 * runtime for the counts. A marketing page that overstates a bundle size is the
 * one claim a developer will check first.
 */
const VERSION = "2.3.0"
const REPO = "https://github.com/marketcalls/openalgo-charts"
const DOCS = "https://marketcalls.github.io/openalgo-charts"
const NPM = "https://www.npmjs.com/package/openalgo-charts"

const STATS = [
  { value: "102", labelKey: "charts.stat.indicators" },
  { value: "85", labelKey: "charts.stat.drawings" },
  { value: "13", labelKey: "charts.stat.types" },
  { value: "0", labelKey: "charts.stat.deps" },
]

const FEATURES = [
  { icon: Package, titleKey: "charts.f1t", descKey: "charts.f1d" },
  { icon: BarChart3, titleKey: "charts.f2t", descKey: "charts.f2d" },
  { icon: PenTool, titleKey: "charts.f3t", descKey: "charts.f3d" },
  { icon: ChartCandlestick, titleKey: "charts.f4t", descKey: "charts.f4d" },
  { icon: Activity, titleKey: "charts.f5t", descKey: "charts.f5d" },
  { icon: Rewind, titleKey: "charts.f6t", descKey: "charts.f6d" },
  { icon: Terminal, titleKey: "charts.f7t", descKey: "charts.f7d" },
  { icon: Smartphone, titleKey: "charts.f8t", descKey: "charts.f8d" },
  { icon: ShieldCheck, titleKey: "charts.f9t", descKey: "charts.f9d" },
]

/**
 * The tier table, which is the argument the page is really making: you load
 * what you draw. Sizes are brotli, the figure a browser actually pulls.
 */
const TIERS = [
  { name: "openalgo-charts", size: "76.52 KB", descKey: "charts.tier.base" },
  { name: "/indicators", size: "28.19 KB", descKey: "charts.tier.indicators" },
  { name: "/draw", size: "34.53 KB", descKey: "charts.tier.draw" },
  { name: "/widget", size: "42.41 KB", descKey: "charts.tier.widget" },
  { name: "/profile", size: "14.96 KB", descKey: "charts.tier.profile" },
  { name: "/transform", size: "4.44 KB", descKey: "charts.tier.transform" },
  { name: "/trade", size: "7.61 KB", descKey: "charts.tier.trade" },
  { name: "/webgl", size: "6.38 KB", descKey: "charts.tier.webgl" },
]


const SNIPPET = `import { createWidget } from 'openalgo-charts/widget'

createWidget(document.getElementById('chart'), {
  symbol: 'RELIANCE',
  exchange: 'NSE',
  interval: '5m',
  feed: {
    async getBars({ symbol, interval, from, to }) {
      const r = await fetch(\`/api/history?symbol=\${symbol}\`)
      return r.json()   // [{ time, open, high, low, close, volume }]
    },
  },
})`

const LiveBtcChart = dynamic(() => import("@/components/charts/LiveBtcChart"), {
  ssr: false,
  loading: () => <ChartSkeleton height={640} label="Loading the live BTC/USD chart" />,
})

const EmbeddedDemo = dynamic(() => import("@/components/charts/EmbeddedDemo"), { ssr: false })

const ChartTypeCard = dynamic(
  () => import("@/components/charts/demos").then((m) => m.ChartTypeCard),
  { ssr: false, loading: () => <ChartSkeleton height={320} label="Loading demo" /> }
)
const ThemeCard = dynamic(() => import("@/components/charts/demos").then((m) => m.ThemeCard), {
  ssr: false,
  loading: () => <ChartSkeleton height={320} label="Loading demo" />,
})
const IndicatorsCard = dynamic(
  () => import("@/components/charts/demos").then((m) => m.IndicatorsCard),
  { ssr: false, loading: () => <ChartSkeleton height={320} label="Loading demo" /> }
)
const PriceScaleCard = dynamic(
  () => import("@/components/charts/demos").then((m) => m.PriceScaleCard),
  { ssr: false, loading: () => <ChartSkeleton height={320} label="Loading demo" /> }
)

/** A box the size of the chart that will replace it, so nothing jumps on load. */
function ChartSkeleton({ height, label }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl border bg-surface-bright text-sm text-on-surface-variant"
      style={{ height }}
    >
      {label}
    </div>
  )
}

function Kicker({ children }) {
  return (
    <p className="font-label text-label-md uppercase text-on-surface-variant">
      {children}
    </p>
  )
}

export default function ChartsPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-4 pt-16 pb-12 md:pt-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border bg-surface-bright px-3 py-1.5 font-label text-label-md text-on-surface-variant">
                v{VERSION}
              </span>
              <span className="rounded-full border bg-surface-bright px-3 py-1.5 font-label text-label-md text-on-surface-variant">
                Apache-2.0
              </span>
              <span className="rounded-full border bg-surface-bright px-3 py-1.5 font-label text-label-md text-on-surface-variant">
                {t('charts.badge.deps')}
              </span>
            </div>

            <h1 className="text-display-lg text-on-surface">
              {t('charts.hero.title')}
              <span className="block text-on-surface-variant/70">{t('charts.hero.title2')}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              {t('charts.hero.sub')}
            </p>

            {/* Install line, the first thing a developer copies */}
            <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full border bg-surface-bright px-5 py-3">
              <span className="select-none font-mono text-sm text-on-surface-variant">$</span>
              <code className="flex-1 text-left font-mono text-sm text-on-surface">
                npm i openalgo-charts
              </code>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-11 px-6">
                <a href={REPO} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t('charts.cta.github')}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6">
                <a href={DOCS} target="_blank" rel="noopener noreferrer">
                  {t('charts.cta.docs')}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* The live chart, which is the page's opening argument */}
          <div className="mx-auto mt-14 max-w-6xl">
            <LiveBtcChart />
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y px-4 py-10">
        <div className="container mx-auto">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-display-sm text-on-surface">{stat.value}</div>
                <div className="mt-1 font-label text-label-md uppercase text-on-surface-variant">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <Kicker>{t('charts.what.kicker')}</Kicker>
            <h2 className="mt-4 text-display-md text-on-surface">
              {t('charts.what.title')}
              <span className="block text-on-surface-variant/70">{t('charts.what.title2')}</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-on-surface-variant">
              {t('charts.what.p1')}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
              {t('charts.what.p2')}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-14 text-center">
            <Kicker>{t('charts.feat.kicker')}</Kicker>
            <h2 className="mt-4 text-display-md text-on-surface">{t('charts.feat.title')}</h2>
          </div>
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
              <div key={titleKey} className="obsidian-card rounded-3xl p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-surface-bright">
                  <Icon className="h-5 w-5 text-on-surface" />
                </span>
                <h3 className="mb-1.5 mt-4 font-bold text-on-surface">{t(titleKey)}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive demos */}
      <section className="px-3 py-6 sm:px-6">
        <div className="scheme-dark rounded-[2.5rem] px-4 py-20 sm:px-8 md:py-28">
          <div className="container mx-auto">
            <div className="mb-16 text-center">
              <Kicker>{t('charts.shots.kicker')}</Kicker>
              <h2 className="mt-4 text-display-md text-on-surface">{t('charts.shots.title')}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
                {t('charts.shots.sub')}
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
              <ChartTypeCard />
              <ThemeCard />
              <IndicatorsCard />
              <PriceScaleCard />
            </div>

            <div className="mx-auto mt-14 max-w-6xl space-y-5">
              <EmbeddedDemo
                title={t('charts.demo.orderflow')}
                description={t('charts.demo.orderflowDesc')}
                src="https://marketcalls.github.io/openalgo-charts/demos/orderflow/index.html"
                height={600}
              />
              <EmbeddedDemo
                title={t('charts.demo.drawings')}
                description={t('charts.demo.drawingsDesc')}
                src="https://marketcalls.github.io/openalgo-charts/demos/drawings/index.html"
                height={560}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tiers: you load what you draw */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <Kicker>{t('charts.size.kicker')}</Kicker>
            <h2 className="mt-4 text-display-md text-on-surface">{t('charts.size.title')}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              {t('charts.size.sub')}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border">
            {TIERS.map((tier, index) => (
              <div
                key={tier.name}
                className={`flex items-center gap-4 px-5 py-4 sm:px-6 ${
                  index > 0 ? "border-t" : ""
                }`}
              >
                <code className="w-[13rem] shrink-0 font-mono text-sm text-on-surface">
                  {tier.name}
                </code>
                <span className="flex-1 text-sm text-on-surface-variant">{t(tier.descKey)}</span>
                <span className="shrink-0 font-label text-label-md text-on-surface">
                  {tier.size}
                </span>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-5 max-w-3xl text-center text-sm text-on-surface-variant">
            {t('charts.size.note')}
          </p>
        </div>
      </section>

      {/* Install */}
      <section className="border-t px-4 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <Kicker>{t('charts.install.kicker')}</Kicker>
              <h2 className="mt-4 text-display-md text-on-surface">{t('charts.install.title')}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
                {t('charts.install.sub')}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              {/* Steps */}
              <ol className="space-y-6">
                {[1, 2, 3].map((step) => (
                  <li key={step} className="grid grid-cols-[auto_1fr] gap-x-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-surface-bright font-label text-label-md text-on-surface">
                      {String(step).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="pt-1 font-bold text-on-surface">
                        {t(`charts.step${step}t`)}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                        {t(`charts.step${step}d`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Snippet, on the site's inset dark surface */}
              <div className="scheme-dark overflow-hidden rounded-2xl border">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <Code2 className="h-4 w-4 text-on-surface-variant" />
                  <span className="font-label text-label-md text-on-surface-variant">
                    {t('charts.install.snippetLabel')}
                  </span>
                </div>
                <pre className="overflow-x-auto px-4 py-4">
                  <code className="font-mono text-xs leading-relaxed text-on-surface">
                    {SNIPPET}
                  </code>
                </pre>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-on-surface-variant">
              {t('charts.install.note')}
            </p>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="scheme-dark px-4 py-24 md:py-32">
        <div className="container mx-auto text-center">
          <h2 className="mx-auto max-w-3xl text-display-md text-on-surface">
            {t('charts.cta.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-on-surface-variant">
            {t('charts.cta.sub')}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-6">
              <a href={REPO} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {t('charts.cta.star')}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6">
              <a href={NPM} target="_blank" rel="noopener noreferrer">
                <Package className="mr-2 h-4 w-4" />
                {t('charts.cta.npm')}
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-11 px-6">
              <a href={DOCS} target="_blank" rel="noopener noreferrer">
                {t('charts.cta.demo')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
