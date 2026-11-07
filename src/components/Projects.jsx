import { useEffect, useMemo, useState } from 'react'
import { categories, projects } from '../data.js'
import Reveal from './Reveal.jsx'
import { useLang } from '../lang.js'

const shots = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/sites/*.webp', { eager: true, import: 'default' })).map(([path, url]) => [
    path.split('/').pop().replace('.webp', ''),
    url,
  ]),
)

const domain = (url) => url && new URL(url).hostname.replace(/^www\./, '')

// Screenshot inside a small browser frame; client sites without one get a placeholder with the domain.
// App screenshots (no url) show their window label in the bar instead.
function BrowserShot({ project, large = false }) {
  const { t, p } = useLang()
  const src = shots[project.shot]
  const label = p(project.window) ?? domain(project.url)
  return (
    <span className={`browser ${large ? 'browser--large' : ''}`}>
      <span className="browser__bar" aria-hidden="true">
        <i /><i /><i />
        <span className="browser__url mono">{label}</span>
      </span>
      {src ? (
        <img className="browser__img" src={src} alt={p(project.alt) ?? t.work.shotAlt(label)} loading="lazy" />
      ) : (
        <span className="browser__empty mono" aria-hidden="true">{label}</span>
      )}
    </span>
  )
}

// Artwork such as a module logo, shown without the browser frame.
function Cover({ project }) {
  const { t, p } = useLang()
  return <img className="cover" src={shots[project.cover]} alt={p(project.alt) ?? t.work.coverAlt(project.title)} loading="lazy" />
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
  const { t, p, tag } = useLang()
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
        <button className="modal__close" onClick={onClose} aria-label={t.work.close} autoFocus>
          ×
        </button>
        <p className="mono muted">
          {t.work.category[project.category]} · {project.year} · {p(project.role)}
        </p>
        {project.cover && (
          <figure className="modal__shot">
            <Cover project={project} />
          </figure>
        )}
        {(project.category === 'client' || project.shot) && (
          <figure className="modal__shot">
            <BrowserShot project={project} large />
            {project.shot && project.url && <figcaption className="muted">{t.work.shotCaption}</figcaption>}
          </figure>
        )}
        <h3 id="modal-title">{p(project.title)}</h3>
        <p className="modal__metric gradient-text">{p(project.metric)}</p>
        <p>{p(project.description)}</p>
        <div className="tags">
          {project.tags.map((tg) => (
            <span className="tag" key={tg}>{tag(tg)}</span>
          ))}
        </div>
        <div className="modal__links">
          {project.url && (
            <a className="btn btn--primary" href={project.url} target="_blank" rel="noreferrer">
              {project.category === 'contrib' ? t.work.viewDrupal : t.work.visit} ↗
            </a>
          )}
          {project.atoms && (
            <a className="btn btn--primary" href={project.atoms} target="_blank" rel="noreferrer">
              {t.work.viewAtoms} ↗
            </a>
          )}
          {project.repo && (
            <a className="btn btn--ghost" href={project.repo} target="_blank" rel="noreferrer">
              {t.work.source} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects({ tag: activeTag, onClearTag }) {
  const { t, p, tag } = useLang()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  // A skill picked from the Skills section searches across every category.
  useEffect(() => {
    if (activeTag) setCategory('all')
  }, [activeTag])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects
      .filter((pr) => category === 'all' || pr.category === category)
      .filter((pr) => !activeTag || pr.tags.includes(activeTag))
      .filter((pr) => !q || [p(pr.title), p(pr.description), ...pr.tags, ...pr.tags.map(tag)].join(' ').toLowerCase().includes(q))
  }, [category, query, activeTag, p, tag])

  const counts = useMemo(() => {
    const c = { all: projects.length }
    for (const pr of projects) c[pr.category] = (c[pr.category] || 0) + 1
    return c
  }, [])

  return (
    <section className="section" id="work">
      <div className="container">
        <Reveal className="section__head">
          <h2>{t.work.title}</h2>
          <p className="section__sub">{t.work.sub}</p>
        </Reveal>

        <div className="toolbar">
          <div className="chips" role="tablist" aria-label={t.work.filterLabel}>
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                className={`chip ${category === c ? 'is-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {t.work.categories[c]} <span className="chip__count">{counts[c]}</span>
              </button>
            ))}
          </div>
          <label className="search">
            <span className="sr-only">{t.work.search}</span>
            <input type="search" placeholder={t.work.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </div>

        {activeTag && (
          <p className="active-tag">
            {t.work.tagged} <strong>{tag(activeTag)}</strong>
            <button className="link" onClick={onClearTag}>{t.work.clear}</button>
          </p>
        )}

        <div className="grid">
          {list.map((pr) => (
            <button
              key={pr.url || pr.repo}
              className={`project card project--${pr.category}`}
              onMouseMove={tilt}
              onMouseLeave={untilt}
              onClick={() => setSelected(pr)}
            >
              <span className="project__glow" aria-hidden="true" />
              {pr.cover && <Cover project={pr} />}
              {(pr.category === 'client' || pr.shot) && <BrowserShot project={pr} />}
              <span className="project__top">
                <span className="project__cat mono">{t.work.category[pr.category]}</span>
                <span className="project__year mono">{pr.year}</span>
              </span>
              <span className="project__title">{p(pr.title)}</span>
              <span className="project__metric">{p(pr.metric)}</span>
              <span className="project__desc">{p(pr.description)}</span>
              <span className="tags">
                {pr.tags.slice(0, 4).map((tg) => (
                  <span className={`tag ${tg === activeTag ? 'is-match' : ''}`} key={tg}>{tag(tg)}</span>
                ))}
              </span>
            </button>
          ))}
          {list.length === 0 && <p className="empty">{t.work.empty}</p>}
        </div>
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
