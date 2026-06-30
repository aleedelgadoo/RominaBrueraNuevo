import { useState, useEffect, useRef } from 'react'
import { savePageData, loadPageData } from '../utils/storage'
import { uploadImage } from '../utils/supabase'
import './AdminPanel.css'

interface AdminPanelProps {
  onLogout: () => void
  onDataSaved: () => void
}

interface SubService {
  id: number
  name: string
  duration: string
  description: string
  image: string
  tarifas: Tarifa[]
  mostrarTarifas: boolean
  mostrarDuracion: boolean
  portfolioImages: Array<{ id: number; image: string }>
}

interface ServiceData {
  id: number
  name: string
  duration: string
  description: string
  image: string
  tarifas: Tarifa[]
  mostrarTarifas: boolean
  mostrarDuracion: boolean
  portfolioImages: Array<{ id: number; image: string }>
  subServices: SubService[]
}

interface CourseData {
  id: number
  name: string
  duration: string
  description: string
  image: string
  modalidad?: 'virtual' | 'presencial'
  objectives: string[]
  tarifas: Tarifa[]
  mostrarTarifas: boolean
  portfolioImages: Array<{ id: number; image: string }>
}

interface TrajectoryItem {
  id: number
  title: string
  description: string
}

interface Tarifa {
  id: number
  tipo: 'A domicilio' | 'En Local'
  precio: string
}

interface FAQItem {
  id: number
  question: string
  answer: string
}

interface Testimonial {
  id: number
  name: string
  text: string
  photo?: string
}

interface PortfolioItem {
  id: number
  image: string
}

interface PageData {
  hero: {
    title: string
    subtitle: string
    buttonText: string
    buttonLink: string
    image: string
    image2?: string
    image3?: string
    imageMobile?: string
    image2Mobile?: string
    image3Mobile?: string
  }
  about: {
    title: string
    subtitle: string
    text1: string
    text2: string
    text3: string
    image: string
  }
  social: {
    instagramLink: string
    facebookLink: string
    emailContact: string
    phoneNumber: string
  }
  services: ServiceData[]
  courses: CourseData[]
  faq: FAQItem[]
  testimonials: Testimonial[]
  portfolio: PortfolioItem[]
  trajectory: TrajectoryItem[]
  trajectoryCover?: string
  logo?: string
  location: {
    mapUrl: string
    photo: string
    address: string
  }
}

const DEFAULT_PAGE_DATA: PageData = {
  hero: {
    title: 'UNLEASH YOUR BEAUTY WITH CONFIDENCE',
    subtitle: 'Professional Makeup Services Tailored Just For You',
    buttonText: 'AGENDA TU CITA',
    buttonLink: '#services',
    image: '',
    image2: '',
    image3: '',
  },
  about: {
    title: '¿QUIÉN ESTÁ DETRÁS DE ROMINA BRUERA?',
    subtitle: 'Hola! Soy Angie',
    text1: 'Maquilladora profesional de Córdoba Capital con más de siete años dedicados al mundo del maquillaje, capacitándome constantemente en maquillaje social, novias y perfeccionamientos.',
    text2: 'Mi objetivo es que te sientas cómoda, segura y radiante en tus momentos más especiales. Te acompañaré en cada paso para que brilles con confianza.',
    text3: 'Cada cliente es único y especial, por eso personalizo cada servicio según tus gustos y necesidades.',
    image: '',
  },
  social: {
    instagramLink: '',
    facebookLink: '',
    emailContact: '',
    phoneNumber: '',
  },
  services: [
    {
      id: 1,
      name: 'QUINCEAÑERAS 2026',
      duration: '2.5 - 3 horas',
      description: 'Maquillaje y peinado personalizado para el día más especial de tu vida.',
      image: '',
      tarifas: [],
      mostrarTarifas: false,
      mostrarDuracion: false,
      portfolioImages: [],
      subServices: [],
    },
    {
      id: 2,
      name: 'MAQUILLAJE SOCIAL/INVITADAS',
      duration: '01/02 hs',
      description: 'Un servicio pensado para acompañarte en eventos especiales.',
      image: '',
      tarifas: [],
      mostrarTarifas: false,
      mostrarDuracion: false,
      portfolioImages: [],
      subServices: [],
    },
    {
      id: 3,
      name: 'NOVIAS 2026',
      duration: '2 - 2.5 horas',
      description: 'Tu día especial merece un maquillaje impecable.',
      image: '',
      tarifas: [],
      mostrarTarifas: false,
      mostrarDuracion: false,
      portfolioImages: [],
      subServices: [],
    },
  ],
  courses: [
    {
      id: 1,
      name: 'PERFECCIONAMIENTOS',
      duration: '4 - 6 semanas',
      description: 'Cursos diseñados para perfeccionar técnicas específicas.',
      image: '',
      objectives: [],
      tarifas: [],
      mostrarTarifas: false,
      portfolioImages: [],
    },
    {
      id: 2,
      name: 'MASTERCLASS AUTOMAQUILLAJE',
      duration: '3 sesiones',
      description: 'Aprende a maquillarte profesionalmente.',
      image: '',
      objectives: [],
      tarifas: [],
      mostrarTarifas: false,
      portfolioImages: [],
    },
  ],
  faq: [
    { id: 1, question: '¿Cuánto tiempo antes debo agendar mi cita?', answer: 'Se recomienda agendar con al menos 2 semanas de anticipación para asegurar disponibilidad, especialmente en temporada alta como novias y eventos sociales.' },
    { id: 2, question: '¿Realizas maquillaje a domicilio?', answer: 'Sí, realizamos servicios a domicilio. El valor puede variar según la ubicación y la cantidad de personas a maquillar.' },
    { id: 3, question: '¿Qué productos utilizas?', answer: 'Utilizamos productos de marcas profesionales de alta calidad, dermatológicamente probados. Trabajamos con marcas reconocidas en la industria del maquillaje profesional.' },
    { id: 4, question: '¿Cuál es el costo de los servicios?', answer: 'Los precios varían según el tipo de evento y la complejidad del maquillaje. Consulta sin compromiso para obtener un presupuesto personalizado.' },
    { id: 5, question: '¿Realizas maquillaje para pieles sensibles?', answer: 'Claro, trabajamos con clientes de todo tipo de piel incluyendo pieles sensibles. Te recomendamos mencionar cualquier alergia o sensibilidad al agendar.' },
    { id: 6, question: '¿Cuál es la duración del maquillaje?', answer: 'El maquillaje dura todo el evento cuando utilizamos técnicas y productos de fijación profesional. Para eventos largos recomendamos un retoque a mitad de la jornada.' },
  ],
  testimonials: [],
  portfolio: [],
  trajectory: [],
  trajectoryCover: '',
  location: {
    mapUrl: 'https://maps.google.com/maps?q=Santa+Fe+598,+Villa+Maria,+Cordoba,+Argentina&output=embed',
    photo: '',
    address: 'Santa Fe 598 2do piso, Villa María, Córdoba',
  },
}

