"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  MessageCircle,
  Github,
  BookOpen,
  Search,
  Server,
  Scale,
  HelpCircle,
  Landmark,
} from "lucide-react"

const brokers = [
  "5paisa",
  "5paisa (XTS)",
  "Aliceblue",
  "Angel One",
  "Arrow",
  "Compositedge (XTS)",
  "Definedge Securities",
  "Delta Exchange",
  "Dhan",
  "Firstock",
  "Flattrade",
  "Fyers",
  "Groww",
  "IIFL Capital",
  "IIFL (XTS)",
  "IndiaBulls Securities (XTS)",
  "INDMoney",
  "Jainam (XTS)",
  "Kotak",
  "Motilal Oswal",
  "mStock",
  "Nubra",
  "PayTM",
  "Pocketful",
  "RMoney",
  "Samco",
  "Shoonya",
  "Tradejini",
  "TradeSmartOnline",
  "Upstox",
  "Wisdom Capital (XTS)",
  "Zebu",
  "Zerodha",
]

const categories = [
  {
    id: "platform",
    label: "Platform",
    icon: Server,
    description: "Setup, hosting, brokers, and day-to-day usage",
    faqs: [
      {
        question: "What is OpenAlgo?",
        answer:
          "OpenAlgo is an open-source algorithmic trading platform that acts as a bridge between various trading platforms and brokers. It's a web-based, self-hostable application that can run on Windows, Mac, Linux, or cloud environments. OpenAlgo currently supports connecting to your personal trading account and can interact with multiple popular trading platforms like Amibroker, MetaTrader, Python, NodeJS, Excel, and Google Spreadsheet.",
      },
      {
        question: "Which brokers are supported?",
        answer:
          "OpenAlgo currently supports integration with the following popular brokers in the Indian market:",
        showBrokers: true,
      },
      {
        question: "What are the system requirements?",
        answer: `The minimum requirements are:

• 0.5GB RAM with minimum 2GB of Swap memory
• OR 2GB RAM without any swap memory
• Stable internet connection
• Python 3.10 or higher
• Any modern operating system (Windows, Mac, or Linux)`,
      },
      {
        question: "Where can I host OpenAlgo?",
        answer: `OpenAlgo can be hosted in multiple environments:

• Locally on your Windows PC, Mac, or Linux machine
• On cloud servers (AWS, Digital Ocean, etc.)
• On your own private domain

For best performance with Indian markets, it's recommended to host on servers located in India to minimize latency.`,
      },
      {
        question: "What are the costs involved?",
        answer: `OpenAlgo itself is completely free and open-source. However, there may be associated costs:

• Trading platform costs (if using TradingView, Amibroker, etc.)
• Broker API charges (varies by broker, many are free)
• Real-time data feed subscription
• Server hosting costs (if using cloud servers, typically $6-12/month for basic setups)
• Standard trading costs (brokerage, STT, GST, etc.)`,
      },
      {
        question: "How secure is OpenAlgo?",
        answer: `OpenAlgo prioritizes security with features like:

• Self-hosted environment - you control your infrastructure
• Support for broker-specific security requirements (TOTP, 2FA)
• Secure storage of API keys and credentials
• Regular security updates and improvements
• Open-source code that can be audited for security`,
      },
      {
        question: "Why do I need to login daily?",
        answer: `Daily login is required for exchange compliance and security:

• Auth tokens expire at midnight as per exchange regulations
• Broker servers expire sessions for security compliance
• Fresh login ensures secure trading session each day
• This is an industry-standard security practice mandated by Indian exchanges
• Protects your account from unauthorized access`,
      },
    ],
  },
  {
    id: "licensing",
    label: "Licensing",
    icon: Scale,
    description: "AGPL, SDKs, and commercial usage",
    faqs: [
      {
        question: "If I build a strategy using the Python SDK, do I need to open source it?",
        answer:
          "No. The SDKs are MIT-licensed. Your strategies remain completely private. The AGPL license only applies to modifications of the OpenAlgo core platform itself.",
      },
      {
        question: "Can I use Analyze Mode for proprietary testing?",
        answer:
          "Yes. You can test strategies without execution risk, and your logic stays private. The Analyze Mode is a feature of OpenAlgo, and your strategies using it remain your intellectual property.",
      },
      {
        question: "I am a broker. Can I rebrand OpenAlgo for my clients?",
        answer:
          "Yes, you can customize and rebrand the interface. But if you modify the core and offer it as a hosted service, you must release those modifications under AGPL. For proprietary modifications, commercial licensing is available.",
      },
      {
        question: "What about internal use within my firm?",
        answer:
          "Internal use does not require you to share modifications. AGPL applies only to distribution and network-based services. You can modify and use OpenAlgo internally without any obligation to share your changes.",
      },
      {
        question: "Can I charge for training, consulting, or support?",
        answer:
          "Yes. The license places no restrictions on service-based monetization. You can offer paid training, consulting, support, or managed services around OpenAlgo.",
      },
      {
        question: "What if my business requires proprietary changes?",
        answer:
          "Commercial licensing is available so you can keep certain modifications private. Contact the OpenAlgo team through Discord or GitHub to discuss commercial licensing options.",
      },
      {
        question: "Does AGPL affect my WebSocket connections or custom webhooks?",
        answer:
          "No. Your external integrations remain your property. AGPL only applies to modifications of the OpenAlgo core platform. Your strategies, webhooks, and external connections are yours.",
      },
      {
        question: "How does OpenAlgo GPT affect licensing?",
        answer:
          "OpenAlgo GPT is a community resource to help users. It does not change licensing terms. Any code or strategies you develop with its help remain your intellectual property.",
      },
    ],
  },
]

