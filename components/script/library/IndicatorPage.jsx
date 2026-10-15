import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { SITE } from "@/lib/scriptDocs"

import Workbench, { LibText } from "./Workbench"

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
            <LibText k="slib.ind.allIndicators" />
          </Link>
          <div className="osl-head">
            <h1 className="osl-title">{data.title}</h1>
            <p className="osl-byline">
              <span>
                <LibText k="slib.ind.byOpenalgo" />
              </span>
              <span aria-hidden="true">&middot;</span>
              <Link href={`/script/library?category=${encodeURIComponent(data.category)}`} prefetch={false}>
                {data.category}
              </Link>
              <span aria-hidden="true">&middot;</span>
              <span>{data.licence}</span>
            </p>
          </div>
          <p className="osl-lede">{data.summary}</p>

          <Workbench file={data.file} lines={data.lines} capturedAt={data.dataTo} interval={data.interval} viewEndBack={data.viewEndBack ?? null} aheadBars={data.aheadBars ?? 0} chartSettings={data.chartSettings ?? null} chartSettingsText={data.chartSettingsText ?? null} chartNote={data.chartNote ?? null} />
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="osl-wrap osl-columns">
          <article className="osl-article">
            {data.deviation ? (
              <p className="osl-deviation">
                <strong>
                  <LibText k="slib.ind.note" />
                </strong>{" "}
                {data.deviation}
              </p>
            ) : null}
            <Html html={data.descriptionHtml} />

            <h2 className="osl-h2">
              <LibText k="slib.ind.howToRead" vars={{ title: data.title }} />
            </h2>
            <Html html={data.howToReadHtml} />

            {data.settings.length ? (
              <>
                <h2 className="osl-h2">
                  <LibText k="slib.ind.settings" />
                </h2>
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
                <h2 className="osl-h2">
                  <LibText k="slib.ind.faq" />
                </h2>
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
              <p className="osl-card-kicker">
                <LibText k="slib.ind.useInOpenalgo" />
              </p>
              <p className="osl-card-title">
                <LibText k="slib.ind.addToChart" />
              </p>
              <ol className="osl-steps">
                <li>
                  <LibText k="slib.ind.step1" />
                </li>
                <li>
                  <LibText k="slib.ind.step2" />
                </li>
                <li>
                  <LibText k="slib.ind.step3" />
                </li>
              </ol>
              <div className="osl-card-actions">
                <Link href="/script/getting-started/the-editor" prefetch={false} className={buttonVariants({ size: "sm", className: "h-9 w-full" })}>
                  <LibText k="slib.ind.howEditorWorks" />
                </Link>
                <Link href="/script/getting-started/quickstart" prefetch={false} className={buttonVariants({ variant: "outline", size: "sm", className: "h-9 w-full" })}>
                  <LibText k="slib.ind.quickstart" />
                </Link>
              </div>
            </div>

            <div className="osl-card">
              <p className="osl-card-kicker">
                <LibText k="slib.ind.licence" />
              </p>
              <p className="osl-card-body">
                <LibText k="slib.ind.licenceSubject" />{" "}
                <a href={data.licenceUrl} target="_blank" rel="noopener noreferrer">
                  {data.licenceName}
                </a>
                .
              </p>
              {data.credit ? <p className="osl-card-body osl-dim">{data.credit}.</p> : null}
            </div>

            <div className="osl-card">
              <p className="osl-card-kicker">
                <LibText k="slib.ind.theScript" />
              </p>
              <dl className="osl-facts">
                <div>
                  <dt>
                    <LibText k="slib.ind.lines" />
                  </dt>
                  <dd>{data.lines}</dd>
                </div>
                <div>
                  <dt>
                    <LibText k="slib.ind.settings" />
                  </dt>
                  <dd>{data.inputs}</dd>
                </div>
                <div>
                  <dt>
                    <LibText k="slib.ind.plots" />
                  </dt>
                  <dd>{data.plots}</dd>
                </div>
                <div>
                  <dt>
                    <LibText k="slib.ind.drawsOn" />
                  </dt>
                  <dd>
                    <LibText k={data.pane === "price" ? "slib.ind.pricePane" : "slib.ind.ownPane"} />
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {data.related?.length ? (
        <section className="border-t px-4 py-16">
          <div className="osl-wrap">
            <h2 className="osl-h2 mt-0">
              <LibText k="slib.ind.moreIn" vars={{ category: data.category }} />
            </h2>
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
          <h2 className="mx-auto max-w-2xl text-display-sm text-on-surface">
            <LibText k="slib.ind.ctaTitle" />
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            <LibText k="slib.ind.ctaDesc" />
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/script" prefetch={false} className={buttonVariants({ size: "lg", className: "h-11 px-6" })}>
              <LibText k="slib.ind.learnOpenscript" />
            </Link>
            <Link href="/script/library" prefetch={false} className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-6" })}>
              <LibText k="slib.ind.browseLibrary" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

