#!/usr/bin/env node

import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const COURSES = Object.freeze({
  stocks: "stocksContentData.json",
  technicals: "technicalsContentData.json",
  fundamentals: "fundamentalsContentData.json",
  futures: "futuresContentData.json",
  "options-basics": "optionsBasicsContentData.json",
  "options-strategies": "optionsStrategiesContentData.json",
  python: "pythonContentData.json",
  quant: "quantContentData.json",
  "stats-arb": "statsArbContentData.json",
  amibroker: "amibrokerContentData.json",
  taxation: "taxationContentData.json",
  "risk-management": "riskContentData.json",
  "trading-psychology": "psychologyContentData.json",
});

const LOCALES = Object.freeze([
  "hi", "ta", "te", "ml", "mr", "kn", "gu", "bn", "ur", "or",
  "es", "ar", "fr", "ru", "pt",
]);

const API_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";
const DEFAULT_CONCURRENCY = 3;
const MAX_CONCURRENCY = 8;
const DEFAULT_RETRIES = 5;
const MAX_RETRIES = 10;
const MAX_BATCH_ITEMS = 100;
const MAX_BATCH_CODE_POINTS = 20_000;
const MAX_SEGMENT_CODE_POINTS = 4_500;
const PROTECTED_ELEMENTS = new Set(["pre", "code", "script", "style"]);
const TRANSLATABLE_ATTRIBUTES = new Set(["alt", "title", "aria-label"]);
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

const TOKEN_PATTERN = new RegExp(
  [
    "https?:\\/\\/[^\\s<>\\\"']+",
    "www\\.[^\\s<>\\\"']+",
    "\\/[A-Za-z0-9][A-Za-z0-9_./?=&%#:+~-]*",
    "\\bOpenAlgo\\b",
    "\\bOPENALGO\\b",
    "--[a-z][a-z0-9-]*",
    "\\b[A-Z][A-Z0-9_]{1,}\\b",
    "\\b[A-Za-z_$][A-Za-z0-9_$]*_[A-Za-z0-9_$]+\\b",
    "\\b[a-z]+[A-Z][A-Za-z0-9]*\\b",
    "\\b[A-Za-z_$][A-Za-z0-9_$]*\\(\\)",
    "\\b(?:NSE|BSE):[A-Z0-9_-]+\\b",
  ].join("|"),
  "g",
);

function usage() {
  return `Usage: node scripts/translate-learn-content.mjs [options]

Options:
  --course <slug[,slug...]>   Restrict to one or more of the 13 courses
  --locale <code[,code...]>   Restrict to one or more of the 15 locales
  --dry-run                   Report pending work; do not call Google or write
  --force                     Re-translate chapters already marked complete
  --concurrency <1-${MAX_CONCURRENCY}>      Concurrent chapter translations (default ${DEFAULT_CONCURRENCY})
  --retries <0-${MAX_RETRIES}>          Retries for transient API failures (default ${DEFAULT_RETRIES})
  --help                      Show this help

Filters may be repeated. Use "all" to select every course or locale.`;
}

