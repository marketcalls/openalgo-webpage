// Generates every 1200x630 Open Graph image on the site in its current theme:
// white page, faint grid, near-black and gray two-tone title, Manrope, hairline
// pills and a stats row, the same language as the home hero. One image per
// section and per course, so a shared link shows the page it points to rather
// than the home page.
//
// Run manually:  node scripts/gen-og-images.mjs
// Output:        public/assets/images/og-image.png (the site default) and
//                public/assets/og/<slug>.png (one per section and course)
// These are static assets served by the ASSETS binding, not part of the
// Cloudflare Worker, so they cost the Worker size limit nothing.
//
// Rendering needs only a local Chrome or Edge: each page is written to a temp
// file and captured with the browser's own headless screenshot mode, then
// normalised to exactly 1200x630 with sharp. The fonts are fetched once and
// embedded as data URIs, so a capture never races a network font load.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "assets", "og");
const DEFAULT_OUT = path.join(ROOT, "public", "assets", "images", "og-image.png");
fs.mkdirSync(OUT, { recursive: true });

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("gen-og-images: no Chrome or Edge found");

// Roadmap images count their own tasks, so they follow the data file.
function roadmapStats(file) {
  const p = path.join(ROOT, "lib", "roadmaps", file);
  if (!fs.existsSync(p)) return null;
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  const tasks = data.horizons.flatMap((h) => h.themes.flatMap((t) => t.tasks));
  return [
    [String(tasks.length), "Tasks"],
    [String(data.horizons.length), "Horizons"],
    [String(tasks.filter((t) => t.goodFirst).length), "Good first tasks"],
    [String(data.evals.suites.length), "Eval suites"],
  ];
}

const VARSITY = "Open Varsity";

