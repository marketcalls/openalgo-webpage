import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("json-data");

export default function Page() {
  return <ChapterView slug="json-data" />;
}