function parseArgs(argv) {
  const options = {
    courses: [],
    locales: [],
    dryRun: false,
    force: false,
    concurrency: DEFAULT_CONCURRENCY,
    retries: DEFAULT_RETRIES,
  };

  const takeValue = (arg, index) => {
    const equal = arg.indexOf("=");
    if (equal !== -1) return { value: arg.slice(equal + 1), next: index };
    if (index + 1 >= argv.length || argv[index + 1].startsWith("--")) {
      throw new Error(`${arg} requires a value`);
    }
    return { value: argv[index + 1], next: index + 1 };
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--course" || arg.startsWith("--course=")) {
      const found = takeValue(arg, index);
      options.courses.push(...found.value.split(",").map((item) => item.trim()).filter(Boolean));
      index = found.next;
    } else if (arg === "--locale" || arg.startsWith("--locale=")) {
      const found = takeValue(arg, index);
      options.locales.push(...found.value.split(",").map((item) => item.trim()).filter(Boolean));
      index = found.next;
    } else if (arg === "--concurrency" || arg.startsWith("--concurrency=")) {
      const found = takeValue(arg, index);
      options.concurrency = parseBoundedInteger(found.value, "--concurrency", 1, MAX_CONCURRENCY);
      index = found.next;
    } else if (arg === "--retries" || arg.startsWith("--retries=")) {
      const found = takeValue(arg, index);
      options.retries = parseBoundedInteger(found.value, "--retries", 0, MAX_RETRIES);
      index = found.next;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  options.courses = validateSelection(options.courses, Object.keys(COURSES), "course");
  options.locales = validateSelection(options.locales, LOCALES, "locale");
  return options;
}

function parseBoundedInteger(raw, flag, minimum, maximum) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${flag} must be an integer from ${minimum} to ${maximum}`);
  }
  return value;
}

function validateSelection(requested, allowed, label) {
  if (requested.length === 0 || requested.includes("all")) return [...allowed];
  const unique = [...new Set(requested)];
  const unknown = unique.filter((item) => !allowed.includes(item));
  if (unknown.length > 0) {
    throw new Error(`Unknown ${label}${unknown.length === 1 ? "" : "s"}: ${unknown.join(", ")}`);
  }
  return allowed.filter((item) => unique.includes(item));
}

function codePointLength(value) {
  return [...value].length;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function decodeHtml(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith("#x")) return String.fromCodePoint(Number.parseInt(lower.slice(2), 16));
    if (lower.startsWith("#")) return String.fromCodePoint(Number.parseInt(lower.slice(1), 10));
    return named[lower] ?? match;
  });
}

function escapeHtmlText(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeHtmlAttribute(value, quote) {
  let escaped = escapeHtmlText(value);
  escaped = quote === '"' ? escaped.replaceAll('"', "&quot;") : escaped.replaceAll("'", "&#39;");
  return escaped;
}

function tokenizeHtml(html) {
  const tokens = [];
  let cursor = 0;
  while (cursor < html.length) {
    const opening = html.indexOf("<", cursor);
    if (opening === -1) {
      tokens.push({ type: "text", source: html.slice(cursor), replacements: [] });
      break;
    }
    if (opening > cursor) {
      tokens.push({ type: "text", source: html.slice(cursor, opening), replacements: [] });
    }

    if (html.startsWith("<!--", opening)) {
      const commentEnd = html.indexOf("-->", opening + 4);
      const end = commentEnd === -1 ? html.length : commentEnd + 3;
      tokens.push({ type: "tag", source: html.slice(opening, end), replacements: [] });
      cursor = end;
      continue;
    }

    let quote = null;
    let end = opening + 1;
    for (; end < html.length; end += 1) {
      const character = html[end];
      if (quote) {
        if (character === quote) quote = null;
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === ">") {
        end += 1;
        break;
      }
    }
    tokens.push({ type: "tag", source: html.slice(opening, end), replacements: [] });
    cursor = end;
  }
  return tokens;
}

function tagInfo(source) {
  const match = source.match(/^<\s*(\/?)\s*([A-Za-z][A-Za-z0-9:-]*)/);
  if (!match || source.startsWith("<!--") || source.startsWith("<!")) return null;
  return {
    closing: match[1] === "/",
    name: match[2].toLowerCase(),
    selfClosing: /\/\s*>$/.test(source),
  };
}

function collectTranslationUnits(tokens) {
  const units = [];
  const protectedStack = [];

  for (const token of tokens) {
    if (token.type === "text") {
      if (protectedStack.length === 0) addUnit(token, 0, token.source.length, "text", null, units);
      continue;
    }

    const info = tagInfo(token.source);
    const opensProtected = info && !info.closing && PROTECTED_ELEMENTS.has(info.name);
    if (protectedStack.length === 0 && !opensProtected) {
      const attributePattern = /\b(alt|title|aria-label)(\s*=\s*)(["'])([\s\S]*?)\3/gi;
      let match;
      while ((match = attributePattern.exec(token.source)) !== null) {
        if (!TRANSLATABLE_ATTRIBUTES.has(match[1].toLowerCase())) continue;
        const valueStart = match.index + match[1].length + match[2].length + 1;
        addUnit(token, valueStart, valueStart + match[4].length, "attribute", match[3], units);
      }
    }

    if (!info) continue;
    if (info.closing && PROTECTED_ELEMENTS.has(info.name)) {
      const index = protectedStack.lastIndexOf(info.name);
      if (index !== -1) protectedStack.splice(index, 1);
    } else if (!info.selfClosing && PROTECTED_ELEMENTS.has(info.name)) {
      protectedStack.push(info.name);
    }
  }
  return units;
}

function addUnit(token, start, end, context, quote, units) {
  const encoded = token.source.slice(start, end);
  const decoded = decodeHtml(encoded);
  if (!/\p{L}/u.test(decoded)) return;
  const index = units.length;
  units.push({ source: decoded, context, quote, translated: null });
  token.replacements.push({ start, end, unitIndex: index });
}

function protectTokens(value, unitIndex) {
  const protectedValues = [];
  const text = value.replace(TOKEN_PATTERN, (token) => {
    const placeholder = `\uE000OA${unitIndex}X${protectedValues.length}\uE001`;
    protectedValues.push({ placeholder, token });
    return placeholder;
  });
  return { text, protectedValues };
}

function restoreTokens(value, protectedValues) {
  let restored = value;
  for (const { placeholder, token } of protectedValues) {
    if (!restored.includes(placeholder)) {
      throw new Error("The translation service modified a protected OpenAlgo token");
    }
    restored = restored.replaceAll(placeholder, token);
  }
  if (restored.includes("\uE000") || restored.includes("\uE001")) {
    throw new Error("An unresolved translation placeholder remains in the output");
  }
  return restored;
}

function splitLongText(value, maximum) {
  if (codePointLength(value) <= maximum) return [value];
  const chunks = [];
  let remaining = value;
  while (codePointLength(remaining) > maximum) {
    const points = [...remaining];
    let boundary = maximum;
    for (let index = maximum; index >= Math.floor(maximum * 0.6); index -= 1) {
      if (/\s|[.!?;:,]/u.test(points[index - 1])) {
        boundary = index;
        break;
      }
    }
    chunks.push(points.slice(0, boundary).join(""));
    remaining = points.slice(boundary).join("");
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function preparePieces(units) {
  const pieces = [];
  units.forEach((unit, unitIndex) => {
    const protectedUnit = protectTokens(unit.source, unitIndex);
    unit.protectedValues = protectedUnit.protectedValues;
    unit.pieceIndexes = [];
    for (const chunk of splitLongText(protectedUnit.text, MAX_SEGMENT_CODE_POINTS)) {
      const leading = chunk.match(/^\s*/u)?.[0] ?? "";
      const trailing = chunk.match(/\s*$/u)?.[0] ?? "";
      const core = chunk.slice(leading.length, chunk.length - trailing.length || undefined);
      if (!core) continue;
      unit.pieceIndexes.push(pieces.length);
      pieces.push({ source: core, leading, trailing, translated: null });
    }
  });
  return pieces;
}

function makeBatches(pieces) {
  const batches = [];
  let batch = [];
  let size = 0;
  for (const piece of pieces) {
    const pieceSize = codePointLength(piece.source);
    if (batch.length > 0 && (batch.length >= MAX_BATCH_ITEMS || size + pieceSize > MAX_BATCH_CODE_POINTS)) {
      batches.push(batch);
      batch = [];
      size = 0;
    }
    batch.push(piece);
    size += pieceSize;
  }
  if (batch.length > 0) batches.push(batch);
  return batches;
}

async function requestTranslations(texts, locale, apiKey, retries) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const endpoint = new URL(API_ENDPOINT);
      endpoint.searchParams.set("key", apiKey);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ q: texts, source: "en", target: locale, format: "text" }),
      });

      if (!response.ok) {
        if (attempt < retries && RETRYABLE_STATUS.has(response.status)) {
          await backoff(attempt, response.headers.get("retry-after"));
          continue;
        }
        throw new Error(`Google Translation request failed with HTTP ${response.status}`);
      }

      const payload = await response.json();
      const translations = payload?.data?.translations;
      if (!Array.isArray(translations) || translations.length !== texts.length) {
        throw new Error("Google Translation returned an unexpected response shape");
      }
      return translations.map((item) => decodeHtml(String(item.translatedText ?? "")));
    } catch (error) {
      if (attempt >= retries || (error instanceof Error && error.message.startsWith("Google Translation request failed"))) {
        throw error;
      }
      await backoff(attempt, null);
    }
  }
}

async function backoff(attempt, retryAfter) {
  const retrySeconds = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : 0;
  const exponential = Math.min(30_000, 1_000 * (2 ** attempt));
  const jitter = Math.floor(Math.random() * 400);
  await sleep(Math.max(retrySeconds * 1_000, exponential + jitter));
}

function renderTokens(tokens, units) {
  return tokens.map((token) => {
    if (token.replacements.length === 0) return token.source;
    let rendered = "";
    let cursor = 0;
    for (const replacement of token.replacements.sort((a, b) => a.start - b.start)) {
      const unit = units[replacement.unitIndex];
      rendered += token.source.slice(cursor, replacement.start);
      rendered += unit.context === "attribute"
        ? escapeHtmlAttribute(unit.translated, unit.quote)
        : escapeHtmlText(unit.translated);
      cursor = replacement.end;
    }
    return rendered + token.source.slice(cursor);
  }).join("");
}

function textFromHeading(innerHtml) {
  return decodeHtml(innerHtml.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function deriveToc(html) {
  const toc = [];
  const headingPattern = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1\s*>/gi;
  let heading;
  while ((heading = headingPattern.exec(html)) !== null) {
    const id = heading[2].match(/\bid\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (!id) throw new Error("A translated h2/h3 heading is missing its original id");
    toc.push({ level: Number(heading[1]), text: textFromHeading(heading[3]), id: decodeHtml(id) });
  }
  return toc;
}

function extractProtectedBlocks(html) {
  const blocks = [];
  const pattern = /<(pre|code|script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) blocks.push(match[0]);
  return blocks;
}

function extractCriticalAttributes(html) {
  const values = [];
  const tokens = tokenizeHtml(html);
  const pattern = /\b(id|href|src|srcset|action|poster|data-src)\s*=\s*(["'])(.*?)\2/gi;
  for (const token of tokens) {
    if (token.type !== "tag") continue;
    let match;
    while ((match = pattern.exec(token.source)) !== null) {
      values.push(`${match[1].toLowerCase()}=${match[3]}`);
    }
    pattern.lastIndex = 0;
  }
  return values;
}

function assertPreserved(source, translated) {
  const beforeBlocks = extractProtectedBlocks(source);
  const afterBlocks = extractProtectedBlocks(translated);
  if (JSON.stringify(beforeBlocks) !== JSON.stringify(afterBlocks)) {
    throw new Error("pre/code/script/style content changed during translation");
  }
  const beforeAttributes = extractCriticalAttributes(source);
  const afterAttributes = extractCriticalAttributes(translated);
  if (JSON.stringify(beforeAttributes) !== JSON.stringify(afterAttributes)) {
    throw new Error("A heading id, URL, or image/resource path changed during translation");
  }
}

async function translateHtml(html, locale, apiKey, retries) {
  const tokens = tokenizeHtml(html);
  const units = collectTranslationUnits(tokens);
  const pieces = preparePieces(units);

  for (const batch of makeBatches(pieces)) {
    const translated = await requestTranslations(batch.map((piece) => piece.source), locale, apiKey, retries);
    translated.forEach((value, index) => {
      batch[index].translated = value;
    });
  }

  for (const unit of units) {
    const joined = unit.pieceIndexes.map((index) => {
      const piece = pieces[index];
      return piece.leading + piece.translated + piece.trailing;
    }).join("");
    unit.translated = restoreTokens(joined, unit.protectedValues);
  }

  const translatedHtml = renderTokens(tokens, units);
  assertPreserved(html, translatedHtml);
  return translatedHtml;
}

function isComplete(chapter) {
  if (!chapter || chapter.hasContent !== true || typeof chapter.html !== "string" || !chapter.html.trim()) return false;
  if (!Array.isArray(chapter.toc)) return false;
  try {
    return JSON.stringify(deriveToc(chapter.html)) === JSON.stringify(chapter.toc);
  } catch {
    return false;
  }
}

async function readExistingModule(outputPath) {
  try {
    const source = await readFile(outputPath, "utf8");
    const match = source.match(/^\s*export\s+default\s+([\s\S]*?);?\s*$/);
    if (!match) throw new Error("not an export-default JSON object");
    const parsed = JSON.parse(match[1]);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    return parsed;
  } catch (error) {
    if (error?.code === "ENOENT") return {};
    throw new Error(`Cannot resume from ${path.relative(ROOT, outputPath)}: ${error.message}`);
  }
}

async function writeModuleAtomic(outputPath, data) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporary = `${outputPath}.${process.pid}.tmp`;
  await writeFile(temporary, `export default ${JSON.stringify(data)}\n`, "utf8");
  try {
    await rename(temporary, outputPath);
  } catch (error) {
    await unlink(temporary).catch(() => {});
    throw error;
  }
}

async function mapLimit(items, limit, operation) {
  let cursor = 0;
  const failures = [];
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      try {
        await operation(items[index], index);
      } catch (error) {
        failures.push({ item: items[index], error });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  if (failures.length > 0) {
    const detail = failures.map(({ item, error }) => `chapter ${item}: ${error.message}`).join("; ");
    throw new Error(detail);
  }
}

async function processTarget(course, locale, options, apiKey) {
  const englishPath = path.join(ROOT, "lib", COURSES[course]);
  const outputPath = path.join(ROOT, "lib", "content-i18n", course, `${locale}.js`);
  const english = JSON.parse(await readFile(englishPath, "utf8"));
  const output = await readExistingModule(outputPath);
  const chapterNumbers = Object.keys(english).sort((a, b) => Number(a) - Number(b));
  const pending = chapterNumbers.filter((number) => options.force || !isComplete(output[number]));
  const relativeOutput = path.relative(ROOT, outputPath);

  console.log(`${course}/${locale}: ${pending.length} pending, ${chapterNumbers.length - pending.length} complete -> ${relativeOutput}`);
  if (options.dryRun || pending.length === 0) return { pending: pending.length, changed: false };

  let writeQueue = Promise.resolve();
  const checkpoint = () => {
    const snapshot = { ...output };
    writeQueue = writeQueue.then(() => writeModuleAtomic(outputPath, snapshot));
    return writeQueue;
  };

  await mapLimit(pending, options.concurrency, async (number) => {
    const sourceChapter = english[number];
    if (!sourceChapter?.hasContent || typeof sourceChapter.html !== "string" || !sourceChapter.html.trim()) {
      throw new Error(`English source chapter ${number} has no generated content`);
    }
    const html = await translateHtml(sourceChapter.html, locale, apiKey, options.retries);
    output[number] = {
      ...sourceChapter,
      html,
      toc: deriveToc(html),
      hasContent: true,
    };
    await checkpoint();
    console.log(`${course}/${locale}: checkpointed chapter ${number}`);
  });
  await writeQueue;
  return { pending: pending.length, changed: true };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!options.dryRun && !apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is required unless --dry-run is used");
  }

  console.log(`Selected ${options.courses.length} course(s) and ${options.locales.length} locale(s)`);
  if (options.dryRun) console.log("Dry run: no API requests or file writes will be made");

  let pending = 0;
  let changed = 0;
  for (const course of options.courses) {
    for (const locale of options.locales) {
      const result = await processTarget(course, locale, options, apiKey);
      pending += result.pending;
      if (result.changed) changed += 1;
    }
  }
  console.log(`${options.dryRun ? "Would translate" : "Translated"} ${pending} chapter(s); ${changed} module(s) written`);
}

main().catch((error) => {
  console.error(`Translation generator failed: ${error.message}`);
  process.exitCode = 1;
});
