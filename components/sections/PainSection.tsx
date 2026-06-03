'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { CONTENT } from '@/lib/constants'
import { PainBurnCanvas } from './PainBurnCanvas'

const EASE = [0.23, 1, 0.32, 1] as const

function PainTextContent({ body }: { body: string }) {
  return (
    <div
      className="relative flex flex-col justify-center h-full px-6 md:px-16 lg:px-24"
      style={{ zIndex: 6, maxWidth: '680px', paddingTop: '80px', paddingBottom: '80px' }}
    >
      <motion.h2
        initial={{ opacity: 1, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="font-heebo font-black text-white mb-6 leading-tight"
        style={{
          fontSize: 'clamp(36px, 5vw, 68px)',
          letterSpacing: '-0.03em',
          textWrap: 'balance' as React.CSSProperties['textWrap'],
        }}
      >
        למה{' '}
        <span className="relative inline-block">
          <span className="text-neon-pink">לשרוף</span>
          <motion.span
            className="absolute bottom-0 right-0 left-0 h-[3px] rounded-full bg-neon-pink"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            style={{ originX: 1 }}
          />
        </span>{' '}
        כסף ממומן?
      </motion.h2>

      <motion.p
        initial={{ opacity: 1, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
        className="text-white/90 text-xl leading-relaxed font-rubik font-medium"
      >
        {body}
      </motion.p>
    </div>
  )
}

function PainMobileText({ body }: { body: string }) {
  return (
    <div
      className="relative flex flex-col justify-center h-full px-6"
      style={{ zIndex: 6, maxWidth: '680px', paddingTop: '80px', paddingBottom: '80px' }}
    >
      <h2
        className="font-heebo font-black text-white mb-6 leading-tight"
        style={{
          fontSize: 'clamp(36px, 5vw, 68px)',
          letterSpacing: '-0.03em',
          textWrap: 'balance' as React.CSSProperties['textWrap'],
        }}
      >
        למה{' '}
        <span className="text-neon-pink">לשרוף</span>
        {' '}כסף ממומן?
      </h2>
      <p className="text-white/90 text-xl leading-relaxed font-rubik font-medium">
        {body}
      </p>
    </div>
  )
}

const OVERLAY_STYLE: React.CSSProperties = {
  background:
    'linear-gradient(135deg, rgba(10,14,42,0.90) 0%, rgba(10,14,42,0.65) 35%, rgba(10,14,42,0.10) 65%, transparent 100%)',
  zIndex: 5,
}

export function PainSection() {
  const desktopRef    = useRef<HTMLDivElement>(null)
  const burnProgressRef = useRef<number>(0)
  const mobileRef      = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: desktopRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const raw = (v - 0.08) / 0.84
    burnProgressRef.current = Math.min(1, Math.max(0, raw))
  })

  const { scrollYProgress: mobileScroll } = useScroll({
    target: mobileRef,
    offset: ['start start', 'end end'],
  })
  const mobileImageOpacity = useTransform(mobileScroll, [0.08, 0.92], [1, 0])

  const { pain } = CONTENT

  return (
    <section id="pain" style={{ position: 'relative' }}>

      {/* ── Mobile: scroll-driven crossfade, no WebGL, no fixed panel ── */}
      <div
        ref={mobileRef}
        className="mob-only"
        style={{ height: reduce ? 'auto' : '250dvh', position: 'relative' }}
      >
        <div
          style={{
            position: reduce ? 'relative' : 'sticky',
            top: 0,
            height: reduce ? 'auto' : '100dvh',
            minHeight: reduce ? 600 : undefined,
            overflow: 'hidden',
          }}
        >
          {/* Layer 1: reveal-image always behind */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <Image src="/reveal-image.png" alt="" fill sizes="100vw"
              style={{ objectFit: 'cover' }} loading="lazy" />
          </div>

          {/* Layer 2: CSS opacity crossfade (no WebGL on mobile) */}
          <motion.div
            aria-hidden
            style={{ position: 'absolute', inset: 0, zIndex: 2,
              opacity: reduce ? 1 : mobileImageOpacity }}
          >
            <Image src="/pain-image.png" alt="" fill sizes="100vw"
              style={{ objectFit: 'cover' }} loading="lazy" />
          </motion.div>

          {/* Layer 3: gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={OVERLAY_STYLE} />

          {/* Layer 4: text */}
          <PainMobileText body={pain.body} />
        </div>
      </div>

      {/* ── Desktop: sticky scroll + WebGL burn ─────────── */}
      <div
        ref={desktopRef}
        className="desk-only"
        style={{ height: reduce ? 'auto' : '600vh', position: 'relative' }}
      >
        <div
          style={{
            position: reduce ? 'relative' : 'sticky',
            top: 0,
            height: reduce ? 'auto' : '100dvh',
            minHeight: reduce ? 600 : undefined,
            overflow: 'hidden',
          }}
        >
          {/* Layer 1: reveal-image always behind canvas */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <Image src="/reveal-image.png" alt="" fill sizes="100vw"
              style={{ objectFit: 'cover' }} loading="lazy" />
          </div>

          {/* Layer 2: WebGL canvas (desktop only) */}
          {!reduce && <PainBurnCanvas burnProgressRef={burnProgressRef} />}
          {reduce && (
            <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
              <Image src="/pain-image.png" alt="" fill sizes="100vw"
                style={{ objectFit: 'cover' }} loading="lazy" />
            </div>
          )}

          {/* Layer 3: gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={OVERLAY_STYLE} />

          {/* Layer 4: text */}
          <PainTextContent body={pain.body} />
        </div>
      </div>

    </section>
  )
}
