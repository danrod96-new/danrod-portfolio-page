// The home page rendered to HTML at build time, so search engines and link previews that don't run JavaScript still
// see its content. Built with `vite build --ssr` (see the build script in package.json) and called by
// scripts/prerender.js once per language; in the browser, src/main.jsx takes over this HTML.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import LangProvider from './components/LangProvider.jsx'

export function renderHome(lang) {
  return renderToString(
    <StrictMode>
      <LangProvider initial={lang}>
        <App pathname="/" />
      </LangProvider>
    </StrictMode>,
  )
}
