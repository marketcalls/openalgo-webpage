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
    { icon: MessageSquare, title: "Trade by Talking", desc: "\"Buy 100 RELIANCE at market.\" That's the whole interface. No forms, no clicking — just instructions." },
    { icon: Brain, title: "AI-Native Workflows", desc: "Chain market data, order placement, and position checks in a single prompt. The model picks the right tools." },
    { icon: Activity, title: "Live Market Access", desc: "Quotes, depth, and historical bars flow into the conversation. Ask questions, get answers with real numbers." },
    { icon: Shield, title: "Runs On Your Machine", desc: "The MCP server runs locally against your OpenAlgo instance. Your API key never leaves your computer." },
    { icon: Layers, title: "Multi-Broker, One Interface", desc: "Works with every broker OpenAlgo supports. Switch brokers without changing how you talk to your AI." },
    { icon: Workflow, title: "25+ Tools, One Server", desc: "Orders, positions, holdings, funds, quotes, historical data, instrument search — all exposed to the LLM." },
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
      title: "You",
      desc: "\"Show my open positions and square off the losers.\"",
      accent: "text-primary",
    },
    {
      icon: Brain,
      title: "AI Client",
      desc: "Claude, Cursor, Windsurf, or ChatGPT picks the right MCP tools to call.",
      accent: "text-secondary",
    },
    {
      icon: Server,
      title: "OpenAlgo MCP",
      desc: "Translates the call into OpenAlgo API requests running locally.",
      accent: "text-tertiary",
    },
    {
      icon: TrendingUp,
      title: "Your Broker",
      desc: "Orders hit the exchange via your existing OpenAlgo broker connection.",
      accent: "text-primary",
    },
  ]

  const toolGroups = [
    {
      title: "Order Management",
      icon: ListOrdered,
      tools: [
        { name: "place_order", desc: "Place market or limit orders" },
        { name: "place_smart_order", desc: "Position-aware order placement" },
        { name: "place_basket_order", desc: "Place multiple orders in one call" },
        { name: "place_split_order", desc: "Slice large orders into chunks" },
        { name: "modify_order", desc: "Modify an existing order" },
        { name: "cancel_order", desc: "Cancel a specific order" },
        { name: "cancel_all_orders", desc: "Cancel all orders for a strategy" },
      ],
    },
    {
      title: "Positions & Holdings",
      icon: Target,
      tools: [
        { name: "get_open_position", desc: "Current position for an instrument" },
        { name: "close_all_positions", desc: "Square off all positions for a strategy" },
        { name: "get_position_book", desc: "View all current positions" },
        { name: "get_holdings", desc: "View long-term holdings" },
        { name: "get_funds", desc: "Funds and margins available" },
      ],
    },
    {
      title: "Order Status & Tracking",
      icon: Activity,
      tools: [
        { name: "get_order_status", desc: "Status of a specific order" },
        { name: "get_order_book", desc: "All orders placed today" },
        { name: "get_trade_book", desc: "All executed trades" },
      ],
    },
    {
      title: "Market Data",
      icon: BarChart3,
      tools: [
        { name: "get_quote", desc: "Current LTP, bid, ask, OHLC" },
        { name: "get_market_depth", desc: "Level 5 order book" },
        { name: "get_historical_data", desc: "Historical candles by interval" },
      ],
    },
    {
      title: "Instrument Search",
      icon: Search,
      tools: [
        { name: "search_instruments", desc: "Search across all exchanges" },
        { name: "get_symbol_info", desc: "Full contract details" },
        { name: "get_expiry_dates", desc: "Derivative expiry calendar" },
        { name: "get_available_intervals", desc: "Supported candle intervals" },
      ],
    },
    {
      title: "Utilities",
      icon: Info,
      tools: [
        { name: "get_openalgo_version", desc: "Installed OpenAlgo version" },
        { name: "validate_order_constants", desc: "Valid order parameters" },
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
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-secondary bg-secondary/10">Model Context Protocol</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-primary bg-primary/10">AI Native</span>
          </div>

          <h1 className="text-display-lg sm:text-[4rem] leading-[1.05] mb-6 tracking-tight">
            <span className="block text-on-surface">Trade with</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary animate-gradient">
              Natural Language
            </span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-3 leading-relaxed">
            OpenAlgo MCP turns your AI assistant into a trading desk. Place orders, manage positions,
            pull market data, and run complete trading workflows — just by asking.
          </p>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto mb-10">
            It runs locally against your OpenAlgo server and works with Claude, Cursor, Windsurf, and ChatGPT.
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
            Instead of navigating dashboards, you hold a conversation with your trading platform.
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
                  <p className="text-sm text-on-surface mb-3">On it. Calling <code className="text-xs surface-high px-1.5 py-0.5 rounded font-label text-primary">get_position_book</code> to find your BANKNIFTY MIS positions...</p>
                  <div className="space-y-1.5 text-xs font-mono text-on-surface-variant surface-high p-3 rounded-lg">
                    <div>→ BANKNIFTY 52000 CE: +50 @ ₹185 (MIS)</div>
                    <div>→ BANKNIFTY 51800 PE: -50 @ ₹142 (MIS)</div>
                  </div>
                  <p className="text-sm text-on-surface mt-3 mb-2">Closing both via <code className="text-xs surface-high px-1.5 py-0.5 rounded font-label text-primary">close_all_positions</code>...</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-tertiary" />
                    <span className="text-on-surface">Done. Realised P&L today: <span className="font-semibold text-tertiary">+ ₹4,250</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center font-label text-label-sm text-on-surface-variant mt-4">
            Example interaction. Your AI picks the right MCP tools and OpenAlgo executes them on your broker.
          </p>
        </div>

        {/* Capabilities */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Why Traders Use It</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Built for traders who'd rather describe the trade than click through seven screens.
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
            MCP is a standard protocol for giving LLMs tools. OpenAlgo MCP exposes your trading stack as tools.
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
            Any of these prompts work out of the box once MCP is configured.
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">25+ Tools Exposed to Your AI</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Everything OpenAlgo can do, your AI can do — grouped by what traders actually need.
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
                <div className="space-y-2.5">
                  {tools.map(({ name, desc }) => (
                    <div key={name} className="flex items-start gap-3">
                      <code className="text-xs font-mono surface-high px-2 py-0.5 rounded text-primary flex-shrink-0 mt-0.5">{name}</code>
                      <span className="text-xs text-on-surface-variant">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Clients */}
        <div className="mb-20">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Works with Your AI of Choice</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Any MCP-compatible client. Your conversation stays in the tool you're already using.
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Quickstart</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Three steps: have OpenAlgo running, grab an API key, drop a config snippet into your AI client.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="obsidian-card rounded-xl p-6 ghost-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">1</span>
                <h3 className="text-lg font-semibold text-on-surface">Run OpenAlgo &amp; Get Your API Key</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-on-surface-variant mb-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Start your OpenAlgo server (default: <code className="text-xs surface-container px-1.5 py-0.5 rounded font-label">http://127.0.0.1:5000</code>).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Make sure your broker is authenticated inside OpenAlgo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>In the OpenAlgo web UI go to <span className="text-on-surface font-medium">Settings → API Keys</span> and copy your key.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Install Node.js (required by some MCP clients) and clone the MCP server repo.</span>
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
                <h3 className="text-lg font-semibold text-on-surface">Add the MCP Server Config</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                Pick your OS and paste the config into your AI client's MCP settings file. Replace paths and API key.
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
                <p className="font-label text-label-lg text-on-surface-variant mb-3">Config file locations:</p>
                <div className="space-y-2">
                  {CONFIG_PATHS[os].map(({ app, path }) => (
                    <div key={app} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-sm">
                      <span className="font-medium text-on-surface sm:w-36 flex-shrink-0">{app}</span>
                      <code className="text-xs font-mono surface-container px-2 py-1 rounded text-on-surface-variant break-all">{path}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="obsidian-card rounded-xl p-6 ghost-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">3</span>
                <h3 className="text-lg font-semibold text-on-surface">Restart Your AI Client &amp; Start Trading</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">
                Restart Claude Desktop, Cursor, or Windsurf. The <code className="text-xs surface-container px-1.5 py-0.5 rounded font-label">openalgo</code> tools
                will show up in the MCP panel. Try one of the prompts above.
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
          <h2 className="text-headline-md mb-2 text-center text-on-surface">Supported Exchanges</h2>
          <p className="text-center text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Everything your broker supports through OpenAlgo is available in MCP.
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
                <h3 className="font-semibold text-on-surface mb-2">Security Notes</h3>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span>The MCP server runs on your machine and talks to OpenAlgo over localhost.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span>Your API key is read from local args — not stored in the cloud.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>LLMs can hallucinate. Review order parameters before confirming, especially with broker auto-execute enabled.</span>
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
            Set up once. Trade from any MCP-aware assistant. Your broker, your strategies, your control.
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
