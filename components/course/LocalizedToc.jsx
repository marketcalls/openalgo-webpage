"use client"

import { useLocalizedChapter } from "@/lib/content-i18n/useLocalizedChapter"

export function LocalizedToc({ course, chapterN, html, toc, hasContent }) {
  const content = useLocalizedChapter(course, chapterN, { html, toc, hasContent })

  if (!content.toc || content.toc.length === 0) return null

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-20">
        <div className="font-label text-xs uppercase tracking-[0.13em] text-on-surface-variant/70 mb-3">
          On this page
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
