"use client"

import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

import { useI18n } from "@/components/i18n/LanguageProvider"
import useLocalizedCourseMetadata from "@/lib/content-i18n/useLocalizedCourseMetadata"

const COURSE_KEYS = {
  stocks: "stocks",
  technicals: "technicals",
  fundamentals: "pyTraders",
  futures: "futures",
  "options-basics": "optBasics",
  "options-strategies": "optStrat",
  python: "algoPy",
  quant: "quant",
  "stats-arb": "statsArb",
  amibroker: "ami",
  taxation: "tax",
  "risk-management": "risk",
  "trading-psychology": "psych",
}

const LABELS = {
  hi: {
    chapters: "अध्याय",
    modules: "मॉड्यूल",
    start: "अध्याय 1 शुरू करें",
    browse: "सभी अध्याय देखें",
    module: "मॉड्यूल",
    chapter: "अध्याय",
    free: "मुफ़्त",
    selfPaced: "अपनी गति से",
    loading: "पाठ्यक्रम लोड हो रहा है…",
    disclaimer: "केवल शिक्षा के लिए — निवेश सलाह नहीं।",
  },
  ta: {
    chapters: "அத்தியாயங்கள்",
    modules: "தொகுதிகள்",
    start: "அத்தியாயம் 1-ஐ தொடங்குங்கள்",
    browse: "அனைத்து அத்தியாயங்களையும் பார்க்க",
    module: "தொகுதி",
    chapter: "அத்தியாயம்",
    free: "இலவசம்",
    selfPaced: "சுய வேகப் பயிற்சி",
    loading: "பாடத்திட்டம் ஏற்றப்படுகிறது…",
    disclaimer: "கல்விக்காக மட்டுமே — முதலீட்டு ஆலோசனை அல்ல.",
  },
  te: {
    chapters: "అధ్యాయాలు",
    modules: "మాడ్యూల్స్",
    start: "అధ్యాయం 1 ప్రారంభించండి",
    browse: "అన్ని అధ్యాయాలు చూడండి",
    module: "మాడ్యూల్",
    chapter: "అధ్యాయం",
    free: "ఉచితం",
    selfPaced: "మీ వేగంతో",
    loading: "పాఠ్యక్రమం లోడ్ అవుతోంది…",
    disclaimer: "విద్య కోసం మాత్రమే — పెట్టుబడి సలహా కాదు.",
  },
  ml: {
    chapters: "അധ്യായങ്ങൾ",
    modules: "മൊഡ്യൂളുകൾ",
    start: "അധ്യായം 1 ആരംഭിക്കുക",
    browse: "എല്ലാ അധ്യായങ്ങളും കാണുക",
    module: "മൊഡ്യൂൾ",
    chapter: "അധ്യായം",
    free: "സൗജന്യം",
    selfPaced: "സ്വന്തം വേഗത്തിൽ",
    loading: "പാഠ്യപദ്ധതി ലോഡ് ചെയ്യുന്നു…",
    disclaimer: "വിദ്യാഭ്യാസ ആവശ്യങ്ങൾക്ക് മാത്രം — നിക്ഷേപ ഉപദേശമല്ല.",
  },
}

export default function LocalizedCourseHome({
  course,
  parts,
  tagClass,
  children,
}) {
  const { lang, t } = useI18n()
  const { parts: localizedParts, loading } = useLocalizedCourseMetadata(course, parts)

  if (!LABELS[lang]) return children

  const labels = LABELS[lang]
  const courseKey = COURSE_KEYS[course]
  const chapters = localizedParts.flatMap((part) => part.chapters || [])
  const firstChapter = chapters[0]
  const title = t(`course.${courseKey}.title`)
  const blurb = t(`course.${courseKey}.blurb`)

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 obsidian-grid" aria-hidden="true" />
        <div
          className="glow-orb"
          style={{
            width: 420,
            height: 420,
            top: -120,
            right: -60,
            background: "hsl(220 100% 84% / 0.16)",
          }}
          aria-hidden="true"
        />
        <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
          <span className="reveal reveal-1 inline-flex items-center gap-2 rounded-full border border-border surface-low px-4 py-1.5 font-label text-xs tracking-wide text-on-surface-variant">
            <BookOpen className="h-3.5 w-3.5 text-tertiary" />
            {chapters.length} {labels.chapters} · {localizedParts.length} {labels.modules}
          </span>
          <h1 className="reveal reveal-2 mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
            {blurb}
          </p>
          <div className="reveal reveal-4 mt-8 flex flex-wrap gap-3">
            {firstChapter && (
              <Link
                href={`/${course}/${firstChapter.slug}`}
                className="inline-flex items-center gap-2 rounded-xl gradient-cta px-6 py-3 font-medium text-primary-foreground hover-lift"
              >
                {labels.start} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <a
              href="#modules"
              className="inline-flex items-center rounded-xl border border-border surface-low px-6 py-3 font-medium text-on-surface transition-colors hover:surface-container"
            >
              {labels.browse}
            </a>
          </div>
          <div className="reveal reveal-5 mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {[
              [String(chapters.length), labels.chapters],
              [String(localizedParts.length), labels.modules],
              ["100%", labels.free],
              ["∞", labels.selfPaced],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="text-3xl font-bold text-on-surface">{value}</div>
                <div className="font-label text-xs uppercase tracking-wider text-on-surface-variant/70">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="modules" className="px-6 py-14 sm:px-10 lg:px-14">
        {loading ? (
          <p className="text-on-surface-variant">{labels.loading}</p>
        ) : (
          localizedParts.map((part) => (
            <section key={part.id} className="mt-12 first:mt-0">
              <div className="flex items-baseline gap-3">
                <span className="font-label text-sm tracking-wide text-tertiary">
                  {labels.module} {part.id}
                </span>
                <h2 className="text-xl font-bold text-on-surface sm:text-2xl">
                  {part.name}
                </h2>
              </div>
              <p className="mb-5 mt-1 text-on-surface-variant">{part.desc}</p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {part.chapters.map((chapter) => (
                  <Link
                    key={chapter.n}
                    href={`/${course}/${chapter.slug}`}
                    prefetch={false}
                    className="group obsidian-card hover-lift ghost-border rounded-2xl p-5"
                  >
                    <div className="font-label text-xs text-on-surface-variant/70">
                      {labels.chapter} {String(chapter.n).padStart(2, "0")}
                    </div>
                    <h3 className="mt-1.5 text-base font-semibold text-on-surface transition-colors group-hover:text-tertiary">
                      {chapter.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                      {chapter.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {chapter.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`ex-tag tag-${tagClass?.[tag] || "idx"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
        <p className="mt-14 border-t border-border pt-6 text-center text-sm text-on-surface-variant/70">
          {labels.disclaimer}
        </p>
      </div>
    </div>
  )
}
