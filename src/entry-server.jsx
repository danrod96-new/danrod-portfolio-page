// The home page and the /blog/ page rendered to HTML at build time, so search engines and link previews that don't
// run JavaScript still see their content. Built with `vite build --ssr` (see the build script in package.json) and
// called by scripts/prerender.js once per page and language; in the browser, src/main.jsx takes over this HTML.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import LangProvider from './components/LangProvider.jsx'

// `path` is the page's address without the language: '/' or '/blog/'.
export function renderPage(lang, path) {
  return renderToString(
    <StrictMode>
      <LangProvider initial={lang}>
        <App pathname={path} />
      </LangProvider>
    </StrictMode>,
  )
}
