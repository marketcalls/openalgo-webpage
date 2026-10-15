"use client"

import Link from "next/link"

import { useI18n } from "@/components/i18n/LanguageProvider"
import PlaygroundLoader from "@/components/script/PlaygroundLoader"
import ScreenGallery from "@/components/script/ScreenGallery"
import ScreenImage from "@/components/script/ScreenImage"
import SearchButton from "@/components/script/SearchButton"
import { paint } from "@/components/script/StaticCode"
import { buttonVariants } from "@/components/ui/button"

const FEATURES = [
  {
    mark: "study()  strategy()",
    titleKey: "script.f1t",
    bodyKey: "script.f1d",
    wide: true,
    sample: ['study("EMA cross", overlay = true)', 'strategy("EMA cross, bracketed", capital = 500000)'],
  },
  {
    mark: "no eval",
    titleKey: "script.f2t",
    bodyKey: "script.f2d",
  },
  {
    mark: "diagnose()  hover()",
    titleKey: "script.f3t",
    bodyKey: "script.f3d",
  },
  {
    mark: "Backtest panel",
    titleKey: "script.f4t",
    bodyKey: "script.f4d",
    wide: true,
    stepKeys: ["script.f4s1", "script.f4s2", "script.f4s3", "script.f4s4"],
  },
  {
    mark: "analyzer mode",
    titleKey: "script.f5t",
    bodyKey: "script.f5d",
  },
  {
    mark: "alert()",
    titleKey: "script.f6t",
    bodyKey: "script.f6d",
  },
  {
    mark: "spec + 2 engines",
    titleKey: "script.f7t",
    bodyKey: "script.f7d",
  },
]

function Kicker({ children, id }) {
  return (
    <p id={id} className="font-label text-label-md uppercase text-on-surface-variant">
      {children}
    </p>
  )
}

