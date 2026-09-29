// Open Graph and Twitter image metadata for a section, pointing at the image
// scripts/gen-og-images.mjs renders for it (public/assets/og/<slug>.png).
const SITE = "https://openalgo.in"

export function ogImageUrl(slug) {
  return `${SITE}/assets/og/${slug}.png`
}

// Section metadata files write their titles in full ("FAQ | OpenAlgo"), so the
// title is marked absolute: the root layout's "%s | OpenAlgo" template would
// otherwise print the site name twice.
export function withOg(meta, slug, path) {
  const title = typeof meta.title === "string" ? meta.title : meta.title?.absolute
  const alt = meta.openGraph?.title || title
  const image = { url: ogImageUrl(slug), width: 1200, height: 630, alt, type: "image/png" }
  return {
    ...meta,
    ...(title ? { title: { absolute: title } } : {}),
    ...(path ? { alternates: { ...(meta.alternates || {}), canonical: path } } : {}),
    openGraph: { type: "website", siteName: "OpenAlgo", ...(meta.openGraph || {}), ...(path ? { url: `${SITE}${path}` } : {}), images: [image] },
    twitter: { card: "summary_large_image", ...(meta.twitter || {}), images: [image.url] },
  }
}
