"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * One interactive demo card: a title, a row of tabs and a real chart.
 *
 * The charts on this page are the engine running, not screenshots of it. That
 * is the whole claim the page is making, so a reader who switches a tab and
 * watches the chart redraw has verified it themselves in about a second.
 *
 * The library is imported inside the effect, never at module scope, so it stays
 * out of the server bundle. The site deploys to a Cloudflare Worker with a hard
 * script-size ceiling and a charting engine would eat a large share of it.
 *
 * Each `build` receives the module, the active tab and the bars to draw, and
 * returns the chart it made, which is what the cleanup destroys. The bars come
 * from the caller so that every card on the page shows the same real
 * instrument: a demo drawing a random walk is a squiggle to anyone who reads
 * charts for a living, and this page is read by exactly those people.
 *
 * A build that throws leaves a readable message rather than an empty frame.
 * People come here deciding whether the library is solid, and a silently blank
 * box answers that question the wrong way.
 */
export default function InteractiveChart({ title, note, tabs, build, data, height = 320, className }) {
  const host = useRef(null)
  const [tab, setTab] = useState(tabs?.[0]?.key ?? "")
  const [error, setError] = useState(null)

  useEffect(() => {
    let chart
    let cancelled = false

    ;(async () => {
      try {
        const lib = await import("openalgo-charts")
        if (cancelled || !host.current) return
        host.current.innerHTML = ""
        setError(null)
        chart = build(host.current, lib, tab, data)
      } catch (caught) {
        if (!cancelled) setError(caught?.message ?? String(caught))
      }
    })()

    return () => {
      cancelled = true
      try {
        chart?.destroy?.()
      } catch {
        // Already gone. A demo card must never take the page down on unmount.
      }
    }
  }, [tab, build, data])

  return (
    <div className={cn("overflow-hidden rounded-2xl border bg-surface-bright", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h3 className="font-bold text-on-surface">{title}</h3>
          {note && <p className="mt-0.5 font-label text-label-md text-on-surface-variant">{note}</p>}
        </div>
        {tabs && (
          <div className="flex flex-wrap gap-1">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                aria-pressed={item.key === tab}
                className={cn(
                  "rounded-full px-3 py-1 font-label text-label-md transition-colors",
                  item.key === tab
                    ? "bg-surface-container font-semibold text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <div ref={host} style={{ height }} className="w-full" />
        {error && (
          <div
            role="alert"
            className="absolute inset-0 flex items-center justify-center bg-surface-bright px-6 text-center text-sm text-on-surface-variant"
          >
            This demo could not start: {error}
          </div>
        )}
      </div>
    </div>
  )
}
