#!/usr/bin/env node

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const COURSES = Object.freeze({
  stocks: "stocksCurriculum.js",
  technicals: "technicalsCurriculum.js",
  fundamentals: "fundamentalsCurriculum.js",
  futures: "futuresCurriculum.js",
  "options-basics": "optionsBasicsCurriculum.js",
  "options-strategies": "optionsStrategiesCurriculum.js",
  python: "pythonCurriculum.js",
  quant: "quantCurriculum.js",
  "stats-arb": "statsArbCurriculum.js",
  amibroker: "amibrokerCurriculum.js",
  taxation: "taxationCurriculum.js",
  "risk-management": "riskCurriculum.js",
  "trading-psychology": "psychologyCurriculum.js",
});

const LOCALES = Object.freeze([
  "hi", "ta", "te", "ml", "mr", "kn", "gu", "bn", "ur", "or",
  "es", "ar", "fr", "ru", "pt",
]);

const API_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";
const DEFAULT_CONCURRENCY = 3;
const MAX_CONCURRENCY = 12;
const DEFAULT_RETRIES = 5;
const MAX_RETRIES = 10;
const MAX_BATCH_ITEMS = 100;
const MAX_BATCH_CODE_POINTS = 20_000;
const RETRYABLE_STATUS = new Set([408, 429]);

const TECHNICAL_TOKEN_PATTERN = new RegExp([
  "```[\\s\\S]*?```",
  "`[^`]+`",
  "https?:\\/\\/[^\\s<>\\\"']+",
  "www\\.[^\\s<>\\\"']+",
  "[A-Za-z]:\\\\[^\\s<>\\\"']+",
  "(?:\\.\\.?\\/|\\/)[A-Za-z0-9][A-Za-z0-9_./?=&%#:+~-]*",
  "--[a-z][a-z0-9-]*",
  "\\b(?:OpenAlgo|AmiBroker|Python|JavaScript|TypeScript|JSON|REST|API|NSE|BSE|MCX|NFO|SEBI|OHLC|OHLCV|VWAP|RSI|MACD|ATR|EMA|SMA|P&L)\\b",
  "\\b(?:NSE|BSE|MCX|NFO):[A-Z0-9_-]+\\b",
  "\\b[A-Z][A-Z0-9_]{1,}\\b",
  "\\b[A-Za-z_$][A-Za-z0-9_$]*_[A-Za-z0-9_$]+\\b",
  "\\b[a-z]+[A-Z][A-Za-z0-9]*\\b",
  "\\b[A-Za-z_$][A-Za-z0-9_$]*\\([^)]*\\)",
  "\\b(?:v?\\d+(?:\\.\\d+){1,}|\\d+(?:\\.\\d+)?%)\\b",
].join("|"), "g");

function usage() {
  return `Usage: node scripts/translate-learn-metadata.mjs [options]

Options:
  --course <slug[,slug...]>  Restrict to one or more of the 13 courses
  --locale <code[,code...]>  Restrict to one or more of the 15 locales
  --dry-run                  Report pending targets; do not call Google or write
  --force                    Replace complete or partial target files
  --concurrency <1-${MAX_CONCURRENCY}>     Concurrent course/locale targets (default ${DEFAULT_CONCURRENCY})
  --retries <0-${MAX_RETRIES}>         Transient-request retries (default ${DEFAULT_RETRIES})
  --help                     Show this help

Filters may be repeated. Use "all" to select every course or locale.

Output: {course,locale,parts:[{id,name,desc,chapters:[
  {n,slug,title,summary,learn,tags}
]}]}

Chapter slugs are copied unchanged from the English curriculum.`;
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
    const equals = arg.indexOf("=");
    if (equals !== -1) return { value: arg.slice(equals + 1), next: index };
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
      options.courses.push(...splitSelection(found.value));
      index = found.next;
    } else if (arg === "--locale" || arg.startsWith("--locale=")) {
      const found = takeValue(arg, index);
      options.locales.push(...splitSelection(found.value));
      index = found.next;
    } else if (arg === "--concurrency" || arg.startsWith("--concurrency=")) {
      const found = takeValue(arg, index);
      options.concurrency = boundedInteger(found.value, "--concurrency", 1, MAX_CONCURRENCY);
      index = found.next;
    } else if (arg === "--retries" || arg.startsWith("--retries=")) {
      const found = takeValue(arg, index);
      options.retries = boundedInteger(found.value, "--retries", 0, MAX_RETRIES);
      index = found.next;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  options.courses = validateSelection(options.courses, Object.keys(COURSES), "course");
  options.locales = validateSelection(options.locales, LOCALES, "locale");
  return options;
}

