"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"

/**
 * The /script search palette. Opened by any SearchButton, by Ctrl+K or Cmd+K,
 * and by "/" when the reader is not typing somewhere. The index
 * (public/script/search-index.json, written by the docs generator) is fetched
 * the first time the palette opens, never before.
 */
export const SEARCH_EVENT = "osd:search"

const GROUPS = [
  { k: "page", title: "Pages", max: 6 },
  { k: "entry", title: "Reference", max: 8 },
  { k: "error", title: "Errors", max: 6 },
  { k: "heading", title: "Headings", max: 6 },
]
const KIND_WEIGHT = { page: 30, entry: 20, error: 10, heading: 0 }

let indexPromise = null
function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch("/script/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((items) =>
        (Array.isArray(items) ? items : []).map((it, i) => ({
          ...it,
          i,
          lt: String(it.t || "").toLowerCase(),
          ld: String(it.d || "").toLowerCase(),
          ls: String(it.s || "").toLowerCase(),
        })),
      )
      .catch((err) => {
        indexPromise = null
        throw err
      })
  }
  return indexPromise
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Title matches outrank description matches; every word must match somewhere. */
function score(item, q, terms, wordStart) {
  const t = item.lt
  const bare = t.endsWith("()") ? t.slice(0, -2) : t
  let s = 0
  if (t === q || bare === q) s = 1000
  else if (t.startsWith(q)) s = 800 - Math.min(t.length, 120)
  else if (wordStart.test(t)) s = 600 - Math.min(t.length, 120)
  else if (t.includes(q)) s = 450

  let inTitle = 0
  let elsewhere = 0
  for (const term of terms) {
    if (t.includes(term)) inTitle++
    else if (item.ld.includes(term) || item.ls.includes(term)) elsewhere++
    else return 0
  }
  if (s === 0) s = inTitle * 90 + elsewhere * 15
  return s + KIND_WEIGHT[item.k]
}

function search(items, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)
  const wordStart = new RegExp(`(^|[\\s._(/-])${escapeRe(q)}`)
  const scored = []
  for (const item of items) {
    const s = score(item, q, terms, wordStart)
    if (s > 0) scored.push({ item, s })
  }
  scored.sort((a, b) => b.s - a.s || a.item.i - b.item.i)
  return GROUPS.map((g) => ({
    ...g,
    items: scored.filter((x) => x.item.k === g.k).slice(0, g.max).map((x) => x.item),
  })).filter((g) => g.items.length)
}

function Highlight({ text, query }) {
  const q = query.trim()
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="osd-search-mark">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

function isTyping(target) {
  if (!(target instanceof Element)) return false
  return Boolean(target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true'], .monaco-editor"))
}

export default function DocSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [items, setItems] = useState(null)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const restoreRef = useRef(null)
  const listId = useId()

  const show = useCallback(() => {
    restoreRef.current = document.activeElement
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    const el = restoreRef.current
    if (el && typeof el.focus === "function") requestAnimationFrame(() => el.focus({ preventScroll: true }))
  }, [])

  useEffect(() => {
    const onOpen = () => show()
    const onKey = (e) => {
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        setOpen((o) => {
          if (!o) restoreRef.current = document.activeElement
          return !o
        })
      } else if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener(SEARCH_EVENT, onOpen)
    window.addEventListener("keydown", onKey, true)
    return () => {
      window.removeEventListener(SEARCH_EVENT, onOpen)
      window.removeEventListener("keydown", onKey, true)
    }
  }, [show])

  useEffect(() => {
    if (!open) return undefined
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      document.documentElement.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open || items) return
    let cancelled = false
    setFailed(false)
    loadIndex()
      .then((list) => {
        if (!cancelled) setItems(list)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [open, items])

  const groups = useMemo(() => (items ? search(items, query) : []), [items, query])
  const starters = useMemo(() => (items ? items.filter((x) => x.k === "page").slice(0, 6) : []), [items])
  const flat = useMemo(() => {
    if (query.trim()) return groups.flatMap((g) => g.items)
    return starters
  }, [groups, starters, query])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [active])

  const go = useCallback(
    (item) => {
      if (!item) return
      setOpen(false)
      setQuery("")
      router.push(item.u)
    },
    [router],
  )

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => (flat.length ? (a + 1) % flat.length : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      go(flat[active])
    } else if (e.key === "Escape") {
      e.preventDefault()
      hide()
    } else if (e.key === "Tab") {
      // The input is the only control that takes focus; arrows move the choice.
      e.preventDefault()
    }
  }

  if (!open) return null

  let index = -1
  const row = (item) => {
    index += 1
    const i = index
    const selected = i === active
    const mono = item.k === "entry" || item.k === "error"
    return (
      <li
        key={`${item.k}:${item.u}`}
        id={`${listId}-${i}`}
        role="option"
        aria-selected={selected}
        data-index={i}
        className={`osd-search-row${selected ? " is-active" : ""}`}
        onMouseMove={() => {
          if (!selected) setActive(i)
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          go(item)
        }}
      >
        <span className="osd-search-row-main">
          <span className={mono ? "osd-search-title is-mono" : "osd-search-title"}>
            <Highlight text={item.t} query={query} />
          </span>
          {item.s ? <span className="osd-search-where">{item.s}</span> : null}
        </span>
        {item.d ? <span className="osd-search-desc">{item.d}</span> : null}
      </li>
    )
  }

  const hasQuery = Boolean(query.trim())

  return (
    <div className="osd-search" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && hide()}>
      <div className="osd-search-panel" role="dialog" aria-modal="true" aria-label="Search the OpenScript documentation">
        <div className="osd-search-field">
          <label htmlFor={`${listId}-input`} className="osd-search-label">
            Search
          </label>
          <input
            ref={inputRef}
            id={`${listId}-input`}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${listId}-list`}
            aria-activedescendant={flat.length ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Pages, functions, error codes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
          />
          <button type="button" className="osd-kbd osd-search-esc" onClick={hide}>
            Esc
          </button>
        </div>

        <div className="osd-search-results" ref={listRef}>
          {failed ? (
            <p className="osd-search-empty">The search index did not load. Check your connection and open search again.</p>
          ) : !items ? (
            <p className="osd-search-empty">Loading the index</p>
          ) : hasQuery && !groups.length ? (
            <p className="osd-search-empty">
              Nothing matches <strong>{query.trim()}</strong>. Try a function name such as <code>ema</code> or an error code such as{" "}
              <code>OS2001</code>.
            </p>
          ) : !items.length ? (
            <p className="osd-search-empty">The documentation is still being written. Pages appear here as they are published.</p>
          ) : (
            <ul id={`${listId}-list`} role="listbox" aria-label="Results">
              {hasQuery ? (
                groups.map((g) => (
                  <li key={g.k} role="presentation" className="osd-search-group">
                    <p className="osd-search-group-title">{g.title}</p>
                    <ul role="presentation">{g.items.map(row)}</ul>
                  </li>
                ))
              ) : (
                <li role="presentation" className="osd-search-group">
                  <p className="osd-search-group-title">Start here</p>
                  <ul role="presentation">{starters.map(row)}</ul>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="osd-search-foot" aria-hidden="true">
          <span>
            <span className="osd-kbd">Up</span> <span className="osd-kbd">Down</span> to move
          </span>
          <span>
            <span className="osd-kbd">Enter</span> to open
          </span>
          <span>
            <span className="osd-kbd">Esc</span> to close
          </span>
        </div>
      </div>
    </div>
  )
}
