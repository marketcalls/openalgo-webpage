"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight, Github, Terminal, Sparkles, Copy, Check, BookOpen,
  Bot, LineChart, BarChart3, Search, Layers, LayoutDashboard, Radio,
  Wand2, Rocket, Gauge, Activity, Box, TrendingUp, Globe,
  CheckCircle2, MessageCircle, PieChart, Calculator
} from "lucide-react"
import { useState } from "react"

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-lg surface-high hover:surface-highest transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-tertiary" /> : <Copy className="h-3.5 w-3.5 text-on-surface-variant" />}
    </button>
  )
}

function CodeBlock({ children, copyText }) {
  return (
    <div className="relative rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{ background: 'hsl(0 0% 5%)' }}>
      {copyText && <CopyButton text={copyText} />}
      <pre className="text-on-surface-variant whitespace-pre">{children}</pre>
    </div>
  )
}

const INDICATOR_COMMANDS = [
  { cmd: "/indicator-setup", icon: Rocket, title: "First-time setup", desc: "Installs everything your AI needs on your machine. Run this once and you're ready." },
  { cmd: "/indicator-chart", icon: LineChart, title: "Chart any indicator", desc: "Ask for an EMA, RSI, Supertrend or any other indicator on any stock or index. You get a clean dark-themed chart with buy/sell markers." },
  { cmd: "/custom-indicator", icon: Wand2, title: "Build your own indicator", desc: "Describe a new indicator in plain English. Your AI writes the code, draws a chart, and checks its speed." },
  { cmd: "/indicator-dashboard", icon: LayoutDashboard, title: "Make a live dashboard", desc: "A proper web dashboard with your favourite indicators, refreshing live from the market." },
  { cmd: "/indicator-scanner", icon: Search, title: "Scan the market", desc: "Find stocks from NIFTY 50 or BANKNIFTY that match your conditions — RSI oversold, EMA crossover, volume spike, and more." },
  { cmd: "/live-feed", icon: Radio, title: "Watch live prices", desc: "Stream live prices into your screen with indicators computed on the fly — no browser refresh needed." },
]

const BACKTEST_COMMANDS = [
  { cmd: "/setup", icon: Rocket, title: "First-time setup", desc: "Prepares everything needed to run backtests on your machine. Run once." },
  { cmd: "/backtest", icon: BarChart3, title: "Backtest a strategy", desc: "Run any strategy on past data with realistic brokerage and taxes. Get a full report in plain English, plus a pro-grade PDF-style tearsheet." },
  { cmd: "/optimize", icon: Gauge, title: "Find the best settings", desc: "Test many combinations of a strategy's settings and highlight the best ones on a visual heatmap." },
  { cmd: "/quick-stats", icon: Activity, title: "Quick sanity check", desc: "A fast read of a strategy's return, drawdown, and how it compares to the index — no files created." },
  { cmd: "/strategy-compare", icon: Layers, title: "Compare strategies", desc: "Run two or more strategies on the same stock and put their equity curves side by side." },
]

const INDICATOR_CATEGORIES = [
  { name: "Trend", count: 20, example: "EMA, Supertrend, Ichimoku, HMA" },
  { name: "Momentum", count: 9, example: "RSI, MACD, Stochastic, CCI" },
  { name: "Volatility", count: 16, example: "ATR, Bollinger, Keltner, Donchian" },
  { name: "Volume", count: 14, example: "OBV, VWAP, MFI, CMF" },
  { name: "Oscillators", count: 20, example: "CMO, TRIX, Aroon, Vortex" },
  { name: "Statistical", count: 9, example: "Linear Regression, Beta, Variance" },
  { name: "Hybrid", count: 6, example: "ADX, DMI, Parabolic SAR" },
  { name: "Helpers", count: 11, example: "Crossover, Highest, Lowest, Rising" },
]

const STRATEGY_TEMPLATES = [
  { name: "EMA Crossover", type: "Trend" },
  { name: "RSI", type: "Mean-Reversion" },
  { name: "Donchian Breakout", type: "Breakout" },
  { name: "Supertrend", type: "Intraday Trend" },
  { name: "MACD", type: "Trend + Breakout" },
  { name: "SDA2", type: "Moving Average + Bands" },
  { name: "Double Momentum", type: "Momentum" },
  { name: "Dual Momentum", type: "ETF Rotation" },
  { name: "Buy & Hold", type: "Passive" },
  { name: "RSI Accumulation", type: "Weekly Accumulation" },
  { name: "Walk-Forward", type: "Out-of-Sample Test" },
  { name: "Cost Comparison", type: "Fee Analysis" },
]