// Sections: slug (null for the site default), label pill, two-tone title,
// description and up to four stats. Copy follows the page it stands for.
const SECTIONS = [
  { slug: null, label: "Open source", title: ["Your personal", "algo trading platform."],
    desc: "Test and execute your trading ideas, connect your trading platforms and build strategies with AI, with a built-in options analytics suite across 35+ brokers.",
    stats: [["4,95,000+", "Downloads"], ["100%", "Open source"], ["2,800+", "GitHub stars"]] },
  { slug: "charts", label: "OpenAlgo Charts", title: ["Every move.", "A clearer view."],
    desc: "A dependency-free charting library for trading apps: indicators, drawing tools, chart trading, replay and a complete terminal in one import.",
    stats: [["105", "Indicators"], ["87", "Drawing tools"], ["13", "Chart types"], ["0", "Dependencies"]] },
  { slug: "charts-roadmap", label: "Roadmap", title: ["OpenAlgo Charts", "roadmap."],
    desc: "What comes after 2.6.0: themes with measurable outcomes, and contributor tasks sized for one person working with an agent.",
    stats: () => roadmapStats("charts.json") },
  { slug: "script", label: "OpenScript", title: ["An open", "trading language."],
    desc: "Write a study or a strategy once, then plot it, backtest it and trade it. It compiles in the browser with no eval and runs the same program on a server.",
    stats: [["2", "Engines"], ["251", "Library entries"], ["0", "Dependencies"], ["Apache-2.0", "License"]] },
  { slug: "script-roadmap", label: "Roadmap", title: ["OpenScript", "roadmap."],
    desc: "From 0.8 to 1.0 and beyond: Go and Java engines, the standard, and contributor tasks sized for one person working with an agent.",
    stats: () => roadmapStats("scripts.json") },
  { slug: "roadmap", label: "Roadmap", title: ["OpenAlgo", "roadmap 2026."],
    desc: "Where the platform is heading: a desktop app, more markets and brokers, advanced order types and execution algorithms.",
    stats: [["18", "Planned features"], ["8", "Areas"]] },
  { slug: "learn", label: VARSITY, title: [VARSITY + ".", "Learn to trade, properly."],
    desc: "Free courses from market basics to quantitative trading, written for Indian markets and built on real market data.",
    stats: [["13", "Courses"], ["407", "Chapters"], ["Free", "Always"], ["India", "Focus"]] },
  { slug: "features", label: "Features", title: ["Why", "OpenAlgo?"],
    desc: "Self-hosted algo trading and options analytics: a 15-tool options suite, multi-broker execution and strategy automation in one open platform.",
    stats: [["15", "Options tools"], ["35+", "Brokers"], ["100%", "Open source"]] },
  { slug: "download", label: "Download", title: ["Download", "OpenAlgo."],
    desc: "Install on Windows, macOS or Linux with a guided setup, or run it on a server you control.",
    stats: [["3", "Platforms"], ["Free", "Open source"]] },
  { slug: "getting-started", label: "Getting started", title: ["Getting started", "with OpenAlgo."],
    desc: "What OpenAlgo is, how it works and how to take your first step into algorithmic trading, in plain English.",
    stats: [] },
  { slug: "faq", label: "FAQ", title: ["Questions,", "answered."],
    desc: "Installation, broker connections, platform compatibility and more: answers to what people ask most about OpenAlgo.",
    stats: [] },
  { slug: "mcp", label: "OpenAlgo MCP", title: ["Trade with", "natural language."],
    desc: "Connect your AI assistant to your own OpenAlgo server: place orders, manage positions and pull market data by asking.",
    stats: [] },
  { slug: "skills", label: "AI skills", title: ["OpenAlgo skills", "for coding agents."],
    desc: "Indicators, backtesting, strategies and dashboards your coding agent can build with, installed in one command.",
    stats: [["100+", "Indicators"], ["12", "Strategies"]] },
  { slug: "fastscalper", label: "FastScalper", title: ["Scalp fast,", "keyboard first."],
    desc: "A high-performance scalping tool for Indian markets: fast order entry and a keyboard-first workflow.",
    stats: [] },
  { slug: "wabridge", label: "WABridge", title: ["WhatsApp", "HTTP bridge."],
    desc: "A lightweight bridge that sends text, images, video, audio and documents to people, groups and channels from your own scripts.",
    stats: [] },
  { slug: "static-ip", label: "Guide", title: ["Static IP and", "server hosting."],
    desc: "Set up a static IP, deploy OpenAlgo on an Ubuntu server and meet the exchange rules for algorithmic trading in India.",
    stats: [] },
  { slug: "ip", label: "Tool", title: ["Your IP address", "and location."],
    desc: "See your public IP address and its country, city, network, timezone and coordinates.",
    stats: [] },
  { slug: "blog", label: "Blog", title: ["OpenAlgo", "blog."],
    desc: "Insights, tutorials and news on algorithmic trading, OpenAlgo features and trading strategies.",
    stats: [] },
];

