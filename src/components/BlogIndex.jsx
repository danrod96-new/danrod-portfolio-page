import { useEffect } from 'react'
import { PostCards, Publications } from './Blog.jsx'
import { profile } from '../data.js'
import { useLang } from '../lang.js'
import { setDescription } from '../meta.js'

// /blog/ (and /es/blog/): every post on one page, so search engines have a single page linking to all of them.
export default function BlogIndex() {
  const { t, path } = useLang()
  const title = t.blog.title
  const description = t.blog.description

  useEffect(() => {
    document.title = `${title} · ${profile.name}`
    setDescription(description)
    return () => {
      document.title = t.meta.title
      setDescription(t.meta.description)
    }
  }, [title, description, t])

  return (
    <main className="post blog-index section" id="main">
      <div className="container">
        <a className="post__back mono" href={path('/')}>← {t.blog.home}</a>
        <h1 className="post__title">{title}</h1>
        <p className="section__sub">{t.blog.sub}</p>
        {/* scripts/prerender.js writes feed.xml at build time, so this link only works on a built site. */}
        <a className="blog__feed mono" href="/feed.xml">{t.blog.feed}</a>
        <PostCards />
        <Publications />
      </div>
    </main>
  )
}
