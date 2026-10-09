# Rainbow Digi School

React + Vite school website with a warm crayon/glossy theme: cream paper, golden accents, rounded type, glass panels, and a branch navbar with hanging wooden signs and an animated storybook monkey holding the school logo.

## Navbar

- Branch, ropes, signs and foliage share SVG coordinates. Rope anchors are sampled from the branch path.
- The monkey uses a damped pendulum, layered SVG shading, detailed hands and feet, and reduced-motion support.
- Navbar height follows the monkey's visible lower edge, keeping the hero close on desktop and mobile.
- Navigation labels are maintained in src/data/nav.js.
- Artwork and animation are in src/components/layout/BranchNavArt.jsx; geometry is in BranchNav.jsx; scoped styling is in BranchNav.css.

Replace with the school's original vector/high-res logo when available (SVG or PNG 1000px+).

## Development

Run npm install, then npm run dev. Run npm run build for production and npm run preview to inspect the built site.

## Deployment and data

The existing API, Prisma configuration and Vercel configuration are retained. Configure production credentials in the hosting environment; never commit .env files. Generated dist/ files are ignored and should be built by the deployment pipeline.

School content lives in src/data/school.js. Confirm the plot number with the school before changing the address. Use only approved photographs with parental consent and genuine supplied reviews.
