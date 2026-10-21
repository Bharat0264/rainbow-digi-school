# Review round 1 — Rainbow Digi School

Date: 21 October 2026 (Asia/Calcutta). Agent: Codex.

**Disposition: HOLD — do not merge or promote.** Local code/test gates pass, but the performance gate does not pass. Current-commit deployed-preview equivalence, field INP and actual admissions email delivery are not verified. Existing production contrast defects need a client-facing colour decision. Main and production also contain different work; neither was overwritten.

## Safe setup and provenance

- Both existing working trees were clean at start. Fetched `origin`; `git pull --rebase origin main` in the clean main checkout reported already up to date. No force push, shared reset or history rewrite.
- Production URL: https://rainbow-digi-school.vercel.app. GitHub's latest successful Vercel **Production** deployment at baseline was deployment `7227797590`, SHA `e258ca4a28ed23c135cea11d04aadc4975dc8829`, with successful deployment status and Vercel URL `https://rainbow-digi-school-af3ozhbna-bharat0264s-projects.vercel.app`.
- Main was `24576794d49f528d3423c245b88fa74a29cf0e3c`. Production and main diverge: **40 production-only commits / 9 main-only commits**, with changes across 90 files. Main contains newer squirrel/hero work and lacks much of the production gallery/contact work. Reviewing main as if it were production would be incorrect.
- Tagged the exact baseline `pre-review-round-1`; created `review/round-1` from production in `C:/SCHOOL-review-round-1`. Pushed only this branch and review tags to `origin`, never `old-origin`. Main is unchanged.
- A successful preview exists for earlier review commit `c7cfa88` at `https://rainbow-digi-school-2vnuuycxr-bharat0264s-projects.vercel.app`. This is **not** proof for the current review commit. The stored CLI credential was expired; linking the current project failed. The ensuing device-login wait was cancelled, no auth token contents were inspected or exposed, and no temporary/unowned deployment was created.

## Baseline and comparison coverage

Crawled `/`, `/academics`, `/admissions`, `/campus`, `/school-life`, `/contact`, `/privacy-policy`, `/404` at **390, 768, 1024, 1440 and 1920px**: 40 before and 40 after full-page screenshots, complete request inventories, decoded/encoded resource sizes, initial lab LCP/CLS observers, console diagnostics, image dimensions/alt checks, overflow, text and links. Added mobile-menu, dropdown, validation-error and all four album last-spread states at 390/1440px. Used reduced motion for reproducible full-page captures, and normal motion separately for interactions. Real unknown production URLs return 404; explicit `/404` is a noindex HTML page and returns 200. GET `/api/enquiries` correctly returns 405.

An immutable local evidence ZIP and its SHA-256 are saved as `artifacts/review-round-1-evidence.zip` and [evidence/archive.sha256](evidence/archive.sha256). Raw evidence is local in `artifacts/review-round-1/{before,after,comparison}`. Public numerical evidence is in [round-1-summary.json](evidence/round-1-summary.json). Raw screenshots and reports are intentionally ignored rather than adding large generated files to source control. CI uploads browser reports/traces; the manual deployed-review workflow uploads its crawl/Lighthouse evidence.

### Summary

The after transfer measurements below are **local preview** measurements; Lighthouse before is the real Vercel CDN, while after is local HTTP/1.1. The serving stacks differ. Those scores are not an apples-to-apples CDN improvement claim; the regression blocks promotion until the same deployed-preview measurement is rerun. Do not present local lab estimates as real-user Core Web Vitals.

