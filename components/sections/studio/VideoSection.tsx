'use client'
import { useRef } from 'react'
import { m } from 'framer-motion'
import { FadeInUp } from '@/components/animations/FadeInUp'

const EASE = [0.23, 1, 0.32, 1] as const

interface VideoSectionProps {
  title: string
  sub: string
  src: string
  accent: string
  id?: string
}

export function VideoSection({ title, sub, src, accent, id }: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <section
      id={id}
      style={{
        background: '#07070B',
        padding: '100px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}18 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <FadeInUp className="text-center mb-12">
          {/* Eyebrow */}
          <span
            className="inline-block font-rubik font-medium text-[11px] uppercase mb-4"
            style={{
              letterSpacing: '0.22em',
              color: accent,
              border: `1px solid ${accent}40`,
              borderRadius: 999,
              padding: '4px 14px',
            }}
          >
            {sub}
          </span>

          {/* Main title */}
          <h2
            className="font-heebo font-black text-white leading-tight"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 48px)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
        </FadeInUp>

        {/* Video frame */}
        <m.div
          initial={{ opacity: 1, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: `1px solid ${accent}20`,
            boxShadow: `0 0 60px ${accent}12, 0 24px 80px rgba(0,0,0,0.6)`,
            background: '#000',
          }}
        >
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full block"
            style={{ maxHeight: '70vh', objectFit: 'contain' }}
          />
        </m.div>
      </div>
    </section>
  )
}
