import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("volume");

export default function Page() {
  return <ChapterView slug="volume" />;
}