| Metric | Production before | Review after | Interpretation |
|---|---:|---:|---|
| Home full crawl transfer at 390px | 9,236.9 kB | 7,004.3 kB | 24.2% less; includes eagerly decoded below-fold images for inventory |
| Initial JS, decoded/raw | 407.0 kB | 387.5 kB | Same entry graph method; album viewer now lazy |
| Initial CSS, decoded/raw | 124.4 kB | 119.0 kB | Paper-viewer CSS is lazy; local font faces included |
| Runtime direct dependencies | 7 | 6 | Removed obsolete `page-flip` |
| Development direct dependencies | 16 | 24 | Added explicit QA tools; removed `@vercel/node` and unused Puppeteer |
| Project npm audit findings | 11 (10 high, 1 moderate) | 0 | No force/major upgrade; type-only Vercel toolchain removed and safe patch applied |
| Source files removed | 0 | 22 | 84,018 bytes; rendered PaperPage extracted intact |
| Tracked file count | 376 | 391, including review documentation | QA, licences, local fonts and review evidence intentionally add files |
| Screenshot dimensions | 40 baselines | 40 unchanged dimensions | No layout-size changes |
| Screenshot comparison | — | 22 with no detected difference; 18 flagged | Pixelmatch threshold 0.1, AA exclusion; maximum 0.02786% changed pixels |
| Console JS errors / broken decoded images / horizontal overflow | 0 / 0 / 0 | 0 / 0 / 0 | All 40 captures |
| Real-user INP | Unavailable | Unavailable | No RUM/CrUX evidence available; never substitute TBT for INP |

### Per-route Lighthouse (one cold lab run per mode)

`P` = performance score, `LCP` seconds. Before is production CDN; after is local preview, **not a deployment acceptance measurement**. Detailed CLS, TBT, accessibility and transfer sizes remain in the JSON evidence.

| Route | Mobile before P / LCP | Mobile local after P / LCP | Desktop before P / LCP | Desktop local after P / LCP |
|---|---:|---:|---:|---:|
| / | 95 / 2.56s | 74 / 12.61s | 88 / 2.23s | 76 / 5.96s |
| /academics | 83 / 3.92s | 85 / 4.14s | 81 / 3.12s | 76 / 5.68s |
| /admissions | 69 / 5.89s | 74 / 12.61s | 76 / 2.85s | 76 / 5.93s |
| /campus | 79 / 4.14s | 85 / 4.13s | 97 / 1.14s | 77 / 4.90s |
| /school-life | 89 / 2.92s | 74 / 11.78s | 85 / 2.70s | 76 / 5.98s |
| /contact | 94 / 2.65s | 85 / 4.13s | 95 / 1.28s | 81 / 3.51s |
| /privacy-policy | 93 / 2.74s | 74 / 11.48s | 88 / 2.01s | 78 / 4.77s |
| /404 | 95 / 2.61s | 74 / 11.42s | 85 / 2.28s | 78 / 4.78s |

The mobile targets (P>=95, LCP<=1.8s, CLS<=0.02, INP<=150ms, TBT<=150ms) are **not collectively met**. Large production artwork is still oversized: the lossless label conversion saves transfer but retains the source resolution to avoid resampling artwork. A second responsive-resizing pass and a current Vercel preview are required before claiming the targets; this review does not claim those targets are impossible. No source image was replaced or recoloured.

### Per-route transfer (1440px full inventory)

| Route | Before | Local after |
|---|---:|---:|
| / | 9,799.2 kB | 7,566.4 kB |
| /academics | 9,374.3 kB | 7,141.5 kB |
| /admissions | 9,610.0 kB | 7,393.7 kB |
| /campus | 9,962.8 kB | 7,713.4 kB |
| /school-life | 9,725.1 kB | 7,393.1 kB |
| /contact | 9,324.1 kB | 7,091.5 kB |
| /privacy-policy | 9,195.9 kB | 6,980.0 kB |
| /404 | 9,194.6 kB | 6,978.7 kB |

## Bugs and fixes

