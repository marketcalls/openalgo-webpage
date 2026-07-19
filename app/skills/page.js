"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  ArrowRight, Github, Terminal, Sparkles, Copy, Check, BookOpen,
  Bot, LineChart, BarChart3, Search, Layers, LayoutDashboard, Radio,
  Wand2, Rocket, Gauge, Activity, Box, TrendingUp, Globe,
  CheckCircle2, MessageCircle, PieChart, Calculator
} from "lucide-react"
import { useState } from "react"

function CopyButton({ text }) {
  const { t } = useI18n()
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
      aria-label={t('skill.copyAria')}
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

const AGENTS = [
  "Claude Code", "Cursor", "Codex", "OpenCode", "Cline", "Windsurf",
  "GitHub Copilot", "Gemini CLI", "Roo Code",
]

export default function SkillsPage() {
  const { t } = useI18n()
  const [tab, setTab] = useState("indicators")

  const indicatorCommands = [
    { cmd: "/indicator-setup", icon: Rocket, title: t('skill.ic1t'), desc: t('skill.ic1d') },
    { cmd: "/indicator-chart", icon: LineChart, title: t('skill.ic2t'), desc: t('skill.ic2d') },
    { cmd: "/custom-indicator", icon: Wand2, title: t('skill.ic3t'), desc: t('skill.ic3d') },
    { cmd: "/indicator-dashboard", icon: LayoutDashboard, title: t('skill.ic4t'), desc: t('skill.ic4d') },
    { cmd: "/indicator-scanner", icon: Search, title: t('skill.ic5t'), desc: t('skill.ic5d') },
    { cmd: "/live-feed", icon: Radio, title: t('skill.ic6t'), desc: t('skill.ic6d') },
  ]

  const backtestCommands = [
    { cmd: "/setup", icon: Rocket, title: t('skill.bc1t'), desc: t('skill.bc1d') },
    { cmd: "/backtest", icon: BarChart3, title: t('skill.bc2t'), desc: t('skill.bc2d') },
    { cmd: "/optimize", icon: Gauge, title: t('skill.bc3t'), desc: t('skill.bc3d') },
    { cmd: "/quick-stats", icon: Activity, title: t('skill.bc4t'), desc: t('skill.bc4d') },
    { cmd: "/strategy-compare", icon: Layers, title: t('skill.bc5t'), desc: t('skill.bc5d') },
  ]

  const indicatorCategories = [
    { name: t('skill.cat1n'), count: 20, example: t('skill.cat1e') },
    { name: t('skill.cat2n'), count: 9, example: t('skill.cat2e') },
    { name: t('skill.cat3n'), count: 16, example: t('skill.cat3e') },
    { name: t('skill.cat4n'), count: 14, example: t('skill.cat4e') },
    { name: t('skill.cat5n'), count: 20, example: t('skill.cat5e') },
    { name: t('skill.cat6n'), count: 9, example: t('skill.cat6e') },
    { name: t('skill.cat7n'), count: 6, example: t('skill.cat7e') },
    { name: t('skill.cat8n'), count: 11, example: t('skill.cat8e') },
  ]

  const strategyTemplates = [
    { name: t('skill.st1n'), type: t('skill.st1t') },
    { name: t('skill.st2n'), type: t('skill.st2t') },
    { name: t('skill.st3n'), type: t('skill.st3t') },
    { name: t('skill.st4n'), type: t('skill.st4t') },
    { name: t('skill.st5n'), type: t('skill.st5t') },
    { name: t('skill.st6n'), type: t('skill.st6t') },
    { name: t('skill.st7n'), type: t('skill.st7t') },
    { name: t('skill.st8n'), type: t('skill.st8t') },
    { name: t('skill.st9n'), type: t('skill.st9t') },
    { name: t('skill.st10n'), type: t('skill.st10t') },
    { name: t('skill.st11n'), type: t('skill.st11t') },
    { name: t('skill.st12n'), type: t('skill.st12t') },
  ]

  const agents = [...AGENTS, t('skill.agentsMore')]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 obsidian-grid opacity-30 -z-10" />
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-tertiary bg-tertiary/10">{t('skill.badgeOpenSource')}</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-secondary bg-secondary/10">{t('skill.badgeWorksWith')}</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-primary bg-primary/10">{t('skill.badgeOneLine')}</span>
          </div>

          <h1 className="text-display-lg sm:text-[4rem] leading-[1.05] mb-6 tracking-tight">
            <span className="block text-on-surface">{t('skill.h1a')}</span>
            <span className="text-on-surface ">
              {t('skill.h1b')}
            </span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-3 leading-relaxed">
            {t('skill.heroDesc')}
          </p>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto mb-10">
            {t('skill.heroDesc2')}
          </p>

          <div className="max-w-xl mx-auto mb-8">
            <CodeBlock copyText="npx skills add marketcalls/openalgo-indicator-skills">
              <span className="text-on-surface-variant/50">$</span> npx skills add marketcalls/openalgo-indicator-skills
            </CodeBlock>
            <p className="text-xs text-on-surface-variant mt-2">
              {t('skill.heroInstallNote')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#collections" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> {t('skill.ctaSee')} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://docs.openalgo.in/skills/indicators" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> {t('skill.ctaDocs')}
              </a>
            </Button>
          </div>
        </div>

        {/* What are Skills */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('skill.whatTitle')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('skill.whatSub')}
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, title: t('skill.w1t'), desc: t('skill.w1d') },
              { icon: CheckCircle2, title: t('skill.w2t'), desc: t('skill.w2d') },
              { icon: Terminal, title: t('skill.w3t'), desc: t('skill.w3d') },
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('skill.agentsTitle')}</h2>
          <p className="text-center text-on-surface-variant mb-8 max-w-2xl mx-auto">
            {t('skill.agentsSub')}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {agents.map(agent => (
              <span key={agent} className="px-4 py-1.5 surface-low rounded-full font-label text-label-md text-on-surface-variant hover:surface-container hover:text-primary transition-all">
                {agent}
              </span>
            ))}
          </div>
        </div>

        {/* Two Collections */}
        <div id="collections" className="mb-16 scroll-mt-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('skill.packsTitle')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('skill.packsSub')}
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
                {t('skill.tabIndicators')}
              </button>
              <button
                onClick={() => setTab("backtesting")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md font-label text-label-md transition-all ${
                  tab === "backtesting" ? "surface-container text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                {t('skill.tabBacktesting')}
              </button>
            </div>
          </div>

          {tab === "indicators" && (
            <div className="space-y-8">
              <div className="obsidian-card rounded-2xl p-6 md:p-8 ghost-border">
                <div className="flex items-start gap-4 mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 shrink-0">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-headline-sm text-on-surface mb-1">{t('skill.indTitle')}</h3>
                    <p className="text-sm text-on-surface-variant mb-3">
                      {t('skill.indDesc')}
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
                  {t('skill.askTitle')}
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {indicatorCommands.map(({ cmd, icon: Icon, title, desc }) => (
                    <div key={cmd} className="obsidian-card rounded-xl p-5 ghost-border hover-lift">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-4 w-4 text-primary shrink-0" />
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
                  {t('skill.indBuiltTitle')}
                </h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  {t('skill.indBuiltSub')}
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {indicatorCategories.map(({ name, count, example }) => (
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
                  {t('skill.tryTitle')}
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { cmd: "/indicator-chart supertrend NIFTY NSE_INDEX 15m", plain: t('skill.ie1') },
                    { cmd: "/indicator-chart rsi RELIANCE NSE D", plain: t('skill.ie2') },
                    { cmd: "/custom-indicator zscore", plain: t('skill.ie3') },
                    { cmd: "/indicator-dashboard multi-timeframe SBIN", plain: t('skill.ie4') },
                    { cmd: "/indicator-scanner rsi-oversold", plain: t('skill.ie5') },
                    { cmd: "/live-feed NIFTY NSE_INDEX", plain: t('skill.ie6') },
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
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 shrink-0">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-headline-sm text-on-surface mb-1">{t('skill.btTitle')}</h3>
                    <p className="text-sm text-on-surface-variant mb-3">
                      {t('skill.btDesc')}
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
                  {t('skill.askTitle')}
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {backtestCommands.map(({ cmd, icon: Icon, title, desc }) => (
                    <div key={cmd} className="obsidian-card rounded-xl p-5 ghost-border hover-lift">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-4 w-4 text-primary shrink-0" />
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
                  {t('skill.stratTitle')}
                </h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  {t('skill.stratSub')}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {strategyTemplates.map(({ name, type }) => (
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
                  {t('skill.feesTitle')}
                </h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  {t('skill.feesSub')}
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { market: t('skill.fm1m'), ref: t('skill.fm1r'), segments: t('skill.fm1s'), benchmark: t('skill.fm1b') },
                    { market: t('skill.fm2m'), ref: t('skill.fm2r'), segments: t('skill.fm2s'), benchmark: t('skill.fm2b') },
                    { market: t('skill.fm3m'), ref: t('skill.fm3r'), segments: t('skill.fm3s'), benchmark: t('skill.fm3b') },
                  ].map(({ market, ref, segments, benchmark }) => (
                    <div key={market} className="obsidian-card rounded-xl p-5 ghost-border">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="font-semibold text-on-surface">{market}</span>
                        <span className="font-label text-label-sm text-on-surface-variant">{ref}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{segments}</p>
                      <div className="font-label text-label-sm">
                        <span className="text-on-surface-variant">{t('skill.comparedAgainst')}{" "}</span>
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
                  {t('skill.tryTitle')}
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { cmd: "/backtest ema-crossover SBIN NSE D", plain: t('skill.be1') },
                    { cmd: "/backtest supertrend NIFTY NFO 5m", plain: t('skill.be2') },
                    { cmd: "/optimize rsi AAPL", plain: t('skill.be3') },
                    { cmd: "/quick-stats BTC-USD", plain: t('skill.be4') },
                    { cmd: "/strategy-compare RELIANCE ema-crossover rsi donchian", plain: t('skill.be5') },
                    { cmd: "/backtest ema-crossover BTC-USD", plain: t('skill.be6') },
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('skill.marketsTitle')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('skill.marketsSub')}
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, market: t('skill.mk1m'), source: t('skill.mk1s'), tickers: t('skill.mk1t') },
              { icon: Globe, market: t('skill.mk2m'), source: t('skill.mk2s'), tickers: t('skill.mk2t') },
              { icon: Activity, market: t('skill.mk3m'), source: t('skill.mk3s'), tickers: t('skill.mk3t') },
            ].map(({ icon: Icon, market, source, tickers }) => (
              <div key={market} className="obsidian-card rounded-xl p-6 ghost-border">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-on-surface">{market}</h3>
                </div>
                <p className="text-sm text-on-surface mb-1">
                  <span className="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">{t('skill.dataLabel')}{" "}</span>
                  {source}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">{t('skill.examplesLabel').replace('{x}', tickers)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Install Options */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('skill.installTitle')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('skill.installSub')}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: t('skill.in1'), code: "npx skills add marketcalls/openalgo-indicator-skills" },
              { title: t('skill.in2'), code: "npx skills add marketcalls/openalgo-indicator-skills -s indicator-chart" },
              { title: t('skill.in3'), code: "npx skills add marketcalls/openalgo-indicator-skills -g" },
              { title: t('skill.in4'), code: "npx skills add marketcalls/openalgo-indicator-skills -l" },
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
            {t('skill.docsHelp')}{" "}
            <a href="https://docs.openalgo.in/skills/indicators" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors">
              {t('skill.docsHelpLink')}
            </a>.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-headline-md mb-4 text-on-surface">{t('skill.ctaTitle')}</h2>
          <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
            {t('skill.ctaSub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo-indicator-skills" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> {t('skill.ctaIndicator')}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/marketcalls/vectorbt-backtesting-skills" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> {t('skill.ctaBacktesting')}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/discord" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> {t('skill.ctaDiscord')}
              </a>
            </Button>
          </div>
          <p className="font-label text-label-sm text-on-surface-variant mt-6">
            {t('skill.mcpNote')}{" "}
            <a href="/mcp" className="underline underline-offset-4 hover:text-primary transition-colors">OpenAlgo MCP</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
