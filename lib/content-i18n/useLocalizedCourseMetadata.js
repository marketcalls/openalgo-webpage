"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n/LanguageProvider"

const payloadCache = new Map()

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isValidChapter(chapter) {
  return (
    isRecord(chapter) &&
    Number.isInteger(chapter.n) &&
    chapter.n > 0 &&
    typeof chapter.slug === "string" &&
    chapter.slug.trim().length > 0 &&
    typeof chapter.title === "string" &&
    typeof chapter.summary === "string" &&
    isStringArray(chapter.learn) &&
    isStringArray(chapter.tags)
  )
}

function isValidPart(part) {
  return (
    isRecord(part) &&
    (typeof part.id === "string" || Number.isInteger(part.id)) &&
    typeof part.name === "string" &&
    typeof part.desc === "string" &&
    Array.isArray(part.chapters) &&
    part.chapters.every(isValidChapter)
  )
}

function hasStableSlugs(parts, fallbackParts) {
  const fallbackChapters = new Map(
    fallbackParts.flatMap((part) =>
      Array.isArray(part?.chapters)
        ? part.chapters.map((chapter) => [chapter.n, chapter])
        : []
    )
  )

  return parts.every((part) =>
    part.chapters.every((chapter) => {
      const fallback = fallbackChapters.get(chapter.n)
      return fallback && fallback.slug === chapter.slug
    })
  )
}

function isValidPayload(payload, course, locale, fallbackParts) {
  return (
    isRecord(payload) &&
    payload.course === course &&
    payload.locale === locale &&
    Array.isArray(payload.parts) &&
    payload.parts.every(isValidPart) &&
    hasStableSlugs(payload.parts, fallbackParts)
  )
}

function mergeLocalizedParts(fallbackParts, localizedParts) {
  const localizedByPart = new Map(
    localizedParts.map((part) => [`${typeof part.id}:${part.id}`, part])
  )

  return fallbackParts.map((fallbackPart) => {
    const localizedPart = localizedByPart.get(
      `${typeof fallbackPart.id}:${fallbackPart.id}`
    )
    if (!localizedPart) return fallbackPart

    const localizedByChapter = new Map(
      localizedPart.chapters.map((chapter) => [chapter.n, chapter])
    )
    const chapters = Array.isArray(fallbackPart.chapters)
      ? fallbackPart.chapters.map((fallbackChapter) => {
          const localizedChapter = localizedByChapter.get(fallbackChapter.n)
          if (!localizedChapter || localizedChapter.slug !== fallbackChapter.slug) {
            return fallbackChapter
          }
          return {
            ...fallbackChapter,
            title: localizedChapter.title,
            summary: localizedChapter.summary,
            learn: localizedChapter.learn,
            tags: localizedChapter.tags,
          }
        })
      : fallbackPart.chapters

    return {
      ...fallbackPart,
      name: localizedPart.name,
      desc: localizedPart.desc,
      chapters,
    }
  })
}

function fallbackFingerprint(parts) {
  try {
    return JSON.stringify(parts)
  } catch {
    return "[invalid-fallback]"
  }
}

export default function useLocalizedCourseMetadata(course, fallbackParts) {
  const { lang } = useI18n()
  const safeFallback = Array.isArray(fallbackParts) ? fallbackParts : []
  const fallbackKey = fallbackFingerprint(safeFallback)
  const requestKey = `${course}\u0000${lang}\u0000${fallbackKey}`
  const [state, setState] = useState(() => ({
    key: requestKey,
    parts: safeFallback,
    loading: lang !== "en",
    localized: false,
  }))

  useEffect(() => {
    let stale = false
    const controller = new AbortController()
    const fallbackState = {
      key: requestKey,
      parts: safeFallback,
      loading: lang !== "en",
      localized: false,
    }

    setState(fallbackState)

    if (lang === "en" || !course) {
      return () => {
        stale = true
        controller.abort()
      }
    }

    const cacheKey = `${course}\u0000${lang}`
    const cached = payloadCache.get(cacheKey)
    if (cached && isValidPayload(cached, course, lang, safeFallback)) {
      setState({
        key: requestKey,
        parts: mergeLocalizedParts(safeFallback, cached.parts),
        loading: false,
        localized: true,
      })
      return () => {
        stale = true
        controller.abort()
      }
    }
    if (cached) payloadCache.delete(cacheKey)

    fetch(
      `/i18n/courses/${encodeURIComponent(course)}/${encodeURIComponent(lang)}.json`,
      { signal: controller.signal }
    )
      .then((response) => {
        if (!response.ok) throw new Error(`Course metadata request failed: ${response.status}`)
        return response.json()
      })
      .then((payload) => {
        if (stale) return
        if (!isValidPayload(payload, course, lang, safeFallback)) {
          setState({ ...fallbackState, loading: false })
          return
        }
        payloadCache.set(cacheKey, payload)
        setState({
          key: requestKey,
          parts: mergeLocalizedParts(safeFallback, payload.parts),
          loading: false,
          localized: true,
        })
      })
      .catch(() => {
        if (!stale) {
          setState({ ...fallbackState, loading: false })
        }
      })

    return () => {
      stale = true
      controller.abort()
    }
  }, [course, lang, fallbackKey, requestKey])

  if (state.key !== requestKey) {
    return { parts: safeFallback, loading: lang !== "en", localized: false }
  }

  return { parts: state.parts, loading: state.loading, localized: state.localized }
}
