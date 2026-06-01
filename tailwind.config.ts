import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':     '#07070B',
        'bg-secondary':   '#0F0C1F',
        'bg-tertiary':    '#160E2A',
        'text-primary':   '#ffffff',
        'text-secondary': '#cbd5e1',
        'text-muted':     '#94a3b8',
        'brand-teal':     '#2dd4bf',
        'brand-blue':     '#38bdf8',
        'brand-purple':   '#a855f7',
        'neon-pink':      '#ff2d92',
        'neon-magenta':   '#d946ef',
        'brandBlack':     '#0D0D11',
        'brandPureBlack': '#000000',
        'brandTurquoise': '#00F2FE',
        'brandPurple':    '#9B51E0',
      },
      fontFamily: {
        heebo:     ['var(--font-heebo)', 'sans-serif'],
        rubik:     ['var(--font-rubik)', 'sans-serif'],
      },
      boxShadow: {
        'glow-brand':   '0 0 30px rgba(45, 212, 191, 0.30)',
        'glow-neon':    '0 0 40px rgba(255, 45, 146, 0.40), 0 0 80px rgba(217, 70, 239, 0.20)',
        'glow-purple':  '0 0 40px rgba(168, 85, 247, 0.35)',
        'glow-teal':    '0 0 32px rgba(45, 212, 191, 0.32)',
        'glow-blue':    '0 0 32px rgba(56, 189, 248, 0.30)',
        'glow-pink':    '0 0 32px rgba(255, 45, 146, 0.32)',
        'card':         '0 20px 60px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'drift':        'drift 18s ease-in-out infinite alternate',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'marquee':      'marquee 28s linear infinite',
      },
      keyframes: {
        drift: {
          from: { transform: 'translate(0, 0) scale(1)' },
          to:   { transform: 'translate(40px, -40px) scale(1.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
