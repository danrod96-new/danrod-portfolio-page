import { useEffect, useState } from 'react'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav({ theme, onToggleTheme }) {
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
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} aria-label="Main">
      <div className="nav__progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="container nav__inner">
        <a href="#top" className="nav__logo mono" onClick={() => setOpen(false)}>
          <span className="muted">~/</span>
          <span className="gradient-text">danrod</span>
        </a>
        <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <ul className="nav__links">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={active === s.id ? 'is-active' : ''} onClick={() => setOpen(false)}>
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
