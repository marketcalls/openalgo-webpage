"use client"

import { useEffect, useState } from "react"

import { SEARCH_EVENT } from "./DocSearch"

/** Opens the search palette. The shortcut hint follows the reader's platform. */
export default function SearchButton({ className = "", label = "Search the docs" }) {
  const [mod, setMod] = useState("Ctrl")

  useEffect(() => {
    const platform = navigator.userAgentData?.platform || navigator.platform || ""
    if (/mac|iphone|ipad/i.test(platform)) setMod("Cmd")
  }, [])

  return (
    <button
      type="button"
      className={`osd-search-button ${className}`}
      onClick={() => window.dispatchEvent(new CustomEvent(SEARCH_EVENT))}
      aria-keyshortcuts="Control+K Meta+K"
    >
      <span className="osd-search-button-label">{label}</span>
      <span className="osd-kbd" aria-hidden="true">
        {mod} K
      </span>
    </button>
  )
}
