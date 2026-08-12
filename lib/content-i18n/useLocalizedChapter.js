"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n/LanguageProvider"

// Explicit per-course, per-locale loaders map for translated chapter content,
// defined inline in this client-boundary file (mirrors
// components/i18n/LanguageProvider.jsx's loaders map exactly, including
// living inside the same "use client" file rather than a separate shared
// module).
const contentLoaders = {
  stocks: {
    hi: () => import("./stocks/hi.js"),
    ta: () => import("./stocks/ta.js"),
    te: () => import("./stocks/te.js"),
    ml: () => import("./stocks/ml.js"),
    mr: () => import("./stocks/mr.js"),
    kn: () => import("./stocks/kn.js"),
    gu: () => import("./stocks/gu.js"),
    bn: () => import("./stocks/bn.js"),
    ur: () => import("./stocks/ur.js"),
    or: () => import("./stocks/or.js"),
    es: () => import("./stocks/es.js"),
    ar: () => import("./stocks/ar.js"),
    fr: () => import("./stocks/fr.js"),
    ru: () => import("./stocks/ru.js"),
    pt: () => import("./stocks/pt.js"),
  },
  "technicals": {
    hi: () => import("./technicals/hi.js"),
    ta: () => import("./technicals/ta.js"),
    te: () => import("./technicals/te.js"),
    ml: () => import("./technicals/ml.js"),
    mr: () => import("./technicals/mr.js"),
    kn: () => import("./technicals/kn.js"),
    gu: () => import("./technicals/gu.js"),
    bn: () => import("./technicals/bn.js"),
    ur: () => import("./technicals/ur.js"),
    or: () => import("./technicals/or.js"),
    es: () => import("./technicals/es.js"),
    ar: () => import("./technicals/ar.js"),
    fr: () => import("./technicals/fr.js"),
    ru: () => import("./technicals/ru.js"),
    pt: () => import("./technicals/pt.js"),
  },
  "fundamentals": {
    hi: () => import("./fundamentals/hi.js"),
    ta: () => import("./fundamentals/ta.js"),
    te: () => import("./fundamentals/te.js"),
    ml: () => import("./fundamentals/ml.js"),
    mr: () => import("./fundamentals/mr.js"),
    kn: () => import("./fundamentals/kn.js"),
    gu: () => import("./fundamentals/gu.js"),
    bn: () => import("./fundamentals/bn.js"),
    ur: () => import("./fundamentals/ur.js"),
    or: () => import("./fundamentals/or.js"),
    es: () => import("./fundamentals/es.js"),
    ar: () => import("./fundamentals/ar.js"),
    fr: () => import("./fundamentals/fr.js"),
    ru: () => import("./fundamentals/ru.js"),
    pt: () => import("./fundamentals/pt.js"),
  },
  "futures": {
    hi: () => import("./futures/hi.js"),
    ta: () => import("./futures/ta.js"),
    te: () => import("./futures/te.js"),
    ml: () => import("./futures/ml.js"),
    mr: () => import("./futures/mr.js"),
    kn: () => import("./futures/kn.js"),
    gu: () => import("./futures/gu.js"),
    bn: () => import("./futures/bn.js"),
    ur: () => import("./futures/ur.js"),
    or: () => import("./futures/or.js"),
    es: () => import("./futures/es.js"),
    ar: () => import("./futures/ar.js"),
    fr: () => import("./futures/fr.js"),
    ru: () => import("./futures/ru.js"),
    pt: () => import("./futures/pt.js"),
  },
  "options-basics": {
    hi: () => import("./options-basics/hi.js"),
    ta: () => import("./options-basics/ta.js"),
    te: () => import("./options-basics/te.js"),
    ml: () => import("./options-basics/ml.js"),
    mr: () => import("./options-basics/mr.js"),
    kn: () => import("./options-basics/kn.js"),
    gu: () => import("./options-basics/gu.js"),
    bn: () => import("./options-basics/bn.js"),
    ur: () => import("./options-basics/ur.js"),
    or: () => import("./options-basics/or.js"),
    es: () => import("./options-basics/es.js"),
    ar: () => import("./options-basics/ar.js"),
    fr: () => import("./options-basics/fr.js"),
    ru: () => import("./options-basics/ru.js"),
    pt: () => import("./options-basics/pt.js"),
  },
  "options-strategies": {
    hi: () => import("./options-strategies/hi.js"),
    ta: () => import("./options-strategies/ta.js"),
    te: () => import("./options-strategies/te.js"),
    ml: () => import("./options-strategies/ml.js"),
    mr: () => import("./options-strategies/mr.js"),
    kn: () => import("./options-strategies/kn.js"),
    gu: () => import("./options-strategies/gu.js"),
    bn: () => import("./options-strategies/bn.js"),
    ur: () => import("./options-strategies/ur.js"),
    or: () => import("./options-strategies/or.js"),
    es: () => import("./options-strategies/es.js"),
    ar: () => import("./options-strategies/ar.js"),
    fr: () => import("./options-strategies/fr.js"),
    ru: () => import("./options-strategies/ru.js"),
    pt: () => import("./options-strategies/pt.js"),
  },
  "python": {
    hi: () => import("./python/hi.js"),
    ta: () => import("./python/ta.js"),
    te: () => import("./python/te.js"),
    ml: () => import("./python/ml.js"),
    mr: () => import("./python/mr.js"),
    kn: () => import("./python/kn.js"),
    gu: () => import("./python/gu.js"),
    bn: () => import("./python/bn.js"),
    ur: () => import("./python/ur.js"),
    or: () => import("./python/or.js"),
    es: () => import("./python/es.js"),
    ar: () => import("./python/ar.js"),
    fr: () => import("./python/fr.js"),
    ru: () => import("./python/ru.js"),
    pt: () => import("./python/pt.js"),
  },
  "quant": {
    hi: () => import("./quant/hi.js"),
    ta: () => import("./quant/ta.js"),
    te: () => import("./quant/te.js"),
    ml: () => import("./quant/ml.js"),
    mr: () => import("./quant/mr.js"),
    kn: () => import("./quant/kn.js"),
    gu: () => import("./quant/gu.js"),
    bn: () => import("./quant/bn.js"),
    ur: () => import("./quant/ur.js"),
    or: () => import("./quant/or.js"),
    es: () => import("./quant/es.js"),
    ar: () => import("./quant/ar.js"),
    fr: () => import("./quant/fr.js"),
    ru: () => import("./quant/ru.js"),
    pt: () => import("./quant/pt.js"),
  },
  "amibroker": {
    hi: () => import("./amibroker/hi.js"),
    ta: () => import("./amibroker/ta.js"),
    te: () => import("./amibroker/te.js"),
    ml: () => import("./amibroker/ml.js"),
    mr: () => import("./amibroker/mr.js"),
    kn: () => import("./amibroker/kn.js"),
    gu: () => import("./amibroker/gu.js"),
    bn: () => import("./amibroker/bn.js"),
    ur: () => import("./amibroker/ur.js"),
    or: () => import("./amibroker/or.js"),
    es: () => import("./amibroker/es.js"),
    ar: () => import("./amibroker/ar.js"),
    fr: () => import("./amibroker/fr.js"),
    ru: () => import("./amibroker/ru.js"),
    pt: () => import("./amibroker/pt.js"),
  },
  "taxation": {
    hi: () => import("./taxation/hi.js"),
    ta: () => import("./taxation/ta.js"),
    te: () => import("./taxation/te.js"),
    ml: () => import("./taxation/ml.js"),
    mr: () => import("./taxation/mr.js"),
    kn: () => import("./taxation/kn.js"),
    gu: () => import("./taxation/gu.js"),
    bn: () => import("./taxation/bn.js"),
    ur: () => import("./taxation/ur.js"),
    or: () => import("./taxation/or.js"),
    es: () => import("./taxation/es.js"),
    ar: () => import("./taxation/ar.js"),
    fr: () => import("./taxation/fr.js"),
    ru: () => import("./taxation/ru.js"),
    pt: () => import("./taxation/pt.js"),
  },
  "stats-arb": {
    hi: () => import("./stats-arb/hi.js"),
    ta: () => import("./stats-arb/ta.js"),
    te: () => import("./stats-arb/te.js"),
    ml: () => import("./stats-arb/ml.js"),
    mr: () => import("./stats-arb/mr.js"),
    kn: () => import("./stats-arb/kn.js"),
    gu: () => import("./stats-arb/gu.js"),
    bn: () => import("./stats-arb/bn.js"),
    ur: () => import("./stats-arb/ur.js"),
    or: () => import("./stats-arb/or.js"),
    es: () => import("./stats-arb/es.js"),
    ar: () => import("./stats-arb/ar.js"),
    fr: () => import("./stats-arb/fr.js"),
    ru: () => import("./stats-arb/ru.js"),
    pt: () => import("./stats-arb/pt.js"),
  },
  "risk-management": {
    hi: () => import("./risk-management/hi.js"),
    ta: () => import("./risk-management/ta.js"),
    te: () => import("./risk-management/te.js"),
    ml: () => import("./risk-management/ml.js"),
    mr: () => import("./risk-management/mr.js"),
    kn: () => import("./risk-management/kn.js"),
    gu: () => import("./risk-management/gu.js"),
    bn: () => import("./risk-management/bn.js"),
    ur: () => import("./risk-management/ur.js"),
    or: () => import("./risk-management/or.js"),
    es: () => import("./risk-management/es.js"),
    ar: () => import("./risk-management/ar.js"),
    fr: () => import("./risk-management/fr.js"),
    ru: () => import("./risk-management/ru.js"),
    pt: () => import("./risk-management/pt.js"),
  },
  "trading-psychology": {
    hi: () => import("./trading-psychology/hi.js"),
    ta: () => import("./trading-psychology/ta.js"),
    te: () => import("./trading-psychology/te.js"),
    ml: () => import("./trading-psychology/ml.js"),
    mr: () => import("./trading-psychology/mr.js"),
    kn: () => import("./trading-psychology/kn.js"),
    gu: () => import("./trading-psychology/gu.js"),
    bn: () => import("./trading-psychology/bn.js"),
    ur: () => import("./trading-psychology/ur.js"),
    or: () => import("./trading-psychology/or.js"),
    es: () => import("./trading-psychology/es.js"),
    ar: () => import("./trading-psychology/ar.js"),
    fr: () => import("./trading-psychology/fr.js"),
    ru: () => import("./trading-psychology/ru.js"),
    pt: () => import("./trading-psychology/pt.js"),
  },
}

