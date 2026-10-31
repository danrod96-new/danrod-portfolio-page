import { useState } from 'react'
import { experience } from '../data.js'
import Reveal from './Reveal.jsx'
import { useLang } from '../lang.js'

const filters = ['all', 'drupal', 'ops']

export default function Experience() {
  const { t, p } = useLang()
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(0)
  const items = experience.filter((e) => filter === 'all' || e.kind === filter)
  const firstYear = Math.min(...experience.map((e) => e.start))
  const span = new Date().getFullYear() - firstYear

  return (
    <section className="section section--alt" id="experience">
      <div className="container">
        <Reveal className="section__head">
          <h2>{t.experience.title}</h2>
          <p className="section__sub">{t.experience.sub(span)}</p>
        </Reveal>

        <div className="chips" role="tablist" aria-label={t.experience.filterLabel}>
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`chip ${filter === f ? 'is-active' : ''}`}
              onClick={() => {
                setFilter(f)
                setOpen(0)
              }}
            >
              {t.experience.filters[f]}
            </button>
          ))}
        </div>

        <ol className="timeline">
          {items.map((job, i) => {
            const isOpen = open === i
            return (
              <Reveal as="li" key={job.start + p(job.period)} className={`timeline__item ${isOpen ? 'is-open' : ''}`} delay={i * 40}>
                <span className={`timeline__dot timeline__dot--${job.kind}`} aria-hidden="true" />
                <button className="timeline__head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="timeline__period mono">{p(job.period)}</span>
                  <span className="timeline__role">{p(job.role)}</span>
                  <span className="timeline__company">{p(job.company)}</span>
                  <span className="timeline__toggle" aria-hidden="true">+</span>
                </button>
                <div className="timeline__body">
                  <div>
                    <ul>
                      {p(job.highlights).map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                    <div className="tags">
                      {job.tags.map((tg) => (
                        <span className="tag" key={tg}>{tg}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
