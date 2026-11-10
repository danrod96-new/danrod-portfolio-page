import { useEffect, useState } from 'react'
import { languages, useLang } from '../lang.js'
import Flag from './Flag.jsx'

const sections = ['about', 'work', 'skills', 'blog', 'contact']
// public/Daniel-Rodriguez-Resume.pdf: the CV without the address, phone numbers and email.
const resume = `${import.meta.env.BASE_URL}Daniel-Rodriguez-Resume.pdf`

export default function Nav({ theme, onToggleTheme, page }) {
  const { t, lang, setLang, path } = useLang()
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
  // Section links point back to the home page from a post or the privacy page.
  const home = page === 'home' ? '' : path('/')

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} aria-label="Main">
      <div className="nav__progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="container nav__inner">
        <a href={home || '#top'} className="nav__logo mono" onClick={() => setOpen(false)}>
          <span className="muted">~/</span>
          <span className="gradient-text">danrod</span>
        </a>
        <button className="nav__burger" aria-label={t.nav.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <ul className="nav__links">
          {sections.map((id) => (
            <li key={id}>
              <a href={`${home}#${id}`} className={(page === 'home' && active === id) || ((page === 'post' || page === 'blog') && id === 'blog') ? 'is-active' : ''} onClick={() => setOpen(false)}>
                {t.nav[id]}
              </a>
            </li>
          ))}
          <li>
            <a href={resume} target="_blank" rel="noreferrer" aria-label={t.nav.resumeLabel} onClick={() => setOpen(false)}>
              {t.nav.resume} <span aria-hidden="true">↗</span>
            </a>
          </li>
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
                  <Flag lang={l} />
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
