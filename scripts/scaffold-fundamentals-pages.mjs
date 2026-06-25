// One-off scaffolder: writes a static app/fundamentals/<slug>/page.jsx for every
// chapter in the curriculum. Static per-chapter folders are required because a
// dynamic [slug] route 404s on Cloudflare/OpenNext. Safe to re-run (idempotent).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CHAPTERS } from "../lib/fundamentalsCurriculum.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = path.join(ROOT, "app", "fundamentals");

let written = 0;
for (const ch of CHAPTERS) {
  const dir = path.join(APP_DIR, ch.slug);
  fs.mkdirSync(dir, { recursive: true });
  const body = `import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("${ch.slug}");

export default function Page() {
  return <ChapterView slug="${ch.slug}" />;
}
`;
  fs.writeFileSync(path.join(dir, "page.jsx"), body);
  written++;
}
console.log(`Scaffolded ${written} static chapter pages under app/fundamentals/`);