| Severity | Finding / cause | Resolution / evidence |
|---|---|---|
| Medium | SSR pre-rendering emitted development `/src/assets/...` URLs and React resource hints. Production requested nonexistent images before the client replaced them. | Build emits a Vite manifest; prerender maps every source asset URL to its exact hashed file and fails if missing. The after crawl and all route smoke tests have no asset 404s. |
| High (build tooling, not a proved client exploit) | Type-only `@vercel/node` dependency pulled the vulnerable undici/busboy/path-to-regexp/ts-morph chain. | Replaced it with the exact handler adapter contract based on Node request headers/method/body; removed the type package. Strict API typecheck and 23 API scenarios pass; project audit has zero findings. Vercel-managed platform packages are outside this npm audit. |
| Low | Six visible label images omitted width/height metadata. | Added measured native dimensions. All after image checks pass; final screenshot dimensions unchanged. |
| Performance | Six 1MB PNG labels, external font stylesheet/handshakes, eager album JS/CSS and an unreachable page-flip renderer. | Lossless WebP with original PNGs retained; exact Latin font binaries self-hosted with upstream OFL licences; only heading/body font preloads; lazy AlbumViewer; extracted live HTML PaperPage and removed unused renderer/package; immutable caching for hashed assets/fonts. |
| Low | New-tab footer links omitted explicit noreferrer. | Added `noopener noreferrer`; destinations and displayed labels unchanged. |
| CI | First Linux run rejected optional WASM dependencies missing from the Windows-generated lockfile. | Rebuilt the complete optional-dependency lock in an empty package context, pinned direct versions and Node/npm. CI runs `39619411757` and `39621988042` passed all install/lint/typecheck/build/tests steps. Later review-only runs are tracked on the branch. |

The mobile-menu test initially failed because its locator used the old accessible name after the button correctly changed from Open to Close. The test was fixed; this was not a production navigation bug.

## Functional, security and lifecycle review

- 28 Playwright desktop/mobile smoke tests pass; a separate 20-case album check at 4x CPU slowdown passes across all five widths: every content route, images, footer links, navigation/back/forward, route scroll reset, mobile menu Escape/focus, form validation/class choice/reset, mocked success, all four albums, final spread, covers, grid/lightbox, Escape and reduced motion. API tests cover 23 validation/origin/payload/storage/redirect/error cases using synthetic data and injected/mocked storage.
- Actual school records were not created and actual email receipt was **not verified**. A mocked `emailSent` result does not prove mailbox delivery.
- Read-only checks of every distinct internal/external anchor destination returned 200 (including Google Maps, Instagram and Garuda). mailto/tel links are syntax-only checks, not calls/messages.
- Production sends nosniff, DENY frame protection, strict-origin referrer and restricted permissions policies, and Brotli compression. These were preserved. No enforcing CSP was added without a report-only deployment observation window.
- API already validates/trims fields with Zod, checks exact allowed origins, fails closed without config, bounds JSON payloads, rejects the honeypot and redacts diagnostic secrets. Apps Script sanitizes spreadsheet cells and uses a shared secret and document lock. **No durable public API rate limiter exists**; this remains a high-priority decision. Per-instance memory counters would not provide dependable serverless abuse protection, so none was misrepresented as a complete fix.
- Common credential-token/private-key patterns were checked across tracked text history and no matching credential was found. This is a bounded scan, not proof that every historical string is non-secret. Ignored environment files and CLI auth token contents were not printed. No history was rewritten.
- Legacy `server/school.db` and its read-only reader were retained, with no records inspected or deleted. Their lifecycle is a school-data decision, not dead-code cleanup.
- Reviewed effects/timers/observers: squirrel animation already pauses on IntersectionObserver/document visibility and destroys listeners, timers, observers and RAF; dropdown/form reset listeners and album timers clean up on unmount. Removed permanent canvas will-change and dead gallery hint-state updates. No exhaustive heap-retention proof or real-device FPS guarantee is claimed.
- TypeScript strict mode covers the serverless API; frontend remains JavaScript and is checked by strict ESLint/Oxlint. No unnecessary JSX-to-TS rewrite was attempted.

