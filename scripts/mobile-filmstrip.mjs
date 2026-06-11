// Mobile loading filmstrip: emulates a mid-range phone on slow 4G,
// captures screenshots at intervals to see exactly what the user sees.
import { chromium } from 'playwright-core'
import fs from 'node:fs'

const OUT = 'scripts/filmstrip'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
})
const page = await context.newPage()

// Slow 4G network + 4x CPU throttle via CDP
const cdp = await context.newCDPSession(page)
await cdp.send('Network.enable')
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
})
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })

// Collect console errors — hydration failures show here
const errors = []
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().slice(0, 300)) })
page.on('pageerror', err => errors.push('PAGEERROR: ' + String(err).slice(0, 300)))

const t0 = Date.now()
const nav = page.goto('https://touchdigital.vercel.app/?fresh=' + Date.now(), { waitUntil: 'commit', timeout: 60000 })

// Filmstrip: screenshot every interval, scrolled to just below the hero
const times = [1500, 3000, 5000, 8000, 12000, 16000]
for (const t of times) {
  const wait = t - (Date.now() - t0)
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  try {
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2)).catch(() => {})
    await page.screenshot({ path: `${OUT}/below-hero-${t}ms.png` })
  } catch (e) { console.log('shot failed at', t, String(e).slice(0, 100)) }
}
await nav.catch(() => {})

// Final: full-page after settle
await new Promise(r => setTimeout(r, 2000))
await page.screenshot({ path: `${OUT}/final-top.png` })
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.5)).catch(() => {})
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: `${OUT}/final-deep.png` })

console.log('CONSOLE ERRORS (' + errors.length + '):')
errors.slice(0, 10).forEach(e => console.log(' -', e))
await browser.close()
console.log('DONE')
