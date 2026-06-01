'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import type { Application } from '@splinetool/runtime'
import { CONTENT } from '@/lib/constants'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

export function R4XBot() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [quote, setQuote] = useState<string | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleLoad = useCallback((app: Application) => {
    app.setBackgroundColor('transparent')
    setLoaded(true)
  }, [])

  const handleClick = useCallback(() => {
    const quotes = CONTENT.robot.quotes
    const next = quotes[clickCount % quotes.length]
    setQuote(next)
    setClickCount(c => c + 1)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setQuote(null), 3500)
  }, [clickCount])

  return (
    <div ref={ref} className="relative w-full h-[400px] md:h-[480px] overflow-hidden" style={{ background: 'transparent' }}>
      {/* Speech bubble */}
      <AnimatePresence>
        {quote && (
          <motion.div
            key={quote}
            initial={{ opacity: 0, y: 16, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-6 right-6 z-20 max-w-[280px] bg-bg-secondary/95 backdrop-blur-xl border border-brand-purple/40 rounded-2xl p-5 shadow-[0_0_40px_rgba(168,85,247,0.25)]"
          >
            <p className="text-white text-sm font-rubik font-medium leading-relaxed">{quote}</p>
            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-bg-secondary border-r border-b border-brand-purple/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spline scene — loaded via SDK for transparent background */}
      {inView && (
        <div
          onClick={handleClick}
          className="w-full h-full cursor-pointer"
          role="button"
          aria-label="לחץ על R4X כדי שידבר איתך"
          style={{ background: 'transparent' }}
        >
          <Spline
            scene="/r4xbot.spline"
            onLoad={handleLoad}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
        </div>
      )}

      {/* Gradient mask — hides the white floor plane at the bottom of the Spline scene */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #020008 0%, #020008 40%, transparent 100%)' }}
      />

      {/* First-time hint */}
      {clickCount === 0 && loaded && (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neon-pink/90 text-white px-4 py-2 rounded-full text-sm font-heebo font-bold shadow-glow-neon pointer-events-none whitespace-nowrap"
        >
          {CONTENT.robot.hint}
        </motion.div>
      )}
    </div>
  )
}
