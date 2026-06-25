import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";
const DESC =
  "You finished the Algo Trading with Python course. Here's what to do next - sandbox-trade in analyzer mode, manage risk, validate honestly, and go live small - plus the principles that keep traders in the game.";

export const metadata = {
  title: { absolute: "Course Complete - What's Next | Algo Trading with Python | OpenAlgo" },
  description: DESC,
  keywords: [
    "algo trading next steps", "sandbox trading", "analyzer mode", "trading risk management",
    "go live trading bot", "python trading course", "openalgo",
  ],
  alternates: { canonical: "/python/whats-next" },
  openGraph: {
    type: "article",
    url: "https://openalgo.in/python/whats-next",
    title: "Course Complete - What's Next",
    description: DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Algo Trading with Python - course complete", type: "image/png" }],
  },
  twitter: { card: "summary_large_image", title: "Course Complete - What's Next", description: DESC, images: [OG_IMAGE], site: "@openalgoHQ", creator: "@openalgoHQ" },
};

const CAN_NOW = [
  "Pull live quotes, depth and historical data across NSE, NFO and MCX",
  "Wrangle prices with NumPy and Pandas, and chart them with Matplotlib, Plotly and Seaborn",
  "Compute 80+ indicators and turn them into clean, de-duplicated signals",
  "Scan a whole universe and build intraday, positional, pair, momentum, volatility and options strategies",
  "Place and manage every order type through the SDK",
  "Backtest with VectorBT, measure performance, optimise, walk-forward test, and apply machine learning",
];

const NEXT_STEPS = [
  {
    h: "Sandbox-trade first, for longer than feels necessary",
    p: "Keep OpenAlgo in analyzer (sandbox) mode and run your strategy against the real-time market for weeks. Watching simulated fills as the market moves teaches you things no backtest can - slippage, partial fills, the emotional pull to override your rules.",
  },
  {
    h: "Pick one strategy and take it all the way",
    p: "Resist collecting ten half-built ideas. Choose a single strategy you understand, backtest it honestly (costs included), walk-forward test it, and only then size it small. Depth beats breadth.",
  },
  {
    h: "Make risk management the core, not an afterthought",
    p: "Decide your maximum loss per trade and per day before you place a single order. Size positions off volatility, never off conviction. The goal of your first live year is to survive, not to win big.",
  },
  {
    h: "Respect out-of-sample truth",
    p: "A backtest that looks perfect is usually overfit. Trust walk-forward and out-of-sample results over the in-sample dream. If an edge only appears with one exact parameter, it isn't an edge.",
  },
  {
    h: "Automate gradually, and watch it",
    p: "Move from manual to semi-automatic (alerts you act on) to fully automatic only once you trust the logs. Add Telegram or WhatsApp alerts, log every decision, and keep the dashboard open. A bot you don't monitor is a liability.",
  },
  {
    h: "Keep learning",
    p: "Revisit chapters as you build. Then go deeper: market microstructure, portfolio construction, more rigorous ML validation, and execution quality. The market keeps changing, so the learning never really stops.",
  },
];

const PRINCIPLES = [
  "Never risk money you cannot afford to lose.",
  "Test before you trade; the backtest is the cheapest lesson you'll ever get.",
  "Cut losers fast, let winners run - and let the code enforce it, not your mood.",
  "Costs and slippage are real; always include them.",
  "One change at a time, so you know what actually moved the needle.",
  "Keep a journal: every trade, the reason for it, and the outcome.",
  "When in doubt, reduce size or step aside. Cash is a position.",
];

export default function WhatsNextPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 obsidian-grid" aria-hidden="true" />
        <div className="glow-orb" style={{ width: 420, height: 420, top: -130, left: "30%", background: "hsl(140 72% 53% / 0.16)" }} aria-hidden="true" />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20 text-center">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-tertiary">
            <Check className="h-3.5 w-3.5" /> Course complete - all 32 chapters
          </span>
          <h1 className="reveal reveal-2 mx-auto mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            <span className="bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">Congratulations.</span>
            <br />You made it to the end.
          </h1>
          <p className="reveal reveal-3 mx-auto mt-5 max-w-2xl text-lg text-on-surface-variant">
            You started not knowing a variable from a function. You finish able to fetch the market, build a strategy, prove it on history, and wire it into a bot. That is a genuinely hard thing to do, and you did it. Take a moment - then let us talk about what comes next.
          </p>
        </div>
      </section>

      <div className="px-6 sm:px-10 lg:px-14 py-14 max-w-5xl mx-auto">
        <section>
          <h2 className="text-2xl font-bold text-on-surface">What you can do now</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {CAN_NOW.map((c) => (
              <div key={c} className="flex gap-3 obsidian-card ghost-border rounded-xl p-4">
                <Check className="h-5 w-5 shrink-0 text-tertiary" />
                <span className="text-on-surface-variant">{c}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-on-surface">What to do next</h2>
          <p className="mt-1 mb-6 text-on-surface-variant">A path from finishing the course to trading your own system, in the order that keeps you safe.</p>
          <ol className="space-y-4">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.h} className="flex gap-4 obsidian-card ghost-border rounded-2xl p-5 hover-lift">
                <span className="shrink-0 font-label text-lg font-bold bg-linear-to-br from-primary to-tertiary bg-clip-text text-transparent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-semibold text-on-surface">{s.h}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{s.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-on-surface">Principles to trade by</h2>
          <div className="mt-5 rounded-2xl border border-border surface-low p-6">
            <ul className="space-y-3">
              {PRINCIPLES.map((p) => (
                <li key={p} className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-on-surface">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 rounded-2xl border border-border p-5" style={{ background: "hsl(43 100% 73% / 0.06)" }}>
            <p className="text-sm text-on-surface-variant">
              <strong className="text-on-surface">One last word.</strong> Everything here is for education, not investment advice. Markets carry real risk and most new automated traders lose money early. Go slow, stay in analyze mode until your logs earn your trust, and treat your first live capital as tuition. The traders who last are the ones who manage risk first and chase returns second.
            </p>
          </div>
        </section>

        <section className="mt-14 flex flex-wrap gap-3">
          <Link href="/python/getting-started" className="inline-flex items-center gap-2 rounded-xl gradient-cta px-6 py-3 font-medium text-primary-foreground hover-lift">
            <ArrowLeft className="h-4 w-4" /> Revisit Chapter 1
          </Link>
          <Link href="/python" className="inline-flex items-center gap-2 rounded-xl border border-border surface-low px-6 py-3 font-medium text-on-surface hover:surface-container transition-colors">
            Browse all chapters
          </Link>
          <a href="https://docs.openalgo.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-border surface-low px-6 py-3 font-medium text-on-surface hover:surface-container transition-colors">
            OpenAlgo docs <ArrowRight className="h-4 w-4" />
          </a>
        </section>

        <p className="mt-12 border-t border-border pt-6 text-center text-sm text-on-surface-variant/70">
          Now go build something. The market will be there tomorrow - and so will your code.
        </p>
      </div>
    </div>
  );
}
