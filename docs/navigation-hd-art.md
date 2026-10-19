# Navigation clarity restoration

Desktop branch and house restored using the built-in imagegen tool. Original assets are retained. Responsive WebP exports use 2172 × 430 and 4344 × 860 frames, preserving alpha. The 2x export is an upsample of the restored artwork, not a native 4K generation. Mobile retains its existing compact composition.

The generated image added 146 transparent rows above the source frame. `scripts/prepare-hd-branch.mjs <restored-png>` removes that padding and exports the two sizes at WebP quality 0.97. The browser chooses the appropriate image through srcSet.

## Restoration prompt

Edit target: supplied transparent branch-house-medium.webp. Restore high-definition clarity ONLY: sharpen fine bark grooves, leaf veins, wood grain, shingle roof edges, birdhouse planks. Preserve EXACT source composition, silhouette, positions, proportions, colors, branch shape, house size and location, every leaf cluster, and transparent padding. This is a precision resolution/clarity restoration for existing website UI with fixed rope coordinates. NO redesign, NO added or removed objects, NO ropes, no text, no background, no rainbow. Genuine transparent RGBA. Same ultra-wide 2172:430 aspect ratio and framing, preferably 4344x860 or largest high resolution retaining this aspect. Natural crisp detail without halos or oversaturation. Entire existing branch and house fully visible.
