import { marked } from 'marked'
import { profile } from './data.js'

// Blog posts are JSON files in src/content/blog/ (see the README for the format). The blog plugin in vite.config.js
// swaps each post's Markdown `body` for highlighted `html` and its reading time in `minutes`.
const files = import.meta.glob('./content/blog/*.json', { eager: true, import: 'default' })

// A post's optional "author" defaults to the site owner (profile.name). scripts/prerender.js uses the same default.
export const defaultAuthor = profile.name

export const posts = Object.values(files)
  .filter((post) => !(post.draft && import.meta.env.PROD))
  .map((post) => ({ ...post, author: post.author ?? defaultAuthor }))
  .sort((a, b) => b.date.localeCompare(a.date))

export const findPost = (slug) => posts.find((post) => post.slug === slug)

// The privacy policy (src/content/privacy.js) is still Markdown, rendered here.
const text = (body) => (Array.isArray(body) ? body.join('\n') : body ?? '')

export const renderMarkdown = (body) => marked.parse(text(body))

export const formatDate = (date, lang) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
