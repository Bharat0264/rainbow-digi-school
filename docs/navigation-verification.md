# Navigation implementation and verification

Scope: branch navigation only. Hero and route content are unchanged.

## Findings in the previous implementation

- A new navigation array on each render retriggered the target effect and reset arrival timers.
- Target positions were estimated offsets, rather than measured link centers.
- Apply and Admissions used the same path as their identity, selecting the wrong sign.
- Independent x/y springs introduced vertical lag; reduced motion still used those springs.
- Pendulums moved signs, and scrolling resized the monkey/header independently of travel.

## Replacement

- Stable link IDs stored in React Router location state; direct URLs still resolve by path.
- DOM-measured centers, ResizeObserver and font readiness, converted SVG branch coordinates.
- Velocity-preserving damped travel, geometric arrival detection, landing and idle phases.
- Transparent native SVG with separate standing and four-legged running poses, coordinated paws, tail and blink.
- Stationary signs and centered existing monkey; seven desktop links and mobile Menu/Apply.
- Reduced motion disables the character animations and immediately sets the destination.

## Reproducible checks

Run `npm run build`, start `npm run preview`, then:

`node scripts/verify-navigation.mjs http://localhost:4173`

The script tests every route, unique active highlight, actual arrival within 1px of the measured sign, leg articulation, interrupted travel, fixed monkey placement, continuous branch alignment, 1024/768/390/320px widths, duplicate mascot absence, overflow, and reduced motion. Screenshots go to ignored `artifacts/`.

`node scripts/inspect-nav-reference.mjs <video-path>` decodes the reference at 0/2/4/6/8 seconds. Range responses are necessary for real video seeking; the script logs the decoded timestamps.

The Events page logs its existing backend fallback when a local API is unavailable. The test reports these separately; it does not suppress unexpected console errors or page errors. No backend or environment settings were changed for navigation.

The character is an original SVG interpretation of the reference, not a pixel-identical rendering of the video artwork.
