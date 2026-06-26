import SyllabusRail from "./SyllabusRail";
import "./amibroker-portal.css";

export const metadata = {
  title: "AmiBroker AFL - Learn with OpenAlgo",
  description:
    "A hands-on, 36-chapter course in AmiBroker Formula Language (AFL). Learn to build indicators, scanners, trading systems, backtests and live order automation - explained in plain English, for beginners to intermediate.",
};

export default function AmiBrokerLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
