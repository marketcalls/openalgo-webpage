"use client"

import Link from "next/link"
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react"

import DocEnhancerLoader from "./DocEnhancerLoader"
import SearchButton from "./SearchButton"

const STORAGE_KEY = "openalgo.script.manual.collapsed"
const ROOT_ID = "orv-entries"

function readCollapsed() {
  try {
    const list = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")
    return new Set(Array.isArray(list) ? list : [])
  } catch {
    return new Set()
  }
}

function writeCollapsed(set) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // storage blocked: the groups still fold for this visit
  }
}

// ---------------------------------------------------------------------------
// Search
//
// A name is matched first, then the entry's own words: its description, its
// kind and its argument names, which the entries file carries per entry. So
// "sma" finds sma() at once, "hour" finds date.hour(), and "moving average" or
// "stop loss" find the entries about them. Before the entries file has loaded,
// only names are searched.

const RANK = { exact: 0, prefix: 1, name: 2, group: 3, text: 4 }

function rankOf(item, q, tokens, text) {
  const name = item.n.toLowerCase()
  const bare = name.replace(/\(\)$/, "")
  const last = bare.split(".").pop()
  if (bare === q.replace(/\(\)$/, "")) return RANK.exact
  if (bare.startsWith(q) || last.startsWith(q)) return RANK.prefix
  if (name.includes(q)) return RANK.name
  if ((item.s ?? "").toLowerCase().includes(q)) return RANK.group
  if (text && tokens.every((t) => text.includes(t))) return RANK.text
  return -1
}

/** A few words of the entry around the first searched word, as written. */
function excerptOf(text, lower, tokens) {
  const at = lower.indexOf(tokens[0])
  if (at === -1) return ""
  const start = Math.max(0, lower.lastIndexOf(" ", Math.max(0, at - 28)) + 1)
  const end = Math.min(text.length, at + 70)
  return `${start > 0 ? "… " : ""}${text.slice(start, end).trim()}${end < text.length ? " …" : ""}`
}

/**
 * Every entry matching the query, by kind, best first; or null for no query.
 * `texts` is each entry's words as written, `lowered` the same in lower case.
 */
function searchIndex(groups, query, texts, lowered) {
  const q = query.trim().toLowerCase()
  if (!q) return null
  const tokens = q.split(/\s+/).filter(Boolean)
  let best = null
  let count = 0
  const out = groups.map((g) => {
    const hits = []
    g.items.forEach((it, i) => {
      const lower = lowered?.[it.a]
      const r = rankOf(it, q, tokens, lower)
      if (r === -1) return
      const hit = { ...it, r, i, x: r === RANK.text ? excerptOf(texts[it.a], lower, tokens) : "" }
      hits.push(hit)
      if (best === null || r < best.r) best = hit
    })
    hits.sort((a, b) => a.r - b.r || a.i - b.i)
    count += hits.length
    return { ...g, items: hits }
  })
  // The kind holding the best match comes first, so "ema" opens on the
  // functions and not on a variable whose description mentions it.
  const bestOf = (g) => (g.items.length ? g.items[0].r : Infinity)
  out.sort((a, b) => bestOf(a) - bestOf(b))
  return { groups: out, count, best, q }
}

/** The name with the searched part marked. */
function Marked({ name, q }) {
  const at = q ? name.toLowerCase().indexOf(q) : -1
  if (at === -1) return name
  return (
    <>
      {name.slice(0, at)}
      <mark>{name.slice(at, at + q.length)}</mark>
      {name.slice(at + q.length)}
    </>
  )
}

