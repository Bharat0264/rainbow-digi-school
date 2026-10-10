# Premium redesign baseline

Recorded 10 October 2026 against https://rainbow-digi-school.vercel.app before this redesign. Read-only browser navigation; no production form submissions.

## Browser observations

Playwright Chromium, 1440 × 900 and 390 × 900, reduced motion enabled. All seven public routes (`/`, `/about`, `/academics`, `/admissions`, `/campus`, `/events`, `/contact`) returned HTTP 200, rendered one H1, had no document horizontal overflow, and emitted no uncaught page errors.

Every route shared the same title and description, had no canonical link, and the description contained mojibake. Every route had an image with missing `src` in the footer (alt: Rainbow Digi School). Campus had four additional missing-source gallery images. Events requested `/api/events`, which returned 404. Six admissions controls and five contact controls had no programmatically associated labels.

Screenshots: `artifacts/premium-baseline-desktop.png` and `artifacts/premium-baseline-mobile.png`.

## Source defects

- Admissions simulated success without saving or sending an enquiry, linked a placeholder WhatsApp number, and displayed a placeholder admissions phone number.
- Academics read `stage.title` and `stage.grade` while content defined `stage` and `grades`; admissions reused the same mismatched fields.
- Campus read `img.url` while content defined `src: null`. Clickable image containers lacked button semantics and the lightbox did not manage focus.
- Contact offered grades 6–10 despite the stated Nursery–5 range, invented an email address, and used Mon–Sat hours inconsistent with the shared Mon–Fri data.
- About displayed a stock portrait as the principal and a stock school image as its building. Homepage gallery and academics similarly used stock imagery without distinguishing it from actual campus photography.
- Events displayed unsupported Facebook/YouTube links as `#!`, with no meaningful empty state.
- The unused Preloader component imposed an 850 ms timer; it was not mounted by the active app.

## Performance observations and limits

A fresh browser-context homepage resource transfer total was 1,761,681 bytes on both viewport runs. This is the browser Resource Timing sum, not total wire traffic: cross-origin timing restrictions may exclude bytes. Subsequent route figures are omitted because shared browser cache makes them non-comparable.

An independent, unthrottled desktop navigation reported LCP 888 ms and CLS 0 before interaction. These are single local lab observations, not Lighthouse scores, field Core Web Vitals, percentiles, or performance guarantees. Lighthouse was not installed; no score was fabricated. No real-user analytics access was available.

The entry JavaScript transferred 158,440 bytes (encoded body 158,140). The original branch PNG encoded body was 858,822 bytes, native 2172 × 724, rendered 1368 × 260 at 1440 px viewport. Its original artwork must remain intact per user direction; asset quality and payload tradeoffs should be evaluated visually rather than replacing it with flat vector artwork.

## Dependency audit

`npm audit --omit=dev --json` reported four high-severity findings through the Prisma configuration dependency chain (`prisma`, `@prisma/config`, `deepmerge-ts`, `effect`), zero critical findings. The audit suggested a Prisma downgrade; it was not applied automatically. Audit findings are dependency advisories, not evidence of an exploitable school endpoint. Recheck after dependency changes and assess compatibility before remediation.
