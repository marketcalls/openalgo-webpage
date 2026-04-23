"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowDownToLine,
  Github,
  Shield,
  Users,
  Server,
  Lock,
  Code2,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GitBranch,
  ExternalLink,
  Package,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Star,
  Layers,
  LineChart,
  Activity,
  Target,
  BarChart3,
  Gauge,
  Box,
  Sigma,
  Zap,
  Wallet,
  PieChart,
  Wand2,
  Bot
} from "lucide-react"

export default function Home() {
  const highlights = [
    {
      icon: LineChart,
      title: "Options & Strategy Analytics",
      description: "12 built-in tools: strategy builder, option chain, Greeks, OI, max pain, vol surface, GEX.",
    },
    {
      icon: Server,
      title: "Self-Hostable Infrastructure",
      description: "Deploy on your server, your cloud, your way. No vendor lock-in.",
    },
    {
      icon: Lock,
      title: "Complete Privacy & Control",
      description: "Your code, your strategies, your data. Nothing leaves your infrastructure.",
    },
    {
      icon: Code2,
      title: "Multi-Platform Support",
      description: "Integrate with 30+ brokers. Use from Python, TradingView, Excel, and more.",
    }
  ]

  const trustIndicators = [
    "100% Open Source",
    "AGPL-3.0 Licensed",
    "No Data Collection",
    "Self-Hosted",
    "Community Driven",
    "Transparent Development"
  ]

  const coreProject = {
    title: "OpenAlgo Core",
    description: "Central API service, authentication, routing, and platform logic",
    iconValue: "🧠",
    url: "https://github.com/marketcalls/openalgo"
  }

  const sdks = [
    { title: "Python SDK", description: "Official Python SDK for OpenAlgo API", iconValue: "🔶", url: "https://github.com/marketcalls/openalgo-python-library", docs: "https://docs.openalgo.in/trading-platform/python" },
    { title: "Node.js SDK", description: "JavaScript/TypeScript SDK", iconValue: "🟢", url: "https://github.com/marketcalls/openalgo-node", docs: "https://docs.openalgo.in/trading-platform/nodejs" },
    { title: "Java SDK", description: "Official Java SDK for OpenAlgo", iconValue: "☕", url: "https://github.com/marketcalls/openalgo-java", docs: "https://docs.openalgo.in/trading-platform/java" },
    { title: ".NET SDK", description: "C# / .NET SDK for OpenAlgo", iconValue: "🔷", url: "https://github.com/marketcalls/openalgo.NET", docs: "https://docs.openalgo.in/trading-platform/.net" },
    { title: "Go SDK", description: "Golang SDK for OpenAlgo", iconValue: "🔵", url: "https://github.com/marketcalls/openalgo-go", docs: "https://docs.openalgo.in/trading-platform/go" },
    { title: "Rust SDK", description: "Official Rust SDK for OpenAlgo", iconValue: "🦀", url: "https://github.com/marketcalls/openalgo-rust" }
  ]

  const integrations = [
    { title: "Excel Add-in", description: "Trade from Excel spreadsheets", icon: "component", iconComponent: FileSpreadsheet, url: "https://github.com/marketcalls/OpenAlgo-Excel", docs: "https://docs.openalgo.in/trading-platform/excel" },
    { title: "Amibroker Plugin", description: "OpenAlgo Plugin for Amibroker", iconValue: "🔌", url: "https://github.com/marketcalls/OpenAlgoPlugin", docs: "https://docs.openalgo.in/trading-platform/amibroker/amibroker-plugin" },
    { title: "Backtrader", description: "Python Library for backtesting", icon: "component", iconComponent: TrendingUp, url: "https://github.com/p2c2e/openalgo-backtrader" },
    { title: "PineTS", description: "TradingView indicators integration", iconValue: "⚡", url: "https://github.com/marketcalls/openalgo-pinets" },
    { title: "AlgoMirror", description: "Multi Account OpenAlgo Orchestrator", iconValue: "🔄", url: "https://github.com/marketcalls/algomirror" },
    { title: "MCP / AI Agents", description: "Model Context Protocol integration", iconValue: "🤖", url: "/mcp", docs: "https://docs.openalgo.in/mcp" },
    { title: "Indicator Skills", description: "AI agent skills for 100+ indicators, charts & scanners", iconValue: "📊", url: "/skills", docs: "https://docs.openalgo.in/skills/indicators" },
    { title: "Backtesting Skills", description: "VectorBT backtesting skills for Claude Code, Cursor, Codex", iconValue: "🧪", url: "/skills", docs: "https://docs.openalgo.in/skills/backtesting" },
    { title: "OpenAlgo Mobile", description: "Flutter Mobile Trading App", iconValue: "📱", url: "https://github.com/marketcalls/openalgo-mobile" },
    { title: "Web Portal", description: "NextJS + ShadcnUI web interface", iconValue: "🌐", url: "https://github.com/marketcalls/openalgo-webpage" },
    { title: "Chrome Plugin", description: "Browser extension for OpenAlgo", iconValue: "🧩", url: "https://github.com/marketcalls/openalgo-chrome" },
    { title: "Fast Scalper", description: "High-performance app (Rust + Tauri)", iconValue: "🚄", url: "https://github.com/marketcalls/fastscalper-tauri" },
    { title: "OpenAlgo Flow", description: "N8N for Traders/Investors", iconValue: "🔀", url: "https://github.com/marketcalls/openalgo-flow" },
    { title: "Historify", description: "Fullstack Stock Market Data Management Platform", iconValue: "📚", url: "https://github.com/marketcalls/historify" },
    { title: "OpenQuest", description: "Realtime Stock Data Aggregator with TradingView Charts", iconValue: "📈", url: "https://github.com/marketcalls/openquest" },
    { title: "OpenAlgo Chart", description: "TradingView Lightweight Charts", iconValue: "🕯️", url: "https://github.com/crypt0inf0/openalgo-chart" },
    { title: "OpenAlgo Docs", description: "Official Documentation", iconValue: "📖", url: "https://github.com/marketcalls/openalgo-docs" }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 obsidian-grid" />
        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* V2 Release Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 rounded-full surface-low ghost-border">
            <div className="w-2 h-2 rounded-full bg-tertiary pulse-live" />
            <span className="font-label text-label-md uppercase tracking-wider">
              <span className="text-primary">New in V2</span>
              <span className="text-on-surface-variant"> &mdash; 12-Tool Options Analytics Suite</span>
            </span>
            <ArrowRight className="w-3 h-3 text-primary" />
          </div>

          {/* Main Headline */}
          <h1 className="text-display-lg sm:text-[4.5rem] leading-[1.05] mb-6 tracking-tight">
            <span className="block text-on-surface">Algo Trading.</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary animate-gradient">
              Options Analytics &amp; Execution.
            </span>
            <span className="block text-on-surface">All In One Place.</span>
          </h1>

          {/* Tagline */}
          <p className="text-headline-sm font-semibold text-primary mb-6">
            Self-Hosted. Broker-Agnostic. Community-Driven.
          </p>

          {/* Description */}
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
            OpenAlgo is no longer just an algo platform. Build strategies, analyse the options chain,
            run Greeks &amp; IV studies, and execute baskets &mdash; all from one self-hosted app,
            across 30+ brokers.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-12">
            {[
              { icon: Download, value: "1,40,000+", label: "Downloads", color: "text-secondary" },
              { icon: Code2, value: "100%", label: "Open Source", color: "text-tertiary" },
              { icon: Star, value: "1,700+", label: "GitHub Stars", color: "text-primary" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-xl font-bold text-on-surface">{value}</span>
                <span className="font-label text-label-md text-on-surface-variant uppercase">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg">
              <a href="/getting-started" className="flex items-center">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo" className="flex items-center" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
            </Button>
          </div>

          {/* Platform Integrations */}
          <div>
            <p className="font-label text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">Integrates With</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {[
                "Amibroker", "TradingView", "GoCharting", "Python", "MetaTrader",
                "N8N", "Java", "Go", ".NET", "Node.js", "Rust",
                "ChartInk", "Excel", "Google Sheets", "OpenClaw", "Telegram"
              ].map((platform) => (
                <span
                  key={platform}
                  className="px-3 py-1.5 font-label text-label-md surface-low rounded-full hover:surface-container hover:text-primary transition-all text-on-surface-variant"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Highlights Section */}
      <div className="py-24 surface-low">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-display-sm mb-4 text-on-surface">
              Why Traders Choose OpenAlgo
            </h2>
            <p className="text-lg text-on-surface-variant max-w-3xl mx-auto">
              The only trading platform where you own everything - from code to infrastructure
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {highlights.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 surface-container group-hover:glow-primary transition-all">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-on-surface">{item.title}</h3>
                <p className="text-on-surface-variant">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="rounded-xl surface-container p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tertiary" />
                  <span className="font-label text-label-lg text-on-surface">{indicator}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Options & Strategy Analytics Suite */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-primary/10">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="font-label text-label-md uppercase tracking-wider text-primary">Built-In Suite</span>
              </div>
              <h2 className="text-display-sm mb-4 text-on-surface">
                Options &amp; Strategy Analytics Suite
              </h2>
              <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
                Twelve professional-grade analytical tools &mdash; strategy builder, option chain, Greeks, OI,
                max pain, vol surface, GEX &mdash; all streaming live from your broker&apos;s WebSocket feed.
                <span className="block mt-2 font-medium text-on-surface">No third-party data vendors. No extra subscriptions.</span>
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10">
              {[
                { icon: Wand2, title: "Strategy Builder", desc: "Multi-leg construction with live Greeks, payoff diagram, and one-click basket execution." },
                { icon: Box, title: "Strategy Portfolio", desc: "MyTrades and Simulation watchlists for your saved strategies." },
                { icon: Layers, title: "Option Chain", desc: "Live Greeks per strike with inline click-to-trade." },
                { icon: Gauge, title: "Option Greeks", desc: "Historical IV, Delta, Theta, Vega, Gamma for ATM options." },
                { icon: Activity, title: "OI Tracker", desc: "CE/PE OI bars, PCR overlay, ATM strike marker." },
                { icon: Target, title: "Max Pain", desc: "Live max pain strike with pain distribution chart." },
                { icon: LineChart, title: "Straddle Chart", desc: "Dynamic ATM straddle with synthetic futures overlay." },
                { icon: BarChart3, title: "Straddle PnL", desc: "Intraday straddle simulation with auto N-point adjustments." },
                { icon: Box, title: "Vol Surface", desc: "3D implied volatility surface across strikes &amp; expiries." },
                { icon: Sigma, title: "GEX Dashboard", desc: "OI walls, net GEX per strike, top gamma strikes." },
                { icon: PieChart, title: "IV Smile", desc: "Call and Put IV curves with skew analysis." },
                { icon: Wallet, title: "OI Profile", desc: "Futures candles with OI butterfly overlay." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="obsidian-card rounded-xl p-5 ghost-border hover-lift">
                  <div className="inline-flex p-2 rounded-lg surface-container mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm text-on-surface mb-1.5">{title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl surface-low p-6 md:p-8 ghost-border">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-on-surface mb-1 text-sm">Live, Not Delayed</p>
                  <p className="text-xs text-on-surface-variant">Streams from your broker&apos;s unified WebSocket feed.</p>
                </div>
                <div>
                  <GitBranch className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-on-surface mb-1 text-sm">Broker Agnostic</p>
                  <p className="text-xs text-on-surface-variant">Same tools work across every supported broker.</p>
                </div>
                <div>
                  <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-on-surface mb-1 text-sm">Analyse &amp; Execute</p>
                  <p className="text-xs text-on-surface-variant">Build a strategy, fire it as a basket &mdash; in the same screen.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Button asChild size="lg">
                <a href="/features" className="flex items-center">
                  Explore All Features
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Native Trading */}
      <div className="py-24 surface-low">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-tertiary/10">
                <Sparkles className="w-3.5 h-3.5 text-tertiary" />
                <span className="font-label text-label-md uppercase tracking-wider text-tertiary">Made For AI</span>
              </div>
              <h2 className="text-display-sm mb-4 text-on-surface">
                Trade &amp; Research With Your AI
              </h2>
              <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
                Two simple ways to bring AI into your trading &mdash; talk to your account like a trading desk,
                or give your AI a toolkit to chart, scan, and backtest for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* MCP */}
              <a href="/mcp" className="obsidian-card rounded-2xl p-8 ghost-border hover-lift group block">
                <div className="flex items-start gap-4 mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 flex-shrink-0">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-headline-sm text-on-surface">OpenAlgo MCP</h3>
                      <ArrowRight className="h-4 w-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Trade by chatting</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  Connect your OpenAlgo account to Claude, Cursor, Windsurf, or ChatGPT. Place orders,
                  check positions, and pull live prices by simply asking &mdash; no dashboards, no clicks.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["25+ built-in actions", "Claude / Cursor / Windsurf / ChatGPT", "Runs on your computer"].map(tag => (
                    <span key={tag} className="px-3 py-1 surface-container rounded-full font-label text-label-sm text-on-surface-variant">{tag}</span>
                  ))}
                </div>
              </a>

              {/* Skills */}
              <a href="/skills" className="obsidian-card rounded-2xl p-8 ghost-border hover-lift group block">
                <div className="flex items-start gap-4 mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-tertiary/10 flex-shrink-0">
                    <Wand2 className="h-6 w-6 text-tertiary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-headline-sm text-on-surface">OpenAlgo Skills</h3>
                      <ArrowRight className="h-4 w-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Chart, scan &amp; backtest</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  Ready-made trading abilities you can drop into your AI assistant &mdash; charts, scanners,
                  custom indicators, and backtests with real brokerage costs. Works with 40+ AI apps.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["100+ indicators", "12 ready-made strategies", "India / US / Crypto"].map(tag => (
                    <span key={tag} className="px-3 py-1 surface-container rounded-full font-label text-label-sm text-on-surface-variant">{tag}</span>
                  ))}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mini FOSS Universe */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-display-sm mb-3 text-center text-on-surface">Mini FOSS Universe</h2>
            <p className="text-center text-on-surface-variant mb-6 max-w-3xl mx-auto">
              A curated collection of open-source projects, SDKs, libraries, and integrations that extend the OpenAlgo ecosystem across languages, platforms, and workflows.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {["Modular", "Extensible", "Language-agnostic", "Production-ready"].map(tag => (
                <span key={tag} className="px-4 py-1.5 surface-low rounded-full font-label text-label-md text-on-surface-variant">{tag}</span>
              ))}
            </div>

            {/* Core Project */}
            <div className="mb-10">
              <h3 className="text-headline-sm mb-5 flex items-center justify-center gap-2">
                <span className="text-xl">🧠</span>
                <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">Core Project</span>
              </h3>
              <div className="flex justify-center">
                <a
                  href={coreProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="obsidian-card p-6 rounded-xl hover-lift group block max-w-md ghost-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-on-surface">{coreProject.title}</h4>
                    <ExternalLink className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-on-surface-variant">{coreProject.description}</p>
                </a>
              </div>
            </div>

            {/* SDKs */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">SDKs (API v1)</span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {sdks.map((sdk, index) => (
                  <a
                    key={index}
                    href={sdk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="obsidian-card p-5 rounded-xl hover-lift group ghost-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{sdk.iconValue}</span>
                      <ExternalLink className="h-3 w-3 text-on-surface-variant group-hover:text-primary transition-colors" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1 text-on-surface">{sdk.title}</h4>
                    <p className="text-xs text-on-surface-variant">{sdk.description}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Libraries and Platform Integrations */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">Libraries & Platform Integrations</span>
              </h3>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {integrations.map((project, index) => {
                  const IconComponent = project.iconComponent
                  return (
                    <a
                      key={index}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="obsidian-card p-4 rounded-xl hover-lift group ghost-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        {project.icon === 'component' ? (
                          <div className="p-1.5 rounded-lg surface-container">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                        ) : (
                          <span className="text-2xl">{project.iconValue}</span>
                        )}
                        <ExternalLink className="h-3 w-3 text-on-surface-variant group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-semibold text-sm mb-1 text-on-surface">{project.title}</h4>
                      <p className="text-xs text-on-surface-variant">{project.description}</p>
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-on-surface-variant mb-5">
                Open standards, transparent design, and tools that adapt to how traders actually work.
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/marketcalls" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Explore All Projects on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-24 surface-low">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-16 md:grid-cols-7">
              <div className="md:col-span-4">
                <h3 className="text-headline-md mb-5 text-on-surface">
                  <Globe className="inline w-6 h-6 mr-2 text-primary" />
                  Truly Independent
                </h3>
                <p className="text-on-surface-variant mb-6 leading-relaxed">
                  No vendor lock-in. No hidden dependencies. Switch brokers anytime.
                  Your strategies work everywhere. One API, multiple brokers.
                </p>
                <ul className="space-y-3 text-sm">
                  {["Unified API across 30+ brokers", "Strategy portability guaranteed", "No proprietary formats or protocols"].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-on-surface">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-3">
                <h3 className="text-headline-md mb-5 text-on-surface">
                  <Users className="inline w-6 h-6 mr-2 text-primary" />
                  Community First
                </h3>
                <p className="text-on-surface-variant mb-6 leading-relaxed">
                  Built in public. Developed with traders. Every feature request matters.
                  Join thousands of traders shaping the future of algorithmic trading.
                </p>
                <ul className="space-y-3 text-sm">
                  {["Active Discord community", "Regular virtual meetups", "Open development on GitHub"].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-on-surface">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-display-sm mb-10 text-on-surface">
              Our Philosophy
            </h2>
            <div className="rounded-2xl surface-low p-10 md:p-14 ghost-border">
              <p className="text-xl mb-6 leading-relaxed text-on-surface">
                <span className="font-semibold text-primary">Your trading system should be yours.</span> Not hosted on someone
                else's server. Not dependent on a vendor's uptime. Not subject to arbitrary limits or fees.
              </p>
              <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
                OpenAlgo gives you the complete infrastructure to run professional-grade algorithmic
                trading - on your terms, with your rules, under your control.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { value: "Zero", label: "Data Collection" },
                  { value: "100%", label: "Open Source" },
                  { value: "Forever", label: "Free & Open" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-display-sm text-primary mb-2">{value}</div>
                    <div className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 surface-low">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-display-sm mb-4 text-on-surface">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-on-surface-variant mb-10">
              Join thousands of traders who've chosen freedom over convenience
            </p>
            <div className="rounded-2xl p-10 mb-10 ghost-border surface-container relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-tertiary/5" />
              <div className="relative z-10">
                <p className="text-xl font-semibold mb-4 text-on-surface">
                  Your strategies remain yours. Your services remain proprietary.
                  The infrastructure stays open.
                </p>
                <p className="text-on-surface-variant">
                  If your business requires proprietary licensing or special terms,
                  reach out through our Discord or GitHub.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="/getting-started">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a href="/discord">
                  Join Community
                  <Users className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Source
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
