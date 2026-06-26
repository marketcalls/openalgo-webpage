import { ArrowRight, Layers } from "lucide-react";
import Link from "next/link";

import { CHAPTERS, PARTS, TAG_CLASS } from "@/lib/optionsBasicsCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const LANDING_DESC =
  "A free, modern, beginner-friendly 14-chapter course on options from absolute zero. If the words call, put and premium mean nothing to you yet, start here: learn what an option is, the two building blocks (calls and puts), premium, strike and expiry, moneyness, intrinsic and time value, and how to read an option chain. Then the four single-leg payoffs drawn as real charts, the Greeks, implied volatility, and the honest risks. Every term is defined in plain English with real Indian market examples. No prior knowledge assumed.";

export const metadata = {
  title: { absolute: "Options Basics - A Free Beginner's Course | OpenAlgo" },
  description: LANDING_DESC,
  keywords: [
    "options trading", "options for beginners", "options trading course", "learn options trading",
    "what is an option", "call and put options", "option premium strike expiry", "moneyness",
    "option chain", "option greeks", "implied volatility", "openalgo",
  ],
  alternates: { canonical: "/options-basics" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/options-basics",
    title: "Options Basics - A Free Beginner's Course",
    description: LANDING_DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Options Basics course by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Options Basics - A Free Beginner's Course",
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
  name: "Options Basics",
  description: LANDING_DESC,
  url: "https://openalgo.in/options-basics",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
  about: ["Options Trading", "Call and Put Options", "Option Chain", "Option Greeks", "Implied Volatility", "Indian Stock Market"],
  teaches: PARTS.flatMap((p) => p.chapters.map((c) => c.title)),
  numberOfCredits: CHAPTERS.length,
};

export default function OptionsBasicsCourseHome() {
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
            <Layers className="h-3.5 w-3.5 text-tertiary" />
            {CHAPTERS.length} chapters &middot; real payoff charts &middot; zero jargon assumed
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="bg-linear-to-r from-tertiary via-secondary to-primary bg-clip-text text-transparent">
              Options
            </span>{" "}
            Basics
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl text-lg text-on-surface-variant">
            Options explained from absolute zero. A modern, visual, beginner-first course that takes you from
            &ldquo;what is an option?&rdquo; to calls and puts, premium, moneyness, the option chain, the four
            payoffs, the Greeks and implied volatility - every term in plain English, every payoff a real chart,
            and honest about why most option buyers lose.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/options-basics/what-is-an-option"
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
              ["Real", "Payoff charts"],
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
            Most options material is either dense maths or get-rich hype. This one is neither: written for absolute
            beginners, it defines every term as it appears, shows every single-leg payoff as a real chart rather than
            an idealised sketch, and is honest about the asymmetry between buyers and sellers. The goal is to make you
            genuinely understand what you are buying or selling - and the risks on each side - before you ever place a
            trade, so you can make your own informed decisions.
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
                  href={`/options-basics/${ch.slug}`}
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
          For education only - not investment advice. {CHAPTERS.length} chapters, built on real payoff charts for beginners.
        </p>
      </div>
    </div>
  );
}
