"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight, Github, Terminal, MessageSquare, Sparkles, Zap, Shield,
  Server, Package, Copy, Check, ChevronRight, ExternalLink, Bot, Brain,
  TrendingUp, Activity, BarChart3, Search, Wallet, ListOrdered,
  Target, Layers, Split, Edit3, XCircle, Ban, LogOut, LineChart, BookOpen,
  Calendar, Clock, Info, ShieldCheck, AlertTriangle, MonitorSmartphone,
  Laptop, Apple, Cpu, Workflow, MessageCircle, Sigma
} from "lucide-react"
import { useState } from "react"
import { useI18n } from "@/components/i18n/LanguageProvider"

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
      aria-label={t('mcp.copy')}
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

const CONFIG_SAMPLES = {
  windows: `{
  "mcpServers": {
    "openalgo": {
      "command": "D:\\\\openalgo\\\\.venv\\\\Scripts\\\\python.exe",
      "args": [
        "D:\\\\openalgo\\\\mcp\\\\mcpserver.py",
        "YOUR_API_KEY_HERE",
        "http://127.0.0.1:5000"
      ]
    }
  }
}`,
  macos: `{
  "mcpServers": {
    "openalgo": {
      "command": "/Users/your_username/openalgo/.venv/bin/python3",
      "args": [
        "/Users/your_username/openalgo/mcp/mcpserver.py",
        "YOUR_API_KEY_HERE",
        "http://127.0.0.1:5000"
      ]
    }
  }
}`,
  linux: `{
  "mcpServers": {
    "openalgo": {
      "command": "/home/your_username/openalgo/.venv/bin/python3",
      "args": [
        "/home/your_username/openalgo/mcp/mcpserver.py",
        "YOUR_API_KEY_HERE",
        "http://127.0.0.1:5000"
      ]
    }
  }
}`,
}

const CONFIG_PATHS = {
  windows: [
    { app: "Claude Desktop", path: "%APPDATA%\\Claude\\claude_desktop_config.json" },
    { app: "Windsurf", path: "%APPDATA%\\Windsurf\\mcp_config.json" },
    { app: "Cursor", path: "%APPDATA%\\Cursor\\User\\settings.json" },
  ],
  macos: [
    { app: "Claude Desktop", path: "~/Library/Application Support/Claude/claude_desktop_config.json" },
    { app: "Windsurf", path: "~/.config/windsurf/mcp_config.json" },
    { app: "Cursor", path: "~/Library/Application Support/Cursor/User/settings.json" },
  ],
  linux: [
    { app: "Claude Desktop", path: "~/.config/Claude/claude_desktop_config.json" },
    { app: "Windsurf", path: "~/.config/windsurf/mcp_config.json" },
    { app: "Cursor", path: "~/.config/Cursor/User/settings.json" },
  ],
}

