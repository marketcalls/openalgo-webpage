"use client"

import { useEffect } from "react"

import { openLightbox } from "./lightbox"
import { baseOptions, loadMonaco } from "./monaco/loader"

/**
 * Upgrades a docs page's generated HTML once it is on screen:
 *
 * - every .osd-code block gets a toolbar (its title or language, Copy, and an
 *   "Error example" badge where the block is meant to fail) and a line gutter;
 * - blocks near the viewport are handed to a read-only Monaco viewer, with the
 *   hover and colours of the OpenScript language, while the static block stays
 *   underneath at exactly the same size until Monaco has painted;
 * - screenshots open in a lightbox.
 *
 * Reference pages carry 60 blocks and more, so at most CAP viewers are alive at
 * a time. Blocks far off screen give theirs back and show the static block
 * again, which is always there and always readable, with or without script.
 *
 * Loaded with next/dynamic and ssr:false, so Monaco never enters the server
 * bundle.
 */
const CAP = 24

const MONACO_LANG = {
  openscript: "openscript",
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  bash: "shell",
  json: "json",
  plaintext: "plaintext",
}

const LABEL = {
  openscript: "OpenScript",
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  bash: "Shell",
  json: "JSON",
  plaintext: "Text",
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.style.position = "fixed"
    area.style.opacity = "0"
    document.body.appendChild(area)
    area.select()
    let ok = false
    try {
      ok = document.execCommand("copy")
    } catch {
      ok = false
    }
    area.remove()
    return ok
  }
}

function prepare(block) {
  const pre = block.querySelector(":scope > pre")
  const code = pre?.querySelector("code")
  const text = (code?.textContent ?? "").replace(/\n+$/, "")
  const lang = block.dataset.lang || "plaintext"

  if (!block.classList.contains("is-ready")) {
    const bar = document.createElement("div")
    bar.className = "osd-code-bar"

    const label = document.createElement("span")
    label.className = "osd-code-label"
    label.textContent = block.dataset.title || LABEL[lang] || lang
    bar.appendChild(label)

    if (block.dataset.expect) {
      const badge = document.createElement("span")
      badge.className = "osd-code-expect"
      badge.title = `This example is meant to fail with ${block.dataset.expect}`
      badge.textContent = "Error example"
      const codeEl = document.createElement("code")
      codeEl.textContent = block.dataset.expect
      badge.appendChild(codeEl)
      bar.appendChild(badge)
    }

    const copy = document.createElement("button")
    copy.type = "button"
    copy.className = "osd-code-copy"
    copy.textContent = "Copy"
    copy.setAttribute("aria-label", `Copy the ${block.dataset.title || LABEL[lang] || "code"} example`)
    bar.appendChild(copy)

    const gutter = document.createElement("div")
    gutter.className = "osd-gutter"
    gutter.setAttribute("aria-hidden", "true")
    const lines = text.split("\n").length
    gutter.textContent = Array.from({ length: lines }, (_, i) => String(i + 1)).join("\n")

    block.prepend(bar)
    block.appendChild(gutter)
    block.classList.add("is-ready")
  }

  return { text, lang, editor: null, host: null }
}

/**
 * A Copy button on a signature panel (the Syntax line of a reference entry), so
 * a call can be taken as written, parameter names and all, like an example.
 */
function prepareSignature(panel) {
  if (panel.querySelector(":scope > .osd-code-copy")) return
  const copy = document.createElement("button")
  copy.type = "button"
  copy.className = "osd-code-copy osd-sig-copy"
  copy.textContent = "Copy"
  copy.setAttribute("aria-label", "Copy the syntax")
  panel.appendChild(copy)
}

