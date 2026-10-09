# Scroll performance audit and changes — 9 October 2026

Baseline: `3661fb7366de0ef6b13a776b15a12981402699ca`. Audit was reported before implementation.

## Findings and fixes

| File | Finding | Change |
| --- | --- | --- |
| `src/components/ui/PaintCanvasV2.jsx` | Each painted section used three scroll-linked transforms over SVG turbulence, displacement and specular lighting. Duplicate filter IDs also occurred across repeated moods. | Baked the original paths, palette, opacity and oil filter into four static 1600×1000 transparent WebP assets (about 153 kB total). No scroll hooks or runtime paint filters. |
| `src/painted-glass-v2.css` | Broad 20px backdrop blur, saturation and multiple large inset/exterior shadows. | Translucent fills, original rounded geometry and highlight borders remain; use a small shadow. Only the two desktop hero buttons request 8px backdrop blur; mobile uses the translucent fill. |
| `src/App.jsx` | Lenis intercepted native scrolling and recursively requested animation frames without cancelling on cleanup. Preloader delayed mounting content by 850ms. | Removed Lenis and its dependency, removed artificial loading delay. Route-level lazy loading and Suspense remain. |
| `PaintedHeroV2.jsx`, `PaintedProgramsCardV2.jsx` | Endless floating panels; pointer coordinates drove React state, gradient repaint and 3D tilt. | Static hero artwork, static soft radial color accents, gentle CSS scale feedback. |
| `SmartImage.jsx`, `src/data/images.js` | Homepage JPEG paths do not exist in the repository. Requests failed before fallback rendering; image load changed blur/scale; fallback icons floated indefinitely. | Detect available local files at build time, prefer WebP if provided, immediately render the same existing placeholders for missing images. Remove load blur and fallback animation. Add image dimensions and async decoding. No school photos were invented. |
| `CountUp.jsx` | Three counters updated React each animation frame for two seconds, without cancelling their scheduled frame on unmount. | Render final values immediately. |
| Painted home sections, new `Reveal.jsx` | Multiple Motion subscriptions and staggered decorations. | One shared IntersectionObserver, once-only 20px/500ms opacity/transform reveals, temporary `will-change` cleared on completion/cancellation. Static components memoized. Reduced-motion bypasses these reveals. |
| `src/pages/About.jsx`, `Academics.jsx`, `CampusGallery.jsx` | Remote images without explicit dimensions; large backdrop/shadow effects and exaggerated hover scaling. | Dimensions, async decoding, lazy loading; Unsplash requests explicitly use WebP at bounded width/quality. Lighter shadows, no panel blur, 1.02 hover scaling. |
| `src/pages/Admissions.jsx` | FAQ animated height. | Opacity-only transition; backend and form submission behavior unchanged. |
| Secondary pages, content MotionConfig | Oversized entrance movements and viewport-height units. | 20px one-time entrances; content-only reduced-motion configuration; `100svh` minimums on pages. |
| Below-the-fold homepage sections | All sections painted even when far outside the viewport. | `content-visibility: auto` with remembered intrinsic size. |
| `src/pages/About.jsx`, `EventsNews.jsx` | Browser verification found a mobile decoration overflow and a pre-existing missing `SCHOOL` import that crashed Events. | Contained the mobile decoration; added the missing frontend import. |

No video, marquee, mix-blend-mode or continuously animated background-position was found in the active content. No new runtime dependencies were added. Legacy global CSS was intentionally preserved because it contains navbar rules. Blanket memoization of callbacks/objects was avoided where no memoized consumer exists.

## Measurements

Chrome headless, production Vite preview, Lighthouse mobile defaults, same host and URL (`http://127.0.0.1:4173/`) before/after. Single sequential lab runs; scores are not field Core Web Vitals. An early run contaminated by concurrent tool installation/browser work was discarded and replaced by the sequential baseline below.

| Metric | Before | After |
| --- | ---: | ---: |
| Lighthouse mobile Performance | 70 | 75 |
| LCP | 3.724 s | 3.726 s |
| CLS | 0 | 0 |
| TBT | 280.9 ms | 250.5 ms |
| Entry JS, uncompressed | 447.29 kB | 418.36 kB |
| Entry JS, gzip | 143.42 kB | 134.40 kB |
| Home chunk, uncompressed | 19.83 kB | about 18.6 kB |
| CSS, uncompressed | 78.23 kB | 76.90 kB |

Separate live baseline: Performance **46**, LCP **3.561 s**, CLS **0.0043**, TBT **2866.5 ms**. Do not compare this network-hosted result directly with localhost. Post-deployment measurements are added separately when available.

Scroll trace: Chrome DevTools Protocol, 390×844 viewport, 4× CPU slowdown, twelve 400px wheel inputs separated by 500ms. Both runs reached `scrollY=4800`, with final page height 5924px. Touch synthesis did not move this headless browser and was rejected as a measurement; these are wheel-driven mobile-viewport tests, not a physical-phone certification.

| Scroll measurement | Before | After |
| --- | ---: | ---: |
| Median rAF interval | 99.7 ms | 33.2 ms |
| p95 rAF interval | 216.0 ms | 116.3 ms |
| Long tasks >≈50ms | 69 | 35 |
| Longest task | 294 ms | 987 ms |

**60fps and zero long tasks were not achieved.** The final trace still has 368 layout events: 356 are rooted at `svg class='bn-scene'`, including off-screen layouts. The other 12 are document layouts; the largest document layout took 776.8ms wall time during content activation. Thus the worst single stall did not improve, even though median/p95 frame intervals and total long-task count improved. Host scheduling and emulation affect these measurements; no physical mid-range mobile device was available.

The protected navbar retains its pendulum rAF loops, per-frame React state updates, geometry reads, scroll-driven compact state, SVG effects and animations. No claim is made that this pass eliminated all jank. Removing its remaining costs would conflict with the explicit navbar freeze.

## Verification and protected scope

- Production build succeeds. Targeted lint of changed core components succeeds. Full-project lint encounters the existing non-UTF-8 `rewrite3.cjs` and existing warnings; it is not claimed clean.
- Eight routes checked at 390px and 1440px, with follow-up checks for the two discovered frontend defects. No route crash after the Events import fix. No mobile horizontal overflow after the About fix.
- All six homepage content sections checked with normal and reduced motion: no in-viewport hidden reveals, no lingering `will-change`, zero running content animations after reveals finish.
- Mobile Menu board opens and its navigation link works. No enquiry was submitted; backend behavior was not altered or tested by creating records.
- `measurements.json` records before/after numbers and Git blob identities for navbar sources, styles, shared logo assets, `index.css`, and `index.html`. These repository bytes are identical to baseline (Windows checkout line endings are normalized by Git).

Protected-path proof (empty output):

```sh
git diff 3661fb7 -- src/components/layout/BranchNav.jsx src/components/layout/BranchNav.css src/components/layout/BranchNavArt.jsx src/components/layout/Navbar.jsx src/components/nav src/data/nav.js src/index.css src/components/ui/Logo.jsx public/logo.svg public/logo-mark.svg index.html api prisma server
```

Full Lighthouse JSON, DevTools traces, screenshots and the measurement scripts are retained locally in `%TEMP%/rainbow-perf-tools`; only the compact evidence is committed. Test tooling (Lighthouse, Playwright, Sharp) was installed in that separate temporary directory, not added to the application.
