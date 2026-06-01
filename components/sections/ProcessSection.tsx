'use client'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { CONTENT } from '@/lib/constants'

const EASE = [0.23, 1, 0.32, 1] as const

export function ProcessSection() {
  const { process } = CONTENT
  return (
    <SectionWrapper id="process">
      <FadeInUp className="mb-16">
        <h2
          className="font-heebo font-black text-white mb-3"
          style={{
            fontSize: 'clamp(30px, 4vw, 52px)',
            letterSpacing: '-0.03em',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          {process.headline}
        </h2>
        <p className="text-text-secondary font-rubik font-medium text-lg max-w-lg">{process.sub}</p>
      </FadeInUp>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 1, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
            className={`relative py-10 px-6 group overflow-hidden ${i < process.steps.length - 1 ? 'border-b sm:border-b-0 sm:border-l border-white/[0.06]' : ''}`}
          >
            {/* Subtle color glow on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top right, ${step.color}10 0%, transparent 70%)` }}
            />

            {/* Ghost number */}
            <p
              className="font-heebo font-black leading-none mb-5 select-none"
              style={{
                fontSize: '5.5rem',
                letterSpacing: '-0.04em',
                background: i % 2 === 0
                  ? 'linear-gradient(135deg, #00F2FE22 0%, #9B51E022 100%)'
                  : 'linear-gradient(135deg, #9B51E022 0%, #00F2FE22 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              aria-hidden
            >
              {step.num}
            </p>

            <p
              className="font-heebo font-bold text-[11px] uppercase tracking-widest mb-3 relative z-[1]"
              style={{ color: step.color }}
            >
              {step.phase}
            </p>
            <h3 className="font-heebo font-bold text-white text-base mb-2 relative z-[1]">{step.title}</h3>
            <p className="text-text-muted text-[15px] font-rubik font-medium leading-relaxed relative z-[1]">{step.body}</p>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: step.color }}
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
