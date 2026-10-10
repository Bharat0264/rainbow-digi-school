# Navigation squirrel animation

The navbar renders a single 128px canvas, displayed at 68px on desktop and 54px
on smaller screens. It samples one 128px cell from `squirrel-gait-v2.webp`.
The transparent atlas contains eight distinct poses: idle, four contact/passing
walk poses, extended run, gathered run, and landing. The character follows the
existing orange squirrel reference (`squirrel-featured.webp`); the old atlas is
no longer rendered.

The built-in image-generation tool created a transparent 4x2 atlas. The prompt
specified the existing character's orange fur, cream belly, fluffy tail, face,
consistent scale, right-facing profile, one character per cell, and these eight
poses. It required changing paw/leg articulation and counter-motion of the tail,
without labels or scenery. `scripts/prepare-squirrel-cycle.mjs` normalizes those
cells to a common foot baseline and encodes the production 1024x128 WebP atlas.

One requestAnimationFrame controller owns position, velocity, traveled distance,
facing direction and state: idle → walking/running → stopping → idle, or
enteringHouse → inside. Gait frames advance with ground distance rather than
an unrelated CSS timer. An incoming click cancels the scheduled callback and
continues from current position and velocity. The idle state schedules no frames.
Reduced motion jumps to the destination with an idle pose, or remains inside.

Navigation routes come from the existing NAV configuration. Both Apply and
Admissions retain `/admissions` and distinct navigation IDs. Modified link clicks
retain the browser's native behavior. Board routes change immediately while the
shared layout's squirrel finishes the trip. Logo navigation also initiates house
entry; the monkey initiates house entry without changing the route.

Ropes and foot contacts use the same normalized branch coordinates. Rope ends
are measured from the actual sign and logo rectangles. A ResizeObserver updates
the geometry and destination. House entry uses a foreground copy of the original
house artwork with a cutout corresponding to its real opening; the squirrel
passes behind this layer, then remains inside. This is not an opacity fade.

Run `npm run build`, start Vite preview, and then run:

    node scripts/verify-squirrel-cycle.mjs http://127.0.0.1:4210

The browser check covers all seven boards, both directions, multiple gait frames,
landing, interruption continuity, monkey and logo house entry, repeated entry,
re-emergence, viewport resizing, mobile menu clicks, and reduced motion. It saves
screenshots, an actual browser-rendered gait filmstrip and a JSON report under
`artifacts/squirrel-cycle/`. Console and HTTP errors are reported without hiding
the separate Events page's API fallback when the backend is unavailable.
