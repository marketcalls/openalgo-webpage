import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("calendars");

export default function Page() {
  return <ChapterView slug="calendars" />;
}
