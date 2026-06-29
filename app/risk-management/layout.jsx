import "../stocks/stocks-portal.css";

import { CHAPTERS } from "@/lib/riskCurriculum";

import SyllabusRail from "./SyllabusRail";

export const metadata = {
  title: "Risk Management - Learn with OpenAlgo",
  description:
    `A free, absolute-beginner ${CHAPTERS.length}-chapter course on risk management for the Indian markets - what risk really is, the money-safety system, investor and trader risk, leverage and execution risk, and F&O risk. Simple language, clear diagrams, real examples, checklists.`,
};

export default function RiskLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
