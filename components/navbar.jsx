"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Button } from './ui/button'
import { clsx } from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { useI18n } from './i18n/LanguageProvider'
import { LanguageSwitcher } from './i18n/LanguageSwitcher'

// Nine items do not fit one pill beside the wordmark and the right-hand links
// at 1024 px, so each item names the breakpoint where it joins the pill. Until
// then it sits in the More menu: five items and More at lg, seven and More at
// xl, all nine from 2xl. The class names are written out in full so Tailwind
// finds them.
const PILL_DISPLAY = {
  lg: 'inline-flex',
  xl: 'hidden xl:inline-flex',
  '2xl': 'hidden 2xl:inline-flex',
}
const MORE_DISPLAY = {
  xl: 'xl:hidden',
  '2xl': '',
}
// The More button reads as active when the current page is inside it.
const MORE_ACTIVE = {
  lg: '',
  xl: 'max-xl:font-semibold max-xl:text-on-surface max-xl:bg-surface-container',
  '2xl': 'font-semibold text-on-surface bg-surface-container',
}

export function Navbar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const moreRef = useRef(null)
  const moreButtonRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // A new page closes both menus.
  useEffect(() => {
    setIsOpen(false)
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!moreOpen) return
    const onPointerDown = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMoreOpen(false)
        moreButtonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [moreOpen])

  const menuItems = [
    { href: "/features", label: t('nav.features'), from: 'lg' },
    { href: "/charts", label: t('nav.charts'), from: 'lg' },
    { href: "/script", label: t('nav.script'), from: 'lg' },
    { href: "/download", label: t('nav.download'), from: 'lg' },
    { href: "/blog", label: t('nav.blog'), from: 'xl' },
    { href: "/discord", label: t('nav.discord'), from: 'xl' },
    { href: "/faq", label: t('nav.faq'), from: '2xl' },
    { href: "/roadmap", label: t('nav.roadmap'), from: '2xl' },
    { href: "/learn", label: t('nav.varsity'), from: 'lg' },
  ]

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`)
  const activeItem = menuItems.find((item) => isActive(item.href))
  const moreItems = menuItems.filter((item) => item.from !== 'lg')
  const moreLabel = t('nav.more')

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/85 backdrop-blur-md border-b" : "bg-background"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Wordmark */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setIsOpen(false)}>
          <img src="/assets/images/logo-mark.png" alt="" className="h-7 w-7" />
          <span className="text-lg font-extrabold tracking-tight text-on-surface">OpenAlgo</span>
        </Link>

        {/* Desktop pill navigation */}
        <nav
          aria-label="Main"
          className="hidden lg:flex items-center gap-0.5 rounded-full border bg-surface-bright px-1.5 py-1.5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
        >
          {menuItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  PILL_DISPLAY[item.from],
                  "items-center whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition-colors xl:px-3 2xl:px-3.5",
                  active
                    ? "font-semibold text-on-surface bg-surface-container"
                    : "font-medium text-on-surface-variant hover:text-on-surface"
                )}
              >
                {item.label}
              </Link>
            )
          })}

          {/* More: the items that have not joined the pill at this width, and Docs below xl */}
          <div ref={moreRef} className="relative 2xl:hidden">
            <button
              ref={moreButtonRef}
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-controls="nav-more-menu"
              className={clsx(
                "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface xl:px-3",
                moreOpen && "text-on-surface",
                activeItem && MORE_ACTIVE[activeItem.from]
              )}
            >
              {moreLabel}
            </button>

            {moreOpen && (
              <ul
                id="nav-more-menu"
                className="absolute end-0 top-full z-50 mt-3 w-48 rounded-2xl border bg-popover p-1.5 shadow-lg shadow-black/10"
              >
                {moreItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <li key={item.href} className={MORE_DISPLAY[item.from]}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setMoreOpen(false)}
                        className={clsx(
                          "block rounded-xl px-3 py-2 text-sm transition-colors",
                          active
                            ? "font-semibold text-on-surface bg-surface-container"
                            : "font-medium text-on-surface-variant hover:bg-accent hover:text-on-surface"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
                <li className="xl:hidden">
                  <a
                    href="https://docs.openalgo.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMoreOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-accent hover:text-on-surface"
                  >
                    {t('nav.docs')}
                  </a>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* Right zone */}
        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageSwitcher />
          {/* Docs moves into the More menu between lg and xl to leave the pill room */}
          <a
            href="https://docs.openalgo.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex lg:hidden xl:flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            {t('nav.docs')}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Button asChild size="sm" className="hidden sm:inline-flex h-9 px-4 text-sm whitespace-nowrap">
            <Link href="/getting-started">{t('nav.getStarted')}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container py-4 space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    "block rounded-xl px-4 py-3 text-sm transition-colors",
                    active
                      ? "font-semibold text-on-surface bg-surface-low"
                      : "font-medium text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            <a
              href="https://docs.openalgo.in"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-low hover:text-on-surface"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.docs')}
            </a>
            <div className="px-4 pt-2 sm:hidden">
              <Button asChild className="w-full">
                <Link href="/getting-started" onClick={() => setIsOpen(false)}>
                  {t('nav.getStarted')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
