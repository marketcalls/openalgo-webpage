// Single source of truth for the "Risk Management" learning portal:
// 30 chapters across 6 modules (A-F). Slugs form the /risk-management/<slug> URLs
// - keep them stable. Chapter numbers are assigned automatically by position, so
// chapters can be inserted with no manual renumbering.

export const SERIES_TITLE = "Risk Management";
export const SERIES_SUB =
  "A free, absolute-beginner course on the one skill that keeps you in the game: how not to get destroyed. Real Indian-market examples, simple language, clear diagrams, checklists and practical rules - for investors, traders, intraday traders and F&O beginners.";

export const PARTS = [
  {
    id: "A",
    name: "Risk Is Not Just Losing Money",
    desc: "What risk really means, why survival comes before profit, and which money should never enter the market.",
    chapters: [
      { slug: "what-risk-really-means", title: "What Risk Really Means",
        summary: "Risk is not just a number on a screen. It is losing capital, losing sleep, losing discipline, losing time, or being forced to sell at the worst possible moment. We start by seeing risk the way survivors do.",
        learn: ["Risk is more than volatility", "The many faces of losing", "Permanent vs temporary loss", "Being a forced seller", "Risk you can see vs risk you ignore", "Why beginners misjudge risk"], tags: ["Mindset"] },
      { slug: "survive-first", title: "The First Rule: Survive",
        summary: "Profit is optional; survival is not. Why one bad trade can undo years of gains, what 'risk of ruin' means in plain numbers, and why the goal of a beginner is simply to stay in the game.",
        learn: ["Survival before profit", "Risk of ruin, simply", "Why losses compound against you", "The math of getting back to even", "How one trade ends accounts", "Staying in the game"], tags: ["Mindset"] },
      { slug: "risk-vs-reward", title: "Risk vs Reward, Simply Explained",
        summary: "High returns always carry hidden risk - the only question is whether you can see it. The difference between known risk, unknown risk, and the risk you are quietly pretending is not there.",
        learn: ["Why return and risk travel together", "Known vs unknown risk", "Hidden risk in 'safe' bets", "The free-lunch trap", "Reading a risk-reward honestly", "Real Indian examples"], tags: ["Mindset"] },
      { slug: "the-risk-pyramid", title: "The Risk Pyramid",
        summary: "Before any market money, build the base: emergency fund, insurance, debt control. Then investing capital, trading capital, and speculation capital on top - and the money that should never enter the market at all.",
        learn: ["The risk pyramid, layer by layer", "Emergency fund first", "Insurance and debt as risk control", "Investing vs trading vs speculation capital", "Money that must stay out", "Sizing each layer"], tags: ["Money"] },
    ],
  },
  {
    id: "B",
    name: "The Beginner's Money Safety System",
    desc: "Market risk starts outside the market. Fix your base, separate your money, and match risk to your real life.",
    chapters: [
      { slug: "fix-your-base", title: "Before You Invest: Fix Your Base",
        summary: "Emergency fund, health insurance, term insurance, high-interest debt and income stability - why your real risk management begins long before you place a single order.",
        learn: ["The pre-investing checklist", "How big an emergency fund", "Health and term insurance basics", "Why high-interest debt comes first", "Income stability as a cushion", "Market risk starts outside the market"], tags: ["Money"] },
      { slug: "capital-buckets", title: "Capital Buckets",
        summary: "Separating long-term investing money, short-term goal money, trading money, F&O money and learning money - so a loss in one bucket never sinks the whole boat.",
        learn: ["Why one pool is dangerous", "The five money buckets", "Goal money vs risk money", "A separate learning bucket", "Never mixing buckets", "A simple bucket plan"], tags: ["Money"] },
      { slug: "time-horizon-is-risk", title: "Time Horizon Is Risk Management",
        summary: "Six-month money, three-year money and twenty-year money must be handled completely differently. Why time horizon decides how much risk you can responsibly take.",
        learn: ["Why horizon changes everything", "Short-term money rules", "Medium-term money rules", "Long-term money and volatility", "Matching assets to horizon", "The horizon mistakes beginners make"], tags: ["Money"] },
      { slug: "risk-capacity-vs-tolerance", title: "How Much Risk Can You Actually Take?",
        summary: "Risk capacity (what your finances can survive) is not the same as risk tolerance (what your emotions can handle). Worked examples for a salary earner, retiree, business owner, trader, homemaker and student.",
        learn: ["Capacity vs tolerance", "Measuring your real capacity", "Knowing your emotional limit", "When the two disagree", "Six real-life profiles", "Setting your personal risk budget"], tags: ["Money"] },
    ],
  },
  {
    id: "C",
    name: "Investor Risk Management",
    desc: "For long-term investors: allocation, diversification, behaviour in falls, and the mistakes that look smart.",
    chapters: [
      { slug: "asset-allocation", title: "Asset Allocation: The Biggest Decision",
        summary: "Equity, debt, gold, cash and real estate - why how you split your money matters far more than which stock you pick, and how a simple allocation controls most of your real risk.",
        learn: ["What asset allocation is", "Why it beats stock-picking", "The major asset classes", "A simple starter allocation", "How allocation controls risk", "Indian examples and falls"], tags: ["Investor"] },
      { slug: "diversification", title: "Diversification Without Overdoing It",
        summary: "One stock is dangerous; one hundred is pointless. How spreading across companies reduces single-company risk, and how mutual funds and index funds do it for you.",
        learn: ["Why one stock is risky", "What diversification really fixes", "Diminishing returns past a point", "Funds and index funds", "Over-diversification ('diworsification')", "A right-sized portfolio"], tags: ["Investor"] },
      { slug: "sip-lumpsum-falls", title: "SIPs, Lumpsum and Market Falls",
        summary: "Why SIPs help your behaviour more than your returns, when a lumpsum makes sense, and why a falling market is not automatically bad news for a long-term investor.",
        learn: ["How an SIP controls behaviour", "Rupee-cost averaging, honestly", "When lumpsum makes sense", "Why falls help accumulators", "Staying invested through crashes", "Real NIFTY fall examples"], tags: ["Investor"] },
      { slug: "rebalancing", title: "Rebalancing: Selling Winners, Buying Losers",
        summary: "Rebalancing forces you to trim what ran up and add to what lagged - the discipline that controls risk, why it feels emotionally wrong, and how often a beginner should actually do it.",
        learn: ["What rebalancing does", "Why it controls risk", "Why it feels backwards", "Threshold vs calendar rebalancing", "How often is enough", "A beginner's rule"], tags: ["Investor"] },
      { slug: "concentrated-stock-risk", title: "Concentrated Stock Risk",
        summary: "Employee stock, family-business stock, a favourite stock, IPO hype, the multibagger obsession. When concentration builds real wealth - and when it quietly destroys it.",
        learn: ["What concentration risk is", "Employee and family-business stock", "Favourite-stock bias", "IPO and multibagger hype", "When concentration is worth it", "Cutting concentration safely"], tags: ["Investor"] },
      { slug: "investor-mistakes", title: "Investor Mistakes That Look Smart",
        summary: "Averaging down blindly, chasing past returns, panic-exiting crashes, buying only because the price fell, confusing a dividend with safety - the mistakes that feel clever and cost the most.",
        learn: ["Blind averaging down", "Chasing past performance", "Panic-selling crashes", "'It fell, so it's cheap'", "Dividend-as-safety myth", "How to catch yourself"], tags: ["Investor"] },
    ],
  },
  {
    id: "D",
    name: "Trader Risk Management",
    desc: "Trading is a different game with different rules: exits, sizing, stops, expectancy and hard risk limits.",
    chapters: [
      { slug: "trading-is-not-investing", title: "Trading Is Not Investing",
        summary: "Different game, different rules. Why traders cannot lean on time and patience the way investors do, and why exits, position sizing, stop-losses, logs and daily risk limits are non-negotiable.",
        learn: ["Trading vs investing", "Why time won't save a trade", "The trader's risk toolkit", "Edge, not conviction", "Process over prediction", "Why most beginners blow up"], tags: ["Trader"] },
      { slug: "position-sizing", title: "Position Sizing Made Simple",
        summary: "The single most important risk control: how many shares to buy. Fixed-rupee risk, percentage risk, stop distance and a beginner calculator you can copy for every trade.",
        learn: ["Why size is risk", "Fixed-rupee risk", "Percentage-of-capital risk", "Stop distance to quantity", "A beginner sizing calculator", "Common sizing mistakes"], tags: ["Trader"] },
      { slug: "stop-loss", title: "Stop-Loss: Insurance or Illusion?",
        summary: "A stop only protects you if it is placed before emotion enters. Technical stops, volatility stops, time stops, mental stops and the disaster stop - and why mental stops usually fail.",
        learn: ["What a stop really is", "Technical and volatility stops", "Time and disaster stops", "Why mental stops fail", "Placing a stop before emotion", "When stops cannot help"], tags: ["Trader"] },
      { slug: "risk-reward-win-rate", title: "Risk-Reward and Win Rate",
        summary: "Why 80% accuracy can still lose money and 40% accuracy can make money. Expectancy explained with simple Indian-rupee examples, so you stop chasing being right and start chasing being profitable.",
        learn: ["Win rate is not edge", "Risk-reward ratio", "Expectancy in plain rupees", "Why high accuracy can lose", "Why low accuracy can win", "Designing a positive-expectancy trade"], tags: ["Trader"] },
      { slug: "drawdowns-losing-streaks", title: "Drawdowns and Losing Streaks",
        summary: "What a 10%, 20% and 40% drawdown actually feels like, how many losses in a row are statistically normal, and why beginners do the worst possible thing - increase size - at exactly the wrong time.",
        learn: ["What a drawdown is", "How recovery math works", "Normal losing streaks", "The emotional curve of a drawdown", "Why beginners size up when losing", "Surviving a bad run"], tags: ["Trader"] },
      { slug: "risk-limits", title: "Daily, Weekly and Monthly Risk Limits",
        summary: "Max loss per trade, per day, per week and per strategy. When to stop trading for the day, when to stop for the month, and why pre-set limits are the difference between a bad day and a blown account.",
        learn: ["Per-trade risk limit", "Daily and weekly stop", "Per-strategy limits", "When to walk away", "Monthly circuit breaker", "Building your limit sheet"], tags: ["Trader"] },
    ],
  },
  {
    id: "E",
    name: "Leverage, Margin and Execution Risk",
    desc: "How borrowed money, forced exits and the gap between the price you see and the price you get destroy beginners.",
    chapters: [
      { slug: "leverage", title: "Leverage: The Fastest Way to Lose Control",
        summary: "Leverage magnifies both profit and loss. How a small price move becomes large capital damage, why leverage shortens the time you have to be right, and the Indian numbers that show how fast it bites.",
        learn: ["What leverage is", "How it magnifies loss", "Small move, big damage", "Leverage and time pressure", "Real margin examples", "Choosing a safe leverage"], tags: ["Leverage"] },
      { slug: "margin-calls", title: "Margin Calls and Forced Exits",
        summary: "What margin means, why your broker squares you off, why forced exits happen at the worst prices, and why 'available margin' is not the same as usable capital.",
        learn: ["What margin really is", "Why brokers force-close", "Forced exits at bad prices", "Available vs usable margin", "Peak-margin rules", "Avoiding the square-off"], tags: ["Leverage"] },
      { slug: "slippage-liquidity-spread", title: "Slippage, Liquidity and Spread",
        summary: "The price you see is not always the price you get. Bid-ask spread, market vs limit orders, liquidity and impact cost - the quiet taxes that turn a winning idea into a losing trade.",
        learn: ["The bid-ask spread", "Market vs limit orders", "What liquidity means", "Impact cost on size", "Slippage in fast markets", "Trading liquid instruments"], tags: ["Leverage"] },
      { slug: "gap-and-event-risk", title: "Gap Risk and Event Risk",
        summary: "Results, RBI policy, elections, global shocks and overnight news move price while the market is shut. Why a stop-loss cannot protect you against a gap, and how to size for the surprises.",
        learn: ["What a gap is", "Why stops fail on gaps", "Overnight and event risk", "Results and policy days", "Global shock examples", "Sizing for surprises"], tags: ["Leverage"] },
    ],
  },
  {
    id: "F",
    name: "F&O Risk for Beginners",
    desc: "Futures and options reward respect and punish casual participation. The risks every beginner must meet first.",
    chapters: [
      { slug: "why-fno-is-different", title: "Why F&O Is Different",
        summary: "Expiry, leverage, margin, mark-to-market, time decay and lot size combine to punish casual participation. Why F&O is not 'stocks with more action' but a different risk world entirely.",
        learn: ["What makes F&O different", "Expiry and lot size", "Leverage and margin", "Mark-to-market pressure", "Time decay basics", "Why casual F&O fails"], tags: ["F&O"] },
      { slug: "futures-risk", title: "Futures Risk",
        summary: "Futures are simple but dangerous: linear profit and loss, daily mark-to-market, gap risk, rollover risk, basis risk and constant margin pressure. The honest risk profile of a futures position.",
        learn: ["Linear profit and loss", "Daily MTM cash flow", "Gap and overnight risk", "Rollover and basis risk", "Margin pressure", "Sizing a futures trade"], tags: ["F&O"] },
      { slug: "option-buyer-risk", title: "Option Buyer Risk",
        summary: "Limited loss, but a low probability of winning. Premium decay, being right on direction but wrong on timing, IV crush, and the overtrading of cheap options that quietly drains an account.",
        learn: ["Limited loss, low odds", "Premium time decay", "Right direction, wrong timing", "IV crush after events", "The cheap-option trap", "Buying options with discipline"], tags: ["Options"] },
      { slug: "option-seller-risk", title: "Option Seller Risk",
        summary: "Small frequent profits and rare, large losses. Why 'high probability' is not the same as 'low risk', what the loss tail really looks like, and the respect option selling demands.",
        learn: ["The seller's payoff shape", "High probability vs low risk", "The fat loss tail", "Margin and assignment", "Why sellers blow up", "Selling with defined risk"], tags: ["Options"] },
      { slug: "greeks-as-risk", title: "Greeks as Risk Language",
        summary: "Delta, gamma, theta and vega explained only as risk tools, not formulas. What can hurt you today, what builds up by tomorrow, and what explodes during a shock.",
        learn: ["Greeks as a risk dashboard", "Delta: direction risk", "Theta: time risk", "Vega: volatility risk", "Gamma: acceleration risk", "Reading your position's Greeks"], tags: ["Options"] },
      { slug: "expiry-day-risk", title: "Expiry-Day Risk",
        summary: "Gamma spikes, liquidity traps, sudden moves, execution freezes and adjustment panic. Why expiry day is the least beginner-friendly day on the calendar, with real Indian expiry examples.",
        learn: ["Why expiry is special", "Gamma spikes near expiry", "Liquidity traps", "Execution freezes", "Adjustment panic", "Why beginners should wait"], tags: ["Options"] },
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
  Mindset: "idx",
  Money: "nse",
  Investor: "nfo",
  Trader: "us",
  Leverage: "live",
  "F&O": "mcx",
  Options: "py",
  Plan: "afl",
};
