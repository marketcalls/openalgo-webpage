// Generates a 1200x630 hero-style Open Graph image per course, matching the
// course landing hero (obsidian background + grid, a badge pill, a gradient
// title, a short description and a four-stat row). Rendered with headless
// Chrome via puppeteer-core, then normalised to exactly 1200x630 with sharp.
//
// Run manually:  node scripts/gen-og-images.mjs
// Output:        public/assets/og/<slug>.png
// These are static assets (served by the ASSETS binding), NOT bundled into the
// Cloudflare Worker, so they do not count against the Worker size limit.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer-core";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "assets", "og");
fs.mkdirSync(OUT, { recursive: true });

const CHROME =
  ["C:/Program Files/Google/Chrome/Application/chrome.exe",
   "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));

// Theme accents (approx of the site's purple / blue / green / teal tokens)
const P = "#b794ff", B = "#7c9dff", G = "#57d977", T = "#54d6c4";

const COURSES = [
  { slug: "stocks", title: "Stock Market Basics", grad: [G, B, P],
    badge: "zero jargon  ·  built for India", ch: 18, mod: 6,
    desc: "Brand new to the market? Start here. Shares, IPOs, indices, what moves prices and how to spot scams - in plain English with clear diagrams and real Indian examples.",
    s3: ["0", "Jargon"], s4: ["India", "Focus"] },
  { slug: "technicals", title: "Technical Analysis", grad: [G, P, B],
    badge: "real NSE charts  ·  candles to indicators", ch: 28, mod: 6,
    desc: "Read a chart, not just buy and hold. Trends, support and resistance, chart patterns and indicators like RSI, MACD and moving averages - every concept on real NSE daily charts.",
    s3: ["NSE", "Real charts"], s4: ["India", "Focus"] },
  { slug: "fundamentals", title: "Python for Traders", grad: [P, B, G],
    badge: "Python from zero  ·  no coding needed", ch: 40, mod: 5,
    desc: "Never written a line of code? Start from absolute zero. Variables, data, NumPy, pandas and charts - one small step at a time, on real market data.",
    s3: ["0", "Prior code"], s4: ["Real", "Market data"] },
  { slug: "python", title: "Algo Trading with Python", grad: [B, P, G],
    badge: "build, backtest, automate  ·  OpenAlgo SDK", ch: 32, mod: 9,
    desc: "Comfortable with the basics? Build, backtest and automate real trading strategies with the OpenAlgo SDK - indicators, signals, orders, WebSockets and risk management.",
    s3: ["SDK", "OpenAlgo"], s4: ["Real", "Market data"] },
  { slug: "quant", title: "Quantitative Trading", grad: [G, B, P],
    badge: "a full quant career curriculum", ch: 78, mod: 9,
    desc: "Market structure and microstructure, HFT and execution technology, the maths of markets, time series, derivatives and volatility, alpha research, backtesting, ML and production.",
    s3: ["Expert", "Level"], s4: ["India", "Markets"] },
  { slug: "amibroker", title: "AmiBroker AFL", grad: [B, P, T],
    badge: "AFL from scratch  ·  no Python needed", ch: 36, mod: 8,
    desc: "Prefer charts to Python? Learn AmiBroker's AFL language from scratch - indicators, scans, backtests, optimization, alerts and OpenAlgo order automation.",
    s3: ["No", "Python"], s4: ["AFL", "From scratch"] },
  { slug: "futures", title: "Futures Trading", grad: [G, B, P],
    badge: "derivatives from zero  ·  honest about risk", ch: 27, mod: 7,
    desc: "New to derivatives? Start with futures. Contracts, margin and leverage, mark-to-market, rollover, settlement, costs and hedging - in plain English with real Indian examples.",
    s3: ["F&O", "Beginner"], s4: ["India", "Focus"] },
  { slug: "options-basics", title: "Options Basics", grad: [B, P, G],
    badge: "calls and puts from absolute zero", ch: 26, mod: 7,
    desc: "Premium, strike and expiry, moneyness, the option chain, the four payoffs, the Greeks and implied volatility - every term defined, every payoff a real chart.",
    s3: ["Real", "Payoff charts"], s4: ["India", "Focus"] },
  { slug: "options-strategies", title: "Options Strategies", grad: [P, T, B],
    badge: "all 38 builder strategies  ·  real NIFTY data", ch: 27, mod: 7,
    desc: "Every strategy in the OpenAlgo builder, each with an authentic payoff chart and the full nine-metric panel - spreads, condors, flies, ratios, jade lizards and calendars.",
    s3: ["38", "Strategies"], s4: ["NIFTY", "Real data"] },
  { slug: "taxation", title: "Taxation for Traders & Investors", grad: [G, B, P],
    badge: "plain-English tax  ·  real case studies", ch: 19, mod: 5,
    desc: "Tax in plain English with real case studies - capital gains and STT, intraday, F&O business income, US stocks and Schedule FA, and crypto. Educational only, not tax advice.",
    s3: ["Real", "Case studies"], s4: ["India", "Tax"] },
  { slug: "stats-arb", title: "Statistical Arbitrage", grad: [P, G, T],
    badge: "pairs to market-neutral  ·  real NSE data", ch: 17, mod: 4,
    desc: "For traders who want the real thing, not the pitch. Cointegration and pairs, baskets, dynamic hedges and market-neutral books on NSE equities - gross and net, in and out of sample.",
    s3: ["NSE", "Equity data"], s4: ["Expert", "Level"] },
  { slug: "risk-management", title: "Risk Management", grad: [G, B, P],
    badge: "how not to get destroyed  ·  built for India", ch: 33, mod: 7,
    desc: "The market rewards the one still standing. Survival first: the money-safety system, position sizing and stop-losses, leverage and execution risk, and F&O risk - with real examples.",
    s3: ["Survival", "First"], s4: ["India", "Focus"] },
  { slug: "trading-psychology", title: "Trading Psychology & Risk Playbooks", grad: [B, P, T],
    badge: "master your mind  ·  hedging  ·  risk plans", ch: 26, mod: 5,
    desc: "Most traders lose to themselves. Discipline as a system, when to hedge and when not, the option-seller playbook, and a ready-to-use risk plan for every type of participant.",
    s3: ["Plans", "Every trader"], s4: ["India", "Focus"] },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function titleSize(t) {
  if (t.length > 30) return 52;
  if (t.length > 20) return 62;
  return 78;
}

function statCell([v, l], grad) {
  return `<div class="stat">
    <div class="sv" style="background:linear-gradient(90deg,${grad[0]},${grad[2]});-webkit-background-clip:text;background-clip:text;color:transparent">${esc(v)}</div>
    <div class="sl">${esc(l.toUpperCase())}</div>
  </div>`;
}

function html(c) {
  const grad = c.grad;
  const stats = [[String(c.ch), "Chapters"], [String(c.mod), "Modules"], c.s3, c.s4];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  body { background:#0a0a0b; font-family:'Segoe UI', system-ui, -apple-system, sans-serif; overflow:hidden; position:relative; }
  .grid { position:absolute; inset:0;
    background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);
    background-size:52px 52px; mask-image:linear-gradient(160deg,rgba(0,0,0,.9),transparent 80%); }
  .orb1 { position:absolute; width:560px; height:560px; top:-200px; right:-160px; border-radius:50%;
    background:radial-gradient(circle, ${grad[2]}22, transparent 60%); filter:blur(8px); }
  .orb2 { position:absolute; width:480px; height:480px; bottom:-220px; left:-140px; border-radius:50%;
    background:radial-gradient(circle, ${grad[0]}1f, transparent 60%); filter:blur(8px); }
  .wrap { position:relative; padding:66px 70px; height:630px; display:flex; flex-direction:column; }
  .badge { display:inline-flex; align-items:center; gap:10px; align-self:flex-start;
    border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.035);
    border-radius:999px; padding:11px 22px; }
  .badge .dot { width:9px; height:9px; border-radius:50%; background:linear-gradient(90deg,${grad[0]},${grad[2]}); box-shadow:0 0 10px ${grad[0]}88; }
  .badge span { font-family:Consolas,'Cascadia Mono',monospace; font-size:18px; letter-spacing:.3px; color:#9aa6b2; }
  h1 { margin-top:30px; font-size:${titleSize(c.title)}px; font-weight:800; line-height:1.04; letter-spacing:-1px;
    max-width:1040px; background:linear-gradient(96deg,${grad[0]},${grad[1]},${grad[2]});
    -webkit-background-clip:text; background-clip:text; color:transparent; }
  p { margin-top:24px; font-size:26px; line-height:1.45; color:#c3ccd6; max-width:1010px; }
  .spacer { flex:1; }
  .stats { display:flex; gap:64px; }
  .stat .sv { font-size:40px; font-weight:800; letter-spacing:-.5px; line-height:1; }
  .stat .sl { margin-top:8px; font-family:Consolas,'Cascadia Mono',monospace; font-size:14px; letter-spacing:1.2px; color:#8b97a4; }
  .brand { position:absolute; right:70px; bottom:64px; font-family:Consolas,monospace; font-size:16px; letter-spacing:1px; color:#6b7682; }
  </style></head><body>
  <div class="grid"></div><div class="orb1"></div><div class="orb2"></div>
  <div class="wrap">
    <div class="badge"><span class="dot"></span><span>${esc(String(c.ch))} chapters  ·  ${esc(c.badge)}</span></div>
    <h1>${esc(c.title)}</h1>
    <p>${esc(c.desc)}</p>
    <div class="spacer"></div>
    <div class="stats">${stats.map((s) => statCell(s, grad)).join("")}</div>
  </div>
  <div class="brand">Open Varsity  ·  OpenAlgo</div>
  </body></html>`;
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--force-color-profile=srgb", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

let n = 0;
for (const c of COURSES) {
  await page.setContent(html(c), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((r) => setTimeout(r, 150));
  const buf = await page.screenshot({ type: "png" });
  const out = path.join(OUT, `${c.slug}.png`);
  await sharp(buf).resize(1200, 630).png({ quality: 90 }).toFile(out);
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`og: ${c.slug}.png (${kb} KB)`);
  n++;
}
await browser.close();
console.log(`Generated ${n} OG images in public/assets/og/`);
