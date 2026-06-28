// Single source of truth for the "Futures Trading" learning portal:
// 24 chapters across 6 modules. Slugs form the /futures/<slug> URLs, keep them stable.
// Chapter numbers are assigned automatically by position.

export const SERIES_TITLE = "Futures Trading";
export const SERIES_SUB =
  "A complete, India-focused futures course for someone who has never traded a contract. Beyond what a future is, we cover the parts that actually trip beginners up: how orders and settlement really work, liquidity and slippage, SPAN margin and pledged collateral, transaction costs and tax, open interest, position sizing, and the honest risks of leverage. Plain English, real Indian examples, and no pretending a future is just a stock with leverage.";

export const PARTS = [
  {
    id: "A",
    name: "What a Future Is",
    desc: "What a futures contract is, how it differs from forwards, options and shares, and why it exists.",
    chapters: [
      { slug: "what-is-a-future", title: "What Is a Futures Contract?",
        summary: "A future is simply an agreement to buy or sell something at a fixed price on a future date. Learn what that means in plain words, with a real Indian example, before any jargon arrives.",
        learn: ["An agreement for a future date", "Buyer and seller obligations", "Underlying, price and expiry", "A simple real-world analogy", "How a stock future works", "Why nobody waits for delivery"], tags: ["Basics"] },
      { slug: "futures-vs-forwards-options-equity", title: "Futures vs Forwards, Options and Shares",
        summary: "A future is not a forward, not an option, and not a share. Learn how a standardised exchange-traded future differs from a private forward, why a future is an obligation while an option is a right, and why holding a future is not the same as owning the stock.",
        learn: ["Standardised future vs private forward", "Exchange-traded and guaranteed", "Obligation vs an option's right", "A future is not owning the share", "No dividends, no votes", "Why the difference matters for risk"], tags: ["Basics"] },
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
    name: "Trading Mechanics",
    desc: "How orders work, liquidity and slippage, and the linear payoff of going long or short.",
    chapters: [
      { slug: "how-futures-orders-work", title: "How Futures Orders Actually Work",
        summary: "Before you trade, you need to place an order correctly. Learn the order types (market, limit, stop-loss and stop-loss market), the product types (intraday versus carry-forward), how a square-off works, and the order mistakes that catch beginners.",
        learn: ["Market vs limit orders", "Stop-loss and stop-loss market", "Intraday (MIS) vs carry-forward (NRML)", "How a square-off works", "Auto square-off for intraday", "Common order mistakes"], tags: ["Execution"] },
      { slug: "liquidity-spread-slippage", title: "Liquidity, the Bid-Ask Spread and Slippage",
        summary: "The last traded price can mislead you. Learn the bid, the ask and the spread you actually trade against, what slippage and impact cost mean, and why a far-month or thin stock future can cost far more to enter and exit than the screen suggests.",
        learn: ["Why the LTP can mislead", "Bid, ask and the spread", "Slippage on entry and exit", "Impact cost in thin contracts", "Far-month and stock-future risk", "Trading only liquid contracts"], tags: ["Execution"] },
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
    name: "Margin and Money",
    desc: "Margin and leverage, SPAN and pledged collateral, daily settlement, and what trading costs.",
    chapters: [
      { slug: "margin-and-leverage", title: "Margin and Leverage: The Double-Edged Sword",
        summary: "You do not pay the full contract value, only a margin. That is leverage, and it multiplies both gains and losses. Learn how margin works and why leverage is the single most important risk in futures.",
        learn: ["What margin is", "How leverage multiplies P&L", "Initial vs maintenance margin", "The margin call", "A worked leverage example", "Why leverage cuts both ways"], tags: ["Mechanics"] },
      { slug: "span-margin-and-pledge", title: "SPAN Margin, Exposure and Pledged Collateral",
        summary: "Margin is not a fixed number. Learn how it is built from SPAN plus exposure, why it rises when volatility rises, what peak-margin rules mean, and how Indian traders pledge holdings as collateral, including why margin available is not the same as free cash.",
        learn: ["SPAN plus exposure margin", "Why margin changes dynamically", "Volatility-driven margin hikes", "Peak margin and blocking", "Pledging collateral vs cash", "Why collateral is not free cash"], tags: ["Mechanics"] },
      { slug: "mark-to-market", title: "Mark-to-Market: Settled Every Single Day",
        summary: "A futures position is settled in cash at the end of every trading day, not just at expiry. Learn how mark-to-market moves money in and out of your account daily and why a losing position can be closed for you.",
        learn: ["Daily cash settlement", "Profit and loss credited each day", "How MTM protects the exchange", "Margin top-ups", "Why you cannot ignore a position", "A two-day worked example"], tags: ["Mechanics"] },
      { slug: "costs-and-taxation", title: "Transaction Costs and Taxation",
        summary: "A future looks cheap to trade until you add the costs and the tax. Learn the full stack of charges, brokerage, STT, exchange fees, GST and stamp duty, how they move your breakeven, and the basics of how futures profit is taxed as business income.",
        learn: ["Brokerage and STT on futures", "Exchange charges, GST and stamp duty", "Your true cost-adjusted breakeven", "Futures as business income", "ITR-3 and turnover in one line", "Where to learn the tax in full"], tags: ["Costs"] },
    ],
  },
  {
    id: "D",
    name: "Pricing and the Cycle",
    desc: "How a future is priced versus spot, the contract cycle, rollover, calendar spreads and basis.",
    chapters: [
      { slug: "basis-and-carry", title: "Basis and the Cost of Carry",
        summary: "A future rarely trades at exactly the spot price. Learn the basis (the gap between future and spot) and the cost of carry that explains it, plus what a premium or discount is telling you.",
        learn: ["Future price vs spot price", "The basis explained", "Cost of carry", "Premium and discount", "Convergence at expiry", "What the basis signals"], tags: ["Pricing"] },
      { slug: "expiry-calendar-and-cycle", title: "The Expiry Calendar and Contract Cycle",
        summary: "At any moment, three monthly contracts trade at once. Learn the near, next and far month, the monthly cycle and expiry day, how to choose which contract to trade, and why a beginner should avoid the thin far-month contract.",
        learn: ["Near, next and far month", "The monthly contract cycle", "Expiry day in the cycle", "Choosing which month to trade", "Why the far month is thin", "Liquidity across the cycle"], tags: ["Pricing"] },
      { slug: "rollover", title: "Rollover: Moving to the Next Month",
        summary: "Futures expire, but a view can outlast a month. Learn rollover, the act of closing the expiring contract and opening the next one, and what high rollover tells you about market sentiment.",
        learn: ["Why contracts expire", "Closing and reopening a position", "The rollover cost", "Rollover percentage as a signal", "Expiry-day mechanics", "Avoiding the illiquid far month"], tags: ["Pricing"] },
      { slug: "calendar-spread-and-basis", title: "Roll Spreads, Calendar Spreads and Basis Trading",
        summary: "The gap between two months and the gap between future and spot can themselves be traded. Learn the roll spread you pay at rollover, the calendar spread as a position, and the idea of cash-futures arbitrage, which you should understand but not blindly attempt.",
        learn: ["Near-month vs next-month pricing", "The roll spread you pay", "The calendar spread position", "Fair value and the basis", "Cash-futures arbitrage explained", "Why retail should not chase it"], tags: ["Pricing"] },
    ],
  },
  {
    id: "E",
    name: "Settlement and Positioning",
    desc: "Physical versus cash settlement, index versus stock futures, and reading open interest.",
    chapters: [
      { slug: "settlement-stock-vs-index", title: "Settlement: Stock Delivery vs Index Cash",
        summary: "What happens at expiry depends on what you traded. Learn that stock futures are physically settled (an open position can become an actual delivery obligation, with short-delivery risk), while index futures settle in cash, and why a beginner should square off stock futures before expiry.",
        learn: ["Physical settlement of stock futures", "The delivery obligation at expiry", "Short delivery and its penalty", "Cash settlement of index futures", "The final settlement price", "Squaring off before expiry"], tags: ["Settlement"] },
      { slug: "index-vs-stock-futures", title: "Index Futures vs Stock Futures",
        summary: "NIFTY and BANKNIFTY futures behave differently from a single stock's future. Learn the practical differences in liquidity, risk and use, and why beginners usually start with the index.",
        learn: ["Index futures (NIFTY, BANKNIFTY)", "Single-stock futures", "Liquidity differences", "Single-stock gap risk", "Cash settlement for index", "Where a beginner should start"], tags: ["Settlement"] },
      { slug: "open-interest-in-futures", title: "Open Interest in Futures",
        summary: "Open interest is the most quoted and most misread number in futures. Learn what OI actually means, how to read a long or short build-up versus an unwinding or covering, volume versus OI, and why OI is not a guaranteed prediction signal.",
        learn: ["What open interest means", "Long build-up and short build-up", "Long unwinding and short covering", "Volume vs open interest", "OI with price together", "Why OI is not a sure signal"], tags: ["OI"] },
    ],
  },
  {
    id: "F",
    name: "Risk and Discipline",
    desc: "Hedging in practice, position sizing, gap and event risk, and the mistakes to avoid.",
    chapters: [
      { slug: "hedging-with-futures", title: "Hedging a Portfolio: Worked Examples",
        summary: "The original job of a future. Learn how shorting an index future protects a portfolio, with worked cases: a full hedge, a partial hedge, a high-beta portfolio, and what happens when the hedge size is wrong.",
        learn: ["What a hedge does", "Beta and the hedge ratio", "A full hedge worked through", "A partial hedge", "Hedging a high-beta portfolio", "When the hedge size is wrong"], tags: ["Hedging"] },
      { slug: "position-sizing", title: "Position Sizing with Futures",
        summary: "The fastest way to blow up is to trade too large. Learn how to size a futures position from your capital and your risk per trade, the stop-distance times lot-size method, the difference between intraday and positional sizing, and why many accounts are simply too small for futures.",
        learn: ["Capital genuinely required", "Risk per trade, a small slice", "Stop distance times lot size", "Intraday vs positional sizing", "Notional exposure is not capital", "Why small accounts should wait"], tags: ["Risk"] },
      { slug: "gap-and-event-risk", title: "Gap Risk and Event Risk",
        summary: "Leverage is most dangerous when the market jumps. Learn why an overnight gap can blow past your stop, the events that cause it, results, RBI policy, the Budget, elections and global news, and why a stop-loss is not a guarantee in a leveraged position.",
        learn: ["Why an overnight gap hurts", "Events that cause gaps", "Why a stop can fail on a gap", "Why leverage magnifies a gap", "Sizing for the gap, not the stop", "Avoiding events you cannot survive"], tags: ["Risk"] },
      { slug: "risks-of-leverage", title: "The Risks of Leverage (and How to Survive)",
        summary: "Most futures traders lose, and leverage is usually why. Learn the honest risks, the margin-call spiral and the overnight move, and the discipline that keeps a trader in the game.",
        learn: ["Why most futures traders lose", "The margin-call spiral", "Treating margin as max loss, a trap", "Confusing notional with capital", "Respecting the leverage", "The survivor's mindset"], tags: ["Risk"] },
      { slug: "mistakes-and-checklist", title: "Beginner Mistakes and Your Futures Checklist",
        summary: "Close the course with the mistakes that ruin beginners and a checklist to avoid them. Trading too large, holding stock futures into expiry, ignoring liquidity, averaging leveraged losses, and treating margin as the most you can lose, then a clear pre-trade checklist.",
        learn: ["Trading too large", "Holding stock futures to expiry", "Ignoring liquidity", "Averaging a leveraged loss", "Margin is not your max loss", "The pre-trade checklist"], tags: ["Risk"] },
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
  Execution: "nse",
  Mechanics: "nfo",
  Payoff: "py",
  Costs: "afl",
  Pricing: "mcx",
  Settlement: "afl",
  OI: "nfo",
  Hedging: "nse",
  Risk: "live",
};
