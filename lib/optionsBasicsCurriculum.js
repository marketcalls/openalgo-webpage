// Single source of truth for the "Options Basics" learning portal:
// 26 chapters across 7 modules. Slugs form the /options-basics/<slug> URLs, keep them stable.
// Single-leg payoffs and mechanics live here; full strategy construction is in /options-strategies.

export const SERIES_TITLE = "Options Basics";
export const SERIES_SUB =
  "Options explained from absolute zero, and the mechanics most beginner courses skip. Start with what a call and a put are, then learn how the contract really works, how the price moves before expiry, how to choose a strike and an expiry, what selling costs in margin, and how to manage risk, all in plain English with real charts. We are honest about why most option buyers lose.";

export const PARTS = [
  {
    id: "A",
    name: "Why and What",
    desc: "What an option is, why options exist, and how they differ from futures and stocks.",
    chapters: [
      { slug: "what-is-an-option", title: "What Is an Option?",
        summary: "An option is the right, but not the duty, to buy or sell at a set price by a set date. Learn that one idea with a simple real-life analogy before any market jargon arrives.",
        learn: ["A right, not an obligation", "The token-money analogy", "Underlying, strike and expiry", "Why someone pays for the right", "Options vs futures in one line", "The two basic types"], tags: ["Basics"] },
      { slug: "why-options-exist", title: "Why Options Exist",
        summary: "Options were not invented for gambling. Learn the four real jobs they do, hedging, speculation, income and leverage, and why a big institution uses them very differently from a retail trader.",
        learn: ["Hedging an existing holding", "Speculating with limited risk", "Earning income by selling", "Leverage, the double edge", "How institutions really use options", "Why retail misuse is common"], tags: ["Basics"] },
      { slug: "options-vs-futures-vs-stocks", title: "Options vs Futures vs Stocks",
        summary: "Three ways to bet on the same move, with very different risk. Learn how the capital, the risk shape, and margin versus premium compare, and why an option is not just a cheaper future.",
        learn: ["Capital needed for each", "The shape of the risk", "Margin vs premium upfront", "Why options are not cheap futures", "Limited vs unlimited loss", "Choosing the right tool"], tags: ["Basics"] },
      { slug: "calls-and-puts", title: "Calls and Puts: The Two Building Blocks",
        summary: "Every option strategy ever built is made from just two pieces. Learn the call (the right to buy) and the put (the right to sell), and a simple way to never mix them up again.",
        learn: ["The call: a right to buy", "The put: a right to sell", "A way to remember which is which", "When you would want each", "Calls rise, puts fall", "Combining them later"], tags: ["Basics"] },
    ],
  },
  {
    id: "B",
    name: "The Contract and Settlement",
    desc: "How an option contract is built, index versus stock options, and what happens at expiry.",
    chapters: [
      { slug: "premium-strike-expiry", title: "Premium, Strike and Expiry",
        summary: "Three numbers define every option. Learn the premium you pay, the strike price you lock in, and the expiry date it all ends on, with a real RELIANCE option symbol.",
        learn: ["The premium (the price of the option)", "The strike price", "The expiry date", "Reading an option symbol", "Per share vs per lot", "How the three interact"], tags: ["Mechanics"] },
      { slug: "right-not-obligation", title: "The Right, Not the Obligation",
        summary: "The single idea that makes options special: the buyer can walk away. Learn why a buyer's loss is capped at the premium while a seller takes on a duty, and why that asymmetry matters.",
        learn: ["The buyer can choose not to act", "Capped loss for the buyer", "The seller's obligation", "Why the seller is paid upfront", "Exercise and expiry worthless", "The core asymmetry"], tags: ["Basics"] },
      { slug: "index-vs-stock-options", title: "Index vs Stock Options in India",
        summary: "NIFTY options and RELIANCE options follow different rules. Learn the contract specs, the lot sizes, and the big one: index options settle in cash while stock options settle by physical delivery, which catches beginners out.",
        learn: ["Index options (NIFTY, BANKNIFTY)", "Single-stock options (RELIANCE)", "Lot size and contract value", "Cash settlement for the index", "Physical delivery for stocks", "Why stock expiry surprises beginners"], tags: ["Mechanics"] },
      { slug: "expiry-exercise-assignment", title: "Expiry, Exercise and Assignment",
        summary: "What actually happens on expiry day. Learn how in-the-money and out-of-the-money options are treated, how auto-exercise works, and the assignment risk a seller must respect.",
        learn: ["What happens on expiry day", "ITM, ATM and OTM at expiry", "Auto-exercise of ITM options", "Settlement in cash or shares", "Assignment risk for sellers", "Why you square off in time"], tags: ["Mechanics"] },
    ],
  },
  {
    id: "C",
    name: "Reading the Price",
    desc: "Moneyness, value, the crucial payoff-vs-today difference, the option chain and liquidity.",
    chapters: [
      { slug: "moneyness", title: "In, At and Out of the Money",
        summary: "ITM, ATM, OTM are the labels you will see everywhere. Learn what in-the-money, at-the-money and out-of-the-money mean for calls and puts, with a clear picture.",
        learn: ["At-the-money (ATM)", "In-the-money (ITM)", "Out-of-the-money (OTM)", "Moneyness for calls vs puts", "Why OTM options are cheap", "How moneyness changes with price"], tags: ["Reading"] },
      { slug: "intrinsic-and-time-value", title: "Intrinsic Value and Time Value",
        summary: "An option's premium is built from two parts. Learn intrinsic value (the real, here-and-now worth) and time value (the hope premium that melts away as expiry nears).",
        learn: ["Intrinsic value defined", "Time value defined", "Premium = intrinsic + time", "Why OTM is all time value", "Time decay as expiry nears", "Why this matters for buyers"], tags: ["Reading"] },
      { slug: "payoff-vs-live-pnl", title: "Payoff at Expiry vs Live P&L Before Expiry",
        summary: "The most misunderstood idea in options. A payoff diagram shows your result at expiry, not your profit today. Learn why an option's price moves before expiry with volatility, time decay and delta, so the chart and your screen disagree.",
        learn: ["What a payoff diagram really shows", "Why it is not today's P&L", "Delta, the price-now effect", "Theta, the daily bleed", "Vega, the volatility effect", "Why you can be right and still lose"], tags: ["Reading"] },
      { slug: "the-option-chain", title: "Reading the Option Chain",
        summary: "The option chain is the menu of every strike and its price. Learn to read it row by row, calls on one side, puts on the other, and find the at-the-money strike at a glance.",
        learn: ["The layout of a chain", "Calls, strikes and puts", "LTP, bid and ask", "Open interest and volume", "Finding the ATM strike", "What a chain tells you"], tags: ["Reading"] },
      { slug: "bid-ask-spread-liquidity", title: "Bid, Ask, Spread and Liquidity",
        summary: "The last traded price can lie to you. Learn the bid, the ask and the spread you actually trade against, the difference between volume and open interest, and why an illiquid strike is dangerous even when it looks cheap.",
        learn: ["Why the LTP can mislead", "Bid, ask and the spread", "The real cost of a wide spread", "Volume vs open interest", "Spotting an illiquid strike", "Why illiquid options trap you"], tags: ["Reading"] },
    ],
  },
  {
    id: "D",
    name: "The Four Payoffs",
    desc: "The four single-leg positions, drawn as real payoff diagrams, that everything is built from.",
    chapters: [
      { slug: "long-call", title: "Buying a Call (Long Call)",
        summary: "The most intuitive option trade. Learn the long call payoff on a real RELIANCE example: limited loss (the premium), a breakeven above the strike, and unlimited upside.",
        learn: ["When you buy a call", "Limited loss, the premium", "The breakeven point", "Unlimited upside", "Reading the real payoff", "Why most call buyers still lose"], tags: ["Payoff"] },
      { slug: "long-put", title: "Buying a Put (Long Put)",
        summary: "The mirror image: profiting from a fall with limited risk. Learn the long put payoff, the breakeven below the strike, and how a put can act as insurance on a holding.",
        learn: ["When you buy a put", "Limited loss, the premium", "The breakeven below strike", "Large but capped profit", "A put as insurance", "Reading the real payoff"], tags: ["Payoff"] },
      { slug: "short-call-and-put", title: "Selling Options (Short Call and Put)",
        summary: "The other side of the trade: collecting the premium. Learn the short call and short put payoffs, the capped profit, the large or unlimited risk, and why sellers must respect that risk.",
        learn: ["Selling to collect premium", "Short call: unlimited risk", "Short put: large risk", "Capped profit (the premium)", "Margin for sellers", "Reading the real payoffs"], tags: ["Payoff"] },
      { slug: "buyer-vs-seller", title: "Buyer vs Seller: Who Has the Edge?",
        summary: "Buyers have limited risk; sellers have the odds. Learn the honest trade-off between the two sides, why time decay favours the seller, and why neither is a free lunch.",
        learn: ["Buyer: limited risk, low odds", "Seller: high odds, large risk", "Time decay favours the seller", "Probability vs payoff", "Why most buyers lose", "Choosing a side honestly"], tags: ["Payoff"] },
    ],
  },
  {
    id: "E",
    name: "Volatility and Positioning",
    desc: "The Greeks, implied volatility, the expected move, and what open interest really tells you.",
    chapters: [
      { slug: "the-greeks", title: "The Greeks: Delta, Gamma, Theta, Vega",
        summary: "The Greeks measure what moves an option's price. Learn delta (direction), gamma (acceleration), theta (time decay) and vega (volatility) in plain words, no formulas.",
        learn: ["Delta: sensitivity to price", "Gamma: how delta changes", "Theta: the daily time decay", "Vega: sensitivity to volatility", "Why theta is the buyer's enemy", "Reading the Greeks simply"], tags: ["Greeks"] },
      { slug: "implied-volatility", title: "Implied Volatility: The Market's Fear Gauge",
        summary: "Implied volatility is the market's expectation of how much price will move, baked into the premium. Learn why high IV makes options expensive and why buying before a known event can backfire.",
        learn: ["What implied volatility is", "IV and the premium", "High IV vs low IV", "IV crush after an event", "Why expensive options disappoint buyers", "Reading IV practically"], tags: ["Volatility"] },
      { slug: "hv-iv-and-expected-move", title: "Historical vs Implied Volatility, and the Expected Move",
        summary: "Implied volatility only means something next to history. Learn how historical volatility compares to IV, the idea of IV rank, and how the market prices an expected range, with the at-the-money straddle as a quick expected-move gauge.",
        learn: ["Historical vs implied volatility", "The idea of IV rank or percentile", "Why expensive does not mean bad", "The expected move explained", "The ATM straddle as a gauge", "Why a right call can still lose"], tags: ["Volatility"] },
      { slug: "open-interest-volume-pcr", title: "Open Interest, Volume and PCR",
        summary: "Open interest is the most quoted and most misread number in options. Learn what OI actually means, how to read a build-up versus an unwinding or short covering, the put-call ratio, and why none of it is a crystal ball.",
        learn: ["What open interest means", "OI build-up vs unwinding", "Short covering explained", "Volume vs open interest again", "The put-call ratio (PCR)", "Why OI is not a prediction machine"], tags: ["Reading"] },
    ],
  },
  {
    id: "F",
    name: "Choosing and Costs",
    desc: "Picking a strike and an expiry, the margin selling needs, transaction costs, and event risk.",
    chapters: [
      { slug: "choosing-strike-and-expiry", title: "How to Choose a Strike and an Expiry",
        summary: "Two decisions decide most of your outcome. Learn how to pick a strike (ITM, ATM or OTM, and the delta-based shortcut), why a far OTM option is a lottery ticket, and how to choose weekly versus monthly while respecting theta and events.",
        learn: ["ITM, ATM or OTM, which and why", "Delta as a strike guide", "The far-OTM lottery trap", "Weekly vs monthly expiry", "Near vs far expiry and theta", "Liquidity and event filters"], tags: ["Selection"] },
      { slug: "margin-and-costs", title: "Margin for Sellers, and Transaction Costs",
        summary: "Selling options is not free money. Learn why a seller must post a large SPAN plus exposure margin, how a hedge reduces it, and the full stack of charges, brokerage, STT, exchange fees, GST and stamp duty, that move your real breakeven.",
        learn: ["Why selling needs large margin", "SPAN and exposure in plain words", "How a hedge cuts the margin", "Pledging collateral, a caveat", "Brokerage, STT and the charges", "Your true cost-adjusted breakeven"], tags: ["Costs"] },
      { slug: "event-risk", title: "Event Risk: Results, Policy and Budgets",
        summary: "Options live and die around events. Learn how implied volatility expands before a known event like results, an RBI policy, the Budget or a Fed meeting, and crushes right after, so a correct directional call can still lose money.",
        learn: ["What counts as an event", "IV expansion before the event", "IV crush right after", "Why buyers get hurt on events", "How sellers use events", "Trading around an event safely"], tags: ["Risk"] },
    ],
  },
  {
    id: "G",
    name: "Trading Safely and Next Steps",
    desc: "Managing risk and avoiding the classic mistakes, then the bridge to real strategies and a checklist.",
    chapters: [
      { slug: "risk-and-mistakes", title: "Risk Management and the Classic Mistakes",
        summary: "How beginners actually blow up, and how to not. Learn position sizing by the premium at risk, knowing your max loss before entry, stop-loss versus defined-risk thinking, and the recurring mistakes from far-OTM lottery buying to selling naked without understanding margin.",
        learn: ["Sizing by premium at risk", "Know your max loss before entry", "Stop-loss vs defined risk", "Avoiding revenge trades at expiry", "The classic beginner mistakes", "When NOT to trade options"], tags: ["Risk"] },
      { slug: "spreads-and-checklist", title: "From Single Legs to Spreads, and Your Checklist",
        summary: "Where to go next, and how to be ready. Learn why spreads exist, the defined-risk idea and the difference between a debit and a credit spread (without the deep strategy work that lives in the strategies course), then a clear pre-trade checklist to run before every option trade.",
        learn: ["Why spreads exist", "The defined-risk idea", "Debit spread vs credit spread", "The bridge to real strategies", "Your pre-trade checklist", "Direction, strike, expiry, risk, exit"], tags: ["Risk"] },
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
  Mechanics: "nse",
  Reading: "nfo",
  Payoff: "py",
  Greeks: "afl",
  Volatility: "mcx",
  Selection: "idx",
  Costs: "nse",
  Risk: "live",
};
