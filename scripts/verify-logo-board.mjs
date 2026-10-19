import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.argv[2] || 'http://127.0.0.1:4215';
const output = 'artifacts/logo-board-test';
await mkdir(output, { recursive: true });

const browser = await chromium.launch();
const report = [];

try {
  for (const width of [1440, 1024, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 2,
    });
    const errors = [];
    const imageFailures = [];

    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('response', resp => {
      if (resp.request().resourceType() === 'image' && resp.status() >= 400) {
        imageFailures.push({ url: resp.url(), status: resp.status() });
      }
    });

    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.featured-branch').first().evaluate(img => img.decode());
    await page.locator('.featured-logo-image').evaluate(img => img.decode());

    const data = await page.evaluate(() => {
      const header = document.querySelector('.featured-nav').getBoundingClientRect();
      const nav = document.querySelector('.featured-inner').getBoundingClientRect();
      const logoEl = document.querySelector('.featured-logo');
      const logoRect = logoEl.getBoundingClientRect();
      const logoHome = document.querySelector('.featured-home').getBoundingClientRect();
      const branchEl = document.querySelector('.featured-canopy img');
      const branchRect = branchEl.getBoundingClientRect();

      const boards = [...document.querySelectorAll('.featured-signs .featured-sign')]
        .map(el => {
          const r = el.getBoundingClientRect();
          return { id: el.dataset.navId, x: r.x - nav.x, y: r.y - nav.y, width: r.width, height: r.height };
        });

      const ropes = [...document.querySelectorAll('[data-rope]')].map(el => ({ ...el.dataset }));

      const monkeyFeetBottom = logoRect.bottom;
      const spaceBelowMonkey = header.bottom - monkeyFeetBottom;

      return {
        header: { width: header.width, height: header.height },
        nav: { width: nav.width, height: nav.height },
        logo: {
          x: logoRect.x - nav.x,
          y: logoRect.y - nav.y,
          width: logoRect.width,
          height: logoRect.height,
          ratio: logoRect.width / nav.width,
        },
        spaceBelowMonkey,
        boardsCount: boards.length,
        ropesCount: ropes.length,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });

    console.log(`[Viewport ${width}px]:`, data);

    assert.equal(data.overflow, false, `${width}: no horizontal overflow`);
    assert.ok(data.spaceBelowMonkey >= 12, `${width}: space below monkey feet (${data.spaceBelowMonkey.toFixed(1)}px) >= 12px`);

    if (width >= 768) {
      assert.equal(data.boardsCount, 6, `${width}: 6 link boards`);
      assert.equal(data.ropesCount, 12, `${width}: 12 link ropes (2 per board)`);
      // Logo width should be ~18% of container
      assert.ok(Math.abs(data.logo.ratio - 0.18) < 0.02, `${width}: logo width ~18% of container (got ${(data.logo.ratio*100).toFixed(1)}%)`);
    }

    // Capture full header screenshot
    await page.locator('.featured-nav').screenshot({ path: `${output}/header-${width}.png` });

    // Capture zoom on logo
    await page.locator('.featured-home').screenshot({ path: `${output}/logo-${width}.png` });

    // Test logo link navigation
    await page.locator('.featured-logo').click({ force: true });
    assert.equal(new URL(page.url()).pathname, '/');

    // Test route navigation
    if (width >= 768) {
      await page.locator('.featured-signs [data-nav-id="academics"]').click({ force: true });
      await page.waitForURL('**/academics');
      assert.equal(new URL(page.url()).pathname, '/academics');

      await page.locator('.featured-signs [data-nav-id="contact"]').click({ force: true });
      await page.waitForURL('**/contact');
      assert.equal(new URL(page.url()).pathname, '/contact');

      // Click logo to go home
      await page.locator('.featured-logo').click({ force: true });
      await page.waitForURL(url => url.pathname === '/');
      assert.equal(new URL(page.url()).pathname, '/');
    } else {
      // Mobile drawer
      await page.locator('.featured-menu').click({ force: true });
      assert.equal(await page.locator('.featured-menu').getAttribute('aria-expanded'), 'true');
      await page.locator('.featured-drawer [data-nav-id="admissions"]').click({ force: true });
      await page.waitForURL('**/admissions');
      assert.equal(new URL(page.url()).pathname, '/admissions');

      // Click logo to go home
      await page.locator('.featured-logo').click({ force: true });
      await page.waitForURL(url => url.pathname === '/');
      assert.equal(new URL(page.url()).pathname, '/');
    }

    assert.deepEqual(errors, [], `${width}: zero console/runtime errors`);
    assert.deepEqual(imageFailures, [], `${width}: zero broken images`);

    report.push({ width, data, errors, imageFailures });
    await page.close();
  }

  // 400% zoom crop on hands & bar at 1440px
  const zoomPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 });
  await zoomPage.goto(base, { waitUntil: 'networkidle' });
  await zoomPage.locator('.featured-logo-image').evaluate(img => img.decode());
  const logoEl = zoomPage.locator('.featured-logo');
  const logoBox = await logoEl.boundingBox();
  // Hands are around 45% - 58% of logo height
  await zoomPage.screenshot({
    path: `${output}/hands-zoom-400.png`,
    clip: {
      x: logoBox.x,
      y: logoBox.y + logoBox.height * 0.40,
      width: logoBox.width,
      height: logoBox.height * 0.22,
    },
  });
  await zoomPage.close();

  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
} finally {
  await browser.close();
}
