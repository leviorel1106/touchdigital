// Empirically isolates the scroll-jank cause: loads the page, then measures
// the Services->Offer scroll under several conditions, toggling one suspect
// off at a time via injected JS/CSS. Whichever toggle drops the jank is the cause.
import { chromium } from 'playwright-core'

const URL = process.argv[2] || 'https://touchdigital.vercel.app/'

const browser = await chromium.launch({ channel: 'chrome', headless: true })

async function measure(label, setup) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.goto(URL + '?t=' + Date.now(), { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(2500)
  if (setup) await page.evaluate(setup)
  await page.waitForTimeout(500)

  await page.evaluate(() => {
    window.__frames = []
    let last = performance.now()
    ;(function tick(now){ window.__frames.push(now-last); last=now; requestAnimationFrame(tick) })(performance.now())
  })
  const startY = await page.evaluate(() => {
    const el = document.getElementById('services')
    return el ? el.getBoundingClientRect().top + window.scrollY - 100 : 0
  })
  await page.evaluate((y) => window.scrollTo(0, y), startY)
  await page.waitForTimeout(400)
  await page.evaluate(() => { window.__frames.length = 0 })
  const maxY = await page.evaluate(() => document.body.scrollHeight - window.innerHeight)
  let y = startY
  while (y < maxY) { y += 18; await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(16) }
  await page.waitForTimeout(200)
  const s = await page.evaluate(() => {
    const f = window.__frames.filter(x => x > 0 && x < 2000)
    return { frames: f.length, dropped: f.filter(x => x > 32).length, avg: +(f.reduce((a,b)=>a+b,0)/f.length).toFixed(1) }
  })
  console.log(`${label.padEnd(34)} dropped ${s.dropped}/${s.frames} (${(100*s.dropped/s.frames).toFixed(0)}%)  avg ${s.avg}ms`)
  await context.close()
}

console.log('Isolating scroll-jank cause (Services->Offer, 4x CPU):\n')
await measure('A. baseline', null)
await measure('B. no grain overlay', () => {
  const s = document.createElement('style'); s.textContent = 'body::before{display:none!important}'; document.head.appendChild(s)
})
await measure('C. no CSS animations', () => {
  const s = document.createElement('style'); s.textContent = '*{animation:none!important}'; document.head.appendChild(s)
})
await measure('D. no WebGL canvas', () => {
  document.querySelectorAll('canvas').forEach(c => c.style.display = 'none')
})
await measure('E. no box-shadow', () => {
  const s = document.createElement('style'); s.textContent = '*{box-shadow:none!important}'; document.head.appendChild(s)
})
await measure('F. no backdrop/filter blur', () => {
  const s = document.createElement('style'); s.textContent = '*{filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}'; document.head.appendChild(s)
})
await measure('G. no mask-image', () => {
  const s = document.createElement('style'); s.textContent = '*{-webkit-mask-image:none!important;mask-image:none!important}'; document.head.appendChild(s)
})

await browser.close()
