import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { CHAPTERS, PARTS, TAG_CLASS } from "@/lib/riskCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const LANDING_DESC =
  "A free, beginner-first 30-chapter course on risk management for the Indian markets - what risk really is, the money-safety system every beginner needs, investor and trader risk, leverage and execution risk, and F&O risk. Plain English, clear diagrams, real Indian examples, checklists and rules. The one skill that keeps you in the game.";

export const metadata = {
  title: { absolute: "Risk Management - A Free Beginner's Course for India | OpenAlgo" },
  description: LANDING_DESC,
  keywords: [
    "risk management", "trading risk management", "stock market risk", "position sizing",
    "stop loss", "money management india", "risk reward ratio", "drawdown", "leverage risk",
    "f&o risk for beginners", "investing risk for beginners india", "openalgo",
  ],
  alternates: { canonical: "/risk-management" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/risk-management",
    title: "Risk Management - A Free Beginner's Course for India",
    description: LANDING_DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Risk Management course by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Risk Management - A Free Beginner's Course for India",
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
  name: "Risk Management",
  description: LANDING_DESC,
  url: "https://openalgo.in/risk-management",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
  about: ["Risk Management", "Position Sizing", "Money Management", "Trading Psychology", "Indian Stock Market", "Personal Finance"],
  teaches: PARTS.flatMap((p) => p.chapters.map((c) => c.title)),
  numberOfCredits: CHAPTERS.length,
};

export default function RiskCourseHome() {
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
          style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(0 80% 63% / 0.12)" }}
          aria-hidden="true"
        />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant">
            <ShieldCheck className="h-3.5 w-3.5 text-tertiary" />
            30 chapters &middot; beginner-first &middot; built for India
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="bg-linear-to-r from-tertiary via-secondary to-primary bg-clip-text text-transparent">
              Risk
            </span>{" "}
            Management
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl text-lg text-on-surface-variant">
            The market does not reward the smartest trader. It rewards the one still standing. This beginner-first
            course teaches the one skill that keeps you in the game - how not to get destroyed - in plain English,
            with clear diagrams, real Indian examples, checklists and simple rules. No jargon assumed.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/risk-management/what-risk-really-means"
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
              ["0", "Jargon assumed"],
              ["India", "Market focus"],
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
            Most beginners learn risk management the hard way - after a big loss. This course flips the order: it
            teaches survival first, profit second. It is written for absolute beginners, kept honest with real
            Indian-market examples, and made genuinely visual with clear diagrams and simple checklists. Whether you
            are an investor, a stock trader, an intraday trader or just starting with F&amp;O, it shows you the
            mistakes before you make them. Education only - not investment advice.
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
                  href={`/risk-management/${ch.slug}`}
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
          For education only - not investment advice. {CHAPTERS.length} chapters, built for beginners to the Indian market.
        </p>
      </div>
    </div>
  );
}
