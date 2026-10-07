#!/usr/bin/env node
/**
 * The OpenScript library's gate: every published study, verified.
 *
 *   node scripts/script-library/check.mjs [--strict] [--only <slug,...>]
 *
 * For each published catalog row (every licence but GPL-3.0, which the
 * library does not publish) it runs verify.mjs: parity with the original on
 * the fixed BTCUSD bars under every settings variant, the source rules (exact
 * header, no forbidden words) and the page text rules. It writes the outcome
 * to content/script/library/parity.json and prints every failure.
 *
 * Without --strict it always exits 0 and reports. With --strict it exits 1
 * when any study fails or is missing, which is what a deploy runs.
 */
import { writeFileSync } from "node:fs"
import { join } from "node:path"

import { LIBRARY_DIR } from "./harness.mjs"
import { readCatalog, verifySlug } from "./verify.mjs"

const args = process.argv.slice(2)
const strict = args.includes("--strict")
const onlyAt = args.indexOf("--only")
const only = onlyAt >= 0 ? new Set(args[onlyAt + 1].split(",")) : null

const rows = readCatalog().filter((r) => r.licence !== "GPL-3.0" && (!only || only.has(r.slug)))
const results = []
let n = 0
for (const row of rows) {
  const r = await verifySlug(row)
  results.push(r)
  n++
  if (n % 50 === 0) console.log(`  ${n}/${rows.length}`)
}

const pass = results.filter((r) => r.ok)
const missing = results.filter((r) => r.missing)
const failing = results.filter((r) => !r.ok && !r.missing)

if (!only) {
  writeFileSync(
    join(LIBRARY_DIR, "parity.json"),
    JSON.stringify(
      {
        bars: "btcusd-1h.json",
        studies: results.length,
        passing: pass.length,
        results: results.map((r) => ({
          slug: r.slug,
          ok: r.ok,
          parity: r.parity?.ok ?? false,
          variants: r.parity?.variants?.length ?? 0,
          deviation: r.deviation ?? null,
        })),
      },
      null,
      1,
    ) + "\n",
  )
}

for (const r of failing) {
  const why = []
  if (r.parity && !r.parity.ok) {
    if (r.parity.error) why.push(r.parity.error.split("\n")[0])
    for (const v of r.parity.variants ?? []) if (!v.ok) why.push(`[${v.label}] ${v.error ?? "differs"}`)
  }
  if (r.source?.length) why.push(...r.source)
  if (r.meta?.length) why.push(...r.meta)
  if (r.deviation) why.push(`declared deviation: ${r.deviation}`)
  console.log(`FAIL ${r.slug}\n  ${why.slice(0, 6).join("\n  ")}`)
}
console.log(`\nscript library: ${pass.length} of ${results.length} pass, ${failing.length} fail, ${missing.length} not written`)
if (strict && pass.length !== results.length) process.exit(1)
