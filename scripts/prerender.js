// Runs after `vite build` (see the build script in package.json). The app is a single page, but search
// engines need a real HTML file per address, so this writes one for each page in each language:
//   dist/index.html, dist/blog/<slug>/index.html, dist/privacy/index.html          (English)
//   dist/es/index.html, dist/es/blog/<slug>/index.html, dist/es/privacy/index.html (Spanish, see src/paths.js)
// Each is the built index.html with the page's own language, title, description, link-preview tags, canonical URL
// and hreflang links to the other language. Posts and the privacy policy also get their text in <div id="root">
// so it can be read without JavaScript; the app then loads as usual and replaces it. Each post gets its own
// preview image (scripts/og-image.js). It also writes dist/sitemap.xml with every page and dist/feed.xml.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { readingMinutes, renderMarkdown } from './markdown.js'
import { postImage } from './og-image.js'
import { privacy } from '../src/content/privacy.js'
import { strings } from '../src/strings.js'
import { localizeLinks, pathFor } from '../src/paths.js'

const site = 'https://danrod.ca'
const dist = new URL('../dist/', import.meta.url)
const blogDir = new URL('../src/content/blog/', import.meta.url)
const template = readFileSync(new URL('index.html', dist), 'utf8')

const languages = ['en', 'es']
const locales = { en: 'en_CA', es: 'es_CO' }
// The site-wide preview image (public/og-image.jpg) is the same in both languages; only its description changes.
const siteImageAlt = {
  en: 'Daniel Rodriguez, Full Stack Drupal & Web Developer: name, skills (Drupal 6 to 11, React, PHP, DevOps, Linux) and a portrait on a dark background',
  es: 'Daniel Rodriguez, desarrollador Drupal y web full stack: nombre, habilidades (Drupal 6 a 11, React, PHP, DevOps, Linux) y un retrato sobre un fondo oscuro',
}

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// A content value in one language: { en, es } falls back to English, plain values are shared (same as src/lang.js).
const inLang = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) && 'en' in value ? value[lang] ?? value.en : value)
const longDate = (date, lang) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

// Put `value` right after the pattern's first group, replacing the rest of the match, and fail the build
// if the template no longer has it. A replacer function keeps any `$` in post text literal.
function replace(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`prerender: index.html has no match for ${pattern}`)
  return html.replace(pattern, (_, before) => before + value)
}

