# Rainbow Digi School

Static, responsive public-website foundation for Rainbow Digi School. It deploys directly to Vercel—no ChatGPT Sites configuration is required.

## Deploy to Vercel

1. Push this folder to a GitHub, GitLab, or Bitbucket repository.
2. Import that repository in Vercel.
3. In **Build and Output Settings**, select **Other** and set the output directory to `dist` (this is also declared in `vercel.json`).
4. Deploy.

Or, using the Vercel CLI:

```bash
npx vercel
```

Use `npx vercel --prod` for a production deployment.

## Current scope

The site is a front-end foundation. The enquiry dialog deliberately does not submit or claim success until an authenticated backend and PostgreSQL CRM are implemented. Do not treat it as an admissions system yet.

## Project structure

```
dist/index.html  # site markup, styles, and browser interactions
vercel.json      # static-output deployment and security headers
```
