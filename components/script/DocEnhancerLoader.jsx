"use client"

import dynamic from "next/dynamic"

// Client only: the enhancer is what pulls in Monaco, and ssr:false keeps it
// (and everything it imports) out of the Worker's server bundle.
const DocEnhancer = dynamic(() => import("./DocEnhancer"), { ssr: false })

export default function DocEnhancerLoader({ rootId }) {
  return <DocEnhancer rootId={rootId} />
}
