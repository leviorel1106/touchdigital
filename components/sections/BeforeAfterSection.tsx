'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { m, useReducedMotion } from 'framer-motion'

const EASE = [0.23, 1, 0.32, 1] as const

const CLIENTS = [
  { before: '/before-after/baloon-before.png',  after: '/before-after/baloon-after.png'  },
  { before: '/before-after/jahnon-before.png',  after: '/before-after/jahnon-after.png' },
  { before: '/before-after/dog-before.png',     after: '/before-after/dog-after.png'    },
  { before: '/before-after/nadlan-before.png',  after: '/before-after/nadlan-after.png' },
  { before: '/before-after/coach-before.png',   after: '/before-after/coach-after.png'  },
  { before: '/before-after/psy-before.png',     after: '/before-after/psy-after.png'   },
]

const N          = CLIENTS.length
const ANGLE_STEP = 360 / N
const RADIUS     = 440
const CARD_W     = 210
const CARD_H     = Math.round(CARD_W * (16 / 9))

const DIVIDER_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: '50%',
  width: 2,
  background: 'linear-gradient(to bottom, #2dd4bf 0%, #a855f7 100%)',
  boxShadow: '0 0 8px rgba(45,212,191,0.9)',
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
}

export function BeforeAfterSection() {
  const carouselRef  = useRef<HTMLDivElement>(null)
  const afterImgRefs = useRef<(HTMLDivElement | null)[]>([])
  const dividerRefs  = useRef<(HTMLDivElement | null)[]>([])
  const angleRef     = useRef(0)
  const tRef         = useRef(0)
  const paused       = useRef(false)
  const rafRef       = useRef(0)
  const reduce       = useReducedMotion()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const SCENE_W = RADIUS * 2 + CARD_W
    function update() {
      const vw = window.innerWidth
      setScale(vw < SCENE_W ? Math.max(0.3, vw / SCENE_W) : 1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (reduce) return

    let visible = false

    function loop() {
      if (visible) {
        if (!paused.current) angleRef.current -= 0.28
        tRef.current += 0.022
        const revealPct = 50 + 45 * Math.sin(tRef.current)
        if (carouselRef.current)
          carouselRef.current.style.transform = `rotateY(${angleRef.current}deg)`
        const clipVal = (100 - revealPct).toFixed(2)
        const leftVal = revealPct.toFixed(2)
        afterImgRefs.current.forEach(img => { if (img) img.style.clipPath = `inset(0 ${clipVal}% 0 0)` })
        dividerRefs.current.forEach(line => { if (line) line.style.left = `${leftVal}%` })
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '200px' })
    if (carouselRef.current) io.observe(carouselRef.current)

    return () => { cancelAnimationFrame(rafRef.current); io.disconnect() }
  }, [reduce])

  return (
    <section
      id="makeover"
      className="pt-16 pb-24 md:pt-20 md:pb-32"
      style={{ background: 'var(--bg-secondary)', overflow: 'clip' }}
    >
      {/* Headline */}
      <div className="text-center px-6" style={{ marginBottom: 60 }}>
        <m.h2
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-heebo font-black text-white mb-4 leading-tight"
          style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.03em' }}
        >
          מייקאובר{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #2dd4bf, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            360°
          </span>
        </m.h2>

        <m.p
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="text-white/65 text-lg font-rubik font-medium max-w-md mx-auto"
        >
          כך נראים עסקים לפני ואחרי טאץ׳ דיגיטל
        </m.p>
      </div>

      {/* ── Mobile: 2-column static grid ──────────────── */}
      <div className="mob-grid grid-cols-2 gap-3 px-4">
        {CLIENTS.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              aspectRatio: '9/16',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <Image src={c.before} alt="" fill sizes="210px"
                style={{ objectFit: 'cover' }} loading="lazy" draggable={false} />
            </div>
            <div className="mob-after-animate"
              style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 50% 0 0)', pointerEvents: 'none' }}>
              <Image src={c.after} alt="" fill sizes="210px"
                style={{ objectFit: 'cover' }} loading="lazy" draggable={false} />
            </div>
            <div className="mob-divider-animate" style={DIVIDER_STYLE} />
            {/* Badge לפני */}
            <span style={{
              position: 'absolute', top: 8, right: 8, zIndex: 10,
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
              color: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: 700,
              padding: '2px 7px', borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.15)', lineHeight: 1.4,
            }}>לפני</span>
            {/* Badge אחרי */}
            <span style={{
              position: 'absolute', top: 8, left: 8, zIndex: 10,
              background: 'linear-gradient(135deg, rgba(45,212,191,0.85), rgba(168,85,247,0.85))',
              backdropFilter: 'blur(4px)',
              color: '#fff', fontSize: 10, fontWeight: 700,
              padding: '2px 7px', borderRadius: 999, lineHeight: 1.4,
            }}>אחרי</span>
          </div>
        ))}
      </div>

      {/* ── Desktop: 3D carousel ──────────────────────── */}
      <div
        className="desk-flex items-center justify-center"
        aria-label="קרוסלה לפני ואחרי"
        style={{ height: (CARD_H + 80) * scale }}
      >
        <div
          onMouseEnter={() => { paused.current = true }}
          onMouseLeave={() => { paused.current = false }}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
        >
          <div
            style={{
              perspective: '1100px',
              perspectiveOrigin: '50% 35%',
              height: CARD_H + 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              ref={carouselRef}
              style={{
                position: 'relative',
                transformStyle: 'preserve-3d',
                width: CARD_W,
                height: CARD_H,
              }}
            >
              {CLIENTS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `rotateY(${ANGLE_STEP * i}deg) translateZ(${RADIUS}px)`,
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', userSelect: 'none' }}>
                    <Image src={c.before} alt="" fill sizes="210px"
                      style={{ objectFit: 'cover' }} loading="lazy" draggable={false} />
                  </div>
                  <div ref={el => { afterImgRefs.current[i] = el }}
                    style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 50% 0 0)', pointerEvents: 'none', userSelect: 'none' }}>
                    <Image src={c.after} alt="" fill sizes="210px"
                      style={{ objectFit: 'cover' }} loading="lazy" draggable={false} />
                  </div>
                  <div
                    ref={el => { dividerRefs.current[i] = el }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: '50%',
                      width: 3,
                      background: 'linear-gradient(to bottom, #2dd4bf 0%, #a855f7 100%)',
                      boxShadow: '0 0 10px rgba(45,212,191,0.9), 0 0 22px rgba(168,85,247,0.7)',
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
