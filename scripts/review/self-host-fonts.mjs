import { chromium } from 'playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const requested = new Set(
  JSON.parse(await readFile('artifacts/review-round-1/before/requests.json', 'utf8')),
);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://rainbow-digi-school.vercel.app', { waitUntil: 'networkidle' });
const stylesheet = await page
  .locator('link[href*="fonts.googleapis.com/css"]')
  .getAttribute('href');
const response = await page.request.get(stylesheet);
const css = await response.text();
await mkdir('public/fonts', { recursive: true });
const faces = [];
const kept = [];
for (const face of css.matchAll(/@font-face\s*\{[^}]+\}/g)) {
  const urls = [...face[0].matchAll(/url\(([^)]+)\)/g)].map((x) => x[1]);
  if (!urls.some((u) => requested.has(u))) continue;
  let local = face[0];
  for (const url of urls) {
    const r = await page.request.get(url);
    if (!r.ok()) throw new Error('Font fetch failed ' + r.status());
    const data = await r.body(),
      hash = createHash('sha256').update(data).digest('hex').slice(0, 12),
      name = `${hash}.woff2`;
    await writeFile('public/fonts/' + name, data);
    local = local.replaceAll(url, '/fonts/' + name);
    kept.push({ url, file: 'public/fonts/' + name, bytes: data.length });
  }
  faces.push(local);
}
if (!faces.length) throw new Error('No production font faces matched');
await writeFile(
  'src/styles/fonts.css',
  '/* Exact font binaries requested by the production baseline; font-display stays swap. */\n' +
    faces.join('\n'),
);
for (const family of ['playfairdisplay', 'plusjakartasans', 'fredoka', 'baloo2', 'lilitaone']) {
  const r = await page.request.get(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`,
  );
  if (r.ok()) await writeFile(`public/fonts/OFL-${family}.txt`, await r.text());
}
await writeFile('artifacts/review-round-1/fonts.json', JSON.stringify(kept, null, 2));
console.log(kept.length + ' production font faces self-hosted');
await browser.close();
