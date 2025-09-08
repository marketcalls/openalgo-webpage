"use client"

import { 
  Shield, 
  Code2, 
  GitBranch, 
  Users, 
  Lock, 
  Zap,
  Server,
  Database,
  Globe,
  LineChart,
  Bot,
  Package,
  Github,
  Network,
  Link2,
  FileSpreadsheet,
  SplitSquareHorizontal,
  MessageCircle,
  LayoutDashboard,
  Terminal,
  Webhook,
  Activity,
  TrendingUp,
  BarChart3,
  Gauge,
  FileJson,
  Brain,
  Search,
  Clock,
  GitMerge,
  Key,
  ShieldCheck,
  AlertCircle,
  User,
  Mail,
  Smartphone,
  History
} from "lucide-react"

const features = [
  // Core Platform Features
  {
    title: "Smart Order Management",
    description: "Advanced position handling with stop-loss, trailing stops, and partial exits for precise trade control",
    icon: TrendingUp,
    category: "Trading Engine"
  },
  {
    title: "Host Python Strategies",
    description: "Run your Python code directly inside OpenAlgo without external servers - complete strategy autonomy",
    icon: Code2,
    category: "Strategy Execution"
  },
  {
    title: "Common WebSocket Layer",
    description: "Single, normalized real-time stream for quotes and LTP across all supported brokers",
    icon: Zap,
    category: "Real-Time Data"
  },
  {
    title: "Unified API Layer",
    description: "One API (/api/v1/) that works across 23+ brokers - write once, trade everywhere",
    icon: Globe,
    category: "API Infrastructure"
  },
  {
    title: "API Analyzer",
    description: "Mini sandbox environment to test strategies before going live - catch errors before they cost money",
    icon: Search,
    category: "Testing & Debug"
  },
  {
    title: "20+ Simplified APIs",
    description: "Comprehensive API suite covering Account, Data, and Order operations with simplified structure",
    icon: Terminal,
    category: "API Infrastructure"
  },
  {
    title: "Historify Integration",
    description: "3rd party data platform built by OpenAlgo for fetching and organizing real-time historical data",
    icon: History,
    category: "Data Management"
  },
  {
    title: "Browser-Level Security",
    description: "CSP headers, CORS rules, CSRF protection, rate limiting, and monthly security audits",
    icon: ShieldCheck,
    category: "Security"
  },

  // User Management & Auth
  {
    title: "Single User System",
    description: "Designed for individual traders - first user is always admin with full control",
    icon: User,
    category: "User Management"
  },
  {
    title: "TOTP Authentication",
    description: "Two-factor authentication support for enhanced account security",
    icon: Smartphone,
    category: "Security"
  },
  {
    title: "Gmail SMTP Reset",
    description: "Password reset functionality via Gmail SMTP integration",
    icon: Mail,
    category: "Security"
  },
  {
    title: "One Account Per User",
    description: "Each user connects to one broker account for focused trading management",
    icon: Key,
    category: "User Management"
  },

  // Broker & Platform Integration
  {
    title: "23+ Broker Support",
    description: "Connect seamlessly with India's top broking platforms including Definedge Securities",
    icon: Network,
    category: "Integration"
  },
  {
    title: "Multi-Platform Trading",
    description: "Trade from Amibroker, TradingView, Python, MetaTrader, Excel, Google Sheets",
    icon: Link2,
    category: "Integration"
  },
  {
    title: "Chartink Integration",
    description: "Native support for Chartink scanners and strategy execution",
    icon: LineChart,
    category: "Integration"
  },
  {
    title: "TradingView Webhooks",
    description: "Direct webhook support for TradingView alerts and Pine Script strategies",
    icon: Webhook,
    category: "Integration"
  },

  // Order Management
  {
    title: "Intelligent Order Splitting",
    description: "Automatically split large orders for better execution and reduced market impact",
    icon: SplitSquareHorizontal,
    category: "Order Management"
  },
  {
    title: "Sequential Basket Orders",
    description: "Execute basket orders with buy-side legs first, followed by sell-side for optimal execution",
    icon: Package,
    category: "Order Management"
  },
  {
    title: "SmartOrder System",
    description: "Intelligent order routing and execution management for complex strategies",
    icon: Brain,
    category: "Order Management"
  },
  {
    title: "Position Sizing",
    description: "Built-in position sizing and risk management calculations",
    icon: Gauge,
    category: "Order Management"
  },

  // Real-Time Streaming
  {
    title: "ZeroMQ Architecture",
    description: "High-performance WebSocket distribution with ZeroMQ for ultra-low latency",
    icon: Zap,
    category: "Real-Time Data"
  },
  {
    title: "Auto-Reconnection",
    description: "Automatic connection management with intelligent reconnection logic",
    icon: GitBranch,
    category: "Real-Time Data"
  },
  {
    title: "Level 5 Market Depth",
    description: "Real-time 5-level market depth data for informed trading decisions",
    icon: BarChart3,
    category: "Real-Time Data"
  },
  {
    title: "Streaming Quotes",
    description: "Live streaming quotes with LTP updates across all connected brokers",
    icon: Activity,
    category: "Real-Time Data"
  },

  // Analytics & Monitoring
  {
    title: "Real-Time PnL Tracker",
    description: "Live PnL curves with intraday drawdown analysis and performance metrics",
    icon: Activity,
    category: "Analytics"
  },
  {
    title: "Latency Monitor",
    description: "Benchmark execution speed across brokers with detailed latency metrics",
    icon: Clock,
    category: "Analytics"
  },
  {
    title: "Traffic Monitor",
    description: "API usage tracking, error monitoring, and performance analytics",
    icon: LayoutDashboard,
    category: "Analytics"
  },
  {
    title: "Audit Trail",
    description: "Comprehensive logging with database-backed audit trails for compliance",
    icon: FileJson,
    category: "Analytics"
  },

  // Developer Experience
  {
    title: "MIT-Licensed SDKs",
    description: "Python and Node.js SDKs under MIT license - your strategies remain private",
    icon: Code2,
    category: "Developer Tools"
  },
  {
    title: "Standardized Format",
    description: "Common request/response format across all brokers and endpoints",
    icon: FileSpreadsheet,
    category: "Developer Tools"
  },
  {
    title: "Strategy Templates",
    description: "Ready-to-use templates for fast strategy prototyping and deployment",
    icon: Brain,
    category: "Developer Tools"
  },
  {
    title: "Plugin Architecture",
    description: "Modular design for easy broker additions and customizations",
    icon: Package,
    category: "Developer Tools"
  },

  // Infrastructure
  {
    title: "API Key Authentication",
    description: "Secure API key-based authentication for all endpoints",
    icon: Key,
    category: "Infrastructure"
  },
  {
    title: "Health Endpoints",
    description: "Health check and monitoring endpoints for production deployments",
    icon: Activity,
    category: "Infrastructure"
  },
  {
    title: "Rate Limiting",
    description: "Per-endpoint rate limiting to prevent abuse and ensure stability",
    icon: AlertCircle,
    category: "Infrastructure"
  },
  {
    title: "Database Backend",
    description: "SQLite database for storing configurations, logs, and audit trails",
    icon: Database,
    category: "Infrastructure"
  },

  // Data Management
  {
    title: "Symbol Search",
    description: "Automatic symbol search and mapping across exchanges",
    icon: Search,
    category: "Data Management"
  },
  {
    title: "Master Contracts",
    description: "Daily refresh of master contract database with all instruments",
    icon: Database,
    category: "Data Management"
  },
  {
    title: "Historical Data Access",
    description: "Integration with Historify for comprehensive historical data management",
    icon: History,
    category: "Data Management"
  },
  {
    title: "Common Symbol Format",
    description: "Unified symbol format across all brokers for consistency",
    icon: Globe,
    category: "Data Management"
  },

  // Community & Ecosystem
  {
    title: "Discord Community",
    description: "Active community support with dedicated channels for developers and traders",
    icon: MessageCircle,
    category: "Community"
  },
  {
    title: "OpenAlgo GPT",
    description: "AI assistant for setup, broker integration, and strategy development",
    icon: Bot,
    category: "Community"
  },
  {
    title: "Virtual Meetups",
    description: "Regular online sessions for roadmap discussions and knowledge sharing",
    icon: Users,
    category: "Community"
  },
  {
    title: "Open Development",
    description: "Transparent development process with public GitHub repository",
    icon: Github,
    category: "Community"
  },

  // Security & Compliance
  {
    title: "CSRF Protection",
    description: "Token-based protection against cross-site request forgery attacks",
    icon: Shield,
    category: "Security"
  },
  {
    title: "CORS Configuration",
    description: "Properly configured CORS rules for secure cross-origin requests",
    icon: Globe,
    category: "Security"
  },
  {
    title: "Exchange Compliance Security",
    description: "Daily fresh login required as auth tokens expire at midnight per exchange regulations for enhanced security",
    icon: Lock,
    category: "Security"
  },
  {
    title: "No Data Collection",
    description: "Zero telemetry, no tracking, complete privacy - your data stays yours",
    icon: ShieldCheck,
    category: "Security"
  }
]

