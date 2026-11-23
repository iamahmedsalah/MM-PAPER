# CI/CD & Vercel Deployment Guide — MM Paper Industry

## 1. Local Validation & Verification Commands

| Command | Purpose |
|---|---|
| `npm run typecheck` | Runs `next typegen && tsc --noEmit` |
| `npm run lint` | Runs ESLint across `src/` and `tests/` |
| `npm test` | Runs unit, validation, contact, social, and JSON-LD SEO tests (`node --test tests/*.test.ts`) |
| `npm run validate` | Runs `typecheck`, `lint`, and `test` together |
| `npm run build` | Builds the Next.js 16 production bundle |
| `npm run test:smoke` | Starts `next start` and verifies `/`, `/en`, `/ar`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and SVG logos |
| `npm run verify` | Full end-to-end gate (`validate` + `build` + `test:smoke`) |

---

## 2. Required GitHub Repository Secrets (for Vercel Deployment)

Add these secrets under **GitHub Repository → Settings → Secrets and variables → Actions → Secrets**:

| Secret Name | Where to Find It |
|---|---|
| `VERCEL_TOKEN` | Vercel Account Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | Vercel Team/Account Settings → General → Team ID (or `.vercel/project.json` after `vercel link`) |
| `VERCEL_PROJECT_ID` | Vercel Project Settings → General → Project ID (or `.vercel/project.json` after `vercel link`) |

### Optional Repository Variables / Secrets for Environment Configuration

Configure these in **Vercel Project Settings → Environment Variables** (and optionally as GitHub Actions `vars` / `secrets` for CI):
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://mmpaperindustry.com`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. GitHub Actions Workflows

- **`.github/workflows/ci.yml`**: Runs on pushes and PRs to `main` / `develop` (`npm ci`, secret hygiene check, `typecheck`, `lint`, `test`, `next build`, `test:smoke`, and critical `npm audit`).
- **`.github/workflows/deploy-vercel.yml`**: Runs validation & smoke tests first, then pulls Vercel config, builds prebuilt output, and deploys **Production** on pushes to `main` (or manual `workflow_dispatch`), and **Preview** on internal pull requests targeting `main`.
- **`.github/dependabot.yml`**: Automated weekly dependency PRs every Monday at `08:00` (`Africa/Cairo`) for `npm` (grouped into `nextjs-react`, `ui-and-3d`, and `dev-tooling`) and `github-actions`, each validated automatically by `ci.yml`.
