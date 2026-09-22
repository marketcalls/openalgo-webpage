"use client"

import Editor from "@monaco-editor/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { EXAMPLES } from "./examples"
import { baseOptions, loadMonaco } from "./monaco/loader"
import { LANGUAGE_ID } from "./monaco/openscript"
import { THEME_NAME } from "./monaco/theme"
import { PlaygroundFrame } from "./PlaygroundFrame"
import StaticCode from "./StaticCode"

/**
 * An editable OpenScript editor. Hover, completion and signature help come
 * from the language data the docs share; the problems come from the real
 * compiler (diagnose() from openalgo-script/editor), run on every change and
 * timed, so the status line reports what the compiler actually took.
 *
 * Loaded with next/dynamic and ssr:false: Monaco and the compiler are client
 * chunks only.
 */
const kindOf = (code) => (/^\s*strategy\s*\(/m.test(code) ? "Strategy" : /^\s*study\s*\(/m.test(code) ? "Study" : "Script")

function summary(list) {
  const errors = list.filter((d) => d.severity !== "warning").length
  const warnings = list.length - errors
  if (!list.length) return "No problems"
  const parts = []
  if (errors) parts.push(`${errors} ${errors === 1 ? "error" : "errors"}`)
  if (warnings) parts.push(`${warnings} ${warnings === 1 ? "warning" : "warnings"}`)
  return parts.join(", ")
}

const formatMs = (ms) => (ms < 10 ? ms.toFixed(1) : Math.round(ms).toString())

export default function Playground() {
  const [active, setActive] = useState(0)
  const [monaco, setMonaco] = useState(null)
  const [monacoFailed, setMonacoFailed] = useState(false)
  const [check, setCheck] = useState({ state: "loading", list: [], ms: 0 })
  const [meta, setMeta] = useState(() => ({ kind: EXAMPLES[0].kind, lines: EXAMPLES[0].code.split("\n").length }))
  const [copied, setCopied] = useState(false)
  const editorRef = useRef(null)
  const diagnoseRef = useRef(null)
  const timerRef = useRef(0)
  const ex = EXAMPLES[active]

  useEffect(() => {
    let cancelled = false
    loadMonaco()
      .then((m) => !cancelled && setMonaco(m))
      .catch(() => !cancelled && setMonacoFailed(true))
    return () => {
      cancelled = true
    }
  }, [])

  const runCheck = useCallback(() => {
    const editor = editorRef.current
    const model = editor?.getModel()
    if (!model || !monaco) return
    const source = model.getValue()
    setMeta({ kind: kindOf(source), lines: model.getLineCount() })
    const diagnose = diagnoseRef.current
    if (!diagnose) return
    const t0 = performance.now()
    let list = []
    try {
      list = diagnose(source)
    } catch {
      setCheck({ state: "unavailable", list: [], ms: 0 })
      return
    }
    const ms = performance.now() - t0
    const markers = list.map((d) => {
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
    })
    monaco.editor.setModelMarkers(model, "openscript", markers)
    setCheck({ state: "ready", list, ms })
  }, [monaco])

  // The compiler loads once the editor is up. The first compile warms the
  // engine and is not reported; the figures shown are per keystroke.
  useEffect(() => {
    if (!monaco) return undefined
    let cancelled = false
    import("openalgo-script/editor")
      .then((mod) => {
        if (cancelled) return
        try {
          mod.diagnose(EXAMPLES[0].code)
        } catch {
          // a warm-up failure shows up on the real run below
        }
        diagnoseRef.current = mod.diagnose
        runCheck()
      })
      .catch(() => !cancelled && setCheck({ state: "unavailable", list: [], ms: 0 }))
    return () => {
      cancelled = true
    }
  }, [monaco, runCheck])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const scheduleCheck = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(runCheck, 120)
  }, [runCheck])

  const select = (i) => {
    if (i === active) return
    setActive(i)
    setCopied(false)
  }

  const reveal = (d) => {
    const editor = editorRef.current
    const model = editor?.getModel()
    if (!model) return
    const pos = model.getPositionAt(d.span.offset)
    editor.setPosition(pos)
    editor.revealLineInCenter(pos.lineNumber)
    editor.focus()
  }

  const reset = () => {
    const editor = editorRef.current
    const model = editor?.getModel()
    if (!model) return
    editor.pushUndoStop()
    model.pushEditOperations([], [{ range: model.getFullModelRange(), text: ex.code }], () => null)
    editor.pushUndoStop()
  }

  const copy = async () => {
    const text = editorRef.current?.getModel()?.getValue() ?? ex.code
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  // One object per tab, so a re-render (every keystroke updates the status
  // line) does not hand Monaco a new set of options.
  const options = useMemo(
    () => ({
      ...baseOptions(),
      ariaLabel: `OpenScript playground, ${ex.file}`,
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
    [ex.file],
  )

  const verdict =
    check.state === "ready" ? (
      <span className={`osd-play-verdict${check.list.length ? " has-problems" : " is-clean"}`}>{summary(check.list)}</span>
    ) : check.state === "unavailable" ? (
      <span className="osd-play-verdict">The compiler did not load</span>
    ) : (
      <span className="osd-play-verdict">{monaco ? "Loading the compiler" : monacoFailed ? "The editor did not load" : "Loading the editor"}</span>
    )

  const status = (
    <>
      <span className="osd-play-kind">{meta.kind}</span>
      <span className="osd-play-dim">{meta.lines} lines</span>
      {verdict}
      {check.state === "ready" ? <span className="osd-play-time">Compiled in {formatMs(check.ms)} ms</span> : null}
    </>
  )

  const problems =
    check.state === "ready" && check.list.length ? (
      <ul className="osd-play-problems" aria-label="Problems">
        {check.list.map((d, i) => (
          <li key={`${d.code}-${d.span.offset}-${i}`}>
            <button type="button" onClick={() => reveal(d)}>
              <span className={`osd-play-code${d.severity === "warning" ? " is-warning" : ""}`}>{d.code}</span>
              <span className="osd-play-msg">
                {d.message}
                {d.fix ? <span className="osd-play-fix"> {d.fix}</span> : null}
              </span>
              <span className="osd-play-line">Line {d.span.line}</span>
            </button>
          </li>
        ))}
      </ul>
    ) : null

  const actions = monaco ? (
    <>
      <button type="button" className="osd-play-action" onClick={reset}>
        Reset
      </button>
      <button type="button" className="osd-play-action" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </>
  ) : null

  return (
    <PlaygroundFrame active={active} onSelect={monaco ? select : undefined} actions={actions} status={status} problems={problems}>
      {monaco ? (
        <div className="osd-play-editor">
          <Editor
            height="100%"
            path={ex.file}
            defaultLanguage={LANGUAGE_ID}
            defaultValue={ex.code}
            theme={THEME_NAME}
            loading={<StaticCode code={ex.code} />}
            options={options}
            onMount={(editor) => {
              editorRef.current = editor
              // A tab switch swaps the model under the same editor.
              editor.onDidChangeModel(() => runCheck())
              runCheck()
            }}
            onChange={scheduleCheck}
          />
        </div>
      ) : (
        <StaticCode code={ex.code} />
      )}
    </PlaygroundFrame>
  )
}
