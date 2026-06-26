import { ArrowRight, LineChart } from "lucide-react";
import Link from "next/link";

import { CHAPTERS, PARTS, TAG_CLASS } from "@/lib/amibrokerCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const LANDING_DESC =
  "A free, hands-on 36-chapter course in AmiBroker Formula Language (AFL) - from your first plotted indicator to scanners, complete trading systems, backtesting, optimisation and live order automation. Beginner to intermediate, in plain English, with real AFL code and charts. No heavy programming needed.";

export const metadata = {
  title: { absolute: "AmiBroker AFL - A Free 36-Chapter AFL Coding Course | OpenAlgo" },
  description: LANDING_DESC,
  keywords: [
    "amibroker", "amibroker afl", "afl coding", "amibroker formula language", "learn amibroker",
    "amibroker tutorial", "afl tutorial", "amibroker for beginners", "amibroker backtesting",
    "amibroker exploration", "amibroker scanner", "amibroker trading system", "amibroker strategy",
    "amibroker supertrend", "amibroker vwap", "amibroker automation", "openalgo", "indian stock market",
  ],
  alternates: { canonical: "/amibroker" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/amibroker",
    title: "AmiBroker AFL - A Free 36-Chapter AFL Coding Course",
    description: LANDING_DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "AmiBroker AFL course by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AmiBroker AFL - A Free 36-Chapter Course",
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
  name: "AmiBroker AFL",
  description: LANDING_DESC,
  url: "https://openalgo.in/amibroker",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
  about: ["AmiBroker", "AmiBroker Formula Language", "AFL", "Technical Analysis", "Backtesting", "Trading Systems"],
  teaches: PARTS.flatMap((p) => p.chapters.map((c) => c.title)),
  numberOfCredits: CHAPTERS.length,
};

export default function AmiBrokerCourseHome() {
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
          style={{ width: 420, height: 420, top: -120, right: -60, background: "hsl(190 85% 62% / 0.16)" }}
          aria-hidden="true"
        />
        <div
          className="glow-orb"
          style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(267 100% 87% / 0.14)" }}
          aria-hidden="true"
        />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant">
            <LineChart className="h-3.5 w-3.5 text-primary" />
            36 chapters &middot; indicators to live automation &middot; beginner to intermediate
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              AmiBroker AFL
            </span>
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl text-lg text-on-surface-variant">
            Learn to code in AFL - the language behind one of the fastest backtesting engines a trader or investor
            can own. Built for traders and investors alike, it starts from your very first plotted line and builds up
            to scanners, complete trading systems, backtests and live order automation. No heavy programming - if you
            can read a chart, you can do this.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/amibroker/what-is-amibroker"
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
              ["36", "Chapters"],
              ["8", "Modules"],
              ["AFL", "From scratch"],
              ["India", "Market focus"],
            ].map(([v, k]) => (
              <div key={k}>
                <div className="text-3xl font-bold bg-linear-to-r from-primary to-tertiary bg-clip-text text-transparent">
                  {v}
                </div>
                <div className="font-label text-xs uppercase tracking-wider text-on-surface-variant/70">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AmiBroker */}
      <div className="px-6 sm:px-10 lg:px-14 pt-12">
        <div className="rounded-2xl border border-border surface-low p-6 sm:p-8">
          <h2 className="text-lg font-bold text-on-surface">Why learn AmiBroker?</h2>
          <p className="mt-2 max-w-3xl text-on-surface-variant">
            AmiBroker is a native C++ analysis platform built for speed. It was the world&apos;s first 64-bit
            technical-analysis program for Windows, its formula engine runs across every core of your CPU, and its
            charting renders up to forty times faster than before. In practice that means you can scan thousands of
            symbols or backtest a system over years of history and a basket of stocks in seconds - and that fast
            feedback is exactly what lets you iterate on an idea. AFL is the small, friendly language that drives all
            of it: one formula can be an indicator, a market-wide scan, or a full backtested system.
          </p>
        </div>
      </div>

      {/* Modules */}
      <div id="modules" className="px-6 sm:px-10 lg:px-14 py-14">
        {PARTS.map((part) => (
          <section key={part.id} className="mt-12 first:mt-0">
            <div className="flex items-baseline gap-3">
              <span className="font-label text-primary text-sm tracking-wide">MODULE {part.id}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{part.name}</h2>
            </div>
            <p className="mt-1 mb-5 text-on-surface-variant">{part.desc}</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {part.chapters.map((ch) => (
                <Link
                  key={ch.n}
                  href={`/amibroker/${ch.slug}`}
                  prefetch={false}
                  className="group obsidian-card hover-lift ghost-border rounded-2xl p-5"
                >
                  <div className="font-label text-xs text-on-surface-variant/70">Chapter {String(ch.n).padStart(2, "0")}</div>
                  <h3 className="mt-1.5 text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
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
          For education only - not investment advice. Practise in sandbox trading (analyzer mode in OpenAlgo). {CHAPTERS.length} chapters of AFL, beginner to intermediate.
        </p>
      </div>
    </div>
  );
}
