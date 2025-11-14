"use client"

import { Button } from "@/components/ui/button"
import { 
  ArrowDownToLine, 
  Github,
  Shield,
  Users,
  Server,
  Lock,
  Code2,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GitBranch,
  ExternalLink,
  Package,
  Bot,
  MessageCircle,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react"

export default function Home() {
  const highlights = [
    {
      icon: Shield,
      title: "India's First Community-Driven Platform",
      description: "Built by traders, for traders. Open source and transparent.",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: Server,
      title: "Self-Hostable Infrastructure",
      description: "Deploy on your server, your cloud, your way. No vendor lock-in.",
      color: "bg-green-500/10 text-green-500"
    },
    {
      icon: Lock,
      title: "Complete Privacy & Control",
      description: "Your code, your strategies, your data. Nothing leaves your infrastructure.",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      icon: Code2,
      title: "Multi-Platform Support",
      description: "Integrate with 20+ brokers. Use from Python, TradingView, Excel, and more.",
      color: "bg-orange-500/10 text-orange-500"
    }
  ]

  const trustIndicators = [
    "100% Open Source",
    "AGPL-3.0 Licensed",
    "No Data Collection",
    "Self-Hosted",
    "Community Driven",
    "Transparent Development"
  ]

  const ecosystem = [
    {
      title: "OpenAlgo Core",
      description: "Python Flask + Tailwind + DaisyUI",
      icon: "emoji",
      iconValue: "🧠",
      url: "https://github.com/marketcalls/openalgo"
    },
    {
      title: "Historify",
      description: "Full Stack Stock Market Data Management",
      icon: "emoji",
      iconValue: "📦",
      url: "https://github.com/marketcalls/historify"
    },
    {
      title: "Python SDK",
      description: "MIT-licensed SDK for strategies",
      icon: "emoji",
      iconValue: "🐍",
      url: "https://github.com/marketcalls/openalgo-python-library"
    },
    {
      title: "Backtrader",
      description: "Python Library for backtesting",
      icon: "component",
      iconComponent: TrendingUp,
      url: "https://github.com/p2c2e/openalgo-backtrader"
    },
    {
      title: "Node.js SDK",
      description: "JavaScript/TypeScript SDK",
      icon: "emoji",
      iconValue: "🟢",
      url: "https://github.com/marketcalls/openalgo-node"
    },
    {
      title: "Excel Add-in",
      description: "Trade from Excel spreadsheets",
      icon: "component",
      iconComponent: FileSpreadsheet,
      url: "https://github.com/marketcalls/OpenAlgo-Excel"
    },
    {
      title: "PineTS",
      description: "TradingView indicators",
      icon: "emoji",
      iconValue: "⚡",
      url: "https://github.com/marketcalls/openalgo-pinets"
    },
    {
      title: "MCP + AI",
      description: "AI integration framework",
      icon: "emoji",
      iconValue: "🤖",
      url: "https://github.com/marketcalls/openalgo-mcp"
    },
    {
      title: "Chrome Plugin",
      description: "Browser extension",
      icon: "emoji",
      iconValue: "🧩",
      url: "https://github.com/marketcalls/openalgo-chrome"
    },
    {
      title: "Fast Scalper",
      description: "Rust + Tauri desktop app",
      icon: "emoji",
      iconValue: "⚡",
      url: "https://github.com/marketcalls/fastscalper-tauri"
    },
    {
      title: "Web Portal",
      description: "NextJS + ShadcnUI",
      icon: "emoji",
      iconValue: "🌐",
      url: "https://github.com/marketcalls/openalgo-webpage"
    },
    {
      title: "Documentation",
      description: "Gitbook docs",
      icon: "emoji",
      iconValue: "📚",
      url: "https://github.com/marketcalls/openalgo-docs"
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Original */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 animate-gradient">Your Personal</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient">Algo Trading</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-gradient">Platform</span>
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Connect your algo strategies and run from any platform - Amibroker, TradingView, GoCharting, N8N, Python, GO, NodeJs, ChartInk, MetaTrader, Excel, or Google Sheets. And Recieve your Strategy Alerts to Telegram. 
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

      {/* Trust & Highlights Section */}
      <div className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Traders Choose OpenAlgo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The only trading platform where you own everything - from code to infrastructure
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {highlights.map((item, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${item.color}`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className="bg-background rounded-lg border p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium">{indicator}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mini FOSS Universe */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Mini FOSS Universe</h2>
            <p className="text-center text-muted-foreground mb-8">
              Explore the open-source ecosystem around OpenAlgo — built for traders, by traders
            </p>
            
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {ecosystem.map((project, index) => {
                const IconComponent = project.iconComponent
                return (
                  <a
                    key={index}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background p-4 rounded-lg border hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      {project.icon === 'component' ? (
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                      ) : (
                        <span className="text-2xl">{project.iconValue}</span>
                      )}
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                  </a>
                )
              })}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                🛠 Dive in, fork it, build with it. Let's make algo trading more accessible, powerful, and open for everyone.
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/marketcalls" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Explore All Projects on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  <Globe className="inline w-6 h-6 mr-2 text-primary" />
                  Truly Independent
                </h3>
                <p className="text-muted-foreground mb-4">
                  No vendor lock-in. No hidden dependencies. Switch brokers anytime. 
                  Your strategies work everywhere. One API, multiple brokers.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    <span>Unified API across 20+ brokers</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    <span>Strategy portability guaranteed</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    <span>No proprietary formats or protocols</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  <Users className="inline w-6 h-6 mr-2 text-primary" />
                  Community First
                </h3>
                <p className="text-muted-foreground mb-4">
                  Built in public. Developed with traders. Every feature request matters. 
                  Join thousands of traders shaping the future of algorithmic trading.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    <span>Active Discord community</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    <span>Regular virtual meetups</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 text-primary mr-2 mt-0.5" />
                    <span>Open development on GitHub</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our Philosophy
            </h2>
            <div className="bg-background rounded-lg border p-8 md:p-12">
              <p className="text-xl mb-6 leading-relaxed">
                <span className="font-semibold text-primary">Your trading system should be yours.</span> Not hosted on someone 
                else's server. Not dependent on a vendor's uptime. Not subject to arbitrary limits or fees.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                OpenAlgo gives you the complete infrastructure to run professional-grade algorithmic 
                trading - on your terms, with your rules, under your control.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Zero</div>
                  <div className="text-sm text-muted-foreground">Data Collection</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Open Source</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Forever</div>
                  <div className="text-sm text-muted-foreground">Free & Open</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of traders who've chosen freedom over convenience
            </p>
            <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-lg p-8 border mb-8">
              <p className="text-xl font-semibold mb-4">
                Your strategies remain yours. Your services remain proprietary. 
                The infrastructure stays open.
              </p>
              <p className="text-muted-foreground">
                If your business requires proprietary licensing or special terms, 
                reach out through our Discord or GitHub.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a href="/discord">
                  Join Community
                  <Users className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Source
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
