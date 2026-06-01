import dynamic from 'next/dynamic'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { ScrollProgressBar } from '@/components/animations/ScrollProgressBar'
import { HeroSection } from '@/components/sections/HeroSection'

const PainSection        = dynamic(() => import('@/components/sections/PainSection').then(m => ({ default: m.PainSection })))
const BeforeAfterSection = dynamic(() => import('@/components/sections/BeforeAfterSection').then(m => ({ default: m.BeforeAfterSection })))
const PostsSection       = dynamic(() => import('@/components/sections/PostsSection').then(m => ({ default: m.PostsSection })))
const AboutSection       = dynamic(() => import('@/components/sections/AboutSection').then(m => ({ default: m.AboutSection })))
const ServicesSection    = dynamic(() => import('@/components/sections/ServicesSection').then(m => ({ default: m.ServicesSection })))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })))
const ProcessSection     = dynamic(() => import('@/components/sections/ProcessSection').then(m => ({ default: m.ProcessSection })))
const OfferSection       = dynamic(() => import('@/components/sections/OfferSection').then(m => ({ default: m.OfferSection })))

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
