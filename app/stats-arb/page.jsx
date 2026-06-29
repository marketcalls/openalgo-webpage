import { ArrowRight, LineChart } from "lucide-react";
import Link from "next/link";

import { CHAPTERS, PARTS, TAG_CLASS } from "@/lib/statsArbCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const LANDING_DESC =
  `A free, expert, brutally honest ${CHAPTERS.length}-chapter course on statistical arbitrage with NSE equities. Stationarity and cointegration, pairs and baskets, dynamic hedge ratios with the Kalman filter, market-neutral books, honest backtesting and the path to real trading. Every result computed on real OpenAlgo data, gross and net, in-sample and out-of-sample, with an honest line between a statistical relationship and a tradable edge.`;

export const metadata = {
  title: { absolute: `Statistical Arbitrage - A Free ${CHAPTERS.length}-Chapter Expert Course for NSE Equities | OpenAlgo` },
  description: LANDING_DESC,
  keywords: [
    "statistical arbitrage", "pairs trading", "cointegration", "mean reversion", "stat arb india",
    "kalman filter hedge ratio", "johansen test", "market neutral", "factor neutral", "nse equities",
    "engle granger", "ornstein uhlenbeck half life", "deflated sharpe", "backtest overfitting", "openalgo",
  ],
  alternates: { canonical: "/stats-arb" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/stats-arb",
    title: `Statistical Arbitrage - A Free ${CHAPTERS.length}-Chapter Expert Course for NSE Equities`,
    description: LANDING_DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Statistical Arbitrage course by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Statistical Arbitrage - A Free ${CHAPTERS.length}-Chapter Expert Course for NSE Equities`,
    description: LANDING_DESC,
    images: [OG_IMAGE],
    creator: "@openalgoHQ",
    site: "@openalgoHQ",
  },
};

function Tag({ t }) {
  return <span className={`ex-tag tag-${TAG_CLASS[t] || "idx"}`}>{t}</span>;
}

const COURSE_LD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Statistical Arbitrage",
  description: LANDING_DESC,
  url: "https://openalgo.in/stats-arb",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
  about: ["Statistical Arbitrage", "Pairs Trading", "Cointegration", "Mean Reversion", "Market Neutral Investing", "Indian Stock Market"],
  teaches: PARTS.flatMap((p) => p.chapters.map((c) => c.title)),
  numberOfCredits: CHAPTERS.length,
};

export default function StatsArbCourseHome() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_LD) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 obsidian-grid" aria-hidden="true" />
        <div
          className="glow-orb"
          style={{ width: 420, height: 420, top: -120, right: -60, background: "hsl(220 100% 84% / 0.16)" }}
          aria-hidden="true"
        />
        <div
          className="glow-orb"
          style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(140 72% 53% / 0.14)" }}
          aria-hidden="true"
        />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant">
            <LineChart className="h-3.5 w-3.5 text-secondary" />
            {CHAPTERS.length} chapters &middot; pairs to market-neutral &middot; real NSE data
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="bg-linear-to-r from-secondary via-primary to-tertiary bg-clip-text text-transparent">
              Statistical
            </span>{" "}
            Arbitrage
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl text-lg text-on-surface-variant">
            For traders who want the real thing, not the pitch. Cointegration and pairs, baskets, dynamic
            hedges and market-neutral books, on NSE equities, with every result shown gross and net,
            in-sample and out-of-sample. Brutally honest about the line between a statistical relationship
            and a tradable edge.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/stats-arb/what-is-statistical-arbitrage"
              className="inline-flex items-center gap-2 rounded-xl gradient-cta px-6 py-3 font-medium text-primary-foreground hover-lift"
            >
              Start Chapter 1 <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#modules"
              className="inline-flex items-center rounded-xl border border-border surface-low px-6 py-3 font-medium text-on-surface hover:surface-container transition-colors"
            >
              Browse all chapters
            </a>
          </div>
          <div className="reveal reveal-5 mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {[
              [String(CHAPTERS.length), "Chapters"],
              [String(PARTS.length), "Modules"],
              ["NSE", "Equity data"],
            ].map(([v, k]) => (
              <div key={k}>
                <div className="text-3xl font-bold bg-linear-to-r from-secondary to-tertiary bg-clip-text text-transparent">
                  {v}
                </div>
                <div className="font-label text-xs uppercase tracking-wider text-on-surface-variant/70">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <div id="modules" className="px-6 sm:px-10 lg:px-14 py-14">
        {PARTS.map((part) => (
          <section key={part.id} className="mt-12 first:mt-0">
            <div className="flex items-baseline gap-3">
              <span className="font-label text-secondary text-sm tracking-wide">MODULE {part.id}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{part.name}</h2>
            </div>
            <p className="mt-1 mb-5 text-on-surface-variant">{part.desc}</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {part.chapters.map((ch) => (
                <Link
                  key={ch.n}
                  href={`/stats-arb/${ch.slug}`}
                  prefetch={false}
                  className="group obsidian-card hover-lift ghost-border rounded-2xl p-5"
                >
                  <div className="font-label text-xs text-on-surface-variant/70">Chapter {String(ch.n).padStart(2, "0")}</div>
                  <h3 className="mt-1.5 text-base font-semibold text-on-surface group-hover:text-secondary transition-colors">
                    {ch.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{ch.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ch.tags.map((t) => (
                      <Tag key={t} t={t} />
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
        <p className="mt-14 border-t border-border pt-6 text-center text-sm text-on-surface-variant/70">
          For education only - not investment advice. A research-grade model on NSE equity data, with honest
          notes on what it takes to trade it. {CHAPTERS.length} chapters, built on the OpenAlgo SDK.
        </p>
      </div>
    </div>
  );
}
