"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { useI18n } from "@/components/i18n/LanguageProvider";
import useLocalizedCourseMetadata from "@/lib/content-i18n/useLocalizedCourseMetadata";

export function LocalizedChapterArticle({
  course,
  basePath,
  parts,
  chapterN,
  tagClass,
  children,
}) {
  const { t } = useI18n();
  const { parts: localizedParts } = useLocalizedCourseMetadata(course, parts);
  const normalizedBasePath = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const chapters = localizedParts.flatMap((part) =>
    part.chapters.map((chapter) => ({
      ...chapter,
      part: part.id,
      partName: part.name,
    }))
  );
  const index = chapters.findIndex((chapter) => chapter.n === chapterN);

  if (index === -1) {
    return <article className="min-w-0">{children}</article>;
  }

  const chapter = chapters[index];
  const previous = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;

  return (
    <article className="min-w-0">
      <header className="mb-8 border-b border-border pb-7">
        <div className="font-label text-xs uppercase tracking-widest text-primary">
          {t("courseNav.module")} {chapter.part} &middot; {chapter.partName} - {t("courseNav.chapter")} {String(chapter.n).padStart(2, "0")}
        </div>
        <h1 className="text-on-surface mt-2 text-3xl sm:text-4xl font-bold leading-tight">
          {chapter.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-on-surface-variant">{chapter.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chapter.tags.map((tag) => (
            <span key={tag} className={`ex-tag tag-${tagClass?.[tag] || "idx"}`}>
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-border surface-low p-5">
          <div className="font-label text-xs uppercase tracking-wider text-tertiary">
            {t("courseNav.whatYouWillLearn")}
          </div>
          <ul className="mt-2 grid gap-x-8 gap-y-1 sm:grid-cols-2 text-sm text-on-surface-variant">
            {chapter.learn.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-primary">&middot;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {children}

      <nav className="mt-14 grid gap-4 border-t border-border pt-7 sm:grid-cols-2">
        {previous ? (
          <Link href={`${normalizedBasePath}/${previous.slug}`} className="obsidian-card ghost-border rounded-xl p-4 hover-lift">
            <div className="flex items-center gap-1.5 font-label text-xs uppercase tracking-wider text-on-surface-variant/70">
              <ArrowLeft className="h-3.5 w-3.5" /> {t("courseNav.previous")}
            </div>
            <div className="mt-1 font-semibold text-on-surface">
              {String(previous.n).padStart(2, "0")}. {previous.title}
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`${normalizedBasePath}/${next.slug}`} className="obsidian-card ghost-border rounded-xl p-4 hover-lift sm:text-right">
            <div className="flex items-center gap-1.5 font-label text-xs uppercase tracking-wider text-on-surface-variant/70 sm:justify-end">
              {t("courseNav.next")} <ArrowRight className="h-3.5 w-3.5" />
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
  );
}
