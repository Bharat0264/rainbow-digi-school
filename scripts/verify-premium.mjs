import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const base = process.argv[2] || "http://127.0.0.1:4211";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const paths = ["/", "/academics", "/campus-life", "/contact", "/admissions", "/privacy-policy"];
for (const width of [390, 1440, 2560]) {
  await page.setViewportSize({ width, height: 900 });
  for (const path of paths) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200, `${width} ${path}`);
    const snapshot = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter((image) => !image.naturalWidth).map((image) => image.src), h1: document.querySelectorAll("h1").length }));
    assert.equal(snapshot.overflow, false, `${width} ${path} overflow`);
    assert.deepEqual(snapshot.broken, [], `${width} ${path} broken images`);
    assert.equal(snapshot.h1, 1, `${width} ${path} H1`);
  }
}
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/");
assert.equal(await page.locator(".featured-sign").count(), 5, "five desktop boards");
assert.equal(await page.locator(".premium-form").count(), 0, "no form on home");
assert.equal(await page.locator("details").count(), 0, "no FAQ on home");
await page.goto(base + "/contact");
assert.equal(await page.locator(".premium-form").count(), 0, "no form on contact");
await page.goto(base + "/admissions");
assert.equal(await page.locator(".premium-form").count(), 1, "one admissions form");
assert.ok((await page.locator("details").count()) > 0, "admissions FAQ visible");
await page.setViewportSize({ width: 390, height: 900 });
await page.goto(base + "/");
await page.locator(".featured-menu").click();
assert.equal(await page.locator(".featured-menu").getAttribute("aria-expanded"), "true");
assert.equal(await page.locator(".featured-drawer .featured-sign").count(), 5, "five mobile boards");
await page.keyboard.press("Escape");
assert.equal(await page.locator(".featured-menu").getAttribute("aria-expanded"), "false");
await writeFile("artifacts/premium-qa.json", JSON.stringify({ paths, desktopBoards: 5, admissionsForm: 1, contactForm: 0, mobileMenu: "passed" }, null, 2));
console.log("PASS: new routes, desktop/mobile layout, five navigation boards, one admissions form and admissions-only FAQ.");
await browser.close();
