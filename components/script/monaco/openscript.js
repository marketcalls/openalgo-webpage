// The 'openscript' language for Monaco: a Monarch tokenizer, the
// 'openalgo-script' theme, and hover, completion and signature help, all read
// from /script/language.json (written by scripts/gen-script-docs.mjs from the
// compiler's own manifest). Registered once per page load.
import { THEME, THEME_NAME } from "./theme"

export const LANGUAGE_ID = "openscript"

// Used only when language.json cannot be fetched, so a block is still coloured.
const FALLBACK_KEYWORDS = [
  "and", "array", "as", "bool", "break", "case", "color", "continue", "default", "else", "false", "fn", "for", "if",
  "import", "in", "is", "live", "map", "matrix", "none", "not", "number", "or", "return", "series", "step", "string",
  "strategy", "study", "switch", "to", "true", "type", "var", "while",
]

let languageData = null
let registration = null

/** language.json, fetched once and shared by every editor on the page. */
export function fetchLanguageData() {
  if (!languageData) {
    languageData = fetch("/script/language.json")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((d) => ({
        version: d?.version ?? "",
        keywords: Array.isArray(d?.keywords) && d.keywords.length ? d.keywords : FALLBACK_KEYWORDS,
        names: d?.names ?? {},
      }))
  }
  return languageData
}

function monarch(data) {
  const all = Object.keys(data.names)
  const dottedNames = all.filter((k) => k.includes("."))
  // Plain names, plus the namespaces (`bar`, `draw`, `leg`), which the lexer
  // paints as library words wherever they stand.
  const topNames = [...new Set([...all.filter((k) => !k.includes(".")), ...dottedNames.map((k) => k.split(".")[0])])]
  // `version` and `limits` open header lines but are plain names to the
  // lexer, so they are never painted.
  const plain = new Set(["version", "limits"])
  const keywords = data.keywords.filter((k) => !plain.has(k))

  const head = (whenLib) => ({
    cases: { "$0@dottedNames": whenLib, "$1@keywords": "keyword", "$1@topNames": whenLib, "@default": "identifier" },
  })
  const member = (whenLib) => ({
    cases: { "$0@dottedNames": whenLib, "$3@topNames": whenLib, "@default": "identifier" },
  })

  return {
    defaultToken: "",
    tokenPostfix: ".openscript",
    keywords,
    topNames: topNames.filter((k) => !plain.has(k)),
    dottedNames,
    tokenizer: {
      root: [
        [/\/\/.*$/, "comment"],
        [/"(?:[^"\\]|\\.)*"?/, "string"],
        [/'(?:[^'\\]|\\.)*'?/, "string"],
        [/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6})(?![0-9A-Za-z_])/, "constant.color"],
        [/0[xX][0-9a-fA-F_]+/, "number"],
        [/(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?/, "number"],
        // A qualified name, `draw.box(` or `bar.isFirst`. The namespace half is a
        // value; the member is a call when a bracket follows it.
        [/([A-Za-z_]\w*)(\.)([A-Za-z_]\w*)(?=\s*\()/, [head("support.variable"), "delimiter", member("support.function")]],
        [/([A-Za-z_]\w*)(\.)([A-Za-z_]\w*)/, [head("support.variable"), "delimiter", member("support.variable")]],
        // A library name is a call when a bracket follows it, a value otherwise.
        [/[A-Za-z_]\w*(?=\s*\()/, { cases: { "@keywords": "keyword", "@topNames": "support.function", "@default": "identifier" } }],
        [/[A-Za-z_]\w*/, { cases: { "@keywords": "keyword", "@topNames": "support.variable", "@default": "identifier" } }],
        [/[()[\]{}]/, "delimiter.bracket"],
        // The language's operator marks; anything else is left unpainted, as
        // the lexer leaves it.
        [/==|!=|<=|>=|=>|->|[+\-*/%]=|[=<>+\-*/%?:,.]/, "delimiter"],
        [/\s+/, ""],
      ],
    },
  }
}

