// Single source of truth for the "Options Basics" learning portal:
// 14 chapters across 4 modules. Slugs form the /options-basics/<slug> URLs, keep them stable.

export const SERIES_TITLE = "Options Basics";
export const SERIES_SUB =
  "Options explained from absolute zero. If the words call, put and premium mean nothing to you yet, start here: every term is defined in plain English, every payoff is a real chart, and we are honest about why most option buyers lose.";

export const PARTS = [
  {
    id: "A",
    name: "What Options Are",
    desc: "Calls, puts, premium, strike and expiry, the vocabulary of the whole subject.",
    chapters: [
      { slug: "what-is-an-option", title: "What Is an Option?",
        summary: "An option is the right, but not the duty, to buy or sell at a set price by a set date. Learn that one idea with a simple real-life analogy before any market jargon arrives.",
        learn: ["A right, not an obligation", "The token-money analogy", "Underlying, strike and expiry", "Why someone pays for the right", "Options vs futures in one line", "The two basic types"], tags: ["Basics"] },
      { slug: "calls-and-puts", title: "Calls and Puts: The Two Building Blocks",
        summary: "Every option strategy ever built is made from just two pieces. Learn the call (the right to buy) and the put (the right to sell), and a simple way to never mix them up again.",
        learn: ["The call: a right to buy", "The put: a right to sell", "A way to remember which is which", "When you would want each", "Calls rise, puts fall", "Combining them later"], tags: ["CallsPuts"] },
      { slug: "premium-strike-expiry", title: "Premium, Strike and Expiry",
        summary: "Three numbers define every option. Learn the premium you pay, the strike price you lock in, and the expiry date it all ends on, with a real RELIANCE option symbol.",
        learn: ["The premium (the price of the option)", "The strike price", "The expiry date", "Reading an option symbol", "Per share vs per lot", "How the three interact"], tags: ["Basics"] },
      { slug: "right-not-obligation", title: "The Right, Not the Obligation",
        summary: "The single idea that makes options special: the buyer can walk away. Learn why a buyer's loss is capped at the premium while a seller takes on a duty, and why that asymmetry matters.",
        learn: ["The buyer can choose not to act", "Capped loss for the buyer", "The seller's obligation", "Why the seller is paid upfront", "Exercise and expiry worthless", "The core asymmetry"], tags: ["Basics"] },
    ],
  },
  {
    id: "B",
    name: "Reading Options",
    desc: "Moneyness, intrinsic and time value, and the option chain you will actually look at.",
    chapters: [
      { slug: "moneyness", title: "In, At and Out of the Money",
        summary: "ITM, ATM, OTM are the labels you will see everywhere. Learn what in-the-money, at-the-money and out-of-the-money mean for calls and puts, with a clear picture.",
        learn: ["At-the-money (ATM)", "In-the-money (ITM)", "Out-of-the-money (OTM)", "Moneyness for calls vs puts", "Why OTM options are cheap", "How moneyness changes with price"], tags: ["Reading"] },
      { slug: "intrinsic-and-time-value", title: "Intrinsic Value and Time Value",
        summary: "An option's premium is built from two parts. Learn intrinsic value (the real, here-and-now worth) and time value (the hope premium that melts away as expiry nears).",
        learn: ["Intrinsic value defined", "Time value defined", "Premium = intrinsic + time", "Why OTM is all time value", "Time decay as expiry nears", "Why this matters for buyers"], tags: ["Reading"] },
      { slug: "the-option-chain", title: "Reading the Option Chain",
        summary: "The option chain is the menu of every strike and its price. Learn to read it row by row, calls on one side, puts on the other, and find the at-the-money strike at a glance.",
        learn: ["The layout of a chain", "Calls, strikes and puts", "LTP, bid and ask", "Open interest and volume", "Finding the ATM strike", "What a chain tells you"], tags: ["Reading"] },
    ],
  },
  {
    id: "C",
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
    id: "D",
    name: "What Drives the Price",
    desc: "The Greeks and implied volatility that move a premium, plus the practical risks.",
    chapters: [
      { slug: "the-greeks", title: "The Greeks: Delta, Gamma, Theta, Vega",
        summary: "The Greeks measure what moves an option's price. Learn delta (direction), gamma (acceleration), theta (time decay) and vega (volatility) in plain words, no formulas.",
        learn: ["Delta: sensitivity to price", "Gamma: how delta changes", "Theta: the daily time decay", "Vega: sensitivity to volatility", "Why theta is the buyer's enemy", "Reading the Greeks simply"], tags: ["Greeks"] },
      { slug: "implied-volatility", title: "Implied Volatility: The Market's Fear Gauge",
        summary: "Implied volatility is the market's expectation of how much price will move, baked into the premium. Learn why high IV makes options expensive and why buying before a known event can backfire.",
        learn: ["What implied volatility is", "IV and the premium", "High IV vs low IV", "IV crush after an event", "Why expensive options disappoint buyers", "Reading IV practically"], tags: ["IV"] },
      { slug: "lot-size-settlement-risks", title: "Lot Size, Settlement and the Real Risks",
        summary: "The practical mechanics and the honest dangers. Learn the lot size (so you know what one option really costs), how Indian options settle, and the risks that catch new option traders.",
        learn: ["Lot size and true cost", "Cash settlement in India", "Expiry-day behaviour", "The risk of total loss for buyers", "Assignment risk for sellers", "A beginner's safety checklist"], tags: ["Risk"] },
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
  CallsPuts: "nse",
  Reading: "nfo",
  Payoff: "py",
  Greeks: "afl",
  IV: "mcx",
  Risk: "live",
};
