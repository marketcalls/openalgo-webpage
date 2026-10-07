"use client"

import Editor from "@monaco-editor/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { baseOptions, loadMonaco } from "../monaco/loader"
import { LANGUAGE_ID } from "../monaco/openscript"
import { THEME_NAME } from "../monaco/theme"
import StaticCode from "../StaticCode"

/**
 * A library study's source in the site's OpenScript editor. It is editable:
 * the real compiler checks every change, as in the playground, and an edited
 * script that compiles can be drawn on the chart in place of the original.
 * Reset puts the published source back.
 *
 * Monaco and the compiler are client chunks only (this module is loaded with
 * next/dynamic and ssr:false).
 */
function summary(list) {
  const errors = list.filter((d) => d.severity !== "warning").length
  const warnings = list.length - errors
  if (!list.length) return "No problems"
  const parts = []
  if (errors) parts.push(`${errors} ${errors === 1 ? "error" : "errors"}`)
  if (warnings) parts.push(`${warnings} ${warnings === 1 ? "warning" : "warnings"}`)
  return parts.join(", ")
}

export default function SourcePanel({ file, source, onRun, onDraftChange, height = 560 }) {
  const [monaco, setMonaco] = useState(null)
  const [failed, setFailed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [check, setCheck] = useState({ state: "loading", list: [] })
  const [lines, setLines] = useState(() => source.replace(/\n+$/, "").split("\n").length)
  const [edited, setEdited] = useState(false)
  const editorRef = useRef(null)
  const diagnoseRef = useRef(null)
  const timerRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    loadMonaco()
      .then((m) => !cancelled && setMonaco(m))
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
      clearTimeout(timerRef.current)
    }
  }, [])

  const runCheck = useCallback(() => {
    const model = editorRef.current?.getModel()
    if (!model || !monaco) return
    const text = model.getValue()
    setLines(model.getLineCount())
    setEdited(text !== source)
    onDraftChange?.(text)
    const diagnose = diagnoseRef.current
    if (!diagnose) return
    let list = []
    try {
      list = diagnose(text)
    } catch {
      setCheck({ state: "unavailable", list: [] })
      return
    }
    monaco.editor.setModelMarkers(
      model,
      "openscript",
      list.map((d) => {
        const start = model.getPositionAt(d.span.offset)
        const end = model.getPositionAt(d.span.offset + Math.max(1, d.span.length))
        return {
          severity: d.severity === "warning" ? monaco.MarkerSeverity.Warning : monaco.MarkerSeverity.Error,
          code: d.code,
          source: "OpenScript",
          message: d.fix ? `${d.message}\n${d.fix}` : d.message,
          startLineNumber: start.lineNumber,
          startColumn: start.column,
          endLineNumber: end.lineNumber,
          endColumn: end.column,
        }
      }),
    )
    setCheck({ state: "ready", list })
  }, [monaco, source, onDraftChange])

  useEffect(() => {
    if (!monaco) return undefined
    let cancelled = false
    import("openalgo-script/editor")
      .then((mod) => {
        if (cancelled) return
        diagnoseRef.current = mod.diagnose
        runCheck()
      })
      .catch(() => !cancelled && setCheck({ state: "unavailable", list: [] }))
    return () => {
      cancelled = true
    }
  }, [monaco, runCheck])

  const scheduleCheck = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(runCheck, 150)
  }, [runCheck])

  const text = () => editorRef.current?.getModel()?.getValue() ?? source

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text())
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const reset = () => {
    const editor = editorRef.current
    const model = editor?.getModel()
    if (!model) return
    editor.pushUndoStop()
    model.pushEditOperations([], [{ range: model.getFullModelRange(), text: source }], () => null)
    editor.pushUndoStop()
    onRun?.(source)
  }

  const errors = check.list.filter((d) => d.severity !== "warning").length

  const reveal = (d) => {
    const editor = editorRef.current
    const model = editor?.getModel()
    if (!model) return
    const pos = model.getPositionAt(d.span.offset)
    editor.setPosition(pos)
    editor.revealLineInCenter(pos.lineNumber)
    editor.focus()
  }

  const options = useMemo(
    () => ({
      ...baseOptions(),
      ariaLabel: `OpenScript source, ${file}`,
      renderLineHighlight: "line",
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        useShadows: false,
        alwaysConsumeMouseWheel: false,
      },
      quickSuggestions: { other: true, comments: false, strings: false },
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: "off",
      suggest: { showWords: false, preview: true },
      parameterHints: { enabled: true },
      hover: { delay: 250 },
    }),
    [file],
  )

  return (
    <div className="osl-source">
      <div className="osl-source-bar">
        <div className="osl-source-file">
          <span className="osl-source-name">{file}</span>
          <span className="osl-source-dim">{lines} lines</span>
          {edited ? <span className="osl-source-dim">edited</span> : null}
        </div>
        <div className="osl-source-actions">
          {edited ? (
            <>
              <button type="button" className="osl-action" onClick={reset}>
                Reset
              </button>
              <button type="button" className="osl-action is-primary" disabled={errors > 0 || check.state !== "ready"} onClick={() => onRun?.(text())}>
                Run on chart
              </button>
            </>
          ) : null}
          <button type="button" className="osl-action" onClick={copy} aria-live="polite">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div className="osl-source-body" style={{ height }}>
        {monaco ? (
          <Editor
            height="100%"
            path={file}
            defaultLanguage={LANGUAGE_ID}
            defaultValue={source}
            theme={THEME_NAME}
            loading={<StaticCode code={source} />}
            options={options}
            onMount={(editor) => {
              editorRef.current = editor
              runCheck()
            }}
            onChange={scheduleCheck}
          />
        ) : (
          <StaticCode code={source} />
        )}
      </div>
      <div className="osl-source-status" aria-live="polite">
        {check.state === "ready" ? (
          <span className={check.list.length ? "has-problems" : "is-clean"}>{summary(check.list)}</span>
        ) : check.state === "unavailable" ? (
          <span>The compiler did not load</span>
        ) : (
          <span>{failed ? "The editor did not load" : monaco ? "Loading the compiler" : "Loading the editor"}</span>
        )}
        <span className="osl-source-dim">OpenScript, compiled in your browser</span>
      </div>
      {check.state === "ready" && check.list.length ? (
        <ul className="osl-problems" aria-label="Problems">
          {check.list.slice(0, 20).map((d, i) => (
            <li key={`${d.code}-${d.span.offset}-${i}`}>
              <button type="button" onClick={() => reveal(d)}>
                <span className={`osl-problem-code${d.severity === "warning" ? " is-warning" : ""}`}>{d.code}</span>
                <span className="osl-problem-msg">{d.message}</span>
                <span className="osl-problem-line">Line {d.span.line}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
