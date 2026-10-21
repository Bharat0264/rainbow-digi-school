import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'https://rainbow-digi-school.vercel.app';
const out = process.argv[3] || 'artifacts/review-round-1/before';
const routes = [
  '/',
  '/academics',
  '/admissions',
  '/campus',
  '/school-life',
  '/contact',
  '/privacy-policy',
  '/404',
];
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
const assets = new Set();
try {
  for (const width of [390, 768, 1024, 1440, 1920])
    for (const route of routes) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const requests = [],
        errors = [],
        warnings = [];
      const session = await context.newCDPSession(page);
      let bytes = 0;
      await session.send('Network.enable');
      session.on('Network.loadingFinished', (e) => (bytes += e.encodedDataLength));
      page.on('request', (r) => {
        assets.add(r.url());
        requests.push({ url: r.url(), method: r.method(), type: r.resourceType() });
      });
      page.on('response', (r) => {
        const item = [...requests].reverse().find((x) => x.url === r.url() && !x.status);
        if (item) item.status = r.status();
      });
      page.on('requestfailed', (r) => {
        requests.push({ url: r.url(), failure: r.failure()?.errorText });
      });
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (['error', 'warning'].includes(m.type()))
          warnings.push({ type: m.type(), text: m.text() });
      });
      await page.addInitScript(() => {
        window.__review = { lcp: 0, cls: 0, interactions: [] };
        try {
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) window.__review.lcp = e.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) if (!e.hadRecentInput) window.__review.cls += e.value;
          }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver((l) => {
            for (const e of l.getEntries())
              if (e.interactionId) window.__review.interactions.push(e.duration);
          }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
        } catch {
          /* Optional observer unsupported by this browser. */
        }
      });
      const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      const initial = await page.evaluate(() => ({
        ...window.__review,
        resources: performance
          .getEntriesByType('resource')
          .map((r) => ({
            url: r.name,
            type: r.initiatorType,
            transfer: r.transferSize,
            encoded: r.encodedBodySize,
            decoded: r.decodedBodySize,
          })),
        navigation: performance
          .getEntriesByType('navigation')
          .map((n) => ({ ttfb: n.responseStart, domContentLoaded: n.domContentLoadedEventEnd })),
      }));
      // Load below-fold production assets without changing content or sending forms.
      await page.evaluate(async () => {
        for (const image of document.images) {
          image.loading = 'eager';
          await image.decode().catch(() => {});
        }
      });
      await page.waitForTimeout(150);
      const dom = await page.evaluate(() => ({
        title: document.title,
        h1: [...document.querySelectorAll('h1')].map((e) => e.textContent),
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src),
        missingAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.src),
        missingDimensions: [...document.images]
          .filter((i) => !i.hasAttribute('width') || !i.hasAttribute('height'))
          .map((i) => i.src),
        links: [...document.querySelectorAll('a[href]')].map((a) => ({
          href: a.getAttribute('href'),
          text: a.textContent.trim(),
          target: a.target,
          rel: a.rel,
        })),
        text: document.body.innerText,
      }));
      const slug = route === '/' ? 'home' : route.slice(1);
      await page.screenshot({
        path: `${out}/${slug}-${width}.png`,
        fullPage: true,
        animations: 'disabled',
      });
      await writeFile(`${out}/${slug}-${width}-network.json`, JSON.stringify(requests, null, 2));
      results.push({
        route,
        width,
        status: response?.status(),
        bytes,
        initial,
        errors,
        warnings,
        dom,
      });
      await writeFile(`${out}/crawl.json`, JSON.stringify(results, null, 2));
      await writeFile(`${out}/requests.json`, JSON.stringify([...assets], null, 2));
      console.log(
        `${width} ${route}: ${response?.status()} ${bytes} bytes ${errors.length} JS errors`,
      );
      await context.close();
    }
} finally {
  await browser.close();
}
