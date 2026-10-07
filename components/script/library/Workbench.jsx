"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"

// The chart and the editor are client chunks only: ssr:false keeps the chart
// engine, Monaco and the compiler out of the Worker bundle.
const LibraryChart = dynamic(() => import("./LibraryChart"), {
  ssr: false,
  loading: () => (
    <div className="osl-chart" style={{ height: 540 }}>
      <div className="osl-chart-note">Loading the chart</div>
    </div>
  ),
})
const SourcePanel = dynamic(() => import("./SourcePanel"), {
  ssr: false,
  loading: () => <div className="osl-source-placeholder">Loading the editor</div>,
})

const TABS = [
  { id: "chart", label: "Chart" },
  { id: "source", label: "Source code" },
]

/**
 * The Chart and Source code views of one library study. The source is a
 * static file fetched once; the chart draws it, or an edited copy the reader
 * chose to run from the editor.
 */
export default function Workbench({ file, lines, capturedAt, interval }) {
  const [tab, setTab] = useState("chart")
  const [visited, setVisited] = useState({ chart: true, source: false })
  const [source, setSource] = useState(null)
  const [drawn, setDrawn] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/script/library/src/${file}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.text()
      })
      .then((text) => {
        if (cancelled) return
        setSource(text)
        setDrawn(text)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [file])

  const show = (id) => {
    setTab(id)
    setVisited((v) => ({ ...v, [id]: true }))
  }

  const run = useCallback((text) => {
    setDrawn(text)
    setTab("chart")
  }, [])

  const edited = drawn !== null && source !== null && drawn !== source

  return (
    <div className="osl-bench">
      <div className="osl-tabs" role="tablist" aria-label="View">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`osl-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`osl-panel-${t.id}`}
            className={`osl-tab${tab === t.id ? " is-active" : ""}`}
            onClick={() => show(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="osl-panel">
        <div id="osl-panel-chart" role="tabpanel" aria-labelledby="osl-tab-chart" hidden={tab !== "chart"}>
          <div className="osl-panel-bar">
            <div className="osl-panel-symbol">
              <strong>BTCUSD</strong>
              <span aria-hidden="true">&middot;</span>
              <span>{interval}</span>
              {edited ? <span className="osl-badge">Your edited script</span> : null}
            </div>
            <div className="osl-panel-meta">Fixed data to {capturedAt}, UTC</div>
          </div>
          {visited.chart ? <LibraryChart name={file} source={drawn} /> : null}
        </div>

        <div id="osl-panel-source" role="tabpanel" aria-labelledby="osl-tab-source" hidden={tab !== "source"}>
          {failed ? (
            <div className="osl-source-placeholder" role="alert">
              The source did not load. <a href={`/script/library/src/${file}`}>Open {file}</a>
            </div>
          ) : source === null ? (
            <div className="osl-source-placeholder">
              Loading {file}, {lines} lines
            </div>
          ) : visited.source ? (
            <SourcePanel file={file} source={source} onRun={run} height={Math.min(640, Math.max(280, lines * 20 + 40))} />
          ) : null}
        </div>
      </div>
      <noscript>
        <p className="osl-noscript">
          The chart and the editor need JavaScript. The source is at <a href={`/script/library/src/${file}`}>{file}</a>.
        </p>
      </noscript>
    </div>
  )
}
