"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight, Github, Terminal, MessageSquare, Sparkles, Zap, Shield,
  Server, Package, Copy, Check, ChevronRight, ExternalLink, Bot, Brain,
  TrendingUp, Activity, BarChart3, Search, Wallet, ListOrdered,
  Target, Layers, Split, Edit3, XCircle, Ban, LogOut, LineChart, BookOpen,
  Calendar, Clock, Info, ShieldCheck, AlertTriangle, MonitorSmartphone,
  Laptop, Apple, Cpu, Workflow, MessageCircle
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

const CONFIG_SAMPLES = {
  windows: `{
  "mcpServers": {
    "openalgo": {
      "command": "D:\\\\openalgo-mcp\\\\openalgo\\\\.venv\\\\Scripts\\\\python.exe",
      "args": [
        "D:\\\\openalgo-mcp\\\\openalgo\\\\mcp\\\\mcpserver.py",
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
  const [os, setOs] = useState("windows")

  const osTabs = [
    { id: "windows", label: "Windows", icon: MonitorSmartphone },
    { id: "macos", label: "macOS", icon: Apple },
    { id: "linux", label: "Linux", icon: Terminal },
  ]

  const capabilities = [
    { icon: MessageSquare, title: "Talk, Don't Click", desc: "\"Buy 100 RELIANCE at market.\" That's it. No forms, no menus &mdash; just tell your AI what to do." },
    { icon: Brain, title: "One Instruction, Many Steps", desc: "Say \"check my positions and close the losers\" and your AI does both in one go." },
    { icon: Activity, title: "Live Prices On Demand", desc: "Ask for quotes, market depth, or historical charts right inside your chat. Real numbers, real time." },
    { icon: Shield, title: "Your Data Stays With You", desc: "Everything runs on your own computer. Your API key and trades never leave your machine." },
    { icon: Layers, title: "Same Chat, Any Broker", desc: "Works with every broker OpenAlgo supports. Switch brokers without learning anything new." },
    { icon: Workflow, title: "25+ Built-In Actions", desc: "Place orders, check funds, track trades, search symbols &mdash; your AI already knows how." },
  ]

  const prompts = [
    { icon: Target, text: "Place a buy order for 100 shares of RELIANCE at market price" },
    { icon: ListOrdered, text: "Show me my current positions and today's P&L" },
    { icon: TrendingUp, text: "What's the latest quote for NIFTY?" },
    { icon: Ban, text: "Cancel all my pending orders" },
    { icon: Wallet, text: "How much margin do I have available?" },
    { icon: LineChart, text: "Get 5-minute historical data for BANKNIFTY for the last trading day" },
    { icon: Search, text: "Find all weekly NIFTY options expiring this Thursday" },
    { icon: LogOut, text: "Close all my MIS positions before 3:15 PM" },
  ]

  const flowSteps = [
    {
      icon: Bot,
      title: "You Ask",
      desc: "\"Show my open positions and close the losing ones.\"",
      accent: "text-primary",
    },
    {
      icon: Brain,
      title: "AI Understands",
      desc: "Claude, Cursor, Windsurf, or ChatGPT figures out what you want.",
      accent: "text-secondary",
    },
    {
      icon: Server,
      title: "OpenAlgo Acts",
      desc: "Your OpenAlgo running on your computer handles the request.",
      accent: "text-tertiary",
    },
    {
      icon: TrendingUp,
      title: "Broker Executes",
      desc: "The order goes to your broker and hits the exchange &mdash; same as always.",
      accent: "text-primary",
    },
  ]

  const toolGroups = [
    {
      title: "Placing & Managing Orders",
      icon: ListOrdered,
      tools: [
        { label: "Place an order", desc: "Market, limit, or stop-loss — regular or intraday" },
        { label: "Smart order", desc: "Automatically adjusts to your existing position size" },
        { label: "Basket orders", desc: "Send multiple orders in one go (like option spreads)" },
        { label: "Split big orders", desc: "Break a large order into smaller slices to get better fills" },
        { label: "Modify an order", desc: "Change price or quantity of a pending order" },
        { label: "Cancel orders", desc: "One at a time, or all of them at once" },
      ],
    },
    {
      title: "Positions & Holdings",
      icon: Target,
      tools: [
        { label: "Check open position", desc: "Your current position in any stock or contract" },
        { label: "Square off all", desc: "Close every open intraday position at once" },
        { label: "Position book", desc: "See everything you're currently holding" },
        { label: "Long-term holdings", desc: "Your delivery / demat holdings" },
        { label: "Funds & margins", desc: "Cash balance and margin available to trade" },
      ],
    },
    {
      title: "Orders & Trades Summary",
      icon: Activity,
      tools: [
        { label: "Order status", desc: "See if a specific order was filled, pending, or rejected" },
        { label: "Today's order book", desc: "All orders placed during the day" },
        { label: "Trade book", desc: "All orders that actually got filled" },
      ],
    },
    {
      title: "Live Market Data",
      icon: BarChart3,
      tools: [
        { label: "Live quote", desc: "Current price, bid, ask, and day's high/low" },
        { label: "Market depth", desc: "Top 5 buy/sell levels in the order book" },
        { label: "Historical charts", desc: "Past candles for any timeframe — daily, hourly, 5-min, etc." },
      ],
    },
    {
      title: "Finding Instruments",
      icon: Search,
      tools: [
        { label: "Search any symbol", desc: "Across NSE, BSE, F&O, commodity — all exchanges" },
        { label: "Symbol details", desc: "Lot size, tick size, expiry, strike, and more" },
        { label: "Expiry dates", desc: "Upcoming expiries for options and futures" },
        { label: "Available intervals", desc: "Which chart timeframes your broker supports" },
      ],
    },
    {
      title: "Helpful Extras",
      icon: Info,
      tools: [
        { label: "OpenAlgo version", desc: "Which version is running on your computer" },
        { label: "Valid order types", desc: "Quickly check what your broker accepts" },
      ],
    },
  ]

  const clients = [
    { name: "Claude Desktop", desc: "Anthropic's native MCP-first desktop app." },
    { name: "Cursor", desc: "Trade from within your editor." },
    { name: "Windsurf", desc: "MCP-enabled AI IDE from Codeium." },
    { name: "ChatGPT", desc: "Works wherever MCP is supported." },
  ]

  const exchanges = [
    { code: "NSE", name: "NSE Equity" },
    { code: "NFO", name: "NSE F&O" },
    { code: "CDS", name: "NSE Currency" },
    { code: "BSE", name: "BSE Equity" },
    { code: "BFO", name: "BSE F&O" },
    { code: "BCD", name: "BSE Currency" },
    { code: "MCX", name: "Commodity" },
    { code: "NCDEX", name: "NCDEX" },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 obsidian-grid opacity-30 -z-10" />
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-tertiary bg-tertiary/10">Open Source</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-secondary bg-secondary/10">Works With Claude &amp; ChatGPT</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-primary bg-primary/10">Runs On Your Computer</span>
          </div>

          <h1 className="text-display-lg sm:text-[4rem] leading-[1.05] mb-6 tracking-tight">
            <span className="block text-on-surface">Trade Just By</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary animate-gradient">
              Asking Your AI
            </span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-3 leading-relaxed">
            OpenAlgo MCP connects your AI chat app &mdash; Claude, Cursor, Windsurf, or ChatGPT &mdash;
            to your OpenAlgo trading account. Place orders, check positions, and pull live prices by simply talking to it.
          </p>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto mb-10">
            No dashboards. No clicking. Just type what you want, and your AI gets it done through your broker.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#quickstart" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Quickstart <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/marketcalls/openalgo-mcp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> View on GitHub <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://docs.openalgo.in/mcp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Docs
              </a>
            </Button>
          </div>
        </div>

        {/* Example Conversation */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">What It Feels Like</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Here&apos;s a real exchange between a trader and their AI. Notice you never touched a dashboard.
          </p>
          <div className="obsidian-card rounded-2xl p-6 md:p-8 ghost-border max-w-3xl mx-auto">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 surface-low rounded-xl rounded-tl-sm p-4">
                  <p className="text-sm text-on-surface">I'm seeing weakness in banking. Square off my MIS positions in BANKNIFTY options and show me the P&L.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-tertiary" />
                </div>
                <div className="flex-1 surface-container rounded-xl rounded-tr-sm p-4">
                  <p className="text-sm text-on-surface mb-3">On it. Let me pull up your BANKNIFTY MIS positions first...</p>
                  <div className="space-y-1.5 text-xs font-mono text-on-surface-variant surface-high p-3 rounded-lg">
                    <div>→ BANKNIFTY 52000 CE: +50 @ ₹185 (MIS)</div>
                    <div>→ BANKNIFTY 51800 PE: -50 @ ₹142 (MIS)</div>
                  </div>
                  <p className="text-sm text-on-surface mt-3 mb-2">Closing both now...</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-tertiary" />
                    <span className="text-on-surface">Done. Realised P&L today: <span className="font-semibold text-tertiary">+ ₹4,250</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center font-label text-label-sm text-on-surface-variant mt-4">
            Example conversation. Your AI does the lookup and executes &mdash; you just confirm and watch.
          </p>
        </div>

        {/* Capabilities */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Why Traders Like It</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Made for traders who&apos;d rather just say what they want than click through seven screens.
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">How It Works</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            You talk, your AI acts, OpenAlgo runs it, your broker executes. Four steps &mdash; and you only handle the first one.
          </p>
          <div className="grid md:grid-cols-4 gap-4 relative">
            {flowSteps.map(({ icon: Icon, title, desc, accent }, i) => (
              <div key={title} className="relative">
                <div className="obsidian-card rounded-xl p-5 ghost-border h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg surface-container">
                      <Icon className={`h-5 w-5 ${accent}`} />
                    </div>
                    <span className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">Step {i + 1}</span>
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Things You Can Just Ask</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Any of these work straight away once you&apos;ve set things up. No special phrasing required &mdash; speak naturally.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {prompts.map(({ icon: Icon, text }, i) => (
              <div key={i} className="obsidian-card rounded-xl p-4 ghost-border flex items-start gap-3 hover-lift">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg surface-container flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-on-surface leading-relaxed pt-1">&ldquo;{text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Available Tools */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Everything You Can Do</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Anything OpenAlgo can do, your AI can now do for you. Grouped the way traders actually think.
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
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="text-sm leading-relaxed">
                        <span className="text-on-surface font-medium">{label}</span>
                        <span className="text-on-surface-variant"> — </span>
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Works With Your Favourite AI</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Use the chat app you already like. No need to switch or learn a new tool.
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Getting Started</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Three quick steps &mdash; a one-time setup, and you&apos;re talking to your trading account.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="obsidian-card rounded-xl p-6 ghost-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">1</span>
                <h3 className="text-lg font-semibold text-on-surface">Have OpenAlgo Running With Your Broker</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-on-surface-variant mb-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Make sure OpenAlgo is running on your computer and your broker is logged in.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Open OpenAlgo, go to <span className="text-on-surface font-medium">Settings → API Keys</span>, and copy your key. Keep it handy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Download the MCP setup files from GitHub. The full setup guide walks through this in under a minute.</span>
                </li>
              </ul>
              <Button variant="outline" size="sm" asChild>
                <a href="/getting-started" className="flex items-center gap-2">
                  New to OpenAlgo? Start here <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>

            {/* Step 2 */}
            <div className="obsidian-card rounded-xl p-6 ghost-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">2</span>
                <h3 className="text-lg font-semibold text-on-surface">Tell Your AI About OpenAlgo</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                Pick your operating system below, copy the settings, and paste them into your AI app&apos;s config file.
                Replace the paths and API key with your own.
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
                <p className="font-label text-label-lg text-on-surface-variant mb-3">Where the settings file lives:</p>
                <div className="space-y-2">
                  {CONFIG_PATHS[os].map(({ app, path }) => (
                    <div key={app} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-sm">
                      <span className="font-medium text-on-surface sm:w-36 flex-shrink-0">{app}</span>
                      <code className="text-xs font-mono surface-container px-2 py-1 rounded text-on-surface-variant break-all">{path}</code>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant mt-3">
                  Need help with the exact paths?{" "}
                  <a href="https://docs.openalgo.in/mcp" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors">
                    See the detailed setup guide
                  </a>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="obsidian-card rounded-xl p-6 ghost-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">3</span>
                <h3 className="text-lg font-semibold text-on-surface">Restart Your AI App and Start Trading</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                Close and reopen Claude Desktop, Cursor, or Windsurf. OpenAlgo will be connected automatically.
                Try asking something simple first:
              </p>
              <CodeBlock copyText={'"Show me my funds and open positions"'}>
                <span className="text-on-surface-variant/50">you &gt;</span>{" "}
                <span className="text-on-surface">&ldquo;Show me my funds and open positions&rdquo;</span>
              </CodeBlock>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Exchanges You Can Trade</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Whatever your broker lets you trade through OpenAlgo, you can trade by chat.
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
              <div className="flex-shrink-0 inline-flex p-2.5 rounded-lg bg-secondary/10">
                <ShieldCheck className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-on-surface mb-2">A Few Things To Know</h3>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span>Everything runs on your own computer. Your orders and account info never leave your machine.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span>Your API key stays local &mdash; it&apos;s never uploaded or shared.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>AI can sometimes make mistakes. Always read what it&apos;s about to do before you say yes &mdash; especially for orders.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-headline-md mb-4 text-on-surface">Let your AI handle the clicks.</h2>
          <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
            Set it up once. After that, just talk. Your broker, your strategies, completely under your control.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo-mcp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> Get OpenAlgo MCP <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://docs.openalgo.in/mcp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Read the Docs
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/discord" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> Join Discord
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
