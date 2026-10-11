// Web-delivery encoding only. Artwork is created by the image tool; this keeps
// its native dimensions and alpha, and does not redraw or crop its contents.
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error('Usage: node scripts/encode-rope-assets.mjs source.png destination.webp');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const input = await readFile(source);
  const encoded = await page.evaluate(async base64 => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0);
    return { data: canvas.toDataURL('image/webp', .96).split(',')[1], width: canvas.width, height: canvas.height };
  }, input.toString('base64'));
  const output = Buffer.from(encoded.data, 'base64');
  await writeFile(destination, output);
  console.log(JSON.stringify({ destination, width: encoded.width, height: encoded.height, inputBytes: input.length, outputBytes: output.length }));
} finally { await browser.close(); }
