import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { SITE } from "@/lib/scriptDocs"

import Workbench from "./Workbench"

/**
 * One study of the OpenScript library at /script/library/<slug>.
 *
 * Everything a reader or a search engine needs is rendered here on the
 * server from lib/script-library/<slug>.json: the title, the description, how
 * to read it, every setting and the questions. The chart and the source are
 * client views (Workbench) over static files, so neither reaches the Worker.
 */
const OG_IMAGE = "/assets/og/script.png"

export function indicatorMetadata(data) {
  const path = `/script/library/${data.slug}`
  const title = `${data.title} | OpenScript library`
  return {
    title: { absolute: `${title} | OpenAlgo` },
    description: data.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: `${SITE}${path}`,
      title,
      description: data.summary,
      siteName: "OpenAlgo",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: data.title, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: data.summary,
      images: [OG_IMAGE],
      creator: "@openalgoHQ",
      site: "@openalgoHQ",
    },
  }
}

function Html({ html, className = "" }) {
  return <div className={`osl-prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

export default function IndicatorPage({ data }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: data.title,
    description: data.summary,
    programmingLanguage: "OpenScript",
    codeRepository: `${SITE}/script/library/${data.slug}`,
    license: data.licenceUrl,
    author: { "@type": "Organization", name: "openalgo" },
  }
  const faqLd = data.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.html.replace(/<[^>]+>/g, "") } })),
      }
    : null

  return (
    <div className="osl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {faqLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} /> : null}

      <section className="px-4 pt-12 pb-10 md:pt-16">
        <div className="osl-wrap">
          <Link href="/script/library" prefetch={false} className="osl-back">
            All indicators
          </Link>
          <div className="osl-head">
            <h1 className="osl-title">{data.title}</h1>
            <p className="osl-byline">
              <span>By openalgo</span>
              <span aria-hidden="true">&middot;</span>
              <Link href={`/script/library?category=${encodeURIComponent(data.category)}`} prefetch={false}>
                {data.category}
              </Link>
              <span aria-hidden="true">&middot;</span>
              <span>{data.licence}</span>
            </p>
          </div>
          <p className="osl-lede">{data.summary}</p>

          <Workbench file={data.file} lines={data.lines} capturedAt={data.dataTo} interval={data.interval} />
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="osl-wrap osl-columns">
          <article className="osl-article">
            {data.deviation ? (
              <p className="osl-deviation">
                <strong>Note.</strong> {data.deviation}
              </p>
            ) : null}
            <Html html={data.descriptionHtml} />

            <h2 className="osl-h2">How to read {data.title}</h2>
            <Html html={data.howToReadHtml} />

            {data.settings.length ? (
              <>
                <h2 className="osl-h2">Settings</h2>
                <dl className="osl-settings">
                  {data.settings.map((s) => (
                    <div key={s.key} className="osl-setting">
                      <dt>{s.label}</dt>
                      <dd dangerouslySetInnerHTML={{ __html: s.html }} />
                    </div>
                  ))}
                </dl>
              </>
            ) : null}

            {data.faq.length ? (
              <>
                <h2 className="osl-h2">Frequently asked questions</h2>
                <div className="osl-faq">
                  {data.faq.map((f) => (
                    <details key={f.q} className="osl-faq-item">
                      <summary>{f.q}</summary>
                      <Html html={f.html} />
                    </details>
                  ))}
                </div>
              </>
            ) : null}
          </article>

          <aside className="osl-aside">
            <div className="osl-card">
              <p className="osl-card-kicker">Use it in OpenAlgo</p>
              <p className="osl-card-title">Add it to a chart in /trading</p>
              <ol className="osl-steps">
                <li>Open Source code and press Copy.</li>
                <li>In /trading, open the Scripts panel and create a new script.</li>
                <li>Paste, save, and add it to the chart.</li>
              </ol>
              <div className="osl-card-actions">
                <Link href="/script/getting-started/the-editor" prefetch={false} className={buttonVariants({ size: "sm", className: "h-9 w-full" })}>
                  How the editor works
                </Link>
                <Link href="/script/getting-started/quickstart" prefetch={false} className={buttonVariants({ variant: "outline", size: "sm", className: "h-9 w-full" })}>
                  OpenScript quickstart
                </Link>
              </div>
            </div>

            <div className="osl-card">
              <p className="osl-card-kicker">Licence</p>
              <p className="osl-card-body">
                This source code is subject to the terms of the{" "}
                <a href={data.licenceUrl} target="_blank" rel="noopener noreferrer">
                  {data.licenceName}
                </a>
                .
              </p>
              {data.credit ? <p className="osl-card-body osl-dim">{data.credit}.</p> : null}
            </div>

            <div className="osl-card">
              <p className="osl-card-kicker">The script</p>
              <dl className="osl-facts">
                <div>
                  <dt>Lines</dt>
                  <dd>{data.lines}</dd>
                </div>
                <div>
                  <dt>Settings</dt>
                  <dd>{data.inputs}</dd>
                </div>
                <div>
                  <dt>Plots</dt>
                  <dd>{data.plots}</dd>
                </div>
                <div>
                  <dt>Draws on</dt>
                  <dd>{data.pane === "price" ? "The price pane" : "Its own pane"}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {data.related?.length ? (
        <section className="border-t px-4 py-16">
          <div className="osl-wrap">
            <h2 className="osl-h2 mt-0">More in {data.category}</h2>
            <div className="osl-related">
              {data.related.map((r) => (
                <Link key={r.slug} href={`/script/library/${r.slug}`} prefetch={false} className="osl-related-card">
                  <img src={`/script/library/thumbs/${r.slug}.svg`} alt="" loading="lazy" width={640} height={360} />
                  <span className="osl-related-title">{r.title}</span>
                  <span className="osl-related-summary">{r.summary}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-3 pb-6 sm:px-6">
        <div className="scheme-dark rounded-[2.5rem] px-4 py-20 text-center sm:px-8">
          <h2 className="mx-auto max-w-2xl text-display-sm text-on-surface">Write your own in OpenScript</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            Every study here is plain OpenScript. Change a setting, combine two, or turn one into a strategy, then backtest it in /trading and
            run it in sandbox trading (analyzer mode in OpenAlgo) before going further.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/script" prefetch={false} className={buttonVariants({ size: "lg", className: "h-11 px-6" })}>
              Learn OpenScript
            </Link>
            <Link href="/script/library" prefetch={false} className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6" })}>
              Browse the library
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
