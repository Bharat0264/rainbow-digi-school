import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
const before = process.argv[2] || 'artifacts/review-round-1/before',
  after = process.argv[3] || 'artifacts/review-round-1/after',
  out = 'artifacts/review-round-1/comparison';
await mkdir(out, { recursive: true });
const report = [];
for (const file of (await readdir(before)).filter((x) => x.endsWith('.png'))) {
  const a = PNG.sync.read(await readFile(before + '/' + file)),
    b = PNG.sync.read(await readFile(after + '/' + file));
  let pixels = null,
    ratio = null;
  const sameSize = a.width === b.width && a.height === b.height;
  if (sameSize) {
    const diff = new PNG({ width: a.width, height: a.height });
    pixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
    ratio = pixels / (a.width * a.height);
    if (pixels) await writeFile(out + '/' + file, PNG.sync.write(diff));
  }
  report.push({ file, before: [a.width, a.height], after: [b.width, b.height], pixels, ratio });
}
await writeFile(out + '/summary.json', JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      screenshots: report.length,
      exact: report.filter((x) => x.pixels === 0).length,
      dimensionChanges: report.filter((x) => x.pixels === null).length,
      maxRatio: Math.max(...report.map((x) => x.ratio || 0)),
    },
    null,
    2,
  ),
);
