"use client"

import { useLocalizedChapter } from "@/lib/content-i18n/useLocalizedChapter"

export function LocalizedLesson({ course, chapterN, html, toc, hasContent }) {
  const content = useLocalizedChapter(course, chapterN, { html, toc, hasContent })

  return content.hasContent ? (
    <div className="lesson" dangerouslySetInnerHTML={{ __html: content.html }} />
  ) : (
    <div className="callout info">
      <span className="callout-tag">Note</span>
      <div>
        <p>This chapter is being written and will appear here soon. In the meantime, start from the chapters already published in the sidebar.</p>
      </div>
    </div>
  )
}
