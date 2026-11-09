import { useEffect, useState } from 'react'
import NetworkCanvas from './NetworkCanvas.jsx'
import { profile } from '../data.js'
import { useLang } from '../lang.js'

// Types each role in turn. While paused it shows the current role in full and stops.
function useTypewriter(words, paused, speed = 70, pause = 1600) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const word = words[index % words.length]

  useEffect(() => {
    if (paused) return
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
  }, [text, deleting, word, paused, speed, pause])

  return paused ? word : text
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Hero() {
  const { t, p } = useLang()
  const roles = p(profile.roles)
  // Moving content needs a way to stop it (WCAG 2.2.2); it starts stopped for visitors who ask for less motion.
  const [paused, setPaused] = useState(prefersReducedMotion)
  const role = useTypewriter(roles, paused)

  return (
    <header className={`hero ${paused ? 'is-paused' : ''}`} id="top">
      <NetworkCanvas paused={paused} />
      <div className="hero__inner container">
        <p className="eyebrow mono">
          <span className="pulse" /> {t.hero.available}
        </p>
        <h1 className="hero__title">
          {t.hero.hi} <span className="gradient-text">{profile.name}</span>
        </h1>
        <p className="hero__role mono">
          <span className="sr-only">{roles.join(', ')}</span>
          <span aria-hidden="true">
            <span className="prompt">&gt;</span> {role}
            <span className="caret" />
          </span>
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
          <li><a href={profile.links.github} target="_blank" rel="noreferrer">GitHub<span className="sr-only"> {t.newTab}</span></a></li>
          <li><a href={profile.links.drupal} target="_blank" rel="noreferrer">Drupal.org<span className="sr-only"> {t.newTab}</span></a></li>
          <li><a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn<span className="sr-only"> {t.newTab}</span></a></li>
        </ul>
      </div>
      <button className="hero__pause mono" onClick={() => setPaused(!paused)}>
        <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span> {paused ? t.hero.play : t.hero.pause}
      </button>
      <a className="scroll-hint" href="#about" aria-label={t.hero.scroll}>
        <span />
      </a>
    </header>
  )
}
