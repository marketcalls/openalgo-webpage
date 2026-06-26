// Single source of truth for the "Technical Analysis" learning portal:
// 25 chapters across 6 modules. Slugs form the /technicals/<slug> URLs - keep them stable.
// Chapter numbers are assigned automatically by position, so chapters can be
// inserted with no manual renumbering. The course teaches from REAL NSE daily
// charts (pulled from OpenAlgo) - every example is grounded in actual price data.

export const SERIES_TITLE = "Technical Analysis";
export const SERIES_SUB =
  "Your first steps in technical analysis. If you have never read a price chart before, start here: every term is explained in plain English, we build from the very first candle, and every lesson is grounded in real NSE daily data, with honest facts, not textbook promises.";

export const PARTS = [
  {
    id: "A",
    name: "Getting Started with Charts",
    desc: "What technical analysis really is, and how to read a price chart without getting lost.",
    chapters: [
      { slug: "what-is-technical-analysis", title: "What Technical Analysis Actually Is (and Isn't)",
        summary: "Technical analysis is the study of price and volume, not a crystal ball. Learn what charts can honestly tell you, how TA differs from fundamentals, and why it is about probabilities and risk, never certainty.",
        learn: ["Price and volume as the only inputs", "TA vs fundamental analysis", "What charts can and can't predict",
          "Why TA is about probability, not certainty", "The three core assumptions", "Where TA actually adds an edge"], tags: ["Basics"] },
      { slug: "reading-charts", title: "Reading a Chart Without Getting Lost",
        summary: "Line, bar and candlestick, the three ways to draw the same price, and why candlesticks win. Decode the axes, OHLC and what a real RELIANCE daily chart is telling you at a glance.",
        learn: ["Line vs bar vs candlestick", "The OHLC of every bar", "Price axis and time axis", "Why candlesticks dominate",
          "Reading a real daily chart", "Common chart-reading mistakes"], tags: ["Charts"] },
      { slug: "candlestick-anatomy", title: "The Candlestick: One Bar, Five Numbers, a Story",
        summary: "Body, wicks and colour, a single candle packs open, high, low and close into one shape. See how to read conviction, rejection and indecision from the candles on a live NSE chart.",
        learn: ["Body vs wick vs shadow", "Bullish and bearish candles", "Long wicks = rejection", "Marubozu and conviction",
          "What a single candle really says", "Reading candle size and context"], tags: ["Candles"] },
      { slug: "timeframes-and-scales", title: "Timeframes, Scales & Why a Chart Can Mislead",
        summary: "The same stock looks bullish on one timeframe and bearish on another. Learn how daily, weekly and monthly views differ, why log scale beats linear over years, and how chart settings quietly change the story.",
        learn: ["Daily, weekly, monthly views", "Why this course uses daily data", "Linear vs logarithmic scale",
          "How timeframe changes the signal", "Choosing the right timeframe", "How settings can distort a chart"], tags: ["Charts"] },
    ],
  },
  {
    id: "B",
    name: "Market Structure & Levels",
    desc: "Trends, trendlines and the support/resistance levels where price turns, the skeleton of every chart.",
    chapters: [
      { slug: "dow-theory", title: "Dow Theory: The Idea Behind Every Chart",
        summary: "Long before computers, Charles Dow laid out the rules every chartist still uses, trends, phases and confirmation. Meet the 120-year-old framework that quietly underpins all of modern technical analysis.",
        learn: ["The six tenets of Dow Theory", "Primary, secondary and minor trends", "Accumulation, markup, distribution",
          "Higher highs and higher lows", "Why volume must confirm", "How Dow Theory shows up today"], tags: ["Trend"] },
      { slug: "trends-and-trendlines", title: "The Trend Is Your Friend, Until It Bends",
        summary: "An uptrend is just higher highs and higher lows, until it isn't. Learn to spot, draw and trust a trend, where trendlines break, and how to tell a real change of trend from noise on a real chart.",
        learn: ["Uptrend, downtrend, sideways", "Drawing a valid trendline", "How many touches make it real",
          "When a trendline breaks", "Trend strength and angle", "Change of trend vs a pullback"], tags: ["Trend"] },
      { slug: "support-and-resistance", title: "Support & Resistance: Where Price Remembers",
        summary: "Prices turn at levels the crowd remembers. Learn how support and resistance form, why they flip roles once broken, and how to mark the levels that actually matter on a real NSE daily chart.",
        learn: ["What support and resistance are", "The psychology behind a level", "Role reversal after a break",
          "Round numbers and prior highs/lows", "Drawing zones, not exact lines", "Why levels eventually fail"], tags: ["Levels"] },
      { slug: "channels-and-breakouts", title: "Channels, Ranges & the Breakout",
        summary: "Markets spend most of their time going sideways. Learn to trade the channel and the range, tell a real breakout from a fakeout, and understand the throwback that traps impatient traders.",
        learn: ["Drawing channels and ranges", "Trading inside a range", "Breakout vs false breakout (fakeout)",
          "Volume on a breakout", "The throwback / retest", "Range-to-trend transitions"], tags: ["Levels"] },
      { slug: "fibonacci", title: "Fibonacci: The Pullback Map",
        summary: "After a big move, how far does price pull back before resuming? Fibonacci's 38.2%, 50% and 61.8% levels give a surprisingly useful map. See where they held, and failed, on real Indian charts.",
        learn: ["Where Fibonacci ratios come from", "Drawing a retracement", "The 38.2 / 50 / 61.8 levels",
          "Extensions for targets", "Confluence with support/resistance", "Why Fibonacci is a guide, not magic"], tags: ["Levels"] },
    ],
  },
  {
    id: "C",
    name: "Candlestick Patterns",
    desc: "The single- and multi-candle shapes that hint at a turn, and why context decides everything.",
    chapters: [
      { slug: "single-candle-patterns", title: "Single Candles That Whisper a Turn",
        summary: "The doji, hammer, shooting star and marubozu, one candle that can flag a shift in control. Learn what each really means and find genuine examples on real NSE daily charts.",
        learn: ["Doji and indecision", "Hammer and hanging man", "Shooting star and inverted hammer", "Marubozu conviction",
          "Spinning tops", "What a single candle can and can't tell you"], tags: ["Candles"] },
      { slug: "multi-candle-patterns", title: "Two- and Three-Candle Tells",
        summary: "Engulfing, harami, morning and evening stars, patterns where a few candles together flip the story. See how each forms and where they actually marked turns on real charts.",
        learn: ["Bullish and bearish engulfing", "The harami", "Morning star and evening star", "Three white soldiers / black crows",
          "Tweezer tops and bottoms", "Reliability of multi-candle patterns"], tags: ["Candles"] },
      { slug: "patterns-in-context", title: "Why a Pattern Only Matters in Context",
        summary: "A hammer in the middle of nowhere means nothing; a hammer at strong support is a signal. Learn to combine candles with trend, levels and volume, and to ignore the many that lead nowhere.",
        learn: ["Patterns at support and resistance", "Patterns with and against the trend", "Volume confirmation",
          "Why most patterns fail", "Building a confirmation checklist", "Avoiding pattern-spotting bias"], tags: ["Candles"] },
    ],
  },
  {
    id: "D",
    name: "Chart Patterns",
    desc: "The bigger shapes, reversals, continuations and gaps, that play out over weeks.",
    chapters: [
      { slug: "reversal-patterns", title: "Tops & Bottoms: Reversal Patterns",
        summary: "Head-and-shoulders, double tops and double bottoms, the classic shapes that mark the end of a trend. Learn how to spot them forming and measure a realistic target from a real example.",
        learn: ["Head and shoulders (and inverse)", "Double and triple tops/bottoms", "The neckline and the break",
          "Measuring a price target", "Volume through the pattern", "False reversals and traps"], tags: ["Patterns"] },
      { slug: "continuation-patterns", title: "Pauses, Not Reversals: Continuation Patterns",
        summary: "Flags, pennants, triangles and rectangles are the market catching its breath before continuing. Learn to tell a healthy pause from a genuine reversal, with real chart examples.",
        learn: ["Flags and pennants", "Ascending, descending, symmetrical triangles", "Rectangles and consolidations",
          "Measuring the move after a break", "Continuation vs reversal", "Where these patterns fail"], tags: ["Patterns"] },
      { slug: "gaps", title: "Gaps: When Price Jumps the Queue",
        summary: "Sometimes a stock opens far from yesterday's close, leaving a gap. Learn the four kinds, common, breakaway, runaway and exhaustion, and what each says, using real NSE gap examples.",
        learn: ["Why gaps form (news, results)", "Common vs breakaway gaps", "Runaway and exhaustion gaps", "Do gaps get filled?",
          "Gaps with volume", "Trading around a gap safely"], tags: ["Patterns"] },
    ],
  },
  {
    id: "E",
    name: "Indicators",
    desc: "The popular indicators explained from scratch, moving averages, momentum, trend strength, volatility, volume and trend-following systems, plus a tour of OpenAlgo's 80+ indicator toolbox, and how not to drown in them.",
    chapters: [
      { slug: "moving-averages", title: "Moving Averages: The Trend, Smoothed",
        summary: "Your very first indicator. A moving average turns jagged price into a clean line you can lean on. Meet the SMA and EMA (and the faster WMA, HMA and VWMA), dynamic support, and the famous golden and death crosses, dated and measured on real charts.",
        learn: ["Why we smooth price at all", "Simple vs exponential MA, in plain words", "The faster cousins: WMA, HMA, VWMA", "Common lengths (20, 50, 200)", "MA as dynamic support and the golden/death cross", "The lag trade-off"], tags: ["Indicators"] },
      { slug: "rsi-and-momentum", title: "RSI and the Momentum Oscillators",
        summary: "Momentum oscillators measure how fast price is moving, not just where. Start with the RSI, then meet the Stochastic, CCI, Williams %R and Stochastic RSI, and learn why 'overbought' is not a sell button.",
        learn: ["What momentum and an oscillator are", "RSI from 0 to 100", "Why overbought can stay overbought", "Stochastic, CCI and Williams %R", "Bullish and bearish divergence", "Oscillators in trends vs ranges"], tags: ["Indicators"] },
      { slug: "macd", title: "MACD: Trend and Momentum in One",
        summary: "The MACD blends two moving averages into a single momentum tool with a signal line and histogram. Learn to read crossovers and divergence, with dated examples and the honest hit rate from real charts.",
        learn: ["How MACD is built, gently", "The signal line crossover", "The histogram", "Zero-line context", "MACD divergence", "Its honest hit rate"], tags: ["Indicators"] },
      { slug: "bollinger-bands", title: "Bollinger Bands, ATR and Volatility",
        summary: "Volatility is just how much price jumps around, and it is measurable. Learn Bollinger Bands and the squeeze, the ATR you will size stops with, and the Keltner and Donchian channels, all on real charts.",
        learn: ["What volatility means for your risk", "Bollinger Bands and the squeeze", "Why a band touch is not a signal", "ATR: the trader's ruler for stops", "Keltner and Donchian channels", "Volatility expands and contracts"], tags: ["Indicators"] },
      { slug: "volume", title: "Volume Indicators: OBV, MFI and Money Flow",
        summary: "Price tells you what; volume tells you how convincingly. Beyond raw volume, meet On-Balance Volume, the Money Flow Index, Chaikin Money Flow and the A/D line, and see what real NSE volume did at big turns.",
        learn: ["Volume as conviction", "On-Balance Volume (OBV)", "The Money Flow Index (MFI)", "Chaikin Money Flow and the A/D line", "Volume spikes and divergence", "Delivery vs traded volume in India"], tags: ["Volume"] },
      { slug: "trend-strength", title: "How Strong Is the Trend? ADX, DMI and Aroon",
        summary: "Direction is only half the story; strength is the other half. The ADX, DMI and Aroon tell you whether a trend has real force behind it or is just drifting, so you know when a trend tool will work and when it will whipsaw.",
        learn: ["Direction vs strength", "Reading the ADX and the 25 line", "DMI: the +DI and -DI lines", "The Aroon up and down", "Strong trend vs choppy range", "Using strength as a filter"], tags: ["Indicators"] },
      { slug: "trend-following-tools", title: "Trend Tools That Sit on Price: Supertrend, SAR and Ichimoku",
        summary: "Some indicators plot directly on price and flip from buy to sell for you. Meet the Supertrend, the Parabolic SAR and the Ichimoku Cloud, what each does well, and where each gets chopped up in a range.",
        learn: ["Indicators that sit on price", "Supertrend and the ATR trail", "Parabolic SAR (the dots)", "The Ichimoku Cloud, simply", "Where trend-followers whipsaw", "Trailing a stop with them"], tags: ["Indicators"] },
      { slug: "combining-indicators", title: "Stacking Indicators Without Fooling Yourself",
        summary: "Five indicators that all say the same thing give false confidence, not five confirmations. Learn to combine one tool from each family, trend, momentum, volatility and volume, and stop the clutter.",
        learn: ["The four indicator families", "Redundancy vs real confirmation", "One tool from each family", "Avoiding indicator overload", "Indicators confirm, price leads", "Building a clean chart template"], tags: ["Indicators"] },
      { slug: "indicator-toolbox", title: "The Full Indicator Toolbox: 80+ at Your Fingertips",
        summary: "OpenAlgo's library carries 80+ indicators across trend, momentum, volatility, volume, oscillators, statistics and hybrids. This is your map of the whole toolbox: what each family is for, the standouts in each, and how to choose a few without drowning.",
        learn: ["The seven indicator families", "Trend and moving-average variants", "Momentum and oscillators", "Volatility and channels", "Volume and money-flow", "How to choose, and what to ignore"], tags: ["Indicators"] },
    ],
  },
  {
    id: "F",
    name: "From Analysis to Action",
    desc: "Turn reading charts into a repeatable, risk-managed process, and the mindset to actually follow it.",
    chapters: [
      { slug: "multiple-timeframe-analysis", title: "Top-Down: Multiple-Timeframe Analysis",
        summary: "The pros decide direction on the higher timeframe and time entries on the lower one. Learn the top-down routine, weekly for the map, daily for the move, aligned on a real chart.",
        learn: ["Why one timeframe isn't enough", "Higher timeframe = direction", "Lower timeframe = timing",
          "Aligning weekly and daily", "Avoiding timeframe conflict", "A simple top-down checklist"], tags: ["Strategy"] },
      { slug: "building-a-strategy", title: "From Setup to System: Build & Backtest",
        summary: "Combine trend, a level and a trigger into a rule-based setup, then test it honestly on real history. Learn how a simple, well-tested edge beats a complicated guess, and how to measure it.",
        learn: ["Turning analysis into rules", "Entry, exit and stop in advance", "What backtesting really shows",
          "Win rate vs reward-to-risk", "Avoiding curve-fitting", "From idea to a tested setup"], tags: ["Strategy"] },
      { slug: "risk-management", title: "Risk First: Position Sizing & Stops",
        summary: "Survival comes before profit. Learn the stop-loss, the reward-to-risk ratio and how to size a position so no single trade can hurt you, the unglamorous math that keeps traders alive.",
        learn: ["Why risk comes first", "Placing a sensible stop-loss", "Reward-to-risk ratio", "The 1-2% rule",
          "Position sizing from the stop", "The math of drawdown and recovery"], tags: ["Risk"] },
      { slug: "psychology-and-next-steps", title: "The Last Edge: Psychology, Discipline & What's Next",
        summary: "Most traders fail not on analysis but on themselves. Learn the mental traps, the discipline of a written plan and a journal, and where to go next, including automating a tested setup with OpenAlgo.",
        learn: ["Fear, greed and FOMO", "The trading plan and journal", "Why most retail traders lose",
          "Discipline over prediction", "Backtesting and automation with OpenAlgo", "Your path from here"], tags: ["Psychology"] },
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
  Basics: "idx",
  Charts: "nse",
  Trend: "nfo",
  Levels: "mcx",
  Candles: "py",
  Patterns: "afl",
  Indicators: "us",
  Volume: "live",
  Strategy: "nfo",
  Risk: "live",
  Psychology: "idx",
};
