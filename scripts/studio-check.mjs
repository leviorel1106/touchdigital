import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const base = process.env.TEST_URL || "http://127.0.0.1:3001";
await mkdir("artifacts/studio", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1440, 390, 768, 360]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector(".hero-video")?.currentTime > 0);
    assert.equal(await page.locator("h1").count(), 1);
    await page.screenshot({ path: `artifacts/studio/hero-${width}.png` });
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /נדל״ן/ }).click();
    assert.equal(await page.getByRole("button", { name: /נדל״ן/ }).getAttribute("aria-pressed"), "true");
    await page.getByRole("button", { name: "לצפייה בסצנה" }).click();
    await page.waitForFunction(() => document.querySelector(".cinema-player")?.currentTime >= 24);
    assert.equal(await page.locator(".hero-video").evaluate(v => v.paused), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
    assert.equal(await page.getByRole("button", { name: "לצפייה בסצנה" }).evaluate(e => e === document.activeElement), true);
    if (width === 1440 || width === 390) {
      for (const id of ["work", "creative", "services", "about", "contact"]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        if (id === "creative" && width === 1440) {
          await page.waitForSelector(".creative-space.has-canvas", { timeout: 30000 });
          await page.getByRole("button", { name: /03 התנועה/ }).click();
        }
        await page.waitForTimeout(900);
        await page.screenshot({ path: `artifacts/studio/${id}-${width}.png` });
      }
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
    console.log(`PASS ${width}: playback, scene selection, dialog, keyboard, overflow`);
  }
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".hero-video").evaluate(v => v.paused), true);
  await page.locator("#creative").scrollIntoViewIfNeeded();
  assert.equal(await page.locator(".creative-space canvas").count(), 0);
  await page.getByRole("button", { name: /02 העולם/ }).click();
  assert.equal(await page.getByRole("button", { name: /02 העולם/ }).getAttribute("aria-pressed"), "true");
  assert.deepEqual(errors, []);
  console.log("PASS reduced motion, manual chapters, no browser exceptions");
} finally { await browser.close(); }
