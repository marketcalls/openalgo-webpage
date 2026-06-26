import { ArrowRight, CandlestickChart } from "lucide-react";
import Link from "next/link";

import { CHAPTERS, PARTS, TAG_CLASS } from "@/lib/technicalsCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const LANDING_DESC =
  "A free, modern, beginner-friendly 25-chapter course on technical analysis - learn to read real NSE charts the way a professional does. From candlesticks, trends and support/resistance to chart patterns, indicators (RSI, MACD, moving averages, Bollinger Bands), volume, risk management and trading psychology. Built entirely on real Indian daily charts, in plain English with honest facts and stats - not textbook theory. No prior knowledge assumed.";

export const metadata = {
  title: { absolute: "Technical Analysis - A Free, Real-Chart Beginner's Course | OpenAlgo" },
  description: LANDING_DESC,
  keywords: [
    "technical analysis", "technical analysis for beginners", "technical analysis course", "learn technical analysis",
    "how to read stock charts", "candlestick patterns", "chart patterns", "support and resistance",
    "rsi macd moving averages", "indian stock market charts", "nse charts", "openalgo",
  ],
  alternates: { canonical: "/technicals" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/technicals",
    title: "Technical Analysis - A Free, Real-Chart Beginner's Course",
    description: LANDING_DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Technical Analysis course by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Analysis - A Free, Real-Chart Beginner's Course",
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
  name: "Technical Analysis",
  description: LANDING_DESC,
  url: "https://openalgo.in/technicals",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
  about: ["Technical Analysis", "Candlestick Patterns", "Chart Patterns", "Technical Indicators", "Indian Stock Market", "Trading"],
  teaches: PARTS.flatMap((p) => p.chapters.map((c) => c.title)),
  numberOfCredits: CHAPTERS.length,
};

export default function TechnicalsCourseHome() {
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
          style={{ width: 420, height: 420, top: -120, right: -60, background: "hsl(140 72% 53% / 0.16)" }}
          aria-hidden="true"
        />
        <div
          className="glow-orb"
          style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(220 100% 84% / 0.14)" }}
          aria-hidden="true"
        />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant">
            <CandlestickChart className="h-3.5 w-3.5 text-tertiary" />
            25 chapters &middot; real NSE charts &middot; zero jargon assumed
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="bg-linear-to-r from-tertiary via-secondary to-primary bg-clip-text text-transparent">
              Technical
            </span>{" "}
            Analysis
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl text-lg text-on-surface-variant">
            Want to read a price chart the way a professional does? Start right here. A modern, visual, beginner-first
            course that takes you from &ldquo;what is a candlestick?&rdquo; to trends, patterns and indicators -
            built entirely on real NSE daily charts, with honest facts and stats, not textbook theory. No prior
            knowledge needed.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/technicals/what-is-technical-analysis"
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
              ["25", "Chapters"],
              ["6", "Modules"],
              ["Daily", "Charts"],
            ].map(([v, k]) => (
              <div key={k}>
                <div className="text-3xl font-bold bg-linear-to-r from-tertiary to-secondary bg-clip-text text-transparent">
                  {v}
                </div>
                <div className="font-label text-xs uppercase tracking-wider text-on-surface-variant/70">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this course */}
      <div className="px-6 sm:px-10 lg:px-14 pt-12">
        <div className="rounded-2xl border border-border surface-low p-6 sm:p-8">
          <h2 className="text-lg font-bold text-on-surface">Why this course?</h2>
          <p className="mt-2 max-w-3xl text-on-surface-variant">
            Most &ldquo;technical analysis&rdquo; material is dry theory, drawn on idealised diagrams that never look
            like a real chart. This one is different: written for absolute beginners, every concept is shown on real
            NSE daily data - genuine candles, genuine trends, genuine patterns that worked and plenty that didn&apos;t.
            It is honest about what charts can and can&apos;t do: technical analysis is about probability and risk, not
            certainty. The goal is to make you read a chart with clear eyes so you can make your own informed decisions.
          </p>
        </div>
      </div>

      {/* Modules */}
      <div id="modules" className="px-6 sm:px-10 lg:px-14 py-14">
        {PARTS.map((part) => (
          <section key={part.id} className="mt-12 first:mt-0">
            <div className="flex items-baseline gap-3">
              <span className="font-label text-tertiary text-sm tracking-wide">MODULE {part.id}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{part.name}</h2>
            </div>
            <p className="mt-1 mb-5 text-on-surface-variant">{part.desc}</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {part.chapters.map((ch) => (
                <Link
                  key={ch.n}
                  href={`/technicals/${ch.slug}`}
                  prefetch={false}
                  className="group obsidian-card hover-lift ghost-border rounded-2xl p-5"
                >
                  <div className="font-label text-xs text-on-surface-variant/70">Chapter {String(ch.n).padStart(2, "0")}</div>
                  <h3 className="mt-1.5 text-base font-semibold text-on-surface group-hover:text-tertiary transition-colors">
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
          For education only - not investment advice. {CHAPTERS.length} chapters, built on real NSE charts for beginners.
        </p>
      </div>
    </div>
  );
}
