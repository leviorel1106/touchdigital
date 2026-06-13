'use client'
import React, { useRef } from 'react'
import { m, useReducedMotion, useInView } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { MarqueeStrip } from '@/components/animations/MarqueeStrip'
import { CONTENT } from '@/lib/constants'

const EASE = [0.23, 1, 0.32, 1] as const

const MARQUEE_ITEMS = [
  '⭐⭐⭐⭐⭐', '500+ לקוחות מרוצים', '10+ שנות ניסיון', '98% שביעות רצון',
  'מומחי הסוכנויות המובילות', 'תוצאות מוכחות', 'מובילים בתחום', '100% מקצועיות',
]

interface TestimonialItem {
  readonly name: string
  readonly role: string
  readonly quote: string
  readonly rating: number
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4 justify-end">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-xs">★</span>
      ))}
    </div>
  )
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const initials = item.name.replace(/[\[\]]/g, '').trim().slice(0, 2) || 'ל׳'
  return (
    <m.li
      dir="rtl"
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      }}
      className="p-7 rounded-3xl border border-neutral-200 shadow-sm max-w-xs w-full bg-white cursor-default select-none list-none"
    >
      <Stars count={item.rating} />
      <blockquote className="m-0 p-0">
        <p className="font-rubik font-medium text-sm leading-relaxed text-neutral-700 mb-5">
          &ldquo;{item.quote}&rdquo;
        </p>
        <footer className="flex items-center gap-3 flex-row-reverse justify-end">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-heebo font-black text-xs flex-shrink-0"
            style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#a855f7' }}
          >
            {initials}
          </div>
          <div className="text-right">
            <cite className="font-heebo font-bold text-sm not-italic text-neutral-900 block">{item.name}</cite>
            <span className="text-xs font-rubik text-neutral-500">{item.role}</span>
          </div>
        </footer>
      </blockquote>
    </m.li>
  )
}

function TestimonialsColumn({
  items,
  duration = 15,
  className = '',
}: {
  items: readonly TestimonialItem[]
  duration?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '200px 0px' })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <m.ul
        animate={reduce || !inView ? {} : { translateY: '-50%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-5 pb-5 m-0 p-0"
        style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
      >
        {[0, 1].map(pass => (
          <React.Fragment key={pass}>
            {items.map((item, i) => (
              <TestimonialCard key={`${pass}-${i}`} item={item} />
            ))}
          </React.Fragment>
        ))}
      </m.ul>
    </div>
  )
}

export function TestimonialsSection() {
  const { testimonials } = CONTENT
  const col1 = testimonials.items.slice(0, 3)
  const col2 = testimonials.items.slice(3, 6)
  const col3 = testimonials.items.slice(6, 9)

  return (
    <SectionWrapper id="testimonials" style={{ background: '#ffffff' }}>
      <m.div
        initial={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mb-14 text-right"
        dir="rtl"
      >
        <h2
          className="font-heebo font-black"
          style={{
            fontSize: 'clamp(30px, 4vw, 52px)',
            letterSpacing: '-0.03em',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
            color: '#0a0a1a',
          }}
        >
          {testimonials.headline}
        </h2>
      </m.div>

      {/* Scrolling columns */}
      <div
        className="flex justify-center gap-5 mb-16"
        style={{
          maxHeight: 720,
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <TestimonialsColumn items={col1} duration={15} />
        <TestimonialsColumn items={col2} duration={19} className="hidden md:block" />
        <TestimonialsColumn items={col3} duration={17} className="hidden lg:block" />
      </div>

      {/* Trust marquee */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 w-20 z-[1] pointer-events-none" style={{ background: 'linear-gradient(to left, #ffffff, transparent)' }} />
        <div className="absolute inset-y-0 left-0 w-20 z-[1] pointer-events-none" style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }} />
        <MarqueeStrip className="py-3">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-rubik font-medium whitespace-nowrap px-4" style={{ color: '#6b7280', borderRight: '1px solid rgba(0,0,0,0.07)' }}>
              {item}
            </span>
          ))}
        </MarqueeStrip>
      </div>
    </SectionWrapper>
  )
}
