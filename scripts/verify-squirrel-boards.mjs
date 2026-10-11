import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4215';
const output = 'artifacts/squirrel-boards';
const links = [['home', '/'], ['academics', '/academics'], ['admissions', '/admissions'], ['campus', '/campus'], ['school-life', '/school-life'], ['contact', '/contact']];
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const reports = [], errors = [];
try {
  for (const width of [360, 390, 430, 768, 1100, 1101, 1440, 2560]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const page = await browser.newPage({ viewport: { width, height: 950 }, reducedMotion });
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(base + '/privacy-policy', { waitUntil: 'networkidle' });
      const now = new Date('2026-10-11T14:00:00Z');
      await page.clock.install({ time: now }); await page.clock.pauseAt(now);
      const read = () => page.locator('.featured-squirrel').evaluate(c => ({ ...c.dataset }));
      const destinations = [];
      for (const [id, path] of links) {
        if (width <= 1100) await page.locator('.featured-menu').click();
        const board = page.locator(`[data-nav-id="${id}"]:visible`);
        const before = page.url();
        await board.focus(); await page.keyboard.press('Enter');
        if (reducedMotion === 'no-preference') {
          assert.equal(page.url(), before, 'No immediate navigation');
          assert.equal((await read()).target, id);
          await page.clock.runFor(400);
          assert.equal(page.url(), before, 'No navigation in flight');
          // A second selection during flight must not overwrite the first.
          const other = id === 'contact' ? 'home' : 'contact';
          await page.locator(`[data-nav-id="${other}"]:visible`).dispatchEvent('click', { button: 0 });
          assert.equal((await read()).target, id);
          if (id === 'campus') {
            await page.setViewportSize({ width: width + 1, height: 950 });
            await page.evaluate(() => window.scrollBy(0, 30));
          }
          await page.clock.runFor(730);
          const arrival = await read();
          assert.equal(arrival.state, 'boardArrived');
          assert.equal(page.url(), before, 'Route waits for arrival');
          const expected = await board.evaluate(el => {
            const r = el.getBoundingClientRect(), nav = el.closest('nav').getBoundingClientRect();
            return { x: r.left - nav.left + r.width / 2, y: r.top - nav.top };
          });
          assert.ok(Math.abs(+arrival.x - expected.x) < .5, `${width}/${id}: exact board X`);
          assert.ok(Math.abs(+arrival.y - expected.y) < .5, `${width}/${id}: paws at board top`);
          destinations.push(expected);
          if ([360, 1440].includes(width)) await page.screenshot({ path: `${output}/${width}-${id}-arrival.png` });
          await page.clock.runFor(200);
        }
        await page.waitForURL(base + path);
        await page.clock.runFor(50);
        assert.equal((await read()).target, id, 'Completion does not jump to central destination');
        assert.equal((await read()).state, 'boardDone');
        assert.equal(await page.locator(`[data-nav-id="${id}"]`).first().getAttribute('aria-current'), 'page');
        if (width <= 1100) assert.equal(await page.locator('.featured-menu').getAttribute('aria-expanded'), 'false');
        reports.push({ width, reducedMotion, id, path, passed: true });
        await page.setViewportSize({ width, height: 950 });
      }
      if (reducedMotion === 'no-preference') assert.equal(new Set(destinations.map(p => `${p.x},${p.y}`)).size, 6, 'Six distinct board destinations');
      // Repeated activation, including already-current route.
      for (let repeat = 0; repeat < 2; repeat++) {
        if (width <= 1100) await page.locator('.featured-menu').click();
        await page.locator('[data-nav-id="contact"]:visible').click();
        await page.clock.runFor(1400);
        assert.equal((await read()).target, 'contact'); assert.equal((await read()).state, 'boardDone');
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.close();
    }
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/report.json`, JSON.stringify({ reports, errors }, null, 2));
  console.log('PASS: 96 individual board/route checks across 8 widths and both motion preferences; measured arrival, delayed routing, rapid/repeated clicks, keyboard, resize, scroll and overflow.');
} finally { await browser.close(); }
