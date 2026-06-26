import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("fibonacci");

export default function Page() {
  return <ChapterView slug="fibonacci" />;
}