function splitSelection(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function boundedInteger(raw, flag, minimum, maximum) {
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

function decodeHtml(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith("#x")) return String.fromCodePoint(Number.parseInt(lower.slice(2), 16));
    if (lower.startsWith("#")) return String.fromCodePoint(Number.parseInt(lower.slice(1), 10));
    return named[lower] ?? match;
  });
}

function protectTokens(value, valueIndex) {
  const protectedValues = [];
  const text = value.replace(TECHNICAL_TOKEN_PATTERN, (token) => {
    const placeholder = `\uE000OA${valueIndex}X${protectedValues.length}\uE001`;
    protectedValues.push({ placeholder, token });
    return placeholder;
  });
  return { text, protectedValues };
}

function restoreTokens(value, protectedValues) {
  let restored = value;
  for (const { placeholder, token } of protectedValues) {
    if (!restored.includes(placeholder)) {
      throw new Error("Google Translation modified a protected technical token");
    }
    restored = restored.replaceAll(placeholder, token);
  }
  if (restored.includes("\uE000") || restored.includes("\uE001")) {
    throw new Error("An unresolved translation placeholder remains");
  }
  return restored;
}

function makeBatches(items) {
  const batches = [];
  let batch = [];
  let size = 0;
  for (const item of items) {
    const itemSize = codePointLength(item.text);
    if (itemSize > MAX_BATCH_CODE_POINTS) {
      throw new Error(`Metadata value exceeds ${MAX_BATCH_CODE_POINTS} Unicode code points`);
    }
    if (batch.length > 0 && (batch.length >= MAX_BATCH_ITEMS || size + itemSize > MAX_BATCH_CODE_POINTS)) {
      batches.push(batch);
      batch = [];
      size = 0;
    }
    batch.push(item);
    size += itemSize;
  }
  if (batch.length > 0) batches.push(batch);
  return batches;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function backoff(attempt, retryAfter) {
  const retrySeconds = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : 0;
  const exponential = Math.min(30_000, 1_000 * (2 ** attempt));
  const jitter = Math.floor(Math.random() * 400);
  await sleep(Math.max(retrySeconds * 1_000, exponential + jitter));
}

function isRetryableStatus(status) {
  return RETRYABLE_STATUS.has(status) || (status >= 500 && status <= 599);
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
        if (attempt < retries && isRetryableStatus(response.status)) {
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
      const terminalHttpError = error instanceof Error
        && error.message.startsWith("Google Translation request failed");
      if (attempt >= retries || terminalHttpError) throw error;
      await backoff(attempt, null);
    }
  }
}

async function translateStrings(values, locale, apiKey, retries) {
  const translated = [...values];
  const work = [];

  values.forEach((value, index) => {
    if (typeof value !== "string") throw new Error("Translatable metadata must be a string");
    if (!value.trim()) return;
    const protectedValue = protectTokens(value, index);
    work.push({ index, text: protectedValue.text, protectedValues: protectedValue.protectedValues });
  });

  for (const batch of makeBatches(work)) {
    const results = await requestTranslations(batch.map((item) => item.text), locale, apiKey, retries);
    results.forEach((result, index) => {
      const item = batch[index];
      translated[item.index] = restoreTokens(result, item.protectedValues);
    });
  }
  return translated;
}

function normalizeStringList(value, field, context) {
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) return [...value];
  throw new Error(`${context}.${field} must be a string or an array of strings`);
}

async function translatePartShell(sourcePart, locale, apiKey, retries) {
  const [name, desc] = await translateStrings([
    String(sourcePart.name ?? ""),
    String(sourcePart.desc ?? ""),
  ], locale, apiKey, retries);
  return { id: sourcePart.id, name, desc, chapters: [] };
}

