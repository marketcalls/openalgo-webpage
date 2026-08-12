#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const LOCALES = [
  'en',
  'hi',
  'ta',
  'te',
  'ml',
  'mr',
  'kn',
  'gu',
  'bn',
  'ur',
  'or',
  'es',
  'ar',
  'fr',
  'ru',
  'pt',
]

const COURSES = [
  { course: 'stocks', source: 'stocks', curriculum: 'stocksCurriculum.js' },
  {
    course: 'technicals',
    source: 'technicals',
    curriculum: 'technicalsCurriculum.js',
  },
  {
    course: 'fundamentals',
    source: 'fundamentals',
    curriculum: 'fundamentalsCurriculum.js',
  },
  { course: 'futures', source: 'futures', curriculum: 'futuresCurriculum.js' },
  {
    course: 'options-basics',
    source: 'options-basics',
    curriculum: 'optionsBasicsCurriculum.js',
  },
  {
    course: 'options-strategies',
    source: 'options-strategies',
    curriculum: 'optionsStrategiesCurriculum.js',
  },
  { course: 'python', source: 'python', curriculum: 'pythonCurriculum.js' },
  { course: 'quant', source: 'quant', curriculum: 'quantCurriculum.js' },
  {
    course: 'stats-arb',
    source: 'stats-arb',
    curriculum: 'statsArbCurriculum.js',
  },
  {
    course: 'amibroker',
    source: 'amibroker',
    curriculum: 'amibrokerCurriculum.js',
  },
  {
    course: 'taxation',
    source: 'taxation',
    curriculum: 'taxationCurriculum.js',
  },
  {
    course: 'risk-management',
    source: 'risk-management',
    curriculum: 'riskCurriculum.js',
  },
  {
    course: 'trading-psychology',
    source: 'trading-psychology',
    curriculum: 'psychologyCurriculum.js',
  },
]

function selectedValues(flag, allowed) {
  const values = []
  for (let index = 2; index < process.argv.length; index += 1) {
    const argument = process.argv[index]
    if (argument === flag) {
      const value = process.argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
      values.push(...value.split(',').map((item) => item.trim()).filter(Boolean))
      index += 1
    } else if (argument.startsWith(`${flag}=`)) {
      values.push(...argument.slice(flag.length + 1).split(',').map((item) => item.trim()).filter(Boolean))
    }
  }
  if (!values.length || values.includes('all')) return new Set(allowed)
  const unknown = values.filter((value) => !allowed.includes(value))
  if (unknown.length) throw new Error(`Unknown ${flag.slice(2)}: ${unknown.join(', ')}`)
  return new Set(values)
}

const SELECTED_COURSES = selectedValues('--course', COURSES.map((course) => course.course))
const SELECTED_LOCALES = selectedValues('--locale', LOCALES.slice(1))

const failures = []
let expectedTranslationChapters = 0
let completeTranslationChapters = 0

const EXACT_ENGLISH_ALLOWLIST = new Set([
  'AFL',
  'AmiBroker',
  'API',
  'ARIMA',
  'BSE',
  'CAPM',
  'CDSL',
  'CSV',
  'CVaR',
  'EWMA',
  'F&O',
  'FPO',
  'GARCH',
  'GST',
  'India VIX',
  'InvIT',
  'IPO',
  'JSON',
  'Jupyter',
  'LTCG',
  'Matplotlib',
  'NFO',
  'Nifty',
  'NSE',
  'NSDL',
  'NumPy',
  'OFS',
  'OHLCV',
  'OpenAlgo',
  'Pandas',
  'Python',
  'RBI',
  'REIT',
  'REST',
  'SciPy',
  'SEBI',
  'Sensex',
  'SQL',
  'STCG',
  'STT',
  'UPI',
  'VaR',
  'VWAP',
  'WebSocket',
  'pandas',
  'scikit-learn',
])

function relative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/')
}

