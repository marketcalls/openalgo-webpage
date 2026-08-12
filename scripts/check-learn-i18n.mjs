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

const failures = []
let expectedTranslationChapters = 0
let completeTranslationChapters = 0

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

function checkCurriculumRoutes(course, expectedChapterCount) {
  const curriculumPath = path.join(ROOT, 'lib', course.curriculum)
  const source = readText(curriculumPath, `[${course.course}] curriculum`)
  if (source === null) return

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

for (const course of COURSES) {
  const chapters = englishChapterNumbers(course)
  checkCurriculumRoutes(course, chapters.length)
  for (const locale of LOCALES.slice(1)) {
    checkTranslation(course, locale, chapters)
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
