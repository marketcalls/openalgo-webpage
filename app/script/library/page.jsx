// The OpenScript library: every published study, searchable by name and
// category. The index (lib/scriptLibraryIndex.json) and each study's route are
// written by scripts/script-library/gen-library.mjs.
import Link from "next/link"

import LibraryBrowser from "@/components/script/library/LibraryBrowser"
import index from "@/lib/scriptLibraryIndex.json"
import { SITE } from "@/lib/scriptDocs"

const OG_IMAGE = "/assets/og/script.png"
const TITLE = "OpenScript indicator library"
const DESCRIPTION = `${index.entries.length} technical indicators written in OpenScript, each with its full source code and a chart drawn on real BTCUSD data. Copy any of them into OpenAlgo and run it in /trading.`

export const metadata = {
  title: { absolute: `${TITLE} | OpenAlgo` },
  description: DESCRIPTION,
  alternates: { canonical: "/script/library" },
  openGraph: {
    type: "website",
    url: `${SITE}/script/library`,
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

export default function ScriptLibraryPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/script/library`,
    numberOfItems: index.entries.length,
  }
  return (
    <div className="osl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="px-4 pt-14 pb-24 md:pt-20">
        <div className="osl-wrap">
          <div className="osl-hero">
            <p className="font-label text-label-md uppercase text-on-surface-variant">
              <Link href="/script" prefetch={false} className="hover:text-on-surface">
                OpenScript
              </Link>{" "}
              library
            </p>
            <h1 className="osl-hero-title mt-4">Every indicator, written in OpenScript</h1>
            <p className="osl-hero-lede">
              {index.entries.length} studies, each with its full source and a chart drawn on real BTCUSD hourly data from {index.dataFrom} to{" "}
              {index.dataTo}. Read the code, change it in the editor, and copy it into OpenAlgo.
            </p>
          </div>
          <LibraryBrowser entries={index.entries} categories={index.categories} />
        </div>
      </section>
    </div>
  )
}
