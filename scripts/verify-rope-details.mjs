import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.argv[2] || 'http://127.0.0.1:4215';
const output = 'artifacts/rope-attachments';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 2, reducedMotion: 'reduce' });
const page = await context.newPage();
const report = [];
try {
  for (const width of [320, 390, 430, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.featured-branch').evaluate(image => image.decode());
    const attachments = await page.locator('[data-rope]').evaluateAll(elements => elements.map(element => {
      const nav = element.closest('nav').getBoundingClientRect();
      return { x: Number(element.dataset.x) + nav.x, y: Number(element.dataset.top) + nav.y,
        bottom: Number(element.dataset.bottom) + nav.y, board: element.dataset.board,
        dropTop: Number(element.dataset.dropTop), dropBottom: Number(element.dataset.dropBottom),
        thickness: Number(element.dataset.thickness) };
    }));
    const layers = await page.evaluate(() => ['.featured-ropes-back','.featured-canopy','.featured-ropes:not(.featured-ropes-back):not(.featured-ropes-fixings)','.featured-home','.featured-ropes-fixings'].map(selector => {
      const style = getComputedStyle(document.querySelector(selector));
      return { selector, z: Number(style.zIndex), pointerEvents: style.pointerEvents };
    }));
    assert.deepEqual(layers.map(layer => layer.z), [0, 1, 2, 5, 6]);
    assert.ok(layers.every(layer => layer.pointerEvents === 'none'));
    const tiles = [];
    for (const [i, rope] of attachments.entries()) {
      assert.ok(rope.dropBottom - rope.dropTop >= rope.thickness * .49, `${width}: ${rope.board} knots remain separate`);
      const board = rope.board === 'logo' ? page.locator('.featured-logo') : page.locator(`.featured-signs [data-nav-id="${rope.board}"]`);
      const bounds = await board.boundingBox();
      assert.ok(Math.abs(rope.bottom - bounds.y) < .5, `${width}: eyelet meets board frame`);
      assert.ok(rope.x > bounds.x && rope.x < bounds.x + bounds.width, `${width}: attachment remains on board`);
      const clip = { x: Math.max(0, rope.x-24), y: Math.max(0, rope.y-12), width: 48, height: rope.bottom-rope.y+38 };
      const png = await page.screenshot({ path: `${output}/${width}-${i}-${rope.board}.png`, clip });
      tiles.push(`<figure><figcaption>${i+1}: ${rope.board}</figcaption><img src="data:image/png;base64,${png.toString('base64')}"/></figure>`);
    }
    const sheet = await context.newPage();
    await sheet.setViewportSize({ width: 1120, height: 760 });
    await sheet.setContent(`<style>body{background:#f8f3e8;font:14px system-ui;margin:20px}main{display:grid;grid-template-columns:repeat(7,1fr);gap:12px}figure{margin:0;padding:10px;border:1px solid #b99970}img{width:96px;height:auto}figcaption{margin-bottom:10px}</style><h1>${width}px — all rope attachments (2× close-ups)</h1><main>${tiles.join('')}</main>`);
    await sheet.screenshot({ path: `${output}/all-ropes-${width}.png`, fullPage: true });
    await sheet.close();
    report.push({ width, count: attachments.length, layers });
  }
  // Switching source images without reloading must also re-measure attachments.
  for (const width of [1100, 1101, 390, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.waitForFunction(expected => document.querySelectorAll('[data-rope]').length === expected, width <= 1100 ? 2 : 14);
    await page.locator('.featured-branch').evaluate(image => image.decode());
    await page.waitForFunction(compact => document.querySelector('.featured-branch').currentSrc.includes('compact') === compact, width <= 1100);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  await writeFile(`${output}/report.json`, JSON.stringify({ base, report, responsiveSourceSwitch: 'passed' }, null, 2));
  console.log('PASS: rear/front/board layers, nonoverlapping knots, exact board attachments, pointer-event safety, responsive source switching; every rope captured at six widths.');
} finally { await browser.close(); }
