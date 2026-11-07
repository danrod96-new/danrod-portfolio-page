import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Blog from './components/Blog.jsx'
import BlogPost from './components/BlogPost.jsx'
import Privacy from './components/Privacy.jsx'
import Terminal from './components/Terminal.jsx'
import Contact from './components/Contact.jsx'
import { profile } from './data.js'
import { useLang } from './lang.js'
import { useHash } from './hooks/useHash.js'

// Dark on the first visit, whatever the system setting; after that, the visitor's own choice.
function initialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
  } catch {
    // storage unavailable
  }
  return 'dark'
}

export default function App() {
  const { t } = useLang()
  const [theme, setTheme] = useState(initialTheme)
  const [tag, setTag] = useState(null)
  const hash = useHash()
  const slug = hash.match(/^#\/blog\/(.+)$/)?.[1]
  const page = slug ? 'post' : hash === '#/privacy' ? 'privacy' : 'home'

  // A post or the privacy page replaces the home page; leaving it for a section anchor scrolls there once the page is back.
  useEffect(() => {
    if (page !== 'home') window.scrollTo(0, 0)
    else document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [page, hash])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // storage unavailable
    }
  }, [theme])

  function pickSkill(skill) {
    setTag(skill)
    document.getElementById('work').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <a className="skip-link" href={page === 'home' ? '#about' : '#main'}>{t.skip}</a>
      <Nav theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} page={page} />
      {page === 'post' ? (
        <BlogPost slug={decodeURIComponent(slug)} />
      ) : page === 'privacy' ? (
        <Privacy />
      ) : (
        <>
          <Hero />
          <main>
            <About />
            <Projects tag={tag} onClearTag={() => setTag(null)} />
            <Skills onPick={pickSkill} />
            <Blog />
            <Terminal />
            <Contact />
          </main>
        </>
      )}
      <footer className="footer">
        <div className="container footer__inner">
          <p className="muted">© {new Date().getFullYear()} {profile.name}</p>
          <p className="muted mono">
            <a href="#/privacy">{t.footer.privacy}</a>
            <span aria-hidden="true"> · </span>
            <a href="#top">{t.footer.top}</a>
          </p>
        </div>
      </footer>
    </>
  )
}
