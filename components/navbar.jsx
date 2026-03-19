"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, HelpCircle, Book, Menu, GitBranch, Github, X, ArrowDownToLine, MessageCircle, PenTool, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { href: "/", icon: <Home className="h-4 w-4" />, label: "Home" },
    { href: "/features", icon: <Sparkles className="h-4 w-4" />, label: "Features" },
    { href: "/download", icon: <ArrowDownToLine className="h-4 w-4" />, label: "Download" },
    { href: "/blog", icon: <PenTool className="h-4 w-4" />, label: "Blog" },
    { href: "/discord", icon: <MessageCircle className="h-4 w-4" />, label: "Discord" },
    { href: "/faq", icon: <HelpCircle className="h-4 w-4" />, label: "FAQ" },
    { href: "/roadmap", icon: <GitBranch className="h-4 w-4" />, label: "Roadmap" },
    { href: "https://docs.openalgo.in", icon: <Book className="h-4 w-4" />, label: "Docs", external: true },
  ]

  const navClasses = clsx(
    "sticky top-0 z-50 w-full transition-all duration-300",
    scrolled
      ? "glass-float shadow-lg shadow-black/5"
      : "bg-background/80 backdrop-blur-sm"
  )

  if (!mounted) {
    return (
      <header className={navClasses}>
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold text-on-surface">OpenAlgo</span>
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className={navClasses}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
            OpenAlgo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const linkClasses = clsx(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "text-primary surface-high"
                : "text-on-surface-variant hover:text-on-surface hover:surface-high"
            )

            return item.external ? (
              <a
                key={item.href}
                href={item.href}
                className={linkClasses}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.icon}
                <span className="font-label text-label-lg">{item.label}</span>
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={linkClasses}>
                {item.icon}
                <span className="font-label text-label-lg">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/marketcalls/openalgo"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <img
              src="https://img.shields.io/github/stars/marketcalls/openalgo?style=social"
              alt="GitHub stars"
              className="h-5"
            />
          </a>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden surface-low">
          <div className="container py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const linkClasses = clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
                isActive
                  ? "text-primary surface-high"
                  : "text-on-surface-variant hover:text-on-surface hover:surface-container"
              )

              return item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  className={linkClasses}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-label">{item.label}</span>
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClasses}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-label">{item.label}</span>
                </Link>
              )
            })}
            <a
              href="https://github.com/marketcalls/openalgo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:surface-container transition-all"
              onClick={() => setIsOpen(false)}
            >
              <Github className="h-4 w-4" />
              <span className="font-label">GitHub</span>
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
