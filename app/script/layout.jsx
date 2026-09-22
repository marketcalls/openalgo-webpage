import DocSearch from "@/components/script/DocSearch"

import "./script-docs.css"

// Every /script route (the landing page and the docs) shares the docs styles
// and the search palette, so Ctrl+K and Cmd+K work anywhere under /script.
export default function ScriptLayout({ children }) {
  return (
    <>
      {children}
      <DocSearch />
    </>
  )
}
