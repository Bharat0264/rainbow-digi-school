import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const results = [];
for (const width of [390, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
  });
  const page = await context.newPage();
  for (const path of [
    "/",
    "/about",
    "/academics",
    "/admissions",
    "/campus",
    "/events",
    "/contact",
    "/privacy-policy",
  ]) {
    await page.goto("http://127.0.0.1:4211" + path, {
      waitUntil: "networkidle",
    });
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    results.push({
      width,
      path,
      violations: scan.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
  }
  await context.close();
}
await writeFile(
  "artifacts/premium-accessibility.json",
  JSON.stringify(results, null, 2),
);
console.log(
  JSON.stringify(
    results.filter((r) => r.violations.length),
    null,
    2,
  ),
);
console.log(
  "Scanned 16 route/viewport combinations; automated scans do not establish full WCAG conformance.",
);
await browser.close();
if (results.some((r) => r.violations.length)) process.exitCode = 1;