// Courses: the slug matches public/assets/og/<slug>.png that each course's
// pages already point to.
const COURSES = [
  { slug: "stocks", title: ["Stock Market", "Basics"], ch: 18, mod: 6,
    desc: "Brand new to the market? Start here. Shares, IPOs, indices, what moves prices and how to spot scams, in plain English with real Indian examples.",
    s3: ["0", "Jargon"], s4: ["India", "Focus"] },
  { slug: "technicals", title: ["Technical", "Analysis"], ch: 28, mod: 6,
    desc: "Trends, support and resistance, chart patterns and indicators like RSI, MACD and moving averages, every concept on real NSE daily charts.",
    s3: ["NSE", "Real charts"], s4: ["India", "Focus"] },
  { slug: "fundamentals", title: ["Python for", "Traders"], ch: 40, mod: 5,
    desc: "Never written a line of code? Start from zero. Variables, data, NumPy, pandas and charts, one small step at a time, on real market data.",
    s3: ["0", "Prior code"], s4: ["Real", "Market data"] },
  { slug: "python", title: ["Algo Trading", "with Python"], ch: 32, mod: 9,
    desc: "Build, backtest and automate real trading strategies with the OpenAlgo SDK: indicators, signals, orders, WebSockets and risk management.",
    s3: ["SDK", "OpenAlgo"], s4: ["Real", "Market data"] },
  { slug: "quant", title: ["Quantitative", "Trading"], ch: 78, mod: 9,
    desc: "Market structure, execution technology, the maths of markets, time series, derivatives and volatility, alpha research, backtesting, ML and production.",
    s3: ["Expert", "Level"], s4: ["India", "Markets"] },
  { slug: "amibroker", title: ["AmiBroker", "AFL"], ch: 36, mod: 8,
    desc: "Learn the AFL language from scratch: indicators, scans, backtests, optimization, alerts and OpenAlgo order automation.",
    s3: ["No", "Python"], s4: ["AFL", "From scratch"] },
  { slug: "futures", title: ["Futures", "Trading"], ch: 27, mod: 7,
    desc: "Contracts, margin and leverage, mark-to-market, rollover, settlement, costs and hedging, in plain English with real Indian examples.",
    s3: ["F&O", "Beginner"], s4: ["India", "Focus"] },
  { slug: "options-basics", title: ["Options", "Basics"], ch: 26, mod: 7,
    desc: "Premium, strike and expiry, moneyness, the option chain, the four payoffs, the Greeks and implied volatility, every payoff a real chart.",
    s3: ["Real", "Payoff charts"], s4: ["India", "Focus"] },
  { slug: "options-strategies", title: ["Options", "Strategies"], ch: 27, mod: 7,
    desc: "Every strategy in the OpenAlgo builder with an authentic payoff chart and the full nine-metric panel: spreads, condors, flies, ratios and calendars.",
    s3: ["38", "Strategies"], s4: ["NIFTY", "Real data"] },
  { slug: "taxation", title: ["Taxation for", "Traders and Investors"], ch: 19, mod: 5,
    desc: "Tax in plain English with real case studies: capital gains and STT, intraday, F&O business income, foreign stocks and crypto. Educational only, not tax advice.",
    s3: ["Real", "Case studies"], s4: ["India", "Tax"] },
  { slug: "stats-arb", title: ["Statistical", "Arbitrage"], ch: 17, mod: 4,
    desc: "Cointegration and pairs, baskets, dynamic hedges and market-neutral books on NSE equities, gross and net, in and out of sample.",
    s3: ["NSE", "Equity data"], s4: ["Expert", "Level"] },
  { slug: "risk-management", title: ["Risk", "Management"], ch: 33, mod: 7,
    desc: "Survival first: the money-safety system, position sizing and stop-losses, leverage and execution risk, and F&O risk, with real examples.",
    s3: ["Survival", "First"], s4: ["India", "Focus"] },
  { slug: "trading-psychology", title: ["Trading Psychology", "and Risk Playbooks"], ch: 26, mod: 5,
    desc: "Discipline as a system, when to hedge and when not, the option-seller playbook, and a risk plan for every type of participant.",
    s3: ["Plans", "Every trader"], s4: ["India", "Focus"] },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function fontFaces() {
  // A current browser user agent makes the stylesheet serve woff2.
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
  const url = "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;800&family=IBM+Plex+Mono:wght@500&display=block";
  const css = await (await fetch(url, { headers: { "User-Agent": ua } })).text();
  let out = css;
  for (const m of css.matchAll(/url\((https:[^)]+\.woff2)\)/g)) {
    const buf = Buffer.from(await (await fetch(m[1])).arrayBuffer());
    out = out.replace(m[1], `data:font/woff2;base64,${buf.toString("base64")}`);
  }
  return out;
}

function titleSize(lines) {
  const longest = Math.max(...lines.map((l) => l.length));
  if (longest > 22) return 68;
  if (longest > 17) return 76;
  return 86;
}

