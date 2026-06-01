'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
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
        initial={{ opacity: 0, y: 40 }}
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
        initial={{ opacity: 0, y: 28 }}
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
  const desktopRef            = useRef<HTMLDivElement>(null)
  const mobileSpacerRef       = useRef<HTMLDivElement>(null)
  const mobilePanelRef        = useRef<HTMLDivElement>(null)
  const burnProgressRef       = useRef<number>(0)
  const mobileBurnProgressRef = useRef<number>(0)
  const reduce    = useReducedMotion()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const { scrollYProgress } = useScroll({
    target: desktopRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const raw = (v - 0.08) / 0.84
    burnProgressRef.current = Math.min(1, Math.max(0, raw))
  })

  // Mobile burn — position:fixed panel controlled by window scroll
  // fixed always works on iOS Safari regardless of overflow/z-index ancestors
  useEffect(() => {
    const spacer = mobileSpacerRef.current
    const panel  = mobilePanelRef.current
    if (!spacer || !panel) return
    function onScroll() {
      const { top, height } = spacer!.getBoundingClientRect()
      const vh = window.innerHeight
      const inView = top < vh && top + height > 0
      panel!.style.visibility = inView ? 'visible' : 'hidden'
      const maxScroll = height - vh
      if (maxScroll <= 0) return
      const raw = (-top - 0.08 * maxScroll) / (0.84 * maxScroll)
      mobileBurnProgressRef.current = Math.min(1, Math.max(0, raw))
    }
    onScroll() // run once on mount
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { pain } = CONTENT

  return (
    <section id="pain" style={{ position: 'relative', zIndex: 10 }}>

      {/* ── Mobile: fixed panel + scroll spacer ── */}
      {/* Spacer provides 250dvh scroll room; panel is position:fixed (always works on iOS Safari) */}
      <div className="mob-only" ref={mobileSpacerRef} style={{ height: '250dvh' }} />

      <div
        className="mob-only"
        ref={mobilePanelRef}
        style={{ position: 'fixed', inset: 0, zIndex: 8, visibility: 'hidden' }}
      >
          {/* Layer 1: reveal image — revealed as canvas burns away */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/reveal-image.png"
            alt=""
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          />
          {/* Layer 2: canvas only when confirmed mobile — prevents dual WebGL contexts on iOS */}
          {(isMobile === true && !reduce)
            ? <PainBurnCanvas burnProgressRef={mobileBurnProgressRef} />
            : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/pain-image.png" alt="" aria-hidden
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }} />
            )
          }
          {/* Layer 3: gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={OVERLAY_STYLE} />
          {/* Layer 4: text — always visible */}
          <PainMobileText body={pain.body} />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/reveal-image.png"
            alt=""
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          />

          {/* Layer 2: canvas only when confirmed desktop — prevents dual WebGL contexts on iOS */}
          {(isMobile !== true && !reduce) && <PainBurnCanvas burnProgressRef={burnProgressRef} />}
          {(reduce || isMobile === true) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/pain-image.png" alt="" aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }} />
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
