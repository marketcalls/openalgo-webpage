"use client"

import { Button } from "@/components/ui/button"
import { Download, Laptop, Monitor, Terminal, ExternalLink, Github, Package, Chrome, FileSpreadsheet, GitBranch, BookOpen } from "lucide-react"
import { useState } from "react"

export default function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState("mac")

  // SDKs data
  const sdks = [
    { title: "Python", icon: "🐍", url: "https://github.com/marketcalls/openalgo-python-library", docs: "https://docs.openalgo.in/trading-platform/python" },
    { title: "Node.js", icon: "🟢", url: "https://github.com/marketcalls/openalgo-node", docs: "https://docs.openalgo.in/trading-platform/nodejs" },
    { title: "Java", icon: "☕", url: "https://github.com/marketcalls/openalgo-java", docs: "https://docs.openalgo.in/trading-platform/java" },
    { title: ".NET / C#", icon: "🔷", url: "https://github.com/marketcalls/openalgo.NET", docs: "https://docs.openalgo.in/trading-platform/.net" },
    { title: "Go", icon: "🔵", url: "https://github.com/marketcalls/openalgo-go", docs: "https://docs.openalgo.in/trading-platform/go" }
  ]

  // Libraries and Platform Integrations
  const integrations = [
    { title: "Excel Add-in", icon: "📊", url: "https://github.com/marketcalls/OpenAlgo-Excel", docs: "https://docs.openalgo.in/trading-platform/excel" },
    { title: "Amibroker Plugin", icon: "📉", url: "https://github.com/marketcalls/OpenAlgoPlugin", docs: "https://docs.openalgo.in/trading-platform/amibroker/amibroker-plugin" },
    { title: "Backtrader Integration", icon: "🔁", url: "https://github.com/p2c2e/openalgo-backtrader" },
    { title: "PineTS", icon: "⚡", url: "https://github.com/marketcalls/openalgo-pinets" },
    { title: "AlgoMirror", icon: "🪞", url: "https://github.com/marketcalls/algomirror" },
    { title: "MCP / AI Agents", icon: "🤖", url: "https://github.com/marketcalls/openalgo-mcp", docs: "https://docs.openalgo.in/mcp" },
    { title: "OpenAlgo Mobile", icon: "📱", url: "https://github.com/marketcalls/openalgo-mobile" },
    { title: "Web Portal", icon: "🌐", url: "https://github.com/marketcalls/openalgo-webpage" },
    { title: "Chrome Plugin", icon: "🧩", url: "https://github.com/marketcalls/openalgo-chrome" },
    { title: "Fast Scalper", icon: "🚄", url: "https://github.com/marketcalls/fastscalper-tauri" }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Downloads</h1>

        {/* Mini FOSS Universe Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">Mini FOSS Universe</h2>
          <p className="text-center text-muted-foreground mb-4 max-w-3xl mx-auto">
            A curated collection of open-source projects, SDKs, libraries, and integrations that extend the OpenAlgo ecosystem across languages, platforms, and workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-3 py-1 bg-muted border rounded-full text-xs font-medium">Modular</span>
            <span className="px-3 py-1 bg-muted border rounded-full text-xs font-medium">Extensible</span>
            <span className="px-3 py-1 bg-muted border rounded-full text-xs font-medium">Language-agnostic</span>
            <span className="px-3 py-1 bg-muted border rounded-full text-xs font-medium">Production-ready</span>
          </div>

          {/* Core Project */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
              <span className="text-xl">🧠</span> Core Project
            </h3>
            <div className="flex justify-center">
              <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer"
                 className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group block max-w-lg">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">🧠</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <h4 className="font-semibold mb-2">OpenAlgo Core</h4>
                <p className="text-sm text-muted-foreground">Central heartbeat of the ecosystem — powering the API service, authentication, routing, and platform logic. All SDKs, libraries, and integrations interact with the API endpoints exposed by OpenAlgo Core.</p>
              </a>
            </div>
          </div>

          {/* SDKs Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> SDKs
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Official client packages for application development. Built against <strong>API v1</strong> — stable, backward-compatible, and recommended for production use.
            </p>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {sdks.map((sdk, index) => (
                <a key={index} href={sdk.url} target="_blank" rel="noopener noreferrer"
                   className="bg-card p-5 rounded-lg border hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{sdk.icon}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1">{sdk.title}</h4>
                  {sdk.docs && (
                    <a href={sdk.docs} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      View Docs →
                    </a>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Libraries and Platform Integrations */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" /> Libraries & Platform Integrations
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tools that extend OpenAlgo support to popular trading platforms, analysis tools, and user interfaces.
            </p>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {integrations.map((item, index) => (
                <a key={index} href={item.url} target="_blank" rel="noopener noreferrer"
                   className="bg-card p-5 rounded-lg border hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  {item.docs && (
                    <a href={item.docs} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      View Docs →
                    </a>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Documentation Links */}
          <div className="mb-10 p-6 bg-muted/50 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Documentation & Examples
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Each SDK and integration has dedicated documentation with installation steps, configuration guidance, and working examples.
            </p>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <a href="https://docs.openalgo.in/trading-platform/python" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <span>🐍</span> Python Docs
              </a>
              <a href="https://docs.openalgo.in/trading-platform/nodejs" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <span>🟢</span> Node.js Docs
              </a>
              <a href="https://docs.openalgo.in/trading-platform/java" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <span>☕</span> Java Docs
              </a>
              <a href="https://docs.openalgo.in/trading-platform/.net" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <span>🔷</span> .NET Docs
              </a>
              <a href="https://docs.openalgo.in/trading-platform/go" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <span>🔵</span> Go Docs
              </a>
              <a href="https://docs.openalgo.in/trading-platform/excel" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <span>📊</span> Excel Docs
              </a>
              <a href="https://docs.openalgo.in/trading-platform/amibroker/amibroker-plugin" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <span>📉</span> Amibroker Docs
              </a>
              <a href="https://docs.openalgo.in/mcp" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <span>🤖</span> MCP / AI Docs
              </a>
            </div>
          </div>

          {/* Philosophy */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-green-500/5 rounded-lg border">
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              The Mini FOSS Universe reflects OpenAlgo's core philosophy: <strong>open standards, transparent design, and tools that adapt to how traders actually work.</strong>
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/marketcalls" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Explore All Projects on GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-16 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <ExternalLink className="h-5 w-5 mr-2 text-amber-600" />
            Important Requirements
          </h3>
          <p className="text-amber-800 dark:text-amber-300 mb-3">
            <strong>FastScalper, Chrome Plugin, and Excel Add-ins require:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-400">
            <li>A running OpenAlgo instance (self-hosted or cloud)</li>
            <li>Valid API key generated from your OpenAlgo dashboard</li>
            <li>Proper host URL configuration pointing to your OpenAlgo instance</li>
            <li>Active broker connection configured in OpenAlgo</li>
          </ul>
          <p className="mt-3 text-sm text-amber-600 dark:text-amber-500">
            Make sure OpenAlgo is running and accessible before using these tools. 
            You can generate API keys from Settings → API Key Management in your OpenAlgo dashboard.
          </p>
        </div>

        {/* FastScalper Section - Moved Below */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">FastScalper <span className="text-primary">Desktop</span></h2>
          
          <div className="card bg-card shadow-xl">
            <div className="card-body">
              {/* Version Selector */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Available Downloads</h3>
                <select className="select select-bordered w-full max-w-xs">
                  <option value="0.1.0">Version 0.1.0</option>
                </select>
              </div>

              {/* Platform Tabs */}
              <div className="flex space-x-2 mb-6 bg-muted p-1 rounded-lg">
                <button
                  className={`flex items-center px-4 py-2 rounded-md ${activePlatform === "mac" ? "bg-background shadow-sm" : ""}`}
                  onClick={() => setActivePlatform("mac")}
                >
                  <Laptop className="w-5 h-5 mr-2" />
                  macOS
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-md ${activePlatform === "linux" ? "bg-background shadow-sm" : ""}`}
                  onClick={() => setActivePlatform("linux")}
                >
                  <Terminal className="w-5 h-5 mr-2" />
                  Linux
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-md ${activePlatform === "windows" ? "bg-background shadow-sm" : ""}`}
                  onClick={() => setActivePlatform("windows")}
                >
                  <Monitor className="w-5 h-5 mr-2" />
                  Windows
                </button>
              </div>

              {/* Download Tables */}
              <div className={`${activePlatform === "mac" ? "" : "hidden"}`}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Platform</th>
                      <th className="text-left py-2">Version</th>
                      <th className="text-left py-2">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">Mac Universal</td>
                      <td>v0.1.0</td>
                      <td>
                        <Button size="sm" asChild>
                          <a href="https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_universal.dmg">
                            Download DMG
                          </a>
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Mac Universal (Portable)</td>
                      <td>v0.1.0</td>
                      <td>
                        <Button size="sm" asChild>
                          <a href="https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_universal_mac.zip">
                            Download ZIP
                          </a>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${activePlatform === "linux" ? "" : "hidden"}`}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Platform</th>
                      <th className="text-left py-2">Version</th>
                      <th className="text-left py-2">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">Ubuntu / Debian</td>
                      <td>v0.1.0</td>
                      <td>
                        <Button size="sm" asChild>
                          <a href="https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_amd64.deb">
                            Download DEB
                          </a>
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Fedora / Red Hat</td>
                      <td>v0.1.0</td>
                      <td>
                        <Button size="sm" asChild>
                          <a href="https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper-0.1.0-1.x86_64.rpm">
                            Download RPM
                          </a>
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">AppImage</td>
                      <td>v0.1.0</td>
                      <td>
                        <Button size="sm" asChild>
                          <a href="https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_amd64.AppImage">
                            Download AppImage
                          </a>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${activePlatform === "windows" ? "" : "hidden"}`}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Platform</th>
                      <th className="text-left py-2">Version</th>
                      <th className="text-left py-2">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">Windows (MSI)</td>
                      <td>v0.1.0</td>
                      <td>
                        <Button size="sm" asChild>
                          <a href="https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_x64_en-US.msi">
                            Download MSI
                          </a>
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Windows (EXE)</td>
                      <td>v0.1.0</td>
                      <td>
                        <Button size="sm" asChild>
                          <a href="https://github.com/marketcalls/fastscalper-tauri/releases/download/v0.1.0/fastscalper_0.1.0_x64-setup.exe">
                            Download EXE
                          </a>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FastScalper Features Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">FastScalper Features</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Cross-Platform Compatibility</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Windows: Multiple instances for tracking various instruments</li>
                  <li>macOS: Compatible with Intel and Apple Silicon</li>
                  <li>Linux: Available for Ubuntu, Debian, and Fedora</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Robust Order Management</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Support for CNC, MIS, and NRML product types</li>
                  <li>Easy-to-use controls (L, LX, SE, SX)</li>
                  <li>Voice alerts for order confirmation</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Seamless Integration</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Connects to OpenAlgo via API key</li>
                  <li>Real-time order monitoring</li>
                  <li>Compatible with all trading terminals</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">Customizable Settings</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>API key and host URL configuration</li>
                  <li>Exchange and product setup options</li>
                  <li>Configurable voice alerts</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <a href="/fastscalper">Learn More About FastScalper</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Chrome Plugin Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <Chrome className="inline h-8 w-8 mr-2 text-primary" />
            Chrome Plugin
          </h2>
          
          <div className="card bg-card shadow-xl">
            <div className="card-body">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About Chrome Plugin</h3>
                  <p className="text-muted-foreground mb-4">
                    The OpenAlgo Chrome Plugin allows you to trade directly from your browser. 
                    Perfect for quick order placement while analyzing charts or reading market news.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Quick order placement from any webpage</li>
                    <li>Secure API key storage</li>
                    <li>Support for all OpenAlgo-compatible brokers</li>
                    <li>Real-time order status updates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Download & Installation</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Version 1.0</span>
                        <span className="text-sm text-muted-foreground">Latest Release</span>
                      </div>
                      <Button className="w-full" asChild>
                        <a href="https://github.com/marketcalls/openalgo-chrome/releases/tag/v1.0" target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download Chrome Extension
                        </a>
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2"><strong>Installation Steps:</strong></p>
                      <ol className="list-decimal list-inside space-y-1">
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
        </div>

        {/* Excel Add-in Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <FileSpreadsheet className="inline h-8 w-8 mr-2 text-primary" />
            Excel Add-in
          </h2>
          
          <div className="card bg-card shadow-xl">
            <div className="card-body">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About Excel Add-in</h3>
                  <p className="text-muted-foreground mb-4">
                    Trade directly from Microsoft Excel with the OpenAlgo Excel Add-in. 
                    Perfect for traders who prefer spreadsheet-based trading and analysis.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Place orders directly from Excel cells</li>
                    <li>Real-time position and order tracking</li>
                    <li>Custom formulas for trading automation</li>
                    <li>Portfolio management in spreadsheets</li>
                    <li>Works with Excel 2016 and later</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Download & Setup</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Version 1.0.1</span>
                        <span className="text-sm text-muted-foreground">Latest Release</span>
                      </div>
                      <Button className="w-full" asChild>
                        <a href="https://github.com/marketcalls/OpenAlgo-Excel/releases/tag/v1.0.1" target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download Excel Add-in
                        </a>
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2"><strong>Requirements:</strong></p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Microsoft Excel 2016 or later</li>
                        <li>Windows 10/11 or macOS</li>
                        <li>OpenAlgo instance running</li>
                        <li>Valid API credentials</li>
                      </ul>
                    </div>
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