import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'https://rainbow-digi-school.vercel.app',
  out = process.argv[3] || 'artifacts/review-round-1/before/lighthouse';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ['--remote-debugging-port=9222'] });
const rows = [];
try {
  for (const mode of ['mobile', 'desktop'])
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
      const flags = {
        port: 9222,
        logLevel: 'error',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      };
      if (mode === 'desktop') {
        flags.formFactor = 'desktop';
        flags.screenEmulation = {
          mobile: false,
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
          disabled: false,
        };
        flags.throttling = {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        };
      }
      const result = await lighthouse(base + route, flags);
      if (!result) throw new Error('No Lighthouse result');
      const l = result.lhr,
        slug = route === '/' ? 'home' : route.slice(1);
      await writeFile(`${out}/${slug}-${mode}.json`, result.report);
      if (new URL(l.finalDisplayedUrl || l.finalUrl).origin !== new URL(base).origin)
        throw new Error('Lighthouse redirected outside the authorised site');
      const metric = (id) => l.audits[id]?.numericValue;
      rows.push({
        route,
        mode,
        performance: l.categories.performance.score * 100,
        accessibility: l.categories.accessibility.score * 100,
        lcp: metric('largest-contentful-paint'),
        cls: metric('cumulative-layout-shift'),
        tbt: metric('total-blocking-time'),
        weight: metric('total-byte-weight'),
        unusedJS: metric('unused-javascript'),
        unusedCSS: metric('unused-css-rules'),
        runtimeError: l.runtimeError || null,
      });
      await writeFile(`${out}/summary.json`, JSON.stringify(rows, null, 2));
      console.log(
        `${mode} ${route}: perf ${rows.at(-1).performance}, LCP ${Math.round(rows.at(-1).lcp)}ms`,
      );
    }
} finally {
  await browser.close();
}
