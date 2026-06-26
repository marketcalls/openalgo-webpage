// Single source of truth for the "Taxation for Traders and Investors" learning portal:
// 19 chapters across 5 modules. Slugs form the /taxation/<slug> URLs, keep them stable.
// India-focused, plain-English, example and case-study led. Educational only, not tax advice.

export const SERIES_TITLE = "Taxation for Traders and Investors";
export const SERIES_SUB =
  "Tax, explained in plain English for anyone who trades or invests in India. No jargon, just clear examples and real case studies covering shares, intraday, futures and options, US stocks, and crypto. Learn how each kind of profit is taxed, what you can claim, when an audit applies, and the costly mistakes that bring a tax notice years later. Educational only, not tax advice; always confirm with a qualified chartered accountant before you file.";

export const PARTS = [
  {
    id: "A",
    name: "Start Here",
    desc: "Why tax matters for traders, the income buckets, the two regimes, and the deadlines.",
    chapters: [
      { slug: "why-tax-matters", title: "Why Tax Matters (and the Trader Who Lost Everything)",
        summary: "A true story of a trader who lost money yet ended up owing crores, because he never filed. Learn why the tax department already knows your trades, and why ignoring tax is the most expensive mistake a trader can make.",
        learn: ["The trader who owed crores on a loss", "How the department already sees your trades", "Profit or loss, you still report", "What this course covers", "A promise: plain English only", "The one rule: file, every year"], tags: ["Basics"] },
      { slug: "the-income-buckets", title: "The Three Buckets: How Your Profit Is Classified",
        summary: "Before any tax, your gains fall into one of three buckets: capital gains, business income, or speculative income. Learn the simple test that decides which bucket your trades land in, with a clear table, because the bucket changes everything.",
        learn: ["Capital gains vs business income", "Speculative vs non-speculative", "Delivery, intraday, and F&O", "Why the bucket matters", "The classification table", "Examples for each bucket"], tags: ["Basics"] },
      { slug: "old-vs-new-regime", title: "Old Regime or New: Which Tax Slabs Apply",
        summary: "The new tax regime is now the default. Learn the AY 2026-27 slab rates in plain numbers, the rebate that can make income up to a point tax-free, when the old regime still wins, and the form you must not forget if you switch.",
        learn: ["The new regime is the default", "AY 2026-27 slab rates", "The Section 87A rebate", "Surcharge and cess", "When to keep the old regime", "Form 10-IEA, the easy miss"], tags: ["Basics"] },
      { slug: "advance-tax-and-deadlines", title: "Advance Tax and the Dates You Cannot Miss",
        summary: "Tax is not a once-a-year job. Learn advance tax (paying as you earn), the quarterly dates, the filing deadlines for AY 2026-27, and why missing the due date quietly costs you your right to carry losses forward.",
        learn: ["What advance tax is", "The four advance-tax dates", "Interest if you underpay", "Filing due dates for AY 2026-27", "Audit vs non-audit deadlines", "Why on-time filing protects you"], tags: ["Filing"] },
    ],
  },
  {
    id: "B",
    name: "The Equity Investor",
    desc: "Shares and mutual funds: capital gains, STT, intraday, and gifting.",
    chapters: [
      { slug: "capital-gains-on-shares", title: "Capital Gains on Shares and Mutual Funds",
        summary: "Buy, hold, sell: the most common way to invest, and its tax. Learn short-term vs long-term, the current rates, the one-year line that divides them, the tax-free LTCG limit, and grandfathering, all with worked examples.",
        learn: ["Short-term vs long-term", "The one-year holding line", "STCG and LTCG rates", "The tax-free LTCG limit", "Grandfathering explained simply", "A full worked example"], tags: ["Equity"] },
      { slug: "stt-and-charges", title: "STT and the Charges Hiding in Every Trade",
        summary: "Every trade carries a Securities Transaction Tax and a stack of other charges. Learn what STT is, the rates on delivery, intraday, futures and options after the latest hike, and how these costs interact with your income tax.",
        learn: ["What STT is and who pays", "STT rates by trade type", "The latest STT hike", "Other charges in a contract note", "How STT affects your tax", "A worked STT calculation"], tags: ["Equity"] },
      { slug: "intraday-trading-tax", title: "Intraday Trading: Speculative Income",
        summary: "Buy and sell the same day and the tax rules change completely. Learn why intraday equity is speculative business income, how it is taxed at slab rates, and the strict rule that intraday losses can only offset intraday gains.",
        learn: ["Why intraday is speculative", "Taxed at your slab rate", "The strict loss set-off rule", "Four-year carry-forward", "Turnover for intraday", "A worked example"], tags: ["Equity"] },
      { slug: "gifting-and-inheriting-shares", title: "Gifting and Inheriting Shares",
        summary: "Giving shares to family, or receiving them, has its own tax rules. Learn when a gift is tax-free, when it is taxable, whose purchase price counts when you later sell, and the clubbing trap that catches gifts to a spouse or child.",
        learn: ["Gifts from relatives are exempt", "Gifts from others above a limit", "No upper limit for relatives", "Whose cost price you inherit", "The holding-period carryover", "The clubbing of income trap"], tags: ["Equity"] },
    ],
  },
  {
    id: "C",
    name: "The F&O Trader",
    desc: "Futures and options: business income, turnover, audit, losses, and the cost of hiding it.",
    chapters: [
      { slug: "fno-is-business-income", title: "The Number One Mistake: F&O Is Business Income",
        summary: "Most new F&O traders get the very first thing wrong. Learn why futures and options are non-speculative business income, not capital gains, why that means slab rates and ITR-3, and the freedoms and duties that come with it.",
        learn: ["Not capital gains, business income", "Non-speculative, and why", "Taxed at your slab rate", "Reported in ITR-3", "Expenses you may claim", "Why the bucket matters here"], tags: ["FnO"] },
      { slug: "fno-turnover-and-expenses", title: "F&O Turnover Is Not What You Think",
        summary: "The single biggest F&O confusion is turnover. Learn why turnover is not your contract value but the sum of your gains and losses, how options add the premium, and the genuine expenses you can claim against your profit.",
        learn: ["Turnover is not contract value", "The absolute profit method", "How options premium is added", "Using your broker tax report", "Expenses you can claim", "Keeping the proofs"], tags: ["FnO"] },
      { slug: "fno-tax-audit", title: "When an F&O Trader Needs a Tax Audit",
        summary: "Audit is the most misunderstood F&O rule. Learn the simple three-step check, why a loss does not automatically mean an audit, the turnover thresholds, and the cash-transaction rule that decides which threshold applies to you.",
        learn: ["Step one: find your turnover", "Step two: check the threshold", "The 1 crore and 10 crore lines", "The 5 percent cash rule", "Why a loss is not an audit", "The presumptive-tax angle"], tags: ["FnO"] },
      { slug: "fno-losses-set-off", title: "F&O Losses: Set-Off and Carry-Forward",
        summary: "A losing year can still save you tax, if you handle it right. Learn how F&O losses offset almost any other income, how unused losses carry forward for eight years, and the one condition you must meet to keep that right.",
        learn: ["Set-off against most income", "The salary exception", "Carry-forward for eight years", "File on time or lose it", "Only against business income later", "A worked set-off example"], tags: ["FnO"] },
      { slug: "not-reporting-fno", title: "What Happens If You Do Not Report F&O",
        summary: "Hiding an F&O loss feels harmless. It is not. Learn the real case of a trader hit with a crore-sized demand, how the department links your turnover through STT data, and the penalties that turn silence into a disaster.",
        learn: ["The crore-sized demand case", "How STT data exposes you", "The notice under the law", "Penalties for non-disclosure", "Losing the carry-forward", "The simple way to stay safe"], tags: ["FnO"] },
    ],
  },
  {
    id: "D",
    name: "Global and Crypto",
    desc: "US stocks, foreign-asset disclosure, and the tax on crypto and crypto derivatives.",
    chapters: [
      { slug: "tax-on-us-stocks", title: "Tax on US Stocks for Indian Investors",
        summary: "Owning Apple or an S&P 500 ETF brings two countries into your tax life. Learn how US stock gains and dividends are taxed in India, the holding period that defines long-term, the US dividend withholding, and the credit that stops double tax.",
        learn: ["Capital gains on US stocks", "The 24-month long-term line", "Dividends and US withholding", "The foreign tax credit", "Form 67 and the DTAA", "A worked US-stock example"], tags: ["Global"] },
      { slug: "foreign-assets-and-black-money", title: "Schedule FA and the Black Money Act",
        summary: "Owning even one foreign share carries a reporting duty most investors miss. Learn Schedule FA, why you disclose foreign assets even with zero gain, the LRS limit and its TCS, and the severe penalties for staying silent.",
        learn: ["What Schedule FA is", "Report even with no gain", "The LRS limit and TCS", "The Black Money Act penalties", "Why this is not optional", "A simple compliance routine"], tags: ["Global"] },
      { slug: "crypto-tax-basics", title: "Crypto Tax: The Flat 30 Percent and the 1 Percent TDS",
        summary: "Crypto has the harshest tax rules of any asset in India. Learn the flat 30 percent on gains, the 1 percent TDS on sales, the brutal rule that losses cannot be set off against anything, and how to report it in Schedule VDA.",
        learn: ["The flat 30 percent rate", "Only the cost is deductible", "The 1 percent TDS", "Losses cannot be set off", "No carry-forward of losses", "Reporting in Schedule VDA"], tags: ["Crypto"] },
      { slug: "crypto-fno-tax", title: "Crypto Futures and Derivatives: A Grey Area",
        summary: "Crypto futures are taxed very differently from crypto itself, and the rules are still unsettled. Learn why crypto derivatives are usually business income at slab rates, not the flat 30 percent, the offshore-platform TCS, and the litigation risk to respect.",
        learn: ["Not the flat 30 percent", "Treated as business income", "No 1 percent TDS on futures", "Offshore platforms and TCS", "The unsettled rules", "Why caution matters here"], tags: ["Crypto"] },
    ],
  },
  {
    id: "E",
    name: "Filing It Right",
    desc: "Choosing the correct return, and a checklist to stay compliant every year.",
    chapters: [
      { slug: "choosing-your-itr", title: "Which ITR Form Is Yours",
        summary: "The wrong return form can invalidate your whole filing. Learn, in one simple map, which ITR form fits an investor, an intraday or F&O trader, a US-stock holder and a crypto trader, and why most traders end up on ITR-3.",
        learn: ["ITR-1 and ITR-2", "ITR-3 for business income", "ITR-4 and presumptive tax", "Which form for which trader", "Why F&O means ITR-3", "Mixing investing and trading"], tags: ["Filing"] },
      { slug: "the-traders-tax-checklist", title: "The Trader's Year-Round Tax Checklist",
        summary: "Tax is won across the year, not the night before the deadline. Learn a simple month-by-month routine: pull your broker tax reports, track advance tax, keep expense proofs, reconcile with the AIS, and know when to bring in a chartered accountant.",
        learn: ["Pull your broker tax P&L", "Track advance tax quarterly", "Keep every expense proof", "Reconcile with the AIS", "Know when to hire a CA", "The final pre-filing checklist"], tags: ["Filing"] },
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
  Equity: "nse",
  FnO: "py",
  Global: "afl",
  Crypto: "mcx",
  Filing: "live",
};
