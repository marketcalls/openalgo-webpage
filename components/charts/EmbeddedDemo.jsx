"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"

/**
 * One of the standalone demos, embedded live.
 *
 * Order flow and the drawing surface are full applications rather than a few
 * calls, so they are framed from where they already run instead of being
 * reimplemented here. That is the honest arrangement: one copy, maintained
 * beside the engine, so this page cannot end up demonstrating a version of the
 * library that no longer exists.
 *
 * The frame is sandboxed to scripts only. It needs them to draw, and it needs
 * nothing else: no forms, no popups, no top-level navigation and no same-origin
 * access to this page.
 *
 * `loading="lazy"` matters more than usual here. These are the heaviest things
 * on the page and they sit well below the fold, so a visitor who never scrolls
 * to them never pays for them.
 */
export default function EmbeddedDemo({ title, description, src, height = 560 }) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className="overflow-hidden rounded-2xl border">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h3 className="font-bold text-on-surface">{title}</h3>
          <p className="mt-0.5 text-sm text-on-surface-variant">{description}</p>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1 font-label text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
        >
          Open full size
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </figcaption>

      {failed ? (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center"
          style={{ minHeight: 220 }}
        >
          <strong className="text-on-surface">This demo could not be embedded.</strong>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-on-surface-variant underline underline-offset-2 transition-colors hover:text-on-surface"
          >
            Open it in a new tab instead
          </a>
        </div>
      ) : (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts"
          onError={() => setFailed(true)}
          className="block w-full border-0"
          style={{ height }}
        />
      )}
    </figure>
  )
}
