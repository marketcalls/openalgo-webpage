import SyllabusRail from "./SyllabusRail";
import "./stocks-portal.css";

export const metadata = {
  title: "Stock Market Basics - Learn with OpenAlgo",
  description:
    "A free, modern, beginner-friendly 18-chapter course on the Indian stock market - from why you must invest to IPOs, indices, what moves prices, and how to spot scams. Plain English, clear diagrams, real examples.",
};

export default function StocksLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