// Lazily loads a translated chapter's {html, toc, hasContent} for the active
// locale, via the exact same dynamic-import mechanism as the UI dictionaries:
// the translated content ships as a browser-fetched chunk, never touching the
// server bundle. English is passed in as `fallback` and rendered immediately
// (SSR, zero regression, best SEO). If a chapter has no translation yet for
// the active locale (partial course rollout) or the course has no i18n
// content at all, this silently keeps showing `fallback`.
export function useLocalizedChapter(course, chapterN, fallback) {
  const { lang } = useI18n()
  const [state, setState] = useState(fallback)

  useEffect(() => {
    let cancelled = false

    setState(fallback)

    if (lang === "en") {
      return () => {
        cancelled = true
      }
    }

    const loader = contentLoaders[course]?.[lang]
    if (!loader) {
      return () => {
        cancelled = true
      }
    }

    loader()
      .then((mod) => {
        if (cancelled) return
        const data = mod.default || mod
        const ch = data[String(chapterN)] || data[chapterN]
        if (ch && ch.hasContent) {
          setState({ html: ch.html, toc: ch.toc || [], hasContent: true })
        } else {
          setState(fallback)
        }
      })
      .catch(() => {
        if (!cancelled) setState(fallback)
      })
    return () => {
      cancelled = true
    }
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
