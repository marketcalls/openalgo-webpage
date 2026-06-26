import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("stock-quote");

export default function Page() {
  return <ChapterView slug="stock-quote" />;
}
