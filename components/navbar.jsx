"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, Github, X, ArrowUpRight } from 'lucide-react'
import { Button } from './ui/button'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import { useI18n } from './i18n/LanguageProvider'
import { LanguageSwitcher } from './i18n/LanguageSwitcher'

export function Navbar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { href: "/features", label: t('nav.features') },
    { href: "/download", label: t('nav.download') },
    { href: "/blog", label: t('nav.blog') },
    { href: "/discord", label: t('nav.discord') },
    { href: "/faq", label: t('nav.faq') },
    { href: "/roadmap", label: t('nav.roadmap') },
    { href: "/learn", label: t('nav.varsity') },
  ]

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
        <nav className="hidden lg:flex items-center gap-0.5 rounded-full border bg-surface-bright px-1.5 py-1.5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? "font-semibold text-on-surface bg-surface-container"
                    : "font-medium text-on-surface-variant hover:text-on-surface"
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <a
            href="https://github.com/marketcalls/openalgo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        {/* Right zone */}
        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageSwitcher />
          <a
            href="https://docs.openalgo.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            {t('nav.docs')}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Button asChild size="sm" className="hidden sm:inline-flex h-9 px-4 text-sm">
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
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "block rounded-xl px-4 py-3 text-sm transition-colors",
                    isActive
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
            <a
              href="https://github.com/marketcalls/openalgo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-low hover:text-on-surface"
              onClick={() => setIsOpen(false)}
            >
              <Github className="h-4 w-4" />
              GitHub
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
