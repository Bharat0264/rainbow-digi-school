import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

const compactPath = 'public/images/navigation/branch-house-compact.png';
const compactB64 = (await readFile(compactPath)).toString('base64');

const browser = await chromium.launch();
const page = await browser.newPage();

const enhancedB64 = await page.evaluate(async (compactB64) => {
  function load(src) {
    return new Promise(r => {
      const img = new Image();
      img.onload = () => r(img);
      img.src = src;
    });
  }

  const cImg = await load('data:image/png;base64,' + compactB64);
  const W = cImg.naturalWidth, H = cImg.naturalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(cImg, 0, 0, W, H);

  const imgData = ctx.getImageData(0, 0, W, H);
  const data = imgData.data;

  function hash(x, y) {
    let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  }

  function noise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const n00 = hash(ix, iy), n10 = hash(ix + 1, iy), n01 = hash(ix, iy + 1), n11 = hash(ix + 1, iy + 1);
    return (n00 * (1 - ux) + n10 * ux) * (1 - uy) + (n01 * (1 - ux) + n11 * ux) * uy;
  }

  function fbm(x, y, octaves = 3) {
    let val = 0, amp = 0.5, freq = 1;
    for (let i = 0; i < octaves; i++) {
      val += noise(x * freq, y * freq) * amp;
      freq *= 2.05;
      amp *= 0.48;
    }
    return val;
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const alpha = data[idx+3];
      if (alpha < 20) continue;

      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const isBark = (r > b + 15) && (g > b - 10) && (r > g) && (r > 50 && r < 235) && (b < 140);
      const isLeaf = (g > r + 8) && (g > b + 12) && (g > 50);
      const isBirdhouse = (x >= 580 && x <= 950 && y >= 180 && y <= 520);

      if (isBark && !isBirdhouse) {
        // Anisotropic grain and cracks
        const grain = Math.sin(y * 0.45 + fbm(x * 0.05, y * 0.04, 3) * 5.0) * 16;
        const crack = Math.cos(x * 0.03 + y * 0.12) > 0.88 ? -35 : 0;
        const delta = grain + crack;
        data[idx]   = Math.min(255, Math.max(0, Math.round(r + delta * 1.15)));
        data[idx+1] = Math.min(255, Math.max(0, Math.round(g + delta * 0.85)));
        data[idx+2] = Math.min(255, Math.max(0, Math.round(b + delta * 0.45)));
      } else if (isLeaf) {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const spec = lum > 140 ? 14 : (lum < 95 ? -10 : 0);
        data[idx]   = Math.min(255, Math.max(0, Math.round(r + spec * 0.7)));
        data[idx+1] = Math.min(255, Math.max(0, Math.round(g + spec * 1.1)));
        data[idx+2] = Math.min(255, Math.max(0, Math.round(b + spec * 0.5)));
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png').split(',')[1];
}, compactB64);

await writeFile('public/images/navigation/branch-house-compact.png', Buffer.from(enhancedB64, 'base64'));
console.log('Saved enhanced branch-house-compact.png');
await browser.close();
