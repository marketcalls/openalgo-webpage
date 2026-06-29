import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CHAPTERS, TAG_CLASS, chapterBySlug } from "@/lib/fundamentalsCurriculum";
import { loadChapter } from "@/lib/fundamentalsContent";

import LessonClient from "./LessonClient";

const OG_IMAGE = "https://openalgo.in/assets/og/fundamentals.png";

// Build per-chapter SEO metadata. Imported by each static chapter route.
export function chapterMeta(slug) {
  const ch = chapterBySlug(slug);
  if (!ch) return {};
  const url = `https://openalgo.in/fundamentals/${ch.slug}`;
  const title = `${ch.title} - Python for Traders | OpenAlgo`;
  const description = `${ch.summary} A beginner-friendly chapter of the free OpenAlgo Python for Traders course - plain English, runnable examples, real market data.`;
  const keywords = [
    ch.title.toLowerCase(),
    ...ch.learn.map((l) => l.toLowerCase()),
    "python for traders", "python for finance", "learn python trading", "python for beginners",
    "pandas finance", "yfinance", "stock market python", "openalgo",
  ];
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: `/fundamentals/${ch.slug}` },
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

// Shared chapter renderer. Each /fundamentals/<slug> static route renders this
// with its slug, so every chapter is emitted as a static asset.
export default function ChapterView({ slug }) {
  const ch = chapterBySlug(slug);
  if (!ch) notFound();

  const { html, toc, hasContent } = loadChapter(ch.n);
  const idx = CHAPTERS.findIndex((c) => c.n === ch.n);
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  const url = `https://openalgo.in/fundamentals/${ch.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: ch.title,
    description: ch.summary,
    url,
    inLanguage: "en",
    image: OG_IMAGE,
    author: { "@type": "Organization", name: "OpenAlgo" },
    publisher: { "@type": "Organization", name: "OpenAlgo", url: "https://openalgo.in" },
    isPartOf: { "@type": "Course", name: "Python for Traders", url: "https://openalgo.in/fundamentals" },
    articleSection: ch.partName,
    keywords: ch.learn.join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "OpenAlgo", item: "https://openalgo.in" },
      { "@type": "ListItem", position: 2, name: "Python for Traders", item: "https://openalgo.in/fundamentals" },
      { "@type": "ListItem", position: 3, name: ch.title, item: url },
    ],
  };

  return (
    <div className="grid gap-10 px-5 sm:px-8 lg:px-12 py-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <article className="min-w-0">
        <header className="mb-8 border-b border-border pb-7">
          <div className="font-label text-xs uppercase tracking-[0.1em] text-primary">
            Module {ch.part} &middot; {ch.partName} - Chapter {String(ch.n).padStart(2, "0")}
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
            {ch.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-on-surface-variant">{ch.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ch.tags.map((t) => (
              <span key={t} className={`ex-tag tag-${TAG_CLASS[t] || "py"}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border surface-low p-5">
            <div className="font-label text-xs uppercase tracking-wider text-tertiary">What you&apos;ll learn</div>
            <ul className="mt-2 grid gap-x-8 gap-y-1 sm:grid-cols-2 text-sm text-on-surface-variant">
              {ch.learn.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-primary">&middot;</span>
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
            <Link href={`/fundamentals/${prev.slug}`} className="obsidian-card ghost-border rounded-xl p-4 hover-lift">
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
            <Link href={`/fundamentals/${next.slug}`} className="obsidian-card ghost-border rounded-xl p-4 hover-lift sm:text-right">
              <div className="flex items-center gap-1.5 font-label text-xs uppercase tracking-wider text-on-surface-variant/70 sm:justify-end">
                Next <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1 font-semibold text-on-surface">
                {String(next.n).padStart(2, "0")}. {next.title}
              </div>
            </Link>
          ) : (
            <Link href="/fundamentals" className="obsidian-card ghost-border rounded-xl p-4 hover-lift sm:text-right">
              <div className="flex items-center gap-1.5 font-label text-xs uppercase tracking-wider text-tertiary sm:justify-end">
                Finish <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1 font-semibold text-on-surface">Back to the course overview</div>
            </Link>
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
