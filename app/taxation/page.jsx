import { ArrowRight, Receipt } from "lucide-react";
import Link from "next/link";

import { CHAPTERS, PARTS, TAG_CLASS } from "@/lib/taxationCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const LANDING_DESC =
  "A free, modern, beginner-friendly 19-chapter course on tax for anyone who trades or invests in India - in plain English, with real case studies. Learn the three income buckets, the old and new regimes, advance tax and the deadlines, capital gains and STT on shares, why intraday is speculative, why F&O is business income (and how turnover, audit and loss set-off actually work), tax on US stocks and the Schedule FA disclosure most people miss, crypto's flat 30 percent and its derivatives grey area, and how to choose the right ITR. Every rule is shown with a worked example. Educational only, not tax advice - always confirm with a qualified chartered accountant before you file.";

export const metadata = {
  title: { absolute: "Taxation for Traders and Investors - A Free Course | OpenAlgo" },
  description: LANDING_DESC,
  keywords: [
    "taxation for traders", "trading taxes india", "tax for traders and investors", "capital gains tax india",
    "stt and charges", "intraday trading tax", "f&o tax", "f&o turnover and audit", "f&o business income",
    "tax on us stocks", "schedule fa", "crypto tax india", "which itr form", "openalgo",
  ],
  alternates: { canonical: "/taxation" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/taxation",
    title: "Taxation for Traders and Investors - A Free Course",
    description: LANDING_DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Taxation for Traders and Investors course by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxation for Traders and Investors - A Free Course",
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
  name: "Taxation for Traders and Investors",
  description: LANDING_DESC,
  url: "https://openalgo.in/taxation",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
  about: ["Taxation", "Capital Gains Tax", "F&O Taxation", "Crypto Tax", "Income Tax India", "ITR Filing"],
  teaches: PARTS.flatMap((p) => p.chapters.map((c) => c.title)),
  numberOfCredits: CHAPTERS.length,
};

export default function TaxationCourseHome() {
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
            <Receipt className="h-3.5 w-3.5 text-tertiary" />
            {CHAPTERS.length} chapters &middot; plain English &middot; real Indian case studies
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="bg-linear-to-r from-tertiary via-secondary to-primary bg-clip-text text-transparent">
              Taxation
            </span>{" "}
            for Traders and Investors
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl text-lg text-on-surface-variant">
            Confused about how your trading and investing profits are taxed? Start right here. A modern, beginner-first
            course that takes you from the three income buckets to capital gains, F&amp;O business income, US stocks
            and crypto - explained in plain English with real Indian case studies, and honest about the mistakes that
            bring a tax notice years later. Educational only, not tax advice.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/taxation/why-tax-matters"
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
              ["Plain", "English"],
              ["Real", "Case studies"],
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
            Most tax material is written for accountants, not for the people actually placing the trades. This one is
            different. Written for absolute beginners, it builds each idea from the ground up, uses real Indian numbers
            and case studies, and is honest about the single most expensive mistake a trader can make: not reporting at
            all. The goal is to make you understand exactly how each kind of profit is taxed, what you can claim, and
            when an audit applies - so you can ask your chartered accountant the right questions and file with
            confidence. Educational only, not tax advice.
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
                  href={`/taxation/${ch.slug}`}
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
          For education only - not tax advice. {CHAPTERS.length} chapters, with real Indian case studies for beginners. Always confirm with a qualified chartered accountant before you file.
        </p>
      </div>
    </div>
  );
}
