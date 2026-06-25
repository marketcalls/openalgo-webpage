import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("lists");

export default function Page() {
  return <ChapterView slug="lists" />;
}
