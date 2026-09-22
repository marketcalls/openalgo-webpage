// Markdown to HTML for the /script documentation.
//
// Plain markdown plus five directives, each on a line of its own:
//
//   {{entry: ema()}}      a reference entry; the compiler supplies its signature,
//                         parameters, defaults, accepted values, return type and
//                         warmup, and the prose written below it is its body
//   {{error: OS2001}}     one error from the catalogue; prose below it replaces
//                         the catalogue's cause with a learner's explanation
//   {{errors: OS1}}       every catalogue error in a range, in code order
//   {{screen: id}}        a screenshot from content/script/screens.json
//   :::tip ... :::        a callout (tip, note, warn, key)
//
// and one inline form, [[ema()]], which links to a reference entry wherever it
// lives. Code fenced as ```openscript is painted by the language's own
// highlighter, the one the /trading editor uses.
import fs from "node:fs";
import path from "node:path";

import hljs from "highlight.js";
import { Marked } from "marked";

import { ROOT, editor, entryFacts, ERROR_BY_CODE, ERRORS, anchorFor, isLibraryKey } from "./language.mjs";

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const slugify = (s) =>
  String(s).replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/g, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const SCREENS_PATH = path.join(ROOT, "content", "script", "screens.json");
export const loadScreens = () => (fs.existsSync(SCREENS_PATH) ? JSON.parse(fs.readFileSync(SCREENS_PATH, "utf8")).screens : {});

// ---------------------------------------------------------------------------
// Code

const KIND_CLASS = { keyword: "t-k", number: "t-n", string: "t-s", color: "t-x", comment: "t-c", operator: "t-p", punctuation: "t-p" };

/** OpenScript source as coloured spans, by the real lexer. */
export function highlightOpenScript(code) {
  let pieces;
  try {
    pieces = editor.highlight(code);
  } catch {
    return esc(code);
  }
  let out = "";
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    let cls = KIND_CLASS[p.kind];
    if (p.kind === "builtin") {
      let j = i + 1;
      while (j < pieces.length && pieces[j].kind === "whitespace") j++;
      cls = pieces[j]?.text === "(" ? "t-f" : "t-b";
    }
    out += cls ? `<span class="${cls}">${esc(p.text)}</span>` : esc(p.text);
  }
  return out;
}

const HLJS_LANG = { js: "javascript", javascript: "javascript", ts: "typescript", typescript: "typescript", py: "python", python: "python", bash: "bash", sh: "bash", shell: "bash", json: "json", text: "plaintext", txt: "plaintext" };

