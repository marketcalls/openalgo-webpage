"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/i18n/LanguageProvider";
import useLocalizedCourseMetadata from "@/lib/content-i18n/useLocalizedCourseMetadata";

export default function LocalizedSyllabusRail({ course, basePath, parts }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const { parts: localizedParts } = useLocalizedCourseMetadata(course, parts);
  const normalizedBasePath = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const chapterPrefix = `${normalizedBasePath}/`;
  const activeSlug = pathname.startsWith(chapterPrefix)
    ? pathname.slice(chapterPrefix.length).split("/")[0]
    : "";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="lg:hidden fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium gradient-cta text-primary-foreground shadow-lg"
        aria-label={t("courseNav.toggleChapters")}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        {t("courseNav.chapters")}
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          fixed lg:sticky top-0 lg:top-16 left-0 z-40 lg:z-0
          h-screen lg:h-[calc(100vh-4rem)] w-[82%] max-w-[320px] lg:w-auto
          overflow-y-auto surface-lowest lg:surface-base border-r border-border
          px-3 py-6 transition-transform duration-200`}
      >
        <Link
          href={normalizedBasePath}
          onClick={() => setOpen(false)}
          className={`syllabus-link ${activeSlug === "" ? "active" : ""}`}
        >
          <span className="num">&uarr;</span>
          <span>{t("courseNav.overview")}</span>
        </Link>

        {localizedParts.map((part) => (
          <div key={part.id} className="mt-5">
            <div className="px-3 mb-1.5 font-label text-[0.62rem] uppercase tracking-[0.13em] text-on-surface-variant/70">
              {part.id} &middot; {part.name}
            </div>
            {part.chapters.map((chapter) => (
              <Link
                key={chapter.n}
                href={`${normalizedBasePath}/${chapter.slug}`}
                prefetch={false}
                onClick={() => setOpen(false)}
                className={`syllabus-link ${activeSlug === chapter.slug ? "active" : ""}`}
              >
                <span className="num">{String(chapter.n).padStart(2, "0")}</span>
                <span>{chapter.title}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}