function enhance(root) {
  const blocks = Array.from(root.querySelectorAll(".osd-code"))
  const state = new Map(blocks.map((b) => [b, prepare(b)]))
  root.querySelectorAll(".osd-signature").forEach(prepareSignature)
  const near = new Set()
  const timers = new Set()
  let monaco = null
  let loading = false
  let disposed = false

  const mount = (block) => {
    const s = state.get(block)
    if (!s || s.editor || disposed) return
    const host = document.createElement("div")
    host.className = "osd-monaco"
    block.appendChild(host)
    const label = block.dataset.title || LABEL[s.lang] || s.lang
    const editor = monaco.editor.create(host, {
      ...baseOptions(),
      value: s.text,
      language: MONACO_LANG[s.lang] ?? "plaintext",
      readOnly: true,
      domReadOnly: true,
      readOnlyMessage: { value: "This example is read only. Copy it to try it." },
      renderLineHighlight: "none",
      contextmenu: false,
      occurrencesHighlight: "off",
      selectionHighlight: false,
      matchBrackets: "never",
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      parameterHints: { enabled: false },
      ariaLabel: `${label} example, read only`,
    })
    s.editor = editor
    s.host = host
    // Two frames: the first lays Monaco out, the second has painted it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (s.editor === editor) block.classList.add("is-live")
      }),
    )
  }

  const unmount = (block) => {
    const s = state.get(block)
    if (!s?.editor) return
    block.classList.remove("is-live")
    const model = s.editor.getModel()
    s.editor.dispose()
    model?.dispose()
    s.host.remove()
    s.editor = null
    s.host = null
  }

  const enforceCap = () => {
    const mounted = blocks.filter((b) => state.get(b).editor)
    let excess = mounted.length - CAP
    if (excess <= 0) return
    const vh = window.innerHeight
    const far = mounted
      .filter((b) => !near.has(b))
      .map((b) => {
        const r = b.getBoundingClientRect()
        return { b, d: r.bottom < 0 ? -r.bottom : r.top > vh ? r.top - vh : 0 }
      })
      .sort((x, y) => y.d - x.d)
    for (const { b } of far) {
      if (excess-- <= 0) break
      unmount(b)
    }
  }

  const mountNear = () => {
    for (const b of near) mount(b)
    enforceCap()
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) near.add(e.target)
        else near.delete(e.target)
      }
      if (!near.size || disposed) return
      if (monaco) {
        mountNear()
      } else if (!loading) {
        loading = true
        loadMonaco()
          .then((m) => {
            if (disposed) return
            monaco = m
            mountNear()
          })
          .catch(() => {
            // The CDN is out of reach: the static blocks are the page.
            loading = false
          })
      }
    },
    { rootMargin: "400px 0px" },
  )
  blocks.forEach((b) => io.observe(b))

  const onClick = (event) => {
    const target = event.target instanceof Element ? event.target : null
    if (!target) return

    const copy = target.closest(".osd-code-copy")
    if (copy && root.contains(copy)) {
      // An example copies the text it was built from; a signature panel
      // copies what it shows.
      const holder = copy.closest(".osd-code, .osd-signature")
      const text = state.get(holder)?.text ?? holder?.querySelector("pre")?.textContent?.replace(/\n+$/, "")
      if (!text) return
      copyText(text).then((ok) => {
        copy.textContent = ok ? "Copied" : "Press Ctrl+C"
        copy.classList.toggle("is-done", ok)
        const t = setTimeout(() => {
          copy.textContent = "Copy"
          copy.classList.remove("is-done")
          timers.delete(t)
        }, 1600)
        timers.add(t)
      })
      return
    }

    const img = target.closest(".osd-shot img")
    if (img && root.contains(img)) {
      event.preventDefault()
      const caption = img.closest("figure")?.querySelector("figcaption")?.textContent ?? ""
      openLightbox({ src: img.currentSrc || img.src, alt: img.alt, caption })
    }
  }

  const onKey = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return
    const img = event.target instanceof Element ? event.target.closest(".osd-shot img") : null
    if (!img || !root.contains(img)) return
    event.preventDefault()
    const caption = img.closest("figure")?.querySelector("figcaption")?.textContent ?? ""
    openLightbox({ src: img.currentSrc || img.src, alt: img.alt, caption })
  }

  // Screenshots are buttons once there is script to open them.
  root.querySelectorAll(".osd-shot img").forEach((img) => {
    img.setAttribute("tabindex", "0")
    img.setAttribute("role", "button")
    img.setAttribute("aria-label", `${img.alt || "Screenshot"}. Open larger`)
    const missing = () => img.closest(".osd-shot")?.classList.add("is-missing")
    img.addEventListener("error", missing, { once: true })
    // A file that failed before hydration fired its error unheard, and a lazy
    // image may not have been requested yet, so ask the server directly.
    fetch(img.getAttribute("src"), { method: "HEAD" })
      .then((r) => {
        if (!r.ok) missing()
      })
      .catch(() => {})
  })

  root.addEventListener("click", onClick)
  root.addEventListener("keydown", onKey)

  return () => {
    disposed = true
    io.disconnect()
    root.removeEventListener("click", onClick)
    root.removeEventListener("keydown", onKey)
    timers.forEach(clearTimeout)
    blocks.forEach(unmount)
  }
}

export default function DocEnhancer({ rootId }) {
  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root) return undefined
    return enhance(root)
  }, [rootId])
  return null
}
