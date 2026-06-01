'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const ICONS = ['/icons/fp1.png', '/icons/fp2.png', '/icons/fp3.png', '/icons/fp4.png']

type Particle = {
  id: number
  x: number
  y: number
  icon: string
  angle: number
  distance: number
  size: number
  rotateDelta: number
  duration: number
}

let uid = 0

export function TapBurst() {
  const [particles, setParticles] = useState<Particle[]>([])
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return

      const count = Math.floor(Math.random() * 4) + 5
      const baseAngle = Math.random() * 360

      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
        const angle = baseAngle + (360 / count) * i + (Math.random() - 0.5) * 25
        return {
          id: uid++,
          x: e.clientX,
          y: e.clientY,
          icon: ICONS[Math.floor(Math.random() * ICONS.length)],
          angle,
          distance: 90 + Math.random() * 130,
          size: 38 + Math.random() * 26,
          rotateDelta: (Math.random() - 0.5) * 280,
          duration: 0.65 + Math.random() * 0.35,
        }
      })

      setParticles(prev => [...prev, ...newParticles])

      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)))
      }, 1400)
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [reduce])

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}
    >
      <AnimatePresence>
        {particles.map(p => {
          const rad = (p.angle * Math.PI) / 180
          const dx = Math.cos(rad) * p.distance
          const dy = Math.sin(rad) * p.distance
          return (
            <motion.img
              key={p.id}
              src={p.icon}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                left: p.x - p.size / 2,
                top: p.y - p.size / 2,
                width: p.size,
                height: p.size,
                mixBlendMode: 'screen',
                userSelect: 'none',
                pointerEvents: 'none',
                borderRadius: '50%',
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: dx,
                y: dy,
                scale: [0, 1.15, 0.9, 0],
                opacity: [0, 1, 0.85, 0],
                rotate: p.rotateDelta,
              }}
              transition={{
                duration: p.duration,
                ease: [0.23, 1, 0.32, 1],
              }}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}
