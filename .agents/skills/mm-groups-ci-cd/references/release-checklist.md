# Release Verification Checklist

- [ ] `npm install` / `npm ci` succeeded cleanly against `package-lock.json`.
- [ ] `npm run typecheck` (`next typegen && tsc --noEmit`) exited `0`.
- [ ] `npm run lint` (`eslint .`) exited `0`.
- [ ] `npm run build` (`next build`) exited `0` with `/en`, `/ar`, `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`.
- [ ] `next start` returned HTTP `200` for `/en`, `/ar`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and `/mm-logo-dark.svg`, with `/` redirecting to `/en`.
- [ ] `.env` and `.env*.local` are ignored in `.gitignore`; `.env.example` contains placeholder keys only.