/** The dotted or plain library name under a position, with its range. */
function nameAt(model, position, names) {
  const word = model.getWordAtPosition(position)
  if (!word) return null
  const line = model.getLineContent(position.lineNumber)
  let start = word.startColumn
  let end = word.endColumn
  let name = word.word
  const before = line.slice(0, start - 1).match(/([A-Za-z_]\w*)\.$/)
  const after = line.slice(end - 1).match(/^\.([A-Za-z_]\w*)/)
  if (before && names[`${before[1]}.${name}`]) {
    name = `${before[1]}.${name}`
    start -= before[0].length
  } else if (after && names[`${name}.${after[1]}`]) {
    // Over the namespace half of `draw.box`: explain the whole name.
    name = `${name}.${after[1]}`
    end += after[0].length
  }
  return { name, range: { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: start, endColumn: end } }
}

const sentence = (s) => (s && !/[.!?]$/.test(s) ? `${s}.` : s)

function hoverProvider(data) {
  return {
    provideHover(model, position) {
      const found = nameAt(model, position, data.names)
      if (!found) return null
      // Library names only: a card over every keyword and local name would
      // get in the way of reading.
      const info = data.names[found.name]
      if (!info) return null
      const contents = [{ value: "```openscript\n" + info.s.join("\n") + "\n```" }]
      if (info.d) contents.push({ value: sentence(info.d) })
      if (info.p) {
        contents.push({
          value: `**Planned.** Named in the language and not available in version ${data.version || "0.5.0"}. Calling it is error \`OS2020\`.`,
        })
      }
      if (info.u) {
        const href = typeof window !== "undefined" ? `${window.location.origin}${info.u}` : info.u
        contents.push({ value: `[Open the reference entry](${href})` })
      }
      return { range: found.range, contents }
    },
  }
}

function completionProvider(monaco, data) {
  const K = monaco.languages.CompletionItemKind
  const Rule = monaco.languages.CompletionItemInsertTextRule
  const entries = Object.entries(data.names)
  const namespaces = [...new Set(entries.filter(([k]) => k.includes(".")).map(([k]) => k.split(".")[0]))]

  const item = (label, info, range) => {
    const fn = info.k === "f"
    return {
      label: { label, description: info.p ? "planned" : undefined },
      kind: fn ? K.Function : /^(aqua|black|blue|brown|fuchsia|gray|green|lime|maroon|navy|olive|orange|pink|purple|red|silver|teal|white|yellow)$/.test(label) ? K.Color : K.Variable,
      detail: info.s[0],
      documentation: {
        value: [info.s.length > 1 ? "```openscript\n" + info.s.join("\n") + "\n```" : "", sentence(info.d), info.p ? "**Planned**, not available yet." : ""]
          .filter(Boolean)
          .join("\n\n"),
      },
      insertText: fn ? `${label}($0)` : label,
      insertTextRules: fn ? Rule.InsertAsSnippet : undefined,
      sortText: `${info.p ? "2" : "1"}${label.toLowerCase()}`,
      range,
    }
  }

  return {
    triggerCharacters: ["."],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position)
      const lineBefore = model.getLineContent(position.lineNumber).slice(0, word.startColumn - 1)
      if (/\/\//.test(lineBefore.replace(/"(?:[^"\\]|\\.)*"/g, ""))) return { suggestions: [] }
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }
      const ns = lineBefore.match(/([A-Za-z_]\w*)\.$/)?.[1]
      if (ns) {
        const prefix = `${ns}.`
        const members = entries.filter(([k]) => k.startsWith(prefix)).map(([k, info]) => item(k.slice(prefix.length), info, range))
        return { suggestions: members }
      }
      const suggestions = entries.filter(([k]) => !k.includes(".")).map(([k, info]) => item(k, info, range))
      for (const n of namespaces) {
        if (!data.names[n]) suggestions.push({ label: n, kind: K.Module, detail: `${n}.*`, insertText: n, sortText: `1${n}`, range })
      }
      for (const kw of data.keywords) {
        suggestions.push({ label: kw, kind: K.Keyword, insertText: kw, sortText: `3${kw}`, range })
      }
      return { suggestions }
    },
  }
}

