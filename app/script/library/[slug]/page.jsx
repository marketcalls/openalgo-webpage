// One route for every study of the OpenScript library, prerendered for each
// slug at build time. 440 static routes each carried their own server bundle
// and client manifest (about 38 KB a route), which took the Worker over
// Cloudflare's 64 MiB uncompressed limit; one route carries them once.
// lib/scriptLibraryPages.json is written by scripts/script-library/gen-library.mjs.
import { notFound } from "next/navigation"

import IndicatorPage, { indicatorMetadata } from "@/components/script/library/IndicatorPage"
import pages from "@/lib/scriptLibraryPages.json"

// dynamicParams stays at its default (true). This site configures no
// incremental cache, so every page, static ones included, renders in the
// Worker at request time; with dynamicParams = false Next answers 404 for a
// slug it cannot find in that (empty) cache, which is every slug. An unknown
// slug is still a 404, from notFound() below.

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = pages[slug]
  return data ? indicatorMetadata(data) : {}
}

export default async function Page({ params }) {
  const { slug } = await params
  const data = pages[slug]
  if (!data) notFound()
  return <IndicatorPage data={data} />
}
