// The gate for the /script documentation.
//
//   node scripts/check-script-docs.mjs                 every written page
//   node scripts/check-script-docs.mjs --page reference/math,visuals/plots
//   node scripts/check-script-docs.mjs --strict        also fail on pages not
//                                                      written yet and on
//                                                      screenshots not captured
//
// What it holds the pages to:
//   1. Every ```openscript block compiles with the real compiler, with no error.
//      A complete script must also carry its version line. A block fenced with
//      expect=OSxxxx must raise that code; nocheck skips a block.
//   2. Every reference page documents exactly the keys nav.json gives it, each
//      with a description, and every entry that is not planned with a runnable
//      example below it.
//   3. Every error page holds every catalogue code in its range.
//   4. The keywords page names every reserved word, the operators page every
//      operator mark.
//   5. Every /script link resolves to a written page and an anchor on it.
//   6. Every screenshot a page shows exists.
//   7. The prose names no outside product, platform or broker, and uses no em
//      dash, en dash or emoji.
import fs from "node:fs";
import path from "node:path";

import { ROOT, compileBlock, ERRORS, RESERVED_WORDS, PUNCTUATORS, LIBRARY_KEYS, entryFacts } from "./script-docs/language.mjs";
import { buildAll } from "./gen-script-docs.mjs";
import { loadArgumentDocs } from "./script-docs/render.mjs";
import { buildReferenceV1 } from "./script-docs/reference-v1.mjs";

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const pageArg = args.find((a) => a.startsWith("--page"))
  ? (args[args.indexOf("--page") + 1] ?? args.find((a) => a.startsWith("--page="))?.split("=")[1] ?? "")
  : null;
const only = pageArg ? new Set(pageArg.split(",").map((s) => s.trim()).filter(Boolean)) : null;

const nav = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "script", "nav.json"), "utf8"));
const { pages, results, keyPage, screens } = buildAll({ quiet: true });

// Stored encoded so this file is not the one place in the docs build that
// names what the docs must not. Decode with base64 to read the list.
const BANNED = JSON.parse(Buffer.from(
  "WyJ0cmFkaW5ndmlldyIsInRyYWRpbmcgdmlldyIsInBpbmUgc2NyaXB0IiwicGluZXNjcmlwdCIsInBpbmUiLCJ6ZXJvZGhhIiwia2l0ZSBjb25uZWN0IiwidXBzdG94IiwiYW5nZWwgb25lIiwiYW5nZWxvbmUiLCJmeWVycyIsImRoYW4iLCI1cGFpc2EiLCJhbGljZWJsdWUiLCJhbGljZSBibHVlIiwic2hvb255YSIsImZpbnZhc2lhIiwiZmxhdHRyYWRlIiwia290YWsiLCJpY2ljaSIsImdyb3d3IiwibW90aWxhbCIsImlpZmwiLCJmaXJzdG9jayIsInRyYWRlamluaSIsInplYnUiLCJkZWZpbmVkZ2UiLCJwb2NrZXRmdWwiLCJzYW1jbyIsIm1ldGF0cmFkZXIiLCJuaW5qYXRyYWRlciIsImFtaWJyb2tlciIsImNoYXJ0aW5rIiwiZ29jaGFydGluZyIsImVhc3lsYW5ndWFnZSIsImFmbCIsIm1pY3Jvc29mdCIsIm1vbmFjbyIsInBhcGVyIHRyYWRpbmciLCJ2aXJ0dWFsIHRyYWRpbmciLCJsaXZlIGRhdGEiLCJsaXZlIG1hcmtldCBkYXRhIiwibGl2ZSBwcmljZXMiXQ==",
  "base64").toString("utf8"));
const BANNED_RE = new RegExp(`\\b(${BANNED.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+")).join("|")})\\b`, "i");
const DASHES = /[\u2013\u2014]/;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}\u{2B50}\u{2B55}\u{2705}\u{274C}]/u;

const problems = [];
const warnings = [];
const note = (id, msg) => problems.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

