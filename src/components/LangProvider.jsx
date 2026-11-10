import { useLayoutEffect, useMemo, useState } from 'react'
import { LangContext, pick } from '../lang.js'
import { strings } from '../strings.js'
import { setDescription } from '../meta.js'
import { pathFor, stripLang } from '../paths.js'
import { initialLang } from '../preferences.js'

// `initial` fixes the language when there's no visitor to ask: the build-time render in src/entry-server.jsx.
export default function LangProvider({ initial, children }) {
  const [lang, setLang] = useState(() => initial ?? initialLang())

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
