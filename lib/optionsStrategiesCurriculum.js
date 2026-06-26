// Single source of truth for the "Options Strategies" learning portal:
// 14 chapters across 5 modules. Slugs form the /options-strategies/<slug> URLs, keep them stable.
// Every payoff diagram is generated from OpenAlgo's own strategy-builder math on real RELIANCE data.

export const SERIES_TITLE = "Options Strategies";
export const SERIES_SUB =
  "Combine calls and puts into real, named strategies, explained for a beginner. Every strategy comes with an authentic payoff diagram built from OpenAlgo's own strategy-builder maths on real market data, so you see exactly where you profit, where you lose, and where you break even.";

export const PARTS = [
  {
    id: "A",
    name: "Reading a Strategy",
    desc: "The payoff diagram and the three numbers that describe any options strategy.",
    chapters: [
      { slug: "the-strategy-builder", title: "The Strategy Builder and the Payoff Diagram",
        summary: "Before any strategy, you need to read a payoff diagram. Learn what the curve shows, the expiry line versus the today line, and how OpenAlgo's strategy builder draws it from your legs.",
        learn: ["What a payoff diagram shows", "The expiry curve vs the T+0 curve", "Profit and loss zones", "Legs: the pieces of a strategy", "What the strategy builder does", "Reading a real example"], tags: ["Foundations"] },
      { slug: "reading-payoffs", title: "Breakeven, Max Profit and Max Loss",
        summary: "Three numbers describe almost any strategy. Learn to find the breakeven, the maximum profit and the maximum loss on a payoff chart, and why defined risk matters most for a beginner.",
        learn: ["The breakeven point(s)", "Maximum profit", "Maximum loss", "Defined vs unlimited risk", "The risk-to-reward read", "Why beginners want defined risk"], tags: ["Foundations"] },
    ],
  },
  {
    id: "B",
    name: "Directional Spreads",
    desc: "Two-leg spreads that express a view with defined, capped risk.",
    chapters: [
      { slug: "bull-call-spread", title: "The Bull Call Spread",
        summary: "A mildly bullish trade with a capped cost and a capped profit. Learn how buying one call and selling a higher one builds a cheaper, defined-risk way to be bullish, with the real payoff.",
        learn: ["A mildly bullish view", "Buy one call, sell a higher call", "Capped cost and capped profit", "The breakeven", "When to prefer it over a long call", "Reading the real payoff"], tags: ["Spreads"] },
      { slug: "bull-put-spread", title: "The Bull Put Spread",
        summary: "A bullish trade that pays you a credit upfront. Learn how selling a put and buying a lower one collects premium while capping the risk, and how it profits if the stock simply does not fall.",
        learn: ["A bullish, premium-collecting view", "Sell a put, buy a lower put", "The net credit", "Defined maximum loss", "Profit if price holds", "Reading the real payoff"], tags: ["Spreads"] },
      { slug: "bear-call-spread", title: "The Bear Call Spread",
        summary: "A bearish credit trade. Learn how selling a call and buying a higher one collects premium with defined risk, profiting if the stock stays below the short strike.",
        learn: ["A bearish, premium-collecting view", "Sell a call, buy a higher call", "The net credit", "Defined maximum loss", "Profit if price stays down", "Reading the real payoff"], tags: ["Spreads"] },
      { slug: "bear-put-spread", title: "The Bear Put Spread",
        summary: "A defined-risk bearish trade. Learn how buying a put and selling a lower one builds a cheaper way to profit from a fall, with both profit and loss capped.",
        learn: ["A bearish view", "Buy a put, sell a lower put", "Capped cost and capped profit", "The breakeven", "When to prefer it over a long put", "Reading the real payoff"], tags: ["Spreads"] },
    ],
  },
  {
    id: "C",
    name: "Volatility Strategies",
    desc: "Strategies that bet on a big move, or on calm, rather than on direction.",
    chapters: [
      { slug: "long-straddle-strangle", title: "Long Straddle and Strangle: Betting on a Big Move",
        summary: "Sometimes you expect a large move but not which way. Learn the long straddle and strangle, buying both a call and a put, the two breakevens, and the time decay that fights you.",
        learn: ["A non-directional, big-move view", "The long straddle", "The cheaper long strangle", "Two breakevens", "Time decay as the enemy", "Reading the real payoffs"], tags: ["Volatility"] },
      { slug: "short-straddle-strangle", title: "Short Straddle and Strangle: Betting on Calm",
        summary: "The opposite bet: that price stays pinned. Learn the short straddle and strangle, selling both sides to collect premium, the wide profit zone, and the unlimited risk that demands respect.",
        learn: ["A range-bound view", "The short straddle", "The wider short strangle", "Collecting premium", "Unlimited risk on a big move", "Reading the real payoffs"], tags: ["Volatility"] },
    ],
  },
  {
    id: "D",
    name: "Range and Advanced",
    desc: "Four-leg and ratio structures with defined risk, and the synthetics.",
    chapters: [
      { slug: "iron-condor", title: "The Iron Condor",
        summary: "The most popular income strategy. Learn how four legs build a wide profit zone that pays you if the stock stays in a range, with defined risk on both ends, on a real payoff.",
        learn: ["A defined-risk range play", "Four legs explained simply", "The wide profit plateau", "Defined loss on both wings", "Two breakevens", "Reading the real payoff"], tags: ["Range"] },
      { slug: "iron-fly-butterfly", title: "The Iron Fly and the Butterfly",
        summary: "Tighter, higher-reward cousins of the condor. Learn the iron fly and the butterfly, which pay the most if the stock pins one strike, with the real payoff shapes.",
        learn: ["The iron fly", "The call butterfly", "A pin-the-strike bet", "Higher reward, narrower zone", "Defined risk", "Reading the real payoffs"], tags: ["Range"] },
      { slug: "ratio-and-backspreads", title: "Ratio Spreads and Back Spreads",
        summary: "Strategies with an unequal number of legs. Learn the ratio spread and the ratio back spread, where buying or selling extra options creates a tilt, and the unlimited risk to watch for.",
        learn: ["Unequal legs explained", "The call ratio spread", "The ratio back spread", "Where the extra risk hides", "Credit vs debit versions", "Reading the real payoffs"], tags: ["Advanced"] },
      { slug: "synthetic-and-covered", title: "Synthetics and the Covered Call",
        summary: "Options can copy a future, and pair with one. Learn the long synthetic (a call plus a short put that mimics a future) and the covered call (a holding plus a sold call for income).",
        learn: ["The long synthetic future", "Why it equals a future", "The covered call", "Earning income on a holding", "The cap on the upside", "Reading the real payoffs"], tags: ["Advanced"] },
      { slug: "jade-lizard", title: "The Jade Lizard and Other Combos",
        summary: "A neat credit structure with no upside risk. Learn the jade lizard, selling a put and a call spread so the credit removes the upside loss, and how named combos are just legs stacked cleverly.",
        learn: ["The jade lizard structure", "No risk on the upside", "Why the credit matters", "Reading the real payoff", "Combos are just stacked legs", "Building your own"], tags: ["Advanced"] },
    ],
  },
  {
    id: "E",
    name: "Putting It Together",
    desc: "Funding a position with collateral, choosing the right strategy for your view, and managing it once it is on.",
    chapters: [
      { slug: "collateral-and-margin", title: "Margin and Collateral for F&O",
        summary: "Selling options and trading futures blocks margin, but you do not always need cash. Learn how the margin is built from SPAN and exposure, how the OpenAlgo margin calculator shows it, and which assets you can pledge as collateral instead of cash.",
        learn: ["Why selling needs margin", "SPAN and exposure margin", "The OpenAlgo margin calculator", "Pledging collateral instead of cash", "What counts as F&O collateral", "Haircuts and the cash component"], tags: ["Management"] },
      { slug: "pledging-for-margin", title: "Pledging for Margin, Smartly",
        summary: "Pledging lets you trade on assets you already own without selling them. Learn how the haircut decides how much margin you get, why liquid collateral beats volatile stock, the interest cost of breaching the cash component, the covered-call trick, and the margin-call risk to respect.",
        learn: ["How pledging works", "Haircuts and how much margin you get", "Cash vs non-cash collateral", "The cash-component interest cost", "Trick one: prefer liquid collateral", "Trick two: the covered call", "Margin-call and forced-selling risk"], tags: ["Management"] },
      { slug: "margin-penalties", title: "Margins and Margin Penalties",
        summary: "The exchange checks your margin at random moments through the day, and a shortfall costs you a penalty. Learn the minimum margin rule, the peak-margin checks, the penalty slabs, and the everyday situations, like a short going against you or closing a hedge leg, that quietly trigger them.",
        learn: ["The minimum margin rule", "Peak margin and the random checks", "The penalty slabs", "Upfront vs non-upfront shortfalls", "Why a short or unhedge raises margin", "Keeping a margin buffer"], tags: ["Management"] },
      { slug: "choosing-and-managing", title: "Choosing a Strategy and Managing It",
        summary: "A strategy is only as good as the view behind it. Learn how to match a strategy to bullish, bearish or neutral views, size the position for survival, and adjust or exit when you are wrong.",
        learn: ["Matching strategy to view", "Defined risk first for beginners", "Position sizing", "When to take profit", "Adjusting a losing trade", "Knowing when to walk away"], tags: ["Management"] },
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
  Foundations: "idx",
  Spreads: "nse",
  Volatility: "afl",
  Range: "py",
  Advanced: "mcx",
  Management: "live",
};
