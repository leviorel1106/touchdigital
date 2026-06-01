'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeInUp({ children, delay = 0, className = '' }: Props) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: reduce ? 0.01 : 0.6,
        delay: reduce ? 0 : delay,
        ease: [0.23, 1, 0.32, 1] as const,
      }}
    >
      {children}
    </motion.div>
  )
}
