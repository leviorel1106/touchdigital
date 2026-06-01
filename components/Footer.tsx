import { CONTENT } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-bg-primary py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-heebo font-black text-xl text-white">{CONTENT.brand.nameHe}</span>
          <p className="text-text-muted text-xs mt-1">{CONTENT.brand.tagline}</p>
        </div>
        <ul className="flex gap-6 list-none">
          {CONTENT.footer.links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-text-muted text-xs hover:text-white transition-colors">{l.label}</a>
            </li>
          ))}
        </ul>
        <p className="text-text-muted text-xs">{CONTENT.footer.copyright}</p>
      </div>
    </footer>
  )
}
