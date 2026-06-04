'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { SPLINE_SCENES } from '@/lib/spline-config'
import { getRandomVideo, getNextTriggerThreshold, type YoutubeVideo } from '@/lib/youtube-videos'
import { CONTENT } from '@/lib/constants'

const EMOJIS = ['❤️','🧡','💛','💚','💙','💜','🩷','❤️‍🔥','💗','💓']

export function LikesButton() {
  const ref = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [video, setVideo] = useState<YoutubeVideo | null>(null)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; emoji: string; size: number; dur: number }>>([])
  const nextThreshold = useRef(getNextTriggerThreshold())
  const heartId = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleLike = useCallback(() => {
    const next = clickCount + 1
    setClickCount(next)

    // spawn 3-6 hearts across the section
    const count = Math.floor(Math.random() * 4) + 3
    const sect = sectionRef.current
    const w = sect ? sect.offsetWidth : window.innerWidth
    const h = sect ? sect.offsetHeight : 600

    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: heartId.current++,
      x: Math.random() * w,
      y: h * 0.5 + Math.random() * h * 0.4,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      size: Math.random() * 24 + 20,
      dur: Math.random() * 1 + 1.5,
    }))

    setHearts(prev => [...prev, ...newHearts])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)))
    }, 3000)

    if (next >= nextThreshold.current) {
      nextThreshold.current = next + getNextTriggerThreshold()
      setVideo(getRandomVideo())
    }
  }, [clickCount])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-bg-secondary py-24 md:py-32">
      {/* floating hearts layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {hearts.map(h => (
          <span
            key={h.id}
            className="absolute select-none pointer-events-none"
            style={{
              left: h.x,
              top: h.y,
              fontSize: h.size,
              animation: `heartFloat ${h.dur}s cubic-bezier(0.22,1,0.36,1) forwards`,
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-20">
        {/* Text */}
        <div className="text-center lg:text-right">
          <p className="text-brand-teal font-heebo font-bold text-sm mb-4">🎉 הגעת עד לכאן? מגיע לך קצת כיף</p>
          <h2 className="font-heebo font-black text-4xl md:text-6xl leading-tight mb-6 text-white">
            {CONTENT.easter.headline}<br />
            <span className="text-neon-pink">{CONTENT.easter.headlineAccent}</span>
          </h2>
          <p className="text-text-secondary text-lg mb-8">{CONTENT.easter.sub}</p>

          {/* like counter */}
          <div className="inline-flex items-center gap-3 bg-bg-primary/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-6">
            <span className="text-2xl">❤️</span>
            <m.span
              key={clickCount}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white text-2xl font-heebo font-black tabular-nums"
            >
              {clickCount.toLocaleString('he-IL')}
            </m.span>
            <span className="text-text-muted text-sm">{CONTENT.easter.btnLabel}</span>
          </div>

          {/* our heart button */}
          <div>
            <button
              onClick={handleLike}
              className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-7 py-4 cursor-pointer text-white font-heebo font-bold text-[15px] transition-all hover:bg-white/10 active:scale-[0.94]"
              style={{ animation: 'btnBump 0.2s ease' }}
              aria-label={`לחץ על הלב — ${clickCount} לחיצות`}
            >
              <span className="text-2xl">❤️</span>
              לחץ עליי!
            </button>
          </div>
        </div>

        {/* Spline iframe */}
        <div ref={ref} className="relative h-[420px] md:h-[500px]">
          {!loaded && <div className="absolute inset-0 animate-pulse bg-bg-tertiary rounded-3xl" />}
          {inView && (
            <iframe
              src={SPLINE_SCENES.likesButton}
              title="Likes Button 3D"
              allow="autoplay"
              onLoad={() => setLoaded(true)}
              className="w-full h-full border-0 block rounded-3xl"
              style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s' }}
            />
          )}
        </div>
      </div>

      {/* YouTube lightbox */}
      <AnimatePresence>
        {video && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideo(null)}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video"
            >
              <button
                onClick={() => setVideo(null)}
                className="absolute -top-12 left-0 text-white hover:text-neon-pink transition-colors"
                aria-label="סגור"
              >
                <X className="w-8 h-8" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full rounded-2xl border-0"
                title={video.title}
              />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  )
}
