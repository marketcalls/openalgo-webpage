"use client"

import { Button } from "@/components/ui/button"
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
  Bot
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
  const analogies = [
    { name: "Android", desc: "Free OS on your phone" },
    { name: "Linux", desc: "Powers most servers worldwide" },
    { name: "WordPress", desc: "Free website builder" },
    { name: "VLC Player", desc: "Free media player" },
    { name: "Firefox", desc: "Free web browser" },
    { name: "LibreOffice", desc: "Free office suite" },
  ]

  const brokerPlatforms = [
    "Zerodha", "Angel One", "Fyers", "Upstox", "Dhan", "Groww",
    "Kotak", "5paisa", "Shoonya", "Flattrade", "Firstock",
    "Aliceblue", "IIFL", "INDMoney", "Pocketful", "Zebu",
    "Definedge", "and more..."
  ]

  const tradingPlatforms = [
    { name: "Amibroker", desc: "Charting & AFL strategies" },
    { name: "TradingView", desc: "Pine Script & webhooks" },
    { name: "Python", desc: "Custom coded strategies" },
    { name: "MetaTrader", desc: "MT4/MT5 Expert Advisors" },
    { name: "Excel", desc: "Spreadsheet-based trading" },
    { name: "Go Charting", desc: "Cloud-based charting" },
    { name: "N8N", desc: "Workflow automation" },
    { name: "Google Sheets", desc: "Sheet-based trading" },
  ]

  const sdks = [
    { lang: "Python", emoji: "🐍" },
    { lang: "Node.js", emoji: "🟢" },
    { lang: "Java", emoji: "☕" },
    { lang: ".NET", emoji: "🔷" },
    { lang: "Go", emoji: "🔵" },
    { lang: "Rust", emoji: "🦀" },
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
              Beginner&apos;s Guide
            </span>
          </div>

          <h1 className="text-display-md sm:text-display-lg md:text-[4rem] leading-[1.1] mb-4 sm:mb-6 tracking-tight">
            <span className="block text-on-surface">OpenAlgo</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary animate-gradient">
              Explained Simply
            </span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            New to OpenAlgo? Not a techie? No problem. This guide explains everything
            from scratch. What it is, why it matters, and how to get started.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {["No coding required to understand", "Step-by-step walkthrough", "Real-world analogies"].map(tag => (
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">What is OpenAlgo?</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              Think of it as your personal, private algo trading engine that you own and run yourself.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <p className="text-base sm:text-lg leading-relaxed text-on-surface mb-4 sm:mb-6">
              OpenAlgo is a <strong className="text-primary">free, open-source algo trading platform</strong> built
              for Indian markets. It&apos;s a web-based application that runs on your own computer or server.
              You download the complete source code, install it, and you have your own private trading platform.
            </p>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4 sm:mb-6">
              It acts as a bridge between your trading ideas (from platforms like TradingView, Python, Amibroker, Excel)
              and your broker (Zerodha, Angel, Fyers, Upstox, etc). You send signals to OpenAlgo, and it places
              orders in your broker account automatically.
            </p>
            <div className="rounded-lg sm:rounded-xl surface-container p-4 sm:p-6">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 sm:mb-4 uppercase tracking-wider">Key Facts</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Single-user application: one instance, one broker",
                  "No inbuilt strategies: you bring your own ideas",
                  "30+ Indian brokers supported (and growing)",
                  "Expanding to crypto & US markets",
                  "100% free, 100% open source (AGPL-3.0)",
                  "Runs on Windows, Mac, Linux, even Raspberry Pi"
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
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2">Is OpenAlgo a Third-Party Platform?</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">Absolutely not.</strong> You own the complete source code. You download it,
                  you run it on your own infrastructure, you have full visibility and control. Since you&apos;re running it yourself,
                  it&apos;s your own platform. No approvals needed from any broker, exchange, or SEBI as a retail trader
                  managing your own algos.
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
                Video Walkthrough
              </span>
            </div>
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Watch the Full Beginner Session</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Prefer watching over reading? This session by Rajendran covers everything from
              installation to building your first strategy, step by step.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl ghost-border overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/ImQS-tz_GIo"
                title="OpenAlgo Beginner's Guide - Complete Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="font-semibold text-sm sm:text-base text-on-surface">OpenAlgo for Absolute Beginners</p>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Complete walkthrough: installation, broker setup, first strategy &amp; more
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    Docs
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">What Does &quot;Open Source&quot; Mean?</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              Open source isn&apos;t new. You&apos;ve been using it every day without realizing.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6 sm:mb-8">
              Open source means the complete source code is available for free. You can download it, modify it,
              and even distribute it. No hidden costs, no subscriptions, no vendor lock-in.
              Here are some open-source tools you probably already use:
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
                Closed / Black-box Platforms
              </h3>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                {[
                  "You can't see how it works internally",
                  "Your data may be on someone else's server",
                  "Vendor can change pricing or shut down anytime",
                  "You depend on their uptime and support",
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
                OpenAlgo (Open Source)
              </h3>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                {[
                  "Complete source code visible & auditable",
                  "Your data stays on YOUR infrastructure",
                  "Free forever. No subscriptions, no fees",
                  "Community-driven, transparent development",
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">How Does OpenAlgo Work?</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              OpenAlgo sits between your trading ideas and your broker.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              {[
                { label: "Your Strategy", sub: "TradingView / Python / Excel", color: "bg-secondary/10 text-secondary" },
                { label: "OpenAlgo API", sub: "Running on your machine", color: "bg-primary/10 text-primary" },
                { label: "Broker Server", sub: "Zerodha / Angel / Fyers...", color: "bg-tertiary/10 text-tertiary" },
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
                <strong className="text-on-surface">Signal Flow:</strong> Your strategy generates a signal →
                OpenAlgo receives it via its API → OpenAlgo converts it to a broker order →
                Broker executes the trade in your account
              </p>
            </div>
          </div>

          {/* Daily Routine */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border">
            <h3 className="text-lg sm:text-headline-sm mb-4 sm:mb-6 text-on-surface flex items-center gap-2 sm:gap-3">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Daily Routine
            </h3>
            <p className="text-on-surface-variant mb-6">
              OpenAlgo requires a daily login because broker authentication tokens expire every night (SEBI regulation).
              Here&apos;s the typical daily flow:
            </p>
            <div className="space-y-4">
              {[
                { time: "3:00 AM", event: "OpenAlgo auto logs out (tokens expired)", icon: RefreshCw },
                { time: "8:00 to 9:00 AM", event: "Log in to OpenAlgo, authenticates with broker", icon: Key },
                { time: "Auto", event: "Master contract downloads (~1 lakh symbols, takes 10 to 20 sec)", icon: Database },
                { time: "9:15 AM", event: "Market opens. Your strategies run automatically", icon: Play },
                { time: "3:30 PM", event: "Market closes. Strategies wind down", icon: Clock },
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
                <strong className="text-on-surface">Why after 8 AM?</strong> Brokers update their master contracts
                (symbol lists) early morning. Logging in after 8 AM ensures you get the latest symbols,
                especially important for option traders with weekly expiries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Authentication & Security */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Authentication &amp; Security</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              How OpenAlgo securely connects to your broker.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <div className="space-y-6 sm:space-y-8">
              {/* Auth Token Explained */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2 sm:mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Authentication Token
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-4">
                  When you log in, the broker sends an <strong className="text-on-surface">authentication token</strong>.
                  Think of it as a temporary key to your house. This token is valid for ~24 hours and is used
                  for all operations: placing orders, checking funds, accessing market data. It&apos;s encrypted
                  and stored in your local database. No one can see it.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: "Expires daily", desc: "Midnight to 3 AM (varies by broker)" },
                    { label: "Encrypted storage", desc: "Stored securely in your local DB" },
                    { label: "No refresh tokens", desc: "SEBI mandate. Daily login required" },
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
                  Two Types of Keys
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl surface-container p-5">
                    <p className="font-semibold text-on-surface mb-2">Broker API Key &amp; Secret</p>
                    <p className="text-sm text-on-surface-variant">
                      You get these from your broker&apos;s developer portal. Configured once in the <code className="px-1.5 py-0.5 rounded surface-high text-xs">.env</code> file.
                      Keep them private. Never share.
                    </p>
                  </div>
                  <div className="rounded-xl surface-container p-5">
                    <p className="font-semibold text-on-surface mb-2">OpenAlgo API Key</p>
                    <p className="text-sm text-on-surface-variant">
                      Generated inside OpenAlgo itself. Used to send orders from external platforms
                      (TradingView, Python, etc). Can be regenerated anytime if exposed.
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-outline-variant/20" />

              {/* Static IP */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2 sm:mb-3 flex items-center gap-2">
                  <Network className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Static IP Requirement
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-4">
                  SEBI regulations require that your trading orders originate from a fixed (static) IP address.
                  You can register a primary and secondary IP in your broker&apos;s developer portal. IPs can only be changed once per week.
                </p>
                <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
                  <p className="text-sm text-on-surface-variant">
                    <strong className="text-on-surface">How to get a Static IP:</strong> Contact your ISP (Jio, Airtel, ACT, Tata, etc.)
                    and request a static IP. If hosting on a VPS/cloud, static IPs are usually provided by default.
                    Check your current IP at <a href="/ip" className="text-primary hover:underline">openalgo.in/ip</a>.
                    Read our complete <a href="/static-ip" className="text-primary hover:underline">Static IP & Server Hosting Guide</a> for step by step instructions.
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">What Can You Connect?</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              One platform, many integrations. Trade from wherever you&apos;re comfortable.
            </p>
          </div>

          {/* Brokers */}
          <div className="mb-8 sm:mb-10">
            <h3 className="text-lg sm:text-headline-sm mb-4 sm:mb-5 text-on-surface flex items-center gap-2">
              <Network className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              30+ Supported Brokers
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
              Trading Platforms
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
              SDKs in 6 Languages
            </h3>
            <p className="text-on-surface-variant mb-5">
              Most brokers offer SDKs in 1 or 2 languages. OpenAlgo gives you SDKs in 6. Use whichever language
              you&apos;re comfortable with, and it works across all 30+ brokers.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {sdks.map(s => (
                <div key={s.lang} className="rounded-lg sm:rounded-xl surface-container p-3 sm:p-4 text-center hover-lift transition-all">
                  <span className="text-xl sm:text-2xl">{s.emoji}</span>
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Getting Started</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              One-time setup. 5 minutes for techies, ~45 minutes if you&apos;re completely new.
            </p>
          </div>

          <div className="space-y-4">
            <ExpandableCard title="Step 1: Install VS Code" icon={FileCode} defaultOpen={true}>
              <p className="text-on-surface-variant mb-4">
                VS Code is a free code editor from Microsoft. It&apos;s where you&apos;ll manage OpenAlgo and build strategies.
                You can also use alternatives like Cursor, Windsurf, or AntiGravity (forks of VS Code).
              </p>
              <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm text-on-surface-variant overflow-x-auto">
                Download from → <span className="text-primary">code.visualstudio.com</span>
              </div>
              <p className="text-sm text-on-surface-variant mt-3">
                After installing, add these extensions: <strong className="text-on-surface">Python</strong>, <strong className="text-on-surface">Pylance</strong>, and <strong className="text-on-surface">Jupyter</strong> (optional).
              </p>
            </ExpandableCard>

            <ExpandableCard title="Step 2: Install Python (3.12 to 3.14)" icon={Terminal}>
              <p className="text-on-surface-variant mb-4">
                Python is the programming language OpenAlgo is built with. Download from python.org and install
                it. <strong className="text-on-surface">Important:</strong> check &quot;Add Python to PATH&quot; during installation.
              </p>
              <div className="rounded-lg surface-container p-3 sm:p-4 space-y-2 font-mono text-xs sm:text-sm overflow-x-auto">
                <p className="text-on-surface-variant">Verify installation:</p>
                <p className="text-primary">python --version</p>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 3: Install Git" icon={Download}>
              <p className="text-on-surface-variant mb-4">
                Git is how you download OpenAlgo from GitHub. It&apos;s mandatory. Simple click through installer.
              </p>
              <div className="rounded-lg surface-container p-3 sm:p-4 space-y-2 font-mono text-xs sm:text-sm overflow-x-auto">
                <p className="text-on-surface-variant">Download from → <span className="text-primary">git-scm.com</span></p>
                <p className="text-on-surface-variant">Verify: <span className="text-primary">git --version</span></p>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 4: Install UV (Fast Python Package Manager)" icon={Zap}>
              <p className="text-on-surface-variant mb-4">
                UV makes installing and running Python applications much faster. One command to install:
              </p>
              <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                <p className="text-primary">pip install uv</p>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 5: Clone & Configure OpenAlgo" icon={Server}>
              <div className="space-y-4 text-on-surface-variant">
                <p>Create a project folder, then clone OpenAlgo:</p>
                <div className="rounded-lg surface-container p-3 sm:p-4 space-y-2 font-mono text-xs sm:text-sm overflow-x-auto">
                  <p className="text-primary">git clone https://github.com/marketcalls/openalgo.git</p>
                  <p className="text-primary">cd openalgo</p>
                  <p className="text-primary">cp .sample.env .env</p>
                </div>
                <p>
                  Edit the <code className="px-1.5 py-0.5 rounded surface-high text-xs text-on-surface">.env</code> file and add your broker API key and secret.
                  Get these from your broker&apos;s developer portal. Also set your redirect URL to match your broker name.
                </p>
                <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
                  <p className="text-sm">
                    <strong className="text-on-surface">Security tip:</strong> The .env file has pepper keys for encryption.
                    Change them once when first setting up, then <strong className="text-on-surface">never change again</strong> or you won&apos;t be able to log in.
                  </p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 6: Run OpenAlgo!" icon={Play}>
              <div className="space-y-4 text-on-surface-variant">
                <p>One command to start everything:</p>
                <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                  <p className="text-primary">uv run app.py</p>
                </div>
                <p>
                  First run installs ~177 libraries (takes 2 to 3 minutes). After that, OpenAlgo starts on <code className="px-1.5 py-0.5 rounded surface-high text-xs text-on-surface">localhost:5000</code>.
                  Open it in your browser, create your account (first user = admin), and connect your broker.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <div className="rounded-lg surface-container p-3 text-center">
                    <p className="text-2xl font-bold text-primary">~680 MB</p>
                    <p className="text-xs text-on-surface-variant">Virtual environment size</p>
                  </div>
                  <div className="rounded-lg surface-container p-3 text-center">
                    <p className="text-2xl font-bold text-primary">177</p>
                    <p className="text-xs text-on-surface-variant">Python libraries installed</p>
                  </div>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Optional: Node.js (for AI Tools & Skills)" icon={Puzzle}>
              <p className="text-on-surface-variant">
                Only needed if you want to use AI coding tools like Claude Code or OpenAI Codex to build strategies,
                or if you want to use OpenAlgo Skills for backtesting. Not required for basic trading.
              </p>
            </ExpandableCard>
          </div>
        </div>
      </div>

      {/* Section 7: Key Features at a Glance */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Key Features</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              What you get out of the box with OpenAlgo.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[
              {
                icon: ToggleLeft,
                title: "Live & Analyzer Mode",
                desc: "Flip between live trading and sandbox mode with one click. Test strategies with virtual capital before going live. Orders route to the correct mode automatically.",
                color: "text-secondary bg-secondary/10"
              },
              {
                icon: Layers,
                title: "Host Python Strategies",
                desc: "Upload Python scripts directly into OpenAlgo. Schedule them for specific days and times. View logs in real-time. No external server needed.",
                color: "text-primary bg-primary/10"
              },
              {
                icon: Search,
                title: "Symbol Search",
                desc: "OpenAlgo uses a universal symbol format across all brokers. Search any symbol (stocks, futures, options) and get the exact OpenAlgo format to use in your code.",
                color: "text-tertiary bg-tertiary/10"
              },
              {
                icon: Zap,
                title: "Real-Time WebSockets",
                desc: "Stream up to 3,000 symbols of live market data per connection. Built with raw WebSocket implementation (not SDKs) for maximum speed.",
                color: "text-secondary bg-secondary/10"
              },
              {
                icon: Bot,
                title: "AI-Powered Strategy Building",
                desc: "Use Claude, ChatGPT, or Codex with OpenAlgo's documentation to generate trading strategies. Feed the SDK docs as context and describe what you want.",
                color: "text-primary bg-primary/10"
              },
              {
                icon: Shield,
                title: "Built-in Rate Limits",
                desc: "SEBI mandates 10 orders/second for retail traders. OpenAlgo enforces this automatically along with session expiry at 3 AM IST.",
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">TradingView &amp; Webhooks</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              If you use TradingView, here&apos;s how signals reach OpenAlgo on your desktop.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border">
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-5 sm:mb-6">
              TradingView runs in the cloud, but OpenAlgo runs on your local machine (localhost).
              To bridge this gap, you need a tunnel service that forwards webhook signals to your desktop.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
              {[
                { name: "ngrok", desc: "Free, easy to set up", tag: "Popular" },
                { name: "Dev Tunnel", desc: "Microsoft's solution, recommended", tag: "Recommended" },
                { name: "Cloudflare", desc: "Most reliable & secure", tag: "Advanced" },
              ].map(t => (
                <div key={t.name} className="rounded-lg sm:rounded-xl surface-container p-3 sm:p-4 text-center">
                  <span className="font-label text-label-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t.tag}</span>
                  <p className="font-semibold text-on-surface mt-2">{t.name}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Not using TradingView?</strong> If you build strategies in Python
                directly, you don&apos;t need any tunnel at all. Python strategies run inside OpenAlgo itself and communicate
                directly via the local API. This is also the <strong className="text-on-surface">completely free</strong> option.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-tertiary/5 p-4 border-l-4 border-l-tertiary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Hosting on a server?</strong> If you deploy OpenAlgo on your own VPS
                or domain (e.g., <code className="px-1 py-0.5 rounded surface-high text-xs">myalgo.mydomain.com</code>),
                it acts as a public webhook endpoint. No tunnel needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 9: Important Things to Remember */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Things to Remember</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              Important tips from the community for new users.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Daily login is mandatory",
                desc: "Broker tokens expire every night. Log in daily between 8 to 9 AM IST. There's no way around this. It's a SEBI regulation.",
                icon: Clock,
              },
              {
                title: "Test in Analyzer mode first",
                desc: "Always test strategies in sandbox/analyzer mode before going live. One click to flip between modes. Don't risk real money on untested code.",
                icon: Shield,
              },
              {
                title: "Start with intraday strategies (for hosted Python)",
                desc: "When hosting Python strategies inside OpenAlgo, positional strategies don't survive restarts. The strategy forgets open positions. Stick to intraday for hosted strategies. This doesn't apply to external platforms like TradingView or Amibroker.",
                icon: Zap,
              },
              {
                title: "Don't change .env pepper keys after setup",
                desc: "The encryption keys in your .env file are set once. Changing them later means you won't be able to log in. Generate random keys on first setup only.",
                icon: Lock,
              },
              {
                title: "Respect broker rate limits",
                desc: "SEBI allows 10 orders/second. Fetching historical data frequently also counts against limits. 5 to 10 strategies is a practical maximum.",
                icon: AlertTriangle,
              },
              {
                title: "Don't disturb during live markets",
                desc: "If a strategy is running live, don't restart OpenAlgo or flip modes mid-session. Let it complete its cycle.",
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Beyond the Core</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              OpenAlgo has an entire open-source ecosystem of tools, apps, and integrations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { emoji: "📊", name: "Excel Add-in", desc: "Trade from spreadsheets" },
              { emoji: "📱", name: "Mobile App", desc: "Flutter-based trading terminal" },
              { emoji: "🚄", name: "Fast Scalper", desc: "High-speed Rust + Tauri app" },
              { emoji: "🔄", name: "AlgoMirror", desc: "Multi-account orchestrator" },
              { emoji: "🤖", name: "MCP / AI Agents", desc: "AI-powered trading" },
              { emoji: "📈", name: "OpenAlgo Chart", desc: "TradingView lightweight charts" },
              { emoji: "🔀", name: "OpenAlgo Flow", desc: "N8N workflow automation" },
              { emoji: "📚", name: "Historify", desc: "Historical data platform" },
              { emoji: "🧩", name: "Chrome Plugin", desc: "Browser extension" },
            ].map(tool => (
              <div key={tool.name} className="obsidian-card rounded-lg sm:rounded-xl p-3 sm:p-4 ghost-border hover-lift text-center">
                <span className="text-xl sm:text-2xl">{tool.emoji}</span>
                <p className="font-semibold text-xs sm:text-sm text-on-surface mt-1.5 sm:mt-2">{tool.name}</p>
                <p className="text-xs text-on-surface-variant mt-1">{tool.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-on-surface-variant mt-6">
            Everything is open source. Explore all projects on{" "}
            <a href="https://github.com/marketcalls" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              GitHub <ExternalLink className="w-3 h-3 inline" />
            </a>
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 sm:py-20 md:py-24 surface-low">
        <div className="container max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Ready to Start?</h2>
          <p className="text-base sm:text-lg text-on-surface-variant mb-8 sm:mb-10">
            You&apos;ve got the knowledge. Now set up your own algo trading platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                Read the Docs
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View Source Code
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/discord">
                <MessageCircle className="mr-2 h-4 w-4" />
                Join Community
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
