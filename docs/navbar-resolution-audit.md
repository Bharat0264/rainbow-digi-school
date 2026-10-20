# Navbar resolution and transfer audit

Measured 2026-10-20 in Chromium, local production build for Lighthouse; local Vite server for conservative image-payload checks. All KiB values use 1024 bytes. Image payload figures count each URL once and deliberately count uncompressed SVG bytes; transfer measurements include HTTP headers. AVIF is the selected modern format; WebP remains the fallback. No PNG fallback is needed by the supported browsers.

## Before-change audit

At 1440px the branch is 1368 x 271 CSS px. Leaves and birdhouse were baked into that image; clouds were baked into the rainbow image. The maximum scene width is 1800px, requiring a 5400px branch at 3x. The previous 4344px file was a conventional enlargement, not a native high-detail source.

| Asset | Native pixels | CSS size at 1440px | Required 1x / 2x / 3x | Finding |
|---|---|---|---|---|
| Branch + foliage + house | 2172x430; 4344x860 enlarged | 1368x271 | 1368x271 / 2736x542 / 4104x813 | Original too small at 2x/3x |
| Compact canopy | 1536x1024 | Hidden; 371x247 at 390px phone | Phone: 371x247 / 742x494 / 1113x741 | Enough detail; wasteful transfer |
| Rainbow + clouds | 1536x1024 | 1368x313 | 1368x313 / 2736x626 / 4104x939 | Too small; stretched aspect |
| Board background | 297x225 / 594x450 | 134x102 | 135x102 / 269x204 / 403x305 | OK desktop; larger original needed for 3x drawer |
| Logo assembly + monkey | 1106x1422 | 264x339 | 264x340 / 528x679 / 792x1018 | OK, wasteful encoding |
| Gait, each frame | 128x128 | 76x76 canvas | 76x76 / 152x152 / 228x228 | Too small at 2x/3x |
| Portal, each frame | 256x256 | 76x76 canvas | 76x76 / 152x152 / 228x228 | OK here, small at maximum 3x layout |
| Branch wrap, cropped viewport | 1024x1536 | About 25x69 | 25x69 / 50x138 / 75x207 | Wasteful |
| House connector, cropped viewport | 887x1774 | About 24x64 | 25x65 / 49x129 / 73x193 | Wasteful |
| Screw | 256x256 | 9.5x9.5 | 10x10 / 19x19 / 29x29 | Wasteful |
| Board nut | 256x256 | 22x22 | 23x23 / 45x45 / 67x67 | Wasteful |
| Home label | 2006x784 | 79x47 box | 79x48 / 158x95 / 236x142 | Wasteful |
| Academics, Admissions, School Life labels, each | 2172x724 | 109x45 box | 110x46 / 219x91 / 328x136 | Wasteful |
| Campus label | 2097x750 | 100x45 box | 100x46 / 200x91 / 300x136 | Wasteful |
| Contact label | 2172x724 | 100x45 box | 100x46 / 200x91 / 300x136 | Wasteful |

Rope viewport sizes describe the visible crop, not the much larger offscreen SVG image rectangle. Fiber patterns reuse those same files; they do not introduce additional image downloads. Board PNG fallback: 594x450, 640.2 KiB; not requested by the audited browser.

## Before and after, 1440px at DPR 2

| Asset | Before pixels / format | Before KiB | After selected pixels / format | After KiB |
|---|---|---:|---|---:|
| Branch, leaves, birdhouse | 4344x860 WEBP | 861.2 | 3200x633 AVIF + 3200x633 AVIF + 3200x633 AVIF | 264.2 |
| Rainbow and clouds | 1536x1024 WEBP | 127.0 | vector SVG | 3.7 |
| Board texture | 594x450 WEBP | 139.0 | 360x272 AVIF | 19.2 |
| Logo board + monkey | 1106x1422 WEBP | 474.3 | 640x823 AVIF | 63.0 |
| Squirrel gait | 1024x128 WEBP | 33.3 | 2048x256 AVIF | 53.3 |
| Squirrel portal | 1024x256 WEBP | 79.8 | 1024x256 AVIF | 25.6 |
| Rope wrap | 1024x1536 WEBP | 472.3 | vector SVG | 96.9 |
| House connector + rope fiber | 887x1774 WEBP | 228.5 | vector SVG | 73.1 |
| Rail screw | 256x256 WEBP | 26.1 | vector SVG | 11.7 |
| Board nut | 256x256 WEBP | 23.8 | vector SVG | 10.9 |
| home label | 2006x784 PNG | 950.6 | Real DOM text | 0 |
| academics label | 2172x724 PNG | 1092.4 | Real DOM text | 0 |
| admissions label | 2172x724 PNG | 1088.2 | Real DOM text | 0 |
| campus label | 2097x750 PNG | 1085.9 | Real DOM text | 0 |
| school-life label | 2172x724 PNG | 1006.6 | Real DOM text | 0 |
| contact label | 2172x724 PNG | 1147.6 | Real DOM text | 0 |
| **Total** | | **8836.8** | | **621.6** |

The compact canopy changes from one 1536x1024 WebP (954.2 KiB) to three responsive AVIF layers; 390px at 3x selects 1440px-wide layers totaling about 150 KiB. Small details use sizes appropriate to their render size rather than 1600-4800px exports.

## Source preparation and rendering

