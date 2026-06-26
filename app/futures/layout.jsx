import SyllabusRail from "./SyllabusRail";
import "./futures-portal.css";

export const metadata = {
  title: "Futures Trading - Learn with OpenAlgo",
  description:
    "A free, modern, beginner-friendly 12-chapter course on futures trading - from what a futures contract is to margin and leverage, mark-to-market, going long and short, the payoff, basis and rollover, hedging, and the honest risks of leverage. Built on real Indian market examples in plain English.",
};

export default function FuturesLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