function parseInfo(info) {
  const [lang = "", ...rest] = (info || "").trim().split(/\s+/);
  const attrs = {};
  const joined = rest.join(" ");
  for (const m of joined.matchAll(/(\w+)(?:=("([^"]*)"|\S+))?/g)) attrs[m[1]] = m[3] ?? m[2] ?? true;
  return { lang: lang.toLowerCase(), attrs };
}

export function codeBlockHtml(code, info, ctx) {
  const { lang, attrs } = parseInfo(info);
  const body = code.replace(/\s+$/, "");
  if (lang === "openscript" || lang === "oscript") {
    ctx?.blocks.push({ code: body, attrs, page: ctx.page });
    const data = [`data-lang="openscript"`];
    if (attrs.title) data.push(`data-title="${esc(attrs.title)}"`);
    if (attrs.expect) data.push(`data-expect="${esc(attrs.expect)}"`);
    return `<div class="osd-code" ${data.join(" ")}><pre class="osd-pre"><code>${highlightOpenScript(body)}</code></pre></div>`;
  }
  const hl = HLJS_LANG[lang] ?? "plaintext";
  const html = hl === "plaintext" ? esc(body) : hljs.highlight(body, { language: hl }).value;
  const title = attrs.title ? ` data-title="${esc(attrs.title)}"` : "";
  return `<div class="osd-code" data-lang="${esc(hl)}"${title}><pre class="osd-pre"><code class="hljs">${html}</code></pre></div>`;
}

// ---------------------------------------------------------------------------
// Markdown

function makeMarked(ctx) {
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      code({ text, lang }) {
        return codeBlockHtml(text, lang, ctx);
      },
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const plain = decode(inner.replace(/<[^>]+>/g, ""));
        let id = slugify(plain);
        let n = 2;
        while (ctx.ids.has(id)) id = `${slugify(plain)}-${n++}`;
        ctx.ids.add(id);
        if (depth === 2 || depth === 3) ctx.toc.push({ id, text: plain, level: depth });
        return `<h${depth} id="${id}"><a class="osd-anchor" href="#${id}">${inner}</a></h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        if (href.startsWith("/script")) ctx.links.push(href);
        const external = /^https?:\/\//.test(href);
        const t = title ? ` title="${esc(title)}"` : "";
        return external
          ? `<a href="${esc(href)}"${t} target="_blank" rel="noopener noreferrer">${inner}</a>`
          : `<a href="${esc(href)}"${t}>${inner}</a>`;
      },
      table(token) {
        const head = token.header.map((c) => `<th${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows
          .map((r) => `<tr>${r.map((c) => `<td${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`)
          .join("");
        return `<div class="osd-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  return marked;
}

/** [[ema()]] to a link to the entry, wherever the reference files it. */
function expandEntryLinks(md, ctx) {
  return md.replace(/\[\[([A-Za-z][\w.]*(?:\(\))?)\]\]/g, (whole, key) => {
    if (!isLibraryKey(key)) {
      ctx.problems.push(`unknown entry link [[${key}]]`);
      return `\`${key}\``;
    }
    const page = ctx.keyPage.get(key);
    if (!page) {
      ctx.problems.push(`entry link [[${key}]] has no reference page`);
      return `\`${key}\``;
    }
    return `[\`${key}\`](/script/reference/${page}#${anchorFor(key)})`;
  });
}

// ---------------------------------------------------------------------------
// Directives

const CALLOUT = { tip: "Tip", note: "Note", warn: "Heads up", key: "Key idea" };

function inline(md, ctx) {
  return makeMarked(ctx).parseInline(expandEntryLinks(md, ctx));
}

function signatureHtml(sig) {
  // name(param?: type = default, ...) -> type, or name: type
  const esc2 = (s) => esc(s);
  const m = sig.match(/^([\w.]+)\((.*)\)\s*->\s*(.+)$/);
  if (!m) {
    const v = sig.match(/^([\w.]+):\s*(.+)$/);
    if (!v) return esc2(sig);
    return `<span class="t-b">${esc2(v[1])}</span><span class="t-p">: </span><span class="t-k">${esc2(v[2])}</span>`;
  }
  const [, name, params, ret] = m;
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of params) {
    if (ch === "<" || ch === "(" || ch === "[") depth++;
    if (ch === ">" || ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  const rendered = parts.map((p) => {
    const pm = p.match(/^(\w+)(\??):\s*([^=]+?)(?:\s*=\s*(.+))?$/);
    if (!pm) return esc2(p);
    const [, pn, opt, type, def] = pm;
    return `${esc2(pn)}${opt ? `<span class="t-p">?</span>` : ""}<span class="t-p">: </span><span class="t-k">${esc2(type)}</span>${def !== undefined ? `<span class="t-p"> = </span><span class="t-n">${esc2(def)}</span>` : ""}`;
  });
  const oneLine = `${name}(${parts.join(", ")}) -> ${ret}`;
  const joiner = oneLine.length > 88 ? `<span class="t-p">,</span>\n    ` : `<span class="t-p">, </span>`;
  const open = oneLine.length > 88 ? "(\n    " : "(";
  const close = oneLine.length > 88 ? "\n)" : ")";
  return `<span class="t-f">${esc2(name)}</span><span class="t-p">${open}</span>${rendered.join(joiner)}<span class="t-p">${close} -&gt; </span><span class="t-k">${esc2(ret)}</span>`;
}

function paramsTable(facts, ctx) {
  const rows = [];
  const seen = new Set();
  for (const o of facts.overloads) {
    for (const p of o.parameters) {
      const id = `${p.name}:${p.type}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const def = p.required ? `<span class="osd-req">required</span>` : p.default !== undefined ? `<code>${esc(p.default)}</code>` : `<span class="osd-muted">optional</span>`;
      const notes = [];
      if (p.values.length) notes.push(`One of ${p.values.map((v) => `<code>"${esc(v)}"</code>`).join(", ")}`);
      if (p.whole) notes.push("A whole number");
      if (p.constant) notes.push("Fixed before the first bar");
      rows.push(`<tr><td><code>${esc(p.name)}</code></td><td><code>${esc(p.type)}</code></td><td>${def}</td><td>${notes.join(". ") || ""}</td></tr>`);
    }
  }
  if (!rows.length) return "";
  return `<div class="osd-table osd-params"><table><thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Notes</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

function renderEntry(key, bodyMd, ctx) {
  if (!isLibraryKey(key)) {
    ctx.problems.push(`{{entry: ${key}}} is not a library key`);
    return "";
  }
  if (ctx.entries.includes(key)) ctx.problems.push(`{{entry: ${key}}} appears twice`);
  ctx.entries.push(key);
  const f = entryFacts(key);
  ctx.ids.add(f.anchor);
  ctx.toc.push({ id: f.anchor, text: key, level: 3 });
  ctx.search.push({ k: "entry", t: key, a: f.anchor, d: f.summary ? decode(f.summary.replace(/`/g, "")) : "" });

  const badges = [];
  if (f.planned) badges.push(`<span class="osd-badge osd-badge-planned">Planned</span>`);
  if (f.strategyOnly) badges.push(`<span class="osd-badge">Strategy only</span>`);
  if (f.topLevel) badges.push(`<span class="osd-badge">Top level only</span>`);
  if (f.stateful) badges.push(`<span class="osd-badge">Keeps state</span>`);
  if (f.colour) {
    const [r, g, b] = f.colour;
    badges.push(`<span class="osd-swatch" style="background:rgb(${r},${g},${b})" aria-hidden="true"></span><span class="osd-badge">rgb(${r}, ${g}, ${b})</span>`);
  }

  // The first paragraph of the prose is the description and goes above the
  // signature; everything after it goes below the facts.
  const body = bodyMd.trim();
  const split = body.search(/\n\s*\n/);
  const firstPara = split === -1 ? body : body.slice(0, split);
  const startsWithProse = firstPara && !/^(```|\||:::|\{\{|#|- |\* |\d+\. )/.test(firstPara.trim());
  const description = startsWithProse ? firstPara : "";
  const rest = startsWithProse ? (split === -1 ? "" : body.slice(split)) : body;
  if (!description && !f.summary) ctx.problems.push(`${key} has no description`);
  ctx.entryBodies.set(key, { description, rest, planned: f.planned });

  const descHtml = description ? makeMarked(ctx).parse(expandEntryLinks(description, ctx)) : f.summary ? `<p>${inline(f.summary, ctx)}.</p>` : "";
  const sigHtml = f.signatures.map((s) => signatureHtml(s)).join("\n");
  const facts = [];
  if (f.callable) facts.push(`<div><dt>Returns</dt><dd><code>${esc(f.overloads.map((o) => o.returns).filter((v, i, a) => a.indexOf(v) === i).join(" | "))}</code></dd></div>`);
  else facts.push(`<div><dt>Type</dt><dd><code>${esc(f.overloads[0].returns)}</code></dd></div>`);
  if (f.warmup) facts.push(`<div><dt>First value</dt><dd>${inline(f.warmup, ctx)}</dd></div>`);
  const plannedNote = f.planned
    ? `<p class="osd-planned-note">Named in the language and not available in version ${esc(ctx.version)}. Calling it is error <a href="/script/errors/names-and-types#os2020"><code>OS2020</code></a>.</p>`
    : "";

  return `<section class="osd-entry${f.planned ? " is-planned" : ""}" id="${f.anchor}">
<header class="osd-entry-head"><h3><a class="osd-anchor" href="#${f.anchor}"><code>${esc(key)}</code></a></h3><div class="osd-badges">${badges.join("")}</div></header>
${descHtml}${plannedNote}
<div class="osd-signature"><pre class="osd-pre"><code>${sigHtml}</code></pre></div>
${paramsTable(f, ctx)}
<dl class="osd-facts">${facts.join("")}</dl>
${rest ? renderSegmentMarkdown(rest, ctx) : ""}
</section>`;
}

const SPEC_REF = /\s*\((?:see\s+)?(?:[a-z-]+\.md|section)[^()]*\)|\s*,?\s*(?:as\s+)?(?:[a-z-]+\.md\s+(?:section\s+)?[\d.]+(?:\s*(?:and|,)\s*[\d.]+)*)/gi;
export const cleanCatalogueText = (s) => (s || "").replace(SPEC_REF, "").replace(/\s+([.,;:])/g, "$1");

function renderError(code, bodyMd, ctx) {
  const e = ERROR_BY_CODE.get(code);
  if (!e) {
    ctx.problems.push(`{{error: ${code}}} is not in the catalogue`);
    return "";
  }
  if (ctx.errors.includes(code)) ctx.problems.push(`${code} appears twice`);
  ctx.errors.push(code);
  const id = code.toLowerCase();
  ctx.ids.add(id);
  ctx.toc.push({ id, text: `${code} ${e.title}`, level: 3 });
  ctx.search.push({ k: "error", t: `${code} ${e.title}`, a: id, d: cleanCatalogueText(e.message) });
  const msg = esc(e.message).replace(/\{(\w+)\}/g, (_, n) => `<var title="${esc(e.placeholders?.[n] ?? n)}">${n}</var>`);
  const withVars = (s) => inline(cleanCatalogueText(s), ctx).replace(/\{(\w+)\}/g, (_, n) => `<var>${n}</var>`);
  const cause = bodyMd.trim() ? renderSegmentMarkdown(bodyMd, ctx) : `<p>${withVars(e.cause)}</p>`;
  if (!bodyMd.trim() && /\.md\b|section \d/i.test(e.cause)) ctx.problems.push(`${code}: catalogue cause cites the specification; write a learner explanation below the directive`);
  const ex = e.example && typeof e.example === "object" && e.example.before
    ? `<div class="osd-before-after"><div><p class="osd-ba-label">Before</p>${codeBlockHtml(e.example.before, `openscript expect=${code}`, null)}</div><div><p class="osd-ba-label">After</p>${codeBlockHtml(e.example.after ?? "", "openscript", null)}</div></div>`
    : "";
  return `<section class="osd-error" id="${id}">
<header class="osd-entry-head"><h3><a class="osd-anchor" href="#${id}"><code>${code}</code> ${esc(e.title)}</a></h3><div class="osd-badges"><span class="osd-badge osd-sev-${esc(e.severity)}">${e.severity === "warning" ? "Warning" : "Error"}</span><span class="osd-badge">${esc(e.stage)}</span></div></header>
<p class="osd-error-message">${msg}</p>
<h4>What it means</h4>${cause}
<h4>How to fix it</h4><p>${withVars(e.fix)}</p>
${ex}
</section>`;
}

function renderScreen(id, ctx) {
  const screens = ctx.screens;
  const s = screens[id];
  ctx.screensUsed.push(id);
  if (!s) {
    ctx.problems.push(`{{screen: ${id}}} is not in screens.json`);
    return "";
  }
  const file = path.join(ROOT, "public", "script", "screens", s.file);
  let dims = "";
  if (fs.existsSync(file)) {
    const d = imageSize(file);
    if (d) dims = ` width="${d.width}" height="${d.height}"`;
  } else ctx.missingScreens.push(id);
  return `<figure class="osd-shot"><img src="/script/screens/${esc(s.file)}" alt="${esc(s.alt)}"${dims} loading="lazy" decoding="async"/><figcaption>${inline(s.caption ?? s.alt, ctx)}</figcaption></figure>`;
}

/** Width and height of a PNG, JPEG or WebP, read from its header. */
export function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return null;
}

function renderSegmentMarkdown(md, ctx) {
  return renderBlocks(md, ctx, false);
}

/**
 * The body of a page. Directives split it into segments; an entry or an error
 * owns the lines below it up to the next directive or heading.
 */
function renderBlocks(text, ctx, top = true) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let buf = [];
  const flush = () => {
    if (buf.length) {
      out.push(makeMarked(ctx).parse(expandEntryLinks(buf.join("\n"), ctx)));
      buf = [];
    }
  };
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (/^(```|~~~)/.test(t)) inFence = !inFence;
    if (inFence) {
      buf.push(line);
      continue;
    }
    let m;
    if (top && (m = t.match(/^\{\{(entry|error):\s*([^}]+?)\s*\}\}$/))) {
      flush();
      const body = [];
      let fence = false;
      i++;
      for (; i < lines.length; i++) {
        const u = lines[i].trim();
        if (/^(```|~~~)/.test(u)) fence = !fence;
        if (!fence && (/^\{\{(entry|error|errors):/.test(u) || /^#{1,2} /.test(u))) break;
        body.push(lines[i]);
      }
      i--;
      out.push(m[1] === "entry" ? renderEntry(m[2], body.join("\n"), ctx) : renderError(m[2], body.join("\n"), ctx));
      continue;
    }
    if (top && (m = t.match(/^\{\{errors:\s*(OS\d)\s*\}\}$/))) {
      flush();
      for (const e of ERRORS.filter((x) => x.code.startsWith(m[1]))) {
        if (!ctx.errors.includes(e.code)) out.push(renderError(e.code, "", ctx));
      }
      continue;
    }
    if ((m = t.match(/^\{\{screen:\s*([\w-]+)\s*\}\}$/))) {
      flush();
      out.push(renderScreen(m[1], ctx));
      continue;
    }
    if ((m = t.match(/^:::(\w+)\s*(.*)$/)) && t !== ":::") {
      flush();
      const kind = CALLOUT[m[1]] ? m[1] : "note";
      const inner = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") inner.push(lines[i++]);
      const label = m[2] || CALLOUT[kind];
      out.push(`<aside class="osd-callout osd-callout-${kind}"><p class="osd-callout-label">${esc(label)}</p>${renderBlocks(inner.join("\n"), ctx, false)}</aside>`);
      continue;
    }
    if (/^\{\{/.test(t)) ctx.problems.push(`unknown directive ${t}`);
    buf.push(line);
  }
  flush();
  return out.join("\n");
}

/** Split front matter from the body. */
export function frontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { meta, body: src.slice(m[0].length) };
}

export function renderPage(src, { page, keyPage, screens, version }) {
  const ctx = {
    page, keyPage, screens, version,
    toc: [], ids: new Set(), links: [], blocks: [], entries: [], errors: [], problems: [],
    screensUsed: [], missingScreens: [], search: [], entryBodies: new Map(),
  };
  const { meta, body } = frontMatter(src);
  const html = renderBlocks(body, ctx, true);
  return { meta, html, ctx };
}
