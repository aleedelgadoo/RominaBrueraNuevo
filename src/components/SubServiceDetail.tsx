import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Lightbox from './Lightbox'
import LazyBackground from './LazyBackground'
import './SubServiceDetail.css'

interface SubServiceDetailProps {
  subServiceId: number
  parentServiceId: number
  onClose: () => void
  onGoHome?: () => void
  onPortfolioClick?: () => void
  pageData?: any
}

const SubServiceDetail = ({ subServiceId, parentServiceId, onClose, onGoHome, onPortfolioClick, pageData }: SubServiceDetailProps) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const parentService = pageData?.services?.find((s: any) => s.id === parentServiceId)
  const subService = parentService?.subServices?.find((ss: any) => ss.id === subServiceId)

  if (!subService) return null

  return (
    <div className="subservice-detail-page">
      <Navbar pageData={pageData} onGoHome={onGoHome} onPortfolioClick={onPortfolioClick} />

      <div className="subservice-detail-hero">
        <div className="subservice-detail-image-col">
          {subService.image ? (
            <img src={subService.image} alt={subService.name} className="subservice-detail-image-real" loading="eager" decoding="async" fetchPriority="high" />
          ) : (
            <div className="subservice-detail-image-placeholder"></div>
          )}
        </div>
        <div className="subservice-detail-info-col">
          <button className="back-button" onClick={onClose}>
            ← Volver a {parentService?.name || 'Servicio'}
          </button>
          <h1 className="subservice-detail-title">{subService.name}</h1>
          {subService.mostrarDuracion && subService.duration && (
            <div className="subservice-detail-duration">
              <span className="duration-label">Duración</span>
              <span className="duration-value">{subService.duration}</span>
            </div>
          )}
          {subService.description && (
            <p className="subservice-detail-description">{subService.description}</p>
          )}
          {subService.mostrarTarifas && subService.tarifas?.length > 0 && (
            <div className="hero-tarifas">
              {subService.tarifas.map((t: any) => (
                <div key={t.id} className="hero-tarifa-card">
                  <span className="hero-tarifa-tipo">{t.tipo}</span>
                  <span className="hero-tarifa-precio">{t.precio}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="subservice-detail-body">

        {subService.portfolioImages?.length > 0 && (
          <div className="portfolio-section">
            <h2 className="section-sub-title">PORTFOLIO</h2>
            <div className="portfolio-grid">
              {subService.portfolioImages.map((img: any) => (
                <LazyBackground
                  key={img.id}
                  className="portfolio-image-item"
                  src={img.image}
                  onClick={() => img.image && setLightboxSrc(img.image)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  )
}

export default SubServiceDetail
