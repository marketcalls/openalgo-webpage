// Monaco, loaded from cdn.jsdelivr.net by @monaco-editor/loader and pinned to
// one version, with the OpenScript language registered before anything uses it.
// Only ever imported from components that load client-side, so none of this
// reaches the Worker bundle.
import { loader } from "@monaco-editor/react"

import { ensureOpenScript } from "./openscript"
import { METRICS, THEME_NAME, monoFamily } from "./theme"

export const MONACO_VERSION = "0.52.2"

let ready = null

/**
 * The docs show JavaScript, TypeScript and JSON read only. Colour is all they
 * need, so the language services behind them (and the multi-megabyte workers
 * those start) are switched off before any model exists.
 */
function quietBundledLanguages(monaco) {
  const off = {
    completionItems: false,
    hovers: false,
    documentSymbols: false,
    definitions: false,
    references: false,
    documentHighlights: false,
    rename: false,
    diagnostics: false,
    documentRangeFormattingEdits: false,
    signatureHelp: false,
    onTypeFormattingEdits: false,
    codeActions: false,
    inlayHints: false,
  }
  try {
    for (const defaults of [monaco.languages.typescript?.javascriptDefaults, monaco.languages.typescript?.typescriptDefaults]) {
      defaults?.setDiagnosticsOptions?.({ noSemanticValidation: true, noSyntaxValidation: true, noSuggestionDiagnostics: true })
      defaults?.setModeConfiguration?.(off)
    }
    const json = monaco.languages.json?.jsonDefaults
    json?.setDiagnosticsOptions?.({ validate: false })
    json?.setModeConfiguration?.({
      documentFormattingEdits: false,
      documentRangeFormattingEdits: false,
      completionItems: false,
      hovers: false,
      documentSymbols: false,
      tokens: true,
      colors: false,
      foldingRanges: false,
      diagnostics: false,
      selectionRanges: false,
    })
  } catch {
    // an older or trimmed Monaco build: its defaults stay as they are
  }
}

/** Monaco with the language, theme and providers registered. */
export function loadMonaco() {
  if (!ready) {
    loader.config({ paths: { vs: `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs` } })
    ready = loader
      .init()
      .then(async (monaco) => {
        quietBundledLanguages(monaco)
        await ensureOpenScript(monaco)
        // Measure with the page's own mono font, not its fallback.
        try {
          await document.fonts?.ready
        } catch {
          // font loading API unavailable: Monaco measures what it has
        }
        monaco.editor.remeasureFonts()
        return monaco
      })
      .catch((err) => {
        ready = null
        throw err
      })
  }
  return ready
}

/** The options every OpenScript editor on the site shares. */
export function baseOptions() {
  return {
    theme: THEME_NAME,
    fontFamily: monoFamily(),
    fontSize: METRICS.fontSize,
    lineHeight: METRICS.lineHeight,
    fontLigatures: false,
    padding: { top: METRICS.paddingTop, bottom: METRICS.paddingBottom },
    lineNumbers: "on",
    lineNumbersMinChars: METRICS.lineNumbersMinChars,
    lineDecorationsWidth: METRICS.lineDecorationsWidth,
    glyphMargin: false,
    folding: false,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    renderLineHighlightOnlyWhenFocus: true,
    bracketPairColorization: { enabled: false },
    guides: { indentation: false, bracketPairs: false },
    stickyScroll: { enabled: false },
    tabSize: 4,
    insertSpaces: true,
    detectIndentation: false,
    wordWrap: "off",
    links: false,
    unicodeHighlight: { ambiguousCharacters: false, invisibleCharacters: false },
    fixedOverflowWidgets: true,
    automaticLayout: true,
    scrollbar: {
      vertical: "hidden",
      horizontal: "auto",
      horizontalScrollbarSize: 8,
      useShadows: false,
      alwaysConsumeMouseWheel: false,
    },
  }
}
