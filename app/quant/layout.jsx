import "../python/python-portal.css";

import { CHAPTERS } from "@/lib/quantCurriculum";

import SyllabusRail from "./SyllabusRail";

export const metadata = {
  title: "Quantitative Trading - A Professional Course with OpenAlgo",
  description:
    `A hands-on, ${CHAPTERS.length}-chapter course taking traders into quantitative trading: Indian market structure and microstructure, HFT and execution technology, the mathematics of markets, time series, derivatives, alpha research, backtesting and machine learning, and production - built on the OpenAlgo SDK.`,
};

export default function QuantLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
