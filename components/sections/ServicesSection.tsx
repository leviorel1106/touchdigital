'use client'
import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Layout, MessageCircle, Video, Search, Palette, Globe } from 'lucide-react'
import { CONTENT } from '@/lib/constants'

const EASE = [0.23, 1, 0.32, 1] as const

const ICONS: Record<string, React.ElementType> = {
  Layout, MessageCircle, Video, Search, Palette, Globe,
  Instagram: Globe,
}

const ACCENTS = ['#2dd4bf', '#a855f7']

const SERVICE_IMAGE: Record<string, string> = {
  'דפי נחיתה ממירים':    '/pic/landing page.png',
  "צ'אטבוטים שיווקיים": '/pic/automation.png',
  'מייקאובר סושיאל':     '/pic/makeover.png',
  'עריכת סרטונים':       '/pic/editing.png',
  'מיתוג ויוקרה':        '/pic/branding.png',
}

const SERVICE_CHIPS: Record<string, readonly [string, string, string, string]> = {
  'דפי נחיתה ממירים':    ['עיצוב UI', 'קופי שיווקי', 'CRO', 'A/B בדיקות'],
  "צ'אטבוטים שיווקיים": ['WhatsApp API', 'לידים 24/7', 'אוטומציה', 'Funnels'],
  'מייקאובר סושיאל':     ['פייסבוק', 'אינסטגרם', 'Brand Kit', 'Highlights'],
  'עריכת סרטונים':       ['ריילס', 'סטוריז', 'Trending Audio', 'Post-Production'],
  'מיתוג ויוקרה':        ['לוגו', 'שפה גרפית', 'Color System', 'Typography'],
}

// Chips scattered across the row — RTL positions (right-anchored), at text centerline
const CHIP_POSITIONS: Array<{ right: string; top: string; rotate: string }> = [
  { right: '4%',   top: 'calc(50% - 14px)', rotate: '-3deg' },
  { right: '26%',  top: 'calc(50% + 2px)',  rotate:  '4deg' },
  { right: '50%',  top: 'calc(50% - 16px)', rotate: '-2deg' },
  { right: '70%',  top: 'calc(50% + 4px)',  rotate:  '3deg' },
]

// Burst origin offsets: each chip starts near the icon card center (right~42%, top~-60px from row)
// and flies out to its final position. Values are approximate pixel offsets.
const CHIP_BURST: Array<{ x: number; y: number }> = [
  { x: 340,  y: -70 },  // chip 0 — far right, bursts rightward-up
  { x: 150,  y: -60 },  // chip 1 — center-right
  { x: -60,  y: -65 },  // chip 2 — center
  { x: -250, y: -55 },  // chip 3 — far left, bursts leftward-up
]

type ServiceItem = { readonly icon: string; readonly title: string; readonly body: string }

function ServiceRow({
  item,
  accent,
  index,
}: {
  item: ServiceItem
  accent: string
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const Icon   = ICONS[item.icon] ?? Layout
  const chips  = SERVICE_CHIPS[item.title] ?? ['שירות', 'מקצועי', 'מוביל', 'דיגיטלי'] as const
  const imgSrc = SERVICE_IMAGE[item.title]

  return (
    <m.div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'visible',
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 1, x: 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
    >
      {/* Floating icon card — appears above the row */}
      <AnimatePresence>
        {hovered && (
          <m.div
            key="icon-card"
            initial={{ opacity: 0, y: 16, rotate: -5, scale: 0.82 }}
            animate={{ opacity: 1, y: 0,  rotate:  0, scale: 1   }}
            exit={{   opacity: 0, y: 16,  rotate: -5, scale: 0.82 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{
              position: 'absolute',
              bottom: '100%',
              marginBottom: 10,
              right: '42%',
              width: 180,
              height: 120,
              background: `linear-gradient(135deg, ${accent}22, ${accent}0a)`,
              border: `1px solid ${accent}45`,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 8px 28px ${accent}28, inset 0 1px 0 rgba(255,255,255,0.06)`,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            {imgSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgSrc}
                alt={item.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }}
              />
            ) : (
              <Icon size={44} color={accent} strokeWidth={1.2} />
            )}
          </m.div>
        )}
      </AnimatePresence>

      {/* Scattered chips */}
      <AnimatePresence>
        {hovered && chips.map((chip, ci) => {
          const pos   = CHIP_POSITIONS[ci]
          const burst = CHIP_BURST[ci]
          return (
            <m.span
              key={chip}
              initial={{ opacity: 0, scale: 0.5, x: burst.x, y: burst.y }}
              animate={{ opacity: 1, scale: 1,   x: 0,       y: 0       }}
              exit={{   opacity: 0, scale: 0.5,  x: burst.x, y: burst.y }}
              transition={{ duration: 0.28, delay: ci * 0.055, ease: EASE }}
              style={{
                position: 'absolute',
                right: pos.right,
                top: pos.top,
                transform: `rotate(${pos.rotate})`,
                zIndex: 20,
                whiteSpace: 'nowrap',
                fontSize: 12,
                fontWeight: 500,
                padding: '5px 13px',
                borderRadius: 999,
                background: 'rgba(12,14,38,0.88)',
                border: `1px solid ${accent}45`,
                color: accent,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 14px rgba(0,0,0,0.45)',
                pointerEvents: 'none',
              }}
            >
              {chip}
            </m.span>
          )
        })}
      </AnimatePresence>

      {/* Service name */}
      <h3
        className="font-heebo font-black transition-colors duration-300 cursor-default select-none py-5"
        dir="rtl"
        style={{
          fontSize: 'clamp(34px, 5.5vw, 72px)',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: hovered ? accent : 'rgba(255,255,255,0.22)',
        }}
      >
        {item.title}
      </h3>
    </m.div>
  )
}

export function ServicesSection() {
  const { services } = CONTENT

  return (
    <SectionWrapper id="services" className="bg-bg-secondary">
      <m.div
        initial={{ opacity: 1, y: 0 }}
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
      </m.div>

      {/* ── Desktop: large stacked names with hover reveal ── */}
      <div
        className="desk-only"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {services.items.map((item, i) => (
          <ServiceRow
            key={item.title}
            item={item}
            accent={ACCENTS[i % 2]}
            index={i}
          />
        ))}
      </div>

      {/* ── Mobile: compact cards, content always visible ── */}
      <div className="mob-flex flex-col gap-3" dir="rtl">
        {services.items.map((item, i) => {
          const accent = ACCENTS[i % 2]
          const Icon   = ICONS[item.icon] ?? Layout
          const chips  = SERVICE_CHIPS[item.title] ?? []
          const imgSrc = SERVICE_IMAGE[item.title]

          return (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-2xl border p-4"
              style={{ borderColor: `${accent}28`, background: `${accent}06` }}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Category image thumbnail */}
                <div
                  style={{
                    width: 64, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                    border: `1px solid ${accent}35`,
                    background: `${accent}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgSrc} alt="" draggable={false} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Icon style={{ color: accent, width: 22, height: 22 }} strokeWidth={1.4} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heebo font-bold text-[15px] mb-1" style={{ color: accent }}>
                    {item.title}
                  </h3>
                  <p className="font-rubik text-[13px] text-white/55 leading-relaxed">{item.body}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {chips.map(chip => (
                  <span
                    key={chip}
                    className="text-[11px] font-rubik font-medium px-2.5 py-1 rounded-full"
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
          )
        })}
      </div>
    </SectionWrapper>
  )
}
