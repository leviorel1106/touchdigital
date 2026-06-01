import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { ScrollProgressBar } from '@/components/animations/ScrollProgressBar'
import { HeroSection } from '@/components/sections/HeroSection'
import { PainSection } from '@/components/sections/PainSection'
import { BeforeAfterSection } from '@/components/sections/BeforeAfterSection'
import { PostsSection } from '@/components/sections/PostsSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { OfferSection } from '@/components/sections/OfferSection'

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <Header />
      <main>
        <HeroSection />
        <PainSection />
        <BeforeAfterSection />
        <PostsSection />
        <AboutSection />
        <ServicesSection />
        <TestimonialsSection />
        <ProcessSection />
        <OfferSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
