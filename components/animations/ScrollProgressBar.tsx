'use client'
import { m, useScroll, useReducedMotion } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const reduce = useReducedMotion()

  if (reduce) return null

  return (
    <m.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[500] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #2dd4bf, #a855f7, #ff2d92)',
      }}
    />
  )
}
