'use client'
import { motion, type Variants } from 'framer-motion'
import { GodRays } from '@/components/animations/GodRays'

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number]

const AI_LETTER_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #2dd4bf 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontFamily: 'var(--font-heebo)',
  fontWeight: 900,
  fontSize: 'clamp(64px, 12vw, 160px)',
  lineHeight: 1,
  letterSpacing: '-0.02em',
  display: 'inline-block',
  willChange: 'transform, opacity, filter',
}

const TOUCH_DIGITAL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-heebo)',
  fontWeight: 400,
  fontSize: 'clamp(20px, 3vw, 44px)',
  letterSpacing: '0.20em',
  color: 'rgba(255,255,255,0.68)',
  display: 'block',
  textTransform: 'uppercase',
  marginBottom: 8,
}

const TAGLINE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-rubik)',
  fontWeight: 400,
  fontSize: 'clamp(15px, 1.8vw, 20px)',
  color: 'rgba(255,255,255,0.44)',
  lineHeight: 1.65,
  maxWidth: 520,
  margin: '28px auto 0',
}

const EYEBROW_STYLE: React.CSSProperties = {
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
  marginBottom: 24,
}

const AI_STUDIO_LETTERS = 'AI STUDIO'.split('')

const letterVariant: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(14px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: 0.35 + i * 0.048, duration: 0.65, ease: EASE },
  }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

export function GodRaysSection() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100dvh',
        background: '#020008',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* God Rays animated background */}
      <GodRays />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '80px 24px',
          width: '100%',
        }}
      >
        {/* Eyebrow */}
        <motion.span
          style={EYEBROW_STYLE}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          AI Powered Agency
        </motion.span>

        {/* "Touch Digital" */}
        <motion.span
          style={TOUCH_DIGITAL_STYLE}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        >
          Touch Digital
        </motion.span>

        {/* "AI STUDIO" ג€” per-letter reveal */}
        <div
          style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', lineHeight: 1 }}
        >
          {AI_STUDIO_LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              style={{
                ...AI_LETTER_STYLE,
                ...(ch === ' ' ? { width: '0.3em' } : {}),
              }}
            >
              {ch === ' ' ? 'ֲ ' : ch}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          style={TAGLINE_STYLE}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        >
          ׳׳ ׳—׳ ׳• ׳׳ ׳¨׳§ ׳¡׳•׳›׳ ׳•׳× ׳©׳™׳•׳•׳§׳™׳× ג€” ׳׳ ׳—׳ ׳• ׳¡׳˜׳•׳“׳™׳• ׳‘׳™׳ ׳” ׳׳׳׳›׳•׳×׳™׳× ׳©׳׳ ׳™׳¢ ׳×׳•׳¦׳׳•׳× ׳׳׳™׳×׳™׳•׳×
        </motion.p>

        {/* Robot video card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.1, delay: 1.1, ease: EASE }}
          style={{
            marginTop: 52,
            display: 'inline-block',
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            maxWidth: 680,
            width: '100%',
          }}
        >
          <video
            src="/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
