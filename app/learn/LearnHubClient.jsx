"use client"

import { ArrowRight, Github, GraduationCap, Target } from "lucide-react";
import Link from "next/link";

import { useI18n } from "@/components/i18n/LanguageProvider";

const COURSES = [
  { id: "stocks", n: 0, route: "/stocks", level: "beginner", color: "text-tertiary", ring: "hsl(140 72% 53% / 0.5)", grad: "from-tertiary via-secondary to-primary" },
  { id: "technicals", n: 1, route: "/technicals", level: "beginner", color: "text-tertiary", ring: "hsl(140 72% 53% / 0.5)", grad: "from-tertiary via-primary to-secondary" },
  { id: "pyTraders", n: 2, route: "/fundamentals", level: "beginner", color: "text-primary", ring: "hsl(267 100% 87% / 0.5)", grad: "from-primary via-secondary to-tertiary" },
  { id: "futures", n: 6, route: "/futures", level: "beginner", color: "text-tertiary", ring: "hsl(140 72% 53% / 0.5)", grad: "from-tertiary via-secondary to-primary" },
  { id: "optBasics", n: 7, route: "/options-basics", level: "beginner", color: "text-secondary", ring: "hsl(220 100% 84% / 0.5)", grad: "from-secondary via-primary to-tertiary" },
  { id: "optStrat", n: 8, route: "/options-strategies", level: "intermediate", color: "text-primary", ring: "hsl(267 100% 87% / 0.5)", grad: "from-primary via-tertiary to-secondary" },
  { id: "algoPy", n: 3, route: "/python", level: "intermediate", color: "text-secondary", ring: "hsl(220 100% 84% / 0.5)", grad: "from-secondary via-primary to-tertiary" },
  { id: "quant", n: 4, route: "/quant", level: "expert", color: "text-tertiary", ring: "hsl(140 72% 53% / 0.5)", grad: "from-tertiary via-secondary to-primary" },
  { id: "statsArb", n: 11, route: "/stats-arb", level: "expert", color: "text-secondary", ring: "hsl(190 85% 55% / 0.5)", grad: "from-secondary via-tertiary to-primary" },
  { id: "ami", n: 5, route: "/amibroker", level: "beginner", color: "text-secondary", ring: "hsl(190 85% 62% / 0.5)", grad: "from-secondary via-primary to-tertiary" },
  { id: "tax", n: 9, route: "/taxation", level: "beginner", color: "text-tertiary", ring: "hsl(140 72% 53% / 0.5)", grad: "from-tertiary via-secondary to-primary" },
  { id: "risk", n: 12, route: "/risk-management", level: "beginner", color: "text-tertiary", ring: "hsl(140 72% 53% / 0.5)", grad: "from-tertiary via-secondary to-primary" },
  { id: "psych", n: 13, route: "/trading-psychology", level: "beginner", color: "text-secondary", ring: "hsl(267 100% 87% / 0.5)", grad: "from-secondary via-primary to-tertiary" },
];

function PathSentence({ text, link }) {
  const parts = text.split("{c}");
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      {link}
      {parts[1]}
    </>
  );
}

export default function LearnHubClient({ counts, total }) {
  const { t } = useI18n();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 obsidian-grid" aria-hidden="true" />
        <div className="glow-orb" style={{ width: 420, height: 420, top: -120, right: -60, background: "hsl(267 100% 87% / 0.16)" }} aria-hidden="true" />
        <div className="glow-orb" style={{ width: 360, height: 360, bottom: -140, left: -80, background: "hsl(140 72% 53% / 0.14)" }} aria-hidden="true" />
        <div className="relative px-6 sm:px-10 lg:px-14 py-16 sm:py-20 max-w-5xl mx-auto text-center">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            {t('learn.badgeOpenSource')} &middot; {t('learn.badgeCourses')} &middot; {t('learn.chaptersCount').replace('{n}', String(total))}
          </span>
          <h1 className="reveal reveal-2 mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-on-surface">
            <span className="text-on-surface ">
              {t('learn.title')}
            </span>
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-2xl mx-auto text-lg text-on-surface-variant">
            {t('learn.desc')}
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/learn/mission"
              className="inline-flex items-center gap-2 rounded-xl border border-border surface-low px-5 py-2.5 font-medium text-on-surface hover:surface-container transition-colors"
            >
              <Target className="h-4 w-4 text-primary" />
              {t('learn.ourMission')}
            </Link>
            <a
              href="https://github.com/marketcalls/openalgo-webpage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border surface-low px-5 py-2.5 font-medium text-on-surface hover:surface-container transition-colors"
            >
              <Github className="h-4 w-4 text-secondary" />
              {t('learn.contributeGithub')}
            </a>
          </div>
        </div>
      </section>

      {/* Course ladder */}
      <div className="px-6 sm:px-10 lg:px-14 py-14 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{t('learn.choosePath')}</h2>
          <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant/70">{t('level.beginner')} &rarr; {t('level.expert')}</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <Link
              key={c.route}
              href={c.route}
              className="group obsidian-card hover-lift rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">{t(`level.${c.level}`)}</span>
                <span className="font-label text-xs text-on-surface-variant/70">{t('learn.chaptersCount').replace('{n}', String(counts[c.id]))}</span>
              </div>
              <h3 className="text-on-surface mt-3 text-2xl font-bold">
                {t(`course.${c.id}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant flex-1">{t(`course.${c.id}.blurb`)}</p>
              <ul className="mt-4 space-y-1.5">
                {[t(`course.${c.id}.p1`), t(`course.${c.id}.p2`), t(`course.${c.id}.p3`)].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className="mt-0.5 text-on-surface">&bull;</span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-5 inline-flex items-center gap-1.5 font-medium text-on-surface">
                {t('learn.startCourse')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recommended path */}
        <div className="mt-12 rounded-2xl border border-border surface-low p-6 sm:p-8">
          <h2 className="text-lg font-bold text-on-surface">{t('learn.pathTitle')}</h2>
          <p className="mt-2 text-on-surface-variant">
            {t('learn.pathIntro')}{" "}
            <PathSentence
              text={t('learn.pathNew')}
              link={<Link href="/stocks" className="text-tertiary hover:underline">{t('course.stocks.title')}</Link>}
            />{" "}
            <PathSentence
              text={t('learn.pathCharts')}
              link={<Link href="/technicals" className="text-tertiary hover:underline">{t('course.technicals.title')}</Link>}
            />{" "}
            <PathSentence
              text={t('learn.pathPython')}
              link={<Link href="/fundamentals" className="text-primary hover:underline">{t('course.pyTraders.title')}</Link>}
            />{" "}
            <PathSentence
              text={t('learn.pathAlgo')}
              link={<Link href="/python" className="text-secondary hover:underline">{t('course.algoPy.title')}</Link>}
            />{" "}
            <PathSentence
              text={t('learn.pathQuant')}
              link={<Link href="/quant" className="text-tertiary hover:underline">{t('course.quant.title')}</Link>}
            />{" "}
            <PathSentence
              text={t('learn.pathAfl')}
              link={<Link href="/amibroker" className="text-secondary hover:underline">{t('course.ami.title')}</Link>}
            />{" "}
            {t('learn.pathOutro')}
          </p>
          <p className="mt-6 border-t border-border pt-4 text-center text-sm text-on-surface-variant/70">
            {t('learn.disclaimer')}
          </p>
        </div>
      </div>
    </>
  );
}
