'use client'
import dynamic from 'next/dynamic'

// Loading fallbacks match each section's background — prevents blank flash
// during the brief window between SSR HTML and chunk hydration.
const dark  = () => <div style={{ minHeight: '60vh', background: '#0a0e2a' }} />
const dark2 = () => <div style={{ minHeight: '60vh', background: '#080c24' }} />
const white = () => <div style={{ minHeight: '60vh', background: '#ffffff' }} />

const PainSection         = dynamic(() => import('./PainSection').then(m => ({ default: m.PainSection })), { loading: dark })
const BeforeAfterSection  = dynamic(() => import('./BeforeAfterSection').then(m => ({ default: m.BeforeAfterSection })), { loading: dark2 })
const PostsSection        = dynamic(() => import('./PostsSection').then(m => ({ default: m.PostsSection })), { loading: dark2 })
const AboutSection        = dynamic(() => import('./AboutSection').then(m => ({ default: m.AboutSection })), { loading: white })
const ServicesSection     = dynamic(() => import('./ServicesSection').then(m => ({ default: m.ServicesSection })), { loading: dark })
const TestimonialsSection = dynamic(() => import('./TestimonialsSection').then(m => ({ default: m.TestimonialsSection })), { loading: white })
const ProcessSection      = dynamic(() => import('./ProcessSection').then(m => ({ default: m.ProcessSection })), { loading: dark2 })
const OfferSection        = dynamic(() => import('./OfferSection').then(m => ({ default: m.OfferSection })), { loading: dark })

export function BelowFoldSections() {
  return (
    <>
      <PainSection />
      <BeforeAfterSection />
      <PostsSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <ProcessSection />
      <OfferSection />
    </>
  )
}
