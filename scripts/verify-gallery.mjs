import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const server = await createServer({ server: { port: 4307, strictPort: true } });
await server.listen();
const browser = await chromium.launch();
const results = [];
const base = 'http://localhost:4307';
const noOverflow = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const countText = dialog => dialog.locator('.gallery-page-controls p').innerText();
async function nativeSwipe(page, selector, direction = -1) {
  const stage = page.locator(selector), box = await stage.boundingBox();
  const session = await page.context().newCDPSession(page);
  const from = box.x + box.width * (direction < 0 ? .72 : .28);
  const to = box.x + box.width * (direction < 0 ? .28 : .72);
  const y = box.y + box.height * .5;
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from, y }] });
  for (const fraction of [.3, .65, 1]) await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove', touchPoints: [{ x: from + (to - from) * fraction, y }],
  });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
  await page.waitForTimeout(500);
}
async function accessible(page, selector) {
  const report = await new AxeBuilder({ page }).include(selector).analyze();
  const serious = report.violations.filter(item => ['critical', 'serious'].includes(item.impact));
  assert.deepEqual(serious.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), [], `Accessibility: ${selector}`);
}
try {
  await fs.mkdir('artifacts', { recursive: true });
  for (const width of [360, 390, 414, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, hasTouch: width < 768, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage(), errors = [], imageResponses = new Map();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.request().resourceType() === 'image' && (response.url().includes('/src/assets/gallery/') || response.url().includes('/src/assets/campus-walkthrough.webp'))) imageResponses.set(response.url(), response); });
    await page.goto(`${base}/school-life#gallery`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    const gallery = page.locator('#gallery');
    const books = gallery.locator('.gallery-book');
    assert.equal(await books.count(), 4);
    assert.ok(await noOverflow(page), 'No horizontal page scroll on shelf');
    if (width < 768) assert.equal(await gallery.locator('.gallery-shelf').evaluate(e => getComputedStyle(e).scrollSnapType), 'x mandatory');
    else assert.equal(await gallery.locator('.gallery-shelf').evaluate(e => getComputedStyle(e).gridTemplateColumns.split(' ').length), 4);
    if (width === 390 || width === 1440) {
      await gallery.screenshot({ path: `artifacts/albums-shelf-${width}.png` });
      await accessible(page, '#gallery');
    }
    let initialBytes = 0;
    for (const response of imageResponses.values()) initialBytes += (await response.body()).length;
    assert.ok(initialBytes < 500 * 1024);
    assert.ok(![...imageResponses.keys()].some(url => /-full[.-]/.test(url)), 'Shelf never loads full photos');
    assert.equal(await gallery.getByRole('button', { name: 'Search albums and photos', exact: true }).count(), 0);
    assert.equal(await gallery.locator('.gallery-book-play').count(), 0);
    const opener = gallery.getByRole('button', { name: /^Open Classrooms album/ });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Classrooms', exact: true });
    await dialog.waitFor({ state: 'visible' }); await page.waitForTimeout(700);
    assert.equal(await countText(dialog), 'Page 1 of 12');
    await page.waitForFunction(() => { const e=document.querySelector('.gallery-mode-book'); return e && e.scrollHeight <= e.clientHeight + 1; }, null, { timeout: 3000 });
    assert.ok(await dialog.locator('.gallery-mode-book').evaluate(e => e.scrollHeight <= e.clientHeight + 1), 'Book fits without vertical scrolling');
    await dialog.locator('.paper-engine').waitFor();
    assert.equal(await dialog.locator('.paper-engine .paper-leaf[aria-hidden="false"]').count(), width < 768 ? 1 : 2, 'Only current pages are exposed to screen readers');
    assert.equal(await dialog.getByRole('button', { name: 'Back to albums' }).evaluate(e => e === document.activeElement), true);
    if (width === 390 || width === 1440) {
      await dialog.screenshot({ path: `artifacts/albums-book-${width}.png` });
      await accessible(page, '.gallery-viewer');
    }
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1000);
    assert.equal(await countText(dialog), width < 768 ? 'Page 2 of 12' : 'Page 3 of 12');
    await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(1000); assert.equal(await countText(dialog), 'Page 1 of 12');
    for (const name of ['Search this album','Share album','Start slideshow','Enter fullscreen']) assert.equal(await dialog.getByRole('button',{name,exact:true}).count(),0);
    await dialog.getByRole('button', { name: 'Show grid view' }).click();
    assert.equal(await dialog.locator('.gallery-grid-photo').count(), 12);
    assert.equal(await dialog.locator('.paper-engine').count(), 0);
    if (width === 390 || width === 1440) await dialog.screenshot({ path: `artifacts/albums-grid-${width}.png` });
    const thumbnail = dialog.locator('.gallery-grid-photo').nth(2);
    await thumbnail.click();
    const lightbox = page.getByRole('dialog', { name: 'Album photo', exact: true });
    await lightbox.waitFor({ state: 'visible' });
    const counter = () => lightbox.locator('.gallery-lightbox-toolbar p').innerText();
    assert.equal(await counter(), '3 / 12');
    await page.keyboard.press('ArrowRight'); assert.equal(await counter(), '4 / 12');
    await lightbox.getByRole('button', { name: 'Previous photo' }).click(); assert.equal(await counter(), '3 / 12');
    if (width === 390) { await nativeSwipe(page, '.gallery-lightbox-stage'); assert.equal(await counter(), '4 / 12'); }
    const closePhoto = lightbox.getByRole('button', { name: 'Close photo' });
    await closePhoto.focus(); await page.keyboard.press('Shift+Tab');
    assert.equal(await lightbox.getByRole('button', { name: 'Next photo' }).evaluate(e => e === document.activeElement), true);
    await page.keyboard.press('Tab'); assert.equal(await closePhoto.evaluate(e => e === document.activeElement), true);
    if (width === 390) await accessible(page, '.gallery-lightbox');
    await page.keyboard.press('Escape'); await lightbox.waitFor({ state: 'hidden' });
    assert.ok(await dialog.isVisible()); assert.equal(await thumbnail.evaluate(e => e === document.activeElement), true);
    await thumbnail.click(); await lightbox.getByRole('button', { name: 'Close photo' }).click();
    await lightbox.waitFor({ state: 'hidden' });
    await dialog.getByRole('button', { name: 'Show book view' }).click();
    await dialog.getByRole('button', { name: 'Back to albums' }).focus();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await dialog.getByRole('button', { name: 'Next page', exact: true }).evaluate(e => e === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await dialog.getByRole('button', { name: 'Back to albums' }).evaluate(e => e === document.activeElement), true);
    await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
    assert.equal(await opener.evaluate(e => e === document.activeElement), true);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    assert.ok(await noOverflow(page)); assert.deepEqual(errors, []);
    results.push({ width, shelfKiB: Math.round(initialBytes / 1024), checks: 'shelf, search, book, keyboard, grid, lightbox, focus, share, close, direct play passed' });
    console.log(width, 'album QA passed');
    await context.close();
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(`${base}/school-life?album=campus&page=2#gallery`);
  const album = reduced.getByRole('dialog', { name: 'Campus', exact: true });
  await album.waitFor({ state: 'visible' });
  assert.equal(await countText(album), 'Page 3 of 12', 'Shared link opens the chosen page');
  assert.equal(await album.locator('.gallery-opening-cover').evaluate(e => getComputedStyle(e).display), 'none');
  assert.ok(await album.locator('.gallery-book-flow').evaluate(e => parseFloat(getComputedStyle(e).animationDuration) <= .14));
  await reduced.keyboard.press('Escape'); await album.waitFor({ state: 'hidden' });
  await reduced.goto(`${base}/`);
  assert.equal(await reduced.getByRole('region', { name: 'Gallery preview' }).count(), 0, 'Preserve the earlier Home preview removal');
  await reduced.close();
  await fs.writeFile('artifacts/album-qa.json', JSON.stringify(results, null, 2));
  console.log('Shared links, reduced motion and unchanged Home passed');
} finally { await browser.close(); await server.close(); }
process.exit(0);
