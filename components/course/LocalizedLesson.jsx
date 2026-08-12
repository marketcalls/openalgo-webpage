"use client"

import { useLocalizedChapter } from "@/lib/content-i18n/useLocalizedChapter"
import { useI18n } from "@/components/i18n/LanguageProvider"

export function LocalizedLesson({ course, chapterN, html, toc, hasContent }) {
  const { t } = useI18n()
  const content = useLocalizedChapter(course, chapterN, { html, toc, hasContent })

  return content.hasContent ? (
    <div className="lesson" dangerouslySetInnerHTML={{ __html: content.html }} />
  ) : (
    <div className="callout info">
      <span className="callout-tag">{t("courseNav.note")}</span>
      <div>
        <p>{t("courseNav.chapterComingSoon")}</p>
      </div>
    </div>
  )
}
