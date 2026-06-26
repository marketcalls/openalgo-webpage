// Build-time generator for the "Futures Trading" course content.
// Renders every chapter's markdown into a single JSON module
// (lib/futuresContentData.json) so the Next pages need NO filesystem access at
// runtime - critical on Cloudflare Workers where process.cwd() is not the bundle.
//
// Content is prose + tables + images. Images are referenced with an
// {{image: file | caption | kind}} directive (kinds: diagram, flow, chart, data,
// photo, table). When the image file is not yet present under
// public/futures/images/, a labelled placeholder is rendered that tells the author
// exactly where to drop the file.
//
// Runs automatically via the "prebuild" npm script and before deploy.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

import { CHAPTERS } from "../lib/futuresCurriculum.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MD_DIR = path.join(ROOT, "content", "futures", "md");
const IMG_DIR = path.join(ROOT, "public", "futures", "images");
const DATA_OUT = path.join(ROOT, "lib", "futuresContentData.json");

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

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
const slugify = (s) =>
  s.replace(/<[^>]+>/g, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---- {{image: file | caption | kind}} ----------------------------------------
const KIND_LABEL = {
  diagram: "Diagram", flow: "Flow chart", chart: "Chart", data: "Data viz",
  photo: "Image", table: "Table", infographic: "Infographic",
};

function renderImage(spec) {
  const bits = spec.split("|").map((b) => b.trim());
  const file = bits[0];
  const caption = bits[1] || "";
  const kind = (bits[2] || "diagram").toLowerCase();
  const label = KIND_LABEL[kind] || "Image";
  const src = `/futures/images/${file}`;
  const exists = file && fs.existsSync(path.join(IMG_DIR, file));
  const cap = caption
    ? `<figcaption class="shot-cap"><span class="shot-kind">${esc(label)}</span>${esc(caption)}</figcaption>`
    : "";
  if (exists) {
    return `<figure class="lesson-shot">
<img src="${src}" alt="${esc(caption || label)}" loading="lazy"/>
${cap}</figure>`;
  }
  return `<figure class="lesson-shot placeholder">
<div class="shot-ph">
<span class="shot-kind">${esc(label)}</span>
<span class="shot-ph-cap">${esc(caption || "Image goes here")}</span>
<code class="shot-ph-path">public/futures/images/${esc(file)}</code>
</div>
${cap}</figure>`;
}

function renderCallout(type, innerMd) {
  const labels = { tip: "Tip", warn: "Heads up", info: "Note", key: "Key idea", fact: "Did you know", example: "Real example" };
  const cls = labels[type] ? type : "info";
  const body = marked.parse(innerMd.trim());
  return `<div class="callout ${cls}"><span class="callout-tag">${labels[cls] || "Note"}</span><div>${body}</div></div>`;
}

function renderBody(text) {
  const lines = text.split("\n");
  const segs = [];
  let buf = [];
  let imgCount = 0;
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
    const m = stripped.match(/^\{\{image:\s*(.+?)\}\}$/);
    if (m) {
      flush();
      imgCount++;
      segs.push(renderImage(m[1]));
      continue;
    }
    buf.push(lines[i]);
  }
  flush();
  return { html: segs.join("\n"), imgCount };
}

function addCopyButtons(html) {
  return html.replace(
    /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
    (_full, attrs, code) =>
      `<div class="code-wrap"><button class="ex-copy" type="button" aria-label="Copy code">Copy</button><pre><code${attrs}>${code}</code></pre></div>`,
  );
}

function addIdsAndToc(html) {
  const toc = [];
  const withIds = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_full, lvl, inner) => {
    const txt = decodeEntities(inner.replace(/<[^>]+>/g, "").trim());
    const id = slugify(txt);
    toc.push({ level: Number(lvl), text: txt, id });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: withIds, toc };
}

const MAX = CHAPTERS.reduce((m, c) => Math.max(m, c.n), 0);
const data = {};
let built = 0;
for (let n = 1; n <= MAX; n++) {
  const file = path.join(MD_DIR, `ch${String(n).padStart(2, "0")}.md`);
  if (!fs.existsSync(file)) {
    data[n] = { html: "", toc: [], imgCount: 0, hasContent: false };
    continue;
  }
  const raw = fs.readFileSync(file, "utf8");
  const { html, imgCount } = renderBody(raw);
  const withButtons = addCopyButtons(html);
  const withToc = addIdsAndToc(withButtons);
  data[n] = { html: withToc.html, toc: withToc.toc, imgCount, hasContent: true };
  built++;
}

fs.mkdirSync(path.dirname(DATA_OUT), { recursive: true });
fs.writeFileSync(DATA_OUT, JSON.stringify(data));
const kb = Math.round(fs.statSync(DATA_OUT).size / 1024);
console.log(`Generated lib/futuresContentData.json (${kb} KB, ${built}/${MAX} chapters with content)`);
