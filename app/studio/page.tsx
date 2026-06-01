import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { RobotSection } from '@/components/sections/RobotSection'
import { VideoSection } from '@/components/sections/studio/VideoSection'
import { LandingPagesSection } from '@/components/sections/studio/LandingPagesSection'

export const metadata = {
  title: "AI Studio | טאץ' דיגיטל",
  description: 'Touch Digital AI Studio — הכלים, הסרטונים ודפי הנחיתה שלנו',
}

export default function StudioPage() {
  return (
    <>
      <Header />
      <main>
        <RobotSection />
        <VideoSection
          id="ai-tools"
          title="THE AI TOOLS POWERING OUR WORK"
          sub="BEST AI TOOLS WE USE"
          src="/ai-tools.mp4"
          accent="#a855f7"
        />
        <VideoSection
          id="video-models"
          title="AI VIDEO MODELS WE CREATE WITH"
          sub="BEST AI VIDEO MODELS WE USE"
          src="/video-tools.mp4"
          accent="#2dd4bf"
        />
        <LandingPagesSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
