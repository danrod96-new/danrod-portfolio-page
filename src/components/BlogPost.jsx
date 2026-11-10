import { useEffect } from 'react'
import { findPost } from '../blog.js'
import { PostMeta } from './Blog.jsx'
import { profile } from '../data.js'
import { useLang } from '../lang.js'
import { setDescription } from '../meta.js'
import { localizeLinks } from '../paths.js'

export default function BlogPost({ slug }) {
  const { t, p, tag, lang, path } = useLang()
  const post = findPost(slug)
  const title = post ? p(post.title) : t.blog.notFound
  const description = post ? p(post.summary) : t.meta.description
  // The optional shorter "seoTitle" fits in search results, which cut titles off at about 60 characters.
  const tabTitle = post?.seoTitle ? p(post.seoTitle) : title

  useEffect(() => {
    document.title = `${tabTitle} · ${profile.name}`
    setDescription(description)
    return () => {
      document.title = t.meta.title
      setDescription(t.meta.description)
    }
  }, [tabTitle, description, t])

  return (
    <main className="post section" id="main">
      <div className="container post__inner">
        <a className="post__back mono" href={path('/blog/')}>← {t.blog.all}</a>
        {post ? (
          <article>
            <h1 className="post__title">{title}</h1>
            <PostMeta post={post} showAuthor />
            <div className="tags">
              {post.tags?.map((tg) => (
                <span className="tag" key={tg}>{tag(tg)}</span>
              ))}
            </div>
            {/* Posts are our own files in the repo, so their HTML (built from Markdown) is trusted. */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: localizeLinks(p(post.html), lang) }} />
          </article>
        ) : (
          <h1 className="post__title">{t.blog.notFound}</h1>
        )}
      </div>
    </main>
  )
}
