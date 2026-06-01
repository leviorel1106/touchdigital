import { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  id?: string
  className?: string
  innerClassName?: string
  style?: CSSProperties
}

export function SectionWrapper({ children, id, className = '', innerClassName = '', style }: Props) {
  return (
    <section id={id} className={`relative z-10 py-24 md:py-32 ${className}`} style={style}>
      <div className={`max-w-7xl mx-auto px-4 md:px-8 ${innerClassName}`}>
        {children}
      </div>
    </section>
  )
}

export function Eyebrow({ children, color = 'teal' }: { children: ReactNode; color?: 'teal' | 'purple' | 'pink' }) {
  const colors = {
    teal:   'bg-brand-teal/10 border-brand-teal/25 text-brand-teal',
    purple: 'bg-brand-purple/10 border-brand-purple/25 text-brand-purple',
    pink:   'bg-neon-pink/10 border-neon-pink/25 text-neon-pink',
  }
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] mb-5 ${colors[color]}`}>
      {children}
    </div>
  )
}
