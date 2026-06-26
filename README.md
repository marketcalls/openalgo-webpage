# OpenAlgo Website

The official website for [OpenAlgo](https://openalgo.in) - India's first community-driven, open-source algorithmic trading platform. Built with Next.js 15 and React 19, this site is the primary landing page, documentation hub, download portal, and **free learning academy** for the OpenAlgo ecosystem.

## About OpenAlgo

OpenAlgo is a self-hostable algorithmic trading platform built by traders, for traders. It offers seamless integration with 33+ Indian brokers through a unified API, enabling automation from platforms like TradingView, Amibroker, Python, Excel, MetaTrader, and more. Deploy it on your own server - your strategies, your data, your infrastructure.

## Key Features

- **33+ Broker Integrations** - Unified API across all major Indian brokers with a common symbol format
- **16+ Platform Integrations** - Amibroker, TradingView, Python, MetaTrader, Excel, Chrome Extension, and more
- **6 Official SDKs** - Python, Node.js, Java, .NET/C#, Go, Rust
- **9 Free Learning Courses** - 242 chapters from market basics and chart-reading through futures and options to expert quant and AmiBroker AFL, all on real market data (see below)
- **Self-Hosted & Private** - Deploy on your own infrastructure with complete data privacy
- **SmartOrder & Basket Orders** - Advanced order types including split orders and position management
- **AI/LLM Integration** - MCP (Model Context Protocol) support for AI-driven trading
- **FastScalper** - High-performance trading app built with Rust + Tauri
- **100% Open Source** - AGPL-3.0 licensed, community-driven, transparent development
- **Static IP Compliant** - SEBI-compliant static IP deployment guides included

## Learning Courses

Nine free, hands-on courses cover beginner entry points (market basics, chart-reading and derivatives), a Python/algo/quant ladder, and a parallel AmiBroker AFL track, taught in plain English with runnable, live-tested examples on real Indian (OpenAlgo) and US (yfinance) market data. The [`/learn`](https://openalgo.in/learn) hub ties them together.

| Course | Level | Chapters | What it covers |
|--------|-------|----------|----------------|
| [Stock Market Basics](https://openalgo.in/stocks) (`/stocks`) | Beginner | 18 | Shares, IPOs, indices, market plumbing, price-moving events, risk, scams, and getting started as an investor. |
| [Technical Analysis](https://openalgo.in/technicals) (`/technicals`) | Beginner | 28 | Reading real NSE charts: candlesticks, trends, support/resistance, chart patterns, and a broad indicator toolbox (moving averages, RSI and oscillators, MACD, ADX trend strength, Bollinger/ATR volatility, volume and money-flow, Supertrend and Ichimoku, plus OpenAlgo's 80+ library), risk and psychology. |
| [Python for Traders](https://openalgo.in/fundamentals) (`/fundamentals`) | Beginner | 40 | Python from zero - variables, data structures, NumPy, pandas, charts, then real market data. No prior coding needed. |
| [Algo Trading with Python](https://openalgo.in/python) (`/python`) | Intermediate | 32 | Build, backtest and automate strategies with the OpenAlgo SDK - indicators, signals, orders, WebSockets, risk. |
| [Quantitative Trading](https://openalgo.in/quant) (`/quant`) | Expert | 36 | Market microstructure, the mathematics of markets, derivatives and volatility, portfolio risk, and finding an edge. |
| [AmiBroker AFL](https://openalgo.in/amibroker) (`/amibroker`) | Beginner | 36 | AFL from scratch - indicators, scans, backtests, optimization, alerts, and OpenAlgo order automation. |
| [Futures Trading](https://openalgo.in/futures) (`/futures`) | Beginner | 12 | Futures from zero - contracts, margin and leverage, mark-to-market, long/short, the payoff, basis, rollover, hedging, and the risks of leverage, on real Indian market examples. |
| [Options Basics](https://openalgo.in/options-basics) (`/options-basics`) | Beginner | 14 | Options from absolute zero - calls and puts, premium/strike/expiry, moneyness, intrinsic and time value, the option chain, the four payoffs, the Greeks, and implied volatility, with real payoff charts. |
| [Options Strategies](https://openalgo.in/options-strategies) (`/options-strategies`) | Beginner | 26 | All 38 strategies in the OpenAlgo strategy builder, each with an authentic payoff chart and the full nine-metric panel (max profit/loss, POP, risk to reward, margin and more) built from the builder's own maths on live NIFTY data: spreads, straddles, strangles, iron condors and flies, butterflies, ratios, jade lizards, batman, calendars and synthetics, plus margin/collateral/pledging/penalties and options adjustments. |

Course content lives as Markdown + tested Python examples under `content/`, rendered to JSON at build time by the generators in `scripts/`. Strategies are tested in OpenAlgo's **analyzer (sandbox) mode** - never with claims of live data.

## Website Pages

| Page | Description |
|------|-------------|
| `/` | Hero landing page with stats, ecosystem overview, and trust indicators |
| `/learn` | Learning hub linking all nine free courses |
| `/stocks` | "Stock Market Basics" - 18-chapter beginner stock-market course |
| `/technicals` | "Technical Analysis" - 28-chapter beginner chart-reading course |
| `/fundamentals` | "Python for Traders" - 40-chapter beginner Python-for-finance course |
| `/python` | "Algo Trading with Python" - 32-chapter intermediate course |
| `/quant` | "Quantitative Trading" - 36-chapter expert course |
| `/amibroker` | "AmiBroker AFL" - 36-chapter chart-based AFL course |
| `/futures` | "Futures Trading" - 12-chapter beginner futures course |
| `/options-basics` | "Options Basics" - 14-chapter beginner options course |
| `/options-strategies` | "Options Strategies" - 26-chapter beginner options-strategy course |
| `/features` | 45+ features organized by category |
| `/getting-started` | Step-by-step beginner's guide |
| `/download` | Multi-platform downloads (macOS, Linux, Windows) and SDK links |
| `/roadmap` | Development roadmap with planned features |
| `/faq` | Frequently asked questions |
| `/blog` | News and updates |
| `/static-ip` | Static IP & VPS hosting guide for SEBI compliance |
| `/fastscalper` | FastScalper desktop trading app showcase |
| `/wabridge` | WhatsApp HTTP Bridge documentation |

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework (App Router)
- [React 19](https://react.dev/) - UI library
- [TailwindCSS 4](https://tailwindcss.com/) - Utility-first CSS (CSS-first `@theme` config)
- [Radix UI](https://www.radix-ui.com/) - Accessible UI primitives
- [Lucide Icons](https://lucide.dev/) - Icon system
- [Three.js](https://threejs.org/) + React Three Fiber - 3D graphics
- [marked](https://marked.js.org/) + [highlight.js](https://highlightjs.org/) - Course content rendering
- [OpenNext](https://opennext.js.org/cloudflare) + [Cloudflare Workers](https://workers.cloudflare.com/) - Deployment

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/marketcalls/openalgo-webpage.git
cd openalgo-webpage
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server (regenerates course content first):
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                    # Next.js App Router pages
  api/                  # API routes (blog-feed, ip-lookup, OG image)
  stocks/               # "Stock Market Basics" course (18 static chapter routes)
  technicals/           # "Technical Analysis" course (28 static chapter routes)
  fundamentals/         # "Python for Traders" course (40 static chapter routes)
  python/               # "Algo Trading with Python" course
  quant/                # "Quantitative Trading" course
  amibroker/            # "AmiBroker AFL" course
  futures/              # "Futures Trading" course (12 static chapter routes)
  options-basics/       # "Options Basics" course (14 static chapter routes)
  options-strategies/   # "Options Strategies" course (26 static chapter routes)
  learn/                # Learning hub linking all nine courses
  features/             # Features listing
  getting-started/      # Beginner's guide
  roadmap/  faq/  blog/  download/  static-ip/  fastscalper/  wabridge/
  layout.js             # Root layout (Navbar + Footer)
  page.js               # Home page
  globals.css           # Global styles & design tokens (Tailwind v4 @theme)
components/             # Reusable React components (navbar, footer, ui/)
content/                # Course source: Markdown + tested Python examples
  stocks/  technicals/  fundamentals/  python/  quant/  amibroker/  futures/  options-basics/  options-strategies/   # md/, examples/ (.py + .out + .png), data/
scripts/                # Build-time content generators (gen-*-content.mjs)
lib/                    # *Curriculum.js (manifests) + *ContentData.json (generated)
public/                 # Static assets, course charts, favicons, sitemap.xml
middleware.js           # Rate limiting (200 req/hr per IP)
```

## Development

### Prerequisites
- Node.js 18.18.0 or later
- npm

### Common scripts
```bash
npm run dev        # generate content + start the dev server
npm run gen        # (re)generate all course content JSON from content/
npm run build      # production build
npm run preview    # build and preview the Cloudflare Worker locally
npm run deploy     # generate + build + deploy to Cloudflare Workers
npm start          # serve the production build
```

The course pipeline renders each chapter's Markdown and its **live-tested** Python examples (with captured output and matplotlib/seaborn charts) into a bundled JSON module, so the pages need no filesystem access at runtime - essential on Cloudflare Workers.

## OpenAlgo Ecosystem

This website showcases the broader OpenAlgo FOSS ecosystem:

- **Core**: [OpenAlgo](https://github.com/marketcalls/openalgo) - Central API and trading engine
- **SDKs**: Python, Node.js, Java, .NET, Go, Rust
- **Apps**: FastScalper, OpenAlgo Mobile (Flutter), Chrome Extension, Excel Add-in
- **Tools**: AlgoMirror, OpenAlgo Flow, Historify, OpenQuest, OpenAlgo Chart
- **AI**: MCP integration for AI agents and LLM-powered trading

## Resources

- [OpenAlgo Documentation](https://docs.openalgo.in)
- [API Reference](https://docs.openalgo.in/api)
- [Discord Community](https://discord.gg/openalgo)
- [GitHub - OpenAlgo Core](https://github.com/marketcalls/openalgo)
- [GitHub - This Website](https://github.com/marketcalls/openalgo-webpage)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
