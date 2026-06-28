// Single source of truth for the "Options Strategies" learning portal:
// 26 chapters across 7 modules. Slugs form the /options-strategies/<slug> URLs, keep them stable.
// Every payoff diagram and metric is generated from OpenAlgo's own strategy-builder maths on
// REAL NIFTY option-chain data, so the charts and the nine numbers match the builder exactly.

export const SERIES_TITLE = "Options Strategies";
export const SERIES_SUB =
  "Every strategy in the OpenAlgo strategy builder, explained clearly for the developing options trader. All 38 named structures come with an authentic payoff diagram and the full nine-metric panel (max profit, max loss, probability of profit, risk to reward, margin and more) built from OpenAlgo's own strategy-builder maths on real NIFTY data, so you see exactly what the builder shows.";

export const PARTS = [
  {
    id: "A",
    name: "Reading a Strategy",
    desc: "The payoff diagram and the nine numbers that describe any options strategy.",
    chapters: [
      { slug: "the-strategy-builder", title: "The Strategy Builder and the Payoff Diagram",
        summary: "Before any strategy, you need to read a payoff diagram. Learn what the curve shows, the orange at-expiry line versus the blue T+0 line, the sigma bands, and how OpenAlgo's strategy builder draws it from your legs on real NIFTY data.",
        learn: ["What a payoff diagram shows", "The at-expiry vs the T+0 curve", "Profit and loss zones", "Legs: the pieces of a strategy", "The sigma bands and spot line", "Reading a real example"], tags: ["Foundations"] },
      { slug: "reading-payoffs", title: "The Nine Numbers: Max Profit, POP, Margin and More",
        summary: "The builder shows nine metrics for every strategy. Learn to read all of them: breakevens, max profit and loss, probability of profit, risk to reward, net credit or debit, estimated premium, total P&L, and the margin the trade blocks.",
        learn: ["Breakeven points", "Max profit and max loss", "Probability of profit (POP)", "Risk to reward", "Net credit vs net debit", "Estimated premium and margin"], tags: ["Foundations"] },
    ],
  },
  {
    id: "B",
    name: "Bullish Strategies",
    desc: "The nine bullish structures in the builder, from a single call to ratio and butterfly trades.",
    chapters: [
      { slug: "long-call-short-put", title: "Long Call and Short Put",
        summary: "The two single-leg bullish trades. Learn the long call (limited risk, unlimited upside) and the short put (collect premium, large downside), the two ends of the bullish spectrum, on real NIFTY payoffs.",
        learn: ["The long call", "Limited risk, unlimited upside", "The short put", "Collecting premium, large risk", "Buyer vs seller bullishly", "Reading the real payoffs"], tags: ["Bullish"] },
      { slug: "bull-call-spread", title: "The Bull Call Spread",
        summary: "A mildly bullish trade with capped cost and capped profit. Learn how buying one call and selling a higher one builds a cheaper, defined-risk way to be bullish, with the real NIFTY metrics.",
        learn: ["A mildly bullish view", "Buy one call, sell a higher call", "Capped cost and capped profit", "The breakeven", "When to prefer it over a long call", "Reading the real payoff"], tags: ["Bullish"] },
      { slug: "bull-put-spread", title: "The Bull Put Spread",
        summary: "A bullish trade that pays you a credit upfront. Learn how selling a put and buying a lower one collects premium while capping the risk, and how it profits if NIFTY simply does not fall.",
        learn: ["A bullish, premium-collecting view", "Sell a put, buy a lower put", "The net credit", "Defined maximum loss", "Probability of profit", "Reading the real payoff"], tags: ["Bullish"] },
      { slug: "bull-ratio-synthetic", title: "Ratio Back Spread, Synthetic and Range Forward",
        summary: "Three more bullish shapes. Learn the call ratio back spread (cheap, explosive upside), the long synthetic future (calls and puts that mimic a future) and the range forward, with their real payoffs and the risks to watch.",
        learn: ["The call ratio back spread", "Why it can be a credit trade", "The long synthetic future", "Why it equals a future", "The range forward collar", "Reading the real payoffs"], tags: ["Bullish"] },
      { slug: "bullish-butterfly-condor", title: "Bullish Butterfly and Bullish Condor",
        summary: "Defined-risk ways to target a specific upside zone. Learn the bullish butterfly and bullish condor, all-call structures that pay the most if NIFTY drifts up to a chosen level, with the metrics.",
        learn: ["A targeted bullish view", "The bullish butterfly", "The bullish condor", "Cheap, high reward to risk", "Why the POP is low", "Reading the real payoffs"], tags: ["Bullish"] },
    ],
  },
  {
    id: "C",
    name: "Bearish Strategies",
    desc: "The nine bearish structures, the mirror image of the bullish family.",
    chapters: [
      { slug: "long-put-short-call", title: "Long Put and Short Call",
        summary: "The two single-leg bearish trades. Learn the long put (limited risk, large downside profit) and the short call (collect premium, unlimited risk), the two ends of the bearish spectrum, on real NIFTY payoffs.",
        learn: ["The long put", "Limited risk, large profit on a fall", "The short call", "Collecting premium, unlimited risk", "Buyer vs seller bearishly", "Reading the real payoffs"], tags: ["Bearish"] },
      { slug: "bear-call-spread", title: "The Bear Call Spread",
        summary: "A bearish credit trade. Learn how selling a call and buying a higher one collects premium with defined risk, profiting if NIFTY stays below the short strike, with the metrics.",
        learn: ["A bearish, premium-collecting view", "Sell a call, buy a higher call", "The net credit", "Defined maximum loss", "Profit if price stays down", "Reading the real payoff"], tags: ["Bearish"] },
      { slug: "bear-put-spread", title: "The Bear Put Spread",
        summary: "A defined-risk bearish trade. Learn how buying a put and selling a lower one builds a cheaper way to profit from a fall, with both profit and loss capped, on real NIFTY data.",
        learn: ["A bearish view", "Buy a put, sell a lower put", "Capped cost and capped profit", "The breakeven", "When to prefer it over a long put", "Reading the real payoff"], tags: ["Bearish"] },
      { slug: "bear-ratio-synthetic", title: "Put Ratio Back Spread, Synthetic and Risk Reversal",
        summary: "Three more bearish shapes. Learn the put ratio back spread (cheap, explosive downside), the short synthetic future and the risk reversal, with their real payoffs and the risks to respect.",
        learn: ["The put ratio back spread", "The short synthetic future", "Why it equals a short future", "The risk reversal", "Where the unlimited risk hides", "Reading the real payoffs"], tags: ["Bearish"] },
      { slug: "bearish-butterfly-condor", title: "Bearish Butterfly and Bearish Condor",
        summary: "Defined-risk ways to target a specific downside zone. Learn the bearish butterfly and bearish condor, all-put structures that pay the most if NIFTY drifts down to a chosen level.",
        learn: ["A targeted bearish view", "The bearish butterfly", "The bearish condor", "Cheap, high reward to risk", "Why the POP is low", "Reading the real payoffs"], tags: ["Bearish"] },
    ],
  },
  {
    id: "D",
    name: "Volatility Strategies",
    desc: "Betting on a big move, or on calm, rather than on direction.",
    chapters: [
      { slug: "long-straddle-strangle", title: "Long Straddle and Strangle: Betting on a Big Move",
        summary: "Sometimes you expect a large move but not which way. Learn the long straddle and strangle, buying both a call and a put, the two breakevens, and the time decay that fights you, with real NIFTY metrics.",
        learn: ["A non-directional, big-move view", "The long straddle", "The cheaper long strangle", "Two breakevens", "Time decay as the enemy", "Reading the real payoffs"], tags: ["Volatility"] },
      { slug: "short-straddle-strangle", title: "Short Straddle and Strangle: Betting on Calm",
        summary: "The opposite bet, that price stays pinned. Learn the short straddle and strangle, selling both sides to collect premium, the wide profit zone, the large margin, and the unlimited risk that demands respect.",
        learn: ["A range-bound view", "The short straddle", "The wider short strangle", "Collecting premium", "Unlimited risk and large margin", "Reading the real payoffs"], tags: ["Volatility"] },
    ],
  },
  {
    id: "E",
    name: "Range and Income",
    desc: "The iron family, butterflies, ratios and the jade lizard: defined-risk income shapes.",
    chapters: [
      { slug: "iron-condor", title: "The Iron Condor",
        summary: "The most popular income strategy. Learn how four legs build a wide profit zone that pays you if NIFTY stays in a range, the long and short versions, defined risk on both ends, with the metrics.",
        learn: ["A defined-risk range play", "Four legs explained simply", "The wide profit plateau", "Long vs short iron condor", "Two breakevens and the POP", "Reading the real payoff"], tags: ["Range"] },
      { slug: "iron-fly-butterfly", title: "The Iron Fly and the Butterfly",
        summary: "Tighter, higher-reward cousins of the condor. Learn the iron fly (long and short) and the call and put butterfly, which pay the most if NIFTY pins one strike, with real payoff shapes.",
        learn: ["The iron fly", "Long vs short iron fly", "The call and put butterfly", "A pin-the-strike bet", "Higher reward, narrower zone", "Reading the real payoffs"], tags: ["Range"] },
      { slug: "ratio-and-backspreads", title: "Call and Put Ratio Spreads",
        summary: "Strategies with an unequal number of legs. Learn the call ratio spread and the put ratio spread, where selling extra options funds the trade but opens unlimited risk on one side, with the metrics.",
        learn: ["Unequal legs explained", "The call ratio spread", "The put ratio spread", "Where the naked risk hides", "Credit vs debit versions", "Reading the real payoffs"], tags: ["Range"] },
      { slug: "jade-lizard", title: "The Jade Lizard and Reverse Jade Lizard",
        summary: "Neat credit structures that remove the risk on one side. Learn the jade lizard (no upside risk) and the reverse jade lizard (no downside risk), and how the credit erases one tail, with real payoffs.",
        learn: ["The jade lizard structure", "No risk on the upside", "The reverse jade lizard", "No risk on the downside", "Why the credit matters", "Reading the real payoffs"], tags: ["Range"] },
    ],
  },
  {
    id: "F",
    name: "Advanced and Time",
    desc: "Wide multi-leg structures, calendars that trade time, and the synthetics.",
    chapters: [
      { slug: "advanced-multileg", title: "Batman, Double Fly and Double Condor",
        summary: "The big multi-leg structures. Learn the batman (two ratio wings), the double fly and the double condor, which place two range structures side by side for a wider or twin-peaked profit zone, with the metrics.",
        learn: ["Stacking structures", "The batman", "The double fly", "The double condor", "Twin profit peaks", "Reading the real payoffs"], tags: ["Advanced"] },
      { slug: "calendars", title: "Calendar and Diagonal Spreads: Trading Time",
        summary: "Strategies that sell a near expiry and buy a far one. Learn the call and put calendar and the diagonal, how the back-month leg keeps its time value to form a tent, and how they profit from time decay.",
        learn: ["Selling near, buying far", "The call and put calendar", "The diagonal spread", "The calendar tent shape", "Profiting from time decay", "Reading the real payoffs"], tags: ["Advanced"] },
      { slug: "synthetic-and-covered", title: "Synthetics and the Covered Call",
        summary: "Options can copy a future, and pair with one. Learn the long and short synthetic future (a call plus a put that mimics a future) and the covered call (a holding plus a sold call for income).",
        learn: ["The long synthetic future", "The short synthetic future", "Why they equal a future", "The covered call", "Earning income on a holding", "The cap on the upside"], tags: ["Advanced"] },
    ],
  },
  {
    id: "G",
    name: "Funding, Adjusting and Choosing",
    desc: "Margin and collateral, defending a tested trade, and choosing the right strategy.",
    chapters: [
      { slug: "collateral-and-margin", title: "Margin and Collateral for F&O",
        summary: "Selling options and trading futures blocks margin, but you do not always need cash. Learn how the margin is built from SPAN and exposure, how the OpenAlgo margin calculator shows it, and which assets you can pledge as collateral instead of cash.",
        learn: ["Why selling needs margin", "SPAN and exposure margin", "The OpenAlgo margin calculator", "Pledging collateral instead of cash", "What counts as F&O collateral", "Haircuts and the cash component"], tags: ["Management"] },
      { slug: "pledging-for-margin", title: "Pledging for Margin, Smartly",
        summary: "Pledging lets you trade on assets you already own without selling them. Learn how the haircut decides how much margin you get, why liquid collateral beats volatile stock, the interest cost of breaching the cash component, the covered-call trick, and the margin-call risk.",
        learn: ["How pledging works", "Haircuts and how much margin you get", "Cash vs non-cash collateral", "The cash-component interest cost", "Trick one: prefer liquid collateral", "Trick two: the covered call", "Margin-call and forced-selling risk"], tags: ["Management"] },
      { slug: "margin-penalties", title: "Margins and Margin Penalties",
        summary: "The exchange checks your margin at random moments through the day, and a shortfall costs you a penalty. Learn the minimum margin rule, the peak-margin checks, the penalty slabs, and the everyday situations that quietly trigger them.",
        learn: ["The minimum margin rule", "Peak margin and the random checks", "The penalty slabs", "Upfront vs non-upfront shortfalls", "Why a short or unhedge raises margin", "Keeping a margin buffer"], tags: ["Management"] },
      { slug: "options-adjustments", title: "Options Adjustments: Defending a Tested Trade",
        summary: "A strategy is rarely left untouched until expiry. Learn how to adjust a position when price tests it: rolling a strike up, down or out in time, converting a spread, adding a hedge leg, and the OpenAlgo workflow for closing and re-entering legs.",
        learn: ["Why adjust at all", "Rolling out in time", "Rolling a strike up or down", "Converting to a wider structure", "Adding a defensive leg", "When to adjust vs exit"], tags: ["Management"] },
      { slug: "position-greeks-and-iv", title: "Position Greeks and the Volatility Regime",
        summary: "A spread is more than its payoff picture. It carries a net delta, gamma, theta and vega, and it lives inside a volatility regime. Learn to read the aggregate Greeks of a whole position, judge whether implied volatility is rich or cheap with IV rank, read the skew and the term structure, and choose credit, debit or calendar structures that fit the regime you are actually in.",
        learn: ["Aggregate position delta and gamma", "Net theta and vega", "IV rank and percentile", "Reading the skew", "The volatility term structure", "Credit, debit or calendar by regime"], tags: ["Management"] },
      { slug: "choosing-and-managing", title: "Choosing a Strategy and Managing It",
        summary: "A strategy is only as good as the view behind it. Learn how to match a strategy to bullish, bearish, neutral or big-move views using the metrics, size the position for survival, and manage or exit when you are wrong.",
        learn: ["Matching strategy to view", "Using POP and risk to reward", "Defined risk first for beginners", "Position sizing", "When to take profit", "Knowing when to walk away"], tags: ["Management"] },
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
  Bullish: "nse",
  Bearish: "mcx",
  Volatility: "afl",
  Range: "py",
  Advanced: "nfo",
  Management: "live",
};
