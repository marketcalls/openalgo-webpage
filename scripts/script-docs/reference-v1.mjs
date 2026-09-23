// The OpenScript v1 reference manual: every implemented name on one page.
//
// The docs file each library entry on a topic page. The manual lists all of
// them in one place, grouped by kind the way a trader looks a name up, each in
// the same shape: description, syntax, arguments, returns, remarks, examples
// and see also. Nothing here is written twice. The facts come from the
// package (language.mjs), the prose from the same markdown the docs render,
// and the argument sentences from content/script/arguments/.
//
// Written by gen-script-docs.mjs:
//
//   public/script/reference-v1.json   every entry's HTML, fetched by the page
//                                     (kept out of the Worker bundle)
//   lib/scriptReferenceV1.json        the index the page renders on the server:
//                                     groups, names, anchors and the data URL
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { ROOT, PACKAGE_VERSION, LIBRARY_KEYS, NAMED_COLOURS, entryFacts, anchorFor } from "./language.mjs";
import {
  esc,
  slugify,
  argumentDoc,
  parameterNotes,
  renderContext,
  renderFragment,
  renderInline,
  signatureHtml,
} from "./render.mjs";

export const V1_ROUTE = "/script/reference/v1";
export const V1_DATA = "/script/reference-v1.json";

const CONTENT = path.join(ROOT, "content", "script");

// ---------------------------------------------------------------------------
// Kinds

const KINDS = [
  { id: "variables", title: "Variables", label: "Variable", prefix: "var" },
  { id: "constants", title: "Constants", label: "Constant", prefix: "const" },
  { id: "functions", title: "Functions", label: "Function", prefix: "fn" },
  { id: "keywords", title: "Keywords", label: "Keyword", prefix: "kw" },
  { id: "types", title: "Types", label: "Type", prefix: "type" },
  { id: "operators", title: "Operators", label: "Operator", prefix: "op" },
  { id: "declarations", title: "Declarations", label: "Declaration", prefix: "decl" },
];
const KIND = Object.fromEntries(KINDS.map((k) => [k.id, k]));

const COLOURS = new Set(NAMED_COLOURS);
const isConstant = (key) => COLOURS.has(key) || key.startsWith("math.");

