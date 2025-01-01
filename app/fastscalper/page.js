"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Zap, Laptop, Settings, Webhook, Terminal, MonitorSmartphone, Keyboard, Volume2, Cpu, Lock } from "lucide-react"

export default function FastScalperPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">FastScalper</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A lightning-fast, Rust-based desktop application designed for scalpers who demand speed, reliability, and precision in their trading.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Built with Rust for optimal performance and instant order execution
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Cpu className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightweight</h3>
            <p className="text-muted-foreground">
              Minimal resource usage while maintaining powerful functionality
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-muted-foreground">
              Built-in security features and encrypted API communication
            </p>
          </div>
        </div>

        {/* Platform Support */}
        <div className="bg-card rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Cross-Platform Support</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Windows</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Multiple instance support</li>
                <li>• Windows 10 or later</li>
                <li>• MSI & EXE installers</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Laptop className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">macOS</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Universal binary</li>
                <li>• Intel & Apple Silicon</li>
                <li>• macOS 10.15 or later</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Terminal className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Linux</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• DEB & RPM packages</li>
                <li>• AppImage support</li>
                <li>• Major distros supported</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trading Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Trading Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Order Management</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Keyboard className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Quick Order Controls</p>
                    <p>LE (Long), LX (Exit Long), SE (Short), SX (Exit Short)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Settings className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Product Types</p>
                    <p>CNC (Cash & Carry), MIS (Intraday), NRML (Positional)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Smart Features</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Volume2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Voice Alerts</p>
                    <p>Configurable audio confirmations for order actions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Webhook className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">API Integration</p>
                    <p>Seamless connection with OpenAlgo for real-time trading</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-card rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Getting Started</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
              <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                <li>OpenAlgo installed and running</li>
                <li>API key from OpenAlgo dashboard</li>
                <li>Compatible operating system</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Setup</h3>
              <ul className="space-y-3 text-muted-foreground list-disc list-inside">
                <li>Download & install FastScalper</li>
                <li>Configure API key and host URL</li>
                <li>Set up your trading preferences</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" asChild>
            <a href="/download" className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download FastScalper
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
