'use client'
import { motion, type Variants } from 'framer-motion'
import { GodRays } from '@/components/animations/GodRays'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

const AI_STUDIO_LETTERS = 'AI STUDIO'.split('')

const letterVariant: Variants = {
  hidden: { opacity: 1, y: 28, filter: 'blur(0px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.048, duration: 0.65, ease: EASE },
  }),
}

const fadeUp: Variants = {
  hidden: { opacity: 1, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

export function RobotSection() {
  return (
    <section
      id="robot"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100dvh',
        background: '#020008',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <GodRays />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '100px 24px 0',
          width: '100%',
        }}
      >
        {/* Eyebrow */}
        <motion.span
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-rubik)',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: 999,
            padding: '5px 16px',
            marginBottom: 22,
          }}
        >
          AI Powered Agency
        </motion.span>

        {/* "Touch Digital" */}
        <motion.span
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: 'var(--font-heebo)',
            fontWeight: 400,
            fontSize: 'clamp(18px, 2.8vw, 42px)',
            letterSpacing: '0.20em',
            color: 'rgba(255,255,255,0.65)',
            display: 'block',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Touch Digital
        </motion.span>

        {/* "AI STUDIO" ג€” per-letter reveal */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', lineHeight: 1, direction: 'ltr' }}>
          {AI_STUDIO_LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'var(--font-heebo)',
                fontWeight: 900,
                fontSize: 'clamp(60px, 11vw, 150px)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                display: 'inline-block',
                ...(ch === ' ' ? { width: '0.28em' } : {}),
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
