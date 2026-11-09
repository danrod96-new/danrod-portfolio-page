import { formatDate, posts } from '../blog.js'
import Reveal from './Reveal.jsx'
import { useLang } from '../lang.js'

// Post meta line: date and reading time.
export function PostMeta({ post }) {
  const { t, p, lang } = useLang()
  return (
    <p className="post-meta mono muted">
      <time dateTime={post.date}>{formatDate(post.date, lang)}</time> · {t.blog.minutes(p(post.minutes))}
    </p>
  )
}

export default function Blog() {
  const { t, p, tag } = useLang()

  return (
    <section className="section" id="blog">
      <div className="container">
        <Reveal className="section__head">
          <h2>{t.blog.title}</h2>
          <p className="section__sub">{t.blog.sub}</p>
          {/* scripts/prerender.js writes feed.xml at build time, so this link only works on a built site. */}
          <a className="blog__feed mono" href="/feed.xml">{t.blog.feed}</a>
        </Reveal>
        <div className="grid">
          {posts.map((post) => (
            <a key={post.slug} className="post-card card" href={`/blog/${post.slug}/`}>
              <PostMeta post={post} />
              <span className="post-card__title">{p(post.title)}</span>
              <span className="post-card__summary">{p(post.summary)}</span>
              <span className="tags">
                {post.tags?.map((tg) => (
                  <span className="tag" key={tg}>{tag(tg)}</span>
                ))}
              </span>
              <span className="post-card__more mono">{t.blog.read} →</span>
            </a>
          ))}
          {posts.length === 0 && <p className="empty">{t.blog.empty}</p>}
        </div>
      </div>
    </section>
  )
}
