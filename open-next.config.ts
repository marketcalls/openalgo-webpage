import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// No ISR/on-demand revalidation on this site, so the default config
// (no incremental cache binding) is sufficient.
export default defineCloudflareConfig()
