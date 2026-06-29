import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CHAPTERS, TAG_CLASS, chapterBySlug } from "@/lib/taxationCurriculum";
import { loadChapter } from "@/lib/taxationContent";

import LessonClient from "./LessonClient";

const OG_IMAGE = "https://openalgo.in/assets/og/taxation.png";

// Build per-chapter SEO metadata. Imported by each static chapter page.
export function chapterMeta(slug) {
  const ch = chapterBySlug(slug);
  if (!ch) return {};
  const url = `https://openalgo.in/taxation/${ch.slug}`;
  const title = `${ch.title} - Taxation for Traders and Investors | OpenAlgo`;
  const description = `${ch.summary} A free, modern, beginner-friendly chapter of OpenAlgo's Taxation for Traders and Investors course - plain English, real Indian case studies, educational only and not tax advice.`;
  const keywords = [
    ch.title.toLowerCase(),
    ...ch.learn.map((l) => l.toLowerCase()),
    "taxation for traders", "trading taxes india", "capital gains tax", "f&o tax", "crypto tax india",
  ];
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: `/taxation/${ch.slug}` },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "OpenAlgo",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
      creator: "@openalgoHQ",
      site: "@openalgoHQ",
    },
  };
}

// Shared chapter renderer. Each /taxation/<slug> route is a thin static page that
// renders this with its slug, so every chapter is emitted as a static asset.
export default function ChapterView({ slug }) {
  const ch = chapterBySlug(slug);
  if (!ch) notFound();

  const { html, toc, hasContent } = loadChapter(ch.n);
  const idx = CHAPTERS.findIndex((c) => c.n === ch.n);
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  const url = `https://openalgo.in/taxation/${ch.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ch.title,
    description: ch.summary,
    url,
    inLanguage: "en",
    image: OG_IMAGE,
    author: { "@type": "Organization", name: "OpenAlgo" },
    publisher: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
    isPartOf: { "@type": "Course", name: "Taxation for Traders and Investors", url: "https://openalgo.in/taxation" },
    articleSection: ch.partName,
    keywords: ch.learn.join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "OpenAlgo", item: "https://openalgo.in" },
      { "@type": "ListItem", position: 2, name: "Taxation for Traders and Investors", item: "https://openalgo.in/taxation" },
      { "@type": "ListItem", position: 3, name: ch.title, item: url },
    ],
  };

  return (
    <div className="grid gap-10 px-5 sm:px-8 lg:px-12 py-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <article className="min-w-0">
        <header className="mb-8 border-b border-border pb-7">
          <div className="font-label text-xs uppercase tracking-widest text-primary">
            Module {ch.part} · {ch.partName} - Chapter {String(ch.n).padStart(2, "0")}
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight bg-linear-to-r from-tertiary via-secondary to-primary bg-clip-text text-transparent">
            {ch.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-on-surface-variant">{ch.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ch.tags.map((t) => (
              <span key={t} className={`ex-tag tag-${TAG_CLASS[t] || "idx"}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border surface-low p-5">
            <div className="font-label text-xs uppercase tracking-wider text-tertiary">What you&apos;ll learn</div>
            <ul className="mt-2 grid gap-x-8 gap-y-1 sm:grid-cols-2 text-sm text-on-surface-variant">
              {ch.learn.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-primary">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {hasContent ? (
          <div className="lesson" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="callout info">
            <span className="callout-tag">Note</span>
            <div>
              <p>This chapter is being written and will appear here soon. In the meantime, start from the chapters already published in the sidebar.</p>
            </div>
          </div>
        )}

        <nav className="mt-14 grid gap-4 border-t border-border pt-7 sm:grid-cols-2">
          {prev ? (
            <Link href={`/taxation/${prev.slug}`} className="obsidian-card ghost-border rounded-xl p-4 hover-lift">
              <div className="flex items-center gap-1.5 font-label text-xs uppercase tracking-wider text-on-surface-variant/70">
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </div>
              <div className="mt-1 font-semibold text-on-surface">
                {String(prev.n).padStart(2, "0")}. {prev.title}
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/taxation/${next.slug}`} className="obsidian-card ghost-border rounded-xl p-4 hover-lift sm:text-right">
              <div className="flex items-center gap-1.5 font-label text-xs uppercase tracking-wider text-on-surface-variant/70 sm:justify-end">
                Next <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1 font-semibold text-on-surface">
                {String(next.n).padStart(2, "0")}. {next.title}
              </div>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>

      {toc.length > 0 && (
        <aside className="hidden xl:block">
          <div className="sticky top-20">
            <div className="font-label text-xs uppercase tracking-[0.13em] text-on-surface-variant/70 mb-3">
              On this page
            </div>
            <nav>
              {toc.map((h) => (
                <a key={h.id} href={`#${h.id}`} className={`toc-link lvl-${h.level}`}>
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      <LessonClient />
    </div>
  );
}
