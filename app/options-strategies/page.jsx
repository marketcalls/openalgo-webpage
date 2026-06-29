import { ArrowRight, GitMerge } from "lucide-react";
import Link from "next/link";

import { CHAPTERS, PARTS, TAG_CLASS } from "@/lib/optionsStrategiesCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/og/options-strategies.png";
const LANDING_DESC =
  "A free, modern course on options strategies for the developing trader. Build all 38 strategies in the OpenAlgo strategy builder, each with an authentic payoff chart and the full nine-metric panel (max profit, max loss, probability of profit, risk to reward, margin and more) drawn from the builder's own maths on real NIFTY data. Read the directional spreads, straddles and strangles, the iron condor, iron fly and butterfly, ratio and back spreads, synthetics, the jade lizard, batman, calendars and diagonals, plus margin, collateral, pledging, penalties and options adjustments, and learn to choose and manage a trade. Some options basics assumed.";

export const metadata = {
  title: { absolute: "Options Strategies - A Free Course for Traders | OpenAlgo" },
  description: LANDING_DESC,
  keywords: [
    "options strategies", "options strategies for beginners", "options strategies course", "option spreads",
    "bull call spread", "iron condor", "straddle and strangle", "butterfly spread",
    "covered call", "jade lizard", "options payoff diagram", "openalgo",
  ],
  alternates: { canonical: "/options-strategies" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/options-strategies",
    title: "Options Strategies - A Free Course for Traders",
    description: LANDING_DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Options Strategies course by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Options Strategies - A Free Course for Traders",
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
  name: "Options Strategies",
  description: LANDING_DESC,
  url: "https://openalgo.in/options-strategies",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
  about: ["Options Strategies", "Option Spreads", "Iron Condor", "Straddle and Strangle", "Payoff Diagrams", "Indian Stock Market"],
  teaches: PARTS.flatMap((p) => p.chapters.map((c) => c.title)),
  numberOfCredits: CHAPTERS.length,
};

export default function OptionsStrategiesCourseHome() {
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
            <GitMerge className="h-3.5 w-3.5 text-tertiary" />
            {CHAPTERS.length} chapters &middot; real payoff charts &middot; zero jargon assumed
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="bg-linear-to-r from-tertiary via-secondary to-primary bg-clip-text text-transparent">
              Options
            </span>{" "}
            Strategies
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl text-lg text-on-surface-variant">
            Ready to combine calls and puts into real, named strategies? A modern, visual course where every one of the
            38 strategies comes with an authentic payoff diagram and the full nine-metric panel, built from
            OpenAlgo&apos;s own strategy-builder maths on real NIFTY data, so you see exactly where you profit, where you
            lose, and where you break even, from simple spreads to the iron condor and beyond.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/options-strategies/the-strategy-builder"
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
              ["38", "Strategies"],
              ["Real", "NIFTY charts"],
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
            Most options-strategy material throws named structures at you with textbook diagrams that never match a
            real trade. This one is different: every strategy is drawn with an authentic payoff diagram and its nine
            numbers from OpenAlgo&apos;s own strategy-builder maths on real NIFTY data. It is honest about the risk on
            each structure, defined or unlimited, and stresses defined risk first. The goal is to make you read any
            payoff with clear eyes and match a strategy to your view, so you can make your own informed decisions.
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
                  href={`/options-strategies/${ch.slug}`}
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
          For education only - not investment advice. {CHAPTERS.length} chapters, built on real payoff charts from real NIFTY data.
        </p>
      </div>
    </div>
  );
}
