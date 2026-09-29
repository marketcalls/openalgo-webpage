import { withOg } from "@/lib/og"

// The /charts page is a client component, which cannot export metadata, so
// this server layout carries it (and /charts/roadmap sets its own).
const description =
  "OpenAlgo Charts is a from-scratch HTML5 canvas charting library with no runtime dependencies: candles, 105 indicators, 87 drawing tools, order flow and a full trading terminal."

export const metadata = withOg(
  {
    title: "OpenAlgo Charts | Open source charting library for trading apps | OpenAlgo",
    description,
    openGraph: { title: "OpenAlgo Charts", description },
    twitter: { title: "OpenAlgo Charts", description },
  },
  "charts",
  "/charts",
)

export default function Layout({ children }) {
  return children
}