export default function ScriptLandingClient({
  scriptVersion,
  scriptRepo,
  manualHref,
  manualNames,
  introHref,
  referenceHref,
  quickstartHref,
  basicsHref,
  screens,
  hero,
  heroId,
  libraries,
  sections,
  totalPages,
  readyCount,
}) {
  const { t } = useI18n()

  const docsSub =
    t("script.docs.sub1")
      .replace("{total}", totalPages)
      .replace("{sections}", sections.length) +
    (readyCount < totalPages ? t("script.docs.sub2").replace("{ready}", readyCount) : "") +
    "."

  return (
    <>
      {/* Hero: the language's name, its promise, and the editor itself */}
      <section className="px-4 pt-14 pb-16 md:pt-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
              <span className="osd-pill">v{scriptVersion}</span>
              <span className="osd-pill">Apache 2.0</span>
            </div>

            <h1 className="osd-hero-title">OpenScript</h1>
            <p className="mt-3 font-mono text-sm text-on-surface-variant">{t("script.hero.subtitle")}</p>

            <p className="osd-hero-tagline">
              {t("script.hero.tagline1")}
              <span className="block text-on-surface-variant/70">{t("script.hero.tagline2")}</span>
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              {t("script.hero.desc")}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href={introHref} className={buttonVariants({ size: "lg", className: "h-11 px-6" })}>
                {t("script.hero.ctaIntro")}
              </Link>
              <Link href={referenceHref} className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6" })}>
                {t("script.hero.ctaRef")}
              </Link>
              <Link href="/script/library" prefetch={false} className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6" })}>
                {t("script.hero.ctaLib")}
              </Link>
              <a
                href={scriptRepo}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "ghost", size: "lg", className: "h-11 px-5" })}
              >
                {t("script.hero.ctaGithub")}
              </a>
            </div>

            {basicsHref ? (
              <p className="osd-start">
                <span>{t("script.hero.newTo")}</span>{" "}
                <Link href={basicsHref} className="osd-start-link">
                  {t("script.hero.startBasics")}
                </Link>
              </p>
            ) : null}

            <div className="mt-6 flex justify-center">
              <SearchButton />
            </div>
          </div>

          <div className="osd-hero-stage">
            <div className="min-w-0">
              <PlaygroundLoader />
            </div>
            <div className="osd-hero-side">
              {hero ? (
                <div>
                  <p className="osd-side-label">{t("script.side.inTrading")}</p>
                  <ScreenImage
                    src={`/script/screens/${hero.file}`}
                    alt={hero.alt}
                    caption={heroId === "halftrend" ? t("script.side.halftrendCaption") : hero.caption}
                    eager
                  />
                </div>
              ) : null}
              <div>
                <p className="osd-side-label">{t("script.side.inPlayground")}</p>
                <ul className="osd-try">
                  <li>{t("script.try1")}</li>
                  <li>{t("script.try2")}</li>
                  <li>{t("script.try3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the language does */}
      <section className="border-t px-4 py-24" aria-labelledby="osd-features">
        <div className="container mx-auto">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Kicker>{t("script.feat.kicker")}</Kicker>
            <h2 id="osd-features" className="mt-4 text-display-md text-on-surface">
              {t("script.feat.title1")}
              <span className="block text-on-surface-variant/70">{t("script.feat.title2")}</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.titleKey} className={`obsidian-card osd-feature rounded-3xl p-6${f.wide ? " lg:col-span-2" : ""}`}>
                <p className="osd-feature-mark">{f.mark}</p>
                <h3 className="mt-4 text-lg font-bold text-on-surface">{t(f.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{t(f.bodyKey)}</p>
                {f.sample ? (
                  <div className="osd-feature-code" aria-hidden="true">
                    {f.sample.map((line) => (
                      <code key={line}>
                        {paint(line).map(([cls, text], i) => (cls ? <span key={i} className={cls}>{text}</span> : text))}
                      </code>
                    ))}
                  </div>
                ) : null}
                {f.stepKeys ? (
                  <ol className="osd-feature-steps">
                    {f.stepKeys.map((sk) => (
                      <li key={sk}>{t(sk)}</li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where it runs: the /trading page */}
      <section className="px-3 py-6 sm:px-6" aria-labelledby="osd-gallery">
        <div className="scheme-dark rounded-[2.5rem] px-4 py-20 sm:px-8 md:py-24">
          <div className="container mx-auto">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Kicker>{t("script.gallery.kicker")}</Kicker>
              <h2 id="osd-gallery" className="mt-4 text-display-md text-on-surface">
                {t("script.gallery.title")}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
                {t("script.gallery.desc")}
              </p>
            </div>
            <div className="mx-auto max-w-6xl">
              <ScreenGallery screens={screens} />
            </div>
          </div>
        </div>
      </section>

      {/* Two libraries */}
      <section className="px-4 py-24" aria-labelledby="osd-libraries">
        <div className="container mx-auto">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Kicker>{t("script.lib.kicker")}</Kicker>
            <h2 id="osd-libraries" className="mt-4 text-display-md text-on-surface">
              {t("script.lib.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
              {t("script.lib.desc")}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            {libraries.map((lib) => (
              <div key={lib.name} className="osd-lib">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-mono text-xl font-semibold text-on-surface">{lib.name}</h3>
                  <span className="osd-lib-reg">
                    {lib.registry} &middot; {t(lib.runtimeKey)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{t(lib.bodyKey)}</p>
                <div className="osd-lib-install">
                  <span aria-hidden="true">$</span>
                  <code>{lib.install}</code>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={lib.docHref} prefetch={false} className={buttonVariants({ size: "sm", className: "h-9 px-4" })}>
                    {t("script.lib.readGuide")}
                  </Link>
                  <a href={lib.registryHref} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", size: "sm", className: "h-9 px-4" })}>
                    {lib.registry}
                  </a>
                  <a href={scriptRepo} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "ghost", size: "sm", className: "h-9 px-4" })}>
                    {t("script.hero.ctaGithub")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The documentation, section by section */}
      <section id="docs" className="border-t px-4 py-24" aria-labelledby="osd-docs">
        <div className="container mx-auto">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <Kicker>{t("script.docs.kicker")}</Kicker>
            <h2 id="osd-docs" className="mt-4 text-display-md text-on-surface">
              {t("script.docs.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">{docsSub}</p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <div key={s.slug} className="obsidian-card osd-map-card rounded-3xl p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-bold text-on-surface">
                    {s.first ? (
                      <Link href={s.first} prefetch={false} className="osd-map-title">
                        {s.title}
                      </Link>
                    ) : (
                      s.title
                    )}
                  </h3>
                  <span className="osd-map-count">
                    {s.pages.length} {s.pages.length === 1 ? t("script.docs.page") : t("script.docs.pages")}
                  </span>
                </div>
                <ul className="osd-map-pages">
                  {s.pages.slice(0, 5).map((p) => (
                    <li key={p.slug}>
                      {p.ready ? (
                        <Link href={`/script/${s.slug}/${p.slug}`} prefetch={false}>
                          {p.title}
                        </Link>
                      ) : (
                        <span className="is-pending">{p.title}</span>
                      )}
                    </li>
                  ))}
                  {s.pages.length > 5 ? (
                    <li className="osd-map-more">{t("script.docs.more").replace("{n}", s.pages.length - 5)}</li>
                  ) : null}
                </ul>
                {s.ready === 0 ? <p className="osd-map-note">{t("script.docs.beingWritten")}</p> : null}
              </div>
            ))}
          </div>

          <div className="obsidian-card osd-manual-card mx-auto mt-6 flex max-w-6xl flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div>
              <h3 className="text-lg font-bold text-on-surface">
                <Link href={manualHref} className="osd-map-title">
                  {t("script.docs.manualTitle")}
                </Link>
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
                {t("script.docs.manualBody1").replace("{count}", manualNames)}{" "}
                <kbd className="osd-kbd">/</kbd> {t("script.docs.manualBody2")}
              </p>
            </div>
            <Link href={manualHref} className={buttonVariants({ size: "sm", className: "h-9 shrink-0 px-4" })}>
              {t("script.docs.manualCta")}
            </Link>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-on-surface-variant">
            {t("script.docs.aiLead")} <a className="osd-inline-link" href="/script/llms.txt">llms.txt</a>{" "}
            {t("script.docs.aiMid")}{" "}
            <a className="osd-inline-link" href="/script/openscript-reference.md">openscript-reference.md</a>{" "}
            {t("script.docs.aiEnd")}
          </p>
        </div>
      </section>

      {/* Close */}
      <section className="scheme-dark px-4 py-24 md:py-28">
        <div className="container mx-auto text-center">
          <h2 className="mx-auto max-w-3xl text-display-md text-on-surface">{t("script.cta.title")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-on-surface-variant">
            {t("script.cta.desc")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={quickstartHref} className={buttonVariants({ size: "lg", className: "h-11 px-6" })}>
              {t("script.cta.quickstart")}
            </Link>
            <Link href={referenceHref} className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6" })}>
              {t("script.cta.manual")}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
