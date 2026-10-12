# Treehouse squirrel animation

`BranchNav` renders the existing transparent `squirrel-gait-v2.webp` atlas into
one 128 × 128 canvas. No header image, navigation styling, logo, monkey or other
art asset is changed. The supplied Gemini MP4 is a movement reference only; it
is not downloaded or played by the website.

The squirrel starts on the left branch, approaches the treehouse, climbs onto
the wooden sill, and enters the round opening. After six seconds inside, another
approach starts beyond the right edge of the artwork. Subsequent trips alternate
sides. Only one squirrel is drawn. Native image coordinates describe the bark,
sill and circular opening separately for the desktop and compact artwork.

The canvas scales with the displayed artwork. Four existing articulated leg/tail
poses advance with distance traveled, with a small running bounce and a tilt on
the climb. Entry draws the squirrel through a mask joining the approaching side
to the actual dark circular opening. The original rim and wall therefore occlude
the character, and its trailing tail is completely hidden at the end; no whole
sprite opacity fade or replacement background is used.

A single requestAnimationFrame controller owns the active movement. It schedules
no frames while idle or inside, pauses when the header leaves the viewport or
the document is hidden, and cleans up timers, observers and listeners on unmount.
Reduced-motion users get a static squirrel and immediate state transitions.
The canvas is decorative, aria-hidden and cannot intercept pointer input.

Existing board, logo and monkey interactions still work. A manual interaction
stops the automatic cycle and moves from the current pose. Board and logo links
navigate immediately, independently of the animation; modified link clicks keep
the browser's native behavior. The monkey sends the squirrel into the house
without navigating. ResizeObserver keeps the canvas aligned to the current
picture source; mobile drawer targets retain their last measured position.

Validation:

    npm run build
    npm run typecheck
    npm run dev -- --host 127.0.0.1 --port 4231
    node scripts/verify-squirrel-bidirectional.mjs http://127.0.0.1:4231

The targeted browser check covers both automatic approaches at 360, 768, 1100,
1101, 1440 and 2560px; articulated gait frames; branch contact; continuity;
complete disappearance; repeated controls; immediate navigation; resizing across
the artwork breakpoint; reduced motion; overflow; and browser exceptions.
It saves entrance filmstrips and a JSON report in
`artifacts/squirrel-bidirectional/`. Older squirrel scripts describe superseded
routing delays and controller states; use this check for the current behavior.
