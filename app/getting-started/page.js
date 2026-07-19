"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Server,
  Lock,
  Globe,
  Code2,
  Terminal,
  Download,
  Key,
  Clock,
  Zap,
  AlertTriangle,
  FileCode,
  Puzzle,
  Monitor,
  Smartphone,
  Github,
  BookOpen,
  MessageCircle,
  RefreshCw,
  Database,
  Play,
  ChevronDown,
  Network,
  ExternalLink,
  Layers,
  ToggleLeft,
  Search,
  Bot,
  Hexagon,
  Coffee,
  Hash,
  Wind,
  Cog,
  FileSpreadsheet,
  Gauge,
  CandlestickChart,
  Workflow
} from "lucide-react"
import { useState } from "react"

function StepNumber({ n }) {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-lg shrink-0">
      {n}
    </div>
  )
}

function ExpandableCard({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="obsidian-card rounded-xl ghost-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-6 text-left"
      >
        <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <span className="text-base sm:text-lg font-semibold text-on-surface flex-1">{title}</span>
        <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-on-surface-variant transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function BeginnerPage() {
  const { t } = useI18n()

  const analogies = [
    { name: "Android", desc: t('gs.oss.a1') },
    { name: "Linux", desc: t('gs.oss.a2') },
    { name: "WordPress", desc: t('gs.oss.a3') },
    { name: "VLC Player", desc: t('gs.oss.a4') },
    { name: "Firefox", desc: t('gs.oss.a5') },
    { name: "LibreOffice", desc: t('gs.oss.a6') },
  ]

  const brokerPlatforms = [
    "Zerodha", "Angel One", "Fyers", "Upstox", "Dhan", "Groww",
    "Kotak", "5paisa", "Arrow", "Shoonya", "Flattrade", "Firstock",
    "Aliceblue", "IIFL Capital", "IIFL (XTS)", "INDMoney", "Pocketful", "Zebu",
    "Definedge", t('gs.connect.more')
  ]

  const tradingPlatforms = [
    { name: "Amibroker", desc: t('gs.connect.p1d') },
    { name: "TradingView", desc: t('gs.connect.p2d') },
    { name: "Python", desc: t('gs.connect.p3d') },
    { name: "MetaTrader", desc: t('gs.connect.p4d') },
    { name: "Excel", desc: t('gs.connect.p5d') },
    { name: "Go Charting", desc: t('gs.connect.p6d') },
    { name: "N8N", desc: t('gs.connect.p7d') },
    { name: "Google Sheets", desc: t('gs.connect.p8d') },
  ]

  const sdkAccents = ["text-primary", "text-secondary", "text-tertiary"]

  const sdks = [
    { lang: "Python", icon: Code2 },
    { lang: "Node.js", icon: Hexagon },
    { lang: "Java", icon: Coffee },
    { lang: ".NET", icon: Hash },
    { lang: "Go", icon: Wind },
    { lang: "Rust", icon: Cog },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 obsidian-grid" />
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 rounded-full surface-low ghost-border">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="font-label text-label-sm sm:text-label-md uppercase tracking-wider text-on-surface-variant">
              {t('gs.hero.badge')}
            </span>
          </div>

          <h1 className="text-display-md sm:text-display-lg md:text-[4rem] leading-[1.1] mb-4 sm:mb-6 tracking-tight">
            <span className="block text-on-surface">OpenAlgo</span>
            <span className="text-on-surface ">
              {t('gs.hero.title2')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            {t('gs.hero.desc')}
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[t('gs.hero.tag1'), t('gs.hero.tag2'), t('gs.hero.tag3')].map(tag => (
              <span key={tag} className="px-3 sm:px-4 py-1.5 sm:py-2 surface-low rounded-full font-label text-label-sm sm:text-label-md text-on-surface-variant ghost-border">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1 sm:mr-1.5 text-tertiary" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: What is OpenAlgo */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.what.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.what.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <p className="text-base sm:text-lg leading-relaxed text-on-surface mb-4 sm:mb-6">
              {t('gs.what.p1a')}{" "}<strong className="text-primary">{t('gs.what.p1strong')}</strong>{" "}{t('gs.what.p1b')}
            </p>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4 sm:mb-6">
              {t('gs.what.p2')}
            </p>
            <div className="rounded-lg sm:rounded-xl surface-container p-4 sm:p-6">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 sm:mb-4 uppercase tracking-wider">{t('gs.what.factsLabel')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  t('gs.what.fact1'),
                  t('gs.what.fact2'),
                  t('gs.what.fact3'),
                  t('gs.what.fact4'),
                  t('gs.what.fact5'),
                  t('gs.what.fact6')
                ].map(fact => (
                  <div key={fact} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary mt-1 shrink-0" />
                    <span className="text-sm text-on-surface">{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Not a Third Party */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-tertiary">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 rounded-lg bg-tertiary/10 shrink-0">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-tertiary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2">{t('gs.thirdParty.title')}</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">{t('gs.thirdParty.strong')}</strong>{" "}{t('gs.thirdParty.body')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Walkthrough */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 rounded-full surface-low ghost-border">
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="font-label text-label-sm sm:text-label-md uppercase tracking-wider text-on-surface-variant">
                {t('gs.video.badge')}
              </span>
            </div>
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.video.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.video.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl ghost-border overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/ImQS-tz_GIo"
                title={t('gs.video.iframeTitle')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="font-semibold text-sm sm:text-base text-on-surface">{t('gs.video.cardTitle')}</p>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  {t('gs.video.cardDesc')}
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {t('gs.video.docs')}
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Open Source Explained */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.oss.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.oss.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6 sm:mb-8">
              {t('gs.oss.p1')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {analogies.map(item => (
                <div key={item.name} className="rounded-xl surface-container p-4 text-center hover-lift transition-all">
                  <p className="font-semibold text-on-surface mb-1">{item.name}</p>
                  <p className="text-xs text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border">
              <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 sm:mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-on-surface-variant" />
                {t('gs.oss.closedTitle')}
              </h3>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                {[
                  t('gs.oss.c1'),
                  t('gs.oss.c2'),
                  t('gs.oss.c3'),
                  t('gs.oss.c4'),
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border border-l-4 border-l-primary">
              <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 sm:mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {t('gs.oss.openTitle')}
              </h3>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                {[
                  t('gs.oss.o1'),
                  t('gs.oss.o2'),
                  t('gs.oss.o3'),
                  t('gs.oss.o4'),
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: How It Works */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.how.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.how.sub')}
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              {[
                { label: t('gs.how.step1'), sub: "TradingView / Python / Excel", color: "bg-secondary/10 text-secondary" },
                { label: "OpenAlgo API", sub: t('gs.how.step2sub'), color: "bg-primary/10 text-primary" },
                { label: t('gs.how.step3'), sub: "Zerodha / Angel / Fyers...", color: "bg-tertiary/10 text-tertiary" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 sm:gap-4 md:gap-6">
                  <div className={`rounded-xl p-4 sm:p-5 text-center w-full md:w-auto md:min-w-[160px] ${step.color}`}>
                    <p className="font-semibold text-sm">{step.label}</p>
                    <p className="text-xs mt-1 opacity-75">{step.sub}</p>
                  </div>
                  {i < 2 && (
                    <ArrowRight className="w-5 h-5 text-on-surface-variant hidden md:block" />
                  )}
                  {i < 2 && (
                    <ChevronDown className="w-5 h-5 text-on-surface-variant md:hidden" />
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-lg sm:rounded-xl surface-container p-4 sm:p-5 text-center">
              <p className="text-xs sm:text-sm text-on-surface-variant">
                <strong className="text-on-surface">{t('gs.how.flowLabel')}</strong>{" "}{t('gs.how.flowText')}
              </p>
            </div>
          </div>

          {/* Daily Routine */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border">
            <h3 className="text-lg sm:text-headline-sm mb-4 sm:mb-6 text-on-surface flex items-center gap-2 sm:gap-3">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              {t('gs.how.routineTitle')}
            </h3>
            <p className="text-on-surface-variant mb-6">
              {t('gs.how.routineDesc')}
            </p>
            <div className="space-y-4">
              {[
                { time: t('gs.how.r1t'), event: t('gs.how.r1e'), icon: RefreshCw },
                { time: t('gs.how.r2t'), event: t('gs.how.r2e'), icon: Key },
                { time: t('gs.how.r3t'), event: t('gs.how.r3e'), icon: Database },
                { time: t('gs.how.r4t'), event: t('gs.how.r4e'), icon: Play },
                { time: t('gs.how.r5t'), event: t('gs.how.r5e'), icon: Clock },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-2 rounded-lg surface-container shrink-0">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-label text-label-lg text-primary">{step.time}</span>
                    <p className="text-sm text-on-surface-variant">{step.event}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">{t('gs.how.whyLabel')}</strong>{" "}{t('gs.how.whyText')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Authentication & Security */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.auth.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.auth.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <div className="space-y-6 sm:space-y-8">
              {/* Auth Token Explained */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2 sm:mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('gs.auth.tokenTitle')}
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-4">
                  {t('gs.auth.tokenP1')}{" "}<strong className="text-on-surface">{t('gs.auth.tokenStrong')}</strong>{t('gs.auth.tokenP2')}
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: t('gs.auth.c1t'), desc: t('gs.auth.c1d') },
                    { label: t('gs.auth.c2t'), desc: t('gs.auth.c2d') },
                    { label: t('gs.auth.c3t'), desc: t('gs.auth.c3d') },
                  ].map(item => (
                    <div key={item.label} className="rounded-lg surface-container p-3">
                      <p className="font-label text-label-md text-primary">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-outline-variant/20" />

              {/* API Keys */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2 sm:mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('gs.auth.keysTitle')}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl surface-container p-5">
                    <p className="font-semibold text-on-surface mb-2">{t('gs.auth.k1t')}</p>
                    <p className="text-sm text-on-surface-variant">
                      {t('gs.auth.k1a')}{" "}<code className="px-1.5 py-0.5 rounded surface-high text-xs">.env</code>{" "}{t('gs.auth.k1b')}
                    </p>
                  </div>
                  <div className="rounded-xl surface-container p-5">
                    <p className="font-semibold text-on-surface mb-2">{t('gs.auth.k2t')}</p>
                    <p className="text-sm text-on-surface-variant">
                      {t('gs.auth.k2d')}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-outline-variant/20" />

              {/* Static IP */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2 sm:mb-3 flex items-center gap-2">
                  <Network className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('gs.auth.ipTitle')}
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-4">
                  {t('gs.auth.ipDesc')}
                </p>
                <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
                  <p className="text-sm text-on-surface-variant">
                    <strong className="text-on-surface">{t('gs.auth.ipHowLabel')}</strong>{" "}{t('gs.auth.ipHow1')}{" "}
                    <a href="/ip" className="text-primary hover:underline">openalgo.in/ip</a>{t('gs.auth.ipHow2')}{" "}
                    <a href="/static-ip" className="text-primary hover:underline">{t('gs.auth.ipGuideLink')}</a>{" "}{t('gs.auth.ipHow3')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: What You Can Connect */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.connect.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.connect.sub')}
            </p>
          </div>

          {/* Brokers */}
          <div className="mb-8 sm:mb-10">
            <h3 className="text-lg sm:text-headline-sm mb-4 sm:mb-5 text-on-surface flex items-center gap-2">
              <Network className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('gs.connect.brokersTitle')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {brokerPlatforms.map(name => (
                <span key={name} className="px-3 py-1.5 rounded-full surface-container font-label text-label-md text-on-surface-variant hover:text-primary transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Trading Platforms */}
          <div className="mb-8 sm:mb-10">
            <h3 className="text-lg sm:text-headline-sm mb-4 sm:mb-5 text-on-surface flex items-center gap-2">
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('gs.connect.platformsTitle')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {tradingPlatforms.map(p => (
                <div key={p.name} className="obsidian-card rounded-lg sm:rounded-xl p-3 sm:p-4 ghost-border hover-lift text-center">
                  <p className="font-semibold text-on-surface text-sm">{p.name}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SDKs */}
          <div>
            <h3 className="text-lg sm:text-headline-sm mb-4 sm:mb-5 text-on-surface flex items-center gap-2">
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('gs.connect.sdkTitle')}
            </h3>
            <p className="text-on-surface-variant mb-5">
              {t('gs.connect.sdkDesc')}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {sdks.map((s, index) => (
                <div key={s.lang} className="rounded-lg sm:rounded-xl surface-container p-3 sm:p-4 text-center hover-lift transition-all">
                  <s.icon className={`h-5 w-5 sm:h-6 sm:w-6 mx-auto ${sdkAccents[index % sdkAccents.length]}`} />
                  <p className="font-label text-label-sm sm:text-label-md text-on-surface mt-1 sm:mt-2">{s.lang}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Installation Steps */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.install.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.install.sub')}
            </p>
          </div>

          <div className="space-y-4">
            <ExpandableCard title={t('gs.install.s1title')} icon={FileCode} defaultOpen={true}>
              <p className="text-on-surface-variant mb-4">
                {t('gs.install.s1desc')}
              </p>
              <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm text-on-surface-variant overflow-x-auto">
                {t('gs.install.downloadFrom')} → <span className="text-primary">code.visualstudio.com</span>
              </div>
              <p className="text-sm text-on-surface-variant mt-3">
                {t('gs.install.s1ext1')}{" "}<strong className="text-on-surface">Python</strong>, <strong className="text-on-surface">Pylance</strong>{t('gs.install.s1ext2')}{" "}<strong className="text-on-surface">Jupyter</strong>{" "}{t('gs.install.s1ext3')}
              </p>
            </ExpandableCard>

            <ExpandableCard title={t('gs.install.s2title')} icon={Terminal}>
              <p className="text-on-surface-variant mb-4">
                {t('gs.install.s2desc')}{" "}<strong className="text-on-surface">{t('gs.install.s2important')}</strong>{" "}{t('gs.install.s2check')}
              </p>
              <div className="rounded-lg surface-container p-3 sm:p-4 space-y-2 font-mono text-xs sm:text-sm overflow-x-auto">
                <p className="text-on-surface-variant">{t('gs.install.verifyLabel')}</p>
                <p className="text-primary">python --version</p>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('gs.install.s3title')} icon={Download}>
              <p className="text-on-surface-variant mb-4">
                {t('gs.install.s3desc')}
              </p>
              <div className="rounded-lg surface-container p-3 sm:p-4 space-y-2 font-mono text-xs sm:text-sm overflow-x-auto">
                <p className="text-on-surface-variant">{t('gs.install.downloadFrom')} → <span className="text-primary">git-scm.com</span></p>
                <p className="text-on-surface-variant">{t('gs.install.verify')} <span className="text-primary">git --version</span></p>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('gs.install.s4title')} icon={Zap}>
              <p className="text-on-surface-variant mb-4">
                {t('gs.install.s4desc')}
              </p>
              <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                <p className="text-primary">pip install uv</p>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('gs.install.s5title')} icon={Server}>
              <div className="space-y-4 text-on-surface-variant">
                <p>{t('gs.install.s5p1')}</p>
                <div className="rounded-lg surface-container p-3 sm:p-4 space-y-2 font-mono text-xs sm:text-sm overflow-x-auto">
                  <p className="text-primary">git clone https://github.com/marketcalls/openalgo.git</p>
                  <p className="text-primary">cd openalgo</p>
                  <p className="text-primary">cp .sample.env .env</p>
                </div>
                <p>
                  {t('gs.install.s5p2a')}{" "}<code className="px-1.5 py-0.5 rounded surface-high text-xs text-on-surface">.env</code>{" "}{t('gs.install.s5p2b')}
                </p>
                <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
                  <p className="text-sm">
                    <strong className="text-on-surface">{t('gs.install.s5tipLabel')}</strong>{" "}{t('gs.install.s5tip1')}{" "}<strong className="text-on-surface">{t('gs.install.s5tipStrong')}</strong>{" "}{t('gs.install.s5tip2')}
                  </p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('gs.install.s6title')} icon={Play}>
              <div className="space-y-4 text-on-surface-variant">
                <p>{t('gs.install.s6p1')}</p>
                <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                  <p className="text-primary">uv run app.py</p>
                </div>
                <p>
                  {t('gs.install.s6p2a')}{" "}<code className="px-1.5 py-0.5 rounded surface-high text-xs text-on-surface">localhost:5000</code>{t('gs.install.s6p2b')}
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <div className="rounded-lg surface-container p-3 text-center">
                    <p className="text-2xl font-bold text-primary">~680 MB</p>
                    <p className="text-xs text-on-surface-variant">{t('gs.install.stat1')}</p>
                  </div>
                  <div className="rounded-lg surface-container p-3 text-center">
                    <p className="text-2xl font-bold text-primary">177</p>
                    <p className="text-xs text-on-surface-variant">{t('gs.install.stat2')}</p>
                  </div>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('gs.install.optTitle')} icon={Puzzle}>
              <p className="text-on-surface-variant">
                {t('gs.install.optDesc')}
              </p>
            </ExpandableCard>
          </div>
        </div>
      </div>

      {/* Section 7: Key Features at a Glance */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.features.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.features.sub')}
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[
              {
                icon: ToggleLeft,
                title: t('gs.features.f1t'),
                desc: t('gs.features.f1d'),
                color: "text-secondary bg-secondary/10"
              },
              {
                icon: Layers,
                title: t('gs.features.f2t'),
                desc: t('gs.features.f2d'),
                color: "text-primary bg-primary/10"
              },
              {
                icon: Search,
                title: t('gs.features.f3t'),
                desc: t('gs.features.f3d'),
                color: "text-tertiary bg-tertiary/10"
              },
              {
                icon: Zap,
                title: t('gs.features.f4t'),
                desc: t('gs.features.f4d'),
                color: "text-secondary bg-secondary/10"
              },
              {
                icon: Bot,
                title: t('gs.features.f5t'),
                desc: t('gs.features.f5d'),
                color: "text-primary bg-primary/10"
              },
              {
                icon: Shield,
                title: t('gs.features.f6t'),
                desc: t('gs.features.f6d'),
                color: "text-tertiary bg-tertiary/10"
              },
            ].map((feature, i) => (
              <div key={i} className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border hover-lift">
                <div className={`inline-flex p-2 sm:p-2.5 rounded-lg ${feature.color} mb-3 sm:mb-4`}>
                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-on-surface">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 8: TradingView Integration */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.tv.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.tv.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border">
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-5 sm:mb-6">
              {t('gs.tv.p1')}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
              {[
                { name: "ngrok", desc: t('gs.tv.t1d'), tag: t('gs.tv.tag1') },
                { name: "Dev Tunnel", desc: t('gs.tv.t2d'), tag: t('gs.tv.tag2') },
                { name: "Cloudflare", desc: t('gs.tv.t3d'), tag: t('gs.tv.tag3') },
              ].map(t2 => (
                <div key={t2.name} className="rounded-lg sm:rounded-xl surface-container p-3 sm:p-4 text-center">
                  <span className="font-label text-label-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t2.tag}</span>
                  <p className="font-semibold text-on-surface mt-2">{t2.name}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{t2.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">{t('gs.tv.noTvLabel')}</strong>{" "}{t('gs.tv.noTv1')}{" "}<strong className="text-on-surface">{t('gs.tv.noTvStrong')}</strong>{" "}{t('gs.tv.noTv2')}
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-tertiary/5 p-4 border-l-4 border-l-tertiary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">{t('gs.tv.hostLabel')}</strong>{" "}{t('gs.tv.host1')}{" "}<code className="px-1 py-0.5 rounded surface-high text-xs">myalgo.mydomain.com</code>{t('gs.tv.host2')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 9: Important Things to Remember */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.remember.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.remember.sub')}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: t('gs.remember.t1t'),
                desc: t('gs.remember.t1d'),
                icon: Clock,
              },
              {
                title: t('gs.remember.t2t'),
                desc: t('gs.remember.t2d'),
                icon: Shield,
              },
              {
                title: t('gs.remember.t3t'),
                desc: t('gs.remember.t3d'),
                icon: Zap,
              },
              {
                title: t('gs.remember.t4t'),
                desc: t('gs.remember.t4d'),
                icon: Lock,
              },
              {
                title: t('gs.remember.t5t'),
                desc: t('gs.remember.t5d'),
                icon: AlertTriangle,
              },
              {
                title: t('gs.remember.t6t'),
                desc: t('gs.remember.t6d'),
                icon: Monitor,
              },
            ].map((tip, i) => (
              <div key={i} className="obsidian-card rounded-xl p-4 sm:p-6 ghost-border flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 shrink-0">
                  <tip.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface mb-1">{tip.title}</h3>
                  <p className="text-sm text-on-surface-variant">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 10: The FOSS Ecosystem */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.eco.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('gs.eco.sub')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: FileSpreadsheet, name: t('gs.eco.n1'), desc: t('gs.eco.d1') },
              { icon: Smartphone, name: t('gs.eco.n2'), desc: t('gs.eco.d2') },
              { icon: Gauge, name: "Fast Scalper", desc: t('gs.eco.d3') },
              { icon: Layers, name: "AlgoMirror", desc: t('gs.eco.d4') },
              { icon: Bot, name: t('gs.eco.n5'), desc: t('gs.eco.d5') },
              { icon: CandlestickChart, name: "OpenAlgo Chart", desc: t('gs.eco.d6') },
              { icon: Workflow, name: "OpenAlgo Flow", desc: t('gs.eco.d7') },
              { icon: Database, name: "Historify", desc: t('gs.eco.d8') },
              { icon: Puzzle, name: t('gs.eco.n9'), desc: t('gs.eco.d9') },
            ].map((tool, index) => (
              <div key={tool.name} className="obsidian-card rounded-lg sm:rounded-xl p-3 sm:p-4 ghost-border hover-lift text-center">
                <div className={`inline-flex p-2 rounded-lg ${["bg-primary/10", "bg-secondary/10", "bg-tertiary/10"][index % 3]}`}>
                  <tool.icon className={`h-5 w-5 ${sdkAccents[index % 3]}`} />
                </div>
                <p className="font-semibold text-xs sm:text-sm text-on-surface mt-1.5 sm:mt-2">{tool.name}</p>
                <p className="text-xs text-on-surface-variant mt-1">{tool.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-on-surface-variant mt-6">
            {t('gs.eco.outro')}{" "}
            <a href="https://github.com/marketcalls" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              GitHub <ExternalLink className="w-3 h-3 inline" />
            </a>
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 sm:py-20 md:py-24 surface-low">
        <div className="container max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('gs.cta.title')}</h2>
          <p className="text-base sm:text-lg text-on-surface-variant mb-8 sm:mb-10">
            {t('gs.cta.sub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                {t('gs.cta.docs')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {t('gs.cta.source')}
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/discord">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('gs.cta.community')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
