'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { CONTENT } from '@/lib/constants'

const EASE = [0.23, 1, 0.32, 1] as const

type Package = (typeof CONTENT.packages)[number]

const schema = z.object({
  fullName:     z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  phone:        z.string().regex(/^0(5[0-9]|[2-489])\d{7,8}$/, 'מספר טלפון לא תקין'),
  email:        z.string().email('אימייל לא תקין'),
  businessType: z.string().min(1, 'בחר סוג עסק'),
})
type FormData = z.infer<typeof schema>

const BUSINESS_TYPES = [
  "אימון אישי / קואצ'ינג", 'עריכת דין', 'נדל"ן',
  'אדריכלות / עיצוב פנים', 'ספרות / סלון יופי',
  'אירועים / הפקות', 'מסחר / שירותים', 'אחר',
]

/* ─── Scratch Card ─────────────────────────────────────────────── */

function ScratchCard({ pkg }: { pkg: Package }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const isDownRef  = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const [revealed,  setRevealed]  = useState(false)
  const [scratching, setScratching] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => { setIsMobile(window.innerWidth < 768) }, [])

  /* Draw lottery-card scratch surface onto canvas */
  const drawSurface = useCallback((canvas: HTMLCanvasElement, accent: string) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w   = canvas.width
    const h   = canvas.height
    const dpr = window.devicePixelRatio || 1
    const cw  = w / dpr
    const ch  = h / dpr

    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, w, h)

    /* Dark matte base — like a real lottery card */
    ctx.fillStyle = '#1a1e30'
    ctx.fillRect(0, 0, w, h)

    /* Subtle accent-tinted corner glow */
    ctx.save()
    ctx.scale(dpr, dpr)
    const tint = ctx.createRadialGradient(0, 0, 0, cw * 0.55, ch * 0.55, Math.max(cw, ch))
    tint.addColorStop(0, `${accent}28`)
    tint.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = tint
    ctx.fillRect(0, 0, cw, ch)
    ctx.restore()

    /* White dot grid — high contrast, dense */
    ctx.save()
    ctx.scale(dpr, dpr)
    const spacing = 13
    for (let x = spacing * 0.6; x < cw; x += spacing) {
      for (let y = spacing * 0.6; y < ch; y += spacing) {
        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.fill()
      }
    }
    ctx.restore()

    /* Label — white on dark, high contrast */
    ctx.save()
    ctx.scale(dpr, dpr)
    const cx = cw / 2
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 14px "Rubik", sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.82)'
    ctx.fillText('גרד כאן לגלות את המחיר', cx, ch / 2 + 2)
    ctx.font = `400 11px "Rubik", sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.38)'
    ctx.fillText('Scratch to reveal', cx, ch / 2 + 20)
    ctx.restore()
  }, [])

  /* Resize + redraw when package changes */
  useEffect(() => {
    setRevealed(false)

    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return

    const dpr  = window.devicePixelRatio || 1
    const cssW = wrap.getBoundingClientRect().width || 480
    const cssH = 148

    canvas.width  = Math.round(cssW * dpr)
    canvas.height = Math.round(cssH * dpr)
    canvas.style.width  = `${cssW}px`
    canvas.style.height = `${cssH}px`

    drawSurface(canvas, pkg.accent)
  }, [pkg.id, pkg.accent, drawSurface])

  /* Scratch event handlers */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || revealed) return

    const dpr    = window.devicePixelRatio || 1
    const RADIUS = 28 // CSS px

    function getPos(canvas: HTMLCanvasElement, cx: number, cy: number) {
      const rect = canvas.getBoundingClientRect()
      return { x: (cx - rect.left) * dpr, y: (cy - rect.top) * dpr }
    }

    function scratchTo(canvas: HTMLCanvasElement, x: number, y: number) {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const r = RADIUS * dpr
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle   = 'rgba(0,0,0,1)'
      ctx.strokeStyle = 'rgba(0,0,0,1)'

      /* Main stroke / tap */
      if (lastPosRef.current) {
        ctx.lineWidth = r * 1.4
        ctx.lineCap   = 'round'
        ctx.lineJoin  = 'round'
        ctx.beginPath()
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      /* Satellite spots — jagged coin-scratch edges */
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2
        const dist  = r * (0.55 + Math.random() * 0.55)
        const sr    = r * (0.20 + Math.random() * 0.30)
        ctx.beginPath()
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, sr, 0, Math.PI * 2)
        ctx.fill()
      }

      lastPosRef.current = { x, y }
    }

    function checkReveal() {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let transparent = 0
      for (let i = 3; i < data.length; i += 16) { // sample every 4th pixel for perf
        if (data[i] < 128) transparent++
      }
      if (transparent / (data.length / 16) > 0.5) setRevealed(true)
    }

    function onMouseDown(e: MouseEvent) {
      isDownRef.current = true
      lastPosRef.current = null
      setScratching(true)
      const c = canvasRef.current!
      const { x, y } = getPos(c, e.clientX, e.clientY)
      scratchTo(c, x, y)
    }
    function onMouseMove(e: MouseEvent) {
      if (!isDownRef.current) return
      const c = canvasRef.current!
      const { x, y } = getPos(c, e.clientX, e.clientY)
      scratchTo(c, x, y)
      checkReveal()
    }
    function onMouseUp() { isDownRef.current = false; lastPosRef.current = null; setScratching(false) }

    function onTouchStart(e: TouchEvent) {
      e.preventDefault()
      isDownRef.current = true
      lastPosRef.current = null
      setScratching(true)
      const c = canvasRef.current!
      const { x, y } = getPos(c, e.touches[0].clientX, e.touches[0].clientY)
      scratchTo(c, x, y)
    }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      if (!isDownRef.current) return
      const c = canvasRef.current!
      const { x, y } = getPos(c, e.touches[0].clientX, e.touches[0].clientY)
      scratchTo(c, x, y)
      checkReveal()
    }
    function onTouchEnd() { isDownRef.current = false; lastPosRef.current = null; setScratching(false) }

    canvas.addEventListener('mousedown',  onMouseDown)
    canvas.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseup',    onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false })
    canvas.addEventListener('touchend',   onTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown',  onMouseDown)
      canvas.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseup',    onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove',  onTouchMove)
      canvas.removeEventListener('touchend',   onTouchEnd)
    }
  }, [pkg.id, revealed])

  return (
    <motion.div
      key={pkg.id}
      initial={{ opacity: 1, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.38, ease: EASE }}
      style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}
    >
      {/* Animated glow border layer */}
      <motion.div
        animate={{ opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 27,
          background: `linear-gradient(135deg, ${pkg.accent}, transparent 42%, transparent 58%, ${pkg.accent})`,
          filter: 'blur(10px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Second softer outer halo */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        aria-hidden
        style={{
          position: 'absolute',
          inset: -10,
          borderRadius: 34,
          background: `radial-gradient(ellipse at 50% 50%, ${pkg.accent}40 0%, transparent 70%)`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: 24,
          overflow: 'hidden',
          border: `1.5px solid ${pkg.accent}55`,
          background: 'rgba(7, 10, 32, 0.94)',
          backdropFilter: isMobile ? 'none' : 'blur(20px)',
          WebkitBackdropFilter: isMobile ? 'none' : 'blur(20px)',
          boxShadow: `0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 ${pkg.accent}25, inset 0 -1px 0 rgba(0,0,0,0.4)`,
        }}
      >
      {/* ── Card header ── */}
      <div
        style={{
          padding: '24px 28px 20px',
          borderBottom: `1px solid ${pkg.accent}25`,
          background: `linear-gradient(135deg, ${pkg.accent}12 0%, transparent 60%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3
            className="font-heebo font-black text-white"
            style={{ fontSize: 22, letterSpacing: '-0.02em' }}
          >
            {pkg.name}
          </h3>
          {pkg.badge && (
            <span
              className="font-rubik font-bold"
              style={{
                fontSize: 11,
                color: pkg.accent,
                background: `${pkg.accent}18`,
                border: `1px solid ${pkg.accent}40`,
                borderRadius: 999,
                padding: '3px 10px',
              }}
            >
              {pkg.badge}
            </span>
          )}
        </div>
        <p className="font-rubik font-medium" style={{ fontSize: 13, color: 'rgba(203,213,225,0.7)' }}>
          {pkg.tagline}
        </p>
      </div>

      {/* ── Includes list ── */}
      <ul style={{ listStyle: 'none', margin: 0, padding: '20px 28px 16px' }}>
        {pkg.includes.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: `${pkg.accent}22`,
                border: `1px solid ${pkg.accent}55`,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <Check style={{ width: 10, height: 10, color: pkg.accent, strokeWidth: 3 }} />
            </span>
            <span className="font-rubik font-medium" style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.5 }}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      {/* ── Delivery note ── */}
      <div style={{ padding: '0 28px 16px' }}>
        <span
          className="font-rubik font-medium"
          style={{
            fontSize: 12,
            color: `${pkg.accent}cc`,
            background: `${pkg.accent}10`,
            border: `1px solid ${pkg.accent}25`,
            borderRadius: 999,
            padding: '3px 12px',
          }}
        >
          ⏱ {pkg.delivery}
        </span>
      </div>

      {/* ── Scratch area ── */}
      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          margin: '0 16px 16px',
          borderRadius: 14,
          overflow: 'hidden',
          height: 148,
          background: `linear-gradient(160deg, ${pkg.accent}18 0%, rgba(7,10,32,0.95) 70%)`,
          border: `1px solid ${pkg.accent}35`,
          boxShadow: `inset 0 0 24px ${pkg.accent}12`,
        }}
      >
        {/* Price reveal underneath canvas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span
              className="font-heebo font-black"
              style={{
                fontSize: 46,
                lineHeight: 1,
                color: pkg.accent,
                letterSpacing: '-0.04em',
                filter: `drop-shadow(0 0 16px ${pkg.accent}88)`,
              }}
            >
              {pkg.price}₪
            </span>
            <span
              className="font-heebo"
              style={{ fontSize: 20, color: '#64748b', textDecoration: 'line-through' }}
            >
              {pkg.priceOriginal}₪
            </span>
          </div>
          <span className="font-rubik font-medium" style={{ fontSize: 12, color: '#64748b' }}>
            + מע״מ
          </span>
        </div>

        {/* Pulse ring hint (shows briefly before any scratch) */}
        {!revealed && !scratching && (
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 56, height: 56,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.45)',
              transform: 'translate(-50%, -58%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}

        {/* Canvas scratch overlay */}
        <AnimatePresence>
          {!revealed && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                inset: 0,
                cursor: scratching ? 'grabbing' : 'grab',
                touchAction: 'none',
                borderRadius: 14,
                zIndex: 2,
              }}
            />
          )}
        </AnimatePresence>

        {/* Post-reveal CTA overlay */}
        <AnimatePresence>
          {revealed && (
            <motion.a
              href="#contact-form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15, ease: EASE }}
              className="font-heebo font-bold text-white"
              style={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 13,
                background: `linear-gradient(135deg, ${pkg.accent}, ${pkg.accent}cc)`,
                borderRadius: 999,
                padding: '7px 20px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 16px ${pkg.accent}55`,
              }}
            >
              אני רוצה את החבילה הזו ↗
            </motion.a>
          )}
        </AnimatePresence>
      </div>
      </div>
    </motion.div>
  )
}

