import SyllabusRail from "./SyllabusRail";
import "./taxation-portal.css";

export const metadata = {
  title: "Taxation for Traders and Investors - Learn with OpenAlgo",
  description:
    "A free, modern, beginner-friendly 19-chapter course on tax for anyone who trades or invests in India - the income buckets, the two regimes, capital gains and STT, intraday, F&O business income, turnover and audit, US stocks and foreign-asset disclosure, crypto tax, and choosing the right ITR. Plain English with real case studies. Educational only, not tax advice.",
};

export default function TaxationLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
