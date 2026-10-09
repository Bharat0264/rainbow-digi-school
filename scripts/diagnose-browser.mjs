import { chromium } from 'playwright';

const target = process.argv[2] || 'https://rainbow-digi-school.vercel.app/';
const label = new URL(target).host.replace(/[^a-z0-9.-]/gi, '_');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1536, height: 748 } });

page.on('console', message => console.log(`[console:${message.type()}] ${message.text()}`));
page.on('pageerror', error => console.log(`[pageerror] ${error.stack || error.message}`));
page.on('response', response => {
  const url = response.url();
  if (/\/assets\/.*\.js(?:\?|$)|\/api\//.test(url) || response.status() >= 400) {
    console.log(`[response] ${response.status()} ${response.headers()['content-type'] || '-'} ${url}`);
  }
});
page.on('requestfailed', request => console.log(`[failed] ${request.failure()?.errorText || 'unknown'} ${request.url()}`));

await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30_000 });
await page.waitForTimeout(10_000);
const dynamicImport = await page.evaluate(async () => {
  const url = performance.getEntriesByType('resource').map(entry => entry.name).find(url => /\/assets\/Home-.*\.js(?:\?|$)/.test(url));
  if (!url) return 'not requested';
  return Promise.race([
    import(url).then(module => `resolved default=${typeof module.default}`),
    new Promise(resolve => setTimeout(() => resolve('timed out'), 2_000)),
  ]);
});
console.log(`[manual-import] ${dynamicImport}`);
await page.screenshot({ path: `artifacts/${label}.png`, fullPage: true });
console.log(`[page] title=${await page.title()} loading=${await page.getByText('Loading...', { exact: true }).count()} bodyChars=${(await page.locator('body').innerText()).length}`);
console.log('[resources]', await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name)));
await browser.close();
