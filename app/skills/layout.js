import { withOg } from "@/lib/og"
import { metadata as section } from "./metadata"

// The page is a client component, which cannot export metadata, so this
// server layout carries it: without it the section showed the home page's
// title, description and image when shared.
export const metadata = withOg(section, "skills", "/skills")

export default function Layout({ children }) {
  return children
}
