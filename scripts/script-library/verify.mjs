/**
 * Verify one library port: parity with its original, and the library's rules
 * for the source and its page text. Shared by compare.mjs (one slug, used while
 * porting) and check.mjs (the whole library, the gate before a build).
 */
import { existsSync, readFileSync } from "node:fs"
import { join, resolve } from "node:path"

import {
  LIBRARY_DIR,
  ROOT,
  compareEvents,
  comparePaint,
  comparePlots,
  compileScript,
  defaultsOf,
  loadOriginal,
  readBars,
  runOriginal,
  runScript,
} from "./harness.mjs"

export const ORIGINALS_ROOT = resolve(process.env.OPENALGO_INDICATORS ?? join(ROOT, "..", "openalgo-js-indicator-library"))
export const PORTS_DIR = join(LIBRARY_DIR, "indicators")

export function readCatalog() {
  return JSON.parse(readFileSync(join(LIBRARY_DIR, "catalog.json"), "utf8"))
}

// ---------------------------------------------------------------------------
// Parity
// ---------------------------------------------------------------------------

const COMPARED_KINDS = new Set(["number", "select", "boolean", "source"])

/** The settings each variant runs with: defaults, then one change at a time. */
function variantsOf(descriptor) {
  const defaults = defaultsOf(descriptor)
  const variants = [{ label: "defaults", settings: { ...defaults } }]
  for (const input of descriptor.inputs ?? []) {
    const set = (value, label) => variants.push({ label, settings: { ...defaults, [input.key]: value } })
    if (input.type === "select") for (const o of input.options ?? []) o.value !== input.default && set(o.value, `${input.key}=${o.value}`)
    else if (input.type === "boolean") set(!input.default, `${input.key}=${!input.default}`)
    else if (input.type === "source") input.default !== "hl2" && set("hl2", `${input.key}=hl2`)
    else if (input.type === "number" && typeof input.default === "number") {
      const integral = Number.isInteger(input.default) && (input.step === undefined || Number.isInteger(input.step))
      let v = integral ? input.default + Math.max(1, Math.round(input.default * 0.5)) : input.default * 1.5
      if (input.max !== undefined && v > input.max) v = integral ? Math.max(input.min ?? 1, input.default - 1) : input.default * 0.75
      if (v !== input.default && (input.min === undefined || v >= input.min)) set(v, `${input.key}=${v}`)
    }
  }
  return variants.slice(0, 24)
}

let barsCache
export async function verifyParity(originalPath, portName, portText) {
  barsCache ??= readBars()
  const bars = barsCache
  const compiled = compileScript(portName, portText)
  if (!compiled.ok) {
    return {
      ok: false,
      error:
        "does not compile:\n" +
        compiled.diagnostics
          .filter((d) => d.severity !== "warning")
          .map((d) => `  ${d.code} line ${d.span.line}: ${d.message}${d.fix ? ` Fix: ${d.fix}` : ""}`)
          .join("\n"),
    }
  }
  const warnings = compiled.diagnostics.filter((d) => d.severity === "warning").map((d) => `${d.code} line ${d.span.line}: ${d.message}`)

  let descriptor
  try {
    descriptor = await loadOriginal(originalPath)
  } catch (error) {
    return { ok: false, error: `the original failed to load: ${error.message}` }
  }

  // The port keeps the original's setting keys and menu values, so one settings
  // object drives both and every variant is a like-for-like comparison.
  const portKeys = new Set(compiled.program.inputs.map((i) => i.key))
  const missingKeys = (descriptor.inputs ?? []).filter((i) => COMPARED_KINDS.has(i.type) && !portKeys.has(i.key)).map((i) => i.key)
  if (missingKeys.length) return { ok: false, warnings, error: `the port has no input keyed ${missingKeys.join(", ")}: name each input variable after the original's key` }

  const results = []
  for (const variant of variantsOf(descriptor)) {
    // Only settings the port declares reach the engine; any other is a style
    // or colour choice the comparison does not read.
    const portSettings = Object.fromEntries(Object.entries(variant.settings).filter(([k]) => portKeys.has(k)))
    const port = runScript(compiled.program, compiled.file, bars, portSettings)
    if (!port.ok) {
      results.push({ label: variant.label, ok: false, error: `does not run: ${port.diagnostic.code} line ${port.diagnostic.span?.line}: ${port.diagnostic.message}` })
      continue
    }
    let original
    try {
      original = runOriginal(descriptor, bars, variant.settings)
    } catch (error) {
      results.push({ label: variant.label, ok: true, skipped: `the original throws: ${error.message}` })
      continue
    }
    const plots = comparePlots(original, port.plots)
    const points = compareEvents(original.points, port.points)
    const kinds = [...new Set([...Object.keys(original.shapes), ...Object.keys(port.shapes)])]
    const shapes = Object.fromEntries(kinds.map((k) => [k, { original: original.shapes[k] ?? 0, port: port.shapes[k] ?? 0 }]))
    const shapesOk = Object.values(shapes).every((s) => s.original === s.port)
    const barColors = comparePaint(original.barColors, port.barColors)
    const background = comparePaint(original.background, port.background)
    const ok = plots.every((r) => r.ok) && points.ok && shapesOk && (barColors?.ok ?? true) && (background?.ok ?? true)
    results.push({ label: variant.label, ok, plots, points, shapes, barColors, background })
  }
  return { ok: results.every((r) => r.ok), variants: results, warnings }
}

