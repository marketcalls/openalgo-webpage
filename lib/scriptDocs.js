// Server-side access to the generated /script documentation.
//
// lib/scriptDocsData.json is written by scripts/gen-script-docs.mjs. It is a
// static import on purpose: OpenNext renders these routes inside the Worker,
// where a filesystem read at runtime returns nothing (see CLAUDE.md).
//
// Only server components import this module. Client components receive the
// small slices they need (the nav without briefs, one page's toc) as props, so
// the page HTML never ships twice in a client bundle.
import data from "./scriptDocsData.json";

export const SCRIPT_VERSION = data.version;
export const SCRIPT_REPO = "https://github.com/marketcalls/openscript";
export const SCRIPT_EDIT_BASE = "https://github.com/marketcalls/openalgo-webpage/blob/master/content/script";
export const SITE = "https://openalgo.in";

export const scriptNav = data.nav;

/** A page by its section and page slugs, or undefined when it is not written yet. */
export function getScriptPage(section, page) {
  return data.pages[`${section}/${page}`];
}

/** Every written page, in reading order. */
export function readyPages() {
  const out = [];
  for (const s of data.nav) {
    for (const p of s.pages) {
      if (p.ready && data.pages[`${s.slug}/${p.slug}`]) {
        out.push({ section: s.slug, sectionTitle: s.title, page: p.slug, title: p.title, href: `/script/${s.slug}/${p.slug}` });
      }
    }
  }
  return out;
}

/** The first written page of a section, or undefined. */
export function firstPageOf(sectionSlug) {
  const s = data.nav.find((x) => x.slug === sectionSlug);
  const p = s?.pages.find((x) => x.ready);
  return p ? `/script/${s.slug}/${p.slug}` : undefined;
}

/**
 * A link to a page that falls back to the first written page when the one asked
 * for is not written yet, so a call to action never points at a 404.
 */
export function hrefOr(section, page) {
  const s = data.nav.find((x) => x.slug === section);
  if (s?.pages.find((x) => x.slug === page)?.ready) return `/script/${section}/${page}`;
  const first = readyPages()[0];
  return first ? first.href : "/script#docs";
}

/** The previous and next written pages around one page. */
export function neighbours(section, page) {
  const list = readyPages();
  const i = list.findIndex((x) => x.section === section && x.page === page);
  if (i === -1) return { prev: undefined, next: undefined };
  return { prev: list[i - 1], next: list[i + 1] };
}

/** The nav as the sidebar needs it: titles, slugs and whether a page exists. */
export function clientNav() {
  return data.nav.map((s) => ({
    slug: s.slug,
    title: s.title,
    pages: s.pages.map((p) => ({ slug: p.slug, title: p.title, ready: Boolean(p.ready) })),
  }));
}
