import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// Enables Cloudflare bindings (env, ctx, caches) during `next dev`; no-op in production builds
initOpenNextCloudflareForDev()

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inline the page's CSS into the HTML to remove the render-blocking CSS request.
  experimental: {
    inlineCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // Strip console.* (keep errors/warnings) from production bundles.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
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
    ]
  },
}

export default nextConfig
