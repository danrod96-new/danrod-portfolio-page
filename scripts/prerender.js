// Runs after `vite build` (see the build script in package.json). The app is a single page, but search
// engines need a real HTML file per address, so this writes one for each blog post and the privacy policy:
//   dist/blog/<slug>/index.html, dist/privacy/index.html
// Each is the built index.html with the page's own title, description, link-preview tags and canonical URL,
// plus its English text already in <div id="root"> so it can be read without JavaScript. The app then
// loads as usual and replaces that text. It also writes dist/sitemap.xml with every page and dist/feed.xml.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { renderMarkdown } from './markdown.js'
import { privacy } from '../src/content/privacy.js'
import { strings } from '../src/strings.js'

const site = 'https://danrod.ca'
const dist = new URL('../dist/', import.meta.url)
const blogDir = new URL('../src/content/blog/', import.meta.url)
const t = strings.en
const template = readFileSync(new URL('index.html', dist), 'utf8')

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const en = (value) => (value && typeof value === 'object' ? value.en : value)
const longDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

// Put `value` right after the pattern's first group, replacing the rest of the match, and fail the build
// if the template no longer has it. A replacer function keeps any `$` in post text literal.
function replace(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`prerender: index.html has no match for ${pattern}`)
  return html.replace(pattern, (_, before) => before + value)
}

function writePage({ path, title, description, type, body, jsonLd }) {
  const url = `${site}${path}`
  let html = template
  html = replace(html, /(<title>)[^<]*/, escape(title))
  html = replace(html, /(<meta name="description" content=")[^"]*/, escape(description))
  html = replace(html, /(<meta property="og:title" content=")[^"]*/, escape(title))
  html = replace(html, /(<meta property="og:description" content=")[^"]*/, escape(description))
  html = replace(html, /(<meta property="og:url" content=")[^"]*/, url)
  html = replace(html, /(<meta property="og:type" content=")[^"]*/, type)
  html = replace(html, /(<link rel="canonical" href=")[^"]*/, url)
  if (jsonLd) {
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    html = replace(html, /(\s*)(?=<\/head>)/, `<script type="application/ld+json">${json}</script>\n  `)
  }
  html = replace(html, /(<div id="root">)(?=<\/div>)/, body)

  const dir = new URL(`.${path}`, dist)
  mkdirSync(dir, { recursive: true })
  writeFileSync(new URL('index.html', dir), html)
}

// Same markup and classes as BlogPost.jsx / Privacy.jsx, so the page looks right before the app loads.
const article = ({ back, backLabel, title, meta, html }) =>
  `<main class="post section" id="main"><div class="container post__inner">` +
  `<a class="post__back mono" href="${back}">← ${escape(backLabel)}</a>` +
  `<article><h1 class="post__title">${escape(title)}</h1><p class="post-meta mono muted">${meta}</p>` +
  `<div class="prose">${html}</div></article></div></main>`

const posts = readdirSync(blogDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(new URL(file, blogDir), 'utf8')))
  .filter((post) => !post.draft)

for (const post of posts) {
  const title = en(post.title)
  const description = en(post.summary)
  const path = `/blog/${post.slug}/`
  writePage({
    path,
    title: `${title} · ${t.meta.title}`,
    description,
    type: 'article',
    body: article({
      back: '/#blog',
      backLabel: t.blog.all,
      title,
      meta: `<time datetime="${post.date}">${longDate(post.date)}</time>`,
      html: renderMarkdown(en(post.body)),
    }),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      datePublished: post.date,
      ...(post.updated && { dateModified: post.updated }),
      url: `${site}${path}`,
      image: `${site}/og-image.jpg`,
      inLanguage: 'en',
      // Same @id as the Person in index.html, so search engines know it's the same person.
      author: { '@type': 'Person', '@id': `${site}/#person`, name: 'Daniel Rodriguez', url: `${site}/` },
    },
  })
}

writePage({
  path: '/privacy/',
  title: `${en(privacy.title)} · ${t.meta.title}`,
  description: en(privacy.description),
  type: 'website',
  body: article({
    back: '/',
    backLabel: t.privacy.home,
    title: en(privacy.title),
    meta: t.privacy.updated(longDate(privacy.updated)),
    html: renderMarkdown(en(privacy.body)),
  }),
})

// Sitemap: the home page, the resume, the privacy policy and every published post.
const urls = [
  { loc: '/' },
  { loc: '/Daniel-Rodriguez-Resume.pdf' },
  { loc: '/privacy/', lastmod: privacy.updated },
  ...posts.map((post) => ({ loc: `/blog/${post.slug}/`, lastmod: post.updated ?? post.date })),
]
writeFileSync(
  new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(({ loc, lastmod }) => `  <url>\n    <loc>${site}${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}  </url>\n`).join('') +
    `</urlset>\n`,
)

// RSS feed of every published post, newest first, with the full English text. Links in the post body are made
// absolute, since feed readers show it away from danrod.ca. index.html points to it with <link rel="alternate">.
const absolute = (html) => html.replace(/(\s(?:href|src)=")\//g, `$1${site}/`)
const cdata = (html) => `<![CDATA[${html.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const rfc822 = (date) => new Date(`${date}T12:00:00Z`).toUTCString()
const newest = [...posts].sort((a, b) => b.date.localeCompare(a.date))
writeFileSync(
  new URL('feed.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n<channel>\n` +
    `  <title>${escape(t.meta.title)} · Blog</title>\n  <link>${site}/</link>\n` +
    `  <description>${escape(t.meta.description)}</description>\n  <language>en</language>\n` +
    `  <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />\n` +
    (newest.length ? `  <lastBuildDate>${rfc822(newest[0].updated ?? newest[0].date)}</lastBuildDate>\n` : '') +
    newest
      .map((post) => {
        const url = `${site}/blog/${post.slug}/`
        return (
          `  <item>\n    <title>${escape(en(post.title))}</title>\n    <link>${url}</link>\n    <guid isPermaLink="true">${url}</guid>\n` +
          `    <pubDate>${rfc822(post.date)}</pubDate>\n` +
          (post.tags ?? []).map((tag) => `    <category>${escape(tag)}</category>\n`).join('') +
          `    <description>${escape(en(post.summary))}</description>\n` +
          `    <content:encoded>${cdata(absolute(renderMarkdown(en(post.body))))}</content:encoded>\n  </item>\n`
        )
      })
      .join('') +
    `</channel>\n</rss>\n`,
)

console.log(`prerender: ${posts.length} post(s), privacy policy, sitemap.xml and feed.xml written to dist/`)
