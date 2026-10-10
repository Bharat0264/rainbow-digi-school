import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { SEO_ROUTES, SITE_URL } from "../src/data/seo.js";

const titles = new Set();
for (const [path, seo] of Object.entries(SEO_ROUTES)) {
  const html = await readFile(path === "/" ? "dist/index.html" : `dist${path}.html`, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `Unique title ${path}`); titles.add(title);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One visible H1 ${path}`);
  assert.ok(html.includes('property="og:image"'), `Social metadata ${path}`);
  if (seo.noindex) {
    assert.ok(html.includes('noindex, follow'), `Noindex ${path}`);
    assert.ok(!html.includes('rel="canonical"'), `No canonical ${path}`);
  } else {
    assert.ok(html.includes(`href="${SITE_URL}${path}"`), `Canonical ${path}`);
    const schema = JSON.parse(html.match(/<script id="school-schema" type="application\/ld\+json">(.*?)<\/script>/s)?.[1]);
    const serialized = JSON.stringify(schema);
    assert.ok(serialized.includes("OpeningHoursSpecification"), `Hours schema ${path}`);
    assert.ok(serialized.includes("sameAs"), `Social schema ${path}`);
    if (path === "/admissions") assert.ok(serialized.includes("FAQPage"), "Admissions FAQ schema");
  }
}
const sitemap = await readFile("dist/sitemap.xml", "utf8");
assert.equal((sitemap.match(/<loc>/g) || []).length, 5);
assert.ok(!sitemap.includes("privacy-policy"));
assert.ok((await readFile("dist/robots.txt", "utf8")).includes(`${SITE_URL}/sitemap.xml`));
assert.ok((await stat("dist/social-card.png")).size > 1000);
console.log(`PASS: ${titles.size} prerendered routes, five-page sitemap, metadata, canonical URLs and structured data.`);
