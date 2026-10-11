import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.argv[2] || 'http://127.0.0.1:4215';
const output = 'artifacts/realistic-navigation';
const destinations = [
  ['home', 'Home', '/'],
  ['academics', 'Academics', '/academics'],
  ['admissions', 'Admissions', '/admissions'],
  ['campus', 'Campus', '/campus'],
  ['school-life', 'School Life', '/school-life'],
  ['contact', 'Contact', '/contact'],
];
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 950 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const errors = [], imageFailures = [], reports = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('response', response => {
  if (response.request().resourceType() === 'image' && response.status() >= 400) {
    imageFailures.push({ url: response.url(), status: response.status() });
  }
});
page.on('requestfailed', request => {
  if (request.resourceType() === 'image') {
    imageFailures.push({ url: request.url(), error: request.failure()?.errorText });
  }
});

async function loadHome() {
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, 'Homepage response');
  await page.locator('.featured-branch').evaluate(image => image.decode());
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelectorAll('[data-board][data-top][data-under][data-bottom]').length > 0);
}

async function expectPath(path) {
  await page.waitForURL(url => url.pathname === path);
  assert.equal(new URL(page.url()).pathname, path);
}

async function waitIdle() {
  await page.waitForFunction(() => document.querySelector('.featured-squirrel').dataset.state === 'idle');
}

async function clippedScreenshot(filename, selectors) {
  const clip = await page.evaluate(selectors => {
    const boxes = selectors.map(selector => document.querySelector(selector)?.getBoundingClientRect()).filter(Boolean);
    const x = Math.max(0, Math.min(...boxes.map(box => box.left)) - 14);
    const y = Math.max(0, Math.min(...boxes.map(box => box.top)) - 14);
    const right = Math.min(innerWidth, Math.max(...boxes.map(box => box.right)) + 14);
    const bottom = Math.max(...boxes.map(box => box.bottom)) + 14;
    return { x, y, width: right - x, height: bottom - y };
  }, selectors);
  await page.screenshot({ path: `${output}/${filename}.png`, clip });
}