/** Split `a: t, b?: t = 1` on the commas that are not inside brackets. */
function splitParams(inner) {
  const parts = []
  let depth = 0
  let cur = ""
  for (const ch of inner) {
    if ("<([".includes(ch)) depth++
    if (">)]".includes(ch)) depth--
    if (ch === "," && depth === 0) {
      parts.push(cur.trim())
      cur = ""
    } else cur += ch
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

function signatureProvider(data) {
  return {
    signatureHelpTriggerCharacters: ["(", ","],
    signatureHelpRetriggerCharacters: [")"],
    provideSignatureHelp(model, position) {
      const offset = model.getOffsetAt(position)
      const text = model.getValue().slice(Math.max(0, offset - 4000), offset)
      // Walk back to the bracket this call opened, counting top-level commas.
      let depth = 0
      let commas = 0
      let open = -1
      let inString = false
      for (let i = text.length - 1; i >= 0; i--) {
        const ch = text[i]
        if (ch === '"') inString = !inString
        if (inString) continue
        if (ch === ")" || ch === "]") depth++
        else if (ch === "(" || ch === "[") {
          if (depth === 0) {
            if (ch === "(") open = i
            break
          }
          depth--
        } else if (ch === "," && depth === 0) commas++
      }
      if (open < 0) return null
      const callee = text.slice(0, open).match(/([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)?)\s*$/)?.[1]
      const info = callee && data.names[callee]
      if (!info || info.k !== "f") return null
      const written = text.slice(open + 1)
      const named = written.slice(written.lastIndexOf(",") + 1).match(/^\s*([A-Za-z_]\w*)\s*=(?!=)/)?.[1]

      const signatures = info.s.map((sig) => {
        const m = sig.match(/^[\w.]+\((.*)\)\s*->/)
        const params = m ? splitParams(m[1]) : []
        return {
          label: sig,
          documentation: info.d ? { value: sentence(info.d) } : undefined,
          parameters: params.map((p) => ({ label: p })),
        }
      })
      let active = 0
      const firstParams = signatures[0].parameters.map((p) => p.label.match(/^(\w+)/)?.[1])
      if (named) {
        const i = firstParams.indexOf(named)
        active = i >= 0 ? i : commas
      } else active = commas
      return {
        value: { signatures, activeSignature: 0, activeParameter: active },
        dispose() {},
      }
    },
  }
}

/**
 * Register the language, the theme and the providers on a Monaco instance.
 * Safe to call from every editor: the work happens once.
 */
export function ensureOpenScript(monaco) {
  if (registration) return registration
  registration = fetchLanguageData().then((data) => {
    if (!monaco.languages.getLanguages().some((l) => l.id === LANGUAGE_ID)) {
      monaco.languages.register({ id: LANGUAGE_ID, extensions: [".oscript"], aliases: ["OpenScript", "openscript"] })
    }
    monaco.languages.setLanguageConfiguration(LANGUAGE_ID, {
      comments: { lineComment: "//" },
      brackets: [["(", ")"], ["[", "]"]],
      autoClosingPairs: [
        { open: "(", close: ")" },
        { open: "[", close: "]" },
        { open: '"', close: '"', notIn: ["string", "comment"] },
      ],
      surroundingPairs: [
        { open: "(", close: ")" },
        { open: "[", close: "]" },
        { open: '"', close: '"' },
      ],
      wordPattern: /[A-Za-z_]\w*|-?\d*\.\d\w*|-?\d+/,
      onEnterRules: [
        // A line that opens a block (if, else, for, while, fn, switch, case)
        // indents the next one, as the language's indentation rules require.
        {
          beforeText: /^\s*(if|else|for|while|switch|case|default)\b.*$|^\s*fn\b.*$|^.*=>\s*$/,
          action: { indentAction: monaco.languages.IndentAction.Indent },
        },
      ],
    })
    monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, monarch(data))
    monaco.editor.defineTheme(THEME_NAME, THEME)
    monaco.languages.registerHoverProvider(LANGUAGE_ID, hoverProvider(data))
    monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, completionProvider(monaco, data))
    monaco.languages.registerSignatureHelpProvider(LANGUAGE_ID, signatureProvider(data))
    return data
  })
  return registration
}
