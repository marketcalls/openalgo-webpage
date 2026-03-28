"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Server,
  Lock,
  Globe,
  Terminal,
  Key,
  Clock,
  Zap,
  AlertTriangle,
  Monitor,
  Github,
  BookOpen,
  MessageCircle,
  Play,
  ChevronDown,
  Network,
  ExternalLink,
  Cloud,
  HardDrive,
  Wifi,
  DollarSign,
  RefreshCw,
  FileCode,
  Layers,
  Settings,
  ShieldCheck,
  Upload,
  Users
} from "lucide-react"
import { useState } from "react"

function ExpandableCard({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="obsidian-card rounded-xl ghost-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-6 text-left"
      >
        <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <span className="text-base sm:text-lg font-semibold text-on-surface flex-1">{title}</span>
        <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-on-surface-variant transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function StaticIPPage() {
  const vpsProviders = [
    { name: "Vultr", type: "VPS", note: "Hourly billing, Mumbai datacenter available" },
    { name: "DigitalOcean", type: "VPS", note: "Droplets, good documentation" },
    { name: "Contabo", type: "VPS", note: "Very cheap, shared CPU" },
    { name: "Hostinger", type: "VPS", note: "Budget friendly, monthly billing" },
    { name: "Linode", type: "VPS", note: "Reliable, developer friendly" },
    { name: "OVH", type: "VPS", note: "European provider, good pricing" },
  ]

  const cloudProviders = [
    { name: "Amazon AWS", note: "Use Elastic IP for static IPv4.", cost: "~$3.60/month", detail: "Charged at $0.005/hr whether attached or not. First Elastic IP on a running instance was previously free but now incurs charges." },
    { name: "Google Cloud", note: "Reserve an External Static IP via VPC Network.", cost: "~$3.65/month", detail: "Charged at $0.005/hr when attached to a running VM. Unused reserved IPs cost $0.01/hr (~$7.30/month)." },
    { name: "Microsoft Azure", note: "Use a Static Public IP address resource.", cost: "~$3.72/month", detail: "Standard SKU at $0.005/hr. Charged regardless of whether the resource is active or not." },
    { name: "Oracle Cloud", note: "Use a Reserved Public IP.", cost: "Free", detail: "Reserved public IPs are free. Always-free tier includes 1 reserved public IP + free ARM VM shapes." },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 obsidian-grid" />
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 rounded-full surface-low ghost-border">
            <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="font-label text-label-sm sm:text-label-md uppercase tracking-wider text-on-surface-variant">
              Infrastructure Guide
            </span>
          </div>

          <h1 className="text-display-md sm:text-display-lg md:text-[4rem] leading-[1.1] mb-4 sm:mb-6 tracking-tight">
            <span className="block text-on-surface">Static IP &</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary animate-gradient">
              Server Hosting
            </span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Everything you need to know about SEBI&apos;s static IP compliance,
            deploying OpenAlgo on your own server, and securing your trading infrastructure.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {["SEBI compliance ready", "Step by step server setup", "Security best practices"].map(tag => (
              <span key={tag} className="px-3 sm:px-4 py-1.5 sm:py-2 surface-low rounded-full font-label text-label-sm sm:text-label-md text-on-surface-variant ghost-border">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1 sm:mr-1.5 text-tertiary" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: What is Static IP Compliance */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">What is Static IP Compliance?</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              SEBI requires all retail algo traders to route orders through a fixed IP address.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <p className="text-base sm:text-lg leading-relaxed text-on-surface mb-4 sm:mb-6">
              From <strong className="text-primary">1st April 2026</strong>, every retail algo trader using broker APIs
              must ensure their orders originate from a whitelisted static IP address. This applies to anyone
              managing their own strategies, bots, or trading infrastructure.
            </p>
            <div className="rounded-lg sm:rounded-xl surface-container p-4 sm:p-6 mb-6">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 sm:mb-4 uppercase tracking-wider">Key Rules</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Orders must originate from a whitelisted static IP",
                  "Brokers provide primary + secondary IP slots",
                  "IPs can only be changed once per week",
                  "10 orders per second limit for retail traders",
                  "Daily login required (tokens expire nightly)",
                  "Manual trading via broker app/web is unaffected",
                ].map(rule => (
                  <div key={rule} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tertiary mt-1 shrink-0" />
                    <span className="text-sm text-on-surface">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl surface-container p-4 sm:p-5">
                <p className="font-semibold text-on-surface mb-2 text-sm sm:text-base">Transactional APIs</p>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Placing, modifying, cancelling orders, basket orders, split orders.
                  <strong className="text-on-surface"> Static IP mandatory.</strong>
                </p>
              </div>
              <div className="rounded-xl surface-container p-4 sm:p-5">
                <p className="font-semibold text-on-surface mb-2 text-sm sm:text-base">Non-Transactional APIs</p>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Market data, funds, order book, positions, holdings.
                  Rules vary by broker. Some require static IP, some don&apos;t.
                </p>
              </div>
            </div>
          </div>

          {/* Who is a Tech-Savvy Trader */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Who is a &quot;Tech-Savvy Trader&quot;?
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              SEBI classifies retail algo traders who manage their own infrastructure as &quot;tech-savvy investors.&quot;
              This applies to you if:
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {[
                "You manage your own trading bots or strategies",
                "You run code from Python, TradingView, Amibroker, etc.",
                "You use a broker API to place orders programmatically",
                "You host your own application on a server or desktop",
                "You use tools like OpenAlgo for order routing",
                "You maintain your own source code and infrastructure",
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-tertiary mt-0.5 shrink-0" />
                  <span className="text-on-surface-variant">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant">
              As long as your orders stay under 10 per second, you don&apos;t need exchange registration.
              Beyond that threshold, you need to register with the exchange and get an algo ID assigned.
              Most brokers handle the algo ID assignment on your behalf.
            </p>
          </div>

          {/* Broker Whitelisting */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-primary">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 shrink-0">
                <Key className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2">How Broker Whitelisting Works</h3>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-3">
                  When creating API keys in your broker&apos;s developer portal, you attach your static IP.
                  The broker only accepts orders arriving from that IP. Each broker&apos;s interface is slightly
                  different, but the concept is the same: API key + API secret + whitelisted IP.
                </p>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                  Most brokers allow only <strong className="text-on-surface">one API key</strong> with a
                  primary and secondary IP slot. Only a few selected brokers allow multiple API key generation
                  at their developer portal, but even then, only primary and secondary IPs are supported.
                  Once set, you can only change your static IP <strong className="text-on-surface">after one week</strong>.
                  Plan your infrastructure carefully before whitelisting.
                </p>
                <div className="rounded-xl bg-destructive/5 p-4 border-l-4 border-l-destructive mt-3">
                  <p className="text-sm text-on-surface-variant">
                    <strong className="text-on-surface">Avoid dynamic IPs.</strong> Your home internet likely uses a
                    dynamic IP that changes without notice. It may work temporarily, but you never know when
                    it will change. A single IP change means your orders get rejected by the broker until you
                    update and wait a week. Talk to your ISP and get a static IP, or switch to an ISP that
                    supports static IP. Using a VPS server is the most reliable option as static IPs are included by default.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Walkthrough */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 rounded-full surface-low ghost-border">
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="font-label text-label-sm sm:text-label-md uppercase tracking-wider text-on-surface-variant">
                Video Walkthrough
              </span>
            </div>
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Watch the Full Setup Guide</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              A complete walkthrough covering static IP compliance, server deployment,
              Cloudflare setup, and OpenAlgo installation on Ubuntu.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl ghost-border overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/RhCzFg5FMmA"
                title="OpenAlgo Static IP & Server Hosting Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="font-semibold text-sm sm:text-base text-on-surface">Static IP, Server Hosting & SEBI Compliance</p>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Full session: domain setup, Cloudflare, VPS deployment, OpenAlgo installation & more
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    Docs
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Ways to Get a Static IP */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Ways to Get a Static IP</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Three approaches depending on your setup and budget.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              {
                icon: Server,
                title: "VPS / Cloud Server",
                desc: "Deploy a server with a VPS provider. Static IP included by default. Best for reliability and 24/7 uptime.",
                tag: "Recommended",
                tagColor: "bg-tertiary/10 text-tertiary",
                items: ["Static IP included free", "24/7 uptime", "Mumbai datacenter options", "Starting from ~500/month"]
              },
              {
                icon: Wifi,
                title: "Home ISP",
                desc: "Request a static IP from your internet service provider (Jio, Airtel, ACT, Tata, etc). Good if you run OpenAlgo on your desktop.",
                tag: "Desktop Users",
                tagColor: "bg-secondary/10 text-secondary",
                items: ["Contact your ISP", "Monthly fee varies", "Run on desktop/laptop", "No server management needed"]
              },
              {
                icon: Cloud,
                title: "Cloud Hyperscalers",
                desc: "AWS, Google Cloud, Azure, Oracle. More powerful but static IP may be charged separately.",
                tag: "Advanced",
                tagColor: "bg-primary/10 text-primary",
                items: ["Free tier available", "Static IP charged extra", "Enterprise grade infra", "More complex setup"]
              },
            ].map((option, i) => (
              <div key={i} className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border hover-lift">
                <span className={`font-label text-label-sm px-2 py-0.5 rounded-full ${option.tagColor}`}>{option.tag}</span>
                <div className={`inline-flex p-2 sm:p-2.5 rounded-lg bg-primary/10 mb-3 sm:mb-4 mt-4`}>
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-on-surface">{option.title}</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mb-4">{option.desc}</p>
                <ul className="space-y-2">
                  {option.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tertiary mt-0.5 shrink-0" />
                      <span className="text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
            <p className="text-sm text-on-surface-variant">
              <strong className="text-on-surface">Check your current IP:</strong> Visit{" "}
              <a href="/ip" className="text-primary hover:underline">openalgo.in/ip</a> to see your current IP address.
              If it changes frequently, you need a static IP.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: VPS Providers */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Choosing a Server</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Shared vs Dedicated CPU, pricing, and what to look for.
            </p>
          </div>

          {/* Shared vs Dedicated */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border">
              <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-on-surface-variant" />
                Shared CPU
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-4">
                Like a shared apartment. Resources are split between multiple users.
                Cheaper but performance varies.
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                {[
                  { label: "Latency", value: "300 to 600ms" },
                  { label: "Price", value: "$5 to $12/month" },
                  { label: "Best for", value: "Testing, small capital" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="text-on-surface font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border border-l-4 border-l-tertiary">
              <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
                <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-tertiary" />
                Dedicated CPU
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-4">
                Like your own private villa. Resources are exclusively yours.
                Faster and more consistent performance.
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                {[
                  { label: "Latency", value: "30 to 120ms" },
                  { label: "Price", value: "$30 to $50/month" },
                  { label: "Best for", value: "Live trading, larger capital" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="text-on-surface font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VPS Providers */}
          <div className="mb-8 sm:mb-10">
            <h3 className="text-lg sm:text-headline-sm mb-4 sm:mb-5 text-on-surface flex items-center gap-2">
              <Server className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              VPS Providers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {vpsProviders.map(p => (
                <div key={p.name} className="obsidian-card rounded-lg sm:rounded-xl p-3 sm:p-4 ghost-border hover-lift">
                  <p className="font-semibold text-on-surface text-sm">{p.name}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{p.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Providers */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-headline-sm mb-4 sm:mb-5 text-on-surface flex items-center gap-2">
              <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Cloud Hyperscalers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
              {cloudProviders.map(p => (
                <div key={p.name} className="obsidian-card rounded-lg sm:rounded-xl p-4 sm:p-5 ghost-border hover-lift">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-on-surface text-sm">{p.name}</p>
                    <span className={`font-label text-label-md px-2 py-0.5 rounded-full ${p.cost === "Free" ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>{p.cost}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-1">{p.note}</p>
                  <p className="text-xs text-on-surface-variant">{p.detail}</p>
                </div>
              ))}
            </div>

            <div className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border border-l-4 border-l-primary">
              <h4 className="text-sm sm:text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Firewall Configuration for Hyperscalers
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                If you are using a hyperscaler, you must configure <strong className="text-on-surface">ingress firewall rules</strong> to
                allow traffic on ports 80 and 443. Port 80 is required initially for Let&apos;s Encrypt SSL certificate
                verification. Port 443 provides HTTPS access for your custom domain
                (e.g., <code className="px-1 py-0.5 rounded surface-high text-xs">https://algo.yourdomain.com</code>).
                Without opening these ports, your OpenAlgo instance will not be accessible.
              </p>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                Each provider uses a different name for this, but the concept is the same:
              </p>
              <div className="space-y-2 mb-4">
                {[
                  { provider: "AWS", term: "Security Group inbound rules (ingress rules)" },
                  { provider: "Google Cloud", term: "VPC firewall rules (allow traffic by protocol/port/source)" },
                  { provider: "Azure", term: "Network Security Group (NSG) inbound security rules" },
                  { provider: "Oracle Cloud", term: "Security List or Network Security Group ingress rules" },
                ].map(item => (
                  <div key={item.provider} className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-on-surface min-w-[110px] shrink-0">{item.provider}:</span>
                    <span className="text-on-surface-variant">{item.term}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Also ensure <strong className="text-on-surface">server level hardening</strong> is in place to prevent
                basic attacks. Disable unused ports, restrict SSH access, and keep your OS packages updated.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-tertiary/5 p-4 border-l-4 border-l-tertiary mb-6">
            <p className="text-sm text-on-surface-variant">
              <strong className="text-on-surface">Recommendation:</strong> For OpenAlgo, 2 GB RAM is the minimum.
              4 GB is comfortable for daily use. Use 1 vCPU (2 vCPU if multitasking).
              Always choose a <strong className="text-on-surface">Mumbai datacenter</strong> for lowest latency to Indian exchanges.
              Ensure you get an <strong className="text-on-surface">IPv4 address</strong> as brokers don&apos;t support IPv6 whitelisting yet.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Step by Step Setup */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Setup Guide</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              From zero to a running OpenAlgo instance on your own server.
            </p>
          </div>

          <div className="space-y-4">
            <ExpandableCard title="Step 1: Get a Domain" icon={Globe} defaultOpen={true}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  Purchase a domain from any registrar. Common options: GoDaddy, BigRock, Namecheap, Hostinger.
                  A <code className="px-1.5 py-0.5 rounded surface-high text-xs text-on-surface">.in</code> or{" "}
                  <code className="px-1.5 py-0.5 rounded surface-high text-xs text-on-surface">.com</code> domain
                  typically costs 700 to 900 rupees per year.
                </p>
                <div className="rounded-lg sm:rounded-xl surface-container p-4">
                  <p className="text-sm"><strong className="text-on-surface">Example:</strong> myalgotrading.in, myalgo.com, or use a subdomain like algo.yourdomain.in</p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 2: Setup Cloudflare (Free)" icon={ShieldCheck}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  Register a free Cloudflare account and add your domain. Point your domain registrar&apos;s
                  nameservers to Cloudflare. This gives you DNS management, free SSL, and security protection.
                </p>
                <div className="space-y-3">
                  {[
                    "Create a free Cloudflare account",
                    "Add your domain and update nameservers at your registrar",
                    "Go to SSL/TLS settings and set mode to Full (Strict)",
                    "Create an A record pointing your domain to your server IP",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">{i + 1}</div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-tertiary/5 p-4 border-l-4 border-l-tertiary">
                  <p className="text-sm">
                    <strong className="text-on-surface">Why Cloudflare?</strong> Without it, your server IP is
                    exposed publicly. Cloudflare acts as a shield. 95% of bot attacks are blocked.
                    Your real server IP stays hidden.
                  </p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 3: Deploy a Server" icon={Server}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  Spin up a server with your chosen provider. Select Ubuntu (latest version),
                  choose a Mumbai location, and pick your plan.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: "OS", value: "Ubuntu 24/25 (latest)" },
                    { label: "Location", value: "Mumbai (closest to exchange)" },
                    { label: "IP Version", value: "IPv4 (mandatory for brokers)" },
                  ].map(item => (
                    <div key={item.label} className="rounded-lg surface-container p-3">
                      <p className="font-label text-label-md text-primary">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm">
                  Once deployed, you&apos;ll receive a public IPv4 address and a root password.
                  Go back to Cloudflare and update your A record with this IP.
                </p>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 4: Whitelist IP at Broker" icon={Key}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  Go to your broker&apos;s developer portal and create or edit your API app.
                  Attach your server&apos;s static IP as the primary IP.
                </p>
                <div className="rounded-lg sm:rounded-xl surface-container p-4">
                  <p className="text-sm">
                    <strong className="text-on-surface">Each broker is different:</strong> Some brokers have a
                    separate IP whitelisting section in their developer portal. Others require IP attachment
                    during API app creation itself. Check your specific broker&apos;s developer documentation
                    for the exact steps.
                  </p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 5: Install OpenAlgo" icon={Terminal}>
              <div className="space-y-4 text-on-surface-variant">
                <p>SSH into your server and run the installation script:</p>
                <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto space-y-2">
                  <p className="text-on-surface-variant"># Connect to your server</p>
                  <p className="text-primary">ssh root@your-server-ip</p>
                  <p className="text-on-surface-variant mt-3"># Download and run the installer</p>
                  <p className="text-primary">mkdir openalgo-install && cd openalgo-install && curl -O https://raw.githubusercontent.com/marketcalls/openalgo/main/installation/install.sh && chmod +x install.sh</p>
                  <p className="text-primary">sudo ./install.sh</p>
                </div>
                <p className="text-sm">The script will ask for your domain, broker name, API key, and API secret. It handles everything else automatically:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Firewall configuration",
                    "Nginx reverse proxy",
                    "Free SSL via Let's Encrypt",
                    "Python virtual environment",
                    "All 177+ libraries",
                    "Systemd service (24/7 uptime)",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tertiary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
                  <p className="text-sm">
                    <strong className="text-on-surface">Multiple accounts?</strong> Use{" "}
                    <code className="px-1 py-0.5 rounded surface-high text-xs">install-multi.sh</code> instead
                    to run multiple OpenAlgo instances on one server. Ensure all accounts belong to you or
                    your family as per SEBI guidelines.
                  </p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title="Step 6: Login & Verify" icon={CheckCircle2}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  Open your domain (e.g., myalgo.yourdomain.in) in a browser. Register your account immediately
                  (first user becomes admin). Connect your broker and verify the master contract downloads.
                </p>
                <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                  <p className="text-on-surface-variant"># Check if OpenAlgo is running</p>
                  <p className="text-primary">sudo systemctl status openalgo-myalgo-yourdomain-in</p>
                </div>
              </div>
            </ExpandableCard>
          </div>
        </div>
      </div>

      {/* Section 5: Architecture */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Server Architecture</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              What gets installed and how the pieces fit together.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            {/* Architecture Flow */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { label: "Your Browser", sub: "HTTPS via Cloudflare", color: "bg-secondary/10 text-secondary" },
                { label: "Cloudflare", sub: "DNS, SSL, DDoS protection", color: "bg-tertiary/10 text-tertiary" },
                { label: "Nginx", sub: "Reverse proxy on your server", color: "bg-primary/10 text-primary" },
                { label: "OpenAlgo", sub: "Running via systemd (24/7)", color: "bg-secondary/10 text-secondary" },
                { label: "Broker API", sub: "Orders from your static IP", color: "bg-tertiary/10 text-tertiary" },
              ].map((step, i) => (
                <div key={step.label} className="w-full max-w-xs">
                  <div className={`rounded-xl p-4 text-center ${step.color}`}>
                    <p className="font-semibold text-sm">{step.label}</p>
                    <p className="text-xs mt-1 opacity-75">{step.sub}</p>
                  </div>
                  {i < 4 && (
                    <div className="flex justify-center py-1">
                      <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "UFW Firewall", desc: "Only ports 22 (SSH), 80 (HTTP), and 443 (HTTPS) are open. Everything else is blocked." },
                { icon: Settings, title: "Nginx", desc: "Reverse proxy that routes browser requests to OpenAlgo. Handles SSL termination." },
                { icon: Lock, title: "Let's Encrypt", desc: "Free SSL certificate. Auto-renewed. Provides HTTPS encryption end to end." },
                { icon: RefreshCw, title: "Systemd Service", desc: "Keeps OpenAlgo running 24/7. Auto-restarts on crashes. Manages logs." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl surface-container p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-sm text-on-surface">{item.title}</p>
                  </div>
                  <p className="text-xs text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Routing */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-secondary">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
              Signal Routing: Where Do Orders Come From?
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Even if your strategies run from home (Amibroker, Python, TradingView), the signals are sent
              to your server. OpenAlgo on the server processes them and places orders. The broker only sees
              your server&apos;s static IP, not your home IP.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {[
                { label: "Your Home/Office", sub: "Strategies & signals" },
                { label: "Your Server", sub: "OpenAlgo + Static IP" },
                { label: "Broker", sub: "Sees only server IP" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 sm:gap-4">
                  <div className="rounded-lg surface-container p-3 text-center min-w-[130px]">
                    <p className="font-semibold text-xs sm:text-sm text-on-surface">{step.label}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{step.sub}</p>
                  </div>
                  {i < 2 && <ArrowRight className="w-4 h-4 text-on-surface-variant hidden sm:block" />}
                  {i < 2 && <ChevronDown className="w-4 h-4 text-on-surface-variant sm:hidden" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Upgrading & Maintenance */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Upgrading & Maintenance</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              How to keep your OpenAlgo instance up to date on the server.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4">Upgrade Steps</h3>
            <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto space-y-2 mb-4">
              <p className="text-on-surface-variant"># 1. Pull latest changes</p>
              <p className="text-primary">cd /path/to/openalgo && git pull</p>
              <p className="text-on-surface-variant mt-2"># 2. Run database migration (if any DB changes)</p>
              <p className="text-primary">cd upgrade && uv run migrate_all.py</p>
              <p className="text-on-surface-variant mt-2"># 3. Restart services</p>
              <p className="text-primary">sudo systemctl restart openalgo-your-service-name</p>
              <p className="text-primary">sudo systemctl restart nginx</p>
            </div>
            <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Note:</strong> Upgrades overwrite core OpenAlgo files. Your custom
                strategies inside the strategies folder are preserved. If your .env file gets replaced, restore your
                API key, API secret, and redirect URL from your backup.
              </p>
            </div>
          </div>

          {/* Useful Commands */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4">Useful Server Commands</h3>
            <div className="space-y-3">
              {[
                { cmd: "sudo systemctl status openalgo-*", desc: "Check if OpenAlgo is running" },
                { cmd: "sudo systemctl restart openalgo-*", desc: "Restart OpenAlgo service" },
                { cmd: "sudo ufw status", desc: "View firewall rules" },
                { cmd: "htop", desc: "Live system monitor (CPU, RAM usage)" },
                { cmd: "df -h", desc: "Check disk space" },
                { cmd: "free -m", desc: "Check memory usage" },
                { cmd: "nproc", desc: "Check number of CPU cores" },
              ].map(item => (
                <div key={item.cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <code className="px-2 py-1 rounded surface-container text-xs font-mono text-primary shrink-0">{item.cmd}</code>
                  <span className="text-xs sm:text-sm text-on-surface-variant">{item.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-tertiary/5 p-4 border-l-4 border-l-tertiary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Pro tip:</strong> If your SSH session disconnects after being idle, use{" "}
                <code className="px-1 py-0.5 rounded surface-high text-xs">ssh -o ServerAliveInterval=60 root@your-ip</code>{" "}
                to keep the connection alive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Security */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Security Best Practices</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Protecting your trading infrastructure.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: "Always use Cloudflare",
                desc: "Never expose your server IP directly. Cloudflare hides your real IP. Even a ping to your domain only reveals Cloudflare's IP. This blocks 95% of bot attacks.",
              },
              {
                icon: Lock,
                title: "Keep the firewall tight",
                desc: "Only open ports you need (22, 80, 443). The installation script configures this by default. Don't add extra ports unless absolutely necessary.",
              },
              {
                icon: Shield,
                title: "SSL/TLS Full Strict mode",
                desc: "In Cloudflare, set SSL mode to Full (Strict). This encrypts traffic from browser to Cloudflare and from Cloudflare to your server. End to end protection.",
              },
              {
                icon: Settings,
                title: "Security headers enabled",
                desc: "OpenAlgo's Nginx config includes security headers by default. You can verify at securityheaders.com. OpenAlgo scores A or A+ grade.",
              },
              {
                icon: RefreshCw,
                title: "Enable automatic backups",
                desc: "Most VPS providers offer auto-backup for a small fee. If your server crashes, you can restore everything including databases and trading logs.",
              },
              {
                icon: Key,
                title: "Register immediately after setup",
                desc: "OpenAlgo is single-user. The first person to register becomes admin. Register right after installation to secure your instance.",
              },
            ].map((tip, i) => (
              <div key={i} className="obsidian-card rounded-xl p-4 sm:p-6 ghost-border flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 shrink-0">
                  <tip.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface mb-1 text-sm sm:text-base">{tip.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 8: Understanding Latency */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Understanding Latency</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              How fast do orders travel from your server to the exchange?
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4">The Order Journey</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              When you place an order, it travels through several hops. Each hop adds latency.
              Here&apos;s what a typical end to end journey looks like on a dedicated server in Mumbai:
            </p>

            <div className="space-y-3 mb-6">
              {[
                { from: "Your Home (Bangalore)", to: "Your Server (Mumbai)", time: "~20ms", note: "Internet hop" },
                { from: "OpenAlgo Processing", to: "", time: "~5 to 10ms", note: "Symbol lookup, validation, caching" },
                { from: "Server", to: "Broker API", time: "~35 to 80ms", note: "Varies by broker" },
                { from: "Broker OMS", to: "Exchange", time: "~6 to 50ms", note: "Broker's internal checks (130+ validations)" },
              ].map((hop, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg surface-container p-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-on-surface font-medium">{hop.from}{hop.to && ` → ${hop.to}`}</p>
                    <p className="text-xs text-on-surface-variant">{hop.note}</p>
                  </div>
                  <span className="font-label text-label-md text-primary shrink-0">{hop.time}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl surface-container p-4 sm:p-5 text-center mb-6">
              <p className="font-label text-label-lg text-on-surface-variant uppercase tracking-wider mb-2">Typical End to End Latency</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-primary">100 to 200ms</p>
                  <p className="text-xs text-on-surface-variant mt-1">Dedicated CPU (recommended)</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-secondary">300 to 600ms</p>
                  <p className="text-xs text-on-surface-variant mt-1">Shared CPU (budget option)</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Measure it yourself:</strong> OpenAlgo has a built-in latency
                dashboard under Logs → Latency. It measures the time from your server to the broker API for every
                order, including OpenAlgo&apos;s processing overhead.
              </p>
            </div>
          </div>

          {/* Cloudflare Latency Myth */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-tertiary mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3">Does Cloudflare Add Latency to Orders?</h3>
            <p className="text-sm text-on-surface-variant mb-3">
              <strong className="text-on-surface">No.</strong> This is a common misconception. Cloudflare only sits
              between your browser and the server (for accessing the web dashboard). Your trading orders go directly
              from OpenAlgo on the server to the broker API. Cloudflare is not in that path at all.
            </p>
            <p className="text-sm text-on-surface-variant">
              Even if Cloudflare has an outage, your strategies keep running and orders keep firing.
              You just won&apos;t be able to access the OpenAlgo web dashboard until Cloudflare recovers.
            </p>
          </div>

          {/* Live vs Analyzer Mode */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4">Live Mode vs Analyzer Mode Latency</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl surface-container p-4">
                <p className="font-semibold text-sm text-on-surface mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-tertiary" /> Live Mode
                </p>
                <p className="text-xs text-on-surface-variant mb-3">
                  Orders go directly to the broker. No LTP checks, no local database writes. Fastest possible execution.
                </p>
                <p className="font-label text-label-lg text-tertiary">40 to 150ms</p>
              </div>
              <div className="rounded-xl surface-container p-4">
                <p className="font-semibold text-sm text-on-surface mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" /> Analyzer Mode
                </p>
                <p className="text-xs text-on-surface-variant mb-3">
                  Fetches LTP, checks bid/ask, writes to local SQLite database. More overhead but safe for testing.
                </p>
                <p className="font-label text-label-lg text-secondary">200 to 400ms</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-4">
              Always test strategies in Analyzer mode first. Once validated, flip to Live mode for production execution.
              The latency difference exists because Analyzer mode simulates execution locally while Live mode hits the broker directly.
            </p>
          </div>
        </div>
      </div>

      {/* Section 9: Desktop Users */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Running on Desktop?</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              You don&apos;t need a server. Here&apos;s how static IP works from your home.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
              If you run OpenAlgo on your desktop or laptop, you need a static IP from your ISP (Internet Service Provider).
              Your ISP provides you a public facing IP that your broker sees when orders are placed.
              By default, this IP is dynamic (changes periodically). A static IP ensures it never changes.
            </p>

            <div className="space-y-4 mb-6">
              {[
                { step: "Contact your ISP", desc: "Call Jio, Airtel, ACT, Tata, BSNL, etc. Ask for a static IP. Most charge a small monthly fee." },
                { step: "Whitelist at broker", desc: "Enter your static IP in the broker's developer portal, same as the server method." },
                { step: "Use localhost for OpenAlgo", desc: "Your redirect URL stays as 127.0.0.1:5000. Only the order-originating IP matters to the broker." },
                { step: "Setup a firewall", desc: "A static IP makes your machine discoverable. Install a firewall (Windows Firewall, UFW on Linux, or pf on Mac) to block all incoming traffic except what you explicitly allow. This guards against external security attacks, port scans, and unauthorized access." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">{i + 1}</div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{item.step}</p>
                    <p className="text-xs sm:text-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Important:</strong> Running on desktop means OpenAlgo is only
                available when your computer is on. If you shut down or your internet drops, strategies stop.
                For 24/7 reliability, a VPS server is recommended.
              </p>
            </div>
          </div>

          {/* Multi-account */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-secondary mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
              Multiple Broker Accounts
            </h3>
            <p className="text-sm text-on-surface-variant mb-3">
              OpenAlgo is single-user: one instance connects to one broker. To run multiple accounts
              (your own accounts across different brokers, or family accounts), use the multi-instance installer:
            </p>
            <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
              <p className="text-primary">sudo ./install-multi.sh</p>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              This runs multiple OpenAlgo instances on the same server with the same static IP.
              Each instance gets its own subdomain, systemd service, and database.
              Ensure all accounts belong to you or your family as per SEBI guidelines.
            </p>
          </div>

          {/* Static IP Family Sharing */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Static IP Family Sharing
            </h3>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4">
              This applies if you are <strong className="text-on-surface">hosting multiple OpenAlgo instances for
              family accounts on a single static IP</strong>. By default, each static IP can only be assigned
              to one trading account at a time. If you run OpenAlgo for your own account and your family
              member&apos;s account from the same server or home network, you need to request the broker to
              allow the same static IP across both accounts. This is called{" "}
              <strong className="text-on-surface">Static IP Family Sharing</strong>.
            </p>

            <div className="rounded-lg sm:rounded-xl surface-container p-4 sm:p-6 mb-5">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 uppercase tracking-wider">Who is Eligible?</p>
              <div className="space-y-2 mb-4">
                {[
                  "Both accounts must have active API access with the broker",
                  "The family member must be your Spouse, Parent, or Child (adult, 18+)",
                  "Both must be on the same shared network infrastructure (e.g., same home broadband)",
                  "The IP addresses must be static and registered under your name or shared network",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary mt-0.5 shrink-0" />
                    <span className="text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-destructive/5 p-3 border-l-4 border-l-destructive">
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  <strong className="text-on-surface">Not eligible:</strong> Siblings, cousins, in-laws, and all other
                  relationships are not covered under this facility as per the SEBI circular
                  (SEBI/HO/MIRSD/MIRSD-PoD1/P/CIR/2024/169 dated December 03, 2024).
                  Only Spouse, Parent, and Child (adult) relationships are permitted.
                </p>
              </div>
            </div>

            <div className="mb-5">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 uppercase tracking-wider">Typical Process</p>
              <p className="text-sm text-on-surface-variant mb-4">
                Different brokers have different processes for family IP sharing. The general steps are:
              </p>
              <div className="space-y-3">
                {[
                  { step: "Submit a formal request", desc: "Send an email or fill a form with your broker's API support team requesting static IP registration and family sharing activation." },
                  { step: "Provide account details", desc: "Include your client ID, registered name, email, mobile, and your family member's client ID, name, email, and relationship." },
                  { step: "Provide IP details", desc: "Include your primary static IP address and secondary IP (optional). The same IP set will be shared across both accounts." },
                  { step: "Family member confirms consent", desc: "Your family member must independently confirm consent, typically by replying from their own registered email address." },
                  { step: "Broker verifies and activates", desc: "The broker verifies both requests and activates the IP mapping, usually within 1 business day." },
                  { step: "Both receive confirmation", desc: "Both you and your family member receive confirmation once the shared IP mapping is active." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{item.step}</p>
                      <p className="text-xs sm:text-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 uppercase tracking-wider">Before You Begin Checklist</p>
              <p className="text-sm text-on-surface-variant mb-3">
                Ensure all of the following are in place before sending your request. Incomplete requests
                will be returned and will delay activation.
              </p>
              <div className="space-y-2">
                {[
                  "You know your own client/account ID with the broker",
                  "You know your family member's client/account ID with the same or different broker",
                  "You are sending the request from your registered email address (the one used when opening the account)",
                  "Your family member's registered email address is available for confirmation",
                  "You have a confirmed static IP address (not a dynamic/changing IP). Your ISP or VPS provider has verified this",
                  "You know whether you need a secondary (backup) IP in addition to your primary IP",
                  "Your family member is aware of the request and is ready to reply from their own registered email",
                  "Your family member's relationship is Spouse, Parent, or Child (18 years or older)",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs sm:text-sm">
                    <div className="w-4 h-4 rounded border border-outline-variant/40 mt-0.5 shrink-0" />
                    <span className="text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 uppercase tracking-wider">Declaration Requirements</p>
              <p className="text-sm text-on-surface-variant mb-3">
                When requesting family sharing, you typically need to declare:
              </p>
              <div className="space-y-2">
                {[
                  "The IP addresses listed are static and registered under your name or shared network infrastructure",
                  "The family member qualifies under SEBI's definition of 'family' (Spouse / Parent / Child)",
                  "The same IP set will be shared across both accounts and does not constitute separate or independent access",
                  "IP addresses can be updated at most once per calendar week",
                  "You take full responsibility for all API activity originating from the shared IP",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs sm:text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-on-surface-variant mt-0.5 shrink-0" />
                    <span className="text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Important:</strong> The process varies significantly between
                brokers. Some brokers handle this via email, some through their developer portal, and some may
                require additional documentation. If you manage multiple family accounts on the same IP, always
                check with your specific broker for their exact procedure and approval requirements before setting up.
              </p>
            </div>
          </div>

          {/* Broker Policies & Restrictions */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-primary">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Static IP Policies &amp; Restrictions to Be Aware Of
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              Each broker implements static IP policies differently. Stay informed and proactive:
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "One API key per account (most brokers)",
                  desc: "Most brokers allow only one API key creation per account with primary and secondary IP slots. Only a few selected brokers allow multiple API keys, but still with the same IP restrictions."
                },
                {
                  title: "IP change cooldown period",
                  desc: "Once you set your static IP, changes are typically allowed only once per calendar week. Plan your infrastructure migration carefully. A wrong IP means no orders for up to 7 days."
                },
                {
                  title: "Check broker announcements regularly",
                  desc: "Brokers send email announcements about static IP policy changes, new requirements, and deadline extensions. Read these carefully. Policies are evolving and may change without much notice."
                },
                {
                  title: "Family sharing requires permission",
                  desc: "If multiple family members use the same static IP from the same broker, you likely need explicit approval. The process, documentation, and timeline vary by broker."
                },
                {
                  title: "Cross-broker family accounts",
                  desc: "If family members use different brokers, each broker needs to be contacted separately. One broker's approval does not apply to another."
                },
                {
                  title: "Static IP must match exactly",
                  desc: "The IP from which your orders originate must exactly match the whitelisted IP. If your ISP changes your IP (dynamic IP), orders will be silently rejected. There is no fallback or grace period."
                },
                {
                  title: "Keep records of all approvals",
                  desc: "Save all email confirmations, ticket numbers, and approval references. If there is a dispute or audit, these records serve as proof of compliance."
                },
              ].map((item, i) => (
                <div key={i} className="rounded-lg surface-container p-3 sm:p-4">
                  <p className="text-sm font-semibold text-on-surface mb-1">{item.title}</p>
                  <p className="text-xs sm:text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 10: FAQ */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Common questions from the community about static IP and hosting.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can I shut down my server after market hours to save costs?",
                a: "You can stop the server, but you'll still be billed for the reserved IP, storage, and backups. Only fully deleting the server stops billing entirely, but then you lose your IP and have to reconfigure everything. For most traders, the monthly cost of keeping it running is worth the convenience."
              },
              {
                q: "What if my server IP changes?",
                a: "VPS static IPs don't change unless you destroy and recreate the server. If you migrate servers, update the new IP in both Cloudflare (A record) and your broker's developer portal. Brokers allow IP changes once per week."
              },
              {
                q: "Do I need a static IP for manual trading?",
                a: "No. Static IP is only required for API-based algo trading. If you trade manually through your broker's website or mobile app, no static IP is needed."
              },
              {
                q: "Can I use IPv6?",
                a: "Not yet. Indian brokers currently only support IPv4 whitelisting. Always ensure your server provides an IPv4 address."
              },
              {
                q: "Where should I host for lowest latency?",
                a: "Mumbai datacenters are closest to the NSE/BSE exchange servers. Bangalore and Delhi add 10 to 20ms extra. International locations work but add more latency. For most retail traders, anywhere in India is fine."
              },
              {
                q: "Can I run strategies from home but use a server for orders?",
                a: "Yes. Run Amibroker, Python, or TradingView from home. Signals go to your server's OpenAlgo via the API. OpenAlgo processes and forwards orders to the broker from the server's static IP. The broker only sees the server IP."
              },
              {
                q: "How many strategies can I run on one server?",
                a: "Depends on how strategies fetch data. WebSocket-based strategies are lighter. If fetching historical data per strategy, broker rate limits become the bottleneck. Typically 5 to 10 strategies on a standard server."
              },
              {
                q: "What happens if Cloudflare goes down?",
                a: "Your OpenAlgo web dashboard becomes inaccessible, but your server and strategies keep running. Orders continue to fire normally because Cloudflare is only in the browser access path, not the order execution path."
              },
            ].map((faq, i) => (
              <ExpandableCard key={i} title={faq.q} icon={MessageCircle}>
                <p className="text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
              </ExpandableCard>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Cost Summary</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              What to expect for running your own trading server.
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border">
            <div className="space-y-4">
              {[
                { item: "Domain", cost: "700 to 900/year", note: ".in or .com domain" },
                { item: "Cloudflare", cost: "Free", note: "Free plan is sufficient" },
                { item: "VPS (Shared CPU)", cost: "500 to 1,000/month", note: "Good for starting out" },
                { item: "VPS (Dedicated CPU)", cost: "2,500 to 4,000/month", note: "Recommended for live trading" },
                { item: "SSL Certificate", cost: "Free", note: "Via Let's Encrypt" },
                { item: "OpenAlgo", cost: "Free forever", note: "Open source (AGPL-3.0)" },
              ].map((row, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-3 border-b border-outline-variant/10 last:border-0">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold text-sm text-on-surface">{row.item}</span>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right ml-7 sm:ml-0">
                    <span className="font-label text-label-lg text-primary">{row.cost}</span>
                    <span className="text-xs text-on-surface-variant">({row.note})</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl surface-container p-4 text-center">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">Total estimated cost:</strong> Starting from approximately{" "}
                <strong className="text-primary">1,500 to 2,000 per month</strong> for a basic setup
                with domain + VPS. OpenAlgo, Cloudflare, and SSL are all free.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 sm:py-20 md:py-24">
        <div className="container max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">Ready to Deploy?</h2>
          <p className="text-base sm:text-lg text-on-surface-variant mb-8 sm:mb-10">
            Follow the documentation for detailed installation instructions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                Installation Docs
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View Source Code
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/discord">
                <MessageCircle className="mr-2 h-4 w-4" />
                Join Community
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
