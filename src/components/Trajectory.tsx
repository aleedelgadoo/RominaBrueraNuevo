import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import './Trajectory.css'

interface TrajectoryItem {
  id: number
  title: string
  description: string
}

interface TrajectoryProps {
  onClose: () => void
  pageData?: any
}

const Trajectory = ({ onClose, pageData }: TrajectoryProps) => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const items: TrajectoryItem[] = pageData?.trajectory || []
  const coverImage: string = pageData?.trajectoryCover || ''

  return (
    <div className="trajectory-page">
      <Navbar pageData={pageData} onNavClick={onClose} />

      <div className={`trajectory-hero${coverImage ? ' has-cover' : ''}`}>
        {coverImage && (
          <div className="traj-cover">
            <img src={coverImage} alt="Mi Trayectoria" className="traj-cover-img" loading="eager" decoding="async" fetchPriority="high" />
            <div className="traj-cover-overlay" />
          </div>
        )}
        <div className="traj-hero-content">
          <button className="traj-back-button" onClick={onClose}>← Volver</button>
          <span className="traj-eyebrow">Sobre mí</span>
          <h1 className="traj-title">MI TRAYECTORIA</h1>
          <div className="traj-accent" />
        </div>
      </div>

      <div className="trajectory-body">
        {items.length === 0 ? (
          <p className="traj-empty">Aún no hay elementos de trayectoria configurados.</p>
        ) : (
          <div className="traj-list">
            {items.map((item, idx) => (
              <div key={item.id} className="traj-item">
                <div className="traj-num">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="traj-content">
                  <h2 className="traj-item-title">{item.title}</h2>
                  <p className="traj-item-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Trajectory
