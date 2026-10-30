import { useEffect, useMemo, useState } from 'react'
import { categories, projects } from '../data.js'
import Reveal from './Reveal.jsx'

const categoryLabel = { contrib: 'Drupal.org', client: 'Client site', oss: 'Open source' }

const shots = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/sites/*.webp', { eager: true, import: 'default' })).map(([path, url]) => [
    path.split('/').pop().replace('.webp', ''),
    url,
  ]),
)

const domain = (url) => url && new URL(url).hostname.replace(/^www\./, '')

// Screenshot inside a small browser frame; client sites without one get a placeholder with the domain.
function BrowserShot({ project, large = false }) {
  const src = shots[project.shot]
  return (
    <span className={`browser ${large ? 'browser--large' : ''}`}>
      <span className="browser__bar" aria-hidden="true">
        <i /><i /><i />
        <span className="browser__url mono">{domain(project.url)}</span>
      </span>
      {src ? (
        <img className="browser__img" src={src} alt={`Screenshot of ${domain(project.url)}`} loading="lazy" />
      ) : (
        <span className="browser__empty mono" aria-hidden="true">{domain(project.url)}</span>
      )}
    </span>
  )
}

function tilt(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`)
  el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`)
  el.style.setProperty('--mx', `${x * 100}%`)
  el.style.setProperty('--my', `${y * 100}%`)
}

function untilt(e) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={onClose}>
      <div className="modal__panel card" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close" autoFocus>
          ×
        </button>
        <p className="mono muted">
          {categoryLabel[project.category]} · {project.year} · {project.role}
        </p>
        {project.category === 'client' && (
          <figure className="modal__shot">
            <BrowserShot project={project} large />
            {project.shot && <figcaption className="muted">The live site as of October 2026 — it may have changed since my work on it.</figcaption>}
          </figure>
        )}
        <h3 id="modal-title">{project.title}</h3>
        <p className="modal__metric gradient-text">{project.metric}</p>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
        <div className="modal__links">
          {project.url && (
            <a className="btn btn--primary" href={project.url} target="_blank" rel="noreferrer">
              {project.category === 'contrib' ? 'View on Drupal.org' : 'Visit site'} ↗
            </a>
          )}
          {project.repo && (
            <a className="btn btn--ghost" href={project.repo} target="_blank" rel="noreferrer">
              Source code ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects({ tag, onClearTag }) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  // A skill picked from the Skills section searches across every category.
  useEffect(() => {
    if (tag) setCategory('all')
  }, [tag])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => !tag || p.tags.includes(tag))
      .filter((p) => !q || [p.title, p.description, ...p.tags].join(' ').toLowerCase().includes(q))
  }, [category, query, tag])

  const counts = useMemo(() => {
    const c = { all: projects.length }
    for (const p of projects) c[p.category] = (c[p.category] || 0) + 1
    return c
  }, [])

  return (
    <section className="section" id="work">
      <div className="container">
        <Reveal className="section__head">
          <span className="section__num mono">03</span>
          <h2>Selected work</h2>
          <p className="section__sub">Contrib modules, client sites and open source projects. Click any card for details.</p>
        </Reveal>

        <div className="toolbar">
          <div className="chips" role="tablist" aria-label="Filter projects">
            {categories.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={category === c.id}
                className={`chip ${category === c.id ? 'is-active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label} <span className="chip__count">{counts[c.id]}</span>
              </button>
            ))}
          </div>
          <label className="search">
            <span className="sr-only">Search projects</span>
            <input type="search" placeholder="Search… e.g. commerce, react, a11y" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </div>

        {tag && (
          <p className="active-tag">
            Showing projects tagged <strong>{tag}</strong>
            <button className="link" onClick={onClearTag}>clear</button>
          </p>
        )}

        <div className="grid">
          {list.map((p) => (
            <button
              key={p.title}
              className={`project card project--${p.category}`}
              onMouseMove={tilt}
              onMouseLeave={untilt}
              onClick={() => setSelected(p)}
            >
              <span className="project__glow" aria-hidden="true" />
              {p.category === 'client' && <BrowserShot project={p} />}
              <span className="project__top">
                <span className="project__cat mono">{categoryLabel[p.category]}</span>
                <span className="project__year mono">{p.year}</span>
              </span>
              <span className="project__title">{p.title}</span>
              <span className="project__metric">{p.metric}</span>
              <span className="project__desc">{p.description}</span>
              <span className="tags">
                {p.tags.slice(0, 4).map((t) => (
                  <span className={`tag ${t === tag ? 'is-match' : ''}`} key={t}>{t}</span>
                ))}
              </span>
            </button>
          ))}
          {list.length === 0 && <p className="empty">Nothing matches that filter yet.</p>}
        </div>
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
