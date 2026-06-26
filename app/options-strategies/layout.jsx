import SyllabusRail from "./SyllabusRail";
import "./options-strategies-portal.css";

export const metadata = {
  title: "Options Strategies - Learn with OpenAlgo",
  description:
    "A free, modern, beginner-friendly 14-chapter course on options strategies - reading payoff diagrams, directional spreads, straddles and strangles, the iron condor, iron fly and butterfly, ratio and back spreads, synthetics, the covered call, the jade lizard, and how to choose and manage a strategy. Every diagram is built on real market data.",
};

export default function OptionsStrategiesLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
