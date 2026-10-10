# SEO and visual-restoration baseline

Date: 10 October 2026. This is an implementation audit, not a ranking or traffic report.

## Confirmed state

| Check                       | Evidence                                                                                                                                                        | Impact                                                                | Responsible code                                                                              | Action / verification                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Production canonical origin | The production homepage returned 200 with one matching canonical                                                                                                | Prevents alternate-host canonical ambiguity                           | `src/data/seo.js`                                                                             | Retain; build and production-header checks                                                            |
| Crawlable public pages      | Production `/academics` returns route-specific pre-rendered HTML; an unknown path returns 404                                                                   | Important content is discoverable without waiting for client routing  | `scripts/prerender.mjs`, `vercel.json`                                                        | Retain; direct-route/no-JS checks                                                                     |
| Robots and sitemap          | Production `/robots.txt` and `/sitemap.xml` return 200; robots allows public pages and names the canonical sitemap                                              | Supports crawl discovery                                              | `scripts/prerender.mjs`                                                                       | Retain; validate generated files                                                                      |
| Metadata and schema         | Eight routes have unique titles/descriptions; rendered HTML contains canonical and one factual School/WebSite/WebPage graph                                     | Clearer page relevance without invented ratings, affiliation or hours | `src/data/seo.js`, `src/components/seo/Seo.jsx`                                               | Retain; static SEO test                                                                               |
| Contact consistency         | Verified phones, email and full address come from `src/data/school.js` and appear in rendered contact/footer/schema output                                      | Avoids conflicting parent contact paths                               | `src/data/school.js`                                                                          | Retain; link/config check                                                                             |
| Original navigation art     | Native source is `branch-house-original.png`, 2172 × 724; the detailed branch, treehouse, ropes, squirrel and monkey remain in the live page                    | Preserves brand recognition                                           | `src/components/layout/BranchNav.*`, `public/images/navigation/`                              | Do not replace/re-encode; animation/browser test                                                      |
| Gloss regression            | Active `.button-primary` and `.button-light` styles are flat navy/white rectangles, while historical CSS contains glossy highlights, gradients and shadow depth | CTAs no longer match the established colorful identity                | `src/index.css`                                                                               | Restore dimensional styling only; visual and interaction tests                                        |
| Lab performance             | Earlier local mobile Lighthouse recorded LCP 6.0 s and TBT 390 ms; Lighthouse identified the original branch PNG and building image as delivery costs           | Needs measured asset work, not removal of brand art                   | `public/images/navigation/branch-house-original.png`, `public/images/about-building-real.jpg` | Preserve current originals; record responsive-image follow-up until side-by-side asset QA is approved |

## Keyword-to-page map

This is a hypothesis-based map. No keyword-tool volumes, rankings or Google Search Console data are available.

| Route         | Parent intent                                         | Natural terms already supported                     |
| ------------- | ----------------------------------------------------- | --------------------------------------------------- |
| `/`           | Identify the school and stages served                 | Rainbow Digi School, Kandlakoya, Nursery to Grade V |
| `/academics`  | Understand Nursery, kindergarten and primary learning | Nursery, LKG, UKG, Grades I–V, primary learning     |
| `/admissions` | Start an admission conversation                       | admissions enquiry, Nursery to Grade V              |
| `/campus`     | Prepare for a school visit                            | campus visit, Kandlakoya                            |
| `/contact`    | Find or contact the school                            | Rainbow Digi School Kandlakoya, Hyderabad           |

Do not publish location-only pages for Kompally, Medchal or Hyderabad without real school-specific parent value and owner-approved facts.
