"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

import { useI18n } from "@/components/i18n/LanguageProvider"

/**
 * The library's search, category pills and card grid.
 *
 * Every card is in the server render, so the whole library is crawlable
 * without script; the browser only filters. The page takes "/" for its own
 * search (data-own-slash), and Ctrl+K still opens the site search.
 */
const PAGE = 24

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim()

export default function LibraryBrowser({ entries, categories, dataFrom, dataTo }) {
  const { t } = useI18n()
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
      const target = e.target
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const haystack = useMemo(() => entries.map((e) => norm(`${e.title} ${e.category} ${e.summary} ${e.slug}`)), [entries])

  const filtered = useMemo(() => {
    const terms = norm(query).split(" ").filter(Boolean)
    return entries.filter((e, i) => (category === "All" || e.category === category) && terms.every((term) => haystack[i].includes(term)))
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
    <>
      <div className="osl-hero">
        <p className="font-label text-label-md uppercase text-on-surface-variant">
          <Link href="/script" prefetch={false} className="hover:text-on-surface">
            OpenScript
          </Link>{" "}
          {t("slib.eyebrow")}
        </p>
        <h1 className="osl-hero-title mt-4">{t("slib.title")}</h1>
        <p className="osl-hero-lede">
          {t("slib.lede")
            .replace("{count}", String(entries.length))
            .replace("{from}", String(dataFrom ?? ""))
            .replace("{to}", String(dataTo ?? ""))}
        </p>
      </div>
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
            placeholder={t("slib.searchPlaceholder")}
            aria-label={t("slib.searchAria")}
          />
          {query ? null : (
            <span className="osl-search-key" aria-hidden="true">
              /
            </span>
          )}
        </div>

        <div className="osl-pills" role="group" aria-label={t("slib.categoriesAria")}>
          {[{ name: "All", count: entries.length }, ...categories].map((c) => (
            <button key={c.name} type="button" className={`osl-pill${category === c.name ? " is-active" : ""}`} aria-pressed={category === c.name} onClick={() => pick(c.name)}>
              {c.name === "All" ? t("slib.all") : c.name}
              <span className="osl-pill-count">{c.count}</span>
            </button>
          ))}
        </div>

        <p className="osl-count" aria-live="polite">
          {(filtered.length === 1 ? t("slib.countOne") : t("slib.countMany")).replace("{n}", String(filtered.length))}
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
                    <span>{t("slib.viewIndicator")}</span>
                    <span>{t("slib.lines").replace("{n}", String(e.lines))}</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="osl-empty">{t("slib.empty")}</p>
        )}

        {filtered.length > shown ? (
          <div className="osl-more">
            <span>
              {t("slib.shownOf")
                .replace("{shown}", String(shown))
                .replace("{total}", String(filtered.length))}
            </span>
            <button type="button" className="osl-pill" onClick={() => setShown((n) => n + PAGE * 2)}>
              {t("slib.showMore")}
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
    </>
  )
}

