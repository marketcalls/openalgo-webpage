"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Github,
  Terminal,
  MessageSquare,
  Send,
  Smartphone,
  Code2,
  Zap,
  Shield,
  Server,
  Package,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Bell,
  TrendingUp,
  Monitor,
  Clock,
} from "lucide-react"
import { useState } from "react"
import dynamic from "next/dynamic"

const WABridgeDiagram = dynamic(() => import("@/components/wabridge-diagram"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[450px] bg-card/50 rounded-lg border border-dashed border-muted-foreground/20 flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading diagram...</p>
    </div>
  ),
})

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  )
}

function CodeBlock({ children, copyText }) {
  return (
    <div className="relative bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
      {copyText && <CopyButton text={copyText} />}
      <pre className="text-zinc-300">{children}</pre>
    </div>
  )
}

export default function WABridgePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-medium text-green-400">
              Open Source
            </span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-400">
              npm + pip
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">WABridge</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            A lightweight WhatsApp HTTP Bridge.
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto">
            Link your WhatsApp via CLI, then send messages through a simple REST API.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button size="lg" asChild>
              <a
                href="https://github.com/marketcalls/wabridge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                Node.js CLI
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/marketcalls/wabridge-python"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Package className="h-5 w-5" />
                Python SDK
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* How It Works - Animated Diagram */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">How It Works</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            WABridge sits between your applications and WhatsApp, routing messages through a local HTTP server.
          </p>
          <WABridgeDiagram />
          <p className="text-center text-xs text-muted-foreground/50 mt-3">
            Amibroker, TradingView, Python, or any app sends HTTP requests to WABridge, which delivers them to WhatsApp.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Zap className="h-10 w-10 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Simple REST API</h3>
            <p className="text-sm text-muted-foreground">
              One POST request to send a message. No complex SDKs or auth flows required.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Shield className="h-10 w-10 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Self-Hosted</h3>
            <p className="text-sm text-muted-foreground">
              Runs on your machine. No third-party cloud services. Your messages stay local.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Code2 className="h-10 w-10 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Python SDK</h3>
            <p className="text-sm text-muted-foreground">
              Send messages from Python with one function call. Sync and async support built in.
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Start</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                <h3 className="text-lg font-semibold">Install & Link WhatsApp</h3>
              </div>
              <div className="space-y-3">
                <CodeBlock copyText="npm install -g wabridge">
                  <span className="text-zinc-500">$</span> npm install -g wabridge
                </CodeBlock>
                <CodeBlock copyText="wabridge">
                  <span className="text-zinc-500">$</span> wabridge{"\n"}
                  <span className="text-zinc-500"># Scan the QR code with WhatsApp</span>{"\n"}
                  <span className="text-zinc-500"># Settings &gt; Linked Devices &gt; Link a Device</span>
                </CodeBlock>
                <p className="text-sm text-muted-foreground">
                  Auth is saved to <code className="text-xs bg-muted px-1.5 py-0.5 rounded">~/.wabridge/</code> — you only need to link once.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                <h3 className="text-lg font-semibold">Start the API Server</h3>
              </div>
              <CodeBlock copyText="wabridge start">
                <span className="text-zinc-500">$</span> wabridge start{"\n"}
                <span className="text-green-400">WABridge server running on port 3000</span>
              </CodeBlock>
            </div>

            {/* Step 3 */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                <h3 className="text-lg font-semibold">Send Messages</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Using curl:</p>
                  <CodeBlock copyText={`curl -X POST http://localhost:3000/send \\\n  -H 'Content-Type: application/json' \\\n  -d '{"phone": "919876543210", "message": "Hello!"}'`}>
                    <span className="text-zinc-500">$</span> curl -X POST http://localhost:3000/send \{"\n"}
                    {"  "}-H <span className="text-amber-300">'Content-Type: application/json'</span> \{"\n"}
                    {"  "}-d <span className="text-green-300">{'\'{"phone": "919876543210", "message": "Hello!"}\''}</span>
                  </CodeBlock>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Using Python:</p>
                  <CodeBlock copyText={`pip install wabridge\n\nfrom wabridge import WABridge\nwa = WABridge()\nwa.send("919876543210", "Hello!")`}>
                    <span className="text-zinc-500">$</span> pip install wabridge{"\n\n"}
                    <span className="text-blue-300">from</span> wabridge <span className="text-blue-300">import</span> WABridge{"\n"}
                    wa = WABridge(){"\n"}
                    wa.send(<span className="text-green-300">"919876543210"</span>, <span className="text-green-300">"Hello!"</span>)
                  </CodeBlock>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Reference */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">API Endpoints</h2>
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-mono font-bold rounded">GET</span>
                <code className="text-sm font-mono">/status</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Check WhatsApp connection status</p>
              <CodeBlock copyText="curl http://localhost:3000/status">
                <span className="text-zinc-500">{"// Response"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"status"</span>: <span className="text-green-300">"open"</span>, <span className="text-blue-300">"user"</span>: <span className="text-green-300">"919876543210@s.whatsapp.net"</span> {"}"}
              </CodeBlock>
            </div>

            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-mono font-bold rounded">POST</span>
                <code className="text-sm font-mono">/send</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Send a message to any phone number</p>
              <CodeBlock copyText='{"phone": "919876543210", "message": "Hello!"}'>
                <span className="text-zinc-500">{"// Body"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"phone"</span>: <span className="text-green-300">"919876543210"</span>, <span className="text-blue-300">"message"</span>: <span className="text-green-300">"Hello!"</span> {"}"}{"\n\n"}
                <span className="text-zinc-500">{"// Response"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"success"</span>: <span className="text-amber-300">true</span>, <span className="text-blue-300">"to"</span>: <span className="text-green-300">"919876543210"</span> {"}"}
              </CodeBlock>
            </div>

            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-mono font-bold rounded">POST</span>
                <code className="text-sm font-mono">/send/self</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Send a message to yourself</p>
              <CodeBlock copyText='{"message": "Test alert"}'>
                <span className="text-zinc-500">{"// Body"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"message"</span>: <span className="text-green-300">"Test alert"</span> {"}"}{"\n\n"}
                <span className="text-zinc-500">{"// Response"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"success"</span>: <span className="text-amber-300">true</span>, <span className="text-blue-300">"to"</span>: <span className="text-green-300">"self"</span> {"}"}
              </CodeBlock>
            </div>
          </div>
        </div>

        {/* Python SDK */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">Python SDK</h2>
          <p className="text-center text-muted-foreground mb-8">One function. Three ways to use it.</p>

          <div className="bg-card rounded-lg p-6">
            <CodeBlock copyText={`from wabridge import WABridge\n\nwa = WABridge()\n\n# Send to yourself\nwa.send("Hello!")\n\n# Send to a contact\nwa.send("919876543210", "Hello!")\n\n# Send to multiple contacts in parallel\nwa.send([\n    ("919876543210", "Alert 1"),\n    ("919876543211", "Alert 2"),\n    ("919876543212", "Alert 3"),\n])`}>
              <span className="text-blue-300">from</span> wabridge <span className="text-blue-300">import</span> WABridge{"\n\n"}
              wa = WABridge(){"\n\n"}
              <span className="text-zinc-500"># Send to yourself</span>{"\n"}
              wa.send(<span className="text-green-300">"Hello!"</span>){"\n\n"}
              <span className="text-zinc-500"># Send to a contact</span>{"\n"}
              wa.send(<span className="text-green-300">"919876543210"</span>, <span className="text-green-300">"Hello!"</span>){"\n\n"}
              <span className="text-zinc-500"># Send to multiple contacts in parallel</span>{"\n"}
              wa.send([{"\n"}
              {"    "}(<span className="text-green-300">"919876543210"</span>, <span className="text-green-300">"Alert 1"</span>),{"\n"}
              {"    "}(<span className="text-green-300">"919876543211"</span>, <span className="text-green-300">"Alert 2"</span>),{"\n"}
              {"    "}(<span className="text-green-300">"919876543212"</span>, <span className="text-green-300">"Alert 3"</span>),{"\n"}
              ])
            </CodeBlock>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="font-mono text-sm mb-1">wa.send(<span className="text-green-400">"msg"</span>)</p>
                <p className="text-xs text-muted-foreground">Send to self</p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="font-mono text-sm mb-1">wa.send(<span className="text-green-400">"phone"</span>, <span className="text-green-400">"msg"</span>)</p>
                <p className="text-xs text-muted-foreground">Send to number</p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="font-mono text-sm mb-1">wa.send(<span className="text-green-400">[...]</span>)</p>
                <p className="text-xs text-muted-foreground">Send to many</p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Trading Alerts</h3>
              </div>
              <CodeBlock copyText='wa.send("BUY NIFTY 24000 CE @ 150")'>
                wa.send(<span className="text-green-300">"BUY NIFTY 24000 CE @ 150"</span>)
              </CodeBlock>
            </div>
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Monitor className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Server Monitoring</h3>
              </div>
              <CodeBlock copyText='if cpu_usage > 90:\n    wa.send("919876543210", f"CPU at {cpu_usage}%")'>
                <span className="text-blue-300">if</span> cpu_usage &gt; <span className="text-amber-300">90</span>:{"\n"}
                {"    "}wa.send(<span className="text-green-300">"91..."</span>, <span className="text-green-300">f"CPU at {"{"}cpu_usage{"}"}%"</span>)
              </CodeBlock>
            </div>
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Send className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Broadcast Messages</h3>
              </div>
              <CodeBlock copyText='wa.send([(n, "Maintenance at 10 PM") for n in numbers])'>
                wa.send([{"\n"}
                {"    "}(n, <span className="text-green-300">"Maintenance at 10 PM"</span>){"\n"}
                {"    "}<span className="text-blue-300">for</span> n <span className="text-blue-300">in</span> numbers{"\n"}
                ])
              </CodeBlock>
            </div>
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Cron Job Notifications</h3>
              </div>
              <CodeBlock copyText='wa.send("Backup completed successfully")'>
                wa.send(<span className="text-green-300">"Backup completed successfully"</span>)
              </CodeBlock>
            </div>
          </div>
        </div>

        {/* CLI Reference */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">CLI Commands</h2>
          <div className="bg-card rounded-lg overflow-hidden border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Command</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4 font-mono text-xs">wabridge</td>
                  <td className="p-4 text-muted-foreground">Link WhatsApp via QR code + interactive CLI</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">wabridge --code</td>
                  <td className="p-4 text-muted-foreground">Link WhatsApp via pairing code</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">wabridge start</td>
                  <td className="p-4 text-muted-foreground">Start API server on port 3000</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">wabridge start 8080</td>
                  <td className="p-4 text-muted-foreground">Start API server on custom port</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-card rounded-lg p-6 mb-16 border">
          <h3 className="font-semibold mb-4">Requirements</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Server className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Node.js &gt;= 20.0.0</p>
                <p className="text-muted-foreground">For the WABridge server</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Code2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Python &gt;= 3.8</p>
                <p className="text-muted-foreground">For the Python SDK (optional)</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Built on <a href="https://github.com/WhiskeySockets/Baileys" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors">Baileys</a>. MIT Licensed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a
                href="https://github.com/marketcalls/wabridge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                View on GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://www.npmjs.com/package/wabridge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Package className="h-5 w-5" />
                npm Package
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