const AdminPanel = ({ onLogout, onDataSaved }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [pageData, setPageData] = useState<PageData>(DEFAULT_PAGE_DATA)

  const initialized = useRef(false)

  useEffect(() => {
    loadPageData().then((data) => {
      if (data) {
        setPageData({
          ...DEFAULT_PAGE_DATA,
          ...data,
          social: { ...DEFAULT_PAGE_DATA.social, ...(data.social || {}) },
          location: { ...DEFAULT_PAGE_DATA.location, ...(data.location || {}) },
          faq: data.faq?.length > 0 ? data.faq : DEFAULT_PAGE_DATA.faq,
          trajectory: data.trajectory || [],
        })
      }
      initialized.current = true
    })
  }, [])

  useEffect(() => {
    if (!initialized.current || !isAuthenticated) return
    const timer = setTimeout(() => {
      savePageData(pageData).then(() => {
        setHasChanges(false)
        onDataSaved()
      }).catch((err: any) => {
        console.error('Auto-save error:', err)
      })
    }, 800)
    return () => clearTimeout(timer)
  }, [pageData])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasChanges])

  const [editingServiceIdx, setEditingServiceIdx] = useState<number | null>(null)
  const [editingCourseIdx, setEditingCourseIdx] = useState<number | null>(null)
  const [editingSubServiceIdx, setEditingSubServiceIdx] = useState<number | null>(null)
  const [editingFaqIdx, setEditingFaqIdx] = useState<number | null>(null)
  const [editingTestimonialIdx, setEditingTestimonialIdx] = useState<number | null>(null)
  const [editingTrajectoryIdx, setEditingTrajectoryIdx] = useState<number | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'Romina2026' && password === 'Brasil2014') {
      setIsAuthenticated(true)
      setLoginError('')
      setUsername('')
      setPassword('')
    } else {
      setLoginError('Usuario o contraseña incorrecta')
    }
  }

  const markAsChanged = () => setHasChanges(true)

  const [uploading, setUploading] = useState(false)

  const resizeToBlob = (file: Blob, maxWidth = 1300, quality = 1): Promise<Blob> => {
    const isPng = file.type === 'image/png'
    const mimeType = isPng ? 'image/png' : 'image/webp'
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
          // PNG stays lossless (transparency), JPEG gets real compression instead of quality 1 (near-uncompressed)
          canvas.toBlob((blob) => resolve(blob!), mimeType, isPng ? undefined : quality)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, maxWidth = 1100) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    resizeToBlob(file, maxWidth).then(async (blob) => {
      try {
        const ext = file.type === 'image/png' ? 'png' : 'webp'
        const fileName = `${Date.now()}_${file.name.replace(/[^a-z0-9]/gi, '_')}.${ext}`
        const url = await uploadImage(blob, fileName)
        callback(url)
        markAsChanged()
      } catch (err: any) {
        alert('Error al subir: ' + (err?.message || JSON.stringify(err)))
      } finally {
        setUploading(false)
        e.target.value = ''
      }
    })
  }

  // Hero photos are full-bleed and shown on every visit, so we generate a small
  // mobile variant alongside the desktop one instead of shipping the same large file to phones.
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'image2' | 'image3') => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    Promise.all([resizeToBlob(file, 1800), resizeToBlob(file, 750)]).then(async ([desktopBlob, mobileBlob]) => {
      try {
        const ext = file.type === 'image/png' ? 'png' : 'webp'
        const baseName = file.name.replace(/[^a-z0-9]/gi, '_')
        const [desktopUrl, mobileUrl] = await Promise.all([
          uploadImage(desktopBlob, `${Date.now()}_${baseName}.${ext}`),
          uploadImage(mobileBlob, `${Date.now()}_mobile_${baseName}.${ext}`),
        ])
        setPageData((prev: any) => ({ ...prev, hero: { ...prev.hero, [field]: desktopUrl, [`${field}Mobile`]: mobileUrl } }))
        markAsChanged()
      } catch (err: any) {
        alert('Error al subir: ' + (err?.message || JSON.stringify(err)))
      } finally {
        setUploading(false)
        e.target.value = ''
      }
    })
  }

  const handleSave = async () => {
    try {
      await savePageData(pageData)
      setHasChanges(false)
      onDataSaved()
      alert('Cambios guardados exitosamente')
    } catch (err: any) {
      alert('Error al guardar: ' + (err?.message || JSON.stringify(err)))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h1 className="login-title">Romina Bruera - Panel de Control</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            {loginError && <p className="login-error">{loginError}</p>}
            <button type="submit" className="login-button">
              INGRESAR
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panel de Control - Romina Bruera</h1>
        <button onClick={onLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <h2>Secciones</h2>
          <button className={`section-button ${selectedSection === 'hero' ? 'active' : ''}`} onClick={() => setSelectedSection('hero')}>Hero</button>
          <button className={`section-button ${selectedSection === 'about' ? 'active' : ''}`} onClick={() => setSelectedSection('about')}>Sobre Mí</button>
          <button className={`section-button ${selectedSection === 'services' ? 'active' : ''}`} onClick={() => setSelectedSection('services')}>Servicios</button>
          <button className={`section-button ${selectedSection === 'courses' ? 'active' : ''}`} onClick={() => setSelectedSection('courses')}>Cursos</button>
          <button className={`section-button ${selectedSection === 'portfolio' ? 'active' : ''}`} onClick={() => setSelectedSection('portfolio')}>Portfolio</button>
          <button className={`section-button ${selectedSection === 'testimonials' ? 'active' : ''}`} onClick={() => setSelectedSection('testimonials')}>Testimonios</button>
          <button className={`section-button ${selectedSection === 'faq' ? 'active' : ''}`} onClick={() => setSelectedSection('faq')}>FAQ</button>
          <button className={`section-button ${selectedSection === 'trajectory' ? 'active' : ''}`} onClick={() => setSelectedSection('trajectory')}>Trayectoria</button>
          <button className={`section-button ${selectedSection === 'location' ? 'active' : ''}`} onClick={() => setSelectedSection('location')}>Ubicación</button>
          <button className={`section-button ${selectedSection === 'social' ? 'active' : ''}`} onClick={() => setSelectedSection('social')}>Redes Sociales</button>
        </div>

        <div className="admin-main">
          {selectedSection === 'hero' && (
            <div className="section-editor">
              <h2>Editar Sección Hero</h2>
              <div className="form-group">
                <label>Título Principal</label>
                <textarea
                  value={pageData.hero.title}
                  onChange={(e) => {
                    setPageData({ ...pageData, hero: { ...pageData.hero, title: e.target.value } })
                    markAsChanged()
                  }}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <input
                  type="text"
                  value={pageData.hero.subtitle}
                  onChange={(e) => {
                    setPageData({ ...pageData, hero: { ...pageData.hero, subtitle: e.target.value } })
                    markAsChanged()
                  }}
                />
              </div>
              <div className="form-group">
                <label>Texto del Botón</label>
                <input
                  type="text"
                  value={pageData.hero.buttonText}
                  onChange={(e) => {
                    setPageData({ ...pageData, hero: { ...pageData.hero, buttonText: e.target.value } })
                    markAsChanged()
                  }}
                />
              </div>
              <div className="form-group">
                <label>Link del Botón</label>
                <input
                  type="text"
                  value={pageData.hero.buttonLink}
                  onChange={(e) => {
                    setPageData({ ...pageData, hero: { ...pageData.hero, buttonLink: e.target.value } })
                    markAsChanged()
                  }}
                  placeholder="ej: #services, https://example.com"
                />
              </div>
              <div className="form-group">
                <label>Foto de portada 1 (izquierda)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHeroImageUpload(e, 'image')}
                />
                {pageData.hero.image && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                    <img src={pageData.hero.image} alt="Hero 1" className="preview-image" />
                    <button onClick={() => { setPageData((prev: any) => ({ ...prev, hero: { ...prev.hero, image: '', imageMobile: '' } })); markAsChanged() }} className="delete-button">Quitar</button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Foto de portada 2 (centro)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHeroImageUpload(e, 'image2')}
                />
                {pageData.hero.image2 && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                    <img src={pageData.hero.image2} alt="Hero 2" className="preview-image" />
                    <button onClick={() => { setPageData((prev: any) => ({ ...prev, hero: { ...prev.hero, image2: '', image2Mobile: '' } })); markAsChanged() }} className="delete-button">Quitar</button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Foto de portada 3 (derecha)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHeroImageUpload(e, 'image3')}
                />
                {pageData.hero.image3 && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                    <img src={pageData.hero.image3} alt="Hero 3" className="preview-image" />
                    <button onClick={() => { setPageData((prev: any) => ({ ...prev, hero: { ...prev.hero, image3: '', image3Mobile: '' } })); markAsChanged() }} className="delete-button">Quitar</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedSection === 'about' && (
            <div className="section-editor">
              <h2>Editar Sección Sobre Mí</h2>
              <div className="form-group">
                <label>Título</label>
                <input type="text" value={pageData.about.title} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, title: e.target.value } }); markAsChanged() }} />
              </div>
              <div className="form-group">
                <label>Subtítulo (Nombre)</label>
                <input type="text" value={pageData.about.subtitle} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, subtitle: e.target.value } }); markAsChanged() }} />
              </div>
              <div className="form-group">
                <label>Párrafo 1</label>
                <textarea value={pageData.about.text1} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, text1: e.target.value } }); markAsChanged() }} rows={3} />
              </div>
              <div className="form-group">
                <label>Párrafo 2</label>
                <textarea value={pageData.about.text2} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, text2: e.target.value } }); markAsChanged() }} rows={3} />
              </div>
              <div className="form-group">
                <label>Párrafo 3</label>
                <textarea value={pageData.about.text3} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, text3: e.target.value } }); markAsChanged() }} rows={3} />
              </div>
              <div className="form-group">
                <label>Imagen</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev) => ({ ...prev, about: { ...prev.about, image } })) })} />
                {pageData.about.image && <img src={pageData.about.image} alt="About" className="preview-image" />}
              </div>
            </div>
          )}

          {selectedSection === 'services' && (
            <div className="section-editor">
              <h2>Editar Servicios</h2>
              {editingServiceIdx === null ? (
                <div className="items-list">
                  {pageData.services.map((service: any, idx: number) => (
                    <div key={service.id} className="item-card">
                      <h3>{service.name}</h3>
                      <div className="item-card-actions">
                        <button onClick={() => { setEditingServiceIdx(idx); setEditingSubServiceIdx(null) }} className="edit-button">Editar</button>
                        <button onClick={() => {
                          if (confirm(`¿Eliminar "${service.name}"?`)) {
                            setPageData((prev: any) => ({ ...prev, services: prev.services.filter((_: any, i: number) => i !== idx) }))
                            markAsChanged()
                          }
                        }} className="delete-button">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => {
                    setPageData((prev: any) => ({
                      ...prev,
                      services: [...prev.services, { id: Date.now(), name: 'Nuevo Servicio', duration: '', description: '', image: '', tarifas: [], mostrarTarifas: false, mostrarDuracion: false, portfolioImages: [], subServices: [] }]
                    }))
                    markAsChanged()
                  }} className="add-button">+ Nuevo Servicio</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => { setEditingServiceIdx(null); setEditingSubServiceIdx(null) }} className="back-button">← Volver a Servicios</button>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={pageData.services[editingServiceIdx].name} onChange={(e) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, name: e.target.value } : sv); return { ...prev, services: s } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Duración</label>
                    <input type="text" value={pageData.services[editingServiceIdx].duration} onChange={(e) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, duration: e.target.value } : sv); return { ...prev, services: s } }); markAsChanged() }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input
                      type="checkbox"
                      id="mostrarDuracionService"
                      checked={pageData.services[editingServiceIdx].mostrarDuracion || false}
                      onChange={(e) => {
                        setPageData((prev: any) => {
                          const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, mostrarDuracion: e.target.checked } : sv)
                          return { ...prev, services: s }
                        })
                        markAsChanged()
                      }}
                    />
                    <label htmlFor="mostrarDuracionService" style={{ margin: 0, cursor: 'pointer' }}>Mostrar duración en el sitio web</label>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea value={pageData.services[editingServiceIdx].description} onChange={(e) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, description: e.target.value } : sv); return { ...prev, services: s } }); markAsChanged() }} rows={3} />
                  </div>
                  <div className="form-group">
                    <label>Imagen del Servicio</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, image } : sv); return { ...prev, services: s } }) })} />
                    {pageData.services[editingServiceIdx].image && <img src={pageData.services[editingServiceIdx].image} alt="Service" className="preview-image" />}
                  </div>

                  <h3 style={{ marginTop: '2rem' }}>Portfolio del Servicio</h3>
                  <div className="portfolio-upload">
                    {pageData.services[editingServiceIdx].portfolioImages.map((img: any, pIdx: number) => (
                      <div key={img.id} className="portfolio-item">
                        {img.image && <img src={img.image} alt={`Portfolio ${pIdx}`} />}
                        <button onClick={() => {
                          setPageData((prev: any) => {
                            const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                              ? { ...sv, portfolioImages: sv.portfolioImages.filter((_: any, pi: number) => pi !== pIdx) }
                              : sv)
                            return { ...prev, services: s }
                          })
                          markAsChanged()
                        }} className="delete-button portfolio-delete">✕</button>
                      </div>
                    ))}
                  </div>
                  <label className="upload-label">
                    + Agregar foto al portfolio
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, portfolioImages: [...sv.portfolioImages, { id: Date.now(), image }] } : sv); return { ...prev, services: s } }) }, 1000)} />
                  </label>

                  <h3 style={{ marginTop: '2rem' }}>Tarifas</h3>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input
                      type="checkbox"
                      id="mostrarTarifasService"
                      checked={pageData.services[editingServiceIdx].mostrarTarifas || false}
                      onChange={(e) => {
                        setPageData((prev: any) => {
                          const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, mostrarTarifas: e.target.checked } : sv)
                          return { ...prev, services: s }
                        })
                        markAsChanged()
                      }}
                    />
                    <label htmlFor="mostrarTarifasService" style={{ margin: 0, cursor: 'pointer' }}>Mostrar tarifas en el sitio web</label>
                  </div>
                  {(pageData.services[editingServiceIdx].tarifas || []).map((tarifa: any, tIdx: number) => (
                    <div key={tarifa.id} className="sub-item-card" style={{ alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.8rem', minWidth: '110px' }}>{tarifa.tipo}</span>
                      <input
                        type="text"
                        value={tarifa.precio}
                        placeholder="ej: $15.000"
                        onChange={(e) => {
                          setPageData((prev: any) => {
                            const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                              ? { ...sv, tarifas: sv.tarifas.map((t: any, ti: number) => ti === tIdx ? { ...t, precio: e.target.value } : t) }
                              : sv)
                            return { ...prev, services: s }
                          })
                          markAsChanged()
                        }}
                        style={{ flex: 1, padding: '0.35rem 0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }}
                      />
                      <button onClick={() => {
                        setPageData((prev: any) => {
                          const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                            ? { ...sv, tarifas: sv.tarifas.filter((_: any, ti: number) => ti !== tIdx) }
                            : sv)
                          return { ...prev, services: s }
                        })
                        markAsChanged()
                      }} className="delete-button">✕</button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {(['A domicilio', 'En Local'] as const).map((tipo) => (
                      <button key={tipo} onClick={() => {
                        setPageData((prev: any) => {
                          const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                            ? { ...sv, tarifas: [...(sv.tarifas || []), { id: Date.now(), tipo, precio: '' }] }
                            : sv)
                          return { ...prev, services: s }
                        })
                        markAsChanged()
                      }} className="add-button">+ {tipo}</button>
                    ))}
                  </div>

                  <h3 style={{ marginTop: '2rem' }}>Sub-Servicios (Especialidades)</h3>
                  {editingSubServiceIdx === null ? (
                    <div>
                      {(pageData.services[editingServiceIdx].subServices || []).map((sub: any, subIdx: number) => (
                        <div key={sub.id} className="sub-item-card">
                          <p>{sub.name}</p>
                          <div>
                            <button onClick={() => { setEditingSubServiceIdx(subIdx) }} className="edit-button">Editar</button>
                            <button onClick={() => {
                              setPageData((prev: any) => {
                                const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                                  ? { ...sv, subServices: (sv.subServices || []).filter((_: any, si: number) => si !== subIdx) }
                                  : sv)
                                return { ...prev, services: s }
                              })
                              markAsChanged()
                            }} className="delete-button">Eliminar</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => {
                        setPageData((prev: any) => {
                          const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                            ? { ...sv, subServices: [...(sv.subServices || []), { id: Date.now(), name: 'Nuevo Sub-Servicio', duration: '', description: '', image: '', tarifas: [], mostrarTarifas: false, mostrarDuracion: false, portfolioImages: [] }] }
                            : sv)
                          return { ...prev, services: s }
                        })
                        markAsChanged()
                      }} className="add-button">+ Agregar Sub-Servicio</button>
                    </div>
                  ) : (
                    <div className="sub-item-editor">
                      <button onClick={() => { setEditingSubServiceIdx(null) }} className="back-button">← Volver a Sub-Servicios</button>

                      {(() => {
                        const currentSub = (pageData.services[editingServiceIdx].subServices || [])[editingSubServiceIdx]
                        const updateSub = (patch: any) => {
                          setPageData((prev: any) => {
                            const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                              ? { ...sv, subServices: (sv.subServices || []).map((ss: any, si: number) => si === editingSubServiceIdx ? { ...ss, ...patch } : ss) }
                              : sv)
                            return { ...prev, services: s }
                          })
                          markAsChanged()
                        }

                        if (!currentSub) return null

                        return (
                          <>
                            <div className="form-group">
                              <label>Nombre</label>
                              <input type="text" value={currentSub.name || ''} onChange={(e) => updateSub({ name: e.target.value })} />
                            </div>
                            <div className="form-group">
                              <label>Duración</label>
                              <input type="text" value={currentSub.duration || ''} onChange={(e) => updateSub({ duration: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <input
                                type="checkbox"
                                id="mostrarDuracionSub"
                                checked={currentSub.mostrarDuracion || false}
                                onChange={(e) => updateSub({ mostrarDuracion: e.target.checked })}
                              />
                              <label htmlFor="mostrarDuracionSub" style={{ margin: 0, cursor: 'pointer' }}>Mostrar duración en el sitio web</label>
                            </div>
                            <div className="form-group">
                              <label>Descripción</label>
                              <textarea value={currentSub.description || ''} onChange={(e) => updateSub({ description: e.target.value })} rows={3} />
                            </div>
                            <div className="form-group">
                              <label>Foto de Portada</label>
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => updateSub({ image }))} />
                              {currentSub.image && <img src={currentSub.image} alt="Sub-Servicio" className="preview-image" />}
                            </div>

                            <h4 style={{ marginTop: '1.5rem' }}>Portfolio del Sub-Servicio</h4>
                            <div className="portfolio-upload">
                              {(currentSub.portfolioImages || []).map((img: any, pIdx: number) => (
                                <div key={img.id} className="portfolio-item">
                                  {img.image && <img src={img.image} alt={`Portfolio ${pIdx}`} />}
                                  <button onClick={() => updateSub({ portfolioImages: (currentSub.portfolioImages || []).filter((_: any, pi: number) => pi !== pIdx) })} className="delete-button portfolio-delete">✕</button>
                                </div>
                              ))}
                            </div>
                            <label className="upload-label">
                              + Agregar foto al portfolio
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => updateSub({ portfolioImages: [...(currentSub.portfolioImages || []), { id: Date.now(), image }] }), 1000)} />
                            </label>

                            <h4 style={{ marginTop: '1.5rem' }}>Tarifas del Sub-Servicio</h4>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <input
                                type="checkbox"
                                id="mostrarTarifasSub"
                                checked={currentSub.mostrarTarifas || false}
                                onChange={(e) => updateSub({ mostrarTarifas: e.target.checked })}
                              />
                              <label htmlFor="mostrarTarifasSub" style={{ margin: 0, cursor: 'pointer' }}>Mostrar tarifas en el sitio web</label>
                            </div>
                            {(currentSub.tarifas || []).map((tarifa: any, tIdx: number) => (
                              <div key={tarifa.id} className="sub-item-card" style={{ alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.8rem', minWidth: '110px' }}>{tarifa.tipo}</span>
                                <input
                                  type="text"
                                  value={tarifa.precio}
                                  placeholder="ej: $15.000"
                                  onChange={(e) => updateSub({ tarifas: (currentSub.tarifas || []).map((t: any, ti: number) => ti === tIdx ? { ...t, precio: e.target.value } : t) })}
                                  style={{ flex: 1, padding: '0.35rem 0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }}
                                />
                                <button onClick={() => updateSub({ tarifas: (currentSub.tarifas || []).filter((_: any, ti: number) => ti !== tIdx) })} className="delete-button">✕</button>
                              </div>
                            ))}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              {(['A domicilio', 'En Local'] as const).map((tipo) => (
                                <button key={tipo} onClick={() => updateSub({ tarifas: [...(currentSub.tarifas || []), { id: Date.now(), tipo, precio: '' }] })} className="add-button">+ {tipo}</button>
                              ))}
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedSection === 'courses' && (
            <div className="section-editor">
              <h2>Editar Cursos</h2>
              {editingCourseIdx === null ? (
                <div className="items-list">
                  {pageData.courses.map((course: any, idx: number) => (
                    <div key={course.id} className="item-card">
                      <h3>{course.name}</h3>
                      <div className="item-card-actions">
                        <button onClick={() => setEditingCourseIdx(idx)} className="edit-button">Editar</button>
                        <button onClick={() => {
                          if (confirm(`¿Eliminar "${course.name}"?`)) {
                            setPageData((prev: any) => ({ ...prev, courses: prev.courses.filter((_: any, i: number) => i !== idx) }))
                            markAsChanged()
                          }
                        }} className="delete-button">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => {
                    setPageData((prev: any) => ({
                      ...prev,
                      courses: [...prev.courses, { id: Date.now(), name: 'Nuevo Curso', duration: '', description: '', image: '', objectives: [], tarifas: [], mostrarTarifas: false, portfolioImages: [] }]
                    }))
                    markAsChanged()
                  }} className="add-button">+ Nuevo Curso</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => setEditingCourseIdx(null)} className="back-button">← Volver a Cursos</button>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={pageData.courses[editingCourseIdx].name} onChange={(e) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, name: e.target.value } : cv); return { ...prev, courses: c } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Duración</label>
                    <input type="text" value={pageData.courses[editingCourseIdx].duration} onChange={(e) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, duration: e.target.value } : cv); return { ...prev, courses: c } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Modalidad</label>
                    <select
                      value={pageData.courses[editingCourseIdx].modalidad || ''}
                      onChange={(e) => {
                        const val = e.target.value as 'virtual' | 'presencial' | ''
                        setPageData((prev: any) => {
                          const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx
                            ? { ...cv, modalidad: val || undefined }
                            : cv)
                          return { ...prev, courses: c }
                        })
                        markAsChanged()
                      }}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    >
                      <option value="">Sin especificar</option>
                      <option value="virtual">Virtual</option>
                      <option value="presencial">Presencial</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea value={pageData.courses[editingCourseIdx].description} onChange={(e) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, description: e.target.value } : cv); return { ...prev, courses: c } }); markAsChanged() }} rows={3} />
                  </div>
                  <div className="form-group">
                    <label>Imagen del Curso</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, image } : cv); return { ...prev, courses: c } }) })} />
                    {pageData.courses[editingCourseIdx].image && <img src={pageData.courses[editingCourseIdx].image} alt="Course" className="preview-image" />}
                  </div>

                  <h3>Portfolio de Trabajos de Alumnos</h3>
                  <div className="portfolio-upload">
                    {pageData.courses[editingCourseIdx].portfolioImages.map((img: any, pIdx: number) => (
                      <div key={img.id} className="portfolio-item">
                        {img.image && <img src={img.image} alt={`Portfolio ${pIdx}`} />}
                        <button onClick={() => {
                          setPageData((prev: any) => {
                            const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx
                              ? { ...cv, portfolioImages: cv.portfolioImages.filter((_: any, pi: number) => pi !== pIdx) }
                              : cv)
                            return { ...prev, courses: c }
                          })
                          markAsChanged()
                        }} className="delete-button portfolio-delete">✕</button>
                      </div>
                    ))}
                  </div>
                  <label className="upload-label">
                    + Agregar foto al portfolio
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, portfolioImages: [...cv.portfolioImages, { id: Date.now(), image }] } : cv); return { ...prev, courses: c } }) }, 1000)} />
                  </label>

                  <h3 style={{ marginTop: '2rem' }}>Tarifas</h3>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input
                      type="checkbox"
                      id="mostrarTarifasCourse"
                      checked={pageData.courses[editingCourseIdx].mostrarTarifas || false}
                      onChange={(e) => {
                        setPageData((prev: any) => {
                          const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, mostrarTarifas: e.target.checked } : cv)
                          return { ...prev, courses: c }
                        })
                        markAsChanged()
                      }}
                    />
                    <label htmlFor="mostrarTarifasCourse" style={{ margin: 0, cursor: 'pointer' }}>Mostrar tarifas en el sitio web</label>
                  </div>
                  {(pageData.courses[editingCourseIdx].tarifas || []).map((tarifa: any, tIdx: number) => (
                    <div key={tarifa.id} className="sub-item-card" style={{ alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.8rem', minWidth: '110px' }}>{tarifa.tipo}</span>
                      <input
                        type="text"
                        value={tarifa.precio}
                        placeholder="ej: $15.000"
                        onChange={(e) => {
                          setPageData((prev: any) => {
                            const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx
                              ? { ...cv, tarifas: cv.tarifas.map((t: any, ti: number) => ti === tIdx ? { ...t, precio: e.target.value } : t) }
                              : cv)
                            return { ...prev, courses: c }
                          })
                          markAsChanged()
                        }}
                        style={{ flex: 1, padding: '0.35rem 0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }}
                      />
                      <button onClick={() => {
                        setPageData((prev: any) => {
                          const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx
                            ? { ...cv, tarifas: cv.tarifas.filter((_: any, ti: number) => ti !== tIdx) }
                            : cv)
                          return { ...prev, courses: c }
                        })
                        markAsChanged()
                      }} className="delete-button">✕</button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {(['A domicilio', 'En Local'] as const).map((tipo) => (
                      <button key={tipo} onClick={() => {
                        setPageData((prev: any) => {
                          const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx
                            ? { ...cv, tarifas: [...(cv.tarifas || []), { id: Date.now(), tipo, precio: '' }] }
                            : cv)
                          return { ...prev, courses: c }
                        })
                        markAsChanged()
                      }} className="add-button">+ {tipo}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'portfolio' && (
            <div className="section-editor">
              <h2>Portfolio General</h2>
              <div className="portfolio-upload">
                {pageData.portfolio.map((item: any, idx: number) => (
                  <div key={item.id} className="portfolio-item">
                    {item.image && <img src={item.image} alt={`Portfolio ${idx}`} />}
                    <button onClick={() => {
                      setPageData((prev: any) => ({ ...prev, portfolio: prev.portfolio.filter((_: any, i: number) => i !== idx) }))
                      markAsChanged()
                    }} className="delete-button portfolio-delete">✕</button>
                  </div>
                ))}
              </div>
              <label className="upload-label">
                + Agregar foto al portfolio
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => ({ ...prev, portfolio: [...prev.portfolio, { id: Date.now(), image }] })) }, 1000)} />
              </label>
            </div>
          )}

          {selectedSection === 'testimonials' && (
            <div className="section-editor">
              <h2>Testimonios</h2>
              {editingTestimonialIdx === null ? (
                <div className="items-list">
                  {pageData.testimonials.map((testimonial: any, idx: number) => (
                    <div key={testimonial.id} className="item-card">
                      <h3>{testimonial.name}</h3>
                      <div className="item-card-actions">
                        <button onClick={() => setEditingTestimonialIdx(idx)} className="edit-button">Editar</button>
                        <button onClick={() => { setPageData((prev: any) => ({ ...prev, testimonials: prev.testimonials.filter((_: any, i: number) => i !== idx) })); markAsChanged() }} className="delete-button">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { setPageData((prev: any) => ({ ...prev, testimonials: [...prev.testimonials, { id: Date.now(), name: 'Nuevo', text: '', photo: '' }] })); markAsChanged() }} className="add-button">+ Agregar Testimonio</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => setEditingTestimonialIdx(null)} className="back-button">← Volver</button>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={pageData.testimonials[editingTestimonialIdx].name} onChange={(e) => { setPageData((prev: any) => { const t = prev.testimonials.map((tv: any, i: number) => i === editingTestimonialIdx ? { ...tv, name: e.target.value } : tv); return { ...prev, testimonials: t } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Texto</label>
                    <textarea value={pageData.testimonials[editingTestimonialIdx].text} onChange={(e) => { setPageData((prev: any) => { const t = prev.testimonials.map((tv: any, i: number) => i === editingTestimonialIdx ? { ...tv, text: e.target.value } : tv); return { ...prev, testimonials: t } }); markAsChanged() }} rows={4} />
                  </div>
                  <div className="form-group">
                    <label>Foto (opcional)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (photo) => { setPageData((prev: any) => { const t = prev.testimonials.map((tv: any, i: number) => i === editingTestimonialIdx ? { ...tv, photo } : tv); return { ...prev, testimonials: t } }) }, 400)} />
                    {pageData.testimonials[editingTestimonialIdx].photo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <img src={pageData.testimonials[editingTestimonialIdx].photo} alt="Foto" className="preview-image" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                        <button onClick={() => { setPageData((prev: any) => { const t = prev.testimonials.map((tv: any, i: number) => i === editingTestimonialIdx ? { ...tv, photo: '' } : tv); return { ...prev, testimonials: t } }); markAsChanged() }} className="delete-button">Quitar foto</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'faq' && (
            <div className="section-editor">
              <h2>Preguntas Frecuentes</h2>
              {editingFaqIdx === null ? (
                <div className="items-list">
                  {pageData.faq.map((item, idx) => (
                    <div key={item.id} className="item-card">
                      <h3>{item.question}</h3>
                      <button onClick={() => setEditingFaqIdx(idx)} className="edit-button">Editar</button>
                      <button onClick={() => { setPageData({ ...pageData, faq: pageData.faq.filter((_, i) => i !== idx) }); markAsChanged() }} className="delete-button">Eliminar</button>
                    </div>
                  ))}
                  <button onClick={() => { setPageData({ ...pageData, faq: [...pageData.faq, { id: Date.now(), question: '', answer: '' }] }); markAsChanged() }} className="add-button">+ Agregar Pregunta</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => setEditingFaqIdx(null)} className="back-button">← Volver</button>
                  <div className="form-group">
                    <label>Pregunta</label>
                    <input type="text" value={pageData.faq[editingFaqIdx].question} onChange={(e) => { const newFaq = [...pageData.faq]; newFaq[editingFaqIdx].question = e.target.value; setPageData({ ...pageData, faq: newFaq }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Respuesta</label>
                    <textarea value={pageData.faq[editingFaqIdx].answer} onChange={(e) => { const newFaq = [...pageData.faq]; newFaq[editingFaqIdx].answer = e.target.value; setPageData({ ...pageData, faq: newFaq }); markAsChanged() }} rows={4} />
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'location' && (
            <div className="section-editor">
              <h2>Ubicación</h2>
              <div className="form-group">
                <label>URL del mapa (Google Maps embed)</label>
                <input
                  type="text"
                  value={(pageData as any).location?.mapUrl || ''}
                  onChange={(e) => {
                    setPageData((prev: any) => ({ ...prev, location: { ...prev.location, mapUrl: e.target.value } }))
                    markAsChanged()
                  }}
                  placeholder="ej: https://maps.google.com/maps?q=...&output=embed"
                />
                <small style={{ color: '#999', fontSize: '0.72rem' }}>
                  En Google Maps → Compartir → Incorporar un mapa → copiar la URL del src del iframe.
                </small>
              </div>
              <div className="form-group">
                <label>Texto de dirección</label>
                <input
                  type="text"
                  value={(pageData as any).location?.address || ''}
                  onChange={(e) => {
                    setPageData((prev: any) => ({ ...prev, location: { ...prev.location, address: e.target.value } }))
                    markAsChanged()
                  }}
                  placeholder="ej: Santa Fe 598 2do piso, Villa María, Córdoba"
                />
              </div>
              <div className="form-group">
                <label>Foto del local / fachada</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (photo) => {
                    setPageData((prev: any) => ({ ...prev, location: { ...prev.location, photo } }))
                  }, 1200)}
                />
                {(pageData as any).location?.photo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <img src={(pageData as any).location.photo} alt="Local" className="preview-image" />
                    <button onClick={() => { setPageData((prev: any) => ({ ...prev, location: { ...prev.location, photo: '' } })); markAsChanged() }} className="delete-button">Quitar foto</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedSection === 'social' && (
            <div className="section-editor">
              <h2>Redes Sociales y Enlaces</h2>
              <div className="form-group">
                <label>Logo de la Navbar</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setPageData((prev: any) => ({ ...prev, logo: url })), 600)} />
                {pageData.logo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <img src={pageData.logo} alt="Logo" style={{ height: 50, objectFit: 'contain', background: '#f5f0e8', padding: '4px', borderRadius: '4px' }} />
                    <button onClick={() => { setPageData((prev: any) => ({ ...prev, logo: '' })); markAsChanged() }} className="delete-button">Quitar logo</button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Link de Instagram</label>
                <input
                  type="text"
                  value={pageData.social.instagramLink}
                  onChange={(e) => {
                    setPageData({ ...pageData, social: { ...pageData.social, instagramLink: e.target.value } })
                    markAsChanged()
                  }}
                  placeholder="ej: https://instagram.com/rominabruera"
                />
              </div>
              <div className="form-group">
                <label>Link de Facebook</label>
                <input
                  type="text"
                  value={pageData.social.facebookLink}
                  onChange={(e) => {
                    setPageData({ ...pageData, social: { ...pageData.social, facebookLink: e.target.value } })
                    markAsChanged()
                  }}
                  placeholder="ej: https://facebook.com/rominabruera"
                />
              </div>
              <div className="form-group">
                <label>Email de contacto</label>
                <input
                  type="email"
                  value={pageData.social.emailContact}
                  onChange={(e) => {
                    setPageData({ ...pageData, social: { ...pageData.social, emailContact: e.target.value } })
                    markAsChanged()
                  }}
                  placeholder="ej: contacto@rominabruera.com"
                />
              </div>
              <div className="form-group">
                <label>Teléfono / WhatsApp</label>
                <input
                  type="text"
                  value={pageData.social.phoneNumber || ''}
                  onChange={(e) => {
                    setPageData({ ...pageData, social: { ...pageData.social, phoneNumber: e.target.value } })
                    markAsChanged()
                  }}
                  placeholder="ej: +54 9 353 123-4567"
                />
              </div>
            </div>
          )}

          {selectedSection === 'trajectory' && (
            <div className="section-editor">
              <h2>Mi Trayectoria</h2>
              <div className="form-group">
                <label>Foto de portada (opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => {
                    setPageData((prev: any) => ({ ...prev, trajectoryCover: url }))
                  }, 1800)}
                />
                {(pageData as any).trajectoryCover && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <img src={(pageData as any).trajectoryCover} alt="Portada" className="preview-image" />
                    <button onClick={() => { setPageData((prev: any) => ({ ...prev, trajectoryCover: '' })); markAsChanged() }} className="delete-button">Quitar foto</button>
                  </div>
                )}
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', margin: '1.25rem 0' }} />
              {editingTrajectoryIdx === null ? (
                <div className="items-list">
                  {(pageData.trajectory || []).map((item: TrajectoryItem, idx: number) => (
                    <div key={item.id} className="item-card">
                      <h3>{item.title || '(sin título)'}</h3>
                      <div className="item-card-actions">
                        <button
                          onClick={() => {
                            if (idx === 0) return
                            const arr = [...pageData.trajectory]
                            ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
                            setPageData((prev: any) => ({ ...prev, trajectory: arr }))
                            markAsChanged()
                          }}
                          className="edit-button"
                          disabled={idx === 0}
                          title="Subir"
                        >↑</button>
                        <button
                          onClick={() => {
                            if (idx === pageData.trajectory.length - 1) return
                            const arr = [...pageData.trajectory]
                            ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
                            setPageData((prev: any) => ({ ...prev, trajectory: arr }))
                            markAsChanged()
                          }}
                          className="edit-button"
                          disabled={idx === pageData.trajectory.length - 1}
                          title="Bajar"
                        >↓</button>
                        <button onClick={() => setEditingTrajectoryIdx(idx)} className="edit-button">Editar</button>
                        <button onClick={() => {
                          if (confirm(`¿Eliminar "${item.title}"?`)) {
                            setPageData((prev: any) => ({ ...prev, trajectory: prev.trajectory.filter((_: any, i: number) => i !== idx) }))
                            markAsChanged()
                          }
                        }} className="delete-button">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => {
                    setPageData((prev: any) => ({ ...prev, trajectory: [...(prev.trajectory || []), { id: Date.now(), title: '', description: '' }] }))
                    markAsChanged()
                  }} className="add-button">+ Agregar elemento</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => setEditingTrajectoryIdx(null)} className="back-button">← Volver a Trayectoria</button>
                  <div className="form-group">
                    <label>Título</label>
                    <input
                      type="text"
                      value={(pageData.trajectory || [])[editingTrajectoryIdx]?.title || ''}
                      onChange={(e) => {
                        const arr = [...pageData.trajectory]
                        arr[editingTrajectoryIdx] = { ...arr[editingTrajectoryIdx], title: e.target.value }
                        setPageData((prev: any) => ({ ...prev, trajectory: arr }))
                        markAsChanged()
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      rows={4}
                      value={(pageData.trajectory || [])[editingTrajectoryIdx]?.description || ''}
                      onChange={(e) => {
                        const arr = [...pageData.trajectory]
                        arr[editingTrajectoryIdx] = { ...arr[editingTrajectoryIdx], description: e.target.value }
                        setPageData((prev: any) => ({ ...prev, trajectory: arr }))
                        markAsChanged()
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {!selectedSection && (
            <div className="no-section">
              <p>Selecciona una sección para comenzar a editar</p>
            </div>
          )}
        </div>
      </div>

      {uploading && (
        <div className="uploading-indicator">Subiendo imagen...</div>
      )}
      {hasChanges && !uploading && (
        <button className="save-button-floating" onClick={handleSave}>
          💾 Guardar Cambios
        </button>
      )}
    </div>
  )
}

export default AdminPanel