async function translateChapter(sourceChapter, locale, apiKey, retries, context) {
  const learn = normalizeStringList(sourceChapter.learn, "learn", context);
  const tags = normalizeStringList(sourceChapter.tags, "tags", context);
  const sourceValues = [
    String(sourceChapter.title ?? ""),
    String(sourceChapter.summary ?? ""),
    ...learn,
    ...tags,
  ];
  const values = await translateStrings(sourceValues, locale, apiKey, retries);
  const title = values.shift();
  const summary = values.shift();
  const translatedLearn = values.splice(0, learn.length);
  const translatedTags = values.splice(0, tags.length);
  return {
    n: sourceChapter.n,
    slug: sourceChapter.slug,
    title,
    summary,
    learn: translatedLearn,
    tags: translatedTags,
  };
}

function validateSource(course, parts) {
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error(`${course} curriculum does not export a non-empty PARTS array`);
  }
  const partIds = new Set();
  const chapterNumbers = new Set();
  for (const [partIndex, part] of parts.entries()) {
    if (!part || (typeof part.id !== "string" && typeof part.id !== "number")) {
      throw new Error(`${course} part ${partIndex + 1} has no id`);
    }
    if (partIds.has(part.id)) throw new Error(`${course} has duplicate part id ${part.id}`);
    partIds.add(part.id);
    if (!Array.isArray(part.chapters)) throw new Error(`${course} part ${part.id} has no chapters array`);
    for (const chapter of part.chapters) {
      if (!chapter || !Number.isInteger(chapter.n)) {
        throw new Error(`${course} part ${part.id} has a chapter without an integer n`);
      }
      if (typeof chapter.slug !== "string" || !chapter.slug) {
        throw new Error(`${course} chapter ${chapter.n} has no slug`);
      }
      if (chapterNumbers.has(chapter.n)) throw new Error(`${course} has duplicate chapter n ${chapter.n}`);
      chapterNumbers.add(chapter.n);
      normalizeStringList(chapter.learn, "learn", `${course} chapter ${chapter.n}`);
      normalizeStringList(chapter.tags, "tags", `${course} chapter ${chapter.n}`);
    }
  }
}

function validTranslatedString(source, translated) {
  return typeof translated === "string" && (!String(source ?? "").trim() || translated.trim().length > 0);
}

function validTranslatedList(source, translated, field, context) {
  const sourceList = normalizeStringList(source, field, context);
  return Array.isArray(translated)
    && translated.length === sourceList.length
    && translated.every((item, index) => validTranslatedString(sourceList[index], item));
}

function isPartShellComplete(source, translated) {
  return translated
    && translated.id === source.id
    && validTranslatedString(source.name, translated.name)
    && validTranslatedString(source.desc, translated.desc)
    && Array.isArray(translated.chapters);
}

function isChapterComplete(source, translated, context) {
  return translated
    && translated.n === source.n
    && translated.slug === source.slug
    && validTranslatedString(source.title, translated.title)
    && validTranslatedString(source.summary, translated.summary)
    && validTranslatedList(source.learn, translated.learn, "learn", context)
    && validTranslatedList(source.tags, translated.tags, "tags", context);
}

function isCompleteDocument(sourceParts, document, course, locale) {
  if (!document || document.course !== course || document.locale !== locale) return false;
  if (!Array.isArray(document.parts) || document.parts.length !== sourceParts.length) return false;
  return sourceParts.every((sourcePart, partIndex) => {
    const translatedPart = document.parts[partIndex];
    if (!isPartShellComplete(sourcePart, translatedPart)) return false;
    if (translatedPart.chapters.length !== sourcePart.chapters.length) return false;
    return sourcePart.chapters.every((sourceChapter, chapterIndex) => isChapterComplete(
      sourceChapter,
      translatedPart.chapters[chapterIndex],
      `${course} chapter ${sourceChapter.n}`,
    ));
  });
}