function fail(message) {
  failures.push(message)
}

function readText(filePath, label) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    fail(`${label}: cannot read ${relative(filePath)} (${error.message})`)
    return null
  }
}

function formatNumbers(numbers) {
  return numbers.length ? numbers.join(', ') : 'none'
}

function isObject(value) {
  return value !== null && !Array.isArray(value) && typeof value === 'object'
}

function normalizeVisible(value) {
  return value.trim().replace(/\s+/g, ' ')
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function matchingDelimiter(source, start) {
  const pairs = { '[': ']', '{': '}', '(': ')' }
  const open = source[start]
  const close = pairs[open]
  if (!close) return -1

  let depth = 0
  let quote = null
  let escaped = false
  let lineComment = false
  let blockComment = false

  for (let index = start; index < source.length; index += 1) {
    const char = source[index]
    const next = source[index + 1]

    if (lineComment) {
      if (char === '\n') lineComment = false
      continue
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false
        index += 1
      }
      continue
    }
    if (quote) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = null
      continue
    }
    if (char === '/' && next === '/') {
      lineComment = true
      index += 1
      continue
    }
    if (char === '/' && next === '*') {
      blockComment = true
      index += 1
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }
    if (char === open) depth += 1
    else if (char === close) {
      depth -= 1
      if (depth === 0) return index
    }
  }

  return -1
}

function propertyArray(source, property) {
  const match = new RegExp(`\\b${property}\\s*:`).exec(source)
  if (!match) return null
  const start = source.indexOf('[', match.index + match[0].length)
  if (start < 0) return null
  const end = matchingDelimiter(source, start)
  return end < 0 ? null : source.slice(start, end + 1)
}

function objectElements(arraySource) {
  if (!arraySource) return []
  const elements = []
  let index = 1
  while (index < arraySource.length - 1) {
    if (arraySource[index] === '{') {
      const end = matchingDelimiter(arraySource, index)
      if (end < 0) return elements
      elements.push(arraySource.slice(index, end + 1))
      index = end + 1
    } else index += 1
  }
  return elements
}

