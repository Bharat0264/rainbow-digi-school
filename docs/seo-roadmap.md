# Search readiness and local opportunity

Research date: 10 October 2026. This is a qualitative search and primary-source review, not a rank-tracking or search-volume study. Results vary by location and personalisation. No ranking, traffic, conversion or field-performance gains have been measured yet.

## Confirmed starting defects

The original Vite app shipped an empty `#root`, one global title/description and no canonical URLs. Its HTML advertised an unsupported 4.9 rating and 31 reviews, an unverified telephone/street address and opening hours in School schema. The declared social image `/og-image.png` had no matching asset. There was no sitemap or robots file. A universal rewrite returned the app for unknown URLs, risking soft 404s. Eight intended routes now have a shared metadata source and build-generated HTML; the eighth is the new privacy page.

## Implemented technical decisions

- Retain Vite/React. Build the client bundle, then render the real route components with ReactDOMServer in Vite's server module environment. This is build-time prerendering, not a second maintained copy of page content.
- Deliver headings, page text and anchor links in initial HTML. Client React initializes the existing interactive navigation after load. The same HTML is sent to people and crawlers; no user-agent detection.
- Use route-specific titles, descriptions, canonical URLs, Open Graph and Twitter cards, with a checked-in 1200×630 social image. Client navigation updates the same metadata from the route map.
- Generate the sitemap and robots file during every production build. Exclude 404 and API endpoints. Avoid fabricated `lastmod` dates. Current canonical domain is the supplied production Vercel domain; change `SITE_URL` when an official custom domain is approved and implement redirects then.
- Emit a small School/WebSite/WebPage JSON-LD graph. Use the school contact configuration for the two phone numbers, email and Plot No. 61 address verified by the user during this implementation. Exclude ratings, reviews, exact geo coordinates, hours, founding dates and affiliation claims until verified. Do not assume the School type creates a Google rich result.
- Remove the universal SPA rewrite. Known routes have static `index.html` files; an actual unknown route is handled as a 404, with a custom 404 page and `noindex`. Direct-route HTTP status on Vercel still requires a post-deployment check.
- Apply no-sniff, frame-denial, referrer and feature-permission headers. Do not add a restrictive untested Content Security Policy that could break the existing app.

Google's [JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) explains rendering limitations, links, metadata and status handling. Its [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) supports keeping URL signals consistent. The [sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) explains submission and canonical URL inclusion. None promises indexing or ranking. Vercel's [configuration documentation](https://vercel.com/docs/project-configuration) is the hosting configuration reference.

## Observed local competitors and parent needs

Searches included `schools Kandlakoya nursery admissions school official`, `Kandlakoya schools official DRS international admissions`, and a focused T.I.M.E. Kandlakoya query. Search results included official schools and school directories; no reliable query volumes, Maps ranking positions, or backlink metrics were available.

| Primary-source site | Observed evidence | Useful opportunity for Rainbow |
| --- | --- | --- |
| [T.I.M.E. admissions](https://www.timeschools.com/admissions) | Campus-specific enquiry journey, age criteria, document guidance and downloadable forms; a Kandlakoya campus is identified. | Provide similarly clear answers once Rainbow approves its own age cutoffs, fees and documents. Keep the first enquiry short. Competitor requirements do not establish Rainbow's requirements. |
| [T.I.M.E. contact](https://timeschools.com/contact) | Campus selection, directions and multiple contact sections. | Maintain one verified contact source throughout the site. Do not copy competitor numbers or timings. |
| [Niraj International School](https://nirajinternationalschool.com/) | Separate academics, admissions, FAQs and disclosure links; named school leadership, facilities and event imagery. Its own [recognition document](https://nirajinternationalschool.com/wp-content/uploads/2023/09/Recognition-Certificate.pdf) places the school at Kandlakoya. | Build trust with permissioned school imagery and approved leadership and curriculum detail, rather than unsupported badges. Competitor claims have not been independently audited. |
| [DRS International contact](https://drsinternational.com/contact-us/) | Dedicated admission enquiry contact found in search. | Broader Hyderabad comparison only; not established here as a direct Kandlakoya catchment competitor. |

## Intent-to-page plan

| Parent need / research phrase | Existing destination | Priority and evidence needed |
| --- | --- | --- |
| School in Kandlakoya; primary school near Kandlakoya | `/` and `/about` | High business relevance: supported location and Nursery–V range. Avoid repeating every spelling or locality in headings. |
| Nursery admissions Kandlakoya; LKG/UKG enquiry | `/admissions` | High relevance; publish approved age eligibility, fee process, session dates and enquiry contact. Search volume unavailable. |
| Nursery to Grade V learning; curriculum | `/academics` | Explain advertised CBSE curriculum carefully. Formal CBSE affiliation is not established. Do not target an affiliation claim as fact. |
| Campus visit, classrooms, transport | `/campus` and `/contact` | Add real approved photos, verified access/directions and transport details only after confirmation. |
| School celebrations and community | `/events` | Publish dated, original school-approved stories, with child-image consent. Do not invent an events calendar. |

Do not create near-duplicate locality pages, generic AI articles or "best school" awards. Proposed editorial topics after fact approval: what to ask during a Nursery visit; how to prepare for a first school conversation; a school-authored example of learning through an activity. Each needs original school input, a clear audience and a maintained owner before a new route is justified.

## Owner-dependent next steps

1. The user confirmed both admissions phone numbers, email, the Plot No. 61 address and the school-building photograph during implementation. Still confirm an exact map pin, hours, curriculum/affiliation terminology, academic session availability, fees and eligibility. Approve any additional photographic rights and accurate staff biographies.
2. School owner reviews or claims the official Google Business Profile. Check name/address/phone consistency, accurate category, hours, school-approved photos and enquiry link. Do not create duplicates or insert keywords into the business name. Profile access and edits were not performed.
3. Verify the preferred domain in Search Console, submit `/sitemap.xml`, inspect sample route HTML/canonical/indexing and monitor real queries. No ownership verification or sitemap submission has been performed.
4. Enable an approved enquiry destination and measure genuine successful delivery. An analytics platform is not configured by this SEO work. Never send parent/child names, phone, email, message or form values as analytics dimensions.
5. Review indexing and qualified enquiries monthly. Use real evidence before changing title copy or adding content. No guaranteed position or growth estimate is made.

## Monthly reporting template

| Measure | Baseline / current / comparison | Source / notes |
| --- | --- | --- |
| Period and approved changes | Not yet recorded | Change log |
| Search impressions, clicks, CTR, position | Unavailable | Search Console access required; segment by relevant query/page/device |
| Indexed preferred URLs and canonical defects | Unavailable | Search Console and HTTP checks |
| Qualified organic enquiries, conversion rate | Unavailable | Approved analytics + successful server delivery, with attribution limitations |
| Form starts, errors, successful submissions | Unavailable | Aggregate events; no personal data |
| Top relevant / improving / declining queries | Unavailable | Compare equivalent periods, avoid judging tiny samples |
| Mobile LCP / INP / CLS at 75th percentile | Unavailable | CrUX/Search Console field data; lab scores are separate |
| Lab performance/accessibility measurements | See release QA report | Tool version, viewport, throttling and test date required |
| New original content and next action | Not yet recorded | One meaningful hypothesis at a time |

The targets are field LCP ≤2.5s, INP ≤200ms and CLS ≤0.1; these are targets, not current measured results. Revisit the approved content and technical checks after each release.
