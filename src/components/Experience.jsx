import { useState } from 'react'
import { experience } from '../data.js'
import Reveal from './Reveal.jsx'

const filters = [
  { id: 'all', label: 'Everything' },
  { id: 'drupal', label: 'Drupal & web' },
  { id: 'ops', label: 'Linux & ops' },
]

export default function Experience() {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(0)
  const items = experience.filter((e) => filter === 'all' || e.kind === filter)
  const firstYear = Math.min(...experience.map((e) => e.start))
  const span = new Date().getFullYear() - firstYear

  return (
    <section className="section section--alt" id="experience">
      <div className="container">
        <Reveal className="section__head">
          <span className="section__num mono">02</span>
          <h2>Experience</h2>
          <p className="section__sub">{span} years, from El Tiempo’s server farm to Drupal 11 platforms in Canada.</p>
        </Reveal>

        <div className="chips" role="tablist" aria-label="Filter experience">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`chip ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => {
                setFilter(f.id)
                setOpen(0)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ol className="timeline">
          {items.map((job, i) => {
            const isOpen = open === i
            return (
              <Reveal as="li" key={job.company + job.period} className={`timeline__item ${isOpen ? 'is-open' : ''}`} delay={i * 40}>
                <span className={`timeline__dot timeline__dot--${job.kind}`} aria-hidden="true" />
                <button className="timeline__head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="timeline__period mono">{job.period}</span>
                  <span className="timeline__role">{job.role}</span>
                  <span className="timeline__company">{job.company}</span>
                  <span className="timeline__toggle" aria-hidden="true">+</span>
                </button>
                <div className="timeline__body">
                  <div>
                    <ul>
                      {job.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                    <div className="tags">
                      {job.tags.map((t) => (
                        <span className="tag" key={t}>{t}</span>
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
