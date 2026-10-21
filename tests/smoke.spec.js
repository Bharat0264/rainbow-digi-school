import { test, expect } from '@playwright/test';
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
for (const route of routes)
  test(`route ${route}`, async ({ page }) => {
    const errors = [],
      failed = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => {
      if (r.status() >= 400 && r.request().resourceType() !== 'document') failed.push(r.url());
    });
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.evaluate(async () => {
      for (const i of document.images) {
        i.loading = 'eager';
        await i.decode().catch(() => {});
      }
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(
      await page.evaluate(() =>
        [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src),
      ),
    ).toEqual([]);
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
    await expect(page.locator('.site-footer nav a')).toHaveCount(5);
  });
test('navigation, back/forward, route scroll and mobile menu', async ({ page }, info) => {
  await page.goto('/');
  await page.evaluate(() => scrollTo(0, 600));
  await page.locator('.site-footer nav a[href="/academics"]').click();
  await expect(page).toHaveURL(/academics$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/academics$/);
  if (info.project.name === 'mobile') {
    const menu = page.locator('.featured-menu');
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
  }
});
test('form validates, dropdown keyboard, double-submit and success (mock only)', async ({
  page,
}) => {
  await page.goto('/admissions#enquiry');
  await page.getByRole('button', { name: 'Send enquiry', exact: true }).click();
  await expect(page.locator('#enquiry-parentName-error')).toBeVisible();
  await page.locator('#enquiry-parentName').fill('Review Test Parent');
  await page.locator('#enquiry-phone').fill('9876543210');
  await page.locator('.glass-select-trigger').click();
  await page.locator('.glass-option-item').filter({ hasText: 'Nursery' }).click();
  await page.locator('#enquiry-consent').check();
  let calls = 0;
  await page.route('**/api/enquiries', async (r) => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 100));
    await r.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ enquiryNumber: 'RDS-ENQ-2026-ABCDEF1234' }),
    });
  });
  const send = page.getByRole('button', { name: 'Send enquiry', exact: true });
  await send.evaluate((button) => {
    button.click();
    button.click();
  });
  await expect(
    page.getByRole('status').filter({ hasText: 'Your enquiry has been saved' }),
  ).toBeVisible();
  expect(calls).toBe(1);
  await expect(page.locator('#enquiry-parentName')).toHaveValue('');
  await expect(page.locator('select[name="program"]')).toHaveValue('');
});
for (const album of ['campus', 'classrooms', 'celebrations', 'activities'])
  test(`album ${album} spine, final page, focus and reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/school-life?album=${album}&page=6#gallery`);
    const frame = page.locator('.album-spine-frame');
    await expect(frame).toHaveAttribute('data-left-page', '11');
    const before = await frame.boundingBox();
    await page.keyboard.press('ArrowLeft');
    await expect(frame).toHaveAttribute(
      'data-left-page',
      page.viewportSize().width < 768 ? '10' : '9',
    );
    await page.keyboard.press('ArrowRight');
    await expect(frame).toHaveAttribute('data-left-page', '11');
    expect(await frame.boundingBox()).toEqual(before);
    await page.keyboard.press('End');
    await expect(frame).toHaveAttribute('data-left-page', '13');
    expect(await frame.boundingBox()).toEqual(before);
    await page.getByRole('button', { name: 'Show grid view', exact: true }).click();
    await expect(page.locator('.gallery-grid-photo')).toHaveCount(12);
    await page.locator('.gallery-grid-photo').first().click();
    await expect(page.locator('.gallery-lightbox[open]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.gallery-lightbox[open]')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.locator('.gallery-viewer[open]')).toHaveCount(0);
  });
