import { useState, useEffect } from 'react'
import './Hero.css'

interface HeroData {
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

interface HeroProps {
  heroData?: HeroData
}

const Hero = ({ heroData }: HeroProps) => {
  const defaultData: HeroData = {
    title: 'UNLEASH YOUR BEAUTY WITH CONFIDENCE',
    subtitle: 'Professional Makeup Services Tailored Just For You',
    buttonText: 'AGENDA TU CITA',
    buttonLink: '#services',
    image: '',
    image2: '',
    image3: '',
  }

  const data = heroData || defaultData

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const photo1 = (isMobile && data.imageMobile) || data.image
  const photo2 = (isMobile && data.image2Mobile) || data.image2
  const photo3 = (isMobile && data.image3Mobile) || data.image3

  const handleButtonClick = () => {
    if (data.buttonLink.startsWith('#')) {
      const element = document.getElementById(data.buttonLink.substring(1))
      element?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = data.buttonLink
    }
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-photos">
        <div
          className="hero-photo"
          style={photo1 ? { backgroundImage: `url(${photo1})` } : undefined}
        />
        <div
          className="hero-photo"
          style={photo2 ? { backgroundImage: `url(${photo2})` } : undefined}
        />
        <div
          className="hero-photo"
          style={photo3 ? { backgroundImage: `url(${photo3})` } : undefined}
        />
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">{data.title}</h1>
        <p className="hero-subtitle">{data.subtitle}</p>
        <button className="hero-button" onClick={handleButtonClick}>
          {data.buttonText}
        </button>
      </div>
    </section>
  )
}

export default Hero
