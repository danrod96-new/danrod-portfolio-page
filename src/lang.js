import { createContext, useContext } from 'react'

export const languages = ['en', 'es']

export const LangContext = createContext(null)

// Content values are either plain (same in every language) or { en, es }.
export function pick(value, lang) {
  return value && typeof value === 'object' && !Array.isArray(value) && 'en' in value ? value[lang] ?? value.en : value
}

export function useLang() {
  return useContext(LangContext)
}
