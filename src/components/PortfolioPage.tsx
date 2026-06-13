import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Lightbox from './Lightbox'
import './PortfolioPage.css'

interface PortfolioPageProps {
  onClose: () => void
  pageData?: any
}

const PortfolioPage = ({ onClose, pageData }: PortfolioPageProps) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const services: any[] = pageData?.services || []
  const courses: any[] = pageData?.courses || []

  // Build grouped sections
  interface Section {
    key: string
    label: string
    sublabel?: string
    photos: { id: number; image: string }[]
  }

  const sections: Section[] = []

  for (const service of services) {
    if (service.portfolioImages?.length > 0) {
      sections.push({
        key: `service-${service.id}`,
        label: service.name,
        photos: service.portfolioImages,
      })
    }
    for (const sub of service.subServices || []) {
      if (sub.portfolioImages?.length > 0) {
        sections.push({
          key: `sub-${sub.id}`,
          label: service.name,
          sublabel: sub.name,
          photos: sub.portfolioImages,
        })
      }
    }
  }

  for (const course of courses) {
    if (course.portfolioImages?.length > 0) {
      sections.push({
        key: `course-${course.id}`,
        label: course.name,
        photos: course.portfolioImages,
      })
    }
  }

  return (
    <div className="portfolio-page">
      <Navbar pageData={pageData} onNavClick={onClose} />

      <div className="pp-hero">
        <button className="pp-back-btn" onClick={onClose}>← Volver</button>
        <span className="pp-eyebrow">Trabajos</span>
        <h1 className="pp-title">PORTFOLIO</h1>
        <div className="pp-accent" />
      </div>

      <div className="pp-body">
        {sections.length === 0 ? (
          <p className="pp-empty">Aún no hay fotos en el portfolio.</p>
        ) : (
          sections.map((section) => (
            <div key={section.key} className="pp-section">
              <div className="pp-section-header">
                <span className="pp-section-label">{section.label}</span>
                {section.sublabel && (
                  <>
                    <span className="pp-section-sep">›</span>
                    <span className="pp-section-sublabel">{section.sublabel}</span>
                  </>
                )}
                <div className="pp-section-line" />
              </div>
              <div className="pp-grid">
                {section.photos.map((photo) => (
                  photo.image ? (
                    <div
                      key={photo.id}
                      className="pp-photo"
                      style={{ backgroundImage: `url(${photo.image})` }}
                      onClick={() => setLightboxSrc(photo.image)}
                    />
                  ) : null
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  )
}

export default PortfolioPage
