import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

const generated = 'C:/Users/bhara/.codex/generated_images/01a12186-f2a1-7022-abcd-cd06469042ad/';
const jobs = [
  ['exec-0f549d43-b2e0-4cff-8d4b-b74cdc2bcba2.png', 'branch-house.webp', 1536, .78],
  ['exec-af57afdb-d3dd-4e89-89bd-20b388a0392e.png', 'monkey-featured.webp', 250, .82],
  ['exec-6125ce12-e099-48b0-9f3e-56be65481a38.png', 'squirrel-featured.webp', 320, .75],
];
const browser = await chromium.launch(); const page = await browser.newPage();
for (const [input, output, width, quality] of jobs) {
  const base64 = (await readFile(generated + input)).toString('base64');
  const result = await page.evaluate(async ({ base64, width, quality }) => {
    const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = Math.round(width * image.height / image.width);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return { data: canvas.toDataURL('image/webp', quality).split(',')[1], width: canvas.width, height: canvas.height };
  }, { base64, width, quality });
  const bytes = Buffer.from(result.data, 'base64'); await writeFile(`public/images/navigation/${output}`, bytes);
  console.log(output, result.width, result.height, bytes.length);
}
await browser.close();
