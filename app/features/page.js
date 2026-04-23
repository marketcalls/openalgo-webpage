"use client"

import {
  Code2, GitBranch, Users, Lock, Zap, Database, Globe, LineChart,
  Bot, Package, Github, Network, Link2, FileSpreadsheet, SplitSquareHorizontal,
  MessageCircle, LayoutDashboard, Terminal, Webhook, Activity,
  BarChart3, Gauge, FileJson, Brain, Search, Clock, GitMerge, Key, ShieldCheck,
  AlertCircle, User, Mail, Smartphone, History, Container,
  Wand2, Layers, Target, Box, Sigma, PieChart, Wallet
} from "lucide-react"

const features = [
  { title: "Strategy Builder", description: "Build multi-leg option strategies, see live Greeks and payoff, test what-ifs, and fire the full basket to your broker in one click", icon: Wand2, category: "Options Analytics" },
  { title: "Strategy Portfolio", description: "Save your favourite strategies for live tracking or paper-trading, and reopen any of them in seconds", icon: Box, category: "Options Analytics" },
  { title: "Option Chain", description: "Live option chain with Greeks, open interest, volume, and bid/ask - click any strike to trade instantly", icon: Layers, category: "Options Analytics" },
  { title: "Option Greeks Chart", description: "See how IV, Delta, Theta, Vega and Gamma have moved over time for the at-the-money strike", icon: Gauge, category: "Options Analytics" },
  { title: "OI Tracker", description: "Side-by-side call and put open interest with PCR and a marker showing where the spot is right now", icon: Activity, category: "Options Analytics" },
  { title: "Max Pain", description: "Where price is most likely to settle at expiry, shown visually across all strikes", icon: Target, category: "Options Analytics" },
  { title: "Straddle Chart", description: "Combined price of the at-the-money call and put, with automatic strike roll as spot moves", icon: LineChart, category: "Options Analytics" },
  { title: "Straddle PnL Simulator", description: "Simulate how a straddle would have played out intraday with automated adjustments and a full trade log", icon: BarChart3, category: "Options Analytics" },
  { title: "Volatility Surface", description: "Live 3D view of implied volatility across every strike and expiry - spot skew and term structure at a glance", icon: Box, category: "Options Analytics" },
  { title: "GEX Dashboard", description: "See where market makers are positioned - find the biggest gamma walls acting as support and resistance", icon: Sigma, category: "Options Analytics" },
  { title: "IV Smile", description: "Call and put implied volatility curves with the at-the-money marker, so you can read skew instantly", icon: PieChart, category: "Options Analytics" },
  { title: "OI Profile", description: "Futures candles with a call vs put open-interest butterfly and daily OI change - price action and positioning in one view", icon: Wallet, category: "Options Analytics" },
  { title: "Smart Orders", description: "Tell OpenAlgo the position you want and it works out the math - no more tracking holdings or calculating reverse quantities by hand", icon: Brain, category: "Order Management" },
  { title: "Basket Orders", description: "Fire multiple orders across symbols in one request - perfect for hedge pairs, spreads, or rebalancing a portfolio in one shot", icon: Package, category: "Order Management" },
  { title: "All Order Types", description: "Market, Limit, Stop-Loss and Stop-Loss Market orders across CNC, MIS, NRML - everything you need to place any trade", icon: FileJson, category: "Order Management" },
  { title: "Intelligent Order Splitting", description: "Big orders are auto-split into smaller chunks so you get better fills and don't move the market against yourself", icon: SplitSquareHorizontal, category: "Order Management" },
  { title: "Sequential Basket Orders", description: "Buy legs go first, sell legs follow - so you always have margin and don't get rejected mid-basket", icon: Package, category: "Order Management" },
  { title: "Action Center (Order Approval)", description: "Semi-auto mode - every signal waits for your review so you can approve, tweak, or reject before it hits the broker", icon: ShieldCheck, category: "Order Management" },
  { title: "Positions & Holdings", description: "Live view of every open position, average price, unrealised P&L, and long-term holdings - all in one screen", icon: Wallet, category: "Analytics" },
  { title: "Sandbox Mode (Analyzer)", description: "Practice with Rs. 1 Crore virtual capital on live market data - real prices, real margins, zero risk to your wallet", icon: Search, category: "Testing & Debug" },
  { title: "Flow Visual Builder", description: "Drag-and-drop your strategy on a canvas - connect triggers, conditions, and actions without writing a single line of code", icon: GitMerge, category: "Strategy Execution" },
  { title: "Host Python Strategies", description: "Upload and run your Python strategies inside OpenAlgo itself - no extra server, no cron jobs, no deployment headache", icon: Code2, category: "Strategy Execution" },
  { title: "Strategy Templates", description: "Start from ready-made templates instead of a blank file - tweak, test, and ship in minutes", icon: Brain, category: "Strategy Execution" },
  { title: "Telegram Bot", description: "Get order, P&L, and signal alerts on your phone, and run quick commands like /positions or /pnl from any chat", icon: MessageCircle, category: "Integration" },
  { title: "TradingView Webhooks", description: "Any TradingView alert or Pine Script strategy can fire real orders at your broker through a single webhook", icon: Webhook, category: "Integration" },
  { title: "Amibroker Integration", description: "Send AFL buy/sell signals straight to your broker via OpenAlgo - keep your charts, just add automated execution", icon: LineChart, category: "Integration" },
  { title: "Chartink Integration", description: "Convert any Chartink scanner into an auto-trading strategy - stocks that match the filter get traded for you", icon: LineChart, category: "Integration" },
  { title: "GoCharting Integration", description: "GoCharting alerts and indicators can trigger live orders through OpenAlgo - Indian-market-native charting meets automation", icon: LineChart, category: "Integration" },
  { title: "Multi-Platform Trading", description: "Trade from Amibroker, TradingView, Python, MetaTrader, Excel, or Google Sheets - OpenAlgo is the bridge to your broker", icon: Link2, category: "Integration" },
  { title: "30+ Broker Support", description: "Connect seamlessly with India's top broking platforms across discount, full-service, and emerging brokers", icon: Network, category: "Integration" },
  { title: "Trade By Chatting (MCP)", description: "Connect your OpenAlgo account to Claude, Cursor, Windsurf, or ChatGPT and place orders, check positions, and pull live prices just by asking", icon: Bot, category: "Integration" },
  { title: "AI Skills for Indicators & Charts", description: "Ready-made abilities for your AI assistant - chart any indicator, scan stocks, build custom indicators, and stream live prices with one instruction", icon: Wand2, category: "AI & Skills" },
  { title: "AI Skills for Backtesting", description: "Test strategies on past data with real brokerage and taxes built in for Indian, US, and crypto markets - get full reports in plain English", icon: Brain, category: "AI & Skills" },
  { title: "Works With 40+ AI Apps", description: "Install OpenAlgo skills into Claude Code, Cursor, Codex, Windsurf, Cline, Copilot, Gemini and more - the installer picks the right spot automatically", icon: Terminal, category: "AI & Skills" },
  { title: "One API for All Brokers", description: "Write your order logic once - the same /api/v1/ call works across every supported broker. Switch brokers without rewriting code", icon: Globe, category: "API Infrastructure" },
  { title: "40+ API Endpoints", description: "Place orders, read positions, pull quotes, stream market data, manage accounts - everything a trading app needs, in one REST API", icon: Terminal, category: "API Infrastructure" },
  { title: "Common Symbol Format", description: "Same symbol name works across every broker - no more mapping NSE:SBIN vs SBIN-EQ vs SBIN every time you switch", icon: Globe, category: "Data Management" },
  { title: "Symbol Search", description: "Find any stock, F&O contract, or index with a single search - auto-maps to the right broker format", icon: Search, category: "Data Management" },
  { title: "Master Contracts", description: "The full instrument list across every exchange refreshes daily, so your symbol data is never stale", icon: Database, category: "Data Management" },
  { title: "Historical Data Access", description: "Pull historical candles for any symbol and timeframe through the Historify integration - ideal for backtests and research", icon: History, category: "Data Management" },
  { title: "Real-Time PnL Tracker", description: "Live P&L curve, drawdown, win rate, and per-strategy breakdown - see exactly how your day is going", icon: Activity, category: "Analytics" },
  { title: "Latency Monitor", description: "See how many milliseconds your orders actually take - compare brokers side by side and spot slow links before they cost you", icon: Clock, category: "Analytics" },
  { title: "Traffic Logs", description: "Every API call you make is logged - filter by source, status, or endpoint and export to CSV for audit or debugging", icon: LayoutDashboard, category: "Analytics" },
  { title: "Audit Trail", description: "Full database-backed log of every order, login, and config change - bring receipts when anything looks off", icon: FileJson, category: "Analytics" },
  { title: "Streaming Quotes", description: "Live LTP and quote updates across every connected broker - one stream, any symbol, any exchange", icon: Activity, category: "Real-Time Data" },
  { title: "Level 5 Market Depth", description: "Full 5-level bid/ask ladder in real time - see the order book your broker sees", icon: BarChart3, category: "Real-Time Data" },
  { title: "Common WebSocket Layer", description: "One normalized real-time feed for every broker - your code never has to care who the data is coming from", icon: Zap, category: "Real-Time Data" },
  { title: "Raw WebSocket Implementation", description: "Built directly on broker WebSockets (no third-party SDKs) - lower latency, fewer middle layers, more reliability", icon: Zap, category: "Real-Time Data" },
  { title: "Auto-Reconnection", description: "If a broker feed drops, OpenAlgo reconnects and resubscribes for you - no babysitting required", icon: GitBranch, category: "Real-Time Data" },
  { title: "Two-Factor Authentication", description: "Secure every login with a time-based code from Google Authenticator, Authy, or any TOTP app - even a leaked password is not enough to get in", icon: Smartphone, category: "Security" },
  { title: "TOTP Password Reset", description: "Forgot your password? Reset it safely using your authenticator app, with no dependency on email", icon: Key, category: "Security" },
  { title: "Gmail SMTP Reset", description: "Optional email-based password reset via your own Gmail SMTP - stays in your control, not ours", icon: Mail, category: "Security" },
  { title: "Browser-Level Security", description: "CSP headers, CORS rules, CSRF protection, rate limiting, and monthly security audits baked in", icon: ShieldCheck, category: "Security" },
  { title: "Exchange Compliance", description: "Daily fresh login built in - auth tokens expire at midnight per exchange rules, so your account stays compliant automatically", icon: Lock, category: "Security" },
  { title: "No Data Collection", description: "Zero telemetry, zero tracking, everything runs on your machine - your trading data never leaves your server", icon: ShieldCheck, category: "Security" },
  { title: "Single User System", description: "Designed for individual traders - the first user is admin, no multi-tenant complexity to manage", icon: User, category: "User Management" },
  { title: "One Account Per User", description: "Each user connects one broker account - clean separation, clean accounting, no cross-trade confusion", icon: Key, category: "User Management" },
  { title: "Python SDK with 100+ Indicators", description: "One pip install and you have 100+ technical indicators and full order APIs ready to use in your Python strategies", icon: Code2, category: "Developer Tools" },
  { title: "Standardized Format", description: "Every broker speaks the same request/response shape in OpenAlgo - learn once, use everywhere", icon: FileSpreadsheet, category: "Developer Tools" },
  { title: "Plugin Architecture", description: "Adding a new broker is a drop-in plugin, not a core rewrite - customise without forking the whole project", icon: Package, category: "Developer Tools" },
  { title: "Zero-Config Installation", description: "One command and sensible defaults - you are trading in minutes, not reading docs for an afternoon", icon: Package, category: "Infrastructure" },
  { title: "Docker Support", description: "Production-ready Docker images - deploy the same stack to your laptop, a VPS, or a cloud VM with no surprises", icon: Container, category: "Infrastructure" },
  { title: "Connection Pooling", description: "Broker connections are reused across requests - lower latency and fewer timeouts during busy minutes", icon: Network, category: "Infrastructure" },
  { title: "Direct Broker API Integration", description: "Built straight on broker REST APIs, no third-party SDK wrappers - fewer dependencies, fewer breakages", icon: GitBranch, category: "Infrastructure" },
  { title: "API Key Authentication", description: "Simple API key auth for every endpoint - easy to rotate, easy to revoke", icon: Key, category: "Infrastructure" },
  { title: "Health Endpoints", description: "Built-in /health endpoints so your monitoring tools know when the server is up - wire it into Uptime Robot or Grafana in a minute", icon: Activity, category: "Infrastructure" },
  { title: "Rate Limiting", description: "Per-endpoint rate limits stop a runaway loop from spamming your broker and getting your account flagged", icon: AlertCircle, category: "Infrastructure" },
  { title: "Database with Smart Caching", description: "SQLite under the hood with a caching layer - fast reads, no external database to set up or babysit", icon: Database, category: "Infrastructure" },
  { title: "Discord Community", description: "Active Discord community with dedicated channels for developers, traders, and broker-specific help", icon: MessageCircle, category: "Community" },
  { title: "OpenAlgo GPT", description: "A dedicated GPT trained on OpenAlgo docs - ask it setup, integration, or strategy questions in plain English", icon: Bot, category: "Community" },
  { title: "Virtual Meetups", description: "Regular online sessions covering roadmap, new features, and live Q&A with the core team", icon: Users, category: "Community" },
  { title: "Open Development", description: "Every line of code, every PR, every issue is public on GitHub - transparent roadmap, community-driven", icon: Github, category: "Community" }
]

