import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { SEO_ROUTES, SITE_URL } from '../src/data/seo.js';

const titles = new Set();
for (const [path, seo] of Object.entries(SEO_ROUTES)) {
  const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `Unique title ${path}`); titles.add(title);
  assert.ok(html.includes(`href="${SITE_URL}${path}"`), `Canonical ${path}`);
  assert.ok(html.includes('property="og:image"'), `Social metadata ${path}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One visible heading ${path}`);
  assert.ok(!html.includes('noindex'), `Indexable ${path}`);
  assert.ok(!/>404<\/h1>/.test(html), `Real route content ${path}`);
  const schema = JSON.parse(html.match(/<script id="school-schema" type="application\/ld\+json">(.*?)<\/script>/s)?.[1]);
  assert.equal(schema['@graph'][0]['@type'], 'School');
  assert.ok(!JSON.stringify(schema).match(/aggregateRating|openingHours|foundingDate/), `Unverified claims omitted ${path}`);
  assert.ok(seo.description.length > 70);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, Object.keys(SEO_ROUTES).length);
assert.ok(!sitemap.includes('/404'));
assert.ok((await readFile('dist/robots.txt', 'utf8')).includes(`${SITE_URL}/sitemap.xml`));
const missing = await readFile('dist/404.html', 'utf8');
assert.ok(missing.includes('noindex, follow'));
assert.ok(!missing.includes('rel="canonical"'));
assert.ok((await stat('dist/social-card.png')).size > 1000);
console.log(`PASS: ${titles.size} prerendered routes, unique metadata, schema, sitemap, robots, social asset and noindex 404.`);
