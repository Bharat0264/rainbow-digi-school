import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

const source = 'public/images/navigation/';
const targets = [
  ['branch.webp', 'branch-compact.webp', 960, .38],
  ['treehouse.webp', 'treehouse-compact.webp', 116, .48],
  ['monkey-sign.webp', 'monkey-compact.webp', 150, .5],
];
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [input, output, width, quality] of targets) {
  const data = (await readFile(source + input)).toString('base64');
  const encoded = await page.evaluate(async ({ data, width, quality }) => {
    const image = new Image(); image.src = `data:image/webp;base64,${data}`; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = Math.round(image.height * width / image.width);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return { width: canvas.width, height: canvas.height, data: canvas.toDataURL('image/webp', quality).split(',')[1] };
  }, { data, width, quality });
  const bytes = Buffer.from(encoded.data, 'base64'); await writeFile(source + output, bytes);
  console.log(output, encoded.width, encoded.height, bytes.length);
}
await browser.close();
