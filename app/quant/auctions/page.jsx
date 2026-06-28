import ChapterView, { chapterMeta } from "../_ChapterView";

export const metadata = chapterMeta("auctions");

export default function Page() {
  return <ChapterView slug="auctions" />;
}
