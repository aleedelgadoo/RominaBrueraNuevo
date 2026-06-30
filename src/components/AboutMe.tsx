import './AboutMe.css'

interface AboutMeProps {
  pageData?: any
  onTrajectoryClick?: () => void
}

const AboutMe = ({ pageData, onTrajectoryClick }: AboutMeProps) => {
  const data = pageData?.about
  const title = data?.title || '¿QUIÉN ESTÁ DETRÁS DE ROMINA BRUERA?'
  const subtitle = data?.subtitle || 'Hola! Soy Angie'
  const text1 = data?.text1 || 'Maquilladora profesional de Córdoba Capital con más de siete años dedicados al mundo del maquillaje, capacitándome constantemente en maquillaje social, novias y perfeccionamientos.'
  const text2 = data?.text2 || 'Mi objetivo es que te sientas cómoda, segura y radiante en tus momentos más especiales. Te acompañaré en cada paso para que brilles con confianza.'
  const text3 = data?.text3 || 'Cada cliente es único y especial, por eso personalizo cada servicio según tus gustos y necesidades.'
  const image = data?.image || ''

  return (
    <section className="about" id="about">

      <div className="about-header-bar">
        <span className="about-tag">Sobre mí</span>
        <div className="about-tag-line" />
        <span className="about-tag-num">01</span>
      </div>

      <div className="about-container">

        <div className="about-image">
          {image ? (
            <img src={image} alt="Sobre mí" className="about-photo" loading="lazy" decoding="async" />
          ) : (
            <div className="image-placeholder">
              <span>Foto</span>
            </div>
          )}
        </div>

        <div className="about-content">
          <p className="about-eyebrow">Maquilladora Profesional · Córdoba</p>
          <h2 className="about-title">{title}</h2>
          <p className="about-subtitle">{subtitle}</p>
          <p className="about-text">{text1}</p>
          <p className="about-text">{text2}</p>
          <p className="about-text">{text3}</p>
          {onTrajectoryClick && (
            <button className="trajectory-btn" onClick={onTrajectoryClick}>
              Mi Trayectoria →
            </button>
          )}
        </div>

      </div>
    </section>
  )
}

export default AboutMe
