"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  Keyboard, Network, Zap, GraduationCap, GitMerge, Monitor, Globe, Workflow,
  ArrowUpCircle, FlaskConical, Sliders, LayoutDashboard, Shield, Bot,
  Code2, Library, Smartphone
} from "lucide-react"

// title/description/category hold i18n keys resolved via t() at render time.
const features = [
  { title: 'road.f1t', description: 'road.f1d', icon: Monitor, category: 'road.catPlatform', priority: "top" },
  { title: 'road.f2t', description: 'road.f2d', icon: LayoutDashboard, category: 'road.catPlatform' },
  { title: 'road.f3t', description: 'road.f3d', icon: Smartphone, category: 'road.catPlatform' },
  { title: 'road.f4t', description: 'road.f4d', icon: Shield, category: 'road.catTrading' },
  { title: 'road.f5t', description: 'road.f5d', icon: GitMerge, category: 'road.catTrading' },
  { title: 'road.f6t', description: 'road.f6d', icon: Network, category: 'road.catIntegration' },
  { title: 'road.f7t', description: 'road.f7d', icon: Zap, category: 'road.catPerformance' },
  { title: 'road.f8t', description: 'road.f8d', icon: Keyboard, category: 'road.catPerformance' },
  { title: 'road.f9t', description: 'road.f9d', icon: Workflow, category: 'road.catDevex' },
  { title: 'road.f10t', description: 'road.f10d', icon: FlaskConical, category: 'road.catDevex' },
  { title: 'road.f11t', description: 'road.f11d', icon: Sliders, category: 'road.catTrading' },
  { title: 'road.f12t', description: 'road.f12d', icon: ArrowUpCircle, category: 'road.catDevex' },
  { title: 'road.f13t', description: 'road.f13d', icon: GraduationCap, category: 'road.catEducation' },
  { title: 'road.f14t', description: 'road.f14d', icon: Globe, category: 'road.catGlobal' },
  { title: 'road.f15t', description: 'road.f15d', icon: Sliders, category: 'road.catTrading' },
  { title: 'road.f16t', description: 'road.f16d', icon: Bot, category: 'road.catAi' },
  { title: 'road.f17t', description: 'road.f17d', icon: Code2, category: 'road.catDevex' },
  { title: 'road.f18t', description: 'road.f18d', icon: Library, category: 'road.catDevex' }
]

const categories = [
  { name: 'road.catPlatform', color: "text-secondary bg-secondary/10" },
  { name: 'road.catTrading', color: "text-primary bg-primary/10" },
  { name: 'road.catIntegration', color: "text-secondary bg-secondary/10" },
  { name: 'road.catPerformance', color: "text-tertiary bg-tertiary/10" },
  { name: 'road.catDevex', color: "text-primary bg-primary/10" },
  { name: 'road.catAi', color: "text-secondary bg-secondary/10" },
  { name: 'road.catGlobal', color: "text-tertiary bg-tertiary/10" },
  { name: 'road.catEducation', color: "text-secondary bg-secondary/10" }
]

export default function RoadmapPage() {
  const { t } = useI18n()

  return (
    <div className="container max-w-7xl py-16">
      <div className="space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-display-md text-on-surface">{t('road.title')}</h1>
          <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            {t('road.desc')}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <span
              key={category.name}
              className={`px-3 py-1.5 rounded-full font-label text-label-md ${category.color}`}
            >
              {t(category.name)}
            </span>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const category = categories.find(c => c.name === feature.category)
            return (
              <div
                key={index}
                className="relative group obsidian-card rounded-xl p-6 hover-lift ghost-border"
              >
                <div className={`inline-flex p-2.5 rounded-lg ${category.color} mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-on-surface">{t(feature.title)}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{t(feature.description)}</p>
                <div className="absolute top-5 right-5">
                  <span className={`font-label text-label-sm px-2.5 py-1 rounded-full ${category.color}`}>
                    {t(feature.category)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center space-y-5">
          <p className="text-on-surface-variant">
            {t('road.cta')}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="/discord" target="_blank" rel="noopener noreferrer">
                {t('road.ctaDiscord')}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                {t('road.ctaGithub')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
