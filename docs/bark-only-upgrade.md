# Bark-only navbar upgrade

Only the main wooden log texture changes. The leaves, rainbow, birdhouse, boards, rope wraps/eyelets, labels, logo/monkey assembly, squirrel, links, sizes, positions and animation logic are unchanged.

## Source and preservation

The log is baked into the existing canopy image. A byte-identical copy preserves the original scene underneath a bark-only transparent picture layer. This avoids recompressing or recoloring protected objects. The old 2172px combined filename is removed and its backing data renamed to `bark/branch-house-desktop-preserved.webp`; the existing 4344px and compact backings stay untouched. The backing still contains the old bark underneath the replacement and is still downloaded. **The 350 KiB budget below is for the replacement bark layer plus its precision matte, not for the unchanged combined backing or the complete navbar.**

No higher-resolution matching original was available. The existing matching desktop and mobile frames were each processed once with the official portable Real-ESRGAN `realesrgan-x4plus`, 4x, tile 128, offline. Only high-frequency luminance detail is blended into the bark; the original chroma and broad lighting are retained. Guard regions exclude foliage and the house. The cutout has a .5px source-space feather and a lossless alpha matte that prevents codec edge pixels spilling onto other objects. Original outer silhouettes remain untouched.

Final local bark masters: desktop 7680x1520; compact 6144x4096. These are upscaled restoration masters, not native 8K artwork. Missing original detail cannot be recovered exactly. The oversized 8688px desktop inference intermediate was discarded after capping the retained master. Masters, inputs, model tools and screenshots are not committed or served.

## Size comparison

Original combined images include the branch, foliage and birdhouse:

| Old combined image | Pixels | KiB |
|---|---|---:|
| desktop | 2172x430 | 908.5 |
| desktop-2x | 4344x860 | 861.2 |
| compact | 1536x1024 | 954.2 |

New desktop **bark-only** files; AVIF quality 60, WebP quality 85. Add the shared 47.0 KiB precision matte to the selected variant. The backing sizes above remain additional downloads, so these are not whole-navbar bandwidth savings.

| Width | Export pixels | AVIF KiB | WebP KiB |
|---:|---|---:|---:|
| 1600 | 1600x317 | 42.6 | 69.2 |
| 2400 | 2400x475 | 71.3 | 123.3 |
| 3200 | 3200x633 | 98.2 | 188.6 |
| 3600 | 3600x713 | 112.8 | 224.3 |
| 4800 | 4800x950 | 151.9 | 339.3 |
| 5400 | 5400x1069 | 170.3 | 399.1 |

At 1440px/DPR2 the browser chooses 3200w: about 145 KiB AVIF or 236 KiB WebP, including the matte. At the largest 1800 CSS-pixel scene/DPR2 it chooses the extra 3600w variant: about 160 KiB AVIF or 271 KiB WebP including matte. Both formats pass 350 KiB at 2x. The extra 5400w variant covers maximum-width 3x displays. At 390px phones, all three tested densities choose 1600w compact bark (44 KiB AVIF / 78 KiB WebP plus 36.7 KiB compact matte).

Lanczos3 downscaling, light unsharp settings sigma .5 / amounts .3, sRGB conversion, and stripped metadata are applied offline. The branch picture has AVIF/WebP srcsets, sizes, explicit frame dimensions, eager loading, high fetch priority and media-specific responsive preloads. No runtime upscaling library or model is bundled. PNG is used only for the exact alpha matte.

## Overlay and screenshot checks

- 1440x900 and 390x844 captures at DPR1, DPR2 and DPR3: replacement x/y/width/height deltas against the original frame are all **0px**.
- Existing branch, ropes, board and logo geometry is exactly identical before and after in all six captures.
- Native backing bytes are unchanged (SHA-256 comparison); the only moved backing is a 100% identical rename.
- Screenshot differences are confined to the guarded bark region: **0 changed pixels and 0 channel difference outside it** for all six captures. A small guard accommodates browser edge sampling. The exact alpha matte protects adjacent foliage and the house.
- 400% desktop and phone crops were inspected for grain, edge halos, color shifts and rope contact. The restoration is deliberately restrained to retain the original bark rather than inventing a new surface. No new halo or scene offset was found.
- The new layer uses local top/left 0px, no transform, and the original aspect ratio. Existing fractional container widths are retained because rounding the whole scene would move protected elements; the bark frame overlays that existing geometry exactly.

Screenshots: `C:/SCHOOL-rope-size/artifacts/bark-before-<width>-<dpr>.png`, `bark-after-<width>-<dpr>.png`, and `bark-400-<before|after>-<width>-<dpr>.png`. Geometry/pixel results are in `bark-before-geometry.json`, `bark-after-geometry.json`, `bark-pixel-alignment.json`, and `bark-screen-diff.json` in the same local artifacts folder.

## Lighthouse and validation

Production preview, default Lighthouse mobile simulated throttling. These are measured local lab runs, not a guarantee of public hosting performance.

| Metric | Before | After |
|---|---:|---:|
| Performance | 73 | 73 |
| LCP | 21.5539s | 21.8523s |
| Total blocking time | 36.0000ms | 52.0000ms |
| Page CLS | 0.0000 | 0.0003 |

The branch adds no flow box or anchor movement; the tiny overall-page CLS above is from the existing page. Existing large label/scene images and other page assets were intentionally left unchanged. The test does not claim a page-speed improvement: the restored bark is an additional small layer over the preserved scene.

Passed: build/prerender, typecheck, the bark overlay/DPR/budget verifier, and the existing squirrel portal/navigation verifier. The latter confirms both approach directions, tail masking, initial indoor state, all six tabs, and mobile indoor behavior.

## Changed files

- `.gitignore`: excludes `design-masters/`.
- `index.html`: responsive bark preload only.
- `src/components/layout/BranchNav.jsx`: adds the bark-only picture and renames the preserved 1x backing reference.
- `src/components/layout/BranchNav.css`: positions/masks the bark layer only.
- `public/images/navigation/branch-house-detailed.webp` -> `public/images/navigation/bark/branch-house-desktop-preserved.webp`: byte-identical backing rename.
- `public/images/navigation/bark/`: desktop/compact AVIF and WebP bark variants plus two alpha mattes.
- `scripts/prepare-bark-only.py`, `export-bark-only.mjs`: offline mask/detail and export scripts; require local inference outputs and ignored sharp tooling.
- `scripts/verify-bark-only.mjs`: frame alignment and 2x budget checks.
- `docs/bark-only-upgrade.md`, `docs/bark-only-variants.json`: this report and pixel/file-size metadata.

Local masters: **`C:/SCHOOL-rope-size/design-masters/bark-only/`**. The model executable and weights are under ignored `artifacts/tooling/realesrgan/`. Inference command: `realesrgan-ncnn-vulkan.exe -i design-masters/bark-only/input -o design-masters/bark-only -n realesrgan-x4plus -s 4 -t 128 -g 1 -m artifacts/tooling/realesrgan/models -f png`. Official tool: https://github.com/xinntao/Real-ESRGAN. Export uses sharp: https://sharp.pixelplumbing.com/api-resize/.
