'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { RotatingWord } from '@/components/animations/RotatingWord'
import { CONTENT } from '@/lib/constants'

const EASE = [0.23, 1, 0.32, 1] as const

export function HeroSection() {
  const { hero } = CONTENT
  const ref    = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -130])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        src="/hero-video.mp4"
        autoPlay muted loop playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Dot grid texture */}
      <div className="absolute inset-0 z-[1] dot-grid pointer-events-none opacity-40" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b from-bg-primary/82 via-bg-primary/45 to-bg-primary/88" />

      {/* Ambient blobs */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div
          className="absolute w-[750px] h-[750px] rounded-full bg-brand-purple opacity-[0.20] blur-[150px] -top-48 -right-24"
          style={{ animation: 'drift 18s ease-in-out infinite alternate' }}
        />
        <div
          className="absolute w-[550px] h-[550px] rounded-full bg-brand-teal opacity-[0.14] blur-[130px] -bottom-16 -left-28"
          style={{ animation: 'drift 20s ease-in-out infinite alternate', animationDelay: '-7s' }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full bg-neon-pink opacity-[0.09] blur-[100px] top-1/2 left-1/3 -translate-x-1/2"
          style={{ animation: 'drift 25s ease-in-out infinite alternate', animationDelay: '-3s' }}
        />
      </div>

      {/* Parallax content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-[3] text-center max-w-4xl mx-auto px-6 pt-28 pb-20"
      >
        <motion.h1
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.08, ease: EASE }}
          className="font-heebo font-black text-white leading-[1.05] mb-6"
          style={{
            fontSize: 'clamp(36px, 5.5vw, 80px)',
            letterSpacing: '-0.03em',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          {hero.headlinePrefix}{' '}
          <RotatingWord words={hero.rotatingWords} />{' '}
          {hero.headlineSuffix}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="text-text-secondary text-xl leading-relaxed max-w-xl mx-auto mb-10 font-rubik font-medium"
        >
          {hero.sub}
        </motion.p>

        {/* CTA with pulsing glow ring */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.46, ease: EASE }}
          style={{ position: 'relative', display: 'inline-flex' }}
        >
          <motion.span
            aria-hidden
            animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.15, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -6, borderRadius: 999,
              background: 'linear-gradient(135deg, #2dd4bf, #a855f7)',
              filter: 'blur(10px)', zIndex: 0,
            }}
          />
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="relative inline-flex items-center justify-center font-heebo font-bold text-[15px] px-9 py-4 rounded-full text-white"
            style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #38bdf8 50%, #a855f7 100%)',
              boxShadow: '0 0 32px rgba(45,212,191,0.40)',
              zIndex: 1,
            }}
          >
            {hero.ctaPrimary}
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3]"
        aria-hidden
      >
        <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  )
}
