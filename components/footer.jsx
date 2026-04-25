"use client"

import { GitHubLogoIcon, DiscordLogoIcon } from '@radix-ui/react-icons'
import { Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-10 surface-low">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="font-label text-label-md uppercase tracking-widest">
              Copyright {new Date().getFullYear()}
            </span>
            <span className="hidden md:inline text-outline-variant">|</span>
            <a
              href="https://www.openalgo.in"
              className="text-on-surface hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.openalgo.in
            </a>
          </div>
          <span className="hidden md:inline text-outline-variant">|</span>
          <span>Open Source Algo Platform for Everyone</span>
          <span className="hidden md:inline text-outline-variant">|</span>
          <a
            href="/privacy-policy"
            className="text-on-surface hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
          <span className="hidden md:inline text-outline-variant">|</span>
          <span className="font-label text-label-md px-3 py-1 rounded-full surface-high text-on-surface-variant">
            v2.0.0.5
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
              className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:surface-high transition-all"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
