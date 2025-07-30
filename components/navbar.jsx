"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, HelpCircle, Book, Menu, GitBranch, Github, X, ArrowDownToLine, MessageCircle, PenTool } from 'lucide-react'
import { Button } from './ui/button'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only show menu after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { href: "/", icon: <Home className="h-4 w-4" />, label: "Home" },
    { href: "/download", icon: <ArrowDownToLine className="h-4 w-4" />, label: "Download" },
    { href: "/blog", icon: <PenTool className="h-4 w-4" />, label: "Blog" },
    { href: "/discord", icon: <MessageCircle className="h-4 w-4" />, label: "Discord" },
    { href: "/faq", icon: <HelpCircle className="h-4 w-4" />, label: "FAQ" },
    { href: "/roadmap", icon: <GitBranch className="h-4 w-4" />, label: "Roadmap" },
    { href: "https://docs.openalgo.in", icon: <Book className="h-4 w-4" />, label: "Docs", external: true },
  ]

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">OpenAlgo</span>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">
              OpenAlgo
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {menuItems.map((item) => (
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-foreground/80 transition-colors hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.icon}
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/marketcalls/openalgo"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            <img
              src="https://img.shields.io/github/stars/marketcalls/openalgo?style=social"
              alt="GitHub stars"
              className="h-5"
            />
          </a>
          
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {menuItems.map((item) => (
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            ))}
            <a
              href="https://github.com/marketcalls/openalgo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Github className="h-4 w-4" />
              GitHub
              <img
                src="https://img.shields.io/github/stars/marketcalls/openalgo?style=social"
                alt="GitHub stars"
                className="h-5 ml-auto"
              />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
