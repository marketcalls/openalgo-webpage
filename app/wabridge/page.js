"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight, Github, Terminal, MessageSquare, Send, Smartphone, Code2,
  Zap, Shield, Server, Package, Copy, Check, ChevronRight, ExternalLink,
  Bell, TrendingUp, Monitor, Clock, Image, Users, FileText,
} from "lucide-react"
import { useState } from "react"
import dynamic from "next/dynamic"

const WABridgeDiagram = dynamic(() => import("@/components/wabridge-diagram"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[350px] surface-low rounded-xl ghost-border flex items-center justify-center">
      <p className="text-on-surface-variant font-label text-label-md">Loading diagram...</p>
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
    <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 rounded-lg surface-high hover:surface-highest transition-colors" aria-label="Copy to clipboard">
      {copied ? <Check className="h-3.5 w-3.5 text-tertiary" /> : <Copy className="h-3.5 w-3.5 text-on-surface-variant" />}
    </button>
  )
}

function CodeBlock({ children, copyText }) {
  return (
    <div className="relative rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{ background: 'hsl(0 0% 5%)' }}>
      {copyText && <CopyButton text={copyText} />}
      <pre className="text-on-surface-variant">{children}</pre>
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
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-tertiary bg-tertiary/10">Open Source</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-secondary bg-secondary/10">npm + pip</span>
          </div>
          <h1 className="text-display-md mb-4 text-on-surface">WABridge</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-2">
            A lightweight WhatsApp HTTP Bridge.
          </p>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Link your WhatsApp via CLI, then send messages through a simple REST API. Supports text, images, video, audio, documents - to individuals, groups, and channels.
          </p>

          <div className="max-w-md mx-auto mt-8">
            <CodeBlock copyText="npm install -g wabridge">
              <span className="text-on-surface-variant/50">$</span> npm install -g wabridge
            </CodeBlock>
            <p className="text-xs text-on-surface-variant mt-2">
              Or run directly: <code className="text-xs surface-container px-1.5 py-0.5 rounded font-label">npx wabridge</code>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button size="lg" asChild>
              <a href="https://github.com/marketcalls/wabridge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> Node.js CLI <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/marketcalls/wabridge-python" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Python SDK <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">How It Works</h2>
          <p className="text-center text-on-surface-variant mb-8 max-w-2xl mx-auto">
            WABridge sits between your applications and WhatsApp, routing messages through a local HTTP server.
          </p>
          <WABridgeDiagram />
          <p className="text-center font-label text-label-sm text-on-surface-variant mt-3">
            Your App sends HTTP requests to WABridge, which delivers them to WhatsApp.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Zap, title: "Simple REST API", desc: "One POST request to send a message. No complex SDKs or auth flows required." },
            { icon: Image, title: "Rich Media", desc: "Send images, videos, voice notes, and documents. Supports URLs and local file paths." },
            { icon: Users, title: "Groups & Channels", desc: "Send to individuals, groups, and channels. List groups with their JIDs programmatically." },
            { icon: Shield, title: "Self-Hosted", desc: "Runs on your machine. No third-party cloud services. Your messages stay local." },
            { icon: Code2, title: "Python SDK", desc: "Send messages from Python with one function call. Sync and async support built in." },
            { icon: Terminal, title: "Interactive CLI", desc: "Test messages interactively from the terminal. Link via QR code or pairing code." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="obsidian-card rounded-xl p-6 text-center hover-lift ghost-border">
              <div className="inline-flex p-2.5 rounded-lg surface-container mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold mb-2 text-on-surface">{title}</h3>
              <p className="text-sm text-on-surface-variant">{desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-headline-md mb-8 text-center text-on-surface">Quick Start</h2>
          <div className="space-y-6">
            {[
              {
                step: "1", title: "Link WhatsApp",
                content: (
                  <div className="space-y-3">
                    <p className="font-label text-label-lg text-on-surface-variant">QR Code (default):</p>
                    <CodeBlock copyText="wabridge">
                      <span className="text-on-surface-variant/50">$</span> wabridge{"\n"}
                      <span className="text-on-surface-variant/50"># Scan the QR code with WhatsApp</span>{"\n"}
                      <span className="text-on-surface-variant/50"># Settings &gt; Linked Devices &gt; Link a Device</span>
                    </CodeBlock>
                    <p className="font-label text-label-lg text-on-surface-variant mt-4">Pairing Code (alternative):</p>
                    <CodeBlock copyText="wabridge --code">
                      <span className="text-on-surface-variant/50">$</span> wabridge --code{"\n"}
                      <span className="text-on-surface-variant/50"># Enter your phone number and get an 8-digit pairing code</span>
                    </CodeBlock>
                    <p className="text-sm text-on-surface-variant">Auth is saved to <code className="text-xs surface-container px-1.5 py-0.5 rounded font-label">~/.wabridge/</code> - you only need to link once.</p>
                  </div>
                )
              },
              {
                step: "2", title: "Start the API Server",
                content: (
                  <>
                    <CodeBlock copyText="wabridge start">
                      <span className="text-on-surface-variant/50">$</span> wabridge start{"\n"}
                      <span className="text-tertiary">WABridge server running on port 3000</span>
                    </CodeBlock>
                    <p className="text-sm text-on-surface-variant mt-3">
                      Custom port: <code className="text-xs surface-container px-1.5 py-0.5 rounded font-label">wabridge start 8080</code>
                    </p>
                  </>
                )
              },
              {
                step: "3", title: "Send Messages",
                content: (
                  <div className="space-y-4">
                    <div>
                      <p className="font-label text-label-lg text-on-surface-variant mb-2">Using curl:</p>
                      <CodeBlock copyText={`curl -X POST http://localhost:3000/send \\\n  -H 'Content-Type: application/json' \\\n  -d '{"phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150"}'`}>
                        <span className="text-on-surface-variant/50">$</span> curl -X POST http://localhost:3000/send \{"\n"}
                        {"  "}-H <span className="text-primary">'Content-Type: application/json'</span> \{"\n"}
                        {"  "}-d <span className="text-tertiary">{'\'{"phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150"}\''}</span>
                      </CodeBlock>
                    </div>
                    <div>
                      <p className="font-label text-label-lg text-on-surface-variant mb-2">Using Python:</p>
                      <CodeBlock copyText={`pip install wabridge\n\nfrom wabridge import WABridge\nwa = WABridge()\nwa.send("919876543210", "BUY NIFTY 24000 CE @ 150")`}>
                        <span className="text-on-surface-variant/50">$</span> pip install wabridge{"\n\n"}
                        <span className="text-secondary">from</span> wabridge <span className="text-secondary">import</span> WABridge{"\n"}
                        wa = WABridge(){"\n"}
                        wa.send(<span className="text-tertiary">"919876543210"</span>, <span className="text-tertiary">"BUY NIFTY 24000 CE @ 150"</span>)
                      </CodeBlock>
                    </div>
                  </div>
                )
              }
            ].map(({ step, title, content }) => (
              <div key={step} className="obsidian-card rounded-xl p-6 ghost-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full gradient-cta text-primary-foreground text-sm font-bold">{step}</span>
                  <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
                </div>
                {content}
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div className="mb-16">
          <h2 className="text-headline-md mb-8 text-center text-on-surface">API Endpoints</h2>
          <div className="space-y-4">
            {[
              { method: "GET", path: "/status", desc: "Check WhatsApp connection status", code: '{ "status": "open", "user": "919876543210@s.whatsapp.net" }' },
              { method: "GET", path: "/groups", desc: "List all WhatsApp groups with their JIDs", code: '{ "groups": [{ "id": "120363012345@g.us", "subject": "Trading Alerts" }] }' },
              { method: "POST", path: "/send", desc: "Send text, image, video, audio, or document", code: '{ "phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150" }' },
              { method: "POST", path: "/send/self", desc: "Send a message to yourself", code: '{ "message": "Portfolio P&L: +5000" }' },
              { method: "POST", path: "/send/group", desc: "Send a message to a WhatsApp group", code: '{ "groupId": "120363012345@g.us", "message": "NIFTY crossed 25000!" }' },
              { method: "POST", path: "/send/channel", desc: "Send a message to a WhatsApp channel", code: '{ "channelId": "120363098765@newsletter", "message": "Market closed." }' },
            ].map(({ method, path, desc, code }) => (
              <div key={path} className="obsidian-card rounded-xl p-5 ghost-border">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded font-label text-label-sm font-bold ${method === 'GET' ? 'text-tertiary bg-tertiary/10' : 'text-secondary bg-secondary/10'}`}>{method}</span>
                  <code className="text-sm font-mono text-on-surface">{path}</code>
                </div>
                <p className="text-sm text-on-surface-variant mb-3">{desc}</p>
                <CodeBlock copyText={code}>
                  <span className="text-on-surface-variant">{code}</span>
                </CodeBlock>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content Fields */}
        <div className="mb-16">
          <h2 className="text-headline-md mb-4 text-center text-on-surface">Message Content Fields</h2>
          <p className="text-center text-on-surface-variant mb-8">
            All send endpoints accept these content fields:
          </p>
          <div className="rounded-xl overflow-hidden surface-low ghost-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="surface-container">
                    <th className="text-left p-4 font-label text-label-lg text-on-surface">Field</th>
                    <th className="text-left p-4 font-label text-label-lg text-on-surface">Type</th>
                    <th className="text-left p-4 font-label text-label-lg text-on-surface hidden sm:table-cell">Extra Fields</th>
                    <th className="text-left p-4 font-label text-label-lg text-on-surface">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: "message", type: "string", extra: "-", desc: "Text message" },
                    { field: "image", type: "URL or file path", extra: "caption?", desc: "Image with optional caption" },
                    { field: "video", type: "URL or file path", extra: "caption?", desc: "Video with optional caption" },
                    { field: "audio", type: "URL or file path", extra: "ptt? (default: true)", desc: "Voice note or audio file" },
                    { field: "document", type: "URL or file path", extra: "mimetype, fileName?, caption?", desc: "Document attachment" },
                  ].map(({ field, type, extra, desc }, i) => (
                    <tr key={field} className={i % 2 === 0 ? '' : 'surface-container/50'}>
                      <td className="p-4 font-mono text-xs text-primary">{field}</td>
                      <td className="p-4 text-on-surface-variant text-xs">{type}</td>
                      <td className="p-4 text-on-surface-variant text-xs hidden sm:table-cell">{extra}</td>
                      <td className="p-4 text-on-surface-variant">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-headline-md mb-8 text-center text-on-surface">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, title: "Trading Alerts", code: 'wa.send("BUY NIFTY 24000 CE @ 150")' },
              { icon: Image, title: "Send Chart Images", code: 'wa.send("91...", image="url", caption="NIFTY")' },
              { icon: Users, title: "Group Portfolio Updates", code: 'wa.send_group("id@g.us", "P&L: +5000")' },
              { icon: FileText, title: "Send P&L Reports", code: 'wa.send("91...", document="pnl.pdf")' },
              { icon: Send, title: "Broadcast Market Alerts", code: 'wa.send([(n, "NIFTY 25000!") for n in nums])' },
              { icon: Monitor, title: "Price Monitoring", code: 'if price > 25000: wa.send(f"Alert: {price}")' },
            ].map(({ icon: Icon, title, code }) => (
              <div key={title} className="obsidian-card rounded-xl p-5 ghost-border">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <h3 className="font-semibold text-on-surface">{title}</h3>
                </div>
                <CodeBlock copyText={code}>
                  <span className="text-on-surface-variant">{code}</span>
                </CodeBlock>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="obsidian-card rounded-xl p-6 mb-16 ghost-border">
          <h3 className="font-semibold mb-4 text-on-surface">Requirements</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Server className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-on-surface">Node.js &gt;= 20.0.0</p>
                <p className="text-on-surface-variant">For the WABridge server</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Code2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-on-surface">Python &gt;= 3.8</p>
                <p className="text-on-surface-variant">For the Python SDK (optional)</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-on-surface-variant mb-6">
            Built on <a href="https://github.com/WhiskeySockets/Baileys" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors">Baileys</a>. MIT Licensed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="https://github.com/marketcalls/wabridge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> View on GitHub <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://www.npmjs.com/package/wabridge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Package className="h-5 w-5" /> npm Package <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
