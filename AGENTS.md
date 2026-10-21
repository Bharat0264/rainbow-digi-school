Always commit and push to origin = https://github.com/Bharat0264/rainbow-digi-school. Never push to old-origin.

Review safety rules for every agent:
- Run git status before work; stop and show uncommitted changes. Never overwrite another agent's work.
- Fetch origin. On a clean main checkout, run git pull --rebase origin main before branching. Never rebase a published feature branch or rewrite shared history.
- Verify the production deployment commit before a production-preserving review; report any difference from main.
- Use a task branch and small commits prefixed chore/fix/perf/refactor/docs and tagged [Codex] or [Gemini]. Commit and push each completed task to origin only.
- Never force push, reset --hard a shared branch, rename production routes/env variables, or delete stored data. Stop for merge conflicts, unknown production provenance, found secrets or visible-behavior changes requiring a decision.
- Run lint, strict API typecheck, build, API tests, SEO checks and Playwright before merging. Review preview screenshots and performance against production. Do not merge when a gate fails.
