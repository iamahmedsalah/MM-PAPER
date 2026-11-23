# CI Pipeline & Build Gates

## Standard Validation Chain

```powershell
npm ci
npm run verify
```

`npm run verify` runs `typecheck`, `lint`, `test` (`node --test tests/*.test.ts`), `next build`, and `test:smoke` (`node scripts/smoke-check.mjs`).

## GitHub Actions & Vercel Workflows

- `.github/workflows/ci.yml`: Automated validation, secret hygiene check, build, smoke test, and critical dependency audit.
- `.github/workflows/deploy-vercel.yml`: Validation gate followed by Vercel prebuilt deployment using `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.
- `vercel.json`: Next.js framework configuration (`npm ci` / `npm run build`).

## Next.js Build & Asset Expectations

- `next.config.ts` sets `transpilePackages: ['three']`, `poweredByHeader: false`, and strict HTTP headers.
- `next build` generates static HTML routes for `/en` and `/ar`, plus metadata routes `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`.
- `public/mm-logo-dark.svg`, `public/mm-logo-light.svg`, and `public/mm-3d-logo/*` are served verbatim from `public/`.
- Zero references to discontinued starter tooling or legacy bundler configs should remain in the repository.

## Supabase Migrations

- Inspect `supabase/migrations/*.sql` before modifying quote form fields; keep RLS policies non-destructive and backward-compatible.
