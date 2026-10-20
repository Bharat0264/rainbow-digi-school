# Branch bark detail refinement

The desktop and compact branch artwork now use a bark-only detail restoration from the built-in imagegen tool. Original source assets remain available. The export script selects warm wood pixels, excludes the house, and retains the original alpha and foliage. Layout, hole coordinates, rope hardware, navigation boards and squirrel behavior are unchanged.

Desktop exports are 2172 x 430 and 4344 x 860 (the latter is an upsample). Compact export remains 1536 x 1024. `scripts/prepare-detailed-branch.mjs <desktop-png> <mobile-png>` prepares the WebP assets, removing 146 rows of generated desktop padding before applying the bark selection.

Prompt: Precision detail restoration of the supplied existing website branch artwork. Preserve exact composition, all object positions and silhouettes, birdhouse and opening, leaf clusters, colors, lighting, and transparent background. Improve only bark texture quality: crisp finely carved wood grain, natural detailed warm brown bark with dimensional grooves and clean edges comparable to premium carved wooden navigation boards. No halos, blur, new objects, ropes, text, or rainbow. Mobile preserves its 1536 x 1024 frame and transparent padding.
