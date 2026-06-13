import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Lightbox from './Lightbox'
import './ServiceDetail.css'

interface ServiceDetailProps {
  serviceId: number
  onClose: () => void
  onSubServiceClick?: (subServiceId: number, parentServiceId: number) => void
  onGoHome?: () => void
  onPortfolioClick?: () => void
  pageData?: any
}

const ServiceDetail = ({ serviceId, onClose, onSubServiceClick, onGoHome, onPortfolioClick, pageData }: ServiceDetailProps) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [subCarouselIdx, setSubCarouselIdx] = useState(0)
  const [subColumns, setSubColumns] = useState(() => window.innerWidth <= 768 ? 1 : 3)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const onResize = () => setSubColumns(window.innerWidth <= 768 ? 1 : 3)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const servicesData: Record<number, any> = pageData?.services?.reduce((acc: any, service: any) => {
    acc[service.id] = service
    return acc
  }, {}) || {}

  const service = servicesData[serviceId]
  if (!service) return null

  const subServices = service.subServices || []

  return (
    <div className="service-detail-page">
      <Navbar pageData={pageData} onGoHome={onGoHome} onPortfolioClick={onPortfolioClick} />

      <div className="service-detail-hero">
        <div className="service-detail-image-col">
          {service.image ? (
            <img src={service.image} alt={service.name} className="service-detail-image-real" />
          ) : (
            <div className={`service-detail-image-placeholder service-placeholder-${service.id}`}></div>
          )}
        </div>
        <div className="service-detail-info-col">
          <button className="back-button" onClick={onClose}>← Volver</button>
          <h1 className="service-detail-title">{service.name}</h1>
          {service.mostrarDuracion && service.duration && (
            <div className="service-detail-duration">
              <span className="duration-label">Duración</span>
              <span className="duration-value">{service.duration}</span>
            </div>
          )}
          {service.description && (
            <p className="service-detail-description">{service.description}</p>
          )}
          {service.mostrarTarifas && service.tarifas?.length > 0 && (
            <div className="hero-tarifas">
              {service.tarifas.map((t: any) => (
                <div key={t.id} className="hero-tarifa-card">
                  <span className="hero-tarifa-tipo">{t.tipo}</span>
                  <span className="hero-tarifa-precio">{t.precio}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="service-detail-body">

        {subServices.length > 0 && (
          <div className="subservices-section">
            <h2 className="section-sub-title">ESPECIALIDADES</h2>
            <div className="subservices-carousel-wrapper">
              {subServices.length > subColumns && (
                <button
                  className="sub-arrow sub-arrow-prev"
                  onClick={() => setSubCarouselIdx(i => Math.max(0, i - 1))}
                  disabled={subCarouselIdx === 0}
                >❮</button>
              )}
              <div className="subservices-carousel">
                {subServices.map((sub: any, idx: number) => {
                  const isVisible = idx >= subCarouselIdx && idx < subCarouselIdx + subColumns
                  return (
                    <div
                      key={sub.id}
                      className={`subservice-card${!isVisible ? ' hidden' : ''}`}
                      onClick={() => onSubServiceClick?.(sub.id, serviceId)}
                    >
                      <div
                        className="subservice-image"
                        style={sub.image ? { backgroundImage: `url(${sub.image})` } : undefined}
                      />
                      <div className="subservice-info">
                        <h3 className="subservice-name">{sub.name}</h3>
                        {sub.mostrarDuracion && sub.duration && (
                          <span className="subservice-duration">⏱ {sub.duration}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {subServices.length > subColumns && (
                <button
                  className="sub-arrow sub-arrow-next"
                  onClick={() => setSubCarouselIdx(i => Math.min(subServices.length - subColumns, i + 1))}
                  disabled={subCarouselIdx >= subServices.length - subColumns}
                >❯</button>
              )}
            </div>
          </div>
        )}

        {service.portfolioImages?.length > 0 && (
          <div className="portfolio-section">
            <h2 className="section-sub-title">PORTFOLIO</h2>
            <div className="portfolio-grid">
              {service.portfolioImages.map((img: any) => (
                <div
                  key={img.id}
                  className="portfolio-image-item"
                  style={img.image ? { backgroundImage: `url(${img.image})`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer' } : {}}
                  onClick={() => img.image && setLightboxSrc(img.image)}
                ></div>
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

export default ServiceDetail