export default function MCPPage() {
  const { t } = useI18n()
  const [os, setOs] = useState("windows")

  const osTabs = [
    { id: "windows", label: "Windows", icon: MonitorSmartphone },
    { id: "macos", label: "macOS", icon: Apple },
    { id: "linux", label: "Linux", icon: Terminal },
  ]

  const capabilities = [
    { icon: MessageSquare, title: t('mcp.cap1t'), desc: t('mcp.cap1d') },
    { icon: Brain, title: t('mcp.cap2t'), desc: t('mcp.cap2d') },
    { icon: Activity, title: t('mcp.cap3t'), desc: t('mcp.cap3d') },
    { icon: Shield, title: t('mcp.cap4t'), desc: t('mcp.cap4d') },
    { icon: Layers, title: t('mcp.cap5t'), desc: t('mcp.cap5d') },
    { icon: Workflow, title: t('mcp.cap6t'), desc: t('mcp.cap6d') },
  ]

  const prompts = [
    { icon: Target, text: t('mcp.prompt1') },
    { icon: ListOrdered, text: t('mcp.prompt2') },
    { icon: TrendingUp, text: t('mcp.prompt3') },
    { icon: Ban, text: t('mcp.prompt4') },
    { icon: Wallet, text: t('mcp.prompt5') },
    { icon: LineChart, text: t('mcp.prompt6') },
    { icon: Search, text: t('mcp.prompt7') },
    { icon: LogOut, text: t('mcp.prompt8') },
  ]

  const flowSteps = [
    {
      icon: Bot,
      title: t('mcp.flow1t'),
      desc: t('mcp.flow1d'),
      accent: "text-primary",
    },
    {
      icon: Brain,
      title: t('mcp.flow2t'),
      desc: t('mcp.flow2d'),
      accent: "text-secondary",
    },
    {
      icon: Server,
      title: t('mcp.flow3t'),
      desc: t('mcp.flow3d'),
      accent: "text-tertiary",
    },
    {
      icon: TrendingUp,
      title: t('mcp.flow4t'),
      desc: t('mcp.flow4d'),
      accent: "text-primary",
    },
  ]

  const toolGroups = [
    {
      title: t('mcp.tg1.title'),
      icon: ListOrdered,
      tools: [
        { label: t('mcp.tg1.i1l'), desc: t('mcp.tg1.i1d') },
        { label: t('mcp.tg1.i2l'), desc: t('mcp.tg1.i2d') },
        { label: t('mcp.tg1.i3l'), desc: t('mcp.tg1.i3d') },
        { label: t('mcp.tg1.i4l'), desc: t('mcp.tg1.i4d') },
        { label: t('mcp.tg1.i5l'), desc: t('mcp.tg1.i5d') },
        { label: t('mcp.tg1.i6l'), desc: t('mcp.tg1.i6d') },
      ],
    },
    {
      title: t('mcp.tg2.title'),
      icon: Sigma,
      tools: [
        { label: t('mcp.tg2.i1l'), desc: t('mcp.tg2.i1d') },
        { label: t('mcp.tg2.i2l'), desc: t('mcp.tg2.i2d') },
        { label: t('mcp.tg2.i3l'), desc: t('mcp.tg2.i3d') },
        { label: t('mcp.tg2.i4l'), desc: t('mcp.tg2.i4d') },
        { label: t('mcp.tg2.i5l'), desc: t('mcp.tg2.i5d') },
        { label: t('mcp.tg2.i6l'), desc: t('mcp.tg2.i6d') },
      ],
    },
    {
      title: t('mcp.tg3.title'),
      icon: Target,
      tools: [
        { label: t('mcp.tg3.i1l'), desc: t('mcp.tg3.i1d') },
        { label: t('mcp.tg3.i2l'), desc: t('mcp.tg3.i2d') },
        { label: t('mcp.tg3.i3l'), desc: t('mcp.tg3.i3d') },
        { label: t('mcp.tg3.i4l'), desc: t('mcp.tg3.i4d') },
        { label: t('mcp.tg3.i5l'), desc: t('mcp.tg3.i5d') },
        { label: t('mcp.tg3.i6l'), desc: t('mcp.tg3.i6d') },
      ],
    },
    {
      title: t('mcp.tg4.title'),
      icon: Activity,
      tools: [
        { label: t('mcp.tg4.i1l'), desc: t('mcp.tg4.i1d') },
        { label: t('mcp.tg4.i2l'), desc: t('mcp.tg4.i2d') },
        { label: t('mcp.tg4.i3l'), desc: t('mcp.tg4.i3d') },
      ],
    },
    {
      title: t('mcp.tg5.title'),
      icon: BarChart3,
      tools: [
        { label: t('mcp.tg5.i1l'), desc: t('mcp.tg5.i1d') },
        { label: t('mcp.tg5.i2l'), desc: t('mcp.tg5.i2d') },
        { label: t('mcp.tg5.i3l'), desc: t('mcp.tg5.i3d') },
        { label: t('mcp.tg5.i4l'), desc: t('mcp.tg5.i4d') },
      ],
    },
    {
      title: t('mcp.tg6.title'),
      icon: Search,
      tools: [
        { label: t('mcp.tg6.i1l'), desc: t('mcp.tg6.i1d') },
        { label: t('mcp.tg6.i2l'), desc: t('mcp.tg6.i2d') },
        { label: t('mcp.tg6.i3l'), desc: t('mcp.tg6.i3d') },
        { label: t('mcp.tg6.i4l'), desc: t('mcp.tg6.i4d') },
        { label: t('mcp.tg6.i5l'), desc: t('mcp.tg6.i5d') },
        { label: t('mcp.tg6.i6l'), desc: t('mcp.tg6.i6d') },
      ],
    },
    {
      title: t('mcp.tg7.title'),
      icon: Info,
      tools: [
        { label: t('mcp.tg7.i1l'), desc: t('mcp.tg7.i1d') },
        { label: t('mcp.tg7.i2l'), desc: t('mcp.tg7.i2d') },
        { label: t('mcp.tg7.i3l'), desc: t('mcp.tg7.i3d') },
        { label: t('mcp.tg7.i4l'), desc: t('mcp.tg7.i4d') },
        { label: t('mcp.tg7.i5l'), desc: t('mcp.tg7.i5d') },
        { label: t('mcp.tg7.i6l'), desc: t('mcp.tg7.i6d') },
      ],
    },
  ]

  const clients = [
    { name: "Claude Desktop", desc: t('mcp.client1d') },
    { name: "Cursor", desc: t('mcp.client2d') },
    { name: "Windsurf", desc: t('mcp.client3d') },
    { name: "ChatGPT", desc: t('mcp.client4d') },
  ]

  const exchanges = [
    { code: "NSE", name: t('mcp.exch.nse') },
    { code: "NFO", name: t('mcp.exch.nfo') },
    { code: "CDS", name: t('mcp.exch.cds') },
    { code: "BSE", name: t('mcp.exch.bse') },
    { code: "BFO", name: t('mcp.exch.bfo') },
    { code: "BCD", name: t('mcp.exch.bcd') },
    { code: "MCX", name: t('mcp.exch.mcx') },
    { code: "NCDEX", name: t('mcp.exch.ncdex') },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 obsidian-grid opacity-30 -z-10" />
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-tertiary bg-tertiary/10">{t('mcp.hero.badge1')}</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-secondary bg-secondary/10">{t('mcp.hero.badge2')}</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-primary bg-primary/10">{t('mcp.hero.badge3')}</span>
          </div>

          <h1 className="text-display-lg sm:text-[4rem] leading-[1.05] mb-6 tracking-tight">
            <span className="block text-on-surface">{t('mcp.hero.h1a')}</span>
            <span className="text-on-surface ">
              {t('mcp.hero.h1b')}
            </span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-3 leading-relaxed">
            {t('mcp.hero.desc')}
          </p>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto mb-10">
            {t('mcp.hero.sub')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#quickstart" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> {t('mcp.hero.ctaQuickstart')} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/marketcalls/openalgo/tree/main/mcp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> {t('mcp.hero.ctaGithub')} <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://docs.openalgo.in/mcp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> {t('mcp.hero.ctaDocs')}
              </a>
            </Button>
          </div>
        </div>

        {/* Example Conversation */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('mcp.chat.title')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('mcp.chat.sub')}
          </p>
          <div className="obsidian-card rounded-2xl p-6 md:p-8 ghost-border max-w-3xl mx-auto">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 surface-low rounded-xl rounded-tl-sm p-4">
                  <p className="text-sm text-on-surface">{t('mcp.chat.user')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="shrink-0 h-8 w-8 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-tertiary" />
                </div>
                <div className="flex-1 surface-container rounded-xl rounded-tr-sm p-4">
                  <p className="text-sm text-on-surface mb-3">{t('mcp.chat.ai1')}</p>
                  <div className="space-y-1.5 text-xs font-mono text-on-surface-variant surface-high p-3 rounded-lg">
                    <div>→ BANKNIFTY 52000 CE: +50 @ ₹185 (MIS)</div>
                    <div>→ BANKNIFTY 51800 PE: -50 @ ₹142 (MIS)</div>
                  </div>
                  <p className="text-sm text-on-surface mt-3 mb-2">{t('mcp.chat.ai2')}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-tertiary" />
                    <span className="text-on-surface">{t('mcp.chat.done')} <span className="font-semibold text-tertiary">+ ₹4,250</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center font-label text-label-sm text-on-surface-variant mt-4">
            {t('mcp.chat.note')}
          </p>
        </div>

        {/* Capabilities */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('mcp.why.title')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('mcp.why.sub')}
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {capabilities.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="obsidian-card rounded-xl p-6 hover-lift ghost-border">
                <div className="inline-flex p-2.5 rounded-lg surface-container mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-on-surface">{title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('mcp.how.title')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('mcp.how.sub')}
          </p>
          <div className="grid md:grid-cols-4 gap-4 relative">
            {flowSteps.map(({ icon: Icon, title, desc, accent }, i) => (
              <div key={title} className="relative">
                <div className="obsidian-card rounded-xl p-5 ghost-border h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg surface-container">
                      <Icon className={`h-5 w-5 ${accent}`} />
                    </div>
                    <span className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">{t('mcp.how.step').replace('{n}', String(i + 1))}</span>
                  </div>
                  <h3 className="font-semibold text-on-surface mb-1.5">{title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10 h-5 w-5 items-center justify-center rounded-full surface-container ghost-border">
                    <ChevronRight className="h-3 w-3 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('mcp.prompts.title')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('mcp.prompts.sub')}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {prompts.map(({ icon: Icon, text }, i) => (
              <div key={i} className="obsidian-card rounded-xl p-4 ghost-border flex items-start gap-3 hover-lift">
                <div className="shrink-0 h-8 w-8 rounded-lg surface-container flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-on-surface leading-relaxed pt-1">&ldquo;{text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Available Tools */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('mcp.tools.title')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('mcp.tools.sub')}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {toolGroups.map(({ title, icon: Icon, tools }) => (
              <div key={title} className="obsidian-card rounded-xl p-6 ghost-border">
                <div className="flex items-center gap-3 mb-5">
                  <div className="inline-flex p-2 rounded-lg surface-container">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-on-surface">{title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {tools.map(({ label, desc }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="text-sm leading-relaxed">
                        <span className="text-on-surface font-medium">{label}</span>
                        <span className="text-on-surface-variant"> - </span>
                        <span className="text-on-surface-variant">{desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Clients */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('mcp.clients.title')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('mcp.clients.sub')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clients.map(({ name, desc }) => (
              <div key={name} className="obsidian-card rounded-xl p-5 text-center hover-lift ghost-border">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl surface-container mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">{name}</h3>
                <p className="text-xs text-on-surface-variant">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quickstart */}
        <div id="quickstart" className="mb-20 scroll-mt-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('mcp.quickstart.title')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('mcp.quickstart.sub')}
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="obsidian-card rounded-xl p-6 ghost-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">1</span>
                <h3 className="text-lg font-semibold text-on-surface">{t('mcp.qs1.title')}</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-on-surface-variant mb-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{t('mcp.qs1.b1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{t('mcp.qs1.b2a')}<span className="text-on-surface font-medium">{t('mcp.qs1.b2b')}</span>{t('mcp.qs1.b2c')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{t('mcp.qs1.b3')}</span>
                </li>
              </ul>
              <Button variant="outline" size="sm" asChild>
                <a href="/getting-started" className="flex items-center gap-2">
                  {t('mcp.qs1.cta')} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>

            {/* Step 2 */}
            <div className="obsidian-card rounded-xl p-6 ghost-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">2</span>
                <h3 className="text-lg font-semibold text-on-surface">{t('mcp.qs2.title')}</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                {t('mcp.qs2.desc')}
              </p>

              {/* OS Tabs */}
              <div className="inline-flex surface-low rounded-lg p-1 mb-4 ghost-border">
                {osTabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setOs(id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-label text-label-md transition-all ${
                      os === id
                        ? "surface-container text-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              <CodeBlock copyText={CONFIG_SAMPLES[os]}>
                {CONFIG_SAMPLES[os]}
              </CodeBlock>

              <div className="mt-5">
                <p className="font-label text-label-lg text-on-surface-variant mb-3">{t('mcp.qs2.pathsLabel')}</p>
                <div className="space-y-2">
                  {CONFIG_PATHS[os].map(({ app, path }) => (
                    <div key={app} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-sm">
                      <span className="font-medium text-on-surface sm:w-36 shrink-0">{app}</span>
                      <code className="text-xs font-mono surface-container px-2 py-1 rounded text-on-surface-variant break-all">{path}</code>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant mt-3">
                  {t('mcp.qs2.helpPre')}{" "}
                  <a href="https://docs.openalgo.in/mcp" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors">
                    {t('mcp.qs2.helpLink')}
                  </a>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="obsidian-card rounded-xl p-6 ghost-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">3</span>
                <h3 className="text-lg font-semibold text-on-surface">{t('mcp.qs3.title')}</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                {t('mcp.qs3.desc')}
              </p>
              <CodeBlock copyText={'"' + t('mcp.qs3.prompt') + '"'}>
                <span className="text-on-surface-variant/50">{t('mcp.qs3.you')}</span>{" "}
                <span className="text-on-surface">&ldquo;{t('mcp.qs3.prompt')}&rdquo;</span>
              </CodeBlock>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('mcp.exch.title')}</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            {t('mcp.exch.sub')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {exchanges.map(({ code, name }) => (
              <div key={code} className="obsidian-card rounded-xl p-4 text-center ghost-border">
                <div className="font-bold text-primary text-sm mb-0.5">{code}</div>
                <div className="font-label text-label-sm text-on-surface-variant">{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="mb-20">
          <div className="obsidian-card rounded-xl p-6 ghost-border">
            <div className="flex items-start gap-4">
              <div className="shrink-0 inline-flex p-2.5 rounded-lg bg-secondary/10">
                <ShieldCheck className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface mb-2">{t('mcp.sec.title')}</h3>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{t('mcp.sec.b1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{t('mcp.sec.b2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <span>{t('mcp.sec.b3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-headline-md mb-4 text-on-surface">{t('mcp.cta.title')}</h2>
          <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
            {t('mcp.cta.sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo/tree/main/mcp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> {t('mcp.cta.get')} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://docs.openalgo.in/mcp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> {t('mcp.cta.docs')}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/discord" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> {t('mcp.cta.discord')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
