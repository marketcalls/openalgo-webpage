"use client"

import { useSelectedLayoutSegment } from "next/navigation"

import DocsShell from "./DocsShell"

// Routes under a docs section that bring their own frame. The reference manual
// at /script/reference/v1 is one page with its own index of every name, so the
// docs sidebar around it would be a second, competing index.
const OWN_FRAME = new Set(["v1"])

/** The docs frame, unless the page below this section draws its own. */
export default function SectionFrame({ nav, version, repo, children }) {
  const segment = useSelectedLayoutSegment()
  if (OWN_FRAME.has(segment)) return children
  return (
    <DocsShell nav={nav} version={version} repo={repo}>
      {children}
    </DocsShell>
  )
}
