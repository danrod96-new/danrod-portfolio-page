import { useEffect, useState } from 'react'
import { profile, stats, education, events } from '../data.js'
import Reveal from './Reveal.jsx'
import { useReveal } from '../hooks/useReveal.js'
import photo from '../assets/daniel.jpg'

function Counter({ value, suffix, format }) {
  const [ref, visible] = useReveal(0.5)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!visible) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, value])

  const shown = format === 'k' ? `${Math.round(n / 1000)}k` : n
  return (
    <span ref={ref} className="stat__value">
      {shown}
      {suffix}
    </span>
  )
}

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal className="section__head">
          <span className="section__num mono">01</span>
          <h2>About me</h2>
        </Reveal>

        <div className="about">
          <Reveal className="about__text">
            <p className="lead">{profile.summary}</p>
            <p>
              I like projects that push me to learn something new. I enjoy explaining technical ideas to people who
              aren’t technical, and I always get a kick out of closing an issue an end user reported. {profile.learning}
            </p>
            <div className="about__meta">
              <div>
                <h3 className="mono">Education</h3>
                <p>{education.degree}</p>
                <p className="muted">{education.school} · {education.period}</p>
                <p className="muted">{education.cert}</p>
              </div>
              <div>
                <h3 className="mono">Community</h3>
                <ul className="plain">
                  {events.map((e) => (
                    <li key={e.name}>
                      <span className="muted mono">{e.year}</span> {e.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <div className="about__side">
            <Reveal as="figure" className="portrait">
              <div className="portrait__frame">
                <img src={photo} alt={`Portrait of ${profile.name}`} width="460" height="460" loading="lazy" />
              </div>
              <figcaption className="portrait__badge mono">
                <span className="pulse" /> {profile.location.split(' · ')[0]}
              </figcaption>
            </Reveal>
            <div className="stats">
              {stats.map((s, i) => (
                <Reveal key={s.label} className="stat card" delay={i * 90}>
                  <Counter {...s} />
                  <span className="stat__label">{s.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
