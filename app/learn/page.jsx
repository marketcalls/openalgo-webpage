import { CHAPTERS as AMI } from "@/lib/amibrokerCurriculum";
import { CHAPTERS as FUND } from "@/lib/fundamentalsCurriculum";
import { CHAPTERS as FUT } from "@/lib/futuresCurriculum";
import { CHAPTERS as OB } from "@/lib/optionsBasicsCurriculum";
import { CHAPTERS as OS } from "@/lib/optionsStrategiesCurriculum";
import { CHAPTERS as PY } from "@/lib/pythonCurriculum";
import { CHAPTERS as QUANT } from "@/lib/quantCurriculum";
import { CHAPTERS as PSYCH } from "@/lib/psychologyCurriculum";
import { CHAPTERS as RISK } from "@/lib/riskCurriculum";
import { CHAPTERS as SARB } from "@/lib/statsArbCurriculum";
import { CHAPTERS as STOCKS } from "@/lib/stocksCurriculum";
import { CHAPTERS as TAX } from "@/lib/taxationCurriculum";
import { CHAPTERS as TECH } from "@/lib/technicalsCurriculum";

import LearnHubClient from "./LearnHubClient";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const DESC =
  "Open Varsity is OpenAlgo's free learning academy. Thirteen free, hands-on courses that take you from understanding your very first share to a real quantitative edge - Stock Market Basics (a no-jargon beginner intro to the Indian market), Technical Analysis (reading real NSE charts), Futures Trading, Options Basics and Options Strategies (derivatives from zero, with real payoff charts), Taxation for Traders and Investors (plain-English tax on shares, F&O, US stocks and crypto), Python for Traders (beginner), Algo Trading with Python (intermediate), Quantitative Trading and Statistical Arbitrage (expert), AmiBroker AFL (chart-based system building, no Python needed), and Risk Management (the one skill that keeps you in the game) and Trading Psychology & Risk Playbooks (mastering your mind, hedging, and ready-to-use risk plans) - all in plain English with real market examples.";

export const metadata = {
  title: { absolute: "Open Varsity - Free Stock Market, Python, Algo, Quant & AFL Courses | OpenAlgo" },
  description: DESC,
  keywords: [
    "learn python trading", "algo trading course", "quant trading course", "python for traders",
    "free trading courses", "algorithmic trading python", "quantitative trading", "openalgo",
    "learn to code trading", "indian stock market python", "stock market basics course", "amibroker afl course",
    "technical analysis course",
  ],
  alternates: { canonical: "/learn" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/learn",
    title: "Open Varsity - Free Stock Market, Python, Algo, Quant & AFL Courses",
    description: DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Open Varsity by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Varsity - Free Stock Market, Python, Algo, Quant & AFL Courses",
    description: DESC,
    images: [OG_IMAGE],
    creator: "@openalgoHQ",
    site: "@openalgoHQ",
  },
};

