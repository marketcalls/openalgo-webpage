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
  Image,
  Users,
  FileText,
} from "lucide-react"
import { useState } from "react"
import dynamic from "next/dynamic"

const WABridgeDiagram = dynamic(() => import("@/components/wabridge-diagram"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[350px] bg-card/50 rounded-lg border border-dashed border-muted-foreground/20 flex items-center justify-center">
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
            Link your WhatsApp via CLI, then send messages through a simple REST API. Supports text, images, video, audio, documents — to individuals, groups, and channels.
          </p>

          {/* Install command above the fold */}
          <div className="max-w-md mx-auto mt-8">
            <CodeBlock copyText="npm install -g wabridge">
              <span className="text-zinc-500">$</span> npm install -g wabridge
            </CodeBlock>
            <p className="text-xs text-muted-foreground mt-2">
              Or run directly: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">npx wabridge</code>
            </p>
          </div>

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
            Your App sends HTTP requests to WABridge, which delivers them to WhatsApp.
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
            <Image className="h-10 w-10 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Rich Media</h3>
            <p className="text-sm text-muted-foreground">
              Send images, videos, voice notes, and documents. Supports URLs and local file paths.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="h-10 w-10 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Groups & Channels</h3>
            <p className="text-sm text-muted-foreground">
              Send to individuals, groups, and channels. List groups with their JIDs programmatically.
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
          <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <Terminal className="h-10 w-10 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Interactive CLI</h3>
            <p className="text-sm text-muted-foreground">
              Test messages interactively from the terminal. Link via QR code or pairing code.
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
                <h3 className="text-lg font-semibold">Link WhatsApp</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium">QR Code (default):</p>
                <CodeBlock copyText="wabridge">
                  <span className="text-zinc-500">$</span> wabridge{"\n"}
                  <span className="text-zinc-500"># Scan the QR code with WhatsApp</span>{"\n"}
                  <span className="text-zinc-500"># Settings &gt; Linked Devices &gt; Link a Device</span>
                </CodeBlock>
                <p className="text-sm text-muted-foreground font-medium mt-4">Pairing Code (alternative):</p>
                <CodeBlock copyText="wabridge --code">
                  <span className="text-zinc-500">$</span> wabridge --code{"\n"}
                  <span className="text-zinc-500"># Enter your phone number and get an 8-digit pairing code</span>{"\n"}
                  <span className="text-zinc-500"># WhatsApp &gt; Linked Devices &gt; Link a Device &gt; Link with phone number</span>
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
              <p className="text-sm text-muted-foreground mt-3">
                Custom port: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">wabridge start 8080</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded">PORT=8080 wabridge start</code>
              </p>
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
                  <CodeBlock copyText={`curl -X POST http://localhost:3000/send \\\n  -H 'Content-Type: application/json' \\\n  -d '{"phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150"}'`}>
                    <span className="text-zinc-500">$</span> curl -X POST http://localhost:3000/send \{"\n"}
                    {"  "}-H <span className="text-amber-300">'Content-Type: application/json'</span> \{"\n"}
                    {"  "}-d <span className="text-green-300">{'\'{"phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150"}\''}</span>
                  </CodeBlock>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Using Python:</p>
                  <CodeBlock copyText={`pip install wabridge\n\nfrom wabridge import WABridge\nwa = WABridge()\nwa.send("919876543210", "BUY NIFTY 24000 CE @ 150")`}>
                    <span className="text-zinc-500">$</span> pip install wabridge{"\n\n"}
                    <span className="text-blue-300">from</span> wabridge <span className="text-blue-300">import</span> WABridge{"\n"}
                    wa = WABridge(){"\n"}
                    wa.send(<span className="text-green-300">"919876543210"</span>, <span className="text-green-300">"BUY NIFTY 24000 CE @ 150"</span>)
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
            {/* GET /status */}
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

            {/* GET /groups */}
            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-mono font-bold rounded">GET</span>
                <code className="text-sm font-mono">/groups</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">List all WhatsApp groups with their JIDs</p>
              <CodeBlock copyText="curl http://localhost:3000/groups">
                <span className="text-zinc-500">{"// Response"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"groups"</span>: [{"\n"}
                {"    "}{"{"} <span className="text-blue-300">"id"</span>: <span className="text-green-300">"120363012345@g.us"</span>, <span className="text-blue-300">"subject"</span>: <span className="text-green-300">"Trading Alerts"</span>,{"\n"}
                {"      "}<span className="text-blue-300">"size"</span>: <span className="text-amber-300">15</span>, <span className="text-blue-300">"desc"</span>: <span className="text-green-300">"Group description"</span> {"}"}{"\n"}
                {"  "}] {"}"}
              </CodeBlock>
            </div>

            {/* POST /send - Text */}
            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-mono font-bold rounded">POST</span>
                <code className="text-sm font-mono">/send</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Send text, image, video, audio, or document to any phone number</p>
              <div className="space-y-3">
                <CodeBlock copyText='{"phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150"}'>
                  <span className="text-zinc-500">{"// Text message"}</span>{"\n"}
                  {"{"} <span className="text-blue-300">"phone"</span>: <span className="text-green-300">"919876543210"</span>, <span className="text-blue-300">"message"</span>: <span className="text-green-300">"BUY NIFTY 24000 CE @ 150"</span> {"}"}{"\n\n"}
                  <span className="text-zinc-500">{"// Response"}</span>{"\n"}
                  {"{"} <span className="text-blue-300">"success"</span>: <span className="text-amber-300">true</span>, <span className="text-blue-300">"to"</span>: <span className="text-green-300">"919876543210"</span> {"}"}
                </CodeBlock>
                <CodeBlock copyText='{"phone": "919876543210", "image": "https://charts.example.com/nifty.png", "caption": "NIFTY Daily Chart"}'>
                  <span className="text-zinc-500">{"// Image with caption"}</span>{"\n"}
                  {"{"} <span className="text-blue-300">"phone"</span>: <span className="text-green-300">"919876543210"</span>,{"\n"}
                  {"  "}<span className="text-blue-300">"image"</span>: <span className="text-green-300">"https://charts.example.com/nifty.png"</span>,{"\n"}
                  {"  "}<span className="text-blue-300">"caption"</span>: <span className="text-green-300">"NIFTY Daily Chart"</span> {"}"}
                </CodeBlock>
                <CodeBlock copyText='{"phone": "919876543210", "video": "https://example.com/market-recap.mp4", "caption": "Market Recap"}'>
                  <span className="text-zinc-500">{"// Video with caption"}</span>{"\n"}
                  {"{"} <span className="text-blue-300">"phone"</span>: <span className="text-green-300">"919876543210"</span>,{"\n"}
                  {"  "}<span className="text-blue-300">"video"</span>: <span className="text-green-300">"https://example.com/market-recap.mp4"</span>,{"\n"}
                  {"  "}<span className="text-blue-300">"caption"</span>: <span className="text-green-300">"Market Recap"</span> {"}"}
                </CodeBlock>
                <CodeBlock copyText='{"phone": "919876543210", "audio": "https://example.com/voice.ogg"}'>
                  <span className="text-zinc-500">{"// Voice note"}</span>{"\n"}
                  {"{"} <span className="text-blue-300">"phone"</span>: <span className="text-green-300">"919876543210"</span>,{"\n"}
                  {"  "}<span className="text-blue-300">"audio"</span>: <span className="text-green-300">"https://example.com/voice.ogg"</span> {"}"}
                </CodeBlock>
                <CodeBlock copyText='{"phone": "919876543210", "document": "https://example.com/pnl-report.pdf", "mimetype": "application/pdf", "fileName": "pnl-report.pdf"}'>
                  <span className="text-zinc-500">{"// Document"}</span>{"\n"}
                  {"{"} <span className="text-blue-300">"phone"</span>: <span className="text-green-300">"919876543210"</span>,{"\n"}
                  {"  "}<span className="text-blue-300">"document"</span>: <span className="text-green-300">"https://example.com/pnl-report.pdf"</span>,{"\n"}
                  {"  "}<span className="text-blue-300">"mimetype"</span>: <span className="text-green-300">"application/pdf"</span>,{"\n"}
                  {"  "}<span className="text-blue-300">"fileName"</span>: <span className="text-green-300">"pnl-report.pdf"</span> {"}"}
                </CodeBlock>
              </div>
            </div>

            {/* POST /send/self */}
            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-mono font-bold rounded">POST</span>
                <code className="text-sm font-mono">/send/self</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Send a message to yourself</p>
              <CodeBlock copyText='{"message": "Portfolio P&L: +5000"}'>
                <span className="text-zinc-500">{"// Body"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"message"</span>: <span className="text-green-300">"Portfolio P&L: +5000"</span> {"}"}{"\n\n"}
                <span className="text-zinc-500">{"// Response"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"success"</span>: <span className="text-amber-300">true</span>, <span className="text-blue-300">"to"</span>: <span className="text-green-300">"self"</span> {"}"}
              </CodeBlock>
            </div>

            {/* POST /send/group */}
            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-mono font-bold rounded">POST</span>
                <code className="text-sm font-mono">/send/group</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Send a message to a WhatsApp group</p>
              <CodeBlock copyText='{"groupId": "120363012345@g.us", "message": "NIFTY crossed 25000! Book profits."}'>
                <span className="text-zinc-500">{"// Body"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"groupId"</span>: <span className="text-green-300">"120363012345@g.us"</span>,{"\n"}
                {"  "}<span className="text-blue-300">"message"</span>: <span className="text-green-300">"NIFTY crossed 25000! Book profits."</span> {"}"}
              </CodeBlock>
            </div>

            {/* POST /send/channel */}
            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-mono font-bold rounded">POST</span>
                <code className="text-sm font-mono">/send/channel</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Send a message to a WhatsApp channel</p>
              <CodeBlock copyText='{"channelId": "120363098765@newsletter", "message": "Market closed. NIFTY +1.2% | BANKNIFTY +0.8%"}'>
                <span className="text-zinc-500">{"// Body"}</span>{"\n"}
                {"{"} <span className="text-blue-300">"channelId"</span>: <span className="text-green-300">"120363098765@newsletter"</span>,{"\n"}
                {"  "}<span className="text-blue-300">"message"</span>: <span className="text-green-300">"Market closed. NIFTY +1.2% | BANKNIFTY +0.8%"</span> {"}"}
              </CodeBlock>
            </div>
          </div>
        </div>

        {/* Message Content Fields */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Message Content Fields</h2>
          <p className="text-center text-muted-foreground mb-8">
            All send endpoints (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">/send</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/send/self</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/send/group</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/send/channel</code>) accept these content fields:
          </p>
          <div className="bg-card rounded-lg overflow-hidden border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Field</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold hidden sm:table-cell">Extra Fields</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4 font-mono text-xs">message</td>
                  <td className="p-4 text-muted-foreground text-xs">string</td>
                  <td className="p-4 text-muted-foreground text-xs hidden sm:table-cell">—</td>
                  <td className="p-4 text-muted-foreground">Text message</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">image</td>
                  <td className="p-4 text-muted-foreground text-xs">URL or file path</td>
                  <td className="p-4 text-muted-foreground text-xs hidden sm:table-cell">caption?</td>
                  <td className="p-4 text-muted-foreground">Image with optional caption</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">video</td>
                  <td className="p-4 text-muted-foreground text-xs">URL or file path</td>
                  <td className="p-4 text-muted-foreground text-xs hidden sm:table-cell">caption?</td>
                  <td className="p-4 text-muted-foreground">Video with optional caption</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">audio</td>
                  <td className="p-4 text-muted-foreground text-xs">URL or file path</td>
                  <td className="p-4 text-muted-foreground text-xs hidden sm:table-cell">ptt? (default: true)</td>
                  <td className="p-4 text-muted-foreground">Voice note or audio file</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">document</td>
                  <td className="p-4 text-muted-foreground text-xs">URL or file path</td>
                  <td className="p-4 text-muted-foreground text-xs hidden sm:table-cell">mimetype (required), fileName?, caption?</td>
                  <td className="p-4 text-muted-foreground">Document attachment</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Media fields accept both remote URLs (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">https://...</code>) and local file paths (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">/path/to/file</code>).
          </p>
        </div>

        {/* Python SDK */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-center">Python SDK</h2>
          <p className="text-center text-muted-foreground mb-8">Send messages from Python with a single function call. Supports text, media, groups, channels, and async.</p>

          {/* Basic Usage */}
          <div className="bg-card rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Basic Usage</h3>
            <CodeBlock copyText={`from wabridge import WABridge\n\nwa = WABridge()\n\n# Send to yourself\nwa.send("Portfolio P&L: +5000")\n\n# Send to a contact\nwa.send("919876543210", "BUY NIFTY 24000 CE @ 150")\n\n# Send to multiple contacts in parallel\nwa.send([\n    ("919876543210", "BUY NIFTY 24000 CE @ 150"),\n    ("919876543211", "BUY BANKNIFTY 52000 CE @ 200"),\n    ("919876543212", "SELL RELIANCE 2800 PE @ 50"),\n])`}>
              <span className="text-blue-300">from</span> wabridge <span className="text-blue-300">import</span> WABridge{"\n\n"}
              wa = WABridge(){"\n\n"}
              <span className="text-zinc-500"># Send to yourself</span>{"\n"}
              wa.send(<span className="text-green-300">"Portfolio P&L: +5000"</span>){"\n\n"}
              <span className="text-zinc-500"># Send to a contact</span>{"\n"}
              wa.send(<span className="text-green-300">"919876543210"</span>, <span className="text-green-300">"BUY NIFTY 24000 CE @ 150"</span>){"\n\n"}
              <span className="text-zinc-500"># Send to multiple contacts in parallel</span>{"\n"}
              wa.send([{"\n"}
              {"    "}(<span className="text-green-300">"919876543210"</span>, <span className="text-green-300">"BUY NIFTY 24000 CE @ 150"</span>),{"\n"}
              {"    "}(<span className="text-green-300">"919876543211"</span>, <span className="text-green-300">"BUY BANKNIFTY 52000 CE @ 200"</span>),{"\n"}
              {"    "}(<span className="text-green-300">"919876543212"</span>, <span className="text-green-300">"SELL RELIANCE 2800 PE @ 50"</span>),{"\n"}
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

          {/* Media Messages */}
          <div className="bg-card rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Media Messages</h3>
            <CodeBlock copyText={`wa = WABridge()\n\n# Image from URL\nwa.send("919876543210", image="https://charts.example.com/nifty.png", caption="NIFTY Daily Chart")\n\n# Image from local file path\nwa.send("919876543210", image="/path/to/chart.png", caption="Local chart")\n\n# Image to self\nwa.send(image="https://charts.example.com/nifty.png", caption="NIFTY Chart")\n\n# Video\nwa.send("919876543210", video="https://example.com/market-recap.mp4", caption="Market Recap")\n\n# Voice note\nwa.send("919876543210", audio="https://example.com/voice.ogg")\n\n# Audio file (not voice note)\nwa.send("919876543210", audio="https://example.com/audio.mp3", ptt=False)\n\n# Document\nwa.send("919876543210", document="https://example.com/pnl-report.pdf", mimetype="application/pdf", filename="pnl-report.pdf")`}>
              wa = WABridge(){"\n\n"}
              <span className="text-zinc-500"># Image from URL</span>{"\n"}
              wa.send(<span className="text-green-300">"919876543210"</span>, image=<span className="text-green-300">"https://charts.example.com/nifty.png"</span>,{"\n"}
              {"      "}caption=<span className="text-green-300">"NIFTY Daily Chart"</span>){"\n\n"}
              <span className="text-zinc-500"># Image from local file path</span>{"\n"}
              wa.send(<span className="text-green-300">"919876543210"</span>, image=<span className="text-green-300">"/path/to/chart.png"</span>, caption=<span className="text-green-300">"Local chart"</span>){"\n\n"}
              <span className="text-zinc-500"># Image to self</span>{"\n"}
              wa.send(image=<span className="text-green-300">"https://charts.example.com/nifty.png"</span>, caption=<span className="text-green-300">"NIFTY Chart"</span>){"\n\n"}
              <span className="text-zinc-500"># Video</span>{"\n"}
              wa.send(<span className="text-green-300">"919876543210"</span>, video=<span className="text-green-300">"https://example.com/market-recap.mp4"</span>,{"\n"}
              {"      "}caption=<span className="text-green-300">"Market Recap"</span>){"\n\n"}
              <span className="text-zinc-500"># Voice note</span>{"\n"}
              wa.send(<span className="text-green-300">"919876543210"</span>, audio=<span className="text-green-300">"https://example.com/voice.ogg"</span>){"\n\n"}
              <span className="text-zinc-500"># Audio file (not voice note)</span>{"\n"}
              wa.send(<span className="text-green-300">"919876543210"</span>, audio=<span className="text-green-300">"https://example.com/audio.mp3"</span>, ptt=<span className="text-amber-300">False</span>){"\n\n"}
              <span className="text-zinc-500"># Document</span>{"\n"}
              wa.send(<span className="text-green-300">"919876543210"</span>, document=<span className="text-green-300">"https://example.com/pnl-report.pdf"</span>,{"\n"}
              {"      "}mimetype=<span className="text-green-300">"application/pdf"</span>, filename=<span className="text-green-300">"pnl-report.pdf"</span>)
            </CodeBlock>
          </div>

          {/* Groups & Channels */}
          <div className="bg-card rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Groups & Channels</h3>
            <CodeBlock copyText={`wa = WABridge()\n\n# List all groups\ngroups = wa.groups()\nfor g in groups:\n    print(f"{g['subject']} - {g['id']}")\n\n# Send text to group\nwa.send_group("120363012345@g.us", "Market closed. P&L: +5000")\n\n# Send image to group\nwa.send_group("120363012345@g.us", image="https://charts.example.com/nifty.png", caption="NIFTY EOD Chart")\n\n# Send to channel\nwa.send_channel("120363098765@newsletter", "NIFTY +1.2% | BANKNIFTY +0.8%")`}>
              wa = WABridge(){"\n\n"}
              <span className="text-zinc-500"># List all groups</span>{"\n"}
              groups = wa.groups(){"\n"}
              <span className="text-blue-300">for</span> g <span className="text-blue-300">in</span> groups:{"\n"}
              {"    "}print(<span className="text-green-300">f"</span>{"{"}g[<span className="text-green-300">'subject'</span>]{"}"} - {"{"}g[<span className="text-green-300">'id'</span>]{"}"}<span className="text-green-300">"</span>){"\n\n"}
              <span className="text-zinc-500"># Send text to group</span>{"\n"}
              wa.send_group(<span className="text-green-300">"120363012345@g.us"</span>, <span className="text-green-300">"Market closed. P&L: +5000"</span>){"\n\n"}
              <span className="text-zinc-500"># Send image to group</span>{"\n"}
              wa.send_group(<span className="text-green-300">"120363012345@g.us"</span>,{"\n"}
              {"              "}image=<span className="text-green-300">"https://charts.example.com/nifty.png"</span>,{"\n"}
              {"              "}caption=<span className="text-green-300">"NIFTY EOD Chart"</span>){"\n\n"}
              <span className="text-zinc-500"># Send to channel</span>{"\n"}
              wa.send_channel(<span className="text-green-300">"120363098765@newsletter"</span>,{"\n"}
              {"               "}<span className="text-green-300">"NIFTY +1.2% | BANKNIFTY +0.8%"</span>)
            </CodeBlock>
          </div>

          {/* Configuration & Async */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Configuration</h3>
              <CodeBlock copyText={`# Default - localhost:3000\nwa = WABridge()\n\n# Custom port\nwa = WABridge(port=8080)\n\n# Custom host and port\nwa = WABridge(host="192.168.1.100", port=4000)\n\n# Custom timeout (default 30s)\nwa = WABridge(timeout=60.0)`}>
                <span className="text-zinc-500"># Default - localhost:3000</span>{"\n"}
                wa = WABridge(){"\n\n"}
                <span className="text-zinc-500"># Custom port</span>{"\n"}
                wa = WABridge(port=<span className="text-amber-300">8080</span>){"\n\n"}
                <span className="text-zinc-500"># Custom host and port</span>{"\n"}
                wa = WABridge({"\n"}
                {"    "}host=<span className="text-green-300">"192.168.1.100"</span>,{"\n"}
                {"    "}port=<span className="text-amber-300">4000</span>{"\n"}
                ){"\n\n"}
                <span className="text-zinc-500"># Custom timeout (default 30s)</span>{"\n"}
                wa = WABridge(timeout=<span className="text-amber-300">60.0</span>)
              </CodeBlock>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Async Support</h3>
              <CodeBlock copyText={`import asyncio\nfrom wabridge import AsyncWABridge\n\nasync def main():\n    async with AsyncWABridge() as wa:\n        await wa.send("Portfolio update")\n        await wa.send("919876543210",\n            "BUY NIFTY 24000 CE @ 150")\n        await wa.send_group(\n            "id@g.us", "Market alert!")\n\nasyncio.run(main())`}>
                <span className="text-blue-300">import</span> asyncio{"\n"}
                <span className="text-blue-300">from</span> wabridge <span className="text-blue-300">import</span> AsyncWABridge{"\n\n"}
                <span className="text-blue-300">async def</span> main():{"\n"}
                {"    "}<span className="text-blue-300">async with</span> AsyncWABridge() <span className="text-blue-300">as</span> wa:{"\n"}
                {"        "}<span className="text-blue-300">await</span> wa.send(<span className="text-green-300">"Portfolio update"</span>){"\n"}
                {"        "}<span className="text-blue-300">await</span> wa.send(<span className="text-green-300">"919876543210"</span>,{"\n"}
                {"            "}<span className="text-green-300">"BUY NIFTY 24000 CE @ 150"</span>){"\n"}
                {"        "}<span className="text-blue-300">await</span> wa.send_group({"\n"}
                {"            "}<span className="text-green-300">"id@g.us"</span>, <span className="text-green-300">"Market alert!"</span>){"\n\n"}
                asyncio.run(main())
              </CodeBlock>
            </div>
          </div>

          {/* Error Handling */}
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Error Handling</h3>
            <CodeBlock copyText={`from wabridge import WABridge, ConnectionError, ValidationError\n\nwa = WABridge()\n\ntry:\n    wa.send("919876543210", "BUY NIFTY 24000 CE @ 150")\nexcept ConnectionError:\n    print("WhatsApp is not connected. Run: wabridge start")\nexcept ValidationError as e:\n    print(f"Bad request: {e.message}")`}>
              <span className="text-blue-300">from</span> wabridge <span className="text-blue-300">import</span> WABridge, ConnectionError, ValidationError{"\n\n"}
              wa = WABridge(){"\n\n"}
              <span className="text-blue-300">try</span>:{"\n"}
              {"    "}wa.send(<span className="text-green-300">"919876543210"</span>, <span className="text-green-300">"BUY NIFTY 24000 CE @ 150"</span>){"\n"}
              <span className="text-blue-300">except</span> ConnectionError:{"\n"}
              {"    "}print(<span className="text-green-300">"WhatsApp is not connected. Run: wabridge start"</span>){"\n"}
              <span className="text-blue-300">except</span> ValidationError <span className="text-blue-300">as</span> e:{"\n"}
              {"    "}print(<span className="text-green-300">f"Bad request: </span>{"{"}e.message{"}"}<span className="text-green-300">"</span>)
            </CodeBlock>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div className="p-3 rounded-md bg-muted/50">
                <p className="font-mono text-xs mb-1 text-red-400">WABridgeError</p>
                <p className="text-xs text-muted-foreground">Base exception for all errors</p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="font-mono text-xs mb-1 text-red-400">ConnectionError</p>
                <p className="text-xs text-muted-foreground">WhatsApp not connected (500)</p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="font-mono text-xs mb-1 text-red-400">ValidationError</p>
                <p className="text-xs text-muted-foreground">Invalid input or missing fields (400)</p>
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
                <Image className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Send Chart Images</h3>
              </div>
              <CodeBlock copyText='wa.send("919876543210", image="https://charts.example.com/nifty.png", caption="NIFTY Daily Chart")'>
                wa.send(<span className="text-green-300">"91..."</span>,{"\n"}
                {"  "}image=<span className="text-green-300">"https://charts.example.com/nifty.png"</span>,{"\n"}
                {"  "}caption=<span className="text-green-300">"NIFTY Daily Chart"</span>)
              </CodeBlock>
            </div>
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Group Portfolio Updates</h3>
              </div>
              <CodeBlock copyText='wa.send_group("120363012345@g.us", "Market closed. P&L: +5000")'>
                wa.send_group(<span className="text-green-300">"id@g.us"</span>,{"\n"}
                {"  "}<span className="text-green-300">"Market closed. P&L: +5000"</span>)
              </CodeBlock>
            </div>
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Send P&L Reports</h3>
              </div>
              <CodeBlock copyText='wa.send("919876543210", document="/path/to/pnl.pdf", mimetype="application/pdf", filename="daily_pnl.pdf")'>
                wa.send(<span className="text-green-300">"91..."</span>,{"\n"}
                {"  "}document=<span className="text-green-300">"/path/to/pnl.pdf"</span>,{"\n"}
                {"  "}mimetype=<span className="text-green-300">"application/pdf"</span>,{"\n"}
                {"  "}filename=<span className="text-green-300">"daily_pnl.pdf"</span>)
              </CodeBlock>
            </div>
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Send className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Broadcast Market Alerts</h3>
              </div>
              <CodeBlock copyText='numbers = ["919876543210", "919876543211", "919876543212"]\nwa.send([(n, "NIFTY crossed 25000!") for n in numbers])'>
                numbers = [<span className="text-green-300">"91..."</span>, <span className="text-green-300">"91..."</span>, <span className="text-green-300">"91..."</span>]{"\n"}
                wa.send([{"\n"}
                {"    "}(n, <span className="text-green-300">"NIFTY crossed 25000!"</span>){"\n"}
                {"    "}<span className="text-blue-300">for</span> n <span className="text-blue-300">in</span> numbers{"\n"}
                ])
              </CodeBlock>
            </div>
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Monitor className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold">Price Monitoring</h3>
              </div>
              <CodeBlock copyText='if nifty_price > 25000:\n    wa.send(f"NIFTY alert: {nifty_price}")'>
                <span className="text-blue-300">if</span> nifty_price &gt; <span className="text-amber-300">25000</span>:{"\n"}
                {"    "}wa.send(<span className="text-green-300">f"NIFTY alert: {"{"}nifty_price{"}"}"</span>)
              </CodeBlock>
            </div>
          </div>
        </div>

        {/* CLI Reference */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">CLI Commands</h2>
          <div className="bg-card rounded-lg overflow-hidden border mb-6">
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

          <h3 className="text-lg font-semibold mb-4 text-center">Interactive CLI Commands</h3>
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
                  <td className="p-4 font-mono text-xs">/send</td>
                  <td className="p-4 text-muted-foreground">Send a message to any number</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">/self</td>
                  <td className="p-4 text-muted-foreground">Send a message to yourself</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">/groups</td>
                  <td className="p-4 text-muted-foreground">List all groups with JIDs</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">/sendgroup</td>
                  <td className="p-4 text-muted-foreground">Send a message to a group</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">/sendchannel</td>
                  <td className="p-4 text-muted-foreground">Send a message to a channel</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">/status</td>
                  <td className="p-4 text-muted-foreground">Check connection status</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">/disconnect</td>
                  <td className="p-4 text-muted-foreground">Unlink WhatsApp and remove saved auth</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs">/quit</td>
                  <td className="p-4 text-muted-foreground">Exit</td>
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
