# Squirrel entrance loop

The environment is unchanged: no treehouse, rainbow, leaf, rope, logo, lighting, background or camera assets were regenerated. The existing sharp 128px squirrel gait cells are animated on the existing transparent canvas. Native artwork landmarks define separate desktop/mobile bark paths, porch height and the real circular entrance. Only the squirrel is clipped during entry; a circular portal mask keeps the existing wall and rim in front of it.

The automatic loop lasts 5800ms and renders at 30fps: enter from outside the artwork, pause and look toward the house, run along the bark, slow near the porch, make a short hop to the sill, settle, enter head-first, disappear tail-last, pause inside. The offscreen restart and fully hidden final hold share identical background frames. Running paws stay on the traced bark. A soft contact shadow sits underneath grounded poses. Modest perspective scaling during entry preserves body proportions.

Navigation controls still respond immediately. A click during entry lets the squirrel finish passing the rim before it changes direction. After a click interaction it returns to the house and resumes the automatic loop. Offscreen/hidden pages pause animation; reduced-motion users get a still scene.

## Preview and validation

- `public/animations/treehouse-squirrel-loop.webm`: 1920 × 692 VP9, 5.80 seconds, 30fps. This is an optional standalone preview; the website uses the transparent canvas animation rather than playing the video as a replacement environment.
- `public/animations/treehouse-squirrel-loop-poster.png`: the unchanged environment frame.
- `node scripts/verify-squirrel-loop.mjs`: tests mobile and desktop surface contact, proportions, sequence, complete occlusion, click continuity and reduced motion.
- `node scripts/verify-squirrel-loop.mjs --export`: also renders all 174 preview frames and verifies that environment pixels before/after the loop are identical. Requires Python `imageio-ffmpeg` for encoding the preview, plus the existing Playwright installation.

Reference reviewed: the user-provided WhatsApp video (848 × 478, 15.165 seconds). Its camera and environment are used as visual guidance; the current website retains its existing environment pixels.
