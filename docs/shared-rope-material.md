# Matching mobile and desktop ropes

Both responsive layouts now render the central hanging ropes through `NavigationRopes`. Their knot and hanging fiber samples come directly from `connected-logo-mascot.webp`, the same image used for the board's lower rope attachments. Native SVG viewport sampling and explicit clip paths isolate those small regions without editing or regenerating the artwork. This keeps hue, highlights, fibers and knot style identical across breakpoints.

The original compact house/branch image is used behind the mobile overlay so there are no competing baked-in rope colors. The generated connected compact image is retained as an unused original. Both knot bases sit on the house rail at zero angle and overlap the rope start. Anchor geometry remains fixed when navigation labels animate.

Verified shared textures, two central ropes, continuous rail anchors and stable tab-switch coordinates at 320, 390, 430 and 1440 pixels. The existing squirrel loop still uses the original compact art landmarks.
