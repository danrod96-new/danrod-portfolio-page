import { useEffect, useState } from 'react'
import NetworkCanvas from './NetworkCanvas.jsx'
import { profile } from '../data.js'
import { useLang } from '../lang.js'

function useTypewriter(words, speed = 70, pause = 1600) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    const done = !deleting && text === word
    const cleared = deleting && text === ''
    const delay = done ? pause : deleting ? speed / 2 : speed
    const t = setTimeout(() => {
      if (done) setDeleting(true)
      else if (cleared) {
        setDeleting(false)
        setIndex((i) => i + 1)
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, index, words, speed, pause])

  return text
}

export default function Hero() {
  const { t, p } = useLang()
  const roles = p(profile.roles)
  const role = useTypewriter(roles)

  return (
    <header className="hero" id="top">
      <NetworkCanvas />
      <div className="hero__inner container">
        <p className="eyebrow mono">
          <span className="pulse" /> {t.hero.available}
        </p>
        <h1 className="hero__title">
          {t.hero.hi} <span className="gradient-text">{profile.name}</span>
        </h1>
        <p className="hero__role mono" aria-label={roles.join(', ')}>
          <span className="prompt">&gt;</span> {role}
          <span className="caret" aria-hidden="true" />
        </p>
        <p className="hero__lead">{t.hero.lead}</p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#work">
            {t.hero.work}
          </a>
          <a className="btn btn--ghost" href="#contact">
            {t.hero.contact}
          </a>
        </div>
        <ul className="hero__social">
          <li><a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a href={profile.links.drupal} target="_blank" rel="noreferrer">Drupal.org</a></li>
          <li><a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
        </ul>
      </div>
      <a className="scroll-hint" href="#about" aria-label={t.hero.scroll}>
        <span />
      </a>
    </header>
  )
}
