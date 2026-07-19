"use client"

import { useEffect, useRef, useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { useI18n } from './LanguageProvider'
import { locales } from './locales'

export function LanguageSwitcher({ align = 'end' }) {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('nav.language')}
        className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{lang}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('nav.language')}
          className={clsx(
            'absolute top-full z-50 mt-2 max-h-[70vh] w-44 overflow-y-auto rounded-2xl border bg-popover p-1.5 shadow-lg shadow-black/10',
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          {locales.map((locale) => (
            <li key={locale.code} role="option" aria-selected={locale.code === lang}>
              <button
                type="button"
                onClick={() => {
                  setLang(locale.code)
                  setOpen(false)
                }}
                className={clsx(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors',
                  locale.code === lang
                    ? 'font-semibold text-on-surface'
                    : 'text-on-surface-variant hover:bg-accent hover:text-on-surface'
                )}
              >
                <span>{locale.name}</span>
                {locale.code === lang && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
