import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto((process.argv[2] || 'http://127.0.0.1:5173') + '/');
await page.locator('.compact-logo-board').waitFor();
for (const width of [1440, 1024, 768, 360]) {
  await page.setViewportSize({ width, height: 900 }); await page.goto((process.argv[2] || 'http://127.0.0.1:5173') + '/');
  const nav = page.locator('.compact-nav');
  const height = await nav.evaluate(el => Math.round(el.getBoundingClientRect().height));
  assert.equal(height, width < 900 ? 90 : 150, `initial navbar height at ${width}`);
  if (width < 900) { await page.locator('.compact-menu-button').click(); assert.equal(await page.locator('.compact-drawer .compact-board').count(), 7); }
  await page.screenshot({ path: `artifacts/compact-${width}.png` });
  console.log('PASS compact layout', width, height);
}
await page.setViewportSize({ width: 1440, height: 900 }); await page.goto((process.argv[2] || 'http://127.0.0.1:5173') + '/about');
for (const id of ['about', 'academics', 'admissions', 'campus', 'events', 'contact', 'apply']) {
  await page.locator(`[data-nav-id="${id}"]`).first().click();
  assert.equal(new URL(page.url()).pathname, id === 'apply' ? '/admissions' : `/${id}`);
  console.log('PASS route', id);
}
await page.locator('.compact-home').click(); await page.waitForURL('**/'); assert.equal(new URL(page.url()).pathname, '/'); await page.locator('.compact-home.compact-active').waitFor();
assert.ok(await page.locator('.compact-home.compact-active').count());
await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(1000);
assert.equal(await page.locator('.compact-nav').evaluate(el => Math.round(el.getBoundingClientRect().height)), 64);
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1000);
assert.equal(await page.locator('.compact-nav').evaluate(el => Math.round(el.getBoundingClientRect().height)), 150);
const assetBytes = await page.evaluate(async () => {
  const items = await Promise.all(['/images/navigation/branch-compact.webp', '/images/navigation/treehouse-compact.webp', '/images/navigation/monkey-compact.webp'].map(async url => ({ url, size: (await (await fetch(url)).blob()).size })));
  return { items, total: items.reduce((sum, item) => sum + item.size, 0) };
});
assert.ok(assetBytes.total < 200000); assert.deepEqual(errors, []);
console.log('PASS logo home, scroll compact, assets', assetBytes);
await browser.close();
