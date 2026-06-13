import './Contact.css'

interface ContactProps {
  pageData?: any
}

const Contact = ({ pageData }: ContactProps) => {
  const social = pageData?.social || {}
  const instagram = social.instagramLink || ''
  const facebook = social.facebookLink || ''
  const email = social.emailContact || ''
  const phone = social.phoneNumber || ''

  if (!instagram && !facebook && !email && !phone) return null

  const instagramHandle = instagram.replace(/https?:\/\/(www\.)?instagram\.com\/?/, '').replace(/\/$/, '') || instagram
  const facebookHandle = facebook.replace(/https?:\/\/(www\.)?facebook\.com\/?/, '').replace(/\/$/, '') || facebook

  return (
    <section className="contact" id="contact">
      <div className="contact-header-bar">
        <span className="contact-tag">Contacto</span>
        <div className="contact-tag-line" />
      </div>

      <div className="contact-items">
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="contact-item">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <circle cx="17.5" cy="6.5" r="1.5" />
              </svg>
            </div>
            <div className="contact-info">
              <span className="contact-label">Instagram</span>
              <span className="contact-value">@{instagramHandle}</span>
            </div>
          </a>
        )}

        {facebook && (
          <a href={facebook} target="_blank" rel="noopener noreferrer" className="contact-item">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </div>
            <div className="contact-info">
              <span className="contact-label">Facebook</span>
              <span className="contact-value">{facebookHandle}</span>
            </div>
          </a>
        )}

        {email && (
          <a href={`mailto:${email}`} className="contact-item">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </div>
            <div className="contact-info">
              <span className="contact-label">Email</span>
              <span className="contact-value">{email}</span>
            </div>
          </a>
        )}

        {phone && (
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="contact-item">
            <div className="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.4 16z" />
              </svg>
            </div>
            <div className="contact-info">
              <span className="contact-label">Teléfono</span>
              <span className="contact-value">{phone}</span>
            </div>
          </a>
        )}
      </div>
    </section>
  )
}

export default Contact
