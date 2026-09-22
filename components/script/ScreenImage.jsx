"use client"

import { useEffect, useRef, useState } from "react"

import { openLightbox } from "./lightbox"

/**
 * A screenshot that opens larger on click and steps aside when its file is not
 * there yet (screens are added while the docs are written). An image that failed
 * before hydration fires no error event React can hear, so the mount also checks
 * whether it loaded.
 */
export default function ScreenImage({ src, alt, caption, className = "", fallback = null, eager = false }) {
  const [broken, setBroken] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setBroken(true)
  }, [src])

  if (broken) return fallback

  return (
    <figure className={`osd-screen ${className}`}>
      <button
        type="button"
        className="osd-screen-button"
        onClick={() => openLightbox({ src, alt, caption })}
        aria-label={`${alt}. Open larger`}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setBroken(true)}
        />
      </button>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
