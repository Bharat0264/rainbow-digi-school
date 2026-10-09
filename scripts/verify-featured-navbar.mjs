import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
for (const width of [360, 768, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const failures = [];
  page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `artifacts/navbar-${width}.png`, fullPage: false });
  const metrics = await page.evaluate(() => ({
    navHeight: Math.round(document.querySelector('.featured-inner').getBoundingClientRect().height),
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    links: [...document.querySelectorAll('.featured-sign, .featured-home')].map(link => link.textContent.trim() || link.getAttribute('aria-label')),
  }));
  if (width >= 900) {
    await page.locator('[data-nav-id="academics"]').click();
    await page.waitForURL('**/academics');
    await page.locator('.featured-home').click();
    await page.waitForURL('**/');
  } else {
    await page.locator('.featured-menu').click();
    await page.locator('.featured-drawer [data-nav-id="admissions"]').click();
    await page.waitForURL('**/admissions');
  }
  console.log(JSON.stringify({ width, ...metrics, failures }));
  await page.close();
}
await browser.close();
