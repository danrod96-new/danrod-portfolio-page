import { useEffect, useState } from 'react'
import NetworkCanvas from './NetworkCanvas.jsx'
import { profile } from '../data.js'

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
  const role = useTypewriter(profile.roles)

  return (
    <header className="hero" id="top">
      <NetworkCanvas />
      <div className="hero__inner container">
        <p className="eyebrow mono">
          <span className="pulse" /> Available for Drupal & full stack projects
        </p>
        <h1 className="hero__title">
          Hi, I’m <span className="gradient-text">{profile.name}</span>
        </h1>
        <p className="hero__role mono" aria-label={profile.roles.join(', ')}>
          <span className="prompt">&gt;</span> {role}
          <span className="caret" aria-hidden="true" />
        </p>
        <p className="hero__lead">
          15+ years building, migrating and maintaining Drupal sites — from Drupal 6 to Drupal 11 — for
          newspapers, universities, associations and e-commerce platforms. I also write the modules other Drupal
          sites depend on.
        </p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#work">
            View my work
          </a>
          <a className="btn btn--ghost" href="#contact">
            Get in touch
          </a>
        </div>
        <ul className="hero__social">
          <li><a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a href={profile.links.drupal} target="_blank" rel="noreferrer">Drupal.org</a></li>
          <li><a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
        </ul>
      </div>
      <a className="scroll-hint" href="#about" aria-label="Scroll to about">
        <span />
      </a>
    </header>
  )
}
