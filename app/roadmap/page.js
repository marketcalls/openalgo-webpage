"use client"

import {
  Keyboard,
  Layers,
  Network,
  LineChart,
  Zap,
  Box,
  Shield,
  FileSpreadsheet,
  Database,
  Puzzle,
  GitBranch,
  BarChart2,
  Clock,
  Bell,
  GitMerge,
  Download,
  TestTubes,
  Container,
  LockKeyhole,
  Paintbrush,
  Table2
} from "lucide-react"

const features = [
  {
    title: "Keyboard-Based Scalping",
    description: "Port the super-responsive scalping workflow from OpenTerminal to OpenAlgo, delivering lightning-fast trade executions with a keyboard-first approach.",
    icon: Keyboard,
    category: "Performance"
  },
  {
    title: "Full-Stack Trade Management",
    description: "Deeper integration for Amibroker, TradingView, Python strategies. Execution controls for limit orders, single-/multi-leg options, automated rollovers, and more.",
    icon: Layers,
    category: "Integration"
  },
  {
    title: "New Broker Integrations",
    description: "IIFL, Tradejini, Samco, Sharekhan, Motilal Oswal, PayTM, CompositEdge, Jainam and XTS based brokers —expanding our capabilities both locally and globally.",
    icon: Network,
    category: "Integration"
  },
  {
    title: "Strategy-Level Position Tracking",
    description: "Consolidate positions from multiple sources (Amibroker, TradingView, Python) under one unified dashboard for easier monitoring and control.",
    icon: LineChart,
    category: "Analytics"
  },
  {
    title: "Common WebSocket Integration",
    description: "Real-time market insights and push-based updates for position changes, PnL, and more.",
    icon: Zap,
    category: "Performance"
  },
  {
    title: "Streamlined Installation",
    description: "Aim for one-click or single-command deployment in production servers—no complex dev-ops required.",
    icon: Box,
    category: "Developer Experience"
  },
  {
    title: "Real-Time Trading Insights",
    description: "Rich visual dashboards for both discretionary and automated traders, including advanced analytics.",
    icon: BarChart2,
    category: "Analytics"
  },
  {
    title: "Simple Trade Management",
    description: "Streamlined management of stop-loss, trailing stop-loss, and target triggers—minimal coding needed.",
    icon: Shield,
    category: "Trading"
  },
  {
    title: "OpenEngine: Full-Stack Backtesting",
    description: "An Indian market–focused backtesting platform with integrated live execution hooks.",
    icon: GitBranch,
    category: "Trading"
  },
  {
    title: "Intraday MTM Visualizer",
    description: "A clear snapshot of profit/loss, strategy-level MTM, and an optional panic button to square off all positions.",
    icon: LineChart,
    category: "Analytics"
  },
  {
    title: "WatchList & Level 2 Data",
    description: "Enhanced market-depth visibility and direct DOM-based trading features.",
    icon: Table2,
    category: "Trading"
  },
  {
    title: "TradingView Chart Integration",
    description: "Sleek, interactive charting right within the OpenAlgo interface.",
    icon: LineChart,
    category: "Integration"
  },
  {
    title: "Enhanced Trading Dashboard",
    description: "Modify positions on the fly—add, reduce, or close trades with intuitive controls.",
    icon: BarChart2,
    category: "Trading"
  },
  {
    title: "CSV Exports",
    description: "One-click download of Orderbook, TradeBook, PositionBook, Holdings, and API Analyzer results.",
    icon: Download,
    category: "Developer Experience"
  },
  {
    title: "Time-Based Trading",
    description: "Automate schedules—pre- or post-market strategies, time-based triggers, or day parting.",
    icon: Clock,
    category: "Trading"
  },
  {
    title: "Price Alert Orders",
    description: "Automatically place orders when the market reaches your specified price thresholds.",
    icon: Bell,
    category: "Trading"
  },
  {
    title: "Advanced Order Types",
    description: "GTT orders, Cover Orders, Bracket Orders—single-leg and multi-leg options via broker APIs.",
    icon: GitMerge,
    category: "Trading"
  },
  {
    title: "Automated Testing",
    description: "Frontend: Jest for UI components. Backend: PyTest for Python modules, plus mock services for API testing.",
    icon: TestTubes,
    category: "Developer Experience"
  },
  {
    title: "Stress & Load Testing",
    description: "Endpoint stress tests, concurrent order handling, connection pool checks, WebSocket capacity validation.",
    icon: TestTubes,
    category: "Developer Experience"
  },
  {
    title: "DockerHub Publishing",
    description: "A production-grade Docker image for frictionless deployment.",
    icon: Container,
    category: "Developer Experience"
  },
  {
    title: "Database Migrations",
    description: "Simplify schema updates without downtime.",
    icon: Database,
    category: "Developer Experience"
  },
  {
    title: "Broker Plugin Abstraction",
    description: "Make it effortless to add or modify broker modules for faster integrations. This modular approach ensures easy maintenance and community-driven enhancements.",
    icon: Puzzle,
    category: "Developer Experience"
  },
  {
    title: "Theming & UI Skins",
    description: "Separate the UI layer so developers can build custom 'skins' or themes—similar to how WordPress handles templates. This fosters a plugin-driven ecosystem of design innovations.",
    icon: Paintbrush,
    category: "Developer Experience"
  },
  {
    title: "CSRF Protection",
    description: "Strengthen platform security by implementing token-based safeguards.",
    icon: LockKeyhole,
    category: "Security"
  },
  {
    title: "Excel Addins",
    description: "Build Excel Addins to Manage Trades/Monitor/ Build Visualisation Dashboard from Excel.",
    icon: FileSpreadsheet,
    category: "Integration"
  }
]

const categories = [
  { name: "Performance", color: "bg-blue-500/10 text-blue-500" },
  { name: "Integration", color: "bg-purple-500/10 text-purple-500" },
  { name: "Analytics", color: "bg-green-500/10 text-green-500" },
  { name: "Trading", color: "bg-orange-500/10 text-orange-500" },
  { name: "Developer Experience", color: "bg-pink-500/10 text-pink-500" },
  { name: "Security", color: "bg-red-500/10 text-red-500" }
]

export default function RoadmapPage() {
  return (
    <div className="container max-w-7xl py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Roadmap 2025</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            As we look ahead, our vision is shaped by the challenges, feedback, and breakthroughs we've experienced so far. 
            Here's the big picture of what's coming next.
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
                <div className={`inline-flex p-2 rounded-lg ${category.color} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.color}`}>
                    {feature.category}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Want to contribute or suggest new features?
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Join Discord
            </a>
            <a
              href="https://github.com/marketcalls/openalgo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
