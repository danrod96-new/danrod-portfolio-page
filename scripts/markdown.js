// Markdown → HTML for blog posts, with code blocks highlighted by highlight.js. It only runs in Node: the blog plugin
// in vite.config.js uses it while building (and in the dev server), and scripts/prerender.js for the generated pages,
// so visitors get ready-made HTML and the highlighter never ships to the browser. The colours are in src/index.css.
import hljs from 'highlight.js'
import { Marked } from 'marked'

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const marked = new Marked({
  renderer: {
    // ```scilab, ```bash, ```php…: any language highlight.js knows. Without one, or with an unknown one, the code is
    // shown plain rather than guessed at.
    code({ text, lang }) {
      const language = lang?.trim().split(/\s/)[0]
      const known = language && hljs.getLanguage(language)
      const html = known ? hljs.highlight(text, { language, ignoreIllegals: true }).value : escape(text)
      return `<pre><code class="hljs${known ? ` language-${escape(language)}` : ''}">${html}\n</code></pre>\n`
    },
  },
})

const text = (body) => (Array.isArray(body) ? body.join('\n') : body ?? '')

export const renderMarkdown = (body) => marked.parse(text(body))

export const readingMinutes = (body) => Math.max(1, Math.round(text(body).split(/\s+/).length / 200))
