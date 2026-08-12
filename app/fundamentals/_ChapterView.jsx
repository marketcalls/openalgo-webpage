import { notFound } from "next/navigation";

import { PARTS, TAG_CLASS, chapterBySlug } from "@/lib/fundamentalsCurriculum";
import { loadChapter } from "@/lib/fundamentalsContent";

import { LocalizedChapterArticle } from "@/components/course/LocalizedChapterArticle";
import { LocalizedLesson } from "@/components/course/LocalizedLesson";
import { LocalizedToc } from "@/components/course/LocalizedToc";
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
      <LocalizedChapterArticle
        course="fundamentals"
        basePath="/fundamentals"
        parts={PARTS}
        chapterN={ch.n}
        tagClass={TAG_CLASS}
      >
        <LocalizedLesson course="fundamentals" chapterN={ch.n} html={html} toc={toc} hasContent={hasContent} />
      </LocalizedChapterArticle>

      <LocalizedToc course="fundamentals" chapterN={ch.n} html={html} toc={toc} hasContent={hasContent} />

      <LessonClient />
    </div>
  );
}
