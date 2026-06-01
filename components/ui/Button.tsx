import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'neon'
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function Button({ children, variant = 'primary', href, onClick, className = '', type = 'button', disabled }: Props) {
  const base = 'inline-flex items-center gap-3 rounded-full font-heebo font-bold text-[15px] px-7 py-4 transition-all duration-300 cursor-pointer select-none'
  const variants = {
    primary: 'bg-white text-bg-primary hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(255,255,255,0.14)] active:scale-[0.98]',
    ghost:   'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 active:scale-[0.98]',
    neon:    'bg-gradient-to-r from-neon-pink to-neon-magenta text-white hover:scale-[1.03] hover:shadow-glow-neon active:scale-[0.98]',
  }

  const cls = `${base} ${variants[variant]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`

  if (href) return <a href={href} className={cls}>{children}</a>
  return <button type={type} onClick={onClick} className={cls} disabled={disabled}>{children}</button>
}

export function BtnIcon({ children }: { children: ReactNode }) {
  return (
    <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center text-xs transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110">
      {children}
    </span>
  )
}
