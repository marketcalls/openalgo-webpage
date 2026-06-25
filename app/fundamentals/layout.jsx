import "../python/python-portal.css";

import SyllabusRail from "./SyllabusRail";

export const metadata = {
  title: "Python for Traders - A Free Beginner's Course in Python for Finance",
  description:
    "A hands-on, 40-chapter course that takes an absolute beginner from zero to handling real market data in Python - variables, lists, functions, NumPy, pandas and charts, with live US data from yfinance and Indian data from OpenAlgo. No prior coding needed.",
};

export default function FundamentalsLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