const categories = [
  { name: "Options Analytics", color: "text-primary bg-primary/10" },
  { name: "AI & Skills", color: "text-tertiary bg-tertiary/10" },
  { name: "Order Management", color: "text-primary bg-primary/10" },
  { name: "Strategy Execution", color: "text-secondary bg-secondary/10" },
  { name: "Real-Time Data", color: "text-tertiary bg-tertiary/10" },
  { name: "API Infrastructure", color: "text-secondary bg-secondary/10" },
  { name: "Testing & Debug", color: "text-primary bg-primary/10" },
  { name: "Integration", color: "text-secondary bg-secondary/10" },
  { name: "Analytics", color: "text-tertiary bg-tertiary/10" },
  { name: "Developer Tools", color: "text-secondary bg-secondary/10" },
  { name: "Infrastructure", color: "text-tertiary bg-tertiary/10" },
  { name: "Data Management", color: "text-primary bg-primary/10" },
  { name: "User Management", color: "text-secondary bg-secondary/10" },
  { name: "Community", color: "text-tertiary bg-tertiary/10" },
  { name: "Security", color: "text-primary bg-primary/10" }
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <div className="container max-w-7xl py-16">
        <div className="space-y-10">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-display-md text-on-surface">
              Platform Features
            </h1>
            <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
              OpenAlgo is a complete self-hosted stack for algo trading and options analytics -
              a 12-tool options suite, a unified execution engine, and integrations across 30+ brokers,
              built for individual traders who want full control of their infrastructure.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <span
                key={category.name}
                className={`px-3 py-1.5 rounded-full font-label text-label-md ${category.color}`}
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const category = categories.find(c => c.name === feature.category)
              return (
                <div
                  key={index}
                  className="relative group obsidian-card rounded-xl p-6 hover-lift ghost-border"
                >
                  <div className={`inline-flex p-2.5 rounded-lg ${category?.color} mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-on-surface">{feature.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{feature.description}</p>
                  <div className="absolute top-5 right-5">
                    <span className={`font-label text-label-sm px-2.5 py-1 rounded-full ${category?.color}`}>
                      {feature.category}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
