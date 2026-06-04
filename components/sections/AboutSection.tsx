'use client'
import { useRef } from 'react'
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { CountUp } from '@/components/animations/CountUp'
import { CONTENT } from '@/lib/constants'

const STAT_COLORS = ['#2dd4bf', '#a855f7', '#38bdf8']

export function AboutSection() {
  const { about, stats } = CONTENT
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const watermarkX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])

  return (
    <SectionWrapper id="about" className="overflow-hidden" style={{ background: '#ffffff' }}>
      <div ref={ref} className="relative">
        {/* Parallax watermark BG text */}
        <m.p
          className="absolute inset-0 font-heebo font-black leading-none pointer-events-none select-none text-center"
          style={{ fontSize: 'clamp(32px, 7vw, 96px)', top: '-0.1em', letterSpacing: '-0.02em', x: watermarkX, color: 'rgba(0,0,0,0.04)' }}
          aria-hidden
        >
          {about.headlineBg}
        </m.p>

        <div className="relative grid lg:grid-cols-2 gap-16 items-center pt-6">
          <FadeInUp>
            <h2
              className="font-heebo font-black mb-6 leading-tight"
              style={{
                fontSize: 'clamp(26px, 3.2vw, 44px)',
                letterSpacing: '-0.03em',
                textWrap: 'balance' as React.CSSProperties['textWrap'],
                color: '#0a0a1a',
              }}
            >
              {about.headline}
            </h2>
            <p className="text-base leading-relaxed font-rubik font-semibold" style={{ color: '#374151' }}>{about.body}</p>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="flex flex-col gap-8">
              {stats.map((s, i) => (
                <div key={i} className="flex items-baseline gap-4 pb-8 last:pb-0" style={{ borderBottom: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
                  <CountUp
                    value={s.number}
                    className="font-heebo font-black text-5xl tabular-nums"
                    style={{ color: STAT_COLORS[i] }}
                  />
                  <p className="text-[15px] font-rubik font-medium leading-snug" style={{ color: '#6b7280' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>
      </div>
    </SectionWrapper>
  )
}
