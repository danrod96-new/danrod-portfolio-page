import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Terminal from './components/Terminal.jsx'
import Contact from './components/Contact.jsx'
import { profile } from './data.js'

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
  } catch {
    // storage unavailable
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme)
  const [tag, setTag] = useState(null)

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
      <a className="skip-link" href="#about">Skip to content</a>
      <Nav theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <Hero />
      <main>
        <About />
        <Experience />
        <Projects tag={tag} onClearTag={() => setTag(null)} />
        <Skills onPick={pickSkill} />
        <Terminal />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container footer__inner">
          <p className="muted">© {new Date().getFullYear()} {profile.name}</p>
          <p className="muted mono">Built with React + Vite · <a href="#top">back to top ↑</a></p>
        </div>
      </footer>
    </>
  )
}
