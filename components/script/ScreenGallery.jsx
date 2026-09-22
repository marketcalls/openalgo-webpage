"use client"

import { useEffect, useState } from "react"

import { openLightbox } from "./lightbox"

/**
 * The /trading screenshots listed in content/script/screens.json: one large
 * view with its caption, and a strip of every screen to pick from. Files are
 * checked before they are shown, because screens are captured while the docs
 * are written and a listed file may not exist yet.
 */
export default function ScreenGallery({ screens }) {
  const [available, setAvailable] = useState(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all(
      screens.map((s) =>
        fetch(`/script/screens/${s.file}`, { method: "HEAD" })
          .then((r) => r.ok && (r.headers.get("content-type") || "").startsWith("image/"))
          .catch(() => false),
      ),
    ).then((oks) => {
      if (!cancelled) setAvailable(screens.filter((_, i) => oks[i]))
    })
    return () => {
      cancelled = true
    }
  }, [screens])

  if (available === null) {
    return (
      <div className="osd-gallery">
        <div className="osd-gallery-stage is-empty">
          <span>Loading the screenshots</span>
        </div>
      </div>
    )
  }

  if (!available.length) {
    return (
      <div className="osd-gallery">
        <div className="osd-gallery-stage is-empty">
          <span>Screenshots of the /trading page are being captured. They appear here as they are added.</span>
        </div>
      </div>
    )
  }

  const i = Math.min(index, available.length - 1)
  const shot = available[i]
  const src = `/script/screens/${shot.file}`
  const go = (next) => setIndex((next + available.length) % available.length)

  return (
    <div
      className="osd-gallery"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault()
          go(i + 1)
        } else if (e.key === "ArrowLeft") {
          e.preventDefault()
          go(i - 1)
        }
      }}
    >
      <div className="osd-gallery-stage">
        <button
          type="button"
          className="osd-gallery-open"
          onClick={() => openLightbox({ src, alt: shot.alt, caption: shot.caption })}
          aria-label={`${shot.alt}. Open larger`}
        >
          <img key={src} src={src} alt={shot.alt} decoding="async" />
        </button>
      </div>

      <div className="osd-gallery-meta">
        <p className="osd-gallery-caption">{shot.caption || shot.alt}</p>
        <div className="osd-gallery-nav">
          <span className="osd-gallery-count">
            {i + 1} of {available.length}
          </span>
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous screenshot">
            Previous
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next screenshot">
            Next
          </button>
        </div>
      </div>

      <div className="osd-gallery-thumbs" aria-label="All screenshots">
        {available.map((s, n) => (
          <button
            key={s.id}
            type="button"
            className={`osd-gallery-thumb${n === i ? " is-active" : ""}`}
            aria-current={n === i ? "true" : undefined}
            aria-label={s.alt}
            onClick={() => setIndex(n)}
          >
            <img src={`/script/screens/${s.file}`} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  )
}
