import SyllabusRail from "./SyllabusRail";
import "./technicals-portal.css";

export const metadata = {
  title: "Technical Analysis - Learn with OpenAlgo",
  description:
    "A free, modern, beginner-friendly 25-chapter course on technical analysis - from reading candlestick charts to trends, support and resistance, chart patterns, indicators and risk management. Built entirely on real NSE daily charts, in plain English with honest examples.",
};

export default function TechnicalsLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
