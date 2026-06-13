import { useState } from 'react'
import './Navbar.css'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  pageData?: any
  onNavClick?: () => void
  onGoHome?: () => void
  onPortfolioClick?: () => void
}

const Navbar = ({ pageData, onNavClick, onGoHome, onPortfolioClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleBrandClick = () => {
    setIsOpen(false)
    if (onGoHome) {
      onGoHome()
    } else if (onNavClick) {
      onNavClick()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSectionClick = (hash: string) => {
    handleLinkClick()
    if (onGoHome) {
      onGoHome()
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 80)
    } else if (onNavClick) {
      onNavClick()
    }
  }

  const navLinks: NavLink[] = [
    { label: 'SOBRE MÍ', href: '#about' },
    { label: 'SERVICIOS', href: '#services' },
    { label: 'CURSOS', href: '#courses' },
    { label: 'EXPERIENCIAS', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'CONTACTO', href: '#contact' },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)
  const handleLinkClick = () => setIsOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-logo-top navbar-brand-clickable" onClick={handleBrandClick} role="button" aria-label="Ir al inicio">
        {pageData?.logo && (
          <img src={pageData.logo} alt="Logo" className="logo-image" />
        )}
      </div>
      <div className="navbar-brand-title navbar-brand-clickable" onClick={handleBrandClick} role="button">
        <span className="navbar-title">Romina Bruera</span>
      </div>
      <div className="navbar-links-bar">
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        </button>
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={onNavClick || onGoHome ? undefined : link.href}
                onClick={() => handleSectionClick(link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={undefined}
              onClick={() => {
                handleLinkClick()
                if (onPortfolioClick) {
                  onPortfolioClick()
                } else {
                  onNavClick?.()
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              PORTFOLIO
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
