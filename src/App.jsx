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
import { stripLang } from './paths.js'
import { initialTheme } from './preferences.js'

// `pathname` is given only by the build-time render (src/entry-server.jsx), where there's no address bar.
export default function App({ pathname: fullPath = window.location.pathname }) {
  const { t, path } = useLang()
  const [theme, setTheme] = useState(initialTheme)
  const [tag, setTag] = useState(null)
  const hash = useHash()
  // Posts live at /blog/<slug>/ and the policy at /privacy/, in Spanish under /es/ (src/paths.js). Each has its own
  // HTML file in the build (scripts/prerender.js), so moving between pages is a normal page load.
  const pathname = stripLang(fullPath)
  const slug = pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1]
  const page = slug ? 'post' : /^\/privacy\/?$/.test(pathname) ? 'privacy' : 'home'

  // Arriving at /#contact (or any section) from another page: scroll there once the sections have rendered.
  useEffect(() => {
    if (page === 'home') document.getElementById(hash.slice(1))?.scrollIntoView()
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
            <a href={path('/privacy/')}>{t.footer.privacy}</a>
            <span aria-hidden="true"> · </span>
            <a href="#top">{t.footer.top}</a>
          </p>
        </div>
      </footer>
    </>
  )
}
