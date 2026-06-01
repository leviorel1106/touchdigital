import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { FadeInUp } from '@/components/animations/FadeInUp'
import { CountUp } from '@/components/animations/CountUp'
import { CONTENT } from '@/lib/constants'

const STAT_COLORS = ['#2dd4bf', '#a855f7', '#38bdf8']

export function StatsSection() {
  return (
    <SectionWrapper className="py-14 md:py-20">
      <FadeInUp>
        <div className="border-t border-b border-white/[0.07] py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-0">
            {CONTENT.stats.map((stat, i) => (
              <div
                key={i}
                className={`flex items-baseline gap-3 md:flex-1 ${i < CONTENT.stats.length - 1 ? 'md:border-l md:border-white/[0.07] md:pr-12' : ''}`}
              >
                <CountUp
                  value={stat.number}
                  className="font-heebo font-black text-5xl md:text-6xl tabular-nums"
                  style={{ color: STAT_COLORS[i] }}
                />
                <p className="text-text-muted text-base font-rubik font-medium leading-snug max-w-[110px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeInUp>
    </SectionWrapper>
  )
}
