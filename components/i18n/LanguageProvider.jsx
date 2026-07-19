"use client"

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import en from './dictionaries/en'
import { defaultLocale, getLocale } from './locales'

const STORAGE_KEY = 'openalgo.lang'

const I18nContext = createContext({
  lang: defaultLocale,
  dir: 'ltr',
  setLang: () => {},
  t: (key) => en[key] ?? key,
})

// Non-English dictionaries load on demand so they ship as separate client
// chunks and never weigh down the server bundle.
const loaders = {
  hi: () => import('./dictionaries/hi'),
  ta: () => import('./dictionaries/ta'),
  te: () => import('./dictionaries/te'),
  ml: () => import('./dictionaries/ml'),
  mr: () => import('./dictionaries/mr'),
  kn: () => import('./dictionaries/kn'),
  gu: () => import('./dictionaries/gu'),
  bn: () => import('./dictionaries/bn'),
  ur: () => import('./dictionaries/ur'),
  or: () => import('./dictionaries/or'),
  es: () => import('./dictionaries/es'),
  ar: () => import('./dictionaries/ar'),
  fr: () => import('./dictionaries/fr'),
  ru: () => import('./dictionaries/ru'),
  pt: () => import('./dictionaries/pt'),
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(defaultLocale)
  const [dict, setDict] = useState(en)

  useEffect(() => {
    let stored
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }
    if (stored && (stored === defaultLocale || loaders[stored])) {
      setLangState(stored)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const locale = getLocale(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = locale.dir

    if (lang === defaultLocale) {
      setDict(en)
      return
    }
    loaders[lang]()
      .then((mod) => {
        if (!cancelled) setDict(mod.default)
      })
      .catch(() => {
        if (!cancelled) setDict(en)
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  const setLang = useCallback((code) => {
    setLangState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // storage unavailable (private mode) - language still applies for the session
    }
  }, [])

  const t = useCallback((key) => dict[key] ?? en[key] ?? key, [dict])

  return (
    <I18nContext.Provider value={{ lang, dir: getLocale(lang).dir, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
