import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';

const server = await createServer({ server: { port: 4233 } });
await server.listen();
const browser = await chromium.launch();
const origin = 'http://localhost:4233';
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.clock.install();
    await page.goto(origin);
    await page.waitForFunction(() => document.querySelector('.featured-squirrel').dataset.looping === 'true');
    const canvas = page.locator('.featured-squirrel');
    const read = () => canvas.evaluate(e => ({ ...e.dataset,
      alpha: [...e.getContext('2d').getImageData(0, 0, 128, 128).data].filter((_, i) => i % 4 === 3).some(a => a > 0) }));
    const states = new Set();
    let lastEntry = 0, sawTail = false, sawInside = false;
    for (let i = 0; i < 180; i++) {
      await page.clock.runFor(1000 / 30);
      const sample = await read();
      states.add(sample.state);
      if (sample.state === 'approaching' || sample.state === 'idle') {
        assert.ok(Math.abs(+sample.y - +sample.surfaceY) < .01, 'Paws stay on bark');
        assert.equal(+sample.scale, 1, 'Running proportions stay constant');
      }
      if (sample.state === 'enteringHouse') {
        assert.ok(+sample.entryProgress >= lastEntry, 'Entry moves forward');
        lastEntry = +sample.entryProgress;
        if (lastEntry > .7 && sample.alpha) sawTail = true;
      }
      if (sample.state === 'inside') {
        assert.equal(sample.alpha, false, 'Entire squirrel disappears inside');
        sawInside = true;
      }
    }
    for (const state of ['approaching', 'idle', 'climbing', 'standing', 'enteringHouse', 'inside']) assert.ok(states.has(state), state);
    assert.ok(sawTail && sawInside, 'Tail follows body before pause');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    // A route click must not pull a half-hidden squirrel back through the wall.
    for (let i = 0; i < 180; i++) {
      const sample = await read();
      if (sample.state === 'enteringHouse' && +sample.entryProgress > .3) break;
      await page.clock.runFor(1000 / 30);
    }
    const beforeClick = await read();
    if (width < 768) await page.locator('.featured-menu').click();
    await page.locator(`${width < 768 ? '.featured-drawer' : '.featured-signs'} a[href="/academics"]`).click();
    const afterClick = await read();
    assert.equal(afterClick.state, 'enteringHouse');
    assert.ok(+afterClick.entryProgress >= +beforeClick.entryProgress, 'Click preserves entry progress');
    await page.clock.runFor(4000);
    assert.ok(page.url().endsWith('/academics'));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.runFor(100);
    assert.equal((await read()).alpha, false, 'Reduced motion leaves the scene still');
    console.log(`${width}px: grounded run, climb, tail-last entry, hidden pause, click continuity, reduced motion passed`);
    await page.close();
  }

  if (process.argv.includes('--export')) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
    await page.clock.install();
    await page.goto(origin);
    await page.locator('.featured-assembly').evaluate(e => e.decode());
    await page.waitForFunction(() => document.querySelector('.featured-squirrel').dataset.looping === 'true');
    const header = page.locator('.bn-header');
    await page.locator('.featured-squirrel').evaluate(e => { e.style.visibility = 'hidden'; });
    const background = await header.screenshot();
    await page.evaluate(async data => {
      const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
      window.squirrelExport = { image, canvas: document.createElement('canvas') };
      squirrelExport.canvas.width = image.width;
      squirrelExport.canvas.height = image.height;
    }, background.toString('base64'));
    await page.locator('.featured-squirrel').evaluate(e => { e.style.visibility = ''; });
    // Begin during the invisible pause. The first/last frames have identical scenery.
    for (let i = 0; i < 200; i++) {
      const time = await page.locator('.featured-squirrel').evaluate(e => +e.dataset.loopTime);
      if (time >= 5000 && time < 5100) break;
      await page.clock.runFor(1000 / 30);
    }
    const ffmpeg = execFileSync('python', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim();
    await mkdir('public/animations', { recursive: true });
    const encoder = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-i', '-', '-an', '-c:v', 'libvpx-vp9', '-crf', '24', '-b:v', '0', '-pix_fmt', 'yuv420p', 'public/animations/treehouse-squirrel-loop.webm']);
    let error = ''; encoder.stderr.on('data', data => { error += data; });
    const finished = new Promise((resolve, reject) => { encoder.on('error', reject); encoder.on('close', code => code ? reject(new Error(error)) : resolve()); });
    for (let i = 0; i < 174; i++) {
      const frame = await page.evaluate(() => {
        const { image, canvas } = squirrelExport, context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        const squirrel = document.querySelector('.featured-squirrel');
        const s = squirrel.getBoundingClientRect(), h = document.querySelector('.bn-header').getBoundingClientRect();
        context.drawImage(squirrel, s.x - h.x, s.y - h.y, s.width, s.height);
        return canvas.toDataURL('image/png').split(',')[1];
      });
      if (!encoder.stdin.write(Buffer.from(frame, 'base64'))) await new Promise(resolve => encoder.stdin.once('drain', resolve));
      await page.clock.runFor(1000 / 30);
    }
    encoder.stdin.end(); await finished;
    await page.locator('.featured-squirrel').evaluate(e => { e.style.visibility = 'hidden'; });
    assert.ok(background.equals(await header.screenshot()), 'Environment pixels remain unchanged through loop');
    await writeFile('public/animations/treehouse-squirrel-loop-poster.png', background);
    console.log('Exported 5.8 seconds at 30 fps; environment is pixel-identical before/after.');
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}
