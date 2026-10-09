# Reference-guided navigation assets

Prepared using the built-in image editing tool, with transparent output enabled. No images are generated in the running application. User-supplied portrait is the monkey identity/pose source; wide navigation image is the scenery/squirrel source. The source references were embedded in the conversation, not present as separate files in the attachment folder.

Final files in `public/images/navigation/`:

| Asset | Dimensions | Bytes | Role |
|---|---:|---:|---|
| monkey-sign.webp | 720 × 1341 | 188748 | Full monkey and blank wooden board, original hand grip preserved as one cutout |
| treehouse.webp | 800 × 800 | 137700 | House, empty doorway and foliage; foreground repeated with a CSS doorway cutout |
| squirrel-poses.webp | 1200 × 600 | 147174 | Equal standing and running sprite cells |
| branch.webp | 2172 × 724 | 252658 | Textured branch and leaves |

All four files retain real alpha transparency (verified from decoded pixel data). WebP encoding at quality 0.91 used the browser encoder; no production image library added. `scripts/prepare-navigation-assets.mjs` records the local source output filenames and encoding procedure.

## Editing prompt set

1. **Monkey:** Background extraction from the tall portrait; wide navigation is supporting reference only. Extract only the exact monkey and wooden board together. Remove cream background, branch, upper ropes, house and leaves. Preserve face, soft brown fur, cream belly, pink ears, raised arms, both hands curling over the lower edge, bent legs, feet and curled tail. Remove all lettering/logo graphics from the board, leaving natural wood for the real HTML logo. Transparent alpha, full silhouette, no clipped feet/tail, no new character or stylization.
2. **Treehouse:** Extract the center house and attached foliage from the wide reference, not the monkey cutout. Preserve 3D children's illustration appearance, orange wood/planks, pitched shingled roof, dark arched entrance and round side window. Remove branch, squirrel, monkey, ropes, signs, text and background. Full transparent silhouette, tight square framing, empty visible entrance.
3. **Squirrel:** Extract the orange squirrel identity from the wide reference into two equal horizontal square cells. Left: source standing four-paw right-facing profile. Right: same character in an extended running stride, paws extended and tail trailing. Preserve fluffy fur, cream muzzle, glossy eyes, scale and colors. Full silhouettes, feet baseline near 85%, transparent background, no text/branch/scenery; do not simplify to vectors.
4. **Branch:** Extract only the continuous brown textured branch and naturally attached leaf clusters from the wide reference. Remove house, squirrel, ropes, boards, monkey, logos and background. Shallow curved branch across frame, bark scales, knots, amber top highlights, shaded underside, transparent alpha; no flat-vector replacement.

Image edits can introduce differences from the original artwork. These assets should be described as reference-guided prepared assets, not a lossless or pixel-identical extraction.
