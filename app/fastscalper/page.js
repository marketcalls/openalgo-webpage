"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
import { ArrowRight, Download, Zap, Laptop, Settings, Webhook, Terminal, MonitorSmartphone, Keyboard, Volume2, Cpu, Lock } from "lucide-react"

export default function FastScalperPage() {
  const { t } = useI18n()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-display-md mb-6 text-on-surface">FastScalper</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {t('fs.heroDesc')}
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Zap, title: t('fs.f1t'), desc: t('fs.f1d') },
            { icon: Cpu, title: t('fs.f2t'), desc: t('fs.f2d') },
            { icon: Lock, title: t('fs.f3t'), desc: t('fs.f3d') },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="obsidian-card rounded-xl p-8 text-center hover-lift ghost-border group">
              <div className="inline-flex p-3 rounded-xl surface-container mb-5 group-hover:glow-primary transition-all">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-on-surface">{title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Platform Support */}
        <div className="rounded-xl surface-low p-10 mb-16 ghost-border">
          <h2 className="text-headline-md mb-10 text-center text-on-surface">{t('fs.platformsTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: MonitorSmartphone, title: "Windows", items: [t('fs.winI1'), t('fs.winI2'), t('fs.winI3')] },
              { icon: Laptop, title: "macOS", items: [t('fs.macI1'), t('fs.macI2'), t('fs.macI3')] },
              { icon: Terminal, title: "Linux", items: [t('fs.linI1'), t('fs.linI2'), t('fs.linI3')] },
            ].map(({ icon: Icon, title, items }) => (
              <div key={title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
                </div>
                <ul className="space-y-2 text-on-surface-variant text-sm">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Features */}
        <div className="mb-16">
          <h2 className="text-headline-md mb-8 text-center text-on-surface">{t('fs.tradingTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="obsidian-card rounded-xl p-7 ghost-border">
              <h3 className="text-lg font-semibold mb-5 text-on-surface">{t('fs.orderTitle')}</h3>
              <div className="space-y-5">
                {[
                  { icon: Keyboard, title: t('fs.om1t'), desc: t('fs.om1d') },
                  { icon: Settings, title: t('fs.om2t'), desc: t('fs.om2d') },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{title}</p>
                      <p className="text-sm text-on-surface-variant">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="obsidian-card rounded-xl p-7 ghost-border">
              <h3 className="text-lg font-semibold mb-5 text-on-surface">{t('fs.smartTitle')}</h3>
              <div className="space-y-5">
                {[
                  { icon: Volume2, title: t('fs.sm1t'), desc: t('fs.sm1d') },
                  { icon: Webhook, title: t('fs.sm2t'), desc: t('fs.sm2d') },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{title}</p>
                      <p className="text-sm text-on-surface-variant">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="rounded-xl surface-low p-10 mb-16 ghost-border">
          <h2 className="text-headline-md mb-8 text-center text-on-surface">{t('fs.startTitle')}</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-on-surface">{t('fs.prereqTitle')}</h3>
              <ul className="space-y-3 text-on-surface-variant text-sm">
                {[t('fs.pr1'), t('fs.pr2'), t('fs.pr3')].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-on-surface">{t('fs.setupTitle')}</h3>
              <ul className="space-y-3 text-on-surface-variant text-sm">
                {[t('fs.su1'), t('fs.su2'), t('fs.su3')].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" asChild>
            <a href="/download" className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t('fs.cta')}
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
