"use client"

import { Button } from "@/components/ui/button"
import { Download, Laptop, Monitor, Terminal, ExternalLink, Github, Package, Chrome, FileSpreadsheet, GitBranch, BookOpen } from "lucide-react"
import { useState } from "react"

export default function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState("mac")

  const sdks = [
    { title: "Python", icon: "🐍", url: "https://github.com/marketcalls/openalgo-python-library", docs: "https://docs.openalgo.in/trading-platform/python" },
    { title: "Node.js", icon: "🟢", url: "https://github.com/marketcalls/openalgo-node", docs: "https://docs.openalgo.in/trading-platform/nodejs" },
    { title: "Java", icon: "☕", url: "https://github.com/marketcalls/openalgo-java", docs: "https://docs.openalgo.in/trading-platform/java" },
    { title: ".NET / C#", icon: "🔷", url: "https://github.com/marketcalls/openalgo.NET", docs: "https://docs.openalgo.in/trading-platform/.net" },
    { title: "Go", icon: "🔵", url: "https://github.com/marketcalls/openalgo-go", docs: "https://docs.openalgo.in/trading-platform/go" }
  ]

  const integrations = [
    { title: "Excel Add-in", icon: "📊", url: "https://github.com/marketcalls/OpenAlgo-Excel", docs: "https://docs.openalgo.in/trading-platform/excel" },
    { title: "Amibroker Plugin", icon: "📉", url: "https://github.com/marketcalls/OpenAlgoPlugin", docs: "https://docs.openalgo.in/trading-platform/amibroker/amibroker-plugin" },
    { title: "Backtrader Integration", icon: "🔁", url: "https://github.com/p2c2e/openalgo-backtrader" },
    { title: "PineTS", icon: "⚡", url: "https://github.com/marketcalls/openalgo-pinets" },
    { title: "AlgoMirror", icon: "🪞", url: "https://github.com/marketcalls/algomirror" },
    { title: "MCP / AI Agents", icon: "🤖", url: "https://github.com/marketcalls/openalgo/tree/main/mcp", docs: "https://docs.openalgo.in/mcp" },
    { title: "OpenAlgo Mobile", icon: "📱", url: "https://github.com/marketcalls/openalgo-mobile" },
    { title: "Web Portal", icon: "🌐", url: "https://github.com/marketcalls/openalgo-webpage" },
    { title: "Chrome Plugin", icon: "🧩", url: "https://github.com/marketcalls/openalgo-chrome" },
    { title: "Fast Scalper", icon: "🚄", url: "https://github.com/marketcalls/fastscalper-tauri" }
  ]

  const platformTabs = [
    { id: "mac", label: "macOS", icon: Laptop },
    { id: "linux", label: "Linux", icon: Terminal },
    { id: "windows", label: "Windows", icon: Monitor },
  ]

  const downloads = {
    mac: [
      { platform: "Mac Universal", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_universal.dmg", label: "Download DMG" },
      { platform: "Mac Universal (Portable)", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_universal_mac.zip", label: "Download ZIP" },
    ],
    linux: [
      { platform: "Ubuntu / Debian", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_amd64.deb", label: "Download DEB" },
      { platform: "Fedora / Red Hat", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper-0.1.0-1.x86_64.rpm", label: "Download RPM" },
      { platform: "AppImage", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_amd64.AppImage", label: "Download AppImage" },
    ],
    windows: [
      { platform: "Windows (MSI)", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_x64_en-US.msi", label: "Download MSI" },
      { platform: "Windows (EXE)", version: "v0.1.0", url: "https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_x64-setup.exe", label: "Download EXE" },
    ]
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-display-md text-center mb-14 text-on-surface">Downloads</h1>

        {/* Mini FOSS Universe Section */}
        <div className="mb-20">
          <h2 className="text-display-sm mb-3 text-center text-on-surface">Mini FOSS Universe</h2>
          <p className="text-center text-on-surface-variant mb-6 max-w-3xl mx-auto">
            A curated collection of open-source projects, SDKs, libraries, and integrations that extend the OpenAlgo ecosystem across languages, platforms, and workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["Modular", "Extensible", "Language-agnostic", "Production-ready"].map(tag => (
              <span key={tag} className="px-4 py-1.5 surface-low rounded-full font-label text-label-md text-on-surface-variant">{tag}</span>
            ))}
          </div>

          {/* Core Project */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-5 flex items-center justify-center gap-2">
              <span className="text-xl">🧠</span>
              <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">Core Project</span>
            </h3>
            <div className="flex justify-center">
              <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer"
                 className="obsidian-card p-6 rounded-xl hover-lift group block max-w-lg ghost-border">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-on-surface">OpenAlgo Core</h4>
                  <ExternalLink className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-on-surface-variant">Central heartbeat of the ecosystem - powering the API service, authentication, routing, and platform logic. All SDKs, libraries, and integrations interact with the API endpoints exposed by OpenAlgo Core.</p>
              </a>
            </div>
          </div>

          {/* SDKs */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">SDKs</span>
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Official client packages for application development. Built against <strong className="text-on-surface">API v1</strong> - stable, backward-compatible, and recommended for production use.
            </p>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {sdks.map((sdk, index) => (
                <a key={index} href={sdk.url} target="_blank" rel="noopener noreferrer"
                   className="obsidian-card p-5 rounded-xl hover-lift group ghost-border">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{sdk.icon}</span>
                    <ExternalLink className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-semibold mb-1 text-on-surface">{sdk.title}</h4>
                  {sdk.docs && (
                    <a href={sdk.docs} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-primary hover:underline font-label" onClick={(e) => e.stopPropagation()}>
                      View Docs &rarr;
                    </a>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Libraries */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <span className="font-label text-label-lg uppercase tracking-wider text-on-surface-variant">Libraries & Platform Integrations</span>
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Tools that extend OpenAlgo support to popular trading platforms, analysis tools, and user interfaces.
            </p>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {integrations.map((item, index) => (
                <a key={index} href={item.url} target="_blank" rel="noopener noreferrer"
                   className="obsidian-card p-5 rounded-xl hover-lift group ghost-border">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <ExternalLink className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1 text-on-surface">{item.title}</h4>
                  {item.docs && (
                    <a href={item.docs} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-primary hover:underline font-label" onClick={(e) => e.stopPropagation()}>
                      View Docs &rarr;
                    </a>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Documentation Links */}
          <div className="mb-12 p-8 rounded-xl surface-low ghost-border">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-on-surface">Documentation & Examples</span>
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Each SDK and integration has dedicated documentation with installation steps, configuration guidance, and working examples.
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                { emoji: "🐍", label: "Python Docs", url: "https://docs.openalgo.in/trading-platform/python" },
                { emoji: "🟢", label: "Node.js Docs", url: "https://docs.openalgo.in/trading-platform/nodejs" },
                { emoji: "☕", label: "Java Docs", url: "https://docs.openalgo.in/trading-platform/java" },
                { emoji: "🔷", label: ".NET Docs", url: "https://docs.openalgo.in/trading-platform/.net" },
                { emoji: "🔵", label: "Go Docs", url: "https://docs.openalgo.in/trading-platform/go" },
                { emoji: "📊", label: "Excel Docs", url: "https://docs.openalgo.in/trading-platform/excel" },
                { emoji: "📉", label: "Amibroker Docs", url: "https://docs.openalgo.in/trading-platform/amibroker/amibroker-plugin" },
                { emoji: "🤖", label: "MCP / AI Docs", url: "https://docs.openalgo.in/mcp" },
              ].map(({ emoji, label, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2 font-label">
                  <span>{emoji}</span> {label}
                </a>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <div className="text-center p-8 rounded-xl surface-low ghost-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-tertiary/5" />
            <div className="relative z-10">
              <p className="text-on-surface-variant mb-5 max-w-2xl mx-auto">
                The Mini FOSS Universe reflects OpenAlgo's core philosophy: <strong className="text-on-surface">open standards, transparent design, and tools that adapt to how traders actually work.</strong>
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

        {/* Important Notice */}
        <div className="mb-16 p-8 rounded-xl surface-container ghost-border">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-on-surface">
            <ExternalLink className="h-5 w-5 mr-2 text-primary" />
            Important Requirements
          </h3>
          <p className="text-on-surface mb-4">
            <strong>FastScalper, Chrome Plugin, and Excel Add-ins require:</strong>
          </p>
          <ul className="space-y-2 text-on-surface-variant">
            {[
              "A running OpenAlgo instance (self-hosted or cloud)",
              "Valid API key generated from your OpenAlgo dashboard",
              "Proper host URL configuration pointing to your OpenAlgo instance",
              "Active broker connection configured in OpenAlgo"
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-on-surface-variant">
            Make sure OpenAlgo is running and accessible before using these tools.
            You can generate API keys from Settings &rarr; API Key Management in your OpenAlgo dashboard.
          </p>
        </div>

        {/* FastScalper Section */}
        <div className="mb-16">
          <h2 className="text-display-sm text-center mb-10 text-on-surface">
            FastScalper <span className="text-primary">Desktop</span>
          </h2>

          <div className="rounded-xl surface-low p-8 ghost-border">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-headline-sm text-on-surface">Available Downloads</h3>
              <span className="font-label text-label-md px-3 py-1.5 rounded-full surface-container text-on-surface-variant">
                Version 0.1.0
              </span>
            </div>

            {/* Platform Tabs */}
            <div className="flex gap-2 mb-8 surface-container p-1.5 rounded-xl w-fit">
              {platformTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`flex items-center px-5 py-2.5 rounded-lg font-label text-label-lg transition-all ${
                    activePlatform === id
                      ? "surface-high text-on-surface ambient-shadow"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  onClick={() => setActivePlatform(id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>

            {/* Download Items */}
            <div className="space-y-3">
              {downloads[activePlatform].map(({ platform, version, url, label }) => (
                <div key={platform} className="flex items-center justify-between p-4 rounded-xl surface-container">
                  <div className="flex items-center gap-4">
                    <span className="text-on-surface font-medium">{platform}</span>
                    <span className="font-label text-label-md text-on-surface-variant">{version}</span>
                  </div>
                  <Button size="sm" asChild>
                    <a href={url}>{label}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* FastScalper Features */}
          <div className="mt-12">
            <h3 className="text-headline-md mb-8 text-on-surface">FastScalper Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Cross-Platform Compatibility", items: ["Windows: Multiple instances for tracking various instruments", "macOS: Compatible with Intel and Apple Silicon", "Linux: Available for Ubuntu, Debian, and Fedora"] },
                { title: "Robust Order Management", items: ["Support for CNC, MIS, and NRML product types", "Easy-to-use controls (L, LX, SE, SX)", "Voice alerts for order confirmation"] },
                { title: "Seamless Integration", items: ["Connects to OpenAlgo via API key", "Real-time order monitoring", "Compatible with all trading terminals"] },
                { title: "Customizable Settings", items: ["API key and host URL configuration", "Exchange and product setup options", "Configurable voice alerts"] },
              ].map(({ title, items }) => (
                <div key={title} className="obsidian-card p-6 rounded-xl ghost-border">
                  <h4 className="text-lg font-semibold mb-4 text-on-surface">{title}</h4>
                  <ul className="space-y-2 text-on-surface-variant">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button size="lg" asChild>
                <a href="/fastscalper">Learn More About FastScalper</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Chrome Plugin Section */}
        <div className="mb-16">
          <h2 className="text-display-sm text-center mb-10 text-on-surface">
            <Chrome className="inline h-8 w-8 mr-3 text-primary" />
            Chrome Plugin
          </h2>

          <div className="rounded-xl surface-low p-8 ghost-border">
            <div className="grid md:grid-cols-7 gap-10">
              <div className="md:col-span-4">
                <h3 className="text-lg font-semibold mb-4 text-on-surface">About Chrome Plugin</h3>
                <p className="text-on-surface-variant mb-5 leading-relaxed">
                  The OpenAlgo Chrome Plugin allows you to trade directly from your browser.
                  Perfect for quick order placement while analyzing charts or reading market news.
                </p>
                <ul className="space-y-2 text-on-surface-variant">
                  {["Quick order placement from any webpage", "Secure API key storage", "Support for all OpenAlgo-compatible brokers", "Real-time order status updates"].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-lg font-semibold mb-4 text-on-surface">Download & Installation</h3>
                <div className="space-y-5">
                  <div className="p-5 rounded-xl surface-container">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label text-label-lg text-on-surface">Version 1.0</span>
                      <span className="font-label text-label-md text-tertiary">Latest</span>
                    </div>
                    <Button className="w-full" asChild>
                      <a href="https://github.com/marketcalls/openalgo-chrome/releases/tag/v1.0" target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Chrome Extension
                      </a>
                    </Button>
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    <p className="mb-2 font-label text-label-lg text-on-surface">Installation Steps:</p>
                    <ol className="list-decimal list-inside space-y-1.5">
                      <li>Download the extension package</li>
                      <li>Open Chrome Extensions (chrome://extensions/)</li>
                      <li>Enable Developer Mode</li>
                      <li>Load unpacked extension</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Excel Add-in Section */}
        <div>
          <h2 className="text-display-sm text-center mb-10 text-on-surface">
            <FileSpreadsheet className="inline h-8 w-8 mr-3 text-primary" />
            Excel Add-in
          </h2>

          <div className="rounded-xl surface-low p-8 ghost-border">
            <div className="grid md:grid-cols-7 gap-10">
              <div className="md:col-span-4">
                <h3 className="text-lg font-semibold mb-4 text-on-surface">About Excel Add-in</h3>
                <p className="text-on-surface-variant mb-5 leading-relaxed">
                  Trade directly from Microsoft Excel with the OpenAlgo Excel Add-in.
                  Perfect for traders who prefer spreadsheet-based trading and analysis.
                </p>
                <ul className="space-y-2 text-on-surface-variant">
                  {["Place orders directly from Excel cells", "Real-time position and order tracking", "Custom formulas for trading automation", "Portfolio management in spreadsheets", "Works with Excel 2016 and later"].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-lg font-semibold mb-4 text-on-surface">Download & Setup</h3>
                <div className="space-y-5">
                  <div className="p-5 rounded-xl surface-container">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label text-label-lg text-on-surface">Version 1.0.1</span>
                      <span className="font-label text-label-md text-tertiary">Latest</span>
                    </div>
                    <Button className="w-full" asChild>
                      <a href="https://github.com/marketcalls/OpenAlgo-Excel/releases/tag/v1.0.1" target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Excel Add-in
                      </a>
                    </Button>
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    <p className="mb-2 font-label text-label-lg text-on-surface">Requirements:</p>
                    <ul className="space-y-1.5">
                      {["Microsoft Excel 2016 or later", "Windows 10/11 or macOS", "OpenAlgo instance running", "Valid API credentials"].map(item => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
