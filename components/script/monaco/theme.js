// The code palette of the OpenScript editor in /trading (dark mode), converted
// from its oklch values. app/script/script-docs.css paints the static blocks
// with the same values, so a block looks the same before and after Monaco
// takes it over.
export const PALETTE = {
  background: "#0a0a0a",
  border: "#262626",
  gutter: "#a1a1a1",
  text: "#fafafa",
  comment: "#7f8793",
  string: "#6cd092",
  number: "#ebb25f",
  colour: "#fb9890",
  keyword: "#b0a4f8",
  call: "#6bc3f4",
  value: "#71d0d5",
  punctuation: "#7f8793",
}

export const THEME_NAME = "openalgo-script"

const hex = (c) => c.replace("#", "")

export const THEME = {
  base: "vs-dark",
  inherit: false,
  rules: [
    { token: "", foreground: hex(PALETTE.text), background: hex(PALETTE.background) },
    { token: "identifier", foreground: hex(PALETTE.text) },
    { token: "comment", foreground: hex(PALETTE.comment), fontStyle: "italic" },
    { token: "string", foreground: hex(PALETTE.string) },
    { token: "number", foreground: hex(PALETTE.number) },
    { token: "constant.color", foreground: hex(PALETTE.colour) },
    { token: "keyword", foreground: hex(PALETTE.keyword) },
    { token: "support.function", foreground: hex(PALETTE.call) },
    { token: "support.variable", foreground: hex(PALETTE.value) },
    { token: "delimiter", foreground: hex(PALETTE.punctuation) },
    { token: "operator", foreground: hex(PALETTE.punctuation) },
    // The other languages a page can show (JavaScript, TypeScript, Python,
    // shell, JSON), mapped onto the same roles.
    { token: "type", foreground: hex(PALETTE.value) },
    { token: "type.identifier", foreground: hex(PALETTE.value) },
    { token: "predefined", foreground: hex(PALETTE.call) },
    { token: "variable.predefined", foreground: hex(PALETTE.value) },
    { token: "variable", foreground: hex(PALETTE.value) },
    { token: "regexp", foreground: hex(PALETTE.string) },
    { token: "attribute.name", foreground: hex(PALETTE.value) },
    { token: "attribute.value", foreground: hex(PALETTE.string) },
    { token: "string.key.json", foreground: hex(PALETTE.value) },
    { token: "string.value.json", foreground: hex(PALETTE.string) },
    { token: "keyword.json", foreground: hex(PALETTE.keyword) },
    { token: "tag", foreground: hex(PALETTE.keyword) },
    { token: "metatag", foreground: hex(PALETTE.punctuation) },
    { token: "annotation", foreground: hex(PALETTE.punctuation) },
    { token: "constant", foreground: hex(PALETTE.number) },
  ],
  colors: {
    "editor.background": PALETTE.background,
    "editor.foreground": PALETTE.text,
    "editorGutter.background": PALETTE.background,
    "editorLineNumber.foreground": "#a1a1a166",
    "editorLineNumber.activeForeground": PALETTE.gutter,
    "editorCursor.foreground": PALETTE.text,
    "editor.selectionBackground": "#6bc3f438",
    "editor.inactiveSelectionBackground": "#fafafa17",
    "editor.selectionHighlightBackground": "#fafafa10",
    "editor.wordHighlightBackground": "#fafafa10",
    "editor.lineHighlightBackground": "#ffffff08",
    "editor.lineHighlightBorder": "#00000000",
    "editorIndentGuide.background1": "#ffffff0d",
    "editorIndentGuide.activeBackground1": "#ffffff1f",
    "editorWhitespace.foreground": "#ffffff1a",
    "editorBracketMatch.background": "#ffffff12",
    "editorBracketMatch.border": "#ffffff30",
    "editorWidget.background": "#111111",
    "editorWidget.foreground": PALETTE.text,
    "editorWidget.border": PALETTE.border,
    "editorHoverWidget.background": "#111111",
    "editorHoverWidget.foreground": "#d4d4d4",
    "editorHoverWidget.border": PALETTE.border,
    "editorHoverWidget.statusBarBackground": "#141414",
    "editorSuggestWidget.background": "#111111",
    "editorSuggestWidget.border": PALETTE.border,
    "editorSuggestWidget.foreground": "#d4d4d4",
    "editorSuggestWidget.highlightForeground": PALETTE.call,
    "editorSuggestWidget.focusHighlightForeground": PALETTE.call,
    "editorSuggestWidget.selectedBackground": "#ffffff14",
    "editorSuggestWidget.selectedForeground": PALETTE.text,
    "list.hoverBackground": "#ffffff0d",
    "list.activeSelectionBackground": "#ffffff14",
    "list.highlightForeground": PALETTE.call,
    "scrollbar.shadow": "#00000000",
    "scrollbarSlider.background": "#ffffff1a",
    "scrollbarSlider.hoverBackground": "#ffffff2e",
    "scrollbarSlider.activeBackground": "#ffffff40",
    "editorError.foreground": PALETTE.colour,
    "editorWarning.foreground": PALETTE.number,
    "editorInfo.foreground": PALETTE.call,
    "editorOverviewRuler.border": "#00000000",
    "editorMarkerNavigation.background": "#111111",
    "textLink.foreground": PALETTE.call,
    "textLink.activeForeground": PALETTE.value,
    "textCodeBlock.background": PALETTE.background,
    "textPreformat.foreground": PALETTE.value,
    focusBorder: "#00000000",
    "widget.shadow": "#00000080",
    "input.background": "#0a0a0a",
    "input.border": PALETTE.border,
  },
}

/**
 * The type metrics every code block shares. The static block in
 * script-docs.css uses the same numbers, which is what lets Monaco replace it
 * without anything on the page moving.
 */
export const METRICS = {
  fontSize: 13,
  lineHeight: 20,
  paddingTop: 14,
  paddingBottom: 14,
  lineNumbersMinChars: 4,
  lineDecorationsWidth: 16,
}

/** The page's IBM Plex Mono, as next/font named it. */
export function monoFamily() {
  if (typeof window === "undefined") return "monospace"
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-ibm-mono").trim()
  return v ? `${v}, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` : "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
}
