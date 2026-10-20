import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// Retain the original alpha, foliage and house; transfer restored bark only.
const [desktopInput, mobileInput] = process.argv.slice(2);
if (!desktopInput || !mobileInput) throw new Error('Pass desktop and mobile restoration PNGs.');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const [compact, input] of [[false, desktopInput], [true, mobileInput]]) {
    const base = compact ? 'branch-house-compact.png' : 'branch-house-hd.webp';
    const sources = await Promise.all([`public/images/navigation/${base}`, input].map(async path =>
      `data:image/${path.endsWith('.webp') ? 'webp' : 'png'};base64,${(await readFile(path)).toString('base64')}`));
    const result = await page.evaluate(async ({ sources, compact }) => {
      const images = await Promise.all(sources.map(async src => { const i = new Image(); i.src = src; await i.decode(); return i; }));
      const w = compact ? 1536 : 2172, h = compact ? 1024 : 430;
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d'); ctx.drawImage(images[0], 0, 0);
      const original = ctx.getImageData(0, 0, w, h);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(images[1], 0, compact ? 0 : -146);
      const restored = ctx.getImageData(0, 0, w, h);
      let changed = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const n = (y * w + x) * 4;
        const [r, g, b, a] = original.data.slice(n, n + 4);
        const house = compact ? x > 585 && x < 990 && y < 443 : x > 938 && x < 1248 && y < 312;
        if (house || a < 250 || restored.data[n + 3] < 250) continue;
        // Soft color selection excludes green foliage and blends bark boundaries.
        const amount = Math.min(1, Math.max(0, (r - g * 1.12) / 22)) * Math.min(1, Math.max(0, (g - b * 1.08) / 16));
        if (!amount) continue;
        for (let c = 0; c < 3; c++) original.data[n+c] = Math.round(original.data[n+c] * (1-amount) + restored.data[n+c] * amount);
        changed++;
      }
      ctx.putImageData(original, 0, 0);
      const standard = canvas.toDataURL('image/webp', 1).split(',')[1];
      const high = document.createElement('canvas'); high.width = w * 2; high.height = h * 2;
      const hc = high.getContext('2d'); hc.imageSmoothingQuality = 'high'; hc.drawImage(canvas, 0, 0, high.width, high.height);
      return { standard, hd: high.toDataURL('image/webp', .97).split(',')[1], changed };
    }, { sources, compact });
    const name = compact ? 'branch-house-compact-detailed' : 'branch-house-detailed';
    await writeFile(`public/images/navigation/${name}.webp`, Buffer.from(result.standard, 'base64'));
    if (!compact) await writeFile(`public/images/navigation/${name}@2x.webp`, Buffer.from(result.hd, 'base64'));
    console.log(`${name}: ${result.changed} bark pixels refined`);
  }
} finally { await browser.close(); }
