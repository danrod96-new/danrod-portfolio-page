import { useLayoutEffect, useMemo, useState } from 'react'
import { LangContext, languages, pick } from '../lang.js'
import { strings } from '../strings.js'
import { setDescription } from '../meta.js'
import { langFromPath, pathFor, stripLang } from '../paths.js'

// An /es/ address is always Spanish. Other addresses use the visitor's saved choice, then the browser language,
// and move to /es/ when that is Spanish.
function initialLang() {
  if (langFromPath(window.location.pathname) === 'es') return 'es'
  try {
    const saved = localStorage.getItem('lang')
    if (languages.includes(saved)) return saved
  } catch {
    // storage unavailable
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export default function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  // A layout effect runs before every useEffect, so a blog post's own title and description
  // (set in BlogPost's useEffect) win over these defaults when the language changes.
  useLayoutEffect(() => {
    document.documentElement.lang = lang
    // Keep the address in step with the language (the switch swaps / and /es/ without reloading the page).
    const { pathname, search, hash } = window.location
    const path = pathFor(lang, stripLang(pathname))
    if (path !== pathname) window.history.replaceState(window.history.state, '', path + search + hash)
    document.title = strings[lang].meta.title
    setDescription(strings[lang].meta.description)
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // storage unavailable
    }
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: strings[lang],
      p: (v) => pick(v, lang),
      tag: (name) => strings[lang].tags[name] ?? name,
      // A page's address in the current language: path('/privacy/') → /es/privacy/ in Spanish.
      path: (to) => pathFor(lang, to),
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
