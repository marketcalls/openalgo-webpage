import SyllabusRail from "./SyllabusRail";
import "./python-portal.css";

export const metadata = {
  title: "Algo Trading with Python - Learn with OpenAlgo",
  description:
    "A hands-on, 30-chapter series for traders new to Python. Learn NumPy, Pandas, indicators, backtesting, optimisation and machine learning - built entirely on the OpenAlgo Python SDK.",
};

export default function PythonLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