const AGENTS = [
  "Claude Code", "Cursor", "Codex", "OpenCode", "Cline", "Windsurf",
  "GitHub Copilot", "Gemini CLI", "Roo Code", "+ 30 more",
]

export default function SkillsPage() {
  const [tab, setTab] = useState("indicators")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 obsidian-grid opacity-30 -z-10" />
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-tertiary bg-tertiary/10">Open Source</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-secondary bg-secondary/10">Works With 40+ AI Tools</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-primary bg-primary/10">One-Line Install</span>
          </div>

          <h1 className="text-display-lg sm:text-[4rem] leading-[1.05] mb-6 tracking-tight">
            <span className="block text-on-surface">Teach Your AI</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary animate-gradient">
              To Trade &amp; Build
            </span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-3 leading-relaxed">
            OpenAlgo Skills add ready-made trading knowledge to your AI assistant &mdash; charts,
            scanners, custom indicators, and full backtests with realistic brokerage costs.
          </p>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto mb-10">
            No coding experience needed. Just tell your AI what you want in plain English and it does the work.
          </p>

          <div className="max-w-xl mx-auto mb-8">
            <CodeBlock copyText="npx skills add marketcalls/openalgo-indicator-skills">
              <span className="text-on-surface-variant/50">$</span> npx skills add marketcalls/openalgo-indicator-skills
            </CodeBlock>
            <p className="text-xs text-on-surface-variant mt-2">
              Paste this once in your terminal. Your AI tool picks it up automatically.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#collections" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> See What You Can Do <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://docs.openalgo.in/skills/indicators" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Full Docs
              </a>
            </Button>
          </div>
        </div>

        {/* What are Skills */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">What Is a Skill?</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Think of a skill like a plug-in for your AI. Install it once and your AI picks up new abilities &mdash;
            like charting an indicator, scanning stocks, or running a full backtest, all in one instruction.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, title: "Ready on Day One", desc: "No long prompts, no copy-pasting code from tutorials. Just ask, and your AI already knows how." },
              { icon: CheckCircle2, title: "Tested Recipes", desc: "Every skill ships with reliable, ready-to-use building blocks &mdash; the same ones experienced traders use." },
              { icon: Terminal, title: "Simple Commands", desc: "Quick shortcuts like /backtest or /indicator-chart kick off each task. Your AI handles the rest." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="obsidian-card rounded-xl p-6 hover-lift ghost-border">
                <div className="inline-flex p-2.5 rounded-lg surface-container mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-on-surface mb-2">{title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Agents */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Works With Your AI Tool</h2>
          <p className="text-center text-on-surface-variant mb-8 max-w-2xl mx-auto">
            Whichever AI coding app you use, Skills drop right in. The one-line install figures out the right place to put them.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {AGENTS.map(agent => (
              <span key={agent} className="px-4 py-1.5 surface-low rounded-full font-label text-label-md text-on-surface-variant hover:surface-container hover:text-primary transition-all">
                {agent}
              </span>
            ))}
          </div>
        </div>

        {/* Two Collections */}
        <div id="collections" className="mb-16 scroll-mt-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Two Skill Packs</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Pick the one you need, or install both. Both are free and open source.
          </p>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex surface-low rounded-lg p-1 ghost-border">
              <button
                onClick={() => setTab("indicators")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md font-label text-label-md transition-all ${
                  tab === "indicators" ? "surface-container text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <LineChart className="h-4 w-4" />
                Indicators &amp; Charts
              </button>
              <button
                onClick={() => setTab("backtesting")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md font-label text-label-md transition-all ${
                  tab === "backtesting" ? "surface-container text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Backtesting
              </button>
            </div>
          </div>

          {tab === "indicators" && (
            <div className="space-y-8">
              <div className="obsidian-card rounded-2xl p-6 md:p-8 ghost-border">
                <div className="flex items-start gap-4 mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 flex-shrink-0">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-headline-sm text-on-surface mb-1">Indicator &amp; Charting Skills</h3>
                    <p className="text-sm text-on-surface-variant mb-3">
                      Chart any indicator on any symbol, build custom indicators, scan for setups, and stream live
                      prices &mdash; all driven by plain-English requests to your AI.
                    </p>
                    <CodeBlock copyText="npx skills add marketcalls/openalgo-indicator-skills">
                      <span className="text-on-surface-variant/50">$</span> npx skills add marketcalls/openalgo-indicator-skills
                    </CodeBlock>
                  </div>
                </div>
              </div>

              {/* Commands */}
              <div>
                <h4 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  What You Can Ask
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {INDICATOR_COMMANDS.map(({ cmd, icon: Icon, title, desc }) => (
                    <div key={cmd} className="obsidian-card rounded-xl p-5 ghost-border hover-lift">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{title}</p>
                          <code className="text-xs font-mono text-primary">{cmd}</code>
                        </div>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 100+ Indicators */}
              <div>
                <h4 className="text-lg font-semibold text-on-surface mb-1 flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  100+ Indicators Built-In
                </h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  Every popular indicator is already included &mdash; from the classics to advanced ones professionals use.
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {INDICATOR_CATEGORIES.map(({ name, count, example }) => (
                    <div key={name} className="obsidian-card rounded-xl p-4 ghost-border">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="font-semibold text-sm text-on-surface">{name}</span>
                        <span className="font-bold text-primary text-base">{count}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{example}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div>
                <h4 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Try These In Your AI
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { cmd: "/indicator-chart supertrend NIFTY NSE_INDEX 15m", plain: "Chart Supertrend on 15-min NIFTY" },
                    { cmd: "/indicator-chart rsi RELIANCE NSE D", plain: "Plot daily RSI on RELIANCE" },
                    { cmd: "/custom-indicator zscore", plain: "Build a Z-Score indicator from scratch" },
                    { cmd: "/indicator-dashboard multi-timeframe SBIN", plain: "Multi-timeframe dashboard for SBIN" },
                    { cmd: "/indicator-scanner rsi-oversold", plain: "Scan NIFTY 50 for oversold stocks" },
                    { cmd: "/live-feed NIFTY NSE_INDEX", plain: "Stream live NIFTY prices with indicators" },
                  ].map(({ cmd, plain }) => (
                    <div key={cmd} className="surface-low rounded-lg px-4 py-3 ghost-border">
                      <code className="text-xs font-mono text-primary break-all block">{cmd}</code>
                      <p className="text-xs text-on-surface-variant mt-1">{plain}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "backtesting" && (
            <div className="space-y-8">
              <div className="obsidian-card rounded-2xl p-6 md:p-8 ghost-border">
                <div className="flex items-start gap-4 mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-headline-sm text-on-surface mb-1">Backtesting Skills</h3>
                    <p className="text-sm text-on-surface-variant mb-3">
                      Test trading ideas on real past data. Fees, taxes, and slippage are already baked in for
                      Indian, US, and crypto markets &mdash; so the results reflect what you&apos;d actually see in your account.
                    </p>
                    <CodeBlock copyText="npx skills add marketcalls/vectorbt-backtesting-skills">
                      <span className="text-on-surface-variant/50">$</span> npx skills add marketcalls/vectorbt-backtesting-skills
                    </CodeBlock>
                  </div>
                </div>
              </div>

              {/* Commands */}
              <div>
                <h4 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  What You Can Ask
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {BACKTEST_COMMANDS.map(({ cmd, icon: Icon, title, desc }) => (
                    <div key={cmd} className="obsidian-card rounded-xl p-5 ghost-border hover-lift">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{title}</p>
                          <code className="text-xs font-mono text-primary">{cmd}</code>
                        </div>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategy templates */}
              <div>
                <h4 className="text-lg font-semibold text-on-surface mb-1 flex items-center gap-2">
                  <Box className="h-5 w-5 text-primary" />
                  12 Ready-Made Strategies
                </h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  Start with a working strategy and tweak it to match your style &mdash; faster than building from scratch.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {STRATEGY_TEMPLATES.map(({ name, type }) => (
                    <div key={name} className="obsidian-card rounded-xl p-4 ghost-border">
                      <div className="font-semibold text-sm text-on-surface mb-0.5">{name}</div>
                      <div className="font-label text-label-sm text-on-surface-variant">{type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market-specific costs */}
              <div>
                <h4 className="text-lg font-semibold text-on-surface mb-1 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Real-World Fees Built In
                </h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  Backtests use actual brokerage, taxes, and slippage so the numbers reflect reality. Change brokers? Update one line.
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { market: "India", ref: "Zerodha defaults", segments: "Delivery, Intraday, Futures, and Options charges included", benchmark: "NIFTY 50" },
                    { market: "US", ref: "IBKR defaults", segments: "Stock, options, and futures commissions built in", benchmark: "S&P 500" },
                    { market: "Crypto", ref: "Binance defaults", segments: "Spot and futures fees, plus funding costs", benchmark: "Bitcoin" },
                  ].map(({ market, ref, segments, benchmark }) => (
                    <div key={market} className="obsidian-card rounded-xl p-5 ghost-border">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="font-semibold text-on-surface">{market}</span>
                        <span className="font-label text-label-sm text-on-surface-variant">{ref}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{segments}</p>
                      <div className="font-label text-label-sm">
                        <span className="text-on-surface-variant">Compared against: </span>
                        <span className="text-primary">{benchmark}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div>
                <h4 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Try These In Your AI
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { cmd: "/backtest ema-crossover SBIN NSE D", plain: "Backtest EMA crossover on daily SBIN" },
                    { cmd: "/backtest supertrend NIFTY NFO 5m", plain: "Intraday Supertrend on NIFTY futures" },
                    { cmd: "/optimize rsi AAPL", plain: "Find the best RSI settings for AAPL" },
                    { cmd: "/quick-stats BTC-USD", plain: "Quick return + drawdown on Bitcoin" },
                    { cmd: "/strategy-compare RELIANCE ema-crossover rsi donchian", plain: "Compare 3 strategies on RELIANCE" },
                    { cmd: "/backtest ema-crossover BTC-USD", plain: "Test EMA crossover on Bitcoin" },
                  ].map(({ cmd, plain }) => (
                    <div key={cmd} className="surface-low rounded-lg px-4 py-3 ghost-border">
                      <code className="text-xs font-mono text-primary break-all block">{cmd}</code>
                      <p className="text-xs text-on-surface-variant mt-1">{plain}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Markets Supported */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Markets Covered</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Whether you trade Indian markets, US stocks, or crypto, the same commands work. Your AI picks the right data source based on the symbol.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, market: "India", source: "OpenAlgo (your broker)", tickers: "SBIN, RELIANCE, NIFTY, BANKNIFTY, NIFTY futures" },
              { icon: Globe, market: "US / Global", source: "Free public data", tickers: "AAPL, MSFT, SPY, S&P 500, NIFTY index" },
              { icon: Activity, market: "Crypto", source: "Free public data", tickers: "BTC, ETH, and major pairs" },
            ].map(({ icon: Icon, market, source, tickers }) => (
              <div key={market} className="obsidian-card rounded-xl p-6 ghost-border">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-on-surface">{market}</h3>
                </div>
                <p className="text-sm text-on-surface mb-1">
                  <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Data: </span>
                  {source}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Examples: {tickers}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Install Options */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Install Options</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Pick the level that suits you. Paste a line in your terminal &mdash; that&apos;s it.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Install the full pack", code: "npx skills add marketcalls/openalgo-indicator-skills" },
              { title: "Install just one skill", code: "npx skills add marketcalls/openalgo-indicator-skills -s indicator-chart" },
              { title: "Make it available everywhere", code: "npx skills add marketcalls/openalgo-indicator-skills -g" },
              { title: "See what's inside first", code: "npx skills add marketcalls/openalgo-indicator-skills -l" },
            ].map(({ title, code }) => (
              <div key={title} className="obsidian-card rounded-xl p-5 ghost-border">
                <p className="font-label text-label-lg text-on-surface-variant mb-3">{title}</p>
                <CodeBlock copyText={code}>
                  <span className="text-on-surface-variant/50">$</span> {code}
                </CodeBlock>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-on-surface-variant mt-6">
            Need detailed setup help?{" "}
            <a href="https://docs.openalgo.in/skills/indicators" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors">
              Read the full docs
            </a>.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-headline-md mb-4 text-on-surface">Let your AI do the heavy lifting.</h2>
          <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
            Install once. Ask in plain English. Get charts, scanners, and backtests in seconds &mdash; on Indian, US, or crypto markets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo-indicator-skills" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> Indicator Skills
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/marketcalls/vectorbt-backtesting-skills" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> Backtesting Skills
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/discord" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> Ask on Discord
              </a>
            </Button>
          </div>
          <p className="font-label text-label-sm text-on-surface-variant mt-6">
            Prefer trading through a chat? See{" "}
            <a href="/mcp" className="underline underline-offset-4 hover:text-primary transition-colors">OpenAlgo MCP</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
