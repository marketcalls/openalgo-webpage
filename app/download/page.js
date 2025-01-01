"use client"

import { Button } from "@/components/ui/button"
import { Download, Laptop, Monitor, Terminal } from "lucide-react"
import { useState } from "react"

export default function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState("mac")

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">FastScalper <span className="text-primary">Desktop</span></h1>

        <div className="card bg-card shadow-xl">
          <div className="card-body">
            {/* Version Selector */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Available Downloads</h2>
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
          <h2 className="text-3xl font-bold mb-6">FastScalper Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Cross-Platform Compatibility</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Windows: Multiple instances for tracking various instruments</li>
                <li>macOS: Compatible with Intel and Apple Silicon</li>
                <li>Linux: Available for Ubuntu, Debian, and Fedora</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Robust Order Management</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Support for CNC, MIS, and NRML product types</li>
                <li>Easy-to-use controls (L, LX, SE, SX)</li>
                <li>Voice alerts for order confirmation</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Seamless Integration</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Connects to OpenAlgo via API key</li>
                <li>Real-time order monitoring</li>
                <li>Compatible with all trading terminals</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Customizable Settings</h3>
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
    </div>
  )
}
