import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LangProvider from './components/LangProvider.jsx'

// Posts and the privacy policy used to live at #/blog/<slug> and #/privacy; send old links to the new pages.
function redirectOldLink() {
  const old = window.location.hash.match(/^#\/(blog\/[^/]+|privacy)$/)
  if (old) window.location.replace(`/${old[1]}/`)
}
redirectOldLink()
window.addEventListener('hashchange', redirectOldLink)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)
