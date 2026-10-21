# Rainbow Digi School

Production: https://rainbow-digi-school.vercel.app

React 19 + Vite website with seven public content routes, a client-side not-found page, a branch navigation animation and HTML photo albums. The live production deployment is the visual and behavioral baseline. Do not redesign it during a review.

## Setup

Use Node 24.13.x and npm 11.6.2. Run `npm ci`, then `npm run dev` for the UI. Run `npm run build` and `npm start` to inspect the production build. Vite's UI dev/preview server does not implement the deployed `/api/enquiries` serverless endpoint.

`npm run start:legacy` explicitly starts the old read-only local SQLite service alongside the UI; it is not the public admissions backend. Preserve `server/school.db`; do not delete school records as part of cleanup.

## Commands

- `npm run lint`: ESLint with zero warnings, then Oxlint for source and API.
- `npm run typecheck`: strict TypeScript for the API adapter. Frontend files remain JavaScript; this does not claim strict TypeScript coverage for JSX.
- `npm run build`: Vite assets/manifest and route HTML, sitemap, robots and structured metadata. The manifest resolves SSR source image URLs to deployed hashed URLs.
- `npm test`: 23 synthetic API scenarios, SEO checks and desktop/mobile Playwright smoke tests. Run the build first. Browser form requests are mocked and never create school records or send email.
- `npm run test:smoke`: browser tests only. Install Chromium first with `npx playwright install chromium`.
- `npm run analyze`: initial/lazy JS and CSS raw/gzip sizes in `artifacts/review-round-1/bundle-after.json`.
- `npm run format`: opt-in Prettier formatting. Review scripts/tests use the shared config; legacy source has not been mass-reformatted.

## Environment and deployment

Copy `.env.example` for the **names**, never real credentials. Configure the same names in Vercel:

- `GOOGLE_APPS_SCRIPT_URL`: deployed Google Apps Script `/exec` endpoint.
- `GOOGLE_APPS_SCRIPT_SECRET`: shared server-side secret matching Apps Script properties.
- `ALLOWED_ORIGINS`: exact comma-separated approved frontend origins. The handler fails closed when absent.
- `LEGACY_ADMIN_TOKEN`: optional, only for the loopback-bound legacy reader.

No secret belongs in a `VITE_` variable or the client bundle. See `docs/google-sheets-setup.md` for the existing spreadsheet/email integration. API validation, schema, origin checking, payload limit, honeypot and diagnostic redaction are in `api/enquiries.ts`. Actual email receipt requires an approved staging recipient and mailbox/log access; mocked success is not delivery evidence.

Vercel uses `vercel.json`, `npm run build` and `dist`. Hashed `/assets/` files and content-hashed local font files receive immutable caching; API responses remain `no-store`. Preview deployment and production promotion are distinct. Do not merge if any review gate fails.

## Editing content

School copy, approved contact details and programmes: `src/data/school.js`. Navigation: `src/data/nav.js`. SEO: `src/data/seo.js`. Albums/photo metadata: `src/data/gallery.js`. Keep routes, metadata, public asset paths and env names stable. Do not replace supplied photos or invent school claims.

Fonts are self-hosted copies of the exact Latin font binaries requested by the baseline, with `font-display: swap` and upstream OFL licences in `public/fonts`. Only the heading/body fonts are preloaded. Navigation label WebP files are lossless; their original PNGs remain because production requested those paths.

## Review round 1 / final review

Read `docs/reviews/round-1.md` for provenance, findings, deletion proof, gate status and rollback. Run `node scripts/review/crawl.mjs <base-url> <output-dir>` for all routes at 390/768/1024/1440/1920px. The crawl records public network requests and resource sizes, console errors, overflow, image attributes, DOM text and full-page screenshots. `states.mjs` captures menu/dropdown/form-error/album states and axe scans. `lighthouse.mjs` records a mobile and desktop lab run per route. `compare.mjs` compares the before/after PNGs without overwriting the baseline.

Set `TEST_BASE_URL=<preview-url>` to run smoke tests against a deployed preview. CI uses a local preview otherwise. Private screenshots, traces and raw review outputs remain ignored under `artifacts/`, `test-results/` and `playwright-report/`; GitHub Actions uploads test artifacts. Public summary evidence is committed under `docs/reviews/evidence/`.

Follow `AGENTS.md` and `GEMINI.md`. Keep production and the other agent's branch intact. Freeze dependency versions during the final pass; no new features, dependencies or cosmetic changes without a separate approved task.
