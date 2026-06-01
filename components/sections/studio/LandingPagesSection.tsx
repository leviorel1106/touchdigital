'use client'
import { motion } from 'framer-motion'
import { FadeInUp } from '@/components/animations/FadeInUp'

const EASE = [0.23, 1, 0.32, 1] as const

const PROJECTS = [
  { name: 'מנטורית',        url: 'https://leviorel1106.github.io/womanmentor/' },
  { name: 'יוניטי פרויקטים', url: 'https://unityreal-jamwjmzh.manus.space/' },
  { name: "דיג'יי",         url: 'https://leviorel1106.github.io/djadamvero/' },
  { name: 'לימון הפקות',    url: 'https://leviorel1106.github.io/lemonprodaction/' },
  { name: 'נדלן',           url: 'https://leviorel1106.github.io/nadlan1/' },
  { name: 'ביטוח',          url: 'https://surewise-gtygz96p.manus.space' },
  { name: 'בשר אדום',       url: 'https://leviorel1106.github.io/basaradom/' },
]

function BrowserMockup({ url, name, index }: { url: string; name: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: EASE }}
      whileHover={{ y: -6, boxShadow: '0 0 40px rgba(168,85,247,0.18)' }}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        background: '#0F0C1F',
        transition: 'box-shadow 0.3s, transform 0.3s',
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ background: '#1a1730', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Traffic light dots */}
        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28c940' }} />
        {/* URL bar */}
        <div
          className="flex-1 mx-3 rounded-md px-3 py-1 text-[11px] font-rubik truncate"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}
        >
          {url.replace('https://', '')}
        </div>
        {/* Open link */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-[11px] font-rubik font-medium flex-shrink-0 transition-colors duration-200"
          style={{ color: 'rgba(168,85,247,0.7)' }}
          onMouseEnter={e => ((e.target as HTMLElement).style.color = '#a855f7')}
          onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(168,85,247,0.7)')}
        >
          פתח ↗
        </a>
      </div>

      {/* iframe viewport */}
      <div className="relative overflow-hidden" style={{ height: 280 }}>
        <iframe
          src={url}
          title={name}
          loading="lazy"
          scrolling="no"
          style={{
            width: '200%',
            height: '200%',
            border: 'none',
            transform: 'scale(0.5)',
            transformOrigin: 'top right',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </div>

      {/* Project name */}
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="font-heebo font-bold text-white text-sm">{name}</p>
        <p className="font-rubik text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          דף נחיתה
        </p>
      </div>
    </motion.div>
  )
}

export function LandingPagesSection() {
  return (
    <section
      style={{
        background: '#07070B',
        padding: 'clamp(60px,10vw,100px) clamp(16px,4vw,24px) clamp(80px,12vw,120px)',
        position: 'relative',
      }}
    >
      {/* Divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(168,85,247,0.4), transparent)' }}
      />

      <div className="max-w-6xl mx-auto">
        <FadeInUp className="text-center mb-16">
          <span
            className="inline-block font-rubik font-medium text-[11px] uppercase mb-4"
            style={{
              letterSpacing: '0.22em',
              color: '#a855f7',
              border: '1px solid rgba(168,85,247,0.3)',
              borderRadius: 999,
              padding: '4px 14px',
            }}
          >
            LANDING PAGES
          </span>
          <h2
            className="font-heebo font-black text-white leading-tight"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', letterSpacing: '-0.02em' }}
          >
            דפי נחיתה שבנינו
          </h2>
          <p className="font-rubik font-medium mt-4" style={{ color: 'rgba(203,213,225,0.6)', fontSize: 16 }}>
            כל דף נבנה עם מיתוג מדויק, עיצוב ממיר וחוויית משתמש מקצועית
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <BrowserMockup key={p.url} url={p.url} name={p.name} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
