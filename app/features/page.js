"use client"

import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  Code2, GitBranch, Users, Lock, Zap, Database, Globe, LineChart,
  Bot, Package, Github, Network, Link2, FileSpreadsheet, SplitSquareHorizontal,
  MessageCircle, LayoutDashboard, Terminal, Webhook, Activity,
  BarChart3, Gauge, FileJson, Brain, Search, Clock, GitMerge, Key, ShieldCheck,
  AlertCircle, User, Mail, Smartphone, History, Container,
  Wand2, Layers, Target, Box, Sigma, PieChart, Wallet, Waves, ArrowLeftRight
} from "lucide-react"

// `category` is a stable internal id used for color lookup; display strings
// come from the i18n keys (feat.*) resolved at render time.
const features = [
  { titleKey: "feat.f1t", descKey: "feat.f1d", icon: Wand2, category: "Options Analytics" },
  { titleKey: "feat.f2t", descKey: "feat.f2d", icon: Box, category: "Options Analytics" },
  { titleKey: "feat.f3t", descKey: "feat.f3d", icon: Layers, category: "Options Analytics" },
  { titleKey: "feat.f4t", descKey: "feat.f4d", icon: Gauge, category: "Options Analytics" },
  { titleKey: "feat.f5t", descKey: "feat.f5d", icon: Activity, category: "Options Analytics" },
  { titleKey: "feat.f6t", descKey: "feat.f6d", icon: BarChart3, category: "Options Analytics" },
  { titleKey: "feat.f7t", descKey: "feat.f7d", icon: Target, category: "Options Analytics" },
  { titleKey: "feat.f8t", descKey: "feat.f8d", icon: LineChart, category: "Options Analytics" },
  { titleKey: "feat.f9t", descKey: "feat.f9d", icon: BarChart3, category: "Options Analytics" },
  { titleKey: "feat.f10t", descKey: "feat.f10d", icon: Box, category: "Options Analytics" },
  { titleKey: "feat.f11t", descKey: "feat.f11d", icon: Sigma, category: "Options Analytics" },
  { titleKey: "feat.f12t", descKey: "feat.f12d", icon: Waves, category: "Options Analytics" },
  { titleKey: "feat.f13t", descKey: "feat.f13d", icon: PieChart, category: "Options Analytics" },
  { titleKey: "feat.f14t", descKey: "feat.f14d", icon: Wallet, category: "Options Analytics" },
  { titleKey: "feat.f15t", descKey: "feat.f15d", icon: ArrowLeftRight, category: "Options Analytics" },
  { titleKey: "feat.f16t", descKey: "feat.f16d", icon: Brain, category: "Order Management" },
  { titleKey: "feat.f17t", descKey: "feat.f17d", icon: Package, category: "Order Management" },
  { titleKey: "feat.f18t", descKey: "feat.f18d", icon: FileJson, category: "Order Management" },
  { titleKey: "feat.f19t", descKey: "feat.f19d", icon: SplitSquareHorizontal, category: "Order Management" },
  { titleKey: "feat.f20t", descKey: "feat.f20d", icon: Package, category: "Order Management" },
  { titleKey: "feat.f21t", descKey: "feat.f21d", icon: ShieldCheck, category: "Order Management" },
  { titleKey: "feat.f22t", descKey: "feat.f22d", icon: Wallet, category: "Analytics" },
  { titleKey: "feat.f23t", descKey: "feat.f23d", icon: Search, category: "Testing & Debug" },
  { titleKey: "feat.f24t", descKey: "feat.f24d", icon: GitMerge, category: "Strategy Execution" },
  { titleKey: "feat.f25t", descKey: "feat.f25d", icon: Code2, category: "Strategy Execution" },
  { titleKey: "feat.f26t", descKey: "feat.f26d", icon: Brain, category: "Strategy Execution" },
  { titleKey: "feat.f27t", descKey: "feat.f27d", icon: MessageCircle, category: "Integration" },
  { titleKey: "feat.f28t", descKey: "feat.f28d", icon: Webhook, category: "Integration" },
  { titleKey: "feat.f29t", descKey: "feat.f29d", icon: LineChart, category: "Integration" },
  { titleKey: "feat.f30t", descKey: "feat.f30d", icon: LineChart, category: "Integration" },
  { titleKey: "feat.f31t", descKey: "feat.f31d", icon: LineChart, category: "Integration" },
  { titleKey: "feat.f32t", descKey: "feat.f32d", icon: Link2, category: "Integration" },
  { titleKey: "feat.f33t", descKey: "feat.f33d", icon: Network, category: "Integration" },
  { titleKey: "feat.f34t", descKey: "feat.f34d", icon: Bot, category: "Integration" },
  { titleKey: "feat.f35t", descKey: "feat.f35d", icon: Wand2, category: "AI & Skills" },
  { titleKey: "feat.f36t", descKey: "feat.f36d", icon: Brain, category: "AI & Skills" },
  { titleKey: "feat.f37t", descKey: "feat.f37d", icon: Terminal, category: "AI & Skills" },
  { titleKey: "feat.f38t", descKey: "feat.f38d", icon: Globe, category: "API Infrastructure" },
  { titleKey: "feat.f39t", descKey: "feat.f39d", icon: Terminal, category: "API Infrastructure" },
  { titleKey: "feat.f40t", descKey: "feat.f40d", icon: Globe, category: "Data Management" },
  { titleKey: "feat.f41t", descKey: "feat.f41d", icon: Search, category: "Data Management" },
  { titleKey: "feat.f42t", descKey: "feat.f42d", icon: Database, category: "Data Management" },
  { titleKey: "feat.f43t", descKey: "feat.f43d", icon: History, category: "Data Management" },
  { titleKey: "feat.f44t", descKey: "feat.f44d", icon: Activity, category: "Analytics" },
  { titleKey: "feat.f45t", descKey: "feat.f45d", icon: Clock, category: "Analytics" },
  { titleKey: "feat.f46t", descKey: "feat.f46d", icon: LayoutDashboard, category: "Analytics" },
  { titleKey: "feat.f47t", descKey: "feat.f47d", icon: FileJson, category: "Analytics" },
  { titleKey: "feat.f48t", descKey: "feat.f48d", icon: Activity, category: "Real-Time Data" },
  { titleKey: "feat.f49t", descKey: "feat.f49d", icon: BarChart3, category: "Real-Time Data" },
  { titleKey: "feat.f50t", descKey: "feat.f50d", icon: Zap, category: "Real-Time Data" },
  { titleKey: "feat.f51t", descKey: "feat.f51d", icon: Zap, category: "Real-Time Data" },
  { titleKey: "feat.f52t", descKey: "feat.f52d", icon: GitBranch, category: "Real-Time Data" },
  { titleKey: "feat.f53t", descKey: "feat.f53d", icon: Smartphone, category: "Security" },
  { titleKey: "feat.f54t", descKey: "feat.f54d", icon: Key, category: "Security" },
  { titleKey: "feat.f55t", descKey: "feat.f55d", icon: Mail, category: "Security" },
  { titleKey: "feat.f56t", descKey: "feat.f56d", icon: ShieldCheck, category: "Security" },
  { titleKey: "feat.f57t", descKey: "feat.f57d", icon: Lock, category: "Security" },
  { titleKey: "feat.f58t", descKey: "feat.f58d", icon: ShieldCheck, category: "Security" },
  { titleKey: "feat.f59t", descKey: "feat.f59d", icon: User, category: "User Management" },
  { titleKey: "feat.f60t", descKey: "feat.f60d", icon: Key, category: "User Management" },
  { titleKey: "feat.f61t", descKey: "feat.f61d", icon: Code2, category: "Developer Tools" },
  { titleKey: "feat.f62t", descKey: "feat.f62d", icon: FileSpreadsheet, category: "Developer Tools" },
  { titleKey: "feat.f63t", descKey: "feat.f63d", icon: Package, category: "Developer Tools" },
  { titleKey: "feat.f64t", descKey: "feat.f64d", icon: Package, category: "Infrastructure" },
  { titleKey: "feat.f65t", descKey: "feat.f65d", icon: Container, category: "Infrastructure" },
  { titleKey: "feat.f66t", descKey: "feat.f66d", icon: Network, category: "Infrastructure" },
  { titleKey: "feat.f67t", descKey: "feat.f67d", icon: GitBranch, category: "Infrastructure" },
  { titleKey: "feat.f68t", descKey: "feat.f68d", icon: Key, category: "Infrastructure" },
  { titleKey: "feat.f69t", descKey: "feat.f69d", icon: Activity, category: "Infrastructure" },
  { titleKey: "feat.f70t", descKey: "feat.f70d", icon: AlertCircle, category: "Infrastructure" },
  { titleKey: "feat.f71t", descKey: "feat.f71d", icon: Database, category: "Infrastructure" },
  { titleKey: "feat.f72t", descKey: "feat.f72d", icon: MessageCircle, category: "Community" },
  { titleKey: "feat.f73t", descKey: "feat.f73d", icon: Bot, category: "Community" },
  { titleKey: "feat.f74t", descKey: "feat.f74d", icon: Users, category: "Community" },
  { titleKey: "feat.f75t", descKey: "feat.f75d", icon: Github, category: "Community" }
]

