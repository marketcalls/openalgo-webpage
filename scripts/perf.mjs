// Repeatable Lighthouse measurement across pages.
// Usage: node scripts/perf.mjs  (assumes a server is running on PERF_BASE)
// Same conditions every run: mobile preset, Lighthouse's default simulated
// throttling (4x CPU + slow 4G), performance category only.
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const base = process.env.PERF_BASE || "http://localhost:3000";
const routes = (
  process.env.PERF_ROUTES ||
  "/,/learn,/fundamentals,/fundamentals/numpy-basics,/python,/quant,/features,/getting-started"
).split(",");

const chrome = await launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

const opts = { port: chrome.port, onlyCategories: ["performance"], formFactor: "mobile" };
const ms = (v) => Math.round(v);

const rows = [];
for (const r of routes) {
  try {
    const { lhr } = await lighthouse(base + r, opts);
    const a = lhr.audits;
    rows.push({
      route: r,
      perf: Math.round(lhr.categories.performance.score * 100),
      FCP: ms(a["first-contentful-paint"].numericValue),
      LCP: ms(a["largest-contentful-paint"].numericValue),
      TBT: ms(a["total-blocking-time"].numericValue),
      CLS: a["cumulative-layout-shift"].numericValue.toFixed(3),
      SI: ms(a["speed-index"].numericValue),
    });
  } catch (e) {
    rows.push({ route: r, perf: "ERR", FCP: "-", LCP: "-", TBT: "-", CLS: "-", SI: e.message.slice(0, 40) });
  }
}
const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad("route", 32)}${pad("perf", 6)}${pad("FCP", 7)}${pad("LCP", 7)}${pad("TBT", 7)}${pad("CLS", 8)}SI`);
console.log("-".repeat(74));
for (const x of rows) {
  console.log(
    `${pad(x.route, 32)}${pad(x.perf, 6)}${pad(x.FCP, 7)}${pad(x.LCP, 7)}${pad(x.TBT, 7)}${pad(x.CLS, 8)}${x.SI}`,
  );
}
const nums = rows.filter((r) => typeof r.perf === "number");
if (nums.length) {
  const avg = (k) => Math.round(nums.reduce((s, r) => s + Number(r[k]), 0) / nums.length);
  console.log("-".repeat(74));
  console.log(`${pad("AVERAGE", 32)}${pad(avg("perf"), 6)}${pad(avg("FCP"), 7)}${pad(avg("LCP"), 7)}${pad(avg("TBT"), 7)}${pad("", 8)}${avg("SI")}`);
}

// Chrome temp-dir cleanup can EPERM on Windows; don't let it crash the run.
try { await chrome.kill(); } catch { /* orphan temp dir, harmless */ }
