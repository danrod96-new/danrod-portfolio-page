import { projects, skills } from '../data.js'
import Reveal from './Reveal.jsx'

const usage = projects.reduce((acc, p) => {
  for (const t of p.tags) acc[t] = (acc[t] || 0) + 1
  return acc
}, {})

export default function Skills({ onPick }) {
  return (
    <section className="section section--alt" id="skills">
      <div className="container">
        <Reveal className="section__head">
          <span className="section__num mono">04</span>
          <h2>Skills & stack</h2>
          <p className="section__sub">Pick a skill to see the projects where I used it.</p>
        </Reveal>

        <div className="skills">
          {skills.map((g, i) => (
            <Reveal key={g.group} className="skills__group card" delay={i * 70}>
              <h3 className="mono">{g.group}</h3>
              <div className="skills__items">
                {g.items.map((s) => {
                  const n = usage[s] || 0
                  return (
                    <button
                      key={s}
                      className={`skill ${n ? '' : 'skill--plain'}`}
                      disabled={!n}
                      onClick={() => onPick(s)}
                      title={n ? `${n} project${n > 1 ? 's' : ''}` : undefined}
                    >
                      {s}
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
