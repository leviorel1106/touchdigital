'use client'
import { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  reverse?: boolean
}

export function MarqueeStrip({ children, className = '', reverse = false }: Props) {
  const reduce = useReducedMotion()

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={reduce ? 'flex gap-8' : reverse ? 'flex gap-8 w-max marquee-inner-reverse' : 'flex gap-8 w-max marquee-inner'}>
        {children}
        {!reduce && children}
      </div>
    </div>
  )
}
