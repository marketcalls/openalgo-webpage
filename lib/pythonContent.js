// Server-only loader for the Python learning portal.
// Reads chapter markdown + tested example files at build time, renders to HTML
// (with syntax highlighting and a table of contents), and inlines each example's
// source code plus its captured "live output" and any saved chart.
import fs from "node:fs";
import path from "node:path";

import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

const ROOT = process.cwd();
const MD_DIR = path.join(ROOT, "content", "python", "md");
const EX_DIR = path.join(ROOT, "content", "python", "examples");
const CHART_OUT = path.join(ROOT, "public", "python", "charts");

const TAG_CLASS = { NSE: "nse", NFO: "nfo", MCX: "mcx", INDEX: "idx", BSE: "nse", CDS: "idx" };

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);
marked.setOptions({ gfm: true, breaks: false });

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slugify(s) {
  return s.replace(/<[^>]+>/g, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function tagsHtml(tags) {
  return tags
    .filter(Boolean)
    .map((t) => `<span class="ex-tag tag-${TAG_CLASS[t] || "idx"}">${esc(t)}</span>`)
    .join("");
}

function renderExample(idx, spec) {
  const bits = spec.split("|").map((b) => b.trim());
  const relpath = bits[0];
  const title = bits[1] || path.basename(relpath, ".py");
  const tags = bits[2] ? bits[2].split(",").map((t) => t.trim()) : [];
  const pyPath = path.join(EX_DIR, relpath);

  if (!fs.existsSync(pyPath)) {
    return `<div class="callout warn"><span class="callout-tag">TODO</span><div><p>Example <code>${esc(relpath)}</code> not built yet.</p></div></div>`;
  }
  const code = fs.readFileSync(pyPath, "utf8").replace(/\s+$/, "");
  const highlighted = hljs.highlight(code, { language: "python" }).value;

  let html = `<figure class="ex" id="ex-${idx}">
<figcaption class="ex-head"><span class="ex-badge">EX ${idx}</span><span class="ex-title">${esc(title)}</span>${tagsHtml(tags)}<span class="ex-file">${esc(relpath)}</span></figcaption>
<div class="ex-code"><button class="ex-copy" type="button" aria-label="Copy code">Copy</button><pre><code class="hljs language-python">${highlighted}</code></pre></div>`;

  const outPath = pyPath.replace(/\.py$/, ".out");
  if (fs.existsSync(outPath)) {
    const out = fs.readFileSync(outPath, "utf8").replace(/\s+$/, "");
    if (out.trim()) {
      html += `<div class="ex-out"><div class="ex-out-label">Live output</div><pre>${esc(out)}</pre></div>`;
    }
  }

  const pngPath = pyPath.replace(/\.py$/, ".png");
  if (fs.existsSync(pngPath)) {
    fs.mkdirSync(CHART_OUT, { recursive: true });
    const name = `${relpath.replace(/[\\/]/g, "_").replace(/\.py$/, "")}.png`;
    fs.copyFileSync(pngPath, path.join(CHART_OUT, name));
    html += `<div class="ex-chart"><img src="/python/charts/${name}" alt="${esc(title)} chart" loading="lazy"/></div>`;
  }

  html += "</figure>";
  return html;
}

function renderCallout(type, innerMd) {
  const labels = { tip: "Tip", warn: "Heads up", info: "Note", key: "Key idea" };
  const cls = labels[type] ? type : "info";
  const body = marked.parse(innerMd.trim());
  return `<div class="callout ${cls}"><span class="callout-tag">${labels[cls] || "Note"}</span><div>${body}</div></div>`;
}

// Convert chapter markdown (with {{example}} tokens and ::: callouts) into HTML segments.
function renderBody(text) {
  const lines = text.split("\n");
  const segs = [];
  let buf = [];
  let exCount = 0;
  const flush = () => {
    if (buf.length) {
      segs.push(marked.parse(buf.join("\n")));
      buf = [];
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const stripped = lines[i].trim();
    if (stripped.startsWith(":::") && stripped.length > 3) {
      flush();
      const type = stripped.slice(3).trim();
      const inner = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        inner.push(lines[i]);
        i++;
      }
      segs.push(renderCallout(type, inner.join("\n")));
      continue;
    }
    const m = stripped.match(/^\{\{example:\s*(.+?)\}\}$/);
    if (m) {
      flush();
      exCount++;
      segs.push(renderExample(exCount, m[1]));
      continue;
    }
    buf.push(lines[i]);
  }
  flush();
  return { html: segs.join("\n"), exCount };
}

function addIdsAndToc(html) {
  const toc = [];
  const withIds = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_full, lvl, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = slugify(text);
    toc.push({ level: Number(lvl), text, id });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: withIds, toc };
}

export function chapterHasContent(n) {
  return fs.existsSync(path.join(MD_DIR, `ch${String(n).padStart(2, "0")}.md`));
}

export function loadChapter(n) {
  const file = path.join(MD_DIR, `ch${String(n).padStart(2, "0")}.md`);
  if (!fs.existsSync(file)) return { html: "", toc: [], exCount: 0, hasContent: false };
  const raw = fs.readFileSync(file, "utf8");
  const { html, exCount } = renderBody(raw);
  const withToc = addIdsAndToc(html);
  return { html: withToc.html, toc: withToc.toc, exCount, hasContent: true };
}
