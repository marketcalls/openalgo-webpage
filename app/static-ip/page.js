"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/LanguageProvider"
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
  const { t } = useI18n()

  const vpsProviders = [
    { name: "Vultr", type: "VPS", note: t('sip.srv.vultrNote') },
    { name: "DigitalOcean", type: "VPS", note: t('sip.srv.doNote') },
    { name: "Contabo", type: "VPS", note: t('sip.srv.contaboNote') },
    { name: "Hostinger", type: "VPS", note: t('sip.srv.hostingerNote') },
    { name: "Linode", type: "VPS", note: t('sip.srv.linodeNote') },
    { name: "OVH", type: "VPS", note: t('sip.srv.ovhNote') },
  ]

  const cloudProviders = [
    { name: "Amazon AWS", note: t('sip.srv.awsNote'), cost: t('sip.srv.awsCost'), detail: t('sip.srv.awsDetail') },
    { name: "Google Cloud", note: t('sip.srv.gcpNote'), cost: t('sip.srv.gcpCost'), detail: t('sip.srv.gcpDetail') },
    { name: "Microsoft Azure", note: t('sip.srv.azureNote'), cost: t('sip.srv.azureCost'), detail: t('sip.srv.azureDetail') },
    { name: "Oracle Cloud", note: t('sip.srv.oracleNote'), cost: t('sip.srv.oracleCost'), detail: t('sip.srv.oracleDetail'), free: true },
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
              {t('sip.hero.badge')}
            </span>
          </div>

          <h1 className="text-display-md sm:text-display-lg md:text-[4rem] leading-[1.1] mb-4 sm:mb-6 tracking-tight">
            <span className="block text-on-surface">{t('sip.hero.h1a')}</span>
            <span className="text-on-surface ">
              {t('sip.hero.h1b')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            {t('sip.hero.desc')}
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[t('sip.hero.tag1'), t('sip.hero.tag2'), t('sip.hero.tag3')].map(tag => (
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.s1.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.s1.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 ghost-border mb-8 sm:mb-10">
            <p className="text-base sm:text-lg leading-relaxed text-on-surface mb-4 sm:mb-6">
              {t('sip.s1.introA')}{" "}<strong className="text-primary">{t('sip.s1.introDate')}</strong>{t('sip.s1.introB')}
            </p>
            <div className="rounded-lg sm:rounded-xl surface-container p-4 sm:p-6 mb-6">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 sm:mb-4 uppercase tracking-wider">{t('sip.s1.keyRules')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  t('sip.s1.rule1'),
                  t('sip.s1.rule2'),
                  t('sip.s1.rule3'),
                  t('sip.s1.rule4'),
                  t('sip.s1.rule5'),
                  t('sip.s1.rule6'),
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
                <p className="font-semibold text-on-surface mb-2 text-sm sm:text-base">{t('sip.s1.txnTitle')}</p>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  {t('sip.s1.txnDesc')}
                  <strong className="text-on-surface"> {t('sip.s1.txnMandatory')}</strong>
                </p>
              </div>
              <div className="rounded-xl surface-container p-4 sm:p-5">
                <p className="font-semibold text-on-surface mb-2 text-sm sm:text-base">{t('sip.s1.nonTxnTitle')}</p>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  {t('sip.s1.nonTxnDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Who is a Tech-Savvy Trader */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('sip.tech.title')}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              {t('sip.tech.intro')}
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {[
                t('sip.tech.i1'),
                t('sip.tech.i2'),
                t('sip.tech.i3'),
                t('sip.tech.i4'),
                t('sip.tech.i5'),
                t('sip.tech.i6'),
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-tertiary mt-0.5 shrink-0" />
                  <span className="text-on-surface-variant">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant">
              {t('sip.tech.note')}
            </p>
          </div>

          {/* Broker Whitelisting */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-primary">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 shrink-0">
                <Key className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-2">{t('sip.wl.title')}</h3>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-3">
                  {t('sip.wl.p1')}
                </p>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                  {t('sip.wl.p2a')}{" "}<strong className="text-on-surface">{t('sip.wl.p2b')}</strong>{" "}{t('sip.wl.p2c')}{" "}<strong className="text-on-surface">{t('sip.wl.p2d')}</strong>{t('sip.wl.p2e')}
                </p>
                <div className="rounded-xl bg-destructive/5 p-4 border-l-4 border-l-destructive mt-3">
                  <p className="text-sm text-on-surface-variant">
                    <strong className="text-on-surface">{t('sip.wl.warnTitle')}</strong>{" "}{t('sip.wl.warnDesc')}
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
                {t('sip.video.badge')}
              </span>
            </div>
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.video.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.video.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl ghost-border overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/RhCzFg5FMmA"
                title={t('sip.video.iframeTitle')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="font-semibold text-sm sm:text-base text-on-surface">{t('sip.video.cardTitle')}</p>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  {t('sip.video.cardSub')}
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {t('sip.video.docs')}
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {t('sip.video.github')}
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.ways.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.ways.sub')}
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              {
                icon: Server,
                title: t('sip.ways.o1Title'),
                desc: t('sip.ways.o1Desc'),
                tag: t('sip.ways.o1Tag'),
                tagColor: "bg-tertiary/10 text-tertiary",
                items: [t('sip.ways.o1i1'), t('sip.ways.o1i2'), t('sip.ways.o1i3'), t('sip.ways.o1i4')]
              },
              {
                icon: Wifi,
                title: t('sip.ways.o2Title'),
                desc: t('sip.ways.o2Desc'),
                tag: t('sip.ways.o2Tag'),
                tagColor: "bg-secondary/10 text-secondary",
                items: [t('sip.ways.o2i1'), t('sip.ways.o2i2'), t('sip.ways.o2i3'), t('sip.ways.o2i4')]
              },
              {
                icon: Cloud,
                title: t('sip.ways.o3Title'),
                desc: t('sip.ways.o3Desc'),
                tag: t('sip.ways.o3Tag'),
                tagColor: "bg-primary/10 text-primary",
                items: [t('sip.ways.o3i1'), t('sip.ways.o3i2'), t('sip.ways.o3i3'), t('sip.ways.o3i4')]
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
              <strong className="text-on-surface">{t('sip.ways.checkTitle')}</strong>{" "}{t('sip.ways.checkA')}{" "}
              <a href="/ip" className="text-primary hover:underline">openalgo.in/ip</a>{" "}{t('sip.ways.checkB')}
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: VPS Providers */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.srv.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.srv.sub')}
            </p>
          </div>

          {/* Shared vs Dedicated */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border">
              <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-on-surface-variant" />
                {t('sip.srv.sharedTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-4">
                {t('sip.srv.sharedDesc')}
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                {[
                  { label: t('sip.srv.latency'), value: t('sip.srv.sharedLatency') },
                  { label: t('sip.srv.price'), value: t('sip.srv.sharedPrice') },
                  { label: t('sip.srv.bestFor'), value: t('sip.srv.sharedBest') },
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
                {t('sip.srv.dedTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-4">
                {t('sip.srv.dedDesc')}
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                {[
                  { label: t('sip.srv.latency'), value: t('sip.srv.dedLatency') },
                  { label: t('sip.srv.price'), value: t('sip.srv.dedPrice') },
                  { label: t('sip.srv.bestFor'), value: t('sip.srv.dedBest') },
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
              {t('sip.srv.vpsTitle')}
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
              {t('sip.srv.cloudTitle')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
              {cloudProviders.map(p => (
                <div key={p.name} className="obsidian-card rounded-lg sm:rounded-xl p-4 sm:p-5 ghost-border hover-lift">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-on-surface text-sm">{p.name}</p>
                    <span className={`font-label text-label-md px-2 py-0.5 rounded-full ${p.free ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>{p.cost}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-1">{p.note}</p>
                  <p className="text-xs text-on-surface-variant">{p.detail}</p>
                </div>
              ))}
            </div>

            <div className="obsidian-card rounded-xl p-5 sm:p-6 ghost-border border-l-4 border-l-primary">
              <h4 className="text-sm sm:text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {t('sip.srv.fwTitle')}
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                {t('sip.srv.fwP1a')}{" "}<strong className="text-on-surface">{t('sip.srv.fwP1b')}</strong>{" "}{t('sip.srv.fwP1c')}{" "}
                <code className="px-1 py-0.5 rounded surface-high text-xs">https://algo.yourdomain.com</code>{t('sip.srv.fwP1d')}
              </p>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                {t('sip.srv.fwP2')}
              </p>
              <div className="space-y-2 mb-4">
                {[
                  { provider: "AWS", term: t('sip.srv.fwAws') },
                  { provider: "Google Cloud", term: t('sip.srv.fwGcp') },
                  { provider: "Azure", term: t('sip.srv.fwAzure') },
                  { provider: "Oracle Cloud", term: t('sip.srv.fwOracle') },
                ].map(item => (
                  <div key={item.provider} className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-on-surface min-w-[110px] shrink-0">{item.provider}:</span>
                    <span className="text-on-surface-variant">{item.term}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {t('sip.srv.fwP3a')}{" "}<strong className="text-on-surface">{t('sip.srv.fwP3b')}</strong>{" "}{t('sip.srv.fwP3c')}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-tertiary/5 p-4 border-l-4 border-l-tertiary mb-6">
            <p className="text-sm text-on-surface-variant">
              <strong className="text-on-surface">{t('sip.srv.recTitle')}</strong>{" "}{t('sip.srv.recA')}{" "}
              <strong className="text-on-surface">{t('sip.srv.recB')}</strong>{" "}{t('sip.srv.recC')}{" "}
              <strong className="text-on-surface">{t('sip.srv.recD')}</strong>{" "}{t('sip.srv.recE')}
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Step by Step Setup */}
      <div className="py-12 sm:py-16 md:py-20 surface-low">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.setup.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.setup.sub')}
            </p>
          </div>

          <div className="space-y-4">
            <ExpandableCard title={t('sip.setup.s1Title')} icon={Globe} defaultOpen={true}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  {t('sip.setup.s1P1a')}{" "}<code className="px-1.5 py-0.5 rounded surface-high text-xs text-on-surface">.in</code>{" "}{t('sip.setup.s1P1b')}{" "}
                  <code className="px-1.5 py-0.5 rounded surface-high text-xs text-on-surface">.com</code>{" "}{t('sip.setup.s1P1c')}
                </p>
                <div className="rounded-lg sm:rounded-xl surface-container p-4">
                  <p className="text-sm"><strong className="text-on-surface">{t('sip.setup.s1ExTitle')}</strong>{" "}{t('sip.setup.s1ExDesc')}</p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('sip.setup.s2Title')} icon={ShieldCheck}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  {t('sip.setup.s2P1')}
                </p>
                <div className="space-y-3">
                  {[
                    t('sip.setup.s2Step1'),
                    t('sip.setup.s2Step2'),
                    t('sip.setup.s2Step3'),
                    t('sip.setup.s2Step4'),
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">{i + 1}</div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-tertiary/5 p-4 border-l-4 border-l-tertiary">
                  <p className="text-sm">
                    <strong className="text-on-surface">{t('sip.setup.s2WhyTitle')}</strong>{" "}{t('sip.setup.s2WhyDesc')}
                  </p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('sip.setup.s3Title')} icon={Server}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  {t('sip.setup.s3P1')}
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { label: t('sip.setup.s3L1'), value: t('sip.setup.s3V1') },
                    { label: t('sip.setup.s3L2'), value: t('sip.setup.s3V2') },
                    { label: t('sip.setup.s3L3'), value: t('sip.setup.s3V3') },
                  ].map(item => (
                    <div key={item.label} className="rounded-lg surface-container p-3">
                      <p className="font-label text-label-md text-primary">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm">
                  {t('sip.setup.s3P2')}
                </p>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('sip.setup.s4Title')} icon={Key}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  {t('sip.setup.s4P1')}
                </p>
                <div className="rounded-lg sm:rounded-xl surface-container p-4">
                  <p className="text-sm">
                    <strong className="text-on-surface">{t('sip.setup.s4NoteTitle')}</strong>{" "}{t('sip.setup.s4NoteDesc')}
                  </p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('sip.setup.s5Title')} icon={Terminal}>
              <div className="space-y-4 text-on-surface-variant">
                <p>{t('sip.setup.s5P1')}</p>
                <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto space-y-2">
                  <p className="text-on-surface-variant"># Connect to your server</p>
                  <p className="text-primary">ssh root@your-server-ip</p>
                  <p className="text-on-surface-variant mt-3"># Download and run the installer</p>
                  <p className="text-primary">mkdir openalgo-install && cd openalgo-install && curl -O https://raw.githubusercontent.com/marketcalls/openalgo/main/installation/install.sh && chmod +x install.sh</p>
                  <p className="text-primary">sudo ./install.sh</p>
                </div>
                <p className="text-sm">{t('sip.setup.s5P2')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    t('sip.setup.s5i1'),
                    t('sip.setup.s5i2'),
                    t('sip.setup.s5i3'),
                    t('sip.setup.s5i4'),
                    t('sip.setup.s5i5'),
                    t('sip.setup.s5i6'),
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tertiary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
                  <p className="text-sm">
                    <strong className="text-on-surface">{t('sip.setup.s5MultiTitle')}</strong>{" "}{t('sip.setup.s5MultiA')}{" "}
                    <code className="px-1 py-0.5 rounded surface-high text-xs">install/install-multi.sh</code>{" "}{t('sip.setup.s5MultiB')}
                  </p>
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t('sip.setup.s6Title')} icon={CheckCircle2}>
              <div className="space-y-4 text-on-surface-variant">
                <p>
                  {t('sip.setup.s6P1')}
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.arch.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.arch.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            {/* Architecture Flow */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { label: t('sip.arch.f1L'), sub: t('sip.arch.f1S'), color: "bg-secondary/10 text-secondary" },
                { label: "Cloudflare", sub: t('sip.arch.f2S'), color: "bg-tertiary/10 text-tertiary" },
                { label: "Nginx", sub: t('sip.arch.f3S'), color: "bg-primary/10 text-primary" },
                { label: "OpenAlgo", sub: t('sip.arch.f4S'), color: "bg-secondary/10 text-secondary" },
                { label: t('sip.arch.f5L'), sub: t('sip.arch.f5S'), color: "bg-tertiary/10 text-tertiary" },
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
                { icon: Shield, title: t('sip.arch.c1T'), desc: t('sip.arch.c1D') },
                { icon: Settings, title: "Nginx", desc: t('sip.arch.c2D') },
                { icon: Lock, title: "Let's Encrypt", desc: t('sip.arch.c3D') },
                { icon: RefreshCw, title: t('sip.arch.c4T'), desc: t('sip.arch.c4D') },
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
              {t('sip.arch.sigTitle')}
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              {t('sip.arch.sigDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {[
                { label: t('sip.arch.sig1L'), sub: t('sip.arch.sig1S') },
                { label: t('sip.arch.sig2L'), sub: t('sip.arch.sig2S') },
                { label: t('sip.arch.sig3L'), sub: t('sip.arch.sig3S') },
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.up.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.up.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4">{t('sip.up.stepsTitle')}</h3>
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
                <strong className="text-on-surface">{t('sip.up.noteTitle')}</strong>{" "}{t('sip.up.noteDesc')}
              </p>
            </div>
          </div>

          {/* Useful Commands */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4">{t('sip.up.cmdTitle')}</h3>
            <div className="space-y-3">
              {[
                { cmd: "sudo systemctl status openalgo-*", desc: t('sip.up.cmd1') },
                { cmd: "sudo systemctl restart openalgo-*", desc: t('sip.up.cmd2') },
                { cmd: "sudo ufw status", desc: t('sip.up.cmd3') },
                { cmd: "htop", desc: t('sip.up.cmd4') },
                { cmd: "df -h", desc: t('sip.up.cmd5') },
                { cmd: "free -m", desc: t('sip.up.cmd6') },
                { cmd: "nproc", desc: t('sip.up.cmd7') },
              ].map(item => (
                <div key={item.cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <code className="px-2 py-1 rounded surface-container text-xs font-mono text-primary shrink-0">{item.cmd}</code>
                  <span className="text-xs sm:text-sm text-on-surface-variant">{item.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-tertiary/5 p-4 border-l-4 border-l-tertiary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">{t('sip.up.tipTitle')}</strong>{" "}{t('sip.up.tipA')}{" "}
                <code className="px-1 py-0.5 rounded surface-high text-xs">ssh -o ServerAliveInterval=60 root@your-ip</code>{" "}
                {t('sip.up.tipB')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Security */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.sec.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.sec.sub')}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: t('sip.sec.t1'),
                desc: t('sip.sec.d1'),
              },
              {
                icon: Lock,
                title: t('sip.sec.t2'),
                desc: t('sip.sec.d2'),
              },
              {
                icon: Shield,
                title: t('sip.sec.t3'),
                desc: t('sip.sec.d3'),
              },
              {
                icon: Settings,
                title: t('sip.sec.t4'),
                desc: t('sip.sec.d4'),
              },
              {
                icon: RefreshCw,
                title: t('sip.sec.t5'),
                desc: t('sip.sec.d5'),
              },
              {
                icon: Key,
                title: t('sip.sec.t6'),
                desc: t('sip.sec.d6'),
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.lat.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.lat.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4">{t('sip.lat.journeyTitle')}</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              {t('sip.lat.journeyDesc')}
            </p>

            <div className="space-y-3 mb-6">
              {[
                { from: t('sip.lat.h1From'), to: t('sip.lat.h1To'), time: "~20ms", note: t('sip.lat.h1Note') },
                { from: t('sip.lat.h2From'), to: "", time: t('sip.lat.h2Time'), note: t('sip.lat.h2Note') },
                { from: t('sip.lat.h3From'), to: t('sip.lat.h3To'), time: t('sip.lat.h3Time'), note: t('sip.lat.h3Note') },
                { from: t('sip.lat.h4From'), to: t('sip.lat.h4To'), time: t('sip.lat.h4Time'), note: t('sip.lat.h4Note') },
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
              <p className="font-label text-label-lg text-on-surface-variant uppercase tracking-wider mb-2">{t('sip.lat.typTitle')}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{t('sip.lat.typ1')}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{t('sip.lat.typ1Sub')}</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-secondary">{t('sip.lat.typ2')}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{t('sip.lat.typ2Sub')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 p-4 border-l-4 border-l-primary">
              <p className="text-sm text-on-surface-variant">
                <strong className="text-on-surface">{t('sip.lat.measureTitle')}</strong>{" "}{t('sip.lat.measureDesc')}
              </p>
            </div>
          </div>

          {/* Cloudflare Latency Myth */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-tertiary mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3">{t('sip.lat.cfTitle')}</h3>
            <p className="text-sm text-on-surface-variant mb-3">
              <strong className="text-on-surface">{t('sip.lat.cfNo')}</strong>{" "}{t('sip.lat.cfP1')}
            </p>
            <p className="text-sm text-on-surface-variant">
              {t('sip.lat.cfP2')}
            </p>
          </div>

          {/* Live vs Analyzer Mode */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4">{t('sip.lat.modeTitle')}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl surface-container p-4">
                <p className="font-semibold text-sm text-on-surface mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-tertiary" /> {t('sip.lat.liveTitle')}
                </p>
                <p className="text-xs text-on-surface-variant mb-3">
                  {t('sip.lat.liveDesc')}
                </p>
                <p className="font-label text-label-lg text-tertiary">{t('sip.lat.liveTime')}</p>
              </div>
              <div className="rounded-xl surface-container p-4">
                <p className="font-semibold text-sm text-on-surface mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" /> {t('sip.lat.anaTitle')}
                </p>
                <p className="text-xs text-on-surface-variant mb-3">
                  {t('sip.lat.anaDesc')}
                </p>
                <p className="font-label text-label-lg text-secondary">{t('sip.lat.anaTime')}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-4">
              {t('sip.lat.modeNote')}
            </p>
          </div>
        </div>
      </div>

      {/* Section 9: Desktop Users */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.desk.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.desk.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
              {t('sip.desk.intro')}
            </p>

            <div className="space-y-4 mb-6">
              {[
                { step: t('sip.desk.d1S'), desc: t('sip.desk.d1D') },
                { step: t('sip.desk.d2S'), desc: t('sip.desk.d2D') },
                { step: t('sip.desk.d3S'), desc: t('sip.desk.d3D') },
                { step: t('sip.desk.d4S'), desc: t('sip.desk.d4D') },
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
                <strong className="text-on-surface">{t('sip.desk.impTitle')}</strong>{" "}{t('sip.desk.impDesc')}
              </p>
            </div>
          </div>

          {/* Multi-account */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-secondary mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
              {t('sip.multi.title')}
            </h3>
            <p className="text-sm text-on-surface-variant mb-3">
              {t('sip.multi.desc')}
            </p>
            <div className="rounded-lg surface-container p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
              <p className="text-primary">sudo ./install/install-multi.sh</p>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              {t('sip.multi.note')}
            </p>
          </div>

          {/* Static IP Family Sharing */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border mb-8 sm:mb-10">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('sip.fam.title')}
            </h3>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4">
              {t('sip.fam.introA')}{" "}<strong className="text-on-surface">{t('sip.fam.introB')}</strong>{t('sip.fam.introC')}{" "}
              <strong className="text-on-surface">{t('sip.fam.introD')}</strong>.
            </p>

            <div className="rounded-lg sm:rounded-xl surface-container p-4 sm:p-6 mb-5">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 uppercase tracking-wider">{t('sip.fam.eligTitle')}</p>
              <div className="space-y-2 mb-4">
                {[
                  t('sip.fam.e1'),
                  t('sip.fam.e2'),
                  t('sip.fam.e3'),
                  t('sip.fam.e4'),
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary mt-0.5 shrink-0" />
                    <span className="text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-destructive/5 p-3 border-l-4 border-l-destructive">
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  <strong className="text-on-surface">{t('sip.fam.notEligTitle')}</strong>{" "}{t('sip.fam.notEligDesc')}
                </p>
              </div>
            </div>

            <div className="mb-5">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 uppercase tracking-wider">{t('sip.fam.procTitle')}</p>
              <p className="text-sm text-on-surface-variant mb-4">
                {t('sip.fam.procDesc')}
              </p>
              <div className="space-y-3">
                {[
                  { step: t('sip.fam.p1S'), desc: t('sip.fam.p1D') },
                  { step: t('sip.fam.p2S'), desc: t('sip.fam.p2D') },
                  { step: t('sip.fam.p3S'), desc: t('sip.fam.p3D') },
                  { step: t('sip.fam.p4S'), desc: t('sip.fam.p4D') },
                  { step: t('sip.fam.p5S'), desc: t('sip.fam.p5D') },
                  { step: t('sip.fam.p6S'), desc: t('sip.fam.p6D') },
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
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 uppercase tracking-wider">{t('sip.fam.chkTitle')}</p>
              <p className="text-sm text-on-surface-variant mb-3">
                {t('sip.fam.chkDesc')}
              </p>
              <div className="space-y-2">
                {[
                  t('sip.fam.c1'),
                  t('sip.fam.c2'),
                  t('sip.fam.c3'),
                  t('sip.fam.c4'),
                  t('sip.fam.c5'),
                  t('sip.fam.c6'),
                  t('sip.fam.c7'),
                  t('sip.fam.c8'),
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-xs sm:text-sm">
                    <div className="w-4 h-4 rounded border border-outline-variant/40 mt-0.5 shrink-0" />
                    <span className="text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="font-label text-label-md sm:text-label-lg text-primary mb-3 uppercase tracking-wider">{t('sip.fam.decTitle')}</p>
              <p className="text-sm text-on-surface-variant mb-3">
                {t('sip.fam.decDesc')}
              </p>
              <div className="space-y-2">
                {[
                  t('sip.fam.dc1'),
                  t('sip.fam.dc2'),
                  t('sip.fam.dc3'),
                  t('sip.fam.dc4'),
                  t('sip.fam.dc5'),
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
                <strong className="text-on-surface">{t('sip.fam.impTitle')}</strong>{" "}{t('sip.fam.impDesc')}
              </p>
            </div>
          </div>

          {/* Broker Policies & Restrictions */}
          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border border-l-4 border-l-primary">
            <h3 className="text-base sm:text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('sip.pol.title')}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              {t('sip.pol.desc')}
            </p>
            <div className="space-y-3">
              {[
                { title: t('sip.pol.p1T'), desc: t('sip.pol.p1D') },
                { title: t('sip.pol.p2T'), desc: t('sip.pol.p2D') },
                { title: t('sip.pol.p3T'), desc: t('sip.pol.p3D') },
                { title: t('sip.pol.p4T'), desc: t('sip.pol.p4D') },
                { title: t('sip.pol.p5T'), desc: t('sip.pol.p5D') },
                { title: t('sip.pol.p6T'), desc: t('sip.pol.p6D') },
                { title: t('sip.pol.p7T'), desc: t('sip.pol.p7D') },
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.faq.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.faq.sub')}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: t('sip.faq.q1'), a: t('sip.faq.a1') },
              { q: t('sip.faq.q2'), a: t('sip.faq.a2') },
              { q: t('sip.faq.q3'), a: t('sip.faq.a3') },
              { q: t('sip.faq.q4'), a: t('sip.faq.a4') },
              { q: t('sip.faq.q5'), a: t('sip.faq.a5') },
              { q: t('sip.faq.q6'), a: t('sip.faq.a6') },
              { q: t('sip.faq.q7'), a: t('sip.faq.a7') },
              { q: t('sip.faq.q8'), a: t('sip.faq.a8') },
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
            <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.cost.title')}</h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              {t('sip.cost.sub')}
            </p>
          </div>

          <div className="obsidian-card rounded-xl sm:rounded-2xl p-5 sm:p-8 ghost-border">
            <div className="space-y-4">
              {[
                { item: t('sip.cost.r1I'), cost: t('sip.cost.r1C'), note: t('sip.cost.r1N') },
                { item: "Cloudflare", cost: t('sip.cost.free'), note: t('sip.cost.r2N') },
                { item: t('sip.cost.r3I'), cost: t('sip.cost.r3C'), note: t('sip.cost.r3N') },
                { item: t('sip.cost.r4I'), cost: t('sip.cost.r4C'), note: t('sip.cost.r4N') },
                { item: t('sip.cost.r5I'), cost: t('sip.cost.free'), note: t('sip.cost.r5N') },
                { item: "OpenAlgo", cost: t('sip.cost.r6C'), note: t('sip.cost.r6N') },
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
                <strong className="text-on-surface">{t('sip.cost.totTitle')}</strong>{" "}{t('sip.cost.totA')}{" "}
                <strong className="text-primary">{t('sip.cost.totB')}</strong>{" "}{t('sip.cost.totC')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 sm:py-20 md:py-24">
        <div className="container max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-headline-lg sm:text-display-sm mb-3 sm:mb-4 text-on-surface">{t('sip.cta.title')}</h2>
          <p className="text-base sm:text-lg text-on-surface-variant mb-8 sm:mb-10">
            {t('sip.cta.sub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="https://docs.openalgo.in/getting-started" target="_blank" rel="noopener noreferrer">
                {t('sip.cta.docs')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/marketcalls/openalgo" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {t('sip.cta.source')}
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/discord">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('sip.cta.community')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
