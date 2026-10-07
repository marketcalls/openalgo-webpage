#!/usr/bin/env node
/**
 * Verify one library port while writing it.
 *
 *   node scripts/script-library/compare.mjs <slug> [--json]
 *
 * Looks the slug up in content/script/library/catalog.json, runs the port
 * (content/script/library/indicators/<slug>.oscript) and its JavaScript original
 * on the fixed BTCUSD bars under every settings variant, and checks the source
 * header and the page metadata (<slug>.json) against the library's rules.
 *
 * Exit 0 only when all three pass.
 */
import { readCatalog, verifySlug } from "./verify.mjs"

const args = process.argv.slice(2)
const json = args.includes("--json")
const slug = args.find((a) => !a.startsWith("--"))
if (!slug) {
  console.error("usage: compare.mjs <slug> [--json]")
  process.exit(2)
}
const row = readCatalog().find((r) => r.slug === slug)
if (!row) {
  console.error(`no catalog row for slug "${slug}"`)
  process.exit(2)
}

const result = await verifySlug(row)
if (json) {
  console.log(JSON.stringify(result, null, 2))
  process.exit(result.ok ? 0 : 1)
}

export function report(result) {
  const lines = []
  const { parity } = result
  lines.push(`${result.ok ? "PASS" : "FAIL"} ${result.slug}`)
  if (result.error) lines.push(`  ${result.error}`)
  if (parity) {
    lines.push(`  parity: ${parity.ok ? "PARITY" : "MISMATCH"}`)
    if (parity.error) lines.push(`    ${parity.error.replace(/\n/g, "\n    ")}`)
    for (const w of parity.warnings ?? []) lines.push(`    warning ${w}`)
    for (const v of parity.variants ?? []) {
      if (v.ok) {
        lines.push(`    [${v.label}] ok${v.skipped ? ` (skipped: ${v.skipped})` : ""}`)
        continue
      }
      lines.push(`    [${v.label}] ${v.error ?? "DIFFERS"}`)
      for (const r of v.plots ?? []) {
        if (r.ok) continue
        if (r.missing) lines.push(`      plot "${r.title}": the port declares no plot with this title`)
        else
          lines.push(
            `      plot "${r.title}": ${r.both} shared bars, worst rel ${r.worst.toExponential(2)}, ${r.bad} bad${r.bad ? ` (first at bar ${r.firstBad})` : ""}, ` +
              `only original ${r.onlyOriginal}, only port ${r.onlyPort}`,
          )
      }
      if (v.points && !v.points.ok)
        lines.push(
          `      markers and labels: original ${v.points.original}, port ${v.points.port}; ` +
            `${v.points.onlyOriginal} only in original, ${v.points.onlyPort} only in port; ${v.points.examples.join("; ")}`,
        )
      for (const [kind, s] of Object.entries(v.shapes ?? {})) if (s.original !== s.port) lines.push(`      ${kind} objects: original ${s.original}, port ${s.port}`)
      for (const k of ["barColors", "background"])
        if (v[k] && !v[k].ok) lines.push(`      ${k}: original paints ${v[k].original} bars, port ${v[k].port}; ${v[k].differ} differ, first at bar ${v[k].first}`)
    }
  }
  if (result.source?.length) lines.push("  source rules:", ...result.source.map((p) => `    ${p}`))
  if (result.meta?.length) lines.push("  metadata rules:", ...result.meta.map((p) => `    ${p}`))
  if (result.deviation) lines.push(`  declared deviation: ${result.deviation}`)
  return lines.join("\n")
}

console.log(report(result))
process.exit(result.ok ? 0 : 1)
