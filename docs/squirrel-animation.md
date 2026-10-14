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
the climb. Native sprite alpha bounds and the paw baseline account for transparent
padding. Entry draws the squirrel through a mask joining the approaching side
to the actual dark circular opening. The original rim and wall therefore occlude
the character, and its trailing tail is completely hidden at the end; no whole
sprite opacity fade or replacement background is used.

Exit uses the same measured opening with the squirrel facing outward, so its head
emerges before its tail. A short descent lands on the adjacent bark before the
existing per-tab branch run begins. A replacement click during a portal passage
changes the pending destination without flipping a partly hidden sprite. Closed
mobile drawer targets retain their measured position until the next run completes.

A single requestAnimationFrame controller owns the active movement. It schedules
no frames while idle or inside, pauses when the header leaves the viewport or
the document is hidden, and cleans up observers and listeners on unmount. There
are no automatic-trip timers or animation-completion navigation callbacks.
Reduced-motion users get a static squirrel and immediate state transitions.
The canvas is decorative, aria-hidden and cannot intercept pointer input.

Existing board, logo and monkey interactions move from the current pose. Board and logo links
navigate immediately, independently of the animation; modified link clicks keep
the browser's native behavior. The monkey invokes the same immediate route/highlight
action as the Home tab and independently starts the house interaction. The logo
retains its existing Home action. ResizeObserver keeps the canvas aligned to the
current picture source, including a resize during entry or exit.

Validation:

    npm run build
    npm run typecheck
    npm run dev -- --host 127.0.0.1 --port 4231
    node scripts/verify-squirrel-home.mjs
    node scripts/verify-squirrel-transitions.mjs

The Home check covers initial/refreshed hidden states, no automatic travel after
30 seconds, all six tab destinations, and immediate monkey Home content/highlight
with the animation clock frozen. It also checks one history entry per activation,
logo navigation, reversed/repeated clicks, keyboard activation and overflow at
320, 390, 430, 768, 1100, 1101 and 1440px, plus reduced motion at 390 and 1440px.

The transition check samples continuous positions and facing direction during
entry/exit, captures close-up frame sheets, interrupts entry with a mobile drawer
destination, changes responsive picture sources mid-transition, and changes the
reduced-motion preference while moving. Screenshots and JSON evidence are saved
under `artifacts/squirrel-home/` and `artifacts/squirrel-transitions/`.
Older squirrel scripts describe superseded automatic trips and routing behavior;
use these two checks for the current behavior.