// English course list, used only for the JSON-LD (SEO stays English).
const COURSES_LD = [
  {
    route: "/stocks",
    title: "Stock Market Basics",
    blurb:
      "Brand new to the market? Start here - before any code. Understand shares, IPOs, indices, what moves prices and how to spot scams, in plain English with clear diagrams and real Indian examples.",
  },
  {
    route: "/technicals",
    title: "Technical Analysis",
    blurb:
      "Want to read a chart, not just buy and hold? Learn technical analysis from the very first candle - trends, support and resistance, chart patterns, and indicators like RSI, MACD and moving averages - every concept shown on real NSE daily charts, honest about probability over certainty.",
  },
  {
    route: "/fundamentals",
    title: "Python for Traders",
    blurb:
      "Never written a line of code? Start from absolute zero. Learn Python itself - variables, data, NumPy, pandas and charts - one small step at a time, on real market data.",
  },
  {
    route: "/futures",
    title: "Futures Trading",
    blurb:
      "New to derivatives? Start with futures. Understand what a contract really is, then margin and leverage, mark-to-market, long and short, the payoff, liquidity, rollover, settlement, costs and taxation, open interest, hedging and position sizing, all in plain English with real Indian market examples, honest about the leverage that cuts both ways.",
  },
  {
    route: "/options-basics",
    title: "Options Basics",
    blurb:
      "Calls and puts from absolute zero. Premium, strike and expiry, moneyness, the option chain, the four single-leg payoffs, the Greeks and implied volatility - every term defined, every payoff a real chart, honest about why most option buyers lose.",
  },
  {
    route: "/options-strategies",
    title: "Options Strategies",
    blurb:
      "All 38 strategies in the OpenAlgo strategy builder, each with an authentic payoff chart and the full nine-metric panel (max profit, max loss, POP, risk to reward, margin) built on real NIFTY data. Spreads, straddles, iron condors and flies, ratios, jade lizards, batman, calendars, plus margin, pledging and adjustments.",
  },
  {
    route: "/python",
    title: "Algo Trading with Python",
    blurb:
      "Comfortable with the basics? Build, backtest and automate real trading strategies with the OpenAlgo SDK - indicators, signals, orders, WebSockets and risk management.",
  },
  {
    route: "/quant",
    title: "Quantitative Trading",
    blurb:
      "A full quant career curriculum: the Indian market's structure and plumbing, the mathematics of markets, market microstructure and the technology of HFT and execution, time series, derivatives and volatility, alpha research, honest backtesting and machine learning, and taking a strategy to production - every example run on real market data.",
  },
  {
    route: "/stats-arb",
    title: "Statistical Arbitrage",
    blurb:
      "The real thing, brutally honest: stationarity and cointegration, pairs and baskets, dynamic hedge ratios with the Kalman filter, and market-neutral books on NSE equities. Every result computed on real market data pulled via OpenAlgo from the connected broker, gross and net, in-sample and out-of-sample, with an honest line between a statistical relationship and a tradable edge.",
  },
  {
    route: "/amibroker",
    title: "AmiBroker AFL",
    blurb:
      "For traders and investors who prefer charts to Python. Learn AmiBroker's AFL language from scratch - build indicators, scan the whole market, and turn ideas into backtested systems and live automation, on one of the fastest engines a retail user can own.",
  },
  {
    route: "/taxation",
    title: "Taxation for Traders and Investors",
    blurb:
      "Worried about tax on your trades? Learn it in plain English with real case studies - the income buckets and the two regimes, capital gains and STT on shares, why intraday is speculative, why F&O is business income (turnover, audit and loss set-off), tax on US stocks and Schedule FA, and crypto's flat 30 percent. Honest about the mistakes that bring a notice years later. Educational only, not tax advice.",
  },
  {
    route: "/risk-management",
    title: "Risk Management",
    blurb:
      "The market does not reward the smartest trader - it rewards the one still standing. Learn the one skill that keeps you in the game: what risk really is, the beginner money-safety system, investor and trader risk, position sizing and stop-losses, leverage and execution risk, and F&O risk - in plain English with real Indian examples, clear diagrams and checklists.",
  },
  {
    route: "/trading-psychology",
    title: "Trading Psychology & Risk Playbooks",
    blurb:
      "Most traders do not lose to the market - they lose to themselves. The second half of staying alive: master your own mind (fear, greed, loss aversion, FOMO, discipline as a system, journaling), learn when to hedge and when not to, the option-seller and hedger playbook, and a complete, ready-to-use risk plan for every type of participant.",
  },
];

const COURSE_LIST_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Open Varsity",
  description: DESC,
  itemListElement: COURSES_LD.map((c, i) => ({
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

const COUNTS = {
  stocks: STOCKS.length,
  technicals: TECH.length,
  pyTraders: FUND.length,
  futures: FUT.length,
  optBasics: OB.length,
  optStrat: OS.length,
  algoPy: PY.length,
  quant: QUANT.length,
  statsArb: SARB.length,
  ami: AMI.length,
  tax: TAX.length,
  risk: RISK.length,
  psych: PSYCH.length,
};

const TOTAL = Object.values(COUNTS).reduce((a, b) => a + b, 0);

export default function LearnHub() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_LIST_LD) }} />
      <LearnHubClient counts={COUNTS} total={TOTAL} />
    </div>
  );
}
