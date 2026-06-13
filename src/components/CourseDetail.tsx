import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Lightbox from './Lightbox'
import './CourseDetail.css'

interface CourseDetailProps {
  courseId: number
  onClose: () => void
  onGoHome?: () => void
  onPortfolioClick?: () => void
  pageData?: any
}

const CourseDetail = ({ courseId, onClose, onGoHome, onPortfolioClick, pageData }: CourseDetailProps) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const coursesData: Record<number, any> = pageData?.courses?.reduce((acc: any, course: any) => {
    acc[course.id] = course
    return acc
  }, {}) || {}

  const course = coursesData[courseId]

  if (!course) return null

  return (
    <div className="course-detail-page">
      <Navbar pageData={pageData} onGoHome={onGoHome} onPortfolioClick={onPortfolioClick} />

      <div className="course-detail-hero">
        <div className="course-detail-image-col">
          {course.image ? (
            <img src={course.image} alt={course.name} className="course-detail-image-real" />
          ) : (
            <div className={`course-detail-image-placeholder course-placeholder-${course.id}`}></div>
          )}
        </div>
        <div className="course-detail-info-col">
          <button className="back-button" onClick={onClose}>← Volver</button>
          <h1 className="course-detail-title">{course.name}</h1>
          <div className="course-detail-meta">
            <div className="course-meta-item">
              <span className="meta-label">Duración</span>
              <span className="meta-value">{course.duration}</span>
            </div>
            {course.modalidad && (
              <div className="course-meta-item">
                <span className="meta-label">Modalidad</span>
                <span className="meta-value">
                  {course.modalidad === 'virtual' ? 'Virtual' : 'Presencial'}
                </span>
              </div>
            )}
          </div>
          <p className="course-detail-description">{course.description}</p>
          {course.mostrarTarifas && course.tarifas?.length > 0 && (
            <div className="hero-tarifas">
              {course.tarifas.map((t: any) => (
                <div key={t.id} className="hero-tarifa-card">
                  <span className="hero-tarifa-tipo">{t.tipo}</span>
                  <span className="hero-tarifa-precio">{t.precio}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {course.portfolioImages?.length > 0 && (
        <div className="course-detail-body">
          <h2 className="section-sub-title">RESULTADOS</h2>
          <div className="portfolio-grid">
            {course.portfolioImages.map((img: any) => (
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

      <Footer />
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  )
}

export default CourseDetail
