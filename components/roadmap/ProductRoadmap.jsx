"use client"

import { useI18n } from "@/components/i18n/LanguageProvider"

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

const SIZE_KEY = { S: "proad.sizeS", M: "proad.sizeM", L: "proad.sizeL" }

function Task({ task, t }) {
  return (
    <details id={task.id} className="group rounded-xl border bg-background open:bg-surface-bright">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <span className="font-mono text-xs text-on-surface-variant">{task.id}</span>
        <span className="flex-1 min-w-[12rem] text-sm font-semibold text-on-surface">{task.title}</span>
        <span className="flex gap-2">
          {task.goodFirst ? <Pill strong>{t('proad.goodFirst')}</Pill> : null}
          <Pill>{task.size}</Pill>
        </span>
      </summary>
      <div className="space-y-4 border-t px-4 py-4 text-sm leading-relaxed text-on-surface-variant">
        <p><span className="font-semibold text-on-surface">{t('proad.why')}</span>{task.why}</p>
        <p><span className="font-semibold text-on-surface">{t('proad.deliverable')}</span>{task.deliverable}</p>
        <div>
          <p className="font-semibold text-on-surface">{t('proad.doneWhen')}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {task.acceptance.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
        {task.eval && task.eval.toLowerCase() !== "none" ? (
          <p><span className="font-semibold text-on-surface">{t('proad.eval')}</span>{task.eval}</p>
        ) : null}
        <p>
          <span className="font-semibold text-on-surface">{t('proad.size')}</span>{SIZE_KEY[task.size] ? t(SIZE_KEY[task.size]) : task.size}
          {task.skills?.length ? <> <span className="font-semibold text-on-surface">{t('proad.skills')}</span>{task.skills.join(", ")}.</> : null}
          {task.dependsOn?.length ? (
            <> <span className="font-semibold text-on-surface">{t('proad.after')}</span>
              {task.dependsOn.map((d, i) => (
                <span key={d}>{i ? ", " : ""}<a className="underline underline-offset-2" href={`#${d}`}>{d}</a></span>
              ))}.
            </>
          ) : null}
        </p>
        <div className="scheme-dark rounded-xl bg-background p-4">
          <p className="mb-2 font-label text-label-md uppercase text-on-surface-variant">{t('proad.agentBrief')}</p>
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-on-surface">{task.agentBrief}</pre>
        </div>
      </div>
    </details>
  )
}

export default function ProductRoadmap({ data, repo, discord = "/discord", related }) {
  const { t } = useI18n()
  const tasks = data.horizons.flatMap((h) => h.themes.flatMap((t) => t.tasks))
  const firsts = tasks.filter((t) => t.goodFirst)
  const issues = `${repo}/issues`

  return (
    <div className="container max-w-5xl py-16">
      <div className="space-y-16">
        {/* Header */}
        <header className="space-y-5">
          <Label>{t('proad.kicker')}</Label>
          <h1 className="text-display-md text-on-surface">{t('proad.title').replace('{product}', data.product)}</h1>
          <p className="text-xl font-semibold text-on-surface">{data.tagline}</p>
          <p className="max-w-3xl text-lg leading-relaxed text-on-surface-variant">{data.vision}</p>
          <p className="text-sm text-on-surface-variant">
            {t('proad.summary').replace('{tasks}', tasks.length).replace('{horizons}', data.horizons.length)}
            {related ? <> {t('proad.alsoSee')} <a className="underline underline-offset-2" href={related.href}>{related.labelKey ? t(related.labelKey) : related.label}</a>.</> : null}
          </p>
          <nav aria-label={t('proad.onThisPage')} className="flex flex-wrap gap-2 pt-2">
            <a className="rounded-full border px-3 py-1 text-sm" href="#start">{t('proad.startHere')}</a>
            {data.horizons.map((h) => (
              <a key={h.name} className="rounded-full border px-3 py-1 text-sm" href={`#${h.name.toLowerCase()}`}>{h.name}</a>
            ))}
            <a className="rounded-full border px-3 py-1 text-sm" href="#evals">{t('proad.navEvals')}</a>
            <a className="rounded-full border px-3 py-1 text-sm" href="#contribute">{t('proad.navContribute')}</a>
            <a className="rounded-full border px-3 py-1 text-sm" href="#not-doing">{t('proad.navNotDoing')}</a>
          </nav>
        </header>

        {/* Principles */}
        <section aria-labelledby="principles" className="space-y-5">
          <h2 id="principles" className="text-headline-md text-on-surface">{t('proad.howTitle')}</h2>
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
          <h2 id="start-title" className="text-headline-md text-on-surface">{t('proad.startHere')}</h2>
          <p className="max-w-3xl text-on-surface-variant">
            {t('proad.startDesc')}
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
                  <p className="text-sm text-on-surface-variant"><span className="font-semibold text-on-surface">{t('proad.doneMeasure')}</span>{theme.measure}</p>
                </div>
                <div className="space-y-2">
                  {theme.tasks.map((task) => <Task key={task.id} task={task} t={t} />)}
                </div>
              </div>
            ))}
          </section>
        ))}

        {/* Evals */}
        <section id="evals" aria-labelledby="evals-title" className="space-y-6">
          <div className="space-y-2">
            <Label>{t('proad.evalsKicker')}</Label>
            <h2 id="evals-title" className="text-headline-md text-on-surface">{t('proad.evalsTitle')}</h2>
            <p className="max-w-3xl text-on-surface-variant">{data.evals.intro}</p>
            <p className="max-w-3xl text-sm text-on-surface-variant">
              {t('proad.evalsMethodPre')}{" "}
              <a className="underline underline-offset-2" href={EVAL_ARTICLE} target="_blank" rel="noopener noreferrer">
                {t('proad.evalsMethodLink')}
              </a>
              {t('proad.evalsMethodPost')}
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-surface-bright text-on-surface">
                <tr>
                  {[
                    t('proad.thSuite'),
                    t('proad.thMeasures'),
                    t('proad.thCases'),
                    t('proad.thGrader'),
                    t('proad.thSplit'),
                    t('proad.thTarget'),
                    t('proad.thSurface'),
                    t('proad.thStatus'),
                  ].map((c, idx) => (
                    <th key={idx} className="px-3 py-2 font-semibold">{c}</th>
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
              <h3 className="mb-2 text-base font-semibold text-on-surface">{t('proad.theLoop')}</h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.evals.loop.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">{t('proad.guards')}</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.evals.guards.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Contribute */}
        <section id="contribute" aria-labelledby="contribute-title" className="space-y-6">
          <h2 id="contribute-title" className="text-headline-md text-on-surface">{t('proad.contribTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">{t('proad.steps')}</h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.contribute.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">{t('proad.agentRules')}</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.contribute.agentRules.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">{t('proad.reviewerChecks')}</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
                {data.contribute.reviewChecklist.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-on-surface">{t('proad.githubLabels')}</h3>
              <div className="flex flex-wrap gap-2">
                {data.contribute.labels.map((l) => <Pill key={l}>{l}</Pill>)}
              </div>
            </div>
          </div>
        </section>

        {/* Not doing */}
        <section id="not-doing" aria-labelledby="not-doing-title" className="space-y-5">
          <h2 id="not-doing-title" className="text-headline-md text-on-surface">{t('proad.notDoingTitle')}</h2>
          <ul className="space-y-3">
            {data.notDoing.map((n) => (
              <li key={n.item} className="rounded-xl border px-4 py-3 text-sm leading-relaxed text-on-surface-variant">
                <span className="font-semibold text-on-surface">{n.item}. </span>{n.why}
              </li>
            ))}
          </ul>
          <p className="max-w-3xl text-sm text-on-surface-variant">
            <span className="font-semibold text-on-surface">{t('proad.capacity')}</span>{data.realism}
          </p>
        </section>

        {/* CTA */}
        <section className="scheme-dark space-y-4 rounded-2xl bg-background p-8 text-center">
          <h2 className="text-headline-sm text-on-surface">{t('proad.pickTitle')}</h2>
          <p className="mx-auto max-w-2xl text-on-surface-variant">
            {t('proad.pickDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a className="rounded-full bg-on-surface px-5 py-2 text-sm font-semibold text-background" href={issues} target="_blank" rel="noopener noreferrer">{t('proad.githubIssues')}</a>
            <a className="rounded-full border px-5 py-2 text-sm font-semibold text-on-surface" href={discord} target="_blank" rel="noopener noreferrer">{t('proad.discord')}</a>
          </div>
        </section>
      </div>
    </div>
  )
}
