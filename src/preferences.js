// What the visitor sees first: language, theme and motion. src/main.jsx also checks them to decide whether the
// home page's build-time HTML (src/entry-server.jsx) already matches this visitor.
import { languages } from './lang.js'
import { langFromPath } from './paths.js'

// An /es/ address is always Spanish. Other addresses use the visitor's saved choice, then the browser language,
// and move to /es/ when that is Spanish.
export function initialLang() {
  if (langFromPath(window.location.pathname) === 'es') return 'es'
  try {
    const saved = localStorage.getItem('lang')
    if (languages.includes(saved)) return saved
  } catch {
    // storage unavailable
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

// Dark on the first visit, whatever the system setting; after that, the visitor's own choice.
export function initialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
  } catch {
    // storage unavailable
  }
  return 'dark'
}

// False in the build-time render, which has no window.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
