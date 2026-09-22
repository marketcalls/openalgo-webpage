// One page of the /script documentation, rendered from lib/scriptDocsData.json.
//
// Every docs page has its own static route file under app/script/<section>/<page>/,
// written by scripts/gen-script-docs.mjs from content/script/nav.json. That is the
// same one-folder-per-page shape the courses use: OpenNext on this project serves
// a dynamic [section]/[page] route as a 404 from the Worker, while static routes
// are served from the prerender cache. Each route file renders this component.
import Link from "next/link"
import { notFound } from "next/navigation"

import DocEnhancerLoader from "@/components/script/DocEnhancerLoader"
import DocToc from "@/components/script/DocToc"
import {
  SCRIPT_EDIT_BASE,
  SCRIPT_VERSION,
  SITE,
  firstPageOf,
  getScriptPage,
  neighbours,
  readyPages,
} from "@/lib/scriptDocs"

const OG_IMAGE = "/assets/images/og-image.png"

/** The metadata of one docs page, for its generated route file. */
export function scriptDocMetadata(section, page) {
  const doc = getScriptPage(section, page)
  if (!doc) return {}
  const path = `/script/${section}/${page}`
  const title = `${doc.title} | OpenScript`
  return {
    title,
    description: doc.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: `${SITE}${path}`,
      title,
      description: doc.description,
      siteName: "OpenAlgo",
      section: doc.section,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OpenScript documentation", type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: doc.description,
      images: [OG_IMAGE],
      creator: "@openalgoHQ",
      site: "@openalgoHQ",
    },
  }
}

function PagerLink({ item, dir }) {
  if (!item) return <span className="osd-pager-gap" />
  return (
    <Link href={item.href} className={`osd-pager-link is-${dir}`}>
      <span className="osd-pager-dir">{dir === "prev" ? "Previous" : "Next"}</span>
      <span className="osd-pager-title">{item.title}</span>
      <span className="osd-pager-section">{item.sectionTitle}</span>
    </Link>
  )
}

export default function ScriptDocView({ section, page }) {
  const doc = getScriptPage(section, page)
  if (!doc) notFound()

  const path = `/script/${section}/${page}`
  const url = `${SITE}${path}`
  const sectionHref = firstPageOf(section) ?? "/script"
  const { prev, next } = neighbours(section, page)
  const rootId = `osd-doc-${section}-${page}`
  const headings = (doc.toc || []).filter((h) => h.level === 2)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    url,
    inLanguage: "en",
    image: `${SITE}${OG_IMAGE}`,
    articleSection: doc.section,
    about: { "@type": "ComputerLanguage", name: "OpenScript", alternateName: "OpenAlgo Script", version: SCRIPT_VERSION },
    author: { "@type": "Organization", name: "OpenAlgo", url: SITE },
    publisher: { "@type": "Organization", name: "OpenAlgo", url: SITE },
    isPartOf: { "@type": "WebSite", name: "OpenScript documentation", url: `${SITE}/script` },
    mainEntityOfPage: url,
  }
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Script", item: `${SITE}/script` },
      { "@type": "ListItem", position: 2, name: doc.section, item: `${SITE}${sectionHref}` },
      { "@type": "ListItem", position: 3, name: doc.title, item: url },
    ],
  }

  return (
    <div className="osd-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article className="osd-article">
        <nav aria-label="Breadcrumb" className="osd-crumbs">
          <ol>
            <li>
              <Link href="/script" prefetch={false}>
                Script
              </Link>
            </li>
            <li>
              <Link href={sectionHref} prefetch={false}>
                {doc.section}
              </Link>
            </li>
            <li aria-current="page">{doc.title}</li>
          </ol>
        </nav>

        <header className="osd-head">
          <h1>{doc.title}</h1>
          {doc.description ? <p className="osd-lede">{doc.description}</p> : null}
        </header>

        {headings.length > 1 ? (
          <details className="osd-toc-inline">
            <summary>On this page</summary>
            <ol>
              {headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ol>
          </details>
        ) : null}

        <div id={rootId} className="osd-doc" dangerouslySetInnerHTML={{ __html: doc.html }} />

        <footer className="osd-foot">
          <nav className="osd-pager" aria-label="Previous and next pages">
            <PagerLink item={prev} dir="prev" />
            <PagerLink item={next} dir="next" />
          </nav>
          <p className="osd-edit">
            <a href={`${SCRIPT_EDIT_BASE}/${section}/${page}.md`} target="_blank" rel="noopener noreferrer">
              Edit this page on GitHub
            </a>
            <span>OpenScript {SCRIPT_VERSION}</span>
          </p>
        </footer>
      </article>

      <aside className="osd-aside">
        <DocToc toc={doc.toc} />
      </aside>

      <DocEnhancerLoader rootId={rootId} />
    </div>
  )
}
