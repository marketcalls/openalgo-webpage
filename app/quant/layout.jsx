import "../python/python-portal.css";

import SyllabusRail from "./SyllabusRail";

export const metadata = {
  title: "Quantitative Trading - A Professional Course with OpenAlgo",
  description:
    "A hands-on, 36-chapter course taking traders into quantitative trading: Indian market structure, microstructure, the mathematics of markets, derivatives, portfolio risk and finding a real edge - built on the OpenAlgo SDK.",
};

export default function QuantLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
