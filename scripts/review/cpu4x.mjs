import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:4212';
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
const session = await c.newCDPSession(p);
await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const rows = [];
try {
  for (const width of [390, 768, 1024, 1440, 1920]) {
    await p.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const album of ['campus', 'classrooms', 'celebrations', 'activities']) {
      await p.goto(`${base}/school-life?album=${album}&page=6#gallery`);
      const frame = p.locator('.album-spine-frame');
      await frame.waitFor();
      await p.waitForTimeout(100);
      const box = await frame.boundingBox();
      assert(Math.abs(box.x + box.width / 2 - width / 2) < 1);
      await p.keyboard.press('ArrowLeft');
      await p.waitForTimeout(140);
      assert.equal(await p.locator('.album-spine-sheet').count(), 1);
      assert.deepEqual(await frame.boundingBox(), box);
      await p.waitForTimeout(400);
      await p.keyboard.press('ArrowRight');
      await p.waitForTimeout(550);
      assert.equal(await frame.getAttribute('data-left-page'), '11');
      rows.push({ width, album, cpuSlowdown: 4, passed: true });
    }
  }
  assert.deepEqual(errors, []);
  await writeFile('artifacts/review-round-1/cpu4x.json', JSON.stringify({ rows, errors }, null, 2));
  console.log(rows.length + ' album interactions passed at 4x CPU slowdown');
} finally {
  await b.close();
}
