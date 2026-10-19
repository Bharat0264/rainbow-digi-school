import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// The restored artwork has 146 extra transparent rows above the original frame.
const input = process.argv[2];
if (!input) throw new Error('Pass the restored transparent PNG path.');
const source = (await readFile(input)).toString('base64');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const result = await page.evaluate(async source => {
    const image = new Image();
    image.src = `data:image/png;base64,${source}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 4344;
    canvas.height = 860;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 146, 2172, 430, 0, 0, 4344, 860);
    const hd = canvas.toDataURL('image/webp', 0.97).split(',')[1];
    canvas.width = 2172;
    canvas.height = 430;
    context.drawImage(image, 0, 146, 2172, 430, 0, 0, 2172, 430);
    return { hd, standard: canvas.toDataURL('image/webp', 0.97).split(',')[1] };
  }, source);
  await writeFile('public/images/navigation/branch-house-hd@2x.webp', Buffer.from(result.hd, 'base64'));
  await writeFile('public/images/navigation/branch-house-hd.webp', Buffer.from(result.standard, 'base64'));
} finally {
  await browser.close();
}