// ---------------------------------------------------------------------------
// Rules for the text: the source and the page metadata
// ---------------------------------------------------------------------------

/**
 * Words the library never prints. The only brand it names is openalgo; it never
 * says where a script came from beyond the author credit on line 3.
 */
const FORBIDDEN = [
  [/pine\s*script|pinescript|\bpine\b/i, "names another chart language"],
  [/trading\s*view|tradingview/i, "names another platform"],
  [/lux\s*algo/i, "names another vendor"],
  [/\bported\b|\bport of\b|\btranslated from\b|\bconverted from\b/i, "says the script came from somewhere else"],
  [/gemini|binance|coinbase|bitmex|kraken|bybit|zerodha|upstox|dhan\b|angel one|fyers/i, "names an exchange, broker or data provider"],
  [/\bICT\b|inner circle trader|meridian|\bSM Radar\b/, "names a product or trademark"],
  [/paper trading|virtual trading/i, 'say "sandbox trading (analyzer mode in OpenAlgo)"'],
  [/\blive\b/i, 'never imply data is live: say "real" or "latest"'],
  [/[–—]/, "contains an en or em dash"],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2705}]/u, "contains an emoji or icon character"],
]

function forbiddenIn(text, where, { allowCredit = false } = {}) {
  const problems = []
  const lines = text.split("\n")
  lines.forEach((line, i) => {
    if (allowCredit && i < 3) return
    for (const [re, why] of FORBIDDEN) if (re.test(line)) problems.push(`${where} line ${i + 1} ${why}: ${line.trim().slice(0, 120)}`)
  })
  return problems
}

