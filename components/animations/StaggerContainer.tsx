'use client'
import { m, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

const EASE = [0.23, 1, 0.32, 1] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 1, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

const itemReduced = {
  hidden: { opacity: 1 },
  show:   { opacity: 1, transition: { duration: 0.2 } },
}

export function StaggerContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <m.div className={className} variants={reduce ? itemReduced : itemVariants}>
      {children}
    </m.div>
  )
}
