// A click-to-zoom view for screenshots. Plain DOM, so both the docs pages
// (whose figures are generated HTML) and the landing page gallery can use it.
let current = null

export function closeLightbox() {
  if (!current) return
  const { overlay, onKey, restore, previousOverflow } = current
  current = null
  document.removeEventListener("keydown", onKey, true)
  document.documentElement.style.overflow = previousOverflow
  overlay.classList.remove("is-open")
  setTimeout(() => overlay.remove(), 160)
  if (restore && typeof restore.focus === "function") restore.focus({ preventScroll: true })
}

export function openLightbox({ src, alt = "", caption = "" }) {
  if (!src || typeof document === "undefined") return
  closeLightbox()

  const overlay = document.createElement("div")
  overlay.className = "osd-lightbox"
  overlay.setAttribute("role", "dialog")
  overlay.setAttribute("aria-modal", "true")
  overlay.setAttribute("aria-label", alt || "Screenshot")

  const figure = document.createElement("figure")
  figure.className = "osd-lightbox-figure"
  const img = document.createElement("img")
  img.src = src
  img.alt = alt
  figure.appendChild(img)
  if (caption) {
    const cap = document.createElement("figcaption")
    cap.textContent = caption
    figure.appendChild(cap)
  }

  const close = document.createElement("button")
  close.type = "button"
  close.className = "osd-lightbox-close"
  close.textContent = "Close"
  close.setAttribute("aria-label", "Close the screenshot")

  overlay.append(close, figure)
  overlay.addEventListener("click", (e) => {
    // A click on the picture itself keeps it open, so it can be looked at.
    if (e.target !== img) closeLightbox()
  })

  const onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault()
      e.stopPropagation()
      closeLightbox()
    } else if (e.key === "Tab") {
      // One control in the dialog: keep focus on it.
      e.preventDefault()
      close.focus()
    }
  }
  document.addEventListener("keydown", onKey, true)

  const previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = "hidden"
  current = { overlay, onKey, restore: document.activeElement, previousOverflow }

  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add("is-open"))
  close.focus({ preventScroll: true })
}
