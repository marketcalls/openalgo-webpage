import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("ohlcv-data");

export default function Page() {
  return <ChapterView slug="ohlcv-data" />;
}
