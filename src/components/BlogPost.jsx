import { useEffect } from 'react'
import { findPost, renderMarkdown } from '../blog.js'
import { PostMeta } from './Blog.jsx'
import { useLang } from '../lang.js'

export default function BlogPost({ slug }) {
  const { t, p, tag } = useLang()
  const post = findPost(slug)
  const title = post ? p(post.title) : t.blog.notFound

  useEffect(() => {
    document.title = `${title} · ${t.meta.title}`
    return () => {
      document.title = t.meta.title
    }
  }, [title, t])

  return (
    <main className="post section" id="main">
      <div className="container post__inner">
        <a className="post__back mono" href="#blog">← {t.blog.all}</a>
        {post ? (
          <article>
            <h1 className="post__title">{title}</h1>
            <PostMeta post={post} />
            <div className="tags">
              {post.tags?.map((tg) => (
                <span className="tag" key={tg}>{tag(tg)}</span>
              ))}
            </div>
            {/* Posts are our own files in the repo, so their Markdown is trusted. */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(p(post.body)) }} />
          </article>
        ) : (
          <h1 className="post__title">{t.blog.notFound}</h1>
        )}
      </div>
    </main>
  )
}
