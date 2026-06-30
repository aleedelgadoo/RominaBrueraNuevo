import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface LazyBackgroundProps {
  src?: string
  className?: string
  style?: CSSProperties
  onClick?: () => void
  children?: ReactNode
}

const LazyBackground = ({ src, className, style, onClick, children }: LazyBackgroundProps) => {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      style={{
        ...style,
        ...(inView && src ? { backgroundImage: `url(${src})` } : undefined),
      }}
    >
      {children}
    </div>
  )
}

export default LazyBackground
