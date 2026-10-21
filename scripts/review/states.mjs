import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
const base = process.argv[2] || 'https://rainbow-digi-school.vercel.app',
  out = process.argv[3] || 'artifacts/review-round-1/before';
await mkdir(out + '/states', { recursive: true });
const b = await chromium.launch();
const scans = [];
try {
  for (const width of [390, 1440]) {
    const context = await b.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    const p = await context.newPage();
    for (const route of [
      '/',
      '/academics',
      '/admissions',
      '/campus',
      '/school-life',
      '/contact',
      '/privacy-policy',
      '/404',
    ]) {
      await p.goto(base + route, { waitUntil: 'networkidle' });
      const scan = await new AxeBuilder({ page: p })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      scans.push({
        route,
        width,
        violations: scan.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
      });
      await writeFile(out + '/a11y.json', JSON.stringify(scans, null, 2));
      console.log(width, route, scan.violations.length + ' axe violations');
    }
    if (width === 390) {
      await p.goto(base + '/');
      await p.getByRole('button', { name: 'Open navigation menu' }).click();
      await p.screenshot({ path: out + '/states/mobile-menu.png', fullPage: true });
      await p.keyboard.press('Escape');
    }
    await p.goto(base + '/admissions#enquiry');
    await p.getByRole('button', { name: 'Send enquiry', exact: true }).click();
    await p.locator('#enquiry').screenshot({ path: out + `/states/form-errors-${width}.png` });
    await p.locator('.glass-select-trigger').click();
    await p.locator('#enquiry').screenshot({ path: out + `/states/class-dropdown-${width}.png` });
    for (const album of ['campus', 'classrooms', 'celebrations', 'activities']) {
      await p.goto(base + `/school-life?album=${album}&page=6#gallery`);
      await p.locator('.album-spine-frame').waitFor();
      await p.waitForTimeout(300);
      await p.screenshot({ path: out + `/states/${album}-last-${width}.png` });
    }
    await context.close();
  }
} finally {
  await b.close();
}
