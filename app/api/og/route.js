// The Open Graph image is served as a static asset.
//
// We previously rendered it dynamically with `next/og`, but that pulls ~1.4 MB
// of @vercel/og into the Worker bundle, which on Cloudflare's free 3 MiB Worker
// limit leaves no headroom. The dynamic renderer ignored its query params and
// already fell back to this static image anyway, so we just serve the static OG
// image and keep existing /api/og links working.
export function GET() {
  return Response.redirect('https://openalgo.in/assets/images/og-image.png', 302)
}