const categories = [
  { name: "Trading Engine", color: "bg-blue-500/10 text-blue-500" },
  { name: "Strategy Execution", color: "bg-purple-500/10 text-purple-500" },
  { name: "Real-Time Data", color: "bg-green-500/10 text-green-500" },
  { name: "API Infrastructure", color: "bg-orange-500/10 text-orange-500" },
  { name: "Testing & Debug", color: "bg-pink-500/10 text-pink-500" },
  { name: "Integration", color: "bg-indigo-500/10 text-indigo-500" },
  { name: "Order Management", color: "bg-red-500/10 text-red-500" },
  { name: "Analytics", color: "bg-yellow-500/10 text-yellow-500" },
  { name: "Developer Tools", color: "bg-cyan-500/10 text-cyan-500" },
  { name: "Infrastructure", color: "bg-emerald-500/10 text-emerald-500" },
  { name: "Data Management", color: "bg-violet-500/10 text-violet-500" },
  { name: "User Management", color: "bg-rose-500/10 text-rose-500" },
  { name: "Community", color: "bg-teal-500/10 text-teal-500" },
  { name: "Security", color: "bg-amber-500/10 text-amber-500" }
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-7xl py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">
              Platform Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              OpenAlgo is a comprehensive single-user algorithmic trading platform designed 
              for individual traders who want complete control over their trading infrastructure.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}
              >
                {category.name}
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const category = categories.find(c => c.name === feature.category)
              return (
                <div
                  key={index}
                  className="relative group rounded-lg border p-6 hover:shadow-md transition-all bg-card"
                >
                  <div className={`inline-flex p-2 rounded-lg ${category?.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                  <div className="absolute top-4 right-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${category?.color}`}>
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