/** The index of every name, grouped by kind, or the search results in its place. */
function NameIndex({ groups, results, collapsed, onToggle, active, onNavigate, idPrefix }) {
  const shown = results ? results.groups : groups
  return (
    <nav aria-label="Every name in the reference manual" className="orv-index">
      {results ? (
        <p className="orv-index-count" aria-live="polite">
          {results.count === 0
            ? "Nothing matches. Try a shorter word, or a word from what the name does."
            : `${results.count} ${results.count === 1 ? "result" : "results"}`}
        </p>
      ) : null}
      {shown.map((g) => {
        if (!g.items.length) return null
        const open = results ? true : !collapsed.has(g.id)
        const listId = `${idPrefix}-${g.id}`
        return (
          <div key={g.id} className="orv-index-group">
            <button type="button" className="osd-nav-toggle" aria-expanded={open} aria-controls={listId} onClick={() => onToggle(g.id)}>
              <span>{g.title}</span>
              <span className="osd-nav-count">{g.items.length}</span>
              <span className="osd-chevron" aria-hidden="true" />
            </button>
            <ul id={listId} hidden={!open}>
              {g.items.map((it) => (
                <li key={it.a}>
                  <a
                    href={`#${it.a}`}
                    onClick={onNavigate}
                    className={`orv-index-link${active === it.a ? " is-active" : ""}${it.x ? " has-excerpt" : ""}`}
                    aria-current={active === it.a ? "location" : undefined}
                    title={it.s ? `${it.n}, ${it.s}` : it.n}
                  >
                    <code>
                      <Marked name={it.n} q={results?.q} />
                    </code>
                    {it.x ? <span className="orv-index-excerpt">{it.x}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}

/** The search box above the index. Enter opens the best match; Escape clears it. */
function SearchBox({ value, onChange, inputRef, total, best, onJump }) {
  const onKeyDown = (e) => {
    if (e.key === "Escape" && value) {
      e.preventDefault()
      onChange("")
      return
    }
    if (e.key === "Enter" && best) {
      e.preventDefault()
      onJump(best.a)
    }
  }
  // The sidebar and the drawer each hold a box, so the ids follow which one.
  const id = inputRef ? "orv-search-input" : "orv-search-drawer"
  return (
    <div className="orv-filter" role="search">
      <label htmlFor={id} className="sr-only">
        Search the reference manual
      </label>
      <input
        id={id}
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search"
        aria-describedby={`${id}-hint`}
        autoComplete="off"
        spellCheck={false}
        className="orv-filter-input"
      />
      {value ? null : (
        <kbd className="osd-kbd orv-filter-kbd" aria-hidden="true">
          /
        </kbd>
      )}
      <p id={`${id}-hint`} className="sr-only">
        Searches the {total} names and what each one does. Enter opens the best match.
      </p>
    </div>
  )
}

/**
 * The OpenScript v1 reference manual: an index of every implemented name on
 * the left, every entry on the right in one scroll, the way a language manual
 * is read. The index comes with the page; the entries are one static file
 * fetched after it, painted in the same code panels and read-only Monaco
 * viewers as the docs.
 */
export default function ReferenceManual({ index, repo }) {
  const groups = index.groups
  const total = useMemo(() => groups.reduce((n, g) => n + g.items.length, 0), [groups])
  const order = useMemo(() => new Map(groups.flatMap((g) => g.items).map((it, i) => [it.a, i])), [groups])

  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [active, setActive] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const [drawerBuilt, setDrawerBuilt] = useState(false)
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  const sidebarRef = useRef(null)
  const drawerRef = useRef(null)
  const menuRef = useRef(null)
  const filterRef = useRef(null)

  useEffect(() => setCollapsed(readCollapsed()), [])

  // The entries: one file, fetched once and cached by its versioned URL.
  useEffect(() => {
    let live = true
    fetch(index.data)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((d) => live && setData(d))
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [index.data])

  const html = useMemo(() => {
    if (!data) return ""
    return data.groups
      .map(
        (g) =>
          `<section class="orv-group" aria-labelledby="group-${g.id}"><h2 class="orv-group-title" id="group-${g.id}">${g.title}<span>${g.items.length}</span></h2>${g.items.map((it) => data.html[it.a] ?? "").join("\n")}</section>`,
      )
      .join("\n")
  }, [data])

  // Arriving with a #name: go there once the entries are on the page. Twice,
  // because entries above the target lay out as they come into view.
  useEffect(() => {
    if (!html) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const go = () => document.getElementById(id)?.scrollIntoView({ block: "start" })
    go()
    const t = setTimeout(go, 250)
    setActive(id)
    return () => clearTimeout(t)
  }, [html])

  // The entry at the top of the reading area is the active one in the index.
  useEffect(() => {
    if (!html) return undefined
    const root = document.getElementById(ROOT_ID)
    if (!root) return undefined
    const visible = new Set()
    let frame = 0
    const pick = () => {
      frame = 0
      let best = null
      for (const id of visible) if (best === null || (order.get(id) ?? 1e9) < (order.get(best) ?? 1e9)) best = id
      if (best) setActive(best)
    }
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          if (r.isIntersecting) visible.add(r.target.id)
          else visible.delete(r.target.id)
        }
        if (!frame) frame = requestAnimationFrame(pick)
      },
      // The band starts just below where an entry lands when it is linked to
      // (the two bars, 7rem, plus its 1rem scroll margin), so the entry above
      // it, whose bottom edge sits on that line, is not the active one.
      { rootMargin: "-140px 0px -55% 0px" },
    )
    root.querySelectorAll(".orv-entry").forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [html, order])

  // Keep the active name in view inside the index, without moving the page.
  useEffect(() => {
    const box = sidebarRef.current
    const link = box?.querySelector(".orv-index-link.is-active")
    if (!box || !link) return
    const top = link.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop
    if (top < box.scrollTop + 120 || top > box.scrollTop + box.clientHeight - 60) {
      box.scrollTop = Math.max(0, top - box.clientHeight / 3)
    }
  }, [active])

  // "/" focuses the filter, as in most references.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      e.preventDefault()
      if (window.matchMedia("(min-width: 1024px)").matches) filterRef.current?.focus()
      else {
        setDrawerBuilt(true)
        setDrawer(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!drawer) return undefined
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape") setDrawer(false)
    }
    window.addEventListener("keydown", onKey)
    requestAnimationFrame(() => drawerRef.current?.querySelector(".orv-filter-input")?.focus({ preventScroll: true }))
    return () => {
      document.documentElement.style.overflow = previous
      window.removeEventListener("keydown", onKey)
      menuRef.current?.focus({ preventScroll: true })
    }
  }, [drawer])

  const toggle = useCallback((id) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      writeCollapsed(next)
      return next
    })
  }, [])

  const closeDrawer = useCallback(() => setDrawer(false), [])

  // Scrolled here rather than by assigning location.hash: the router takes a
  // hash assigned from script as a navigation and leaves the page where it is.
  const jump = useCallback((anchor) => {
    setDrawer(false)
    window.history.pushState(null, "", `#${anchor}`)
    document.getElementById(anchor)?.scrollIntoView({ block: "start" })
    setActive(anchor)
  }, [])

  const counts = index.counts
  const summary = [
    ["variables", "variables"],
    ["constants", "constants"],
    ["functions", "functions"],
    ["keywords", "keywords"],
    ["types", "types"],
    ["operators", "operators"],
    ["declarations", "declarations"],
  ].filter(([k]) => counts[k])

  // Lowered once when the entries arrive, not on every key.
  const lowered = useMemo(
    () => (data?.search ? Object.fromEntries(Object.entries(data.search).map(([a, t]) => [a, t.toLowerCase()])) : null),
    [data],
  )
  const results = useMemo(
    () => searchIndex(groups, deferredQuery, data?.search, lowered),
    [groups, deferredQuery, data, lowered],
  )

  const sidebar = (idPrefix, onNavigate) => (
    <>
      <SearchBox
        value={query}
        onChange={setQuery}
        inputRef={idPrefix === "orv-side" ? filterRef : undefined}
        total={total}
        best={results?.best ?? null}
        onJump={jump}
      />
      <NameIndex
        groups={groups}
        results={results}
        collapsed={collapsed}
        onToggle={toggle}
        active={active}
        onNavigate={onNavigate}
        idPrefix={idPrefix}
      />
    </>
  )

  return (
    <div className="osd-shell orv-shell" data-own-slash="">
      <div className="osd-docbar">
        <div className="osd-docbar-inner">
          <button
            ref={menuRef}
            type="button"
            className="osd-docbar-menu"
            aria-expanded={drawer}
            aria-controls="orv-drawer"
            onClick={() => {
              setDrawerBuilt(true)
              setDrawer(true)
            }}
          >
            Index
          </button>
          <Link href="/script" prefetch={false} className="osd-docbar-brand">
            OpenScript
          </Link>
          <span className="osd-docbar-version">v1</span>
          <span className="osd-docbar-sub">Reference manual</span>
          <div className="osd-docbar-end">
            <SearchButton />
            <Link href="/script/getting-started/introduction" prefetch={false} className="osd-docbar-link">
              Docs
            </Link>
            <a href={repo} target="_blank" rel="noopener noreferrer" className="osd-docbar-link">
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="osd-frame">
        <aside className="osd-sidebar orv-sidebar" ref={sidebarRef}>
          {sidebar("orv-side")}
        </aside>

        <main className="orv-main">
          <header className="orv-intro">
            <p className="orv-eyebrow">OpenScript language reference</p>
            <h1>Reference manual, version 1</h1>
            <p className="orv-lede">
              Every name you can use in an OpenScript (OpenAlgo Script) file today, with its syntax, its arguments, what it
              returns and a working example. The library facts are read from openalgo-script {index.version}, the compiler
              the /trading editor runs.
            </p>
            <ul className="orv-counts">
              {summary.map(([k, label]) => (
                <li key={k}>
                  <a href={`#group-${k}`}>
                    <strong>{counts[k]}</strong> {label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="orv-note">
              Search with <kbd className="osd-kbd">/</kbd>: by name, or by what a name does, such as &ldquo;moving
              average&rdquo; or &ldquo;stop&rdquo;. Link to any entry by its address, such as{" "}
              <a href="#fn_ema">
                <code>#fn_ema</code>
              </a>
              . {index.planned} more names are part of the language&apos;s design and not available yet; the{" "}
              <Link href="/script/resources/release-notes" prefetch={false}>
                release notes
              </Link>{" "}
              list them. For the ideas behind the names, read the{" "}
              <Link href="/script/getting-started/introduction" prefetch={false}>
                documentation
              </Link>
              .
            </p>
          </header>

          {failed ? (
            <p className="orv-status" role="alert">
              The entries could not be loaded. Reload the page, or read the same entries in the{" "}
              <Link href="/script/reference/technical-analysis" prefetch={false}>
                reference pages of the documentation
              </Link>
              .
            </p>
          ) : !html ? (
            <p className="orv-status" aria-live="polite">
              Loading {total} entries.
            </p>
          ) : null}

          {html ? (
            <>
              <div id={ROOT_ID} className="osd-doc orv-entries" dangerouslySetInnerHTML={{ __html: html }} />
              <DocEnhancerLoader rootId={ROOT_ID} />
            </>
          ) : null}
        </main>
      </div>

      <div className={`osd-drawer-scrim${drawer ? " is-open" : ""}`} onClick={closeDrawer} aria-hidden="true" />
      <div
        id="orv-drawer"
        ref={drawerRef}
        className={`osd-drawer orv-drawer${drawer ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Index of every name"
        aria-hidden={!drawer}
        inert={drawer ? undefined : true}
      >
        <div className="osd-drawer-head">
          <span className="osd-docbar-brand">Index</span>
          <button type="button" className="osd-drawer-close" onClick={closeDrawer}>
            Close
          </button>
        </div>
        {drawerBuilt ? sidebar("orv-drawer", closeDrawer) : null}
      </div>
    </div>
  )
}
