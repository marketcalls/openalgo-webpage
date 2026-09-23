// Build-time generator for the /script documentation (OpenScript).
//
// Reads content/script/nav.json and every page under content/script/<section>/,
// renders them with the language's own compiler supplying every reference fact,
// and writes:
//
//   lib/scriptDocsData.json               the pages, for the static routes
//   public/script/search-index.json       the search palette's index
//   public/script/language.json           names, signatures and summaries the
//                                         code viewer's hover and completion read
//   public/script/openscript-reference.md the whole documentation as one
//                                         markdown file, for AI assistants
//   public/script/llms.txt                a map of that file
//
// No filesystem access happens at runtime: the Worker imports the JSON module.
// Run it with `npm run gen:script`; `npm run gen` includes it.
import fs from "node:fs";
import path from "node:path";

import { ROOT, PACKAGE_VERSION, LIBRARY_KEYS, entryFacts, anchorFor, RESERVED_WORDS, ERRORS } from "./script-docs/language.mjs";
import { renderPage, loadScreens } from "./script-docs/render.mjs";
import { V1_ROUTE, writeReferenceV1 } from "./script-docs/reference-v1.mjs";

const CONTENT = path.join(ROOT, "content", "script");
const nav = JSON.parse(fs.readFileSync(path.join(CONTENT, "nav.json"), "utf8"));

export function keyPageMap() {
  const map = new Map();
  for (const s of nav.sections) for (const p of s.pages) for (const k of p.entries ?? []) map.set(k, p.slug);
  return map;
}

export function buildAll({ quiet = false } = {}) {
  const keyPage = keyPageMap();
  const screens = loadScreens();
  const pages = {};
  const results = [];
  for (const section of nav.sections) {
    for (const p of section.pages) {
      const id = `${section.slug}/${p.slug}`;
      const file = path.join(CONTENT, section.slug, `${p.slug}.md`);
      if (!fs.existsSync(file)) {
        results.push({ id, missing: true, section, p });
        continue;
      }
      const src = fs.readFileSync(file, "utf8");
      const { meta, html, ctx } = renderPage(src, { page: id, keyPage, screens, version: PACKAGE_VERSION });
      pages[id] = {
        title: meta.title || p.title,
        description: meta.description || p.brief,
        section: section.title,
        sectionSlug: section.slug,
        html,
        toc: ctx.toc,
      };
      results.push({ id, section, p, meta, ctx, src });
    }
  }
  if (!quiet) {
    const missing = results.filter((r) => r.missing).length;
    console.log(`[gen:script] ${Object.keys(pages).length} pages rendered, ${missing} not written yet`);
  }
  return { pages, results, keyPage, screens };
}

