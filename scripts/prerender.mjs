import { createServer } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import {
  SITE_URL,
  SEO_ROUTES,
  pageSeo,
  structuredData,
  socialMeta,
  twitterMeta,
} from "../src/data/seo.js";

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const meta = (attribute, key, value) =>
  `<meta ${attribute}="${key}" content="${escape(value)}" />`;
function head(path) {
  const page = pageSeo(path);
  const tags = [
    `<title>${escape(page.title)}</title>`,
    meta("name", "description", page.description),
    meta("name", "robots", page.noindex ? "noindex, follow" : "index, follow"),
  ];
  if (!page.noindex)
    tags.push(`<link rel="canonical" href="${SITE_URL}${page.path}" />`);
  Object.entries(socialMeta(page)).forEach(([key, value]) =>
    tags.push(meta("property", `og:${key}`, value)),
  );
  Object.entries(twitterMeta(page)).forEach(([key, value]) =>
    tags.push(meta("name", `twitter:${key}`, value)),
  );
  const data = structuredData(path);
  if (data)
    tags.push(
      `<script id="school-schema" type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`,
    );
  return tags.join("\n    ");
}
const template = await readFile(resolve("dist/index.html"), "utf8");
if (
  !template.includes("<!-- seo:start -->") ||
  !template.includes('<div id="root"></div>')
)
  throw new Error("Prerender template markers missing.");
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { render } = await server.ssrLoadModule("/src/entry-prerender.jsx");
  for (const path of [...Object.keys(SEO_ROUTES), "/404"]) {
    const content = render(path);
    if (!content.includes("<h1") || content.length < 500)
      throw new Error(`Incomplete rendered page: ${path}`);
    const html = template
      .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, head(path))
      .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
    const file =
      path === "/"
        ? "dist/index.html"
        : path === "/404"
          ? "dist/404.html"
          : `dist${path}.html`;
    await mkdir(dirname(resolve(file)), { recursive: true });
    await writeFile(resolve(file), html);
    console.log(`Prerendered ${path}`);
  }
  await writeFile(
    resolve("dist/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.entries(
      SEO_ROUTES,
    )
      .filter(([, page]) => !page.noindex)
      .map(([path]) => path)
      .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
      .join("\n")}\n</urlset>\n`,
  );
  await writeFile(
    resolve("dist/robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  );
} finally {
  await server.close();
}
