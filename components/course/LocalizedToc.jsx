"use client"

import { useLocalizedChapter } from "@/lib/content-i18n/useLocalizedChapter"
import { useI18n } from "@/components/i18n/LanguageProvider"

export function LocalizedToc({ course, chapterN, html, toc, hasContent }) {
  const { t } = useI18n()
  const content = useLocalizedChapter(course, chapterN, { html, toc, hasContent })

  if (!content.toc || content.toc.length === 0) return null

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-20">
        <div className="font-label text-xs uppercase tracking-[0.13em] text-on-surface-variant/70 mb-3">
          {t("courseNav.onThisPage")}
        </div>
        <nav>
          {content.toc.map((h) => (
            <a key={h.id} href={`#${h.id}`} className={`toc-link lvl-${h.level}`}>
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
