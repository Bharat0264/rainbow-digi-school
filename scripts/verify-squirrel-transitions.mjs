import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4231';
const output = 'artifacts/squirrel-transitions';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const reports = [], errors = [];
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 950 }, deviceScaleFactor: 2 });
    page.on('pageerror', error => errors.push(error.message));
    const time = new Date('2026-10-15T06:00:00Z');
    await page.clock.install({ time });
    await page.clock.pauseAt(time);
    await page.goto(base, { waitUntil: 'networkidle' });
    const read = () => page.locator('.featured-squirrel').evaluate(canvas => ({ ...canvas.dataset,
      pixels: canvas.getContext('2d').getImageData(0, 0, 128, 128).data.filter((v, i) => i % 4 === 3 && v).length,
    }));
    async function click(id) {
      if (await page.locator('.featured-menu').isVisible()) await page.locator('.featured-menu').click();
      await page.locator(`[data-nav-id="${id}"]:visible`).click();
    }
    async function until(state) {
      for (let elapsed = 0; elapsed < 10000; elapsed += 50) {
        if ((await read()).state === state) return;
        await page.clock.runFor(50);
      }
      assert.fail(`Expected ${state}, got ${JSON.stringify(await read())}`);
    }
    for (const id of ['academics', 'contact']) {
      const frames = [], samples = [];
      const nav = await page.locator('.featured-inner').boundingBox();
      const initial = await read();
      const clip = { x: Math.max(0, nav.x + +initial.doorX - 100), y: Math.max(0, nav.y + +initial.doorY - 70), width: 220, height: 135 };
      async function capture(label) {
        frames.push({ label, png: (await page.screenshot({ clip })).toString('base64') });
      }
      await click(id);
      let previous = await read();
      for (let elapsed = 0; elapsed <= 1500; elapsed += 50) {
        const pose = await read();
        samples.push(pose);
        assert.ok(Math.hypot(+pose.x - +previous.x, +pose.y - +previous.y) < 15, 'Continuous exit and branch landing');
        if (pose.state === 'exitingHouse' && pose.pixels > 0) {
          const travel = +pose.x - +previous.x;
          assert.ok(Math.abs(travel) < .001 || Math.sign(travel) === +pose.direction, 'Head leads exit travel');
        }
        if (elapsed % 150 === 0) await capture(`exit ${elapsed}ms / ${pose.state}`);
        previous = pose;
        await page.clock.runFor(50);
      }
      await until('standing');
      await page.locator('.featured-monkey').click();
      await until('enteringHouse');
      previous = await read();
      for (let elapsed = 0; elapsed <= 1300; elapsed += 50) {
        const pose = await read();
        samples.push(pose);
        assert.ok(Math.hypot(+pose.x - +previous.x, +pose.y - +previous.y) < 15, 'Continuous entrance');
        if (pose.state === 'enteringHouse' && pose.pixels > 0) {
          const travel = +pose.x - +previous.x;
          assert.ok(Math.abs(travel) < .001 || Math.sign(travel) === +pose.direction, 'Head leads entrance travel');
        }
        if (elapsed % 150 === 0) await capture(`entry ${elapsed}ms / ${pose.state}`);
        previous = pose;
        await page.clock.runFor(50);
      }
      await until('inside');
      assert.equal((await read()).pixels, 0);
      const sheet = await browser.newPage({ viewport: { width: 960, height: 800 } });
      await sheet.setContent(`<body style="margin:8px;background:#eee;font:14px sans-serif;display:grid;grid-template-columns:repeat(4,230px);gap:8px">${frames.map(f => `<div>${f.label}<img style="width:220px;display:block" src="data:image/png;base64,${f.png}"></div>`).join('')}</body>`);
      await sheet.screenshot({ path: `${output}/${width}-${id}.png`, fullPage: true });
      await sheet.close();
      reports.push({ width, id, samples });
    }
    // A mobile drawer closes immediately. Its saved destination must survive
    // an in-progress entry followed by the complete exit/landing/run sequence.
    await click('contact'); await until('standing');
    await page.locator('.featured-monkey').click(); await until('enteringHouse');
    await page.clock.runFor(350); await click('academics'); await until('standing');
    assert.equal((await read()).target, 'academics');
    assert.equal(new URL(page.url()).pathname, '/academics');
    // Resize through both picture sources during a portal transition.
    await page.locator('.featured-monkey').click(); await until('enteringHouse');
    for (const resized of [320, 430, 1101, 1440, 390]) {
      await page.setViewportSize({ width: resized, height: 950 });
      await page.locator('.featured-branch').evaluate(image => image.decode());
      await page.clock.runFor(100);
      const pose = await read();
      assert.ok([pose.x, pose.y, pose.doorX, pose.doorY].every(value => Number.isFinite(+value)));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
    await until('inside');
    await click('contact'); await page.clock.runFor(250);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.runFor(50);
    assert.equal((await read()).state, 'standing');
    assert.equal(await page.locator('.featured-squirrel').count(), 1);
    console.log(`PASS ${width}: head-first entry/exit, continuous positions, branch landing, interrupted entry with drawer target, live resize and reduced motion.`);
    await page.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(`${output}/report.json`, JSON.stringify({ errors, reports }, null, 2));
} finally { await browser.close(); }
