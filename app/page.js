"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  Github,
  Code2,
  Globe,
  ArrowRight,
  GitBranch,
  ExternalLink,
  Package,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Star,
  Layers,
  LineChart,
  LayoutGrid,
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
  Bot,
  Brain,
  Hexagon,
  Coffee,
  Hash,
  Wind,
  Cog,
  Plug,
  History,
  FlaskConical,
  Smartphone,
  Puzzle,
  Calculator,
  MessageCircle,
  Users,
} from "lucide-react"

function ProjectIcon({ icon: Icon, size = "h-5 w-5" }) {
  return (
    <div className="inline-flex rounded-xl border bg-surface-low p-2">
      <Icon className={`${size} text-on-surface`} />
    </div>
  )
}

function Kicker({ children }) {
  return (
    <p className="font-label text-label-md uppercase text-on-surface-variant">
      {children}
    </p>
  )
}

export default function Home() {
  const { t } = useI18n()

  const highlights = [
    { title: t('why.h1t'), description: t('why.h1d') },
    { title: t('why.h2t'), description: t('why.h2d') },
    { title: t('why.h3t'), description: t('why.h3d') },
    { title: t('why.h4t'), description: t('why.h4d') },
  ]

  const trustIndicators = [
    t('trust.t1'), t('trust.t2'), t('trust.t3'),
    t('trust.t4'), t('trust.t5'), t('trust.t6'),
  ]

  const suiteTools = [
    { icon: Wand2, title: "Strategy Builder", desc: "Multi-leg construction with real-time Greeks, payoff diagram, and one-click basket execution." },
    { icon: Box, title: "Strategy Portfolio", desc: "MyTrades and Simulation watchlists for your saved strategies." },
    { icon: Layers, title: "Option Chain", desc: "Streaming Greeks per strike with inline click-to-trade." },
    { icon: Gauge, title: "Option Greeks", desc: "Historical IV, Delta, Theta, Vega, Gamma for ATM options." },
    { icon: Activity, title: "OI Tracker", desc: "CE/PE OI bars, PCR overlay, ATM strike marker." },
    { icon: Target, title: "Max Pain", desc: "Max pain strike with pain distribution chart." },
    { icon: LineChart, title: "Straddle Chart", desc: "Dynamic ATM straddle with synthetic futures overlay." },
    { icon: BarChart3, title: "Straddle PnL", desc: "Intraday straddle simulation with auto N-point adjustments." },
    { icon: Box, title: "Vol Surface", desc: "3D implied volatility surface across strikes and expiries." },
    { icon: Sigma, title: "GEX Dashboard", desc: "OI walls, net GEX per strike, top gamma strikes." },
    { icon: PieChart, title: "IV Smile", desc: "Call and Put IV curves with skew analysis." },
    { icon: Wallet, title: "OI Profile", desc: "Futures candles with OI butterfly overlay." },
  ]

  const coreProject = {
    title: "OpenAlgo Core",
    description: "Central API service, authentication, routing, and platform logic",
    icon: Brain,
    url: "https://github.com/marketcalls/openalgo"
  }

  const sdks = [
    { title: "Python SDK", description: "Official Python SDK for OpenAlgo API", icon: Code2, url: "https://github.com/marketcalls/openalgo-python-library" },
    { title: "Node.js SDK", description: "JavaScript/TypeScript SDK", icon: Hexagon, url: "https://github.com/marketcalls/openalgo-node" },
    { title: "Java SDK", description: "Official Java SDK for OpenAlgo", icon: Coffee, url: "https://github.com/marketcalls/openalgo-java" },
    { title: ".NET SDK", description: "C# / .NET SDK for OpenAlgo", icon: Hash, url: "https://github.com/marketcalls/openalgo.NET" },
    { title: "Go SDK", description: "Golang SDK for OpenAlgo", icon: Wind, url: "https://github.com/marketcalls/openalgo-go" },
    { title: "Rust SDK", description: "Official Rust SDK for OpenAlgo", icon: Cog, url: "https://github.com/marketcalls/openalgo-rust" }
  ]

  const integrations = [
    { title: "Excel Add-in", description: "Trade from Excel spreadsheets", icon: FileSpreadsheet, url: "https://github.com/marketcalls/OpenAlgo-Excel" },
    { title: "Amibroker Plugin", description: "OpenAlgo Plugin for Amibroker", icon: Plug, url: "https://github.com/marketcalls/OpenAlgoPlugin" },
    { title: "Backtrader", description: "Python Library for backtesting", icon: History, url: "https://github.com/p2c2e/openalgo-backtrader" },
    { title: "PineTS", description: "TradingView indicators integration", icon: Zap, url: "https://github.com/marketcalls/openalgo-pinets" },
    { title: "AlgoMirror", description: "Multi Account OpenAlgo Orchestrator", icon: Layers, url: "https://github.com/marketcalls/algomirror" },
    { title: "MCP / AI Agents", description: "Model Context Protocol integration", icon: Bot, url: "/mcp" },
    { title: "Indicator Skills", description: "AI agent skills for 100+ indicators, charts & scanners", icon: BarChart3, url: "/skills" },
    { title: "Backtesting Skills", description: "VectorBT backtesting skills for Claude Code, Cursor, Codex", icon: FlaskConical, url: "/skills" },
    { title: "OpenAlgo Mobile", description: "Flutter Mobile Trading App", icon: Smartphone, url: "https://github.com/marketcalls/openalgo-mobile" },
    { title: "Web Portal", description: "NextJS + ShadcnUI web interface", icon: Globe, url: "https://github.com/marketcalls/openalgo-webpage" },
    { title: "Chrome Plugin", description: "Browser extension for OpenAlgo", icon: Puzzle, url: "https://github.com/marketcalls/openalgo-chrome" },
    { title: "Fast Scalper", description: "High-performance app (Rust + Tauri)", icon: Gauge, url: "https://github.com/marketcalls/fastscalper-tauri" },
    { title: "OpenAlgo Charts", description: "Dependency-free HTML5 canvas charting engine (<50KB Brotli)", icon: LineChart, url: "https://github.com/marketcalls/openalgo-charts" },
    { title: "OpenStatz", description: "Portfolio analytics for quants - Quant Tearsheets", icon: PieChart, url: "https://github.com/marketcalls/openstatz" },
    { title: "OpenAlgo Heatmap", description: "Finviz-style market heatmap (React Component)", icon: LayoutGrid, url: "https://github.com/marketcalls/openalgo-heatmap" },
    { title: "OpenQuest", description: "Realtime Stock Data Aggregator with TradingView Charts", icon: Activity, url: "https://github.com/marketcalls/openquest" },
    { title: "Marginism", description: "Offline SPAN margin calculator", icon: Calculator, url: "https://github.com/marketcalls/marginism" },
    { title: "Wars", description: "WhatsApp client for Python, powered by Rust. A thin PyO3 wrapper over whatsapp-rust", icon: MessageCircle, url: "https://github.com/marketcalls/wars" },
    { title: "OpenGreeks", description: "Fast options pricing & Greeks for Python", icon: Sigma, url: "https://github.com/marketcalls/opengreeks" },
    { title: "OpenBull", description: "Self Hostable Options Trading Platform", icon: TrendingUp, url: "https://github.com/marketcalls/openbull" }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <div className="absolute inset-0 obsidian-grid" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="reveal reveal-1 mb-10 inline-flex items-center gap-2.5 rounded-full border bg-surface-bright px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-on-surface pulse-live" aria-hidden="true" />
            <span className="font-label text-label-md uppercase text-on-surface-variant">
              {t('hero.badge')}
            </span>
          </div>

          <h1 className="reveal reveal-2 mb-8 text-[2.75rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-on-surface sm:text-[4rem] md:text-[4.5rem]">
            {t('hero.h1a')}
            <span className="block text-on-surface-variant/70">{t('hero.h1b')}</span>
          </h1>

          <p className="reveal reveal-3 mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            {t('hero.desc')}
          </p>

          <div className="reveal reveal-4 mb-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {[
              { icon: Download, value: "3,40,000+", label: t('hero.statDownloads') },
              { icon: Code2, value: "100%", label: t('hero.statOpenSource') },
              { icon: Star, value: "2,400+", label: t('hero.statStars') },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-on-surface-variant" aria-hidden="true" />
                <span className="text-xl font-extrabold tracking-tight text-on-surface">{value}</span>
                <span className="font-label text-label-md uppercase text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>

          <div className="reveal reveal-5 mb-20 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <a href="/getting-started" className="flex items-center">
                {t('hero.ctaGetStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo" className="flex items-center" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                {t('hero.ctaGithub')}
              </a>
            </Button>
          </div>

          <div className="reveal reveal-6">
            <p className="mb-4 font-label text-label-md uppercase text-on-surface-variant">
              {t('hero.integrates')}
            </p>
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
              {[
                "Amibroker", "TradingView", "GoCharting", "Python", "MetaTrader",
                "N8N", "Java", "Go", ".NET", "Node.js", "Rust",
                "ChartInk", "Excel", "Google Sheets", "OpenClaw", "Telegram", "WhatsApp"
              ].map((platform) => (
                <span
                  key={platform}
                  className="rounded-full border bg-surface-bright px-3 py-1.5 font-label text-label-md text-on-surface-variant transition-colors hover:border-outline-variant hover:text-on-surface"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why OpenAlgo - numbered path */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <Kicker>{t('why.kicker')}</Kicker>
            <h2 className="mt-4 text-display-md text-on-surface">
              {t('why.title')}
              <span className="block text-on-surface-variant/70">{t('why.title2')}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-on-surface-variant">
              {t('why.sub')}
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            {highlights.map((item, index) => (
              <div key={index} className="grid grid-cols-[auto_1fr] gap-x-6">
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-surface-bright font-label text-label-md text-on-surface">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {index < highlights.length - 1 && (
                    <span className="w-px flex-1 bg-border" aria-hidden="true" />
                  )}
                </div>
                <div className={index < highlights.length - 1 ? "pb-12" : ""}>
                  <h3 className="pt-2 text-xl font-bold text-on-surface">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-on-surface-variant">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y px-4 py-8">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustIndicators.map((indicator) => (
            <span key={indicator} className="font-label text-label-md uppercase text-on-surface-variant">
              {indicator}
            </span>
          ))}
        </div>
      </section>

      {/* Signature dark shell - analytics suite + AI */}
      <section className="px-3 py-6 sm:px-6">
        <div className="scheme-dark rounded-[2.5rem] px-4 py-20 sm:px-8 md:py-28">
          <div className="container mx-auto">
            <div className="mx-auto max-w-6xl">
              <div className="mb-16 text-center">
                <Kicker>{t('suite.kicker')}</Kicker>
                <h2 className="mt-4 text-display-md text-on-surface">
                  {t('suite.title')}
                  <span className="block text-on-surface-variant">{t('suite.title2')}</span>
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
                  {t('suite.sub')}
                  <span className="mt-2 block font-semibold text-on-surface">{t('suite.note')}</span>
                </p>
              </div>

              <div className="grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {suiteTools.map(({ icon: Icon, title, desc }, index) => (
                  <div key={title} className="bg-background p-7">
                    <div className="mb-5 flex items-start justify-between">
                      <span className="text-2xl font-extrabold tracking-tight text-on-surface">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <Icon className="h-5 w-5 text-on-surface-variant/60" aria-hidden="true" />
                    </div>
                    <h3 className="mb-1.5 font-bold text-on-surface">{title}</h3>
                    <p className="text-sm leading-relaxed text-on-surface-variant">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-8 border-t pt-10 md:grid-cols-3">
                {[
                  { title: t('suite.p1t'), desc: t('suite.p1d') },
                  { title: t('suite.p2t'), desc: t('suite.p2d') },
                  { title: t('suite.p3t'), desc: t('suite.p3d') },
                ].map(({ title, desc }) => (
                  <div key={title} className="text-center">
                    <p className="mb-1 font-bold text-on-surface">{title}</p>
                    <p className="text-sm text-on-surface-variant">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button asChild size="lg">
                  <a href="/features" className="flex items-center">
                    {t('suite.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* AI section inside the dark shell */}
              <div className="mt-24 border-t pt-20">
                <div className="mb-12 text-center">
                  <Kicker>{t('ai.kicker')}</Kicker>
                  <h2 className="mt-4 text-display-sm text-on-surface">
                    {t('ai.title')}
                    <span className="block text-on-surface-variant">{t('ai.title2')}</span>
                  </h2>
                  <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
                    {t('ai.sub')}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <a href="/mcp" className="group block rounded-3xl border bg-surface-low p-8 transition-colors hover:bg-surface-container">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="inline-flex shrink-0 rounded-2xl border bg-background p-3">
                        <Bot className="h-6 w-6 text-on-surface" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-headline-sm text-on-surface">{t('ai.mcpTitle')}</h3>
                          <ArrowRight className="h-4 w-4 text-on-surface-variant transition-all group-hover:translate-x-1 group-hover:text-on-surface" />
                        </div>
                        <p className="font-label text-label-sm uppercase text-on-surface-variant">{t('ai.mcpTag')}</p>
                      </div>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
                      {t('ai.mcpDesc')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["25+ built-in actions", "Claude / Cursor / Windsurf / ChatGPT", "Runs on your computer"].map(tag => (
                        <span key={tag} className="rounded-full border px-3 py-1 font-label text-label-sm text-on-surface-variant">{tag}</span>
                      ))}
                    </div>
                  </a>

                  <a href="/skills" className="group block rounded-3xl border bg-surface-low p-8 transition-colors hover:bg-surface-container">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="inline-flex shrink-0 rounded-2xl border bg-background p-3">
                        <Wand2 className="h-6 w-6 text-on-surface" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-headline-sm text-on-surface">{t('ai.skillsTitle')}</h3>
                          <ArrowRight className="h-4 w-4 text-on-surface-variant transition-all group-hover:translate-x-1 group-hover:text-on-surface" />
                        </div>
                        <p className="font-label text-label-sm uppercase text-on-surface-variant">{t('ai.skillsTag')}</p>
                      </div>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
                      {t('ai.skillsDesc')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["100+ indicators", "12 ready-made strategies", "India / US / Crypto"].map(tag => (
                        <span key={tag} className="rounded-full border px-3 py-1 font-label text-label-sm text-on-surface-variant">{tag}</span>
                      ))}
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOSS universe */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <Kicker>{t('foss.kicker')}</Kicker>
              <h2 className="mt-4 text-display-sm text-on-surface">{t('foss.title')}</h2>
              <p className="mx-auto mt-5 max-w-3xl text-on-surface-variant">
                {t('foss.sub')}
              </p>
            </div>

            <div className="mb-12">
              <h3 className="mb-5 text-center font-label text-label-md uppercase text-on-surface-variant">
                {t('foss.coreLabel')}
              </h3>
              <div className="flex justify-center">
                <a
                  href={coreProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="obsidian-card group block max-w-md rounded-3xl p-6"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <ProjectIcon icon={coreProject.icon} />
                      <h4 className="font-bold text-on-surface">{coreProject.title}</h4>
                    </div>
                    <ExternalLink className="h-4 w-4 text-on-surface-variant transition-colors group-hover:text-on-surface" />
                  </div>
                  <p className="text-sm text-on-surface-variant">{coreProject.description}</p>
                </a>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-2 font-label text-label-md uppercase text-on-surface-variant">
                <Package className="h-4 w-4" aria-hidden="true" />
                {t('foss.sdkLabel')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {sdks.map((sdk) => (
                  <a
                    key={sdk.title}
                    href={sdk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="obsidian-card group rounded-3xl p-5"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <ProjectIcon icon={sdk.icon} />
                      <ExternalLink className="h-3 w-3 text-on-surface-variant transition-colors group-hover:text-on-surface" />
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-on-surface">{sdk.title}</h4>
                    <p className="text-xs text-on-surface-variant">{sdk.description}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="mb-5 flex items-center gap-2 font-label text-label-md uppercase text-on-surface-variant">
                <GitBranch className="h-4 w-4" aria-hidden="true" />
                {t('foss.intLabel')}
              </h3>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {integrations.map((project) => (
                  <a
                    key={project.title}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="obsidian-card group rounded-3xl p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <ProjectIcon icon={project.icon} />
                      <ExternalLink className="h-3 w-3 text-on-surface-variant transition-colors group-hover:text-on-surface" />
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-on-surface">{project.title}</h4>
                    <p className="text-xs text-on-surface-variant">{project.description}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="mb-5 text-on-surface-variant">
                {t('foss.outro')}
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/marketcalls" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t('foss.cta')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="border-t px-4 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-16 md:grid-cols-2">
              {[
                {
                  num: "01",
                  title: t('values.v1t'),
                  desc: t('values.v1d'),
                  items: [t('values.v1i1'), t('values.v1i2'), t('values.v1i3')],
                },
                {
                  num: "02",
                  title: t('values.v2t'),
                  desc: t('values.v2d'),
                  items: [t('values.v2i1'), t('values.v2i2'), t('values.v2i3')],
                },
              ].map(({ num, title, desc, items }) => (
                <div key={num}>
                  <p className="font-label text-label-md text-on-surface-variant">{num}</p>
                  <h3 className="mb-4 mt-2 text-headline-md text-on-surface">{title}</h3>
                  <p className="mb-6 leading-relaxed text-on-surface-variant">{desc}</p>
                  <ul className="space-y-3 text-sm">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-on-surface" aria-hidden="true" />
                        <span className="font-medium text-on-surface">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t px-4 py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <Kicker>{t('phil.kicker')}</Kicker>
            <p className="mt-6 text-headline-lg leading-snug text-on-surface md:text-display-sm">
              {t('phil.lead')}
              <span className="text-on-surface-variant/70"> {t('phil.leadRest')}</span>
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              {t('phil.body')}
            </p>
            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:divide-x md:divide-border">
              {[
                { value: t('phil.s1v'), label: t('phil.s1l') },
                { value: t('phil.s2v'), label: t('phil.s2l') },
                { value: t('phil.s3v'), label: t('phil.s3l') },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="mb-2 text-display-sm text-on-surface">{value}</div>
                  <div className="font-label text-label-md uppercase text-on-surface-variant">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - full-bleed dark */}
      <section className="scheme-dark px-4 py-24 md:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-display-md text-on-surface">
              {t('cta.title')}
            </h2>
            <p className="mt-5 text-lg text-on-surface-variant">
              {t('cta.sub')}
            </p>
            <p className="mx-auto mt-12 max-w-2xl text-xl font-semibold leading-relaxed text-on-surface">
              {t('cta.boxTitle')}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-on-surface-variant">
              {t('cta.boxDesc')}
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <a href="/getting-started">
                  {t('hero.ctaGetStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a href="/discord">
                  {t('cta.join')}
                  <Users className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t('cta.source')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