try {
  for (const width of [390, 768, 1024, 1440, 2560]) {
    await page.setViewportSize({ width, height: 950 });
    await loadHome();
    const mobile = await page.locator('.featured-menu').isVisible();
    const labels = await page.locator('.featured-signs .featured-sign').allTextContents();
    assert.deepEqual(labels.map(label => label.trim()), destinations.map(([, label]) => label));

    const geometry = await page.evaluate(() => {
      const header = document.querySelector('.featured-nav').getBoundingClientRect();
      const image = document.querySelector('.featured-branch');
      const art = image.getBoundingClientRect();
      const ropes = [...document.querySelectorAll('[data-board][data-top][data-under][data-bottom]')].map(group => ({
        board: group.dataset.board,
        top: Number(group.dataset.top),
        under: Number(group.dataset.under),
        bottom: Number(group.dataset.bottom),
      }));
      const boards = [...document.querySelectorAll('.featured-signs .featured-sign, .featured-logo')]
        .filter(element => element.getClientRects().length)
        .map(element => {
          const rect = element.getBoundingClientRect();
          const nav = document.querySelector('.featured-inner').getBoundingClientRect();
          return { id: element.dataset.navId || 'logo', top: rect.top - nav.top, left: rect.left, right: rect.right };
        });
      return {
        ropes,
        boards,
        overflow: document.documentElement.scrollWidth > innerWidth,
        headerWidth: header.width,
        imageAspect: art.width / art.height,
        naturalAspect: image.naturalWidth / image.naturalHeight,
        broken: [...document.querySelectorAll('.featured-nav img')].filter(img => !img.naturalWidth).map(img => img.src),
      };
    });
    assert.equal(geometry.overflow, false, `${width}: horizontal page overflow`);
    assert.deepEqual(geometry.broken, [], `${width}: broken header images`);
    assert.ok(Math.abs(geometry.imageAspect - geometry.naturalAspect) < 0.02, `${width}: stretched branch artwork`);
    assert.equal(geometry.ropes.length, mobile ? 2 : 14, `${width}: two ropes for every visible board`);
    for (const board of geometry.boards) {
      const ropes = geometry.ropes.filter(rope => rope.board === board.id);
      assert.equal(ropes.length, 2, `${width}: ${board.id} attachment count`);
      for (const rope of ropes) {
        assert.ok([rope.top, rope.under, rope.bottom].every(Number.isFinite), `${width}: finite rope geometry`);
        assert.ok(rope.top < rope.under && rope.under < rope.bottom, `${width}: ${board.id} branch wrap and hanging length`);
        assert.ok(Math.abs(rope.bottom - board.top) <= 16, `${width}: ${board.id} rope/board connection`);
      }
      assert.ok(board.left >= 0 && board.right <= width, `${width}: ${board.id} board outside viewport`);
    }
    assert.equal(await page.locator('.featured-handle').count(), 1, `${width}: wooden monkey handle`);
    assert.equal(await page.locator('.featured-monkey').count(), 1, `${width}: original monkey`);
    await page.locator('.featured-nav').screenshot({ path: `${output}/header-${width}.png` });
    await clippedScreenshot(`grip-${width}`, ['.featured-handle', '.featured-monkey']);
    if (!mobile) {
      const nav = await page.locator('.featured-inner').boundingBox();
      const board = await page.locator('[data-nav-id="academics"]').boundingBox();
      const ropeTop = Math.min(...geometry.ropes.filter(rope => rope.board === 'academics').map(rope => rope.top));
      const y = Math.max(0, nav.y + ropeTop - 20);
      await page.screenshot({
        path: `${output}/rope-detail-${width}.png`,
        clip: { x: board.x - 14, y, width: board.width + 28, height: board.y + board.height + 14 - y },
      });
    }

    for (const [id, label, path] of destinations) {
      if (mobile) {
        await page.locator('.featured-menu').click();
        assert.equal(await page.locator('.featured-menu').getAttribute('aria-expanded'), 'true');
        assert.deepEqual(await page.locator('.featured-drawer .featured-sign').allTextContents(), destinations.map(([, text]) => text));
        await page.locator(`.featured-drawer [data-nav-id="${id}"]`).click();
        assert.equal(await page.locator('.featured-menu').getAttribute('aria-expanded'), 'false');
      } else {
        await page.locator(`.featured-signs [data-nav-id="${id}"]`).click();
      }
      await expectPath(path);
      await waitIdle();
      if (!mobile) {
        await page.waitForFunction(id => document.querySelector(`.featured-signs [data-nav-id="${id}"]`)?.getAttribute('aria-current') === 'page', id);
        assert.equal(await page.locator(`.featured-signs [data-nav-id="${id}"]`).getAttribute('aria-current'), 'page', `${width}: ${id} active navigation`);
      }
      reports.push({ width, label, path, passed: true });
    }

    if (mobile) {
      const trigger = page.locator('.featured-menu');
      await trigger.focus();
      await page.keyboard.press('Enter');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
      assert.equal(await page.evaluate(() => document.activeElement?.dataset.navId), 'home');
      await page.keyboard.press('Escape');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
      await page.keyboard.press('Enter');
      await page.locator('.featured-drawer [data-nav-id="academics"]').focus();
      await page.keyboard.press('Enter');
      await expectPath('/academics');
    } else {
      await page.keyboard.press('Tab');
      await page.locator('.featured-signs [data-nav-id="academics"]').focus();
      const outline = await page.locator('.featured-signs [data-nav-id="academics"]').evaluate(element => ({
        style: getComputedStyle(element).outlineStyle,
        width: parseFloat(getComputedStyle(element).outlineWidth),
      }));
      assert.notEqual(outline.style, 'none');
      assert.ok(outline.width >= 2);
      await page.keyboard.press('Enter');
      await expectPath('/academics');
    }
    await page.locator('.featured-logo').focus();
    await page.keyboard.press('Enter');
    await expectPath('/');
    assert.equal(await page.locator('.featured-squirrel').getAttribute('data-state'), 'inside');
  }

  // Normal motion must still walk through sprite frames and enter the birdhouse.
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await loadHome();
  await page.evaluate(() => {
    window.navigationGaitSamples = [];
    window.navigationGaitSampler = setInterval(() => {
      const squirrel = document.querySelector('.featured-squirrel');
      window.navigationGaitSamples.push({ state: squirrel.dataset.state, frame: squirrel.dataset.frame });
    }, 20);
  });
  await page.locator('.featured-signs [data-nav-id="contact"]').click();
  await waitIdle();
  const landing = await page.evaluate(() => {
    const squirrel = document.querySelector('.featured-squirrel').getBoundingClientRect();
    const board = document.querySelector('.featured-signs [data-nav-id="contact"]').getBoundingClientRect();
    return Math.abs(squirrel.x + squirrel.width / 2 - board.x - board.width / 2);
  });
  assert.ok(landing < 2, `Squirrel stopped ${landing}px away from its board`);
  const beforeMonkey = page.url();
  await page.locator('.featured-monkey').focus();
  await page.keyboard.press('Space');
  await page.waitForFunction(() => document.querySelector('.featured-squirrel').dataset.state === 'enteringHouse');
  await page.locator('.featured-nav').screenshot({ path: `${output}/entering-house.png` });
  await page.waitForFunction(() => document.querySelector('.featured-squirrel').dataset.state === 'inside');
  assert.equal(page.url(), beforeMonkey, 'Monkey activation must not navigate');
  const samples = await page.evaluate(() => {
    clearInterval(window.navigationGaitSampler);
    return window.navigationGaitSamples;
  });
  const frames = [...new Set(samples.filter(sample => ['walking', 'running'].includes(sample.state)).map(sample => sample.frame))];
  assert.ok(frames.length >= 4, `Only ${frames.length} gait frames observed`);
  assert.ok(samples.some(sample => sample.state === 'stopping'), 'Squirrel stopping animation');
  const blankCanvas = await page.locator('.featured-squirrel').evaluate(canvas =>
    !canvas.getContext('2d').getImageData(0, 0, 128, 128).data.some((value, index) => index % 4 === 3 && value),
  );
  assert.equal(blankCanvas, true, 'Squirrel disappeared into birdhouse');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.featured-signs [data-nav-id="home"]').click();
  assert.equal(await page.locator('.featured-squirrel').getAttribute('data-state'), 'idle');
  await page.locator('.featured-monkey').click();
  assert.equal(await page.locator('.featured-squirrel').getAttribute('data-state'), 'inside');
  assert.deepEqual(errors, [], 'Browser runtime/console errors');
  assert.deepEqual(imageFailures, [], 'Image request failures');
  await writeFile(`${output}/report.json`, JSON.stringify({ base, reports, frames, errors, imageFailures, screenshots: '2x device density', formSubmission: 'Not tested; header-only checks send no enquiries.' }, null, 2));
  console.log('PASS: 30 navigation clicks across 390/768/1024/1440/2560px, 2 ropes per visible board, unstretched branch, no overflow, keyboard focus/Enter/Escape, logo home, normal/reduced-motion squirrel behavior, no runtime/image errors. Screenshots: ' + output);
} finally {
  await browser.close();
}
