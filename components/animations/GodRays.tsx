'use client'
import { m } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

const CONIC = `conic-gradient(
  from 0deg at 50% 50%,
  #020008   0deg,
  #2dd4bf  15deg,
  #020008  30deg,
  #a855f7  48deg,
  #020008  63deg,
  rgba(255,255,255,0.55) 76deg,
  #020008  91deg,
  #2dd4bf 108deg,
  #020008 123deg,
  #a855f7 141deg,
  #020008 156deg,
  #2dd4bf 172deg,
  #020008 187deg,
  rgba(255,255,255,0.40) 198deg,
  #020008 213deg,
  #a855f7 231deg,
  #020008 246deg,
  #2dd4bf 264deg,
  #020008 279deg,
  #a855f7 297deg,
  #020008 312deg,
  rgba(255,255,255,0.35) 323deg,
  #020008 338deg,
  #020008 360deg
)`

export function GodRays() {
  const reduce = useReducedMotion()

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

      {/* Rotating conic gradient — the rays */}
      <m.div
        style={{
          position: 'absolute',
          top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
          background: CONIC,
          filter: 'blur(4px)',
        }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      />

      {/* Dark center circle */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(circle at 50% 50%, #020008 0%, #020008 12%, transparent 42%)',
        }}
      />

      {/* Edge vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 28%, #020008 86%)',
        }}
      />

    </div>
  )
}
