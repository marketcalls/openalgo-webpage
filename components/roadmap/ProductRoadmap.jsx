/**
 * A product roadmap page (/charts/roadmap, /scripts/roadmap) rendered from one
 * data file per product under lib/roadmaps/. It is a server component with no
 * client script: task details open with <details>, so the page costs the reader
 * nothing beyond its HTML and costs the Worker only its data.
 *
 * The roadmap is written for contributors who work with an agent, so every task
 * carries its acceptance checks and a starter brief meant to be pasted into
 * that agent as it stands.
 */

const EVAL_ARTICLE = "https://claude.dev/blog/automating-eval-design-and-hillclimbing/"

function Label({ children }) {
  return (
    <p className="font-label text-label-md uppercase tracking-wide text-on-surface-variant">{children}</p>
  )
}

function Pill({ children, strong = false }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-label text-label-sm ${
        strong ? "bg-on-surface text-background border-on-surface" : "text-on-surface-variant"
      }`}
    >
      {children}
    </span>
  )
}

const SIZE_TEXT = { S: "Small: about a day", M: "Medium: two or three days", L: "Large: four or five days" }

function Task({ task }) {
  return (
    <details id={task.id} className="group rounded-xl border bg-background open:bg-surface-bright">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <span className="font-mono text-xs text-on-surface-variant">{task.id}</span>
        <span className="flex-1 min-w-[12rem] text-sm font-semibold text-on-surface">{task.title}</span>
        <span className="flex gap-2">
          {task.goodFirst ? <Pill strong>Good first task</Pill> : null}
          <Pill>{task.size}</Pill>
        </span>
      </summary>
      <div className="space-y-4 border-t px-4 py-4 text-sm leading-relaxed text-on-surface-variant">
        <p><span className="font-semibold text-on-surface">Why. </span>{task.why}</p>
        <p><span className="font-semibold text-on-surface">Deliverable. </span>{task.deliverable}</p>
        <div>
          <p className="font-semibold text-on-surface">Done when</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {task.acceptance.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
        {task.eval && task.eval.toLowerCase() !== "none" ? (
          <p><span className="font-semibold text-on-surface">Eval. </span>{task.eval}</p>
        ) : null}
        <p>
          <span className="font-semibold text-on-surface">Size. </span>{SIZE_TEXT[task.size] ?? task.size}
          {task.skills?.length ? <> <span className="font-semibold text-on-surface">Skills. </span>{task.skills.join(", ")}.</> : null}
          {task.dependsOn?.length ? (
            <> <span className="font-semibold text-on-surface">After. </span>
              {task.dependsOn.map((d, i) => (
                <span key={d}>{i ? ", " : ""}<a className="underline underline-offset-2" href={`#${d}`}>{d}</a></span>
              ))}.
            </>
          ) : null}
        </p>
        <div className="scheme-dark rounded-xl bg-background p-4">
          <p className="mb-2 font-label text-label-md uppercase text-on-surface-variant">Agent brief: paste this into your agent</p>
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-on-surface">{task.agentBrief}</pre>
        </div>
      </div>
    </details>
  )
}

