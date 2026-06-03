'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { CONTENT } from '@/lib/constants'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isStudio = pathname === '/studio'

  const navHref = (anchor: string) => isStudio ? `/${anchor}` : anchor

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Studio page — minimal centered header only
  if (isStudio) {
    return (
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-5xl px-4">
        <div className="flex justify-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-heebo font-bold text-sm text-white px-6 py-2.5 rounded-full transition-all duration-300 hover:opacity-75"
            style={{
              background: 'rgba(7,7,11,0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            ← {CONTENT.brand.nameHe}
          </a>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-5xl px-4">
        <nav
          className={`flex items-center justify-between rounded-full px-5 py-2 transition-all duration-500 ${
            scrolled
              ? 'bg-bg-primary/85 backdrop-blur-2xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]'
              : 'bg-bg-primary/60 backdrop-blur-xl border border-white/8'
          }`}
        >
          {/* Logo */}
          <a href="/" className="font-heebo font-black text-base text-white hover:opacity-80 transition-opacity">
            {CONTENT.brand.nameHe}
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {CONTENT.nav.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-text-secondary hover:text-white text-sm font-rubik font-medium transition-colors duration-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/studio"
                className="text-text-secondary hover:text-white text-sm font-rubik font-medium transition-colors duration-300"
              >
                פרויקטים
              </a>
            </li>
          </ul>

          {/* Fingerprint button → studio + hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="/studio"
              className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-[1.08]"
              style={{
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              aria-label="כל הפרויקטים"
            >
              <Image src="/icons/fp1.png" alt="" width={22} height={22} style={{ opacity: 0.85 }} priority />
            </a>
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white hover:bg-white/12 transition-colors"
              aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-bg-primary/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-10"
          >
            {CONTENT.nav.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="font-heebo font-black text-4xl text-white"
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="/studio"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: CONTENT.nav.length * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="font-heebo font-black text-4xl text-white"
            >
              פרויקטים
            </motion.a>
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (CONTENT.nav.length + 1) * 0.07 }}
              className="mt-4 bg-white text-bg-primary font-heebo font-black text-xl px-10 py-4 rounded-full"
            >
              נדבר עכשיו ↗
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
