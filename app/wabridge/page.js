"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  ArrowRight, Github, Terminal, MessageSquare, Send, Smartphone, Code2,
  Zap, Shield, Server, Package, Copy, Check, ChevronRight, ExternalLink,
  Bell, TrendingUp, Monitor, Clock, Image, Users, FileText,
} from "lucide-react"
import { useState } from "react"
import dynamic from "next/dynamic"

function DiagramLoading() {
  const { t } = useI18n()
  return (
    <div className="w-full h-[300px] md:h-[350px] surface-low rounded-xl ghost-border flex items-center justify-center">
      <p className="text-on-surface-variant font-label text-label-md">{t('wab.diagramLoading')}</p>
    </div>
  )
}

const WABridgeDiagram = dynamic(() => import("@/components/wabridge-diagram"), {
  ssr: false,
  loading: () => <DiagramLoading />,
})

function CopyButton({ text }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 rounded-lg surface-high hover:surface-highest transition-colors" aria-label={t('wab.copyAria')}>
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
  const { t } = useI18n()
  const builtOnParts = t('wab.ctaBuiltOn').split('{x}')

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-tertiary bg-tertiary/10">{t('wab.badgeOpenSource')}</span>
            <span className="px-3 py-1.5 rounded-full font-label text-label-md text-secondary bg-secondary/10">npm + pip</span>
          </div>
          <h1 className="text-display-md mb-4 text-on-surface">WABridge</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-2">
            {t('wab.heroTag')}
          </p>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            {t('wab.heroDesc')}
          </p>

          <div className="max-w-md mx-auto mt-8">
            <CodeBlock copyText="npm install -g wabridge">
              <span className="text-on-surface-variant/50">$</span> npm install -g wabridge
            </CodeBlock>
            <p className="text-xs text-on-surface-variant mt-2">
              {t('wab.orRun')} <code className="text-xs surface-container px-1.5 py-0.5 rounded font-label">npx wabridge</code>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button size="lg" asChild>
              <a href="https://github.com/marketcalls/wabridge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> {t('wab.ctaNode')} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/marketcalls/wabridge-python" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Package className="h-5 w-5" /> {t('wab.ctaPython')} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-headline-md mb-2 text-center text-on-surface">{t('wab.howTitle')}</h2>
          <p className="text-center text-on-surface-variant mb-8 max-w-2xl mx-auto">
            {t('wab.howDesc')}
          </p>
          <WABridgeDiagram />
          <p className="text-center font-label text-label-sm text-on-surface-variant mt-3">
            {t('wab.howCaption')}
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Zap, title: t('wab.f1t'), desc: t('wab.f1d') },
            { icon: Image, title: t('wab.f2t'), desc: t('wab.f2d') },
            { icon: Users, title: t('wab.f3t'), desc: t('wab.f3d') },
            { icon: Shield, title: t('wab.f4t'), desc: t('wab.f4d') },
            { icon: Code2, title: t('wab.f5t'), desc: t('wab.f5d') },
            { icon: Terminal, title: t('wab.f6t'), desc: t('wab.f6d') },
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
          <h2 className="text-headline-md mb-8 text-center text-on-surface">{t('wab.qsTitle')}</h2>
          <div className="space-y-6">
            {[
              {
                step: "1", title: t('wab.qs1t'),
                content: (
                  <div className="space-y-3">
                    <p className="font-label text-label-lg text-on-surface-variant">{t('wab.qs1qr')}</p>
                    <CodeBlock copyText="wabridge">
                      <span className="text-on-surface-variant/50">$</span> wabridge{"\n"}
                      <span className="text-on-surface-variant/50"># Scan the QR code with WhatsApp</span>{"\n"}
                      <span className="text-on-surface-variant/50"># Settings &gt; Linked Devices &gt; Link a Device</span>
                    </CodeBlock>
                    <p className="font-label text-label-lg text-on-surface-variant mt-4">{t('wab.qs1pair')}</p>
                    <CodeBlock copyText="wabridge --code">
                      <span className="text-on-surface-variant/50">$</span> wabridge --code{"\n"}
                      <span className="text-on-surface-variant/50"># Enter your phone number and get an 8-digit pairing code</span>
                    </CodeBlock>
                    <p className="text-sm text-on-surface-variant">{t('wab.qs1auth1')} <code className="text-xs surface-container px-1.5 py-0.5 rounded font-label">~/.wabridge/</code> {t('wab.qs1auth2')}</p>
                  </div>
                )
              },
              {
                step: "2", title: t('wab.qs2t'),
                content: (
                  <>
                    <CodeBlock copyText="wabridge start">
                      <span className="text-on-surface-variant/50">$</span> wabridge start{"\n"}
                      <span className="text-tertiary">WABridge server running on port 3000</span>
                    </CodeBlock>
                    <p className="text-sm text-on-surface-variant mt-3">
                      {t('wab.qs2custom')} <code className="text-xs surface-container px-1.5 py-0.5 rounded font-label">wabridge start 8080</code>
                    </p>
                  </>
                )
              },
              {
                step: "3", title: t('wab.qs3t'),
                content: (
                  <div className="space-y-4">
                    <div>
                      <p className="font-label text-label-lg text-on-surface-variant mb-2">{t('wab.qs3curl')}</p>
                      <CodeBlock copyText={`curl -X POST http://localhost:3000/send \\\n  -H 'Content-Type: application/json' \\\n  -d '{"phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150"}'`}>
                        <span className="text-on-surface-variant/50">$</span> curl -X POST http://localhost:3000/send \{"\n"}
                        {"  "}-H <span className="text-primary">'Content-Type: application/json'</span> \{"\n"}
                        {"  "}-d <span className="text-tertiary">{'\'{"phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150"}\''}</span>
                      </CodeBlock>
                    </div>
                    <div>
                      <p className="font-label text-label-lg text-on-surface-variant mb-2">{t('wab.qs3py')}</p>
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
          <h2 className="text-headline-md mb-8 text-center text-on-surface">{t('wab.apiTitle')}</h2>
          <div className="space-y-4">
            {[
              { method: "GET", path: "/status", desc: t('wab.api1d'), code: '{ "status": "open", "user": "919876543210@s.whatsapp.net" }' },
              { method: "GET", path: "/groups", desc: t('wab.api2d'), code: '{ "groups": [{ "id": "120363012345@g.us", "subject": "Trading Alerts" }] }' },
              { method: "POST", path: "/send", desc: t('wab.api3d'), code: '{ "phone": "919876543210", "message": "BUY NIFTY 24000 CE @ 150" }' },
              { method: "POST", path: "/send/self", desc: t('wab.api4d'), code: '{ "message": "Portfolio P&L: +5000" }' },
              { method: "POST", path: "/send/group", desc: t('wab.api5d'), code: '{ "groupId": "120363012345@g.us", "message": "NIFTY crossed 25000!" }' },
              { method: "POST", path: "/send/channel", desc: t('wab.api6d'), code: '{ "channelId": "120363098765@newsletter", "message": "Market closed." }' },
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
          <h2 className="text-headline-md mb-4 text-center text-on-surface">{t('wab.fieldsTitle')}</h2>
          <p className="text-center text-on-surface-variant mb-8">
            {t('wab.fieldsDesc')}
          </p>
          <div className="rounded-xl overflow-hidden surface-low ghost-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="surface-container">
                    <th className="text-left p-4 font-label text-label-lg text-on-surface">{t('wab.thField')}</th>
                    <th className="text-left p-4 font-label text-label-lg text-on-surface">{t('wab.thType')}</th>
                    <th className="text-left p-4 font-label text-label-lg text-on-surface hidden sm:table-cell">{t('wab.thExtra')}</th>
                    <th className="text-left p-4 font-label text-label-lg text-on-surface">{t('wab.thDesc')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: "message", type: t('wab.typeString'), extra: "-", desc: t('wab.fd1') },
                    { field: "image", type: t('wab.typeUrlPath'), extra: "caption?", desc: t('wab.fd2') },
                    { field: "video", type: t('wab.typeUrlPath'), extra: "caption?", desc: t('wab.fd3') },
                    { field: "audio", type: t('wab.typeUrlPath'), extra: "ptt? (default: true)", desc: t('wab.fd4') },
                    { field: "document", type: t('wab.typeUrlPath'), extra: "mimetype, fileName?, caption?", desc: t('wab.fd5') },
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
          <h2 className="text-headline-md mb-8 text-center text-on-surface">{t('wab.ucTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, title: t('wab.uc1'), code: 'wa.send("BUY NIFTY 24000 CE @ 150")' },
              { icon: Image, title: t('wab.uc2'), code: 'wa.send("91...", image="url", caption="NIFTY")' },
              { icon: Users, title: t('wab.uc3'), code: 'wa.send_group("id@g.us", "P&L: +5000")' },
              { icon: FileText, title: t('wab.uc4'), code: 'wa.send("91...", document="pnl.pdf")' },
              { icon: Send, title: t('wab.uc5'), code: 'wa.send([(n, "NIFTY 25000!") for n in nums])' },
              { icon: Monitor, title: t('wab.uc6'), code: 'if price > 25000: wa.send(f"Alert: {price}")' },
            ].map(({ icon: Icon, title, code }) => (
              <div key={title} className="obsidian-card rounded-xl p-5 ghost-border">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5 text-primary shrink-0" />
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
          <h3 className="font-semibold mb-4 text-on-surface">{t('wab.reqTitle')}</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Server className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-on-surface">Node.js &gt;= 20.0.0</p>
                <p className="text-on-surface-variant">{t('wab.req1d')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Code2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-on-surface">Python &gt;= 3.8</p>
                <p className="text-on-surface-variant">{t('wab.req2d')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-on-surface-variant mb-6">
            {builtOnParts[0]}<a href="https://github.com/WhiskeySockets/Baileys" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors">Baileys</a>{builtOnParts[1]}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="https://github.com/marketcalls/wabridge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5" /> {t('wab.ctaGithub')} <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://www.npmjs.com/package/wabridge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Package className="h-5 w-5" /> {t('wab.ctaNpm')} <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
