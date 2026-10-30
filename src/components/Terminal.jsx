import { useEffect, useRef, useState } from 'react'
import { experience, profile, projects, skills } from '../data.js'
import Reveal from './Reveal.jsx'

const commands = {
  help: () => [
    'Available commands:',
    '  whoami      who is this guy?',
    '  experience  career history',
    '  modules     my Drupal.org projects',
    '  skills      the stack',
    '  contact     how to reach me',
    '  uname -a    system info',
    '  clear       clear the screen',
  ],
  whoami: () => [`${profile.name} — ${profile.title}`, profile.location],
  experience: () => experience.map((e) => `${e.period.padEnd(20)} ${e.role} @ ${e.company}`),
  modules: () =>
    projects.filter((p) => p.category === 'contrib').map((p) => `${p.title.padEnd(32)} ${p.role.padEnd(12)} ${p.metric}`),
  skills: () => skills.map((g) => `${g.group}: ${g.items.join(', ')}`),
  contact: () => [`email:    ${profile.email}`, `github:   ${profile.links.github}`, `drupal:   ${profile.links.drupal}`, `linkedin: ${profile.links.linkedin}`],
  'uname -a': () => ['GNU/Linux danrod-portfolio 6.17 x86_64 — 10+ years of uptime as a sysadmin'],
  ls: () => ['about  experience  work  skills  contact'],
  sudo: () => ['Nice try. This incident will be reported. 🙂'],
  'rm -rf /': () => ['Permission denied. (I’ve done Linux too long to fall for that.)'],
}

export default function Terminal() {
  const [lines, setLines] = useState([{ type: 'out', text: 'Welcome! Type `help` to get started.' }])
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
    const out = fn ? fn() : [`command not found: ${cmd}. Try \`help\`.`]
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
          <span className="section__num mono">05</span>
          <h2>Prefer the command line?</h2>
          <p className="section__sub">Me too. Try a few commands.</p>
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
                {l.text}
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
                aria-label="Terminal input"
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
