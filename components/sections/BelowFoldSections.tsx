'use client'
import dynamic from 'next/dynamic'

// Client-to-Client dynamic imports create real lazy chunks.
// SSR is enabled (default) so server-renders the HTML immediately —
// content is visible from first paint. JS chunks load in parallel
// but don't block the hero from becoming interactive first.
const PainSection         = dynamic(() => import('./PainSection').then(m => ({ default: m.PainSection })))
const BeforeAfterSection  = dynamic(() => import('./BeforeAfterSection').then(m => ({ default: m.BeforeAfterSection })))
const PostsSection        = dynamic(() => import('./PostsSection').then(m => ({ default: m.PostsSection })))
const AboutSection        = dynamic(() => import('./AboutSection').then(m => ({ default: m.AboutSection })))
const ServicesSection     = dynamic(() => import('./ServicesSection').then(m => ({ default: m.ServicesSection })))
const TestimonialsSection = dynamic(() => import('./TestimonialsSection').then(m => ({ default: m.TestimonialsSection })))
const ProcessSection      = dynamic(() => import('./ProcessSection').then(m => ({ default: m.ProcessSection })))
const OfferSection        = dynamic(() => import('./OfferSection').then(m => ({ default: m.OfferSection })))

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
