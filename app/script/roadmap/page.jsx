import ProductRoadmap from "@/components/roadmap/ProductRoadmap"
import { withOg } from "@/lib/og"
import data from "@/lib/roadmaps/scripts.json"

export const metadata = withOg({
  title: "OpenScript Roadmap | OpenAlgo",
  description:
    "The long-term roadmap for OpenScript, the open trading language: the road to 1.0, Go and Java engines, contributor tasks sized for one person with an agent, and the eval programme behind them.",
  openGraph: {
    title: "OpenScript Roadmap",
    description: "Long-term plan, contributor tasks with agent briefs, and the evals that measure progress.",
  },
  twitter: {
    title: "OpenScript Roadmap",
    description: "Long-term plan, contributor tasks with agent briefs, and the evals that measure progress.",
  },
}, "script-roadmap", "/script/roadmap")

export default function ScriptsRoadmapPage() {
  return (
    <ProductRoadmap
      data={data}
      repo="https://github.com/marketcalls/openscript"
      related={{ href: "/charts/roadmap", label: "OpenAlgo Charts roadmap" }}
    />
  )
}
