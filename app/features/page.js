"use client"

import {
  Shield, Code2, GitBranch, Users, Lock, Zap, Server, Database, Globe, LineChart,
  Bot, Package, Github, Network, Link2, FileSpreadsheet, SplitSquareHorizontal,
  MessageCircle, LayoutDashboard, Terminal, Webhook, Activity, TrendingUp,
  BarChart3, Gauge, FileJson, Brain, Search, Clock, GitMerge, Key, ShieldCheck,
  AlertCircle, User, Mail, Smartphone, History, Container,
  Wand2, Layers, Target, Box, Sigma, PieChart, Wallet
} from "lucide-react"

const features = [
  { title: "Strategy Builder", description: "Multi-leg option strategy construction with live Greeks, payoff diagram, what-if simulator, and one-click basket execution", icon: Wand2, category: "Options Analytics" },
  { title: "Strategy Portfolio", description: "MyTrades and Simulation watchlists to save, reopen, and track your option strategies", icon: Box, category: "Options Analytics" },
  { title: "Option Chain", description: "Real-time option chain with Greeks, OI, volume, bid/ask per strike - click-to-trade inline", icon: Layers, category: "Options Analytics" },
  { title: "Option Greeks Chart", description: "Historical time-series for IV, Delta, Theta, Vega and Gamma with auto-rolling ATM strike", icon: Gauge, category: "Options Analytics" },
  { title: "OI Tracker", description: "Side-by-side CE/PE OI bars, PCR overlay, and ATM strike marker that follows spot live", icon: Activity, category: "Options Analytics" },
  { title: "Max Pain", description: "Live max pain strike with pain distribution across all strikes for the current expiry", icon: Target, category: "Options Analytics" },
  { title: "Straddle Chart", description: "Dynamic ATM straddle with rolling strike, spot and synthetic futures overlays", icon: LineChart, category: "Options Analytics" },
  { title: "Straddle PnL Simulator", description: "Intraday ATM straddle P&L with automated N-point adjustments and full trade log", icon: BarChart3, category: "Options Analytics" },
  { title: "Volatility Surface", description: "Live 3D implied volatility surface across strikes and expiries, built from broker data", icon: Box, category: "Options Analytics" },
  { title: "GEX Dashboard", description: "Gamma exposure analysis with OI walls, net GEX per strike, and top gamma strikes ranking", icon: Sigma, category: "Options Analytics" },
  { title: "IV Smile", description: "Call and Put IV curves with ATM marker and skew measurement between OTM puts and calls", icon: PieChart, category: "Options Analytics" },
  { title: "OI Profile", description: "Futures candlesticks with CE vs PE OI butterfly overlay and daily OI change per strike", icon: Wallet, category: "Options Analytics" },
  { title: "Smart Order Execution", description: "Intelligent order routing and execution management for complex trading strategies", icon: TrendingUp, category: "Trading Engine" },
  { title: "Host Python Strategies", description: "Run your Python code directly inside OpenAlgo without external servers - complete strategy autonomy", icon: Code2, category: "Strategy Execution" },
  { title: "Common WebSocket Layer", description: "Single, normalized real-time stream for quotes and LTP across all supported brokers", icon: Zap, category: "Real-Time Data" },
  { title: "Unified API Layer", description: "One API (/api/v1/) that works across 30+ brokers - write once, trade everywhere", icon: Globe, category: "API Infrastructure" },
  { title: "API Analyzer", description: "Mini sandbox environment to test strategies before going live - catch errors before they cost money", icon: Search, category: "Testing & Debug" },
  { title: "40+ API Endpoints", description: "Comprehensive API suite covering Account, Orders, Market Data, Options, Analytics, and Admin operations with a simplified structure", icon: Terminal, category: "API Infrastructure" },
  { title: "Historify Integration", description: "3rd party data platform built by OpenAlgo for fetching and organizing real-time historical data", icon: History, category: "Data Management" },
  { title: "Browser-Level Security", description: "CSP headers, CORS rules, CSRF protection, rate limiting, and monthly security audits", icon: ShieldCheck, category: "Security" },
  { title: "Single User System", description: "Designed for individual traders - first user is always admin with full control", icon: User, category: "User Management" },
  { title: "TOTP Password Reset", description: "Time-based one-time password support for secure password recovery", icon: Smartphone, category: "Security" },
  { title: "Gmail SMTP Reset", description: "Password reset functionality via Gmail SMTP integration", icon: Mail, category: "Security" },
  { title: "One Account Per User", description: "Each user connects to one broker account for focused trading management", icon: Key, category: "User Management" },
  { title: "30+ Broker Support", description: "Connect seamlessly with India's top broking platforms across discount, full-service, and emerging brokers", icon: Network, category: "Integration" },
  { title: "Multi-Platform Trading", description: "Trade from Amibroker, TradingView, Python, MetaTrader, Excel, Google Sheets", icon: Link2, category: "Integration" },
  { title: "Chartink Integration", description: "Native support for Chartink scanners and strategy execution", icon: LineChart, category: "Integration" },
  { title: "TradingView Webhooks", description: "Direct webhook support for TradingView alerts and Pine Script strategies", icon: Webhook, category: "Integration" },
  { title: "MCP / AI Agent Integration", description: "Model Context Protocol server exposes OpenAlgo to Claude, Cursor, Windsurf and ChatGPT - trade with natural language", icon: Bot, category: "Integration" },
  { title: "Intelligent Order Splitting", description: "Automatically split large orders for better execution and reduced market impact", icon: SplitSquareHorizontal, category: "Order Management" },
  { title: "Sequential Basket Orders", description: "Execute basket orders with buy-side legs first, followed by sell-side for optimal execution", icon: Package, category: "Order Management" },
  { title: "Raw WebSocket Implementation", description: "Direct broker API integration using raw WebSockets, not SDKs, for maximum performance and control", icon: Zap, category: "Real-Time Data" },
  { title: "Auto-Reconnection", description: "Automatic connection management with intelligent reconnection logic", icon: GitBranch, category: "Real-Time Data" },
  { title: "Level 5 Market Depth", description: "Real-time 5-level market depth data for informed trading decisions", icon: BarChart3, category: "Real-Time Data" },
  { title: "Streaming Quotes", description: "Live streaming quotes with LTP updates across all connected brokers", icon: Activity, category: "Real-Time Data" },
  { title: "Real-Time PnL Tracker", description: "Live PnL curves with intraday drawdown analysis and performance metrics", icon: Activity, category: "Analytics" },
  { title: "Latency Monitor", description: "Benchmark execution speed across brokers with detailed latency metrics", icon: Clock, category: "Analytics" },
  { title: "Traffic Monitor", description: "API usage tracking, error monitoring, and performance analytics", icon: LayoutDashboard, category: "Analytics" },
  { title: "Audit Trail", description: "Comprehensive logging with database-backed audit trails for compliance", icon: FileJson, category: "Analytics" },
  { title: "Python SDK with 100+ Indicators", description: "Comprehensive Python SDK with 100+ built-in technical indicators for strategy development", icon: Code2, category: "Developer Tools" },
  { title: "Standardized Format", description: "Common request/response format across all brokers and endpoints", icon: FileSpreadsheet, category: "Developer Tools" },
  { title: "Strategy Templates", description: "Ready-to-use templates for fast strategy prototyping and deployment", icon: Brain, category: "Developer Tools" },
  { title: "Plugin Architecture", description: "Modular design for easy broker additions and customizations", icon: Package, category: "Developer Tools" },
  { title: "Zero-Config Installation", description: "Easy one-command setup with sensible defaults - get trading in minutes, not hours", icon: Package, category: "Infrastructure" },
  { title: "Docker Support", description: "Production-ready Docker images for consistent deployment across any environment", icon: Container, category: "Infrastructure" },
  { title: "Connection Pooling", description: "Optimized connection management for faster order execution and reduced latency", icon: Network, category: "Infrastructure" },
  { title: "Direct Broker API Integration", description: "Built directly on broker REST APIs without SDK dependencies for maximum reliability", icon: GitBranch, category: "Infrastructure" },
  { title: "API Key Authentication", description: "Secure API key-based authentication for all endpoints", icon: Key, category: "Infrastructure" },
  { title: "Health Endpoints", description: "Health check and monitoring endpoints for production deployments", icon: Activity, category: "Infrastructure" },
  { title: "Rate Limiting", description: "Per-endpoint rate limiting to prevent abuse and ensure stability", icon: AlertCircle, category: "Infrastructure" },
  { title: "Database with Smart Caching", description: "SQLite backend with intelligent caching layer for faster data retrieval and reduced database calls", icon: Database, category: "Infrastructure" },
  { title: "Symbol Search", description: "Automatic symbol search and mapping across exchanges", icon: Search, category: "Data Management" },
  { title: "Master Contracts", description: "Daily refresh of master contract database with all instruments", icon: Database, category: "Data Management" },
  { title: "Historical Data Access", description: "Integration with Historify for comprehensive historical data management", icon: History, category: "Data Management" },
  { title: "Common Symbol Format", description: "Unified symbol format across all brokers for consistency", icon: Globe, category: "Data Management" },
  { title: "Discord Community", description: "Active community support with dedicated channels for developers and traders", icon: MessageCircle, category: "Community" },
  { title: "OpenAlgo GPT", description: "AI assistant for setup, broker integration, and strategy development", icon: Bot, category: "Community" },
  { title: "Virtual Meetups", description: "Regular online sessions for roadmap discussions and knowledge sharing", icon: Users, category: "Community" },
  { title: "Open Development", description: "Transparent development process with public GitHub repository", icon: Github, category: "Community" },
  { title: "Exchange Compliance Security", description: "Daily fresh login required as auth tokens expire at midnight per exchange regulations for enhanced security", icon: Lock, category: "Security" },
  { title: "No Data Collection", description: "Zero telemetry, no tracking, complete privacy - your data stays yours", icon: ShieldCheck, category: "Security" }
]

const categories = [
  { name: "Options Analytics", color: "text-primary bg-primary/10" },
  { name: "Trading Engine", color: "text-secondary bg-secondary/10" },
  { name: "Strategy Execution", color: "text-primary bg-primary/10" },
  { name: "Real-Time Data", color: "text-tertiary bg-tertiary/10" },
  { name: "API Infrastructure", color: "text-secondary bg-secondary/10" },
  { name: "Testing & Debug", color: "text-primary bg-primary/10" },
  { name: "Integration", color: "text-secondary bg-secondary/10" },
  { name: "Order Management", color: "text-primary bg-primary/10" },
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
              OpenAlgo is a complete self-hosted stack for algo trading and options analytics &mdash;
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
