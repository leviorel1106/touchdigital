'use client'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  value: string
  className?: string
  style?: CSSProperties
}

export function CountUp({ value, className = '', style }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return
    const num = parseInt(value.replace(/\D/g, ''), 10)
    const suffix = value.replace(/[\d,]/g, '')
    if (isNaN(num)) { setDisplay(value); return }
    const duration = 1800
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * num).toLocaleString('he-IL') + suffix)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, value])

  return <span ref={ref} className={className} style={style}>{display}</span>
}
