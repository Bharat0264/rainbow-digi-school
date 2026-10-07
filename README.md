# Rainbow Digi School

Responsive public website with a validated Vercel Function for admission enquiries. It deploys directly to Vercel—no ChatGPT Sites configuration is required.

## Deploy to Vercel

1. Push this folder to a GitHub, GitLab, or Bitbucket repository.
2. Import that repository in Vercel.
3. Add `DATABASE_URL` and `ALLOWED_ORIGINS` from `.env.example` under **Project Settings → Environment Variables**.
4. Run `npm run db:deploy` against the target PostgreSQL database before accepting production enquiries.
5. Deploy.

Or, using the Vercel CLI:

```bash
npx vercel
```

Use `npx vercel --prod` for a production deployment.

## Database setup

The first migration creates the admissions enquiry table and CRM pipeline status. From a trusted machine with `DATABASE_URL` configured:

```bash
npm install
npm run db:deploy
```

For development migrations, use `npm run db:migrate`. The included database URL example is intentionally non-working. Keep PostgreSQL accessible only from trusted LAN/VPN hosts; never expose port `5432` to the public internet.

## Current scope

The public enquiry flow is implemented: it validates input server-side, captures UTM attribution, creates a uniquely numbered enquiry, and stores it in PostgreSQL. It requires the environment variables and migration above before it can accept live submissions.

The wider CRM, online applications, authentication, portals, attendance, finance, CMS, and notifications remain out of scope for this completed slice.

## Project structure

```
api/enquiries.ts                         # validated Vercel Function
prisma/schema.prisma                     # PostgreSQL data model
prisma/migrations/.../migration.sql      # deployable schema migration
dist/index.html                          # site markup, styles, and browser interactions
vercel.json                              # static-output deployment and security headers
```
