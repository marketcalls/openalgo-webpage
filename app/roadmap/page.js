"use client"

import {
  Keyboard,
  Network,
  Zap,
  Bell,
  GitMerge,
  Monitor,
  Globe,
  Workflow,
  ArrowUpCircle,
  FlaskConical,
  Sliders,
  LayoutDashboard,
  Shield,
  Bot,
  Code2,
  Library,
  Smartphone
} from "lucide-react"

const features = [
  {
    title: "OpenAlgo Rust Desktop",
    description: "Build a high performance native desktop application using Rust, delivering blazing fast execution, minimal resource usage, and a seamless cross platform trading experience.",
    icon: Monitor,
    category: "Platform",
    priority: "top"
  },
  {
    title: "Pure Trading Terminal",
    description: "Transform OpenAlgo into a complete trading terminal with advanced charting, order management, market depth, and realtime analytics in one unified interface.",
    icon: LayoutDashboard,
    category: "Platform"
  },
  {
    title: "Flutter Mobile App",
    description: "Build a Flutter mobile application for traders to manage their algorithmic trading strategies, monitor positions, and control trades directly from their mobile devices.",
    icon: Smartphone,
    category: "Platform"
  },
  {
    title: "ATM Trade Management",
    description: "Advanced Trade Management modules with simple Target, Stoploss, and Trailing Stoploss orders. Includes risk management controls, position sizing, and comprehensive position management.",
    icon: Shield,
    category: "Trading"
  },
  {
    title: "Bracket, Cover Orders & MTF/AMO Support",
    description: "Bringing advanced order types including Bracket Orders, Cover Orders, and supporting Margin Trading Facility (MTF) and After Market Orders (AMO) product types.",
    icon: GitMerge,
    category: "Trading"
  },
  {
    title: "New Broker Integrations On Demand",
    description: "Rapidly integrate new brokers based on community demand, expanding connectivity to meet user requirements efficiently.",
    icon: Network,
    category: "Integration"
  },
  {
    title: "Realtime Trade Updates via WebSockets",
    description: "Building realtime trade updates and position changes through OpenAlgo Common WebSockets for instant push based notifications.",
    icon: Zap,
    category: "Performance"
  },
  {
    title: "Keyboard Based Scalping",
    description: "Port the super responsive scalping workflow from OpenTerminal to OpenAlgo, delivering lightning fast trade executions with a keyboard first approach.",
    icon: Keyboard,
    category: "Performance"
  },
  {
    title: "CI/CD Pipeline",
    description: "Building a robust Continuous Integration and Continuous Deployment pipeline for automated testing, building, and releasing OpenAlgo updates.",
    icon: Workflow,
    category: "Developer Experience"
  },
  {
    title: "Pure Realtime Sandbox Mode",
    description: "Making Sandbox Mode purely realtime to test algo trading strategies efficiently with live market simulation and instant feedback.",
    icon: FlaskConical,
    category: "Developer Experience"
  },
  {
    title: "Simple Execution Algorithms",
    description: "Building a simple execution algorithms workflow to enable TWAP, VWAP, and other execution strategies for optimal order placement.",
    icon: Sliders,
    category: "Trading"
  },
  {
    title: "Version Notifications & Easy Upgrades",
    description: "Notify users on major version releases and simplify the OpenAlgo upgrade process with single click updates and migration assistance.",
    icon: ArrowUpCircle,
    category: "Developer Experience"
  },
  {
    title: "Price Alert Orders",
    description: "Automatically place orders when the market reaches your specified price thresholds.",
    icon: Bell,
    category: "Trading"
  },
  {
    title: "Global Expansion: US Brokers & Crypto",
    description: "Build OpenAlgo support for US brokers and cryptocurrency exchanges, expanding the platform globally to serve traders worldwide.",
    icon: Globe,
    category: "Global Expansion"
  },
  {
    title: "Execution Algorithmic Controls",
    description: "Build simple execution algorithmic controls for managing order flow, position sizing, and risk parameters through an intuitive interface.",
    icon: Sliders,
    category: "Trading"
  },
  {
    title: "LLM & AI Agentic Trading",
    description: "Integrate Large Language Models and AI Agentic solutions for intelligent trade decision making, strategy optimization, and autonomous trading workflows.",
    icon: Bot,
    category: "AI & Automation"
  },
  {
    title: "Enhanced Python Hosting",
    description: "Improve Python strategy hosting inside OpenAlgo with better execution environment, dependency management, and seamless strategy deployment.",
    icon: Code2,
    category: "Developer Experience"
  },
  {
    title: "Java, C# & Rust SDK Libraries",
    description: "Bringing official SDK libraries for Java, C#, and Rust to enable developers to build trading applications in their preferred programming language.",
    icon: Library,
    category: "Developer Experience"
  }
]

const categories = [
  { name: "Platform", color: "bg-cyan-500/10 text-cyan-500" },
  { name: "Trading", color: "bg-orange-500/10 text-orange-500" },
  { name: "Integration", color: "bg-purple-500/10 text-purple-500" },
  { name: "Performance", color: "bg-blue-500/10 text-blue-500" },
  { name: "Developer Experience", color: "bg-pink-500/10 text-pink-500" },
  { name: "AI & Automation", color: "bg-violet-500/10 text-violet-500" },
  { name: "Global Expansion", color: "bg-emerald-500/10 text-emerald-500" }
]

export default function RoadmapPage() {
  return (
    <div className="container max-w-7xl py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Roadmap 2026</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building the future of algorithmic trading. Our 2026 roadmap focuses on performance,
            global expansion, and empowering traders with powerful new capabilities.
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