function decodeJsString(raw) {
  return raw.replace(/\\(['"\\bfnrtv])/g, (_, escaped) => {
    const values = { b: '\b', f: '\f', n: '\n', r: '\r', t: '\t', v: '\v' }
    return values[escaped] ?? escaped
  })
}

function propertyString(source, property) {
  const match = new RegExp(`\\b${property}\\s*:\\s*(["'])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1`).exec(
    source,
  )
  return match ? decodeJsString(match[2]) : null
}

function propertyNumber(source, property) {
  const match = new RegExp(`\\b${property}\\s*:\\s*(\\d+)\\b`).exec(source)
  return match ? Number(match[1]) : null
}

function stringElements(arraySource) {
  if (!arraySource) return null
  const values = []
  const pattern = /(["'])((?:\\.|(?!\1)[\s\S])*?)\1/g
  let match
  while ((match = pattern.exec(arraySource)) !== null) values.push(decodeJsString(match[2]))
  return values
}

function parseCurriculum(course, source) {
  const marker = /export\s+const\s+PARTS\s*=/.exec(source)
  const arrayStart = marker ? source.indexOf('[', marker.index + marker[0].length) : -1
  const arrayEnd = arrayStart >= 0 ? matchingDelimiter(source, arrayStart) : -1
  if (arrayStart < 0 || arrayEnd < 0) {
    fail(`[${course.course}] cannot statically parse exported PARTS curriculum`)
    return null
  }

  const parts = []
  let nextChapter = 1
  for (const partSource of objectElements(source.slice(arrayStart, arrayEnd + 1))) {
    const part = {
      id: propertyString(partSource, 'id'),
      name: propertyString(partSource, 'name'),
      desc: propertyString(partSource, 'desc'),
      chapters: [],
    }
    for (const chapterSource of objectElements(propertyArray(partSource, 'chapters'))) {
      const explicitNumber = propertyNumber(chapterSource, 'n')
      const chapter = {
        n: explicitNumber ?? nextChapter,
        slug: propertyString(chapterSource, 'slug'),
        title: propertyString(chapterSource, 'title'),
        summary: propertyString(chapterSource, 'summary'),
        learn: stringElements(propertyArray(chapterSource, 'learn')),
        tags: stringElements(propertyArray(chapterSource, 'tags')),
        partId: part.id,
      }
      part.chapters.push(chapter)
      nextChapter = chapter.n + 1
    }
    parts.push(part)
  }

  if (!parts.length || parts.some((part) => !part.id || !part.chapters.length)) {
    fail(`[${course.course}] statically parsed curriculum is missing parts or chapters`)
    return null
  }
  return parts
}

function checkExactEnglish(course, locale, field, translated, english) {
  if (!nonEmptyString(translated) || !nonEmptyString(english)) return
  const value = normalizeVisible(translated)
  if (value === normalizeVisible(english) && !EXACT_ENGLISH_ALLOWLIST.has(value)) {
    fail(`[${course}/${locale}] ${field} is unchanged English: ${JSON.stringify(value)}`)
  }
}

function checkLocalizedStringArray(course, locale, field, translated, english) {
  if (!Array.isArray(translated)) {
    fail(`[${course}/${locale}] ${field} must be an array`)
    return
  }
  if (!Array.isArray(english)) {
    fail(`[${course}] cannot statically determine English ${field} cardinality`)
    return
  }
  if (translated.length !== english.length) {
    fail(
      `[${course}/${locale}] ${field} has ${translated.length} entries; expected ${english.length}`,
    )
  }
  translated.forEach((value, index) => {
    if (!nonEmptyString(value)) {
      fail(`[${course}/${locale}] ${field}[${index}] must be a non-empty string`)
      return
    }
    if (index < english.length) {
      checkExactEnglish(course, locale, `${field}[${index}]`, value, english[index])
    }
  })
}

function readJson(filePath, label) {
  const source = readText(filePath, label)
  if (source === null) return null
  try {
    return JSON.parse(source)
  } catch (error) {
    fail(`${label}: invalid JSON in ${relative(filePath)} (${error.message})`)
    return null
  }
}

function checkLocalizedCourseMetadata(course, locale, englishParts) {
  const filePath = path.join(
    ROOT,
    'public',
    'i18n',
    'courses',
    course.course,
    `${locale}.json`,
  )
  const label = `[${course.course}/${locale}] course metadata`
  const data = readJson(filePath, label)
  if (!isObject(data)) {
    if (data !== null) fail(`${label}: root must be an object`)
    return
  }
  if (data.course !== course.course) {
    fail(`${label}: course must equal ${JSON.stringify(course.course)}`)
  }
  if (data.locale !== locale) fail(`${label}: locale must equal ${JSON.stringify(locale)}`)
  if (!Array.isArray(data.parts)) {
    fail(`${label}: parts must be an array`)
    return
  }

  const englishPartMap = new Map(englishParts.map((part) => [part.id, part]))
  const localizedPartIds = data.parts.map((part) => (isObject(part) ? part.id : null))
  const duplicatePartIds = localizedPartIds.filter(
    (id, index) => id !== null && localizedPartIds.indexOf(id) !== index,
  )
  const missingPartIds = englishParts
    .map((part) => part.id)
    .filter((id) => !localizedPartIds.includes(id))
  const unexpectedPartIds = localizedPartIds.filter((id) => id !== null && !englishPartMap.has(id))
  if (duplicatePartIds.length || missingPartIds.length || unexpectedPartIds.length) {
    fail(
      `${label}: duplicate part ids: ${[...new Set(duplicatePartIds)].join(', ') || 'none'}; ` +
        `missing: ${missingPartIds.join(', ') || 'none'}; ` +
        `unexpected: ${[...new Set(unexpectedPartIds)].join(', ') || 'none'}`,
    )
  }

  const englishChapters = englishParts.flatMap((part) => part.chapters)
  const expectedChapterMap = new Map(englishChapters.map((chapter) => [chapter.n, chapter]))
  const seenChapterNumbers = []

  data.parts.forEach((part, partIndex) => {
    if (!isObject(part)) {
      fail(`${label}: parts[${partIndex}] must be an object`)
      return
    }
    const englishPart = englishPartMap.get(part.id)
    if (!englishPart) return

    for (const field of ['name', 'desc']) {
      if (!nonEmptyString(part[field])) {
        fail(`${label}: part ${part.id} ${field} must be a non-empty string`)
      } else {
        checkExactEnglish(course.course, locale, `part ${part.id} ${field}`, part[field], englishPart[field])
      }
    }
    if (!Array.isArray(part.chapters)) {
      fail(`${label}: part ${part.id} chapters must be an array`)
      return
    }

    part.chapters.forEach((chapter, chapterIndex) => {
      if (!isObject(chapter)) {
        fail(`${label}: part ${part.id} chapters[${chapterIndex}] must be an object`)
        return
      }
      if (!Number.isInteger(chapter.n) || chapter.n < 1) {
        fail(`${label}: part ${part.id} chapters[${chapterIndex}].n must be a positive integer`)
        return
      }
      seenChapterNumbers.push(chapter.n)
      const englishChapter = expectedChapterMap.get(chapter.n)
      if (!englishChapter) return
      if (!nonEmptyString(chapter.slug)) {
        fail(`${label}: chapter ${chapter.n} slug must be a non-empty string`)
      } else if (chapter.slug !== englishChapter.slug) {
        fail(
          `${label}: chapter ${chapter.n} slug must equal ` +
            `${JSON.stringify(englishChapter.slug)}; received ${JSON.stringify(chapter.slug)}`,
        )
      }
      if (englishChapter.partId !== part.id) {
        fail(
          `${label}: chapter ${chapter.n} belongs to part ${englishChapter.partId}, not part ${part.id}`,
        )
      }
      for (const field of ['title', 'summary']) {
        if (!nonEmptyString(chapter[field])) {
          fail(`${label}: chapter ${chapter.n} ${field} must be a non-empty string`)
        } else {
          checkExactEnglish(
            course.course,
            locale,
            `chapter ${chapter.n} ${field}`,
            chapter[field],
            englishChapter[field],
          )
        }
      }
      checkLocalizedStringArray(
        course.course,
        locale,
        `chapter ${chapter.n} learn`,
        chapter.learn,
        englishChapter.learn,
      )
      checkLocalizedStringArray(
        course.course,
        locale,
        `chapter ${chapter.n} tags`,
        chapter.tags,
        englishChapter.tags,
      )
    })
  })

  const duplicates = seenChapterNumbers.filter(
    (chapter, index) => seenChapterNumbers.indexOf(chapter) !== index,
  )
  const seenSet = new Set(seenChapterNumbers)
  const missing = englishChapters.map((chapter) => chapter.n).filter((chapter) => !seenSet.has(chapter))
  const unexpected = [...seenSet].filter((chapter) => !expectedChapterMap.has(chapter))
  if (duplicates.length || missing.length || unexpected.length) {
    fail(
      `${label}: duplicate chapters: ${formatNumbers([...new Set(duplicates)])}; ` +
        `missing: ${formatNumbers(missing)}; unexpected: ${formatNumbers(unexpected)}`,
    )
  }
}

function englishChapterNumbers(course) {
  const markdownDir = path.join(ROOT, 'content', course.source, 'md')
  let names

  try {
    names = fs.readdirSync(markdownDir, { withFileTypes: true })
  } catch (error) {
    fail(
      `[${course.course}] cannot read English chapter directory ` +
        `${relative(markdownDir)} (${error.message})`,
    )
    return []
  }

  const chapters = names
    .filter((entry) => entry.isFile())
    .map((entry) => /^ch(\d+)\.md$/i.exec(entry.name))
    .filter(Boolean)
    .map((match) => Number(match[1]))
    .sort((a, b) => a - b)

  if (chapters.length === 0) {
    fail(`[${course.course}] no English ch*.md files found in ${relative(markdownDir)}`)
    return []
  }

  const duplicates = chapters.filter((chapter, index) => chapters[index - 1] === chapter)
  if (duplicates.length) {
    fail(`[${course.course}] duplicate English chapter numbers: ${formatNumbers(duplicates)}`)
  }

  const chapterSet = new Set(chapters)
  const gaps = []
  for (let chapter = 1; chapter <= chapters.at(-1); chapter += 1) {
    if (!chapterSet.has(chapter)) gaps.push(chapter)
  }
  if (gaps.length) {
    fail(`[${course.course}] English chapter numbering has gaps: ${formatNumbers(gaps)}`)
  }

  return [...new Set(chapters)]
}

function parseGeneratedModule(filePath, course, locale) {
  const source = readText(filePath, `[${course}/${locale}] translation module`)
  if (source === null) return null

  const match = source.match(/^\s*export\s+default\s+([\s\S]*?)\s*;?\s*$/)
  if (!match) {
    fail(
      `[${course}/${locale}] ${relative(filePath)} must contain only ` +
        '`export default <JSON object>`',
    )
    return null
  }

  let value
  try {
    value = JSON.parse(match[1])
  } catch (error) {
    fail(
      `[${course}/${locale}] ${relative(filePath)} has an invalid generated JSON payload ` +
        `(${error.message})`,
    )
    return null
  }

  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    fail(`[${course}/${locale}] ${relative(filePath)} must export a chapter object`)
    return null
  }

  return value
}

function checkTranslation(course, locale, expectedChapters) {
  const filePath = path.join(ROOT, 'lib', 'content-i18n', course.course, `${locale}.js`)
  const data = parseGeneratedModule(filePath, course.course, locale)
  expectedTranslationChapters += expectedChapters.length

  if (!data) {
    fail(
      `[${course.course}/${locale}] complete 0/${expectedChapters.length}; ` +
        `missing chapters: ${formatNumbers(expectedChapters)}`,
    )
    return
  }

  const missing = []
  const empty = []
  const invalid = []
  let complete = 0

  for (const chapter of expectedChapters) {
    const item = data[String(chapter)]
    if (item === undefined) {
      missing.push(chapter)
      continue
    }
    if (item === null || Array.isArray(item) || typeof item !== 'object') {
      invalid.push(chapter)
      continue
    }

    const hasHtml = typeof item.html === 'string' && item.html.trim().length > 0
    if (item.hasContent !== true || !hasHtml) {
      empty.push(chapter)
      continue
    }

    complete += 1
  }

  const expectedSet = new Set(expectedChapters.map(String))
  const unexpected = Object.keys(data)
    .filter((chapter) => !expectedSet.has(chapter))
    .sort((a, b) => Number(a) - Number(b))

  completeTranslationChapters += complete

  if (missing.length || empty.length || invalid.length || unexpected.length) {
    fail(
      `[${course.course}/${locale}] complete ${complete}/${expectedChapters.length}; ` +
        `missing: ${formatNumbers(missing)}; ` +
        `empty/hasContent!=true: ${formatNumbers(empty)}; ` +
        `invalid: ${formatNumbers(invalid)}; ` +
        `unexpected: ${formatNumbers(unexpected)}`,
    )
  }
}

function dictionaryKeys(source) {
  const keys = new Set()
  const keyPattern = /(?:^|[,\n]\s*)['"]((?:learn|course|level)\.[^'"\r\n]+)['"]\s*:/g
  let match
  while ((match = keyPattern.exec(source)) !== null) keys.add(match[1])
  return keys
}

function difference(left, right) {
  return [...left].filter((item) => !right.has(item)).sort()
}

function checkDictionaries() {
  const dictionaryDir = path.join(ROOT, 'components', 'i18n', 'dictionaries')
  const englishPath = path.join(dictionaryDir, 'en.js')
  const englishSource = readText(englishPath, '[dictionary/en]')
  if (englishSource === null) return

  const englishKeys = dictionaryKeys(englishSource)
  if (englishKeys.size === 0) {
    fail('[dictionary/en] found no learn.*, course.*, or level.* keys')
    return
  }

  for (const locale of LOCALES) {
    const filePath = path.join(dictionaryDir, `${locale}.js`)
    const source = locale === 'en' ? englishSource : readText(filePath, `[dictionary/${locale}]`)
    if (source === null) continue

    const keys = dictionaryKeys(source)
    const missing = difference(englishKeys, keys)
    const extra = difference(keys, englishKeys)
    if (missing.length || extra.length) {
      fail(
        `[dictionary/${locale}] ${keys.size}/${englishKeys.size} scoped keys; ` +
          `missing: ${missing.length ? missing.join(', ') : 'none'}; ` +
          `extra: ${extra.length ? extra.join(', ') : 'none'}`,
      )
    }
  }
}

function curriculumSlugs(source) {
  const slugs = []
  const slugPattern = /\bslug\s*:\s*(['"])(.*?)\1/g
  let match
  while ((match = slugPattern.exec(source)) !== null) slugs.push(match[2])
  return slugs
}

function checkCurriculumRoutes(course, expectedChapterCount, source) {
  const slugs = curriculumSlugs(source)
  if (slugs.length !== expectedChapterCount) {
    fail(
      `[${course.course}] curriculum has ${slugs.length} slugs but English content has ` +
        `${expectedChapterCount} chapters`,
    )
  }

  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index)
  if (duplicates.length) {
    fail(`[${course.course}] duplicate curriculum slugs: ${[...new Set(duplicates)].join(', ')}`)
  }

  const missingRoutes = slugs.filter((slug) => {
    const route = path.join(ROOT, 'app', course.course, slug, 'page.jsx')
    const alternateRoute = path.join(ROOT, 'app', course.course, slug, 'page.js')
    return !fs.existsSync(route) && !fs.existsSync(alternateRoute)
  })

  if (missingRoutes.length) {
    fail(`[${course.course}] curriculum slugs without app routes: ${missingRoutes.join(', ')}`)
  }
}

checkDictionaries()

for (const course of COURSES.filter((item) => SELECTED_COURSES.has(item.course))) {
  const chapters = englishChapterNumbers(course)
  const curriculumPath = path.join(ROOT, 'lib', course.curriculum)
  const curriculumSource = readText(curriculumPath, `[${course.course}] curriculum`)
  const englishParts = curriculumSource === null ? null : parseCurriculum(course, curriculumSource)
  if (curriculumSource !== null) checkCurriculumRoutes(course, chapters.length, curriculumSource)
  for (const locale of LOCALES.slice(1).filter((item) => SELECTED_LOCALES.has(item))) {
    checkTranslation(course, locale, chapters)
    if (englishParts) checkLocalizedCourseMetadata(course, locale, englishParts)
  }
}

if (failures.length) {
  console.error('Learn i18n completeness check FAILED')
  console.error(
    `Translated chapters complete: ${completeTranslationChapters}/${expectedTranslationChapters}`,
  )
  console.error(`Failures: ${failures.length}\n`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log('Learn i18n completeness check passed')
  console.log(`Courses: ${COURSES.length}`)
  console.log(`Locales: ${LOCALES.length}`)
  console.log(`Translated chapters complete: ${completeTranslationChapters}`)
}
