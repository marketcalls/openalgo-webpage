// Single source of truth for the "Stock Market Basics" learning portal:
// 18 chapters across 6 modules. Slugs form the /stocks/<slug> URLs - keep them stable.
// Chapter numbers are assigned automatically by position, so chapters can be
// inserted with no manual renumbering.

export const SERIES_TITLE = "Stock Market Basics";
export const SERIES_SUB =
  "A free, modern, visual course that takes a complete beginner from \"what is a share?\" to confidently reading the Indian stock market - with real charts, clear diagrams, and recent, real-world examples.";

export const PARTS = [
  {
    id: "A",
    name: "Money & Markets",
    desc: "Why investing is not optional, where money can grow, and what a stock market really is.",
    chapters: [
      { slug: "why-invest", title: "Why You Must Invest",
        summary: "Inflation quietly eats idle cash. See how saving differs from investing, why compounding rewards those who start young - and why a beginner's real edge is not predicting the market, but patiently building assets early.",
        learn: ["Saving vs investing", "How inflation erodes cash", "The magic of compounding",
          "Why you can't (and needn't) predict the market", "Start young: time beats timing", "What real returns look like"], tags: ["Money"] },
      { slug: "asset-classes", title: "Where to Put Your Money: The Asset Classes",
        summary: "Equity, debt, gold, real estate, cash and crypto - what each is, the risk-and-return trade-off, and why equities have historically built the most wealth.",
        learn: ["The major asset classes", "Risk vs return", "Equity, debt and gold", "Liquidity & taxation basics",
          "Where crypto fits", "Building a simple mix"], tags: ["Money"] },
      { slug: "what-is-a-stock", title: "The Stock Market, Demystified",
        summary: "A share is a slice of a real business. Learn what owning stock means, why companies sell it, and the difference between the primary and secondary markets.",
        learn: ["What a share really is", "Why companies raise equity", "Primary vs secondary market",
          "How you make money in stocks", "Shareholder rights", "The market as an auction"], tags: ["Basics"] },
    ],
  },
  {
    id: "B",
    name: "The Market Ecosystem",
    desc: "The exchanges, regulators, brokers and plumbing that make a trade possible - and trustworthy.",
    chapters: [
      { slug: "sebi-and-regulators", title: "SEBI & the Guardians of the Market",
        summary: "Markets only work when they are fair. Meet SEBI, RBI and the rules that protect you - and why regulation exists, told through the scandals that created it.",
        learn: ["Who regulates the markets", "What SEBI does", "RBI's role", "Investor protection",
          "Why rules exist (the scandals)", "How complaints are handled"], tags: ["Regulation"] },
      { slug: "market-ecosystem", title: "Exchanges, Brokers & Depositories",
        summary: "From NSE and BSE to your demat account at NSDL or CDSL - the cast of intermediaries that route, hold and safeguard your shares.",
        learn: ["NSE & BSE exchanges", "The role of brokers", "Demat & depositories (NSDL/CDSL)",
          "Clearing corporations", "Discount vs full-service", "What each one charges"], tags: ["Markets"] },
      { slug: "clearing-settlement", title: "What Happens After You Hit Buy",
        summary: "What actually happens after you click Buy - the behind-the-scenes journey of money and shares, India's move to T+1 (and T+0), and why it almost never fails.",
        learn: ["What clearing means", "Settlement explained", "India's T+1 cycle", "The role of the clearing corp",
          "Rolling settlement", "Why defaults are rare"], tags: ["Markets"] },
    ],
  },
  {
    id: "C",
    name: "Going Public",
    desc: "How a private business becomes a listed stock you can buy - the funding journey and the IPO.",
    chapters: [
      { slug: "how-companies-get-funded", title: "From Startup to Stock: How Companies Get Funded",
        summary: "Every listed giant started small. Follow the funding ladder - bootstrapping, angels, venture capital, private equity - and how valuations balloon along the way.",
        learn: ["The origin of a business", "Bootstrapping & angels", "Venture capital & PE",
          "Funding rounds & valuation", "Dilution explained", "Why companies eventually list"], tags: ["IPO"] },
      { slug: "the-ipo", title: "The IPO: How a Company Goes Public",
        summary: "The Initial Public Offering, step by step - the RHP, book-building, price band, lot size and listing day - using recent Indian IPOs as live examples.",
        learn: ["What an IPO is", "The RHP & DRHP", "Book-building & price band", "Lot size & applying via UPI",
          "Listing day & listing gains", "Reading IPO jargon"], tags: ["IPO"] },
      { slug: "corporate-actions-raising", title: "Rights, FPO, OFS, Bonus & Splits",
        summary: "Listed companies keep raising money and rewarding shareholders. Decode rights issues, FPOs, OFS, bonus shares, stock splits and buybacks - and what each does to the price.",
        learn: ["Rights issue vs FPO", "Offer for sale (OFS)", "Bonus shares & splits",
          "Buybacks", "Dividends", "Price adjustments explained"], tags: ["IPO"] },
    ],
  },
  {
    id: "D",
    name: "Reading the Market",
    desc: "Make sense of a price quote, the indices everyone quotes, and the language traders speak.",
    chapters: [
      { slug: "stock-quote", title: "Anatomy of a Stock Quote",
        summary: "LTP, bid and ask, open-high-low-close, volume and the 5-level market-depth window - every number on a quote screen, explained on real, current market data.",
        learn: ["LTP & last traded quantity", "Bid, ask & the spread", "Open, high, low, close", "Volume",
          "Market depth (the order book)", "Circuit limits"], tags: ["Markets"] },
      { slug: "indices", title: "Nifty, Sensex & How Indices Are Built",
        summary: "What an index measures, the constituent stocks inside the Nifty 50 and Sensex, how free-float weighting decides each stock's pull, and exactly how the index rises or falls as its constituents move.",
        learn: ["What an index is", "The constituents & their weights", "Free-float market-cap weighting",
          "How the index rises and falls", "Sector vs broad indices", "Why indices matter & index funds"], tags: ["Index"] },
      { slug: "market-jargon", title: "Bull, Bear & the Jargon You'll Hear",
        summary: "A friendly glossary of the words thrown around on business TV - bull and bear, large/mid/small-cap, circuits, volume, and how short selling works.",
        learn: ["Bull vs bear markets", "Large, mid & small cap", "Upper & lower circuits", "Long vs short",
          "How short selling works", "Common TV jargon"], tags: ["Basics"] },
    ],
  },
  {
    id: "E",
    name: "What Moves Prices",
    desc: "The forces - from a single order to global macro - that push a stock up and down.",
    chapters: [
      { slug: "what-moves-a-stock", title: "What Makes a Stock Move",
        summary: "Price is just the latest agreement between a buyer and a seller. See how supply, demand, news and expectations move a stock minute by minute.",
        learn: ["Supply & demand", "Why price changes tick by tick", "News & expectations", "Earnings reactions",
          "The role of sentiment", "Return calculation"], tags: ["Markets"] },
      { slug: "macro-forces", title: "Macro, Rates, Inflation & Global Cues",
        summary: "No stock is an island. Understand how interest rates, inflation, the rupee, crude oil, FII/DII flows and global markets sway Indian shares.",
        learn: ["Interest rates & the RBI", "Inflation's effect", "FII vs DII flows", "Crude oil & the rupee",
          "Global cues", "Reading the macro mood"], tags: ["Macro"] },
      { slug: "events-and-prices", title: "Earnings, Dividends & Events That Move Prices",
        summary: "Results season, dividends, guidance, management changes and shock events - the calendar of catalysts every investor learns to watch.",
        learn: ["The earnings calendar", "How results move prices", "Dividends & record dates",
          "Guidance & surprises", "Shock events", "Building a watch routine"], tags: ["Markets"] },
    ],
  },
  {
    id: "F",
    name: "Becoming an Investor",
    desc: "Take your first real steps, manage risk and your own mind, and spot the traps before they catch you.",
    chapters: [
      { slug: "getting-started", title: "Your First Steps as an Investor",
        summary: "Your practical first steps - opening a demat account, the two paths of buying stocks directly versus mutual funds and index-fund SIPs, and how to form your own point of view before you ever buy.",
        learn: ["Demat & KYC, in plain words", "Direct stocks vs mutual funds", "Index funds & the SIP habit",
          "Forming a point of view", "A sensible beginner roadmap", "Starting small and safe"], tags: ["Basics"] },
      { slug: "risk-and-psychology", title: "Your Own Worst Enemy: Risk & Mindset",
        summary: "Most investors are beaten not by the market but by themselves. Meet position sizing, the biggest behavioural traps - FOMO, anchoring, loss aversion - and how to beat them.",
        learn: ["Risk vs reward", "Position sizing basics", "FOMO & herd behaviour", "Loss aversion & anchoring",
          "Why most traders lose", "Building good habits"], tags: ["Risk"] },
      { slug: "scams-and-protection", title: "Scams, Manipulation & How to Protect Yourself",
        summary: "From Harshad Mehta to today's WhatsApp pump-and-dumps and finfluencer traps - the famous Indian market scams, the red flags they share, and how to keep your money safe.",
        learn: ["The classic scams (Mehta, Parekh, Satyam)", "Pump-and-dump schemes", "Finfluencer & tip traps",
          "Ponzi & guaranteed-return frauds", "Red flags to spot", "How to protect yourself"], tags: ["Scams"] },
    ],
  },
];

// Auto-number chapters by position so inserting one needs no manual renumbering.
let _n = 0;
for (const _p of PARTS) for (const _c of _p.chapters) _c.n = ++_n;

export const CHAPTERS = PARTS.flatMap((p) =>
  p.chapters.map((c) => ({ ...c, part: p.id, partName: p.name }))
).sort((a, b) => a.n - b.n);

export function chapterBySlug(slug) {
  return CHAPTERS.find((c) => c.slug === slug) || null;
}

export const TAG_CLASS = {
  Money: "nse",
  Basics: "idx",
  Markets: "nfo",
  Regulation: "live",
  IPO: "mcx",
  Index: "py",
  Macro: "afl",
  Trading: "us",
  Risk: "live",
  Scams: "live",
};
