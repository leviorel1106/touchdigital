'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Film, Sparkles, Bot, Image, Cog, MapPin } from 'lucide-react'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { CONTENT } from '@/lib/constants'
import { SPLINE_SCENES } from '@/lib/spline-config'

const ICONS: Record<string, React.ElementType> = { Globe, Film, Sparkles, Bot, Image, Cog, MapPin }

const PILLAR_COLORS = [
  '#2dd4bf', '#a855f7', '#38bdf8', '#ff2d92', '#f97316', '#d946ef', '#2dd4bf',
]

const EASE = [0.23, 1, 0.32, 1] as const

function KeyboardBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 z-0 overflow-hidden">
      {/* iframe scaled & extended beyond bounds to fill the section with keyboard content */}
      {inView && (
        <div className="desk-only" style={{ position: 'absolute', inset: 0 }}>
          <iframe
            src={SPLINE_SCENES.hoverBoxes}
            title="Keyboard Background"
            allow="autoplay"
            onLoad={() => setLoaded(true)}
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-10%',
              width: '120%',
              height: '130%',
              border: 'none',
              display: 'block',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
        </div>
      )}

      {/* Gradient overlays — pointer-events-none so they don't block mouse events from reaching the iframe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(7,7,11,0.82) 0%, rgba(7,7,11,0.30) 35%, rgba(7,7,11,0.30) 65%, rgba(7,7,11,0.90) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(7,7,11,0.70) 0%, transparent 30%, transparent 70%, rgba(7,7,11,0.70) 100%)',
        }}
      />
    </div>
  )
}

export function SolutionSection() {
  const { solution } = CONTENT

  return (
    <section
      id="solution"
      className="relative z-10 overflow-hidden flex flex-col justify-between"
      style={{ minHeight: '100dvh' }}
    >
      <KeyboardBackground />

      {/* Content — pointer-events-none on wrapper so empty space passes events to keyboard iframe */}
      <div className="relative z-[1] max-w-7xl mx-auto px-4 md:px-8 w-full pt-28 pb-24 flex flex-col h-full pointer-events-none" style={{ minHeight: '100dvh', justifyContent: 'space-between' }}>

        {/* Headline — no interaction needed */}
        <FadeInUp className="text-center max-w-2xl mx-auto pointer-events-none">
          <h2
            className="font-heebo font-black text-white mb-4 leading-tight"
            style={{
              fontSize: 'clamp(30px, 3.8vw, 50px)',
              letterSpacing: '-0.03em',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            {solution.headline}
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed font-rubik font-medium">
            {solution.sub}
          </p>
        </FadeInUp>

        {/* Pillars grid — restore pointer-events so cards are hoverable */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-16 pointer-events-auto">
          {solution.pillars.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Globe
            const color = PILLAR_COLORS[i % PILLAR_COLORS.length]

            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 1, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  boxShadow: `0 0 30px ${color}30`,
                  borderColor: `${color}45`,
                }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col gap-3 rounded-2xl border p-5 cursor-default overflow-hidden"
                style={{
                  background: 'rgba(7, 7, 11, 0.88)',
                  borderColor: 'rgba(255,255,255,0.10)',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                }}
              >
                {/* Corner glow */}
                <div
                  className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-[40px] opacity-35 pointer-events-none"
                  style={{ background: color }}
                />

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-[1]"
                  style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
                </div>

                {/* Text */}
                <div className="relative z-[1]">
                  <p className="font-heebo font-bold text-white text-sm leading-tight mb-1">
                    {p.title}
                  </p>
                  <p className="text-text-muted text-[13px] font-rubik font-medium leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
