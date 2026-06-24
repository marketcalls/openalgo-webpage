import { CHAPTERS } from "@/lib/quantCurriculum";

import ChapterView, { chapterMeta } from "../_ChapterView";

export const dynamicParams = false;

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return chapterMeta(slug);
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <ChapterView slug={slug} />;
}
