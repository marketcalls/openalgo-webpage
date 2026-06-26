import SyllabusRail from "./SyllabusRail";
import "./options-basics-portal.css";

export const metadata = {
  title: "Options Basics - Learn with OpenAlgo",
  description:
    "A free, modern, beginner-friendly 14-chapter course on options from absolute zero - calls and puts, premium, strike and expiry, moneyness, intrinsic and time value, the option chain, the four single-leg payoffs, the Greeks, implied volatility, and the real risks. Every payoff is a real chart, in plain English.",
};

export default function OptionsBasicsLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