export default function ProductRoadmap({ data, repo, discord = "/discord", related }) {
  const tasks = data.horizons.flatMap((h) => h.themes.flatMap((t) => t.tasks))
  const firsts = tasks.filter((t) => t.goodFirst)
  const issues = `${repo}/issues`

  return (
    <div className="container max-w-5xl py-16">
      <div className="space-y-16">
        {/* Header */}
        <header className="space-y-5">
          <Label>Roadmap</Label>
          <h1 className="text-display-md text-on-surface">{data.product} roadmap</h1>
          <p className="text-xl font-semibold text-on-surface">{data.tagline}</p>
          <p className="max-w-3xl text-lg leading-relaxed text-on-surface-variant">{data.vision}</p>
          <p className="text-sm text-on-surface-variant">
            {tasks.length} tasks in {data.horizons.length} horizons, each sized for one person working with an agent for one to five days.
            {related ? <> Also see the <a className="underline underline-offset-2" href={related.href}>{related.label}</a>.</> : null}
          </p>
          <nav aria-label="On this page" className="flex flex-wrap gap-2 pt-2">
            <a className="rounded-full border px-3 py-1 text-sm" href="#start">Start here</a>
            {data.horizons.map((h) => (
              <a key={h.name} className="rounded-full border px-3 py-1 text-sm" href={`#${h.name.toLowerCase()}`}>{h.name}</a>
            ))}
            <a className="rounded-full border px-3 py-1 text-sm" href="#evals">Evals</a>
            <a className="rounded-full border px-3 py-1 text-sm" href="#contribute">Contribute</a>
            <a className="rounded-full border px-3 py-1 text-sm" href="#not-doing">Not doing</a>
          </nav>
        </header>

        {/* Principles */}
        <section aria-labelledby="principles" className="space-y-5">
          <h2 id="principles" className="text-headline-md text-on-surface">How we build it</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.principles.map((p) => (
              <div key={p.title} className="rounded-xl border p-5">
                <h3 className="mb-2 text-base font-semibold text-on-surface">{p.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Start here */}
        <section id="start" aria-labelledby="start-title" className="space-y-5">
          <h2 id="start-title" className="text-headline-md text-on-surface">Start here</h2>
          <p className="max-w-3xl text-on-surface-variant">
            New to the project? These tasks need the least background. Open one, paste its agent brief into your
            agent, and before you start, open a GitHub issue titled with the task id (or comment on it if one
            exists) so nobody duplicates the work.
          </p>
          <ul className="grid gap-2 md:grid-cols-2">
            {firsts.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="flex items-baseline gap-3 rounded-xl border px-4 py-3 text-sm hover:bg-surface-bright">
                  <span className="font-mono text-xs text-on-surface-variant">{t.id}</span>
                  <span className="font-semibold text-on-surface">{t.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Horizons */}
        {data.horizons.map((h) => (
          <section key={h.name} id={h.name.toLowerCase()} aria-labelledby={`${h.name}-title`} className="space-y-6">
            <div className="space-y-2">
              <Label>{h.window}</Label>
              <h2 id={`${h.name}-title`} className="text-headline-md text-on-surface">{h.name}</h2>
              <p className="max-w-3xl text-on-surface-variant">{h.goal}</p>
            </div>
            {h.themes.map((theme) => (
              <div key={theme.id} className="space-y-4 rounded-2xl border p-5 md:p-6">
                <div className="space-y-2">
                  <h3 className="text-headline-sm text-on-surface">{theme.title}</h3>
                  <p className="text-on-surface-variant">{theme.outcome}</p>
                  <p className="text-sm text-on-surface-variant"><span className="font-semibold text-on-surface">We know it is done when </span>{theme.measure}</p>
                </div>
                <div className="space-y-2">
                  {theme.tasks.map((t) => <Task key={t.id} task={t} />)}
                </div>
              </div>
            ))}
          </section>
        ))}

        {/* Evals */}
        <section id="evals" aria-labelledby="evals-title" className="space-y-6">
          <div className="space-y-2">
            <Label>Evals and hill-climbing</Label>
            <h2 id="evals-title" className="text-headline-md text-on-surface">How we measure progress</h2>
            <p className="max-w-3xl text-on-surface-variant">{data.evals.intro}</p>
            <p className="max-w-3xl text-sm text-on-surface-variant">
              The method follows{" "}
              <a className="underline underline-offset-2" href={EVAL_ARTICLE} target="_blank" rel="noopener noreferrer">
                Automating eval design and hillclimbing
              </a>
              : evals built from real tasks, graders checked by reading their scores, and improvements kept only when a
              held-out test set improves too.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-surface-bright text-on-surface">
                <tr>
                  {["Suite", "Measures", "Cases", "Grader", "Split", "Target", "Surface agents may change", "Status"].map((c) => (
                    <th key={c} className="px-3 py-2 font-semibold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-on-surface-variant">
                {data.evals.suites.map((s) => (
                  <tr key={s.name} className="align-top">
                    <td className="px-3 py-2 font-semibold text-on-surface">{s.name}</td>
                    <td className="px-3 py-2">{s.measures}</td>
                    <td className="px-3 py-2">{s.cases}</td>
                    <td className="px-3 py-2">{s.grader}</td>
                    <td className="px-3 py-2">{s.split}</td>
                    <td className="px-3 py-2">{s.target}</td>
                    <td className="px-3 py-2">{s.surface}</td>
                    <td className="px-3 py-2">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">The loop</h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.evals.loop.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">Guards against overfitting</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.evals.guards.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Contribute */}
        <section id="contribute" aria-labelledby="contribute-title" className="space-y-6">
          <h2 id="contribute-title" className="text-headline-md text-on-surface">Contribute with an agent</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">Steps</h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.contribute.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">Rules for agents</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.contribute.agentRules.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">What a human reviewer checks</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.contribute.reviewChecklist.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">GitHub labels</h3>
              <div className="flex flex-wrap gap-2">
                {data.contribute.labels.map((l) => <Pill key={l}>{l}</Pill>)}
              </div>
            </div>
          </div>
        </section>

        {/* Not doing */}
        <section id="not-doing" aria-labelledby="not-doing-title" className="space-y-5">
          <h2 id="not-doing-title" className="text-headline-md text-on-surface">What we are not doing</h2>
          <ul className="space-y-3">
            {data.notDoing.map((n) => (
              <li key={n.item} className="rounded-xl border px-4 py-3 text-sm leading-relaxed text-on-surface-variant">
                <span className="font-semibold text-on-surface">{n.item}. </span>{n.why}
              </li>
            ))}
          </ul>
          <p className="max-w-3xl text-sm text-on-surface-variant">
            <span className="font-semibold text-on-surface">Capacity behind these targets. </span>{data.realism}
          </p>
        </section>

        {/* CTA */}
        <section className="scheme-dark space-y-4 rounded-2xl bg-background p-8 text-center">
          <h2 className="text-headline-sm text-on-surface">Pick a task</h2>
          <p className="mx-auto max-w-2xl text-on-surface-variant">
            Claim a task with a GitHub issue titled with its id, work through it with your agent, and open a pull
            request. A maintainer reviews it against the checklist above before it merges.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a className="rounded-full bg-on-surface px-5 py-2 text-sm font-semibold text-background" href={issues} target="_blank" rel="noopener noreferrer">GitHub issues</a>
            <a className="rounded-full border px-5 py-2 text-sm font-semibold text-on-surface" href={discord} target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </section>
      </div>
    </div>
  )
}