## Visual comparison requiring final review

All 40 full-page images retain the same dimensions and content. Eighteen have small detected differences, confined to shared navigation/artwork rendering in inspected examples (e.g. 216 pixels in the mobile navigation region, not text/layout changes). Lossless WebP preserves visible source colours; transparent RGB data may be discarded by the encoder. Canvas timing and rasterization are not guaranteed byte-identical. The raw difference images and all per-image ratios are retained. These differences are **listed**, not silently labelled a zero-difference acceptance pass.

## Deletion log

No public asset requested by the production inventory was deleted. Native label PNGs, production photos, metadata, sitemap/robots generation, favicons, API/storage integration and legacy database remain. Knip's dynamic-entry false positive for `src/entry-prerender.jsx` was explicitly retained. Documentation/config references were checked, not just imports.

Machine-readable proof: [deletions.json](evidence/deletions.json). Reason for each removed candidate: no references from retained source/scripts/docs/config, no production request in 40 traces, and unused source graph (including closed unused subgraphs).

| Path | Bytes | Reason |
|---|---:|---|
| `src/components/gallery/ScrapbookSpread.jsx` | 1,452 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/AboutTeaser.jsx` | 2,210 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/AdmissionsCTA.jsx` | 1,446 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/HeroSection.jsx` | 2,206 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/PaintedAboutTeaserV2.jsx` | 8,973 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/PaintedAdmissionsCTAV2.jsx` | 6,698 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/PaintedCampusGalleryV2.jsx` | 4,274 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/PaintedPhotoStripV2.jsx` | 4,735 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/PaintedStatsSectionV2.jsx` | 5,298 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/PaintedTestimonialsSectionV2.jsx` | 1,738 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/PhotoStrip.jsx` | 478 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/ProgramsPreview.jsx` | 1,320 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/StatsSection.jsx` | 1,812 | Unused closed source graph; no retained references or production requests. |
| `src/components/home/TestimonialsSection.jsx` | 1,884 | Unused closed source graph; no retained references or production requests. |
| `src/components/layout/PaintedFooterV2.jsx` | 12,759 | Unused closed source graph; no retained references or production requests. |
| `src/components/layout/navFloraConfig.js` | 6,447 | Unused closed source graph; no retained references or production requests. |
| `src/components/ui/AnimatedHeading.jsx` | 1,302 | Unused closed source graph; no retained references or production requests. |
| `src/components/ui/ClayButton.jsx` | 760 | Unused closed source graph; no retained references or production requests. |
| `src/components/ui/ClayCard.jsx` | 624 | Unused closed source graph; no retained references or production requests. |
| `src/components/ui/Crayon.jsx` | 1,968 | Unused closed source graph; no retained references or production requests. |
| `src/components/ui/MagneticButton.jsx` | 2,108 | Unused closed source graph; no retained references or production requests. |
| `src/components/gallery/PageTurnBook.jsx` | 13,526 | Extracted live HTML; removed default renderer with no callers. |

Dependencies removed: runtime `page-flip` (no rendered caller), dev `@vercel/node` (only type import replaced), dev `puppeteer` (only package declaration, no imports/scripts/config references). New dependencies are explicit **development QA tools**, not new site features. `framer-motion`, some old components/scripts and old assets remain because maintenance/documentation references exist or production requested them; do not blindly delete Knip output. Unused CSS selectors whose strings appear in maintenance tests were retained rather than purged with uncertain proof.

## Changes by commit

- 5218514 fix [Codex]: resolve prerendered image URLs through build manifest
- d873ba2 refactor [Codex]: remove proven dormant UI and obsolete flip renderer
- dbf115a chore [Codex]: add review gates and replace vulnerable API type tooling
- 2fe3edb perf [Codex]: self-host fonts and losslessly compress navigation labels
- c7cfa88 fix [Codex]: harden external footer link isolation
- e27b907 fix [Codex]: preload critical fonts and complete cross-platform lockfile
- 6daaf20 chore [Codex]: automate deployed final-review comparison gates
- fbdaeed chore [Codex]: remove unused Puppeteer installation
- eb5cda7 test [Codex]: verify rapid form submits and 4x CPU album turns

