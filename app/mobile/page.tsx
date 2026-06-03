import { CONTENT } from '@/lib/constants'
import { MobileWhatsAppFloat } from '@/components/mobile/MobileWhatsAppFloat'

const C = CONTENT
const WA_URL = `https://wa.me/${C.brand.whatsapp.number}?text=${encodeURIComponent(C.brand.whatsapp.message)}`
const TEAL = '#2dd4bf'
const PURPLE = '#a855f7'

export default function MobilePage() {
  return (
    <>
      <style>{`
        @keyframes fade-up { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse-glow { 0%,100% { box-shadow:0 0 20px rgba(45,212,191,.4) } 50% { box-shadow:0 0 40px rgba(45,212,191,.7) } }
        @keyframes drift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-10px)} }
        .m-fade-up { animation: fade-up .7s cubic-bezier(.23,1,.32,1) both }
        .m-d1 { animation-delay:.1s } .m-d2 { animation-delay:.2s } .m-d3 { animation-delay:.3s }
        .m-pulse { animation: pulse-glow 2.4s ease-in-out infinite }
        .m-drift { animation: drift 18s ease-in-out infinite alternate }
      `}</style>

      {/* ── HEADER ── */}
      <header dir="rtl" style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 20px',
        background:'rgba(10,14,42,.85)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid rgba(255,255,255,.08)',
      }}>
        <span style={{ fontFamily:'var(--font-heebo)', fontWeight:900, color:'#fff', fontSize:18 }}>
          טאץ׳ דיגיטל
        </span>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
          style={{
            fontFamily:'var(--font-heebo)', fontWeight:700, fontSize:13,
            color:'#0a0e2a', background:`linear-gradient(135deg,${TEAL},${PURPLE})`,
            padding:'8px 16px', borderRadius:999, textDecoration:'none',
          }}>
          דברו איתנו
        </a>
      </header>

      <main dir="rtl" style={{ fontFamily:'var(--font-heebo)', background:'#0a0e2a', color:'#fff', overflowX:'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ position:'relative', minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', paddingTop:80 }}>
          <video src="/hero-video.mp4" autoPlay muted loop playsInline preload="metadata"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,14,42,.8) 0%, rgba(10,14,42,.5) 50%, rgba(10,14,42,.9) 100%)', zIndex:1 }} />
          <div className="m-drift" style={{ position:'absolute', top:'-30%', right:'-20%', width:400, height:400, borderRadius:'50%', background:PURPLE, opacity:.18, filter:'blur(120px)', zIndex:1 }} />
          <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 24px 60px', maxWidth:420, margin:'0 auto' }}>
            <p className="m-fade-up m-d1" style={{ fontSize:12, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:TEAL, marginBottom:16 }}>
              {C.hero.eyebrow}
            </p>
            <h1 className="m-fade-up m-d2" style={{ fontSize:'clamp(30px,8vw,42px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-.03em', marginBottom:20 }}>
              {C.hero.headlinePrefix}{' '}
              <span style={{ color:TEAL }}>מנצחת</span>{' '}
              {C.hero.headlineSuffix}
            </h1>
            <p className="m-fade-up m-d3" style={{ fontSize:16, color:'rgba(255,255,255,.8)', lineHeight:1.7, marginBottom:36, fontFamily:'var(--font-rubik)', fontWeight:500 }}>
              {C.hero.sub}
            </p>
            <a className="m-fade-up m-d3 m-pulse" href="#offer"
              style={{
                display:'inline-block', fontWeight:700, fontSize:16,
                color:'#fff', background:`linear-gradient(135deg,${TEAL},#38bdf8,${PURPLE})`,
                padding:'16px 32px', borderRadius:999, textDecoration:'none',
              }}>
              {C.hero.ctaPrimary}
            </a>
            <div style={{ display:'flex', gap:12, marginTop:28, flexWrap:'wrap', justifyContent:'center' }}>
              {C.hero.trustBadges.map((b, i) => (
                <span key={i} style={{ fontSize:12, color:'rgba(255,255,255,.6)', background:'rgba(255,255,255,.07)', borderRadius:999, padding:'4px 12px', border:'1px solid rgba(255,255,255,.1)' }}>
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PAIN ── */}
        <section id="pain" style={{ position:'relative', minHeight:'70dvh', display:'flex', alignItems:'center', overflow:'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pain-image.png" alt="" aria-hidden loading="lazy"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(10,14,42,.92) 0%,rgba(10,14,42,.7) 60%,transparent 100%)', zIndex:1 }} />
          <div style={{ position:'relative', zIndex:2, padding:'80px 24px', maxWidth:400 }}>
            <h2 style={{ fontSize:'clamp(28px,7vw,40px)', fontWeight:900, letterSpacing:'-.03em', lineHeight:1.15, marginBottom:20 }}>
              למה{' '}
              <span style={{ color:'#f43f5e', textDecoration:'underline', textDecorationColor:'#f43f5e', textDecorationThickness:3 }}>לשרוף</span>
              {' '}כסף ממומן?
            </h2>
            <p style={{ fontFamily:'var(--font-rubik)', fontWeight:500, fontSize:16, color:'rgba(255,255,255,.88)', lineHeight:1.75 }}>
              {C.pain.body}
            </p>
          </div>
        </section>

        {/* ── BEFORE/AFTER ── */}
        <section id="makeover" style={{ padding:'64px 16px', background:'#080c24' }}>
          <h2 style={{ fontSize:'clamp(26px,6vw,36px)', fontWeight:900, letterSpacing:'-.03em', textAlign:'center', marginBottom:8 }}>
            מייקאובר{' '}<span style={{ background:`linear-gradient(135deg,${TEAL},${PURPLE})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>360°</span>
          </h2>
          <p style={{ textAlign:'center', color:'rgba(255,255,255,.55)', fontFamily:'var(--font-rubik)', marginBottom:32, fontSize:15 }}>
            כך נראים עסקים לפני ואחרי טאץ׳ דיגיטל
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { before:'/before-after/jahnon-before.png', after:'/before-after/jahnon-after.png' },
              { before:'/before-after/dog-before.png',    after:'/before-after/dog-after.png'    },
              { before:'/before-after/psy-before.png',    after:'/before-after/psy-after.png'    },
              { before:'/before-after/coach-before.png',  after:'/before-after/coach-after.png'  },
            ].map((c, i) => (
              <div key={i} style={{ position:'relative', aspectRatio:'9/16', borderRadius:12, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,.6)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.before} alt="" loading="lazy" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.after} alt="" loading="lazy" style={{ position:'absolute', inset:'0 50% 0 0', width:'200%', height:'100%', objectFit:'cover', objectPosition:'right' }} />
                <div style={{ position:'absolute', top:0, bottom:0, left:'50%', width:2, background:`linear-gradient(to bottom,${TEAL},${PURPLE})`, transform:'translateX(-50%)' }} />
                <span style={{ position:'absolute', top:8, right:8, fontSize:10, fontWeight:700, background:'rgba(0,0,0,.7)', color:'rgba(255,255,255,.85)', padding:'2px 8px', borderRadius:999 }}>לפני</span>
                <span style={{ position:'absolute', top:8, left:8, fontSize:10, fontWeight:700, background:`rgba(45,212,191,.85)`, color:'#fff', padding:'2px 8px', borderRadius:999 }}>אחרי</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" style={{ padding:'64px 20px', background:'#0a0e2a' }}>
          <p style={{ fontSize:12, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:TEAL, textAlign:'center', marginBottom:12 }}>{C.services.eyebrow}</p>
          <h2 style={{ fontSize:'clamp(24px,6vw,34px)', fontWeight:900, letterSpacing:'-.03em', textAlign:'center', marginBottom:40, lineHeight:1.2 }}>
            {C.services.headline}
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {C.services.items.map((s, i) => (
              <div key={i} style={{
                display:'flex', gap:16, alignItems:'flex-start',
                background:'rgba(255,255,255,.04)', borderRadius:16,
                border:'1px solid rgba(255,255,255,.08)', padding:'18px 20px',
              }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`linear-gradient(135deg,${TEAL}22,${PURPLE}22)`, border:`1px solid ${TEAL}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>
                  {['📄','💬','📸','🎬','🎨'][i]}
                </div>
                <div>
                  <p style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>{s.title}</p>
                  <p style={{ fontFamily:'var(--font-rubik)', color:'rgba(255,255,255,.6)', fontSize:14, lineHeight:1.6 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" style={{ padding:'64px 20px', background:'#fff' }}>
          <p style={{ fontSize:12, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:PURPLE, textAlign:'center', marginBottom:12, fontFamily:'var(--font-heebo)' }}>{C.testimonials.eyebrow}</p>
          <h2 style={{ fontSize:'clamp(24px,6vw,34px)', fontWeight:900, letterSpacing:'-.03em', color:'#0a0a1a', textAlign:'center', marginBottom:32, lineHeight:1.2, fontFamily:'var(--font-heebo)' }}>
            {C.testimonials.headline}
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {C.testimonials.items.slice(0, 4).map((t, i) => (
              <div key={i} style={{
                background:'#fff', borderRadius:20, border:'1px solid rgba(0,0,0,.08)',
                boxShadow:'0 4px 16px rgba(0,0,0,.06)', padding:'20px',
              }}>
                <div style={{ display:'flex', gap:2, marginBottom:10 }}>
                  {Array.from({length:t.rating}).map((_,j)=><span key={j} style={{color:'#f59e0b',fontSize:14}}>★</span>)}
                </div>
                <p style={{ fontFamily:'var(--font-rubik)', color:'#374151', fontSize:14, lineHeight:1.7, marginBottom:14 }}>"{t.quote}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`${PURPLE}22`, border:`1px solid ${PURPLE}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:PURPLE, fontFamily:'var(--font-heebo)' }}>
                    {t.name.replace(/[\[\]]/g,'').trim().slice(0,2)||'ל׳'}
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:13, color:'#111', fontFamily:'var(--font-heebo)' }}>{t.name}</p>
                    <p style={{ fontSize:12, color:'#9ca3af', fontFamily:'var(--font-rubik)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section id="process" style={{ padding:'64px 20px', background:'#080c24' }}>
          <p style={{ fontSize:12, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:TEAL, textAlign:'center', marginBottom:12 }}>{C.process.eyebrow}</p>
          <h2 style={{ fontSize:'clamp(24px,6vw,34px)', fontWeight:900, letterSpacing:'-.03em', textAlign:'center', marginBottom:10, lineHeight:1.2 }}>{C.process.headline}</h2>
          <p style={{ textAlign:'center', color:'rgba(255,255,255,.55)', fontFamily:'var(--font-rubik)', marginBottom:40, fontSize:14 }}>{C.process.sub}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:20, position:'relative' }}>
            <div style={{ position:'absolute', right:24, top:24, bottom:24, width:2, background:'rgba(255,255,255,.08)' }} />
            {C.process.steps.map((s, i) => (
              <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', border:`2px solid ${s.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:s.color, flexShrink:0, background:'#080c24', position:'relative', zIndex:1 }}>{s.num}</div>
                <div style={{ paddingTop:8 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:s.color, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>{s.phase}</p>
                  <p style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>{s.title}</p>
                  <p style={{ fontFamily:'var(--font-rubik)', color:'rgba(255,255,255,.6)', fontSize:13, lineHeight:1.6 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── OFFER ── */}
        <section id="offer" style={{ padding:'64px 20px 80px', background:'#0a0e2a' }}>
          <div style={{
            background:'linear-gradient(135deg,rgba(45,212,191,.08),rgba(168,85,247,.08))',
            border:`1px solid rgba(45,212,191,.25)`, borderRadius:24, padding:'32px 24px',
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:PURPLE, opacity:.12, filter:'blur(60px)' }} />
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:TEAL, marginBottom:12 }}>{C.offer.eyebrow}</p>
            <h2 style={{ fontSize:'clamp(26px,7vw,36px)', fontWeight:900, letterSpacing:'-.03em', marginBottom:8, lineHeight:1.1 }}>{C.offer.headline}</h2>
            <p style={{ fontFamily:'var(--font-rubik)', color:'rgba(255,255,255,.7)', marginBottom:24, fontSize:15 }}>{C.offer.sub}</p>
            <div style={{ display:'flex', alignItems:'flex-end', gap:12, marginBottom:32 }}>
              <span style={{ fontSize:48, fontWeight:900, background:`linear-gradient(135deg,${TEAL},${PURPLE})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                ₪{C.offer.priceCurrent}
              </span>
              <span style={{ fontSize:20, color:'rgba(255,255,255,.4)', textDecoration:'line-through', paddingBottom:8 }}>₪{C.offer.priceOriginal}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
              {C.offer.includes.map((item, i) => (
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ color:TEAL, fontSize:16, flexShrink:0, marginTop:1 }}>✓</span>
                  <span style={{ fontFamily:'var(--font-rubik)', fontSize:14, color:'rgba(255,255,255,.85)', lineHeight:1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(45,212,191,.08)', border:`1px solid rgba(45,212,191,.2)`, borderRadius:14, padding:'16px', marginBottom:28 }}>
              <p style={{ fontFamily:'var(--font-rubik)', fontSize:14, color:'rgba(255,255,255,.9)', lineHeight:1.6 }}>{C.offer.bonus.title}<br/>{C.offer.bonus.body}</p>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="m-pulse"
              style={{
                display:'block', textAlign:'center', fontWeight:700, fontSize:16,
                color:'#0a0e2a', background:`linear-gradient(135deg,${TEAL},#38bdf8,${PURPLE})`,
                padding:'18px 24px', borderRadius:999, textDecoration:'none', marginBottom:12,
              }}>
              {C.offer.ctaPrimary}
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              style={{
                display:'block', textAlign:'center', fontWeight:600, fontSize:15,
                color:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.15)',
                padding:'14px 24px', borderRadius:999, textDecoration:'none',
              }}>
              💬 {C.offer.ctaWhatsapp}
            </a>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background:'#05070f', padding:'32px 20px', textAlign:'center' }}>
          <p style={{ fontWeight:900, fontSize:18, marginBottom:6 }}>טאץ׳ דיגיטל</p>
          <p style={{ fontFamily:'var(--font-rubik)', color:'rgba(255,255,255,.4)', fontSize:13 }}>© 2025 Touch Digital. כל הזכויות שמורות.</p>
        </footer>

      </main>

      <MobileWhatsAppFloat waUrl={WA_URL} />
    </>
  )
}
