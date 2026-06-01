'use client'
import { motion } from 'framer-motion'
import { MarqueeStrip } from '@/components/animations/MarqueeStrip'

const EASE = [0.23, 1, 0.32, 1] as const
const BG   = 'var(--bg-secondary)'

const ALL_POSTS = Array.from({ length: 16 }, (_, i) => `/posts/post-${String(i + 1).padStart(2, '0')}.jpeg`)

function rotate<T>(arr: T[], by: number): T[] {
  return [...arr.slice(by), ...arr.slice(0, by)]
}

const ROWS = [
  { posts: rotate(ALL_POSTS, 0),  reverse: false },
  { posts: rotate(ALL_POSTS, 8),  reverse: true  },
  { posts: rotate(ALL_POSTS, 4),  reverse: false },
]

function PostCard({ src }: { src: string }) {
  return (
    <div
      style={{
        width: 138,
        height: 246,     // 9:16
        flexShrink: 0,
        borderRadius: 14,
        overflow: 'hidden',
        background: '#080c24',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.55)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          userSelect: 'none',
        }}
      />
    </div>
  )
}

export function PostsSection() {
  return (
    <section
      id="posts"
      style={{
        position: 'relative',
        background: BG,
        overflow: 'clip',
        minHeight: 600,
      }}
    >
      {/* ── Mobile: 3 animated marquee rows ──────────────── */}
      <div
        aria-hidden
        className="mob-flex"
        style={{
          position: 'absolute',
          inset: 0,
          flexDirection: 'column',
          gap: 10,
          padding: '10px 0',
          overflow: 'hidden',
          opacity: 0.88,
          zIndex: 0,
        }}
      >
        <MarqueeStrip>
          {ALL_POSTS.slice(0, 8).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" draggable={false}
              style={{ height: 200, width: 112, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
          ))}
        </MarqueeStrip>
        <MarqueeStrip reverse>
          {rotate(ALL_POSTS, 8).slice(0, 8).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" draggable={false}
              style={{ height: 200, width: 112, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
          ))}
        </MarqueeStrip>
        <MarqueeStrip>
          {rotate(ALL_POSTS, 4).slice(0, 8).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" draggable={false}
              style={{ height: 200, width: 112, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
          ))}
        </MarqueeStrip>
      </div>

      {/* ── Desktop: diagonal scrolling grid ─────────────── */}
      <div
        aria-hidden
        className="desk-only"
        style={{
          position: 'absolute',
          inset: '-50%',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          transform: 'rotate(-18deg)',
          zIndex: 0,
          opacity: 0.88,
        }}
      >
        {ROWS.map((row, i) => (
          <MarqueeStrip key={i} reverse={row.reverse} className="py-1">
            {row.posts.map((src, j) => (
              <PostCard key={j} src={src} />
            ))}
          </MarqueeStrip>
        ))}
      </div>

      {/* ── Gradient overlays — fade grid into bg ── */}
      {/* Desktop gradients — strong center coverage */}
      <div className="desk-only" style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${BG} 0%, rgba(17,22,56,0.85) 35%, rgba(17,22,56,0.6) 50%, transparent 65%)`, zIndex: 2, pointerEvents: 'none' }} />
      <div className="desk-only" style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top,   ${BG} 0%, rgba(17,22,56,0.85) 35%, rgba(17,22,56,0.6) 50%, transparent 65%)`, zIndex: 2, pointerEvents: 'none' }} />
      {/* Mobile gradients — lighter, posts stay visible */}
      <div className="mob-only" style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${BG} 0%, rgba(17,22,56,0.5) 18%, transparent 32%)`, zIndex: 2, pointerEvents: 'none' }} />
      <div className="mob-only" style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top,   ${BG} 0%, rgba(17,22,56,0.5) 18%, transparent 32%)`, zIndex: 2, pointerEvents: 'none' }} />
      {/* left */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${BG} 0%, transparent 20%)`, zIndex: 2, pointerEvents: 'none' }} />
      {/* right */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to left, ${BG} 0%, transparent 20%)`, zIndex: 2, pointerEvents: 'none' }} />

      {/* ── Content — above the grid ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 600,
          padding: '80px 24px',
          pointerEvents: 'none',
        }}
      >
        <motion.h2
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="font-heebo font-black text-white text-center leading-tight mb-4"
          style={{
            fontSize: 'clamp(34px, 4.5vw, 60px)',
            letterSpacing: '-0.03em',
            textShadow: '0 2px 32px rgba(0,0,0,0.8)',
          }}
        >
          תוכן{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            שגורם לעצור
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="font-rubik font-medium text-white/70 text-lg text-center mb-10"
          style={{
            maxWidth: 480,
            textShadow: '0 1px 20px rgba(0,0,0,0.9)',
          }}
        >
          פוסטים אורגניים ומודעות ממומנות שמביאים תוצאות — עיצוב שעוצר גלילה
        </motion.p>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
          style={{ pointerEvents: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-heebo font-bold text-sm text-white px-8 py-3.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #38bdf8 50%, #a855f7 100%)',
              boxShadow: '0 0 32px rgba(45,212,191,0.38), 0 4px 24px rgba(0,0,0,0.5)',
            }}
          >
            רוצה תוכן כזה לעסק שלך? ↗
          </a>
          <a
            href="/studio"
            className="inline-flex items-center gap-2 font-heebo font-bold text-sm text-white px-8 py-3.5 rounded-full transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)' }}
          >
            כל הפרויקטים →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