export function lintSource(row, text) {
  const problems = []
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  row.header.forEach((h, i) => {
    if (lines[i] !== h) problems.push(`line ${i + 1} must be exactly: ${h}`)
  })
  problems.push(...forbiddenIn(text.replace(/\r\n/g, "\n"), "source", { allowCredit: true }))
  if (!/^\s*study\s*\(/m.test(text)) problems.push("the library holds studies: the script must declare study(...)")
  return problems
}

const META_KEYS = ["title", "summary", "description", "howToRead", "settings", "faq"]

export function lintMeta(row, meta, programInputs) {
  const problems = []
  for (const k of META_KEYS) if (meta[k] === undefined) problems.push(`metadata has no ${k}`)
  if (meta.title !== row.title) problems.push(`metadata title must be "${row.title}"`)
  if (typeof meta.summary !== "string" || meta.summary.length < 40 || meta.summary.length > 200) problems.push("summary must be one sentence of 40 to 200 characters")
  if (typeof meta.description !== "string" || meta.description.split(/\s+/).length < 60) problems.push("description must be at least 60 words")
  if (typeof meta.howToRead !== "string" || meta.howToRead.split(/\s+/).length < 40) problems.push("howToRead must be at least 40 words")
  if (!Array.isArray(meta.faq) || meta.faq.length < 2 || meta.faq.some((f) => !f.q || !f.a)) problems.push("faq must hold at least two { q, a } entries")
  if (!Array.isArray(meta.settings)) problems.push("settings must be a list")
  else if (programInputs) {
    const keys = new Set(meta.settings.map((s) => s.key))
    for (const input of programInputs) if (!keys.has(input.key)) problems.push(`settings has no description for input "${input.key}"`)
    for (const s of meta.settings) if (!s.description || s.description.length < 15) problems.push(`settings entry "${s.key}" needs a description`)
  }
  problems.push(...forbiddenIn(JSON.stringify(meta, null, 1), "metadata"))
  return problems
}

/** Everything about one slug: parity, source rules, metadata rules. */
export async function verifySlug(row) {
  const portPath = join(PORTS_DIR, `${row.slug}.oscript`)
  const metaPath = join(PORTS_DIR, `${row.slug}.json`)
  if (!existsSync(portPath)) return { slug: row.slug, ok: false, missing: true, error: `${portPath} does not exist` }
  const text = readFileSync(portPath, "utf8")
  // openalgo's own studies are compared with a reference kept in this repo.
  const original = row.reference ? join(ROOT, row.reference) : join(ORIGINALS_ROOT, row.file)
  const parity = await verifyParity(original, `${row.slug}.oscript`, text)
  const source = lintSource(row, text)
  let meta = null
  let metaProblems = []
  if (!existsSync(metaPath)) metaProblems = [`${metaPath} does not exist`]
  else {
    try {
      meta = JSON.parse(readFileSync(metaPath, "utf8"))
      const compiled = compileScript(`${row.slug}.oscript`, text)
      metaProblems = lintMeta(row, meta, compiled.ok ? compiled.program.inputs : null)
    } catch (error) {
      metaProblems = [`metadata is not valid JSON: ${error.message}`]
    }
  }
  // A port that cannot reach parity says why, and that explanation is shown on
  // its page; the gate reports it rather than treating it as passing.
  const deviation = meta?.deviation ?? null
  // One kind of difference is accepted, and only when the page declares it: a
  // plot whose every shared value agrees, which the original never draws where
  // the port does not, but which the port also draws on bars the original
  // leaves blank. That is an original painting history backwards once a later
  // bar decides it, which a study running bar by bar cannot do.
  const supersetOnly =
    Boolean(deviation) &&
    !parity.ok &&
    !parity.error &&
    parity.variants.every(
      (v) =>
        v.ok ||
        (!v.error &&
          (v.points?.ok ?? true) &&
          Object.values(v.shapes ?? {}).every((s) => s.original === s.port) &&
          (v.barColors?.ok ?? true) &&
          (v.background?.ok ?? true) &&
          v.plots.every((r) => r.ok || (!r.missing && r.bad === 0 && r.onlyOriginal === 0))),
    )
  // A declared deviation may also name the settings variants it covers, such
  // as a plot offset that cannot follow a setting. Every other variant still
  // has to agree exactly, the defaults included.
  const exempt = new Set(Array.isArray(meta?.deviationVariants) ? meta.deviationVariants : [])
  const variantsOk =
    Boolean(deviation) &&
    exempt.size > 0 &&
    !exempt.has("defaults") &&
    !parity.ok &&
    !parity.error &&
    parity.variants.every((v) => v.ok || exempt.has(v.label))
  return {
    slug: row.slug,
    ok: (parity.ok || supersetOnly || variantsOk) && source.length === 0 && metaProblems.length === 0,
    supersetOnly,
    parity,
    source,
    meta: metaProblems,
    deviation,
    lines: text.split("\n").length,
  }
}
