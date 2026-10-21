import { readFile } from 'node:fs/promises';
const root = process.argv[2] || 'artifacts/review-round-1';
const before = JSON.parse(await readFile(`${root}/before/lighthouse/summary.json`, 'utf8'));
const after = JSON.parse(await readFile(`${root}/after/lighthouse/summary.json`, 'utf8'));
const failures = [];
for (const row of after) {
  const old = before.find((x) => x.route === row.route && x.mode === row.mode);
  if (!old) {
    failures.push(`Missing baseline: ${row.mode} ${row.route}`);
    continue;
  }
  if (row.performance < old.performance)
    failures.push(`Performance regressed: ${row.mode} ${row.route}`);
  if (
    row.mode === 'mobile' &&
    (row.performance < 95 || row.lcp > 1800 || row.cls > 0.02 || row.tbt > 150)
  )
    failures.push(`Mobile target not met: ${row.route}`);
}
const diff = JSON.parse(await readFile(`${root}/comparison/summary.json`, 'utf8'));
for (const row of diff)
  if (row.pixels === null || row.pixels > 0)
    failures.push(`Visual review required: ${row.file} (${row.pixels ?? 'dimensions'})`);
console.log(JSON.stringify({ passed: failures.length === 0, failures }, null, 2));
if (failures.length) process.exitCode = 1;