// `path` is the page's address without the language (/blog/x/); it's written once per language.
function writePage({ lang, path, title, description, type, body = '', image, jsonLd }) {
  const url = `${site}${pathFor(lang, path)}`
  const other = languages.find((l) => l !== lang)
  const img = image ?? { url: `${site}/og-image.jpg`, type: 'image/jpeg', alt: siteImageAlt[lang] }
  let html = template
  html = replace(html, /(<html lang=")[^"]*/, lang)
  html = replace(html, /(<title>)[^<]*/, escape(title))
  html = replace(html, /(<meta name="description" content=")[^"]*/, escape(description))
  html = replace(html, /(<link rel="canonical" href=")[^"]*/, url)
  html = replace(html, /(<meta property="og:title" content=")[^"]*/, escape(title))
  html = replace(html, /(<meta property="og:description" content=")[^"]*/, escape(description))
  html = replace(html, /(<meta property="og:type" content=")[^"]*/, type)
  html = replace(html, /(<meta property="og:url" content=")[^"]*/, url)
  html = replace(html, /(<meta property="og:locale" content=")[^"]*/, locales[lang])
  html = replace(html, /(<meta property="og:locale:alternate" content=")[^"]*/, locales[other])
  html = replace(html, /(<meta property="og:image" content=")[^"]*/, img.url)
  html = replace(html, /(<meta property="og:image:type" content=")[^"]*/, img.type)
  html = replace(html, /(<meta property="og:image:alt" content=")[^"]*/, escape(img.alt))
  // hreflang: the same page in each language, with English as the default for everyone else.
  const alternates = [
    ...languages.map((l) => `<link rel="alternate" hreflang="${l}" href="${site}${pathFor(l, path)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${site}${pathFor('en', path)}" />`,
  ]
  html = replace(html, /(\s*)(?=<\/head>)/, `${alternates.join('\n    ')}\n  `)
  if (jsonLd) {
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    html = replace(html, /(\s*)(?=<\/head>)/, `<script type="application/ld+json">${json}</script>\n  `)
  }
  html = replace(html, /(<div id="root">)(?=<\/div>)/, body)

  const dir = new URL(`.${pathFor(lang, path)}`, dist)
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

for (const lang of languages) {
  const t = strings[lang]

  // Home page: only the head changes; the app renders the sections.
  writePage({ lang, path: '/', title: t.meta.title, description: t.meta.description, type: 'website' })

  for (const post of posts) {
    const title = inLang(post.title, lang)
    const description = inLang(post.summary, lang)
    const body = inLang(post.body, lang)
    const path = `/blog/${post.slug}/`
    const date = longDate(post.date, lang)

    // Preview image: dist/blog/<slug>/og.png, or dist/es/blog/<slug>/og.png with the Spanish title.
    const imagePath = `${pathFor(lang, path)}og.png`
    mkdirSync(new URL(`.${pathFor(lang, path)}`, dist), { recursive: true })
    const tags = (post.tags ?? []).map((tag) => t.tags[tag] ?? tag)
    writeFileSync(
      new URL(`.${imagePath}`, dist),
      await postImage({ slug: post.slug, title, tags, meta: `${date} · ${t.blog.minutes(readingMinutes(body))}`, label: 'blog' }),
    )
    const image = { url: `${site}${imagePath}`, type: 'image/png', alt: `${title} — ${tags.join(', ')} · Daniel Rodriguez, danrod.ca` }

    writePage({
      lang,
      path,
      title: `${title} · ${t.meta.title}`,
      description,
      type: 'article',
      image,
      body: article({
        back: pathFor(lang, '/#blog'),
        backLabel: t.blog.all,
        title,
        meta: `<time datetime="${post.date}">${date}</time>`,
        html: localizeLinks(renderMarkdown(body), lang),
      }),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        datePublished: post.date,
        ...(post.updated && { dateModified: post.updated }),
        url: `${site}${pathFor(lang, path)}`,
        image: image.url,
        inLanguage: lang,
        // Same @id as the Person in index.html, so search engines know it's the same person.
        author: { '@type': 'Person', '@id': `${site}/#person`, name: 'Daniel Rodriguez', url: `${site}/` },
      },
    })
  }

  writePage({
    lang,
    path: '/privacy/',
    title: `${inLang(privacy.title, lang)} · ${t.meta.title}`,
    description: inLang(privacy.description, lang),
    type: 'website',
    body: article({
      back: pathFor(lang, '/'),
      backLabel: t.privacy.home,
      title: inLang(privacy.title, lang),
      meta: t.privacy.updated(longDate(privacy.updated, lang)),
      html: localizeLinks(renderMarkdown(inLang(privacy.body, lang)), lang),
    }),
  })
}

// Sitemap: every page in both languages, each listing its other-language version, plus the resume.
const pages = [
  { path: '/' },
  { path: '/privacy/', lastmod: privacy.updated },
  ...posts.map((post) => ({ path: `/blog/${post.slug}/`, lastmod: post.updated ?? post.date })),
]
const entry = (loc, lastmod, links = '') =>
  `  <url>\n    <loc>${site}${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}${links}  </url>\n`
const hreflangs = (path) =>
  [...languages.map((l) => [l, pathFor(l, path)]), ['x-default', path]]
    .map(([l, loc]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${site}${loc}" />\n`)
    .join('')
writeFileSync(
  new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    pages.flatMap(({ path, lastmod }) => languages.map((lang) => entry(pathFor(lang, path), lastmod, hreflangs(path)))).join('') +
    entry('/Daniel-Rodriguez-Resume.pdf') +
    `</urlset>\n`,
)

// RSS feed of every published post, newest first, with the full English text. Links in the post body are made
// absolute, since feed readers show it away from danrod.ca. index.html points to it with <link rel="alternate">.
const t = strings.en
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
          `  <item>\n    <title>${escape(inLang(post.title, 'en'))}</title>\n    <link>${url}</link>\n    <guid isPermaLink="true">${url}</guid>\n` +
          `    <pubDate>${rfc822(post.date)}</pubDate>\n` +
          (post.tags ?? []).map((tag) => `    <category>${escape(tag)}</category>\n`).join('') +
          `    <description>${escape(inLang(post.summary, 'en'))}</description>\n` +
          `    <content:encoded>${cdata(absolute(renderMarkdown(inLang(post.body, 'en'))))}</content:encoded>\n  </item>\n`
        )
      })
      .join('') +
    `</channel>\n</rss>\n`,
)

console.log(
  `prerender: home, privacy policy and ${posts.length} post(s) with preview images in ${languages.join(' and ')}; sitemap.xml and feed.xml written to dist/`,
)
