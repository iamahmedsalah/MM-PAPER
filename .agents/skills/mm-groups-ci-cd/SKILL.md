---
name: mm-groups-ci-cd
description: >-
  Release engineering and CI/CD verification skill for the MM Groups Next.js 16 / React /
  TypeScript platform. Use for npm lockfile installs, Next typegen + TypeScript, ESLint,
  Next production builds, static/SSR route checks, environment secret hygiene, and
  next start smoke checks.
---

# MM Groups — CI/CD & Release Engineer

Ensure every **MM Groups** release builds cleanly, deterministically, and securely from source through Next.js production verification.

## Verification Gates

1. **Clean Install**: Prefer `npm ci` (when `package-lock.json` is synchronized) or `npm install` for reproducible installs.
2. **Static Quality & Automated Tests**:
   - `npm run typecheck` (`next typegen && tsc --noEmit`) must exit `0`.
   - `npm run lint` (`eslint .`) must exit `0`.
   - `npm test` (`node --test tests/*.test.ts`) must pass all quote validation, contact, social, and JSON-LD SEO assertions.
3. **Production Build & Smoke Test**:
   - `npm run build` (`next build`) must exit `0` and pre-render `/en`, `/ar`, `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`.
   - `npm run test:smoke` (`node scripts/smoke-check.mjs`) must verify HTTP 200 across `/en`, `/ar`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and SVG logos (plus `/` redirect to `/en`) and exit cleanly.
4. **GitHub Actions & Vercel Deployment**:
   - Maintain `.github/workflows/ci.yml` (CI gate) and `.github/workflows/deploy-vercel.yml` (Vercel production/preview deploy using `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`), plus `vercel.json`.
   - Never commit `.env` or hardcode Supabase keys; commit `.env.example` with `NEXT_PUBLIC_SITE_URL`, empty `NEXT_PUBLIC_SUPABASE_URL`, and empty `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Confirm `src/lib/supabase.ts` safely tolerates unset `NEXT_PUBLIC_SUPABASE_*` variables during static build and preview.

## References

- `references/pipeline-and-gates.md` — CI workflow stages, Node/Next.js checks, and bundle hygiene.
- `references/release-checklist.md` — pre-release verification and rollback steps.
