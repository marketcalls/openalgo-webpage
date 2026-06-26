// Build-time generator for the AmiBroker AFL course content.
// Renders every chapter's markdown into a single JSON module
// (lib/amibrokerContentData.json) so the Next pages need NO filesystem access at
// runtime - critical on Cloudflare Workers where process.cwd() is not the bundle.
//
// Unlike the Python course there is no runnable-example pipeline: AFL is not
// executed here. Instead, code lives in fenced ```afl blocks (syntax-highlighted
// with a small custom highlight.js language) and screenshots are referenced with
// an {{image: file | caption | kind}} directive. When the image file is not yet
// present under public/amibroker/images/, a labelled placeholder is rendered that
// tells the author exactly where to drop the file.
//
// Runs automatically via the "prebuild" npm script and before deploy.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import hljs from "highlight.js";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

import { CHAPTERS } from "../lib/amibrokerCurriculum.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MD_DIR = path.join(ROOT, "content", "amibroker", "md");
const IMG_DIR = path.join(ROOT, "public", "amibroker", "images");
const DATA_OUT = path.join(ROOT, "lib", "amibrokerContentData.json");

// ---- A small AFL language definition for highlight.js -------------------------
// AFL is a C-like array language. This is deliberately lightweight: it colours
// keywords, the reserved trade arrays, the common built-ins, strings, numbers,
// comments and the colorXXX / styleXXX / shapeXXX constants.
const AFL_KEYWORDS = [
  "if", "else", "for", "while", "do", "function", "procedure", "return",
  "global", "local", "and", "or", "not", "True", "False", "Null",
];
const AFL_BUILT_INS = [
  // reserved trade & plotting arrays
  "Buy", "Sell", "Short", "Cover", "BuyPrice", "SellPrice", "ShortPrice", "CoverPrice",
  "Open", "High", "Low", "Close", "Volume", "OpenInt", "Avg", "O", "H", "L", "C", "V",
  "Filter", "Title", "Name", "BarCount", "BarIndex", "SelectedValue",
  // very common functions
  "Plot", "PlotShapes", "PlotText", "PlotForeign", "PlotOHLC", "AddColumn", "AddTextColumn",
  "MA", "EMA", "WMA", "DEMA", "TEMA", "HMA", "Sum", "Ref", "Cross", "BarsSince", "ValueWhen",
  "ExRem", "Flip", "IIf", "Highest", "Lowest", "HHV", "LLV", "RSI", "MACD", "Signal", "ATR",
  "StDev", "BBandTop", "BBandBot", "StochK", "StochD", "CCI", "ROC", "ADX", "SAR", "Optimize",
  "Param", "ParamColor", "ParamStyle", "ParamList", "ParamToggle", "ParamTrigger", "ParamStr",
  "SetChartOptions", "SetTradeDelays", "SetPositionSize", "SetOption", "SetBarsRequired",
  "ApplyStop", "GetPriceStyle", "StrFormat", "NumToStr", "WriteIf", "WriteVal", "GfxText",
  "GfxTextOut", "GfxRectangle", "GfxGradientRect", "GfxSelectFont", "GfxSetBkMode", "GfxDrawText",
  "GfxSelectSolidBrush", "GfxSetTextColor", "GfxRoundRect", "GfxSelectPen", "GfxSetOverlayMode",
  "TimeFrameSet", "TimeFrameRestore", "TimeFrameGetPrice", "TimeFrameExpand", "TimeFrameCompress",
  "Foreign", "SetForeign", "RestorePriceArrays", "Interval", "TimeNum", "DateNum", "Day", "Month",
  "Year", "DayOfWeek", "Hour", "Minute", "Status", "AlertIf", "InternetOpenURL", "InternetClose",
  "Say", "StaticVarSet", "StaticVarGet", "Version", "Nz", "LastValue", "BeginValue", "EndValue",
];

function aflLanguage() {
  return {
    case_insensitive: true,
    keywords: { keyword: AFL_KEYWORDS.join(" "), built_in: AFL_BUILT_INS.join(" ") },
    contains: [
      hljs.COMMENT("//", "$"),
      hljs.COMMENT("/\\*", "\\*/"),
      { className: "string", begin: '"', end: '"' },
      { className: "string", begin: "'", end: "'" },
      // colorXXX / styleXXX / shapeXXX / spsXXX / stopTypeXXX style constants
      { className: "literal", begin: "\\b(color|style|shape|sps|stopType|in|chart|param)[A-Za-z0-9]+\\b" },
      { className: "number", begin: "\\b\\d+(\\.\\d+)?\\b" },
    ],
  };
}
hljs.registerLanguage("afl", aflLanguage);

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
const KIND_LABEL = { afl: "AFL", chart: "Chart", backtest: "Backtest", explore: "Exploration", opt: "Optimisation", diagram: "Diagram" };

function renderImage(spec) {
  const bits = spec.split("|").map((b) => b.trim());
  const file = bits[0];
  const caption = bits[1] || "";
  const kind = (bits[2] || "chart").toLowerCase();
  const label = KIND_LABEL[kind] || "Image";
  const src = `/amibroker/images/${file}`;
  const exists = file && fs.existsSync(path.join(IMG_DIR, file));
  const cap = caption
    ? `<figcaption class="shot-cap"><span class="shot-kind">${esc(label)}</span>${esc(caption)}</figcaption>`
    : "";
  if (exists) {
    return `<figure class="lesson-shot">
<img src="${src}" alt="${esc(caption || label)}" loading="lazy"/>
${cap}</figure>`;
  }
  // Placeholder: tells the author exactly which file to drop and where.
  return `<figure class="lesson-shot placeholder">
<div class="shot-ph">
<span class="shot-kind">${esc(label)} screenshot</span>
<span class="shot-ph-cap">${esc(caption || "Image goes here")}</span>
<code class="shot-ph-path">public/amibroker/images/${esc(file)}</code>
</div>
${cap}</figure>`;
}

function renderCallout(type, innerMd) {
  const labels = { tip: "Tip", warn: "Heads up", info: "Note", key: "Key idea", fact: "Good to know" };
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

// Any markdown table whose first header cell is "Bar" is treated as an AFL
// "array grid" (the bar-by-bar interpretation view, like AmiBroker's own data
// window). We tag it with a class so the CSS can render it as a proper grid:
// a sticky row-label column, bars as columns, highlighted (**bold**) cells.
function markArrayTables(html) {
  return html.replace(
    /<table>(\s*<thead>\s*<tr>\s*<th[^>]*>\s*Bar\b)/g,
    '<table class="array-table">$1',
  );
}

// Wrap prose code fences in a container with a Copy button (LessonClient wires
// any .ex-copy to copy the sibling <code>). marked emits <pre><code ...>...</code></pre>.
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
  const withTables = markArrayTables(html);
  const withButtons = addCopyButtons(withTables);
  const withToc = addIdsAndToc(withButtons);
  data[n] = { html: withToc.html, toc: withToc.toc, imgCount, hasContent: true };
  built++;
}

fs.mkdirSync(path.dirname(DATA_OUT), { recursive: true });
fs.writeFileSync(DATA_OUT, JSON.stringify(data));
const kb = Math.round(fs.statSync(DATA_OUT).size / 1024);
console.log(`Generated lib/amibrokerContentData.json (${kb} KB, ${built}/${MAX} chapters with content)`);
