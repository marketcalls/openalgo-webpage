import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// These course pages are prerendered (SSG) but App Router routes are served
// through the Worker. Without cache interception, every request - including the
// RSC prefetch requests (?_rsc=) that Next fires for each link - runs the full
// Next.js server, and rendering a large chapter can exceed Cloudflare's
// per-request CPU limit ("Worker exceeded CPU time limit"). With interception
// enabled, prerendered responses are served straight from the cache before the
// routing/render layer runs, which keeps the CPU cost low. No ISR here, so the
// cached content is always the build-time prerender (never stale).
export default defineCloudflareConfig({
  enableCacheInterception: true,
})