const categories = [
  { name: "Options Analytics", nameKey: "feat.cat.optionsAnalytics", color: "text-primary bg-primary/10" },
  { name: "AI & Skills", nameKey: "feat.cat.aiSkills", color: "text-tertiary bg-tertiary/10" },
  { name: "Order Management", nameKey: "feat.cat.orderManagement", color: "text-primary bg-primary/10" },
  { name: "Strategy Execution", nameKey: "feat.cat.strategyExecution", color: "text-secondary bg-secondary/10" },
  { name: "Real-Time Data", nameKey: "feat.cat.realTimeData", color: "text-tertiary bg-tertiary/10" },
  { name: "API Infrastructure", nameKey: "feat.cat.apiInfrastructure", color: "text-secondary bg-secondary/10" },
  { name: "Testing & Debug", nameKey: "feat.cat.testingDebug", color: "text-primary bg-primary/10" },
  { name: "Integration", nameKey: "feat.cat.integration", color: "text-secondary bg-secondary/10" },
  { name: "Analytics", nameKey: "feat.cat.analytics", color: "text-tertiary bg-tertiary/10" },
  { name: "Developer Tools", nameKey: "feat.cat.developerTools", color: "text-secondary bg-secondary/10" },
  { name: "Infrastructure", nameKey: "feat.cat.infrastructure", color: "text-tertiary bg-tertiary/10" },
  { name: "Data Management", nameKey: "feat.cat.dataManagement", color: "text-primary bg-primary/10" },
  { name: "User Management", nameKey: "feat.cat.userManagement", color: "text-secondary bg-secondary/10" },
  { name: "Community", nameKey: "feat.cat.community", color: "text-tertiary bg-tertiary/10" },
  { name: "Security", nameKey: "feat.cat.security", color: "text-primary bg-primary/10" }
]

export default function FeaturesPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen">
      <div className="container max-w-7xl py-16">
        <div className="space-y-10">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-display-md text-on-surface">
              {t('feat.title')}
            </h1>
            <p className="text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
              {t('feat.desc')}
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <span
                key={category.name}
                className={`px-3 py-1.5 rounded-full font-label text-label-md ${category.color}`}
              >
                {t(category.nameKey)}
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
                  <div className={`inline-flex p-2.5 rounded-lg ${category?.color} mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-on-surface">{t(feature.titleKey)}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{t(feature.descKey)}</p>
                  <div className="absolute top-5 right-5">
                    <span className={`font-label text-label-sm px-2.5 py-1 rounded-full ${category?.color}`}>
                      {category ? t(category.nameKey) : feature.category}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
