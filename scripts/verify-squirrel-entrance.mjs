import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4215';
const output = 'artifacts/squirrel-entrance';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const errors = [], reports = [];
try {
  for (const width of [360, 390, 430, 768, 1100, 1101, 1440, 2560]) {
    const page = await browser.newPage({ viewport: { width, height: 950 }, deviceScaleFactor: 2 });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.featured-branch').evaluate(i => i.decode());
    const clockTime = new Date('2026-10-11T12:00:00Z');
    await page.clock.install({ time: clockTime });
    await page.clock.pauseAt(clockTime);
    const squirrel = page.locator('.featured-squirrel');
    const read = () => squirrel.evaluate(c => ({ ...c.dataset,
      pixels: c.getContext('2d').getImageData(0, 0, 128, 128).data.filter((_,i) => i % 4 === 3).reduce((a,v) => a + (v > 0), 0) }));
    const initial = await read();
    assert.equal(initial.state, 'idle');
    assert.ok(+initial.x < +initial.doorX);
    const nav = await page.locator('.featured-inner').boundingBox();
    const clip = { x: Math.max(0, nav.x + +initial.doorX - 120), y: nav.y, width: Math.min(240, width), height: 210 };
    const frames = [];
    async function capture(time) {
      const png = await page.screenshot({ clip });
      frames.push({ time, png: png.toString('base64') });
    }
    await capture('rest');
    await page.getByRole('button', { name: 'Send the squirrel home' }).click();
    const samples = [];
    for (let i = 1; i <= 10; i++) {
      await page.clock.runFor(200);
      const sample = await read(); samples.push(sample);
      assert.equal(sample.direction, '1');
      assert.ok(+sample.x >= +(samples.at(-2)?.x ?? initial.x) - .01, 'Never travels left');
      await capture(`${i * 200}ms`);
      if (i === 2) {
        // Repeated clicks must not reset the clock.
        await page.getByRole('button', { name: 'Send the squirrel home' }).click();
      }
    }
    assert.ok(samples.some(s => s.state === 'enteringHouse' && s.pixels > 0), 'Visible intermediate entrance');
    assert.equal(samples.at(-1).state, 'inside');
    assert.equal(samples.at(-1).pixels, 0, 'No remaining squirrel pixels');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    // An already-hidden squirrel stays inside until a navigation action brings it out.
    if (width <= 1100) await page.locator('.featured-menu').click();
    await page.locator('[data-nav-id="home"]:visible').click();
    await page.clock.runFor(2100);
    assert.equal((await read()).state, 'standing');
    await page.getByRole('button', { name: 'Send the squirrel home' }).focus();
    await page.keyboard.press('Enter');
    await page.clock.runFor(200);
    assert.equal((await read()).state, 'approaching', 'Keyboard entry from current branch position');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.runFor(50);
    assert.equal((await read()).state, 'inside', 'Live reduced-motion preference');
    await page.getByRole('button', { name: 'Send the squirrel home' }).click();
    assert.equal((await read()).pixels, 0, 'Reduced-motion repeat');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    // Board destinations and deferred routes are tested in verify-squirrel-boards.mjs.
    reports.push({ width, initial, samples });
    const sheet = await browser.newPage({ viewport: { width: 1000, height: 950 } });
    await sheet.setContent(`<body style="margin:0;display:grid;grid-template-columns:repeat(4,240px);gap:8px;background:#fff;font:14px sans-serif">${frames.map(f => `<div>${width}px / ${f.time}<img style="width:240px;display:block" src="data:image/png;base64,${f.png}"></div>`).join('')}</body>`);
    await sheet.screenshot({ path: `${output}/${width}-sequence.png`, fullPage: true });
    await sheet.close(); await page.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/report.json`, JSON.stringify({ errors, reports }, null, 2));
  console.log('PASS: monkey-triggered birdhouse entrance across 8 widths; intermediate frames, portal completion, replay, keyboard, reduced motion and overflow.');
} finally { await browser.close(); }
