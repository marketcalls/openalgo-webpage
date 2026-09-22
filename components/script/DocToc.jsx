"use client"

import { useEffect, useMemo, useRef, useState } from "react"

// Headings closer than this to the top of the window count as the one being read
// (the site navbar and the docs bar together are 7rem tall).
const READ_LINE = 136
// Above this many entries, only the group being read shows its children.
const COMPACT_AFTER = 28

const isCodeName = (text) => /^[A-Za-z_][\w.]*(\(\))?$/.test(text)

/**
 * "On this page": level 2 headings with their level 3 headings nested under
 * them, and the one being read marked as the page scrolls. Reference pages
 * list dozens of entries, so there the list folds to the group being read and
 * scrolls on its own.
 */
export default function DocToc({ toc }) {
  const items = useMemo(() => (toc || []).filter((h) => h.level === 2 || h.level === 3), [toc])
  const groups = useMemo(() => {
    const out = []
    let current = null
    for (const h of items) {
      if (h.level === 2 || !current) {
        current = { ...h, children: [] }
        out.push(current)
      } else current.children.push(h)
    }
    return out
  }, [items])
  const compact = items.length > COMPACT_AFTER
  const [active, setActive] = useState(items[0]?.id)
  const boxRef = useRef(null)

  useEffect(() => {
    const ids = items.map((h) => h.id)
    if (!ids.length) return undefined
    let offsets = []
    let frame = 0

    const measure = () => {
      offsets = ids.map((id) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY
      })
    }
    const update = () => {
      const line = window.scrollY + READ_LINE
      let found = 0
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] <= line) found = i
        else if (offsets[i] !== Number.POSITIVE_INFINITY) break
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom && window.scrollY > 0) {
        for (let i = offsets.length - 1; i >= 0; i--) {
          if (offsets[i] !== Number.POSITIVE_INFINITY && offsets[i] > line - window.innerHeight) {
            found = Math.max(found, i)
            break
          }
        }
      }
      setActive(ids[found])
    }
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          update()
        })
      }
    }
    const remeasure = () => {
      measure()
      schedule()
    }

    measure()
    update()
    const ro = new ResizeObserver(remeasure)
    ro.observe(document.body)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", remeasure)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", remeasure)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  // Keep the marked entry inside the list's own scroll box.
  useEffect(() => {
    const box = boxRef.current
    const link = box?.querySelector(`a[data-id="${CSS.escape(active || "")}"]`)
    if (!box || !link) return
    const top = link.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop
    if (top < box.scrollTop + 24 || top > box.scrollTop + box.clientHeight - 48) {
      box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3) })
    }
  }, [active])

  if (!items.length) return null

  const activeGroup = groups.find((g) => g.id === active || g.children.some((c) => c.id === active))?.id

  return (
    <nav className="osd-toc" aria-label="On this page">
      <p className="osd-toc-title">On this page</p>
      <ol className="osd-toc-list" ref={boxRef}>
        {groups.map((g) => {
          const showChildren = g.children.length > 0 && (!compact || g.id === activeGroup)
          return (
            <li key={g.id} className={g.id === activeGroup ? "is-open" : undefined}>
              <a
                href={`#${g.id}`}
                data-id={g.id}
                className={`osd-toc-link${g.level === 3 ? " is-sub" : ""}${g.id === active ? " is-active" : ""}${isCodeName(g.text) ? " is-code" : ""}`}
                aria-current={g.id === active ? "location" : undefined}
              >
                <span>{g.text}</span>
                {compact && g.children.length ? <span className="osd-toc-count">{g.children.length}</span> : null}
              </a>
              {showChildren ? (
                <ol>
                  {g.children.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        data-id={c.id}
                        className={`osd-toc-link is-sub${c.id === active ? " is-active" : ""}${isCodeName(c.text) ? " is-code" : ""}`}
                        aria-current={c.id === active ? "location" : undefined}
                      >
                        {c.text}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
