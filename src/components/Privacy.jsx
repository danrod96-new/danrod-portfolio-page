import { useEffect } from 'react'
import { formatDate, renderMarkdown } from '../blog.js'
import { privacy } from '../content/privacy.js'
import { useLang } from '../lang.js'
import { setDescription } from '../meta.js'

export default function Privacy() {
  const { t, p, lang } = useLang()
  const title = p(privacy.title)
  const description = p(privacy.description)

  useEffect(() => {
    document.title = `${title} · ${t.meta.title}`
    setDescription(description)
    return () => {
      document.title = t.meta.title
      setDescription(t.meta.description)
    }
  }, [title, description, t])

  return (
    <main className="post section" id="main">
      <div className="container post__inner">
        <a className="post__back mono" href="#top">← {t.privacy.home}</a>
        <article>
          <h1 className="post__title">{title}</h1>
          <p className="post-meta mono">{t.privacy.updated(formatDate(privacy.updated, lang))}</p>
          {/* Our own file in the repo, so the Markdown is trusted. */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(p(privacy.body)) }} />
        </article>
      </div>
    </main>
  )
}
