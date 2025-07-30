"use client"

import { Button } from "@/components/ui/button"
import { 
  ArrowDownToLine, 
  Network, 
  Link2, 
  LineChart, 
  Code2, 
  LayoutDashboard, 
  FileSpreadsheet,
  SplitSquareHorizontal,
  Globe,
  MonitorPlay,
  MessageCircle,
  BookOpen,
  Bot,
  Github
} from "lucide-react"

const features = [
  {
    title: "Access to 20+ Indian Brokers",
    description: "Connect seamlessly with India's top broking platforms for comprehensive market access",
    icon: Network,
    category: "Integration"
  },
  {
    title: "Multi-Platform Support",
    description: "Connect your favorite trading platform - Amibroker, Tradingview, Python, Metatrader and more",
    icon: Link2,
    category: "Integration"
  },
  {
    title: "Chartink Strategy Management",
    description: "Comprehensive modules for managing and executing Chartink strategies effectively",
    icon: LineChart,
    category: "Trading"
  },
  {
    title: "API Analyzer",
    description: "Test your strategies thoroughly before going live with our advanced API analyzer",
    icon: Code2,
    category: "Developer Experience"
  },
  {
    title: "20+ Simplified APIs",
    description: "Extensive API suite covering Account, Data, and Order operations with simplified structure",
    icon: Code2,
    category: "Integration"
  },
  {
    title: "Trading Modules",
    description: "Simplified order execution process with Amibroker, Metatrader, and Google Spreadsheets modules",
    icon: FileSpreadsheet,
    category: "Trading"
  },
  {
    title: "Advanced Order Types",
    description: "SmartOrder, Basketorder, and SplitOrder functionality for sophisticated trading strategies",
    icon: SplitSquareHorizontal,
    category: "Trading"
  },
  {
    title: "Common Format Architecture",
    description: "OpenAlgo Common Symbol format and unified API endpoints across all supported brokers",
    icon: Globe,
    category: "Developer Experience"
  },
  {
    title: "Modern UI Dashboards",
    description: "Sleek, intuitive dashboards for effortless monitoring and control",
    icon: MonitorPlay,
    category: "User Experience"
  },
  {
    title: "Community Support",
    description: "Active Discord community support for seamless trading experience",
    icon: MessageCircle,
    category: "Support"
  },
  {
    title: "Comprehensive Documentation",
    description: "Detailed guides, tutorials, and API references with practical examples for every feature",
    icon: BookOpen,
    category: "Documentation"
  },
  {
    title: "AI-Powered Development",
    description: "Leveraging Claude Opus and Sonnet for Development,\nChatGPT, Google Gemini for Documentation, Security Audit and Code Review",
    icon: Bot,
    category: "Innovation"
  }
]

const categories = [
  { name: "Integration", color: "bg-purple-500/10 text-purple-500" },
  { name: "Trading", color: "bg-blue-500/10 text-blue-500" },
  { name: "Developer Experience", color: "bg-green-500/10 text-green-500" },
  { name: "User Experience", color: "bg-orange-500/10 text-orange-500" },
  { name: "Support", color: "bg-pink-500/10 text-pink-500" },
  { name: "Documentation", color: "bg-yellow-500/10 text-yellow-500" },
  { name: "Innovation", color: "bg-indigo-500/10 text-indigo-500" }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 animate-gradient">Your Personal</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient">Algo Trading</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-gradient">Platform</span>
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Connect your algo strategies seamlessly with top Indian brokers. Run your strategies from any platform - Amibroker, TradingView, Python, ChartInk, MetaTrader, Excel, or Google Sheets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="https://docs.openalgo.in/getting-started" className="flex items-center" target="_blank" rel="noopener noreferrer">
                <ArrowDownToLine className="w-5 h-5 mr-2" />
                Install Now
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo" className="flex items-center" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const category = categories.find(c => c.name === feature.category)
              return (
                <div key={index} className="bg-background p-8 rounded-lg border transition-all hover:shadow-lg">
                  <div className={`inline-flex items-center justify-center p-2 rounded-lg ${category?.color} mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-4">
                    <span className={`text-sm px-3 py-1 rounded-full ${category?.color}`}>
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
