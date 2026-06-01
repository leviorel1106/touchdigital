'use client'
import { useRef, useState, useEffect } from 'react'
import { SPLINE_SCENES } from '@/lib/spline-config'

export function HoverBoxes({ className = '', fullscreen = false }: { className?: string; fullscreen?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${fullscreen ? 'absolute inset-0' : 'w-full h-[560px] md:h-[640px]'} ${className}`}
    >
      {/* skeleton */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-3xl" />
      )}

      {inView && (
        <iframe
          src={SPLINE_SCENES.hoverBoxes}
          title="Hover Boxes 3D"
          allow="autoplay"
          onLoad={() => setLoaded(true)}
          className="w-full h-[calc(100%+48px)] border-0 block"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        />
      )}

      {/* bottom fade for readability */}
      {!fullscreen && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      )}
    </div>
  )
}
