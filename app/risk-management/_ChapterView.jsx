import { notFound } from "next/navigation";

import { PARTS, TAG_CLASS, chapterBySlug } from "@/lib/riskCurriculum";
import { loadChapter } from "@/lib/riskContent";

import { LocalizedChapterArticle } from "@/components/course/LocalizedChapterArticle";
import { LocalizedLesson } from "@/components/course/LocalizedLesson";
import { LocalizedToc } from "@/components/course/LocalizedToc";
import LessonClient from "./LessonClient";

const OG_IMAGE = "https://openalgo.in/assets/og/risk-management.png";

// Build per-chapter SEO metadata. Imported by each static chapter page.
export function chapterMeta(slug) {
  const ch = chapterBySlug(slug);
  if (!ch) return {};
  const url = `https://openalgo.in/risk-management/${ch.slug}`;
  const title = `${ch.title} - Risk Management | OpenAlgo`;
  const description = `${ch.summary} A free, beginner-friendly chapter of OpenAlgo's Risk Management course - plain English, clear diagrams and real Indian market examples.`;
  const keywords = [
    ch.title.toLowerCase(),
    ...ch.learn.map((l) => l.toLowerCase()),
    "risk management", "trading risk management", "position sizing", "stop loss", "money management india", "trading for beginners india",
  ];
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: `/risk-management/${ch.slug}` },
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

// Shared chapter renderer. Each /risk-management/<slug> route is a thin static page
// that renders this with its slug, so every chapter is emitted as a static asset.
export default function ChapterView({ slug }) {
  const ch = chapterBySlug(slug);
  if (!ch) notFound();

  const { html, toc, hasContent } = loadChapter(ch.n);

  const url = `https://openalgo.in/risk-management/${ch.slug}`;
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
    isPartOf: { "@type": "Course", name: "Risk Management", url: "https://openalgo.in/risk-management" },
    articleSection: ch.partName,
    keywords: ch.learn.join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "OpenAlgo", item: "https://openalgo.in" },
      { "@type": "ListItem", position: 2, name: "Risk Management", item: "https://openalgo.in/risk-management" },
      { "@type": "ListItem", position: 3, name: ch.title, item: url },
    ],
  };

  return (
    <div className="grid gap-10 px-5 sm:px-8 lg:px-12 py-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocalizedChapterArticle
        course="risk-management"
        basePath="/risk-management"
        parts={PARTS}
        chapterN={ch.n}
        tagClass={TAG_CLASS}
      >
        <LocalizedLesson course="risk-management" chapterN={ch.n} html={html} toc={toc} hasContent={hasContent} />
      </LocalizedChapterArticle>

      <LocalizedToc course="risk-management" chapterN={ch.n} html={html} toc={toc} hasContent={hasContent} />

      <LessonClient />
    </div>
  );
}
