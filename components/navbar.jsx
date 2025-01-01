"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, HelpCircle, Book, Download, Menu, Sun, Moon, GitBranch, Github } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { clsx } from 'clsx'

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="hidden md:flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            OpenAlgo
          </span>
        </Link>
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={clsx(
              "flex items-center gap-2 transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}>
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link href="/faq" className={clsx(
              "flex items-center gap-2 transition-colors hover:text-primary",
              pathname === "/faq" ? "text-primary" : "text-muted-foreground"
            )}>
              <HelpCircle className="h-4 w-4" />
              FAQ
            </Link>
            <Link href="/roadmap" className={clsx(
              "flex items-center gap-2 transition-colors hover:text-primary",
              pathname === "/roadmap" ? "text-primary" : "text-muted-foreground"
            )}>
              <GitBranch className="h-4 w-4" />
              Roadmap
            </Link>
            <a
              href="https://docs.openalgo.in"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Book className="h-4 w-4" />
              Docs
            </a>
          </nav>
        </div>
        <a
          href="https://github.com/marketcalls/openalgo"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-2 flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <img
            src="https://img.shields.io/github/stars/marketcalls/openalgo?style=social"
            alt="GitHub stars"
            className="h-5"
          />
        </a>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Theme"
          className="ml-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  )
}