function write() {
  const { pages, results, keyPage } = buildAll();

  const navOut = nav.sections.map((s) => ({
    slug: s.slug,
    title: s.title,
    pages: s.pages.map((p) => ({ slug: p.slug, title: pages[`${s.slug}/${p.slug}`]?.title ?? p.title, brief: p.brief, ready: Boolean(pages[`${s.slug}/${p.slug}`]) })),
  }));
  const data = { version: PACKAGE_VERSION, nav: navOut, pages };
  fs.writeFileSync(path.join(ROOT, "lib", "scriptDocsData.json"), JSON.stringify(data));

  // Search: pages, their second-level headings, entries and errors.
  const search = [];
  for (const r of results) {
    if (r.missing) continue;
    const url = `/script/${r.id}`;
    search.push({ k: "page", t: pages[r.id].title, u: url, s: r.section.title, d: pages[r.id].description });
    for (const h of r.ctx.toc) if (h.level === 2) search.push({ k: "heading", t: h.text, u: `${url}#${h.id}`, s: pages[r.id].title });
    for (const e of r.ctx.search) search.push({ k: e.k, t: e.t, u: `${url}#${e.a}`, s: pages[r.id].title, d: e.d });
  }
  const pub = path.join(ROOT, "public", "script");
  fs.mkdirSync(pub, { recursive: true });

  // The reference manual: every implemented name on one page.
  const pageTitles = new Map(Object.entries(pages).map(([id, p]) => [id, p.title]));
  const v1 = writeReferenceV1({ results, keyPage, screens: loadScreens(), pageTitles });
  search.unshift({
    k: "page",
    t: "Reference manual v1",
    u: V1_ROUTE,
    s: "Reference",
    d: "Every implemented variable, constant, function, keyword, type and operator on one page, each with its syntax, arguments and an example.",
  });
  fs.writeFileSync(path.join(pub, "search-index.json"), JSON.stringify(search));

  // The code viewer's language data: every name with its signatures and the
  // specification's one line, and where its entry lives.
  const names = {};
  for (const key of LIBRARY_KEYS) {
    const f = entryFacts(key);
    const page = keyPage.get(key);
    const cur = names[f.name] ?? { s: [], d: "", u: "", k: f.callable ? "f" : "v", p: f.planned ? 1 : 0 };
    cur.s.push(...f.signatures);
    if (!cur.d && f.summary) cur.d = f.summary;
    if (page && (!cur.u || f.callable)) cur.u = `/script/reference/${page}#${anchorFor(key)}`;
    if (f.callable) cur.k = "f";
    names[f.name] = cur;
  }
  fs.writeFileSync(path.join(pub, "language.json"), JSON.stringify({ version: PACKAGE_VERSION, keywords: RESERVED_WORDS, names }));

  // One markdown file holding everything, for AI assistants.
  const md = [`# OpenScript ${PACKAGE_VERSION} complete reference`, "", "OpenScript (also called OpenAlgo Script) is an open trading language for studies and strategies. This file holds the whole documentation at https://openalgo.in/script as plain markdown.", ""];
  for (const s of nav.sections) {
    md.push(`# ${s.title}`, "");
    for (const p of s.pages) {
      const r = results.find((x) => x.id === `${s.slug}/${p.slug}`);
      if (!r || r.missing) continue;
      md.push(`## ${pages[r.id].title}`, "", `Source: https://openalgo.in/script/${r.id}`, "");
      md.push(markdownForLLM(r.src));
      md.push("");
    }
  }
  fs.writeFileSync(path.join(pub, "openscript-reference.md"), md.join("\n"));
  const llms = ["# OpenScript", "", "> OpenScript (OpenAlgo Script) is an open trading language: write a study or a strategy once, plot it, backtest it and trade it through OpenAlgo.", "", "## Documentation", ""];
  for (const s of nav.sections) {
    llms.push(`### ${s.title}`, "");
    for (const p of s.pages) if (pages[`${s.slug}/${p.slug}`]) llms.push(`- [${pages[`${s.slug}/${p.slug}`].title}](https://openalgo.in/script/${s.slug}/${p.slug}): ${p.brief}`);
    llms.push("");
  }
  llms.push("## Complete reference", "", "- [openscript-reference.md](https://openalgo.in/script/openscript-reference.md): every page above in one markdown file", `- [Reference manual v1](https://openalgo.in${V1_ROUTE}): every implemented variable, constant, function, keyword, type and operator on one page`, "");
  fs.writeFileSync(path.join(pub, "llms.txt"), llms.join("\n"));
  const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0);
  writeRoutes();
  console.log(`[gen:script] lib/scriptDocsData.json ${kb(path.join(ROOT, "lib", "scriptDocsData.json"))} KB, search ${search.length} items, reference md ${kb(path.join(pub, "openscript-reference.md"))} KB`);
  const counts = Object.entries(v1.counts).map(([k, n]) => `${n} ${k}`).join(", ");
  console.log(`[gen:script] reference v1: ${counts}; ${(v1.bytes / 1024).toFixed(0)} KB of entries${v1.problems.length ? `; ${v1.problems.length} problem(s), run check:script` : ""}`);
}

