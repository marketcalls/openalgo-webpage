"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
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

export default function FAQPage() {
  const { t } = useI18n()
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  const categories = [
    {
      id: "platform",
      label: t('faq.platform.label'),
      icon: Server,
      description: t('faq.platform.desc'),
      faqs: [
        {
          question: t('faq.platform.q1'),
          answer: t('faq.platform.a1'),
        },
        {
          question: t('faq.platform.q2'),
          answer: t('faq.platform.a2'),
          showBrokers: true,
        },
        {
          question: t('faq.platform.q3'),
          answer: t('faq.platform.a3'),
        },
        {
          question: t('faq.platform.q4'),
          answer: t('faq.platform.a4'),
        },
        {
          question: t('faq.platform.q5'),
          answer: t('faq.platform.a5'),
        },
        {
          question: t('faq.platform.q6'),
          answer: t('faq.platform.a6'),
        },
        {
          question: t('faq.platform.q7'),
          answer: t('faq.platform.a7'),
        },
      ],
    },
    {
      id: "licensing",
      label: t('faq.licensing.label'),
      icon: Scale,
      description: t('faq.licensing.desc'),
      faqs: [
        {
          question: t('faq.licensing.q1'),
          answer: t('faq.licensing.a1'),
        },
        {
          question: t('faq.licensing.q2'),
          answer: t('faq.licensing.a2'),
        },
        {
          question: t('faq.licensing.q3'),
          answer: t('faq.licensing.a3'),
        },
        {
          question: t('faq.licensing.q4'),
          answer: t('faq.licensing.a4'),
        },
        {
          question: t('faq.licensing.q5'),
          answer: t('faq.licensing.a5'),
        },
        {
          question: t('faq.licensing.q6'),
          answer: t('faq.licensing.a6'),
        },
        {
          question: t('faq.licensing.q7'),
          answer: t('faq.licensing.a7'),
        },
        {
          question: t('faq.licensing.q8'),
          answer: t('faq.licensing.a8'),
        },
      ],
    },
  ]

  const resources = [
    { title: t('faq.res1t'), description: t('faq.res1d'), icon: BookOpen, url: "https://docs.openalgo.in", tile: "bg-primary/10", glyph: "text-primary" },
    { title: t('faq.res2t'), description: t('faq.res2d'), icon: MessageCircle, url: "/discord", tile: "bg-secondary/10", glyph: "text-secondary" },
    { title: "GitHub", description: t('faq.res3d'), icon: Github, url: "https://github.com/marketcalls/openalgo", tile: "bg-tertiary/10", glyph: "text-tertiary" },
  ]

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
              {t('faq.badge')}
            </span>
          </div>

          <h1 className="reveal reveal-2 text-display-md sm:text-display-lg mb-5 tracking-tight">
            <span className="block text-on-surface">{t('faq.h1a')}</span>
            <span className="text-on-surface ">
              {t('faq.h1b')}
            </span>
          </h1>

          <p className="reveal reveal-3 text-lg text-on-surface-variant mb-8 leading-relaxed">
            {t('faq.sub')}
          </p>

          {/* Search */}
          <div className="reveal reveal-4 relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('faq.searchPlaceholder')}
              className="w-full pl-11 pr-4 py-3 rounded-xl surface-container ghost-border text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
            {q && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label text-label-sm text-on-surface-variant">
                {totalMatches} {totalMatches === 1 ? t('faq.match') : t('faq.matches')}
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
                {t('faq.categories')}
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
                <p className="text-on-surface font-semibold mb-1">{t('faq.noMatches').replace('{n}', query)}</p>
                <p className="text-sm text-on-surface-variant">
                  {t('faq.noMatchesHint')}
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
                              <p className="mt-4">{t('faq.brokersMore')}</p>
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
              <h2 className="text-headline-sm text-on-surface mb-6">{t('faq.stuck')}</h2>
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
                <p className="text-on-surface font-semibold mb-2">{t('faq.ctaTitle')}</p>
                <p className="text-sm text-on-surface-variant mb-6">
                  {t('faq.ctaSub')}
                </p>
                <Button asChild>
                  <a href="/discord" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('faq.ctaJoin')}
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
