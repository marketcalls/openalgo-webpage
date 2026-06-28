// Single source of truth for the "Statistical Arbitrage" learning portal:
// 17 chapters across 4 modules, an expert, brutally honest course on statistical
// arbitrage with NSE equities, built on real OpenAlgo data. The research engine is a
// companion set of Jupyter notebooks; this web course is the narrative built on top.
// Slugs form the /stats-arb/<slug> URLs - keep them stable.

export const SERIES_TITLE = "Statistical Arbitrage";
export const SERIES_SUB =
  "An expert, brutally honest course on statistical arbitrage with NSE equities. From stationarity and cointegration to pairs, baskets, dynamic hedges and market-neutral books, every result computed on real OpenAlgo data, gross and net, in-sample and out-of-sample, with an honest line between a statistical relationship and a tradable edge.";

export const PARTS = [
  {
    id: "A",
    name: "Foundations and Honesty",
    desc: "What stat arb really is, the data it stands on, and the statistics that decide whether a relationship is real.",
    chapters: [
      { slug: "what-is-statistical-arbitrage", title: "What Statistical Arbitrage Really Is",
        summary: "Trade a stationary relationship, not a price. The family tree from single-name reversion to pairs, baskets and cross-sectional books, why the edge has decayed, and an honest setting of expectations.",
        learn: ["Trade the relationship, not the price", "The stat-arb family tree", "Market neutrality", "Where the edge came from and went", "Research mechanics first", "Honest expectations"], tags: ["NSE", "STAT"] },
      { slug: "building-the-database", title: "Building the Historical Database",
        summary: "Download once, read fast. How the local DuckDB cache of 50 NSE names plus the index is built with OpenAlgo, verified for gaps, and kept current, so every later chapter reads in milliseconds.",
        learn: ["source api vs source db", "The 50-name universe", "Persisting to DuckDB", "Verifying coverage and gaps", "Rate limits and retries", "Incremental top-up"], tags: ["DATA"] },
      { slug: "the-data-layer-and-its-biases", title: "The Data Layer and Its Biases",
        summary: "Most stat-arb results die from data problems before they die from bad statistics. The aligned price panel, liquidity filters, survivorship and symbol-change bias, and adjusted versus tradable close.",
        learn: ["The aligned price panel", "Liquidity filters", "Survivorship bias", "Symbol changes and new listings", "Adjusted vs tradable close", "Naming the limitations"], tags: ["DATA", "NSE"] },
      { slug: "research-vs-real-markets", title: "Research vs Real Markets",
        summary: "A long/short equity backtest is a research abstraction. The short leg in India needs a real vehicle (intraday cash, SLB, or a stock-futures proxy), and the gap between a statistical relationship and a tradable edge.",
        learn: ["Why close prices for learning", "The short-leg vehicles in India", "Borrow, margin and F&O eligibility", "Relationship vs tradable edge", "How each choice changes costs", "The pre-live checklist"], tags: ["RISK", "EXEC"] },
      { slug: "stationarity-and-random-walks", title: "Stationarity and Random Walks",
        summary: "Why a single stock cannot be traded as a mean-reverter. Random walk versus stationary, prices versus returns, the ADF and KPSS tests done properly, and the Hurst exponent, on real NSE names.",
        learn: ["Random walk vs stationary", "Prices are I(1), returns are I(0)", "ADF lag and trend specification", "KPSS as the opposite null", "The Hurst exponent", "ADF low power"], tags: ["STAT", "NSE"] },
      { slug: "correlation-is-not-cointegration", title: "Correlation Is Not Cointegration",
        summary: "The lesson almost everyone gets wrong, computed live on NSE data: the most correlated pairs need not be cointegrated, and a less correlated pair can be. Spurious regression and why correlation traders blow up.",
        learn: ["Correlation vs cointegration", "Most correlated is not cointegrated", "The corr-vs-coint scatter", "Spurious regression", "A Monte Carlo of nonsense", "Window sensitivity"], tags: ["STAT", "NSE"] },
      { slug: "cointegration-mechanics", title: "Cointegration Mechanics",
        summary: "The machinery end to end on a real cointegrated NSE pair: Engle-Granger, the hedge ratio (OLS versus total least squares), the spread, and the Ornstein-Uhlenbeck half-life that says how long you would hold.",
        learn: ["The Engle-Granger two-step", "OLS hedge-ratio bias", "Total least squares", "Building the spread", "The OU half-life", "Detecting an invalid half-life"], tags: ["STAT", "NSE"] },
    ],
  },
  {
    id: "B",
    name: "Building a Pair, Then Breaking It",
    desc: "Find a pair without fooling yourself, build the signal, watch the pretty backtest, then take it apart honestly.",
    chapters: [
      { slug: "finding-pairs-without-fooling-yourself", title: "Finding Pairs Without Fooling Yourself",
        summary: "Economic prior first, then the cointegration scan, then the multiple-testing trap: scanning many pairs guarantees false positives. Bonferroni and false-discovery control, and how few survive out-of-sample.",
        learn: ["Economic prior first", "The cointegration scan", "The multiple-testing trap", "False positives in random data", "Bonferroni and FDR control", "How few survive"], tags: ["STAT", "NSE"] },
      { slug: "the-spread-and-the-signal", title: "The Spread and the Signal",
        summary: "The z-score strategy on one real pair: the spread, rolling and robust z-scores, entry, exit and stop, rupee-neutral sizing, and a first in-sample backtest with next-bar fills that looks great, on purpose.",
        learn: ["The spread and the z-score", "Robust z with median and MAD", "Entry, exit and stop", "Rupee-neutral sizing", "Next-bar fills, no look-ahead", "The seductive in-sample curve"], tags: ["NSE", "STAT"] },
      { slug: "the-brutal-reality-check", title: "The Brutal Reality Check",
        summary: "Take the pretty backtest apart: out-of-sample collapse, realistic NSE costs net of gross, the spread de-cointegrating, and look-ahead, with the losing net curve shown, not hidden.",
        learn: ["Out-of-sample collapse", "Real NSE costs, gross vs net", "Rolling de-cointegration", "Look-ahead quantified", "Survivorship in pair selection", "The honest verdict"], tags: ["RISK", "NSE"] },
    ],
  },
  {
    id: "C",
    name: "Doing It Properly",
    desc: "Dynamic hedges, baskets, cross-sectional books, and the risk and portfolio construction that keep a book alive.",
    chapters: [
      { slug: "dynamic-hedge-ratios-kalman", title: "Dynamic Hedge Ratios with the Kalman Filter",
        summary: "A static hedge ratio is wrong because the relationship drifts. A hand-rolled Kalman filter for a time-varying hedge, and the honest finding that more flexibility can lose to a simple static beta.",
        learn: ["Why a static beta drifts", "The Kalman predict-update loop", "A time-varying hedge ratio", "Kalman vs rolling OLS", "Tuning is itself a fit", "When simpler wins"], tags: ["STAT", "NSE"] },
      { slug: "baskets-and-johansen", title: "Baskets and the Johansen Test",
        summary: "Beyond two names: cointegrating vectors among several stocks with the Johansen test, choosing the rank, reading the basket weights, and how unstable the vector is out-of-sample.",
        learn: ["From pairs to baskets", "The Johansen trace and eigenvalue tests", "Choosing the cointegration rank", "Reading the cointegrating vector", "Vector instability", "Estimation error grows with legs"], tags: ["STAT", "NSE"] },
      { slug: "cross-sectional-factor-neutral", title: "Cross-Sectional, Factor-Neutral Stat Arb",
        summary: "The version that scales: remove market and sector returns, rank by short-term residual reversal, and build a market-neutral long-short book across the universe, and how turnover and costs invert the gross edge.",
        learn: ["Residual reversion", "Removing market and sector", "Ranking the cross-section", "A market-neutral long-short book", "Turnover and cost drag", "Capacity and crowding"], tags: ["NSE", "STAT"] },
      { slug: "risk-sizing-and-portfolio", title: "Risk, Sizing and Portfolio Construction",
        summary: "From signals to a survivable book: beta versus rupee neutrality, volatility targeting, covariance shrinkage, the stop-loss-on-a-spread dilemma, risk contribution, and a rule for retiring a broken pair.",
        learn: ["Beta vs rupee neutrality", "Volatility targeting", "Covariance shrinkage", "The stop-on-a-spread dilemma", "Risk contribution", "Retiring a broken pair"], tags: ["RISK", "NSE"] },
    ],
  },
  {
    id: "D",
    name: "Research to Reality",
    desc: "Validate without fooling yourself, understand what a live implementation needs, and put it all together.",
    chapters: [
      { slug: "honest-backtesting-and-validation", title: "Honest Backtesting and Validation",
        summary: "The full validation scorecard: walk-forward, purged and embargoed cross-validation, the deflated Sharpe, the probability of backtest overfitting, a blocked bootstrap, and parameter-stability maps.",
        learn: ["Walk-forward distributions", "Why ordinary CV leaks", "Purged and embargoed CV", "The deflated Sharpe", "Probability of backtest overfitting", "Ridge vs plateau"], tags: ["STAT", "RISK"] },
      { slug: "implementation-pathways", title: "Implementation Pathways",
        summary: "What a live version actually needs: the leg vehicles, legging risk and the two-legged fill problem, impact estimated from intraday bars, participation caps, monitoring and the kill switch, and the research-to-live gap.",
        learn: ["The leg vehicles in depth", "Legging risk and partial fills", "Impact from intraday bars", "Participation caps and slippage", "Monitoring and the kill switch", "Retiring a strategy"], tags: ["EXEC", "RISK"] },
      { slug: "capstone-and-checklist", title: "Capstone: The Honest Stat-Arb Workflow",
        summary: "Everything together as one disciplined workflow, from universe to a validated, cost-aware, research-grade market-neutral model, with the pre-live checklist and the companion notebooks to run it all yourself.",
        learn: ["The end-to-end workflow", "From relationship to candidate edge", "The honest scorecard", "What would make it tradable", "The pre-live checklist", "The companion notebooks"], tags: ["RISK", "NSE"] },
    ],
  },
];

let _n = 0;
for (const _p of PARTS) for (const _c of _p.chapters) _c.n = ++_n;

export const CHAPTERS = PARTS.flatMap((p) =>
  p.chapters.map((c) => ({ ...c, part: p.id, partName: p.name })),
);

export function chapterBySlug(slug) {
  return CHAPTERS.find((c) => c.slug === slug) || null;
}

export const TAG_CLASS = { NSE: "nse", INDEX: "idx", STAT: "py", RISK: "live", EXEC: "nfo", DATA: "mcx" };
