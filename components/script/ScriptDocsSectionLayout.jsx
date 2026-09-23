// The frame around every docs page, used by each generated app/script/<section>/layout.jsx.
import SectionFrame from "@/components/script/SectionFrame"
import { SCRIPT_REPO, SCRIPT_VERSION, clientNav } from "@/lib/scriptDocs"

// The docs frame lives in a layout so the sidebar keeps its folds and scroll
// position as the reader moves between pages. Only the nav's titles and slugs
// reach the client, never the page HTML. SectionFrame leaves it out for a page
// that draws its own frame, the reference manual at /script/reference/v1.
export default function ScriptDocsSectionLayout({ children }) {
  return (
    <SectionFrame nav={clientNav()} version={SCRIPT_VERSION} repo={SCRIPT_REPO}>
      {children}
    </SectionFrame>
  )
}
