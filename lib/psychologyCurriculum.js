// Single source of truth for the "Trading Psychology & Risk Playbooks" portal:
// 24 chapters across 4 modules (A-D). Slugs form the /trading-psychology/<slug>
// URLs - keep them stable. Chapter numbers are assigned automatically by position.

export const SERIES_TITLE = "Trading Psychology & Risk Playbooks";
export const SERIES_SUB =
  "The second half of staying alive in the markets: master your own mind, learn when to hedge (and when not to), the option-seller and hedger playbook, and a complete, ready-to-use risk plan for every type of participant - all in plain English with real Indian-market examples.";

export const PARTS = [
  {
    id: "A",
    name: "Trading Psychology & Emotional Intelligence",
    desc: "Why the market turns normal emotions into bad decisions - and the systems that protect you from yourself.",
    chapters: [
      { slug: "your-brain-and-markets", title: "Your Brain Is Not Built for Markets",
        summary: "Fear, greed, hope, regret and the dopamine of a winning trade. Why the wiring that kept our ancestors alive makes us terrible at handling money in volatile markets - and what to do about it.",
        learn: ["Why markets hijack emotion", "Fear, greed, hope, regret", "The dopamine trap", "Uncertainty and the brain", "Emotion vs decision", "Working with your wiring"], tags: ["Psychology"] },
      { slug: "loss-aversion-revenge", title: "Loss Aversion and Revenge Trading",
        summary: "A loss hurts about twice as much as the same gain feels good. How that imbalance starts a revenge trade, why the second trade is usually worse than the first, and how to stop after damage.",
        learn: ["What loss aversion is", "Why losses hurt double", "How revenge trades start", "The doubling-down spiral", "Stopping after damage", "A cool-down rule"], tags: ["Psychology"] },
      { slug: "fomo-overconfidence-herd", title: "FOMO, Overconfidence and Herd Behaviour",
        summary: "Buying because everyone else is making money, sizing up after a few wins, and mistaking a lucky streak for skill. The three crowd emotions that show up at exactly the wrong time.",
        learn: ["Fear of missing out", "Overconfidence after wins", "Herd behaviour and bubbles", "Luck vs skill", "Why tops feel safest", "Resisting the crowd"], tags: ["Psychology"] },
      { slug: "discipline-is-a-system", title: "Discipline Is a System, Not a Personality Trait",
        summary: "Discipline is not willpower you are born with - it is a set of rules and tools that remove decisions from emotional moments. Checklists, pre-set sizing, alerts and journaling that make the right action the default.",
        learn: ["Discipline as a system", "Why willpower fails", "Pre-committing to rules", "Checklists and alerts", "Removing in-the-moment decisions", "Designing your defaults"], tags: ["Discipline"] },
      { slug: "trading-journal", title: "Trading Journal and Review Process",
        summary: "What to actually record - setup, reason, risk, emotion, mistake, screenshot, result - and why a weekly review beats daily self-judgment. The single habit that turns losses into lessons.",
        learn: ["What to record", "Logging emotion and mistakes", "Screenshots and context", "Weekly vs daily review", "Finding your patterns", "A simple journal template"], tags: ["Discipline"] },
      { slug: "emotional-intelligence", title: "Building Emotional Intelligence",
        summary: "Recognising fear, anger, boredom, greed and shame as they happen - and the simple moves that follow: pause, reduce size, step away. How to stop trading your identity instead of your plan.",
        learn: ["Naming your emotions", "Spotting the warning signs", "Pause, reduce, step away", "Boredom and revenge", "Identity-based trading", "A personal reset routine"], tags: ["Psychology"] },
      { slug: "compulsive-trading", title: "When Trading Becomes Compulsive",
        summary: "Active trading can quietly turn into a behavioural problem. The honest red flags - borrowing to trade, hiding or lying about losses, being unable to stop, trading to escape stress - and why the right response is a full break and real help, not a bigger position.",
        learn: ["When trading becomes compulsive", "The gambling loop", "Borrowing to trade", "Hiding and lying about losses", "Being unable to stop", "Taking a full break and getting help"], tags: ["Psychology"] },
    ],
  },
  {
    id: "B",
    name: "Hedging: When, Why and When Not",
    desc: "Hedging trades one risk for a cost. When that trade is worth it, when it is not, and the simple tools to do it.",
    chapters: [
      { slug: "what-hedging-does", title: "What Hedging Really Does",
        summary: "Hedging reduces one risk by accepting another cost. It is not free protection and not a guaranteed profit - it is insurance, with a premium. The honest mental model before any hedge.",
        learn: ["Hedging as insurance", "Trading one risk for a cost", "Not free, not guaranteed", "What a hedge protects", "What a hedge cannot do", "The honest trade-off"], tags: ["Hedging"] },
      { slug: "when-to-hedge", title: "When You Should Hedge",
        summary: "A large portfolio into an event, concentrated stock exposure, overnight F&O risk, a business exposure, or a known future cash need. The situations where paying for protection actually makes sense.",
        learn: ["Event risk on a big book", "Concentrated stock exposure", "Overnight F&O risk", "Business and currency exposure", "A known future cash need", "Sizing the hedge"], tags: ["Hedging"] },
      { slug: "when-not-to-hedge", title: "When You Should Not Hedge",
        summary: "A small portfolio, a long-term SIP, tiny positions, plain fear, an expensive hedge, or a risk you cannot define. Often the cheaper, cleaner move is simply to cut the position.",
        learn: ["When hedging is overkill", "Small books and SIPs", "Hedging out of fear", "When the hedge costs too much", "Undefined risk", "Cutting vs hedging"], tags: ["Hedging"] },
      { slug: "cost-of-hedging", title: "The Cost of Hedging",
        summary: "Option premium, time decay, the bid-ask spread, taxes, brokerage, slippage, basis risk, margin and the upside you give up. Every hedge has a bill - here is how to read it before you pay it.",
        learn: ["Premium and time decay", "Spread, brokerage, taxes", "Basis and tracking risk", "Margin on the hedge", "Giving up upside", "Total cost of protection"], tags: ["Hedging"] },
      { slug: "simple-hedging-tools", title: "Simple Hedging Tools",
        summary: "Protective put, covered call, collar, an index-future hedge, simply reducing position size, holding cash, and diversification itself. The beginner-friendly ways to lower risk, ranked by cost and simplicity.",
        learn: ["Protective put", "Covered call and collar", "Index-future hedge", "Cash as a hedge", "Reducing size", "Diversification as a hedge"], tags: ["Hedging"] },
      { slug: "hedge-ratio-portfolio", title: "Hedge Ratio and Portfolio Hedge",
        summary: "Beta, notional value, the index hedge, partial vs full hedging, and why over- and under-hedging both cost you. How to size a portfolio hedge without pretending a perfect hedge exists.",
        learn: ["Beta and notional value", "Sizing an index hedge", "Partial vs full hedge", "Over- and under-hedging", "Why perfect hedges are rare", "A worked portfolio hedge"], tags: ["Hedging"] },
    ],
  },
  {
    id: "C",
    name: "The Option-Seller & Hedger Playbook",
    desc: "For the income-seller and hedger: defined risk first, where structures still fail, and respecting the tail.",
    chapters: [
      { slug: "naked-vs-hedged-selling", title: "Naked Selling vs Hedged Selling",
        summary: "Why a naked short option carries open-ended risk, how a spread defines your maximum loss up front, and why defined-risk selling is the only sensible starting point for a beginner.",
        learn: ["The naked-short danger", "How a spread caps loss", "Defined vs undefined risk", "Margin difference", "Why beginners start hedged", "Reading max loss first"], tags: ["Options"] },
      { slug: "credit-spreads-condors", title: "Credit Spreads, Iron Condors and Iron Flies",
        summary: "How these defined-risk structures reduce risk, where they still fail, and why - for a seller - the maximum loss matters far more than the maximum profit. With clear payoff diagrams.",
        learn: ["Credit spread basics", "Iron condor and iron fly", "Where structures fail", "Max loss vs max profit", "Probability vs payoff", "Choosing strikes sensibly"], tags: ["Options"] },
      { slug: "adjustment-risk", title: "Adjustment Risk",
        summary: "Rolling, shifting, adding legs, doubling down. When an adjustment genuinely reduces risk, and when it is just a way to hide a losing trade and quietly grow the position.",
        learn: ["What 'adjusting' means", "Rolling and shifting", "Adding legs", "Good vs bad adjustments", "Hiding a bad trade", "A pre-set adjustment rule"], tags: ["Options"] },
      { slug: "tail-risk-for-sellers", title: "Tail Risk for Option Sellers",
        summary: "The one-day move that erases months of premium. Black-swan risk, overnight gaps, a volatility explosion and liquidity drying up exactly when you need to exit - and how sellers prepare for it.",
        learn: ["What tail risk is", "Months of premium, one day", "Gaps and vol explosions", "Liquidity disappearing", "Tail hedges", "Surviving the rare day"], tags: ["Options"] },
    ],
  },
  {
    id: "D",
    name: "Complete Risk Plans by User Type",
    desc: "Put it all together: a concrete, ready-to-use risk plan for each kind of participant, and a master checklist.",
    chapters: [
      { slug: "plan-long-term-investors", title: "Risk Plan for Long-Term Investors",
        summary: "Asset allocation, SIPs, rebalancing, an emergency fund, and the single most important skill: how to behave during a crash instead of panic-selling the bottom.",
        learn: ["Allocation and SIPs", "Rebalancing cadence", "Emergency-fund buffer", "Crash behaviour rules", "Avoiding panic exits", "A one-page investor plan"], tags: ["Plan"] },
      { slug: "plan-stock-traders", title: "Risk Plan for Stock Traders",
        summary: "Setup risk, the stop-loss, position sizing, a daily loss limit, gap risk, a journal and a review routine - the swing trader's complete risk checklist in one place.",
        learn: ["Per-trade risk", "Stop and sizing", "Daily loss limit", "Gap-risk rules", "Journaling", "A one-page trader plan"], tags: ["Plan"] },
      { slug: "plan-intraday-traders", title: "Risk Plan for Intraday Traders",
        summary: "Max trades and max loss per day, a no-revenge rule, a liquidity filter, time-of-day risk and execution discipline - the guardrails that keep an intraday account alive.",
        learn: ["Max trades per day", "Daily max loss", "The no-revenge rule", "Liquidity and timing", "Execution discipline", "A one-page intraday plan"], tags: ["Plan"] },
      { slug: "plan-futures-traders", title: "Risk Plan for Futures Traders",
        summary: "A leverage cap, a mark-to-market buffer, overnight risk, rollover discipline, margin stress and event avoidance - sizing and rules built for the linear, leveraged world of futures.",
        learn: ["Leverage cap", "MTM buffer", "Overnight risk", "Rollover discipline", "Event avoidance", "A one-page futures plan"], tags: ["Plan"] },
      { slug: "plan-option-buyers", title: "Risk Plan for Option Buyers",
        summary: "A premium budget, expiry selection, awareness of implied volatility, a stop-loss, and the discipline to stop buying lottery-ticket options. A realistic plan for the option buyer.",
        learn: ["A premium budget", "Choosing expiry", "IV awareness", "Stops for buyers", "Avoiding lottery buying", "A one-page buyer plan"], tags: ["Plan"] },
      { slug: "plan-option-sellers", title: "Risk Plan for Option Sellers",
        summary: "Defined risk, a margin buffer, a tail hedge, pre-set adjustment rules, a max-loss day and event filters - the seller's survival plan, because selling forgives the least.",
        learn: ["Defined risk only", "Margin buffer", "A standing tail hedge", "Adjustment rules", "Max-loss day", "A one-page seller plan"], tags: ["Plan"] },
      { slug: "plan-hedgers", title: "Risk Plan for Hedgers",
        summary: "What exposure is actually being hedged, the hedge size, its cost, its expiry, and when to remove it - a clean process so a hedge protects you instead of quietly becoming a second bet.",
        learn: ["Define the exposure", "Hedge size", "Hedge cost and expiry", "When to remove a hedge", "Hedge vs new position", "A one-page hedger plan"], tags: ["Plan"] },
      { slug: "final-checklist", title: "Final Checklist: Before You Put Real Money",
        summary: "The master checklist that ties the whole course together: capital, risk per trade, max loss, the hedge decision, your emotional state, an exit plan and a review process - run it before every real-money commitment.",
        learn: ["Capital and buckets", "Risk per trade and max loss", "The hedge decision", "Emotional-state check", "A written exit plan", "The review loop"], tags: ["Plan"] },
    ],
  },
  {
    id: "E",
    name: "Reference and Staying Current",
    desc: "The live facts behind this course - lot sizes, margins, expiry dates, SEBI figures - change over time. Here is where to verify them.",
    chapters: [
      { slug: "sources-and-staying-current", title: "Sources and Staying Current",
        summary: "Lot sizes, expiry dates, margins, charges and SEBI figures all change. This reference shows where to verify every live fact this course uses, and the simple 'as of date' habit that keeps your own numbers from going stale.",
        learn: ["Where to check NSE lot sizes and specs", "Expiry calendar sources", "The SEBI F&O studies", "Margin and settlement rules", "The 'as of date' habit", "A fact-to-source table"], tags: ["Plan"] },
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
  Psychology: "py",
  Discipline: "idx",
  Hedging: "nfo",
  Options: "mcx",
  Plan: "afl",
};