const byName = (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

// ---------------------------------------------------------------------------
// Markdown pieces

/** Blank-line separated blocks, with fences and callouts kept whole. */
export function splitBlocks(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let cur = [];
  let fence = false;
  let callout = false;
  const push = () => {
    if (cur.some((l) => l.trim())) blocks.push(cur.join("\n"));
    cur = [];
  };
  for (const line of lines) {
    const t = line.trim();
    if (callout) {
      cur.push(line);
      if (t === ":::") {
        callout = false;
        push();
      }
      continue;
    }
    if (/^(```|~~~)/.test(t)) {
      if (!fence) push();
      cur.push(line);
      fence = !fence;
      if (!fence) push();
      continue;
    }
    if (fence) {
      cur.push(line);
      continue;
    }
    if (/^:::\w/.test(t)) {
      push();
      cur.push(line);
      callout = true;
      continue;
    }
    if (!t) {
      push();
      continue;
    }
    cur.push(line);
  }
  push();
  return blocks;
}

const isCode = (block) => /^(```|~~~)/.test(block.trim());

/**
 * An entry body in the manual's parts. The authoring order is description,
 * example, remarks, see also (content/script/AUTHORING.md); prose before the
 * first example belongs to the description, and prose between examples stays
 * with them, since it explains the one below it.
 */
export function partsOf(md) {
  const parts = { description: [], examples: [], remarks: [], see: [], form: "" };
  let mode = "description";
  for (const block of splitBlocks(md)) {
    const t = block.trim();
    const form = t.match(/^\*\*Form:\*\*\s*([\s\S]*)$/);
    if (form && !parts.form) {
      parts.form = form[1];
      continue;
    }
    if (/^\*\*Remarks\.\*\*/.test(t)) {
      mode = "remarks";
      const rest = t.replace(/^\*\*Remarks\.\*\*\s*/, "");
      if (rest) parts.remarks.push(rest);
      continue;
    }
    if (/^\*\*See also\.\*\*/.test(t)) {
      mode = "see";
      parts.see.push(t.replace(/^\*\*See also\.\*\*\s*/, ""));
      continue;
    }
    if (mode === "description" && isCode(t)) mode = "examples";
    if (mode === "see") parts.remarks.push(block);
    else parts[mode].push(block);
  }
  return parts;
}

/** A page's `## ` and `### ` sections, each with its heading text and body. */
function sectionsOf(src) {
  const body = src.replace(/^---[\s\S]*?---\s*/, "").replace(/\r\n/g, "\n");
  const out = [];
  let cur = null;
  let fence = false;
  for (const line of body.split("\n")) {
    if (/^(```|~~~)/.test(line.trim())) fence = !fence;
    const m = !fence && line.match(/^(#{2,3}) (.+)$/);
    if (m) {
      cur = { level: m[1].length, heading: m[2].trim(), lines: [], parent: m[1].length === 3 ? out.filter((s) => s.level === 2).at(-1)?.heading : undefined };
      out.push(cur);
      continue;
    }
    if (cur) cur.lines.push(line);
  }
  return out.map((s) => ({ ...s, body: s.lines.join("\n").trim() }));
}

/** A section's body together with every `###` section under it. */
function withChildren(sections, heading) {
  const i = sections.findIndex((s) => s.level === 2 && s.heading === heading);
  if (i === -1) throw new Error(`reference-v1: no section "## ${heading}"`);
  const out = [sections[i].body];
  for (let j = i + 1; j < sections.length && sections[j].level === 3; j++) out.push(`#### ${sections[j].heading}\n\n${sections[j].body}`);
  return out.join("\n\n");
}

const plainHeading = (h) => h.replace(/`/g, "").trim();

// The operators page heads each section with its marks and what they do. The
// manual names each by its marks and gives it a short, stable address. A
// heading this table does not know is reported by the check, so a section
// added to the page cannot be left out of the manual quietly.
const OPERATORS = {
  "`(` and `)`: grouping and calls": { name: "( )", anchor: "grouping", sub: "grouping and calls" },
  "`[` and `]`: history, elements and array literals": { name: "[ ]", anchor: "history", sub: "history, elements and array literals" },
  "`.`: member access": { name: ".", anchor: "member", sub: "member access" },
  "`,`: separator": { name: ",", anchor: "separator", sub: "separator" },
  "Unary `-` and `+`": { name: "unary - +", anchor: "unary", sub: "unary minus and plus" },
  "`not`": { name: "not", anchor: "not", sub: "logical not" },
  "`*` multiplication": { name: "*", anchor: "multiply", sub: "multiplication" },
  "`/` division": { name: "/", anchor: "divide", sub: "division" },
  "`%` remainder": { name: "%", anchor: "remainder", sub: "remainder" },
  "`+` addition and concatenation": { name: "+", anchor: "add", sub: "addition and joining text" },
  "`-` subtraction": { name: "-", anchor: "subtract", sub: "subtraction" },
  "`<`, `<=`, `>`, `>=`: ordering": { name: "< <= > >=", anchor: "compare", sub: "ordering" },
  "`==` and `!=`: equality": { name: "== !=", anchor: "equality", sub: "equality" },
  "`and`, `or`, `not`": { name: "and or not", anchor: "logic", sub: "logic" },
  "`?` and `:`": { name: "? :", anchor: "ternary", sub: "ternary conditional" },
  Assignment: { name: "= += -= *= /= %=", anchor: "assign", sub: "assignment" },
};
const NOT_OPERATORS = new Set(["How each associativity reads"]);

// ---------------------------------------------------------------------------
// Rendering

function kindBadge(kind, extra) {
  return `<span class="orv-kind">${esc(KIND[kind].label)}${extra ? `<span class="orv-kind-sub">${esc(extra)}</span>` : ""}</span>`;
}

function section(title, html, cls = "") {
  if (!html || !html.trim()) return "";
  return `<section class="orv-part${cls ? ` ${cls}` : ""}"><h3 class="orv-h">${esc(title)}</h3>${html}</section>`;
}

function signatureBlock(lines) {
  return `<div class="osd-signature orv-signature"><pre class="osd-pre"><code>${lines.join("\n")}</code></pre></div>`;
}

function argumentsHtml(key, facts, ctx) {
  const rows = [];
  const seen = new Set();
  for (const o of facts.overloads) {
    for (const p of o.parameters) {
      if (seen.has(p.name)) continue;
      seen.add(p.name);
      const doc = argumentDoc(key, p.name);
      if (!doc) ctx.problems.push(`${key}: argument ${p.name} has no description in content/script/arguments/`);
      const when = p.required
        ? `<span class="orv-arg-req">Required</span>`
        : p.default !== undefined
          ? `<span class="orv-arg-def">Default <code>${esc(p.default)}</code></span>`
          : `<span class="orv-arg-def">Optional</span>`;
      const notes = parameterNotes(p);
      rows.push(
        `<div class="orv-arg"><dt><code class="orv-arg-name">${esc(p.name)}</code><code class="orv-arg-type">${esc(p.type)}</code>${when}</dt><dd>${doc ? `<p>${renderInline(doc, ctx)}</p>` : ""}${notes.length ? `<p class="orv-arg-notes">${notes.join(". ")}.</p>` : ""}</dd></div>`,
      );
    }
  }
  return rows.length ? `<dl class="orv-args">${rows.join("")}</dl>` : "";
}

function entryShell({ anchor, name, kind, kindSub, badges = [], guide, body }) {
  const guideLink = guide ? `<a class="orv-guide" href="${esc(guide.href)}" title="${esc(`Read it in ${guide.title}`)}">In the guide</a>` : "";
  return `<article class="orv-entry" id="${esc(anchor)}" data-kind="${esc(kind)}">
<header class="orv-head"><h2 class="orv-title"><a href="#${esc(anchor)}"><code>${esc(name)}</code></a></h2><div class="orv-meta">${kindBadge(kind, kindSub)}${badges.join("")}${guideLink}</div></header>
${body}
</article>`;
}

// ---------------------------------------------------------------------------
// The build

/**
 * Build the manual.
 *
 * `results` is gen-script-docs.mjs's rendering of every page: the library
 * entries' prose is read from there, split exactly as the docs split it.
 */
export function buildReferenceV1({ results, keyPage, screens, pageTitles }) {
  const implemented = LIBRARY_KEYS.filter((k) => !entryFacts(k).planned);
  const planned = LIBRARY_KEYS.length - implemented.length;

  // Every entry's anchor first, so any [[link]] can point inside the page.
  const items = [];
  const v1Anchor = new Map();
  for (const key of implemented) {
    const f = entryFacts(key);
    const kind = f.callable ? "functions" : isConstant(key) ? "constants" : "variables";
    const anchor = `${KIND[kind].prefix}_${f.name}`;
    v1Anchor.set(key, anchor);
    items.push({ source: "library", key, kind, name: key, anchor, facts: f });
  }

  // Docs anchors that map into the manual: `reference/<page>#<id>` to the
  // manual's anchor, so a link written against a docs page stays on this one.
  const docsToV1 = new Map();
  for (const key of implemented) {
    const page = keyPage.get(key);
    if (page) docsToV1.set(`reference/${page}#${anchorFor(key)}`, v1Anchor.get(key));
  }

  const bodies = new Map();
  for (const r of results) if (!r.missing) for (const [key, body] of r.ctx.entryBodies) bodies.set(key, { ...body, page: r.id });

  // Prose pages: keywords, types, operators and declarations.
  const read = (slug) => fs.readFileSync(path.join(CONTENT, "reference", `${slug}.md`), "utf8");
  const prose = [];

  const kw = sectionsOf(read("keywords"));
  for (const s of kw.filter((x) => x.level === 3)) {
    const word = plainHeading(s.heading);
    const anchor = `kw_${word}`;
    // The section a word sits in says what kind of word it is ("control
    // flow", "reserved for a later version"), shown beside the kind.
    prose.push({ source: "prose", page: "keywords", docsId: slugify(s.heading), kind: "keywords", name: word, anchor, kindSub: s.parent, md: s.body });
  }

  const ty = sectionsOf(read("types"));
  const typeEntries = [
    { heading: "number", level: 3, name: "number" },
    { heading: "string", level: 3, name: "string" },
    { heading: "bool", level: 3, name: "bool" },
    { heading: "color", level: 3, name: "color" },
    { heading: "none", level: 3, name: "none" },
    { heading: "Qualifiers: when a value is known", level: 2, name: "series", with: true },
    { heading: "Arrays", level: 2, name: "array<T>", with: true },
    { heading: "Drawing objects", level: 2, name: "line, label, box, polyline, table", slug: "drawing-objects", with: true },
    { heading: "Declaration handles", level: 2, name: "plot, fill, level", slug: "declaration-handles", with: true },
  ];
  for (const t of typeEntries) {
    const s = ty.find((x) => x.level === t.level && x.heading === t.heading);
    if (!s) throw new Error(`reference-v1: types page has no "${t.heading}"`);
    const md = t.with ? withChildren(ty, t.heading) : s.body;
    prose.push({ source: "prose", page: "types", docsId: slugify(t.heading), kind: "types", name: t.name, anchor: `type_${t.slug ?? slugify(t.name)}`, md });
  }

  const early = [];
  const op = sectionsOf(read("operators"));
  for (const s of op) {
    const isOp = (s.level === 3 && !NOT_OPERATORS.has(s.heading)) || (s.level === 2 && s.heading === "Assignment");
    if (!isOp) continue;
    const known = OPERATORS[s.heading];
    if (!known) {
      early.push(`operators page section "${s.heading}" has no name in the manual's OPERATORS table`);
      continue;
    }
    prose.push({ source: "prose", page: "operators", docsId: slugify(s.heading), kind: "operators", name: known.name, anchor: `op_${known.anchor}`, kindSub: known.sub, md: s.body });
  }

  const de = sectionsOf(read("declarations"));
  for (const decl of ["study()", "strategy()"]) {
    const top = de.find((x) => x.level === 2 && x.heading === decl);
    const options = [];
    for (let j = de.indexOf(top) + 1; j < de.length && de[j].level === 3; j++) options.push(de[j]);
    prose.push({ source: "declaration", page: "declarations", docsId: slugify(decl), kind: "declarations", name: decl, anchor: `decl_${decl.replace("()", "")}`, md: top.body, options });
  }

  // Links: [[key]] to the manual, relative and docs anchors mapped where the
  // manual holds the thing they point at.
  for (const p of prose) docsToV1.set(`reference/${p.page}#${p.docsId}`, p.anchor);
  const ctx = renderContext({
    page: "reference/v1",
    keyPage,
    screens,
    version: PACKAGE_VERSION,
    linkFor: (key) => (v1Anchor.has(key) ? `#${v1Anchor.get(key)}` : null),
  });
  ctx.problems.push(...early);
  const localise = (md, page) => md.replace(/\]\(#([\w-]+)\)/g, (_, id) => `](/script/${page}#${id})`);
  const retarget = (html) =>
    html.replace(/href="\/script\/(reference\/[\w-]+)#([\w-]+)"/g, (whole, page, id) => {
      const to = docsToV1.get(`${page}#${id}`);
      return to ? `href="#${esc(to)}"` : whole;
    });
  const render = (md, page) => retarget(renderFragment(localise(md, page), ctx));
  const renderInl = (md, page) => retarget(renderInline(localise(md, page), ctx));

  const html = {};

  for (const it of items) {
    const f = it.facts;
    const body = bodies.get(it.key);
    if (!body) {
      ctx.problems.push(`${it.key} has no entry on any docs page`);
      continue;
    }
    const page = body.page;
    const parts = partsOf(`${body.description}\n\n${body.rest}`);
    const description = parts.description.join("\n\n");
    const badges = [];
    if (f.strategyOnly) badges.push(`<span class="orv-badge">Strategy only</span>`);
    if (f.topLevel) badges.push(`<span class="orv-badge">Top level only</span>`);
    if (f.stateful) badges.push(`<span class="orv-badge">Keeps state</span>`);
    if (f.colour) {
      const [r, g, b] = f.colour;
      badges.push(`<span class="orv-swatch" style="background:rgb(${r},${g},${b})" aria-hidden="true"></span><span class="orv-badge">rgb(${r}, ${g}, ${b})</span>`);
    }
    const returns = [...new Set(f.overloads.map((o) => o.returns))].join(" | ");
    const firstValue = f.warmup ? `<p class="orv-first">First value: ${renderInl(f.warmup, page)}.</p>` : "";
    const parts_ = [
      `<div class="orv-part orv-desc">${description ? render(description, page) : f.summary ? `<p>${renderInl(f.summary, page)}.</p>` : ""}</div>`,
      f.callable
        ? section("Syntax", signatureBlock(f.signatures.map(signatureHtml)))
        : section("Type", `<p><code class="orv-type">${esc(returns)}</code></p>${firstValue}`),
      f.callable ? section("Arguments", argumentsHtml(it.key, f, ctx)) : "",
      f.callable ? section("Returns", `<p><code class="orv-type">${esc(returns)}</code></p>${firstValue}`) : "",
      section("Remarks", render(parts.remarks.join("\n\n"), page)),
      section("Examples", render(parts.examples.join("\n\n"), page), "orv-examples"),
      section("See also", parts.see.length ? `<p class="orv-see">${renderInl(parts.see.join(" "), page)}</p>` : ""),
    ];
    const guideId = page.split("/")[1];
    html[it.anchor] = entryShell({
      anchor: it.anchor,
      name: it.name,
      kind: it.kind,
      badges,
      guide: { href: `/script/${page}#${anchorFor(it.key)}`, title: pageTitles.get(page) ?? guideId },
      body: parts_.join("\n"),
    });
    if (!parts.examples.some(isCode)) ctx.problems.push(`${it.key} has no example in the manual`);
  }

  for (const p of prose) {
    const docsPage = `reference/${p.page}`;
    const guide = { href: `/script/${docsPage}#${p.docsId}`, title: pageTitles.get(docsPage) ?? p.page };
    const badges = (p.badges ?? []).map((b) => `<span class="orv-badge">${esc(b)}</span>`);
    if (p.source === "declaration") {
      const parts = partsOf(p.md);
      const optionRows = p.options.map((o) => {
        const name = plainHeading(o.heading);
        const op = partsOf(o.body);
        return { name, description: op.description[0] ?? "", examples: op.examples, table: rowOf(p.md, name) };
      });
      const args = optionRows
        .map(
          (o) =>
            `<div class="orv-arg"><dt><code class="orv-arg-name">${esc(o.name)}</code>${o.table ? `<code class="orv-arg-type">${esc(o.table.type)}</code>${/^required$/i.test(o.table.def) ? `<span class="orv-arg-req">Required</span>` : `<span class="orv-arg-def">Default ${renderInl(o.table.def, docsPage)}</span>`}` : ""}</dt><dd><p>${renderInl(o.description, docsPage)}</p>${o.table?.values ? `<p class="orv-arg-notes">Accepts ${renderInl(o.table.values, docsPage)}.</p>` : ""}</dd></div>`,
        )
        .join("");
      const examples = optionRows
        .filter((o) => o.examples.length)
        .map((o) => `<p class="orv-example-label"><code>${esc(o.name)}</code></p>${render(o.examples.join("\n\n"), docsPage)}`)
        .join("\n");
      const description = parts.description.filter((b) => !/^\|/.test(b.trim()));
      html[p.anchor] = entryShell({
        anchor: p.anchor,
        name: p.name,
        kind: p.kind,
        badges,
        guide,
        body: [
          `<div class="orv-part orv-desc">${render(description.join("\n\n"), docsPage)}</div>`,
          parts.form ? section("Syntax", `<p class="orv-form">${renderInl(parts.form, docsPage)}</p>`) : "",
          section("Arguments", `<dl class="orv-args">${args}</dl>`),
          section("Remarks", render(parts.remarks.join("\n\n"), docsPage)),
          section("Examples", examples, "orv-examples"),
        ].join("\n"),
      });
      continue;
    }
    const parts = partsOf(p.md);
    html[p.anchor] = entryShell({
      anchor: p.anchor,
      name: p.name,
      kind: p.kind,
      kindSub: p.kindSub,
      badges,
      guide,
      body: [
        `<div class="orv-part orv-desc">${render(parts.description.join("\n\n"), docsPage)}</div>`,
        parts.form ? section("Syntax", `<p class="orv-form">${renderInl(parts.form, docsPage)}</p>`) : "",
        section("Remarks", render(parts.remarks.join("\n\n"), docsPage)),
        section("Examples", render(parts.examples.join("\n\n"), docsPage), "orv-examples"),
        section("See also", parts.see.length ? `<p class="orv-see">${renderInl(parts.see.join(" "), docsPage)}</p>` : ""),
      ].join("\n"),
    });
  }

  // The index, in the order the sidebar shows it.
  const all = [...items, ...prose];
  const groups = KINDS.map((k) => {
    let list = all.filter((x) => x.kind === k.id);
    // Library names read alphabetically; prose entries keep their page order,
    // which is the order the language introduces them in.
    if (["variables", "constants", "functions"].includes(k.id)) list = [...list].sort(byName);
    return { id: k.id, title: k.title, items: list.map((x) => ({ n: x.name, a: x.anchor, ...(x.kindSub ? { s: x.kindSub } : {}) })) };
  }).filter((g) => g.items.length);

  return { groups, html, problems: ctx.problems, blocks: ctx.blocks, planned, implemented: implemented.length, docsLinks: ctx.links };
}

/** One row of a declaration's option table: type, default and accepted values. */
function rowOf(md, option) {
  for (const line of md.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length >= 5 && cells[1] === `\`${option}\``) {
      return { type: cells[2].replace(/`/g, ""), def: cells[3], values: cells[4] };
    }
  }
  return null;
}

const plainText = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/**
 * What the manual's search reads for each entry, beyond its name: the
 * description, the kind and group it belongs to, and its argument names. Kept
 * short on purpose, so a search for "moving average" or "stop" finds the
 * entries about it and not every entry that mentions it in passing.
 */
function searchTextOf(html) {
  const desc = html.match(/<div class="orv-part orv-desc">([\s\S]*?)<\/div>\n/)?.[1] ?? "";
  const meta = html.match(/<div class="orv-meta">([\s\S]*?)<\/div><\/header>/)?.[1] ?? "";
  const args = [...html.matchAll(/<code class="orv-arg-name">([^<]+)<\/code>/g)].map((m) => m[1]);
  // Kept in its own case: the page lowercases it to match and shows it as
  // written in the excerpt under a result.
  return plainText(`${desc} ${meta.replace(/In the guide/, "")} ${args.join(" ")}`).slice(0, 600);
}

/** Write the two files, and return the counts and any problems. */
export function writeReferenceV1(args) {
  const built = buildReferenceV1(args);
  const search = Object.fromEntries(Object.entries(built.html).map(([anchor, html]) => [anchor, searchTextOf(html)]));
  const data = { version: PACKAGE_VERSION, groups: built.groups, html: built.html, search };
  const text = JSON.stringify(data);
  const hash = crypto.createHash("sha1").update(text).digest("hex").slice(0, 10);
  fs.writeFileSync(path.join(ROOT, "public", V1_DATA.replace(/^\//, "")), text);
  const counts = Object.fromEntries(built.groups.map((g) => [g.id, g.items.length]));
  const index = { version: PACKAGE_VERSION, data: `${V1_DATA}?v=${hash}`, planned: built.planned, counts, groups: built.groups };
  fs.writeFileSync(path.join(ROOT, "lib", "scriptReferenceV1.json"), JSON.stringify(index));
  return { ...built, counts, bytes: Buffer.byteLength(text) };
}
