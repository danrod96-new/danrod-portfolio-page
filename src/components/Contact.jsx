import { useState } from 'react'
import { contactForm, profile } from '../data.js'
import Reveal from './Reveal.jsx'
import { useLang } from '../lang.js'

const empty = { name: '', email: '', message: '' }

export default function Contact() {
  const { t, path } = useLang()
  const [fields, setFields] = useState(empty)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  function update(e) {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch(contactForm.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactForm.accessKey,
          subject: t.contact.subject(fields.name),
          from_name: 'danrod.ca',
          ...fields,
          // Hidden honeypot: people never tick it, bots that fill every field do.
          botcheck: form.botcheck.checked,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setStatus('sent')
      setFields(empty)
    } catch {
      setStatus('error')
    }
  }

  const links = [
    { label: 'GitHub', sub: 'danrod96-new', href: profile.links.github },
    { label: t.contact.archive, sub: 'danrod96', href: profile.links.githubOld },
    { label: 'Drupal.org', sub: 'u/danrod', href: profile.links.drupal },
    { label: 'LinkedIn', sub: 'Daniel Rodriguez', href: profile.links.linkedin },
  ]

  return (
    <section className="section section--alt" id="contact">
      <div className="container contact">
        <Reveal className="section__head">
          <h2>{t.contact.title}</h2>
          <p className="section__sub">{t.contact.sub}</p>
        </Reveal>
        <Reveal className="contact__card card">
          {status === 'sent' ? (
            <div className="contact__done" role="status">
              <p className="contact__done-title gradient-text">{t.contact.sentTitle}</p>
              <p className="muted">{t.contact.sentBody}</p>
              <button className="btn btn--ghost" onClick={() => setStatus('idle')}>{t.contact.another}</button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={submit}>
              <div className="contact__row">
                <label>
                  <span>{t.contact.name}</span>
                  <input name="name" autoComplete="name" required maxLength={100} value={fields.name} onChange={update} />
                </label>
                <label>
                  <span>{t.contact.email}</span>
                  <input name="email" type="email" autoComplete="email" required maxLength={200} value={fields.email} onChange={update} />
                </label>
              </div>
              <label>
                <span>{t.contact.message}</span>
                <textarea name="message" rows={6} required maxLength={5000} value={fields.message} onChange={update} />
              </label>
              <input type="checkbox" name="botcheck" className="contact__trap" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              {status === 'error' && <p className="contact__error" role="alert">{t.contact.error}</p>}
              <button className="btn btn--primary" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? t.contact.sending : t.contact.send}
              </button>
              <p className="contact__privacy muted">
                {t.contact.privacyNote} <a href={path('/privacy/')}>{t.contact.privacyLink}</a>
              </p>
            </form>
          )}
          <ul className="contact__links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  <span>{l.label}</span>
                  <span className="muted mono">{l.sub} <span aria-hidden="true">↗</span></span>
                  <span className="sr-only">{t.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