// One static route file per written page, plus a layout per section. The docs
// are served as static routes, one folder per page like the courses, because a
// dynamic [section]/[page] route is answered with a 404 by the Worker that
// OpenNext builds on this project, while static routes come from the prerender
// cache. The files are generated so a page added to nav.json gets its route.
const ROUTE_HEADER = "// Generated by scripts/gen-script-docs.mjs from content/script/nav.json. Do not edit.\n";

function writeIfChanged(file, text) {
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === text) return 0;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  return 1;
}

function writeRoutes() {
  const appDir = path.join(ROOT, "app", "script");
  let changed = 0;
  let routes = 0;
  for (const section of nav.sections) {
    const written = section.pages.filter((p) => fs.existsSync(path.join(CONTENT, section.slug, `${p.slug}.md`)));
    if (!written.length) continue;
    const secDir = path.join(appDir, section.slug);
    changed += writeIfChanged(path.join(secDir, "layout.jsx"), `${ROUTE_HEADER}export { default } from "@/components/script/ScriptDocsSectionLayout"
`);
    for (const p of written) {
      const s = JSON.stringify(section.slug);
      const g = JSON.stringify(p.slug);
      const text = `${ROUTE_HEADER}import ScriptDocView, { scriptDocMetadata } from "@/components/script/ScriptDocView"

export const metadata = scriptDocMetadata(${s}, ${g})

export default function Page() {
  return <ScriptDocView section={${s}} page={${g}} />
}
`;
      changed += writeIfChanged(path.join(secDir, p.slug, "page.jsx"), text);
      routes++;
    }
  }
  console.log(`[gen:script] ${routes} static routes under app/script, ${changed} file(s) updated`);
}

/** A page's markdown with every directive expanded into plain markdown. */
function markdownForLLM(src) {
  const body = src.replace(/^---[\s\S]*?---\s*/, "");
  return body
    .replace(/^\{\{entry:\s*([^}]+?)\s*\}\}\s*$/gm, (_, key) => {
      const f = entryFacts(key);
      const lines = [`### ${key}${f.planned ? " (planned, not available yet)" : ""}`, "", "```", ...f.signatures, "```"];
      const params = f.overloads.flatMap((o) => o.parameters);
      if (params.length) {
        lines.push("", "| Parameter | Type | Default |", "|---|---|---|");
        const seen = new Set();
        for (const p of params) {
          if (seen.has(p.name)) continue;
          seen.add(p.name);
          lines.push(`| ${p.name} | ${p.type} | ${p.required ? "required" : p.default ?? "optional"}${p.values.length ? ` (one of ${p.values.map((v) => `"${v}"`).join(", ")})` : ""} |`);
        }
      }
      if (f.warmup) lines.push("", `First value: ${f.warmup}`);
      return lines.join("\n") + "\n";
    })
    .replace(/^\{\{errors:\s*(OS\d)\s*\}\}\s*$/gm, (_, prefix) =>
      ERRORS.filter((e) => e.code.startsWith(prefix)).map((e) => `### ${e.code} ${e.title}\n\n${e.message}\n\nFix: ${e.fix}\n`).join("\n"))
    .replace(/^\{\{error:\s*(OS\d+)\s*\}\}\s*$/gm, (_, code) => {
      const e = ERRORS.find((x) => x.code === code);
      return e ? `### ${e.code} ${e.title}\n\n${e.message}\n\nFix: ${e.fix}\n` : "";
    })
    .replace(/^\{\{screen:[^}]*\}\}\s*$/gm, "")
    .replace(/\[\[([A-Za-z][\w.]*(?:\(\))?)\]\]/g, "`$1`")
    .replace(/^:::(\w+)\s*(.*)$/gm, (_, k, label) => `> **${label || k}**`)
    .replace(/^:::\s*$/gm, "")
    .replace(/```openscript[^\n]*/g, "```openscript");
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))) write();
