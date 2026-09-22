// A small painter for the playground's first paint, before Monaco has loaded.
// It only has to be right for the example scripts, so it carries the names
// those scripts use rather than the whole library (the docs pages are painted
// by the real lexer at build time instead). The classes are the docs' token
// classes, so the colours are the ones Monaco then takes over with.

const KEYWORDS = new Set([
  "and", "array", "as", "bool", "break", "case", "color", "continue", "default", "else", "false", "fn", "for", "if",
  "import", "in", "is", "live", "map", "matrix", "none", "not", "number", "or", "return", "series", "step", "string",
  "strategy", "study", "switch", "to", "true", "type", "var", "while",
])

// Every library name the example scripts use, as the real lexer paints them.
const LIBRARY = new Set([
  "aqua", "atr", "avgPrice", "bar", "barColor", "buy", "chart", "close", "crossDown", "crossUp", "ema", "exit", "fade",
  "fill", "floor", "hl2", "input", "isFirst", "isNone", "lime", "lotSize", "max", "min", "orElse", "orange", "plot",
  "pos", "red", "signal", "silver", "size",
])

const TOKEN = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"?)|(#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6})(?![0-9A-Za-z_]))|((?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)|([A-Za-z_]\w*)|([^\sA-Za-z_\d"#/]+|\/)|(\s+)|([\s\S])/g

export function paint(code) {
  const out = []
  let m
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(code))) {
    const [text, comment, str, colour, num, ident, punct] = m
    let cls = ""
    if (comment) cls = "t-c"
    else if (str) cls = "t-s"
    else if (colour) cls = "t-x"
    else if (num) cls = "t-n"
    else if (ident) {
      if (KEYWORDS.has(ident)) cls = "t-k"
      else if (LIBRARY.has(ident)) cls = /^\s*\(/.test(code.slice(TOKEN.lastIndex)) ? "t-f" : "t-b"
    } else if (punct) cls = "t-p"
    out.push([cls, text])
  }
  return out
}

/**
 * The code as a static block: the same font, size, line height, padding and
 * gutter as the Monaco editor that replaces it.
 */
export default function StaticCode({ code, className = "" }) {
  const lines = code.replace(/\n+$/, "").split("\n").length
  return (
    <div className={`osd-static ${className}`}>
      <div className="osd-gutter is-static" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => i + 1).join("\n")}
      </div>
      <pre className="osd-pre">
        <code>
          {paint(code.replace(/\n+$/, "")).map(([cls, text], i) =>
            cls ? (
              <span key={i} className={cls}>
                {text}
              </span>
            ) : (
              text
            ),
          )}
        </code>
      </pre>
    </div>
  )
}
