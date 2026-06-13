// Measures scroll smoothness on mobile emulation. Injects a rAF frame-time
// monitor, then programmatically scrolls from the Services section down to
// Offer at a steady pace and counts dropped frames (>32ms gaps = jank).
// Pass a URL as argv[2]; defaults to the live site.
import { chromium } from 'playwright-core'

const URL = process.argv[2] || 'https://touchdigital.vercel.app/?jank=' + Date.now()

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
})
const page = await context.newPage()
const cdp = await context.newCDPSession(page)
await cdp.send('Network.enable')
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })

await page.goto(URL, { waitUntil: 'load', timeout: 60000 })
await page.waitForTimeout(2500) // let lazy stuff settle

// Install a frame monitor on the page
await page.evaluate(() => {
  window.__frames = []
  let last = performance.now()
  function tick(now) {
    window.__frames.push(now - last)
    last = now
    window.__raf = requestAnimationFrame(tick)
  }
  window.__raf = requestAnimationFrame(tick)
})

// Find the Services section top, scroll there, then crawl down to the bottom
const startY = await page.evaluate(() => {
  const el = document.getElementById('services')
  return el ? el.getBoundingClientRect().top + window.scrollY - 100 : window.scrollY
})
await page.evaluate((y) => window.scrollTo(0, y), startY)
await page.waitForTimeout(500)

// Reset frame log so we only measure the Services->Offer crawl
await page.evaluate(() => { window.__frames.length = 0 })

const maxY = await page.evaluate(() => document.body.scrollHeight - window.innerHeight)
let y = startY
const step = 18 // px per tick — steady slow scroll
while (y < maxY) {
  y += step
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(16)
}
await page.waitForTimeout(300)

const stats = await page.evaluate(() => {
  const f = window.__frames.filter(x => x > 0 && x < 2000)
  const over32 = f.filter(x => x > 32).length
  const over50 = f.filter(x => x > 50).length
  const avg = f.reduce((a, b) => a + b, 0) / f.length
  const max = Math.max(...f)
  return { frames: f.length, avgMs: +avg.toFixed(1), maxMs: +max.toFixed(0), dropped32: over32, dropped50: over50 }
})

console.log('URL:', URL.split('?')[0])
console.log('Services->Offer scroll —')
console.log('  total frames:', stats.frames)
console.log('  avg frame:', stats.avgMs + 'ms')
console.log('  worst frame:', stats.maxMs + 'ms')
console.log('  dropped (>32ms):', stats.dropped32, '(' + (100 * stats.dropped32 / stats.frames).toFixed(1) + '%)')
console.log('  dropped (>50ms):', stats.dropped50)

await browser.close()
