import type { Metadata } from 'next'
import { Heebo, Rubik } from 'next/font/google'
import './globals.css'
import { TapBurst } from '@/components/animations/TapBurst'
import { MotionProvider } from '@/components/MotionProvider'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-heebo',
  display: 'swap',
})

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "טאץ' דיגיטל | תשתית דיגיטלית 360° לעסקים שרוצים לבלוט",
  description: "בונים לעסק שלך תשתית דיגיטלית יוקרתית: דף נחיתה ממיר, צ'אטבוט וואטסאפ, מייקאובר סושיאל וכרטיס Google. חבילת טאץ' הזהב — 2,500 ₪ בלבד.",
  keywords: ['שיווק דיגיטלי', 'דף נחיתה', "צ'אטבוט", 'מייקאובר סושיאל', "טאץ' דיגיטל"],
  metadataBase: new URL('https://touchdigital.co.il'),
  openGraph: {
    title: "טאץ' דיגיטל — המנוע שמאחורי המותג שלך",
    description: 'תשתית דיגיטלית 360° שגורמת ללקוח לבחור דווקא בך',
    locale: 'he_IL',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${rubik.variable}`}
    >
      <body className="min-h-screen antialiased">
        <MotionProvider>
          {children}
          <TapBurst />
        </MotionProvider>
      </body>
    </html>
  )
}
