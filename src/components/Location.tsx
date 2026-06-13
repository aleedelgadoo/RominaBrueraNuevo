import './Location.css'

interface LocationProps {
  pageData?: any
}

const Location = ({ pageData }: LocationProps) => {
  const data = pageData?.location || {}
  const mapUrl = data.mapUrl || 'https://maps.google.com/maps?q=Santa+Fe+598,+Villa+Maria,+Cordoba,+Argentina&output=embed'
  const photo = data.photo || ''
  const address = data.address || 'Santa Fe 598 2do piso, Villa María, Córdoba'

  return (
    <section className="location" id="location">
      <div className="location-header-bar">
        <span className="location-tag">Ubicación</span>
        <div className="location-tag-line" />
      </div>

      <div className="location-grid">
        <div className="location-map">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación"
          />
        </div>

        <div className="location-side">
          <div className="location-photo-wrap">
            {photo ? (
              <img src={photo} alt="Local" className="location-photo" />
            ) : (
              <div className="location-photo-placeholder" />
            )}
          </div>
          <div className="location-address">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="location-pin">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className="location-address-text">{address}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location
