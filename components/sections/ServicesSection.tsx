'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Layout, MessageCircle, Video, Search, Palette, Globe } from 'lucide-react'
import { CONTENT } from '@/lib/constants'

const EASE = [0.23, 1, 0.32, 1] as const

const ICONS: Record<string, React.ElementType> = {
  Layout, MessageCircle, Video, Search, Palette, Globe,
  Instagram: Globe,
}

// Brand colors only — teal and purple, alternating per card
const ACCENTS = ['#2dd4bf', '#a855f7']

// Two contextual chips per service, revealed on hover (desktop) or always visible (mobile)
const SERVICE_CHIPS: Record<string, [string, string]> = {
  'דפי נחיתה ממירים':       ['עיצוב UI', 'קופי שיווקי'],
  "צ'אטבוטים שיווקיים":     ['WhatsApp', 'אוטומציה 24/7'],
  'מייקאובר סושיאל':         ['פייסבוק', 'אינסטגרם'],
  'עריכת סרטונים':           ['ריילס', 'סטוריז'],
  'כרטיס Google Business':  ['GBP', 'SEO מקומי'],
  'מיתוג ויוקרה':            ['לוגו', 'שפה גרפית'],
}

export function ServicesSection() {
  const { services } = CONTENT

  return (
    <SectionWrapper id="services" className="bg-bg-secondary">
      <motion.div
        initial={{ opacity: 1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mb-14 text-right"
        dir="rtl"
      >
        <h2
          className="font-heebo font-black text-white"
          style={{
            fontSize: 'clamp(30px, 4vw, 52px)',
            letterSpacing: '-0.03em',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          {services.headline}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" dir="rtl">
        {services.items.map((item, i) => {
          const accent = ACCENTS[i % 2]
          const Icon   = ICONS[item.icon] ?? Layout
          const chips  = SERVICE_CHIPS[item.title] ?? ['שירות', 'מקצועי']

          return (
            <motion.div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border cursor-default"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
              initial={{ opacity: 1, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
              whileHover={{
                borderColor: `${accent}55`,
                boxShadow: `0 8px 32px ${accent}22`,
                backgroundColor: `${accent}0a`,
                transition: { duration: 0.25 },
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-[50px] pointer-events-none opacity-10 group-hover:opacity-25 transition-opacity duration-300"
                style={{ background: accent }}
              />

              {/* ── Header — always visible ── */}
              <div className="relative z-[1] flex items-center gap-3 px-5 py-5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} strokeWidth={1.5} />
                </div>

                <h3
                  className="font-heebo font-bold text-[15px] flex-1 transition-colors duration-300 group-hover:text-white"
                  style={{ color: accent }}
                >
                  {item.title}
                </h3>

                <span
                  className="text-sm opacity-40 group-hover:opacity-80 group-hover:-translate-x-1 transition-all duration-200 select-none"
                  style={{ color: accent }}
                >
                  ←
                </span>
              </div>

              {/* ── Surprise body ──
                  Mobile (< md): always visible — no max-h restriction
                  Desktop (≥ md): hidden by default, slides open on group-hover
              */}
              <div
                className="overflow-hidden md:max-h-0 md:group-hover:max-h-48"
                style={{ transition: 'max-height 0.4s cubic-bezier(0.23,1,0.32,1)' }}
              >
                <div className="relative z-[1] px-5 pb-5">
                  <p
                    className="font-rubik text-sm text-white/60 leading-relaxed mb-3 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 delay-75"
                  >
                    {item.body}
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {chips.map((chip, ci) => (
                      <span
                        key={chip}
                        className={`text-[11px] font-rubik font-medium px-2.5 py-1 rounded-full md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ${ci === 0 ? 'delay-[150ms]' : 'delay-[220ms]'}`}
                        style={{
                          background: `${accent}18`,
                          border: `1px solid ${accent}35`,
                          color: accent,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
