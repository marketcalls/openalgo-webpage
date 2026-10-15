"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"

import { useI18n } from "@/components/i18n/LanguageProvider"

export function LibText({ k, vars }) {
  const { t } = useI18n()
  let text = t(k)
  if (vars) {
    for (const [key, val] of Object.entries(vars)) {
      text = text.replace(`{${key}}`, String(val ?? ""))
    }
  }
  return text
}

function ChartLoading() {
  const { t } = useI18n()
  return (
    <div className="osl-chart" style={{ height: 540 }}>
      <div className="osl-chart-note">{t("slib.bench.loadingChart")}</div>
    </div>
  )
}

function EditorLoading() {
  const { t } = useI18n()
  return <div className="osl-source-placeholder">{t("slib.bench.loadingEditor")}</div>
}

// The chart and the editor are client chunks only: ssr:false keeps the chart
// engine, Monaco and the compiler out of the Worker bundle.
const LibraryChart = dynamic(() => import("./LibraryChart"), {
  ssr: false,
  loading: ChartLoading,
})
const SourcePanel = dynamic(() => import("./SourcePanel"), {
  ssr: false,
  loading: EditorLoading,
})

const TABS = [
  { id: "chart", key: "slib.bench.chart" },
  { id: "source", key: "slib.bench.sourceCode" },
]

/**
 * The Chart and Source code views of one library study. The source is a
 * static file fetched once; the chart draws it, or an edited copy the reader
 * chose to run from the editor.
 */
export default function Workbench({ file, lines, capturedAt, interval, viewEndBack = null, aheadBars = 0, chartSettings = null, chartSettingsText = null, chartNote = null }) {
  const { t } = useI18n()
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
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`osl-tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`osl-panel-${item.id}`}
            className={`osl-tab${tab === item.id ? " is-active" : ""}`}
            onClick={() => show(item.id)}
          >
            {t(item.key)}
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
              {edited ? <span className="osl-badge">{t("slib.bench.editedScript")}</span> : null}
              {!edited && chartSettingsText ? (
                <span className="osl-badge" title="Its defaults suit other charts; the source keeps them.">
                  {t("slib.bench.shownWith").replace("{s}", String(chartSettingsText))}
                </span>
              ) : null}
            </div>
            <div className="osl-panel-meta">{t("slib.bench.fixedData").replace("{t}", String(capturedAt ?? ""))}</div>
          </div>
          {chartNote ? <p className="osl-panel-note">{chartNote}</p> : null}
          {visited.chart ? <LibraryChart name={file} source={drawn} edited={edited} viewEndBack={viewEndBack} aheadBars={aheadBars} chartSettings={chartSettings} /> : null}
        </div>

        <div id="osl-panel-source" role="tabpanel" aria-labelledby="osl-tab-source" hidden={tab !== "source"}>
          {failed ? (
            <div className="osl-source-placeholder" role="alert">
              {t("slib.bench.sourceFailed")}{" "}
              <a href={`/script/library/src/${file}`}>{t("slib.bench.openFile").replace("{file}", String(file))}</a>
            </div>
          ) : source === null ? (
            <div className="osl-source-placeholder">
              {t("slib.bench.loadingFile")
                .replace("{file}", String(file))
                .replace("{lines}", String(lines))}
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

