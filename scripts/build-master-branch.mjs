import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

const medPath = 'public/images/navigation/branch-house-medium.webp';
const medB64 = (await readFile(medPath)).toString('base64');

const browser = await chromium.launch();
const page = await browser.newPage();

const images = await page.evaluate(async (medB64) => {
  function load(src) {
    return new Promise(r => {
      const img = new Image();
      img.onload = () => r(img);
      img.src = src;
    });
  }

  const mImg = await load('data:image/webp;base64,' + medB64);
  const W = 2172, H = 430;

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(mImg, 0, 0, W, H);

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

  function fbm(x, y, octaves = 4) {
    let val = 0, amp = 0.5, freq = 1;
    for (let i = 0; i < octaves; i++) {
      val += noise(x * freq, y * freq) * amp;
      freq *= 2.05;
      amp *= 0.48;
    }
    return val;
  }

  // Anisotropic bark cracks stretched horizontally (5:1)
  function voronoiCracks(x, y) {
    const scaleX = 0.028, scaleY = 0.18;
    const wx = x * scaleX + fbm(x * 0.02, y * 0.08, 3) * 1.6;
    const wy = y * scaleY + fbm(x * 0.04, y * 0.05, 3) * 0.8;

    const ix = Math.floor(wx), iy = Math.floor(wy);
    let minDist = 999, secondDist = 999;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = ix + dx, cy = iy + dy;
        const px = cx + hash(cx, cy);
        const py = cy + hash(cx + 43, cy + 97);
        const d = Math.hypot(wx - px, (wy - py) * 1.8);
        if (d < minDist) {
          secondDist = minDist;
          minDist = d;
        } else if (d < secondDist) {
          secondDist = d;
        }
      }
    }
    return Math.max(0, secondDist - minDist);
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const alpha = data[idx+3];
      if (alpha < 18) continue;

      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const isBark = (r > b + 14) && (g > b - 10) && (r > g) && (r > 50 && r < 235) && (b < 140);
      const isLeaf = (g > r + 8) && (g > b + 12) && (g > 50);
      const isBirdhouse = (x >= 940 && x <= 1220 && y >= 75 && y <= 275);

      if (isBirdhouse) {
        // Wood plank and shingle grain
        const plankLine = (y % 14 === 0 || y % 14 === 1) ? -24 : 0;
        data[idx]   = Math.min(255, Math.max(0, r + plankLine));
        data[idx+1] = Math.min(255, Math.max(0, g + Math.round(plankLine * 0.8)));
        data[idx+2] = Math.min(255, Math.max(0, b + Math.round(plankLine * 0.5)));
      } else if (isBark) {
        const ratio = x / W;
        const curveY = 260 + 45 * (1 - 4 * Math.pow(ratio - 0.5, 2));
        const relY = y - curveY;

        const edgeDist = voronoiCracks(x, relY);
        const grain = Math.sin(relY * 0.85 + fbm(x * 0.08, relY * 0.05, 3) * 6.5);

        let delta = 0;
        if (edgeDist < 0.19) {
          const crackDepth = (1.0 - edgeDist / 0.19);
          delta = -crackDepth * 58;
        } else {
          const ridge = Math.pow(Math.min(1.0, (edgeDist - 0.19) * 2.6), 1.5);
          delta = ridge * 30 + grain * 14;
        }

        if (delta < 0) {
          // Warm dark umber crevice
          data[idx]   = Math.min(255, Math.max(0, Math.round(r + delta * 1.15)));
          data[idx+1] = Math.min(255, Math.max(0, Math.round(g + delta * 0.95)));
          data[idx+2] = Math.min(255, Math.max(0, Math.round(b + delta * 0.65)));
        } else {
          // Golden specular ridge highlight
          data[idx]   = Math.min(255, Math.max(0, Math.round(r + delta * 1.12)));
          data[idx+1] = Math.min(255, Math.max(0, Math.round(g + delta * 0.84)));
          data[idx+2] = Math.min(255, Math.max(0, Math.round(b + delta * 0.35)));
        }
      } else if (isLeaf) {
        const leafGrain = Math.sin(x * 0.4 + y * 0.3) * 8 + Math.cos(x * 0.2 - y * 0.4) * 6;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const spec = lum > 140 ? 16 : (lum < 95 ? -12 : 0);

        data[idx]   = Math.min(255, Math.max(0, Math.round(r + leafGrain * 0.5 + spec * 0.7)));
        data[idx+1] = Math.min(255, Math.max(0, Math.round(g + leafGrain * 1.0 + spec * 1.1)));
        data[idx+2] = Math.min(255, Math.max(0, Math.round(b + leafGrain * 0.4 + spec * 0.5)));
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // High-DPI master 2172 x 724
  const c724 = document.createElement('canvas');
  c724.width = 2172; c724.height = 724;
  const ctx724 = c724.getContext('2d');
  ctx724.drawImage(canvas, 0, 0, 2172, 430);

  return {
    mediumWebp: canvas.toDataURL('image/webp', 0.98).split(',')[1],
    texturedPng: c724.toDataURL('image/png').split(',')[1]
  };
}, medB64);

await writeFile('public/images/navigation/branch-house-medium.webp', Buffer.from(images.mediumWebp, 'base64'));
await writeFile('public/images/navigation/branch-house-textured.png', Buffer.from(images.texturedPng, 'base64'));

console.log('Successfully written pristine high-res branch assets: medium.webp and textured.png');
await browser.close();