const idsByPage = new Map();
for (const r of results) if (!r.missing) idsByPage.set(r.id, r.ctx.ids);

let blocksChecked = 0;
let entriesSeen = 0;
let errorsSeen = 0;

for (const r of results) {
  if (only && !only.has(r.id)) continue;
  if (r.missing) {
    (strict ? note : warn)(r.id, "page not written yet");
    continue;
  }
  const { ctx, meta, src, p } = r;
  if (!meta.title) note(r.id, "front matter has no title");
  if (!meta.description) note(r.id, "front matter has no description");
  for (const pr of ctx.problems) note(r.id, pr);

  // 7. Names and punctuation, line by line so the report can point.
  src.split(/\r?\n/).forEach((line, i) => {
    const m = line.match(BANNED_RE);
    if (m) note(r.id, `line ${i + 1} names "${m[1]}", which the docs must not`);
    if (DASHES.test(line)) note(r.id, `line ${i + 1} has an em or en dash`);
    if (EMOJI.test(line)) note(r.id, `line ${i + 1} has an emoji or icon`);
  });

  // 1. Code.
  for (const b of ctx.blocks) {
    if (b.attrs.nocheck) continue;
    blocksChecked++;
    const { wrapped, diagnostics } = compileBlock(b.code);
    const firstLine = b.code.split("\n").find((l) => l.trim()) ?? "";
    const where = `block starting "${firstLine.trim().slice(0, 50)}"`;
    if (b.attrs.expect) {
      if (!diagnostics.some((d) => d.code === b.attrs.expect)) {
        note(r.id, `${where} should raise ${b.attrs.expect} and raises ${diagnostics.map((d) => d.code).join(", ") || "nothing"}`);
      }
      continue;
    }
    for (const d of diagnostics) {
      if (d.severity === "error") note(r.id, `${where}: ${d.code} line ${d.line}: ${d.message}`);
      else if (!wrapped && d.code === "OS8003") note(r.id, `${where}: a complete script needs its version line (OS8003)`);
      else warn(r.id, `${where}: warning ${d.code}: ${d.message}`);
    }
  }

  // 2. Reference coverage.
  if (p.entries) {
    const want = new Set(p.entries);
    for (const k of p.entries) if (!ctx.entries.includes(k)) note(r.id, `missing entry {{entry: ${k}}}`);
    for (const k of ctx.entries) if (!want.has(k)) note(r.id, `entry ${k} belongs on another page`);
    for (const [key, body] of ctx.entryBodies) {
      if (!body.description) note(r.id, `${key} has no description paragraph below its directive`);
      if (!body.planned && !/```openscript/.test(`${body.description}\n${body.rest}`)) note(r.id, `${key} has no openscript example`);
    }
    entriesSeen += ctx.entries.length;
  }

  // 3. Errors.
  if (p.errorPrefix) {
    for (const e of ERRORS.filter((x) => x.code.startsWith(p.errorPrefix))) if (!ctx.errors.includes(e.code)) note(r.id, `missing error ${e.code}`);
    errorsSeen += ctx.errors.length;
  }

  // 4. Keywords and operators.
  if (r.id === "reference/keywords") {
    for (const w of [...RESERVED_WORDS, "version", "limits"]) if (!new RegExp("`" + w + "`").test(src)) note(r.id, `keyword ${w} is not documented`);
  }
  if (r.id === "reference/operators") {
    for (const op of PUNCTUATORS) if (!src.includes("`" + op + "`")) note(r.id, `operator mark ${op} is not documented`);
  }

  // 5. Links.
  for (const href of ctx.links) {
    const [pathPart, anchor] = href.split("#");
    const id = pathPart.replace(/^\/script\/?/, "").replace(/\/$/, "");
    if (id === "") continue;
    const target = idsByPage.get(id);
    const known = nav.sections.some((s) => s.pages.some((pg) => `${s.slug}/${pg.slug}` === id));
    if (!known) note(r.id, `link ${href} points at no page`);
    else if (!target) (strict ? note : warn)(r.id, `link ${href} points at a page not written yet`);
    else if (anchor && !target.has(anchor)) note(r.id, `link ${href} points at an anchor the page does not have`);
  }

  // 6. Screens.
  for (const s of ctx.missingScreens) (strict ? note : warn)(r.id, `screenshot ${s} not captured yet`);
}

// 8. The v1 reference manual (/script/reference/v1): every implemented name,
//    every reserved word and every operator mark has an entry; every argument
//    of every implemented function has a written description, and no
//    description names a function or argument the language does not have;
//    every link inside the manual lands on something.
let v1Entries = 0;
if (!only || only.has("reference/v1")) {
  const pageTitles = new Map(Object.entries(pages).map(([id, pg]) => [id, pg.title]));
  const v1 = buildReferenceV1({ results, keyPage, screens, pageTitles });
  const id = "reference/v1";
  for (const pr of v1.problems) note(id, pr);
  const anchors = new Set(Object.keys(v1.html));
  v1Entries = anchors.size;
  const names = new Map(v1.groups.flatMap((g) => g.items.map((it) => [`${g.id}:${it.n}`, it.a])));
  for (const key of LIBRARY_KEYS) {
    const f = entryFacts(key);
    if (f.planned) continue;
    const kinds = f.callable ? ["functions"] : ["variables", "constants"];
    if (!kinds.some((k) => names.has(`${k}:${key}`))) note(id, `implemented ${key} has no entry`);
  }
  for (const w of [...RESERVED_WORDS, "version", "limits"]) if (!names.has(`keywords:${w}`)) note(id, `keyword ${w} has no entry`);
  const opNames = v1.groups.find((g) => g.id === "operators")?.items.map((it) => it.n.split(/\s+/)) ?? [];
  for (const op of PUNCTUATORS) if (!opNames.some((marks) => marks.includes(op))) note(id, `operator mark ${op} has no entry`);

  const ids = new Set();
  for (const html of Object.values(v1.html)) for (const m of html.matchAll(/\bid="([^"]+)"/g)) ids.add(m[1]);
  for (const [anchor, html] of Object.entries(v1.html)) {
    for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) note(id, `${anchor} links to #${m[1]}, which the manual does not have`);
  }
  for (const href of v1.docsLinks) {
    const [pathPart, anchor] = href.split("#");
    const target = idsByPage.get(pathPart.replace(/^\/script\/?/, "").replace(/\/$/, ""));
    if (pathPart.replace(/^\/script\/?/, "") === "") continue;
    if (!target) note(id, `link ${href} points at no written page`);
    else if (anchor && !target.has(anchor)) note(id, `link ${href} points at an anchor the page does not have`);
  }

  // The argument files: nothing stale, nothing empty, the prose rules.
  const argDocs = loadArgumentDocs();
  for (const [key, params] of argDocs) {
    const where = `arguments/${params.__file}`;
    let f;
    try {
      f = entryFacts(key);
    } catch {
      note(where, `${key} is not in the library`);
      continue;
    }
    const known = new Set(f.overloads.flatMap((o) => o.parameters.map((p) => p.name)));
    for (const [name, text] of Object.entries(params)) {
      if (name === "__file") continue;
      if (!known.has(name)) note(where, `${key} has no argument ${name}`);
      if (!String(text).trim()) note(where, `${key} ${name} is empty`);
      const m = String(text).match(BANNED_RE);
      if (m) note(where, `${key} ${name} names "${m[1]}", which the docs must not`);
      if (DASHES.test(text)) note(where, `${key} ${name} has an em or en dash`);
      if (EMOJI.test(text)) note(where, `${key} ${name} has an emoji or icon`);
    }
  }
}

const written = results.filter((r) => !r.missing).length;
console.log(`[check:script] ${written}/${results.length} pages written, ${blocksChecked} code blocks compiled, ${entriesSeen} reference entries, ${errorsSeen} error entries, ${v1Entries} manual entries`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings.slice(0, 200)) console.log(`  - ${w}`);
  if (warnings.length > 200) console.log(`  ... ${warnings.length - 200} more`);
}
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("\nOK");
