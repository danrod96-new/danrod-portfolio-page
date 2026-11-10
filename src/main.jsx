import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadStats } from './analytics.js'
import LangProvider from './components/LangProvider.jsx'
import { initialLang, initialTheme, prefersReducedMotion } from './preferences.js'

// Posts and the privacy policy used to live at #/blog/<slug> and #/privacy; send old links to the new pages
// (the language provider then moves Spanish readers to /es/).
function redirectOldLink() {
  const old = window.location.hash.match(/^#\/(blog\/[^/]+|privacy)$/)
  if (old) window.location.replace(`/${old[1]}/`)
}
redirectOldLink()
window.addEventListener('hashchange', redirectOldLink)

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>
)
// The home page arrives already rendered (src/entry-server.jsx, marked data-ssr) in the page's language, with the
// dark theme and full motion. When that's also what this visitor gets, React takes over the existing HTML; otherwise
// it renders afresh, as it does for every other page (their HTML is a plain-markup preview).
const matches =
  'ssr' in root.dataset &&
  initialLang() === document.documentElement.lang &&
  initialTheme() === 'dark' &&
  !prefersReducedMotion()
if (matches) hydrateRoot(root, app)
else createRoot(root).render(app)

// Once the page has loaded, so a Spanish reader is counted at the /es/ address the language provider moves them to.
window.addEventListener('load', loadStats, { once: true })
