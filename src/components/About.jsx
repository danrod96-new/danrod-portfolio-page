import { useEffect, useState } from 'react'
import { profile, stats, education, events } from '../data.js'
import Reveal from './Reveal.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { useLang } from '../lang.js'
import photo from '../assets/daniel.jpg'

function Counter({ value, suffix, format }) {
  const [ref, visible] = useReveal(0.5)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!visible) return
    // No count-up for visitors who ask for less motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(value)
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

  const show = (x) => `${format === 'k' ? `${Math.round(x / 1000)}k` : x}${suffix ?? ''}`
  // The count-up is only for the eye: screen readers, and search engines reading the build-time HTML (which starts
  // at 0), get the final number.
  return (
    <span ref={ref} className="stat__value">
      <span aria-hidden="true">{show(n)}</span>
      <span className="sr-only">{show(value)}</span>
    </span>
  )
}

export default function About() {
  const { t, p } = useLang()

  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal className="section__head">
          <h2>{t.about.title}</h2>
        </Reveal>

        <div className="about">
          <Reveal className="about__text">
            <p className="lead">{p(profile.summary)}</p>
            <p>
              {t.about.body} {p(profile.learning)}
            </p>
            <div className="about__meta">
              <div>
                <h3 className="mono">{t.about.education}</h3>
                <p>{p(education.degree)}</p>
                <p className="muted">{education.school} · {education.period}</p>
                <p className="muted">{education.cert}</p>
              </div>
              <div>
                <h3 className="mono">{t.about.community}</h3>
                <ul className="plain">
                  {events.map((e) => (
                    <li key={e.year + p(e.name)}>
                      <span className="muted mono">{e.year}</span> {p(e.name)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <div className="about__side">
            <Reveal as="figure" className="portrait">
              <div className="portrait__frame">
                <img src={photo} alt={t.about.portrait(profile.name)} width="460" height="460" loading="lazy" />
              </div>
              <figcaption className="portrait__badge mono">
                <span className="pulse" /> {p(profile.location).split(' · ')[0]}
              </figcaption>
            </Reveal>
            <div className="stats">
              {stats.map((s, i) => (
                <Reveal key={s.value} className="stat card" delay={i * 90}>
                  <Counter {...s} />
                  <span className="stat__label">{p(s.label)}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