This report/README/agent-rule commit follows those implementation commits. No application copy, route, environment variable name or supplied photo content was changed.

## Verification gates and needs decision

| Gate | Result |
|---|---|
| Clean install, lint (zero warnings), strict API typecheck, build | PASS locally and in CI at `e27b907` |
| 23 API scenarios, SEO checks, 28 browser tests | PASS; mocked API only |
| Source-asset 404s, new JS errors, overflow / missing decoded images | PASS locally |
| Current deployed preview screenshot equivalence | NOT VERIFIED; only earlier preview `c7cfa88` was available; CLI credentials expired |
| Performance equal/better on all deployed routes and mobile targets | FAIL / NOT VERIFIED; local lab regression recorded, no current comparable CDN run |
| Accessibility | Existing serious contrast failures persist on home, academics and school-life at both tested widths; no new violations |
| Actual email delivery and production storage error path | NOT VERIFIED; requires approved staging recipient and mailbox/log access |
| Main integration | HOLD; production/main diverge substantially. Do not overwrite either history. |

Decisions required before promotion:

1. Make a current preview of `review/round-1` available, then rerun the deployed baseline workflow. Authenticate Vercel locally or provide a current preview URL; do not paste credentials into chat or source.
2. Approve minimal contrast colour fixes or explicitly retain the production palette with documented accessibility exceptions. Gold/green stage text and preview captions are the known affected areas; see axe targets in the evidence.
3. Select durable rate limiting (Vercel WAF/platform configuration or approved shared storage) without silently introducing a new service/env contract.
4. Provide an approved staging email recipient/log/mailbox verification route for end-to-end delivery. Keep synthetic tests separate from school records.
5. Reconcile the nine main-only commits against the production-based review branch before any merge. Stop for conflicts rather than choosing a winner automatically.
6. Decide separately whether to retire legacy SQLite data/readers, referenced historical design scripts/components and the retained framer-motion dependency. No data deletion was performed.

## Fast final review / round 2 freeze

- Verify the latest successful production SHA again and freeze its immutable deployment URL as the baseline; do not assume the canonical alias stayed unchanged.
- `npm ci`; `npx playwright install chromium`; `npm run lint`; `npm run typecheck`; `npm run build`; `npm test`; `npm audit`; `npm run analyze`.
- Deploy the current task branch as **Preview**. Run the manual `Review gates` workflow with the frozen production URL and this current preview URL. It captures all five widths/key states, axe, per-route mobile/desktop Lighthouse and pixel differences; `npm run review:gates` deliberately exits nonzero for regression/target/visual-review failures. Review the artifact ZIP before promotion.
- Recheck keyboard focus, phone/email/maps destinations, mobile touch/slow and rapid flips, final pages, missing/broken images, reduced motion, 4x CPU and offscreen animation cleanup after client edits.
- Verify staging storage and actual email receipt, then remove only approved synthetic test records through the school's normal data process.
- Review the exact contrast changes/differences and the main-only changes. Acknowledge all exceptions; do not weaken tests to greenwash them.
- Freeze: bug fixes only; no new features, redesigns, dependencies or route/env renames. Direct dependency versions are pinned and the lockfile is committed. Never rewrite shared history or force push.
- Merge only after **all** agreed gates pass. Then smoke-test canonical production and compare its deployment SHA. This round did **not** merge or promote.

Rollback (if a later approved merge is deployed): **Vercel Instant Rollback to production deployment `e258ca4`**, or `git revert -m 1 <approved-merge-commit> && git push origin main`. No reset/force push. At this hold point production needs no rollback because it was unchanged.
