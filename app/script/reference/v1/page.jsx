// The OpenScript v1 reference manual: every implemented name on one page.
//
// A static route like every docs page (a dynamic segment is a 404 in the
// Worker). The server renders the index of every name from
// lib/scriptReferenceV1.json, a few tens of kilobytes; the entries themselves
// are a static file the page fetches, /script/reference-v1.json, so their
// HTML never enters the Worker bundle or the page's RSC payload.
// Both are written by scripts/gen-script-docs.mjs.
import ReferenceManual from "@/components/script/ReferenceManual"
import index from "@/lib/scriptReferenceV1.json"
import { SCRIPT_REPO, SITE } from "@/lib/scriptDocs"

import "./reference-manual.css"

const OG_IMAGE = "/assets/images/og-image.png"
const PATH = "/script/reference/v1"
const TITLE = "OpenScript Reference Manual v1"
const DESCRIPTION =
  "Every implemented OpenScript (OpenAlgo Script) variable, constant, function, keyword, type and operator on one page, each with its syntax, arguments, return type, remarks and a working example."

export const metadata = {
  title: `${TITLE} | OpenScript`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: `${SITE}${PATH}`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@openalgoHQ",
    site: "@openalgoHQ",
  },
}

export default function ReferenceManualPage() {
  return <ReferenceManual index={index} repo={SCRIPT_REPO} />
}
