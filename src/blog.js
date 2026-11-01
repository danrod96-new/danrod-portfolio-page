import { marked } from 'marked'

// Blog posts are JSON files in src/content/blog/ (see the README for the format).
// The body is Markdown, written either as one string or as an array of lines.
const files = import.meta.glob('./content/blog/*.json', { eager: true, import: 'default' })

export const posts = Object.values(files)
  .filter((post) => !(post.draft && import.meta.env.PROD))
  .sort((a, b) => b.date.localeCompare(a.date))

export const findPost = (slug) => posts.find((post) => post.slug === slug)

const text = (body) => (Array.isArray(body) ? body.join('\n') : body ?? '')

export const renderMarkdown = (body) => marked.parse(text(body))

export const readingMinutes = (body) => Math.max(1, Math.round(text(body).split(/\s+/).length / 200))

export const formatDate = (date, lang) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
