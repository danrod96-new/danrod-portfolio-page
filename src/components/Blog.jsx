import { formatDate, posts } from '../blog.js'
import { publications } from '../data.js'
import Reveal from './Reveal.jsx'
import { useLang } from '../lang.js'

// Post meta line: author (on the post's own page), date and reading time.
export function PostMeta({ post, showAuthor = false }) {
  const { t, p, lang } = useLang()
  return (
    <p className="post-meta mono muted">
      {showAuthor && <>{t.blog.by(post.author)} · </>}
      <time dateTime={post.date}>{formatDate(post.date, lang)}</time> · {t.blog.minutes(p(post.minutes))}
    </p>
  )
}

// Every post as a card, newest first: the home page's Blog section and the /blog/ page (BlogIndex.jsx).
export function PostCards() {
  const { t, p, tag, path } = useLang()

  return (
    <div className="grid">
      {posts.map((post) => (
        <a key={post.slug} className="post-card card" href={path(`/blog/${post.slug}/`)}>
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
  )
}

const byDate = [...publications].sort((a, b) => b.date.localeCompare(a.date))

// Articles written for other sites (data.js), after the posts: the newest `limit` on the home page, all on /blog/.
export function Publications({ limit }) {
  const { t, p, lang, tag, path } = useLang()
  if (publications.length === 0) return null
  const shown = byDate.slice(0, limit)

  return (
    <section className="publications" id="publications" aria-labelledby="publications-title">
      <h3 id="publications-title">{t.blog.elsewhere}</h3>
      <p className="section__sub">{t.blog.elsewhereSub}</p>
      <div className="grid">
        {shown.map((pub) => (
          <a key={pub.url} className="post-card card" href={pub.url} target="_blank" rel="noreferrer">
            <p className="post-meta mono muted">
              <time dateTime={pub.date}>{formatDate(pub.date, lang)}</time> · {pub.site}
            </p>
            <span className="post-card__title">
              <span lang={pub.lang}>{pub.title}</span> {pub.lang !== lang && <span className="post-card__lang muted">{t.blog.inLang(pub.lang)}</span>}
            </span>
            <span className="post-card__summary">{p(pub.summary)}</span>
            <span className="tags">
              {pub.tags?.map((tg) => (
                <span className="tag" key={tg}>{tag(tg)}</span>
              ))}
            </span>
            <span className="post-card__more mono">
              {t.blog.readOn(pub.site)} ↗<span className="sr-only"> {t.newTab}</span>
            </span>
          </a>
        ))}
      </div>
      {shown.length < publications.length && (
        <a className="blog__all mono" href={`${path('/blog/')}#publications`}>
          {t.blog.allPublications(publications.length)} →
        </a>
      )}
    </section>
  )
}

export default function Blog() {
  const { t, path } = useLang()

  return (
    <section className="section" id="blog">
      <div className="container">
        <Reveal className="section__head">
          <h2>{t.blog.title}</h2>
          <p className="section__sub">{t.blog.sub}</p>
          {/* scripts/prerender.js writes feed.xml at build time, so this link only works on a built site. */}
          <a className="blog__feed mono" href="/feed.xml">{t.blog.feed}</a>
        </Reveal>
        <PostCards />
        <a className="blog__all mono" href={path('/blog/')}>{t.blog.all} →</a>
        <Publications limit={3} />
      </div>
    </section>
  )
}
