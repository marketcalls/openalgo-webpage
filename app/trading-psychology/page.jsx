import { ArrowRight, Brain } from "lucide-react";
import Link from "next/link";

import { CHAPTERS, PARTS, TAG_CLASS } from "@/lib/psychologyCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/og/trading-psychology.png";
const LANDING_DESC =
  "A free, beginner-first 24-chapter course on trading psychology and practical risk playbooks for the Indian markets - why your brain sabotages your trades and how to build discipline as a system, when to hedge and when not to, the option-seller and hedger playbook, and a complete risk plan for investors, stock traders, intraday traders, futures traders, option buyers, option sellers and hedgers. Plain English, real Indian examples, checklists.";

export const metadata = {
  title: { absolute: "Trading Psychology & Risk Playbooks - A Free Course for India | OpenAlgo" },
  description: LANDING_DESC,
  keywords: [
    "trading psychology", "trading discipline", "loss aversion", "revenge trading", "fomo trading",
    "trading journal", "hedging strategies india", "option selling risk", "risk management plan",
    "emotional intelligence trading", "trading for beginners india", "openalgo",
  ],
  alternates: { canonical: "/trading-psychology" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/trading-psychology",
    title: "Trading Psychology & Risk Playbooks - A Free Course for India",
    description: LANDING_DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Trading Psychology & Risk Playbooks course by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trading Psychology & Risk Playbooks - A Free Course for India",
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
  name: "Trading Psychology & Risk Playbooks",
  description: LANDING_DESC,
  url: "https://openalgo.in/trading-psychology",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
  about: ["Trading Psychology", "Risk Management", "Hedging", "Options Trading", "Trading Discipline", "Indian Stock Market"],
  teaches: PARTS.flatMap((p) => p.chapters.map((c) => c.title)),
  numberOfCredits: CHAPTERS.length,
};

export default function PsychologyCourseHome() {
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
          style={{ width: 420, height: 420, top: -120, right: -60, background: "hsl(267 100% 87% / 0.16)" }}
          aria-hidden="true"
        />
        <div
          className="glow-orb"
          style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(190 85% 55% / 0.14)" }}
          aria-hidden="true"
        />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant">
            <Brain className="h-3.5 w-3.5 text-secondary" />
            24 chapters &middot; beginner-first &middot; built for India
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="bg-linear-to-r from-secondary via-primary to-tertiary bg-clip-text text-transparent">
              Trading Psychology
            </span>{" "}
            &amp; Risk Playbooks
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl text-lg text-on-surface-variant">
            Most traders do not lose to the market - they lose to themselves. This beginner-first course is the
            second half of staying alive: master your own mind, learn when to hedge and when not to, the
            option-seller and hedger playbook, and a complete, ready-to-use risk plan for every type of
            participant. Plain English, real Indian examples, no jargon assumed.
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/trading-psychology/your-brain-and-markets"
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
                <div className="text-3xl font-bold bg-linear-to-r from-secondary to-tertiary bg-clip-text text-transparent">
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
            You can know every chart pattern and still blow up - because fear, greed and revenge make the decisions
            in the moment. This course treats discipline as a system you build, not a personality you are born with.
            It pairs the psychology with practical playbooks: hedging done honestly, the option-seller's survival
            rules, and a one-page risk plan for whoever you are. Best taken after the Risk Management course.
            Education only - not investment advice.
          </p>
        </div>
      </div>

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
                  href={`/trading-psychology/${ch.slug}`}
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
          For education only - not investment advice. {CHAPTERS.length} chapters, built for beginners to the Indian market.
        </p>
      </div>
    </div>
  );
}
