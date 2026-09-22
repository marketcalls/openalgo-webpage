import { EXAMPLES } from "./examples"
import StaticCode from "./StaticCode"

/**
 * The playground's window: file tabs, the editor area, and the compiler's
 * status line. The loading state and the running editor both render inside
 * it, so swapping one for the other moves nothing.
 */
export function PlaygroundFrame({ active = 0, onSelect, actions = null, status, problems = null, children }) {
  return (
    <div className="osd-play">
      <div className="osd-play-tabs" role="tablist" aria-label="Example scripts">
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`osd-play-tab${i === active ? " is-active" : ""}`}
            onClick={onSelect ? () => onSelect(i) : undefined}
            disabled={!onSelect}
          >
            {ex.file}
          </button>
        ))}
        <div className="osd-play-actions">{actions}</div>
      </div>
      <div className="osd-play-body">{children}</div>
      <div className="osd-play-status" aria-live="polite">
        {status}
      </div>
      {problems}
    </div>
  )
}

/** What the server renders and what shows while Monaco loads. */
export function PlaygroundPlaceholder() {
  const ex = EXAMPLES[0]
  const lines = ex.code.replace(/\n+$/, "").split("\n").length
  return (
    <PlaygroundFrame
      status={
        <>
          <span className="osd-play-kind">{ex.kind}</span>
          <span className="osd-play-dim">{lines} lines</span>
          <span className="osd-play-verdict">Loading the editor</span>
        </>
      }
    >
      <StaticCode code={ex.code} />
    </PlaygroundFrame>
  )
}