const resources = [
  { title: "Documentation", description: "Guides, API reference, and broker setup", icon: BookOpen, url: "https://docs.openalgo.in", tile: "bg-primary/10", glyph: "text-primary" },
  { title: "Discord Community", description: "Get answers from traders and maintainers", icon: MessageCircle, url: "/discord", tile: "bg-secondary/10", glyph: "text-secondary" },
  { title: "GitHub", description: "Source code, issues, and discussions", icon: Github, url: "https://github.com/marketcalls/openalgo", tile: "bg-tertiary/10", glyph: "text-tertiary" },
]

export default function FAQPage() {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  const filtered = categories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (f) =>
          !q ||
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          (f.showBrokers && brokers.some((b) => b.toLowerCase().includes(q)))
      ),
    }))
    .filter((cat) => cat.faqs.length > 0)

  const totalMatches = filtered.reduce((sum, cat) => sum + cat.faqs.length, 0)

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden px-4 pt-20 pb-14">
        <div className="absolute inset-0 obsidian-grid" />
        <div className="glow-orb w-[520px] h-[280px] bg-primary/15 top-[-20%] left-1/2 -translate-x-1/2" />
        <div className="glow-orb w-[300px] h-[200px] bg-tertiary/10 bottom-[-30%] right-[15%]" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="reveal reveal-1 inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full surface-low ghost-border">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="font-label text-label-md uppercase tracking-wider text-on-surface-variant">
              Support / FAQ
            </span>
          </div>

          <h1 className="reveal reveal-2 text-display-md sm:text-display-lg mb-5 tracking-tight">
            <span className="block text-on-surface">Questions,</span>
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-tertiary animate-gradient">
              Answered
            </span>
          </h1>

          <p className="reveal reveal-3 text-lg text-on-surface-variant mb-8 leading-relaxed">
            Everything about running, hosting, and licensing OpenAlgo.
          </p>

          {/* Search */}
          <div className="reveal reveal-4 relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions, brokers, licensing..."
              className="w-full pl-11 pr-4 py-3 rounded-xl surface-container ghost-border text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
            {q && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label text-label-sm text-on-surface-variant">
                {totalMatches} {totalMatches === 1 ? "match" : "matches"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-5xl px-4 pb-24">
        <div className="grid lg:grid-cols-[200px_1fr] gap-10">
          {/* Category rail */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1.5">
              <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant px-3 mb-3">
                Categories
              </p>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:surface-container transition-all"
                >
                  <cat.icon className="h-4 w-4 text-primary" />
                  <span className="flex-1">{cat.label}</span>
                  <span className="font-label text-label-sm text-on-surface-variant">
                    {cat.faqs.length}
                  </span>
                </a>
              ))}
            </nav>
          </aside>

          {/* FAQ sections */}
          <div className="space-y-14 min-w-0">
            {filtered.length === 0 && (
              <div className="text-center py-20 rounded-2xl surface-low ghost-border">
                <Search className="h-6 w-6 text-on-surface-variant mx-auto mb-4" />
                <p className="text-on-surface font-semibold mb-1">No matches for &quot;{query}&quot;</p>
                <p className="text-sm text-on-surface-variant">
                  Try a different keyword, or ask on Discord.
                </p>
              </div>
            )}

            {filtered.map((cat) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex p-2 rounded-lg bg-primary/10">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-headline-sm text-on-surface">{cat.label}</h2>
                </div>
                <p className="text-sm text-on-surface-variant mb-6 ml-12">{cat.description}</p>

                <Accordion type="single" collapsible className="w-full">
                  {cat.faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`${cat.id}-${index}`}
                      className="obsidian-card ghost-border rounded-xl"
                    >
                      <AccordionTrigger className="text-left gap-4">
                        <span className="flex items-baseline gap-4 min-w-0">
                          <span className="font-label text-label-sm text-primary shrink-0">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{faq.question}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="whitespace-pre-line">
                        <div className="ml-8">
                          {faq.answer}
                          {faq.showBrokers && (
                            <>
                              <div className="flex flex-wrap gap-2 mt-4 whitespace-normal">
                                {brokers.map((b) => (
                                  <span
                                    key={b}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full surface-container font-label text-label-md text-on-surface"
                                  >
                                    <Landmark className="h-3 w-3 text-tertiary" />
                                    {b}
                                  </span>
                                ))}
                              </div>
                              <p className="mt-4">And more brokers are being added regularly.</p>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}

            {/* Resources */}
            <section>
              <h2 className="text-headline-sm text-on-surface mb-6">Still stuck? Start here</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {resources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="obsidian-card rounded-xl p-6 ghost-border hover-lift group"
                  >
                    <div className={`inline-flex p-2.5 rounded-lg mb-4 ${resource.tile}`}>
                      <resource.icon className={`h-5 w-5 ${resource.glyph}`} />
                    </div>
                    <h3 className="font-semibold text-on-surface mb-1">{resource.title}</h3>
                    <p className="text-sm text-on-surface-variant">{resource.description}</p>
                  </a>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="text-center rounded-2xl surface-low p-10 ghost-border relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-secondary/5 to-tertiary/5" />
              <div className="relative z-10">
                <p className="text-on-surface font-semibold mb-2">Question not covered here?</p>
                <p className="text-sm text-on-surface-variant mb-6">
                  The community answers most questions within minutes.
                </p>
                <Button asChild>
                  <a href="/discord" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join Discord
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
