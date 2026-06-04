'use client'
import { useRef, useState } from 'react'
import { m, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Search, Compass, Palette, Rocket } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1] as const

const STEPS = [
  {
    num: '01',
    title: 'אבחון התשתית',
    body: 'בודקים איך העסק נראה היום בדיגיטל — אינסטגרם, ביו, דף נחיתה, וואטסאפ, תוכן והדרך שבה ליד הופך לפנייה.',
    Icon: Search,
    color: '#8B5CF6',
  },
  {
    num: '02',
    title: 'בניית אסטרטגיה',
    body: 'מגדירים מה הלקוח צריך לראות, מה המסר המרכזי, איפה הוא לוחץ, ומה קורה מהרגע שהוא משאיר פרטים.',
    Icon: Compass,
    color: '#22D3EE',
  },
  {
    num: '03',
    title: 'מייקאובר ובנייה',
    body: 'מעצבים את הנראות מחדש, בונים דף נחיתה, מסדרים את הביו, מכינים פוסטים, היילייטים ובוט וואטסאפ שמחמם לידים.',
    Icon: Palette,
    color: '#8B5CF6',
  },
  {
    num: '04',
    title: 'השקה ושיפור',
    body: 'מעלים לאוויר, בודקים שהכול עובד, מחברים את התהליך, ומשפרים כדי שהתשתית לא רק תיראה טוב — אלא גם תמכור.',
    Icon: Rocket,
    color: '#22D3EE',
  },
] as const

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(-1)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 65%', 'end 35%'],
  })

  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveStep(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)))
  })

  return (
    <section
      ref={sectionRef}
      id="process"
      dir="rtl"
      style={{
        background: '#05060A',
        padding: 'clamp(80px, 10vw, 140px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 45% at 50% 0%, rgba(139,92,246,0.09) 0%, transparent 70%)',
      }} />

      {/* ── Section header ───────────────────────────────────── */}
      <div
        className="text-center max-w-3xl mx-auto px-6 mb-16 md:mb-24"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <m.h2
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-heebo font-black text-white mb-4"
          style={{
            fontSize: 'clamp(26px, 3.6vw, 50px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.18,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          ארבעה שלבים למייקאובר דיגיטלי שמתחיל להכניס לידים
        </m.h2>
        <m.p
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="font-rubik font-medium text-lg leading-relaxed"
          style={{ color: '#B7B7C8' }}
        >
          תהליך חד, מסודר וברור — מהאבחון הראשוני ועד תשתית דיגיטלית שנראית טוב, עובדת נכון ומניעה לקוחות לפעולה.
        </m.p>
      </div>

      {/* ── Desktop: horizontal timeline ─────────────────────── */}
      <div
        className="desk-only max-w-6xl mx-auto px-8"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div style={{ position: 'relative' }}>

          {/* Timeline track — vertically centered on dots (dot height=20, center=10) */}
          <div style={{
            position: 'absolute',
            top: 9,
            right: '12.5%',
            left: '12.5%',
            height: 2,
            zIndex: 0,
          }}>
            {/* Gray base */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 999,
            }} />
            {/* Purple progress */}
            <m.div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to left, #8B5CF6 0%, #22D3EE 100%)',
              scaleX: lineProgress,
              transformOrigin: '100% 50%',
              borderRadius: 999,
              boxShadow: '0 0 16px rgba(139,92,246,0.9)',
            }} />
          </div>

          {/* Step columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}>
            {STEPS.map((step, i) => {
              const isActive = activeStep >= i
              return (
                <div
                  key={step.num}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',   // fill CSS grid row = equal height for all columns
                  }}
                >
                  {/* Dot */}
                  <m.div
                    animate={{
                      background: isActive ? step.color : '#0a0b14',
                      borderColor: isActive ? step.color : 'rgba(255,255,255,0.2)',
                      boxShadow: isActive
                        ? `0 0 0 4px ${step.color}25, 0 0 20px ${step.color}`
                        : '0 0 0 0px transparent',
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      width: 20, height: 20, borderRadius: '50%',
                      borderWidth: 2, borderStyle: 'solid',
                      borderColor: 'rgba(255,255,255,0.2)',
                      background: '#0a0b14',
                      flexShrink: 0, marginBottom: 24,
                    }}
                  />

                  {/* Card — flex:1 stretches to match the tallest card in the row */}
                  <m.div
                    animate={{
                      borderColor: isActive ? `${step.color}55` : 'rgba(255,255,255,0.08)',
                      boxShadow: isActive
                        ? `0 0 36px ${step.color}22, 0 4px 28px rgba(0,0,0,0.5)`
                        : '0 4px 24px rgba(0,0,0,0.35)',
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      flex: 1,
                      width: '100%',
                      background: 'rgba(255,255,255,0.025)',
                      borderWidth: 1, borderStyle: 'solid',
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: 16,
                      padding: '24px 20px',
                      textAlign: 'right',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Ghost number — bottom corner watermark */}
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute', bottom: -14, left: -4,
                        fontSize: '6rem', fontWeight: 900, lineHeight: 1,
                        color: 'rgba(255,255,255,0.045)', pointerEvents: 'none',
                        fontFamily: 'var(--font-heebo)', userSelect: 'none',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {step.num}
                    </span>

                    {/* Premium icon badge */}
                    <m.div
                      animate={{
                        scale: isActive ? 1.08 : 1,
                        boxShadow: isActive
                          ? `0 0 28px ${step.color}35, inset 0 1px 0 rgba(255,255,255,0.14)`
                          : 'inset 0 1px 0 rgba(255,255,255,0.06)',
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      style={{
                        width: 58, height: 58, borderRadius: 18,
                        background: `linear-gradient(145deg, ${step.color}28 0%, ${step.color}08 100%)`,
                        border: `1px solid ${step.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 18, flexShrink: 0,
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {/* Inner top shimmer — faux glass highlight */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '52%',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)',
                        borderRadius: '18px 18px 0 0',
                        pointerEvents: 'none',
                      }} />
                      <step.Icon size={26} color={step.color} strokeWidth={1.25} />
                    </m.div>

                    <h3
                      className="font-heebo font-bold text-white mb-2"
                      style={{ fontSize: 15, lineHeight: 1.3 }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="font-rubik"
                      style={{ color: '#B7B7C8', fontSize: 13, lineHeight: 1.68 }}
                    >
                      {step.body}
                    </p>
                  </m.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile: vertical timeline ─────────────────────────── */}
      <div
        className="mob-flex flex-col"
        style={{
          padding: '0 20px',
          position: 'relative',
          zIndex: 1,
          gap: 0,
        }}
      >
        {/* Vertical track — right side (RTL, center of 20px dot = right:29) */}
        <div style={{
          position: 'absolute',
          right: 29, top: 10, bottom: 10,
          width: 2,
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0,
        }} />
        <m.div style={{
          position: 'absolute',
          right: 29, top: 10, bottom: 10,
          width: 2,
          scaleY: lineProgress,
          transformOrigin: 'top center',
          background: 'linear-gradient(to bottom, #8B5CF6, #22D3EE)',
          boxShadow: '0 0 12px rgba(139,92,246,0.8)',
          zIndex: 0,
        }} />

        {STEPS.map((step, i) => {
          const isActive = activeStep >= i
          return (
            <div
              key={step.num}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                paddingBottom: i < STEPS.length - 1 ? 22 : 0,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Dot — first in RTL flex row = rightmost */}
              <m.div
                animate={{
                  background: isActive ? step.color : '#05060A',
                  borderColor: isActive ? step.color : 'rgba(255,255,255,0.2)',
                  boxShadow: isActive
                    ? `0 0 0 3px ${step.color}28, 0 0 14px ${step.color}`
                    : '0 0 0 0px transparent',
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  borderWidth: 2, borderStyle: 'solid',
                  borderColor: 'rgba(255,255,255,0.2)',
                  background: '#05060A',
                  flexShrink: 0, marginTop: 3,
                }}
              />

              {/* Card */}
              <m.div
                animate={{
                  borderColor: isActive ? `${step.color}50` : 'rgba(255,255,255,0.08)',
                  boxShadow: isActive ? `0 0 26px ${step.color}18` : 'none',
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.03)',
                  borderWidth: 1, borderStyle: 'solid',
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '16px 14px',
                  textAlign: 'right',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Ghost number */}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute', bottom: -10, left: -4,
                    fontSize: '4rem', fontWeight: 900, lineHeight: 1,
                    color: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
                    fontFamily: 'var(--font-heebo)', userSelect: 'none',
                  }}
                >
                  {step.num}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <m.div
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                      background: `linear-gradient(145deg, ${step.color}28 0%, ${step.color}08 100%)`,
                      border: `1px solid ${step.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', overflow: 'hidden',
                      boxShadow: isActive ? `0 0 18px ${step.color}30` : 'none',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)',
                      borderRadius: '14px 14px 0 0', pointerEvents: 'none',
                    }} />
                    <step.Icon size={20} color={step.color} strokeWidth={1.3} />
                  </m.div>
                  <h3
                    className="font-heebo font-bold text-white"
                    style={{ fontSize: 14, lineHeight: 1.3 }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  className="font-rubik"
                  style={{ color: '#B7B7C8', fontSize: 12.5, lineHeight: 1.65 }}
                >
                  {step.body}
                </p>
              </m.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
