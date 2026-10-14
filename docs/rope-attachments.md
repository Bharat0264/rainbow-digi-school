# Layered rope attachment refinement

## Diagnosis and scope

The existing branch is a single RGBA illustration containing bark, birdhouse and
foliage. Its compact and wide versions have different bark profiles. The previous
compact trace put crowns partway down the trunk; the desktop parabola missed
local ridges. Fixed minimum rope sizes enlarged the mobile knots, while long
eyelet stems overlapped the branch hitch in short desktop hanging spans.

No branch, birdhouse, foliage, mascot, logo, route, label, page content or backend
asset was regenerated. Header dimensions and board sizes are unchanged.

## Implementation

- `NavigationRopes.jsx`: separate rear artwork (z=0), original branch (z=1),
  front crossed wraps and standing ropes (z=2), real HTML boards (z=5), and small
  wooden eyelets/tied ends over the upper board frame (z=6). Decorative layers
  cannot receive pointer events. Two authored variants avoid identical crossings.
- `ropeGeometry.js`: separate upper/lower bark landmarks traced in the original
  compact and desktop image coordinates. `BranchNav.jsx` maps them into the same
  measured nav coordinates as each actual board. ResizeObserver and image load
  events remeasure after viewport and picture-source changes.
- `NavigationRopes.jsx`: proportional strand, hitch, eyelet and shadow sizes;
  a rear turn visible above the bark; a short eyelet collar rather than a long
  overlapping stem. The front hitch fits the available branch-to-board span,
  leaving at least half a strand of standing rope between the two knots. When
  clearance is short, the hitch sits higher on the bark and the standing rope
  continues down its front face. Existing sprite artwork and texture are reused.
- `BranchNav.css` and all original image assets remain unchanged.
- Standing rope texture is reused. A short alpha crossfade joins the illustrated
  tail into the repeating material; no blur, sharpening or global image filters.

## Existing assets reused

All reside in `public/images/navigation/`, retain native 1536 x 1024 dimensions,
and have actual alpha transparency. Original generated PNGs are retained in the
image tool's generated-images folder, unchanged.

| Asset | Role | WebP bytes |
| --- | --- | ---: |
| `rope-lashings.webp` | Two rear-loop variants | 390334 |
| `rope-crossed-lashings.webp` | Two front lashing variants | 358058 |
| `rope-eyelets.webp` | Two wooden mounting-eyelet/knot variants | 295630 |

The built-in image tool made the artwork. `scripts/encode-rope-assets.mjs` only
exports web-delivery WebP at quality .96, retaining dimensions and alpha. The
three PNG sources total 5,605,278 bytes; the WebP assets total 1,044,022 bytes.
Each sprite sheet is fetched once and reused by SVG image references.

## Verification

- Production build and TypeScript checks.
- `verify-realistic-navigation.mjs`: 54 link clicks at 320, 390, 768, 1024, 1100,
  1101, 1366, 1440 and 2560px; keyboard Enter/Escape/focus, active routes, normal and
  reduced-motion squirrel behavior, aspect ratios, no horizontal overflow, maximum
  424px header, two ropes per visible board and all three attachment layers.
- `verify-rope-details.mjs`: per-rope screenshots at 320, 390, 430, 768, 1440 and
  2560px; nonoverlapping knots and exact frame attachment; separate stacking
  levels, decorative pointer-event safety, and responsive image source changes
  without reload. Contact sheets inspected individually.
- Screenshots: `artifacts/rope-attachments/` and `artifacts/realistic-navigation/`.
- No live enquiry was submitted; no database or environment changes were made.

## Image-generation prompts

Rear-turn source (initial oval candidate; only the rear layer is used):

> Use case: stylized-concept. Create a transparent game-asset SPRITE SHEET of TWO isolated golden beige hemp-rope lashings, side by side, on a 1536x1024 landscape canvas. Each is a CLOSED double-turn vertical oval rope loop, viewed at a slight three-quarter angle, designed to encircle a HORIZONTAL cylindrical tree branch that is NOT rendered. The hollow inside is transparent, as is all background. Two continuous turns of thick naturally twisted rope go over the top, down the front, under the bottom and behind the cylinder, with a compact tightly interwoven securing hitch at the lower end of the loop and a straight hanging rope tail exiting vertically downward. Absolutely NO open hooks, no free ends at the top, no wood, no tree, no sign, no metal. Left lashing centered x384; right lashing centered x1152. BOTH: oval loop extends from y80 to y710, width260px, each rope strand is 75px thick; small hitch at y690 to y830, tail ends at bottom edge y1024. Second lashing has slightly different tightened knot crossing and natural fiber variations, not a mirrored copy. Taut load-bearing construction, realistic braided fiber detail, compressed strands at crossings, warm top-left lighting, soft contact shadows ON rope only. Match richly illustrated polished 3D cartoon woodland navigation, not flat vector. Sharp clean transparent alpha, no glow or backdrop. Entire loop stays within its own half of canvas.

Final front-lashing source:

> Use case: stylized-concept. Isolated rope attachment overlay, not a full scene. 1536x1024 transparent sprite sheet with TWO DIFFERENT FRONT VIEWS OF A TIGHT CLOVE HITCH wrapped around an INVISIBLE horizontal wooden cylinder, positioned one per half of canvas. Rope is warm beige twisted hemp with realistic fine fibers, warm top-left lighting, rich 3D cartoon material. IMPORTANT TOPOLOGY: show the FRONT PORTION ONLY of the circumferential lashing: TWO close taut rope bands running almost vertically from y80 down to y650, one crosses diagonally OVER the other around y400, making a narrow compact X crossing. Their upper ends bend smoothly AWAY from camera over the cylinder and disappear to the BACK at y80, their lower ends turn around UNDER the cylinder at y650. A short secure half-hitch at y660-780 joins directly into one straight downward standing rope continuing to bottom edge. Actual cylinder is NOT visible; all space not occupied by rope has zero alpha. Each front lashing is ONLY about 210px wide, with two rope strands each 75px thick; NO large hollow oval, NO open C hook, NO noose, NO long gap between strands, NO free rope ends at top. Left centered x384, right centered x1152. The strands form a tight crossed band in front of the unseen wood, not a hanging loop or dangling ring. Slight natural differences between the two hitches. No wood, no foliage, no board, no metal, no text, no background glow or floor shadow. Crisp detailed transparent artwork for compositing over existing bark.

Board-eyelet source:

> Use case: stylized-concept. Transparent 1536x1024 game asset sprite sheet: TWO small rope-to-wooden-sign fastening assemblies, separate side by side centered x384 and x1152, consistent scale. Each has one taut thick golden-beige three-strand hemp rope entering vertically from the TOP EDGE at its exact center, then passes through a small polished reddish-golden wooden eyelet and is secured with a compact tight hitch. The eyelet is a tiny thick oval wooden collar, not a board or a metal ring. Eyelet and compact knot together occupy xcenter +/-140 and y420 to y750. Main rope width80 pixels. Show clearly which rope passes through the hole and which portion crosses in front. Short tucked rope end ends at y820, no long trailing tail. Fine natural fibers, twisted strands, compressed knot crossings, soft contact shadows on the wood and rope, warm top-left lighting. Left and right knots have subtle different crossing/fiber/wood-grain details, not mirror copies. Match premium realistic 3D cartoon woodland illustration. Keep both assemblies centered in their half of canvas, full transparent alpha outside objects and inside tiny eyelet holes, no backdrop or glow. No large signboard, no text, no branch, no characters, no hooks, no flat vector graphics.
