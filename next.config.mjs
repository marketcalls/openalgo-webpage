import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// Enables Cloudflare bindings (env, ctx, caches) during `next dev`; no-op in production builds
initOpenNextCloudflareForDev()

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

// /script/<section> has no page of its own, so send it to the section's first
// written page. Sections and their order come from content/script/nav.json; a
// page counts as written when its markdown exists, the same test
// scripts/gen-script-docs.mjs uses. Redirects are resolved at build time, so
// they land in the routes manifest and cost the Worker nothing per request.
function scriptSectionRedirects() {
  const contentDir = path.join(projectRoot, 'content', 'script')
  let nav
  try {
    nav = JSON.parse(fs.readFileSync(path.join(contentDir, 'nav.json'), 'utf8'))
  } catch {
    return []
  }
  const out = []
  for (const section of nav.sections || []) {
    const first = (section.pages || []).find((p) =>
      fs.existsSync(path.join(contentDir, section.slug, `${p.slug}.md`))
    )
    if (!first) continue
    out.push({
      source: `/script/${section.slug}`,
      destination: `/script/${section.slug}/${first.slug}`,
      // Temporary: the first page of a section can change as pages are added.
      permanent: false,
    })
  }
  return out
}

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: experimental.inlineCss is intentionally NOT enabled. It embeds the full
  // CSS into the server bundle for runtime inlining, which adds ~760 KB (gzipped)
  // to the Cloudflare Worker and pushes it past the free-plan 3 MiB limit. The
  // saved render-blocking CSS request (~100 ms) is not worth losing deployability.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Strip console.* (keep errors/warnings) from production bundles.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  webpack: (config, { webpack }) => {
    // Next.js unconditionally requires `polyfill-module` (Array.prototype.at/flat,
    // Object.fromEntries/hasOwn) into the main bundle. Every browser in our
    // browserslist target supports these natively, so the polyfills are dead
    // weight that Lighthouse flags as "legacy JavaScript". Replace the module
    // with an empty one so it is dropped from the bundle.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /[\\/]polyfills[\\/]polyfill-module(\.js)?$/,
        path.join(projectRoot, 'lib', 'empty-module.js')
      )
    )
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/marketcalls/openalgo',
        permanent: false,
      },
      {
        source: '/docs',
        destination: 'https://docs.openalgo.in',
        permanent: false,
      },
      // The language's pages live at /script; /scripts is the common misspelling.
      {
        source: '/scripts',
        destination: '/script',
        permanent: true,
      },
      {
        source: '/scripts/:path*',
        destination: '/script/:path*',
        permanent: true,
      },
      ...scriptSectionRedirects(),
    ]
  },
}

export default nextConfig
