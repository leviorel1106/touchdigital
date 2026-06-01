'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/* ── Gradient colour stops ─────────────────────────────────────── */
// teal → sky-blue → purple → hot-pink
const STOPS: [number, [number,number,number]][] = [
  [0.00, [45,  212, 191]],   // #2dd4bf  teal
  [0.35, [56,  189, 248]],   // #38bdf8  sky-blue
  [0.65, [168,  85, 247]],   // #a855f7  purple
  [1.00, [255,  45, 146]],   // #ff2d92  hot-pink
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeOut3(t: number) { return 1 - Math.pow(1 - t, 3) }
function easeIn2(t: number) { return t * t }

function gradRGB(normX: number): readonly [number, number, number] {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [t0, c0] = STOPS[i]
    const [t1, c1] = STOPS[i + 1]
    if (normX <= t1) {
      const t = (normX - t0) / (t1 - t0)
      return [
        Math.round(lerp(c0[0], c1[0], t)),
        Math.round(lerp(c0[1], c1[1], t)),
        Math.round(lerp(c0[2], c1[2], t)),
      ]
    }
  }
  return STOPS[STOPS.length - 1][1]
}

/* ── Particle type ─────────────────────────────────────────────── */
interface P {
  ox: number; oy: number         // origin (text pixel, CSS px)
  sx: number; sy: number         // animation start
  x: number;  y: number          // current
  tx: number; ty: number         // animation target
  alpha: number; sa: number      // opacity current / start
  r: number; g: number; b: number
  wd: number                     // wave delay 0–1
}

/* ── Sample text pixels → particle list ───────────────────────── */
function sampleText(
  word: string,
  font: string,
  cssW: number,
  cssH: number,
  dpr: number,
): P[] {
  if (typeof document === 'undefined') return []
  const phW = Math.round(cssW * dpr)
  const phH = Math.round(cssH * dpr)
  const oc  = document.createElement('canvas')
  oc.width  = phW
  oc.height = phH
  const ctx = oc.getContext('2d')!

  // Scale so we can draw in CSS pixels
  ctx.scale(dpr, dpr)
  const grad = ctx.createLinearGradient(0, 0, cssW, 0)
  for (const [t, c] of STOPS) grad.addColorStop(t, `rgb(${c.join(',')})`)
  ctx.fillStyle = grad
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(word, cssW / 2, cssH / 2)

  const { data } = ctx.getImageData(0, 0, phW, phH)
  // Step in physical pixels: ~2 physical px per particle
  const step = Math.max(1, Math.ceil(dpr))
  const pts: P[] = []

  for (let py = 0; py < phH; py += step) {
    for (let px = 0; px < phW; px += step) {
      if (data[(py * phW + px) * 4 + 3] > 55) {
        const ox = px / dpr
        const oy = py / dpr
        const [r, g, b] = gradRGB(px / phW)
        pts.push({ ox, oy, sx: ox, sy: oy, x: ox, y: oy,
                   tx: ox, ty: oy, alpha: 1, sa: 1, r, g, b, wd: 0 })
      }
    }
  }
  return pts
}

/* ── Component ─────────────────────────────────────────────────── */
interface Props {
  words: readonly string[]
  interval?: number
  className?: string
}

