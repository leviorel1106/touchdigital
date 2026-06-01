'use client'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { Layout, MessageCircle, Video, Search, Palette, Globe } from 'lucide-react'
import { CONTENT } from '@/lib/constants'

const EASE = [0.23, 1, 0.32, 1] as const

const ICONS: Record<string, React.ElementType> = {
  Layout, MessageCircle, Video, Search, Palette, Globe,
  Instagram: Globe,
}

const CARD_CONFIG = [
  { accent: '#2dd4bf', glow: '0 0 40px rgba(45,212,191,0.30)', bg: 'rgba(45,212,191,0.06)', border: 'rgba(45,212,191,0.18)', large: true,  initX: 0,   initY: 60 },
  { accent: '#a855f7', glow: '0 0 40px rgba(168,85,247,0.30)',  bg: 'rgba(168,85,247,0.06)',  border: 'rgba(168,85,247,0.18)',  large: false, initX: 60,  initY: 0  },
  { accent: '#ff2d92', glow: '0 0 40px rgba(255,45,146,0.30)',  bg: 'rgba(255,45,146,0.06)',  border: 'rgba(255,45,146,0.18)',  large: false, initX: 0,   initY: 60 },
  { accent: '#38bdf8', glow: '0 0 40px rgba(56,189,248,0.30)',  bg: 'rgba(56,189,248,0.06)',  border: 'rgba(56,189,248,0.18)',  large: false, initX: -60, initY: 0  },
  { accent: '#f97316', glow: '0 0 40px rgba(249,115,22,0.30)',  bg: 'rgba(249,115,22,0.06)',  border: 'rgba(249,115,22,0.18)',  large: false, initX: 0,   initY: 60 },
  { accent: '#d946ef', glow: '0 0 40px rgba(217,70,239,0.30)',  bg: 'rgba(217,70,239,0.06)',  border: 'rgba(217,70,239,0.18)',  large: true,  initX: 0,   initY: 60 },
]

export function ServicesSection() {
  const { services } = CONTENT

  return (
    <SectionWrapper id="services" className="bg-bg-secondary">
      <FadeInUp className="mb-14">
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
      </FadeInUp>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.items.map((item, i) => {
          const cfg = CARD_CONFIG[i]
          const Icon = ICONS[item.icon] ?? Layout
          const colSpan = cfg.large ? 'sm:col-span-2' : ''

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 1, x: cfg.initX, y: cfg.initY }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: cfg.glow,
                borderColor: cfg.accent,
              }}
              whileTap={{ scale: 0.97 }}
              className={`relative overflow-hidden rounded-2xl border p-6 cursor-default ${colSpan}`}
              style={{
                background: cfg.bg,
                borderColor: cfg.border,
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              {/* Corner accent blob */}
              <div
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-40"
                style={{ background: cfg.accent }}
              />

              <div className="relative z-[1]">
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${cfg.accent}20`, border: `1px solid ${cfg.accent}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: cfg.accent }} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  className="font-heebo font-bold text-white mb-2"
                  style={{ fontSize: cfg.large ? 'clamp(18px, 2vw, 24px)' : '16px' }}
                >
                  {item.title}
                </h3>

                {/* Body — shown on all cards */}
                <p className="text-text-muted text-[15px] font-rubik font-medium leading-relaxed">
                  {item.body}
                </p>

                {/* Accent line — large cards only */}
                {cfg.large && (
                  <div
                    className="mt-5 h-[2px] w-12 rounded-full"
                    style={{ background: cfg.accent }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
