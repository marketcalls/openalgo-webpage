import "../python/python-portal.css";

import { CHAPTERS } from "@/lib/statsArbCurriculum";

import SyllabusRail from "./SyllabusRail";

export const metadata = {
  title: "Statistical Arbitrage - A Professional Course with OpenAlgo",
  description:
    `An expert, brutally honest ${CHAPTERS.length}-chapter course on statistical arbitrage with NSE equities: stationarity and cointegration, pairs and baskets, dynamic hedges and market-neutral books, honest backtesting and the path to real trading - every result computed on real OpenAlgo data, gross and net, in-sample and out-of-sample.`,
};

export default function StatsArbLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
