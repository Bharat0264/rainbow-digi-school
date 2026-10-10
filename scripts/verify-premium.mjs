import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const base = process.argv[2] || "http://127.0.0.1:4211";
const browser = await chromium.launch();
const reports = [],
  errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => errors.push(e.message));
const paths = [
  "/",
  "/about",
  "/academics",
  "/admissions",
  "/campus",
  "/events",
  "/contact",
  "/privacy-policy",
];
for (const width of [320, 360, 390, 430, 768, 1024, 1440, 2560]) {
  await page.setViewportSize({ width, height: 900 });
  for (const path of paths) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.evaluate(async () => {
      for (const image of document.images) {
        image.loading = "eager";
        await image.decode().catch(() => {});
      }
    });
    const data = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [...document.images]
        .filter((e) => !e.naturalWidth)
        .map((e) => e.getAttribute("src")),
      h1: document.querySelectorAll("h1").length,
      canonical: document.querySelector("link[rel=canonical]")?.href,
      title: document.title,
      links: [...document.querySelectorAll('a[href^="tel:"]')].map(
        (e) => e.href,
      ),
    }));
    assert.equal(data.overflow, false, width + " " + path + " overflow");
    assert.deepEqual(data.broken, [], width + " " + path + " broken images");
    assert.equal(data.h1, 1);
    assert.equal(
      data.canonical,
      "https://rainbow-digi-school.vercel.app" + path,
    );
    assert.ok(
      data.links.every((href) =>
        ["tel:+918008533078", "tel:+919121059881"].includes(href),
      ),
    );
    reports.push({ width, path, title: data.title, passed: true });
  }
}
await page.setViewportSize({ width: 390, height: 900 });
await page.goto(base);
await page.locator(".featured-menu").click();
assert.equal(
  await page.locator(".featured-menu").getAttribute("aria-expanded"),
  "true",
);
assert.equal(
  await page.evaluate(() =>
    document.activeElement?.getAttribute("data-nav-id"),
  ),
  "home",
);
await page.keyboard.press("Escape");
assert.equal(
  await page.locator(".featured-menu").getAttribute("aria-expanded"),
  "false",
);
assert.ok(
  await page
    .locator(".featured-menu")
    .evaluate((e) => e === document.activeElement),
);
await page.locator(".featured-menu").click();
await page.locator('.featured-drawer [data-nav-id="academics"]').click();
assert.equal(new URL(page.url()).pathname, "/academics");
await page.goBack();
assert.equal(new URL(page.url()).pathname, "/");
await page.goForward();
assert.equal(new URL(page.url()).pathname, "/academics");
await page.goto(base + "/campus");
await page
  .getByRole("button", {
    name: "Enlarge photograph of Rainbow Digi School exterior",
  })
  .click();
assert.equal(await page.locator("dialog").evaluate((e) => e.open), true);
await page.keyboard.press("Escape");
assert.equal(await page.locator("dialog").evaluate((e) => e.open), false);
await page.goto(base + "/admissions");
let submissions = 0;
await page.route("**/api/enquiries", async (route) => {
  submissions++;
  await new Promise((resolve) => setTimeout(resolve, 250));
  await route.fulfill({
    status: 503,
    contentType: "application/json",
    body: JSON.stringify({
      error: "Test persistence unavailable; enquiry not saved.",
    }),
  });
});
await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
assert.equal(submissions, 0);
assert.ok(
  await page
    .locator("[name=parentName]")
    .evaluate((e) => e === document.activeElement),
);
await page.locator("[name=parentName]").fill("QA Parent");
await page.locator("[name=phone]").fill("9876543210");
await page.locator("[name=program]").selectOption("Nursery");
await page.locator("[name=consent]").check();
await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
assert.equal(
  await page.locator(".premium-form button[type=submit]").isDisabled(),
  true,
);
await page.locator(".form-notice.error").waitFor();
assert.equal(submissions, 1);
assert.ok(
  (await page.locator(".form-notice").textContent()).includes("not saved"),
);
await page.unroute("**/api/enquiries");
await page.route("**/api/enquiries", (route) =>
  route.fulfill({
    status: 201,
    contentType: "application/json",
    body: JSON.stringify({ enquiryNumber: "RDS-ENQ-2026-ABCDEF1234" }),
  }),
);
await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
await page.locator(".form-notice.success").waitFor();
assert.ok(
  (await page.locator(".form-notice").textContent()).includes(
    "RDS-ENQ-2026-ABCDEF1234",
  ),
);
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(base + "/");
assert.equal(
  await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  ),
  "auto",
);
await page.locator("details summary").first().click();
assert.ok(
  await page
    .locator("details")
    .first()
    .evaluate((e) => e.open),
);
await page.setViewportSize({ width: 1440, height: 900 });
await page.locator('[data-nav-id="contact"]').click();
assert.equal(
  await page.locator('[data-nav-id="contact"]').getAttribute("aria-current"),
  "page",
);
assert.deepEqual(errors, []);
const nojs = await browser.newPage({ javaScriptEnabled: false });
await nojs.goto(base + "/academics");
assert.ok((await nojs.locator("h1").textContent()).includes("Foundations"));
await writeFile(
  "artifacts/premium-qa.json",
  JSON.stringify(
    {
      routes: reports,
      errors,
      interactive: "passed",
      formTests: "mocked HTTP success/failure; no live enquiry sent",
      noJavascriptContent: "passed",
    },
    null,
    2,
  ),
);
console.log(
  "PASS: 64 route/viewport checks, images, metadata, contact links, keyboard menu, dialog, navigation history, mocked form validation/failure/success, reduced motion, static HTML.",
);
await browser.close();
