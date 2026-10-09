# Forest navigation verification

Scope: navigation artwork and mascot interactions. Hero, route content, and API code are unchanged.

## Implementation

- Replaced the old vector monkey with a transparent, reference-edited furry monkey/wooden-board asset. Hands and board remain in one image so their anatomical alignment cannot drift during resizing.
- Composited the existing `Logo` component on a cream inset. No generated logo text is used.
- Added textured branch foliage, twisted SVG ropes, inset wooden signs, treehouse background and separately clipped doorway foreground.
- Replaced the vector squirrel with reference-edited standing/running sprite poses at a smaller scale.
- Explicit states: `idle`, `runningToNavigation`, `runningToTreehouse`, `enteringTreehouse`, `insideTreehouse`.
- Monkey/board is one native keyboard-accessible button. Activating it does not navigate; a normal sign click interrupts entry and follows its original route.
- Targets use real DOM bounds, ResizeObserver and font readiness; the squirrel follows the branch's mapped top surface. Reduced motion places it at its destination immediately.
- Removed unused old monkey artwork and navigation metrics implementation. No new dependency added.

## Verification

Build with `npm run build`, start `npm run preview`, then run:

`node scripts/verify-forest-navigation.mjs http://localhost:4173`

Checks cover treehouse state progression, unchanged URL on mascot activation, keyboard activation, interrupted entry, every navigation route, landing within 1px of the measured sign center, one monkey/logo, desktop 1535px and 1024/768/390/320px layouts, overflow, containment, and reduced motion. Screenshots are saved under ignored `artifacts/forest-*.png`.

The pre-existing production `/api/events` 404 is recorded separately. The existing Contact email block also extends beyond a 320px viewport; the suite reports full-page overflow separately from navigation overflow. Navigation requires no API/environment configuration. Page exceptions and unrelated failed resources are test failures.

## Assets

See `navigation-assets.md` for source roles, editing prompts and encoding. These are reference-guided image edits, not an assertion of pixel-identical source extraction.