const GRADIENT_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #2dd4bf 0%, #38bdf8 35%, #a855f7 65%, #ff2d92 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export function RotatingWord({ words, interval = 3500, className = '' }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const anchorRef   = useRef<HTMLSpanElement>(null)
  const reduce      = useReducedMotion()
  const [fallback, setFallback] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  /* ── Reduced-motion / mobile fallback ───────────────────────── */
  useEffect(() => {
    if (!reduce && !isMobile) return
    const id = setInterval(() => setFallback(i => (i + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [reduce, isMobile, words.length, interval])

  /* ── Canvas particle loop ────────────────────────────────────── */
  useEffect(() => {
    if (reduce || isMobile) return
    const canvas = canvasRef.current
    const anchor = anchorRef.current
    if (!canvas || !anchor) return

    const ASSEMBLE_MS = 850
    const VAPOR_MS    = 650
    const IDLE_MS     = Math.max(700, interval - ASSEMBLE_MS - VAPOR_MS)

    let particles: P[] = []
    let currentPhase: 'assembling' | 'idle' | 'vaporizing' = 'assembling'
    let phaseStart = performance.now()
    let wordIndex  = 0
    let raf: number

    /* helpers */
    function metrics() {
      const cs   = window.getComputedStyle(anchor!)
      const rect  = anchor!.getBoundingClientRect()
      const dpr   = window.devicePixelRatio || 1
      return {
        w:    Math.max(rect.width + 28, 180),
        h:    rect.height,
        font: `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
        dpr,
      }
    }

    function sizeCanvas() {
      const { w, h, dpr } = metrics()
      canvas!.width        = Math.round(w * dpr)
      canvas!.height       = Math.round(h * dpr)
      canvas!.style.width  = `${w}px`
      canvas!.style.height = `${h}px`
    }

    function loadWord(idx: number, entering: boolean) {
      const { w, h, font, dpr } = metrics()
      const pts = sampleText(words[idx], font, w, h, dpr)

      if (entering) {
        // Start scattered → converge to origin
        const spread = Math.min(w * 0.9, 220)
        particles = pts.map(p => {
          const angle = Math.random() * Math.PI * 2
          const dist  = spread * (0.3 + Math.random() * 0.9)
          const sx    = p.ox + Math.cos(angle) * dist
          const sy    = p.oy + Math.sin(angle) * dist
          return { ...p, sx, sy, x: sx, y: sy, alpha: 0, sa: 0 }
        })
      } else {
        // Sitting at origin — vaporize will scatter them later
        particles = pts.map(p => ({ ...p, sx: p.ox, sy: p.oy, x: p.ox, y: p.oy, alpha: 1, sa: 1 }))
      }
    }

    function armVaporize() {
      const { w } = metrics()
      for (const p of particles) {
        p.sx  = p.x;  p.sy = p.y;  p.sa = p.alpha
        // RTL wave: right-side particles (high ox) exit first → waveDelay is low
        p.wd  = 1 - (p.ox / w)
        // Scatter: bias rightward (positive x), random y
        const dir = Math.random() > 0.25 ? 1 : -0.4
        p.tx  = p.ox + dir * (25 + Math.random() * 110)
        p.ty  = p.oy + (Math.random() - 0.5) * 90
      }
    }

    /* init */
    sizeCanvas()
    loadWord(0, true)
    phaseStart = performance.now()

    /* resize */
    const ro = new ResizeObserver(() => {
      sizeCanvas()
      loadWord(wordIndex, currentPhase === 'assembling')
    })
    ro.observe(anchor!)

    /* tick */
    function tick(now: number) {
      const ctx     = canvas!.getContext('2d')!
      const dpr     = window.devicePixelRatio || 1
      const elapsed = now - phaseStart

      ctx.clearRect(0, 0, canvas!.width, canvas!.height)

      /* ─ Phase logic ─ */
      if (currentPhase === 'assembling') {
        const raw = Math.min(elapsed / ASSEMBLE_MS, 1)
        const t   = easeOut3(raw)
        for (const p of particles) {
          p.x     = lerp(p.sx, p.ox, t)
          p.y     = lerp(p.sy, p.oy, t)
          p.alpha = lerp(p.sa, 1, t)
        }
        if (raw >= 1) {
          for (const p of particles) { p.x = p.ox; p.y = p.oy; p.alpha = 1 }
          currentPhase = 'idle'; phaseStart = now
        }
      }
      else if (currentPhase === 'idle') {
        if (elapsed >= IDLE_MS) {
          armVaporize()
          currentPhase = 'vaporizing'; phaseStart = now
        }
      }
      else if (currentPhase === 'vaporizing') {
        const raw = Math.min(elapsed / VAPOR_MS, 1)
        for (const p of particles) {
          // Each particle has a wave-delay fraction; remap raw → local progress
          const local = Math.max(0, Math.min(1, (raw - p.wd * 0.42) / 0.58))
          const t     = easeIn2(local)
          p.x     = lerp(p.sx, p.tx, t)
          p.y     = lerp(p.sy, p.ty, t)
          p.alpha = lerp(p.sa, 0, t)
        }
        if (raw >= 1) {
          wordIndex    = (wordIndex + 1) % words.length
          currentPhase = 'assembling'
          phaseStart   = now
          loadWord(wordIndex, true)
        }
      }

      /* ─ Draw ─ */
      // Particle size: fill the sampled area so text looks solid when idle
      const sz = Math.max(2, Math.ceil(dpr * 1.5))
      for (const p of particles) {
        if (p.alpha < 0.01) continue
        ctx.globalAlpha = p.alpha
        ctx.fillStyle   = `rgb(${p.r},${p.g},${p.b})`
        ctx.fillRect(Math.round(p.x * dpr), Math.round(p.y * dpr), sz, sz)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [reduce, isMobile, words, interval])

  /* ── Reduced-motion / mobile render ─────────────────────────── */
  if (reduce || isMobile) {
    return (
      <span className={`inline-block relative ${className}`} style={{ minWidth: '6ch' }} aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span
            key={fallback}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            style={{ ...GRADIENT_STYLE, display: 'inline-block' }}
          >
            {words[fallback]}
          </motion.span>
        </AnimatePresence>
      </span>
    )
  }

  /* ── Canvas render ───────────────────────────────────────────── */
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), '')

  return (
    <span className={`inline-block relative ${className}`} aria-live="polite">
      {/*
        Invisible anchor: sits inside the h1 so it inherits the exact font
        (family, weight, size via clamp). getBoundingClientRect gives us the
        real rendered dimensions; getComputedStyle gives us the font string.
      */}
      <span
        ref={anchorRef}
        aria-hidden
        style={{ visibility: 'hidden', pointerEvents: 'none', whiteSpace: 'nowrap', display: 'inline-block' }}
      >
        {longest}
      </span>

      {/* Canvas aligned to anchor top, horizontally centred */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />
    </span>
  )
}
