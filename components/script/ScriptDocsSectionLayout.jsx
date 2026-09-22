// The frame around every docs page, used by each generated app/script/<section>/layout.jsx.
import DocsShell from "@/components/script/DocsShell"
import { SCRIPT_REPO, SCRIPT_VERSION, clientNav } from "@/lib/scriptDocs"

// The docs frame lives in a layout so the sidebar keeps its folds and scroll
// position as the reader moves between pages. Only the nav's titles and slugs
// reach the client, never the page HTML.
export default function ScriptDocsSectionLayout({ children }) {
  return (
    <DocsShell nav={clientNav()} version={SCRIPT_VERSION} repo={SCRIPT_REPO}>
      {children}
    </DocsShell>
  )
}
