"use client"

import {
  ArrowLeft,
  ArrowRight,
  BellOff,
  Code2,
  Github,
  Layers,
  LineChart,
  RefreshCw,
  ShieldCheck,
  Sigma,
  Target,
  TrendingUp,
  Unlock,
} from "lucide-react";
import Link from "next/link";

import { useI18n } from "@/components/i18n/LanguageProvider";

const REPO = "https://github.com/marketcalls/openalgo-webpage";

const DIFFERENTIATORS = [
  { id: "d1", icon: Code2, color: "text-primary" },
  { id: "d2", icon: Unlock, color: "text-tertiary" },
  { id: "d3", icon: BellOff, color: "text-secondary" },
  { id: "d4", icon: RefreshCw, color: "text-primary" },
  { id: "d5", icon: LineChart, color: "text-tertiary" },
  { id: "d6", icon: Layers, color: "text-secondary" },
  { id: "d7", icon: Sigma, color: "text-primary" },
  { id: "d8", icon: ShieldCheck, color: "text-tertiary" },
  { id: "d9", icon: TrendingUp, color: "text-secondary" },
];

export default function MissionClient() {
  const { t } = useI18n();

  const h1Parts = t('mission.h1').split("{v}");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 obsidian-grid" aria-hidden="true" />
        <div className="glow-orb" style={{ width: 420, height: 420, top: -120, right: -60, background: "hsl(267 100% 87% / 0.16)" }} aria-hidden="true" />
        <div className="glow-orb" style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(140 72% 53% / 0.14)" }} aria-hidden="true" />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20 max-w-4xl mx-auto text-center">
          <Link
            href="/learn"
            className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant hover:surface-container transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
            {t('learn.title')}
          </Link>
          <h1 className="reveal reveal-2 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            {h1Parts[0]}
            <span className="text-on-surface ">
              {t('learn.title')}
            </span>
            {h1Parts[1]}
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl mx-auto text-lg text-on-surface-variant">
            {t('mission.heroDesc')}
          </p>
        </div>
      </section>

      {/* Mission intro */}
      <section className="px-6 sm:px-10 lg:px-14 py-14 max-w-3xl mx-auto">
        <p className="text-lg leading-relaxed text-on-surface-variant">
          {t('mission.intro1')}
        </p>
        <p className="mt-5 text-lg leading-relaxed text-on-surface-variant">
          <strong className="text-on-surface">{t('mission.intro2Strong')}</strong> {t('mission.intro2')}
        </p>
      </section>

      {/* What makes it different */}
      <section className="border-y border-border surface-low">
        <div className="px-6 sm:px-10 lg:px-14 py-14 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface text-center">
            {t('mission.diffTitle')}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-center text-on-surface-variant">
            {t('mission.diffSub')}
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.id} className="obsidian-card ghost-border rounded-2xl p-6">
                  <Icon className={`h-6 w-6 ${d.color}`} />
                  <h3 className="mt-4 text-lg font-bold text-on-surface">{t(`mission.${d.id}t`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{t(`mission.${d.id}b`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The goal */}
      <section className="px-6 sm:px-10 lg:px-14 py-16 max-w-3xl mx-auto text-center">
        <Target className="h-8 w-8 text-primary mx-auto" />
        <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-on-surface">{t('mission.goalTitle')}</h2>
        <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
          {t('mission.goalBody')}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl gradient-cta px-6 py-3 font-medium text-primary-foreground hover-lift"
          >
            <Github className="h-4 w-4" />
            {t('learn.contributeGithub')}
          </a>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-xl border border-border surface-low px-6 py-3 font-medium text-on-surface hover:surface-container transition-colors"
          >
            {t('mission.browseCourses')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-5 font-label text-xs uppercase tracking-wider text-on-surface-variant/70">
          {t('learn.badgeOpenSource')} &middot; {t('mission.noGatekeeping')} &middot; {t('mission.badgeUpdated')}
        </p>
      </section>
    </div>
  );
}
