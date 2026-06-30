import { useState, useEffect, Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import Services from './components/Services'
import Courses from './components/Courses'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Portfolio from './components/Portfolio'
import Location from './components/Location'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { loadPageData } from './utils/storage'
import './App.css'

const ServiceDetail = lazy(() => import('./components/ServiceDetail'))
const SubServiceDetail = lazy(() => import('./components/SubServiceDetail'))
const CourseDetail = lazy(() => import('./components/CourseDetail'))
const AdminPanel = lazy(() => import('./components/AdminPanel'))
const Trajectory = lazy(() => import('./components/Trajectory'))
const PortfolioPage = lazy(() => import('./components/PortfolioPage'))

type Page = 'home' | 'service' | 'subservice' | 'course' | 'trajectory' | 'portfolio' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedSubServiceId, setSelectedSubServiceId] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pageData, setPageData] = useState<any>(null)

  const refreshData = () => {
    loadPageData().then((data) => {
      if (data) setPageData({ social: { instagramLink: 'https://instagram.com' }, ...data })
    })
  }

  useEffect(() => { refreshData() }, [])

  useEffect(() => {
    if (pageData?.logo) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = pageData.logo
      link.type = 'image/png'
    }
  }, [pageData?.logo])

  useEffect(() => {
    const handler = () => {
      if (currentPage === 'subservice') {
        setCurrentPage('service')
        setSelectedSubServiceId(null)
      } else if (currentPage === 'service') {
        setCurrentPage('home')
        setSelectedServiceId(null)
      } else if (currentPage === 'course') {
        setCurrentPage('home')
        setSelectedCourseId(null)
      } else if (currentPage === 'trajectory') {
        setCurrentPage('home')
      } else if (currentPage === 'portfolio') {
        setCurrentPage('home')
      }
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [currentPage])

  const handleGoHome = () => {
    setCurrentPage('home')
    setSelectedServiceId(null)
    setSelectedSubServiceId(null)
    setSelectedCourseId(null)
  }

  const handleTrajectoryClick = () => {
    history.pushState({ page: 'trajectory' }, '')
    setCurrentPage('trajectory')
  }

  const handlePortfolioClick = () => {
    history.pushState({ page: 'portfolio' }, '')
    setCurrentPage('portfolio')
  }

  const handleDataSaved = () => refreshData()

  const handleServiceClick = (serviceId: number) => {
    history.pushState({ page: 'service' }, '')
    setSelectedServiceId(serviceId)
    setCurrentPage('service')
  }

  const handleSubServiceClick = (subServiceId: number, parentServiceId: number) => {
    history.pushState({ page: 'subservice' }, '')
    setSelectedServiceId(parentServiceId)
    setSelectedSubServiceId(subServiceId)
    setCurrentPage('subservice')
  }

  const handleCloseDetail = () => {
    history.back()
  }

  const handleCourseClick = (courseId: number) => {
    history.pushState({ page: 'course' }, '')
    setSelectedCourseId(courseId)
    setCurrentPage('course')
  }

  const handleCloseCourseDetail = () => {
    history.back()
  }

  const handleAdminLogin = () => {
    setIsLoggedIn(true)
    setCurrentPage('admin')
  }

  const handleAdminLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('home')
  }

  if (currentPage === 'trajectory') {
    return (
      <Suspense fallback={null}>
        <Trajectory onClose={() => history.back()} pageData={pageData} />
      </Suspense>
    )
  }

  if (currentPage === 'portfolio') {
    return (
      <Suspense fallback={null}>
        <PortfolioPage onClose={() => history.back()} pageData={pageData} />
      </Suspense>
    )
  }

  if (currentPage === 'admin' && isLoggedIn) {
    return (
      <Suspense fallback={null}>
        <AdminPanel onLogout={handleAdminLogout} onDataSaved={handleDataSaved} />
      </Suspense>
    )
  }

  if (currentPage === 'subservice' && selectedSubServiceId && selectedServiceId) {
    return (
      <Suspense fallback={null}>
        <SubServiceDetail
          subServiceId={selectedSubServiceId}
          parentServiceId={selectedServiceId}
          onClose={handleCloseDetail}
          onGoHome={handleGoHome}
          onPortfolioClick={handlePortfolioClick}
          pageData={pageData}
        />
      </Suspense>
    )
  }

  if (currentPage === 'service' && selectedServiceId) {
    return (
      <Suspense fallback={null}>
        <ServiceDetail
          serviceId={selectedServiceId}
          onClose={handleCloseDetail}
          onSubServiceClick={handleSubServiceClick}
          onGoHome={handleGoHome}
          onPortfolioClick={handlePortfolioClick}
          pageData={pageData}
        />
      </Suspense>
    )
  }

  if (currentPage === 'course' && selectedCourseId) {
    return (
      <Suspense fallback={null}>
        <CourseDetail courseId={selectedCourseId} onClose={handleCloseCourseDetail} onGoHome={handleGoHome} onPortfolioClick={handlePortfolioClick} pageData={pageData} />
      </Suspense>
    )
  }

  return (
    <div className="app">
      <Navbar pageData={pageData} onPortfolioClick={handlePortfolioClick} />
      <Hero heroData={pageData?.hero} />
      <AboutMe pageData={pageData} onTrajectoryClick={handleTrajectoryClick} />
      <div className="announcement-strip">
        <span>Porque los grandes momentos merecen un maquillaje inolvidable.</span>
      </div>
      <Services onServiceClick={handleServiceClick} pageData={pageData} />
      <Courses onCourseClick={handleCourseClick} pageData={pageData} />
      <Testimonials pageData={pageData} />
      <FAQ pageData={pageData} />
      <Portfolio pageData={pageData} />
      <Location pageData={pageData} />
      <Contact pageData={pageData} />
      <Footer onAdminClick={handleAdminLogin} pageData={pageData} />
    </div>
  )
}

export default App
