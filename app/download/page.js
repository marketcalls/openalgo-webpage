"use client"

import { Button } from "@/components/ui/button"
import { Download, Laptop, Monitor, Terminal, ExternalLink, Github, Package, Chrome, FileSpreadsheet } from "lucide-react"
import { useState } from "react"

export default function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState("mac")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Downloads</h1>

        {/* FOSS Universe Section - Moved to Top */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">OpenAlgo FOSS Universe</h2>
          <p className="text-center text-muted-foreground mb-8">
            Explore the open-source ecosystem around OpenAlgo — built for traders, by traders
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Core Platform */}
            <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🧠</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">OpenAlgo Core</h3>
              <p className="text-sm text-muted-foreground mb-3">Python Flask + Tailwind + DaisyUI</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Main Platform</span>
              </div>
            </a>

            {/* Historify */}
            <a href="https://github.com/marketcalls/historify" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">📦</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Historify</h3>
              <p className="text-sm text-muted-foreground mb-3">Full Stack Stock Market Data Management</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="h-3 w-3" />
                <span>Data Platform</span>
              </div>
            </a>

            {/* Python SDK */}
            <a href="https://github.com/marketcalls/openalgo-python-library" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🐍</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Python SDK</h3>
              <p className="text-sm text-muted-foreground mb-3">MIT-licensed SDK for strategy development</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Library</span>
              </div>
            </a>

            {/* Backtrader */}
            <a href="https://github.com/p2c2e/openalgo-backtrader" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🐍</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">OpenAlgo Backtrader</h3>
              <p className="text-sm text-muted-foreground mb-3">Python Library for backtesting strategies</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Backtesting</span>
              </div>
            </a>

            {/* Node.js */}
            <a href="https://github.com/marketcalls/openalgo-node" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🟢</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Node.js Library</h3>
              <p className="text-sm text-muted-foreground mb-3">JavaScript/TypeScript SDK for OpenAlgo</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Library</span>
              </div>
            </a>

            {/* Excel Add-in */}
            <a href="https://github.com/marketcalls/OpenAlgo-Excel" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">📊</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Excel Add-in</h3>
              <p className="text-sm text-muted-foreground mb-3">Trade directly from Excel spreadsheets</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Integration</span>
              </div>
            </a>

            {/* PineTS */}
            <a href="https://github.com/marketcalls/openalgo-pinets" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">⚡</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">OpenAlgo-PineTS</h3>
              <p className="text-sm text-muted-foreground mb-3">TradingView indicators integration</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>TradingView</span>
              </div>
            </a>

            {/* MCP + AI */}
            <a href="https://github.com/marketcalls/openalgo-mcp" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🤖</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">MCP + AI Agents</h3>
              <p className="text-sm text-muted-foreground mb-3">Model Context Protocol & AI integration</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>AI Integration</span>
              </div>
            </a>

            {/* Chrome Plugin */}
            <a href="https://github.com/marketcalls/openalgo-chrome" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🧩</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Chrome Plugin</h3>
              <p className="text-sm text-muted-foreground mb-3">Browser extension for OpenAlgo</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Browser Extension</span>
              </div>
            </a>

            {/* Fast Scalper */}
            <a href="https://github.com/marketcalls/fastscalper-tauri" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">⚡</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Scalper</h3>
              <p className="text-sm text-muted-foreground mb-3">High-performance app (Rust + Tauri)</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Desktop App</span>
              </div>
            </a>

            {/* Web Portal */}
            <a href="https://github.com/marketcalls/openalgo-webpage" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🌐</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Web Portal</h3>
              <p className="text-sm text-muted-foreground mb-3">NextJS + ShadcnUI web interface</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Website</span>
              </div>
            </a>

            {/* Documentation */}
            <a href="https://github.com/marketcalls/openalgo-docs" target="_blank" rel="noopener noreferrer" 
               className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">📚</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-3">Comprehensive Gitbook documentation</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Github className="h-3 w-3" />
                <span>Docs</span>
              </div>
            </a>
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
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> Both the Chrome Plugin and Excel Add-in require a running OpenAlgo instance 
                  with valid API credentials. Make sure to configure your API keys and host URL after installation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}