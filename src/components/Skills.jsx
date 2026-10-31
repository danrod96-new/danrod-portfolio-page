import { projects, skills } from '../data.js'
import Reveal from './Reveal.jsx'
import { useLang } from '../lang.js'

const usage = projects.reduce((acc, p) => {
  for (const t of p.tags) acc[t] = (acc[t] || 0) + 1
  return acc
}, {})

export default function Skills({ onPick }) {
  const { t, p, tag } = useLang()

  return (
    <section className="section section--alt" id="skills">
      <div className="container">
        <Reveal className="section__head">
          <h2>{t.skills.title}</h2>
          <p className="section__sub">{t.skills.sub}</p>
        </Reveal>

        <div className="skills">
          {skills.map((g, i) => (
            <Reveal key={i} className="skills__group card" delay={i * 70}>
              <h3 className="mono">{p(g.group)}</h3>
              <div className="skills__items">
                {g.items.map((s) => {
                  const n = usage[s] || 0
                  return (
                    <button
                      key={s}
                      className={`skill ${n ? '' : 'skill--plain'}`}
                      disabled={!n}
                      onClick={() => onPick(s)}
                      title={n ? t.skills.count(n) : undefined}
                    >
                      {tag(s)}
                      {n > 0 && <span className="skill__n">{n}</span>}
                    </button>
                  )
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
