import { useEffect, useState } from 'react'
import { languages, useLang } from '../lang.js'

const sections = ['about', 'experience', 'work', 'skills', 'blog', 'contact']

export default function Nav({ theme, onToggleTheme, page }) {
  const { t, lang, setLang } = useLang()
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [page])

  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} aria-label="Main">
      <div className="nav__progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="container nav__inner">
        <a href="#top" className="nav__logo mono" onClick={() => setOpen(false)}>
          <span className="muted">~/</span>
          <span className="gradient-text">danrod</span>
        </a>
        <button className="nav__burger" aria-label={t.nav.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <ul className="nav__links">
          {sections.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className={active === id || (page === 'post' && id === 'blog') ? 'is-active' : ''} onClick={() => setOpen(false)}>
                {t.nav[id]}
              </a>
            </li>
          ))}
          <li className="nav__controls">
            <div className="lang-switch mono" role="group" aria-label={t.nav.language}>
              {languages.map((l) => (
                <button
                  key={l}
                  lang={l}
                  className={lang === l ? 'is-active' : ''}
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="theme-toggle" onClick={onToggleTheme} aria-label={t.nav.theme(nextTheme)}>
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