function page({ label, title, desc, stats }, fonts, logo) {
  const cells = (stats || []).map(([v, l]) => `<div class="stat"><div class="sv">${esc(v)}</div><div class="sl">${esc(l.toUpperCase())}</div></div>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fonts}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1200px; height:630px; }
body { background:#ffffff; color:#0b0b0c; font-family:'Manrope', system-ui, sans-serif; overflow:hidden; position:relative; }
.grid { position:absolute; inset:0;
  background-image:linear-gradient(#0b0b0c0a 1px,transparent 1px),linear-gradient(90deg,#0b0b0c0a 1px,transparent 1px);
  background-size:48px 48px; -webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%); }
.wrap { position:relative; height:630px; padding:56px 72px 52px; display:flex; flex-direction:column; }
.top { display:flex; align-items:center; justify-content:space-between; }
.brand { display:flex; align-items:center; gap:12px; font-weight:800; font-size:26px; letter-spacing:-0.4px; }
.brand img { width:34px; height:34px; }
.pill { border:1px solid #d9d9dc; border-radius:999px; padding:9px 20px; font-family:'IBM Plex Mono', monospace; font-weight:500; font-size:17px; letter-spacing:0.3px; color:#55555b; background:#ffffffcc; }
h1 { margin-top:58px; font-weight:800; font-size:${titleSize(title)}px; line-height:1.02; letter-spacing:-2.6px; }
h1 .t2 { display:block; color:#9a9aa0; }
p { margin-top:26px; max-width:980px; font-weight:500; font-size:25px; line-height:1.45; color:#55555b; }
.spacer { flex:1; }
.foot { display:flex; align-items:flex-end; justify-content:space-between; border-top:1px solid #e6e6e8; padding-top:24px; }
.stats { display:flex; gap:52px; }
.sv { font-weight:800; font-size:34px; letter-spacing:-0.8px; line-height:1; }
.sl { margin-top:8px; font-family:'IBM Plex Mono', monospace; font-weight:500; font-size:13px; letter-spacing:1.2px; color:#77777d; }
.site { font-family:'IBM Plex Mono', monospace; font-weight:500; font-size:17px; color:#77777d; }
</style></head><body>
<div class="grid"></div>
<div class="wrap">
  <div class="top">
    <div class="brand"><img src="${logo}" alt="">OpenAlgo</div>
    <div class="pill">${esc(label)}</div>
  </div>
  <h1>${esc(title[0])}<span class="t2">${esc(title[1])}</span></h1>
  <p>${esc(desc)}</p>
  <div class="spacer"></div>
  <div class="foot"><div class="stats">${cells}</div><div class="site">openalgo.in</div></div>
</div>
</body></html>`;
}

async function render(html, outFile, tmp) {
  const htmlFile = path.join(tmp, "og.html");
  const shot = path.join(tmp, "og.png");
  fs.writeFileSync(htmlFile, html);
  if (fs.existsSync(shot)) fs.rmSync(shot);
  execFileSync(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb",
    "--force-device-scale-factor=2", "--window-size=1200,630", "--virtual-time-budget=3000",
    `--screenshot=${shot}`, pathToFileURL(htmlFile).href,
  ], { stdio: "ignore" });
  await sharp(shot).resize(1200, 630).png({ compressionLevel: 9 }).toFile(outFile);
  return Math.round(fs.statSync(outFile).size / 1024);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "oa-og-"));
const fonts = await fontFaces();
const logo = `data:image/png;base64,${fs.readFileSync(path.join(ROOT, "public", "assets", "images", "logo-mark.png")).toString("base64")}`;

let n = 0;
for (const s of SECTIONS) {
  const stats = typeof s.stats === "function" ? s.stats() : s.stats;
  if (stats === null) { console.log(`og: skipped ${s.slug} (its data file is missing)`); continue; }
  const out = s.slug ? path.join(OUT, `${s.slug}.png`) : DEFAULT_OUT;
  const kb = await render(page({ ...s, stats }, fonts, logo), out, tmp);
  console.log(`og: ${path.relative(ROOT, out)} (${kb} KB)`);
  n++;
}
for (const c of COURSES) {
  const stats = [[String(c.ch), "Chapters"], [String(c.mod), "Modules"], c.s3, c.s4];
  const out = path.join(OUT, `${c.slug}.png`);
  const kb = await render(page({ label: VARSITY, title: c.title, desc: c.desc, stats }, fonts, logo), out, tmp);
  console.log(`og: ${path.relative(ROOT, out)} (${kb} KB)`);
  n++;
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Generated ${n} OG images`);
