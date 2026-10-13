# Tech guidelines
- Keep the existing stack unless it cannot run on Vercel; if it cannot, propose the smallest change and explain it in design.md.
- Prefer TypeScript, Tailwind CSS, and shadcn/ui for UI if the project is React/Next.js.
- Deployment target: Vercel (serverless-compatible API routes, no hardcoded localhost, no local file or SQLite storage in production).
- Validate all input on client and server. Never commit secrets; maintain `.env.example`.
- `build`, `lint`, and tests must pass before a task is marked done.
-never push to DonFan