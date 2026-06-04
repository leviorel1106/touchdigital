import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { ScrollProgressBar } from '@/components/animations/ScrollProgressBar'
import { HeroSection } from '@/components/sections/HeroSection'
import { BelowFoldSections } from '@/components/sections/BelowFoldSections'

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <Header />
      <main>
        <HeroSection />
        <BelowFoldSections />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
