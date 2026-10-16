import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4215';
const browser = await chromium.launch();

try {
  for (const width of [1440, 1024, 768, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.featured-branch').evaluate(image => image.decode());

    const result = await page.evaluate(() => {
      const box = element => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      };
      const boards = [...document.querySelectorAll('.featured-signs .featured-sign')].map(element => ({
        id: element.dataset.navId,
        active: element.classList.contains('featured-active'),
        ...box(element),
      }));
      const ropes = [...document.querySelectorAll('[data-rope]')].map(element => ({
        board: element.dataset.board,
        x: +element.dataset.x,
        under: +element.dataset.under,
        hole: +element.dataset.hole,
        bottom: +element.dataset.bottom,
      }));
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        mobile: getComputedStyle(document.querySelector('.featured-menu')).display !== 'none',
        image: document.querySelector('.featured-branch').currentSrc,
        boards,
        ropes,
        nav: box(document.querySelector('.featured-inner')),
      };
    });

    assert.equal(result.overflow, false, `${width}: no horizontal scrolling`);
    assert.equal(result.mobile, width < 768, `${width}: correct navigation mode`);
    assert.equal(result.image.includes('compact'), width < 768, `${width}: correct branch artwork`);
    assert.equal(result.ropes.length, width < 768 ? 2 : 14, `${width}: visible attachments`);
    assert.deepEqual(errors, [], `${width}: no runtime errors`);

    if (result.mobile) {
      await page.locator('.featured-menu').click();
      assert.equal(await page.locator('.featured-drawer .featured-sign').count(), 6);
      await page.locator('.featured-drawer [data-nav-id="contact"]').click();
      assert.equal(new URL(page.url()).pathname, '/contact');
      assert.equal(await page.locator('.featured-menu').getAttribute('aria-expanded'), 'false');
    } else {
      assert.equal(result.boards.length, 6);
      const nonActive = result.boards.filter(board => !board.active);
      for (const board of result.boards) {
        assert.ok(Math.abs(board.y - nonActive[0].y - (board.active ? 4 * (result.nav.width / 1224) : 0)) < 1, `${width}: board top ${board.id}`);
        assert.ok(Math.abs(board.width - result.boards[0].width) < .1);
        assert.ok(Math.abs(board.height - result.boards[0].height) < .1);
        const pair = result.ropes.filter(rope => rope.board === board.id);
        assert.equal(pair.length, 2);
        assert.ok(Math.abs((pair[0].x + pair[1].x) / 2 - (board.x - result.nav.x + board.width / 2)) < .5);
        assert.ok(pair.every(rope => rope.hole > rope.under && rope.hole < board.y - result.nav.y + board.height * .2));
      }
      await page.locator('.featured-signs [data-nav-id="academics"]').click();
      assert.equal(new URL(page.url()).pathname, '/academics');
      await page.waitForFunction(() => document.querySelector('.featured-signs [data-nav-id="academics"]')?.getAttribute('aria-current') === 'page');
      assert.equal(await page.locator('.featured-signs [data-nav-id="academics"]').getAttribute('aria-current'), 'page');
    }
    await page.close();
  }
  console.log('PASS: header geometry, ropes, routes, drawer, artwork, and overflow at 1440/1024/768/375px');
} finally {
  await browser.close();
}
