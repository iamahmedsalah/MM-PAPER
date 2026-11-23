# Full-Stack Definition of Done

- [ ] Zero references to discontinued starter or legacy build tools; `package.json` uses Next.js 16 scripts (`next dev`, `next build`, `next start`, `next typegen && tsc --noEmit`).
- [ ] `npm run typecheck` (`next typegen && tsc --noEmit`) passes with strict TypeScript (`0` errors).
- [ ] `npm run lint` passes with ESLint 9 + React Hooks (`0` errors).
- [ ] `npm run build` (`next build`) generates static `/en`, `/ar`, `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest` cleanly with zero hydration or SSR errors.
- [ ] Missing `.env` does not crash runtime; form degrades gracefully with direct contact fallback.
- [ ] `PaperModal` -> "Request a Quote" pre-selects that paper grade inside `ContactForm` and scrolls smoothly to `#contact`.
- [ ] Bilingual (`/en` & `/ar`) and dual themes (`dark` & `light`) stay synchronized across SSR `<html>` attributes and client contexts without FOUC or hydration mismatch.
