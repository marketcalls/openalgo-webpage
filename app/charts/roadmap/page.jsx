import ProductRoadmap from "@/components/roadmap/ProductRoadmap"
import { withOg } from "@/lib/og"
import data from "@/lib/roadmaps/charts.json"

export const metadata = withOg({
  title: "OpenAlgo Charts Roadmap | OpenAlgo",
  description:
    "The long-term roadmap for OpenAlgo Charts after 2.6.0: themes, measurable outcomes, contributor tasks sized for one person with an agent, and the eval programme behind them.",
  openGraph: {
    title: "OpenAlgo Charts Roadmap",
    description: "Long-term plan, contributor tasks with agent briefs, and the evals that measure progress.",
  },
  twitter: {
    title: "OpenAlgo Charts Roadmap",
    description: "Long-term plan, contributor tasks with agent briefs, and the evals that measure progress.",
  },
}, "charts-roadmap", "/charts/roadmap")

export default function ChartsRoadmapPage() {
  return (
    <ProductRoadmap
      data={data}
      repo="https://github.com/marketcalls/openalgo-charts"
      related={{ href: "/script/roadmap", label: "OpenScript roadmap" }}
    />
  )
}
