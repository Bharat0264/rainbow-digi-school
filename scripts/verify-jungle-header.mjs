import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4215';
const output = 'artifacts/jungle-header';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = [];
try {
  for (const width of [1440, 1024, 768, 375, 320, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 950 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.request().resourceType() === 'image' && response.status() >= 400) errors.push(`Image ${response.status()}: ${response.url()}`);
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.featured-branch').evaluate(image => image.decode());
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const nav = document.querySelector('.featured-inner').getBoundingClientRect();
      const bounds = element => {
        const r = element.getBoundingClientRect();
        return { x: r.x - nav.x, y: r.y - nav.y, width: r.width, height: r.height };
      };
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        nav: { width: nav.width, height: nav.height },
        boards: [...document.querySelectorAll('.featured-signs .featured-sign, .featured-logo')]
          .filter(element => element.getClientRects().length)
          .map(element => ({ id: element.dataset.navId || 'logo', ...bounds(element) })),
        ropes: [...document.querySelectorAll('[data-rope]')].map(element => ({ ...element.dataset })),
        monkey: bounds(document.querySelector('.featured-monkey')),
      };
    });
    assert.equal(geometry.overflow, false, `${width}: no horizontal overflow`);
    assert.equal(geometry.boards.length, width < 768 ? 1 : 7);
    assert.equal(geometry.ropes.length, geometry.boards.length * 2);
    assert.ok(geometry.monkey.y + geometry.monkey.height <= geometry.nav.height + 1, `${width}: full monkey fits in header`);
    for (const board of geometry.boards) {
      const pair = geometry.ropes.filter(rope => rope.board === board.id);
      assert.equal(pair.length, 2, `${width}: ${board.id} has two supports`);
      assert.equal(pair[0].thickness, pair[1].thickness, `${width}: matching rope diameter`);
      assert.ok(board.x >= 0 && board.x + board.width <= geometry.nav.width + 1, `${width}: board stays in scene`);
      assert.ok(Math.abs((+pair[0].x + +pair[1].x) / 2 - (board.x + board.width / 2)) < .5, `${width}: symmetric supports`);
      for (const rope of pair) {
        assert.ok(Math.abs(+rope.bottom - board.y) < .5, `${width}: ${board.id} rope reaches actual board top`);
        assert.ok(+rope.hole >= +rope.dropTop && +rope.dropTop > +rope.under, `${width}: ${board.id} connected wrap and drop`);
        assert.ok(+rope.hole > board.y && +rope.hole < board.y + board.height * .15, `${width}: fixing is above label`);
      }
    }
    await page.locator('.featured-nav').screenshot({ path: `${output}/header-${width}.png` });
    const routes = [['home', '/'], ['academics', '/academics'], ['admissions', '/admissions'], ['campus', '/campus'], ['school-life', '/school-life'], ['contact', '/contact']];
    for (const [id, path] of routes) {
      if (width < 768) await page.locator('.featured-menu').click();
      await page.locator(`${width < 768 ? '.featured-drawer' : '.featured-signs'} [data-nav-id="${id}"]`).click();
      assert.equal(new URL(page.url()).pathname, path);
      if (width >= 768) await page.waitForFunction(id => {
        const board = document.querySelector(`.featured-signs [data-nav-id="${id}"]`);
        const nav = document.querySelector('.featured-inner').getBoundingClientRect();
        const ropes = [...document.querySelectorAll(`[data-rope][data-board="${id}"]`)];
        return ropes.length === 2 && ropes.every(rope => Math.abs(+rope.dataset.bottom - (board.getBoundingClientRect().y - nav.y)) < .5);
      }, id, { timeout: 5000 });
    }
    await page.locator('.featured-logo').click();
    assert.equal(new URL(page.url()).pathname, '/');
    assert.equal(await page.locator('.featured-logo title').count(), 0);
    if (width < 768) {
      await page.locator('.featured-menu').focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.featured-menu').getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('.featured-menu').evaluate(element => document.activeElement === element), true);
    }
    assert.deepEqual(errors, []);
    report.push({ width, geometry, links: 7, errors });
    await page.close();
  }
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log('PASS: seven links, symmetric connected ropes after route changes, full monkey, keyboard menu, no overflow or runtime/image errors at 1440/1024/768/375/320/1920px.');
} finally { await browser.close(); }
