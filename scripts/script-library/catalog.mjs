#!/usr/bin/env node
/**
 * Build the work list for the library port: one row per original JavaScript
 * indicator, with the slug its port takes, the licence header it carries and
 * what the original declares.
 *
 *   node scripts/script-library/catalog.mjs <indicator-library-root>
 *
 * Writes content/script/library/catalog.json. The original repository is read,
 * never written.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import { LIBRARY_DIR, loadOriginal, readBars, runOriginal } from "./harness.mjs"

const root = process.argv[2]
if (!root) {
  console.error("usage: catalog.mjs <indicator-library-root>")
  process.exit(2)
}

const MPL = "// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/"
const GPL = "// This source code is subject to the terms of the GNU General Public License 3.0 at https://www.gnu.org/licenses/gpl-3.0.html"

/** The original author, as a person: never a repository or a product. */
function authorOf(text) {
  const line = text.split("\n").find((l) => /SPDX-FileCopyrightText:/.test(l) && !/marketcalls|openalgo/i.test(l))
  if (!line) return null
  return line
    .replace(/^.*SPDX-FileCopyrightText:\s*/, "")
    .replace(/^\(c\)\s*/i, "")
    .replace(/\s*\(everget\)\s*/, "")
    .replace(/_/g, " ")
    .trim()
}

/**
 * The library names no brand but openalgo. Some originals carry a product or
 * trademark prefix, or are named after a person's setup; those take a plain
 * descriptive title. Inventor-named formulas (Hull, Ehlers, McGinley) are the
 * names of the formulas themselves and are kept.
 */
function plainTitle(name) {
  const fixed = {
    "I2.0 SM Radar": "Smart Money Radar",
    "BitMEX Withdrawals Cutoff Time": "Daily Cutoff Time Highlighter",
    "Momentum Setup - Ankush Bajaj Momentum Investing Setup with Scanner": "Momentum Investing Setup with Scanner",
    "Momentum Setup - Ankush Bajaj Momentum Investing Setup": "Momentum Investing Setup",
    "Momentum Setup: Vijay Thakare Option Buying Scalping Setup Scanner": "Option Buying Scalping Setup Scanner",
    "Momentum Setup: Vijay Thakare Option Buying Scalping Setup": "Option Buying Scalping Setup",
    "Momentum Setup - RSI Directional Momentum Scanner": "RSI Directional Momentum Scanner",
    "Momentum Setup - RSI Directional Momentum Indicator": "RSI Directional Momentum",
    "Trend Following Setup - Sideways Market Skipper Scanner": "Sideways Market Skipper Scanner",
    "Trend Following Setup - Sideways Market Skipper": "Sideways Market Skipper",
    "Magnetic Zones - Multi Timeframe": "Magnetic Zones Multi-timeframe",
  }
  if (fixed[name]) return fixed[name]
  return name.replace(/^ICT\s+/, "").replace(/^Meridian\s*-?\s*/, "")
}

/** The library's own filter pills, from the originals' categories. */
const CATEGORY = {
  "Trends IIR": "Moving Averages",
  "Trends FIR": "Moving Averages",
  "Moving Averages": "Moving Averages",
  Filters: "Filters",
  Oscillators: "Oscillators",
  Momentum: "Momentum",
  Dynamics: "Trend Strength",
  Volatility: "Volatility",
  Channels: "Bands & Channels",
  Volume: "Volume",
  Statistics: "Statistics",
  Numerics: "Numerics",
  Errors: "Error Metrics",
  Cycles: "Cycles",
  Forecasts: "Cycles",
  "Price Core": "Price",
  Reversals: "Reversals",
  Highlighters: "Time & Sessions",
}
function categoryOf(dir, original, title) {
  if (dir === "MPL-2.0") return /setup|skipper|context|levels|profile|radar|magnetic/i.test(title) ? "Setups" : "Smart Money"
  return CATEGORY[original] ?? "Statistics"
}

const bars = readBars()
const rows = []
// GPL-3.0 originals are not ported into the library: see gen-library.mjs.
for (const dir of ["MIT", "MPL-2.0"]) {
  for (const name of readdirSync(join(root, "indicators", dir)).filter((f) => f.endsWith(".js")).sort()) {
    const path = join(root, "indicators", dir, name)
    const text = readFileSync(path, "utf8")
    const author = authorOf(text)
    const licenceName = dir === "MIT" ? "MIT License" : dir === "GPL-3.0" ? "GPL-3.0" : "MPL-2.0"
    const header = [dir === "GPL-3.0" ? GPL : MPL, "// © openalgo", `// Original work (c) ${author}, ${licenceName}`]
    let d
    let runs = true
    let error = null
    try {
      d = await loadOriginal(path)
      runOriginal(d, bars)
    } catch (e) {
      runs = false
      error = e.message
    }
    const hooks = d ? ["fills", "levels", "markers", "barColors", "background", "table", "tables", "draws", "alerts"].filter((k) => d[k] !== undefined && !(Array.isArray(d[k]) && d[k].length === 0)) : []
    rows.push({
      slug: plainTitle(d?.name ?? name.replace(/^oa-|\.js$/g, "")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      file: `indicators/${dir}/${name}`,
      licence: dir,
      author,
      header,
      title: plainTitle(d?.name ?? ""),
      originalName: d?.name ?? null,
      category: categoryOf(dir, d?.category, plainTitle(d?.name ?? "")),
      originalCategory: d?.category ?? null,
      placement: d?.placement ?? null,
      inputs: (d?.inputs ?? []).length,
      plots: (d?.plots ?? []).length,
      hooks,
      bytes: text.length,
      runs,
      error,
    })
  }
}

// Two originals can share a name (a study and its scanner, or two ports of
// one formula). The second takes its file stem, which is unique.
const slugs = new Set()
for (const r of rows) {
  if (slugs.has(r.slug)) r.slug = r.file.replace(/^.*\/oa-|\.js$/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + (r.licence === "GPL-3.0" ? "-gpl" : "")
  if (slugs.has(r.slug)) throw new Error(`duplicate slug ${r.slug}`)
  slugs.add(r.slug)
}
writeFileSync(join(LIBRARY_DIR, "catalog.json"), JSON.stringify(rows, null, 1) + "\n")
console.log(`${rows.length} indicators, ${rows.filter((r) => !r.runs).length} do not run in Node`)
for (const r of rows.filter((r) => !r.runs)) console.log(`  ${r.file}: ${r.error}`)
const authors = {}
for (const r of rows) authors[r.author] = (authors[r.author] ?? 0) + 1
console.log(authors)
