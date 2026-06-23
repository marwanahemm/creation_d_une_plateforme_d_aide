'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Barre de navigation de l'accueil : effet « scrolled » + menu burger mobile.
// Reproduit le comportement de l'ancien landing.js, version React.
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOuvert, setMenuOuvert] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fermer = () => setMenuOuvert(false)

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="navbar">
        <header className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="nav-logo-bar" />
            Plateforme de démarches administratives
          </a>

          <ul className="nav-links">
            <li><a href="#guides" className="nav-link">Les guides</a></li>
            <li><a href="#comment" className="nav-link">Comment ça marche</a></li>
            <li><a href="#confiance" className="nav-link">Confiance</a></li>
          </ul>

          <Link href="/tutoriels" className="nav-cta-btn">Accéder aux guides →</Link>

          <button
            className={`nav-burger${menuOuvert ? ' open' : ''}`}
            onClick={() => setMenuOuvert(o => !o)}
            aria-label="Menu"
            aria-expanded={menuOuvert}
          >
            <span /><span /><span />
          </button>
        </header>
      </nav>

      <ul className={`nav-mobile${menuOuvert ? ' open' : ''}`} id="navMobile">
        <li><a href="#guides" onClick={fermer}>Les guides</a></li>
        <li><a href="#comment" onClick={fermer}>Comment ça marche</a></li>
        <li><a href="#confiance" onClick={fermer}>Confiance</a></li>
        <li><Link href="/tutoriels" className="nav-cta-btn" onClick={fermer}>Accéder aux guides →</Link></li>
      </ul>
    </>
  )
}