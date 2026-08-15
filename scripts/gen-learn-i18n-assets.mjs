import { mkdir, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

const sourceRoot = path.resolve("lib/content-i18n")
const outputRoot = path.resolve("public/i18n/content")
const courses = (await readdir(sourceRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

let generated = 0
for (const course of courses) {
  const sourceDir = path.join(sourceRoot, course)
  const outputDir = path.join(outputRoot, course)
  await mkdir(outputDir, { recursive: true })

  const locales = (await readdir(sourceDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((entry) => entry.name)
    .sort()

  for (const filename of locales) {
    const source = path.join(sourceDir, filename)
    const module = await import(pathToFileURL(source).href)
    const output = path.join(outputDir, filename.replace(/\.js$/, ".json"))
    await writeFile(output, `${JSON.stringify(module.default)}\n`, "utf8")
    generated += 1
  }
}

console.log(`Generated ${generated} static learn i18n payloads`)
