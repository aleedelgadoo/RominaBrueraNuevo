import './Footer.css'

interface FooterProps {
  onAdminClick?: () => void
  socialData?: any
  pageData?: any
}

const Footer = ({ onAdminClick, pageData }: FooterProps) => {
  const logo = pageData?.logo || ''

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          {logo ? (
            <img src={logo} alt="Logo" className="footer-logo-image" />
          ) : (
            <span className="logo-text">RB</span>
          )}
        </div>

        <div className="footer-name">
          <p className="footer-text">© 2026 Romina Bruera</p>
        </div>

        {onAdminClick && (
          <button
            className="admin-link"
            onClick={onAdminClick}
            aria-label="Admin Panel"
            title="Panel de Control"
          >
            ⚙️
          </button>
        )}
      </div>
    </footer>
  )
}

export default Footer
