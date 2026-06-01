'use client'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
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
        <motion.h2
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
        </motion.h2>
        <motion.p
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="font-rubik font-medium text-lg leading-relaxed"
          style={{ color: '#B7B7C8' }}
        >
          תהליך חד, מסודר וברור — מהאבחון הראשוני ועד תשתית דיגיטלית שנראית טוב, עובדת נכון ומניעה לקוחות לפעולה.
        </motion.p>
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
            <motion.div style={{
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
                  }}
                >
                  {/* Dot */}
                  <motion.div
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
                      flexShrink: 0, marginBottom: 24,
                    }}
                  />

                  {/* Card */}
                  <motion.div
                    animate={{
                      borderColor: isActive ? `${step.color}55` : 'rgba(255,255,255,0.08)',
                      boxShadow: isActive
                        ? `0 0 36px ${step.color}22, 0 4px 28px rgba(0,0,0,0.5)`
                        : '0 4px 24px rgba(0,0,0,0.35)',
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.025)',
                      borderWidth: 1, borderStyle: 'solid',
                      borderRadius: 16,
                      padding: '22px 18px',
                      textAlign: 'right',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Ghost number */}
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute', bottom: -18, left: -6,
                        fontSize: '5.5rem', fontWeight: 900, lineHeight: 1,
                        color: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
                        fontFamily: 'var(--font-heebo)', userSelect: 'none',
                      }}
                    >
                      {step.num}
                    </span>

                    {/* Icon */}
                    <motion.div
                      animate={{ scale: isActive ? 1.12 : 1 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      style={{
                        width: 38, height: 38, borderRadius: 11, marginBottom: 14,
                        background: `${step.color}18`,
                        border: `1px solid ${step.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <step.Icon size={18} color={step.color} strokeWidth={1.5} />
                    </motion.div>

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
                  </motion.div>
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
        <motion.div style={{
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
              <motion.div
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
                  flexShrink: 0, marginTop: 3,
                }}
              />

              {/* Card */}
              <motion.div
                animate={{
                  borderColor: isActive ? `${step.color}50` : 'rgba(255,255,255,0.08)',
                  boxShadow: isActive ? `0 0 26px ${step.color}18` : 'none',
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.03)',
                  borderWidth: 1, borderStyle: 'solid',
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                      background: `${step.color}18`,
                      border: `1px solid ${step.color}38`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <step.Icon size={15} color={step.color} strokeWidth={1.5} />
                  </motion.div>
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
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
