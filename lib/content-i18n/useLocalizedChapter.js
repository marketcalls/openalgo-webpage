"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n/LanguageProvider"

// Translated lesson payloads are generated into public/i18n/content and fetched
// as static assets. Keeping them out of the module graph prevents every
// course/locale HTML bundle from being embedded in the Cloudflare Worker.
export function useLocalizedChapter(course, chapterN, fallback) {
  const { lang } = useI18n()
  const [state, setState] = useState(fallback)

  useEffect(() => {
    const controller = new AbortController()
    setState(fallback)

    if (lang === "en") {
      return () => controller.abort()
    }

    fetch(
      `/i18n/content/${encodeURIComponent(course)}/${encodeURIComponent(lang)}.json`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        const chapter = data[String(chapterN)] || data[chapterN]
        if (chapter?.hasContent) {
          setState({
            html: chapter.html,
            toc: chapter.toc || [],
            hasContent: true,
          })
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") setState(fallback)
      })

    return () => controller.abort()
  }, [
    lang,
    course,
    chapterN,
    fallback.html,
    fallback.toc,
    fallback.hasContent,
  ])

  return state
}
