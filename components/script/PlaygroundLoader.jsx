"use client"

import dynamic from "next/dynamic"

import { PlaygroundPlaceholder } from "./PlaygroundFrame"

// Monaco and the compiler are client chunks only: ssr:false keeps them out of
// the Worker bundle. The server renders the placeholder, the same window with
// the first script painted statically, so the page reads fine before (and
// without) any of it loading.
const Playground = dynamic(() => import("./Playground"), {
  ssr: false,
  loading: () => <PlaygroundPlaceholder />,
})

export default function PlaygroundLoader() {
  return <Playground />
}
