import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const seen = new Set();
const entries = Object.entries(manifest)
  .filter(([, v]) => v.isEntry)
  .map(([k]) => k);
function visit(key) {
  if (seen.has(key)) return;
  seen.add(key);
  for (const i of manifest[key]?.imports || []) visit(i);
}
entries.forEach(visit);
const initial = [
  ...new Set([...seen].flatMap((k) => [manifest[k].file, ...(manifest[k].css || [])])),
];
const chunks = [];
for (const file of await readdir('dist/assets')) {
  if (!/\.(js|css)$/.test(file)) continue;
  const p = 'assets/' + file,
    data = await readFile('dist/' + p);
  chunks.push({
    file: p,
    bytes: data.length,
    gzip: gzipSync(data).length,
    initial: initial.includes(p),
  });
}
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const report = {
  chunks,
  initialJS: chunks
    .filter((x) => x.initial && x.file.endsWith('.js'))
    .reduce((s, x) => s + x.bytes, 0),
  initialCSS: chunks
    .filter((x) => x.initial && x.file.endsWith('.css'))
    .reduce((s, x) => s + x.bytes, 0),
  dependencies: Object.keys(pkg.dependencies).length,
  devDependencies: Object.keys(pkg.devDependencies).length,
  trackedFiles: execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n').length,
};
await mkdir('artifacts/review-round-1', { recursive: true });
await writeFile('artifacts/review-round-1/bundle-after.json', JSON.stringify(report, null, 2));
console.table(chunks);
