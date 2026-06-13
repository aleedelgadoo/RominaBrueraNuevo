import { useState } from 'react'
import './FAQ.css'

interface FAQItem {
  id: number
  question: string
  answer: string
}

interface FAQProps {
  pageData?: any
}

const DEFAULT_FAQS: FAQItem[] = [
  { id: 1, question: '¿Cuánto tiempo antes debo agendar mi cita?', answer: 'Se recomienda agendar con al menos 2 semanas de anticipación para asegurar disponibilidad, especialmente en temporada alta como novias y eventos sociales.' },
  { id: 2, question: '¿Realizas maquillaje a domicilio?', answer: 'Sí, realizamos servicios a domicilio. El valor puede variar según la ubicación y la cantidad de personas a maquillar.' },
  { id: 3, question: '¿Qué productos utilizas?', answer: 'Utilizamos productos de marcas profesionales de alta calidad, dermatológicamente probados. Trabajamos con marcas reconocidas en la industria del maquillaje profesional.' },
  { id: 4, question: '¿Cuál es el costo de los servicios?', answer: 'Los precios varían según el tipo de evento y la complejidad del maquillaje. Consulta sin compromiso para obtener un presupuesto personalizado.' },
  { id: 5, question: '¿Realizas maquillaje para pieles sensibles?', answer: 'Claro, trabajamos con clientes de todo tipo de piel incluyendo pieles sensibles. Te recomendamos mencionar cualquier alergia o sensibilidad al agendar.' },
  { id: 6, question: '¿Cuál es la duración del maquillaje?', answer: 'El maquillaje dura todo el evento cuando utilizamos técnicas y productos de fijación profesional. Para eventos largos recomendamos un retoque a mitad de la jornada.' },
]

const FAQ = ({ pageData }: FAQProps) => {
  const [openId, setOpenId] = useState<number | null>(null)

  const faqItems: FAQItem[] =
    pageData?.faq?.length > 0 ? pageData.faq : DEFAULT_FAQS

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="faq" id="faq">
      <div className="faq-wrapper">

        <div className="faq-header">
          <span className="faq-eyebrow">Consultas</span>
          <h2 className="faq-section-title">PREGUNTAS<br />FRECUENTES</h2>
          <div className="faq-header-accent" />
        </div>

        <div className="faq-content">
          {faqItems.map((item) => (
            <div key={item.id} className="faq-item">
              <button
                className={`faq-question ${openId === item.id ? 'open' : ''}`}
                onClick={() => toggleFAQ(item.id)}
                aria-expanded={openId === item.id}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{openId === item.id ? '−' : '+'}</span>
              </button>
              {openId === item.id && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FAQ
