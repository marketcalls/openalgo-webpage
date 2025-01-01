import { Button } from "@/components/ui/button"
import { ArrowDownToLine } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-8">
            Your Personal{" "}
            <span className="text-primary">Algo Trading</span>{" "}
            <span className="text-primary">Platform</span>
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
              <a href="/download" className="flex items-center">
                <ArrowDownToLine className="w-5 h-5 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Multi-Platform Support</h3>
              <p className="text-muted-foreground">Run strategies from Amibroker, TradingView, Python, and more</p>
            </div>
            <div className="bg-background p-8 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Broker Integration</h3>
              <p className="text-muted-foreground">Seamless connection with top Indian brokers</p>
            </div>
            <div className="bg-background p-8 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Open Source</h3>
              <p className="text-muted-foreground">Free and open source platform for everyone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">OpenAlgo</h4>
              <p className="text-muted-foreground">Open source algo trading platform for everyone</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="https://docs.openalgo.in" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="https://docs.openalgo.in/getting-started" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">Installation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Download</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>support@openalgo.in</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">GitHub</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p> {new Date().getFullYear()} OpenAlgo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
