import { useEffect, useRef, useState } from 'react'
import { experience, profile, projects, skills } from '../data.js'
import Reveal from './Reveal.jsx'
import { useLang } from '../lang.js'

// Command names stay in English (it's a shell); their output follows the selected language.
function buildCommands(t, p) {
  return {
    help: () => t.terminal.help,
    whoami: () => [`${profile.name} — ${p(profile.title)}`, p(profile.location)],
    experience: () => experience.map((e) => `${p(e.period).padEnd(20)} ${p(e.role)} @ ${p(e.company)}`),
    modules: () =>
      projects.filter((pr) => pr.category === 'contrib').map((pr) => `${p(pr.title).padEnd(32)} ${p(pr.role).padEnd(12)} ${p(pr.metric)}`),
    skills: () => skills.map((g) => `${p(g.group)}: ${g.items.join(', ')}`),
    contact: () => [`${t.terminal.form.padEnd(10)}${t.terminal.formHint}`, `github:   ${profile.links.github}`, `drupal:   ${profile.links.drupal}`, `linkedin: ${profile.links.linkedin}`],
    'uname -a': () => [t.terminal.uname],
    ls: () => ['about  experience  work  skills  contact'],
    sudo: () => [t.terminal.sudo],
    'rm -rf /': () => [t.terminal.rm],
  }
}

export default function Terminal() {
  const { t, p } = useLang()
  const commands = buildCommands(t, p)
  const [lines, setLines] = useState([{ type: 'welcome' }])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [hIndex, setHIndex] = useState(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  function run(raw) {
    const cmd = raw.trim()
    if (!cmd) return
    setHistory((h) => [cmd, ...h])
    setHIndex(-1)
    if (cmd === 'clear') return setLines([])
    const fn = commands[cmd] || commands[cmd.split(' ')[0]]
    const out = fn ? fn() : [t.terminal.notFound(cmd)]
    setLines((l) => [...l, { type: 'in', text: cmd }, ...out.map((text) => ({ type: 'out', text }))])
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = Math.min(hIndex + 1, history.length - 1)
      setHIndex(i)
      setValue(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIndex - 1
      setHIndex(i)
      setValue(i >= 0 ? history[i] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = Object.keys(commands).find((c) => c.startsWith(value) && value)
      if (match) setValue(match)
    }
  }

  return (
    <section className="section" id="terminal">
      <div className="container">
        <Reveal className="section__head">
          <h2>{t.terminal.title}</h2>
          <p className="section__sub">{t.terminal.sub}</p>
        </Reveal>
        <Reveal className="terminal" onClick={() => inputRef.current?.focus()}>
          <div className="terminal__bar">
            <span /><span /><span />
            <p className="mono">danrod@portfolio: ~</p>
          </div>
          <div className="terminal__body mono" ref={bodyRef} aria-live="polite">
            {lines.map((l, i) => (
              <div key={i} className={`terminal__line terminal__line--${l.type}`}>
                {l.type === 'in' && <span className="terminal__ps">danrod@portfolio:~$ </span>}
                {l.type === 'welcome' ? t.terminal.welcome : l.text}
              </div>
            ))}
            <div className="terminal__line terminal__line--in">
              <span className="terminal__ps">danrod@portfolio:~$ </span>
              <input
                ref={inputRef}
                className="terminal__input mono"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label={t.terminal.input}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
          <div className="terminal__quick">
            {['help', 'whoami', 'modules', 'contact'].map((c) => (
              <button key={c} className="chip mono" onClick={(e) => { e.stopPropagation(); run(c) }}>
                {c}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
