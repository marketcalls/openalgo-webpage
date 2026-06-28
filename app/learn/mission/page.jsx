import {
  ArrowLeft,
  ArrowRight,
  BellOff,
  Code2,
  Github,
  Layers,
  LineChart,
  RefreshCw,
  ShieldCheck,
  Sigma,
  Target,
  TrendingUp,
  Unlock,
} from "lucide-react";
import Link from "next/link";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const REPO = "https://github.com/marketcalls/openalgo-webpage";

const DESC =
  "Why Open Varsity exists. An open source learning portal for markets, trading, investing and quantitative finance: a modern, transparent and regularly updated alternative to traditional market education, with no ads, no gatekeeping and no hype.";

export const metadata = {
  title: { absolute: "Our Mission - Open Varsity | OpenAlgo" },
  description: DESC,
  alternates: { canonical: "/learn/mission" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/learn/mission",
    title: "Our Mission - Open Varsity",
    description: DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Open Varsity by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Mission - Open Varsity",
    description: DESC,
    images: [OG_IMAGE],
    creator: "@openalgoHQ",
    site: "@openalgoHQ",
  },
};

const DIFFERENTIATORS = [
  { icon: Code2, color: "text-primary", title: "Completely open source",
    body: "Every course, example and chart lives in a public repository. Read it, fork it, improve it." },
  { icon: Unlock, color: "text-tertiary", title: "Zero gatekeeping",
    body: "No paywalls, no sign-up walls, no locked chapters. The whole curriculum is open to everyone." },
  { icon: BellOff, color: "text-secondary", title: "No ads or distractions",
    body: "No advertisements, no upsells, no noise. Just the material and the markets." },
  { icon: RefreshCw, color: "text-primary", title: "Updated every three months",
    body: "The content is revised on a regular cycle so it keeps tracking the markets as they actually are." },
  { icon: LineChart, color: "text-tertiary", title: "Recent market examples",
    body: "Built on current instruments, prices and events, not numbers frozen a decade ago." },
  { icon: Layers, color: "text-secondary", title: "Practical and structured",
    body: "Professionally organised tutorials with a clear path from your first share to a real edge." },
  { icon: Sigma, color: "text-primary", title: "Quantitative in approach",
    body: "Heavier on data, evidence and the mathematics of markets than most retail education dares to be." },
  { icon: ShieldCheck, color: "text-tertiary", title: "Honest about what works",
    body: "Plain explanations of what works, what fails and why, with no hype and no guarantees." },
  { icon: TrendingUp, color: "text-secondary", title: "Continuously improved",
    body: "Shaped by feedback and pull requests, so the material gets better with every cycle." },
];

export default function MissionPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 obsidian-grid" aria-hidden="true" />
        <div className="glow-orb" style={{ width: 420, height: 420, top: -120, right: -60, background: "hsl(267 100% 87% / 0.16)" }} aria-hidden="true" />
        <div className="glow-orb" style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(140 72% 53% / 0.14)" }} aria-hidden="true" />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20 max-w-4xl mx-auto text-center">
          <Link
            href="/learn"
            className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant hover:surface-container transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
            Open Varsity
          </Link>
          <h1 className="reveal reveal-2 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            Why{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              Open Varsity
            </span>{" "}
            exists
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl mx-auto text-lg text-on-surface-variant">
            An open source learning portal for markets, trading, investing and quantitative finance. A modern,
            transparent and regularly updated alternative to traditional market education.
          </p>
        </div>
      </section>

      {/* Mission intro */}
      <section className="px-6 sm:px-10 lg:px-14 py-14 max-w-3xl mx-auto">
        <p className="text-lg leading-relaxed text-on-surface-variant">
          Most market education becomes outdated, because it is written once and then left untouched for years. The
          instruments move on, the rules change, the tools improve, and the examples quietly stop matching reality.
        </p>
        <p className="mt-5 text-lg leading-relaxed text-on-surface-variant">
          <strong className="text-on-surface">Open Varsity is built differently.</strong> It is designed to evolve
          with the markets, the technology, the trading tools, the regulations and real world examples, so what you
          learn keeps matching the market you actually trade.
        </p>
      </section>

      {/* What makes it different */}
      <section className="border-y border-border surface-low">
        <div className="px-6 sm:px-10 lg:px-14 py-14 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface text-center">
            What makes Open Varsity different
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-center text-on-surface-variant">
            A clean, serious and open platform for traders, investors, developers and quants who want practical market
            education without noise, hype or gatekeeping.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="obsidian-card ghost-border rounded-2xl p-6">
                  <Icon className={`h-6 w-6 ${d.color}`} />
                  <h3 className="mt-4 text-lg font-bold text-on-surface">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{d.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The goal */}
      <section className="px-6 sm:px-10 lg:px-14 py-16 max-w-3xl mx-auto text-center">
        <Target className="h-8 w-8 text-primary mx-auto" />
        <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-on-surface">The goal is simple</h2>
        <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
          To create a clean, serious and open learning platform for traders, investors, developers and quants who want
          practical market education without noise, hype or gatekeeping. Free to read, open to improve, and continuously
          made better for everyone who learns from it.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl gradient-cta px-6 py-3 font-medium text-primary-foreground hover-lift"
          >
            <Github className="h-4 w-4" />
            Contribute on GitHub
          </a>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-xl border border-border surface-low px-6 py-3 font-medium text-on-surface hover:surface-container transition-colors"
          >
            Browse the courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-5 font-label text-xs uppercase tracking-wider text-on-surface-variant/70">
          Open source &middot; No gatekeeping &middot; Updated every three months
        </p>
      </section>
    </div>
  );
}