/* ─── OfferSection ─────────────────────────────────────────────── */

export function OfferSection() {
  const { offer, contact, brand } = CONTENT
  const pkgs = CONTENT.packages
  const [activeIdx, setActiveIdx] = useState(1) // default: Gold
  const [status, setStatus]       = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputCls = (err?: { message?: string }) =>
    `w-full bg-white/[0.04] border ${err ? 'border-red-500/60' : 'border-white/[0.09]'} rounded-xl px-4 py-3 text-white text-sm font-rubik font-medium placeholder:text-text-muted focus:outline-none focus:border-brandTurquoise/60 transition-colors duration-150`

  const activePkg = pkgs[activeIdx]

  return (
    <>
      {/* ── Part A: Package selector + Scratch cards ── */}
      <SectionWrapper style={{ background: '#0F0C1F' }}>
        <FadeInUp className="text-center mb-12">
          <h2
            className="font-heebo font-black text-white mb-3"
            style={{
              fontSize: 'clamp(28px, 3.8vw, 50px)',
              letterSpacing: '-0.03em',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            בחר את{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2dd4bf 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              החבילה שלך
            </span>
          </h2>
          <p className="font-rubik font-medium text-lg" style={{ color: 'rgba(203,213,225,0.65)' }}>
            גרד את הכרטיס לגלות את המחיר
          </p>
        </FadeInUp>

        {/* Tab selector */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 36,
            flexWrap: 'wrap',
          }}
        >
          {pkgs.map((pkg, i) => (
            <button
              key={pkg.id}
              onClick={() => setActiveIdx(i)}
              className="font-heebo font-bold transition-all duration-200"
              style={{
                fontSize: 14,
                padding: '9px 22px',
                borderRadius: 999,
                border: `2px solid ${activeIdx === i ? pkg.accent : 'rgba(255,255,255,0.12)'}`,
                background: activeIdx === i ? `${pkg.accent}18` : 'transparent',
                color: activeIdx === i ? pkg.accent : 'rgba(203,213,225,0.6)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {pkg.name}
              {pkg.badge && activeIdx !== i && (
                <span style={{ marginRight: 6, fontSize: 10 }}>🔥</span>
              )}
            </button>
          ))}
        </div>

        {/* Scratch card */}
        <AnimatePresence mode="wait">
          <ScratchCard key={activePkg.id} pkg={activePkg} />
        </AnimatePresence>

        {/* Scarcity badge */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-8"
        >
          <span
            className="inline-flex items-center gap-2 font-rubik font-bold"
            style={{
              fontSize: 12,
              color: '#ff2d92',
              background: 'rgba(255,45,146,0.08)',
              border: '1px solid rgba(255,45,146,0.25)',
              borderRadius: 999,
              padding: '5px 14px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#ff2d92',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            {offer.badge}
          </span>
        </motion.div>
      </SectionWrapper>

      {/* ── Part B: Contact form ── */}
      <SectionWrapper id="contact-form" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-xl mx-auto">
          <FadeInUp>
            <h2
              id="contact"
              className="font-heebo font-black text-white mb-2 text-center"
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                letterSpacing: '-0.02em',
                scrollMarginTop: 100,
              }}
            >
              {contact.headline}
            </h2>
            <p className="font-rubik font-medium text-text-muted text-center mb-8 text-base">
              {contact.body}
            </p>

            {status === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-14 h-14 text-brand-teal mx-auto mb-4" />
                <p className="font-heebo font-bold text-white text-xl">{contact.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input {...register('fullName')} placeholder="שם מלא" className={inputCls(errors.fullName)} />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1 font-rubik">{errors.fullName.message}</p>}
                </div>
                <div>
                  <input {...register('phone')} placeholder="טלפון" type="tel" className={inputCls(errors.phone)} />
                  {errors.phone && <p className="text-red-400 text-xs mt-1 font-rubik">{errors.phone.message}</p>}
                </div>
                <div>
                  <input {...register('email')} placeholder="אימייל" type="email" className={inputCls(errors.email)} />
                  {errors.email && <p className="text-red-400 text-xs mt-1 font-rubik">{errors.email.message}</p>}
                </div>
                <div>
                  <select {...register('businessType')} className={inputCls(errors.businessType)}>
                    <option value="">סוג העסק / תחום</option>
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.businessType && <p className="text-red-400 text-xs mt-1 font-rubik">{errors.businessType.message}</p>}
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-sm font-rubik font-medium">{contact.errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-3 text-white font-heebo font-bold text-[15px] py-4 rounded-xl active:scale-[0.97] disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #9B51E0 0%, #00F2FE 100%)',
                    transition: 'opacity 150ms, transform 100ms',
                    boxShadow: '0 0 24px rgba(0,242,254,0.18)',
                  }}
                >
                  {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : offer.ctaPrimary}
                </button>

              </form>
            )}
          </FadeInUp>
        </div>
      </SectionWrapper>
    </>
  )
}
