"use client"

import { GitHubLogoIcon, DiscordLogoIcon } from '@radix-ui/react-icons'
import { Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Copyright {new Date().getFullYear()}</span>
            <span className="hidden md:inline">•</span>
            <a
              href="https://www.openalgo.in"
              className="text-foreground hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.openalgo.in
            </a>
          </div>
          <span className="hidden md:inline">•</span>
          <span>Open Source Algo Platform for Everyone</span>
          <span className="hidden md:inline">•</span>
          <a
            href="/privacy-policy"
            className="text-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
          <span className="hidden md:inline">•</span>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <p className="text-sm text-muted-foreground">
              v1.0.0.32
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/marketcalls/openalgo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Visit OpenAlgo GitHub repository"
            >
              <GitHubLogoIcon className="h-4 w-4" />
              <span className="sr-only">OpenAlgo GitHub repository</span>
            </a>
            <a
              href="/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Join OpenAlgo Discord community"
            >
              <DiscordLogoIcon className="h-4 w-4" />
              <span className="sr-only">OpenAlgo Discord community</span>
            </a>
            <a
              href="https://x.com/openalgoHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Follow OpenAlgo on X (formerly Twitter)"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">OpenAlgo X (Twitter) profile</span>
            </a>
            <a
              href="https://www.youtube.com/@openalgo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Subscribe to OpenAlgo YouTube channel"
            >
              <Youtube className="h-4 w-4" />
              <span className="sr-only">OpenAlgo YouTube channel</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
