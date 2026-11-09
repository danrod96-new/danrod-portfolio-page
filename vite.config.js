import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readingMinutes, renderMarkdown } from './scripts/markdown.js'

// Each language's value of a post field: { en, es } or a single value for both.
const perLang = (value, fn) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value).map(([lang, v]) => [lang, fn(v)]))
    : fn(value)

// Blog posts (src/content/blog/*.json) reach the app with their Markdown `body` already turned into `html`, code
// highlighting included, plus `minutes` of reading time. The Markdown itself isn't sent to the browser.
const blogPosts = {
  name: 'blog-posts',
  enforce: 'pre',
  transform(code, id) {
    if (!/\/src\/content\/blog\/[^/]+\.json$/.test(id)) return
    const { body, ...post } = JSON.parse(code)
    return { code: JSON.stringify({ ...post, html: perLang(body, renderMarkdown), minutes: perLang(body, readingMinutes) }), map: null }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [blogPosts, react()],
  // Served from the root of https://danrod.ca (custom domain set in public/CNAME)
  base: '/',
})
