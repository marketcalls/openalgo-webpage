import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("files");

export default function Page() {
  return <ChapterView slug="files" />;
}
