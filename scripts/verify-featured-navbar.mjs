import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const baseUrl = process.argv[2] || 'http://localhost:5173';
const destinations = [
  ['home', '/'], ['academics', '/academics'], ['admissions', '/admissions'],
  ['campus', '/campus'], ['events', '/events'], ['contact', '/contact'], ['apply', '/admissions'],
];
for (const width of [360, 768, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const failures = [];
  page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `artifacts/navbar-${width}.png`, fullPage: false });
  const metrics = await page.evaluate(() => ({
    navHeight: Math.round(document.querySelector('.featured-inner').getBoundingClientRect().height),
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    links: [...document.querySelectorAll('.featured-sign, .featured-home')].map(link => link.textContent.trim() || link.getAttribute('aria-label')),
  }));
  if (width >= 1241) {
    for (const [id, path] of destinations) {
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await page.locator(id === 'home' ? '.featured-home' : `[data-nav-id="${id}"]`).click();
      if (new URL(page.url()).pathname !== path) await page.waitForURL(`**${path}`);
      if (new URL(page.url()).pathname !== path) failures.push(`route: ${id} reached ${page.url()}`);
    }
  } else {
    for (const [id, path] of destinations) {
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await page.locator('.featured-menu').click();
      await page.locator(`.featured-drawer [data-nav-id="${id}"]`).click();
      if (new URL(page.url()).pathname !== path) await page.waitForURL(`**${path}`);
      if (new URL(page.url()).pathname !== path) failures.push(`route: ${id} reached ${page.url()}`);
    }
  }
  console.log(JSON.stringify({ width, ...metrics, failures }));
  await page.close();
}
await browser.close();
