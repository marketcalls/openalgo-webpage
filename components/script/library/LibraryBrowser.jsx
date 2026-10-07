"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

/**
 * The library's search, category pills and card grid.
 *
 * Every card is in the server render, so the whole library is crawlable
 * without script; the browser only filters. The page takes "/" for its own
 * search (data-own-slash), and Ctrl+K still opens the site search.
 */
const PAGE = 24

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim()

export default function LibraryBrowser({ entries, categories }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [shown, setShown] = useState(PAGE)
  const inputRef = useRef(null)

  // A study page links to its category as ?category=<name>.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("category")
    if (wanted && categories.some((c) => c.name === wanted)) setCategory(wanted)
  }, [categories])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const haystack = useMemo(() => entries.map((e) => norm(`${e.title} ${e.category} ${e.summary} ${e.slug}`)), [entries])

  const filtered = useMemo(() => {
    const terms = norm(query).split(" ").filter(Boolean)
    return entries.filter((e, i) => (category === "All" || e.category === category) && terms.every((t) => haystack[i].includes(t)))
  }, [entries, haystack, query, category])

  const pick = (name) => {
    setCategory(name)
    setShown(PAGE)
    const url = new URL(window.location.href)
    if (name === "All") url.searchParams.delete("category")
    else url.searchParams.set("category", name)
    window.history.replaceState(null, "", url)
  }

  const visible = filtered.slice(0, shown)

  return (
    <div data-own-slash="">
      <div className="osl-search">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShown(PAGE)
          }}
          placeholder="Search the library: RSI, Bollinger, Kalman filter, order block..."
          aria-label="Search the library"
        />
        {query ? null : (
          <span className="osl-search-key" aria-hidden="true">
            /
          </span>
        )}
      </div>

      <div className="osl-pills" role="group" aria-label="Categories">
        {[{ name: "All", count: entries.length }, ...categories].map((c) => (
          <button key={c.name} type="button" className={`osl-pill${category === c.name ? " is-active" : ""}`} aria-pressed={category === c.name} onClick={() => pick(c.name)}>
            {c.name}
            <span className="osl-pill-count">{c.count}</span>
          </button>
        ))}
      </div>

      <p className="osl-count" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "indicator" : "indicators"}
      </p>

      {filtered.length ? (
        <div className="osl-grid">
          {visible.map((e) => (
            <Link key={e.slug} href={`/script/library/${e.slug}`} prefetch={false} className="osl-card-link">
              <img className="osl-thumb" src={`/script/library/thumbs/${e.slug}.svg`} alt={`${e.title} on BTCUSD hourly candles`} loading="lazy" width={640} height={360} />
              <span className="osl-card-text">
                <span className="osl-card-cat">{e.category}</span>
                <span className="osl-card-name">{e.title}</span>
                <span className="osl-card-sum">{e.summary}</span>
                <span className="osl-card-foot">
                  <span>View indicator</span>
                  <span>{e.lines} lines</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="osl-empty">Nothing in the library matches that search.</p>
      )}

      {filtered.length > shown ? (
        <div className="osl-more">
          <span>
            {shown} of {filtered.length} shown
          </span>
          <button type="button" className="osl-pill" onClick={() => setShown((n) => n + PAGE * 2)}>
            Show more indicators
          </button>
        </div>
      ) : null}

      {/* Every study stays reachable without script: the cards past the first
          page are listed as plain links for crawlers and no-script readers. */}
      <noscript>
        <ul>
          {entries.map((e) => (
            <li key={e.slug}>
              <a href={`/script/library/${e.slug}`}>{e.title}</a>
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  )
}
