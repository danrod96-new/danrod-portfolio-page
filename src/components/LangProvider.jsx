import { useEffect, useMemo, useState } from 'react'
import { LangContext, languages, pick } from '../lang.js'
import { strings } from '../strings.js'

function initialLang() {
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

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = strings[lang].meta.title
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
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
