# Rainbow Digi School

A premium, modern multi-page school website with a React + Vite frontend and a PostgreSQL-backed admissions enquiry API.

## Tech Stack
- **Frontend:** React, Vite, React Router, Tailwind CSS (v4), Framer Motion, Lenis (smooth scroll).
- **Backend (API):** Vercel Serverless Functions (`/api`), Node.js, Zod validation.
- **Database:** PostgreSQL (via Prisma ORM).

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` with your local or cloud PostgreSQL connection string. Ensure `ALLOWED_ORIGINS` includes `http://localhost:5173`.

3. **Database Migration:**
   Apply the database schema to your PostgreSQL database and generate the Prisma Client:
   ```bash
   npm run db:migrate
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The site will be running at `http://localhost:5173`. The Vercel CLI (if used via `vercel dev`) can also run the serverless functions locally.

## Deployment to Vercel

This repository is pre-configured for Vercel deployment.

1. Create a Vercel project and connect this GitHub repository.
2. Under **Environment Variables** in the Vercel dashboard, add:
   - `DATABASE_URL`: Your production PostgreSQL URL (e.g. from Neon, Supabase, or AWS RDS).
   - `ALLOWED_ORIGINS`: Your production domain (e.g. `https://rainbowdigischool.com`).
3. Deploy! Vercel will automatically run `npm run vercel-build`, generate the Prisma client, build the Vite frontend to `dist/`, and map `/api/*` to the serverless functions.
4. Run `npm run db:deploy` (or `npx prisma migrate deploy`) in a CI pipeline or locally against the production database to ensure schema migrations are applied.

## Design Highlights
- **Palette:** Warm ivory (#FFFDF6), golden yellow (#F6C945), and royal blue (#2B5BA8).
- **Typography:** Elegant serifs paired with clean sans-serif body text.
- **Animations:** Subtle parallax, hover reveals, and page transitions handled gracefully with Framer Motion.