- Real-ESRGAN `realesrgan-x4plus`, 4x, tiled at 128px, was run offline once on each of the desktop canopy, gait sheet and portal sheet. The supplied Downloads branch original was checked: 2171x724, no resolution advantage over the current composition. A larger existing generated board original (1441x1091) was reused instead of upscaling the reduced board.
- Final desktop master: 7680x1520. Served canopy widths: 1600, 2400, 3200, 4800, 5400. Compact widths: 480, 960, 1440, 1536. Assembly widths: 320, 640, 960, 1106. Board widths: 180, 240, 360, 480, 594, 720. Gait widths: 1024, 2048, 3072. Portal widths: 512, 1024, 1536.
- Raster output uses Lanczos3, light sharpening (sigma .5, flat/jagged amount .3), sRGB, stripped metadata, AVIF quality 60 and WebP quality 85. All exports stay within their master dimensions.
- Original cutout alpha is retained for alignment; exterior low-saturation fringe is cleaned, edge colors borrow neighboring opaque colors, and a .5px source-space feather is applied. Internal wood, fingers, rope coils and straps are retained.
- Branch, foliage, birdhouse, rainbow, boards, logo/monkey and squirrel are independently served. The connected logo/monkey assembly stays unified to preserve finger/bar/strap registration. Six DOM text labels replace the former PNG labels, with their existing words, placement and color families retained; they are independently styled rather than baked into wood.
- Rainbow uses six gradient bands and vector clouds. Rope fibers, wraps and hardware use optimized SVG contour paths derived from the original assets, with the same coordinate frames and measured anchors.
- Picture sources use AVIF then WebP, explicit dimensions and responsive sizes. Branch preload matches the picture source candidates and media query. All navbar art is above the fold in the audited layouts, so it is eager; nothing below the fold was changed.
- Static layers no longer rely on centering transforms; dimensions and static anchors snap to pixels. Squirrel backing-store resolution follows CSS size and DPR up to 3. Sprite sampling uses full decoded image dimensions, separate from srcset density correction. Movement paths, timing, links and mobile indoor behavior remain unchanged. will-change is enabled only during squirrel motion and released when idle.

## Verification

Screenshots and 400% crops are local under `C:/SCHOOL-rope-size/artifacts/`; they are not committed. Inspected leaf edges, bark, rope shading, logo and fingers at DPR 1/2, phone DPR 3, and on a dark header background. Upscaling cannot recover genuine detail missing from the original; some original leaf shading remains soft at 400%. No claim of native 8K artwork is made.

| Viewport / density | Conservative image payload KiB | Network transfer KiB |
|---|---:|---:|
| 1440x900 / 1x | 383.1 | 386.6 |
| 1440x900 / 2x | 621.6 | 625.1 |
| 390x844 / 3x | 340.4 | 343.0 |
| 1895x900 / 2x | 831.2 | 834.7 |
| 1895x900 / 3x | 990.9 | 994.4 |

The 900 KiB artwork budget passes at both audited 2x desktop sizes. The full maximum-width 3x scene is about 991 KiB; the budget requested was specifically 2x. WebP fallback is larger than AVIF and is not represented by the AVIF transfer totals above.

| Mobile Lighthouse, default simulated throttling | Before | After |
|---|---:|---:|
| Performance | 38 | 81 |
| LCP | 22.14s | 4.90s |
| Total blocking time | 1088ms | 37ms |
| CLS | 0 | 0 |

**The 90 score / 2.5s simulated LCP targets are not met.** The remaining critical path includes the existing Google Fonts stylesheet/font chain and page-wide style/layout work, outside the permitted image-only scope. Lighthouse's observed local LCP is about .7s; the simulated throttled metric above is the relevant result, not the observed number. Further page-wide changes have not been silently applied.

Validation: `npm run build`, `npm run typecheck`, `npm run lint` (existing unrelated warnings), `node scripts/verify-navbar-art.mjs`, `node scripts/verify-squirrel-portals.mjs`. The last test covers both portal directions, tail masking, all six tab destinations, initial indoor pose, and mobile resize.

## Changed files and local masters

- `.gitignore`: ignores `design-masters/`.
- `index.html`: responsive branch preloads.
- `src/components/layout/BranchNav.jsx`, `BranchNav.css`, `NavArtwork.jsx`: layered picture serving, real-text labels and pixel-aligned rendering.
- `src/components/layout/NavigationRopes.jsx`: vector asset references; attachment logic is unchanged.
- `src/components/layout/squirrelAnimation.js`: DPR-aware draw surface and sprite source sampling only.
- `public/assets/nav/optimized/`: optimized AVIF/WebP variants and five SVG files.
- `scripts/prepare-navbar-masters.py`, `optimize-navbar-assets.mjs`: offline preparation, not imported by the application. Tool dependencies live in ignored `artifacts/tooling/` (Pillow/numpy/vtracer, sharp/SVGO; official Real-ESRGAN portable executable).
- `scripts/verify-navbar-art.mjs`, `verify-squirrel-portals.mjs`: rendering/budget and animation checks.
- `docs/navbar-resolution-audit.md`, `docs/navbar-art-manifest.json`: measured results and exported dimensions/sizes.

Masters are stored at **`C:/SCHOOL-rope-size/design-masters/`**, including `desktop-master.png` and three 7680px-wide desktop layers, compact layers, board original, assembly original and 4x squirrel sheets. Masters, inference tools, model weights, screenshots and Lighthouse JSON are excluded from Git and are never under `public/`.

Offline reproduction: download the official portable tool from https://github.com/xinntao/Real-ESRGAN/releases, run `realesrgan-ncnn-vulkan.exe -i design-masters/inputs -o design-masters -n realesrgan-x4plus -s 4 -t 128 -m <models> -f png`, then `python scripts/prepare-navbar-masters.py` and `node scripts/optimize-navbar-assets.mjs`. The oversized intermediate canopy is capped to 7680px before keeping the final masters; original assets remain available for rollback. See https://sharp.pixelplumbing.com/api-resize/ for Lanczos3 export behavior and https://github.com/visioncortex/vtracer for the contour conversion tool.
