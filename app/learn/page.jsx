import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

import { CHAPTERS as AMI } from "@/lib/amibrokerCurriculum";
import { CHAPTERS as FUND } from "@/lib/fundamentalsCurriculum";
import { CHAPTERS as PY } from "@/lib/pythonCurriculum";
import { CHAPTERS as QUANT } from "@/lib/quantCurriculum";
import { CHAPTERS as STOCKS } from "@/lib/stocksCurriculum";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const DESC =
  "Five free, hands-on courses that take you from understanding your very first share to a real quantitative edge - Stock Market Basics (a no-jargon beginner intro to the Indian market), Python for Traders (beginner), Algo Trading with Python (intermediate), Quantitative Trading (expert), and AmiBroker AFL (chart-based system building, no Python needed) - all in plain English with real market examples.";

export const metadata = {
  title: { absolute: "Learn - Free Stock Market, Python, Algo, Quant & AFL Courses | OpenAlgo" },
  description: DESC,
  keywords: [
    "learn python trading", "algo trading course", "quant trading course", "python for traders",
    "free trading courses", "algorithmic trading python", "quantitative trading", "openalgo",
    "learn to code trading", "indian stock market python", "stock market basics course", "amibroker afl course",
  ],
  alternates: { canonical: "/learn" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/learn",
    title: "Learn - Free Stock Market, Python, Algo, Quant & AFL Courses",
    description: DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OpenAlgo learning paths", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn - Free Stock Market, Python, Algo, Quant & AFL Courses",
    description: DESC,
    images: [OG_IMAGE],
    creator: "@openalgoHQ",
    site: "@openalgoHQ",
  },
};

const COURSES = [
  {
    n: 0,
    route: "/stocks",
    title: "Stock Market Basics",
    level: "Beginner",
    count: STOCKS.length,
    color: "text-tertiary",
    ring: "hsl(140 72% 53% / 0.5)",
    grad: "from-tertiary via-secondary to-primary",
    blurb:
      "Brand new to the market? Start here - before any code. Understand shares, IPOs, indices, what moves prices and how to spot scams, in plain English with clear diagrams and real Indian examples.",
    points: ["Zero jargon assumed", "Understand the market, not code", "Modern, visual, India-first"],
  },
  {
    n: 1,
    route: "/fundamentals",
    title: "Python for Traders",
    level: "Beginner",
    count: FUND.length,
    color: "text-primary",
    ring: "hsl(267 100% 87% / 0.5)",
    grad: "from-primary via-secondary to-tertiary",
    blurb:
      "Never written a line of code? Start from absolute zero. Learn Python itself - variables, data, NumPy, pandas and charts - one small step at a time, on real market data.",
    points: ["No prior coding needed", "Pure Python, NumPy & pandas", "Real yfinance & OpenAlgo data"],
  },
  {
    n: 2,
    route: "/python",
    title: "Algo Trading with Python",
    level: "Intermediate",
    count: PY.length,
    color: "text-secondary",
    ring: "hsl(220 100% 84% / 0.5)",
    grad: "from-secondary via-primary to-tertiary",
    blurb:
      "Comfortable with the basics? Build, backtest and automate real trading strategies with the OpenAlgo SDK - indicators, signals, orders, WebSockets and risk management.",
    points: ["Assumes Python basics", "The OpenAlgo SDK", "Automated strategies, orders & risk"],
  },
  {
    n: 3,
    route: "/quant",
    title: "Quantitative Trading",
    level: "Expert",
    count: QUANT.length,
    color: "text-tertiary",
    ring: "hsl(140 72% 53% / 0.5)",
    grad: "from-tertiary via-secondary to-primary",
    blurb:
      "Ready to go deep? Market microstructure, the mathematics of markets, derivatives and volatility, portfolio risk - and how to find an edge that survives real-world costs.",
    points: ["Market structure & the maths", "Options, volatility & factors", "Finding a real, tested edge"],
  },
  {
    n: 4,
    route: "/amibroker",
    title: "AmiBroker AFL",
    level: "Beginner",
    count: AMI.length,
    color: "text-secondary",
    ring: "hsl(190 85% 62% / 0.5)",
    grad: "from-secondary via-primary to-tertiary",
    blurb:
      "For traders and investors who prefer charts to Python. Learn AmiBroker's AFL language from scratch - build indicators, scan the whole market, and turn ideas into backtested systems and live automation, on one of the fastest engines a retail user can own.",
    points: ["No Python needed", "Indicators, scans & systems", "Backtest, optimise & automate"],
  },
];

