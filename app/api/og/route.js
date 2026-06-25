// The Open Graph image is served as a static asset.
//
// We previously rendered it dynamically with `next/og`, but that pulls in
// WebAssembly (resvg/yoga) that does not bundle cleanly under OpenNext +
// Cloudflare Workers on Windows with Next.js 16 - and the dynamic renderer
// already fell back to this same static image. So this endpoint simply serves
// the static OG image, keeping any existing /api/og links working.
export function GET() {
  return Response.redirect('https://openalgo.in/assets/images/og-image.png', 302)
}
