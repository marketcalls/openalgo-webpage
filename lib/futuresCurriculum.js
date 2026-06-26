// Single source of truth for the "Futures Trading" learning portal:
// 12 chapters across 4 modules. Slugs form the /futures/<slug> URLs, keep them stable.
// Chapter numbers are assigned automatically by position.

export const SERIES_TITLE = "Futures Trading";
export const SERIES_SUB =
  "Your first steps into futures, for someone who has never traded a contract. We explain every term in plain English, use real Indian market examples, and stay honest about the leverage that makes futures powerful and dangerous in equal measure.";

export const PARTS = [
  {
    id: "A",
    name: "Futures Fundamentals",
    desc: "What a futures contract is, why it exists, and how to read its specifications.",
    chapters: [
      { slug: "what-is-a-future", title: "What Is a Futures Contract?",
        summary: "A future is simply an agreement to buy or sell something at a fixed price on a future date. Learn what that means in plain words, with a real Indian example, before any jargon arrives.",
        learn: ["An agreement for a future date", "Buyer and seller obligations", "Underlying, price and expiry", "A simple real-world analogy", "How a stock future works", "Why nobody waits for delivery"], tags: ["Basics"] },
      { slug: "why-futures-exist", title: "Why Futures Exist: Hedgers and Speculators",
        summary: "Futures were not invented for gambling. Meet the two crowds that meet in the futures market, the hedger who wants to remove risk and the speculator who is happy to take it on.",
        learn: ["The original purpose of futures", "Hedgers who offload risk", "Speculators who take it on", "How the two sides need each other", "Liquidity and price discovery", "A farmer-and-mill example"], tags: ["Basics"] },
      { slug: "contract-specs", title: "Reading a Contract: Lot Size, Expiry and Tick",
        summary: "Every future is standardised. Learn the lot size (NIFTY 65, BANKNIFTY 30, RELIANCE 500), the monthly expiry, the tick size and the symbol format, so you know exactly what one contract controls.",
        learn: ["Lot size and contract value", "Real lot sizes (NIFTY, BANKNIFTY, RELIANCE)", "Monthly and weekly expiry", "Tick size and minimum move", "The OpenAlgo symbol format", "Why everything is standardised"], tags: ["Basics"] },
    ],
  },
  {
    id: "B",
    name: "How Futures Work",
    desc: "Margin, daily settlement, going long or short, and the straight-line payoff.",
    chapters: [
      { slug: "margin-and-leverage", title: "Margin and Leverage: The Double-Edged Sword",
        summary: "You do not pay the full contract value, only a margin. That is leverage, and it multiplies both gains and losses. Learn how margin works and why leverage is the single most important risk in futures.",
        learn: ["What margin is", "How leverage multiplies P&L", "Initial vs maintenance margin", "The margin call", "A worked leverage example", "Why leverage cuts both ways"], tags: ["Mechanics"] },
      { slug: "mark-to-market", title: "Mark-to-Market: Settled Every Single Day",
        summary: "A futures position is settled in cash at the end of every trading day, not just at expiry. Learn how mark-to-market moves money in and out of your account daily and why a losing position can be closed for you.",
        learn: ["Daily cash settlement", "Profit and loss credited each day", "How MTM protects the exchange", "Margin top-ups", "Why you cannot ignore a position", "A two-day worked example"], tags: ["Mechanics"] },
      { slug: "long-and-short", title: "Going Long and Going Short",
        summary: "Futures let you profit from a fall as easily as a rise. Learn what going long and going short mean, and why selling first is normal and not exotic in the futures market.",
        learn: ["Long means buy first", "Short means sell first", "Profiting from a fall", "No borrowing needed to short", "Both sides face unlimited risk", "When you would use each"], tags: ["Mechanics"] },
      { slug: "futures-payoff", title: "The Futures Payoff: A Straight Line",
        summary: "Unlike options, a future has the simplest payoff there is, a straight line. Learn to read the long and short futures payoff on a real RELIANCE example, including why the loss can be as large as the gain.",
        learn: ["The linear payoff shape", "Long futures payoff", "Short futures payoff", "One-to-one with the underlying", "Unlimited profit and loss", "Reading a real payoff chart"], tags: ["Payoff"] },
    ],
  },
  {
    id: "C",
    name: "Pricing and the Cycle",
    desc: "How a future is priced versus spot, and how positions roll from month to month.",
    chapters: [
      { slug: "basis-and-carry", title: "Basis and the Cost of Carry",
        summary: "A future rarely trades at exactly the spot price. Learn the basis (the gap between future and spot) and the cost of carry that explains it, plus what a premium or discount is telling you.",
        learn: ["Future price vs spot price", "The basis explained", "Cost of carry", "Premium and discount", "Convergence at expiry", "What the basis signals"], tags: ["Pricing"] },
      { slug: "rollover", title: "Rollover: Moving to the Next Month",
        summary: "Futures expire, but a view can outlast a month. Learn rollover, the act of closing the expiring contract and opening the next one, and what high rollover tells you about market sentiment.",
        learn: ["Why contracts expire", "Closing and reopening a position", "The rollover cost", "Rollover percentage as a signal", "Expiry-day mechanics", "Avoiding the illiquid far month"], tags: ["Pricing"] },
      { slug: "index-vs-stock-futures", title: "Index Futures vs Stock Futures",
        summary: "NIFTY and BANKNIFTY futures behave differently from a single stock's future. Learn the practical differences in liquidity, risk and use, and why beginners usually start with the index.",
        learn: ["Index futures (NIFTY, BANKNIFTY)", "Single-stock futures", "Liquidity differences", "Single-stock gap risk", "Cash settlement for index", "Where a beginner should start"], tags: ["Pricing"] },
    ],
  },
  {
    id: "D",
    name: "Using Futures Wisely",
    desc: "Hedging a portfolio, and surviving the leverage that defines the instrument.",
    chapters: [
      { slug: "hedging-with-futures", title: "Hedging: Protecting What You Own",
        summary: "The original job of a future. Learn how selling an index future can protect a portfolio from a fall, what a hedge costs you in a rally, and why a hedge is insurance, not a profit machine.",
        learn: ["What a hedge does", "Shorting a future against holdings", "Beta and the hedge ratio", "The cost of insurance", "Partial vs full hedges", "When to hedge and when not to"], tags: ["Hedging"] },
      { slug: "risks-of-leverage", title: "The Risks of Leverage (and How to Survive)",
        summary: "Most futures traders lose, and leverage is usually why. Learn the honest risks, the gap, the margin call, the overnight move, and the position sizing and stops that keep a trader in the game.",
        learn: ["Why most futures traders lose", "Gap and overnight risk", "The margin-call spiral", "Position sizing for survival", "Always using a stop", "Respecting the leverage"], tags: ["Risk"] },
    ],
  },
];

let _n = 0;
for (const _p of PARTS) for (const _c of _p.chapters) _c.n = ++_n;

export const CHAPTERS = PARTS.flatMap((p) =>
  p.chapters.map((c) => ({ ...c, part: p.id, partName: p.name }))
).sort((a, b) => a.n - b.n);

export function chapterBySlug(slug) {
  return CHAPTERS.find((c) => c.slug === slug) || null;
}

export const TAG_CLASS = {
  Basics: "idx",
  Mechanics: "nfo",
  Payoff: "py",
  Pricing: "mcx",
  Hedging: "nse",
  Risk: "live",
};
