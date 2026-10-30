import { useState } from 'react'
import { profile } from '../data.js'
import Reveal from './Reveal.jsx'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const links = [
    { label: 'GitHub', sub: 'danrod96-new', href: profile.links.github },
    { label: 'GitHub (archive)', sub: 'danrod96', href: profile.links.githubOld },
    { label: 'Drupal.org', sub: 'u/danrod', href: profile.links.drupal },
    { label: 'LinkedIn', sub: 'Daniel Rodriguez', href: profile.links.linkedin },
  ]

  return (
    <section className="section section--alt" id="contact">
      <div className="container contact">
        <Reveal className="section__head">
          <span className="section__num mono">06</span>
          <h2>Let’s build something</h2>
          <p className="section__sub">
            Drupal builds, migrations and upgrades, custom modules, accessibility work or DevOps — I’m happy to talk it through.
          </p>
        </Reveal>
        <Reveal className="contact__card card">
          <a className="contact__email gradient-text" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="contact__actions">
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>Send an email</a>
            <button className="btn btn--ghost" onClick={copy}>{copied ? 'Copied ✓' : 'Copy address'}</button>
          </div>
          <ul className="contact__links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  <span>{l.label}</span>
                  <span className="muted mono">{l.sub} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
