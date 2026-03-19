"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Zap, Laptop, Settings, Webhook, Terminal, MonitorSmartphone, Keyboard, Volume2, Cpu, Lock } from "lucide-react"

export default function FastScalperPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-display-md mb-6 text-on-surface">FastScalper</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            A lightning-fast, Rust-based desktop application designed for scalpers who demand speed, reliability, and precision in their trading.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Built with Rust for optimal performance and instant order execution" },
            { icon: Cpu, title: "Lightweight", desc: "Minimal resource usage while maintaining powerful functionality" },
            { icon: Lock, title: "Secure", desc: "Built-in security features and encrypted API communication" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="obsidian-card rounded-xl p-8 text-center hover-lift ghost-border group">
              <div className="inline-flex p-3 rounded-xl surface-container mb-5 group-hover:glow-primary transition-all">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-on-surface">{title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Platform Support */}
        <div className="rounded-xl surface-low p-10 mb-16 ghost-border">
          <h2 className="text-headline-md mb-10 text-center text-on-surface">Cross-Platform Support</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: MonitorSmartphone, title: "Windows", items: ["Multiple instance support", "Windows 10 or later", "MSI & EXE installers"] },
              { icon: Laptop, title: "macOS", items: ["Universal binary", "Intel & Apple Silicon", "macOS 10.15 or later"] },
              { icon: Terminal, title: "Linux", items: ["DEB & RPM packages", "AppImage support", "Major distros supported"] },
            ].map(({ icon: Icon, title, items }) => (
              <div key={title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
                </div>
                <ul className="space-y-2 text-on-surface-variant text-sm">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Features */}
        <div className="mb-16">
          <h2 className="text-headline-md mb-8 text-center text-on-surface">Trading Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="obsidian-card rounded-xl p-7 ghost-border">
              <h3 className="text-lg font-semibold mb-5 text-on-surface">Order Management</h3>
              <div className="space-y-5">
                {[
                  { icon: Keyboard, title: "Quick Order Controls", desc: "LE (Long), LX (Exit Long), SE (Short), SX (Exit Short)" },
                  { icon: Settings, title: "Product Types", desc: "CNC (Cash & Carry), MIS (Intraday), NRML (Positional)" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{title}</p>
                      <p className="text-sm text-on-surface-variant">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="obsidian-card rounded-xl p-7 ghost-border">
              <h3 className="text-lg font-semibold mb-5 text-on-surface">Smart Features</h3>
              <div className="space-y-5">
                {[
                  { icon: Volume2, title: "Voice Alerts", desc: "Configurable audio confirmations for order actions" },
                  { icon: Webhook, title: "API Integration", desc: "Seamless connection with OpenAlgo for real-time trading" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{title}</p>
                      <p className="text-sm text-on-surface-variant">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="rounded-xl surface-low p-10 mb-16 ghost-border">
          <h2 className="text-headline-md mb-8 text-center text-on-surface">Getting Started</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-on-surface">Prerequisites</h3>
              <ul className="space-y-3 text-on-surface-variant text-sm">
                {["OpenAlgo installed and running", "API key from OpenAlgo dashboard", "Compatible operating system"].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-on-surface">Quick Setup</h3>
              <ul className="space-y-3 text-on-surface-variant text-sm">
                {["Download & install FastScalper", "Configure API key and host URL", "Set up your trading preferences"].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
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
