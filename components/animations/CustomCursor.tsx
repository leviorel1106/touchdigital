'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const CURSOR_ICON = '/icons/fp1.png'
const SIZE = 40

export function CustomCursor() {
  const elRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const el = elRef.current
    if (!el) return

    el.style.display = 'block'

    let rafId = 0
    let cx = -200
    let cy = -200

    function onMove(e: MouseEvent) {
      cx = e.clientX
      cy = e.clientY
    }

    function loop() {
      el!.style.transform = `translate(${cx - SIZE / 2}px, ${cy - SIZE / 2}px)`
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [reduce])

  return (
    <div
      ref={elRef}
      aria-hidden
      style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        pointerEvents: 'none',
        zIndex: 99999,
        mixBlendMode: 'screen',
        userSelect: 'none',
        willChange: 'transform',
      }}
    >
      <img
        src={CURSOR_ICON}
        alt=""
        draggable={false}
        style={{ width: '100%', height: '100%', display: 'block', borderRadius: '50%' }}
      />
    </div>
  )
}
