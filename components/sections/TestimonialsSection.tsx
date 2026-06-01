'use client'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { MarqueeStrip } from '@/components/animations/MarqueeStrip'
import { CONTENT } from '@/lib/constants'

const EASE = [0.23, 1, 0.32, 1] as const

const MARQUEE_ITEMS = [
  '⭐⭐⭐⭐⭐', '500+ לקוחות מרוצים', '10+ שנות ניסיון', '98% שביעות רצון',
  'מומחי הסוכנויות המובילות', 'תוצאות מוכחות', 'מובילים בתחום', '100% מקצועיות',
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-xs">★</span>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const { testimonials } = CONTENT
  const [first, ...rest] = testimonials.items

  return (
    <SectionWrapper id="testimonials" style={{ background: '#ffffff' }}>
      <FadeInUp className="mb-14">
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
      </FadeInUp>

      <StaggerContainer className="grid md:grid-cols-2 gap-5 mb-16">
        {/* Featured testimonial — purple accent on white */}
        <StaggerItem>
          <motion.div
            className="h-full p-8 rounded-2xl border flex flex-col relative overflow-hidden"
            style={{
              borderColor: 'rgba(168,85,247,0.20)',
              background: 'rgba(168,85,247,0.04)',
            }}
            whileHover={{ boxShadow: '0 8px 40px rgba(168,85,247,0.12)', scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-purple blur-[80px] opacity-10 pointer-events-none" />
            <Stars count={first.rating} />
            <p className="font-rubik font-medium text-lg leading-relaxed mb-8 italic flex-1 relative z-[1]" style={{ color: '#374151' }}>
              &ldquo;{first.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 relative z-[1]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-heebo font-black text-sm flex-shrink-0" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#a855f7' }}>
                {first.name[0]}
              </div>
              <div>
                <p className="font-heebo font-bold text-sm" style={{ color: '#0a0a1a' }}>{first.name}</p>
                <p className="text-xs font-rubik font-medium" style={{ color: '#6b7280' }}>{first.role}</p>
              </div>
            </div>
          </motion.div>
        </StaggerItem>

        {/* Remaining testimonials */}
        <div className="flex flex-col gap-5">
          {rest.map((t, i) => (
            <StaggerItem key={i}>
              <div className="p-6 rounded-2xl border" style={{ borderColor: 'rgba(0,0,0,0.07)', background: '#f9fafb' }}>
                <Stars count={t.rating} />
                <p className="font-rubik font-medium text-base leading-relaxed mb-5 italic" style={{ color: '#4b5563' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-heebo font-black text-xs flex-shrink-0" style={{ background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.25)', color: '#0d9488' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-heebo font-bold text-sm" style={{ color: '#0a0a1a' }}>{t.name}</p>
                    <p className="text-xs font-rubik font-medium" style={{ color: '#6b7280' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Decorative trust marquee */}
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
