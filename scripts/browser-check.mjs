import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const base = process.env.TEST_URL || "http://127.0.0.1:3000";
const fixture = new URL("../app/qa-fixture/", import.meta.url);
const out = new URL("../artifacts/", import.meta.url);
const fixtureSource = `import { Portfolio } from '@/components/Portfolio'
import { ContactForm } from '@/components/ContactForm'
import type { Project } from '@/lib/site'
const projects: Project[] = Array.from({ length: 8 }, (_, i) => ({ id: String(i), title: 'בדיקת סרטון ' + i, client: 'לקוח בדיקה', category: i % 2 ? 'סושיאל' : 'תדמית', poster: '/atmosphere/desert.jpg', aspect: i % 2 ? 'portrait' : 'landscape', source: i === 0 ? { kind: 'file', url: '/qa-missing-video.mp4' } : i === 2 ? {kind: 'vimeo', id: '12345'} : {kind: 'youtube', id: 'test-video'}, featured: i === 0 }))
export default function Fixture(){return <main><Portfolio projects={projects} preview={false}/><ContactForm mailReady={true} whatsapp={null} preview={false}/></main>}`;
await mkdir(out, { recursive: true });
await mkdir(fixture, { recursive: true });
await writeFile(new URL("page.tsx", fixture), fixtureSource);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width > 800 ? 1000 : 844 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `horizontal overflow at ${width}`,
    );
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.images]
        .filter((i) => {
          const r = i.getBoundingClientRect();
          return (
            r.bottom > 0 &&
            r.top < innerHeight &&
            r.right > 0 &&
            r.left < innerWidth
          );
        })
        .every((i) => i.complete && i.naturalWidth > 0),
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    if (width === 390 || width === 1440) {
      const name = width === 390 ? "mobile" : "desktop";
      await page.screenshot({
        path: fileURLToPath(new URL(`${name}-hero.png`, out)),
        animations: "disabled",
      });
      await page.screenshot({
        path: fileURLToPath(new URL(`${name}.png`, out)),
        fullPage: true,
        animations: "disabled",
      });
    }
    if (width === 390) {
      await page.getByRole("button", { name: "פתיחת תפריט" }).click();
      assert.equal(
        await page.locator("#mobile-nav").evaluate((e) => e.open),
        true,
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "פתיחת תפריט" })
          .evaluate((e) => e === document.activeElement),
        true,
      );
      await page.getByRole("button", { name: "פתיחת תפריט" }).click();
      await page
        .locator("#mobile-nav")
        .getByRole("link", { name: "קצת עליי" })
        .click();
      assert.equal(
        await page.locator("#mobile-nav").evaluate((e) => e.open),
        false,
      );
      assert.match(page.url(), /#about$/);
    }
    assert.equal(await page.locator("button[type=submit]").isDisabled(), true);
    console.log(`PASS ${width}px: content, images, no horizontal overflow`);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() => document.querySelector('.hero-video')?.currentTime > 0);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: /נדל״ן/ }).click();
  assert.equal(await page.getByRole('button', { name: /נדל״ן/ }).getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: 'השהיית הנפשות', exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'paused');
  await page.locator('.chapter-buttons button').first().click();
  assert.match(await page.locator('.chapter-copy h3').innerText(), /מתחילים ברעיון/);
  assert.equal(await page.locator('.creative-sticky').evaluate(e => getComputedStyle(e).position), 'relative');
  console.log('PASS studio: hero video, world selection, manual chapters and motion pause');
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".hero h1")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  console.log("PASS reduced motion");
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Test player</p>" }),
  );
  await page.route("https://player.vimeo.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Test player</p>" }),
  );
  await page.goto(`${base}/qa-fixture`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("button.project").count(), 6);
  await page.getByRole("button", { name: "לכל העבודות (8)" }).click();
  assert.equal(await page.locator("button.project").count(), 8);
  await page.getByRole("button", { name: "סושיאל", exact: true }).click();
  assert.equal(await page.locator("button.project").count(), 4);
  const opener = page.getByRole("button", {
    name: "לצפייה בסרטון בדיקת סרטון 1",
    exact: true,
  });
  await opener.click();
  await page.waitForFunction(
    () => document.querySelector(".video-dialog").open,
  );
  assert.match(
    await page.locator("iframe").getAttribute("src"),
    /youtube-nocookie/,
  );
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("iframe").count(), 0);
  assert.equal(
    await opener.evaluate((e) => e === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: "הכל", exact: true }).click();
  await page
    .getByRole("button", { name: "לצפייה בסרטון בדיקת סרטון 2", exact: true })
    .click();
  assert.match(
    await page.locator("iframe").getAttribute("src"),
    /player.vimeo.com/,
  );
  await page.getByRole("button", { name: "סגירת הסרטון" }).click();
  await page
    .getByRole("button", { name: "לצפייה בסרטון בדיקת סרטון 0", exact: true })
    .click();
  await page.locator("[role=alert]:not(#__next-route-announcer__)").waitFor();
  await page.getByRole("button", { name: "סגירת הסרטון" }).click();
  assert.equal(await page.locator("video").count(), 0);
  console.log(
    "PASS gallery: filtering, expansion, all three sources, focus return and playback cleanup",
  );
  const requests = [];
  await page.route("**/api/lead", async (route) => {
    requests.push(route.request());
    await route.fulfill({
      status: requests.length === 1 ? 502 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        requests.length === 1
          ? { ok: false, message: "בדיקת שגיאה" }
          : { ok: true },
      ),
    });
  });
  await page.locator("#fullName").fill("בדיקת טופס");
  await page.locator("#phone").fill("0501234567");
  await page.locator("button[type=submit]").click();
  await page.locator("[role=alert]:not(#__next-route-announcer__)").waitFor();
  assert.match(await page.locator(".form-error").innerText(), /בדיקת שגיאה/);
  assert.equal(await page.locator("#fullName").inputValue(), "בדיקת טופס");
  await page.locator("button[type=submit]").click();
  await page.getByRole("status").waitFor();
  assert.equal(requests.length, 2);
  assert.equal(
    requests[0].headers()["idempotency-key"],
    requests[1].headers()["idempotency-key"],
  );
  console.log(
    "PASS form: failure retains fields, retry reuses key, success acknowledged",
  );
  assert.deepEqual(errors, []);
  console.log("PASS no browser runtime errors");
} finally {
  await browser.close();
  await rm(new URL("page.tsx", fixture), { force: true });
  await rm(fixture, { recursive: false }).catch(() => {});
}

