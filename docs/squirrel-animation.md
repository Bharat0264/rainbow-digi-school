# Treehouse squirrel animation

`BranchNav` renders the existing transparent `squirrel-gait-v2.webp` atlas into
one 128 × 128 canvas. No header image, navigation styling, logo, monkey or other
art asset is changed. The supplied Gemini MP4 is a movement reference only; it
is not downloaded or played by the website.

The squirrel starts hidden inside the birdhouse on every load and refresh.
Automatic branch travel is disabled. Only one squirrel is drawn after a
navigation interaction. Native image coordinates describe the bark,
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

Existing board, logo and monkey interactions move from the current pose. Board and logo links
navigate immediately, independently of the animation; modified link clicks keep
the browser's native behavior. The monkey sends the squirrel into the house,
then invokes the same route/highlight action as the Home tab. A subsequent tab
click cancels that pending Home action. ResizeObserver keeps the canvas aligned to the current
picture source; mobile drawer targets retain their last measured position.

Validation:

    npm run build
    npm run typecheck
    npm run dev -- --host 127.0.0.1 --port 4231
    node scripts/verify-squirrel-home.mjs

The targeted check covers initial and refreshed hidden states, no automatic
travel after 30 seconds, Academics/Admissions/Contact branch destinations, monkey
completion followed by Home content and highlight, unchanged logo navigation,
superseding navigation, and an already-inside monkey click. It runs at 390px and
1440px with normal and reduced motion. Older squirrel scripts describe superseded
automatic trips and routing behavior; use this check for the current behavior.
