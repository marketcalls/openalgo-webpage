"use client"

import { GitHubLogoIcon, DiscordLogoIcon } from '@radix-ui/react-icons'
import { Twitter, Youtube } from 'lucide-react'
import { useI18n } from './i18n/LanguageProvider'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="font-label text-label-md uppercase tracking-widest">
              {t('footer.copyright')} {new Date().getFullYear()}
            </span>
            <span className="hidden md:inline text-outline-variant">|</span>
            <a
              href="https://www.openalgo.in"
              className="font-medium text-on-surface transition-colors hover:text-on-surface-variant"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.openalgo.in
            </a>
          </div>
          <span className="hidden md:inline text-outline-variant">|</span>
          <span>{t('footer.tagline')}</span>
          <span className="hidden md:inline text-outline-variant">|</span>
          <a
            href="/privacy-policy"
            className="font-medium text-on-surface transition-colors hover:text-on-surface-variant"
          >
            {t('footer.privacy')}
          </a>
          <span className="hidden md:inline text-outline-variant">|</span>
          <span className="rounded-full border px-3 py-1 font-label text-label-md text-on-surface-variant">
            v2.0.16
          </span>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          {[
            { href: "https://github.com/marketcalls/openalgo", icon: GitHubLogoIcon, label: "GitHub" },
            { href: "/discord", icon: DiscordLogoIcon, label: "Discord" },
            { href: "https://x.com/openalgoHQ", icon: Twitter, label: "X" },
            { href: "https://www.youtube.com/@openalgo", icon: Youtube, label: "YouTube" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border p-2.5 text-on-surface-variant transition-all hover:border-outline-variant hover:text-on-surface"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