async function readExisting(outputPath) {
  try {
    const parsed = JSON.parse(await readFile(outputPath, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    if (error?.code === "ENOENT" || error instanceof SyntaxError) return null;
    throw error;
  }
}

async function writeJsonAtomic(outputPath, data) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporary = `${outputPath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temporary, outputPath);
}

function resumableDocument(existing, sourceParts, course, locale, force) {
  if (force || !existing || existing.course !== course || existing.locale !== locale || !Array.isArray(existing.parts)) {
    return { course, locale, parts: [] };
  }

  const parts = [];
  for (const sourcePart of sourceParts) {
    const candidate = existing.parts.find((part) => part?.id === sourcePart.id);
    if (!isPartShellComplete(sourcePart, candidate)) break;
    const chapters = [];
    for (const sourceChapter of sourcePart.chapters) {
      const translatedChapter = candidate.chapters.find((chapter) => chapter?.n === sourceChapter.n);
      if (!isChapterComplete(sourceChapter, translatedChapter, `${course} chapter ${sourceChapter.n}`)) break;
      chapters.push(translatedChapter);
    }
    parts.push({ id: candidate.id, name: candidate.name, desc: candidate.desc, chapters });
    if (chapters.length !== sourcePart.chapters.length) break;
  }
  return { course, locale, parts };
}

async function loadCurricula(courses) {
  const curricula = new Map();
  for (const course of courses) {
    const modulePath = path.join(ROOT, "lib", COURSES[course]);
    const curriculum = await import(pathToFileURL(modulePath).href);
    validateSource(course, curriculum.PARTS);
    curricula.set(course, curriculum.PARTS);
  }
  return curricula;
}

async function processTarget(course, locale, sourceParts, options, apiKey) {
  const outputPath = path.join(ROOT, "public", "i18n", "courses", course, `${locale}.json`);
  const relativeOutput = path.relative(ROOT, outputPath);
  const existing = await readExisting(outputPath);
  if (!options.force && isCompleteDocument(sourceParts, existing, course, locale)) {
    console.log(`${course}/${locale}: complete, skipped -> ${relativeOutput}`);
    return { changed: false, pending: 0 };
  }

  const output = resumableDocument(existing, sourceParts, course, locale, options.force);
  const completedChapters = output.parts.reduce((total, part) => total + part.chapters.length, 0);
  const totalChapters = sourceParts.reduce((total, part) => total + part.chapters.length, 0);
  const pending = totalChapters - completedChapters;
  console.log(`${course}/${locale}: ${pending} chapter(s) pending -> ${relativeOutput}`);
  if (options.dryRun) return { changed: false, pending };

  for (let partIndex = 0; partIndex < sourceParts.length; partIndex += 1) {
    const sourcePart = sourceParts[partIndex];
    let translatedPart = output.parts[partIndex];
    if (!isPartShellComplete(sourcePart, translatedPart)) {
      translatedPart = await translatePartShell(sourcePart, locale, apiKey, options.retries);
      output.parts[partIndex] = translatedPart;
      output.parts.length = partIndex + 1;
      await writeJsonAtomic(outputPath, output);
      console.log(`${course}/${locale}: checkpointed part ${sourcePart.id}`);
    }

    for (let chapterIndex = translatedPart.chapters.length; chapterIndex < sourcePart.chapters.length; chapterIndex += 1) {
      const sourceChapter = sourcePart.chapters[chapterIndex];
      translatedPart.chapters.push(await translateChapter(
        sourceChapter,
        locale,
        apiKey,
        options.retries,
        `${course} chapter ${sourceChapter.n}`,
      ));
      await writeJsonAtomic(outputPath, output);
      console.log(`${course}/${locale}: checkpointed chapter ${sourceChapter.n}`);
    }
  }

  if (!isCompleteDocument(sourceParts, output, course, locale)) {
    throw new Error(`${course}/${locale} failed final document validation`);
  }
  return { changed: true, pending };
}

async function mapLimit(items, limit, operation) {
  let cursor = 0;
  const failures = [];
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      try {
        await operation(items[index]);
      } catch (error) {
        failures.push(`${items[index].course}/${items[index].locale}: ${error.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  if (failures.length > 0) throw new Error(failures.join("; "));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!options.dryRun && !apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is required unless --dry-run is used");
  }

  const curricula = await loadCurricula(options.courses);
  const targets = options.courses.flatMap((course) => options.locales.map((locale) => ({ course, locale })));
  console.log(`Selected ${options.courses.length} course(s), ${options.locales.length} locale(s), ${targets.length} target(s)`);
  if (options.dryRun) console.log("Dry run: no API requests or file writes will be made");

  let pending = 0;
  let changed = 0;
  await mapLimit(targets, options.concurrency, async ({ course, locale }) => {
    const result = await processTarget(course, locale, curricula.get(course), options, apiKey);
    pending += result.pending;
    if (result.changed) changed += 1;
  });
  console.log(`${options.dryRun ? "Would translate" : "Translated"} ${pending} chapter target(s); ${changed} file(s) written`);
}

main().catch((error) => {
  console.error(`Metadata translation generator failed: ${error.message}`);
  process.exitCode = 1;
});