const COURSE_LIST_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "OpenAlgo Trading Courses",
  description: DESC,
  itemListElement: COURSES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      name: c.title,
      description: c.blurb,
      url: `https://openalgo.in${c.route}`,
      provider: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
      isAccessibleForFree: true,
    },
  })),
};

export default function LearnHub() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_LIST_LD) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 obsidian-grid" aria-hidden="true" />
        <div className="glow-orb" style={{ width: 420, height: 420, top: -120, right: -60, background: "hsl(267 100% 87% / 0.16)" }} aria-hidden="true" />
        <div className="glow-orb" style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(140 72% 53% / 0.14)" }} aria-hidden="true" />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            Five free courses &middot; {STOCKS.length + FUND.length + PY.length + QUANT.length + AMI.length} chapters &middot; real market data
          </span>
          <h1 className="reveal reveal-2 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            Learn{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              Markets, Python, Algo &amp; Quant
            </span>{" "}
            trading
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl mx-auto text-lg text-on-surface-variant">
            A free, hands-on academy from your first share to your first trading system and a real quantitative edge -
            taught in plain English, with examples grounded in real markets.
          </p>
        </div>
      </section>

      {/* Course ladder */}
      <div className="px-6 sm:px-10 lg:px-14 py-14 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Choose your starting point</h2>
          <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant/70">Beginner &rarr; Expert</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <Link
              key={c.route}
              href={c.route}
              className="group obsidian-card hover-lift ghost-border rounded-2xl p-6 flex flex-col"
              style={{ ["--tw-ring-color"]: c.ring }}
            >
              <div className="flex items-center justify-between">
                <span className={`font-label text-xs uppercase tracking-wider ${c.color}`}>{c.level}</span>
                <span className="font-label text-xs text-on-surface-variant/70">{c.count} chapters</span>
              </div>
              <h3 className={`mt-3 text-2xl font-bold bg-linear-to-r ${c.grad} bg-clip-text text-transparent`}>
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant flex-1">{c.blurb}</p>
              <ul className="mt-4 space-y-1.5">
                {c.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className={`mt-0.5 ${c.color}`}>&bull;</span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className={`mt-5 inline-flex items-center gap-1.5 font-medium ${c.color}`}>
                Start the course
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recommended path */}
        <div className="mt-12 rounded-2xl border border-border surface-low p-6 sm:p-8">
          <h2 className="text-lg font-bold text-on-surface">Not sure where to begin?</h2>
          <p className="mt-2 text-on-surface-variant">
            The academy has a market-basics entry point, a Python-to-quant ladder, and a parallel no-Python AFL track.
            If you're <strong>new to markets</strong>,
            start with{" "}
            <Link href="/stocks" className="text-tertiary hover:underline">Stock Market Basics</Link>. If you're
            ready to code but new to Python, start with{" "}
            <Link href="/fundamentals" className="text-primary hover:underline">Python for Traders</Link>. Once you can
            handle data confidently, move to{" "}
            <Link href="/python" className="text-secondary hover:underline">Algo Trading with Python</Link> to build and
            automate strategies. When you want the layer beneath the charts - the market structure and the maths - take{" "}
            <Link href="/quant" className="text-tertiary hover:underline">Quantitative Trading</Link>. Prefer to
            work in charts rather than Python? Take{" "}
            <Link href="/amibroker" className="text-secondary hover:underline">AmiBroker AFL</Link> instead -
            a parallel, no-Python track for traders and investors that teaches the AFL language from scratch, all the way
            to backtested systems and live automation. Every course is free, self-paced, and full of examples you can run yourself.
          </p>
          <p className="mt-6 border-t border-border pt-4 text-center text-sm text-on-surface-variant/70">
            For education only - not investment advice. Practise in analyze mode.
          </p>
        </div>
      </div>
    </div>
  );
}
