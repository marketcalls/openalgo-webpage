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
