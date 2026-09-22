"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import SearchButton from "./SearchButton"

const STORAGE_KEY = "openalgo.script.nav.collapsed"

function readCollapsed() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(list) ? list : [])
  } catch {
    return new Set()
  }
}

function writeCollapsed(set) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // storage blocked: the sections still fold for this visit
  }
}

function SidebarNav({ nav, pathname, collapsed, onToggle, onNavigate, idPrefix }) {
  return (
    <nav aria-label="OpenScript documentation" className="osd-nav">
      <Link
        href="/script"
        prefetch={false}
        onClick={onNavigate}
        className={`osd-nav-home${pathname === "/script" ? " is-active" : ""}`}
        aria-current={pathname === "/script" ? "page" : undefined}
      >
        Overview
      </Link>
      {nav.map((section) => {
        const open = !collapsed.has(section.slug)
        const listId = `${idPrefix}-${section.slug}`
        const current = pathname.startsWith(`/script/${section.slug}/`)
        return (
          <div key={section.slug} className={`osd-nav-section${current ? " is-current" : ""}`}>
            <button
              type="button"
              className="osd-nav-toggle"
              aria-expanded={open}
              aria-controls={listId}
              onClick={() => onToggle(section.slug)}
            >
              <span>{section.title}</span>
              <span className="osd-nav-count">{section.pages.length}</span>
              <span className="osd-chevron" aria-hidden="true" />
            </button>
            <ul id={listId} hidden={!open}>
              {section.pages.map((p) => {
                const href = `/script/${section.slug}/${p.slug}`
                const active = pathname === href
                return (
                  <li key={p.slug}>
                    {p.ready ? (
                      <Link
                        href={href}
                        prefetch={false}
                        onClick={onNavigate}
                        className={`osd-nav-link${active ? " is-active" : ""}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {p.title}
                      </Link>
                    ) : (
                      <span className="osd-nav-link is-pending" aria-disabled="true" title="This page is being written">
                        {p.title}
                        <span className="osd-nav-soon">soon</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}

/**
 * The frame around every docs page: a slim bar under the site navbar (menu on
 * small screens, the language name and version, search), a sticky sidebar of
 * every section and page, and a slide-in drawer holding the same sidebar on
 * phones. It lives in a layout, so the sidebar keeps its folds and its scroll
 * position from page to page.
 */
export default function DocsShell({ nav, version, repo, children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [drawer, setDrawer] = useState(false)
  // The drawer's copy of the page list is built the first time it opens, so
  // each page's HTML carries the list once, not twice.
  const [drawerBuilt, setDrawerBuilt] = useState(false)
  const sidebarRef = useRef(null)
  const drawerRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    setCollapsed(readCollapsed())
  }, [])

  // Arriving in a folded section unfolds it.
  useEffect(() => {
    const slug = pathname.split("/")[2]
    setCollapsed((prev) => {
      if (!slug || !prev.has(slug)) return prev
      const next = new Set(prev)
      next.delete(slug)
      writeCollapsed(next)
      return next
    })
    setDrawer(false)
  }, [pathname])

  // Keep the current page in view inside the sidebar, without moving the page.
  useEffect(() => {
    const box = sidebarRef.current
    const link = box?.querySelector(".osd-nav-link.is-active")
    if (!box || !link) return
    const top = link.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop
    if (top < box.scrollTop + 40 || top > box.scrollTop + box.clientHeight - 80) {
      box.scrollTop = Math.max(0, top - box.clientHeight / 3)
    }
  }, [pathname, collapsed])

  useEffect(() => {
    if (!drawer) return undefined
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape") setDrawer(false)
    }
    window.addEventListener("keydown", onKey)
    requestAnimationFrame(() => drawerRef.current?.querySelector(".osd-drawer-close")?.focus())
    return () => {
      document.documentElement.style.overflow = previous
      window.removeEventListener("keydown", onKey)
      menuRef.current?.focus({ preventScroll: true })
    }
  }, [drawer])

  const toggle = useCallback((slug) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      writeCollapsed(next)
      return next
    })
  }, [])

  const closeDrawer = useCallback(() => setDrawer(false), [])

  return (
    <div className="osd-shell">
      <div className="osd-docbar">
        <div className="osd-docbar-inner">
          <button
            ref={menuRef}
            type="button"
            className="osd-docbar-menu"
            aria-expanded={drawer}
            aria-controls="osd-drawer"
            onClick={() => {
              setDrawerBuilt(true)
              setDrawer(true)
            }}
          >
            Menu
          </button>
          <Link href="/script" prefetch={false} className="osd-docbar-brand">
            OpenScript
          </Link>
          <span className="osd-docbar-version">v{version}</span>
          <span className="osd-docbar-sub">Documentation</span>
          <div className="osd-docbar-end">
            <SearchButton />
            <a href={repo} target="_blank" rel="noopener noreferrer" className="osd-docbar-link">
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="osd-frame">
        <aside className="osd-sidebar" ref={sidebarRef}>
          <SidebarNav nav={nav} pathname={pathname} collapsed={collapsed} onToggle={toggle} idPrefix="osd-side" />
        </aside>
        <div className="osd-main">{children}</div>
      </div>

      <div className={`osd-drawer-scrim${drawer ? " is-open" : ""}`} onClick={closeDrawer} aria-hidden="true" />
      <div
        id="osd-drawer"
        ref={drawerRef}
        className={`osd-drawer${drawer ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Documentation pages"
        aria-hidden={!drawer}
        inert={drawer ? undefined : true}
      >
        <div className="osd-drawer-head">
          <span className="osd-docbar-brand">OpenScript</span>
          <button type="button" className="osd-drawer-close" onClick={closeDrawer}>
            Close
          </button>
        </div>
        {drawerBuilt ? (
          <SidebarNav
            nav={nav}
            pathname={pathname}
            collapsed={collapsed}
            onToggle={toggle}
            onNavigate={closeDrawer}
            idPrefix="osd-drawer"
          />
        ) : null}
      </div>
    </div>
  )
}
