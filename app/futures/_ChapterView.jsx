import { notFound } from "next/navigation";

import { PARTS, TAG_CLASS, chapterBySlug } from "@/lib/futuresCurriculum";
import { loadChapter } from "@/lib/futuresContent";

import { LocalizedChapterArticle } from "@/components/course/LocalizedChapterArticle";
import { LocalizedLesson } from "@/components/course/LocalizedLesson";
import { LocalizedToc } from "@/components/course/LocalizedToc";
import LessonClient from "./LessonClient";

const OG_IMAGE = "https://openalgo.in/assets/og/futures.png";

// Build per-chapter SEO metadata. Imported by each static chapter page.
export function chapterMeta(slug) {
  const ch = chapterBySlug(slug);
  if (!ch) return {};
  const url = `https://openalgo.in/futures/${ch.slug}`;
  const title = `${ch.title} - Futures Trading | OpenAlgo`;
  const description = `${ch.summary} A free, modern, beginner-friendly chapter of OpenAlgo's Futures Trading course - built on real Indian market examples, plain English and honest, real-world examples.`;
  const keywords = [
    ch.title.toLowerCase(),
    ...ch.learn.map((l) => l.toLowerCase()),
    "futures trading", "futures trading for beginners", "futures contracts", "margin and leverage", "index and stock futures",
  ];
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: `/futures/${ch.slug}` },
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

// Shared chapter renderer. Each /futures/<slug> route is a thin static page that
// renders this with its slug, so every chapter is emitted as a static asset.
export default function ChapterView({ slug }) {
  const ch = chapterBySlug(slug);
  if (!ch) notFound();

  const { html, toc, hasContent } = loadChapter(ch.n);

  const url = `https://openalgo.in/futures/${ch.slug}`;
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
    isPartOf: { "@type": "Course", name: "Futures Trading", url: "https://openalgo.in/futures" },
    articleSection: ch.partName,
    keywords: ch.learn.join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "OpenAlgo", item: "https://openalgo.in" },
      { "@type": "ListItem", position: 2, name: "Futures Trading", item: "https://openalgo.in/futures" },
      { "@type": "ListItem", position: 3, name: ch.title, item: url },
    ],
  };

  return (
    <div className="grid gap-10 px-5 sm:px-8 lg:px-12 py-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocalizedChapterArticle
        course="futures"
        basePath="/futures"
        parts={PARTS}
        chapterN={ch.n}
        tagClass={TAG_CLASS}
      >
        <LocalizedLesson course="futures" chapterN={ch.n} html={html} toc={toc} hasContent={hasContent} />
      </LocalizedChapterArticle>

      <LocalizedToc course="futures" chapterN={ch.n} html={html} toc={toc} hasContent={hasContent} />

      <LessonClient />
    </div>
  );
}
